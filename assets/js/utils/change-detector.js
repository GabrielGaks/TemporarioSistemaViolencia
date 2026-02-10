/**
 * ========================================
 * CHANGE DETECTOR - Detecção de Mudanças
 * ========================================
 * Polling periódico para verificar mudanças na planilha
 * ========================================
 */

(function() {
  'use strict';

  let pollingInterval = null;
  let isRunning = false;
  let changeCallbacks = [];
  let lastCheckTime = null;
  let isPageVisible = true;
  let lastDetectedNotificationIds = []; // Armazena IDs das últimas notificações detectadas

  // Configurações padrão
  const defaultConfig = {
    interval: 45000, // 45 segundos
    enabled: true,
    pauseWhenHidden: true
  };

  let config = { ...defaultConfig };

  /**
   * Verifica se a página está visível
   */
  function checkPageVisibility() {
    if (typeof document !== 'undefined') {
      isPageVisible = !document.hidden;
    }
    return isPageVisible;
  }

  /**
   * Obtém configuração do CONFIG global ou usa padrão
   */
  function getConfig() {
    if (typeof window !== 'undefined' && window.CONFIG) {
      return {
        interval: window.CONFIG.POLLING_INTERVAL || defaultConfig.interval,
        enabled: window.CONFIG.CACHE_ENABLED !== false,
        pauseWhenHidden: true
      };
    }
    return defaultConfig;
  }

  /**
   * Verifica mudanças comparando hash dos dados
   * @param {string} cacheKey - Chave do cache
   * @param {Function} fetchFunction - Função para buscar dados atualizados
   * @returns {Promise<boolean>} True se houve mudanças
   */
  async function checkForChangesInCache(cacheKey, fetchFunction) {
    try {
      if (!window.DataCache) {
        console.warn('[ChangeDetector] DataCache não disponível');
        return false;
      }

      // Obtém timestamp e hash atual do cache
      const cachedHash = window.DataCache.getHash(cacheKey);
      const cachedTimestamp = window.DataCache.getLastUpdate(cacheKey);
      
      if (!cachedHash || !cachedTimestamp) {
        // Não há cache válido, não há mudanças para detectar
        return false;
      }

      // Busca dados atualizados (sem salvar no cache ainda)
      const updatedData = await fetchFunction();
      
      if (!updatedData) {
        return false;
      }

      // Gera hash dos novos dados
      const newHash = window.DataCache.generateHash ? 
        window.DataCache.generateHash(updatedData) : 
        generateHash(updatedData);

      // Compara hashes - apenas retorna true se realmente diferente
      if (newHash !== cachedHash) {
        // Verifica se realmente há diferença significativa
        // (evita falsos positivos por diferenças de ordenação ou formatação)
        const cachedData = window.DataCache.get(cacheKey);
        
        if (cachedData) {
          // Compara contagem de registros primeiro (mais rápido)
          const cachedCount = Array.isArray(cachedData) ? cachedData.length : 
                             (cachedData.grupos ? Object.keys(cachedData.grupos).length : 0);
          const newCount = Array.isArray(updatedData) ? updatedData.length : 
                          (updatedData.grupos ? Object.keys(updatedData.grupos).length : 0);
          
          if (cachedCount !== newCount) {
            console.log('[ChangeDetector] Mudanças detectadas! Contagem diferente:', {
              cached: cachedCount,
              novo: newCount
            });
            return true;
          }
          
          // Se contagem é igual, compara hash (pode ser diferença de conteúdo)
          console.log('[ChangeDetector] Mudanças detectadas! Hash diferente:', {
            cached: cachedHash,
            novo: newHash
          });
          return true;
        } else {
          // Se não consegue comparar, confia no hash
          console.log('[ChangeDetector] Mudanças detectadas! Hash diferente:', {
            cached: cachedHash,
            novo: newHash
          });
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('[ChangeDetector] Erro ao verificar mudanças:', error);
      return false;
    }
  }

  /**
   * Gera hash simples dos dados
   */
  function generateHash(data) {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Verifica mudanças usando endpoint leve (se disponível)
   * @param {string} url - URL do endpoint
   * @param {string} cacheKey - Chave do cache
   * @returns {Promise<{hasChanges: boolean, notificationIds: Array}>} Objeto com hasChanges e IDs
   */
  async function checkForChangesLightweight(url, cacheKey) {
    try {
      // Tenta usar endpoint leve que retorna apenas metadados
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'data=' + encodeURIComponent(JSON.stringify({
          action: 'checkUpdates'
        })),
        signal: AbortSignal.timeout(10000) // Timeout de 10 segundos
      });

      if (!response.ok) {
        return { hasChanges: false, notificationIds: [] };
      }

      const result = await response.json();
      let detectedNotificationIds = [];
      
      if (result.success) {
        // NOVO: Usa a mesma lógica que funcionou no teste manual
        // Prioriza lastConfirmedChange (mudança confirmada pelo trigger) sobre lastModified
        // Isso elimina falsos positivos porque só detecta mudanças quando o trigger realmente confirma
        const changeTimestamp = result.lastConfirmedChange || result.lastModified;
        const changeSource = result.lastConfirmedChange ? 'trigger confirmado' : 'timestamp planilha';
        
        // Obtém valores atuais do servidor
        const serverHash = result.hash;
        const serverTotalRecords = result.totalRecordsAll;
        const recentIds = result.recentNotificationIds || [];
        
        // Obtém valores do cache
        const cachedChangeTimestamp = window.DataCache ? window.DataCache.getServerLastModified(cacheKey) : null;
        const cachedHash = window.DataCache ? window.DataCache.getHash(cacheKey) : null;
        const cachedData = window.DataCache ? window.DataCache.get(cacheKey) : null;
        const cachedTotalRecords = cachedData ? (Array.isArray(cachedData) ? cachedData.length : 
          (cachedData.grupos ? Object.keys(cachedData.grupos).length : null)) : null;
        
        // MÉTODO 1: Compara timestamp (mais confiável - mesma lógica do teste manual)
        if (changeTimestamp && cachedChangeTimestamp) {
          const cachedDate = new Date(cachedChangeTimestamp);
          const serverDate = new Date(changeTimestamp);
          
          // Compara timestamps (com margem de 2 segundos para diferenças de timezone/arredondamento)
          // Se o servidor tem um timestamp mais recente, há mudanças CONFIRMADAS
          if (serverDate.getTime() > cachedDate.getTime() + 2000) {
            console.log('🔔 [ChangeDetector] Mudanças detectadas via ' + changeSource + ':', {
              cached: cachedDate.toISOString(),
              server: serverDate.toISOString(),
              diferenca: (serverDate.getTime() - cachedDate.getTime()) / 1000 + ' segundos',
              novasNotificacoes: recentIds.length > 0 ? recentIds : 'Nenhuma ID disponível',
              linhaModificada: result.lastConfirmedRow || 'N/A',
              fonte: changeSource
            });
            
            // Log destacado com IDs das novas notificações
            if (recentIds.length > 0) {
              console.log('📋 IDs das notificações mais recentes:', recentIds.join(', '));
              console.log('🆕 Nova(s) notificação(ões) detectada(s) - ID(s):', recentIds[0] + (recentIds.length > 1 ? ' (+' + (recentIds.length - 1) + ' outras)' : ''));
            } else {
              console.log('⚠️ Mudanças detectadas mas IDs de notificações não disponíveis');
            }
            
            // Atualiza cache com novos valores
            if (window.DataCache && cachedData) {
              const expiry = window.CONFIG ? (window.CONFIG.CACHE_EXPIRY || 3600000) : 3600000;
              window.DataCache.set(cacheKey, cachedData, { 
                expiry: expiry,
                serverLastModified: changeTimestamp
              });
            }
            
            return { hasChanges: true, notificationIds: recentIds };
          }
          
          // Se os timestamps são iguais ou muito próximos, não há mudanças
          // Atualiza o timestamp no cache para manter sincronizado
          if (window.DataCache && changeTimestamp && cachedData) {
            const expiry = window.CONFIG ? (window.CONFIG.CACHE_EXPIRY || 3600000) : 3600000;
            window.DataCache.set(cacheKey, cachedData, { 
              expiry: expiry,
              serverLastModified: changeTimestamp
            });
          }
          
          console.log('[ChangeDetector] Sem mudanças - timestamps iguais ou próximos:', {
            cached: cachedDate.toISOString(),
            server: serverDate.toISOString()
          });
          return { hasChanges: false, notificationIds: [] };
        }
        
        // MÉTODO 2: Se não há timestamp no cache, salva o atual e verifica hash/totalRecords
        if (changeTimestamp && !cachedChangeTimestamp) {
          // Salva timestamp pela primeira vez
          if (window.DataCache && cachedData) {
            const expiry = window.CONFIG ? (window.CONFIG.CACHE_EXPIRY || 3600000) : 3600000;
            window.DataCache.set(cacheKey, cachedData, { 
              expiry: expiry,
              serverLastModified: changeTimestamp
            });
            console.log('[ChangeDetector] Timestamp salvo no cache pela primeira vez (' + changeSource + ')');
          }
          // Não detecta mudanças na primeira vez (sem comparação possível)
          return { hasChanges: false, notificationIds: [] };
        }
        
        // MÉTODO 3: Fallback - Compara hash E totalRecords (mesma lógica do teste manual)
        if (serverHash && serverTotalRecords !== undefined) {
          const hashMudou = cachedHash && serverHash !== cachedHash;
          const totalRecordsMudou = cachedTotalRecords !== null && serverTotalRecords !== cachedTotalRecords;
          
          // Só detecta mudança se hash E totalRecords mudaram (evita falsos positivos)
          if (hashMudou && totalRecordsMudou) {
            console.log('🔔 [ChangeDetector] Mudanças detectadas via hash E contagem:', {
              hash: { cached: cachedHash, server: serverHash },
              count: { cached: cachedTotalRecords, server: serverTotalRecords },
              novasNotificacoes: recentIds.length > 0 ? recentIds : 'Nenhuma ID disponível'
            });
            
            if (recentIds.length > 0) {
              console.log('📋 IDs das notificações mais recentes:', recentIds.join(', '));
              console.log('🆕 Nova(s) notificação(ões) detectada(s) - ID(s):', recentIds[0] + (recentIds.length > 1 ? ' (+' + (recentIds.length - 1) + ' outras)' : ''));
            }
            
            // Atualiza cache
            if (window.DataCache && cachedData && changeTimestamp) {
              const expiry = window.CONFIG ? (window.CONFIG.CACHE_EXPIRY || 3600000) : 3600000;
              window.DataCache.set(cacheKey, cachedData, { 
                expiry: expiry,
                serverLastModified: changeTimestamp
              });
            }
            
            return { hasChanges: true, notificationIds: recentIds };
          } else if (hashMudou && !totalRecordsMudou) {
            // Hash mudou mas contagem não - provavelmente falso positivo
            console.log('[ChangeDetector] Hash diferente mas contagem igual - ignorando (possível falso positivo):', {
              hash: { cached: cachedHash, server: serverHash },
              count: { cached: cachedTotalRecords, server: serverTotalRecords }
            });
            return { hasChanges: false, notificationIds: [] };
          }
        }
        
        // Fallback: usa hash se disponível (apenas se não há lastModified para comparar)
        if (result.hash && !result.lastModified) {
          const cachedHash = window.DataCache ? window.DataCache.getHash(cacheKey) : null;
          
            if (cachedHash && result.hash !== cachedHash) {
              // Verifica se realmente há diferença significativa
              // Se o hash mudou mas não há lastModified, pode ser falso positivo
              // Então verifica também a contagem
              const cachedData = window.DataCache ? window.DataCache.get(cacheKey) : null;
              if (cachedData && result.totalRecords !== undefined) {
                const cachedCount = Array.isArray(cachedData) ? cachedData.length : 
                                 (cachedData.grupos ? Object.keys(cachedData.grupos).length : 0);
                
                // Só detecta mudança se hash E contagem mudaram
                if (result.totalRecords !== cachedCount) {
                  const recentIds = result.recentNotificationIds || [];
                  console.log('🔔 [ChangeDetector] Mudanças detectadas via hash E contagem:', {
                    hash: { cached: cachedHash, server: result.hash },
                    count: { cached: cachedCount, server: result.totalRecords },
                    novasNotificacoes: recentIds.length > 0 ? recentIds : 'Nenhuma ID disponível'
                  });
                  
              if (recentIds.length > 0) {
                console.log('📋 IDs das notificações mais recentes:', recentIds.join(', '));
                console.log('🆕 Nova(s) notificação(ões) detectada(s) - ID(s):', recentIds[0] + (recentIds.length > 1 ? ' (+' + (recentIds.length - 1) + ' outras)' : ''));
                detectedNotificationIds = recentIds;
              }
              
              return { hasChanges: true, notificationIds: detectedNotificationIds };
                } else {
                  // Hash mudou mas contagem não - provavelmente falso positivo
                  console.log('[ChangeDetector] Hash diferente mas contagem igual - ignorando (possível falso positivo):', {
                    hash: { cached: cachedHash, server: result.hash },
                    count: { cached: cachedCount, server: result.totalRecords }
                  });
                  return { hasChanges: false, notificationIds: [] };
                }
              } else {
                // Se não consegue verificar contagem, confia no hash
                const recentIds = result.recentNotificationIds || [];
                console.log('🔔 [ChangeDetector] Mudanças detectadas via hash (sem validação de contagem):', {
                  novasNotificacoes: recentIds.length > 0 ? recentIds : 'Nenhuma ID disponível'
                });
                if (recentIds.length > 0) {
                  console.log('📋 IDs das notificações mais recentes:', recentIds.join(', '));
                  detectedNotificationIds = recentIds;
                }
                return { hasChanges: true, notificationIds: detectedNotificationIds };
              }
            }
        }
        
        // Fallback: usa contador de registros (apenas se não há lastModified)
        if (result.totalRecords !== undefined && !result.lastModified) {
          const cachedData = window.DataCache ? window.DataCache.get(cacheKey) : null;
          if (cachedData) {
            const cachedCount = Array.isArray(cachedData) ? cachedData.length : 
                               (cachedData.grupos ? Object.keys(cachedData.grupos).length : 0);
            
            if (result.totalRecords !== cachedCount) {
              const recentIds = result.recentNotificationIds || [];
              console.log('🔔 [ChangeDetector] Mudanças detectadas via contador:', {
                cached: cachedCount,
                server: result.totalRecords,
                novasNotificacoes: recentIds.length > 0 ? recentIds : 'Nenhuma ID disponível'
              });
              
              if (recentIds.length > 0) {
                console.log('📋 IDs das notificações mais recentes:', recentIds.join(', '));
                console.log('🆕 Nova(s) notificação(ões) detectada(s) - ID(s):', recentIds[0] + (recentIds.length > 1 ? ' (+' + (recentIds.length - 1) + ' outras)' : ''));
                detectedNotificationIds = recentIds;
              }
              
              return { hasChanges: true, notificationIds: detectedNotificationIds };
            } else {
              console.log('[ChangeDetector] Sem mudanças - contagem igual:', {
                cached: cachedCount,
                server: result.totalRecords
              });
            }
          }
        }
        
        // Se chegou aqui e não detectou mudanças, log para debug
        console.log('[ChangeDetector] Nenhuma mudança detectada após todas as verificações');
      }

      return { hasChanges: false, notificationIds: [] };
    } catch (error) {
      // Se endpoint leve não estiver disponível, retorna false
      // O sistema tentará método alternativo
      if (error.name !== 'AbortError') {
        console.warn('[ChangeDetector] Endpoint leve não disponível, usando método alternativo');
      }
      return { hasChanges: false, notificationIds: [] };
    }
  }

  const ChangeDetector = {
    /**
     * Inicia detecção periódica
     * @param {Object} options - Opções de configuração
     */
    start: function(options = {}) {
      if (isRunning) {
        console.warn('[ChangeDetector] Já está rodando');
        return;
      }

      config = { ...getConfig(), ...options };

      if (!config.enabled) {
        console.log('[ChangeDetector] Desabilitado na configuração');
        return;
      }

      isRunning = true;
      lastCheckTime = Date.now();

      // Listener para visibilidade da página
      if (config.pauseWhenHidden && typeof document !== 'undefined') {
        document.addEventListener('visibilitychange', () => {
          checkPageVisibility();
          if (!isPageVisible && pollingInterval) {
            console.log('[ChangeDetector] Página oculta, pausando polling');
          } else if (isPageVisible && isRunning && !pollingInterval) {
            console.log('[ChangeDetector] Página visível, retomando polling');
            this.start(config);
          }
        });
      }

      // Inicia polling
      // Se não há cacheKey/URL configurados, apenas inicia o sistema
      // As páginas específicas devem chamar checkForChanges com seus parâmetros
      if (changeCallbacks.length > 0) {
        this.checkForChanges();
        pollingInterval = setInterval(() => {
          if (isPageVisible || !config.pauseWhenHidden) {
            this.checkForChanges();
          }
        }, config.interval);
      } else {
        // Se não há callbacks, ainda inicia o intervalo mas não faz verificação automática
        // As páginas devem chamar checkForChanges manualmente com seus parâmetros
        console.log('[ChangeDetector] Iniciado sem callbacks - páginas devem chamar checkForChanges manualmente');
      }

      console.log('[ChangeDetector] Iniciado com intervalo de', config.interval, 'ms');
    },

    /**
     * Para detecção
     */
    stop: function() {
      if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
      }
      isRunning = false;
      console.log('[ChangeDetector] Parado');
    },

    /**
     * Verifica mudanças uma vez
     * @param {string} cacheKey - Chave do cache
     * @param {Function|string} fetchFunctionOrUrl - Função para buscar dados ou URL do endpoint
     * @returns {Promise<boolean>} True se houve mudanças
     */
    checkForChanges: async function(cacheKey, fetchFunctionOrUrl) {
      if (!isPageVisible && config.pauseWhenHidden) {
        return false;
      }

      // Bloqueio global: se uma atualização foi iniciada explicitamente
      // pelo usuário via popup azul, não dispara novos alertas nem toasts
      try {
        if (typeof window !== 'undefined' && (window.atualizacaoDisparadaPeloUsuario || window.atualizacaoIniciadaViaPopup)) {
          console.log('[ChangeDetector] 🚫 Verificação suprimida: atualização já iniciada via popup azul pelo usuário.');
          return false;
        }
      } catch (e) {
        console.warn('[ChangeDetector] Aviso ao verificar flag global de atualização:', e);
      }

      try {
        let hasChanges = false;
        let notificationIds = [];

        // Se forneceu cacheKey e fetchFunctionOrUrl, verifica mudanças
        if (cacheKey && fetchFunctionOrUrl) {
          if (typeof fetchFunctionOrUrl === 'string') {
            // É uma URL, tenta endpoint leve primeiro
            const result = await checkForChangesLightweight(fetchFunctionOrUrl, cacheKey);
            hasChanges = result.hasChanges;
            notificationIds = result.notificationIds || [];
            
            // Se endpoint leve não funcionou, não faz nada (evita requisição pesada)
            // O usuário pode forçar atualização manualmente
          } else if (typeof fetchFunctionOrUrl === 'function') {
            // É uma função, usa método de comparação de hash
            const hashResult = await checkForChangesInCache(cacheKey, fetchFunctionOrUrl);
            hasChanges = hashResult === true; // checkForChangesInCache retorna boolean
            // Para método de hash, não temos IDs disponíveis
            notificationIds = [];
          }
        } else {
          // Verifica mudanças em todos os caches registrados
          // Por padrão, verifica apenas se há callbacks registrados
          if (changeCallbacks.length > 0) {
            // Executa callbacks que podem verificar suas próprias mudanças
            for (const callback of changeCallbacks) {
              try {
                const result = await callback();
                if (result === true) {
                  hasChanges = true;
                  break;
                }
              } catch (error) {
                console.error('[ChangeDetector] Erro em callback:', error);
              }
            }
          }
        }

        lastCheckTime = Date.now();

        if (hasChanges) {
          // Armazena IDs para uso no notifyChange
          lastDetectedNotificationIds = notificationIds;
          this.notifyChange(notificationIds);
        }

        return hasChanges;
      } catch (error) {
        console.error('[ChangeDetector] Erro ao verificar mudanças:', error);
        return false;
      }
    },

    /**
     * Registra callback para quando houver mudanças
     * @param {Function} callback - Função callback
     */
    onChange: function(callback) {
      if (typeof callback === 'function') {
        changeCallbacks.push(callback);
      }
    },

    /**
     * Remove callback
     * @param {Function} callback - Função callback a remover
     */
    removeCallback: function(callback) {
      const index = changeCallbacks.indexOf(callback);
      if (index > -1) {
        changeCallbacks.splice(index, 1);
      }
    },

    /**
     * Notifica todos os listeners sobre mudanças
     * @param {Array} notificationIds - IDs das notificações detectadas
     */
    notifyChange: function(notificationIds = []) {
      const ids = notificationIds.length > 0 ? notificationIds : lastDetectedNotificationIds;
      
      console.log('[ChangeDetector] Mudanças detectadas, notificando listeners...');
      
      if (ids.length > 0) {
        console.log('📋 IDs das notificações que causaram a atualização:', ids.join(', '));
        console.log('🆕 ID da nova notificação:', ids[0] + (ids.length > 1 ? ' (+' + (ids.length - 1) + ' outras)' : ''));
      }
      
      // Dispara evento customizado
      if (typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') {
        const event = new CustomEvent('dataChanged', {
          detail: {
            timestamp: Date.now(),
            source: 'ChangeDetector',
            notificationIds: ids
          }
        });
        window.dispatchEvent(event);
      }

      // Executa callbacks
      changeCallbacks.forEach(callback => {
        try {
          callback(ids);
        } catch (error) {
          console.error('[ChangeDetector] Erro ao executar callback:', error);
        }
      });
    },

    /**
     * Verifica se está rodando
     * @returns {boolean}
     */
    isRunning: function() {
      return isRunning;
    },

    /**
     * Obtém tempo da última verificação
     * @returns {number|null}
     */
    getLastCheckTime: function() {
      return lastCheckTime;
    },

    /**
     * Atualiza configuração
     * @param {Object} newConfig - Nova configuração
     */
    updateConfig: function(newConfig) {
      const wasRunning = isRunning;
      if (wasRunning) {
        this.stop();
      }
      
      config = { ...config, ...newConfig };
      
      if (wasRunning) {
        this.start(config);
      }
    }
  };

  // Exportar globalmente
  if (typeof window !== 'undefined') {
    window.ChangeDetector = ChangeDetector;
  }

  // Exportar para módulos (se suportado)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChangeDetector;
  }
})();
