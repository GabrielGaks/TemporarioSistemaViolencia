// ========================================
// CONFIGURAÇÃO DA PLANILHA
// ========================================
// IMPORTANTE: Substitua pelo ID da sua planilha
// O ID fica na URL: https://docs.google.com/spreadsheets/d/SEU_ID_AQUI/edit
const SHEET_ID = '1A6a2ZLiHegPJBDpE3YLPGsa8RXVRLjpkXmKdauSlb9Y';

// Nome da aba onde os dados serão salvos
const SHEET_NAME = 'Página1';

// ========================================
// MAPEAMENTO DE COLUNAS DA PLANILHA
// ========================================
// IMPORTANTE: Manter sincronizado com a estrutura da planilha
const COLS = {
  criancaEstudante: 1,        // A - Criança/Estudante
  dataNT: 2,                  // B - Data da NT
  idade: 3,                   // C - Idade
  identidadeGenero: 4,        // D - Identidade de Gênero
  pcdTranstorno: 5,           // E - É PCD/tem Transtorno? (S/N)
  pcdDetalhes: 6,             // F - Qual o Transtorno? (Detalhes da deficiência/transtorno)
  racaCor: 7,                 // G - Raça/Cor
  orientacaoSexual: 8,        // H - Qual a Orientação Sexual?
  classificacaoViolencia: 9,  // I - Qual a classificação da Violencia?
  tipoViolencia: 10,          // J - Tipo de Violência
  motivacaoViolencia: 11,     // K - Qual a Motivação da Violencia?
  encaminhamento: 12,         // L - Encaminhamento
  cmeiEmef: 13,               // M - CMEI/EMEF (sigla)
  regiao: 14,                 // N - Região
  responsavelRegistro: 15,    // O - Responsável pelo Registro
  fonteEscola: 16,            // P - Fonte informadores foi a escola?
  violenciaEscolaOcorreu: 17, // Q - Violência identificada pela escola ocorrida na escola
  profissionalAutor: 18,      // R - Algum profissional da escola foi autor da violência
  estudanteAutor: 19,         // S - Algum estudante foi autor da violência?
  violenciaNaoEscola: 20,     // T - Violência identificada pela escola não ocorrida na escola
  ocorreuEscola: 21,          // U - Ocorreu na escola? 1.1
  violenciaInformada: 22,     // V - Violência informada à escola por qualquer um dos agentes que a compõe 1.2
  estudoCaso: 23              // W - Foi Realizado Estudo de Caso?
};

// Total de colunas utilizadas
const TOTAL_COLS = 23;

// ========================================
// FUNÇÃO DE TESTE DE LEITURA MANUAL
// ========================================
function testarLeitura() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  
  Logger.log('========================================');
  Logger.log('TESTE DE LEITURA DA PLANILHA');
  Logger.log('========================================');
  
  // Testa linha 2 (Davi Amaral - NÃO é PCD)
  Logger.log('\n--- LINHA 2 (Davi Amaral - PCD=N) ---');
  const linha2 = sheet.getRange(2, 1, 1, TOTAL_COLS).getValues()[0];
  Logger.log('Comprimento do array: ' + linha2.length);
  Logger.log('[0] Nome: ' + linha2[0]);
  Logger.log('[1] Data: ' + linha2[1]);
  Logger.log('[2] Idade: ' + linha2[2]);
  Logger.log('[3] Gênero: ' + linha2[3]);
  Logger.log('[4] PCD?: ' + linha2[4]);
  Logger.log('[5] Transtorno: "' + linha2[5] + '" (comprimento: ' + String(linha2[5]).length + ')');
  Logger.log('[6] Raça: ' + linha2[6]);
  Logger.log('[7] Tipo Violência: ' + linha2[7]);
  Logger.log('[8] Encaminhamento: ' + linha2[8]);
  Logger.log('[9] CMEI: ' + linha2[9]);
  Logger.log('[10] Região: ' + linha2[10]);
  Logger.log('[11] Responsável: ' + linha2[11]);
  
  // Testa linha 3 (Ester - NÃO é PCD)
  Logger.log('\n--- LINHA 3 (Ester - PCD=N) ---');
  const linha3 = sheet.getRange(3, 1, 1, TOTAL_COLS).getValues()[0];
  Logger.log('Comprimento do array: ' + linha3.length);
  Logger.log('[0] Nome: ' + linha3[0]);
  Logger.log('[4] PCD?: ' + linha3[4]);
  Logger.log('[5] Transtorno: "' + linha3[5] + '" (comprimento: ' + String(linha3[5]).length + ')');
  Logger.log('[6] Raça: ' + linha3[6]);
  Logger.log('[7] Tipo Violência: ' + linha3[7]);
  Logger.log('[8] Encaminhamento: ' + linha3[8]);
  
  // Testa linha 14 (Victoria - É PCD com transtorno)
  Logger.log('\n--- LINHA 14 (Victoria - PCD=S com DI) ---');
  const linha14 = sheet.getRange(14, 1, 1, TOTAL_COLS).getValues()[0];
  Logger.log('Comprimento do array: ' + linha14.length);
  Logger.log('[0] Nome: ' + linha14[0]);
  Logger.log('[4] PCD?: ' + linha14[4]);
  Logger.log('[5] Transtorno: "' + linha14[5] + '" (comprimento: ' + String(linha14[5]).length + ')');
  Logger.log('[6] Raça: ' + linha14[6]);
  Logger.log('[7] Tipo Violência: ' + linha14[7]);
  
  // Testa linha 18 (Laura - É PCD com TEA)
  Logger.log('\n--- LINHA 18 (Laura - PCD=S com TEA) ---');
  const linha18 = sheet.getRange(18, 1, 1, TOTAL_COLS).getValues()[0];
  Logger.log('Comprimento do array: ' + linha18.length);
  Logger.log('[0] Nome: ' + linha18[0]);
  Logger.log('[4] PCD?: ' + linha18[4]);
  Logger.log('[5] Transtorno: "' + linha18[5] + '" (comprimento: ' + String(linha18[5]).length + ')');
  Logger.log('[6] Raça: ' + linha18[6]);
  Logger.log('[7] Tipo Violência: ' + linha18[7]);
  
  Logger.log('\n========================================');
  Logger.log('FIM DO TESTE');
  Logger.log('========================================');
}

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
    pcdDetalhes: 'DI, TDAH',  // NOVO CAMPO DE TESTE
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
  // Se for uma requisição para listar dados
  if (e && e.parameter && e.parameter.action === 'list') {
    const dados = listarRegistros();
    
    // Usa postMessage para enviar dados cross-origin
    const html = '<script>window.top.postMessage(' + JSON.stringify(dados) + ', "*");</script>';
    
    return HtmlService.createHtmlOutput(html)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
  
  // Se for uma requisição para salvar registro via JSONP
  if (e && e.parameter && e.parameter.action === 'saveRegistro') {
    try {
      Logger.log('========== INÍCIO doGet (saveRegistro via JSONP) ==========');
      Logger.log('Parâmetros recebidos: ' + JSON.stringify(e.parameter));
      
      let dados;
      
      // Tenta pegar dados do parâmetro 'data'
      if (e.parameter.data) {
        Logger.log('Dados via e.parameter.data');
        dados = JSON.parse(e.parameter.data);
      } else if (e.parameter.dados) {
        Logger.log('Dados via e.parameter.dados');
        dados = JSON.parse(e.parameter.dados);
      } else {
        Logger.log('Dados via fallback (e.parameter diretamente)');
        dados = e.parameter || {};
      }
      
      Logger.log('Dados parseados: ' + JSON.stringify(dados));
      
      // Executa saveRegistro
      const resultado = saveRegistro(dados);
      Logger.log('Resultado do saveRegistro: ' + JSON.stringify(resultado));
      
      // Se há callback, retorna via JSONP
      if (e.parameter.callback) {
        const callbackName = e.parameter.callback;
        const jsonpResponse = callbackName + '(' + JSON.stringify(resultado) + ');';
        
        Logger.log('Retornando via JSONP callback: ' + callbackName);
        return ContentService
          .createTextOutput(jsonpResponse)
          .setMimeType(ContentService.MimeType.JAVASCRIPT);
      } else {
        // Retorna JSON normal se não há callback
        return ContentService
          .createTextOutput(JSON.stringify(resultado))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
    } catch (error) {
      Logger.log('Erro no doGet (saveRegistro): ' + error.toString());
      Logger.log('Stack trace: ' + error.stack);
      
      const erroResultado = {
        success: false,
        sucesso: false,
        message: 'Erro ao processar requisição: ' + error.message,
        mensagem: 'Erro ao processar requisição: ' + error.message
      };
      
      // Se há callback, retorna via JSONP
      if (e.parameter && e.parameter.callback) {
        const callbackName = e.parameter.callback;
        const jsonpResponse = callbackName + '(' + JSON.stringify(erroResultado) + ');';
        return ContentService
          .createTextOutput(jsonpResponse)
          .setMimeType(ContentService.MimeType.JAVASCRIPT);
      } else {
        return ContentService
          .createTextOutput(JSON.stringify(erroResultado))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
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
    
    // IMPORTANTE: Rejeita ações de autenticação (devem ir para Code-Supabase.gs)
    if (dados.action === 'login' || dados.action === 'list_users' || dados.action === 'create_user' || dados.action === 'update_user' || dados.action === 'delete_user') {
      Logger.log('❌ ERRO: Ação de autenticação recebida no script de casos!');
      Logger.log('Esta ação deve ser executada no Code-Supabase.gs');
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          sucesso: false,
          message: 'Esta ação deve ser executada no script de autenticação. Verifique se APPS_SCRIPT_AUTH está apontando para o Code-Supabase.gs',
          mensagem: 'Esta ação deve ser executada no script de autenticação. Verifique se APPS_SCRIPT_AUTH está apontando para o Code-Supabase.gs'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
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
      Logger.log('=== VERIFICAÇÃO CAMPOS DE VIOLÊNCIA NO doPost ===');
      Logger.log('tipoViolencia: "' + dados.tipoViolencia + '"');
      Logger.log('classificacaoViolencia: "' + dados.classificacaoViolencia + '"');
      Logger.log('motivacaoViolencia: "' + dados.motivacaoViolencia + '"');
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
      
      // Se o valor já parece ser uma sigla (curto, sem espaços, apenas letras maiúsculas/números)
      // Preserva o valor original
      const valorLimpo = nomeCompleto.trim();
      if (valorLimpo.length <= 10 && /^[A-Z0-9]+$/.test(valorLimpo)) {
        // Já é uma sigla, retorna como está
        return valorLimpo;
      }
      
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
      formData.pcdDetalhes || '',                                         // 6. Detalhes da deficiência/transtorno
      formData.racaCor || '',                                             // 7. Raça/Cor
      formData.orientacaoSexual || '',                                    // 8. Qual a Orientação Sexual? (NOVA)
      formData.classificacaoViolencia || '',                              // 9. Qual a classificação da Violencia? (NOVA)
      formData.tipoViolencia || '',                                       // 10. Tipo de Violência
      formData.motivacaoViolencia || '',                                  // 11. Qual a Motivação da Violencia? (NOVA)
      formData.encaminhamento || '',                                      // 12. Encaminhamento
      extrairSiglaEscola(formData.cmeiEmef) || '',                        // 13. CMEI/EMEF (apenas sigla)
      formData.regiao || '',                                              // 14. Região
      formData.responsavelRegistro || '',                                 // 15. Responsável pelo Registro
      converterSimNao(formData.fonteEscola) || '',                        // 16. fonte informadores foi a escola? (S/N)
      converterSimNao(formData.violenciaEscolaOcorreu) || '',           // 17. violência identificada pela escola ocorrida na escola (S/N)
      converterSimNao(formData.profissionalAutor) || '',                 // 18. Algum profissional da escola foi autor da violência (S/N)
      converterSimNao(formData.estudanteAutor) || '',                    // 19. Album estudante foi autor da violência? (S/N)
      converterSimNao(formData.violenciaNaoEscola) || '',                // 20. violência identificada pela escola não ocorrida na escola (S/N)
      converterSimNao(formData.ocorreuEscola) || '',                     // 21. ocorreu na escola? 1.1 (S/N)
      converterSimNao(formData.violenciaInformada) || ''                 // 22. violência informada a escola por qualquer um dos agentes que a compõe 1.2 (S/N)
    ];
    
    // Log para debug
    Logger.log('Salvando registro com pcdTranstorno=' + formData.pcdTranstorno + ' / pcdDetalhes=' + formData.pcdDetalhes);
    
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
    
    // Coluna da Região (usar constante COLS)
    // Lê da linha 2 até a última linha com dados
    const regioesRange = sheet.getRange(2, COLS.regiao, lastRow - 1, 1);
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
    const range = sheet.getRange(2, 1, lastRow - 1, TOTAL_COLS);
    const valores = range.getValues();
    
    // Log de debug para verificar mapeamento
    Logger.log('=== DEBUG LISTAR REGISTROS ===');
    Logger.log('TOTAL_COLS: ' + TOTAL_COLS);
    Logger.log('Primeira linha de dados (índices 0-based):');
    if (valores.length > 0) {
      const primeiraLinha = valores[0];
      Logger.log('Comprimento do array: ' + primeiraLinha.length);
      Logger.log('  [0] criancaEstudante: ' + primeiraLinha[0]);
      Logger.log('  [1] dataNT: ' + primeiraLinha[1]);
      Logger.log('  [2] idade: ' + primeiraLinha[2]);
      Logger.log('  [3] identidadeGenero: ' + primeiraLinha[3]);
      Logger.log('  [4] pcdTranstorno: ' + primeiraLinha[4]);
      Logger.log('  [5] pcdDetalhes: "' + primeiraLinha[5] + '"');
      Logger.log('  [6] racaCor: ' + primeiraLinha[6]);
      Logger.log('  [7] tipoViolencia: ' + primeiraLinha[7]);
      Logger.log('  [8] encaminhamento: ' + primeiraLinha[8]);
      Logger.log('  [9] cmeiEmef: ' + primeiraLinha[9]);
      Logger.log('  [10] regiao: ' + primeiraLinha[10]);
      Logger.log('  [11] responsavelRegistro: ' + primeiraLinha[11]);
    }
    Logger.log('==============================');
    
    const registros = [];
    
    valores.forEach(function(linha, index) {
      // Converte data DD/MM/YYYY para YYYY-MM-DD (para input type="date")
      let dataISO = '';
      let dataBR = '';
      if (linha[COLS.dataNT - 1]) {
        // Se vier como Date object do Sheets
        if (linha[COLS.dataNT - 1] instanceof Date) {
          const d = linha[COLS.dataNT - 1];
          const dia = ('0' + d.getDate()).slice(-2);
          const mes = ('0' + (d.getMonth() + 1)).slice(-2);
          const ano = d.getFullYear();
          dataBR = dia + '/' + mes + '/' + ano;
          dataISO = ano + '-' + mes + '-' + dia;
        } else {
          // Se vier como string DD/MM/YYYY
          dataBR = linha[COLS.dataNT - 1].toString();
          const partes = dataBR.split('/');
          if (partes.length === 3) {
            dataISO = partes[2] + '-' + partes[1] + '-' + partes[0];
          }
        }
      }
      
      // Converte identidade de gênero M/F para nome completo
      let identidadeGenero = linha[COLS.identidadeGenero - 1] || '';
      if (identidadeGenero === 'M') {
        identidadeGenero = 'Menino';
      } else if (identidadeGenero === 'F') {
        identidadeGenero = 'Menina';
      }
      
      registros.push({
        linha: index + 2, // Linha real na planilha (começa em 2)
        criancaEstudante: linha[0] || '',        // Coluna A (índice 0)
        dataNT: dataBR,                          // Coluna B (índice 1) - já processado acima
        dataNT_ISO: dataISO,
        idade: linha[2] || '',                   // Coluna C (índice 2)
        identidadeGenero: identidadeGenero,      // Coluna D (índice 3) - já processado acima
        pcdTranstorno: linha[4] === 'S' ? 'Sim' : (linha[4] === 'N' ? 'Não' : 'Não informado'), // Coluna E (índice 4)
        pcdDetalhes: linha[5] || '',             // Coluna F (índice 5)
        racaCor: linha[6] || '',                 // Coluna G (índice 6)
        orientacaoSexual: linha[7] || '',        // Coluna H (índice 7) - NOVA
        classificacaoViolencia: linha[8] || '',  // Coluna I (índice 8) - NOVA
        tipoViolencia: linha[9] || '',           // Coluna J (índice 9)
        motivacaoViolencia: linha[10] || '',     // Coluna K (índice 10) - NOVA
        encaminhamento: linha[11] || '',         // Coluna L (índice 11)
        cmeiEmef: linha[12] || '',               // Coluna M (índice 12)
        regiao: linha[13] || '',                 // Coluna N (índice 13)
        responsavelRegistro: linha[14] || '',    // Coluna O (índice 14)
        fonteEscola: linha[15] === 'S' ? 'Sim' : (linha[15] === 'N' ? 'Não' : 'Não informado'), // Coluna P (índice 15)
        violenciaEscolaOcorreu: linha[16] === 'S' ? 'Sim' : (linha[16] === 'N' ? 'Não' : 'Não informado'), // Coluna Q (índice 16)
        profissionalAutor: linha[17] === 'S' ? 'Sim' : (linha[17] === 'N' ? 'Não' : 'Não informado'), // Coluna R (índice 17)
        estudanteAutor: linha[18] === 'S' ? 'Sim' : (linha[18] === 'N' ? 'Não' : 'Não informado'), // Coluna S (índice 18)
        violenciaNaoEscola: linha[19] === 'S' ? 'Sim' : (linha[19] === 'N' ? 'Não' : 'Não informado'), // Coluna T (índice 19)
        ocorreuEscola: linha[20] === 'S' ? 'Sim' : (linha[20] === 'N' ? 'Não' : 'Não informado'), // Coluna U (índice 20)
        violenciaInformada: linha[21] === 'S' ? 'Sim' : (linha[21] === 'N' ? 'Não' : 'Não informado'), // Coluna V (índice 21)
        estudoCaso: linha[22] === 'S' ? 'Sim' : (linha[22] === 'N' ? 'Não' : 'Não informado') // Coluna W (índice 22)
      });
      
      // Log detalhado do primeiro registro para debug
      if (index === 0) {
        Logger.log('=== PRIMEIRO REGISTRO MAPEADO ===');
        Logger.log('criancaEstudante: ' + registros[0].criancaEstudante);
        Logger.log('pcdDetalhes (col 6, idx 5): ' + registros[0].pcdDetalhes);
        Logger.log('racaCor (col 7, idx 6): ' + registros[0].racaCor);
        Logger.log('tipoViolencia (col 8, idx 7): ' + registros[0].tipoViolencia);
        Logger.log('encaminhamento (col 9, idx 8): ' + registros[0].encaminhamento);
        Logger.log('=================================');
      }
    });
    
    Logger.log('Registros listados: ' + registros.length);
    
    // Log detalhado de um registro específico para verificar mapeamento
    if (registros.length > 0) {
      Logger.log('=== EXEMPLO DE REGISTRO COMPLETO (primeiro) ===');
      Logger.log(JSON.stringify(registros[0], null, 2));
      Logger.log('===============================================');
    }
    
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
    Logger.log('=== CAMPOS DE VIOLÊNCIA ===');
    Logger.log('tipoViolencia recebido: "' + dados.tipoViolencia + '"');
    Logger.log('classificacaoViolencia recebido: "' + dados.classificacaoViolencia + '"');
    Logger.log('motivacaoViolencia recebido: "' + dados.motivacaoViolencia + '"');
    
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
      
      // Se o valor já parece ser uma sigla (curto, sem espaços, apenas letras maiúsculas/números)
      // Preserva o valor original
      const valorLimpo = nomeCompleto.trim();
      if (valorLimpo.length <= 10 && /^[A-Z0-9]+$/.test(valorLimpo)) {
        // Já é uma sigla, retorna como está
        return valorLimpo;
      }
      
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
    Logger.log('  pcdTranstorno: "' + dados.pcdTranstorno + '" / pcdDetalhes: "' + dados.pcdDetalhes + '"');
    
    const estudoCasoConvertido = converterSimNao(dados.estudoCaso);
    
    const linhaAtualizada = [
      dados.criancaEstudante || '',                       // 1. Criança/Estudante
      formatarData(dados.dataNT) || '',                   // 2. Data da NT
      dados.idade || '',                                  // 3. Idade
      converterIdentidadeGenero(dados.identidadeGenero) || '', // 4. Identidade de Gênero
      converterSimNao(dados.pcdTranstorno) || '',         // 5. PCD/Transtorno (S/N)
      dados.pcdDetalhes || '',                            // 6. Detalhes PCD
      dados.racaCor || '',                                // 7. Raça/Cor
      dados.orientacaoSexual || '',                       // 8. Orientação Sexual (NOVA)
      dados.classificacaoViolencia || '',                 // 9. Classificação da Violência (NOVA)
      dados.tipoViolencia || '',                          // 10. Tipo de Violência
      dados.motivacaoViolencia || '',                     // 11. Motivação da Violência (NOVA)
      dados.encaminhamento || '',                         // 12. Encaminhamento
      extrairSiglaEscola(dados.cmeiEmef) || '',           // 13. CMEI/EMEF
      dados.regiao || '',                                 // 14. Região
      dados.responsavelRegistro || '',                    // 15. Responsável
      fonteEscolaConvertido,                              // 16. Fonte Escola
      violenciaEscolaOcorreuConvertido,                   // 17. Violência Escola Ocorreu
      profissionalAutorConvertido,                        // 18. Profissional Autor
      estudanteAutorConvertido,                           // 19. Estudante Autor
      violenciaNaoEscolaConvertido,                       // 20. Violência Não Escola
      ocorreuEscolaConvertido,                            // 21. Ocorreu Escola
      violenciaInformadaConvertido,                       // 22. Violência Informada
      estudoCasoConvertido                                // 23. Estudo de Caso
    ];
    
    Logger.log('=== ARRAY MONTADO PARA ATUALIZAÇÃO ===');
    Logger.log('Posição [8] (col 9 - classificacaoViolencia): "' + linhaAtualizada[8] + '"');
    Logger.log('Posição [9] (col 10 - tipoViolencia): "' + linhaAtualizada[9] + '"');
    Logger.log('Posição [10] (col 11 - motivacaoViolencia): "' + linhaAtualizada[10] + '"');
    Logger.log('Array completo:');
    Logger.log(JSON.stringify(linhaAtualizada));
    
    // Atualiza a linha
    const range = sheet.getRange(linha, 1, 1, TOTAL_COLS);
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

// ========================================
// FUNÇÃO DE TESTE MANUAL - ATUALIZAÇÃO DE VIOLÊNCIA
// ========================================
/**
 * Função para testar manualmente a atualização dos campos de violência
 * Execute esta função no Apps Script Editor para diagnosticar problemas
 */
function testeAtualizarViolenciaManual() {
  try {
    Logger.log('\n');
    Logger.log('╔══════════════════════════════════════════════════════════════╗');
    Logger.log('║       TESTE MANUAL - ATUALIZAÇÃO DE CAMPOS DE VIOLÊNCIA      ║');
    Logger.log('╚══════════════════════════════════════════════════════════════╝');
    Logger.log('\n');
    
    // CONFIGURAÇÃO DO TESTE - MODIFIQUE AQUI
    const LINHA_TESTE = 2; // Qual linha da planilha você quer atualizar (2 = primeira linha de dados)
    
    Logger.log('📂 PASSO 1: Abrindo planilha...');
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      throw new Error('Aba "' + SHEET_NAME + '" não encontrada!');
    }
    
    Logger.log('✅ Planilha aberta com sucesso');
    Logger.log('   Aba: ' + SHEET_NAME);
    Logger.log('\n');
    
    // Verifica se a linha existe
    Logger.log('📋 PASSO 2: Verificando linha ' + LINHA_TESTE + '...');
    const lastRow = sheet.getLastRow();
    Logger.log('   Última linha com dados: ' + lastRow);
    
    if (LINHA_TESTE < 2 || LINHA_TESTE > lastRow) {
      throw new Error('Linha ' + LINHA_TESTE + ' é inválida! Use entre 2 e ' + lastRow);
    }
    
    Logger.log('✅ Linha ' + LINHA_TESTE + ' é válida');
    Logger.log('\n');
    
    // Lê dados atuais
    Logger.log('📖 PASSO 3: Lendo dados atuais da linha ' + LINHA_TESTE + '...');
    const dadosAtuais = sheet.getRange(LINHA_TESTE, 1, 1, TOTAL_COLS).getValues()[0];
    const nomeCrianca = dadosAtuais[0]; // Coluna A
    
    Logger.log('   Nome da criança: "' + nomeCrianca + '"');
    Logger.log('   VALORES ATUAIS DOS CAMPOS DE VIOLÊNCIA:');
    Logger.log('   ├─ Coluna I (9) - classificacaoViolencia [índice 8]: "' + dadosAtuais[8] + '"');
    Logger.log('   ├─ Coluna J (10) - tipoViolencia [índice 9]: "' + dadosAtuais[9] + '"');
    Logger.log('   └─ Coluna K (11) - motivacaoViolencia [índice 10]: "' + dadosAtuais[10] + '"');
    Logger.log('\n');
    
    // Prepara novos valores
    Logger.log('🔄 PASSO 4: Preparando NOVOS valores...');
    // IMPORTANTE: Valores devem coincidir EXATAMENTE com a validação da planilha
    const novosValores = {
      classificacaoViolencia: 'Intrafamiliar/Doméstica',
      tipoViolencia: 'Física, Psicológica',
      motivacaoViolencia: 'Bullying'
    };
    
    Logger.log('   VALORES QUE SERÃO GRAVADOS:');
    Logger.log('   ├─ classificacaoViolencia: "' + novosValores.classificacaoViolencia + '"');
    Logger.log('   ├─ tipoViolencia: "' + novosValores.tipoViolencia + '"');
    Logger.log('   └─ motivacaoViolencia: "' + novosValores.motivacaoViolencia + '"');
    Logger.log('\n');
    
    // Monta array completo mantendo outros dados
    Logger.log('🔧 PASSO 5: Montando array completo (22 colunas)...');
    const linhaAtualizada = [];
    
    for (let i = 0; i < TOTAL_COLS; i++) {
      if (i === 8) {
        // Coluna I (9) - classificacaoViolencia
        linhaAtualizada[i] = novosValores.classificacaoViolencia;
      } else if (i === 9) {
        // Coluna J (10) - tipoViolencia
        linhaAtualizada[i] = novosValores.tipoViolencia;
      } else if (i === 10) {
        // Coluna K (11) - motivacaoViolencia
        linhaAtualizada[i] = novosValores.motivacaoViolencia;
      } else {
        // Mantém valores originais das outras colunas
        linhaAtualizada[i] = dadosAtuais[i];
      }
    }
    
    Logger.log('✅ Array montado com ' + linhaAtualizada.length + ' colunas');
    Logger.log('   Verificando posições críticas:');
    Logger.log('   ├─ linhaAtualizada[8] (col 9): "' + linhaAtualizada[8] + '"');
    Logger.log('   ├─ linhaAtualizada[9] (col 10): "' + linhaAtualizada[9] + '"');
    Logger.log('   └─ linhaAtualizada[10] (col 11): "' + linhaAtualizada[10] + '"');
    Logger.log('\n');
    
    // Grava na planilha
    Logger.log('💾 PASSO 6: Gravando na planilha...');
    const range = sheet.getRange(LINHA_TESTE, 1, 1, TOTAL_COLS);
    Logger.log('   Range: Linha ' + LINHA_TESTE + ', Coluna 1, 1 linha, ' + TOTAL_COLS + ' colunas');
    
    range.setValues([linhaAtualizada]);
    
    Logger.log('✅ Dados gravados com sucesso!');
    Logger.log('\n');
    
    // Verifica se foi gravado
    Logger.log('🔍 PASSO 7: Verificando se dados foram gravados...');
    SpreadsheetApp.flush(); // Força a gravação
    const dadosVerificacao = sheet.getRange(LINHA_TESTE, 1, 1, TOTAL_COLS).getValues()[0];
    
    Logger.log('   VALORES APÓS GRAVAÇÃO:');
    Logger.log('   ├─ Coluna I (9): "' + dadosVerificacao[8] + '"');
    Logger.log('   ├─ Coluna J (10): "' + dadosVerificacao[9] + '"');
    Logger.log('   └─ Coluna K (11): "' + dadosVerificacao[10] + '"');
    Logger.log('\n');
    
    // Comparação
    let sucesso = true;
    const comparacoes = [];
    
    if (dadosVerificacao[8] !== novosValores.classificacaoViolencia) {
      sucesso = false;
      comparacoes.push('❌ classificacaoViolencia não gravou: esperado "' + novosValores.classificacaoViolencia + '", recebido "' + dadosVerificacao[8] + '"');
    } else {
      comparacoes.push('✅ classificacaoViolencia gravado corretamente');
    }
    
    if (dadosVerificacao[9] !== novosValores.tipoViolencia) {
      sucesso = false;
      comparacoes.push('❌ tipoViolencia não gravou: esperado "' + novosValores.tipoViolencia + '", recebido "' + dadosVerificacao[9] + '"');
    } else {
      comparacoes.push('✅ tipoViolencia gravado corretamente');
    }
    
    if (dadosVerificacao[10] !== novosValores.motivacaoViolencia) {
      sucesso = false;
      comparacoes.push('❌ motivacaoViolencia não gravou: esperado "' + novosValores.motivacaoViolencia + '", recebido "' + dadosVerificacao[10] + '"');
    } else {
      comparacoes.push('✅ motivacaoViolencia gravado corretamente');
    }
    
    Logger.log('📊 PASSO 8: Resultado da comparação:');
    comparacoes.forEach(comp => Logger.log('   ' + comp));
    Logger.log('\n');
    
    if (sucesso) {
      Logger.log('╔══════════════════════════════════════════════════════════════╗');
      Logger.log('║                      ✅ TESTE PASSOU!                         ║');
      Logger.log('║  Todos os campos de violência foram gravados corretamente!   ║');
      Logger.log('╚══════════════════════════════════════════════════════════════╝');
    } else {
      Logger.log('╔══════════════════════════════════════════════════════════════╗');
      Logger.log('║                     ⚠️ TESTE FALHOU!                         ║');
      Logger.log('║   Alguns campos não foram gravados corretamente.             ║');
      Logger.log('║   Verifique os logs acima para detalhes.                     ║');
      Logger.log('╚══════════════════════════════════════════════════════════════╝');
    }
    
    return { success: sucesso, message: 'Teste concluído' };
    
  } catch (error) {
    Logger.log('\n');
    Logger.log('╔══════════════════════════════════════════════════════════════╗');
    Logger.log('║                         ❌ ERRO FATAL                         ║');
    Logger.log('╚══════════════════════════════════════════════════════════════╝');
    Logger.log('\n');
    Logger.log('Erro: ' + error.toString());
    Logger.log('Stack: ' + error.stack);
    
    return { success: false, message: 'Erro: ' + error.message };
  }
}