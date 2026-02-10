// ============================================
// ATUALIZACOES-NOTIFICACOES.JS
// Sistema de Gerenciamento de Atualizações para Notificações
// ============================================

/**
 * Busca atualizações de uma notificação
 * @param {number} idNotificacao - ID da notificação na planilha
 * @returns {Promise<Array>} Array de atualizações
 */
async function buscarAtualizacoesNotificacao(idNotificacao) {
  try {
    if (!window.CONFIG || !window.CONFIG.APPS_SCRIPT_CASOS) {
      throw new Error('URL do Apps Script não configurada');
    }
    
    const url = window.CONFIG.APPS_SCRIPT_CASOS;
    const dados = {
      action: 'buscarAtualizacoes',
      idNotificacao: idNotificacao
    };
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'data=' + encodeURIComponent(JSON.stringify(dados))
    });
    
    const resultado = await response.json();
    
    if (resultado.success) {
      return resultado.atualizacoes || [];
    } else {
      throw new Error(resultado.error || 'Erro ao buscar atualizações');
    }
  } catch (error) {
    console.error('[buscarAtualizacoesNotificacao] Erro:', error);
    return [];
  }
}

/**
 * Adiciona uma nova atualização a uma notificação
 * @param {number} idNotificacao - ID da notificação na planilha
 * @param {string} textoAtualizacao - Texto da atualização
 * @param {string} emailUsuario - Email do usuário
 * @returns {Promise<Object>} Resultado da operação
 */
async function adicionarAtualizacaoNotificacao(idNotificacao, textoAtualizacao, emailUsuario) {
  try {
    if (!window.CONFIG || !window.CONFIG.APPS_SCRIPT_CASOS) {
      throw new Error('URL do Apps Script não configurada');
    }
    
    // Validar entrada
    if (!idNotificacao) {
      throw new Error('ID da notificação é obrigatório');
    }
    
    if (!textoAtualizacao || textoAtualizacao.trim() === '') {
      throw new Error('Texto da atualização não pode estar vazio');
    }
    
    if (textoAtualizacao.trim().length > 1000) {
      throw new Error('Texto excede o limite de 1000 caracteres');
    }
    
    const url = window.CONFIG.APPS_SCRIPT_CASOS;
    const dados = {
      action: 'adicionarAtualizacao',
      idNotificacao: idNotificacao,
      textoAtualizacao: textoAtualizacao.trim(),
      emailUsuario: emailUsuario
    };
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'data=' + encodeURIComponent(JSON.stringify(dados))
    });
    
    const resultado = await response.json();
    
    if (resultado.success) {
      return resultado;
    } else {
      throw new Error(resultado.error || 'Erro ao adicionar atualização');
    }
  } catch (error) {
    console.error('[adicionarAtualizacaoNotificacao] Erro:', error);
    throw error;
  }
}

/**
 * Renderiza histórico de atualizações em um container
 * @param {Array} atualizacoes - Array de atualizações
 * @param {HTMLElement} container - Container onde renderizar
 */
function renderizarAtualizacoes(atualizacoes, container) {
  if (!container) {
    console.error('[renderizarAtualizacoes] Container não encontrado');
    return;
  }
  
  if (!atualizacoes || atualizacoes.length === 0) {
    container.innerHTML = '<p class="sem-atualizacoes">Nenhuma atualização registrada ainda.</p>';
    return;
  }
  
  // Ordenar por data (mais recente primeiro)
  const atualizacoesOrdenadas = atualizacoes.slice().sort((a, b) => {
    return new Date(b.data) - new Date(a.data);
  });
  
  let html = '<div class="lista-atualizacoes">';
  
  atualizacoesOrdenadas.forEach(atualizacao => {
    const dataFormatada = formatarDataHoraBR(atualizacao.data);
    html += `
      <div class="atualizacao-item">
        <div class="atualizacao-header">
          <span class="data-atualizacao">📅 ${dataFormatada}</span>
          <span class="usuario-atualizacao">👤 ${atualizacao.usuario || 'Usuário desconhecido'}</span>
        </div>
        <p class="texto-atualizacao">${escapeHTML(atualizacao.texto || '')}</p>
      </div>
    `;
  });
  
  html += '</div>';
  container.innerHTML = html;
}

/**
 * Formata data ISO para formato brasileiro
 * @param {string} isoString - Data em formato ISO
 * @returns {string} Data formatada (DD/MM/YYYY HH:mm)
 */
function formatarDataHoraBR(isoString) {
  try {
    const data = new Date(isoString);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    const hora = String(data.getHours()).padStart(2, '0');
    const min = String(data.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano} ${hora}:${min}`;
  } catch (error) {
    console.error('[formatarDataHoraBR] Erro:', error);
    return isoString;
  }
}

/**
 * Escapa HTML para prevenir XSS
 * @param {string} text - Texto a ser escapado
 * @returns {string} Texto escapado
 */
function escapeHTML(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Mostra mensagem temporária de sucesso/erro
 * @param {string} texto - Texto da mensagem
 * @param {string} tipo - Tipo da mensagem ('success' ou 'error')
 */
function mostrarMensagemAtualizacao(texto, tipo) {
  const div = document.createElement('div');
  div.className = `mensagem mensagem-${tipo}`;
  div.textContent = texto;
  document.body.appendChild(div);
  
  setTimeout(() => {
    div.remove();
  }, 3000);
}
