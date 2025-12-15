// ========================================
// ARQUIVO DE CONFIGURAÇÃO CENTRALIZADA
// ========================================
// ATENÇÃO: Após alterar este arquivo, limpe o cache do navegador (Ctrl+Shift+Delete)
// ou use Ctrl+F5 para forçar o reload das páginas
//
// ⚠️ SEGURANÇA: Este arquivo contém credenciais sensíveis.
// NUNCA faça commit deste arquivo com credenciais reais no GitHub.
// Use variáveis de ambiente ou crie um config.local.js (adicionado ao .gitignore)
// ========================================

// Função auxiliar para obter variáveis de ambiente ou valores padrão
function getEnvVar(key, defaultValue) {
  // Tenta obter de variáveis de ambiente (se disponível)
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  // Tenta obter de window (para uso em navegador com polyfill)
  if (typeof window !== 'undefined' && window.ENV && window.ENV[key]) {
    return window.ENV[key];
  }
  // Retorna valor padrão
  return defaultValue;
}

const CONFIG = {
  
  // ========================================
  // GOOGLE APPS SCRIPT - URLs dos Web Apps
  // ========================================
  // 
  // ⚠️ IMPORTANTE: Substitua pelos seus valores reais ou use variáveis de ambiente
  // Para produção, configure via variáveis de ambiente ou arquivo config.local.js
  // ========================================
  
  // URL para AUTENTICAÇÃO (Login e Gerenciamento de Usuários)
  // Usado em: login.html, gerenciar-usuarios.html
  // Encontre em: Apps Script (projeto Auth) > Implantar > Implantar como aplicativo da Web
  // ⚠️ SEGURANÇA: Use getEnvVar() ou config.local.js para produção
  APPS_SCRIPT_AUTH: getEnvVar('APPS_SCRIPT_AUTH_URL', (function() {
    // Tenta carregar de config.local.js se existir
    if (typeof window !== 'undefined' && window.CONFIG_LOCAL && window.CONFIG_LOCAL.APPS_SCRIPT_AUTH) {
      return window.CONFIG_LOCAL.APPS_SCRIPT_AUTH;
    }
    // Valor padrão (substitua em produção)
    return 'https://script.google.com/macros/s/AKfycbyonzyLsu5EpohK2e6ZyvePjlzo2I__WP8XAbDJUsCVm5BPAFY09VC8-ohjfr8MnukE/exec';
  })()),
  
  // URL para CASOS (Cadastro, Edição e Listagem de Casos)
  // Usado em: registro-novo-caso.html, gerenciar-casos.html, painel-casos.html
  // Encontre em: Apps Script (projeto Casos) > Implantar > Implantar como aplicativo da Web
  // ⚠️ SEGURANÇA: Use getEnvVar() ou config.local.js para produção
  APPS_SCRIPT_CASOS: getEnvVar('APPS_SCRIPT_CASOS_URL', (function() {
    // Tenta carregar de config.local.js se existir
    if (typeof window !== 'undefined' && window.CONFIG_LOCAL && window.CONFIG_LOCAL.APPS_SCRIPT_CASOS) {
      return window.CONFIG_LOCAL.APPS_SCRIPT_CASOS;
    }
    // Valor padrão (substitua em produção)
    return 'https://script.google.com/macros/s/AKfycbxeLPC5t_wzsjyq4yg4HPyktGZ_jVdXUUsZOTaUXn0qSaQHiBLeKb6UUZi07UZ9RbxS/exec';
  })()),
  
  
  // ========================================
  // GOOGLE SHEETS - IDs das Planilhas
  // ========================================
  // 
  // ⚠️ IMPORTANTE: Substitua pelos seus valores reais ou use variáveis de ambiente
  // ========================================
  
  // ID da planilha principal (casos de violência)
  // Extrair da URL: https://docs.google.com/spreadsheets/d/SEU_ID_AQUI/edit
  // ⚠️ IMPORTANTE: Para o painel funcionar, configure este ID
  // A planilha deve estar compartilhada como "Qualquer pessoa com o link pode visualizar"
  // ⚠️ SEGURANÇA: Use getEnvVar() ou config.local.js para produção
  SPREADSHEET_ID: getEnvVar('SPREADSHEET_ID', (function() {
    if (typeof window !== 'undefined' && window.CONFIG_LOCAL && window.CONFIG_LOCAL.SPREADSHEET_ID) {
      return window.CONFIG_LOCAL.SPREADSHEET_ID;
    }
    return '1A6a2ZLiHegPJBDpE3YLPGsa8RXVRLjpkXmKdauSlb9Y';
  })()),
  
  // Nome da aba na planilha de casos
  SHEET_NAME: getEnvVar('SHEET_NAME', 'Página1'),
  
  // ID da planilha de usuários (login/permissões) - SE FOR DIFERENTE
  SPREADSHEET_ID_USUARIOS: getEnvVar('SPREADSHEET_ID_USUARIOS', 'SEU_ID_DA_PLANILHA_USUARIOS_AQUI'),
  
  // Nome da aba na planilha de usuários
  SHEET_NAME_USUARIOS: getEnvVar('SHEET_NAME_USUARIOS', 'Usuários'),
  
  
  // ========================================
  // SUPABASE (se estiver usando)
  // ========================================
  // 
  // ⚠️ IMPORTANTE: Substitua pelos seus valores reais ou use variáveis de ambiente
  // NUNCA exponha a chave do Supabase publicamente
  // ⚠️ Para produção, substitua pelas suas credenciais reais do Supabase se necessário
  // ========================================
  // ⚠️ SEGURANÇA: Use getEnvVar() ou config.local.js para produção
  SUPABASE_URL: getEnvVar('SUPABASE_URL', (function() {
    if (typeof window !== 'undefined' && window.CONFIG_LOCAL && window.CONFIG_LOCAL.SUPABASE_URL) {
      return window.CONFIG_LOCAL.SUPABASE_URL;
    }
    return 'https://aepdbpkrkokcnhfljury.supabase.co';
  })()),
  SUPABASE_KEY: getEnvVar('SUPABASE_ANON_KEY', (function() {
    if (typeof window !== 'undefined' && window.CONFIG_LOCAL && window.CONFIG_LOCAL.SUPABASE_KEY) {
      return window.CONFIG_LOCAL.SUPABASE_KEY;
    }
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlcGRicGtya29rY25oZmxqdXJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMzNTMyNzksImV4cCI6MjA0ODkyOTI3OX0.c3tNJlglLzp7gUUKEvhHrqYJOvwUr1B2JzT0JV5p2uI';
  })()),

  // ========================================
  // CONFIGURAÇÕES DA APLICAÇÃO
  // ========================================
  APP_NAME: 'Sistema de Registro de Violência Escolar',
  APP_VERSION: '2.0',
  
  // URL base do site em produção (para links de email)
  // Exemplo: 'https://seu-usuario.github.io/seu-repo' ou 'https://seudominio.com'
  // ⚠️ IMPORTANTE: Configure com a URL real do seu site em produção
  BASE_URL: getEnvVar('BASE_URL', 'https://gabrielgaks.github.io/sistema-registro-violencia/FormularioRegistroV2'),
  
  // Timeout para requisições (em milissegundos)
  REQUEST_TIMEOUT: 30000,  // 30 segundos
  
  // Duração de alertas automáticos (em milissegundos)
  ALERT_DURATION: 5000,  // 5 segundos

  // ========================================
  // PAGINAÇÃO
  // ========================================
  // Número padrão de itens por página
  DEFAULT_ITEMS_PER_PAGE: 25,
  
  // Opções disponíveis no select de itens por página
  ITEMS_PER_PAGE_OPTIONS: [10, 25, 50, 100],

  // ========================================
  // VALIDAÇÕES
  // ========================================
  // Idade mínima e máxima permitida
  MIN_AGE: 0,
  MAX_AGE: 25,
  
  // Número máximo de caracteres em campos de texto
  MAX_TEXT_LENGTH: 500,

  // ========================================
  // ROTAS/PÁGINAS
  // ========================================
  PAGES: {
    LOGIN: 'index.html',
    REGISTRO: 'registro-novo-caso.html',
    GERENCIAR_CASOS: 'gerenciar-casos.html',
    GERENCIAR_USUARIOS: 'gerenciar-usuarios.html',
    PAINEL: 'painel-casos.html'
  },

  // ========================================
  // ROLES/PERMISSÕES
  // ========================================
  ROLES: {
    SUPERUSER: 'superuser',
    ADMIN: 'admin',
    USER: 'user'
  },

  // ========================================
  // MENSAGENS DO SISTEMA
  // ========================================
  MESSAGES: {
    SUCCESS: {
      SAVE: '✅ Registro salvo com sucesso!',
      UPDATE: '✅ Registro atualizado com sucesso!',
      DELETE: '🗑️ Registro excluído com sucesso!',
      LOGIN: '✅ Login realizado com sucesso!'
    },
    ERROR: {
      REQUIRED_FIELDS: '❌ Preencha todos os campos obrigatórios!',
      NETWORK: '❌ Erro de conexão. Verifique sua internet.',
      UNAUTHORIZED: '❌ Acesso não autorizado. Faça login novamente.',
      GENERIC: '❌ Ocorreu um erro. Tente novamente.'
    },
    INFO: {
      LOADING: '⏳ Carregando dados...',
      SAVING: '⏳ Salvando...',
      PROCESSING: '🔄 Processando...'
    }
  },

  // ========================================
  // CORES DO TEMA
  // ========================================
  COLORS: {
    PRIMARY: '#3b82f6',      // Azul principal
    SECONDARY: '#8b5cf6',    // Roxo secundário
    SUCCESS: '#10b981',      // Verde sucesso
    ERROR: '#ef4444',        // Vermelho erro
    WARNING: '#f59e0b',      // Amarelo aviso
    INFO: '#06b6d4'          // Ciano informação
  },

  // ========================================
  // DEBUG
  // ========================================
  // Ativar logs detalhados no console
  DEBUG_MODE: true,
  
  // Mostrar tempo de execução das operações
  SHOW_PERFORMANCE: true
};

// ========================================
// FUNÇÕES AUXILIARES DE CONFIGURAÇÃO
// ========================================

/**
 * Verifica se está em modo de debug
 * @returns {boolean}
 */
CONFIG.isDebug = function() {
  return this.DEBUG_MODE;
};

/**
 * Loga mensagem apenas se DEBUG_MODE estiver ativo
 * @param {string} message - Mensagem a ser logada
 * @param {*} data - Dados adicionais (opcional)
 */
CONFIG.log = function(message, data) {
  if (this.DEBUG_MODE) {
    if (data !== undefined) {
      console.log(`[CONFIG] ${message}`, data);
    } else {
      console.log(`[CONFIG] ${message}`);
    }
  }
};

/**
 * Valida se a URL do Apps Script está configurada
 * @returns {boolean}
 */
CONFIG.validateAppsScriptURL = function() {
  if (!this.APPS_SCRIPT_URL || this.APPS_SCRIPT_URL.trim() === '') {
    console.error('❌ APPS_SCRIPT_URL não configurado em config.js');
    return false;
  }
  return true;
};

/**
 * Retorna a URL completa de uma página
 * @param {string} pageKey - Chave da página (ex: 'LOGIN', 'REGISTRO')
 * @returns {string}
 */
CONFIG.getPageURL = function(pageKey) {
  return this.PAGES[pageKey] || '';
};

/**
 * Verifica se um usuário tem permissão baseado no role
 * @param {string} userRole - Role do usuário atual
 * @param {string} requiredRole - Role mínimo requerido
 * @returns {boolean}
 */
CONFIG.hasPermission = function(userRole, requiredRole) {
  const hierarchy = {
    [this.ROLES.SUPERUSER]: 3,
    [this.ROLES.ADMIN]: 2,
    [this.ROLES.USER]: 1
  };
  
  return hierarchy[userRole] >= hierarchy[requiredRole];
};

// ========================================
// EXPORTAR CONFIGURAÇÃO
// ========================================
// Torna CONFIG disponível globalmente
if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
}

  // Log de inicialização (sanitizado para segurança)
  if (CONFIG.DEBUG_MODE) {
    // Usa Logger se disponível, senão console.log normal
    const logFn = (typeof window !== 'undefined' && window.Logger) ? window.Logger.log : console.log;
    const sanitizeFn = (typeof window !== 'undefined' && window.Security && window.Security.sanitizeForLog) 
      ? window.Security.sanitizeForLog 
      : function(x) { return x; };
    
    logFn('✅ Configurações carregadas:', sanitizeFn({
      'Apps Script URL (Auth)': CONFIG.APPS_SCRIPT_AUTH ? '✓ Configurado' : '✗ Não configurado',
      'Apps Script URL (Casos)': CONFIG.APPS_SCRIPT_CASOS ? '✓ Configurado' : '✗ Não configurado',
      'Spreadsheet ID': CONFIG.SPREADSHEET_ID ? '✓ Configurado' : '✗ Não configurado',
      'Debug Mode': CONFIG.DEBUG_MODE ? 'Ativado' : 'Desativado',
      'Versão': CONFIG.APP_VERSION
    }));
    
    // Log detalhado das URLs (sanitizado)
    if (CONFIG.APPS_SCRIPT_CASOS) {
      const sanitizedURL = sanitizeFn(CONFIG.APPS_SCRIPT_CASOS);
      logFn('📡 URL do Apps Script (Casos):', sanitizedURL);
      
      // Verifica se é a URL antiga (para detectar cache)
      const urlAntiga = 'AKfycbz-Ocm2sp-6c7bFAdLF1Da4FtRVd_gWV0deScEvOko-Sii2NpTqHwkzG0mBYjIct2-o';
      if (CONFIG.APPS_SCRIPT_CASOS.includes(urlAntiga)) {
        const warnFn = (typeof window !== 'undefined' && window.Logger) ? window.Logger.warn : console.warn;
        warnFn('⚠️ ATENÇÃO: Você pode estar usando uma URL antiga!');
        warnFn('💡 Se você atualizou a URL no config.js, limpe o cache do navegador (Ctrl+Shift+Delete) ou faça Hard Refresh (Ctrl+F5)');
      }
    }
  }
