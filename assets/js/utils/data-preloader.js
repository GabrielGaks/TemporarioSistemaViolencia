/**
 * ========================================
 * DATA PRELOADER - Pré-carregamento de Dados
 * ========================================
 * Carrega dados após login para deixá-los prontos
 * ========================================
 */

(function() {
  'use strict';

  const DataPreloader = {
    /**
     * Pré-carrega todos os dados após login
     * @param {string} userEmail - Email do usuário
     * @param {string} userRole - Role do usuário
     * @returns {Promise<void>}
     */
    preloadAll: async function(userEmail, userRole) {
      console.log('[DataPreloader] Iniciando pré-carregamento de dados...');
      
      const promises = [];
      
      // Carrega dados baseado no role
      if (userRole === 'visualizador') {
        // Visualizador: carrega apenas dados do painel
        promises.push(this.preloadPainelCasos());
      } else if (userRole === 'admin' || userRole === 'superuser') {
        // Admin: carrega tudo
        promises.push(this.preloadPainelCasos());
        promises.push(this.preloadGerenciarCasos());
        promises.push(this.preloadNotificacoes(userEmail));
      } else {
        // Usuário normal: carrega gerenciar casos e notificações
        promises.push(this.preloadGerenciarCasos());
        promises.push(this.preloadNotificacoes(userEmail));
      }
      
      try {
        await Promise.all(promises);
        console.log('[DataPreloader] ✅ Todos os dados pré-carregados com sucesso');
      } catch (error) {
        console.error('[DataPreloader] ❌ Erro ao pré-carregar dados:', error);
        // Não bloqueia o login se houver erro
      }
    },

    /**
     * Pré-carrega dados do painel de casos
     * @returns {Promise<void>}
     */
    preloadPainelCasos: async function() {
      return new Promise((resolve, reject) => {
        try {
          if (!window.CONFIG || !window.CONFIG.SPREADSHEET_ID) {
            console.warn('[DataPreloader] SPREADSHEET_ID não configurado');
            resolve();
            return;
          }

          const SPREADSHEET_ID = window.CONFIG.SPREADSHEET_ID;
          const timestamp = Date.now();
          const random = Math.random().toString(36).substring(2, 15);

          // Configura handler temporário
          if (!window.google) window.google = {};
          if (!window.google.visualization) window.google.visualization = {};
          if (!window.google.visualization.Query) window.google.visualization.Query = {};

          window.google.visualization.Query.setResponse = function(response) {
            try {
              if (!response || !response.table || !response.table.rows) {
                resolve();
                return;
              }

              const headers = response.table.cols.map(col => col.label || '');
              const data = response.table.rows.map(row => {
                const obj = {};
                row.c.forEach((cell, index) => {
                  const header = headers[index];
                  if (header) {
                    obj[header] = cell && cell.v !== null && cell.v !== undefined ? cell.v : '';
                  }
                });
                return obj;
              });

              // Salva no cache
              if (window.DataCache && window.CONFIG && window.CONFIG.CACHE_ENABLED) {
                const expiry = window.CONFIG.CACHE_EXPIRY || 3600000;
                window.DataCache.set('painel_casos', data, { expiry: expiry });
                console.log('[DataPreloader] ✅ Dados do painel salvos no cache:', data.length, 'registros');
              }

              resolve();
            } catch (error) {
              console.error('[DataPreloader] Erro ao processar dados do painel:', error);
              resolve(); // Não rejeita para não bloquear login
            }
          };

          const script = document.createElement('script');
          script.id = 'jsonp-preload-painel';
          script.src = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&_=${timestamp}&r=${random}`;
          
          script.onerror = () => {
            console.warn('[DataPreloader] Erro ao carregar dados do painel');
            resolve(); // Não rejeita
          };

          script.onload = () => {
            setTimeout(() => {
              if (script.parentNode) {
                script.parentNode.removeChild(script);
              }
            }, 2000);
          };

          document.head.appendChild(script);

          // Timeout de segurança
          setTimeout(() => {
            if (script.parentNode) {
              script.parentNode.removeChild(script);
            }
            resolve();
          }, 30000);
        } catch (error) {
          console.error('[DataPreloader] Erro ao pré-carregar painel:', error);
          resolve();
        }
      });
    },

    /**
     * Pré-carrega dados de gerenciar casos
     * @returns {Promise<void>}
     */
    preloadGerenciarCasos: async function() {
      return new Promise((resolve) => {
        try {
          if (!window.CONFIG || !window.CONFIG.APPS_SCRIPT_CASOS) {
            console.warn('[DataPreloader] APPS_SCRIPT_CASOS não configurado');
            resolve();
            return;
          }

          const iframe = document.createElement('iframe');
          iframe.style.display = 'none';
          iframe.src = window.CONFIG.APPS_SCRIPT_CASOS + '?action=list&t=' + Date.now();

          const messageHandler = function(event) {
            if (!event.origin.includes('google')) return;
            if (!event.data || typeof event.data.success === 'undefined') return;

            if (event.data.success && event.data.registros) {
              // Salva no cache
              if (window.DataCache && window.CONFIG && window.CONFIG.CACHE_ENABLED) {
                const expiry = window.CONFIG.CACHE_EXPIRY || 3600000;
                window.DataCache.set('gerenciar_casos', event.data.registros, { expiry: expiry });
                console.log('[DataPreloader] ✅ Dados de gerenciar casos salvos no cache:', event.data.registros.length, 'registros');
              }
            }

            window.removeEventListener('message', messageHandler);
            setTimeout(() => {
              if (iframe.parentNode) {
                iframe.remove();
              }
            }, 100);
            resolve();
          };

          window.addEventListener('message', messageHandler);
          document.body.appendChild(iframe);

          // Timeout de segurança
          setTimeout(() => {
            window.removeEventListener('message', messageHandler);
            if (iframe.parentNode) {
              iframe.remove();
            }
            resolve();
          }, 30000);
        } catch (error) {
          console.error('[DataPreloader] Erro ao pré-carregar gerenciar casos:', error);
          resolve();
        }
      });
    },

    /**
     * Pré-carrega notificações do usuário
     * @param {string} userEmail - Email do usuário
     * @returns {Promise<void>}
     */
    preloadNotificacoes: async function(userEmail) {
      try {
        if (!window.CONFIG || !window.CONFIG.APPS_SCRIPT_CASOS || !userEmail) {
          console.warn('[DataPreloader] Configuração ou email não disponível');
          return;
        }

        const response = await fetch(window.CONFIG.APPS_SCRIPT_CASOS, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: 'data=' + encodeURIComponent(JSON.stringify({
            action: 'listarMinhasNotificacoes',
            emailUsuario: userEmail
          })),
          signal: AbortSignal.timeout(30000)
        });

        const resultado = await response.json();

        if (resultado.success && resultado.grupos) {
          // Salva no cache
          if (window.DataCache && window.CONFIG && window.CONFIG.CACHE_ENABLED) {
            const cacheKey = `minhas_notificacoes_${userEmail}`;
            const expiry = window.CONFIG.CACHE_EXPIRY || 3600000;
            
            // Consolida grupos (simula o que a página faz)
            let grupos = resultado.grupos || {};
            
            // Extrai tipos de violência
            const tiposViolenciaDisponiveis = [];
            Object.values(grupos).forEach(notificacoes => {
              notificacoes.forEach(notif => {
                if (notif.tipoViolencia) {
                  const tipos = notif.tipoViolencia.split(',').map(t => t.trim()).filter(t => t);
                  tipos.forEach(tipo => {
                    if (!tiposViolenciaDisponiveis.includes(tipo)) {
                      tiposViolenciaDisponiveis.push(tipo);
                    }
                  });
                }
              });
            });
            tiposViolenciaDisponiveis.sort();
            
            window.DataCache.set(cacheKey, {
              grupos: grupos,
              gruposOriginais: JSON.parse(JSON.stringify(grupos)),
              tiposViolenciaDisponiveis: tiposViolenciaDisponiveis,
              total: resultado.total || 0
            }, { expiry: expiry });
            
            console.log('[DataPreloader] ✅ Notificações salvas no cache:', Object.keys(grupos).length, 'grupos');
          }
        }
      } catch (error) {
        console.error('[DataPreloader] Erro ao pré-carregar notificações:', error);
        // Não bloqueia login
      }
    }
  };

  // Exportar globalmente
  if (typeof window !== 'undefined') {
    window.DataPreloader = DataPreloader;
  }

  // Exportar para módulos (se suportado)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataPreloader;
  }
})();
