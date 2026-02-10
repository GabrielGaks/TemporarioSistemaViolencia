/**
 * ========================================
 * DATA CACHE - Sistema de Cache Global
 * ========================================
 * Gerencia cache centralizado de dados em sessionStorage e memória
 * ========================================
 */

(function() {
  'use strict';

  const CACHE_PREFIX = 'naam_cache_';
  const CACHE_VERSION = '1.0';
  
  // Cache em memória para acesso rápido
  const memoryCache = new Map();
  
  // Verifica se sessionStorage está disponível
  const storageAvailable = (function() {
    try {
      const test = '__storage_test__';
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  })();

  /**
   * Gera hash simples dos dados para comparação
   * @param {*} data - Dados para gerar hash
   * @returns {string} Hash dos dados
   */
  function generateHash(data) {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Obtém chave completa do cache
   * @param {string} key - Chave do cache
   * @returns {string} Chave completa
   */
  function getCacheKey(key) {
    return `${CACHE_PREFIX}${key}_${CACHE_VERSION}`;
  }

  /**
   * Obtém chave de metadados
   * @param {string} key - Chave do cache
   * @returns {string} Chave de metadados
   */
  function getMetadataKey(key) {
    return `${CACHE_PREFIX}meta_${key}_${CACHE_VERSION}`;
  }

  const DataCache = {
    /**
     * Salva dados no cache
     * @param {string} key - Chave do cache
     * @param {*} data - Dados para salvar
     * @param {Object} options - Opções (expiry, etc)
     * @returns {boolean} Sucesso
     */
    set: function(key, data, options = {}) {
      try {
        const cacheKey = getCacheKey(key);
        const metadataKey = getMetadataKey(key);
        
        // Gera hash dos dados
        const hash = generateHash(data);
        
        // Cria metadados
        const metadata = {
          hash: hash,
          timestamp: Date.now(),
          expiry: options.expiry || null,
          version: CACHE_VERSION,
          serverLastModified: options.serverLastModified || null // Timestamp da última modificação no servidor
        };
        
        // Salva em memória
        memoryCache.set(cacheKey, data);
        memoryCache.set(metadataKey, metadata);
        
        // Salva em sessionStorage se disponível
        if (storageAvailable) {
          try {
            sessionStorage.setItem(cacheKey, JSON.stringify(data));
            sessionStorage.setItem(metadataKey, JSON.stringify(metadata));
          } catch (e) {
            // Se exceder quota, limpa caches antigos
            if (e.name === 'QuotaExceededError') {
              console.warn('[DataCache] Quota excedida, limpando caches antigos...');
              this.clearOldCaches();
              // Tenta novamente
              try {
                sessionStorage.setItem(cacheKey, JSON.stringify(data));
                sessionStorage.setItem(metadataKey, JSON.stringify(metadata));
              } catch (e2) {
                console.error('[DataCache] Erro ao salvar em sessionStorage:', e2);
              }
            }
          }
        }
        
        return true;
      } catch (error) {
        console.error('[DataCache] Erro ao salvar cache:', error);
        return false;
      }
    },

    /**
     * Recupera dados do cache
     * @param {string} key - Chave do cache
     * @returns {*} Dados ou null
     */
    get: function(key) {
      try {
        const cacheKey = getCacheKey(key);
        const metadataKey = getMetadataKey(key);
        
        // Tenta recuperar de memória primeiro
        if (memoryCache.has(cacheKey)) {
          const metadata = memoryCache.get(metadataKey);
          if (metadata && this.isValid(metadata)) {
            return memoryCache.get(cacheKey);
          } else {
            // Cache expirado, remove
            memoryCache.delete(cacheKey);
            memoryCache.delete(metadataKey);
          }
        }
        
        // Tenta recuperar de sessionStorage
        if (storageAvailable) {
          try {
            const cachedData = sessionStorage.getItem(cacheKey);
            const cachedMetadata = sessionStorage.getItem(metadataKey);
            
            if (cachedData && cachedMetadata) {
              const metadata = JSON.parse(cachedMetadata);
              
              // Verifica se é válido
              if (this.isValid(metadata)) {
                const data = JSON.parse(cachedData);
                
                // Atualiza cache em memória
                memoryCache.set(cacheKey, data);
                memoryCache.set(metadataKey, metadata);
                
                return data;
              } else {
                // Cache expirado, remove
                sessionStorage.removeItem(cacheKey);
                sessionStorage.removeItem(metadataKey);
              }
            }
          } catch (e) {
            console.error('[DataCache] Erro ao ler sessionStorage:', e);
          }
        }
        
        return null;
      } catch (error) {
        console.error('[DataCache] Erro ao recuperar cache:', error);
        return null;
      }
    },

    /**
     * Verifica se cache existe e é válido
     * @param {string} key - Chave do cache
     * @returns {boolean} Existe e é válido
     */
    has: function(key) {
      const data = this.get(key);
      return data !== null;
    },

    /**
     * Verifica se metadados são válidos
     * @param {Object} metadata - Metadados
     * @returns {boolean} É válido
     */
    isValid: function(metadata) {
      if (!metadata) return false;
      
      // Verifica versão
      if (metadata.version !== CACHE_VERSION) {
        return false;
      }
      
      // Verifica expiração
      if (metadata.expiry && Date.now() > metadata.timestamp + metadata.expiry) {
        return false;
      }
      
      return true;
    },

    /**
     * Obtém hash dos dados em cache
     * @param {string} key - Chave do cache
     * @returns {string|null} Hash ou null
     */
    getHash: function(key) {
      try {
        const metadataKey = getMetadataKey(key);
        
        // Tenta memória primeiro
        if (memoryCache.has(metadataKey)) {
          const metadata = memoryCache.get(metadataKey);
          return metadata ? metadata.hash : null;
        }
        
        // Tenta sessionStorage
        if (storageAvailable) {
          try {
            const cachedMetadata = sessionStorage.getItem(metadataKey);
            if (cachedMetadata) {
              const metadata = JSON.parse(cachedMetadata);
              return metadata ? metadata.hash : null;
            }
          } catch (e) {
            console.error('[DataCache] Erro ao ler hash:', e);
          }
        }
        
        return null;
      } catch (error) {
        console.error('[DataCache] Erro ao obter hash:', error);
        return null;
      }
    },

    /**
     * Limpa cache específico
     * @param {string} key - Chave do cache
     */
    clear: function(key) {
      try {
        const cacheKey = getCacheKey(key);
        const metadataKey = getMetadataKey(key);
        
        // Remove de memória
        memoryCache.delete(cacheKey);
        memoryCache.delete(metadataKey);
        
        // Remove de sessionStorage
        if (storageAvailable) {
          sessionStorage.removeItem(cacheKey);
          sessionStorage.removeItem(metadataKey);
        }
      } catch (error) {
        console.error('[DataCache] Erro ao limpar cache:', error);
      }
    },

    /**
     * Limpa todos os caches
     */
    clearAll: function() {
      try {
        // Limpa memória
        memoryCache.clear();
        
        // Limpa sessionStorage
        if (storageAvailable) {
          const keys = Object.keys(sessionStorage);
          keys.forEach(key => {
            if (key.startsWith(CACHE_PREFIX)) {
              sessionStorage.removeItem(key);
            }
          });
        }
      } catch (error) {
        console.error('[DataCache] Erro ao limpar todos os caches:', error);
      }
    },

    /**
     * Limpa caches antigos (expirados ou de versões antigas)
     */
    clearOldCaches: function() {
      try {
        if (!storageAvailable) return;
        
        const keys = Object.keys(sessionStorage);
        const now = Date.now();
        
        keys.forEach(key => {
          if (key.startsWith(CACHE_PREFIX)) {
            try {
              // Se for metadados, verifica expiração
              if (key.includes('meta_')) {
                const metadata = JSON.parse(sessionStorage.getItem(key));
                if (metadata) {
                  // Verifica versão
                  if (metadata.version !== CACHE_VERSION) {
                    // Remove cache e metadados
                    const cacheKey = key.replace('meta_', '').replace(`_${CACHE_VERSION}`, '');
                    sessionStorage.removeItem(key);
                    sessionStorage.removeItem(cacheKey);
                    return;
                  }
                  
                  // Verifica expiração
                  if (metadata.expiry && now > metadata.timestamp + metadata.expiry) {
                    const cacheKey = key.replace('meta_', '').replace(`_${CACHE_VERSION}`, '');
                    sessionStorage.removeItem(key);
                    sessionStorage.removeItem(cacheKey);
                  }
                }
              }
            } catch (e) {
              // Se houver erro ao processar, remove
              sessionStorage.removeItem(key);
            }
          }
        });
      } catch (error) {
        console.error('[DataCache] Erro ao limpar caches antigos:', error);
      }
    },

    /**
     * Obtém timestamp da última atualização (quando o cache foi salvo)
     * @param {string} key - Chave do cache
     * @returns {number|null} Timestamp ou null
     */
    getLastUpdate: function(key) {
      try {
        const metadataKey = getMetadataKey(key);
        
        // Tenta memória
        if (memoryCache.has(metadataKey)) {
          const metadata = memoryCache.get(metadataKey);
          return metadata ? metadata.timestamp : null;
        }
        
        // Tenta sessionStorage
        if (storageAvailable) {
          try {
            const cachedMetadata = sessionStorage.getItem(metadataKey);
            if (cachedMetadata) {
              const metadata = JSON.parse(cachedMetadata);
              return metadata ? metadata.timestamp : null;
            }
          } catch (e) {
            console.error('[DataCache] Erro ao ler timestamp:', e);
          }
        }
        
        return null;
      } catch (error) {
        console.error('[DataCache] Erro ao obter timestamp:', error);
        return null;
      }
    },

    /**
     * Obtém timestamp da última modificação no servidor (se disponível)
     * @param {string} key - Chave do cache
     * @returns {string|null} Timestamp ISO do servidor ou null
     */
    getServerLastModified: function(key) {
      try {
        const metadataKey = getMetadataKey(key);
        
        // Tenta memória
        if (memoryCache.has(metadataKey)) {
          const metadata = memoryCache.get(metadataKey);
          return metadata ? metadata.serverLastModified : null;
        }
        
        // Tenta sessionStorage
        if (storageAvailable) {
          try {
            const cachedMetadata = sessionStorage.getItem(metadataKey);
            if (cachedMetadata) {
              const metadata = JSON.parse(cachedMetadata);
              return metadata ? metadata.serverLastModified : null;
            }
          } catch (e) {
            console.error('[DataCache] Erro ao ler serverLastModified:', e);
          }
        }
        
        return null;
      } catch (error) {
        console.error('[DataCache] Erro ao obter serverLastModified:', error);
        return null;
      }
    },

    /**
     * Gera hash dos dados (método público)
     * @param {*} data - Dados para gerar hash
     * @returns {string} Hash dos dados
     */
    generateHash: function(data) {
      return generateHash(data);
    }
  };

  // Limpa caches antigos ao inicializar
  if (typeof window !== 'undefined') {
    DataCache.clearOldCaches();
  }

  // Exportar globalmente
  if (typeof window !== 'undefined') {
    window.DataCache = DataCache;
  }

  // Exportar para módulos (se suportado)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataCache;
  }
})();
