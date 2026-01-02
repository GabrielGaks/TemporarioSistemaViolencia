/**
 * ========================================
 * CONFIG LOADER - Carregador Seguro de Configuração
 * ========================================
 * Carrega config.local.js se existir, mantendo compatibilidade
 * ========================================
 */

(function() {
  'use strict';
  
  // Função para carregar configuração local de forma assíncrona
  // NOTA: config.local.js é opcional e só será carregado se existir
  // O arquivo principal de configuração é config.js (já carregado no HTML)
  function loadLocalConfig() {
    return new Promise((resolve) => {
      // Verifica se já existe CONFIG_LOCAL (carregado por outro script)
      if (typeof window !== 'undefined' && window.CONFIG_LOCAL) {
        resolve(window.CONFIG_LOCAL);
        return;
      }
      
      // Como config.local.js é opcional e não existe neste projeto,
      // simplesmente resolve sem tentar carregar para evitar erros 404
      // Se no futuro precisar de config.local.js, descomente o código abaixo
      resolve(null);
      
      /* Código comentado - descomente apenas se config.local.js for necessário
      fetch('config.local.js', { 
        method: 'GET',
        cache: 'no-cache'
      })
      .then(response => {
        if (response.ok && response.status === 200) {
          const contentType = response.headers.get('content-type') || '';
          if (contentType.includes('javascript') || contentType.includes('text/plain') || contentType.includes('application/javascript')) {
            const script = document.createElement('script');
            script.src = 'config.local.js';
            script.type = 'text/javascript';
            script.async = false;
            
            script.onload = function() {
              if (typeof window !== 'undefined' && window.CONFIG_LOCAL) {
                resolve(window.CONFIG_LOCAL);
              } else {
                resolve(null);
              }
            };
            
            script.onerror = function() {
              if (script.parentNode) {
                script.parentNode.removeChild(script);
              }
              resolve(null);
            };
            
            const head = document.head || document.getElementsByTagName('head')[0];
            head.appendChild(script);
          } else {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      })
      .catch(() => {
        resolve(null);
      });
      */
    });
  }
  
  // Carrega configuração quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async function() {
      const localConfig = await loadLocalConfig();
      if (localConfig && typeof window !== 'undefined' && window.CONFIG) {
        // Mescla configuração local com padrão (se CONFIG já foi definido)
        // Isso permite que config.local.js sobrescreva valores padrão
        Object.keys(localConfig).forEach(key => {
          if (localConfig[key]) {
            window.CONFIG[key] = localConfig[key];
          }
        });
        
        // Log apenas se debug estiver ativo
        if (window.CONFIG && window.CONFIG.DEBUG_MODE) {
          const logFn = (window.Logger && window.Logger.log) || console.log;
          logFn('✅ Configuração local carregada com sucesso');
        }
      }
    });
  } else {
    // DOM já está pronto
    loadLocalConfig().then(localConfig => {
      if (localConfig && typeof window !== 'undefined' && window.CONFIG) {
        Object.keys(localConfig).forEach(key => {
          if (localConfig[key]) {
            window.CONFIG[key] = localConfig[key];
          }
        });
        
        if (window.CONFIG && window.CONFIG.DEBUG_MODE) {
          const logFn = (window.Logger && window.Logger.log) || console.log;
          logFn('✅ Configuração local carregada com sucesso');
        }
      }
    });
  }
})();

