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
    // 1. NAVEGAÇÃO PRINCIPAL (Esquerda)
    painelCasos: {
      href: 'painel-casos.html',
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>',
      label: 'Painel',
      roles: ['visualizador', 'estagiario', 'user', 'tecnico', 'admin', 'superuser'],
      type: 'nav-item',
      category: 'navigation',
      tourId: 'menu-painel'
    },
    gerenciarRegistros: {
      href: 'gerenciar-casos.html',
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>',
      label: 'Gerenciar',
      roles: ['estagiario', 'user', 'superuser'],
      type: 'nav-item',
      category: 'navigation',
      tourId: 'menu-gerenciar'
    },
    painelAdmin: {
      href: 'gerenciar-usuarios.html',
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>',
      label: 'Admin',
      roles: ['admin', 'superuser'],
      type: 'nav-item',
      category: 'navigation',
      tourId: 'menu-admin'
    },

    // 2. AÇÕES SECUNDÁRIAS (Direita, antes do botão principal)
    minhasNotificacoes: {
      href: 'minhas-notificacoes.html',
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>',
      label: 'Notificações',
      roles: ['tecnico', 'superuser'],
      type: 'action-item',
      category: 'action',
      tourId: 'menu-notificacoes'
    },
    minhaConta: {
      href: 'minha-conta.html',
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>',
      label: 'Perfil',
      roles: ['visualizador', 'estagiario', 'user', 'tecnico', 'admin', 'superuser'],
      type: 'action-item',
      category: 'action',
      tourId: 'menu-minha-conta'
    },

    // 3. AÇÃO PRINCIPAL (Destaque total)
    novoRegistro: {
      href: 'registro-novo-caso.html',
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>',
      label: 'Novo Registro',
      roles: ['estagiario', 'user', 'tecnico', 'superuser'],
      type: 'primary-button',
      category: 'primary',
      tourId: 'menu-novo-registro'
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

    // Configura container para gap maior e largura total
    container.className = 'desktop-menu flex items-center gap-2 w-full';

    // 1. Renderiza itens de NAVEGAÇÃO
    const navItems = menuItems.filter(i => i.category === 'navigation');
    navItems.forEach(item => container.appendChild(createMenuElement(item)));

    // 2. Separador Flexível (Empurra o resto para a direita)
    const spacer = document.createElement('div');
    spacer.className = 'flex-1';
    container.appendChild(spacer);

    // 3. Renderiza itens de AÇÃO (Notificações, Perfil)
    const actionItems = menuItems.filter(i => i.category === 'action');
    actionItems.forEach(item => container.appendChild(createMenuElement(item)));

    // 4. Divisor Vertical
    const divider = document.createElement('div');
    divider.className = 'h-6 w-px bg-slate-200 mx-2';
    container.appendChild(divider);

    // 5. Renderiza BOTÃO PRIMÁRIO (Novo Registro)
    const primaryItems = menuItems.filter(i => i.category === 'primary');
    primaryItems.forEach(item => container.appendChild(createMenuElement(item)));

    function createMenuElement(item) {
      const element = document.createElement('a');
      element.href = item.href;

      if (item.tourId) {
        element.setAttribute('data-tour', item.tourId);
      }

      // ESTILOS MODERNOS SAAS
      if (item.type === 'primary-button') {
        // Botão Primário (Novo Registro)
        element.className = 'group flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-blue-700 hover:shadow-md transition-all active:transform active:scale-95 ml-2';
        element.innerHTML = `${item.icon} <span>${item.label}</span>`;
      } else if (item.type === 'action-item') {
        // Itens de Ação (Ícones com Texto discreto)
        if (item.isActive) {
          element.className = 'flex items-center gap-2 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg text-sm font-semibold transition-all';
        } else {
          element.className = 'flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg text-sm font-medium transition-all';
        }
        element.innerHTML = `${item.icon} <span>${item.label}</span>`;
      } else {
        // Item de Navegação (Links)
        if (item.isActive) {
          // Ativo: Texto colorido
          element.className = 'group flex items-center gap-2 px-3 py-2 text-blue-600 bg-blue-50/50 rounded-lg text-sm font-bold transition-all';
        } else {
          // Inativo: Texto cinza
          element.className = 'group flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded-lg text-sm font-medium transition-all';
        }
        element.innerHTML = `${item.icon} <span>${item.label}</span>`;
      }

      // Adiciona badge de notificacoes
      if (item.key === 'minhasNotificacoes') {
        element.style.position = 'relative';
        const badge = document.createElement('span');
        badge.id = 'badge-notif-desktop';
        badge.setAttribute('data-tour', 'badge-notificacoes');
        badge.className = 'hidden absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold ring-2 ring-white';
        badge.textContent = '0';
        element.appendChild(badge);
      }

      return element;
    }

    // Adiciona botao Sair (Botão Ghost Discreto)
    const btnSair = document.createElement('button');
    btnSair.id = 'btnSair';
    btnSair.onclick = sair;
    btnSair.className = 'flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium transition-all ml-2 border-l border-slate-200 pl-4';
    // Ícone de Door Open SVG
    const sairIcon = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>';
    btnSair.innerHTML = `${sairIcon} <span>Sair</span>`;
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

      // Adiciona data-tour para o sistema de onboarding
      if (item.tourId) {
        element.setAttribute('data-tour', item.tourId);
      }

      // Estilos para Mobile - Adaptado para os novos ícones
      if (item.isActive) {
        element.className = 'flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold border-l-4 border-blue-600';
      } else {
        element.className = 'flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg text-sm font-medium transition-colors border-l-4 border-transparent';
      }

      // Se for botão primário no desktop, no mobile damos um destaque sutil também
      if (item.type === 'primary-button' && !item.isActive) {
        element.className = 'flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 mt-2 mb-2 justify-center';
      }

      element.innerHTML = `${item.icon} <span>${item.label}</span>`;

      // Adiciona badge de notificacoes se for Minhas Notificacoes (mobile)
      if (item.key === 'minhasNotificacoes') {
        element.style.position = 'relative';
        element.setAttribute('data-tour', item.tourId);
        const badge = document.createElement('span');
        badge.id = 'badge-notif-mobile';
        badge.className = 'hidden absolute top-3 right-4 bg-rose-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold';
        badge.textContent = '0';
        element.appendChild(badge);
      }

      container.appendChild(element);
    });

    // Adiciona botao Sair (SEMPRE visivel)
    const btnSair = document.createElement('button');
    btnSair.id = 'btnSairMobile';
    btnSair.onclick = sair;
    btnSair.className = 'flex items-center gap-3 w-full px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-all mt-2 border-t border-slate-100';

    // Ícone Sair
    const sairIcon = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>';

    btnSair.innerHTML = `${sairIcon} <span>Sair do Sistema</span>`;
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
