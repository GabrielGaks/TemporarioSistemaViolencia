// ============================================
// NOTIFICACOES-USUARIO-HANDLER.JS
// Sistema de busca de notificações por usuário logado
// ============================================
// Fluxo:
//   Email logado -> BD.Usuarios (nome) -> BD.Notificacoes (IDs) -> Planilha (registros)
// ============================================

/**
 * Busca todas as notificações do usuário logado
 * @param {string} emailUsuario - Email do usuário logado (opcional, usa sessionStorage se não informado)
 * @returns {Promise<Object>} {success, notificacoes, total, nomeUsuario}
 */
async function buscarNotificacoesUsuario(emailUsuario = null) {
  try {
    console.log('%c=== BUSCAR NOTIFICAÇÕES USUÁRIO - INÍCIO ===', 'background: #3b82f6; color: white; padding: 4px 8px; border-radius: 4px;');
    console.log(`[1/7] Timestamp: ${new Date().toISOString()}`);

    // Se não passou email, tenta pegar do sessionStorage
    console.log('[2/7] Verificando email do usuário...');
    console.log('  - emailUsuario (parâmetro):', emailUsuario);
    console.log('  - sessionStorage.userEmail:', sessionStorage.getItem('userEmail'));
    console.log('  - sessionStorage.userId:', sessionStorage.getItem('userId'));

    const email = emailUsuario || sessionStorage.getItem('userEmail') || sessionStorage.getItem('userId');

    if (!email) {
      console.error('[2/7] ❌ ERRO: Nenhum email encontrado!');
      throw new Error('Email do usuário não encontrado. Faça login novamente.');
    }

    console.log(`[2/7] ✓ Email encontrado: ${email}`);

    // Preparar dados para requisição
    const dados = {
      action: 'buscarNotificacoesUsuario',
      emailUsuario: email
    };
    console.log('[3/7] Dados da requisição:', JSON.stringify(dados, null, 2));

    // URL do Apps Script
    console.log('[4/7] Verificando CONFIG...');
    console.log('  - window.CONFIG existe?', !!window.CONFIG);
    console.log('  - CONFIG.APPS_SCRIPT_CASOS:', window.CONFIG?.APPS_SCRIPT_CASOS || 'NÃO DEFINIDO');

    const APPS_SCRIPT_URL = window.CONFIG?.APPS_SCRIPT_CASOS || '';
    if (!APPS_SCRIPT_URL) {
      console.error('[4/7] ❌ ERRO: URL do Apps Script não configurada!');
      throw new Error('URL do Apps Script não configurada em CONFIG.APPS_SCRIPT_CASOS');
    }

    console.log(`[4/7] ✓ URL do backend: ${APPS_SCRIPT_URL}`);

    return new Promise((resolve, reject) => {
      // Criar callback global para JSONP
      const callbackName = 'handleNotificacoesUsuario_' + Date.now();
      console.log(`[5/7] Callback JSONP criado: ${callbackName}`);

      window[callbackName] = function(resultado) {
        console.log('%c[6/7] RESPOSTA RECEBIDA DO SERVIDOR!', 'background: #10b981; color: white; padding: 4px 8px; border-radius: 4px;');
        console.log('Resultado completo:', resultado);
        console.log('  - success:', resultado?.success);
        console.log('  - total:', resultado?.total);
        console.log('  - nomeUsuario:', resultado?.nomeUsuario);
        console.log('  - notificacoes:', resultado?.notificacoes?.length || 0, 'itens');
        if (resultado?.message) {
          console.log('  - message:', resultado.message);
        }

        // Limpar callback
        delete window[callbackName];
        console.log(`[6/7] Callback ${callbackName} removido do window`);

        if (resultado && resultado.success) {
          console.log(`%c[7/7] ✓ SUCESSO: ${resultado.total || 0} notificação(ões) encontrada(s)`, 'color: green; font-weight: bold;');
          resolve(resultado);
        } else {
          const erro = resultado?.message || 'Erro desconhecido ao buscar notificações';
          console.error(`[7/7] ❌ ERRO na resposta: ${erro}`);
          reject(new Error(erro));
        }
      };

      // Verificar se callback foi registrado
      console.log(`[5/7] Callback registrado em window? ${typeof window[callbackName] === 'function' ? 'SIM' : 'NÃO'}`);

      // Enviar via JSONP
      const script = document.createElement('script');
      const params = new URLSearchParams();
      params.append('data', JSON.stringify(dados));
      params.append('callback', callbackName);

      const urlCompleta = APPS_SCRIPT_URL + '?' + params.toString();
      console.log('[5/7] URL completa da requisição:');
      console.log(urlCompleta);

      script.src = urlCompleta;
      script.onerror = function(error) {
        console.error('%c[ERRO] Falha ao carregar script JSONP!', 'background: #ef4444; color: white; padding: 4px 8px;');
        console.error('Detalhes do erro:', error);
        console.error('URL que falhou:', urlCompleta);
        delete window[callbackName];
        reject(new Error('Erro de conexão ao buscar notificações'));
      };

      script.onload = function() {
        console.log('[5/7] Script JSONP carregado (aguardando callback...)');
      };

      // Timeout de segurança (60 segundos para consultas grandes)
      const timeoutId = setTimeout(() => {
        if (window[callbackName]) {
          console.error('%c[TIMEOUT] Não recebeu resposta em 60 segundos!', 'background: #f59e0b; color: black; padding: 4px 8px;');
          console.error('O callback ainda existe, o servidor não respondeu ou a resposta não chamou o callback');
          delete window[callbackName];
          reject(new Error('Timeout: O servidor não respondeu'));
        }
      }, 60000);

      console.log('[5/7] Adicionando script ao DOM...');
      document.body.appendChild(script);
      console.log('[5/7] ✓ Script adicionado ao DOM, aguardando resposta...');

      // Remove o script após 10 segundos
      setTimeout(() => {
        if (script.parentNode) {
          script.remove();
          console.log('[cleanup] Script removido do DOM');
        }
      }, 10000);
    });

  } catch (error) {
    console.error('%c❌ ERRO GERAL em buscarNotificacoesUsuario', 'background: #ef4444; color: white; padding: 4px 8px;');
    console.error('Mensagem:', error.message);
    console.error('Stack:', error.stack);
    throw error;
  }
}

/**
 * Função de teste - execute no console: testarBuscarNotificacoes()
 */
async function testarBuscarNotificacoes(emailTeste = null) {
  console.log('%c========== TESTE DE BUSCA DE NOTIFICAÇÕES ==========', 'background: #8b5cf6; color: white; padding: 8px; font-size: 14px;');

  try {
    const resultado = await buscarNotificacoesUsuario(emailTeste);
    console.log('%c========== RESULTADO DO TESTE ==========', 'background: #10b981; color: white; padding: 8px;');
    console.table({
      'Sucesso': resultado.success,
      'Total': resultado.total,
      'Nome do Usuário': resultado.nomeUsuario,
      'IDs Encontrados': resultado.idsEncontrados
    });

    if (resultado.notificacoes && resultado.notificacoes.length > 0) {
      console.log('Primeiras 3 notificações:');
      console.table(resultado.notificacoes.slice(0, 3).map(n => ({
        'ID': n.idNotificacao,
        'Criança': n['Criança/Estudante'] || n.criancaEstudante,
        'Tipo': n['Tipo de Violência'] || n.tipoViolencia,
        'Lida': n._lida ? 'Sim' : 'Não'
      })));
    }

    return resultado;
  } catch (error) {
    console.error('%c========== ERRO NO TESTE ==========', 'background: #ef4444; color: white; padding: 8px;');
    console.error(error);
    return { success: false, error: error.message };
  }
}

/**
 * Busca notificações não lidas do usuário
 * @param {string} emailUsuario - Email do usuário (opcional)
 * @returns {Promise<Object>} {success, notificacoes, total, naoLidas}
 */
async function buscarNotificacoesNaoLidas(emailUsuario = null) {
  try {
    const resultado = await buscarNotificacoesUsuario(emailUsuario);

    if (!resultado.success) {
      return resultado;
    }

    // Filtrar apenas não lidas
    const naoLidas = (resultado.notificacoes || []).filter(n => !n._lida);

    return {
      ...resultado,
      notificacoes: naoLidas,
      total: naoLidas.length,
      totalGeral: resultado.total,
      naoLidas: naoLidas.length
    };
  } catch (error) {
    console.error('[buscarNotificacoesNaoLidas] Erro:', error);
    throw error;
  }
}

/**
 * Formata data para exibição amigável
 * @param {string|Date} data - Data a formatar
 * @returns {string} Data formatada
 */
function formatarDataNotificacao(data) {
  try {
    const dataObj = new Date(data);
    const agora = new Date();
    const diffMs = agora - dataObj;
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
      return dataObj.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  } catch (error) {
    return String(data);
  }
}

/**
 * Renderiza lista de notificações em HTML
 * @param {Array} notificacoes - Array de notificações
 * @param {Object} options - Opções de renderização
 * @returns {string} HTML formatado
 */
function renderizarListaNotificacoes(notificacoes, options = {}) {
  const {
    mostrarStatus = true,
    mostrarData = true,
    maxItems = 50,
    emptyMessage = 'Nenhuma notificação encontrada'
  } = options;

  if (!notificacoes || notificacoes.length === 0) {
    return `
      <div class="flex flex-col items-center justify-center py-8 text-gray-500">
        <svg class="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
        </svg>
        <p class="text-sm">${emptyMessage}</p>
      </div>
    `;
  }

  const items = notificacoes.slice(0, maxItems);

  return items.map(notif => {
    const nome = notif['Criança/Estudante'] || notif.Crianca || notif.criancaEstudante || 'Sem nome';
    const tipo = notif['Tipo de Violência'] || notif.tipoViolencia || 'Não informado';
    const data = notif._created_at || notif['Data da Notificação (NT)'] || '';
    const lida = notif._lida;
    const id = notif.idNotificacao || notif['idNotificacao'];

    return `
      <div class="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${!lida ? 'bg-blue-50/30' : ''}"
           data-id="${id}"
           onclick="abrirDetalheNotificacao(${id})">
        <div class="flex items-start gap-3">
          ${!lida ? '<div class="w-2 h-2 mt-2 bg-blue-500 rounded-full flex-shrink-0"></div>' : '<div class="w-2 h-2 mt-2 flex-shrink-0"></div>'}
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-2">
              <h4 class="font-medium text-gray-900 truncate">${nome}</h4>
              ${mostrarData ? `<span class="text-xs text-gray-500 flex-shrink-0">${formatarDataNotificacao(data)}</span>` : ''}
            </div>
            ${mostrarStatus ? `
              <p class="text-sm text-gray-600 mt-1 truncate">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                  ${tipo}
                </span>
              </p>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Renderiza contador de notificações não lidas (badge)
 * @param {number} count - Número de notificações não lidas
 * @returns {string} HTML do badge
 */
function renderizarBadgeNotificacoes(count) {
  if (!count || count <= 0) {
    return '';
  }

  const display = count > 99 ? '99+' : count;

  return `
    <span class="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-bold text-white bg-red-500 rounded-full">
      ${display}
    </span>
  `;
}

// ============================================
// EXPORTAR FUNÇÕES
// ============================================
if (typeof window !== 'undefined') {
  window.buscarNotificacoesUsuario = buscarNotificacoesUsuario;
  window.buscarNotificacoesNaoLidas = buscarNotificacoesNaoLidas;
  window.formatarDataNotificacao = formatarDataNotificacao;
  window.renderizarListaNotificacoes = renderizarListaNotificacoes;
  window.renderizarBadgeNotificacoes = renderizarBadgeNotificacoes;
  window.testarBuscarNotificacoes = testarBuscarNotificacoes; // Função de teste

  console.log('%c[notificacoes-usuario-handler] Script carregado!', 'color: #3b82f6; font-weight: bold;');
  console.log('Para testar, execute no console: testarBuscarNotificacoes("seu@email.com")');
}
