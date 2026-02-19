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
  APPS_SCRIPT_AUTH: getEnvVar('APPS_SCRIPT_AUTH_URL', (function () {
    // Tenta carregar de config.local.js se existir
    if (typeof window !== 'undefined' && window.CONFIG_LOCAL && window.CONFIG_LOCAL.APPS_SCRIPT_AUTH) {
      return window.CONFIG_LOCAL.APPS_SCRIPT_AUTH;
    }
    // Valor padrão (substitua em produção)
    return 'https://script.google.com/macros/s/AKfycbwWlfky0mso6bOdYBvTS0wsOgk29dWGJeZc2D-_kZWMFZsQbgm8uf7DURoyzGC3ZypD/exec';
  })()),

  // URL para CASOS (Cadastro, Edição e Listagem de Casos)
  // Usado em: registro-novo-caso.html, gerenciar-casos.html, painel-casos.html
  // Encontre em: Apps Script (projeto Casos) > Implantar > Implantar como aplicativo da Web
  // ⚠️ SEGURANÇA: Use getEnvVar() ou config.local.js para produção
  APPS_SCRIPT_CASOS: getEnvVar('APPS_SCRIPT_CASOS_URL', (function () {
    // Tenta carregar de config.local.js se existir
    if (typeof window !== 'undefined' && window.CONFIG_LOCAL && window.CONFIG_LOCAL.APPS_SCRIPT_CASOS) {
      return window.CONFIG_LOCAL.APPS_SCRIPT_CASOS;
    }
    // Valor padrão (substitua em produção)
    return 'https://script.google.com/macros/s/AKfycbzNQStBHc6t3K6gqwbhc0NlYRYTUXuOaCbrTMX6LemeoMex3EmSbBpEYdNLQz7PH9kucg/exec';
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
  SPREADSHEET_ID: getEnvVar('SPREADSHEET_ID', (function () {
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
  SUPABASE_URL: getEnvVar('SUPABASE_URL', (function () {
    if (typeof window !== 'undefined' && window.CONFIG_LOCAL && window.CONFIG_LOCAL.SUPABASE_URL) {
      return window.CONFIG_LOCAL.SUPABASE_URL;
    }
    return 'https://aepdbpkrkokcnhfljury.supabase.co';
  })()),
  SUPABASE_KEY: getEnvVar('SUPABASE_ANON_KEY', (function () {
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
  // CACHE E ATUALIZAÇÕES
  // ========================================
  // Ativa/desativa sistema de cache
  CACHE_ENABLED: true,

  // Intervalo de polling para verificar mudanças (em milissegundos)
  POLLING_INTERVAL: 45000,  // 45 segundos

  // Tempo de expiração do cache (em milissegundos)
  CACHE_EXPIRY: 3600000,  // 1 hora

  // Tempo para auto-dismiss da notificação (em milissegundos)
  // 0 para desabilitar auto-dismiss
  NOTIFICATION_AUTO_DISMISS: 10000,  // 10 segundos

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
  // FEATURE FLAGS - Sistema de Escolas
  // ========================================
  // Permite usar dados hardcoded se API falhar (true = modo compatibilidade)
  USE_HARDCODED_SCHOOLS: true,
  // Numero maximo de tentativas para carregar cache do Supabase
  CACHE_MAX_RETRIES: 3,
  // Idade maxima do backup local em ms (24 horas)
  CACHE_MAX_AGE: 86400000,

  // ========================================
  // DEBUG
  // ========================================
  // Ativar logs detalhados no console
  DEBUG_MODE: true,

  // Mostrar tempo de execução das operações
  SHOW_PERFORMANCE: true,

  // ========================================
  // MINHA CONTA - SUPORTE
  // ========================================
  SUPPORT_EMAIL: 'suporte@naam.com',

  // ========================================
  // MINHA CONTA - VÍDEOS EXPLICATIVOS
  // ========================================
  VIDEO_CATEGORIAS: [
    { id: 'primeiros-passos', label: 'Primeiros Passos', icon: '\uD83D\uDE80' },
    { id: 'registros', label: 'Registrando Casos', icon: '\uD83D\uDCDD' },
    { id: 'painel', label: 'Painel e Filtros', icon: '\uD83D\uDCCA' },
    { id: 'notificacoes', label: 'Notifica\u00e7\u00f5es', icon: '\uD83D\uDD14' },
    { id: 'administracao', label: 'Administra\u00e7\u00e3o', icon: '\uD83D\uDD27' }
  ],

  VIDEOS: [
    {
      id: 'v1',
      titulo: 'Introdu\u00e7\u00e3o ao Sistema NAAM',
      descricao: 'Conhe\u00e7a o sistema e suas principais funcionalidades',
      categoria: 'primeiros-passos',
      youtubeId: 'PLACEHOLDER_ID_1',
      duracao: '3:00',
      roles: ['visualizador', 'estagiario', 'user', 'tecnico', 'admin', 'superuser']
    },
    {
      id: 'v2',
      titulo: 'Como fazer login e navegar',
      descricao: 'Aprenda a acessar o sistema e usar o menu de navega\u00e7\u00e3o',
      categoria: 'primeiros-passos',
      youtubeId: 'PLACEHOLDER_ID_2',
      duracao: '2:30',
      roles: ['visualizador', 'estagiario', 'user', 'tecnico', 'admin', 'superuser']
    },
    {
      id: 'v3',
      titulo: 'Registrando um novo caso',
      descricao: 'Passo a passo completo para preencher o formul\u00e1rio de registro',
      categoria: 'registros',
      youtubeId: 'PLACEHOLDER_ID_3',
      duracao: '5:30',
      roles: ['estagiario', 'user', 'tecnico', 'superuser']
    },
    {
      id: 'v4',
      titulo: 'Preenchendo campos corretamente',
      descricao: 'Dicas para evitar erros comuns no preenchimento',
      categoria: 'registros',
      youtubeId: 'PLACEHOLDER_ID_4',
      duracao: '4:00',
      roles: ['estagiario', 'user', 'tecnico', 'superuser']
    },
    {
      id: 'v5',
      titulo: 'Usando filtros no Painel de Casos',
      descricao: 'Como filtrar, buscar e ordenar casos no painel',
      categoria: 'painel',
      youtubeId: 'PLACEHOLDER_ID_5',
      duracao: '3:15',
      roles: ['visualizador', 'estagiario', 'user', 'tecnico', 'admin', 'superuser']
    },
    {
      id: 'v6',
      titulo: 'Exportando dados para PDF',
      descricao: 'Como gerar relat\u00f3rios em PDF a partir do painel',
      categoria: 'painel',
      youtubeId: 'PLACEHOLDER_ID_6',
      duracao: '2:00',
      roles: ['visualizador', 'estagiario', 'user', 'tecnico', 'admin', 'superuser']
    },
    {
      id: 'v7',
      titulo: 'Gerenciando notifica\u00e7\u00f5es',
      descricao: 'Como visualizar e acompanhar notifica\u00e7\u00f5es de casos',
      categoria: 'notificacoes',
      youtubeId: 'PLACEHOLDER_ID_7',
      duracao: '3:45',
      roles: ['tecnico', 'superuser']
    },
    {
      id: 'v8',
      titulo: 'Painel de Administra\u00e7\u00e3o',
      descricao: 'Como gerenciar usu\u00e1rios e permiss\u00f5es do sistema',
      categoria: 'administracao',
      youtubeId: 'PLACEHOLDER_ID_8',
      duracao: '4:30',
      roles: ['admin', 'superuser']
    }
  ],

  // ========================================
  // MINHA CONTA - FAQ (Perguntas Frequentes)
  // ========================================
  FAQ: [
    {
      pergunta: 'Como fa\u00e7o login no sistema?',
      resposta: 'Acesse a p\u00e1gina inicial do sistema, insira seu e-mail e senha cadastrados pelo administrador, e clique em "Entrar". Se esqueceu sua senha, clique em "Esqueci minha senha" para recuper\u00e1-la.',
      categoria: 'login'
    },
    {
      pergunta: 'Esqueci minha senha, o que fa\u00e7o?',
      resposta: 'Na tela de login, clique em "Esqueci minha senha". Insira seu e-mail cadastrado e voc\u00ea receber\u00e1 um link por e-mail para criar uma nova senha. O link expira em 1 hora.',
      categoria: 'login'
    },
    {
      pergunta: 'N\u00e3o consigo acessar uma p\u00e1gina do sistema. Por qu\u00ea?',
      resposta: 'Cada perfil de usu\u00e1rio tem acesso a p\u00e1ginas espec\u00edficas. Se voc\u00ea n\u00e3o consegue acessar uma p\u00e1gina, pode ser que seu perfil n\u00e3o tenha permiss\u00e3o. Fale com o administrador do sistema.',
      categoria: 'login'
    },
    {
      pergunta: 'Como registro um novo caso?',
      resposta: 'No menu, clique em "Novo Registro". Preencha todos os campos obrigat\u00f3rios (marcados com asterisco *), como nome do estudante, data, tipo de viol\u00eancia, escola, etc. Ao finalizar, clique em "Salvar".',
      categoria: 'registros'
    },
    {
      pergunta: 'Quais campos s\u00e3o obrigat\u00f3rios no registro?',
      resposta: 'Os campos obrigat\u00f3rios est\u00e3o marcados com asterisco (*). Incluem: nome da crian\u00e7a/estudante, data da NT, idade, tipo de viol\u00eancia, escola (CMEI/EMEF) e respons\u00e1vel pelo registro.',
      categoria: 'registros'
    },
    {
      pergunta: 'Como editar um caso j\u00e1 registrado?',
      resposta: 'V\u00e1 em "Gerenciar Registros" no menu. Encontre o caso na lista e clique no bot\u00e3o de edi\u00e7\u00e3o. Fa\u00e7a as altera\u00e7\u00f5es necess\u00e1rias e salve. Apenas usu\u00e1rios com permiss\u00e3o podem editar.',
      categoria: 'edicao'
    },
    {
      pergunta: 'Posso excluir um caso registrado?',
      resposta: 'Sim, se voc\u00ea tiver permiss\u00e3o. V\u00e1 em "Gerenciar Registros", encontre o caso e clique no bot\u00e3o de exclus\u00e3o. Ser\u00e1 pedida uma confirma\u00e7\u00e3o antes de excluir. Esta a\u00e7\u00e3o n\u00e3o pode ser desfeita.',
      categoria: 'edicao'
    },
    {
      pergunta: 'O que s\u00e3o as notifica\u00e7\u00f5es do sistema?',
      resposta: 'Notifica\u00e7\u00f5es informam t\u00e9cnicos sobre novos casos registrados nas escolas vinculadas a eles. Aparecem no menu "Minhas Notifica\u00e7\u00f5es" com um badge vermelho indicando quantas s\u00e3o n\u00e3o lidas.',
      categoria: 'notificacoes'
    },
    {
      pergunta: 'A p\u00e1gina est\u00e1 carregando lentamente. O que fazer?',
      resposta: 'Tente: 1) Recarregar a p\u00e1gina (F5 ou Ctrl+R); 2) Limpar o cache do navegador (Ctrl+Shift+Delete); 3) Verificar sua conex\u00e3o com a internet; 4) Tentar em outro navegador (Chrome recomendado).',
      categoria: 'erros'
    },
    {
      pergunta: 'Apareceu um erro ao salvar o registro. O que fa\u00e7o?',
      resposta: 'Verifique se todos os campos obrigat\u00f3rios est\u00e3o preenchidos corretamente. Confira se a idade est\u00e1 entre 0 e 25 anos. Se o erro persistir, tente recarregar a p\u00e1gina e preencher novamente.',
      categoria: 'erros'
    }
  ],

  FAQ_CATEGORIAS: [
    { id: 'login', label: 'Login e Acesso' },
    { id: 'registros', label: 'Registrar Casos' },
    { id: 'edicao', label: 'Editar/Excluir' },
    { id: 'notificacoes', label: 'Notifica\u00e7\u00f5es' },
    { id: 'erros', label: 'Erros Comuns' }
  ],

  // ========================================
  // MINHA CONTA - GLOSSÁRIO DE TERMOS
  // ========================================
  GLOSSARY: [
    { termo: 'NT', definicao: 'Notifica\u00e7\u00e3o \u2014 documento formal de registro de um caso de viol\u00eancia escolar no sistema.' },
    { termo: 'CMEI', definicao: 'Centro Municipal de Educa\u00e7\u00e3o Infantil \u2014 unidade escolar que atende crian\u00e7as de 0 a 5 anos.' },
    { termo: 'EMEF', definicao: 'Escola Municipal de Ensino Fundamental \u2014 unidade escolar que atende estudantes do 1\u00ba ao 9\u00ba ano.' },
    { termo: 'PCD', definicao: 'Pessoa com Defici\u00eancia \u2014 indica se o estudante possui alguma defici\u00eancia ou transtorno.' },
    { termo: 'Encaminhamento', definicao: 'Procedimento de direcionar o caso para \u00f3rg\u00e3os competentes (Conselho Tutelar, CREAS, etc.) para acompanhamento.' },
    { termo: 'Estudo de Caso', definicao: 'Reuni\u00e3o multiprofissional para analisar e definir estrat\u00e9gias de interven\u00e7\u00e3o para um caso espec\u00edfico.' },
    { termo: 'Viol\u00eancia Institucional', definicao: 'Viol\u00eancia praticada por agentes do Estado ou institui\u00e7\u00f5es, incluindo negligência, abuso de poder ou omiss\u00e3o.' },
    { termo: 'Regi\u00e3o', definicao: 'Divis\u00e3o geogr\u00e1fica do munic\u00edpio onde a escola est\u00e1 localizada (ex: Norte, Sul, Leste, Oeste, Centro).' },
    { termo: 'Respons\u00e1vel pelo Registro', definicao: 'Profissional que preencheu e registrou o caso no sistema.' },
    { termo: 'Fonte Informadora', definicao: 'Pessoa ou institui\u00e7\u00e3o que informou sobre o caso de viol\u00eancia (escola, fam\u00edlia, conselho tutelar, etc.).' }
  ]
};

// ========================================
// FUNÇÕES AUXILIARES DE CONFIGURAÇÃO
// ========================================

/**
 * Verifica se está em modo de debug
 * @returns {boolean}
 */
CONFIG.isDebug = function () {
  return this.DEBUG_MODE;
};

/**
 * Loga mensagem apenas se DEBUG_MODE estiver ativo
 * @param {string} message - Mensagem a ser logada
 * @param {*} data - Dados adicionais (opcional)
 */
CONFIG.log = function (message, data) {
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
CONFIG.validateAppsScriptURL = function () {
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
CONFIG.getPageURL = function (pageKey) {
  return this.PAGES[pageKey] || '';
};

/**
 * Verifica se um usuário tem permissão baseado no role
 * @param {string} userRole - Role do usuário atual
 * @param {string} requiredRole - Role mínimo requerido
 * @returns {boolean}
 */
CONFIG.hasPermission = function (userRole, requiredRole) {
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
    : function (x) { return x; };

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
