/**
 * NAAM Onboarding System
 * Sistema de tour interativo usando Intro.js
 * Tours personalizados por perfil de usuário
 *
 * @version 1.0.0
 */

(function () {
  'use strict';

  // ==========================================
  // CONFIGURACAO GLOBAL
  // ==========================================

  const STORAGE_PREFIX = 'naam_onboarding_';
  const AUTO_START_DELAY = 2000; // 2 segundos

  // Mapeamento de roles equivalentes
  const ROLE_MAPPING = {
    'user': 'estagiario',
    'estagiário': 'estagiario'
  };

  // ==========================================
  // DEFINICAO DOS TOURS POR PAGINA E ROLE
  // ==========================================

  const TOURS = {
    // ----------------------------------------
    // PAINEL DE CASOS
    // ----------------------------------------
    'painel-casos': {
      visualizador: [
        {
          title: 'Bem-vindo ao NAAM!',
          intro: 'Este é o <strong>Painel de Casos</strong>, onde você pode visualizar todos os registros do sistema. Vamos fazer um tour rápido pelas funcionalidades disponíveis para você.',
          element: '[data-tour="header"]',
          position: 'bottom'
        },
        {
          title: 'Filtros de Busca',
          intro: 'Use os <strong>filtros</strong> para encontrar casos específicos. Você pode filtrar por escola, período, tipo de violência e muito mais.',
          element: '[data-tour="filtros"]',
          position: 'bottom'
        },
        {
          title: 'Tabela de Casos',
          intro: 'Aqui você visualiza todos os casos registrados. Como <strong>visualizador</strong>, você pode consultar os dados mas não editá-los.',
          element: '[data-tour="tabela"]',
          position: 'top'
        }
      ],

      estagiario: [
        {
          title: 'Bem-vindo ao NAAM!',
          intro: 'Este é o <strong>Painel de Casos</strong> do sistema NAAM. Aqui você tem acesso às principais funcionalidades. Vamos conhecer o sistema!',
          element: '[data-tour="header"]',
          position: 'bottom'
        },
        {
          title: 'Menu de Navegação',
          intro: 'Use o <strong>menu</strong> para navegar entre as páginas. Você tem acesso ao Painel, Novo Registro e Gerenciar seus Registros.',
          element: '[data-tour="menu"]',
          position: 'bottom'
        },
        {
          title: 'Novo Registro',
          intro: 'Clique em <strong>"Novo Registro"</strong> para cadastrar um novo caso de violência escolar.',
          element: '[data-tour="menu-novo-registro"]',
          position: 'bottom'
        },
        {
          title: 'Gerenciar Registros',
          intro: 'Em <strong>"Gerenciar Registros"</strong> você pode editar ou excluir os casos que você cadastrou.',
          element: '[data-tour="menu-gerenciar"]',
          position: 'bottom'
        },
        {
          title: 'Filtros Avançados',
          intro: 'Use os <strong>filtros</strong> para buscar casos específicos por escola, período, tipo de violência e outros critérios.',
          element: '[data-tour="filtros"]',
          position: 'bottom'
        },
        {
          title: 'Tabela de Casos',
          intro: 'Visualize todos os casos na tabela. Clique em uma linha para ver os <strong>detalhes completos</strong> do caso.',
          element: '[data-tour="tabela"]',
          position: 'top'
        }
      ],

      tecnico: [
        {
          title: 'Bem-vindo, Técnico!',
          intro: 'Este é o <strong>Painel de Casos</strong>. Como técnico, você recebe notificações sobre casos das suas escolas. Vamos ver suas funcionalidades!',
          element: '[data-tour="header"]',
          position: 'bottom'
        },
        {
          title: 'Menu de Navegação',
          intro: 'O menu dá acesso a todas as suas funcionalidades: Painel, Novo Registro e <strong>Minhas Notificações</strong>.',
          element: '[data-tour="menu"]',
          position: 'bottom'
        },
        {
          title: 'Novo Registro',
          intro: 'Registre novos casos de violência escolar clicando em <strong>"Novo Registro"</strong>.',
          element: '[data-tour="menu-novo-registro"]',
          position: 'bottom'
        },
        {
          title: 'Minhas Notificações',
          intro: 'Acesse <strong>"Minhas Notificações"</strong> para ver casos reportados nas suas escolas que precisam de atenção.',
          element: '[data-tour="menu-notificacoes"]',
          position: 'bottom'
        },
        {
          title: 'Badge de Notificações',
          intro: 'O <strong>contador vermelho</strong> mostra quantas notificações não lidas você tem. Fique atento!',
          element: '[data-tour="badge-notificacoes"]',
          position: 'left'
        },
        {
          title: 'Filtros e Busca',
          intro: 'Filtre os casos por diversos critérios para encontrar rapidamente o que precisa.',
          element: '[data-tour="filtros"]',
          position: 'bottom'
        }
      ],

      admin: [
        {
          title: 'Bem-vindo, Administrador!',
          intro: 'Como <strong>administrador</strong>, você tem acesso a funcionalidades avançadas de gerenciamento. Vamos explorar!',
          element: '[data-tour="header"]',
          position: 'bottom'
        },
        {
          title: 'Menu Completo',
          intro: 'Seu menu inclui todas as opções do sistema, incluindo o <strong>Painel Admin</strong> para gerenciamento de usuários.',
          element: '[data-tour="menu"]',
          position: 'bottom'
        },
        {
          title: 'Painel de Casos',
          intro: 'Visualize e gerencie <strong>todos os casos</strong> do sistema com acesso completo aos dados.',
          element: '[data-tour="dashboard"]',
          position: 'bottom'
        },
        {
          title: 'Painel Admin',
          intro: 'Acesse o <strong>"Painel Admin"</strong> para gerenciar usuários, alterar permissões e configurar o sistema.',
          element: '[data-tour="menu-admin"]',
          position: 'bottom'
        },
        {
          title: 'Filtros Avançados',
          intro: 'Use os filtros para análise detalhada dos casos por qualquer critério disponível.',
          element: '[data-tour="filtros"]',
          position: 'bottom'
        },
        {
          title: 'Exportação de Dados',
          intro: 'Exporte os dados filtrados para <strong>CSV ou Excel</strong> para análises externas.',
          element: '[data-tour="exportar"]',
          position: 'left'
        },
        {
          title: 'Detalhes dos Casos',
          intro: 'Clique em qualquer caso para ver <strong>detalhes completos</strong>, incluindo anexos e histórico.',
          element: '[data-tour="tabela"]',
          position: 'top'
        }
      ],

      superuser: [
        {
          title: 'Bem-vindo, Superusuário!',
          intro: 'Você tem <strong>acesso total</strong> ao sistema NAAM. Vamos fazer um tour completo por todas as funcionalidades!',
          element: '[data-tour="header"]',
          position: 'bottom'
        },
        {
          title: 'Menu Completo',
          intro: 'Seu menu dá acesso a <strong>todas as funcionalidades</strong>: Painel, Registros, Notificações e Administração.',
          element: '[data-tour="menu"]',
          position: 'bottom'
        },
        {
          title: 'Dashboard Executivo',
          intro: 'O <strong>Dashboard</strong> mostra estatísticas e indicadores importantes sobre os casos registrados.',
          element: '[data-tour="dashboard"]',
          position: 'bottom'
        },
        {
          title: 'Novo Registro',
          intro: 'Cadastre novos casos de violência escolar com todos os dados necessários.',
          element: '[data-tour="menu-novo-registro"]',
          position: 'bottom'
        },
        {
          title: 'Gerenciar Registros',
          intro: 'Edite ou exclua <strong>qualquer caso</strong> do sistema quando necessário.',
          element: '[data-tour="menu-gerenciar"]',
          position: 'bottom'
        },
        {
          title: 'Minhas Notificações',
          intro: 'Acompanhe casos que requerem atenção através do sistema de notificações.',
          element: '[data-tour="menu-notificacoes"]',
          position: 'bottom'
        },
        {
          title: 'Painel Admin',
          intro: 'Gerencie <strong>usuários</strong>, altere permissões e configure todo o sistema.',
          element: '[data-tour="menu-admin"]',
          position: 'bottom'
        },
        {
          title: 'Exportação e Análise',
          intro: 'Exporte dados, visualize relatórios e acesse todas as ferramentas de análise disponíveis.',
          element: '[data-tour="exportar"]',
          position: 'left'
        }
      ]
    },

    // ----------------------------------------
    // REGISTRO DE NOVO CASO
    // ----------------------------------------
    'registro-novo-caso': {
      _default: [
        {
          title: 'Novo Registro de Caso',
          intro: 'Este formulário permite registrar um <strong>novo caso de violência escolar</strong>. Preencha todas as informações com atenção.',
          element: '[data-tour="header"]',
          position: 'bottom'
        },
        {
          title: 'Dados da Criança/Adolescente',
          intro: 'Comece preenchendo os <strong>dados da vítima</strong>: nome, idade, gênero e outras informações importantes.',
          element: '[data-tour="dados-crianca"]',
          position: 'right',
          onBefore: function () {
            Sim.type('#criancaEstudante', 'João da Silva');
            Sim.type('#idade', '10');
            Sim.select('#identidadeGenero', 'M');
          }
        },
        {
          title: 'Tipo de Violência',
          intro: 'Selecione o <strong>tipo de violência</strong> que ocorreu. Pode marcar mais de uma opção se aplicável.',
          element: '[data-tour="dados-violencia"]',
          position: 'right',
          onBefore: function () {
            Sim.type('#tipoViolencia-input', 'Física');
            setTimeout(() => {
              const e = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
              document.getElementById('tipoViolencia-input')?.dispatchEvent(e);
            }, 800);
          }
        },
        {
          title: 'Unidade e Região',
          intro: 'Selecione a <strong>escola</strong> onde ocorreu o caso.',
          element: '[data-tour="dados-escola"]',
          position: 'right',
          onBefore: function () {
            Sim.select('#tipoInstituicao', 'CMEI');
            setTimeout(() => Sim.type('#cmeiEmef', 'CMEI Pingo de Gente'), 300);
          }
        },
        {
          title: 'Detalhes do Caso',
          intro: 'Descreva os <strong>detalhes do ocorrido</strong> com o máximo de informações possível.',
          element: '[data-tour="dados-detalhes"]',
          position: 'right',
          onBefore: function () {
            Sim.type('#observacoesIniciais', 'A criança relatou que foi empurrada durante o recreio e sofreu escoriações leves no braço direito.');
          }
        },
        {
          title: 'Enviar Registro',
          intro: 'Após preencher todos os campos, clique em <strong>"Registrar Caso"</strong> para enviar.',
          element: '[data-tour="btn-enviar"]',
          position: 'top',
          onBefore: function () {
            Sim.highlight('#btnSalvar');
            Sim.toast('Simulação: Registro preenchido com sucesso!');
          }
        }
      ]
    },

    // ----------------------------------------
    // GERENCIAR CASOS
    // ----------------------------------------
    'gerenciar-casos': {
      _default: [
        {
          title: 'Gerenciar seus Registros',
          intro: 'Aqui você pode <strong>editar ou excluir</strong> os casos que você registrou no sistema.',
          element: '[data-tour="header"]',
          position: 'bottom'
        },
        {
          title: 'Lista de Casos',
          intro: 'Veja todos os <strong>casos que você cadastrou</strong>. Clique em um caso para ver as opções.',
          element: '[data-tour="lista-casos"]',
          position: 'top',
          onBefore: function () {
            // Mock fake row if empty?
          }
        },
        {
          title: 'Editar Caso',
          intro: 'Clique no botão <strong>"Editar"</strong> para modificar os dados de um caso existente.',
          element: '[data-tour="btn-editar"]',
          position: 'left',
          onBefore: function () {
            Sim.highlight('[data-tour="btn-editar"]');
          }
        },
        {
          title: 'Excluir Caso',
          intro: 'Use <strong>"Excluir"</strong> com cuidado - esta ação não pode ser desfeita.',
          element: '[data-tour="btn-excluir"]',
          position: 'left',
          onBefore: function () {
            Sim.highlight('[data-tour="btn-excluir"]');
          }
        }
      ]
    },

    // ----------------------------------------
    // PAINEL DE CASOS
    // ----------------------------------------
    'painel-casos': {
      _default: [
        {
          title: 'Bem-vindo ao Painel de Casos',
          intro: 'Este é o <strong>Painel de Casos</strong>, onde você pode visualizar e analisar todos os registros de violência escolar.',
          element: '[data-tour="header"]',
          position: 'bottom'
        },
        {
          title: 'Indicadores Principais',
          intro: 'Aqui você vê um resumo rápido: total de casos, casos filtrados e outros indicadores importantes.',
          element: '#kpiTotalCasos',
          position: 'bottom',
          onBefore: function () {
            const el = document.getElementById('kpiTotalCasos')?.closest('.kpi-card');
            if (el) {
              el.classList.add('ring-4', 'ring-blue-500', 'ring-opacity-50');
              setTimeout(() => el.classList.remove('ring-4', 'ring-blue-500', 'ring-opacity-50'), 2000);
            } else {
              Sim.highlight('#kpiTotalCasos');
            }
          }
        },
        {
          title: 'Filtros Avançados',
          intro: 'Use esta seção para <strong>filtrar os dados</strong> por escola, tipo de violência, data e muito mais.',
          element: '[data-tour="filtros"]',
          position: 'bottom',
          onBefore: function () {
            Sim.highlight('[data-tour="filtros"]');
          }
        },
        {
          title: 'Gráficos Interativos',
          intro: 'Os gráficos são interativos! Clique nas fatias ou barras para <strong>filtrar a tabela</strong> automaticamente.',
          element: '#chartTipoViolencia',
          position: 'top',
          onBefore: function () {
            Sim.highlight('#chartTipoViolencia');
          }
        },
        {
          title: 'Tabela de Registros',
          intro: 'Aqui estão os detalhes de cada caso. Você pode ver mais informações clicando no botão de <strong>Detalhes</strong>.',
          element: '#tableContainer',
          position: 'top',
          onBefore: function () {
            Sim.highlight('#tableContainer');
          }
        },
        {
          title: 'Navegação',
          intro: 'Use a paginação para navegar entre os registros quando houver muitos dados.',
          element: '#paginacao',
          position: 'top',
          onBefore: function () {
            Sim.highlight('#paginacao');
          }
        }
      ]
    },

    // ----------------------------------------
    // MINHAS NOTIFICACOES (TECNICO)
    // ----------------------------------------
    'minhas-notificacoes': {
      _default: [
        {
          title: 'Minhas Notificações',
          intro: 'Aqui você vê os <strong>casos das suas escolas</strong> que precisam de atenção ou acompanhamento.',
          element: '[data-tour="header"]',
          position: 'bottom'
        },
        {
          title: 'Lista de Crianças',
          intro: 'Os casos são agrupados por <strong>criança/adolescente</strong>. Cada card mostra um resumo das notificações.',
          element: '#container-grupos',
          position: 'top',
          onBefore: function () {
            // Tenta destacar o primeiro grupo se existir, senão o container
            const firstGroup = document.querySelector('.grupo-header');
            if (firstGroup) {
              Sim.highlight(firstGroup);
            } else {
              Sim.highlight('#container-grupos');
            }
          }
        },
        {
          title: 'Pesquisa e Filtros',
          intro: 'Use a busca para encontrar rapidamente um aluno ou notificação específica.',
          element: '#search-input',
          position: 'bottom',
          onBefore: function () {
            Sim.type('#search-input', 'Busca...', 100);
            setTimeout(() => { document.getElementById('search-input').value = ''; }, 2000);
          }
        }
      ]
    },

    // ----------------------------------------
    // GERENCIAR USUARIOS (ADMIN)
    // ----------------------------------------
    'gerenciar-usuarios': {
      _default: [
        {
          title: 'Gerenciamento de Usuários',
          intro: 'Nesta página você pode <strong>criar, editar e gerenciar</strong> os usuários do sistema NAAM.',
          element: '[data-tour="header"]',
          position: 'bottom'
        },
        {
          title: 'Lista de Usuários',
          intro: 'Veja todos os <strong>usuários cadastrados</strong>, seus papéis e status.',
          element: '[data-tour="tabela-usuarios"]',
          position: 'top',
          onBefore: function () {
            Sim.highlight('[data-tour="tabela-usuarios"]');
          }
        },
        {
          title: 'Criar Novo Usuário',
          intro: 'Clique em <strong>"Criar Usuário"</strong> para adicionar um novo membro ao sistema.',
          element: '[data-tour="btn-criar-usuario"]',
          position: 'left',
          onBefore: function () {
            Sim.highlight('[data-tour="btn-criar-usuario"]');
          }
        }
      ]
    },

    // ----------------------------------------
    // MINHA CONTA
    // ----------------------------------------
    'minha-conta': {
      _default: [
        {
          title: 'Minha Conta',
          intro: 'Bem-vindo à sua <strong>página pessoal</strong>! Aqui você encontra seus dados, ajuda e tutoriais.',
          element: '[data-tour="profile"]',
          position: 'bottom'
        },
        {
          title: 'Abas de Navegação',
          intro: 'Use as <strong>abas</strong> para alternar entre: seu perfil, central de ajuda, vídeos tutoriais e tours do sistema.',
          element: '[data-tour="tabs"]',
          position: 'bottom'
        },
        {
          title: 'Alterar Senha',
          intro: 'Aqui você pode <strong>trocar sua senha</strong> sem precisar pedir ao administrador.',
          element: '[data-tour="change-password"]',
          position: 'top'
        }
      ]
    }
  };

  // ==========================================
  // HELPER FUNCTIONS FOR SIMULATION
  // ==========================================

  const Sim = {
    type: function (selector, text, speed = 50) {
      const el = document.querySelector(selector);
      if (!el) return;
      el.value = '';
      el.focus();
      let i = 0;
      const timer = setInterval(() => {
        if (i < text.length) {
          el.value += text.charAt(i);
          el.dispatchEvent(new Event('input', { bubbles: true }));
          i++;
        } else {
          clearInterval(timer);
          el.blur();
        }
      }, speed);
    },

    click: function (selector) {
      const el = document.querySelector(selector);
      if (el) {
        el.click();
        el.dispatchEvent(new Event('change', { bubbles: true })); // For radios/checkboxes
      }
    },

    select: function (selector, value) {
      const el = document.querySelector(selector);
      if (el) {
        el.value = value;
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
    },

    highlight: function (selector) {
      const el = document.querySelector(selector);
      if (el) {
        el.classList.add('ring-4', 'ring-blue-500', 'ring-opacity-50', 'transition-all', 'duration-500');
        setTimeout(() => el.classList.remove('ring-4', 'ring-blue-500', 'ring-opacity-50'), 2000);
      }
    },

    toast: function (message) {
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] animate-bounce';
      toast.textContent = message;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    }
  };

  // ==========================================
  // STACKING CONTEXT HELPERS
  // ==========================================

  /**
   * Find ALL ancestors that create stacking contexts (trapping child z-index).
   * Properties that create stacking contexts: transform, backdrop-filter, filter,
   * perspective, isolation:isolate, will-change (transform/opacity/filter).
   * Returns array of { element, reason } objects.
   */
  function findStackingContextAncestors(element) {
    var ancestors = [];
    var current = element.parentElement;
    while (current && current !== document.body && current !== document.documentElement) {
      var style = window.getComputedStyle(current);
      var transform = style.transform || style.webkitTransform;
      var backdropFilter = style.backdropFilter || style.webkitBackdropFilter;
      var filter = style.filter;

      if (transform && transform !== 'none') {
        ancestors.push({ element: current, reason: 'transform' });
      } else if (backdropFilter && backdropFilter !== 'none') {
        ancestors.push({ element: current, reason: 'backdrop-filter' });
      } else if (filter && filter !== 'none') {
        ancestors.push({ element: current, reason: 'filter' });
      }
      current = current.parentElement;
    }
    return ancestors;
  }

  /** Track ancestors whose styles were temporarily modified during a tour step. */
  var elevatedAncestors = [];

  /**
   * Restore all previously-modified ancestor styles.
   */
  function restoreElevatedAncestors() {
    elevatedAncestors.forEach(function (entry) {
      entry.props.forEach(function (prop) {
        if (prop.original) {
          entry.element.style[prop.name] = prop.original;
        } else {
          entry.element.style[prop.name] = '';
        }
      });
    });
    elevatedAncestors = [];
  }

  // ==========================================
  // MODULO PRINCIPAL
  // ==========================================

  window.NAAMOnboarding = {

    /**
     * Obter role normalizado do usuário
     */
    getUserRole: function () {
      const role = sessionStorage.getItem('userRole') || 'visualizador';
      return ROLE_MAPPING[role.toLowerCase()] || role.toLowerCase();
    },

    /**
     * Verificar se tour foi completado
     */
    hasCompleted: function (pageName) {
      const role = this.getUserRole();
      const key = STORAGE_PREFIX + pageName + '_' + role;
      return localStorage.getItem(key) === 'true';
    },

    /**
     * Marcar tour como completado
     */
    markCompleted: function (pageName) {
      const role = this.getUserRole();
      const key = STORAGE_PREFIX + pageName + '_' + role;
      localStorage.setItem(key, 'true');
    },

    /**
     * Resetar status de conclusao (para testes)
     */
    resetCompleted: function (pageName) {
      const role = this.getUserRole();
      const key = STORAGE_PREFIX + pageName + '_' + role;
      localStorage.removeItem(key);
    },

    /**
     * Resetar todos os tours
     */
    resetAll: function () {
      const keys = Object.keys(localStorage).filter(k => k.startsWith(STORAGE_PREFIX));
      keys.forEach(k => localStorage.removeItem(k));
      console.log('[NAAM Onboarding] Todos os tours foram resetados');
    },

    /**
     * Obter steps para uma página e role
     */
    getSteps: function (pageName, role) {
      const pageTours = TOURS[pageName];
      if (!pageTours) {
        console.warn('[NAAM Onboarding] Nenhum tour definido para:', pageName);
        return [];
      }

      // Tentar role específico, depois _default
      let steps = pageTours[role] || pageTours['_default'] || [];

      // Filtrar steps cujos elementos existem na página
      return steps.filter(step => {
        if (!step.element) return true; // Step sem elemento (intro geral)
        const el = document.querySelector(step.element);
        if (!el) {
          console.log('[NAAM Onboarding] Elemento não encontrado:', step.element);
          return false;
        }
        return true;
      });
    },

    /**
     * Iniciar tour
     */
    start: function (pageName, forceRestart) {
      // Verificar se Intro.js está carregado
      if (typeof introJs === 'undefined') {
        console.error('[NAAM Onboarding] Intro.js não está carregado!');
        return;
      }

      const role = this.getUserRole();

      // Verificar se já completou (a menos que seja forçado)
      if (!forceRestart && this.hasCompleted(pageName)) {
        console.log('[NAAM Onboarding] Tour já completado para', pageName, role);
        return;
      }

      const steps = this.getSteps(pageName, role);

      if (steps.length === 0) {
        console.log('[NAAM Onboarding] Nenhum step disponível para', pageName, role);
        return;
      }

      console.log('[NAAM Onboarding] Iniciando tour:', pageName, 'Role:', role, 'Steps:', steps.length);

      // Esconder botão de ajuda durante o tour
      const btnAjuda = document.getElementById('btnAjuda');
      if (btnAjuda) {
        btnAjuda.classList.add('tour-active');
      }

      // Configurar e iniciar Intro.js
      const tour = introJs();

      tour.setOptions({
        steps: steps,
        showProgress: true,
        showBullets: true,
        showStepNumbers: false,
        exitOnOverlayClick: false,
        exitOnEsc: true,
        nextLabel: 'Próximo',
        prevLabel: 'Anterior',
        skipLabel: 'Pular',
        doneLabel: 'Concluir',
        hidePrev: true,
        hideNext: false,
        scrollTo: 'tooltip',
        scrollPadding: 120,
        autoPosition: true,
        overlayOpacity: 0, /* CSS Infinite Shadow handles the dimming */
        disableInteraction: false,
        tooltipClass: 'naam-tooltip',
        highlightClass: 'naam-highlight'
      });

      // Evento: Antes de mudar de passo (Simulação)
      let previousTargetElement = null; // Track previous element to restore styles

      tour.onbeforechange(function (targetElement) {
        // Restaurar ancestors elevados do passo anterior
        restoreElevatedAncestors();

        // Restaurar estilos do elemento anterior antes de mudar
        if (previousTargetElement && previousTargetElement !== targetElement) {
          previousTargetElement.style.backgroundColor = '';
          previousTargetElement.style.position = '';
          previousTargetElement.style.zIndex = '';
          previousTargetElement.style.boxShadow = '';
          previousTargetElement.style.borderRadius = '';
        }
        previousTargetElement = targetElement;

        const currentStep = this._introItems[this._currentStep];
        if (currentStep && currentStep.onBefore) {
          // Pequeno delay para garantir que a UI está pronta
          setTimeout(() => {
            currentStep.onBefore();
          }, 500);
        }
      });

      // Evento: Após mudar de passo (Garantir Visibilidade e Centralização)
      tour.onafterchange(function (targetElement) {
        // SPOTLIGHT FIX: Aplicar fundo branco diretamente via JavaScript para garantir visibilidade
        if (targetElement) {
          console.log('[NAAM Onboarding] Aplicando fundo branco e destaque ao elemento:', targetElement);

          // Usar setProperty com 'important' para garantir override total
          targetElement.style.setProperty('background-color', '#ffffff', 'important');
          targetElement.style.setProperty('position', 'relative', 'important');
          targetElement.style.setProperty('z-index', '2147483647', 'important'); // Max Z-Index
          targetElement.style.setProperty('border-radius', '8px', 'important');
          targetElement.style.setProperty('opacity', '1', 'important');
          targetElement.style.setProperty('visibility', 'visible', 'important');
          targetElement.style.setProperty('color', '#1e293b', 'important'); // Texto escuro para contraste

          // Sombra suave para destacar do fundo escuro
          targetElement.style.setProperty('box-shadow', '0 0 0 4px rgba(255, 255, 255, 0.5), 0 4px 20px rgba(0, 0, 0, 0.3)', 'important');

          // STACKING CONTEXT FIX: Neutralize ancestors that create stacking contexts
          // so the focused element's z-index can escape to the root context
          var stackingAncestors = findStackingContextAncestors(targetElement);
          stackingAncestors.forEach(function (entry) {
            console.log('[NAAM Onboarding] Neutralizando stacking context (' + entry.reason + '):', entry.element);

            if (entry.reason === 'backdrop-filter') {
              // Safe to remove — only affects visual blur, not layout/position
              elevatedAncestors.push({
                element: entry.element,
                props: [
                  { name: 'backdropFilter', original: entry.element.style.backdropFilter },
                  { name: 'webkitBackdropFilter', original: entry.element.style.webkitBackdropFilter }
                ]
              });
              entry.element.style.setProperty('backdrop-filter', 'none', 'important');
              entry.element.style.setProperty('-webkit-backdrop-filter', 'none', 'important');
            } else if (entry.reason === 'filter') {
              elevatedAncestors.push({
                element: entry.element,
                props: [{ name: 'filter', original: entry.element.style.filter }]
              });
              entry.element.style.setProperty('filter', 'none', 'important');
            } else if (entry.reason === 'transform') {
              // Can't remove transform (breaks positioning), so elevate z-index instead
              elevatedAncestors.push({
                element: entry.element,
                props: [{ name: 'zIndex', original: entry.element.style.zIndex }]
              });
              entry.element.style.setProperty('z-index', '9999998', 'important');

              // Also elevate the modal overlay sibling if present
              var modalOverlay = entry.element.previousElementSibling;
              if (modalOverlay && modalOverlay.classList.contains('alert-dialog-overlay')) {
                elevatedAncestors.push({
                  element: modalOverlay,
                  props: [{ name: 'zIndex', original: modalOverlay.style.zIndex }]
                });
                modalOverlay.style.setProperty('z-index', '9999997', 'important');
              }
            }
          });
        }

        setTimeout(() => {
          const tooltip = document.querySelector('.introjs-tooltip');
          const helperLayer = document.querySelector('.introjs-helperLayer');

          if (!tooltip) return;

          const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
          const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
          const padding = 20;

          // Obter retângulos
          const tooltipRect = tooltip.getBoundingClientRect();
          const targetRect = helperLayer ? helperLayer.getBoundingClientRect() : null;

          // Calcular bounding box combinado (tooltip + target)
          let combinedTop, combinedBottom, combinedLeft, combinedRight;

          if (targetRect) {
            combinedTop = Math.min(tooltipRect.top, targetRect.top);
            combinedBottom = Math.max(tooltipRect.bottom, targetRect.bottom);
            combinedLeft = Math.min(tooltipRect.left, targetRect.left);
            combinedRight = Math.max(tooltipRect.right, targetRect.right);
          } else {
            combinedTop = tooltipRect.top;
            combinedBottom = tooltipRect.bottom;
            combinedLeft = tooltipRect.left;
            combinedRight = tooltipRect.right;
          }

          const combinedHeight = combinedBottom - combinedTop;
          const combinedWidth = combinedRight - combinedLeft;

          // Calcular centro ideal do viewport
          const viewportCenterY = viewportHeight / 2;
          const viewportCenterX = viewportWidth / 2;

          // Calcular centro atual do conjunto
          const combinedCenterY = combinedTop + (combinedHeight / 2);
          const combinedCenterX = combinedLeft + (combinedWidth / 2);

          // Calcular deslocamento necessário para centralizar
          let scrollY = 0;
          let scrollX = 0;

          // Verifica se cabe na tela verticalmente
          if (combinedHeight <= (viewportHeight - padding * 2)) {
            // Cabe! Centralizar verticalmente
            scrollY = combinedCenterY - viewportCenterY;
          } else {
            // Não cabe. Priorizar tooltip no topo visível
            const tooltipDeltaFromTop = tooltipRect.top - padding;
            scrollY = tooltipDeltaFromTop;
          }

          // Verifica se cabe na tela horizontalmente
          if (combinedWidth <= (viewportWidth - padding * 2)) {
            // Cabe! Centralizar horizontalmente
            scrollX = combinedCenterX - viewportCenterX;
          } else {
            // Não cabe. Priorizar tooltip visível à esquerda
            const tooltipDeltaFromLeft = tooltipRect.left - padding;
            scrollX = tooltipDeltaFromLeft;
          }

          // Verificar se a tooltip está cortada (prioridade absoluta)
          const tooltipCutOff = (
            tooltipRect.top < padding ||
            tooltipRect.left < padding ||
            tooltipRect.bottom > (viewportHeight - padding) ||
            tooltipRect.right > (viewportWidth - padding)
          );

          if (tooltipCutOff || Math.abs(scrollY) > 50 || Math.abs(scrollX) > 50) {
            // Scroll suave para centralizar ou corrigir
            window.scrollBy({
              top: scrollY,
              left: scrollX,
              behavior: 'smooth'
            });
            console.log('[NAAM Onboarding] Ajuste de centralização/visibilidade aplicado.');
          }
        }, 350);
      });

      // Evento: Tour concluído
      tour.oncomplete(() => {
        this.markCompleted(pageName);
        console.log('[NAAM Onboarding] Tour concluído:', pageName);
        if (btnAjuda) {
          btnAjuda.classList.remove('tour-active');
        }
        this.showCompletionMessage();

        // Restaurar ancestors elevados
        restoreElevatedAncestors();

        // Restaurar estilos do último elemento destacado
        if (previousTargetElement) {
          previousTargetElement.style.backgroundColor = '';
          previousTargetElement.style.position = '';
          previousTargetElement.style.zIndex = '';
          previousTargetElement.style.boxShadow = '';
          previousTargetElement.style.borderRadius = '';
        }
      });

      // Evento: Tour cancelado (pular)
      tour.onexit(() => {
        this.markCompleted(pageName);
        console.log('[NAAM Onboarding] Tour pulado:', pageName);
        if (btnAjuda) {
          btnAjuda.classList.remove('tour-active');
        }

        // Restaurar ancestors elevados
        restoreElevatedAncestors();

        // Restaurar estilos do último elemento destacado
        if (previousTargetElement) {
          previousTargetElement.style.backgroundColor = '';
          previousTargetElement.style.position = '';
          previousTargetElement.style.zIndex = '';
          previousTargetElement.style.boxShadow = '';
          previousTargetElement.style.borderRadius = '';
        }
      });

      // Iniciar
      tour.start();
    },

    /**
     * Reiniciar tour (botão de ajuda)
     */
    restart: function (pageName) {
      this.start(pageName, true);
    },

    /**
     * Mostrar mensagem de conclusão
     */
    showCompletionMessage: function () {
      // Criar toast de conclusão
      const toast = document.createElement('div');
      toast.className = 'onboarding-completion-toast';
      toast.innerHTML = `
        <div class="toast-content">
          <span class="toast-icon">✅</span>
          <span class="toast-text">Tutorial concluído! Use o botão <strong>"Ajuda"</strong> para rever a qualquer momento.</span>
        </div>
      `;

      // Estilos inline para o toast
      toast.style.cssText = `
        position: fixed;
        bottom: 90px;
        right: 24px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 30px rgba(16, 185, 129, 0.4);
        z-index: 10000;
        font-family: 'Inter', system-ui, sans-serif;
        font-size: 0.95rem;
        max-width: 320px;
        animation: slideInRight 0.3s ease-out;
      `;

      // Adicionar keyframes se não existir
      if (!document.getElementById('onboarding-animations')) {
        const style = document.createElement('style');
        style.id = 'onboarding-animations';
        style.textContent = `
          @keyframes slideInRight {
            from { opacity: 0; transform: translateX(50px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes slideOutRight {
            from { opacity: 1; transform: translateX(0); }
            to { opacity: 0; transform: translateX(50px); }
          }
        `;
        document.head.appendChild(style);
      }

      document.body.appendChild(toast);

      // Remover após 5 segundos
      setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out forwards';
        setTimeout(() => toast.remove(), 300);
      }, 5000);
    },

    /**
     * Criar botão de ajuda flutuante
     */
    createHelpButton: function (pageName) {
      // Verificar se já existe
      if (document.getElementById('btnAjuda')) {
        return;
      }

      const btn = document.createElement('button');
      btn.id = 'btnAjuda';
      btn.className = 'btn-ajuda-flutuante';
      btn.title = 'Rever tutorial';
      btn.innerHTML = '<span class="icon">❓</span> <span>Ajuda</span>';

      btn.addEventListener('click', () => {
        this.restart(pageName);
      });

      document.body.appendChild(btn);
    },

    /**
     * Inicializar onboarding para uma página
     */
    init: function (pageName) {
      console.log('[NAAM Onboarding] Inicializando para:', pageName);

      // Criar botão de ajuda
      this.createHelpButton(pageName);

      // Verificar se deve iniciar automaticamente
      if (!this.hasCompleted(pageName)) {
        // Aguardar carregamento da página
        setTimeout(() => {
          this.start(pageName);
        }, AUTO_START_DELAY);
      } else {
        console.log('[NAAM Onboarding] Tour já completado, botão de ajuda disponível');
      }
    }
  };

  // Log de carregamento
  console.log('[NAAM Onboarding] Módulo carregado com sucesso');

})();
