/* ============================================
   SISTEMA DE SCROLL REVEAL - REVELAÇÃO PROGRESSIVA
   Elementos aparecem conforme o usuário rola a página
   ============================================ */

(function () {
  'use strict';

  // Configuração do Intersection Observer
  const observerOptions = {
    root: null, // viewport
    rootMargin: '0px 0px 600px 0px', // Trigger quando elemento está 600px antes de entrar na viewport (super agressivo)
    threshold: 0 // Trigger assim que 1px aparecer
  };

  // Animações disponíveis
  const animations = {
    'fade-up': {
      initial: { opacity: 0, transform: 'translateY(30px)' },
      final: { opacity: 1, transform: 'translateY(0)' }
    },
    'fade-down': {
      initial: { opacity: 0, transform: 'translateY(-30px)' },
      final: { opacity: 1, transform: 'translateY(0)' }
    },
    'fade-left': {
      initial: { opacity: 0, transform: 'translateX(-30px)' },
      final: { opacity: 1, transform: 'translateX(0)' }
    },
    'fade-right': {
      initial: { opacity: 0, transform: 'translateX(30px)' },
      final: { opacity: 1, transform: 'translateX(0)' }
    },
    'scale-up': {
      initial: { opacity: 0, transform: 'scale(0.9)' },
      final: { opacity: 1, transform: 'scale(1)' }
    },
    'scale-down': {
      initial: { opacity: 0, transform: 'scale(1.1)' },
      final: { opacity: 1, transform: 'scale(1)' }
    },
    'zoom-in': {
      initial: { opacity: 0, transform: 'scale(0.8)' },
      final: { opacity: 1, transform: 'scale(1)' }
    },
    'slide-up': {
      initial: { opacity: 0, transform: 'translateY(50px)' },
      final: { opacity: 1, transform: 'translateY(0)' }
    }
  };

  // Duração padrão das animações
  const defaultDuration = 600; // ms
  const defaultEasing = 'cubic-bezier(0.4, 0, 0.2, 1)';

  // Função para aplicar estilo inicial ao elemento
  function applyInitialStyle(element, animationType) {
    const anim = animations[animationType] || animations['fade-up'];
    const duration = element.dataset.duration || defaultDuration;
    const easing = element.dataset.easing || defaultEasing;

    // Aplica estilos iniciais
    element.style.opacity = anim.initial.opacity;
    element.style.transform = anim.initial.transform;
    element.style.transition = `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`;
    element.style.willChange = 'opacity, transform';
  }

  // Função para animar elemento quando entra na viewport
  function animateElement(element) {
    const animationType = element.dataset.reveal || 'fade-up';
    const anim = animations[animationType] || animations['fade-up'];

    // Remove classe de "não revelado"
    element.classList.remove('scroll-reveal-hidden');

    // Aplica estilos finais
    requestAnimationFrame(() => {
      element.style.opacity = anim.final.opacity;
      element.style.transform = anim.final.transform;
    });

    // Remove estilos inline após animação (para permitir hover effects, etc)
    const duration = parseInt(element.dataset.duration || defaultDuration);
    setTimeout(() => {
      element.style.willChange = 'auto';
      element.classList.add('scroll-reveal-visible');
    }, duration);
  }

  // Callback do Intersection Observer
  function handleIntersection(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;

        // Anima o elemento
        animateElement(element);

        // Para elementos que devem animar apenas uma vez, remove do observer
        if (!element.dataset.revealRepeat || element.dataset.revealRepeat === 'false') {
          observer.unobserve(element);
        }
      }
    });
  }

  // Cria o Intersection Observer
  const observer = new IntersectionObserver(handleIntersection, observerOptions);

  // Função para verificar se elemento está na viewport inicial
  function isInInitialViewport(element) {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    // Considera elementos que estão visíveis na viewport inicial (primeiros 500% da altura)
    return rect.top < viewportHeight * 5.0;
  }

  // Função para inicializar scroll reveal em elementos
  function initScrollReveal() {
    // Seleciona todos os elementos com atributo data-reveal
    const elementsToReveal = document.querySelectorAll('[data-reveal]');

    elementsToReveal.forEach((element, index) => {
      // Verifica se o elemento está na viewport inicial
      const inInitialViewport = isInInitialViewport(element);

      if (inInitialViewport) {
        // Se está na viewport inicial, mostra imediatamente sem animação
        element.style.opacity = '1';
        element.style.visibility = 'visible';
        element.style.transform = 'none';
        element.classList.add('scroll-reveal-visible');
        return; // Não observa este elemento
      }

      // Adiciona classe inicial apenas para elementos fora da viewport
      element.classList.add('scroll-reveal-hidden');

      // Aplica estilo inicial baseado no tipo de animação
      const animationType = element.dataset.reveal || 'fade-up';
      applyInitialStyle(element, animationType);

      // Adiciona delay escalonado se especificado (reduzido para mobile)
      const stagger = parseInt(element.dataset.stagger || '0');
      if (stagger > 0) {
        // Limita o delay máximo para evitar sensação de lentidão
        const delay = Math.min(index * stagger, 500);
        element.style.transitionDelay = `${delay}ms`;
      }

      // Observa o elemento
      observer.observe(element);
    });

    // Também observa seções principais automaticamente
    const sections = document.querySelectorAll('section[id], .card-elegant, .chart-container');
    sections.forEach((section, index) => {
      // Se já tem data-reveal, ignora
      if (section.hasAttribute('data-reveal')) {
        return;
      }

      // Verifica se está na viewport inicial
      const inInitialViewport = isInInitialViewport(section);

      if (inInitialViewport) {
        // Se está na viewport inicial, mostra imediatamente
        section.style.opacity = '1';
        section.style.visibility = 'visible';
        section.style.transform = 'none';
        return;
      }

      // Adiciona data-reveal padrão apenas para seções fora da viewport
      section.setAttribute('data-reveal', 'fade-up');
      section.classList.add('scroll-reveal-hidden');

      // Aplica estilo inicial
      applyInitialStyle(section, 'fade-up');

      // Delay escalonado para seções
      const stagger = 50; // 50ms entre cada seção
      section.style.transitionDelay = `${index * stagger}ms`;

      // Observa a seção
      observer.observe(section);
    });

    // Observa cards de estatísticas e KPIs
    const statCards = document.querySelectorAll('.card-elegant.bg-gradient-to-br, [class*="stat-card"], [id*="kpi"]');
    statCards.forEach((card, index) => {
      if (card.hasAttribute('data-reveal')) {
        return;
      }

      // Verifica se está na viewport inicial
      const inInitialViewport = isInInitialViewport(card);

      if (inInitialViewport) {
        // Se está na viewport inicial, mostra imediatamente
        card.style.opacity = '1';
        card.style.visibility = 'visible';
        card.style.transform = 'none';
        return;
      }

      card.setAttribute('data-reveal', 'scale-up');
      card.classList.add('scroll-reveal-hidden');
      applyInitialStyle(card, 'scale-up');
      card.style.transitionDelay = `${index * 30}ms`; // 30ms entre cards
      observer.observe(card);
    });

    // Observa gráficos
    const chartContainers = document.querySelectorAll('canvas, [id*="chart"]');
    chartContainers.forEach((chart, index) => {
      const container = chart.closest('.bg-gray-50, .bg-slate-50, .bg-gradient-to-br') || chart.parentElement;
      if (!container || container.hasAttribute('data-reveal')) {
        return;
      }

      container.setAttribute('data-reveal', 'zoom-in');
      container.classList.add('scroll-reveal-hidden');
      applyInitialStyle(container, 'zoom-in');
      container.style.transitionDelay = `${index * 50}ms`; // 50ms entre gráficos
      observer.observe(container);
    });
  }

  // Inicializa quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      // Aguarda um pouco para garantir que elementos dinâmicos foram renderizados
      setTimeout(initScrollReveal, 100);
    });
  } else {
    // DOM já está pronto
    setTimeout(initScrollReveal, 100);
  }

  // Re-inicializa quando novos elementos são adicionados dinamicamente
  // Útil para elementos carregados via AJAX ou JavaScript
  const mutationObserver = new MutationObserver(function (mutations) {
    let shouldReinit = false;

    mutations.forEach(function (mutation) {
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(function (node) {
          if (node.nodeType === 1) { // Element node
            // Verifica se é um elemento relevante ou contém elementos relevantes
            if (node.hasAttribute && node.hasAttribute('data-reveal')) {
              shouldReinit = true;
            } else if (node.querySelectorAll && node.querySelectorAll('[data-reveal]').length > 0) {
              shouldReinit = true;
            } else if (node.classList && (
              node.classList.contains('card-elegant') ||
              node.classList.contains('chart-container') ||
              node.tagName === 'SECTION'
            )) {
              shouldReinit = true;
            }
          }
        });
      }
    });

    if (shouldReinit) {
      // Re-inicializa apenas para novos elementos
      setTimeout(() => {
        const newElements = document.querySelectorAll('[data-reveal]:not(.scroll-reveal-visible):not(.scroll-reveal-hidden)');
        newElements.forEach(element => {
          element.classList.add('scroll-reveal-hidden');
          const animationType = element.dataset.reveal || 'fade-up';
          applyInitialStyle(element, animationType);
          observer.observe(element);
        });
      }, 50);
    }
  });

  // Observa mudanças no DOM
  if (document.body) {
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Exporta função para uso manual se necessário
  window.scrollReveal = {
    init: initScrollReveal,
    observe: function (element) {
      if (element && !element.hasAttribute('data-reveal')) {
        element.setAttribute('data-reveal', 'fade-up');
      }
      element.classList.add('scroll-reveal-hidden');
      const animationType = element.dataset.reveal || 'fade-up';
      applyInitialStyle(element, animationType);
      observer.observe(element);
    }
  };

})();
