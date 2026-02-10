// ============================================
// CODE-ANEXOS.GS - Sistema de Anexos para Notificações
// ============================================
// Adicionar ao final do arquivo Code.gs existente
// ou criar arquivo separado no Apps Script
// 
// IMPORTANTE: Este arquivo reutiliza SUPABASE_URL e SUPABASE_ANON_KEY 
// que já estão definidos no Code.gs principal

// ========================================
// CONFIGURAÇÃO DO GOOGLE DRIVE
// ========================================
// const DRIVE_FOLDER_NAME = 'Anexos-Notificacoes-Sistema'; // Removido para evitar duplicidade
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB por arquivo
const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/jpg',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

// ========================================
// CRIAR/OBTER PASTA DO DRIVE
// ========================================
function obterPastaDrive() {
  try {
    // Buscar pasta existente
    const folders = DriveApp.getFoldersByName(DRIVE_FOLDER_NAME);
    
    if (folders.hasNext()) {
      return folders.next();
    }
    
    // Criar pasta se não existir
    const folder = DriveApp.createFolder(DRIVE_FOLDER_NAME);
    folder.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.NONE);
    Logger.log('Pasta criada: ' + folder.getId());
    
    return folder;
  } catch (error) {
    Logger.log('Erro ao obter pasta: ' + error);
    throw error;
  }
}

// ========================================
// COMPRESSÃO DE ARQUIVOS
// ========================================

/**
 * Comprime arquivo antes de salvar no Drive
 * @param {Blob} blob - Arquivo original
 * @param {string} tipo - Tipo MIME
 * @return {Object} {blob: Blob, metadados: Object}
 */
function comprimirArquivo(blob, tipo) {
  try {
    const tamanhoOriginal = blob.getBytes().length;
    let blobComprimido;
    
    // PDF - comprimir removendo metadados
    if (tipo === 'application/pdf') {
      blobComprimido = comprimirPDF(blob);
    }
    // Imagens - redimensionar e comprimir
    else if (tipo.startsWith('image/')) {
      blobComprimido = comprimirImagem(blob, tipo);
    }
    // Outros - compressão ZIP
    else {
      blobComprimido = comprimirGenerico(blob);
    }
    
    const tamanhoComprimido = blobComprimido.getBytes().length;
    const taxaCompressao = ((tamanhoOriginal - tamanhoComprimido) / tamanhoOriginal * 100).toFixed(2);
    
    Logger.log(`Compressão: ${tamanhoOriginal} → ${tamanhoComprimido} bytes (${taxaCompressao}%)`);
    
    return {
      blob: blobComprimido,
      metadados: {
        tamanhoOriginal: tamanhoOriginal,
        tamanhoComprimido: tamanhoComprimido,
        taxaCompressao: parseFloat(taxaCompressao)
      }
    };
  } catch (error) {
    Logger.log('Erro na compressão: ' + error);
    // Se falhar, retorna original
    return {
      blob: blob,
      metadados: {
        tamanhoOriginal: blob.getBytes().length,
        tamanhoComprimido: blob.getBytes().length,
        taxaCompressao: 0
      }
    };
  }
}

/**
 * Comprime PDF removendo metadados desnecessários
 */
function comprimirPDF(pdfBlob) {
  try {
    // Google Apps Script não tem biblioteca nativa para PDF
    // Usar compressão ZIP como fallback
    return comprimirGenerico(pdfBlob);
  } catch (error) {
    Logger.log('Erro ao comprimir PDF: ' + error);
    return pdfBlob;
  }
}

/**
 * Comprime imagem reduzindo qualidade
 * Nota: Apps Script tem limitações, compressão básica via ZIP
 */
function comprimirImagem(imagemBlob, tipo) {
  try {
    // Converter PNG para JPG se aplicável
    if (tipo === 'image/png') {
      // Apps Script não suporta conversão de imagem nativamente
      // Usar ZIP como fallback
      return comprimirGenerico(imagemBlob);
    }
    
    return comprimirGenerico(imagemBlob);
  } catch (error) {
    Logger.log('Erro ao comprimir imagem: ' + error);
    return imagemBlob;
  }
}

/**
 * Compressão genérica usando ZIP
 */
function comprimirGenerico(blob) {
  try {
    const nomeOriginal = blob.getName();
    const zipBlob = Utilities.zip([blob], nomeOriginal + '.zip');
    return zipBlob;
  } catch (error) {
    Logger.log('Erro na compressão ZIP: ' + error);
    return blob;
  }
}

// ========================================
// UPLOAD DE ANEXO
// ========================================

/**
 * Faz upload de arquivo para o Drive e salva metadados no Supabase
 * @param {Object} arquivo - {name, mimeType, dataBase64}
 * @param {number} idNotificacao - ID da notificação
 * @param {string} emailUsuario - Email do usuário
 * @return {Object} resultado
 */
function uploadAnexo(arquivo, idNotificacao, emailUsuario, nomeCriancaParam) {
  try {
    Logger.log('=== UPLOAD ANEXO - INÍCIO ===');
    Logger.log('[uploadAnexo] Timestamp: ' + new Date().toISOString());
    Logger.log('[uploadAnexo] Arquivo recebido: ' + JSON.stringify(arquivo));
    Logger.log('[uploadAnexo] ID Notificação: ' + idNotificacao + ' (tipo: ' + typeof idNotificacao + ')');
    Logger.log('[uploadAnexo] Email Usuário: ' + emailUsuario);
    Logger.log('[uploadAnexo] ALLOWED_TYPES: ' + ALLOWED_TYPES.join(', '));
    
    // Validações iniciais
    if (!arquivo) {
      throw new Error('Arquivo é nulo ou indefinido');
    }
    
    if (!arquivo.name) {
      throw new Error('Campo arquivo.name não encontrado. Objeto recebido: ' + JSON.stringify(arquivo));
    }
    
    if (!arquivo.dataBase64) {
      throw new Error('Campo arquivo.dataBase64 não encontrado. Objeto recebido: ' + JSON.stringify(arquivo));
    }
    
    Logger.log('[uploadAnexo] ✓ Validações iniciais passaram');
    Logger.log('[uploadAnexo] Nome do arquivo: ' + arquivo.name);
    Logger.log('[uploadAnexo] Tipo MIME: ' + arquivo.mimeType);
    Logger.log('[uploadAnexo] Tamanho do dataBase64: ' + arquivo.dataBase64.length + ' caracteres');
    
    // Validar tipo de arquivo
    if (!ALLOWED_TYPES.includes(arquivo.mimeType)) {
      Logger.log('[uploadAnexo] ❌ Tipo de arquivo não permitido: ' + arquivo.mimeType);
      Logger.log('[uploadAnexo] Tipos permitidos: ' + ALLOWED_TYPES.join(', '));
      throw new Error('Tipo de arquivo não permitido: ' + arquivo.mimeType);
    }
    Logger.log('[uploadAnexo] ✓ Tipo de arquivo validado: ' + arquivo.mimeType);
    
    // Converter base64 para Blob (SEM COMPRESSÃO)
    Logger.log('[uploadAnexo] Iniciando conversão de base64 para Blob...');
    const bytes = Utilities.base64Decode(arquivo.dataBase64);
    Logger.log('[uploadAnexo] ✓ Base64 decodificado: ' + bytes.length + ' bytes');
    
    const blob = Utilities.newBlob(bytes, arquivo.mimeType, arquivo.name);
    Logger.log('[uploadAnexo] ✓ Blob criado: ' + blob.getName() + ' (' + blob.getBytes().length + ' bytes)');
    
    // Validar tamanho
    const tamanhoEmMB = (blob.getBytes().length / 1024 / 1024).toFixed(2);
    Logger.log('[uploadAnexo] Tamanho do arquivo: ' + tamanhoEmMB + ' MB');
    
    if (blob.getBytes().length > MAX_FILE_SIZE) {
      Logger.log('[uploadAnexo] ❌ Arquivo muito grande. Máximo: ' + (MAX_FILE_SIZE / 1024 / 1024) + ' MB, Recebido: ' + tamanhoEmMB + ' MB');
      throw new Error('Arquivo muito grande. Máximo: 10 MB, Recebido: ' + tamanhoEmMB + ' MB');
    }
    Logger.log('[uploadAnexo] ✓ Tamanho validado');
    
    // SKIP COMPRESSION - Upload direto
    Logger.log('[uploadAnexo] ⏭️ PULANDO COMPRESSÃO - Upload direto do arquivo');
    const blobParaUpload = blob;
    const tamanhoFinal = blobParaUpload.getBytes().length;
    Logger.log('[uploadAnexo] Tamanho final: ' + tamanhoFinal + ' bytes');
    
    // Nome do arquivo no Drive
    const timestamp = new Date().getTime();
    const nomeStorage = `notif_${idNotificacao}_${timestamp}_${arquivo.name}`;
    Logger.log('[uploadAnexo] Nome do arquivo no Drive: ' + nomeStorage);
    blobParaUpload.setName(nomeStorage);
    Logger.log('[uploadAnexo] ✓ Nome do arquivo definido');
    
    // Fazer upload para o Drive
    Logger.log('[uploadAnexo] Obtendo estrutura de pastas do Drive...');
    
    // 1. Buscar nome da criança EXCLUSIVAMENTE na planilha usando id_notificacao_planilha
    let nomeCrianca = 'Criança Não Identificada';
    
    Logger.log('[uploadAnexo] Buscando nome da criança na planilha pelo ID: ' + idNotificacao);
    
    try {
      // Busca direta na planilha usando a função do Code.gs
      if (typeof buscarNaPlanilhaPorId === 'function') {
        const dadosPlanilha = buscarNaPlanilhaPorId(idNotificacao);
        if (dadosPlanilha && dadosPlanilha.criancaEstudante) {
          nomeCrianca = dadosPlanilha.criancaEstudante;
          Logger.log('[uploadAnexo] ✓ Nome da criança encontrado na planilha: ' + nomeCrianca);
        } else {
          Logger.log('[uploadAnexo] ⚠️ Registro não encontrado ou campo criancaEstudante vazio para ID: ' + idNotificacao);
        }
      } else {
        // Fallback: buscar manualmente na planilha
        Logger.log('[uploadAnexo] Função buscarNaPlanilhaPorId não disponível, buscando manualmente...');
        
        const ss = SpreadsheetApp.openById(SHEET_ID);
        const sheet = ss.getSheetByName(SHEET_NAME);
        const lastRow = sheet.getLastRow();
        
        if (lastRow >= 2) {
          // Buscar a linha pelo ID (coluna Y = 25)
          const dados = sheet.getRange(2, 1, lastRow - 1, 25).getValues();
          for (let i = 0; i < dados.length; i++) {
            const idLinha = dados[i][24]; // Coluna Y (índice 24)
            if (String(idLinha) === String(idNotificacao)) {
              nomeCrianca = dados[i][0] || 'Criança Não Identificada'; // Coluna A = nome
              Logger.log('[uploadAnexo] ✓ Nome encontrado via busca manual: ' + nomeCrianca);
              break;
            }
          }
        }
      }
    } catch (erroBusca) {
      Logger.log('[uploadAnexo] ❌ Erro ao buscar nome da criança: ' + erroBusca.toString());
    }
    
    if (nomeCrianca === 'Criança Não Identificada') {
      Logger.log('[uploadAnexo] ⚠️ ALERTA: Nome da criança não foi encontrado para id_notificacao_planilha=' + idNotificacao);
    }
    
    // 2. Usar o Gerenciador de Pastas (DriveFolderManager.gs)
    const pasta = getAnexoDestinationFolder(emailUsuario, nomeCrianca, idNotificacao);
    Logger.log('[uploadAnexo] ✓ Pasta de destino obtida: ' + pasta.getName());
    
    Logger.log('[uploadAnexo] Iniciando upload para Google Drive...');
    const file = pasta.createFile(blobParaUpload);
    Logger.log('[uploadAnexo] ✓ Arquivo criado no Drive');
    
    const fileId = file.getId();
    Logger.log('[uploadAnexo] File ID gerado: ' + fileId);
    
    // Tornar compartilhável
    Logger.log('[uploadAnexo] Configurando permissões de compartilhamento...');
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    Logger.log('[uploadAnexo] ✓ Arquivo compartilhável');
    
    const urlDownload = file.getDownloadUrl();
    Logger.log('[uploadAnexo] URL de download obtida: ' + urlDownload);
    Logger.log('[uploadAnexo] ✓ Arquivo salvo no Drive: ' + fileId);
    
    // Montar objeto de metadados (SEM DADOS DE COMPRESSÃO)
    // IMPORTANTE: O idNotificacao pode ser o ID da planilha, não a PK do Supabase
    // Precisamos resolver a PK real antes de inserir na tabela de anexos
    let pkNotificacao = idNotificacao;
    
    try {
      // Tenta buscar a PK do Supabase usando o id_notificacao_planilha
      Logger.log('[uploadAnexo] Resolvendo PK do Supabase para id_notificacao=' + idNotificacao);
      
      const urlBusca = SUPABASE_URL + '/rest/v1/notifications_ids?id_notificacao_planilha=eq.' + idNotificacao + '&select=id';
      const optionsBusca = {
        method: 'get',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        },
        muteHttpExceptions: true
      };
      
      const responseBusca = UrlFetchApp.fetch(urlBusca, optionsBusca);
      const codeBusca = responseBusca.getResponseCode();
      
      if (codeBusca === 200) {
        const resultadoBusca = JSON.parse(responseBusca.getContentText());
        if (resultadoBusca && resultadoBusca.length > 0 && resultadoBusca[0].id) {
          pkNotificacao = resultadoBusca[0].id;
          Logger.log('[uploadAnexo] ✓ PK do Supabase resolvida: ' + pkNotificacao + ' (de id_planilha=' + idNotificacao + ')');
        } else {
          Logger.log('[uploadAnexo] ⚠️ Nenhum registro encontrado para id_notificacao_planilha=' + idNotificacao + '. Usando ID original.');
        }
      } else {
        Logger.log('[uploadAnexo] ⚠️ Erro ao buscar PK (HTTP ' + codeBusca + '). Usando ID original.');
      }
    } catch (erroBuscaPK) {
      Logger.log('[uploadAnexo] ⚠️ Erro ao resolver PK: ' + erroBuscaPK.toString() + '. Usando ID original.');
    }
    
    const metadadosParaSalvar = {
      id_notificacao: pkNotificacao,
      nome_arquivo_original: arquivo.name,
      nome_arquivo_storage: nomeStorage,
      tipo_arquivo: arquivo.mimeType,
      tamanho_original: tamanhoFinal, // Corrigido de tamanho_arquivo para tamanho_original
      tamanho_comprimido: tamanhoFinal, // Mesmo tamanho pois sem compressão
      taxa_compressao: 0,
      drive_file_id: fileId,
      url_download: urlDownload,
      usuario_upload: emailUsuario
    };
    
    Logger.log('[uploadAnexo] Metadados preparados para Supabase:');
    Logger.log('[uploadAnexo] - id_notificacao: ' + metadadosParaSalvar.id_notificacao);
    Logger.log('[uploadAnexo] - nome_arquivo_original: ' + metadadosParaSalvar.nome_arquivo_original);
    Logger.log('[uploadAnexo] - nome_arquivo_storage: ' + metadadosParaSalvar.nome_arquivo_storage);
    Logger.log('[uploadAnexo] - tipo_arquivo: ' + metadadosParaSalvar.tipo_arquivo);
    Logger.log('[uploadAnexo] - tamanho_arquivo: ' + metadadosParaSalvar.tamanho_arquivo + ' bytes');
    Logger.log('[uploadAnexo] - drive_file_id: ' + metadadosParaSalvar.drive_file_id);
    Logger.log('[uploadAnexo] - usuario_upload: ' + metadadosParaSalvar.usuario_upload);
    
    // Salvar metadados no Supabase
    Logger.log('[uploadAnexo] Iniciando salvamento dos metadados no Supabase...');
    const anexoId = salvarMetadadosAnexo(metadadosParaSalvar);
    Logger.log('[uploadAnexo] ✓ Metadados salvos no Supabase com ID: ' + anexoId);
    
    Logger.log('=== UPLOAD ANEXO - SUCESSO ===');
    
    return {
      success: true,
      anexoId: anexoId,
      fileId: fileId,
      url: urlDownload
    };
    
  } catch (error) {
    Logger.log('=== UPLOAD ANEXO - ERRO ===');
    Logger.log('[uploadAnexo] ❌ Erro: ' + error.toString());
    Logger.log('[uploadAnexo] Stack: ' + error.stack);
    return {
      success: false,
      error: error.toString()
    };
  }
}

// ========================================
// SALVAR METADADOS NO SUPABASE
// ========================================
function salvarMetadadosAnexo(dados) {
  try {
    Logger.log('=== SALVAR METADADOS - INÍCIO ===');
    Logger.log('[salvarMetadadosAnexo] Timestamp: ' + new Date().toISOString());
    Logger.log('[salvarMetadadosAnexo] Dados recebidos: ' + JSON.stringify(dados));
    
    if (!dados) {
      throw new Error('Parâmetro dados é nulo ou indefinido');
    }
    
    if (!dados.id_notificacao) {
      Logger.log('[salvarMetadadosAnexo] ❌ Campo id_notificacao não encontrado');
      Logger.log('[salvarMetadadosAnexo] Dados recebidos: ' + JSON.stringify(dados));
      throw new Error('Dados inválidos: id_notificacao não encontrado');
    }
    
    Logger.log('[salvarMetadadosAnexo] ✓ Validação de dados concluída');
    Logger.log('[salvarMetadadosAnexo] ID Notificação: ' + dados.id_notificacao);
    
    const url = SUPABASE_URL + '/rest/v1/anexos_notificacoes';
    Logger.log('[salvarMetadadosAnexo] URL Supabase: ' + url);
    
    const payload = {
      id_notificacao: dados.id_notificacao,
      nome_arquivo_original: dados.nome_arquivo_original,
      nome_arquivo_storage: dados.nome_arquivo_storage,
      tipo_arquivo: dados.tipo_arquivo,
      tamanho_original: dados.tamanho_original,
      tamanho_comprimido: dados.tamanho_comprimido,
      taxa_compressao: dados.taxa_compressao,
      drive_file_id: dados.drive_file_id,
      url_download: dados.url_download,
      usuario_upload: dados.usuario_upload
    };
    
    Logger.log('[salvarMetadadosAnexo] Payload montado:');
    Logger.log('[salvarMetadadosAnexo] - id_notificacao: ' + payload.id_notificacao);
    Logger.log('[salvarMetadadosAnexo] - nome_arquivo_original: ' + payload.nome_arquivo_original);
    Logger.log('[salvarMetadadosAnexo] - tipo_arquivo: ' + payload.tipo_arquivo);
    Logger.log('[salvarMetadadosAnexo] - drive_file_id: ' + payload.drive_file_id);
    Logger.log('[salvarMetadadosAnexo] - usuario_upload: ' + payload.usuario_upload);
    
    const options = {
      method: 'post',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };
    
    Logger.log('[salvarMetadadosAnexo] Headers preparados:');
    Logger.log('[salvarMetadadosAnexo] - Content-Type: application/json');
    Logger.log('[salvarMetadadosAnexo] - Prefer: return=representation');
    
    Logger.log('[salvarMetadadosAnexo] Enviando requisição POST para Supabase...');
    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    Logger.log('[salvarMetadadosAnexo] ✓ Resposta recebida');
    Logger.log('[salvarMetadadosAnexo] Status HTTP: ' + responseCode);
    Logger.log('[salvarMetadadosAnexo] Response Text: ' + responseText);
    
    if (responseCode === 201) {
      Logger.log('[salvarMetadadosAnexo] ✓ Status 201 (Created) - Sucesso!');
      const anexoCriado = JSON.parse(responseText)[0];
      Logger.log('[salvarMetadadosAnexo] Anexo criado: ' + JSON.stringify(anexoCriado));
      Logger.log('[salvarMetadadosAnexo] ID retornado: ' + anexoCriado.id);
      Logger.log('=== SALVAR METADADOS - SUCESSO ===');
      return anexoCriado.id;
    } else if (responseCode === 200) {
      Logger.log('[salvarMetadadosAnexo] ⚠️ Status 200 (OK) - Esperava 201, mas funcionou');
      const anexoCriado = JSON.parse(responseText)[0];
      Logger.log('[salvarMetadadosAnexo] Anexo criado: ' + JSON.stringify(anexoCriado));
      return anexoCriado.id;
    } else {
      Logger.log('[salvarMetadadosAnexo] ❌ Status HTTP inesperado: ' + responseCode);
      Logger.log('[salvarMetadadosAnexo] Resposta: ' + responseText);
      throw new Error('Erro ao salvar metadados no Supabase. Status: ' + responseCode + ', Resposta: ' + responseText);
    }
  } catch (error) {
    Logger.log('=== SALVAR METADADOS - ERRO ===');
    Logger.log('[salvarMetadadosAnexo] ❌ Erro: ' + error.toString());
    Logger.log('[salvarMetadadosAnexo] Stack: ' + error.stack);
    throw error;
  }
}

// ========================================
// LISTAR ANEXOS DE UMA NOTIFICAÇÃO
// ========================================
function listarAnexosNotificacao(idNotificacao) {
  try {
    Logger.log('[listarAnexosNotificacao] Início - idNotificacao: ' + idNotificacao);
    Logger.log('[listarAnexosNotificacao] Tipo de idNotificacao: ' + typeof idNotificacao);
    
    const url = SUPABASE_URL + '/rest/v1/anexos_notificacoes?id_notificacao=eq.' + idNotificacao + '&select=*&order=data_upload.desc';
    Logger.log('[listarAnexosNotificacao] URL da query: ' + url);
    
    const options = {
      method: 'get',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      },
      muteHttpExceptions: true
    };
    
    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    Logger.log('[listarAnexosNotificacao] Status HTTP: ' + responseCode);
    Logger.log('[listarAnexosNotificacao] Resposta: ' + responseText);
    
    if (responseCode === 200) {
      const anexos = JSON.parse(responseText);
      Logger.log('[listarAnexosNotificacao] Anexos encontrados: ' + anexos.length);
      
      if (anexos.length > 0) {
        Logger.log('[listarAnexosNotificacao] Primeiro anexo: ' + JSON.stringify(anexos[0]));
      }
      
      return {
        success: true,
        anexos: anexos
      };
    } else {
      Logger.log('[listarAnexosNotificacao] ❌ Erro HTTP ' + responseCode + ': ' + responseText);
      throw new Error('Erro ao listar anexos: ' + responseText);
    }
  } catch (error) {
    Logger.log('[listarAnexosNotificacao] ❌ ERRO: ' + error);
    return {
      success: false,
      error: error.toString(),
      anexos: []
    };
  }
}

// ========================================
// EXCLUIR ANEXO (Drive + Supabase)
// ========================================
function excluirAnexo(anexoId) {
  try {
    // 1. Buscar informações do anexo
    const urlGet = SUPABASE_URL + '/rest/v1/anexos_notificacoes?id=eq.' + anexoId + '&select=*';
    
    const optionsGet = {
      method: 'get',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY
      },
      muteHttpExceptions: true
    };
    
    const responseGet = UrlFetchApp.fetch(urlGet, optionsGet);
    if (responseGet.getResponseCode() !== 200) {
      throw new Error('Anexo não encontrado');
    }
    
    const anexo = JSON.parse(responseGet.getContentText())[0];
    
    // 2. Excluir do Google Drive
    try {
      const file = DriveApp.getFileById(anexo.drive_file_id);
      file.setTrashed(true);
      Logger.log('Arquivo excluído do Drive: ' + anexo.drive_file_id);
    } catch (driveError) {
      Logger.log('Aviso: Arquivo não encontrado no Drive (pode já ter sido excluído)');
    }
    
    // 3. Excluir do Supabase
    const urlDelete = SUPABASE_URL + '/rest/v1/anexos_notificacoes?id=eq.' + anexoId;
    
    const optionsDelete = {
      method: 'delete',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY
      },
      muteHttpExceptions: true
    };
    
    const responseDelete = UrlFetchApp.fetch(urlDelete, optionsDelete);
    
    if (responseDelete.getResponseCode() === 204) {
      return {
        success: true,
        message: 'Anexo excluído com sucesso'
      };
    } else {
      throw new Error('Erro ao excluir do banco: ' + responseDelete.getContentText());
    }
    
  } catch (error) {
    Logger.log('Erro em excluirAnexo: ' + error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

// ========================================
// EXCLUIR TODOS OS ANEXOS DE UMA NOTIFICAÇÃO
// ========================================
function excluirTodosAnexosNotificacao(idNotificacao) {
  try {
    // Listar anexos
    const resultado = listarAnexosNotificacao(idNotificacao);
    
    if (!resultado.success || resultado.anexos.length === 0) {
      return {
        success: true,
        arquivosExcluidos: 0
      };
    }
    
    let sucessos = 0;
    let falhas = 0;
    
    // Excluir cada anexo
    resultado.anexos.forEach(function(anexo) {
      const resultadoExclusao = excluirAnexo(anexo.id);
      if (resultadoExclusao.success) {
        sucessos++;
      } else {
        falhas++;
        Logger.log('Falha ao excluir anexo ' + anexo.id + ': ' + resultadoExclusao.error);
      }
    });
    
    Logger.log(`Exclusão de anexos: ${sucessos} sucessos, ${falhas} falhas`);
    
    return {
      success: true,
      arquivosExcluidos: sucessos,
      falhas: falhas
    };
    
  } catch (error) {
    Logger.log('Erro em excluirTodosAnexosNotificacao: ' + error);
    return {
      success: false,
      error: error.toString(),
      arquivosExcluidos: 0
    };
  }
}

// ========================================
// ADICIONAR ROTAS NO doPost
// ========================================
// Adicionar estas linhas no switch/case do doPost existente:

/*
  } else if (dados.action === 'uploadAnexo') {
    Logger.log('Executando: uploadAnexo()');
    // Adicionado parâmetro nomeCrianca opcional
    resultado = uploadAnexo(dados.arquivo, dados.idNotificacao, dados.emailUsuario, dados.nomeCrianca);
    
  } else if (dados.action === 'listarAnexosNotificacao') {
    Logger.log('Executando: listarAnexosNotificacao()');
    resultado = listarAnexosNotificacao(dados.idNotificacao);
    
  } else if (dados.action === 'excluirAnexo') {
    Logger.log('Executando: excluirAnexo()');
    resultado = excluirAnexo(dados.anexoId);
    
  } else if (dados.action === 'excluirTodosAnexosNotificacao') {
    Logger.log('Executando: excluirTodosAnexosNotificacao()');
    resultado = excluirTodosAnexosNotificacao(dados.idNotificacao);
*/

// ========================================
// FUNÇÃO DE TESTE MANUAL
// ========================================
/**
 * Função para testar upload de imagem e metadados manualmente
 * Execute esta função direto no Apps Script Editor
 */
function TESTE_uploadManual() {
  try {
    Logger.log('========================================');
    Logger.log('TESTE DE UPLOAD MANUAL - INÍCIO');
    Logger.log('========================================');
    
    // 0. Buscar um ID de notificação REAL do sistema
    Logger.log('\n--- FASE 0: Buscar ID de notificação existente ---');
    const idNotificacao = buscarIdNotificacaoExistente();
    
    if (!idNotificacao) {
      throw new Error('❌ Nenhuma notificação encontrada no sistema. Crie uma notificação primeiro.');
    }
    
    Logger.log('✅ ID encontrado: ' + idNotificacao);
    
    // 1. Criar uma imagem de teste (PNG vermelho 10x10 pixels)
    const imageData = 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mP8z8BQz0AEYBxVSF+FABJADveWkH6oAAAAAElFTkSuQmCC';
    const bytes = Utilities.base64Decode(imageData);
    const blob = Utilities.newBlob(bytes, 'image/png', 'teste.png');
    
    Logger.log('✅ Blob criado: ' + blob.getName());
    Logger.log('   Tamanho: ' + blob.getBytes().length + ' bytes');
    Logger.log('   Tipo: ' + blob.getContentType());
    
    // 2. Upload para o Drive
    Logger.log('\n--- FASE 1: Upload para Google Drive ---');
    const pasta = obterPastaDrive();
    Logger.log('✅ Pasta obtida: ' + pasta.getName());
    
    const timestamp = new Date().getTime();
    const nomeStorage = `teste_manual_${timestamp}.png`;
    blob.setName(nomeStorage);
    
    const file = pasta.createFile(blob);
    Logger.log('✅ Arquivo criado no Drive');
    
    // Tornar compartilhável
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    const fileId = file.getId();
    const urlDownload = file.getDownloadUrl();
    
    Logger.log('   File ID: ' + fileId);
    Logger.log('   URL: ' + urlDownload);
    
    // 3. Salvar metadados no Supabase
    Logger.log('\n--- FASE 2: Salvar metadados no Supabase ---');
    
    const metadados = {
      id_notificacao: idNotificacao, // ID REAL do sistema
      nome_arquivo_original: 'teste.png',
      nome_arquivo_storage: nomeStorage,
      tipo_arquivo: 'image/png',
      tamanho_original: blob.getBytes().length,
      tamanho_comprimido: blob.getBytes().length,
      taxa_compressao: 0,
      drive_file_id: fileId,
      url_download: urlDownload,
      usuario_upload: 'teste@sistema.com'
    };
    
    Logger.log('Metadados: ' + JSON.stringify(metadados, null, 2));
    
    const anexoId = salvarMetadadosAnexo(metadados);
    
    Logger.log('✅ Metadados salvos no Supabase');
    Logger.log('   Anexo ID: ' + anexoId);
    
    // 4. Resultado final
    Logger.log('\n========================================');
    Logger.log('✅✅✅ TESTE CONCLUÍDO COM SUCESSO! ✅✅✅');
    Logger.log('========================================');
    Logger.log('\nDetalhes do arquivo criado:');
    Logger.log('  • ID Notificação: ' + idNotificacao);
    Logger.log('  • Drive File ID: ' + fileId);
    Logger.log('  • Anexo ID (Supabase): ' + anexoId);
    Logger.log('  • URL Download: ' + urlDownload);
    Logger.log('\nPara visualizar:');
    Logger.log('  1. Abra o Google Drive');
    Logger.log('  2. Busque pela pasta: ' + DRIVE_FOLDER_NAME);
    Logger.log('  3. Procure o arquivo: ' + nomeStorage);
    Logger.log('\nPara verificar no Supabase:');
    Logger.log('  1. Abra o Supabase Table Editor');
    Logger.log('  2. Tabela: anexos_notificacoes');
    Logger.log('  3. Busque pelo anexo ID: ' + anexoId);
    Logger.log('  4. Verá id_notificacao: ' + idNotificacao);
    Logger.log('========================================');
    
    return {
      success: true,
      idNotificacao: idNotificacao,
      fileId: fileId,
      anexoId: anexoId,
      url: urlDownload,
      message: 'Teste concluído com sucesso!'
    };
    
  } catch (error) {
    Logger.log('\n❌❌❌ ERRO NO TESTE ❌❌❌');
    Logger.log('Erro: ' + error.toString());
    Logger.log('Stack: ' + error.stack);
    
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Busca um ID de notificação existente no sistema
 * @return {number|null} ID da notificação ou null se não encontrar
 */
function buscarIdNotificacaoExistente() {
  try {
    const url = SUPABASE_URL + '/rest/v1/notifications_ids?select=id&order=id.desc&limit=1';
    
    const options = {
      method: 'get',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      },
      muteHttpExceptions: true
    };
    
    const response = UrlFetchApp.fetch(url, options);
    
    if (response.getResponseCode() === 200) {
      const notificacoes = JSON.parse(response.getContentText());
      
      if (notificacoes.length > 0) {
        return notificacoes[0].id;
      }
    }
    
    return null;
  } catch (error) {
    Logger.log('Erro ao buscar ID de notificação: ' + error);
    return null;
  }
}

/**
 * Função auxiliar para testar apenas o Drive (sem Supabase)
 */
function TESTE_uploadSoDrive() {
  try {
    Logger.log('=== TESTE: Upload SOMENTE para Drive ===');
    
    // Criar imagem de teste
    const imageData = 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mP8z8BQz0AEYBxVSF+FABJADveWkH6oAAAAAElFTkSuQmCC';
    const bytes = Utilities.base64Decode(imageData);
    const blob = Utilities.newBlob(bytes, 'image/png', 'teste_drive.png');
    
    // Upload
    const pasta = obterPastaDrive();
    const file = pasta.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    const fileId = file.getId();
    const url = file.getDownloadUrl();
    
    Logger.log('✅ Arquivo salvo!');
    Logger.log('   ID: ' + fileId);
    Logger.log('   URL: ' + url);
    Logger.log('   Link direto: https://drive.google.com/file/d/' + fileId + '/view');
    
    return { success: true, fileId: fileId, url: url };
    
  } catch (error) {
    Logger.log('❌ Erro: ' + error);
    return { success: false, error: error.toString() };
  }
}

/**
 * Função auxiliar para testar apenas o Supabase (sem Drive)
 */
function TESTE_salvarSoSupabase() {
  try {
    Logger.log('=== TESTE: Salvar SOMENTE no Supabase ===');
    
    const metadados = {
      id_notificacao: 999002, // ID de teste numérico (deve existir na tabela notifications_ids)
      nome_arquivo_original: 'teste_manual.png',
      nome_arquivo_storage: 'teste_storage_' + new Date().getTime() + '.png',
      tipo_arquivo: 'image/png',
      tamanho_original: 1234,
      tamanho_comprimido: 1000,
      taxa_compressao: 19.0,
      drive_file_id: 'FAKE_FILE_ID_' + new Date().getTime(),
      url_download: 'https://drive.google.com/fake_url',
      usuario_upload: 'teste@sistema.com'
    };
    
    Logger.log('Metadados: ' + JSON.stringify(metadados, null, 2));
    
    const anexoId = salvarMetadadosAnexo(metadados);
    
    Logger.log('✅ Metadados salvos!');
    Logger.log('   Anexo ID: ' + anexoId);
    
    return { success: true, anexoId: anexoId };
    
  } catch (error) {
    Logger.log('❌ Erro: ' + error);
    return { success: false, error: error.toString() };
  }
}

