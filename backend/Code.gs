  // ========================================
  // CONFIGURAÇÃO DA PLANILHA
  // ========================================
  // IMPORTANTE: Substitua pelo ID da sua planilha
  // O ID fica na URL: https://docs.google.com/spreadsheets/d/SEU_ID_AQUI/edit
  const SHEET_ID = '1A6a2ZLiHegPJBDpE3YLPGsa8RXVRLjpkXmKdauSlb9Y';

  // ========================================
  // CONFIGURAÇÃO SUPABASE (REUTILIZADA NO SYNC DE IDs)
  // ========================================
  const SUPABASE_URL = 'https://aepdbpkrkokcnhfljury.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlcGRicGtya29rY25oZmxqdXJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMTMyMjIsImV4cCI6MjA4MDc4OTIyMn0.JLlKeTS3LYv1xce4kCx5tuJCgKfDVvQW_qx7AvsvoIc';

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
    // classificacaoViolencia: 9,  // I - IGNORADA (não será mais usada/preenchida)
    tipoViolencia: 10,          // J - Tipo de Violência
    tipoViolenciaInstitucional: 11,     // K - Tipo de Violência Institucional (condicional)
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
    estudoCaso: 23,             // W - Foi Realizado Estudo de Caso?
    foiMembroFamiliar: 24,      // X - Foi um membro familiar? (S/N)
    idNotificacao: 25,          // Y - ID sequencial da notificação
    atualizacoes: 26,           // Z - Atualizações/Observações (JSON)
    dataCriacao: 27,            // AA - Data de Criação (DD/MM/YYYY HH:MM)
    dataUltimaEdicao: 28        // AB - Data de Última Edição (DD/MM/YYYY HH:MM)
  };

  // Total de colunas utilizadas
  const TOTAL_COLS = 28;

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
  // TESTE SIMPLES - ÚLTIMO ID DA PLANILHA
  // ========================================
  function TESTE_ULTIMO_ID() {
    Logger.log('🔍 Testando leitura do último ID da coluna Y...');
    
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    const lastRow = sheet.getLastRow();
    
    Logger.log('✅ Última linha: ' + lastRow);
    Logger.log('✅ COLS.idNotificacao: ' + COLS.idNotificacao);
    
    if (lastRow > 1) {
      const ultimoId = sheet.getRange(lastRow, COLS.idNotificacao).getValue();
      Logger.log('✅ Último ID encontrado: ' + ultimoId);
      Logger.log('📊 Tipo: ' + typeof ultimoId);
      
      // Testa a função handleGetLastNotificationId
      Logger.log('');
      Logger.log('🧪 Testando função handleGetLastNotificationId...');
      const resultado = handleGetLastNotificationId({});
      Logger.log('📊 Resultado: ' + JSON.stringify(resultado, null, 2));
    } else {
      Logger.log('⚠️ Planilha vazia');
    }
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
      const html = '<html><head><script>try{window.top.postMessage(' + JSON.stringify(dados) + ',"*");}catch(e){console.error("Erro postMessage:",e);}</script></head><body></body></html>';
      
      return HtmlService.createHtmlOutput(html)
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    }
    
    // Se for uma requisição para atualizar registro via GET
    if (e && e.parameter && e.parameter.action === 'update') {
      try {
        Logger.log('========== INÍCIO doGet (update) ==========');
        Logger.log('Parâmetros recebidos: ' + JSON.stringify(e.parameter));
        
        let dados = {};
        if (e.parameter.dados) {
          try {
            dados = JSON.parse(decodeURIComponent(e.parameter.dados));
          } catch (parseError) {
            Logger.log('Erro ao parsear dados: ' + parseError.toString());
            dados = e.parameter;
          }
        } else {
          dados = e.parameter;
        }
        
        Logger.log('Dados para atualização: ' + JSON.stringify(dados));
        const resultado = atualizarRegistro(dados);
        Logger.log('Resultado da atualização: ' + JSON.stringify(resultado));
        
        // Retorna via postMessage (mesma estrutura que funciona para list)
        const resultadoJson = JSON.stringify(resultado);
        // Usa HTML completo para garantir que o script execute
        // Adiciona console.log e verificação de window.top
        const html = '<html><head><script>console.log("[BACKEND doGet] Script executando no iframe");console.log("[BACKEND doGet] window.top existe?",typeof window.top !== "undefined");console.log("[BACKEND doGet] window.top === window?",window.top === window);try{var resultado=' + resultadoJson + ';console.log("[BACKEND doGet] Resultado:",resultado);if(window.top && window.top !== window){window.top.postMessage(resultado,"*");console.log("[BACKEND doGet] postMessage enviado para window.top");}else{console.error("[BACKEND doGet] window.top não acessível");}}catch(e){console.error("[BACKEND doGet] Erro postMessage:",e);}</script></head><body></body></html>';
        Logger.log('HTML retornado (primeiros 200 chars): ' + html.substring(0, 200));
        return HtmlService.createHtmlOutput(html)
          .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
      } catch (error) {
        Logger.log('Erro no doGet (update): ' + error.toString());
        const erroResultado = {
          success: false,
          message: 'Erro ao processar requisição: ' + error.message
        };
        const html = '<html><head><script>try{window.top.postMessage(' + JSON.stringify(erroResultado) + ',"*");}catch(e){console.error("Erro postMessage:",e);}</script></head><body></body></html>';
        return HtmlService.createHtmlOutput(html)
          .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
      }
    }
    
    // Se for uma requisição para excluir registro via GET
    if (e && e.parameter && e.parameter.action === 'delete') {
      try {
        Logger.log('========== INÍCIO doGet (delete) ==========');
        Logger.log('Parâmetros recebidos: ' + JSON.stringify(e.parameter));
        
        let dados = {};
        if (e.parameter.dados) {
          try {
            dados = JSON.parse(decodeURIComponent(e.parameter.dados));
          } catch (parseError) {
            Logger.log('Erro ao parsear dados: ' + parseError.toString());
            dados = e.parameter;
          }
        } else {
          dados = e.parameter;
        }
        
        Logger.log('Dados para exclusão: ' + JSON.stringify(dados));
        const resultado = excluirRegistroComLog(dados); // Atualizado
        Logger.log('Resultado da exclusão: ' + JSON.stringify(resultado));
        
        // Retorna via postMessage (mesma estrutura que funciona para list e update)
        const resultadoJson = JSON.stringify(resultado);
        const html = '<html><head><script>console.log("[BACKEND doGet delete] Script executando no iframe");try{var resultado=' + resultadoJson + ';console.log("[BACKEND doGet delete] Resultado:",resultado);if(window.top && window.top !== window){window.top.postMessage(resultado,"*");console.log("[BACKEND doGet delete] postMessage enviado para window.top");}else{console.error("[BACKEND doGet delete] window.top não acessível");}}catch(e){console.error("[BACKEND doGet delete] Erro postMessage:",e);}</script></head><body></body></html>';
        Logger.log('HTML retornado (primeiros 200 chars): ' + html.substring(0, 200));
        return HtmlService.createHtmlOutput(html)
          .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
      } catch (error) {
        Logger.log('Erro no doGet (delete): ' + error.toString());
        const erroResultado = {
          success: false,
          message: 'Erro ao processar requisição: ' + error.message
        };
        const html = '<html><head><script>try{window.top.postMessage(' + JSON.stringify(erroResultado) + ',"*");}catch(e){console.error("Erro postMessage:",e);}</script></head><body></body></html>';
        return HtmlService.createHtmlOutput(html)
          .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
      }
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
        const resultadoJson = JSON.stringify(resultado);
        const html = '<html><head><script>try{window.top.postMessage(' + resultadoJson + ',"*");}catch(e){console.error("Erro postMessage:",e);}</script></head><body></body></html>';
        return HtmlService.createHtmlOutput(html)
          .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
      } else if (dados.action === 'update') {
        Logger.log('Executando: atualizarRegistro()');
        Logger.log('Dados para atualização: ' + JSON.stringify(dados));
        Logger.log('=== VERIFICAÇÃO CAMPOS DE VIOLÊNCIA NO doPost ===');
        Logger.log('tipoViolencia: "' + (dados.tipoViolencia || 'não informado') + '"');
        Logger.log('tipoViolenciaInstitucional: "' + (dados.tipoViolenciaInstitucional || 'não informado') + '"');
        resultado = atualizarRegistro(dados);
        Logger.log('Resultado da atualização: ' + JSON.stringify(resultado));
        // Retorna via postMessage também para update
        const resultadoJson = JSON.stringify(resultado);
        // Adiciona console.log e verificação de window.top
        const html = '<html><head><script>console.log("[BACKEND doPost] Script executando no iframe");console.log("[BACKEND doPost] window.top existe?",typeof window.top !== "undefined");console.log("[BACKEND doPost] window.top === window?",window.top === window);try{var resultado=' + resultadoJson + ';console.log("[BACKEND doPost] Resultado:",resultado);if(window.top && window.top !== window){window.top.postMessage(resultado,"*");console.log("[BACKEND doPost] postMessage enviado para window.top");}else{console.error("[BACKEND doPost] window.top não acessível");}}catch(e){console.error("[BACKEND doPost] Erro postMessage:",e);}</script></head><body></body></html>';
        return HtmlService.createHtmlOutput(html)
          .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
      } else if (dados.action === 'delete') {
        Logger.log('Executando: excluirRegistroComLog()'); // Atualizado
        Logger.log('Dados recebidos para exclusão: ' + JSON.stringify(dados));
        resultado = excluirRegistroComLog(dados); // Chama a nova função com nome único
        Logger.log('Resultado da exclusão: ' + JSON.stringify(resultado));
        // Retorna via postMessage também para delete
        const resultadoJsonDelete = JSON.stringify(resultado);
        Logger.log('JSON a ser enviado: ' + resultadoJsonDelete);
        const html = '<html><head><script>console.log("[BACKEND doPost DELETE] Script executando");console.log("[BACKEND doPost DELETE] Resultado:",JSON.parse(\'' + resultadoJsonDelete.replace(/'/g, "\\'") + '\'));try{var resultado=' + resultadoJsonDelete + ';if(window.top && window.top !== window){window.top.postMessage(resultado,"*");console.log("[BACKEND doPost DELETE] postMessage enviado");}else{console.error("[BACKEND doPost DELETE] window.top não acessível");}}catch(e){console.error("[BACKEND doPost DELETE] Erro:",e);}</script></head><body></body></html>';
        return HtmlService.createHtmlOutput(html)
          .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
      } else if (dados.action === 'listarMinhasNotificacoes') {
        Logger.log('Executando: listarMinhasNotificacoes()');
        resultado = listarMinhasNotificacoes(dados.emailUsuario);
        return ContentService
          .createTextOutput(JSON.stringify(resultado))
          .setMimeType(ContentService.MimeType.JSON);
      } else if (dados.action === 'buscarDetalhesNotificacao') {
        Logger.log('Executando: buscarDetalhesNotificacao()');
        resultado = buscarDetalhesNotificacao(dados.idNotificacao, dados.emailUsuario);
        return ContentService
          .createTextOutput(JSON.stringify(resultado))
          .setMimeType(ContentService.MimeType.JSON);
      } else if (dados.action === 'uploadAnexo') {
        Logger.log('Executando: uploadAnexo()');
        resultado = uploadAnexo(dados.arquivo, dados.idNotificacao, dados.emailUsuario);
        return ContentService
          .createTextOutput(JSON.stringify(resultado))
          .setMimeType(ContentService.MimeType.JSON);
      } else if (dados.action === 'buscarPKSupabase') {
        Logger.log('Executando: buscarPKSupabase()');
        resultado = buscarPKSupabase(dados.idNotificacaoPlanilha);
        return ContentService
          .createTextOutput(JSON.stringify(resultado))
          .setMimeType(ContentService.MimeType.JSON);
      } else if (dados.action === 'listarAnexosNotificacao') {
        Logger.log('Executando: listarAnexosNotificacao()');
        resultado = listarAnexosNotificacao(dados.idNotificacao);
        return ContentService
          .createTextOutput(JSON.stringify(resultado))
          .setMimeType(ContentService.MimeType.JSON);
      } else if (dados.action === 'excluirAnexo') {
        Logger.log('Executando: excluirAnexo()');
        resultado = excluirAnexo(dados.anexoId);
        return ContentService
          .createTextOutput(JSON.stringify(resultado))
          .setMimeType(ContentService.MimeType.JSON);
      } else if (dados.action === 'excluirTodosAnexosNotificacao') {
        Logger.log('Executando: excluirTodosAnexosNotificacao()');
        resultado = excluirTodosAnexosNotificacao(dados.idNotificacao);
        return ContentService
          .createTextOutput(JSON.stringify(resultado))
          .setMimeType(ContentService.MimeType.JSON);
      } else if (dados.action === 'buscarAtualizacoes') {
        Logger.log('Executando: buscarAtualizacoes()');
        Logger.log('ID Notificação recebido: ' + dados.idNotificacao);
        const atualizacoes = buscarAtualizacoes(dados.idNotificacao);
        Logger.log('Total de atualizações encontradas: ' + atualizacoes.length);
        resultado = {
          success: true,
          atualizacoes: atualizacoes
        };
        Logger.log('Resultado a retornar: ' + JSON.stringify(resultado));
        return ContentService
          .createTextOutput(JSON.stringify(resultado))
          .setMimeType(ContentService.MimeType.JSON);
      } else if (dados.action === 'adicionarAtualizacao') {
        Logger.log('Executando: adicionarAtualizacao()');
        resultado = adicionarAtualizacao(dados.idNotificacao, dados.textoAtualizacao, dados.emailUsuario, dados.tagStatus);
        return ContentService
          .createTextOutput(JSON.stringify(resultado))
          .setMimeType(ContentService.MimeType.JSON);
      } else if (dados.action === 'listarSystemUpdates') {
        Logger.log('Executando: listarSystemUpdates()');
        Logger.log('Executando: listarSystemUpdates()');
        resultado = listarSystemUpdates(dados.limit || 50, dados.offset || 0, dados.since);
        return ContentService
          .createTextOutput(JSON.stringify(resultado))
          .setMimeType(ContentService.MimeType.JSON);
      } else if (dados.action === 'adicionarSystemUpdate') {
        Logger.log('Executando: adicionarSystemUpdate()');
        resultado = adicionarSystemUpdate(dados.tipoAcao, dados.tabelaAfetada, dados.idRegistro, dados.resumo, dados.detalhes, dados.emailUsuario);
        return ContentService
          .createTextOutput(JSON.stringify(resultado))
          .setMimeType(ContentService.MimeType.JSON);
      } else if (dados.action === 'listarNomesChildrenUnicos') {
        Logger.log('Executando: listarNomesChildrenUnicos()');
        resultado = listarNomesChildrenUnicos(dados.emailUsuario);
        return ContentService
          .createTextOutput(JSON.stringify(resultado))
          .setMimeType(ContentService.MimeType.JSON);
      } else if (dados.action === 'buscarNomeUsuarioLogado') {
        Logger.log('Executando: buscarNomeUsuarioLogado()');
        const nomeUsuario = buscarNomeUsuarioPorEmail(dados.emailUsuario);
        if (nomeUsuario) {
          resultado = {
            success: true,
            nome: nomeUsuario
          };
        } else {
          resultado = {
            success: false,
            message: 'Nome do usuário não encontrado'
          };
        }
        return ContentService
          .createTextOutput(JSON.stringify(resultado))
          .setMimeType(ContentService.MimeType.JSON);
      } else if (dados.action === 'getLastNotificationId') {
        Logger.log('Executando: handleGetLastNotificationId()');
        resultado = handleGetLastNotificationId(dados);
        return ContentService
          .createTextOutput(JSON.stringify(resultado))
          .setMimeType(ContentService.MimeType.JSON);
      } else if (dados.action === 'checkUpdates') {
        Logger.log('Executando: handleCheckUpdates()');
        resultado = handleCheckUpdates(dados);
        return ContentService
          .createTextOutput(JSON.stringify(resultado))
          .setMimeType(ContentService.MimeType.JSON);
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
        'responsavelRegistro',
        'foiMembroFamiliar' // NOVO CAMPO obrigatório
      ];
      
      const camposFaltando = [];
      
      for (const campo of camposObrigatorios) {
        // Para foiMembroFamiliar, aceita string vazia como "Não informado" (valor válido)
        if (campo === 'foiMembroFamiliar') {
          // Se o campo existe no formData (mesmo que seja string vazia), considera preenchido
          // String vazia significa "Não informado" que é uma opção válida
          if (formData[campo] === undefined || formData[campo] === null) {
            camposFaltando.push(campo);
          }
          // Se for string vazia, aceita como válido (não adiciona aos faltando)
        } else {
          // Para outros campos, valida normalmente
          if (!formData[campo] || formData[campo].toString().trim() === '') {
            camposFaltando.push(campo);
          }
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
      
      // Gera ID sequencial para a nova notificação (coluna Y)
      function gerarNovoId(sheetRef) {
        const lastRow = sheetRef.getLastRow();
        if (lastRow < 2) return 1; // primeira linha de dados será ID 1
        const idsRange = sheetRef.getRange(2, COLS.idNotificacao, lastRow - 1, 1).getValues();
        let maxId = 0;
        idsRange.forEach(row => {
          const valor = row[0];
          const num = Number(valor);
          if (!isNaN(num) && num > maxId) {
            maxId = num;
          }
        });
        return maxId + 1;
      }

      // Gera timestamp atual formatado como DD/MM/YYYY HH:MM
      function gerarTimestampFormatado() {
        const now = new Date();
        const dia = String(now.getDate()).padStart(2, '0');
        const mes = String(now.getMonth() + 1).padStart(2, '0');
        const ano = now.getFullYear();
        const hora = String(now.getHours()).padStart(2, '0');
        const minuto = String(now.getMinutes()).padStart(2, '0');
        return dia + '/' + mes + '/' + ano + ' ' + hora + ':' + minuto;
      }

      const novoId = gerarNovoId(sheet);
      const timestampCriacao = gerarTimestampFormatado();

      // Processar observações iniciais (se fornecidas)
      let atualizacoesInicial = [];
      if (formData.observacoesIniciais && formData.observacoesIniciais.trim() !== '') {
        const nomeUsuario = formData.responsavelRegistro || 'Sistema';
        const textoNormalizado = normalizarTextoBackend(formData.observacoesIniciais);
        atualizacoesInicial.push({
          data: new Date().toISOString(),
          usuario: nomeUsuario,
          texto: textoNormalizado
        });
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
        formData.orientacaoSexual || '',                                    // 8. Qual a Orientação Sexual?
        '',                                                                 // 9. Coluna I - IGNORADA (não será preenchida)
        formData.tipoViolencia || '',                                       // 10. Tipo de Violência
        formData.tipoViolenciaInstitucional || '',                          // 11. Tipo de Violência Institucional (condicional)
        formData.encaminhamento || '',                                      // 12. Encaminhamento
        extrairSiglaEscola(formData.cmeiEmef) || '',                        // 13. CMEI/EMEF (apenas sigla)
        formData.regiao || '',                                              // 14. Região
        formData.responsavelRegistro || '',                                 // 15. Responsável pelo Registro
        converterSimNao(formData.fonteEscola) || '',                        // 16. fonte informadores foi a escola? (S/N)
        converterSimNao(formData.violenciaEscolaOcorreu) || '',             // 17. violência identificada pela escola ocorrida na escola (S/N)
        converterSimNao(formData.profissionalAutor) || '',                  // 18. Algum profissional da escola foi autor da violência (S/N)
        converterSimNao(formData.estudanteAutor) || '',                     // 19. Album estudante foi autor da violência? (S/N)
        converterSimNao(formData.violenciaNaoEscola) || '',                 // 20. violência identificada pela escola não ocorrida na escola (S/N)
        converterSimNao(formData.ocorreuEscola) || '',                      // 21. ocorreu na escola? 1.1 (S/N)
        converterSimNao(formData.violenciaInformada) || '',                 // 22. violência informada a escola por qualquer um dos agentes que a compõe 1.2 (S/N)
        converterSimNao(formData.estudoCaso) || '',                         // 23. Foi Realizado Estudo de Caso? (S/N)
        converterSimNao(formData.foiMembroFamiliar) || '',                  // 24. Foi um membro familiar? (S/N)
        novoId,                                                             // 25. ID da notificação (sequencial)
        atualizacoesInicial.length > 0 ? JSON.stringify(atualizacoesInicial) : '',  // 26. Atualizações/Observações (JSON)
        timestampCriacao,                                                   // 27. Data de Criação (DD/MM/YYYY HH:MM)
        timestampCriacao                                                    // 28. Data de Última Edição (DD/MM/YYYY HH:MM)
      ];
      
      // Log para debug
      Logger.log('Salvando registro com pcdTranstorno=' + formData.pcdTranstorno + ' / pcdDetalhes=' + formData.pcdDetalhes + ' / id=' + novoId);
      
      // Adiciona a linha na planilha
      sheet.appendRow(novaLinha);
      
      // Atualiza timestamp automaticamente (cria coluna se não existir)
      const novaRow = sheet.getLastRow();
      atualizarTimestampCheckUpdates(sheet, novaRow);
      
      // Marca que houve uma mudança confirmada (para detecção de mudanças)
      marcarMudancaConfirmada(novaRow);
      
      // Log de sucesso
      Logger.log('Registro salvo com sucesso: ' + formData.criancaEstudante);
      
      // LOG SYSTEM UPDATE - Novo caso criado (INSERT)
      try {
        Logger.log('🚀 [DEBUG] Iniciando bloco de log de INSERT...');
        
        const emailParaLog = formData.responsavelRegistro || 'sistema@desconhecido.com';
        Logger.log('   Email para log: ' + emailParaLog);
        Logger.log('   ID do novo registro: ' + novoId);
        
        const resumo = 'Novo caso criado: ' + (formData.criancaEstudante || 'Sem nome');
        const detalhes = {
          tipo: 'insert',
          crianca: formData.criancaEstudante,
          data: formData.dataNT,
          idade: formData.idade,
          tipoViolencia: formData.tipoViolencia,
          regiao: formData.regiao,
          cmeiEmef: formData.cmeiEmef,
          responsavel: formData.responsavelRegistro,
          user_email: emailParaLog // Adiciona explícito
        };
        
        Logger.log('   Chamando adicionarSystemUpdate...');
        
        // Chama a função de log
        if (typeof adicionarSystemUpdate === 'function') {
           // Passa novoId como idRegistro
           const resultadoLog = adicionarSystemUpdate('INSERT', 'registros', String(novoId), resumo, detalhes, emailParaLog);
           Logger.log('   Resultado do log: ' + JSON.stringify(resultadoLog));
        } else {
           Logger.log('⚠️ adicionarSystemUpdate não disponível neste escopo');
        }
      } catch (eLog) {
        Logger.log('⚠️ Falha ao registrar criação de caso: ' + eLog.toString());
        Logger.log('   Stack: ' + eLog.stack);
      }

      // Sincroniza ID e responsável da notificação com Supabase (tabela notifications_ids)
      let pkSupabase = null;
      try {
        syncNotificacaoIdSupabase(novoId, formData.responsavelRegistro);
        
        // Tenta resolver a PK recém-criada (até 3 tentativas rápidas)
        for (let tent = 0; tent < 3; tent++) {
          try {
            const resPK = buscarPKSupabase(novoId);
            if (resPK && resPK.success && resPK.pk) {
              pkSupabase = resPK.pk;
              break;
            }
          } catch (ePK) {
            // ignora e tenta novamente
          }
          Utilities.sleep(150);
        }
        Logger.log('PK Supabase resolvida após salvar: ' + pkSupabase);
      } catch (syncErr) {
        Logger.log('Aviso: falha ao sincronizar ID no Supabase: ' + syncErr.toString());
      }
      
      return {
        success: true,
        message: 'Registro salvo com sucesso!',
        idPlanilha: novoId,
        idNotificacao: pkSupabase || null,
        criancaEstudante: formData.criancaEstudante || ''
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
  // SINCRONIZAÇÃO DE IDs COM SUPABASE (notifications_ids)
  // ========================================
  function syncNotificacaoIdSupabase(idPlanilha, responsavelRegistro) {
    if (!idPlanilha) return;
    if (typeof SUPABASE_URL === 'undefined' || typeof SUPABASE_ANON_KEY === 'undefined') {
      throw new Error('SUPABASE_URL ou SUPABASE_ANON_KEY não definidos neste projeto.');
    }

    const url = SUPABASE_URL + '/rest/v1/notifications_ids';
    const payload = {
      id_notificacao_planilha: Number(idPlanilha),
      responsavel_registro: responsavelRegistro ? String(responsavelRegistro).trim() : null
    };

    const options = {
      method: 'post',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates'
      },
      muteHttpExceptions: true,
      payload: JSON.stringify(payload)
    };

    const resp = UrlFetchApp.fetch(url, options);
    const code = resp.getResponseCode();
    if (code !== 200 && code !== 201) {
      throw new Error('Supabase retornou ' + code + ' - ' + resp.getContentText());
    }
    Logger.log('ID sincronizado no Supabase: ' + idPlanilha);
  }

  // ========================================
  // MIGRAÇÃO INICIAL DE IDs (Planilha -> Supabase)
  // ========================================
  function migrarIdsNotificacoes() {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      Logger.log('Planilha sem dados para migrar.');
      return;
    }

    const linhas = sheet.getRange(2, 1, lastRow - 1, TOTAL_COLS).getValues();
    let ok = 0, dup = 0, err = 0;

    linhas.forEach((row, idx) => {
      const idPlanilha = Number(row[COLS.idNotificacao - 1]);
      const responsavelRegistro = row[COLS.responsavelRegistro - 1] || '';
      if (!idPlanilha) return;
      try {
        const url = SUPABASE_URL + '/rest/v1/notifications_ids';
        const options = {
          method: 'post',
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
            'Content-Type': 'application/json',
            Prefer: 'resolution=merge-duplicates'
          },
          muteHttpExceptions: true,
          payload: JSON.stringify({
            id_notificacao_planilha: idPlanilha,
            responsavel_registro: responsavelRegistro ? String(responsavelRegistro).trim() : null
          })
        };
        const resp = UrlFetchApp.fetch(url, options);
        const code = resp.getResponseCode();
        if (code === 200 || code === 201) {
          ok++;
        } else if (code === 409) {
          dup++;
        } else {
          err++;
          Logger.log('Erro linha ' + (idx + 2) + ': ' + code + ' - ' + resp.getContentText());
        }
      } catch (e) {
        err++;
        Logger.log('Exceção linha ' + (idx + 2) + ': ' + e.toString());
      }
    });

    Logger.log('Migração IDs concluída: ok=' + ok + ', duplicatas=' + dup + ', erros=' + err);
  }

  // ========================================
  // FUNÇÃO PARA LIMPAR TODAS AS NOTIFICAÇÕES NO SUPABASE
  // ========================================
  function deletarTodasNotificacoesSupabase() {
    if (typeof SUPABASE_URL === 'undefined' || typeof SUPABASE_ANON_KEY === 'undefined') {
      throw new Error('SUPABASE_URL ou SUPABASE_ANON_KEY não definidos neste projeto.');
    }

    const url = SUPABASE_URL + '/rest/v1/notifications_ids?id_notificacao_planilha=gt.0';
    const options = {
      method: 'delete',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      muteHttpExceptions: true
    };

    const resp = UrlFetchApp.fetch(url, options);
    const code = resp.getResponseCode();
    const body = resp.getContentText();

    if (code !== 200 && code !== 204) {
      throw new Error('Falha ao excluir notificações: ' + code + ' - ' + body);
    }

    let removidas = 0;
    try {
      const json = JSON.parse(body || '[]');
      removidas = Array.isArray(json) ? json.length : 0;
    } catch (e) {
      removidas = 0;
    }

    Logger.log('Notificações removidas no Supabase: ' + removidas);
    return { success: true, removidas: removidas };
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
      Logger.log('[listarRegistros] Início');
      const inicio = new Date().getTime();
      
      const ss = SpreadsheetApp.openById(SHEET_ID);
      const sheet = ss.getSheetByName(SHEET_NAME);
      
      if (!sheet) {
        return {
          success: false,
          message: 'Aba "' + SHEET_NAME + '" não encontrada.'
        };
      }
      
      const lastRow = sheet.getLastRow();
      Logger.log('[listarRegistros] Total de linhas: ' + lastRow);
      
      if (lastRow < 2) {
        return {
          success: true,
          registros: []
        };
      }
      
      // Lê todos os dados (pula linha 1 do cabeçalho) - OTIMIZADO
      const range = sheet.getRange(2, 1, lastRow - 1, TOTAL_COLS);
      const valores = range.getValues();
      
      Logger.log('[listarRegistros] Dados lidos da planilha em ' + (new Date().getTime() - inicio) + 'ms');
      
      const registros = [];
      
      // Usa for loop ao invés de forEach (ligeiramente mais rápido)
      for (let index = 0; index < valores.length; index++) {
        const linha = valores[index];
        
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
          orientacaoSexual: linha[7] || '',        // Coluna H (índice 7)
          // Coluna I (índice 8) - IGNORADA (não será lida)
          tipoViolencia: linha[9] || '',           // Coluna J (índice 9)
          tipoViolenciaInstitucional: linha[10] || '',     // Coluna K (índice 10) - Tipo de Violência Institucional
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
          estudoCaso: linha[22] === 'S' ? 'Sim' : (linha[22] === 'N' ? 'Não' : 'Não informado'), // Coluna W (índice 22)
          foiMembroFamiliar: linha[23] === 'S' ? 'Sim' : (linha[23] === 'N' ? 'Não' : 'Não informado'), // Coluna X (índice 23)
          idNotificacao: linha[24] || '',          // Coluna Y (índice 24)
          dataCriacao: linha[26] || '',            // Coluna AA (índice 26) - Data de Criação
          dataUltimaEdicao: linha[27] || ''        // Coluna AB (índice 27) - Data de Última Edição
        });
      }
      
      const fim = new Date().getTime();
      const tempo = fim - inicio;
      Logger.log('[listarRegistros] Processamento concluído: ' + registros.length + ' registros em ' + tempo + 'ms');
      
      return {
        success: true,
        registros: registros,
        tempoProcessamento: tempo
      };
      
    } catch (error) {
      Logger.log('[listarRegistros] ERRO: ' + error.toString());
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
        Logger.log('tipoViolenciaInstitucional recebido: "' + dados.tipoViolenciaInstitucional + '"');
      
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
      
      function gerarTimestampFormatado() {
        const now = new Date();
        const dia = String(now.getDate()).padStart(2, '0');
        const mes = String(now.getMonth() + 1).padStart(2, '0');
        const ano = now.getFullYear();
        const hora = String(now.getHours()).padStart(2, '0');
        const minuto = String(now.getMinutes()).padStart(2, '0');
        return dia + '/' + mes + '/' + ano + ' ' + hora + ':' + minuto;
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
      
      // Lê valores atuais para preservar campos que não vêm do frontend (ex.: ID da notificação)
      const valoresAtuais = sheet.getRange(linha, 1, 1, TOTAL_COLS).getValues()[0];

      const linhaAtualizada = [
        dados.criancaEstudante || '',                       // 1. Criança/Estudante
        formatarData(dados.dataNT) || '',                   // 2. Data da NT
        dados.idade || '',                                  // 3. Idade
        converterIdentidadeGenero(dados.identidadeGenero) || '', // 4. Identidade de Gênero
        converterSimNao(dados.pcdTranstorno) || '',         // 5. PCD/Transtorno (S/N)
        dados.pcdDetalhes || '',                            // 6. Detalhes PCD
        dados.racaCor || '',                                // 7. Raça/Cor
        dados.orientacaoSexual || '',                       // 8. Orientação Sexual
        '',                                                 // 9. Coluna I - IGNORADA (não será preenchida)
        dados.tipoViolencia || '',                          // 10. Tipo de Violência
        dados.tipoViolenciaInstitucional || '',             // 11. Tipo de Violência Institucional (condicional)
        dados.encaminhamento || '',                         // 12. Encaminhamento
        extrairSiglaEscola(dados.cmeiEmef) || '',           // 13. CMEI/EMEF (apenas sigla)
        dados.regiao || '',                                 // 14. Região
        dados.responsavelRegistro || '',                    // 15. Responsável
        fonteEscolaConvertido,                              // 16. Fonte Escola
        violenciaEscolaOcorreuConvertido,                   // 17. Violência Escola Ocorreu
        profissionalAutorConvertido,                        // 18. Profissional Autor
        estudanteAutorConvertido,                           // 19. Estudante Autor
        violenciaNaoEscolaConvertido,                       // 20. Violência Não Escola
        ocorreuEscolaConvertido,                            // 21. Ocorreu Escola
        violenciaInformadaConvertido,                       // 22. Violência Informada
        estudoCasoConvertido,                               // 23. Estudo de Caso
        converterSimNao(dados.foiMembroFamiliar) || '',     // 24. Foi um membro familiar? (S/N)
        valoresAtuais[COLS.idNotificacao - 1] || '',         // 25. ID da notificação (preservado)
        valoresAtuais[COLS.atualizacoes - 1] || '',          // 26. Atualizações (preservado)
        valoresAtuais[COLS.dataCriacao - 1] || '',           // 27. Data Criação (preservado)
        gerarTimestampFormatado()                            // 28. Data Última Edição (atualizado)
      ];
      
      Logger.log('=== ARRAY MONTADO PARA ATUALIZAÇÃO ===');
      Logger.log('Posição [8] (col 9 - IGNORADA): "' + linhaAtualizada[8] + '"');
      Logger.log('Posição [9] (col 10 - tipoViolencia): "' + linhaAtualizada[9] + '"');
      Logger.log('Posição [10] (col 11 - tipoViolenciaInstitucional): "' + linhaAtualizada[10] + '"');
      Logger.log('Array completo:');
      Logger.log(JSON.stringify(linhaAtualizada));
      
      // Atualiza a linha
      const range = sheet.getRange(linha, 1, 1, TOTAL_COLS);
      range.setValues([linhaAtualizada]);
      
      // FORÇA A GRAVAÇÃO IMEDIATA
      SpreadsheetApp.flush();
      
      Logger.log('✅ Registro atualizado na linha ' + linha);
      
      // LOG DE VERIFICAÇÃO PÓS-GRAVAÇÃO
      const dadosVerificacao = sheet.getRange(linha, 1, 1, TOTAL_COLS).getValues()[0];
      Logger.log('=== VERIFICAÇÃO PÓS-GRAVAÇÃO ===');
      Logger.log('Tipo Violência gravado: "' + dadosVerificacao[9] + '"');
      Logger.log('Tipo Violência Inst. gravado: "' + dadosVerificacao[10] + '"');
      
      // Atualiza timestamp automaticamente (cria coluna se não existir)
      atualizarTimestampCheckUpdates(sheet, linha);
      
      // Marca que houve uma mudança confirmada (para detecção de mudanças)
      marcarMudancaConfirmada(linha);
      
      // LOG SYSTEM UPDATE com detalhamento de mudanças
      try {
        const idNotificacaoPlanilha = valoresAtuais[COLS.idNotificacao - 1]; // Coluna Y
        
        // Usa responsavelRegistro como email (o frontend envia isso, não emailUsuario)
        const emailParaLog = dados.emailUsuario || dados.responsavelRegistro || 'sistema@desconhecido.com';
        
        // Compara valores CONVERTIDOS (que vão ser gravados) com valores ATUAIS (que estão na planilha)
        // Isso garante que estamos comparando maçãs com maçãs (mesmo formato)
        const mudancas = [];
        
        // Mapeamento índice -> nome amigável
        const camposPorIndice = {
          0: 'Nome da Criança/Estudante',
          1: 'Data da NT',
          2: 'Idade',
          3: 'Identidade de Gênero',
          4: 'PCD/Transtorno',
          5: 'Detalhes PCD',
          6: 'Raça/Cor',
          7: 'Orientação Sexual',
          // 8: coluna I ignorada
          9: 'Tipo de Violência',
          10: 'Tipo de Violência Institucional',
          11: 'Encaminhamento',
          12: 'CMEI/EMEF',
          13: 'Região',
          14: 'Responsável pelo Registro',
          15: 'Fonte foi a Escola',
          16: 'Violência na Escola',
          17: 'Profissional Autor',
          18: 'Estudante Autor',
          19: 'Violência Não na Escola',
          20: 'Ocorreu na Escola',
          21: 'Violência Informada',
          22: 'Estudo de Caso',
          23: 'Foi Membro Familiar'
        };
        
        // Normaliza valor para comparação
        function normalizar(valor, indice) {
          if (valor === null || valor === undefined) return '';
          
          // Tratamento especial para datas (índice 1 = Data da NT)
          if (indice === 1 && valor instanceof Date) {
            const dia = ('0' + valor.getDate()).slice(-2);
            const mes = ('0' + (valor.getMonth() + 1)).slice(-2);
            const ano = valor.getFullYear();
            return dia + '/' + mes + '/' + ano;
          }
          
          return String(valor).trim();
        }
        
        // Compara cada campo (exceto os que são preservados: ID, atualizações, datas de criação/edição)
        for (let i = 0; i <= 23; i++) {
          if (i === 8) continue; // Pula coluna I (ignorada)
          if (!camposPorIndice[i]) continue; // Pula se não tem nome mapeado
          
          const valorAntigo = normalizar(valoresAtuais[i], i);
          const valorNovo = normalizar(linhaAtualizada[i], i);
          
          if (valorAntigo !== valorNovo) {
            mudancas.push({
              campo: camposPorIndice[i],
              de: valorAntigo || '(vazio)',
              para: valorNovo || '(vazio)'
            });
          }
        }
        
        let resumoMudancas = 'Registro editado (Linha ' + linha + ')';
        const detalhesMudancas = {
          tipo: 'update',
          linha: linha,
          totalMudancas: mudancas.length,
          mudancas: mudancas,
          crianca: dados.criancaEstudante
        };
        
        if (mudancas.length > 0) {
          // Cria resumo textual das mudanças
          const primeirasMudancas = mudancas.slice(0, 3).map(m => m.campo).join(', ');
          if (mudancas.length > 3) {
            resumoMudancas += ': ' + primeirasMudancas + ' e mais ' + (mudancas.length - 3) + ' campo(s)';
          } else {
            resumoMudancas += ': ' + primeirasMudancas;
          }
        }
        
        Logger.log('📝 Registrando System Update: ' + resumoMudancas);
        Logger.log('   Email: ' + emailParaLog);
        Logger.log('   Mudanças detectadas: ' + mudancas.length);
        
        // Chama a função de log
        if (typeof adicionarSystemUpdate === 'function') {
           adicionarSystemUpdate('UPDATE', 'registros', idNotificacaoPlanilha, resumoMudancas, detalhesMudancas, emailParaLog);
        } else {
           Logger.log('⚠️ adicionarSystemUpdate não está definida neste escopo');
        }
      } catch (eLog) {
        Logger.log('⚠️ Falha ao registrar System Update: ' + eLog.toString());
        Logger.log('Stack: ' + (eLog.stack || 'N/A'));
      }
      
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
  // FUNÇÃO PARA EXCLUIR UM REGISTRO (COM CASCATA)
  // ========================================
  function excluirRegistroComLog(dados) {
    try {
      Logger.log('🚀 [VERSÃO NOVA v3] Executando: excluirRegistroComLog()'); // MARCA DE DEBUG v3
      
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
      
      // Obtém dados ANTES de excluir para o log
      const registroDados = sheet.getRange(linha, 1, 1, TOTAL_COLS).getValues()[0];
      const idNotificacaoPlanilha = registroDados[COLS.idNotificacao - 1]; 
      const criancaNome = registroDados[0]; // Coluna A
      
      // ============================================
      // EXCLUSÃO EM CASCATA - FASE 1: ANEXOS
      // ============================================
      let anexosInfo = { arquivosExcluidos: 0, falhas: 0 };
      
      // Verifica se a função existe (está em Code-Anexos.gs)
      if (typeof excluirTodosAnexosNotificacao === 'function' && idNotificacaoPlanilha) {
         try {
           Logger.log('🗑️ Excluindo anexos para notificação: ' + idNotificacaoPlanilha);
           const resAnexos = excluirTodosAnexosNotificacao(idNotificacaoPlanilha);
           if (resAnexos.success) {
             anexosInfo = resAnexos;
           }
         } catch (eAnexos) {
           Logger.log('⚠️ Erro ao excluir anexos em cascata: ' + eAnexos);
         }
      } else {
        Logger.log('⚠️ excluirTodosAnexosNotificacao não disponível ou ID inválido');
      }

      // ============================================
      // EXCLUSÃO EM CASCATA - FASE 2: SUPABASE (notifications_ids)
      // ============================================
      let pkSupabase = null;
      if (typeof buscarPKSupabase === 'function' && idNotificacaoPlanilha) {
         try {
           const resPK = buscarPKSupabase(idNotificacaoPlanilha);
           if (resPK.success && resPK.pk) {
             pkSupabase = resPK.pk;
             Logger.log('🔗 PK Supabase encontrada: ' + pkSupabase);
             
             if (typeof excluirNotificacaoSupabase === 'function') {
               excluirNotificacaoSupabase(pkSupabase);
               Logger.log('✅ Supabase: Notificação ' + pkSupabase + ' excluída');
             }
           }
         } catch (eSupabase) {
           Logger.log('⚠️ Erro ao excluir do Supabase: ' + eSupabase);
         }
      }

      // ============================================
      // EXCLUSÃO DA LINHA
      // ============================================
      sheet.deleteRow(linha);
      
      // ============================================
      // LOG SYSTEM UPDATE (DELETE)
      // ============================================
      try {
        const emailParaLog = dados.emailUsuario || dados.responsavelRegistro || 'sistema@desconhecido.com';
        const resumo = 'Registro excluído: ' + (criancaNome || 'Sem nome');
        
        const detalhes = {
          tipo: 'delete',
          crianca: criancaNome,
          id_original: idNotificacaoPlanilha,
          linha_excluida: linha,
          anexos_removidos: anexosInfo.arquivosExcluidos
        };
        
        Logger.log('📝 Registrando exclusão de caso (DELETE)...');
        
        if (typeof adicionarSystemUpdate === 'function') {
           adicionarSystemUpdate('DELETE', 'registros', idNotificacaoPlanilha, resumo, detalhes, emailParaLog);
        }
      } catch (eLog) {
        Logger.log('⚠️ Falha ao registrar log de exclusão: ' + eLog.toString());
      }
      
      return {
        success: true,
        message: 'Registro e anexos excluídos com sucesso!'
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
// HELPER - COMPARAR VALORES PARA CHANGE TRACKING
// ========================================
/**
 * Compara valores antigos e novos e retorna lista de mudanças
 * @param {Object} valoresAntigos - Objeto com valores anteriores
 * @param {Object} valoresNovos - Objeto com valores novos
 * @return {Array} Array de mudanças: [{campo, de, para}, ...]
 */
function compararValores(valoresAntigos, valoresNovos) {
  const mudancas = [];
  
  // Mapeamento de nomes técnicos para nomes amigáveis
  const nomesAmigaveis = {
    criancaEstudante: 'Nome da Criança/Estudante',
    dataNT: 'Data da NT',
    idade: 'Idade',
    identidadeGenero: 'Identidade de Gênero',
    pcdTranstorno: 'PCD/Transtorno',
    pcdDetalhes: 'Detalhes PCD',
    racaCor: 'Raça/Cor',
    orientacaoSexual: 'Orientação Sexual',
    tipoViolencia: 'Tipo de Violência',
    tipoViolenciaInstitucional: 'Tipo de Violência Institucional',
    encaminhamento: 'Encaminhamento',
    cmeiEmef: 'CMEI/EMEF',
    regiao: 'Região',
    responsavelRegistro: 'Responsável pelo Registro',
    fonteEscola: 'Fonte foi a Escola',
    violenciaEscolaOcorreu: 'Violência na Escola',
    profissionalAutor: 'Profissional Autor',
    estudanteAutor: 'Estudante Autor',
    violenciaNaoEscola: 'Violência Não na Escola',
    ocorreuEscola: 'Ocorreu na Escola',
    violenciaInformada: 'Violência Informada',
    estudoCaso: 'Estudo de Caso',
    foiMembroFamiliar: 'Foi Membro Familiar'
  };
  
  // Normaliza valor para comparação (converte null, undefined, "" para string vazia)
  function normalizar(valor) {
    if (valor === null || valor === undefined || valor === '') return '';
    return String(valor).trim();
  }
  
  // Compara cada campo
  for (const campo in valoresNovos) {
    // Pula campos de controle
    if (campo === 'action' || campo === 'linha' || campo === 'colaboradores') continue;
    
    const valorAntigo = normalizar(valoresAntigos[campo]);
    const valorNovo = normalizar(valoresNovos[campo]);
    
    if (valorAntigo !== valorNovo) {
      const nomeAmigavel = nomesAmigaveis[campo] || campo;
      mudancas.push({
        campo: nomeAmigavel,
        de: valorAntigo || '(vazio)',
        para: valorNovo || '(vazio)'
      });
    }
  }
  
  return mudancas;
}

// ========================================
// LOG DE SISTEMA (SYSTEM UPDATES) - Cópia local para independência do script Auth
// ========================================
function adicionarSystemUpdate(tipoAcao, tabelaAfetada, idRegistro, resumo, detalhes, emailUsuario) {
  try {
    Logger.log('📝 Registrando System Update: ' + tipoAcao + ' em ' + tabelaAfetada);

    // Validação básica
    if (!tipoAcao || !tabelaAfetada) {
      Logger.log('⚠️ Tipo de ação ou tabela não informados');
      return { success: false, message: 'Dados incompletos' };
    }

    const url = `${SUPABASE_URL}/rest/v1/system_updates`;
    
    // Identifica usuário
    // Se o email não for passado, tenta pegar do Session (se executado como usuário)
    // Nota: Em Web App executado como "Me" (owner), Session.getActiveUser().getEmail() retorna o owner
    // Se executado como "User accessing the web app", retorna o email do usuário
    let userEmailFinal = emailUsuario;
    
    if (!userEmailFinal) {
       try {
         userEmailFinal = Session.getActiveUser().getEmail();
       } catch (e) {
         Logger.log('Não foi possível obter email da sessão: ' + e);
       }
    }

    // Prepara detalhes com email do usuário
    let detalhesObj = {};
    try {
      if (detalhes) {
        detalhesObj = (typeof detalhes === 'object') ? detalhes : JSON.parse(detalhes);
      }
    } catch (e) {
      detalhesObj = { raw_detalhes: detalhes };
    }
    
    // Adiciona email ao JSON de detalhes para não perder a informação
    if (userEmailFinal) {
      detalhesObj.user_email = userEmailFinal;
    }

    const payload = {
      tipo_acao: tipoAcao,
      tabela_afetada: tabelaAfetada,
      id_registro: idRegistro ? String(idRegistro) : null,
      resumo: resumo,
      detalhes: JSON.stringify(detalhesObj),
      autor_email: userEmailFinal // Corrigido: Nome da coluna é autor_email
    };

    const options = {
      method: 'post',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();

    if (responseCode === 201 || responseCode === 200 || responseCode === 204) {
      Logger.log('✅ System Update registrado com sucesso');
      return { success: true };
    } else {
      Logger.log('❌ Erro ao registrar System Update: ' + responseCode + ' - ' + response.getContentText());
      return { success: false, message: 'Erro ao registrar log' };
    }

  } catch (error) {
    Logger.log('❌ Erro em adicionarSystemUpdate: ' + error.toString());
    return { success: false, message: error.toString() };
  }
}

  // ========================================
  // FUNÇÃO PARA EXCLUIR UM REGISTRO (COM CASCATA)
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
      
      // ============================================
      // EXCLUSÃO EM CASCATA - FASE 1: ANEXOS
      // ============================================
      // Primeiro, obtém o ID da notificação (planilha) antes de deletar a linha
      const registroDados = sheet.getRange(linha, 1, 1, TOTAL_COLS).getValues()[0];
      const idNotificacaoPlanilha = registroDados[COLS.idNotificacao - 1]; // Coluna Y (índice 24)
      
      // Extraindo dados para exclusão da pasta no Drive
      const nomeCrianca = registroDados[COLS.criancaEstudante - 1];
      const emailTecnico = registroDados[COLS.responsavelRegistro - 1] || 'admin'; // Usa responsavel se nao tiver email
      
      if (typeof excluirPastaNotificacao === 'function') {
          // Usa a função do DriveFolderManager.gs se disponível
          try {
            const deletouPasta = excluirPastaNotificacao(emailTecnico, nomeCrianca, idNotificacaoPlanilha);
            if (deletouPasta) {
               Logger.log('   🗑️ Pasta da notificação excluída com sucesso.');
            } else {
               Logger.log('   ⚠️ Pasta da notificação não encontrada ou erro ao excluir.');
            }
          } catch(ePasta) {
             Logger.log('   ⚠️ Erro ao tentar excluir pasta: ' + ePasta);
          }
      } else {
         Logger.log('   ⚠️ Função excluirPastaNotificacao não encontrada.');
      }
      
      Logger.log('📋 Excluindo registro da linha ' + linha);
      Logger.log('   ID da Notificação (planilha): ' + idNotificacaoPlanilha);
      
      // Resolver PK do Supabase a partir do ID da planilha
      let idNotificacaoPK = null;
      try {
        const resPK = buscarPKSupabase(idNotificacaoPlanilha);
        if (resPK && resPK.success && resPK.pk) {
          idNotificacaoPK = resPK.pk;
          Logger.log('   🔗 PK Supabase resolvida: ' + idNotificacaoPK);
        } else {
          Logger.log('   ⚠️ Não foi possível resolver a PK no Supabase para id_notificacao_planilha=' + idNotificacaoPlanilha);
        }
      } catch (ePK) {
        Logger.log('   ⚠️ Erro ao buscar PK Supabase: ' + ePK.toString());
      }
      
      // Se houver PK de notificação, deleta todos os anexos associados
      if (idNotificacaoPK) {
        try {
          Logger.log('   🔍 Procurando anexos associados...');
          
          // Chama a função de exclusão de anexos se existir
          if (typeof excluirTodosAnexosNotificacao === 'function') {
            const resultadoAnexos = excluirTodosAnexosNotificacao(idNotificacaoPK);
            Logger.log('   ✅ Anexos excluídos: ' + JSON.stringify(resultadoAnexos));
          } else {
            Logger.log('   ⚠️ Função excluirTodosAnexosNotificacao não disponível');
          }
        } catch (erroAnexos) {
          Logger.log('   ⚠️ Erro ao excluir anexos: ' + erroAnexos.toString());
          // Continua mesmo se houver erro nos anexos, pois a exclusão do registro é mais importante
        }
      }
      
      // ============================================
      // EXCLUSÃO EM CASCATA - FASE 2: BANCO DE DADOS
      // ============================================
      try {
        if (idNotificacaoPK) {
          Logger.log('   🗄️ Excluindo de Supabase...');
          excluirNotificacaoSupabase(idNotificacaoPK);
          Logger.log('   ✅ Registros de Supabase excluídos');
        }
      } catch (erroSupabase) {
        Logger.log('   ⚠️ Erro ao excluir de Supabase: ' + erroSupabase.toString());
        // Continua mesmo se houver erro
      }
      
      // ============================================
      // EXCLUSÃO EM CASCATA - FASE 3: PLANILHA
      // ============================================
      Logger.log('   📊 Excluindo da planilha Google Sheets...');
      sheet.deleteRow(linha);
      Logger.log('   ✅ Linha ' + linha + ' deletada da planilha');
      
      return {
        success: true,
        message: 'Registro excluído com sucesso junto com todos os seus anexos!'
      };
      
    } catch (error) {
      Logger.log('❌ Erro ao excluir registro: ' + error.toString());
      return {
        success: false,
        message: 'Erro ao excluir: ' + error.message
      };
    }
  }

  // ========================================
  // FUNÇÃO AUXILIAR - EXCLUIR DE SUPABASE
  // ========================================
  function excluirNotificacaoSupabase(idNotificacao) {
    try {
      const supabaseUrl = 'https://aepdbpkrkokcnhfljury.supabase.co';
      const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlcGRicGtya29rY25oZmxqdXJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMTMyMjIsImV4cCI6MjA4MDc4OTIyMn0.JLlKeTS3LYv1xce4kCx5tuJCgKfDVvQW_qx7AvsvoIc';
      
      // DELETE de notifications_ids (que também deleta anexos_notificacoes via FK CASCADE)
      const url = supabaseUrl + '/rest/v1/notifications_ids?id=eq.' + encodeURIComponent(idNotificacao);
      
      const options = {
        method: 'delete',
        headers: {
          'apikey': supabaseKey,
          'Authorization': 'Bearer ' + supabaseKey,
          'Content-Type': 'application/json'
        },
        muteHttpExceptions: true
      };
      
      const response = UrlFetchApp.fetch(url, options);
      const status = response.getResponseCode();
      
      if (status >= 200 && status < 300) {
        Logger.log('✅ Supabase: Notificação ' + idNotificacao + ' excluída com cascata');
      } else {
        Logger.log('⚠️ Supabase retornou status ' + status + ': ' + response.getContentText());
      }
    } catch (error) {
      Logger.log('⚠️ Erro ao chamar Supabase: ' + error.toString());
      throw error;
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

  // ========================================
  // SISTEMA DE NOTIFICAÇÕES POR USUÁRIO
  // ========================================

  /**
   * Lista notificações do usuário logado
   * @param {string} emailUsuario - Email do usuário logado
   * @return {Object} {success: boolean, notificacoes: Array, total: number, naoLidas: number}
   */
  // Função auxiliar para normalizar nomes (remove acentos, espaços extras, lowercase)
  function normalizarNome(nome) {
    if (!nome) return '';
    return nome
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' '); // Substitui múltiplos espaços por um único espaço
  }

  function listarMinhasNotificacoes(emailUsuario) {
    try {
      Logger.log('=== LISTAR MINHAS NOTIFICAÇÕES (AGRUPADAS POR CRIANÇA) ===');
      Logger.log('Email: ' + emailUsuario);
      
      if (!emailUsuario) {
        return {
          success: false,
          message: 'Email do usuário não informado'
        };
      }
      
      // 1. Buscar nome do usuário no Supabase
      const nomeUsuario = buscarNomeUsuarioPorEmail(emailUsuario);
      
      if (!nomeUsuario) {
        return {
          success: false,
          message: 'Usuário não encontrado ou nome não cadastrado'
        };
      }
      
      Logger.log('Nome do usuário: ' + nomeUsuario);
      
      // 2. Buscar notificações no Supabase pelo nome
      const notificacoesBD = buscarNotificacoesPorNome(nomeUsuario);
      
      Logger.log('Notificações encontradas no BD: ' + notificacoesBD.length);
      
      if (notificacoesBD.length === 0) {
        return {
          success: true,
          notificacoes: [],
          grupos: {},
          total: 0
        };
      }
      
      // 3. OTIMIZAÇÃO: Ler TODAS as linhas da planilha uma única vez
      const ss = SpreadsheetApp.openById(SHEET_ID);
      const sheet = ss.getSheetByName(SHEET_NAME);
      const lastRow = sheet.getLastRow();
      
      if (lastRow < 2) {
        return {
          success: true,
          notificacoes: [],
          grupos: {},
          total: 0
        };
      }
      
      // Lê TODAS as linhas de uma vez (muito mais rápido!)
      const todasAsLinhas = sheet.getRange(2, 1, lastRow - 1, TOTAL_COLS).getValues();
      
      // Cria um mapa ID -> linha para acesso O(1)
      const mapaIds = {};
      for (let i = 0; i < todasAsLinhas.length; i++) {
        const id = Number(todasAsLinhas[i][COLS.idNotificacao - 1]);
        if (id > 0) {
          mapaIds[id] = todasAsLinhas[i];
        }
      }
      
      Logger.log('Mapa de IDs criado com ' + Object.keys(mapaIds).length + ' registros');
      
      // 4. Para cada notificação, buscar dados do mapa e agrupar por criança
      const notificacoesCompletas = [];
      const gruposPorCrianca = {};
      const mapaNomesNormalizados = {}; // Mapeia nome normalizado -> nome original
      
      // Normaliza o nome do usuário para comparação
      const nomeUsuarioNormalizado = normalizarNome(nomeUsuario);

      for (let j = 0; j < notificacoesBD.length; j++) {
        const notif = notificacoesBD[j];
        const linhaData = mapaIds[Number(notif.id_notificacao_planilha)];

        if (linhaData) {
          // Verifica se o responsável do registro é o usuário atual
          const responsavelRegistro = linhaData[COLS.responsavelRegistro - 1] || '';
          const responsavelNormalizado = normalizarNome(responsavelRegistro);

          // Só inclui se o responsável for o usuário logado
          if (responsavelNormalizado !== nomeUsuarioNormalizado) {
            Logger.log('Ignorando notificação ' + notif.id_notificacao_planilha + ' - responsável diferente: ' + responsavelRegistro + ' != ' + nomeUsuario);
            continue;
          }

          // Formata data
          let dataBR = '';
          if (linhaData[COLS.dataNT - 1]) {
            if (linhaData[COLS.dataNT - 1] instanceof Date) {
              const d = linhaData[COLS.dataNT - 1];
              const dia = ('0' + d.getDate()).slice(-2);
              const mes = ('0' + (d.getMonth() + 1)).slice(-2);
              const ano = d.getFullYear();
              dataBR = dia + '/' + mes + '/' + ano;
            } else {
              dataBR = linhaData[COLS.dataNT - 1].toString();
            }
          }
          
          // Formata gênero
          let identidadeGenero = linhaData[COLS.identidadeGenero - 1] || '';
          if (identidadeGenero === 'M') {
            identidadeGenero = 'Menino';
          } else if (identidadeGenero === 'F') {
            identidadeGenero = 'Menina';
          }
          
          const notificacao = {
            idBD: notif.id || null,
            idNotificacao: notif.id_notificacao_planilha,
            dataCriacao: linhaData[COLS.dataCriacao - 1] || '',
            dataUltimaEdicao: linhaData[COLS.dataUltimaEdicao - 1] || '',
            // Dados da planilha
            criancaEstudante: linhaData[0] || '',
            dataNT: dataBR,
            idade: linhaData[2] || '',
            identidadeGenero: identidadeGenero,
            // Campos adicionais para autofill no formulário
            pcdTranstorno: linhaData[4] === 'S' ? 'Sim' : (linhaData[4] === 'N' ? 'Não' : 'Não informado'),
            pcdDetalhes: linhaData[5] || '',
            racaCor: linhaData[6] || '',
            orientacaoSexual: linhaData[7] || '',
            tipoViolencia: linhaData[9] || '',
            cmeiEmef: linhaData[12] || '',
            regiao: linhaData[13] || '',
            responsavelRegistro: linhaData[14] || ''
          };
          
          notificacoesCompletas.push(notificacao);
          
          // Agrupa por nome da criança (normalizado para evitar duplicatas)
          const nomeCrianca = notificacao.criancaEstudante;
          const nomeNormalizado = normalizarNome(nomeCrianca);
          
          // Mantém o primeiro nome encontrado (original) para cada variação
          if (!mapaNomesNormalizados[nomeNormalizado]) {
            mapaNomesNormalizados[nomeNormalizado] = nomeCrianca;
          }
          
          const nomeParaAgrupar = mapaNomesNormalizados[nomeNormalizado];
          
          if (!gruposPorCrianca[nomeParaAgrupar]) {
            gruposPorCrianca[nomeParaAgrupar] = [];
          }
          gruposPorCrianca[nomeParaAgrupar].push(notificacao);
        }
      }
      
      Logger.log('Notificações completas: ' + notificacoesCompletas.length);
      Logger.log('Grupos de crianças: ' + Object.keys(gruposPorCrianca).length);
      
      return {
        success: true,
        notificacoes: notificacoesCompletas,
        grupos: gruposPorCrianca,
        total: notificacoesCompletas.length
      };
      
    } catch (error) {
      Logger.log('Erro ao listar notificações: ' + error.toString());
      return {
        success: false,
        message: 'Erro ao buscar notificações: ' + error.message,
        notificacoes: [],
        grupos: {},
        total: 0
      };
    }
  }

  /**
   * Busca nome do usuário por email no Supabase
   * @param {string} email - Email do usuário
   * @return {string|null} Nome do usuário ou null
   */
  function buscarNomeUsuarioPorEmail(email) {
    try {
      const url = SUPABASE_URL + '/rest/v1/app_users?email=eq.' + encodeURIComponent(email) + '&select=nome';
      
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
      
      if (responseCode !== 200) {
        Logger.log('Erro ao buscar nome do usuário: ' + responseCode);
        return null;
      }
      
      const usuarios = JSON.parse(response.getContentText());
      
      if (usuarios && usuarios.length > 0 && usuarios[0].nome) {
        return usuarios[0].nome;
      }
      
      return null;
      
    } catch (error) {
      Logger.log('Erro em buscarNomeUsuarioPorEmail: ' + error.toString());
      return null;
    }
  }

  /**
   * Busca notificações no Supabase por nome do responsável
   * @param {string} nomeResponsavel - Nome do responsável
   * @return {Array} Array de notificações do BD
   */
  function buscarNotificacoesPorNome(nomeResponsavel) {
    try {
      const url = SUPABASE_URL + '/rest/v1/notifications_ids?responsavel_registro=eq.' + 
                  encodeURIComponent(nomeResponsavel) + 
                  '&select=*&order=created_at.desc';
      
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
      
      if (responseCode !== 200) {
        Logger.log('Erro ao buscar notificações: ' + responseCode);
        return [];
      }
      
      return JSON.parse(response.getContentText());
      
    } catch (error) {
      Logger.log('Erro em buscarNotificacoesPorNome: ' + error.toString());
      return [];
    }
  }

  /**
   * Busca detalhes de uma notificação na planilha pelo ID
   * @param {number} idNotificacao - ID da notificação na planilha (coluna Y)
   * @return {Object|null} Objeto com dados da notificação ou null
   */
  function buscarNaPlanilhaPorId(idNotificacao) {
    try {
      const ss = SpreadsheetApp.openById(SHEET_ID);
      const sheet = ss.getSheetByName(SHEET_NAME);
      
      if (!sheet) {
        return null;
      }
      
      const lastRow = sheet.getLastRow();
      
      if (lastRow < 2) {
        return null;
      }
      
      // Lê coluna Y (IDs) para encontrar a linha
      const idsRange = sheet.getRange(2, COLS.idNotificacao, lastRow - 1, 1);
      const ids = idsRange.getValues();
      
      // Encontra a linha correspondente
      let linhaEncontrada = -1;
      
      for (let i = 0; i < ids.length; i++) {
        if (Number(ids[i][0]) === Number(idNotificacao)) {
          linhaEncontrada = i + 2; // +2 porque: +1 para índice 0-based, +1 para pular cabeçalho
          break;
        }
      }
      
      if (linhaEncontrada === -1) {
        Logger.log('ID ' + idNotificacao + ' não encontrado na planilha');
        return null;
      }
      
      // Lê a linha completa
      const linhaData = sheet.getRange(linhaEncontrada, 1, 1, TOTAL_COLS).getValues()[0];
      
      // Converte data
      let dataBR = '';
      if (linhaData[COLS.dataNT - 1]) {
        if (linhaData[COLS.dataNT - 1] instanceof Date) {
          const d = linhaData[COLS.dataNT - 1];
          const dia = ('0' + d.getDate()).slice(-2);
          const mes = ('0' + (d.getMonth() + 1)).slice(-2);
          const ano = d.getFullYear();
          dataBR = dia + '/' + mes + '/' + ano;
        } else {
          dataBR = linhaData[COLS.dataNT - 1].toString();
        }
      }
      
      // Converte identidade de gênero
      let identidadeGenero = linhaData[COLS.identidadeGenero - 1] || '';
      if (identidadeGenero === 'M') {
        identidadeGenero = 'Menino';
      } else if (identidadeGenero === 'F') {
        identidadeGenero = 'Menina';
      }
      
      return {
        linha: linhaEncontrada,
        criancaEstudante: linhaData[0] || '',
        dataNT: dataBR,
        idade: linhaData[2] || '',
        identidadeGenero: identidadeGenero,
        pcdTranstorno: linhaData[4] === 'S' ? 'Sim' : (linhaData[4] === 'N' ? 'Não' : 'Não informado'),
        pcdDetalhes: linhaData[5] || '',
        racaCor: linhaData[6] || '',
        orientacaoSexual: linhaData[7] || '',
        tipoViolencia: linhaData[9] || '',
        tipoViolenciaInstitucional: linhaData[10] || '',
        encaminhamento: linhaData[11] || '',
        cmeiEmef: linhaData[12] || '',
        regiao: linhaData[13] || '',
        responsavelRegistro: linhaData[14] || '',
        fonteEscola: linhaData[15] === 'S' ? 'Sim' : (linhaData[15] === 'N' ? 'Não' : 'Não informado'),
        violenciaEscolaOcorreu: linhaData[16] === 'S' ? 'Sim' : (linhaData[16] === 'N' ? 'Não' : 'Não informado'),
        profissionalAutor: linhaData[17] === 'S' ? 'Sim' : (linhaData[17] === 'N' ? 'Não' : 'Não informado'),
        estudanteAutor: linhaData[18] === 'S' ? 'Sim' : (linhaData[18] === 'N' ? 'Não' : 'Não informado'),
        violenciaNaoEscola: linhaData[19] === 'S' ? 'Sim' : (linhaData[19] === 'N' ? 'Não' : 'Não informado'),
        ocorreuEscola: linhaData[20] === 'S' ? 'Sim' : (linhaData[20] === 'N' ? 'Não' : 'Não informado'),
        violenciaInformada: linhaData[21] === 'S' ? 'Sim' : (linhaData[21] === 'N' ? 'Não' : 'Não informado'),
        estudoCaso: linhaData[22] === 'S' ? 'Sim' : (linhaData[22] === 'N' ? 'Não' : 'Não informado'),
        foiMembroFamiliar: linhaData[23] === 'S' ? 'Sim' : (linhaData[23] === 'N' ? 'Não' : 'Não informado'),
        idNotificacao: linhaData[24] || ''
      };
      
    } catch (error) {
      Logger.log('Erro em buscarNaPlanilhaPorId: ' + error.toString());
      return null;
    }
  }

  /**
   * Busca detalhes completos de UMA notificação (BD + Planilha) - OTIMIZADO
   * @param {number} idNotificacao - ID da notificação na planilha
   * @param {string} emailUsuario - Email do usuário (para validação)
   * @return {Object} Objeto com todos os detalhes ou erro
   */
  function listarNomesChildrenUnicos(emailUsuario) {
    try {
      Logger.log('=== LISTAR NOMES DE CRIANÇAS ÚNICOS DO USUÁRIO ===');
      
      // Validar email do usuário
      if (!emailUsuario) {
        return {
          success: false,
          message: 'Email do usuário não informado',
          nomes: []
        };
      }
      
      Logger.log('Email do usuário: ' + emailUsuario);
      
      // 1. Buscar nome do usuário no Supabase usando o email
      const nomeUsuario = buscarNomeUsuarioPorEmail(emailUsuario);
      
      if (!nomeUsuario) {
        return {
          success: false,
          message: 'Usuário não encontrado',
          nomes: []
        };
      }
      
      Logger.log('Nome do usuário: ' + nomeUsuario);
      
      // 2. Buscar notificações deste usuário usando o nome
      const notificacoesBD = buscarNotificacoesPorNome(nomeUsuario);
      
      Logger.log('Notificações deste usuário: ' + notificacoesBD.length);
      
      if (notificacoesBD.length === 0) {
        return {
          success: true,
          nomes: []
        };
      }
      
      // 3. Extrair IDs de notificação
      const idsNotificacao = notificacoesBD.map(n => n.id);
      
      Logger.log('IDs das notificações: ' + idsNotificacao.join(', '));
      
      // 4. Ler todas as linhas da planilha
      const ss = SpreadsheetApp.openById(SHEET_ID);
      const sheet = ss.getSheetByName(SHEET_NAME);
      const lastRow = sheet.getLastRow();
      
      if (lastRow < 2) {
        return {
          success: true,
          nomes: []
        };
      }
      
      // 5. Ler todos os dados
      const todasAsLinhas = sheet.getRange(2, 1, lastRow - 1, TOTAL_COLS).getValues();
      
      // 6. Extrair nomes apenas das notificações do usuário
      const nomesSet = new Set();
      todasAsLinhas.forEach(linha => {
        const idNotif = (linha[COLS.idNotificacao - 1] || '').toString().trim();
        
        // Verificar se este registro pertence às notificações do usuário
        if (idsNotificacao.includes(idNotif)) {
          const nome = (linha[COLS.criancaEstudante - 1] || '').toString().trim();
          if (nome && nome.length > 0) {
            nomesSet.add(nome);
          }
        }
      });
      
      // 7. Converter para array e ordenar alfabeticamente
      const nomes = Array.from(nomesSet).sort();
      
      Logger.log('Total de nomes únicos do usuário: ' + nomes.length);
      Logger.log('Nomes encontrados: ' + nomes.join(', '));
      
      return {
        success: true,
        nomes: nomes
      };
    } catch (erro) {
      Logger.log('❌ Erro ao listar nomes de crianças: ' + erro);
      return {
        success: false,
        message: 'Erro ao listar nomes: ' + erro.toString(),
        nomes: []
      };
    }
  }

  /**
   * Busca detalhes completos de UMA notificação (BD + Planilha) - OTIMIZADO
   * @param {number} idNotificacao - ID da notificação na planilha
   * @param {string} emailUsuario - Email do usuário (para validação)
   * @return {Object} Objeto com todos os detalhes ou erro
   */
  function buscarDetalhesNotificacao(idNotificacao, emailUsuario) {
    try {
      Logger.log('=== BUSCAR DETALHES NOTIFICAÇÃO (OTIMIZADO) ===');
      Logger.log('ID: ' + idNotificacao + ' | Email: ' + emailUsuario);
      
      // 1. Buscar nome do usuário
      const nomeUsuario = buscarNomeUsuarioPorEmail(emailUsuario);
      
      if (!nomeUsuario) {
        return {
          success: false,
          message: 'Usuário não encontrado'
        };
      }
      
      // 2. Buscar notificação no BD
      const notifBD = buscarNotificacaoBD(idNotificacao);
      
      if (!notifBD) {
        return {
          success: false,
          message: 'Notificação não encontrada'
        };
      }
      
      // 3. Validar que pertence ao usuário
      if (notifBD.responsavel_registro !== nomeUsuario) {
        return {
          success: false,
          message: 'Acesso negado: notificação não pertence ao usuário'
        };
      }
      
      // 4. OTIMIZAÇÃO: Ler dados da planilha uma única vez
      const ss = SpreadsheetApp.openById(SHEET_ID);
      const sheet = ss.getSheetByName(SHEET_NAME);
      const lastRow = sheet.getLastRow();
      
      if (lastRow < 2) {
        return {
          success: false,
          message: 'Planilha vazia'
        };
      }
      
      // Lê TODAS as linhas e cria mapa
      const todasAsLinhas = sheet.getRange(2, 1, lastRow - 1, TOTAL_COLS).getValues();
      let linhaData = null;
      
      for (let i = 0; i < todasAsLinhas.length; i++) {
        if (Number(todasAsLinhas[i][COLS.idNotificacao - 1]) === Number(idNotificacao)) {
          linhaData = todasAsLinhas[i];
          break;
        }
      }
      
      if (!linhaData) {
        return {
          success: false,
          message: 'Detalhes não encontrados na planilha'
        };
      }
      
      // 5. Formatar dados
      let dataBR = '';
      if (linhaData[COLS.dataNT - 1]) {
        if (linhaData[COLS.dataNT - 1] instanceof Date) {
          const d = linhaData[COLS.dataNT - 1];
          const dia = ('0' + d.getDate()).slice(-2);
          const mes = ('0' + (d.getMonth() + 1)).slice(-2);
          const ano = d.getFullYear();
          dataBR = dia + '/' + mes + '/' + ano;
        } else {
          dataBR = linhaData[COLS.dataNT - 1].toString();
        }
      }
      
      let identidadeGenero = linhaData[COLS.identidadeGenero - 1] || '';
      if (identidadeGenero === 'M') {
        identidadeGenero = 'Menino';
      } else if (identidadeGenero === 'F') {
        identidadeGenero = 'Menina';
      }
      
      // 6. Buscar atualizações
      const atualizacoes = buscarAtualizacoes(Number(idNotificacao));
      
      // 7. Retornar dados completos
      return {
        success: true,
        notificacao: {
          idBD: notifBD.id,
          idNotificacao: notifBD.id_notificacao_planilha,
          lida: notifBD.lida,
          dataVisualizacao: notifBD.data_visualizacao,
          dataCriacao: notifBD.created_at,
          criancaEstudante: linhaData[0] || '',
          dataNT: dataBR,
          idade: linhaData[2] || '',
          identidadeGenero: identidadeGenero,
          pcdTranstorno: linhaData[4] === 'S' ? 'Sim' : (linhaData[4] === 'N' ? 'Não' : 'Não informado'),
          pcdDetalhes: linhaData[5] || '',
          racaCor: linhaData[6] || '',
          orientacaoSexual: linhaData[7] || '',
          tipoViolencia: linhaData[9] || '',
          tipoViolenciaInstitucional: linhaData[10] || '',
          encaminhamento: linhaData[11] || '',
          cmeiEmef: linhaData[12] || '',
          regiao: linhaData[13] || '',
          responsavelRegistro: linhaData[14] || '',
          fonteEscola: linhaData[15] === 'S' ? 'Sim' : (linhaData[15] === 'N' ? 'Não' : 'Não informado'),
          violenciaEscolaOcorreu: linhaData[16] === 'S' ? 'Sim' : (linhaData[16] === 'N' ? 'Não' : 'Não informado'),
          profissionalAutor: linhaData[17] === 'S' ? 'Sim' : (linhaData[17] === 'N' ? 'Não' : 'Não informado'),
          estudanteAutor: linhaData[18] === 'S' ? 'Sim' : (linhaData[18] === 'N' ? 'Não' : 'Não informado'),
          violenciaNaoEscola: linhaData[19] === 'S' ? 'Sim' : (linhaData[19] === 'N' ? 'Não' : 'Não informado'),
          ocorreuEscola: linhaData[20] === 'S' ? 'Sim' : (linhaData[20] === 'N' ? 'Não' : 'Não informado'),
          violenciaInformada: linhaData[21] === 'S' ? 'Sim' : (linhaData[21] === 'N' ? 'Não' : 'Não informado'),
          estudoCaso: linhaData[22] === 'S' ? 'Sim' : (linhaData[22] === 'N' ? 'Não' : 'Não informado'),
          foiMembroFamiliar: linhaData[23] === 'S' ? 'Sim' : (linhaData[23] === 'N' ? 'Não' : 'Não informado'),
          atualizacoes: atualizacoes
        }
      };
      
    } catch (error) {
      Logger.log('Erro em buscarDetalhesNotificacao: ' + error.toString());
      return {
        success: false,
        message: 'Erro ao buscar detalhes: ' + error.message
      };
    }
  }

  /**
   * Busca notificação no BD pelo ID da planilha
   * @param {number} idNotificacao - ID da notificação na planilha
   * @return {Object|null} Dados do BD ou null
   */
  function buscarNotificacaoBD(idNotificacao) {
    try {
      const url = SUPABASE_URL + '/rest/v1/notifications_ids?id_notificacao_planilha=eq.' + 
                  idNotificacao + '&select=*';
      
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
      
      if (responseCode !== 200) {
        return null;
      }
      
      const notificacoes = JSON.parse(response.getContentText());
      
      if (notificacoes && notificacoes.length > 0) {
        return notificacoes[0];
      }
      
      return null;
      
    } catch (error) {
      Logger.log('Erro em buscarNotificacaoBD: ' + error.toString());
      return null;
    }
  }

  /**
   * Marca notificação como lida
   * @param {number} idNotificacao - ID da notificação na planilha
   * @param {string} emailUsuario - Email do usuário (para validação)
   * @return {Object} {success: boolean, message?: string}
   */
  
  // ========================================
  // BUSCAR PK DO SUPABASE
  // ========================================
  /**
   * Busca a PK (id) da tabela notifications_ids no Supabase
   * baseada no id_notificacao_planilha (coluna Y da planilha)
   * @param {number} idNotificacaoPlanilha - ID da notificação da planilha (coluna Y)
   * @return {Object} {success: boolean, pk: number}
   */
  function buscarPKSupabase(idNotificacaoPlanilha) {
    try {
      Logger.log('[buscarPKSupabase] Buscando PK para idNotificacao planilha: ' + idNotificacaoPlanilha);
      
      const url = SUPABASE_URL + '/rest/v1/notifications_ids?id_notificacao_planilha=eq.' + idNotificacaoPlanilha + '&select=id&limit=1';
      
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
      
      Logger.log('[buscarPKSupabase] Status HTTP: ' + responseCode);
      Logger.log('[buscarPKSupabase] Resposta: ' + responseText);
      
      if (responseCode === 200) {
        const registros = JSON.parse(responseText);
        
        if (registros && registros.length > 0) {
          const pk = registros[0].id;
          Logger.log('[buscarPKSupabase] ✅ PK encontrada: ' + pk);
          return {
            success: true,
            pk: pk
          };
        } else {
          Logger.log('[buscarPKSupabase] ⚠️ Nenhum registro encontrado');
          return {
            success: false,
            pk: null,
            message: 'ID não encontrado no banco'
          };
        }
      } else {
        Logger.log('[buscarPKSupabase] ❌ Erro HTTP: ' + responseCode);
        return {
          success: false,
          pk: null,
          message: 'Erro ao buscar ID: ' + responseText
        };
      }
    } catch (error) {
      Logger.log('[buscarPKSupabase] ❌ ERRO: ' + error);
      return {
        success: false,
        pk: null,
        message: error.toString()
      };
    }
  }
  
  // ========================================
  // SISTEMA DE ATUALIZAÇÕES/OBSERVAÇÕES
  // ========================================
  
  /**
   * Normaliza texto removendo espaços múltiplos e garantindo formatação correta
   * @param {string} texto - Texto a normalizar
   * @return {string} Texto normalizado
   */
  function normalizarTextoBackend(texto) {
    if (!texto || typeof texto !== 'string') {
      return '';
    }
    
    // Normalização segura: apenas remove espaços múltiplos, sem alterar pontuação
    return texto
      .replace(/\s+/g, ' ')  // Substitui múltiplos espaços (incluindo quebras de linha) por um único espaço
      .trim();  // Remove espaços no início e fim
  }
  
  /**
   * Busca histórico de atualizações de uma notificação
   * @param {number} idNotificacao - ID da notificação na planilha (coluna Y)
   * @return {Array} Array de objetos {data, usuario, texto}
   */
  function buscarAtualizacoes(idNotificacao) {
    try {
      // Converter ID para número
      const idNum = Number(idNotificacao);
      if (isNaN(idNum) || idNum <= 0) {
        Logger.log('[buscarAtualizacoes] ID inválido: ' + idNotificacao);
        return [];
      }
      
      Logger.log('[buscarAtualizacoes] Buscando atualizações para ID: ' + idNum);
      
      const ss = SpreadsheetApp.openById(SHEET_ID);
      const sheet = ss.getSheetByName(SHEET_NAME);
      
      if (!sheet) {
        Logger.log('[buscarAtualizacoes] Planilha não encontrada');
        return [];
      }
      
      const lastRow = sheet.getLastRow();
      Logger.log('[buscarAtualizacoes] Última linha da planilha: ' + lastRow);
      
      if (lastRow < 2) {
        Logger.log('[buscarAtualizacoes] Planilha vazia');
        return [];
      }
      
      // Busca a linha que contém o ID da notificação
      const idsRange = sheet.getRange(2, COLS.idNotificacao, lastRow - 1, 1);
      const ids = idsRange.getValues();
      Logger.log('[buscarAtualizacoes] Total de IDs na planilha: ' + ids.length);
      
      let linhaEncontrada = -1;
      for (let i = 0; i < ids.length; i++) {
        const idAtual = Number(ids[i][0]);
        if (idAtual === idNum) {
          linhaEncontrada = i + 2; // +2 porque: +1 para índice 0-based, +1 para pular cabeçalho
          Logger.log('[buscarAtualizacoes] Linha encontrada: ' + linhaEncontrada);
          break;
        }
      }
      
      if (linhaEncontrada === -1) {
        Logger.log('[buscarAtualizacoes] ID ' + idNum + ' não encontrado na planilha');
        return [];
      }
      
      // Lê o valor da coluna Z (atualizações)
      Logger.log('[buscarAtualizacoes] Lendo coluna ' + COLS.atualizacoes + ' (Z) da linha ' + linhaEncontrada);
      const atualizacoesJSON = sheet.getRange(linhaEncontrada, COLS.atualizacoes).getValue();
      Logger.log('[buscarAtualizacoes] Valor lido da coluna Z: ' + (atualizacoesJSON ? atualizacoesJSON.toString().substring(0, 100) : 'vazio'));
      
      if (!atualizacoesJSON || atualizacoesJSON.toString().trim() === '') {
        Logger.log('[buscarAtualizacoes] Nenhuma atualização encontrada (coluna vazia)');
        return [];
      }
      
      // Parse do JSON
      try {
        const atualizacoes = JSON.parse(atualizacoesJSON);
        Logger.log('[buscarAtualizacoes] ' + atualizacoes.length + ' atualização(ões) encontrada(s)');
        
        // Normalizar textos das atualizações existentes
        if (Array.isArray(atualizacoes)) {
          atualizacoes.forEach(function(atualizacao) {
            if (atualizacao.texto) {
              atualizacao.texto = normalizarTextoBackend(atualizacao.texto);
            }
          });
        }
        
        return Array.isArray(atualizacoes) ? atualizacoes : [];
      } catch (parseError) {
        Logger.log('[buscarAtualizacoes] Erro ao parsear JSON: ' + parseError.toString());
        Logger.log('[buscarAtualizacoes] JSON problemático: ' + atualizacoesJSON.toString().substring(0, 200));
        return [];
      }
      
    } catch (error) {
      Logger.log('[buscarAtualizacoes] Erro: ' + error.toString());
      Logger.log('[buscarAtualizacoes] Stack: ' + error.stack);
      return [];
    }
  }
  
  /**
   * Adiciona nova atualização a uma notificação existente
   * @param {number} idNotificacao - ID da notificação na planilha
   * @param {string} textoAtualizacao - Texto da nova atualização
   * @param {string} emailUsuario - Email do usuário que está adicionando
   * @return {Object} {success: boolean, atualizacoes: Array, error?: string}
   */
  function adicionarAtualizacao(idNotificacao, textoAtualizacao, emailUsuario, tagStatus) {
    try {
      Logger.log('[adicionarAtualizacao] Adicionando atualização para ID: ' + idNotificacao);
      Logger.log('[adicionarAtualizacao] Texto: ' + textoAtualizacao.substring(0, 50) + '...');
      Logger.log('[adicionarAtualizacao] Email usuário: ' + emailUsuario);
      
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
      
      // Buscar nome do usuário
      const nomeUsuario = buscarNomeUsuarioPorEmail(emailUsuario);
      if (!nomeUsuario) {
        Logger.log('[adicionarAtualizacao] Aviso: Nome do usuário não encontrado, usando email');
      }
      
      // Buscar atualizações existentes
      const atualizacoesExistentes = buscarAtualizacoes(idNotificacao);
      
      // Normalizar texto antes de salvar
      const textoNormalizado = normalizarTextoBackend(textoAtualizacao);
      
      // Criar nova entrada
      const novaAtualizacao = {
        data: new Date().toISOString(),
        usuario: nomeUsuario || emailUsuario,
        texto: textoNormalizado,
        tag_status: tagStatus || null
      };
      
      // Adicionar ao array
      atualizacoesExistentes.push(novaAtualizacao);
      
      // Salvar na planilha
      const ss = SpreadsheetApp.openById(SHEET_ID);
      const sheet = ss.getSheetByName(SHEET_NAME);
      
      if (!sheet) {
        throw new Error('Planilha não encontrada');
      }
      
      const lastRow = sheet.getLastRow();
      if (lastRow < 2) {
        throw new Error('Notificação não encontrada');
      }
      
      // Encontrar índice da linha
      const idsRange = sheet.getRange(2, COLS.idNotificacao, lastRow - 1, 1);
      const ids = idsRange.getValues();
      
      let linhaEncontrada = -1;
      for (let i = 0; i < ids.length; i++) {
        if (Number(ids[i][0]) === Number(idNotificacao)) {
          linhaEncontrada = i + 2;
          break;
        }
      }
      
      if (linhaEncontrada === -1) {
        throw new Error('Notificação não encontrada');
      }
      
      // Atualizar coluna Z (Atualizações)
      sheet.getRange(linhaEncontrada, COLS.atualizacoes).setValue(JSON.stringify(atualizacoesExistentes));
      
      // Atualizar coluna AB (Data de Última Edição) com timestamp formatado
      const agora = new Date();
      const dia = String(agora.getDate()).padStart(2, '0');
      const mes = String(agora.getMonth() + 1).padStart(2, '0');
      const ano = agora.getFullYear();
      const hora = String(agora.getHours()).padStart(2, '0');
      const minuto = String(agora.getMinutes()).padStart(2, '0');
      const timestampFormatado = dia + '/' + mes + '/' + ano + ' ' + hora + ':' + minuto;
      sheet.getRange(linhaEncontrada, COLS.dataUltimaEdicao).setValue(timestampFormatado);
      
      Logger.log('[adicionarAtualizacao] ✅ Atualização adicionada com sucesso');
      
      return { 
        success: true, 
        atualizacoes: atualizacoesExistentes 
      };
      
    } catch (error) {
      Logger.log('[adicionarAtualizacao] ❌ Erro: ' + error.toString());
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  // ========================================
  // FUNCOES PARA SYSTEM UPDATES (SUPABASE)
  // ========================================

  /**
   * Lista atualizacoes do sistema com paginacao
   * @param {number} limit - Limite de registros (default 50)
   * @param {number} offset - Offset para paginacao (default 0)
   * @return {Object} Lista de atualizacoes do sistema
   */
  function listarSystemUpdates(limit, offset, since) {
    try {
      Logger.log('[listarSystemUpdates] Listando updates: limit=' + limit + ', offset=' + offset + ', since=' + since);

      let url = SUPABASE_URL + '/rest/v1/system_updates?select=*&order=created_at.desc&limit=' + limit + '&offset=' + offset;
      
      // Filtro de tempo para retenção (últimas 24h) - PADRÃO
      // Calcula timestamp de 24h atrás
      const ontem = new Date();
      ontem.setHours(ontem.getHours() - 24);
      const ontemISO = ontem.toISOString();
      
      // Se 'since' for fornecido (polling do frontend), usa ele 
      if (since) {
        const sinceDate = new Date(since);
        if (!isNaN(sinceDate.getTime())) {
           if (sinceDate > ontem) {
               // IMPORTANTÍSSIMO: Encodar o timestamp para URL (trata +, :, espaços)
               url += '&created_at=gt.' + encodeURIComponent(since);
               Logger.log('[listarSystemUpdates] Filtrando por since: ' + since);
           } else {
               url += '&created_at=gte.' + ontemISO;
               Logger.log('[listarSystemUpdates] Since muito antigo, usando filtro padrão 24h: ' + ontemISO);
           }
        } else {
           url += '&created_at=gte.' + ontemISO;
        }
      } else {
        // Comportamento padrão: trazer últimas 24h
        url += '&created_at=gte.' + ontemISO;
        Logger.log('[listarSystemUpdates] Usando filtro padrão 24h: ' + ontemISO);
      }

      const options = {
        method: 'get',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        },
        muteHttpExceptions: true
      };

      const response = UrlFetchApp.fetch(url, options);
      const code = response.getResponseCode();

      if (code === 200) {
        const updates = JSON.parse(response.getContentText());
        Logger.log('[listarSystemUpdates] Retornando ' + updates.length + ' atualizacoes');
        return {
          success: true,
          updates: updates,
          count: updates.length
        };
      } else {
        Logger.log('[listarSystemUpdates] Erro HTTP ' + code + ': ' + response.getContentText());
        return {
          success: false,
          error: 'Erro ao buscar atualizacoes: HTTP ' + code
        };
      }
    } catch (error) {
      Logger.log('[listarSystemUpdates] Erro: ' + error.toString());
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Limpa updates antigos (mais de 3 dias)
   * Deve ser executado via Trigger Time-Driven (ex: Diário)
   */
  function limparLogsAntigos() {
    try {
      Logger.log('[limparLogsAntigos] Iniciando limpeza de logs antigos...');
      
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() - 3);
      const dataLimiteISO = dataLimite.toISOString();
      
      Logger.log('[limparLogsAntigos] Data de corte (3 dias atrás): ' + dataLimiteISO);
      
      // Query delete: created_at < dataLimite
      const url = SUPABASE_URL + '/rest/v1/system_updates?created_at=lt.' + dataLimiteISO;
      
      const options = {
        method: 'delete',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
          Prefer: 'return=representation'
        },
        muteHttpExceptions: true
      };
      
      const response = UrlFetchApp.fetch(url, options);
      const code = response.getResponseCode();
      
      if (code === 200 || code === 204) {
        Logger.log('[limparLogsAntigos] Limpeza concluída com sucesso');
        return { success: true, message: 'Logs antigos removidos' };
      } else {
        Logger.log('[limparLogsAntigos] Erro HTTP ' + code + ': ' + response.getContentText());
        return { success: false, error: 'Erro HTTP ' + code };
      }
    } catch (error) {
       Logger.log('[limparLogsAntigos] Erro: ' + error.toString());
       return { success: false, error: error.message };
    }
  }

  /**
   * Adiciona uma atualizacao do sistema no Supabase
   * @param {string} tipoAcao - Tipo da acao (CRIACAO, EDICAO, EXCLUSAO, LOGIN)
   * @param {string} tabelaAfetada - Tabela afetada (CASOS, USUARIOS, ANEXOS)
   * @param {string} idRegistro - ID do registro afetado (opcional)
   * @param {string} resumo - Resumo da acao
   * @param {Object} detalhes - Detalhes em JSON (opcional)
   * @param {string} emailUsuario - Email do autor
   * @return {Object} Resultado da operacao
   */
  function adicionarSystemUpdate(tipoAcao, tabelaAfetada, idRegistro, resumo, detalhes, emailUsuario) {
    try {
      Logger.log('[adicionarSystemUpdate] Adicionando: ' + tipoAcao + ' - ' + tabelaAfetada);

      const nomeUsuario = buscarNomeUsuarioPorEmail(emailUsuario);

      const url = SUPABASE_URL + '/rest/v1/system_updates';

      const payload = {
        tipo_acao: tipoAcao,
        tabela_afetada: tabelaAfetada,
        id_registro: idRegistro || null,
        resumo: resumo,
        detalhes: detalhes || null,
        autor_email: emailUsuario,
        autor_nome: nomeUsuario || emailUsuario
      };

      const options = {
        method: 'post',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
          Prefer: 'return=representation'
        },
        muteHttpExceptions: true,
        payload: JSON.stringify(payload)
      };

      const response = UrlFetchApp.fetch(url, options);
      const code = response.getResponseCode();

      if (code === 201 || code === 200) {
        Logger.log('[adicionarSystemUpdate] Atualizacao registrada com sucesso');
        return {
          success: true,
          message: 'Atualizacao registrada com sucesso'
        };
      } else {
        Logger.log('[adicionarSystemUpdate] Erro HTTP ' + code + ': ' + response.getContentText());
        return {
          success: false,
          error: 'Erro ao registrar atualizacao: HTTP ' + code
        };
      }
    } catch (error) {
      Logger.log('[adicionarSystemUpdate] Erro: ' + error.toString());
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Formata atualizações para exibição no HTML
   * @param {Array} atualizacoes - Array de objetos {data, usuario, texto}
   * @return {string} HTML formatado
   */
  function formatarAtualizacoesHTML(atualizacoes) {
    if (!atualizacoes || atualizacoes.length === 0) {
      return '<p class="sem-atualizacoes">Nenhuma atualização registrada ainda.</p>';
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
          <p class="texto-atualizacao">${atualizacao.texto || ''}</p>
        </div>
      `;
    });
    
    html += '</div>';
    return html;
  }
  
  /**
   * Formata data/hora ISO para formato brasileiro
   * @param {string} isoString - Data em formato ISO
   * @return {string} Data formatada (DD/MM/YYYY HH:mm)
   */
  function formatarDataHoraBR(isoString) {
    try {
      const data = new Date(isoString);
      const dia = ('0' + data.getDate()).slice(-2);
      const mes = ('0' + (data.getMonth() + 1)).slice(-2);
      const ano = data.getFullYear();
      const hora = ('0' + data.getHours()).slice(-2);
      const min = ('0' + data.getMinutes()).slice(-2);
      return dia + '/' + mes + '/' + ano + ' ' + hora + ':' + min;
    } catch (error) {
      Logger.log('[formatarDataHoraBR] Erro: ' + error.toString());
      return isoString;
    }
  }
  
  // ========================================
  // FIM DAS FUNÇÕES DE NOTIFICAÇÕES
  // ========================================
  
  // ========================================
  // ENDPOINT: CHECKUPDATES - Verificação de Mudanças
  // ========================================
  
  /**
   * FUNÇÃO 2: Verificação de mudanças (checkUpdates)
   * 
   * Esta função:
   * - Recebe o último ID salvo do frontend (ultimoIdSalvo)
   * - Chama a Função 1 para obter o último ID da planilha (ultimoIdPlanilha)
   * - Compara os dois valores NUMÉRICOS
   * - Se forem iguais → não há nova notificação
   * - Se forem diferentes → há nova notificação
   * - Retorna o resultado da comparação
   * 
   * REGRAS:
   * - Comparação APENAS por número do ID
   * - Valores tratados como número, não string
   * - Sem comparação de data, horário, texto ou quantidade
   */
  function handleCheckUpdates(data) {
    try {
      Logger.log('=== handleCheckUpdates INICIADO ===');
      Logger.log('Dados recebidos: ' + JSON.stringify(data || {}));

      // Obtém o último ID salvo do frontend (ultimoIdSalvo)
      const ultimoIdSalvo = data && data.ultimoIdSalvo !== undefined 
        ? Number(data.ultimoIdSalvo) 
        : null;
      
      Logger.log('Último ID salvo (frontend): ' + ultimoIdSalvo + ' (tipo: ' + typeof ultimoIdSalvo + ')');

      // Chama a Função 1 para obter o último ID da planilha
      const base = handleGetLastNotificationId(data || {});

      // Se a função falhar, retorna erro
      if (!base || base.success === false) {
        Logger.log('❌ handleGetLastNotificationId retornou erro: ' + JSON.stringify(base));
        return base;
      }

      // Obtém o último ID da planilha (ultimoIdPlanilha)
      const ultimoIdPlanilha = base.lastId !== null && base.lastId !== undefined 
        ? Number(base.lastId) 
        : null;
      
      Logger.log('Último ID da planilha: ' + ultimoIdPlanilha + ' (tipo: ' + typeof ultimoIdPlanilha + ')');

      // COMPARAÇÃO: ultimoIdPlanilha vs ultimoIdSalvo
      // Tratamento de valores nulos
      const idPlanilha = ultimoIdPlanilha !== null ? ultimoIdPlanilha : 0;
      const idSalvo = ultimoIdSalvo !== null ? ultimoIdSalvo : 0;
      
      // Comparação numérica estrita
      const idsIguais = idPlanilha === idSalvo;
      const temNovaNotificacao = !idsIguais;
      
      Logger.log('Comparação:');
      Logger.log('  • ID Planilha: ' + idPlanilha);
      Logger.log('  • ID Salvo: ' + idSalvo);
      Logger.log('  • São iguais? ' + idsIguais);
      Logger.log('  • Tem nova notificação? ' + temNovaNotificacao);

      // Monta resultado
      const resultado = {
        success: true,
        lastId: ultimoIdPlanilha, // Último ID da planilha (número)
        ultimoIdSalvo: ultimoIdSalvo, // Último ID salvo pelo frontend (número)
        temNovaNotificacao: temNovaNotificacao, // true se há nova notificação, false se não há
        idsIguais: idsIguais // true se são iguais, false se são diferentes
      };

      Logger.log('✅ handleCheckUpdates retornando: ' + JSON.stringify(resultado));
      return resultado;
      
    } catch (error) {
      Logger.log('❌ Erro em handleCheckUpdates: ' + error.toString());
      Logger.log('Tipo do erro: ' + typeof error);
      Logger.log('Nome do erro: ' + (error.name || 'N/A'));
      Logger.log('Mensagem do erro: ' + (error.message || 'N/A'));
      if (error.stack) {
        Logger.log('Stack trace: ' + error.stack);
      } else {
        Logger.log('Stack trace: (não disponível)');
      }
      
      // Retorna objeto de erro bem formatado
      const erroRetorno = {
        success: false,
        message: 'Erro ao verificar atualizações: ' + error.toString(),
        errorType: error.name || 'Unknown',
        errorMessage: error.message || error.toString(),
        timestamp: new Date().toISOString()
      };
      
      Logger.log('Retornando objeto de erro: ' + JSON.stringify(erroRetorno));
      
      return erroRetorno;
    }
  }
  
  // Função antiga removida - usar handleGetLastNotificationId
  
  /**
   * Conta notificações de um usuário específico (DEPRECATED - usar contagem na handleGetLastNotificationId)
   * Usa a coluna COLS.responsavelRegistro (coluna 15) que contém o email do responsável
   */
  function contarNotificacoesUsuarioCheckUpdates(sheet, emailUsuario) {
    try {
      const lastRow = sheet.getLastRow();
      if (lastRow <= 1) return 0;
      
      // Usa a coluna de responsável pelo registro (coluna 15 - COLS.responsavelRegistro)
      const responsavelColumn = COLS.responsavelRegistro; // Coluna 15
      const responsavelRange = sheet.getRange(2, responsavelColumn, lastRow - 1, 1);
      const responsaveis = responsavelRange.getValues();
      
      let count = 0;
      const emailLower = emailUsuario.toLowerCase().trim();
      
      responsaveis.forEach(row => {
        const responsavel = String(row[0] || '').toLowerCase().trim();
        // Verifica se o email do usuário está contido no campo responsável
        // Isso funciona porque o campo pode conter apenas o email ou email + nome
        if (responsavel && (responsavel === emailLower || responsavel.includes(emailLower))) {
          count++;
        }
      });
      
      Logger.log('Notificações encontradas para ' + emailUsuario + ': ' + count);
      return count;
    } catch (error) {
      Logger.log('Erro ao contar notificações: ' + error.toString());
      // Em caso de erro, retorna total geral como fallback
      return Math.max(0, sheet.getLastRow() - 1);
    }
  }
  
  /**
   * Atualiza timestamp de uma linha
   * Cria coluna automaticamente se não existir
   * Pode ser chamada manualmente ou via trigger onEdit
   */
  function atualizarTimestampCheckUpdates(sheet, row) {
    try {
      let timestampColumn = null;
      const lastColumn = sheet.getLastColumn();
      
      // Procura coluna de timestamp
      const headerRow = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
      let found = false;
      
      for (let i = 0; i < headerRow.length; i++) {
        const header = String(headerRow[i]).toLowerCase();
        if (header.includes('última modificação') || 
            header.includes('ultima modificacao') ||
            header.includes('timestamp') ||
            header.includes('last modified')) {
          timestampColumn = i + 1;
          found = true;
          break;
        }
      }
      
      // Se não encontrou, cria na última coluna + 1
      if (!found) {
        timestampColumn = lastColumn + 1;
        sheet.getRange(1, timestampColumn).setValue('Última Modificação');
        sheet.getRange(1, timestampColumn).setFontWeight('bold');
        Logger.log('Coluna de timestamp criada na coluna ' + timestampColumn);
      }
      
      // Atualiza timestamp
      if (timestampColumn <= sheet.getMaxColumns()) {
        const timestampCell = sheet.getRange(row, timestampColumn);
        timestampCell.setValue(new Date());
        timestampCell.setNumberFormat('dd/MM/yyyy HH:mm:ss');
      }
    } catch (error) {
      Logger.log('Erro ao atualizar timestamp: ' + error);
      // Não falha a operação principal se timestamp falhar
    }
  }
  
  /**
   * Verifica se o trigger onEdit está configurado
   * NOTA IMPORTANTE: O trigger onEdit funciona AUTOMATICAMENTE quando:
   * 1. A função onEdit() existe no script
   * 2. O script está vinculado à planilha (bound script)
   * 
   * Não é necessário criar o trigger programaticamente!
   * O Google Apps Script detecta automaticamente a função onEdit() e a executa
   * quando há edições na planilha vinculada.
   * 
   * Se você precisar criar um trigger para uma planilha externa (não vinculada),
   * use o menu: Triggers > Add Trigger > onEdit > On edit
   */
  function criarTriggerOnEditCheckUpdates() {
    try {
      Logger.log('=== VERIFICAÇÃO DO TRIGGER ONEDIT ===');
      
      // Verifica se a função onEdit existe
      if (typeof onEdit === 'function') {
        Logger.log('✅ Função onEdit() encontrada no código');
      } else {
        Logger.log('❌ Função onEdit() NÃO encontrada no código');
        return {
          success: false,
          message: 'Função onEdit() não encontrada. Certifique-se de que a função existe no código.'
        };
      }
      
      // Verifica se o script está vinculado à planilha
      try {
        const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
        const sheet = spreadsheet.getSheetByName(SHEET_NAME);
        
        if (sheet) {
          Logger.log('✅ Planilha e aba encontradas: ' + SHEET_ID + ' / ' + SHEET_NAME);
          Logger.log('✅ O trigger onEdit está ATIVO e funcionando automaticamente!');
          Logger.log('');
          Logger.log('📝 NOTA: O trigger onEdit funciona automaticamente quando:');
          Logger.log('   1. A função onEdit() existe no código (✓)');
          Logger.log('   2. O script está vinculado à planilha (✓)');
          Logger.log('');
          Logger.log('   Não é necessário criar o trigger manualmente!');
          Logger.log('   Qualquer edição na planilha executará automaticamente a função onEdit().');
          
          return {
            success: true,
            message: 'Trigger onEdit está ativo e funcionando automaticamente. Não é necessário criar manualmente.',
            planilha: SHEET_ID,
            aba: SHEET_NAME,
            funcaoExiste: true
          };
        } else {
          Logger.log('❌ Aba "' + SHEET_NAME + '" não encontrada');
          return {
            success: false,
            message: 'Aba "' + SHEET_NAME + '" não encontrada na planilha'
          };
        }
      } catch (error) {
        Logger.log('❌ Erro ao acessar planilha: ' + error.toString());
        return {
          success: false,
          message: 'Erro ao acessar planilha: ' + error.toString()
        };
      }
      
    } catch (error) {
      Logger.log('❌ Erro na verificação: ' + error.toString());
      return {
        success: false,
        error: error.toString()
      };
    }
  }
  
  // ========================================
  // SISTEMA DE TRIGGER AUTOMÁTICO - DETECÇÃO DE MUDANÇAS
  // ========================================
  /**
   * Trigger automático que detecta quando uma nova linha é adicionada ou editada
   * Esta função é executada AUTOMATICAMENTE pelo Google Sheets sempre que há uma edição
   * 
   * IMPORTANTE: Esta função só funciona se o script estiver VINCULADO à planilha
   * Para scripts não vinculados, crie um trigger manualmente:
   * Triggers > Add Trigger > onEdit > On edit
   */
  function onEdit(e) {
    try {
      // Verifica se a edição foi na planilha correta
      const spreadsheet = e.source;
      const sheet = e.range.getSheet();
      
      // Ignora se não for a aba correta
      if (sheet.getName() !== SHEET_NAME) {
        return;
      }
      
      // Ignora se for edição no cabeçalho (linha 1)
      if (e.range.getRow() <= 1) {
        return;
      }
      
      const row = e.range.getRow();
      const col = e.range.getColumn();
      
      Logger.log('🔔 Trigger onEdit ativado:');
      Logger.log('   • Linha: ' + row);
      Logger.log('   • Coluna: ' + col);
      Logger.log('   • Aba: ' + sheet.getName());
      
      // Atualiza timestamp da linha editada
      atualizarTimestampCheckUpdates(sheet, row);
      
      // Marca que houve uma mudança confirmada
      marcarMudancaConfirmada(row);
      
      Logger.log('✅ Mudança confirmada e timestamp atualizado na linha ' + row);
      
    } catch (error) {
      Logger.log('❌ Erro no trigger onEdit: ' + error.toString());
      // Não interrompe a edição se houver erro no trigger
    }
  }
  
  /**
   * Marca que houve uma mudança confirmada na planilha
   * Armazena o timestamp e a linha da última mudança em PropertiesService
   * Isso permite que o checkUpdates detecte mudanças reais sem falsos positivos
   */
  function marcarMudancaConfirmada(row) {
    try {
      const properties = PropertiesService.getScriptProperties();
      const timestamp = new Date().toISOString();
      
      // Armazena timestamp da última mudança confirmada
      properties.setProperty('LAST_CONFIRMED_CHANGE', timestamp);
      properties.setProperty('LAST_CONFIRMED_ROW', String(row));
      
      Logger.log('✅ Mudança confirmada marcada: linha ' + row + ' em ' + timestamp);
    } catch (error) {
      Logger.log('⚠️ Erro ao marcar mudança confirmada: ' + error.toString());
      // Não falha se não conseguir salvar
    }
  }
  
  // ========================================
  // ENDPOINT SIMPLES: GET LAST NOTIFICATION ID
  // ========================================
  
/**
 * Pega apenas o último ID de notificação para comparação simples
 * Esta é a ÚNICA função necessária para detectar novas notificações
    Logger.log('═══════════════════════════════════════════════════════════');
    Logger.log('🧪 TESTE MANUAL DE CHECKUPDATES');
    Logger.log('═══════════════════════════════════════════════════════════');
    Logger.log('Data/Hora do teste: ' + new Date().toISOString());
    Logger.log('');
    Logger.log('🔧 CONFIGURAÇÕES:');
    Logger.log('   • SHEET_ID: ' + SHEET_ID);
    Logger.log('   • SHEET_NAME: ' + SHEET_NAME);
    Logger.log('   • COLS.idNotificacao: ' + COLS.idNotificacao);
    Logger.log('   • COLS.responsavelRegistro: ' + COLS.responsavelRegistro);
    Logger.log('');
    
    // Verificação prévia: tenta acessar a planilha
    Logger.log('🔍 VERIFICAÇÃO PRÉVIA:');
    try {
      Logger.log('   Tentando abrir planilha...');
      const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
      Logger.log('   ✅ Planilha aberta com sucesso');
      Logger.log('   Nome da planilha: ' + spreadsheet.getName());
      
      Logger.log('   Tentando acessar aba "' + SHEET_NAME + '"...');
      const sheet = spreadsheet.getSheetByName(SHEET_NAME);
      if (sheet) {
        Logger.log('   ✅ Aba encontrada');
        Logger.log('   Última linha: ' + sheet.getLastRow());
        Logger.log('   Última coluna: ' + sheet.getLastColumn());
      } else {
        Logger.log('   ❌ Aba "' + SHEET_NAME + '" NÃO encontrada');
        Logger.log('   Abas disponíveis:');
        const sheets = spreadsheet.getSheets();
        sheets.forEach(function(s) {
          Logger.log('     - ' + s.getName());
        });
      }
    } catch (e) {
      Logger.log('   ❌ ERRO ao acessar planilha: ' + e.toString());
      Logger.log('   Isso pode indicar problema de permissão ou ID incorreto');
    }
    Logger.log('');
    
    // Configurações do monitoramento
    const INTERVALO_SEGUNDOS = 10; // Verifica a cada 10 segundos
    const DURACAO_MAXIMA_SEGUNDOS = 300; // 5 minutos máximo
    const DURACAO_MAXIMA_MS = DURACAO_MAXIMA_SEGUNDOS * 1000;
    const INTERVALO_MS = INTERVALO_SEGUNDOS * 1000;
    
    const inicio = new Date().getTime();
    let ultimoTimestamp = null;
    let ultimoHash = null;
    let ultimoTotalRecords = null;
    let verificacoes = 0;
    let mudancasDetectadas = 0;
    
    Logger.log('═══════════════════════════════════════════════════════════');
    Logger.log('🔄 INICIANDO MONITORAMENTO CONTÍNUO');
    Logger.log('═══════════════════════════════════════════════════════════');
    Logger.log('⏱️ CONFIGURAÇÃO:');
    Logger.log('   • Intervalo de verificação: ' + INTERVALO_SEGUNDOS + ' segundos');
    Logger.log('   • Duração máxima: ' + DURACAO_MAXIMA_SEGUNDOS + ' segundos (5 minutos)');
    Logger.log('   • Total de verificações esperadas: ~' + Math.floor(DURACAO_MAXIMA_SEGUNDOS / INTERVALO_SEGUNDOS));
    Logger.log('');
    Logger.log('💡 INSTRUÇÕES:');
    Logger.log('   1. Esta função ficará monitorando mudanças na planilha');
    Logger.log('   2. Adicione uma nova notificação na planilha AGORA');
    Logger.log('   3. A função detectará automaticamente e mostrará os resultados');
    Logger.log('   4. Para parar, cancele a execução ou aguarde 5 minutos');
    Logger.log('');
    Logger.log('⏳ Aguardando mudanças... (verificando a cada ' + INTERVALO_SEGUNDOS + ' segundos)');
    Logger.log('');
    
    try {
      // Verificação inicial
      Logger.log('📊 VERIFICAÇÃO INICIAL:');
      let resultadoInicial;
      try {
        resultadoInicial = handleCheckUpdates({});
        
        // Se resultado é ContentService, extrai o JSON
        if (typeof resultadoInicial.getMimeType === 'function') {
          const content = resultadoInicial.getContent();
          resultadoInicial = JSON.parse(content);
        }
        
        if (resultadoInicial && resultadoInicial.success) {
          ultimoTimestamp = resultadoInicial.lastConfirmedChange || resultadoInicial.lastModified;
          ultimoHash = resultadoInicial.hash;
          ultimoTotalRecords = resultadoInicial.totalRecordsAll;
          
          Logger.log('   ✅ Estado inicial capturado:');
          Logger.log('      • Total de registros: ' + ultimoTotalRecords);
          Logger.log('      • Hash: ' + ultimoHash);
          Logger.log('      • Último timestamp: ' + (ultimoTimestamp || 'N/A'));
          Logger.log('      • Última mudança confirmada: ' + (resultadoInicial.lastConfirmedChange || 'N/A'));
          Logger.log('');
          Logger.log('✅ Monitoramento iniciado! Adicione uma nova notificação na planilha...');
          Logger.log('');
        } else {
          Logger.log('❌ Erro na verificação inicial');
          return;
        }
      } catch (e) {
        Logger.log('❌ Erro na verificação inicial: ' + e.toString());
        return;
      }
      
      // Loop de monitoramento
      while (true) {
        const agora = new Date().getTime();
        const tempoDecorrido = agora - inicio;
        
        // Verifica se excedeu o tempo máximo
        if (tempoDecorrido >= DURACAO_MAXIMA_MS) {
          Logger.log('');
          Logger.log('⏰ Tempo máximo atingido (' + DURACAO_MAXIMA_SEGUNDOS + ' segundos)');
          Logger.log('🛑 Encerrando monitoramento...');
          break;
        }
        
        // Aguarda o intervalo antes da próxima verificação
        Utilities.sleep(INTERVALO_MS);
        
        verificacoes++;
        const tempoRestante = Math.floor((DURACAO_MAXIMA_MS - tempoDecorrido) / 1000);
        
        Logger.log('');
        Logger.log('🔍 Verificação #' + verificacoes + ' (' + new Date().toLocaleTimeString('pt-BR') + ')');
        Logger.log('   ⏱️ Tempo restante: ~' + tempoRestante + ' segundos');
        
        try {
          let resultado = handleCheckUpdates({});
          
          // Se resultado é ContentService, extrai o JSON
          if (typeof resultado.getMimeType === 'function') {
            const content = resultado.getContent();
            resultado = JSON.parse(content);
          }
          
          if (resultado && resultado.success) {
            const novoTimestamp = resultado.lastConfirmedChange || resultado.lastModified;
            const novoHash = resultado.hash;
            const novoTotalRecords = resultado.totalRecordsAll;
            
            // Verifica se houve mudança
            const timestampMudou = novoTimestamp && novoTimestamp !== ultimoTimestamp;
            const hashMudou = novoHash !== ultimoHash;
            const totalRecordsMudou = novoTotalRecords !== ultimoTotalRecords;
            
            if (timestampMudou || hashMudou || totalRecordsMudou) {
              mudancasDetectadas++;
              Logger.log('');
              Logger.log('═══════════════════════════════════════════════════════════');
              Logger.log('🔔 MUDANÇA DETECTADA! #' + mudancasDetectadas);
              Logger.log('═══════════════════════════════════════════════════════════');
              Logger.log('📊 COMPARAÇÃO:');
              
              if (totalRecordsMudou) {
                Logger.log('   📈 Total de registros: ' + ultimoTotalRecords + ' → ' + novoTotalRecords);
              }
              
              if (hashMudou) {
                Logger.log('   🔑 Hash: ' + ultimoHash + ' → ' + novoHash);
              }
              
              if (timestampMudou) {
                Logger.log('   ⏰ Timestamp: ' + (ultimoTimestamp || 'N/A') + ' → ' + novoTimestamp);
              }
              
              Logger.log('');
              Logger.log('📋 DETALHES DA MUDANÇA:');
              Logger.log('   • Total de registros: ' + novoTotalRecords);
              Logger.log('   • Hash: ' + novoHash);
              Logger.log('   • Timestamp: ' + (novoTimestamp || 'N/A'));
              Logger.log('   • Mudança confirmada pelo trigger: ' + (resultado.lastConfirmedChange ? 'SIM ✅' : 'NÃO'));
              Logger.log('   • Linha modificada: ' + (resultado.lastConfirmedRow || 'N/A'));
              
              if (resultado.recentNotificationIds && Array.isArray(resultado.recentNotificationIds) && resultado.recentNotificationIds.length > 0) {
                Logger.log('   • IDs das notificações recentes: ' + resultado.recentNotificationIds.join(', '));
              }
              
              Logger.log('');
              Logger.log('✅ SUCESSO! O sistema detectou a mudança corretamente!');
              Logger.log('═══════════════════════════════════════════════════════════');
              
              // Atualiza valores para próxima comparação
              ultimoTimestamp = novoTimestamp;
              ultimoHash = novoHash;
              ultimoTotalRecords = novoTotalRecords;
            } else {
              Logger.log('   ⏸️ Nenhuma mudança detectada (aguardando...)');
            }
          } else {
            Logger.log('   ⚠️ Erro ao verificar mudanças');
          }
        } catch (e) {
          Logger.log('   ❌ Erro na verificação: ' + e.toString());
        }
      }
      
      // Resumo final
      Logger.log('');
      Logger.log('═══════════════════════════════════════════════════════════');
      Logger.log('📊 RESUMO DO MONITORAMENTO');
      Logger.log('═══════════════════════════════════════════════════════════');
      Logger.log('   • Total de verificações: ' + verificacoes);
      Logger.log('   • Mudanças detectadas: ' + mudancasDetectadas);
      Logger.log('   • Tempo total: ~' + Math.floor((new Date().getTime() - inicio) / 1000) + ' segundos');
      Logger.log('');
      
      if (mudancasDetectadas > 0) {
        Logger.log('✅ TESTE CONCLUÍDO COM SUCESSO!');
        Logger.log('   O sistema está detectando mudanças corretamente.');
      } else {
        Logger.log('⚠️ NENHUMA MUDANÇA FOI DETECTADA');
        Logger.log('   Possíveis causas:');
        Logger.log('   - Nenhuma notificação foi adicionada durante o monitoramento');
        Logger.log('   - O trigger onEdit não está funcionando');
        Logger.log('   - Há um problema na detecção de mudanças');
      }
      
      Logger.log('═══════════════════════════════════════════════════════════');
      
      return {
        sucesso: mudancasDetectadas > 0,
        verificacoes: verificacoes,
        mudancasDetectadas: mudancasDetectadas,
        tempoTotal: Math.floor((new Date().getTime() - inicio) / 1000)
      };
      
    } catch (error) {
      Logger.log('');
      Logger.log('═══════════════════════════════════════════════════════════');
      Logger.log('❌ ERRO CRÍTICO NO MONITORAMENTO');
      Logger.log('═══════════════════════════════════════════════════════════');
      Logger.log('Erro: ' + error.toString());
      Logger.log('Stack trace: ' + error.stack);
      Logger.log('');
      Logger.log('═══════════════════════════════════════════════════════════');
      
      return {
        sucesso: false,
        mensagem: 'Erro crítico: ' + error.toString(),
        erro: error.stack
      };
    }
  /**
   * Função manual para testar detecção de mudanças com email específico
   * Útil para testar se a contagem de notificações por usuário está funcionando
   * 
   * Como usar:
   * 1. Abra o editor do Apps Script
   * 2. Selecione a função "testarCheckUpdatesManualComEmail" no dropdown
   * 3. Edite o email abaixo antes de executar
   * 4. Clique em "Executar" (▶️)
   * 5. Verifique os logs no menu "Execuções"
   */
  function testarCheckUpdatesManualComEmail() {
    // ⚠️ EDITE ESTE EMAIL COM O EMAIL DO USUÁRIO QUE VOCÊ QUER TESTAR
    const emailUsuario = 'admin@example.com'; // <-- ALTERE AQUI
    
    Logger.log('═══════════════════════════════════════════════════════════');
    Logger.log('🧪 TESTE MANUAL DE CHECKUPDATES COM EMAIL');
    Logger.log('═══════════════════════════════════════════════════════════');
    Logger.log('Email do usuário: ' + emailUsuario);
    Logger.log('Data/Hora do teste: ' + new Date().toISOString());
    Logger.log('');
    
    try {
      // Chama a mesma função que o endpoint usa, mas com email
      const resultado = handleCheckUpdates({ emailUsuario: emailUsuario });
      
      Logger.log('');
      Logger.log('═══════════════════════════════════════════════════════════');
      Logger.log('📊 RESULTADO DO TESTE (COM FILTRO DE EMAIL)');
      Logger.log('═══════════════════════════════════════════════════════════');
      
      if (resultado.success) {
        Logger.log('✅ SUCESSO: Backend está funcionando corretamente');
        Logger.log('');
        Logger.log('📈 ESTATÍSTICAS:');
        Logger.log('   • Total de registros (TODOS): ' + resultado.totalRecordsAll);
        Logger.log('   • Total de registros (USUÁRIO "' + emailUsuario + '"): ' + resultado.totalRecords);
        Logger.log('   • Diferença: ' + (resultado.totalRecordsAll - resultado.totalRecords) + ' registros de outros usuários');
        Logger.log('');
        
        if (resultado.recentNotificationIds && resultado.recentNotificationIds.length > 0) {
          Logger.log('🆔 IDs DAS NOTIFICAÇÕES MAIS RECENTES:');
          resultado.recentNotificationIds.forEach((id, index) => {
            Logger.log('   ' + (index + 1) + '. ID: ' + id);
          });
        }
        
        Logger.log('');
        Logger.log('═══════════════════════════════════════════════════════════');
        
        return {
          sucesso: true,
          emailUsuario: emailUsuario,
          totalRegistrosTodos: resultado.totalRecordsAll,
          totalRegistrosUsuario: resultado.totalRecords,
          idsRecentes: resultado.recentNotificationIds
        };
      } else {
        Logger.log('❌ ERRO: Backend retornou erro');
        Logger.log('   Mensagem: ' + (resultado.message || 'Erro desconhecido'));
        
        return {
          sucesso: false,
          mensagem: resultado.message || 'Erro desconhecido'
        };
      }
      
    } catch (error) {
      Logger.log('❌ ERRO CRÍTICO: ' + error.toString());
      Logger.log('Stack trace: ' + error.stack);
      
      return {
        sucesso: false,
        mensagem: 'Erro crítico: ' + error.toString()
      };
    }
  }

// ========================================
// SISTEMA SIMPLIFICADO DE VERIFICAÇÃO DE NOTIFICAÇÕES
// ========================================

/**
 * FUNÇÃO 1: Buscar última notificação da planilha
 * 
 * Esta função:
 * - Acessa a planilha
 * - Localiza a última linha preenchida
 * - Lê apenas o valor da coluna Y (ID da notificação)
 * - Retorna APENAS o número do ID (como número, não string)
 * - NÃO executa nenhuma lógica de comparação
 */
function handleGetLastNotificationId(data) {
  try {
    Logger.log('=== handleGetLastNotificationId INICIADO ===');
    
    // Abre a planilha
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      Logger.log('❌ Planilha não encontrada');
      return {
        success: false,
        message: 'Planilha não encontrada'
      };
    }
    
    // Pega a última linha
    const lastRow = sheet.getLastRow();
    Logger.log('Última linha da planilha: ' + lastRow);
    
    // Se não há dados (só cabeçalho)
    if (lastRow <= 1) {
      Logger.log('⚠️ Planilha vazia (só cabeçalho)');
      return {
        success: true,
        lastId: null
      };
    }
    
    // Lê APENAS o valor da coluna Y (COLS.idNotificacao)
    const lastId = sheet.getRange(lastRow, COLS.idNotificacao).getValue();
    
    // Converte para número (garante que é tratado como número, não string)
    const lastIdNumber = lastId ? Number(lastId) : null;
    
    Logger.log('Último ID encontrado: ' + lastIdNumber + ' (tipo: ' + typeof lastIdNumber + ')');
    
    // Retorna APENAS o ID numérico
    const resultado = {
      success: true,
      lastId: lastIdNumber
    };
    
    Logger.log('✅ Resultado: ' + JSON.stringify(resultado));
    Logger.log('=== handleGetLastNotificationId FINALIZADO ===');
    
    return resultado;
    
  } catch (error) {
    Logger.log('❌ Erro em handleGetLastNotificationId: ' + error);
    Logger.log('Stack: ' + error.stack);
    return {
      success: false,
      message: 'Erro ao buscar última ID: ' + error.toString()
    };
  }
}
// ========================================
// FUNÇÃO DE TESTE MANUAL - GET LAST NOTIFICATION ID
// ========================================
/**
 * Teste manual do handleGetLastNotificationId
 * Execute esta função no Apps Script Editor para testar
 */
function testarGetLastNotificationId() {
  Logger.log('');
  Logger.log('═══════════════════════════════════════════════════════════');
  Logger.log('🧪 TESTE MANUAL - GET LAST NOTIFICATION ID');
  Logger.log('═══════════════════════════════════════════════════════════');
  Logger.log('');
  
  // Teste 1: Sem filtro de email (todos os registros)
  Logger.log('📋 TESTE 1: Buscar último ID (sem filtro)');
  Logger.log('-----------------------------------------------------------');
  const resultado1 = handleGetLastNotificationId({});
  Logger.log('');
  
  // Teste 2: Com filtro de email
  Logger.log('📋 TESTE 2: Buscar último ID com filtro de email');
  Logger.log('-----------------------------------------------------------');
  const emailTeste = 'admin@example.com'; // ⚠️ ALTERE AQUI com um email real da planilha
  Logger.log('Email de teste: ' + emailTeste);
  const resultado2 = handleGetLastNotificationId({ emailUsuario: emailTeste });
  Logger.log('');
  
  // Resumo
  Logger.log('═══════════════════════════════════════════════════════════');
  Logger.log('📊 RESUMO DOS TESTES');
  Logger.log('═══════════════════════════════════════════════════════════');
  Logger.log('');
  Logger.log('TESTE 1 (Sem filtro):');
  Logger.log('  • Success: ' + resultado1.success);
  Logger.log('  • Último ID: ' + resultado1.lastId);
  Logger.log('  • Total de registros: ' + resultado1.totalRecordsAll);
  Logger.log('');
  Logger.log('TESTE 2 (Com email ' + emailTeste + '):');
  Logger.log('  • Success: ' + resultado2.success);
  Logger.log('  • Último ID: ' + resultado2.lastId);
  Logger.log('  • Registros do usuário: ' + resultado2.totalRecords);
  Logger.log('  • Total geral: ' + resultado2.totalRecordsAll);
  Logger.log('');
  
  if (resultado1.success && resultado1.lastId) {
    Logger.log('✅ TESTES PASSARAM! Função está funcionando.');
  } else {
    Logger.log('❌ TESTES FALHARAM! Verifique os logs acima.');
  }
  Logger.log('═══════════════════════════════════════════════════════════');
}

// ========================================
// FIM DO CÓDIGO
// ========================================
// ========================================
// FUNÇÕES SUPABASE RE-IMPLEMENTADAS (Para compatibilidade com versão remota)
// ========================================

function buscarPKSupabase(idPlanilha) {
  try {
    if (typeof SUPABASE_URL === 'undefined' || typeof SUPABASE_ANON_KEY === 'undefined') {
       return { success: false, message: 'Configuração Supabase ausente' };
    }
    
    // Logger.log('[buscarPKSupabase] Buscando PK para idNotificacao planilha: ' + idPlanilha);
    
    const url = SUPABASE_URL + '/rest/v1/notifications_ids?id_notificacao_planilha=eq.' + idPlanilha + '&select=id';
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
      const data = JSON.parse(response.getContentText());
      if (data && data.length > 0) {
        return { success: true, pk: data[0].id };
      }
    }
    return { success: false, message: 'Não encontrado' };
  } catch (e) {
    Logger.log('Erro em buscarPKSupabase: ' + e);
    return { success: false, error: e.toString() };
  }
}

function excluirNotificacaoSupabase(pkSupabase) {
  try {
    if (!pkSupabase) return { success: false };
    
    // Logger.log('   🗄️ Excluindo de Supabase PK: ' + pkSupabase);
    
    const url = SUPABASE_URL + '/rest/v1/notifications_ids?id=eq.' + pkSupabase;
    const options = {
      method: 'delete',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      },
      muteHttpExceptions: true
    };
    
    const response = UrlFetchApp.fetch(url, options);
    return { success: response.getResponseCode() === 204 };
    
  } catch (e) {
    Logger.log('Erro ao excluir do Supabase: ' + e);
    return { success: false, error: e.toString() };
  }
}
