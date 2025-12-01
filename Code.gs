// ========================================
// CONFIGURAÇÃO DA PLANILHA
// ========================================
// IMPORTANTE: Substitua pelo ID da sua planilha
// O ID fica na URL: https://docs.google.com/spreadsheets/d/SEU_ID_AQUI/edit
const SHEET_ID = '15QaRUJv60U15TmyCoIYJKqvRCjY_bMgsUFYimcYtBzc';

// Nome da aba onde os dados serão salvos
const SHEET_NAME = 'Página1';

// ========================================
// FUNÇÃO DE TESTE MANUAL
// ========================================
function TESTE_ATUALIZAR_LINHA_339() {
  Logger.log('🧪 ========== INICIANDO TESTE MANUAL ==========');
  
  // Simula os dados que você enviaria ao editar o registro da linha 339
  const dadosTeste = {
    action: 'update',
    linha: '339',
    criancaEstudante: 'Abdu Malic the last solldier at planet earth',
    dataNT: '2025-11-09',
    idade: '12',
    identidadeGenero: 'Menino',
    pcdTranstorno: 'Sim',
    racaCor: 'Branca',
    tipoViolencia: 'Sexual',
    encaminhamento: '12',
    cmeiEmef: 'D',
    regiao: 'São Pedro',
    responsavelRegistro: 'asd',
    fonteEscola: 'Sim',
    violenciaEscolaOcorreu: 'Sim',
    profissionalAutor: 'Não',
    estudanteAutor: '',
    violenciaNaoEscola: '',
    ocorreuEscola: '',
    violenciaInformada: ''
  };
  
  Logger.log('📋 Dados de teste: ' + JSON.stringify(dadosTeste));
  
  // Chama a função de atualização
  const resultado = atualizarRegistro(dadosTeste);
  
  Logger.log('📊 Resultado: ' + JSON.stringify(resultado));
  Logger.log('🧪 ========== FIM DO TESTE ==========');
  
  return resultado;
}

// ========================================
// FUNÇÃO PRINCIPAL - SERVE O HTML (se necessário)
// ========================================
function doGet(e) {
  // Se for uma requisição para listar adados
  if (e && e.parameter && e.parameter.action === 'list') {
    const dados = listarRegistros();
    
    // Usa postMessage para enviar dados cross-origin
    const html = '<script>window.top.postMessage(' + JSON.stringify(dados) + ', "*");</script>';
    
    return HtmlService.createHtmlOutput(html)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
  
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Registro de Casos - Violência Escolar')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ========================================
// FUNÇÃO PARA RECEBER DADOS VIA POST (do frontend hospedado no GitHub)
// ========================================
function doPost(e) {
  try {
    Logger.log('========== INÍCIO doPost ==========');
    Logger.log('Evento completo: ' + JSON.stringify(e));
    
    let dados;
    
    // Tenta pegar dados de diferentes formas
    if (e.parameter && e.parameter.dados) {
      Logger.log('Dados via e.parameter.dados');
      dados = JSON.parse(e.parameter.dados);
    } else if (e.parameter && e.parameter.data) {
      Logger.log('Dados via e.parameter.data');
      dados = JSON.parse(e.parameter.data);
    } else if (e.postData && e.postData.contents) {
      Logger.log('Dados via e.postData.contents');
      dados = JSON.parse(e.postData.contents);
    } else {
      Logger.log('Dados via fallback (e.parameter diretamente)');
      dados = e.parameter || e.parameters || {};
    }
    
    // Log para debug
    Logger.log('Dados parseados: ' + JSON.stringify(dados));
    Logger.log('Action detectada: ' + dados.action);
    
    let resultado;
    
    // Verifica qual ação executar
    if (dados.action === 'list') {
      Logger.log('Executando: listarRegistros()');
      resultado = listarRegistros();
      // Usa postMessage para enviar dados cross-origin
      const html = '<script>window.top.postMessage(' + JSON.stringify(resultado) + ', "*");</script>';
      return HtmlService.createHtmlOutput(html)
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    } else if (dados.action === 'update') {
      Logger.log('Executando: atualizarRegistro()');
      Logger.log('Dados para atualização: ' + JSON.stringify(dados));
      resultado = atualizarRegistro(dados);
      Logger.log('Resultado da atualização: ' + JSON.stringify(resultado));
      // Retorna via postMessage também para update
      const html = '<script>window.top.postMessage(' + JSON.stringify(resultado) + ', "*");</script>';
      return HtmlService.createHtmlOutput(html)
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    } else if (dados.action === 'delete') {
      Logger.log('Executando: excluirRegistro()');
      resultado = excluirRegistro(dados);
      // Retorna via postMessage também para delete
      const html = '<script>window.top.postMessage(' + JSON.stringify(resultado) + ', "*");</script>';
      return HtmlService.createHtmlOutput(html)
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    } else {
      Logger.log('Executando: saveRegistro() (ação padrão)');
      // Ação padrão: salvar novo registro
      resultado = saveRegistro(dados);
    }
    
    // Retorna resposta JSON para outras ações (só para save, que vai para index.html)
    return ContentService
      .createTextOutput(JSON.stringify(resultado))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('Erro no doPost: ' + error.toString());
    Logger.log('Evento recebido: ' + JSON.stringify(e));
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Erro ao processar requisição: ' + error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ========================================
// FUNÇÃO PARA SALVAR REGISTRO NA PLANILHA
// ========================================
function saveRegistro(formData) {
  try {
    // Validação de campos obrigatórios
    const camposObrigatorios = [
      'criancaEstudante',
      'dataNT',
      'idade',
      'identidadeGenero',
      'tipoViolencia',
      'cmeiEmef',
      'regiao',
      'responsavelRegistro'
    ];
    
    const camposFaltando = [];
    
    for (const campo of camposObrigatorios) {
      if (!formData[campo] || formData[campo].toString().trim() === '') {
        camposFaltando.push(campo);
      }
    }
    
    if (camposFaltando.length > 0) {
      return {
        success: false,
        message: 'Campos obrigatórios não preenchidos: ' + camposFaltando.join(', ')
      };
    }
    
    // Abre a planilha
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return {
        success: false,
        message: 'Aba "' + SHEET_NAME + '" não encontrada na planilha.'
      };
    }
    
    // Função auxiliar para converter Sim/Não em S/N
    function converterSimNao(valor) {
      if (!valor || valor.trim() === '' || valor === 'Não informado') return '';
      if (valor === 'Sim') return 'S';
      if (valor === 'Não') return 'N';
      return valor;
    }
    
    // Função para extrair sigla da escola
    function extrairSiglaEscola(nomeCompleto) {
      if (!nomeCompleto) return '';
      
      // Remove o prefixo CMEI/EMEF e TI
      let nome = nomeCompleto.replace(/^(CMEI|EMEF)\s+(TI\s+)?/i, '');
      
      // Palavras que devem ser ignoradas ao gerar siglas
      const ignorar = ['de', 'da', 'do', 'das', 'dos', 'e', 'a', 'o', 'as', 'os'];
      
      // Separa as palavras e pega as iniciais das palavras importantes
      const palavras = nome.split(' ').filter(p => p.length > 0);
      const sigla = palavras
        .filter(palavra => !ignorar.includes(palavra.toLowerCase()))
        .map(palavra => palavra[0].toUpperCase())
        .join('');
      
      return sigla;
    }
    
    // Função para converter data de YYYY-MM-DD para DD/MM/YYYY
    function formatarData(dataISO) {
      if (!dataISO) return '';
      const partes = dataISO.split('-');
      if (partes.length === 3) {
        return partes[2] + '/' + partes[1] + '/' + partes[0];
      }
      return dataISO;
    }
    
    // Monta array na ordem EXATA das colunas
    // ATENÇÃO: A ordem deve corresponder às colunas da planilha
    const novaLinha = [
      formData.criancaEstudante || '',                                    // 1. Criança/ Estudante
      formatarData(formData.dataNT) || '',                                // 2. Data da NT (formato DD/MM/YYYY)
      formData.idade || '',                                               // 3. Idade
      formData.identidadeGenero || '',                                    // 4. Identidade de Gênero
      converterSimNao(formData.pcdTranstorno) || '',                      // 5. É PCD/tem Transtorno? (S/N)
      formData.racaCor || '',                                             // 6. Raça/Cor
      formData.tipoViolencia || '',                                       // 7. Tipo de Violência
      formData.encaminhamento || '',                                      // 8. Encaminhamento
      extrairSiglaEscola(formData.cmeiEmef) || '',                        // 9. CMEI/EMEF (apenas sigla)
      formData.regiao || '',                                              // 10. Região
      formData.responsavelRegistro || '',                                 // 11. Responsável pelo Registro
      converterSimNao(formData.fonteEscola) || '',                        // 12. fonte informadores foi a escola? (S/N)
      converterSimNao(formData.violenciaEscolaOcorreu) || '',           // 13. violência identificada pela escola ocorrida na escola (S/N)
      converterSimNao(formData.profissionalAutor) || '',                 // 14. Algum profissional da escola foi autor da violência (S/N)
      converterSimNao(formData.estudanteAutor) || '',                    // 15. Album estudante foi autor da violência? (S/N)
      converterSimNao(formData.violenciaNaoEscola) || '',                // 16. violência identificada pela escola não ocorrida na escola (S/N)
      converterSimNao(formData.ocorreuEscola) || '',                     // 17. ocorreu na escola? 1.1 (S/N)
      converterSimNao(formData.violenciaInformada) || ''                 // 18. violência informada a escola por qualquer um dos agentes que a compõe 1.2 (S/N)
    ];
    
    // Adiciona a linha na planilha
    sheet.appendRow(novaLinha);
    
    // Log de sucesso
    Logger.log('Registro salvo com sucesso: ' + formData.criancaEstudante);
    
    return {
      success: true,
      message: 'Registro salvo com sucesso!'
    };
    
  } catch (error) {
    Logger.log('Erro ao salvar registro: ' + error.toString());
    return {
      success: false,
      message: 'Erro ao salvar: ' + error.message
    };
  }
}

// ========================================
// FUNÇÃO PARA BUSCAR OPÇÕES DINÂMICAS DA PLANILHA
// ========================================
function getOpcoes() {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return {
        success: false,
        message: 'Aba "' + SHEET_NAME + '" não encontrada.'
      };
    }
    
    // Pega todas as linhas com dados (pulando cabeçalho)
    const lastRow = sheet.getLastRow();
    
    if (lastRow < 2) {
      // Planilha vazia, retorna array vazio
      return {
        success: true,
        regioes: []
      };
    }
    
    // Coluna 10 = Região (coluna J)
    // Lê da linha 2 até a última linha com dados
    const regioesRange = sheet.getRange(2, 10, lastRow - 1, 1);
    const regioesData = regioesRange.getValues();
    
    // Extrai valores, remove vazios e duplicados
    const regioesSet = new Set();
    
    regioesData.forEach(function(row) {
      const regiao = row[0];
      if (regiao && regiao.toString().trim() !== '') {
        regioesSet.add(regiao.toString().trim());
      }
    });
    
    // Converte Set para Array e ordena alfabeticamente
    const regioesArray = Array.from(regioesSet).sort();
    
    Logger.log('Regiões carregadas: ' + regioesArray.length);
    
    return {
      success: true,
      regioes: regioesArray
    };
    
  } catch (error) {
    Logger.log('Erro ao buscar opções: ' + error.toString());
    return {
      success: false,
      message: 'Erro ao carregar regiões: ' + error.message,
      regioes: []
    };
  }
}

// ========================================
// FUNÇÃO PARA LISTAR TODOS OS REGISTROS
// ========================================
function listarRegistros() {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return {
        success: false,
        message: 'Aba "' + SHEET_NAME + '" não encontrada.'
      };
    }
    
    const lastRow = sheet.getLastRow();
    
    if (lastRow < 2) {
      return {
        success: true,
        registros: []
      };
    }
    
    // Lê todos os dados (pula linha 1 do cabeçalho)
    const range = sheet.getRange(2, 1, lastRow - 1, 18);
    const valores = range.getValues();
    
    const registros = [];
    
    valores.forEach(function(linha, index) {
      // Converte data DD/MM/YYYY para YYYY-MM-DD (para input type="date")
      let dataISO = '';
      let dataBR = '';
      if (linha[1]) {
        // Se vier como Date object do Sheets
        if (linha[1] instanceof Date) {
          const d = linha[1];
          const dia = ('0' + d.getDate()).slice(-2);
          const mes = ('0' + (d.getMonth() + 1)).slice(-2);
          const ano = d.getFullYear();
          dataBR = dia + '/' + mes + '/' + ano;
          dataISO = ano + '-' + mes + '-' + dia;
        } else {
          // Se vier como string DD/MM/YYYY
          dataBR = linha[1].toString();
          const partes = dataBR.split('/');
          if (partes.length === 3) {
            dataISO = partes[2] + '-' + partes[1] + '-' + partes[0];
          }
        }
      }
      
      // Converte identidade de gênero M/F para nome completo
      let identidadeGenero = linha[3] || '';
      if (identidadeGenero === 'M') {
        identidadeGenero = 'Menino';
      } else if (identidadeGenero === 'F') {
        identidadeGenero = 'Menina';
      }
      
      registros.push({
        linha: index + 2, // Linha real na planilha (começa em 2)
        criancaEstudante: linha[0] || '',
        dataNT: dataBR,
        dataNT_ISO: dataISO,
        idade: linha[2] || '',
        identidadeGenero: identidadeGenero,
        pcdTranstorno: linha[4] === 'S' ? 'Sim' : (linha[4] === 'N' ? 'Não' : ''),
        racaCor: linha[5] || '',
        tipoViolencia: linha[6] || '',
        encaminhamento: linha[7] || '',
        cmeiEmef: linha[8] || '',
        regiao: linha[9] || '',
        responsavelRegistro: linha[10] || '',
        fonteEscola: linha[11] === 'S' ? 'Sim' : (linha[11] === 'N' ? 'Não' : ''),
        violenciaEscolaOcorreu: linha[12] === 'S' ? 'Sim' : (linha[12] === 'N' ? 'Não' : ''),
        profissionalAutor: linha[13] === 'S' ? 'Sim' : (linha[13] === 'N' ? 'Não' : ''),
        estudanteAutor: linha[14] === 'S' ? 'Sim' : (linha[14] === 'N' ? 'Não' : ''),
        violenciaNaoEscola: linha[15] === 'S' ? 'Sim' : (linha[15] === 'N' ? 'Não' : ''),
        ocorreuEscola: linha[16] === 'S' ? 'Sim' : (linha[16] === 'N' ? 'Não' : ''),
        violenciaInformada: linha[17] === 'S' ? 'Sim' : (linha[17] === 'N' ? 'Não' : '')
      });
    });
    
    Logger.log('Registros listados: ' + registros.length);
    
    return {
      success: true,
      registros: registros
    };
    
  } catch (error) {
    Logger.log('Erro ao listar registros: ' + error.toString());
    return {
      success: false,
      message: 'Erro ao listar: ' + error.message,
      registros: []
    };
  }
}

// ========================================
// FUNÇÃO PARA ATUALIZAR UM REGISTRO
// ========================================
function atualizarRegistro(dados) {
  try {
    // Log completo dos dados recebidos
    Logger.log('=== ATUALIZAÇÃO DE REGISTRO ===');
    Logger.log('Linha: ' + dados.linha);
    Logger.log('Dados recebidos: ' + JSON.stringify(dados));
    
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return {
        success: false,
        message: 'Aba "' + SHEET_NAME + '" não encontrada.'
      };
    }
    
    const linha = parseInt(dados.linha);
    
    if (!linha || linha < 2) {
      return {
        success: false,
        message: 'Número de linha inválido.'
      };
    }
    
    // Funções auxiliares (mesmas usadas no saveRegistro)
    function converterSimNao(valor) {
      Logger.log('converterSimNao recebeu: "' + valor + '"');
      if (!valor) {
        Logger.log('  -> retornando vazio (valor falsy)');
        return '';
      }
      const valorStr = String(valor).trim();
      if (valorStr === '' || valorStr === 'Não informado') {
        Logger.log('  -> retornando vazio');
        return '';
      }
      if (valorStr === 'Sim') {
        Logger.log('  -> retornando S');
        return 'S';
      }
      if (valorStr === 'Não') {
        Logger.log('  -> retornando N');
        return 'N';
      }
      Logger.log('  -> retornando original: ' + valorStr);
      return valorStr;
    }
    
    function extrairSiglaEscola(nomeCompleto) {
      if (!nomeCompleto) return '';
      let nome = nomeCompleto.replace(/^(CMEI|EMEF)\s+(TI\s+)?/i, '');
      const ignorar = ['de', 'da', 'do', 'das', 'dos', 'e', 'a', 'o', 'as', 'os'];
      const palavras = nome.split(' ').filter(p => p.length > 0);
      const sigla = palavras
        .filter(palavra => !ignorar.includes(palavra.toLowerCase()))
        .map(palavra => palavra[0].toUpperCase())
        .join('');
      return sigla;
    }
    
    function formatarData(dataISO) {
      if (!dataISO) return '';
      const partes = dataISO.split('-');
      if (partes.length === 3) {
        return partes[2] + '/' + partes[1] + '/' + partes[0];
      }
      return dataISO;
    }
    
    function converterIdentidadeGenero(valor) {
      if (!valor) return '';
      if (valor === 'Menino') return 'M';
      if (valor === 'Menina') return 'F';
      return valor; // Mantém outros valores como estão
    }
    
    // Monta array atualizado
    const fonteEscolaConvertido = converterSimNao(dados.fonteEscola);
    const violenciaEscolaOcorreuConvertido = converterSimNao(dados.violenciaEscolaOcorreu);
    const profissionalAutorConvertido = converterSimNao(dados.profissionalAutor);
    const estudanteAutorConvertido = converterSimNao(dados.estudanteAutor);
    const violenciaNaoEscolaConvertido = converterSimNao(dados.violenciaNaoEscola);
    const ocorreuEscolaConvertido = converterSimNao(dados.ocorreuEscola);
    const violenciaInformadaConvertido = converterSimNao(dados.violenciaInformada);
    
    Logger.log('Conversões Sim/Não:');
    Logger.log('  fonteEscola: "' + dados.fonteEscola + '" -> "' + fonteEscolaConvertido + '"');
    Logger.log('  violenciaEscolaOcorreu: "' + dados.violenciaEscolaOcorreu + '" -> "' + violenciaEscolaOcorreuConvertido + '"');
    Logger.log('  profissionalAutor: "' + dados.profissionalAutor + '" -> "' + profissionalAutorConvertido + '"');
    Logger.log('  estudanteAutor: "' + dados.estudanteAutor + '" -> "' + estudanteAutorConvertido + '"');
    
    const linhaAtualizada = [
      dados.criancaEstudante || '',
      formatarData(dados.dataNT) || '',
      dados.idade || '',
      converterIdentidadeGenero(dados.identidadeGenero) || '',
      converterSimNao(dados.pcdTranstorno) || '',
      dados.racaCor || '',
      dados.tipoViolencia || '',
      dados.encaminhamento || '',
      extrairSiglaEscola(dados.cmeiEmef) || '',
      dados.regiao || '',
      dados.responsavelRegistro || '',
      fonteEscolaConvertido,
      violenciaEscolaOcorreuConvertido,
      profissionalAutorConvertido,
      estudanteAutorConvertido,
      violenciaNaoEscolaConvertido,
      ocorreuEscolaConvertido,
      violenciaInformadaConvertido
    ];
    
    Logger.log('Array montado para salvar:');
    Logger.log(JSON.stringify(linhaAtualizada));
    
    // Atualiza a linha
    const range = sheet.getRange(linha, 1, 1, 18);
    range.setValues([linhaAtualizada]);
    
    Logger.log('✅ Registro atualizado na linha ' + linha);
    
    return {
      success: true,
      message: 'Registro atualizado com sucesso!'
    };
    
  } catch (error) {
    Logger.log('Erro ao atualizar registro: ' + error.toString());
    return {
      success: false,
      message: 'Erro ao atualizar: ' + error.message
    };
  }
}

// ========================================
// FUNÇÃO PARA EXCLUIR UM REGISTRO
// ========================================
function excluirRegistro(dados) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return {
        success: false,
        message: 'Aba "' + SHEET_NAME + '" não encontrada.'
      };
    }
    
    const linha = parseInt(dados.linha);
    
    if (!linha || linha < 2) {
      return {
        success: false,
        message: 'Número de linha inválido.'
      };
    }
    
    // Deleta a linha
    sheet.deleteRow(linha);
    
    Logger.log('Registro excluído da linha ' + linha);
    
    
    return {
      success: true,
      message: 'Registro excluído com sucesso!'
    };
    
  } catch (error) {
    Logger.log('Erro ao excluir registro: ' + error.toString());
    return {
      success: false,
      message: 'Erro ao excluir: ' + error.message
    };
  }
}