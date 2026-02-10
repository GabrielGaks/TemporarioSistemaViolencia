// ============================================
// ANEXOS-HANDLER.JS
// Sistema de Gerenciamento de Anexos
// ============================================

/**
 * Helper para chamar backend com ação específica
 * @param {string} action - Ação a executar
 * @param {Object} dados - Dados a enviar
 * @returns {Promise<Object>} Resposta do servidor
 */
async function chamarBackendAnexos(action, dados) {
  try {
    console.log('=== CHAMAR BACKEND ANEXOS - INÍCIO ===');
    console.log(`[chamarBackendAnexos] Timestamp: ${new Date().toISOString()}`);
    console.log(`[chamarBackendAnexos] Action: ${action}`);
    console.log(`[chamarBackendAnexos] Dados enviados: `, dados);

    // Verifica se API está disponível
    if (!window.API) {
      throw new Error('Módulo API não carregado. Verifique se api.js foi importado.');
    }
    console.log('[chamarBackendAnexos] ✓ Módulo API disponível');

    // Obtém URL do config
    const url = (window.CONFIG && window.CONFIG.APPS_SCRIPT_CASOS) || '';
    if (!url) {
      throw new Error('URL de backend não configurada em window.CONFIG.APPS_SCRIPT_CASOS');
    }
    console.log(`[chamarBackendAnexos] ✓ URL do backend: ${url}`);

    // Prepara payload
    const payload = {
      action: action,
      ...dados
    };

    console.log('[chamarBackendAnexos] Enviando requisição...');

    // Faz requisição
    const resultado = await window.API.request(url, payload);

    console.log('[chamarBackendAnexos] ✓ Resposta recebida');
    console.log(`[chamarBackendAnexos] Status sucesso: ${resultado.success}`);
    console.log('[chamarBackendAnexos] Resultado: ', resultado);
    console.log('=== CHAMAR BACKEND ANEXOS - SUCESSO ===');

    return resultado;
  } catch (error) {
    console.error(`❌ [chamarBackendAnexos] Erro ao chamar backend (${action}):`, error);
    console.error('[chamarBackendAnexos] Stack trace: ', error.stack);
    throw error;
  }
}

/**
 * Busca a PK do Supabase a partir do ID da planilha
 * @param {number} idNotificacaoPlanilha - ID da notificação na planilha
 * @returns {Promise<string|null>} PK do Supabase ou null
 */
async function buscarPKSupabase(idNotificacaoPlanilha) {
  try {
    console.log('[buscarPKSupabase] Buscando PK Supabase para idNotificacao planilha:', idNotificacaoPlanilha);

    if (!window.API) {
      console.error('[buscarPKSupabase] ❌ Módulo API não disponível');
      return null;
    }

    const url = (window.CONFIG && window.CONFIG.APPS_SCRIPT_CASOS) || '';
    if (!url) {
      console.error('[buscarPKSupabase] ❌ URL do backend não configurada');
      return null;
    }

    const resultado = await window.API.request(url, {
      action: 'buscarPKSupabase',
      idNotificacaoPlanilha: idNotificacaoPlanilha
    });

    console.log('[buscarPKSupabase] Resultado:', resultado);

    if (resultado.success && resultado.pk) {
      console.log('[buscarPKSupabase] ✓ PK encontrada:', resultado.pk);
      return resultado.pk;
    }

    console.warn('[buscarPKSupabase] ⚠️ PK não encontrada para ID:', idNotificacaoPlanilha);
    return null;
  } catch (erro) {
    console.error('[buscarPKSupabase] ❌ Erro ao buscar PK Supabase:', erro);
    return null;
  }
}

/**
 * Carrega e exibe anexos de uma notificação no modal
 * @param {number} idNotificacao - ID da notificação (ID da planilha)
 */
async function carregarAnexosModal(idNotificacao) {
  console.log('=== CARREGAR ANEXOS MODAL - INÍCIO ===');
  console.log(`[carregarAnexosModal] Timestamp: ${new Date().toISOString()}`);
  console.log(`[carregarAnexosModal] ID Notificação (planilha): ${idNotificacao}`);

  const modalBody = document.getElementById('modal-body');

  if (!modalBody) {
    console.error('[carregarAnexosModal] ❌ Modal Body não encontrado no DOM');
    return;
  }

  console.log('[carregarAnexosModal] ✓ Modal Body encontrado');

  // Verificar se já existe seção de anexos (evitar duplicação)
  if (document.getElementById('lista-anexos')) {
    console.log('[carregarAnexosModal] Seção de anexos já existe, usando existente');
  } else {
    // Tentar inserir após a seção de atualizações (se existir)
    const secaoAtualizacoes = modalBody.querySelector('.secao-atualizacoes');

    const secaoAnexos = `
      <div class="secao-anexos">
        <div class="secao-anexos-titulo">
          <span>📎</span>
          <span>Anexos</span>
        </div>
        <div id="lista-anexos">
          <div class="anexos-loading">
            <div class="anexos-loading-spinner"></div>
            <span>Carregando anexos...</span>
          </div>
        </div>
      </div>
    `;

    console.log('[carregarAnexosModal] Inserindo seção de anexos no modal...');

    if (secaoAtualizacoes) {
      // Inserir logo após a seção de atualizações
      secaoAtualizacoes.insertAdjacentHTML('afterend', secaoAnexos);
      console.log('[carregarAnexosModal] ✓ Seção de anexos inserida após atualizações');
    } else {
      // Se não houver seção de atualizações, inserir no final
      modalBody.insertAdjacentHTML('beforeend', secaoAnexos);
      console.log('[carregarAnexosModal] ✓ Seção de anexos inserida no final do modal');
    }

    // Botão de editar agora está no footer do modal (removido daqui)
  }

  try {
    // PRIMEIRO: Buscar a PK do Supabase usando o ID da planilha
    console.log('[carregarAnexosModal] Buscando PK do Supabase...');
    const pkSupabase = await buscarPKSupabase(idNotificacao);

    if (!pkSupabase) {
      console.warn('[carregarAnexosModal] ⚠️ PK Supabase não encontrada. Anexos não serão carregados.');
      const listaAnexosEl = document.getElementById('lista-anexos');
      if (listaAnexosEl) {
        listaAnexosEl.innerHTML = `
          <div class="anexos-vazio">
            <div class="anexos-vazio-icon">ℹ️</div>
            <div>Nenhum anexo encontrado (ID não encontrado no banco)</div>
          </div>
        `;
      }
      console.log('=== CARREGAR ANEXOS MODAL - CONCLUÍDO (SEM PK) ===');
      return;
    }

    console.log('[carregarAnexosModal] ✓ PK Supabase encontrada:', pkSupabase);
    console.log('[carregarAnexosModal] Chamando backend para listar anexos com PK...');

    // SEGUNDO: Usar a PK do Supabase para buscar os anexos
    const resultado = await chamarBackendAnexos('listarAnexosNotificacao', {
      idNotificacao: pkSupabase  // Agora usa a PK do Supabase, não o ID da planilha
    });

    console.log('[carregarAnexosModal] ✓ Resposta do backend recebida');
    console.log(`[carregarAnexosModal] Sucesso: ${resultado.success}`);
    console.log(`[carregarAnexosModal] Quantidade de anexos: ${resultado.anexos ? resultado.anexos.length : 0}`);

    if (resultado.anexos && resultado.anexos.length > 0) {
      console.log('[carregarAnexosModal] Primeiros anexos:', resultado.anexos.slice(0, 2));
    }

    renderizarAnexos(resultado.anexos || []);
    console.log('=== CARREGAR ANEXOS MODAL - SUCESSO ===');

    // Marca anexos como carregados quando terminar com sucesso
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('anexosCarregados', { detail: { success: true } }));
    }
  } catch (error) {
    console.error('=== CARREGAR ANEXOS MODAL - ERRO ===');
    console.error('[carregarAnexosModal] ❌ Erro ao carregar anexos:', error);
    console.error('[carregarAnexosModal] Stack trace: ', error.stack);

    const listaAnexosEl = document.getElementById('lista-anexos');
    if (listaAnexosEl) {
      listaAnexosEl.innerHTML = `
        <div class="anexos-vazio">
          <div class="anexos-vazio-icon">⚠️</div>
          <div>Erro ao carregar anexos: ${error.message}</div>
        </div>
      `;
    }

    // Marca anexos como carregados mesmo em caso de erro (para não bloquear edição)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('anexosCarregados', { detail: { success: false } }));
    }
  }
}

/**
 * Renderiza lista de anexos no modal
 * @param {Array} anexos - Lista de anexos
 */
function renderizarAnexos(anexos) {
  console.log('=== RENDERIZAR ANEXOS - INÍCIO ===');
  console.log(`[renderizarAnexos] Total de anexos a renderizar: ${anexos ? anexos.length : 0}`);

  const listaAnexos = document.getElementById('lista-anexos');

  if (!listaAnexos) {
    console.error('[renderizarAnexos] ❌ Elemento lista-anexos não encontrado no DOM');
    return;
  }

  console.log('[renderizarAnexos] ✓ Elemento lista-anexos encontrado');

  if (!anexos || anexos.length === 0) {
    console.log('[renderizarAnexos] Nenhum anexo encontrado, renderizando estado vazio');
    listaAnexos.innerHTML = `
      <div class="anexos-vazio">
        <div class="anexos-vazio-icon">📁</div>
        <div>Nenhum anexo encontrado</div>
      </div>
    `;
    console.log('=== RENDERIZAR ANEXOS - CONCLUÍDO (VAZIO) ===');
    return;
  }

  console.log(`[renderizarAnexos] Renderizando ${anexos.length} anexo(s)`);

  const htmlAnexos = anexos.map((anexo, index) => {
    console.log(`[renderizarAnexos] Processando anexo ${index + 1}/${anexos.length}:`);
    console.log(`  - Nome: ${anexo.nome_arquivo_original}`);
    console.log(`  - Tipo: ${anexo.tipo_arquivo}`);
    console.log(`  - Tamanho: ${anexo.tamanho_comprimido} bytes`);

    const icone = obterIconeTipoArquivo(anexo.tipo_arquivo);
    const tamanhoMB = (anexo.tamanho_comprimido / 1024 / 1024).toFixed(2);
    const compressao = anexo.taxa_compressao ? `${anexo.taxa_compressao.toFixed(1)}%` : '0%';

    return `
      <div class="anexo-item">
        <div class="anexo-info">
          <div class="anexo-tipo-icon">${icone}</div>
          <div class="anexo-detalhes">
            <p class="anexo-nome" title="${anexo.nome_arquivo_original}">${anexo.nome_arquivo_original}</p>
            <div class="anexo-metadata">
              <span class="anexo-metadata-item">💾 ${tamanhoMB} MB</span>
              ${anexo.taxa_compressao > 0 ? `<span class="anexo-compressao">-${compressao}</span>` : ''}
              <span class="anexo-metadata-item">📅 ${formatarDataUpload(anexo.data_upload)}</span>
            </div>
          </div>
        </div>
        <div class="anexo-acoes">
          <button class="anexo-btn anexo-btn-view" onclick="visualizarAnexo('${anexo.url_download}', '${anexo.tipo_arquivo}')">
            👁️ Ver
          </button>
          <button class="anexo-btn anexo-btn-download" onclick="baixarAnexo('${anexo.url_download}', '${anexo.nome_arquivo_original}')">
            ⬇️ Baixar
          </button>
        </div>
      </div>
    `;
  }).join('');

  console.log(`[renderizarAnexos] HTML gerado com ${anexos.length} anexo(s)`);
  console.log('[renderizarAnexos] Inserindo HTML na página...');
  listaAnexos.innerHTML = htmlAnexos;
  console.log('=== RENDERIZAR ANEXOS - CONCLUÍDO (SUCESSO) ===');
}

/**
 * Retorna emoji/ícone baseado no tipo MIME
 * @param {string} tipo - Tipo MIME do arquivo
 * @returns {string} Emoji representando o tipo
 */
function obterIconeTipoArquivo(tipo) {
  if (!tipo) return '📎';

  if (tipo.includes('pdf')) return '📄';
  if (tipo.includes('image')) return '🖼️';
  if (tipo.includes('word') || tipo.includes('document')) return '📝';
  if (tipo.includes('excel') || tipo.includes('spreadsheet')) return '📊';
  if (tipo.includes('zip') || tipo.includes('compressed')) return '📦';

  return '📎';
}

/**
 * Formata data ISO para formato brasileiro
 * @param {string} dataISO - Data em formato ISO
 * @returns {string} Data formatada
 */
function formatarDataUpload(dataISO) {
  if (!dataISO) return 'Data não disponível';

  try {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return 'Data inválida';
  }
}

/**
 * Abre anexo em nova aba para visualização
 * @param {string} url - URL do arquivo no Drive
 * @param {string} tipo - Tipo MIME do arquivo
 */
function visualizarAnexo(url, tipo) {
  if (!url) {
    alert('URL do anexo não encontrada');
    return;
  }

  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Faz download do anexo
 * @param {string} url - URL do arquivo no Drive
 * @param {string} nomeArquivo - Nome original do arquivo
 */
function baixarAnexo(url, nomeArquivo) {
  if (!url) {
    alert('URL do anexo não encontrada');
    return;
  }

  const link = document.createElement('a');
  link.href = url;
  link.download = nomeArquivo || 'arquivo';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Faz upload de múltiplos arquivos para uma notificação
 * @param {number} idNotificacao - ID da notificação
 * @param {FileList} arquivos - Lista de arquivos do input
 * @param {Function} onProgress - Callback de progresso (opcional)
 * @param {Function} onComplete - Callback de conclusão (opcional)
 * @param {string} nomeCrianca - Nome da criança (opcional, para criação de pasta)
 */
async function uploadAnexos(idNotificacao, arquivos, onProgress, onComplete, nomeCrianca) {
  console.log('=== UPLOAD ANEXOS - INÍCIO ===');
  console.log(`[uploadAnexos] Timestamp: ${new Date().toISOString()}`);
  console.log(`[uploadAnexos] ID Notificação: ${idNotificacao}`);
  console.log(`[uploadAnexos] Quantidade de arquivos: ${arquivos.length}`);

  const emailUsuario = sessionStorage.getItem('userEmail');
  console.log(`[uploadAnexos] Email do usuário: ${emailUsuario}`);

  const totalArquivos = arquivos.length;
  let uploadados = 0;
  let erros = 0;

  console.log(`[uploadAnexos] ✓ Iniciando loop de ${totalArquivos} arquivo(s)...`);

  for (const arquivo of Array.from(arquivos)) {
    try {
      console.log(`\n[uploadAnexos] Processando arquivo: ${arquivo.name}`);
      console.log(`[uploadAnexos] Tipo: ${arquivo.type}`);
      console.log(`[uploadAnexos] Tamanho: ${(arquivo.size / 1024).toFixed(2)} KB`);

      // Validar tamanho
      const MAX_SIZE = 10 * 1024 * 1024; // 10MB
      if (arquivo.size > MAX_SIZE) {
        const tamanhoMB = (arquivo.size / 1024 / 1024).toFixed(2);
        console.error(`❌ [uploadAnexos] Arquivo ${arquivo.name} muito grande (${tamanhoMB}MB > 10MB)`);
        erros++;
        continue;
      }
      console.log(`[uploadAnexos] ✓ Tamanho validado`);

      // Converter para base64
      console.log(`[uploadAnexos] Convertendo para base64...`);
      const dataBase64 = await arquivoParaBase64(arquivo);
      console.log(`[uploadAnexos] ✓ Base64 gerado (${dataBase64.length} caracteres)`);

      // Fazer upload
      console.log(`[uploadAnexos] Enviando para backend...`);
      const resultado = await chamarBackendAnexos('uploadAnexo', {
        arquivo: {
          name: arquivo.name,
          mimeType: arquivo.type,
          dataBase64: dataBase64
        },
        idNotificacao: idNotificacao,
        idNotificacao: idNotificacao,
        emailUsuario: emailUsuario,
        // Prioriza parâmetro nomeCrianca se fornecido, senão tenta DOM
        nomeCrianca: (function () {
          // Se foi passado como parâmetro, usa ele
          if (nomeCrianca && nomeCrianca.trim() !== '') {
            console.log(`[uploadAnexos] Nome da criança via parâmetro: ${nomeCrianca}`);
            return nomeCrianca;
          }
          // Fallback: tenta pegar do DOM
          const idsCrianca = ['criancaEstudante', 'edit_criancaEstudante'];
          for (const id of idsCrianca) {
            const el = document.getElementById(id);
            if (el && el.value && el.value.trim() !== '') {
              console.log(`[uploadAnexos] Nome da criança encontrado em #${id}: ${el.value}`);
              return el.value;
            }
          }
          console.warn('[uploadAnexos] ⚠️ Não foi possível encontrar o nome da criança');
          return '';
        })()
      });

      if (resultado.success) {
        uploadados++;
        console.log(`✅ [uploadAnexos] Upload concluído: ${arquivo.name}`);
        if (resultado.metadados && resultado.metadados.taxaCompressao) {
          console.log(`[uploadAnexos] Compressão: ${resultado.metadados.taxaCompressao.toFixed(1)}%`);
        }
        console.log(`[uploadAnexos] ID do anexo no banco: ${resultado.anexoId}`);
        console.log(`[uploadAnexos] File ID no Drive: ${resultado.fileId}`);
      } else {
        erros++;
        console.error(`❌ [uploadAnexos] Erro no upload: ${arquivo.name}`);
        console.error(`[uploadAnexos] Motivo: ${resultado.error}`);
      }

      // Callback de progresso
      if (onProgress) {
        console.log(`[uploadAnexos] Chamando callback de progresso: ${uploadados + erros}/${totalArquivos}`);
        onProgress(uploadados + erros, totalArquivos, arquivo.name);
      }

    } catch (error) {
      erros++;
      console.error(`❌ [uploadAnexos] Erro ao processar ${arquivo.name}:`, error);
      console.error('[uploadAnexos] Stack trace: ', error.stack);
    }
  }

  console.log(`\n[uploadAnexos] Loop concluído`);
  console.log(`[uploadAnexos] Resumo: ${uploadados} sucesso(s), ${erros} erro(s), ${totalArquivos} total`);

  // Callback de conclusão
  if (onComplete) {
    console.log('[uploadAnexos] Chamando callback de conclusão...');
    onComplete(uploadados, erros, totalArquivos);
  }

  console.log('=== UPLOAD ANEXOS - FIM ===');

  return {
    uploadados,
    erros,
    total: totalArquivos
  };
}

/**
 * Converte arquivo para base64
 * @param {File} arquivo - Arquivo a ser convertido
 * @returns {Promise<string>} String base64 (sem prefixo data:)
 */
function arquivoParaBase64(arquivo) {
  console.log(`[arquivoParaBase64] Convertendo arquivo: ${arquivo.name}`);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (e) {
      try {
        console.log('[arquivoParaBase64] ✓ FileReader.onload disparado');
        // Remove o prefixo data:...;base64,
        const result = e.target.result;
        console.log('[arquivoParaBase64] Result length: ' + result.length);

        const base64 = result.split(',')[1];
        if (!base64) {
          throw new Error('Não foi possível extrair base64 do resultado');
        }

        console.log(`[arquivoParaBase64] ✓ Base64 extraído: ${base64.length} caracteres`);
        resolve(base64);
      } catch (error) {
        console.error('[arquivoParaBase64] ❌ Erro ao processar resultado: ', error);
        reject(error);
      }
    };

    reader.onerror = function (error) {
      console.error('[arquivoParaBase64] ❌ FileReader error: ', error);
      reject(error);
    };

    console.log('[arquivoParaBase64] Iniciando FileReader.readAsDataURL()');
    reader.readAsDataURL(arquivo);
  });
}

/**
 * Exclui um anexo específico
 * @param {number} anexoId - ID do anexo
 * @returns {Promise<Object>} Resultado da exclusão
 */
async function excluirAnexoEspecifico(anexoId) {
  if (!confirm('Deseja realmente excluir este anexo?')) {
    return { success: false, cancelled: true };
  }

  try {
    const resultado = await chamarBackendAnexos('excluirAnexo', {
      anexoId: anexoId
    });

    if (resultado.success) {
      alert('Anexo excluído com sucesso!');
      return resultado;
    } else {
      throw new Error(resultado.error || 'Erro desconhecido');
    }
  } catch (error) {
    console.error('Erro ao excluir anexo:', error);
    alert('Erro ao excluir anexo: ' + error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Exclui todos os anexos de uma notificação
 * @param {number} idNotificacao - ID da notificação
 * @returns {Promise<Object>} Resultado da exclusão
 */
async function excluirTodosAnexos(idNotificacao) {
  try {
    const resultado = await chamarBackendAnexos('excluirTodosAnexosNotificacao', {
      idNotificacao: idNotificacao
    });

    console.log(`🗑️ Excluídos ${resultado.arquivosExcluidos} anexos da notificação ${idNotificacao}`);
    return resultado;
  } catch (error) {
    console.error('Erro ao excluir anexos:', error);
    return { success: false, error: error.message, arquivosExcluidos: 0 };
  }
}

/**
 * Cria preview de arquivos antes do upload
 * @param {FileList} arquivos - Lista de arquivos
 * @param {HTMLElement} containerPreview - Elemento onde exibir preview
 */
function criarPreviewAnexos(arquivos, containerPreview) {
  console.log('=== CRIAR PREVIEW ANEXOS - INÍCIO ===');
  console.log(`[criarPreviewAnexos] Timestamp: ${new Date().toISOString()}`);
  console.log(`[criarPreviewAnexos] Total de arquivos para preview: ${arquivos.length}`);

  if (!containerPreview) {
    console.error('[criarPreviewAnexos] ❌ Container de preview não encontrado');
    return;
  }

  console.log('[criarPreviewAnexos] ✓ Container de preview encontrado');

  const htmlPreviews = Array.from(arquivos).map((arquivo, index) => {
    const tamanhoMB = (arquivo.size / 1024 / 1024).toFixed(2);
    const icone = obterIconeTipoArquivo(arquivo.type);
    const statusClass = arquivo.size > 10 * 1024 * 1024 ? 'preview-erro' : 'preview-ok';

    console.log(`[criarPreviewAnexos] Arquivo ${index + 1}/${arquivos.length}:`);
    console.log(`  - Nome: ${arquivo.name}`);
    console.log(`  - Tipo: ${arquivo.type}`);
    console.log(`  - Tamanho: ${tamanhoMB} MB`);
    console.log(`  - Status: ${arquivo.size > 10 * 1024 * 1024 ? 'MUITO GRANDE ❌' : 'OK ✓'}`);
    console.log(`  - Ícone: ${icone}`);

    return `
      <div class="preview-item ${statusClass}">
        <span class="preview-icone">${icone}</span>
        <span class="preview-nome">${arquivo.name}</span>
        <span class="preview-tamanho">${tamanhoMB} MB</span>
        ${arquivo.size > 10 * 1024 * 1024 ? '<span class="preview-aviso">⚠️ Muito grande</span>' : ''}
      </div>
    `;
  }).join('');

  console.log('[criarPreviewAnexos] Inserindo HTML no container...');
  containerPreview.innerHTML = htmlPreviews || '<p class="preview-vazio">Nenhum arquivo selecionado</p>';
  console.log('=== CRIAR PREVIEW ANEXOS - CONCLUÍDO ===');
}

// ============================================
// EXPORTAR FUNÇÕES (se necessário)
// ============================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    carregarAnexosModal,
    renderizarAnexos,
    uploadAnexos,
    excluirAnexoEspecifico,
    excluirTodosAnexos,
    visualizarAnexo,
    baixarAnexo,
    criarPreviewAnexos
  };
}
