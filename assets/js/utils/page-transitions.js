/* ============================================
   SISTEMA DE TRANSIÇÕES DINÂMICAS ENTRE PÁGINAS
   ============================================ */

// Esconde o conteúdo inicialmente para evitar flash
// Este código verifica se o estilo já existe (adicionado inline no HTML)
// Se não existir, adiciona dinamicamente
(function () {
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
        transition: opacity 0.4s ease-out, visibility 0.4s ease-out;
      }
    `;
    document.head.insertBefore(style, document.head.firstChild);
  }
})();

// Função para inicializar a transição de entrada
function initPageTransition() {
  // Marca a página como pronta IMEDIATAMENTE (não espera frame)
  document.documentElement.classList.add('page-ready');

  // Garante que o body seja visível
  if (document.body) {
    document.body.style.opacity = '1';
    document.body.style.visibility = 'visible';
  }

  // Aguarda um frame para garantir que tudo está renderizado
  requestAnimationFrame(function () {
    // Verifica se há tipo de transição armazenado
    const transitionType = sessionStorage.getItem('pageTransitionType') || 'default';
    sessionStorage.removeItem('pageTransitionType');

    // Adiciona animação de entrada ao body com tipo específico
    if (document.body) {
      document.body.classList.add('page-enter');

      // Adiciona classe específica de transição se houver
      if (transitionType !== 'default') {
        document.body.classList.add(`page-transition-${transitionType}`);
      }

      // Remove classes após animação (ajustado para durações mais curtas)
      const maxDuration = transitionType === 'login-to-dashboard' ? 600 :
        transitionType === 'success' ? 450 : 500;
      setTimeout(() => {
        document.body.classList.remove('page-enter');
        if (transitionType !== 'default') {
          document.body.classList.remove(`page-transition-${transitionType}`);
        }
      }, maxDuration);
    }

    // Aplica animações staggered aos elementos específicos
    applyStaggeredAnimations();

    // Garante que elementos iniciais sejam visíveis
    const firstElements = document.querySelectorAll('body > div > *');
    firstElements.forEach((el, index) => {
      if (index < 10) { // Primeiros 10 elementos
        el.style.opacity = '1';
        el.style.visibility = 'visible';
      }
    });
  });
}

// Função para aplicar animações staggered aos elementos (reduzida drasticamente)
function applyStaggeredAnimations() {
  // Cards de estatísticas - apenas primeiro nível, máximo 6 itens
  const statCards = document.querySelectorAll('.stat-card:first-child, [class*="stat-"]:first-child, [id*="stat"]:first-child');
  Array.from(statCards).slice(0, 6).forEach((card) => {
    if (!card.classList.contains('stat-card')) {
      card.classList.add('stat-card');
    }
  });

  // Cards de filtros - apenas fade-in, sem movimento lateral
  const filterCards = document.querySelectorAll('.filter-card, [class*="filter-card"]');
  Array.from(filterCards).slice(0, 6).forEach((card) => {
    if (!card.classList.contains('filter-card')) {
      card.classList.add('filter-card');
    }
  });

  // Tabelas - anima apenas o container tbody, não linhas individuais
  const tableBodies = document.querySelectorAll('.table-elegant tbody, table tbody');
  tableBodies.forEach((tbody) => {
    if (!tbody.classList.contains('table-container')) {
      tbody.classList.add('table-container');
    }
  });

  // Remove animações automáticas para seções, listas e elementos genéricos
  // (não aplica mais classes de animação para esses elementos)
}

// Função para detectar tipo de transição baseado na navegação
function getTransitionType(from, to) {
  const fromPage = from.split('/').pop() || from;
  const toPage = to.split('/').pop() || to;

  // Login → Dashboard
  if (fromPage === 'index.html' && toPage === 'painel-casos.html') {
    return 'login-to-dashboard';
  }

  // Dashboard → Gerenciar
  if (fromPage === 'painel-casos.html' && toPage === 'gerenciar-casos.html') {
    return 'dashboard-to-manage';
  }

  // Gerenciar → Dashboard
  if (fromPage === 'gerenciar-casos.html' && toPage === 'painel-casos.html') {
    return 'manage-to-dashboard';
  }

  // Minhas Notificações → Gerenciar (edição)
  if (fromPage === 'minhas-notificacoes.html' && toPage.includes('gerenciar-casos.html')) {
    return 'notification-expand';
  }

  // Gerenciar → Minhas Notificações (retorno)
  if (fromPage === 'gerenciar-casos.html' && toPage === 'minhas-notificacoes.html') {
    return 'manage-to-notifications';
  }

  // Registro → Sucesso (feedback)
  if (fromPage === 'registro-novo-caso.html') {
    return 'success';
  }

  // Default
  return 'default';
}

// Inicializa quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () {
    // Garante que page-ready seja adicionada
    if (!document.documentElement.classList.contains('page-ready')) {
      document.documentElement.classList.add('page-ready');
    }
    initPageTransition();
    setupLinkInterceptors();
  });
} else {
  // DOM já está pronto
  // Garante que page-ready seja adicionada
  if (!document.documentElement.classList.contains('page-ready')) {
    document.documentElement.classList.add('page-ready');
  }
  initPageTransition();
  setupLinkInterceptors();
}

// Fallback adicional: força page-ready após 500ms se ainda não foi adicionada
setTimeout(function () {
  if (!document.documentElement.classList.contains('page-ready')) {
    console.warn('[page-transitions] Forçando page-ready após timeout de segurança');
    document.documentElement.classList.add('page-ready');
  }
}, 500);

// Função para interceptar links
function setupLinkInterceptors() {
  const links = document.querySelectorAll('a[href$=".html"]');

  links.forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');

      // Ignora links externos, âncoras, e links com target="_blank"
      if (href.startsWith('http') || href.startsWith('#') || this.target === '_blank') {
        return;
      }

      // Previne navegação padrão
      e.preventDefault();

      // Detecta tipo de transição
      const currentPage = window.location.pathname;
      const transitionType = getTransitionType(currentPage, href);

      // Armazena tipo de transição para próxima página
      sessionStorage.setItem('pageTransitionType', transitionType);

      // Adiciona classe de saída à página atual
      if (document.body) {
        document.body.classList.add('page-exit');
      }

      // Após animação de saída, navega para nova página (250ms para saída rápida)
      setTimeout(() => {
        window.location.href = href;
      }, 300);
    });
  });
}

// Intercepta também navegação programática
(function () {
  try {
    const originalLocationAssign = window.location.assign;
    const originalLocationReplace = window.location.replace;

    // Tenta obter o descriptor de href de forma compatível
    let originalLocationHrefSetter = null;
    try {
      const descriptor = Object.getOwnPropertyDescriptor(window.location, 'href');
      if (descriptor && descriptor.set) {
        originalLocationHrefSetter = descriptor.set;
      }
    } catch (e) {
      // Se getOwnPropertyDescriptor não funcionar, tenta outra abordagem
      console.warn('⚠️ Não foi possível interceptar window.location.href:', e);
    }

    window.location.assign = function (url) {
      if (url && url.endsWith('.html')) {
        // Detecta tipo de transição
        const currentPage = window.location.pathname;
        const transitionType = getTransitionType(currentPage, url);
        sessionStorage.setItem('pageTransitionType', transitionType);

        if (document.body) {
          document.body.classList.add('page-exit');
        }
        setTimeout(() => {
          originalLocationAssign.call(window.location, url);
        }, 300);
      } else {
        originalLocationAssign.call(window.location, url);
      }
    };

    window.location.replace = function (url) {
      if (url && url.endsWith('.html')) {
        // Detecta tipo de transição
        const currentPage = window.location.pathname;
        const transitionType = getTransitionType(currentPage, url);
        sessionStorage.setItem('pageTransitionType', transitionType);

        if (document.body) {
          document.body.classList.add('page-exit');
        }
        setTimeout(() => {
          originalLocationReplace.call(window.location, url);
        }, 600);
      } else {
        originalLocationReplace.call(window.location, url);
      }
    };

    // Só tenta interceptar href se conseguir obter o setter original
    // E se a propriedade for configurável
    if (originalLocationHrefSetter) {
      try {
        // Verifica se a propriedade é configurável antes de tentar redefinir
        const descriptor = Object.getOwnPropertyDescriptor(window.location, 'href');
        if (descriptor && descriptor.configurable) {
          Object.defineProperty(window.location, 'href', {
            set: function (url) {
              if (url && url.endsWith('.html')) {
                // Detecta tipo de transição
                const currentPage = window.location.pathname;
                const transitionType = getTransitionType(currentPage, url);
                sessionStorage.setItem('pageTransitionType', transitionType);

                if (document.body) {
                  document.body.classList.add('page-exit');
                }
                setTimeout(() => {
                  originalLocationHrefSetter.call(window.location, url);
                }, 300);
              } else {
                originalLocationHrefSetter.call(window.location, url);
              }
            },
            get: function () {
              return window.location.href;
            },
            configurable: true
          });
        } else {
          // Se não for configurável, apenas loga um aviso (não é crítico)
          console.log('ℹ️ window.location.href não é configurável, usando fallback');
        }
      } catch (e) {
        // Não é crítico se não conseguir interceptar href
        // O sistema ainda funciona, apenas sem transição para navegação programática
        console.log('ℹ️ Não foi possível interceptar window.location.href (não crítico):', e.message);
      }
    }
  } catch (e) {
    console.warn('⚠️ Erro ao configurar interceptação de navegação:', e);
  }
})();
