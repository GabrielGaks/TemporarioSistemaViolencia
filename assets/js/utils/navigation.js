/**
 * SISTEMA DE NAVEGACAO POR PERFIL - NAAM
 * Renderiza menus personalizados baseados no perfil (role) do usuario logado.
 *
 * Perfis suportados:
 * - visualizador: Apenas visualiza o painel de casos
 * - estagiario/user: Painel, Novo Registro, Gerenciar Registros
 * - tecnico: Painel, Novo Registro, Minhas Notificacoes
 * - admin/superuser: Painel, Painel Admin
 *
 * O botao "Sair" esta SEMPRE visivel para todos os usuarios.
 */

window.NAVMNavigation = (function () {
  'use strict';

  // ========================================
  // CONFIGURACAO DE PERMISSOES POR PERFIL
  // ========================================
  const MENU_CONFIG = {
    // Todos os usuarios veem o Painel de Casos
    painelCasos: {
      href: 'painel-casos.html',
      icon: String.fromCodePoint(0x1F4CA), // 📊
      label: 'Painel de Casos',
      roles: ['visualizador', 'estagiario', 'user', 'tecnico', 'admin', 'superuser'],
      bgClass: 'bg-blue-500',
      hoverClass: 'hover:bg-blue-400',
      activeClass: 'bg-white text-blue-600 shadow-md hover:shadow-lg',
      tourId: 'menu-painel'
    },
    // Estagiario e Tecnico podem criar novos registros
    novoRegistro: {
      href: 'registro-novo-caso.html',
      icon: String.fromCodePoint(0x1F4DD), // 📝
      label: 'Novo Registro',
      roles: ['estagiario', 'user', 'tecnico', 'superuser'],
      bgClass: 'bg-blue-500',
      hoverClass: 'hover:bg-blue-400',
      activeClass: 'bg-white text-blue-600 shadow-md hover:shadow-lg',
      tourId: 'menu-novo-registro'
    },
    // Apenas Estagiario pode gerenciar registros
    gerenciarRegistros: {
      href: 'gerenciar-casos.html',
      icon: String.fromCodePoint(0x1F4CB), // 📋
      label: 'Gerenciar Registros',
      roles: ['estagiario', 'user', 'superuser'],
      bgClass: 'bg-blue-500',
      hoverClass: 'hover:bg-blue-400',
      activeClass: 'bg-white text-blue-600 shadow-md hover:shadow-lg',
      tourId: 'menu-gerenciar'
    },
    // Apenas Tecnico ve Minhas Notificacoes
    minhasNotificacoes: {
      href: 'minhas-notificacoes.html',
      icon: String.fromCodePoint(0x1F514), // 🔔
      label: 'Minhas Notificacoes',
      roles: ['tecnico', 'superuser'],
      bgClass: 'bg-purple-500',
      hoverClass: 'hover:bg-purple-400',
      activeClass: 'bg-white text-purple-600 shadow-md hover:shadow-lg',
      tourId: 'menu-notificacoes'
    },
    // Apenas Admin/Superuser ve Painel Admin
    painelAdmin: {
      href: 'gerenciar-usuarios.html',
      icon: String.fromCodePoint(0x1F527), // 🔧
      label: 'Painel Admin',
      roles: ['admin', 'superuser'],
      bgClass: 'bg-blue-500',
      hoverClass: 'hover:bg-blue-400',
      activeClass: 'bg-white text-blue-600 shadow-md hover:shadow-lg',
      tourId: 'menu-admin'
    },
    // Todos os usuarios veem Minha Conta
    minhaConta: {
      href: 'minha-conta.html',
      icon: String.fromCodePoint(0x1F464), // 👤
      label: 'Minha Conta',
      roles: ['visualizador', 'estagiario', 'user', 'tecnico', 'admin', 'superuser'],
      bgClass: 'bg-gray-600',
      hoverClass: 'hover:bg-gray-500',
      activeClass: 'bg-white text-gray-700 shadow-md hover:shadow-lg',
      tourId: 'menu-minha-conta'
    }
  };

  // ========================================
  // VERIFICACAO DE ACESSO POR PAGINA
  // ========================================
  const PAGE_PERMISSIONS = {
    'painel-casos.html': ['visualizador', 'estagiario', 'user', 'tecnico', 'admin', 'superuser'],
    'registro-novo-caso.html': ['estagiario', 'user', 'tecnico', 'superuser'],
    'gerenciar-casos.html': ['estagiario', 'user', 'superuser', 'tecnico'],
    'minhas-notificacoes.html': ['tecnico', 'superuser'],
    'gerenciar-usuarios.html': ['admin', 'superuser'],
    'minha-conta.html': ['visualizador', 'estagiario', 'user', 'tecnico', 'admin', 'superuser']
  };

  // ========================================
  // FUNCOES AUXILIARES
  // ========================================

  /**
   * Obtem o role do usuario logado
   */
  function getUserRole() {
    return sessionStorage.getItem('userRole') || null;
  }

  /**
   * Obtem o email do usuario logado
   */
  function getUserEmail() {
    return sessionStorage.getItem('userEmail') || null;
  }

  /**
   * Verifica se o usuario tem permissao para um item de menu
   */
  function hasPermission(roles) {
    const userRole = getUserRole();
    return userRole && roles.includes(userRole);
  }

  /**
   * Obtem a pagina atual
   */
  function getCurrentPage() {
    const path = window.location.pathname;
    return path.substring(path.lastIndexOf('/') + 1) || 'index.html';
  }

  /**
   * Verifica se o usuario e admin
   */
  function isAdmin() {
    const role = getUserRole();
    return role === 'admin' || role === 'superuser';
  }

  /**
   * Verifica se o usuario e tecnico
   */
  function isTecnico() {
    return getUserRole() === 'tecnico';
  }

  /**
   * Verifica se o usuario e estagiario
   */
  function isEstagiario() {
    const role = getUserRole();
    return role === 'estagiario' || role === 'user';
  }

  /**
   * Verifica se o usuario e visualizador
   */
  function isVisualizador() {
    return getUserRole() === 'visualizador';
  }

  // ========================================
  // VERIFICACAO DE ACESSO
  // ========================================

  /**
   * Verifica se o usuario pode acessar a pagina atual
   * Redireciona para painel-casos se nao tiver permissao
   */
  function verificarAcesso(rolesPermitidos) {
    const userRole = getUserRole();

    if (!userRole) {
      // Nao logado - redireciona para login
      window.location.href = 'index.html';
      return false;
    }

    if (rolesPermitidos && !rolesPermitidos.includes(userRole)) {
      // Sem permissao - redireciona para painel
      alert('Voce nao tem permissao para acessar esta pagina.');
      window.location.href = 'painel-casos.html';
      return false;
    }

    return true;
  }

  /**
   * Verifica acesso automaticamente baseado na pagina atual
   */
  function verificarAcessoAutomatico() {
    const currentPage = getCurrentPage();
    const allowedRoles = PAGE_PERMISSIONS[currentPage];

    if (allowedRoles) {
      return verificarAcesso(allowedRoles);
    }

    // Se a pagina nao esta no mapa, permite acesso (ex: index.html)
    return true;
  }

  // ========================================
  // RENDERIZACAO DO MENU
  // ========================================

  /**
   * Gera os itens de menu baseados no perfil do usuario
   */
  function getMenuItems() {
    const userRole = getUserRole();
    const currentPage = getCurrentPage();
    const menuItems = [];

    // Itera sobre a configuracao do menu
    Object.keys(MENU_CONFIG).forEach(key => {
      const config = MENU_CONFIG[key];

      // Verifica se o usuario tem permissao para ver este item
      if (hasPermission(config.roles)) {
        const isActive = config.href === currentPage;

        menuItems.push({
          ...config,
          isActive: isActive,
          key: key
        });
      }
    });

    return menuItems;
  }

  /**
   * Renderiza o menu desktop
   */
  function renderDesktopMenu(containerId) {
    const container = document.getElementById(containerId) || document.querySelector('.desktop-menu');
    if (!container) {
      console.warn('[NAVMNavigation] Container do menu desktop nao encontrado');
      return;
    }

    const menuItems = getMenuItems();
    const currentPage = getCurrentPage();

    // Limpa o container
    container.innerHTML = '';

    // Renderiza cada item
    menuItems.forEach(item => {
      const element = document.createElement('a');
      element.href = item.href;

      // Adiciona data-tour para o sistema de onboarding
      if (item.tourId) {
        element.setAttribute('data-tour', item.tourId);
      }

      // Define classes baseado se esta ativo ou nao
      if (item.isActive) {
        element.className = `px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${item.activeClass}`;
      } else {
        element.className = `px-5 py-2.5 ${item.bgClass} text-white rounded-lg text-sm font-semibold ${item.hoverClass} transition-all`;

      }

      element.innerHTML = `${item.icon} ${item.label}`;

      // Adiciona badge de notificacoes se for Minhas Notificacoes (desktop)
      if (item.key === 'minhasNotificacoes') {
        element.style.position = 'relative';
        const badge = document.createElement('span');
        badge.id = 'badge-notif-desktop';
        badge.setAttribute('data-tour', 'badge-notificacoes');
        badge.className = 'hidden absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold';
        badge.textContent = '0';
        element.appendChild(badge);
      }

      container.appendChild(element);
    });

    // Adiciona botao Sair (SEMPRE visivel)
    const btnSair = document.createElement('button');
    btnSair.id = 'btnSair';
    btnSair.onclick = sair;
    btnSair.className = 'px-5 py-2.5 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-all';
    btnSair.innerHTML = `${String.fromCodePoint(0x1F6AA)} Sair`; // 🚪
    container.appendChild(btnSair);
  }

  /**
   * Renderiza o menu mobile
   */
  function renderMobileMenu(containerId) {
    const container = document.getElementById(containerId) || document.querySelector('#mobileMenuNav .flex.flex-col');
    if (!container) {
      console.warn('[NAVMNavigation] Container do menu mobile nao encontrado');
      return;
    }

    const menuItems = getMenuItems();
    const currentPage = getCurrentPage();

    // Limpa o container
    container.innerHTML = '';

    // Renderiza cada item
    menuItems.forEach(item => {
      const element = document.createElement('a');
      element.href = item.href;

      // Define classes para mobile
      if (item.isActive) {
        element.className = `px-5 py-3 bg-white text-blue-600 rounded-lg text-sm font-semibold shadow-md text-center border-2 border-blue-500`;
        if (item.key === 'minhasNotificacoes') {
          element.className = `px-5 py-3 bg-white text-purple-600 rounded-lg text-sm font-semibold shadow-md text-center border-2 border-purple-500`;
        }
      } else {
        element.className = `px-5 py-3 ${item.bgClass} text-white rounded-lg text-sm font-semibold ${item.hoverClass} transition-all text-center`;

      }

      element.innerHTML = `${item.icon} ${item.label}`;

      // Adiciona badge de notificacoes se for Minhas Notificacoes (mobile)
      if (item.key === 'minhasNotificacoes') {
        element.style.position = 'relative';
        element.setAttribute('data-tour', item.tourId);
        const badge = document.createElement('span');
        badge.id = 'badge-notif-mobile';
        badge.className = 'hidden absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold';
        badge.textContent = '0';
        element.appendChild(badge);
      }

      container.appendChild(element);
    });

    // Adiciona botao Sair (SEMPRE visivel)
    const btnSair = document.createElement('button');
    btnSair.id = 'btnSairMobile';
    btnSair.onclick = sair;
    btnSair.className = 'px-5 py-3 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-all text-center';
    btnSair.innerHTML = `${String.fromCodePoint(0x1F6AA)} Sair`; // 🚪
    container.appendChild(btnSair);
  }

  /**
   * Renderiza ambos os menus (desktop e mobile)
   */
  function renderMenus() {
    renderDesktopMenu();
    renderMobileMenu();
    console.log('[NAVMNavigation] Menus renderizados para role:', getUserRole());
  }

  /**
   * Inicializa o sistema de navegacao
   * - Verifica acesso
   * - Renderiza menus
   */
  function init() {
    // Verifica acesso automaticamente
    if (!verificarAcessoAutomatico()) {
      return false;
    }

    // Renderiza menus
    renderMenus();

    return true;
  }

  // ========================================
  // FUNCAO SAIR (LOGOUT)
  // ========================================
  function sair() {
    // Limpa sessionStorage
    sessionStorage.clear();

    // Limpa localStorage para garantir que nada persista (como caches de notificação)
    localStorage.clear();

    // Limpa localStorage de cache via DataCache se existir (redundante mas seguro)
    if (window.DataCache && typeof window.DataCache.clearAll === 'function') {
      window.DataCache.clearAll();
    }

    // Redireciona para login
    window.location.href = 'index.html';
  }

  // Expoe a funcao sair globalmente para os onclick
  window.sair = sair;

  // ========================================
  // API PUBLICA
  // ========================================
  return {
    init: init,
    verificarAcesso: verificarAcesso,
    verificarAcessoAutomatico: verificarAcessoAutomatico,
    renderMenus: renderMenus,
    renderDesktopMenu: renderDesktopMenu,
    renderMobileMenu: renderMobileMenu,
    getMenuItems: getMenuItems,
    getUserRole: getUserRole,
    getUserEmail: getUserEmail,
    isAdmin: isAdmin,
    isTecnico: isTecnico,
    isEstagiario: isEstagiario,
    isVisualizador: isVisualizador,
    hasPermission: hasPermission,
    sair: sair,
    PAGE_PERMISSIONS: PAGE_PERMISSIONS
  };

})();

// Auto-inicializacao quando o DOM estiver pronto (opcional)
// Comentado para permitir inicializacao manual quando necessario
// document.addEventListener('DOMContentLoaded', function() {
//   window.NAVMNavigation.init();
// });
