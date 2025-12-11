/* ============================================
   SISTEMA DE TRANSIÇÕES DINÂMICAS ENTRE PÁGINAS
   ============================================ */

// Esconde o conteúdo inicialmente para evitar flash
// Este código verifica se o estilo já existe (adicionado inline no HTML)
// Se não existir, adiciona dinamicamente
(function() {
  // Verifica se já existe um estilo para page-ready no head
  const existingStyle = document.querySelector('style[data-page-transition]');
  if (!existingStyle && document.head) {
    // Adiciona estilo inline para esconder o html imediatamente
    const style = document.createElement('style');
    style.setAttribute('data-page-transition', 'true');
    style.textContent = `
      html:not(.page-ready) {
        opacity: 0 !important;
        visibility: hidden !important;
      }
      html.page-ready {
        opacity: 1 !important;
        visibility: visible !important;
        transition: opacity 0.3s ease, visibility 0.3s ease;
      }
    `;
    document.head.insertBefore(style, document.head.firstChild);
  }
})();

// Função para inicializar a transição de entrada
function initPageTransition() {
  // Aguarda um frame para garantir que tudo está renderizado
  requestAnimationFrame(function() {
    // Marca a página como pronta (remove o estilo de ocultação)
    document.documentElement.classList.add('page-ready');
    
    // Adiciona animação de entrada ao body
    if (document.body) {
      document.body.classList.add('page-enter');
      
      // Remove classe após animação
      setTimeout(() => {
        document.body.classList.remove('page-enter');
      }, 600);
    }
  });
}

// Inicializa quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    initPageTransition();
    setupLinkInterceptors();
  });
} else {
  // DOM já está pronto
  initPageTransition();
  setupLinkInterceptors();
}

// Função para interceptar links
function setupLinkInterceptors() {
  const links = document.querySelectorAll('a[href$=".html"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Ignora links externos, âncoras, e links com target="_blank"
      if (href.startsWith('http') || href.startsWith('#') || this.target === '_blank') {
        return;
      }
      
      // Previne navegação padrão
      e.preventDefault();
      
      // Adiciona classe de saída à página atual
      if (document.body) {
        document.body.classList.add('page-exit');
      }
      
      // Após animação de saída, navega para nova página
      setTimeout(() => {
        window.location.href = href;
      }, 400);
    });
  });
}

// Intercepta também navegação programática
(function() {
  const originalLocationAssign = window.location.assign;
  const originalLocationReplace = window.location.replace;
  const originalLocationHref = Object.getPropertyDescriptor(window.location, 'href')?.set;

  window.location.assign = function(url) {
    if (url && url.endsWith('.html')) {
      if (document.body) {
        document.body.classList.add('page-exit');
      }
      setTimeout(() => {
        originalLocationAssign.call(window.location, url);
      }, 400);
    } else {
      originalLocationAssign.call(window.location, url);
    }
  };

  window.location.replace = function(url) {
    if (url && url.endsWith('.html')) {
      if (document.body) {
        document.body.classList.add('page-exit');
      }
      setTimeout(() => {
        originalLocationReplace.call(window.location, url);
      }, 400);
    } else {
      originalLocationReplace.call(window.location, url);
    }
  };

  if (originalLocationHref) {
    Object.defineProperty(window.location, 'href', {
      set: function(url) {
        if (url && url.endsWith('.html')) {
          if (document.body) {
            document.body.classList.add('page-exit');
          }
          setTimeout(() => {
            originalLocationHref.call(window.location, url);
          }, 400);
        } else {
          originalLocationHref.call(window.location, url);
        }
      },
      get: function() {
        return window.location.href;
      }
    });
  }
})();
