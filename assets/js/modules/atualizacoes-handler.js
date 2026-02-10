// ============================================
// ATUALIZACOES-HANDLER.JS
// Sistema de Gerenciamento de Atualizações/Status para Notificações
// ============================================

/**
 * Adiciona uma nova atualização para uma notificação
 * @param {number} idNotificacao - ID da notificação
 * @param {string} texto - Texto da atualização (1-1000 caracteres)
 * @param {string} tagStatus - Tag de status opcional (Pendente, Em andamento, Concluído)
 * @returns {Promise<Object>} Resultado da operação
 */
async function adicionarAtualizacao(idNotificacao, texto, tagStatus = null) {
  try {
    console.log('=== ADICIONAR ATUALIZAÇÃO - INÍCIO ===');
    console.log(`[adicionarAtualizacao] Timestamp: ${new Date().toISOString()}`);
    console.log(`[adicionarAtualizacao] ID Notificação: ${idNotificacao}`);
    console.log(`[adicionarAtualizacao] Texto: ${texto.substring(0, 50)}...`);
    console.log(`[adicionarAtualizacao] Tag Status: ${tagStatus || 'não informado'}`);
    
    // Validar entrada
    if (!idNotificacao) {
      throw new Error('ID da notificação é obrigatório');
    }
    
    if (!texto || typeof texto !== 'string') {
      throw new Error('Texto é obrigatório e deve ser uma string');
    }
    
    const textoLimpo = texto.trim();
    if (textoLimpo.length < 1) {
      throw new Error('Texto não pode estar vazio');
    }
    if (textoLimpo.length > 1000) {
      throw new Error('Texto excede o limite de 1000 caracteres');
    }
    
    // Obter informações do usuário atual
    const usuarioId = sessionStorage.getItem('userEmail') || sessionStorage.getItem('userId') || 'usuario@desconhecido.com';
    const usuarioNome = sessionStorage.getItem('userName') || sessionStorage.getItem('userEmail') || 'Usuário Desconhecido';
    
    console.log(`[adicionarAtualizacao] Usuário ID: ${usuarioId}`);
    console.log(`[adicionarAtualizacao] Usuário Nome: ${usuarioNome}`);
    
    // Preparar dados
    const dados = {
      id_notificacao: idNotificacao,
      usuario_id: usuarioId,
      usuario_nome: usuarioNome,
      texto: textoLimpo,
      tag_status: tagStatus || null
    };
    
    // Fazer requisição via JSONP (mesmo padrão usado no projeto)
    const APPS_SCRIPT_URL = window.CONFIG?.APPS_SCRIPT_CASOS || '';
    if (!APPS_SCRIPT_URL) {
      throw new Error('URL do Apps Script não configurada em CONFIG.APPS_SCRIPT_CASOS');
    }
    
    console.log(`[adicionarAtualizacao] URL do backend: ${APPS_SCRIPT_URL}`);
    
    return new Promise((resolve, reject) => {
      // Criar callback global
      const callbackName = 'handleAddAtualizacao_' + Date.now();
      window[callbackName] = function(resultado) {
        console.log('[adicionarAtualizacao] Resposta recebida:', resultado);
        
        // Limpar callback
        delete window[callbackName];
        
        if (resultado && resultado.success) {
          console.log('[adicionarAtualizacao] ✓ Atualização adicionada com sucesso');
          resolve(resultado);
        } else {
          const erro = resultado?.error || resultado?.message || 'Erro desconhecido ao adicionar atualização';
          console.error('[adicionarAtualizacao] ❌ Erro:', erro);
          reject(new Error(erro));
        }
      };
      
      // Enviar via JSONP
      const script = document.createElement('script');
      const params = new URLSearchParams();
      params.append('action', 'addAtualizacao');
      params.append('data', JSON.stringify(dados));
      params.append('callback', callbackName);
      
      const urlCompleta = APPS_SCRIPT_URL + '?' + params.toString();
      console.log('[adicionarAtualizacao] Enviando requisição:', urlCompleta.substring(0, 150) + '...');
      
      script.src = urlCompleta;
      script.onerror = function(error) {
        console.error('[adicionarAtualizacao] ❌ Erro ao carregar script:', error);
        delete window[callbackName];
        reject(new Error('Erro de conexão ao adicionar atualização'));
      };
      
      // Timeout de segurança
      setTimeout(() => {
        if (window[callbackName]) {
          console.error('[adicionarAtualizacao] ⏱️ Timeout: Não recebeu resposta em 30 segundos');
          delete window[callbackName];
          reject(new Error('Timeout: O servidor não respondeu'));
        }
      }, 30000);
      
      document.body.appendChild(script);
      
      // Remove o script após 5 segundos
      setTimeout(() => {
        if (script.parentNode) {
          script.remove();
        }
      }, 5000);
    });
    
  } catch (error) {
    console.error('❌ [adicionarAtualizacao] Erro:', error);
    throw error;
  }
}

/**
 * Lista atualizações de uma notificação com paginação
 * @param {number} idNotificacao - ID da notificação
 * @param {number} page - Número da página (padrão: 1)
 * @param {number} pageSize - Tamanho da página (padrão: 50)
 * @returns {Promise<Object>} Resultado com lista de atualizações e paginação
 */
async function listarAtualizacoes(idNotificacao, page = 1, pageSize = 50) {
  try {
    console.log('=== LISTAR ATUALIZAÇÕES - INÍCIO ===');
    console.log(`[listarAtualizacoes] Timestamp: ${new Date().toISOString()}`);
    console.log(`[listarAtualizacoes] ID Notificação: ${idNotificacao}`);
    console.log(`[listarAtualizacoes] Page: ${page}, PageSize: ${pageSize}`);
    
    // Validar entrada
    if (!idNotificacao) {
      throw new Error('ID da notificação é obrigatório');
    }
    
    // Preparar dados
    const dados = {
      id_notificacao: idNotificacao,
      page: page,
      pageSize: pageSize
    };
    
    // Fazer requisição via JSONP
    const APPS_SCRIPT_URL = window.CONFIG?.APPS_SCRIPT_CASOS || '';
    if (!APPS_SCRIPT_URL) {
      throw new Error('URL do Apps Script não configurada em CONFIG.APPS_SCRIPT_CASOS');
    }
    
    console.log(`[listarAtualizacoes] URL do backend: ${APPS_SCRIPT_URL}`);
    
    return new Promise((resolve, reject) => {
      // Criar callback global
      const callbackName = 'handleListAtualizacoes_' + Date.now();
      window[callbackName] = function(resultado) {
        console.log('[listarAtualizacoes] Resposta recebida:', resultado);
        
        // Limpar callback
        delete window[callbackName];
        
        if (resultado && resultado.success !== false) {
          console.log(`[listarAtualizacoes] ✓ ${resultado.atualizacoes?.length || 0} atualização(ões) encontrada(s)`);
          resolve(resultado);
        } else {
          const erro = resultado?.error || resultado?.message || 'Erro desconhecido ao listar atualizações';
          console.error('[listarAtualizacoes] ❌ Erro:', erro);
          reject(new Error(erro));
        }
      };
      
      // Enviar via JSONP
      const script = document.createElement('script');
      const params = new URLSearchParams();
      params.append('action', 'listAtualizacoes');
      params.append('data', JSON.stringify(dados));
      params.append('callback', callbackName);
      
      const urlCompleta = APPS_SCRIPT_URL + '?' + params.toString();
      console.log('[listarAtualizacoes] Enviando requisição:', urlCompleta.substring(0, 150) + '...');
      
      script.src = urlCompleta;
      script.onerror = function(error) {
        console.error('[listarAtualizacoes] ❌ Erro ao carregar script:', error);
        delete window[callbackName];
        reject(new Error('Erro de conexão ao listar atualizações'));
      };
      
      // Timeout de segurança
      setTimeout(() => {
        if (window[callbackName]) {
          console.error('[listarAtualizacoes] ⏱️ Timeout: Não recebeu resposta em 30 segundos');
          delete window[callbackName];
          reject(new Error('Timeout: O servidor não respondeu'));
        }
      }, 30000);
      
      document.body.appendChild(script);
      
      // Remove o script após 5 segundos
      setTimeout(() => {
        if (script.parentNode) {
          script.remove();
        }
      }, 5000);
    });
    
  } catch (error) {
    console.error('❌ [listarAtualizacoes] Erro:', error);
    throw error;
  }
}

/**
 * Formata timestamp ISO para exibição amigável
 * @param {string} timestampISO - Timestamp em formato ISO
 * @returns {string} Data formatada
 */
function formatarTimestamp(timestampISO) {
  try {
    const data = new Date(timestampISO);
    const agora = new Date();
    const diffMs = agora - data;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) {
      return 'Agora';
    } else if (diffMins < 60) {
      return `Há ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
    } else if (diffHours < 24) {
      return `Há ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    } else if (diffDays < 7) {
      return `Há ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
    } else {
      // Formatar data completa
      return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  } catch (error) {
    console.error('[formatarTimestamp] Erro:', error);
    return timestampISO;
  }
}

/**
 * Retorna cor CSS para tag de status
 * @param {string} tagStatus - Tag de status
 * @returns {string} Classe CSS
 */
function getCorTagStatus(tagStatus) {
  if (!tagStatus) return '';
  
  const cores = {
    'Pendente': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'Em andamento': 'bg-blue-100 text-blue-800 border-blue-300',
    'Concluído': 'bg-green-100 text-green-800 border-green-300'
  };
  
  return cores[tagStatus] || 'bg-gray-100 text-gray-800 border-gray-300';
}

