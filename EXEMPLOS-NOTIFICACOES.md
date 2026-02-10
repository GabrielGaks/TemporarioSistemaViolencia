# 📧 EXEMPLOS DE NOTIFICAÇÃO

Aqui você encontra exemplos prontos para customizar a função `dispararNotificacao()`.

## 📍 Localização

Arquivo: `Code-Monitoramento.gs`
Função: `dispararNotificacao()` (linha ~530)

---

## 1️⃣ EMAIL (Gmail)

```javascript
function dispararNotificacao(registro, novoID) {
  try {
    Logger.log('📢 Notificação via EMAIL disparada: ' + novoID);
    
    // Envia email para administrador
    GmailApp.sendEmail(
      'admin@sua-organizacao.com.br',
      '🎉 Novo Caso de Violência Escolar Registrado - ' + registro.nome,
      `
Olá,

Um novo caso foi registrado no sistema:

═══════════════════════════════════════
Informações do Registro:
═══════════════════════════════════════
ID: ${novoID}
Criança/Estudante: ${registro.nome}
Idade: ${registro.idade}
Data do Registro: ${registro.data}
Gênero: ${registro.genero}
Raça/Cor: ${registro.raca}
Tipo de Violência: ${registro.tipoViolencia}
Encaminhamento: ${registro.encaminhamento}
Instituição: ${registro.cmeiEmef}
Região: ${registro.regiao}
Responsável: ${registro.responsavel}

═══════════════════════════════════════
Acesse o painel para mais detalhes.
═══════════════════════════════════════

Timestamp: ${new Date().toISOString()}
      `
    );
    
    return {
      success: true,
      tipo: 'email',
      destinatario: 'admin@sua-organizacao.com.br',
      horario: new Date().toISOString()
    };
    
  } catch (error) {
    Logger.log('❌ Erro ao enviar email: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}
```

---

## 2️⃣ MULTIPLE EMAILS

```javascript
function dispararNotificacao(registro, novoID) {
  try {
    Logger.log('📢 Notificação para múltiplos emails');
    
    // Lista de emails para notificar
    const emails = [
      'admin@org.com.br',
      'diretor@escola.com.br',
      'psicologoescolar@escola.com.br'
    ];
    
    emails.forEach(email => {
      GmailApp.sendEmail(
        email,
        '🎉 Novo Caso Registrado - ' + registro.nome,
        `Novo registro: ${novoID}\n${registro.nome}\nData: ${registro.data}`
      );
      Logger.log('✅ Email enviado para: ' + email);
    });
    
    return {
      success: true,
      tipo: 'emails_multiplos',
      destinatarios: emails.length,
      horario: new Date().toISOString()
    };
    
  } catch (error) {
    Logger.log('❌ Erro: ' + error.toString());
    return { success: false, error: error.toString() };
  }
}
```

---

## 3️⃣ SLACK WEBHOOK

```javascript
function dispararNotificacao(registro, novoID) {
  try {
    Logger.log('📢 Notificação via SLACK disparada');
    
    // Configure seu Slack Webhook em Slack > Apps > Incoming Webhooks
    const SLACK_WEBHOOK = 'https://hooks.slack.com/services/YOUR/WEBHOOK/URL';
    
    const payload = {
      text: '🎉 Novo Caso de Violência Escolar Registrado!',
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🚨 Novo Registro Detectado'
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: '*ID:*\n' + novoID
            },
            {
              type: 'mrkdwn',
              text: '*Criança/Estudante:*\n' + registro.nome
            },
            {
              type: 'mrkdwn',
              text: '*Idade:*\n' + (registro.idade || 'N/A')
            },
            {
              type: 'mrkdwn',
              text: '*Data:*\n' + registro.data
            },
            {
              type: 'mrkdwn',
              text: '*Tipo de Violência:*\n' + (registro.tipoViolencia || 'N/A')
            },
            {
              type: 'mrkdwn',
              text: '*Instituição:*\n' + (registro.cmeiEmef || 'N/A')
            }
          ]
        },
        {
          type: 'divider'
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '⏰ *Horário:* ' + new Date().toLocaleString('pt-BR')
          }
        }
      ]
    };
    
    const options = {
      method: 'post',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };
    
    const response = UrlFetchApp.fetch(SLACK_WEBHOOK, options);
    Logger.log('✅ Mensagem Slack enviada: ' + response.getContentText());
    
    return {
      success: true,
      tipo: 'slack',
      canal: 'Seu Canal',
      horario: new Date().toISOString()
    };
    
  } catch (error) {
    Logger.log('❌ Erro ao enviar Slack: ' + error.toString());
    return { success: false, error: error.toString() };
  }
}
```

---

## 4️⃣ DISCORD WEBHOOK

```javascript
function dispararNotificacao(registro, novoID) {
  try {
    Logger.log('📢 Notificação via DISCORD disparada');
    
    // Configure seu Discord Webhook em Discord > Server > Webhooks
    const DISCORD_WEBHOOK = 'https://discordapp.com/api/webhooks/YOUR/WEBHOOK';
    
    const payload = {
      embeds: [
        {
          title: '🎉 Novo Caso Registrado!',
          description: 'Um novo caso de violência escolar foi registrado',
          color: 16711680, // Vermelho
          fields: [
            { name: 'ID', value: novoID, inline: true },
            { name: 'Estudante', value: registro.nome, inline: true },
            { name: 'Idade', value: String(registro.idade || 'N/A'), inline: true },
            { name: 'Data', value: String(registro.data || 'N/A'), inline: true },
            { name: 'Tipo de Violência', value: registro.tipoViolencia || 'N/A', inline: false },
            { name: 'Instituição', value: registro.cmeiEmef || 'N/A', inline: false },
            { name: 'Região', value: registro.regiao || 'N/A', inline: false }
          ],
          footer: {
            text: 'NAAM - Sistema de Monitoramento'
          },
          timestamp: new Date().toISOString()
        }
      ]
    };
    
    const options = {
      method: 'post',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };
    
    const response = UrlFetchApp.fetch(DISCORD_WEBHOOK, options);
    Logger.log('✅ Mensagem Discord enviada: ' + response.getResponseCode());
    
    return {
      success: true,
      tipo: 'discord',
      horario: new Date().toISOString()
    };
    
  } catch (error) {
    Logger.log('❌ Erro ao enviar Discord: ' + error.toString());
    return { success: false, error: error.toString() };
  }
}
```

---

## 5️⃣ PLANILHA ADMIN (Registro de Notificações)

```javascript
function dispararNotificacao(registro, novoID) {
  try {
    Logger.log('📢 Registrando notificação na planilha ADMIN');
    
    // ID da planilha ADMIN (crie uma planilha separada para logs)
    const ADMIN_SHEET_ID = 'COLE_O_ID_DA_PLANILHA_ADMIN_AQUI';
    
    const adminSheet = SpreadsheetApp
      .openById(ADMIN_SHEET_ID)
      .getSheetByName('Notificações');
    
    // Adiciona linha com os dados
    adminSheet.appendRow([
      new Date(),                    // A - Horário
      novoID,                        // B - ID Notificação
      registro.nome,                 // C - Criança/Estudante
      registro.idade,                // D - Idade
      registro.tipoViolencia,        // E - Tipo Violência
      registro.encaminhamento,       // F - Encaminhamento
      registro.responsavel,          // G - Responsável
      'PROCESSADO',                  // H - Status
      '',                            // I - Observações
      new Date().toISOString()       // J - Timestamp
    ]);
    
    Logger.log('✅ Notificação registrada na planilha ADMIN');
    
    return {
      success: true,
      tipo: 'planilha_admin',
      planilhaID: ADMIN_SHEET_ID,
      horario: new Date().toISOString()
    };
    
  } catch (error) {
    Logger.log('❌ Erro ao registrar na planilha: ' + error.toString());
    return { success: false, error: error.toString() };
  }
}
```

---

## 6️⃣ DASHBOARD (Atualizar Status)

```javascript
function dispararNotificacao(registro, novoID) {
  try {
    Logger.log('📢 Atualizando Dashboard em tempo real');
    
    // Atualiza a planilha de Dashboard/Estatísticas
    const DASHBOARD_SHEET_ID = 'COLE_O_ID_DO_DASHBOARD_AQUI';
    
    const dashboardSheet = SpreadsheetApp
      .openById(DASHBOARD_SHEET_ID)
      .getSheetByName('Resumo');
    
    // Encontra e atualiza células específicas
    dashboardSheet.getRange('B2').setValue(new Date()); // Última atualização
    
    // Incrementa contador de casos
    const cellContador = dashboardSheet.getRange('B3');
    const valorAtual = cellContador.getValue() || 0;
    cellContador.setValue(valorAtual + 1);
    
    Logger.log('✅ Dashboard atualizado');
    
    return {
      success: true,
      tipo: 'dashboard_update',
      horario: new Date().toISOString()
    };
    
  } catch (error) {
    Logger.log('❌ Erro ao atualizar dashboard: ' + error.toString());
    return { success: false, error: error.toString() };
  }
}
```

---

## 7️⃣ WEBHOOK CUSTOMIZADO (API Externa)

```javascript
function dispararNotificacao(registro, novoID) {
  try {
    Logger.log('📢 Enviando para API externa');
    
    const URL_API = 'https://seu-servidor.com/api/notificacoes';
    
    const payload = {
      tipo: 'novo_caso',
      id: novoID,
      dados: {
        nome: registro.nome,
        idade: registro.idade,
        data: registro.data,
        tipoViolencia: registro.tipoViolencia,
        instituicao: registro.cmeiEmef,
        regiao: registro.regiao,
        responsavel: registro.responsavel
      },
      timestamp: new Date().toISOString()
    };
    
    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer SEU_TOKEN_AQUI'
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };
    
    const response = UrlFetchApp.fetch(URL_API, options);
    const statusCode = response.getResponseCode();
    
    if (statusCode === 200 || statusCode === 201) {
      Logger.log('✅ API respondeu com sucesso: ' + statusCode);
      return {
        success: true,
        tipo: 'webhook',
        statusCode: statusCode,
        horario: new Date().toISOString()
      };
    } else {
      Logger.log('⚠️ API respondeu com: ' + statusCode);
      return {
        success: false,
        tipo: 'webhook',
        statusCode: statusCode,
        erro: response.getContentText()
      };
    }
    
  } catch (error) {
    Logger.log('❌ Erro ao chamar webhook: ' + error.toString());
    return { success: false, error: error.toString() };
  }
}
```

---

## 8️⃣ NOTIFICAÇÃO COMBINADA (Multiple Channels)

```javascript
function dispararNotificacao(registro, novoID) {
  try {
    Logger.log('📢 Enviando notificações em múltiplos canais');
    
    const resultados = {};
    
    // 1. Email
    try {
      GmailApp.sendEmail(
        'admin@org.com.br',
        '🎉 Novo Caso: ' + registro.nome,
        'ID: ' + novoID + '\nData: ' + registro.data
      );
      resultados.email = { success: true };
      Logger.log('✅ Email enviado');
    } catch (e) {
      resultados.email = { success: false, error: e.toString() };
    }
    
    // 2. Slack
    try {
      const slackPayload = {
        text: '🎉 Novo caso: ' + registro.nome + ' (ID: ' + novoID + ')'
      };
      UrlFetchApp.fetch('https://hooks.slack.com/services/YOUR/WEBHOOK', {
        method: 'post',
        payload: JSON.stringify(slackPayload)
      });
      resultados.slack = { success: true };
      Logger.log('✅ Slack notificado');
    } catch (e) {
      resultados.slack = { success: false, error: e.toString() };
    }
    
    // 3. Planilha
    try {
      SpreadsheetApp.openById('ADMIN_SHEET_ID')
        .getSheetByName('Notificações')
        .appendRow([new Date(), novoID, registro.nome]);
      resultados.planilha = { success: true };
      Logger.log('✅ Planilha atualizada');
    } catch (e) {
      resultados.planilha = { success: false, error: e.toString() };
    }
    
    return {
      success: true,
      tipo: 'combinada',
      canais: resultados,
      horario: new Date().toISOString()
    };
    
  } catch (error) {
    Logger.log('❌ Erro geral: ' + error.toString());
    return { success: false, error: error.toString() };
  }
}
```

---

## ⚙️ Dicas de Implementação

### 1. Adicionar Variáveis de Configuração
```javascript
// No início do arquivo Code-Monitoramento.gs
const NOTIFICACAO_CONFIG = {
  EMAIL_ADMIN: 'seu-email@gmail.com',
  SLACK_WEBHOOK: 'https://hooks.slack.com/services/...',
  DISCORD_WEBHOOK: 'https://discordapp.com/api/webhooks/...',
  API_URL: 'https://seu-servidor.com/api',
  API_TOKEN: 'seu-token-aqui'
};
```

### 2. Usar Variáveis Globais
```javascript
// Assim, fica fácil alterar later:
GmailApp.sendEmail(NOTIFICACAO_CONFIG.EMAIL_ADMIN, ...);
UrlFetchApp.fetch(NOTIFICACAO_CONFIG.SLACK_WEBHOOK, ...);
```

### 3. Log Completo
```javascript
Logger.log('📤 Notificação enviada:');
Logger.log('   ID: ' + novoID);
Logger.log('   Tipo: Email');
Logger.log('   Destinatário: admin@org.com.br');
Logger.log('   Status: ✅ Sucesso');
```

---

## 🧪 Teste Local

```javascript
// Cole isso no Editor e execute:
function testarNotificacao() {
  const registroTeste = {
    numeroLinha: 2,
    id: 'NOT001',
    nome: 'Teste de Sistema',
    idade: 10,
    data: '2025-01-15',
    genero: 'M',
    pcd: 'N',
    raca: 'Parda',
    tipoViolencia: 'Física',
    encaminhamento: 'CREAS',
    cmeiEmef: 'EMEF Teste',
    regiao: 'Centro',
    responsavel: 'Admin'
  };
  
  const resultado = dispararNotificacao(registroTeste, 'NOT001-TESTE');
  Logger.log('Resultado: ' + JSON.stringify(resultado));
}
```

---

**Versão:** 1.0
**Última Atualização:** 2025-01-15
