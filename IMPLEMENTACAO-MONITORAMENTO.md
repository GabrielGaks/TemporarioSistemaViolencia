# 📊 SISTEMA DE MONITORAMENTO DE PLANILHA

## 🎯 Visão Geral

Esse sistema implementa um **monitoramento contínuo e robusto** da planilha de notificações de violência escolar. Ele detecta automaticamente quando novos registros são adicionados e dispara notificações.

### Comportamento Esperado:
✅ Todos os registros salvos localmente (sem recarregar constantemente)
✅ Último ID armazenado separadamente para comparação
✅ Verificação periódica (a cada minuto, ou intervalo configurado)
✅ Comparação eficiente de IDs para detecção de mudanças
✅ Disparo automático de notificações quando detectar alterações
✅ Novo ID salvo após notificação para futuras comparações

---

## 📁 Arquivos

### Arquivos Criados:
- **`Code-Monitoramento.gs`** - Sistema completo de monitoramento

### Arquivos Existentes (sem alteração):
- `Code.gs` - Script principal
- `Code-CheckUpdates.gs` - Verificação de atualizações
- `Code-Supabase.gs` - Integração Supabase

---

## 🚀 GUIA DE INSTALAÇÃO

### Passo 1: Adicionar Integração no Code.gs

No seu arquivo `Code.gs`, encontre a função `doPost()` e adicione um novo case:

```javascript
function doPost(e) {
  try {
    let dados;
    
    // ... código existente de parsing ...
    
    switch(action) {
      // ... seus outros cases ...
      
      // ADICIONAR ESTE NOVO CASE:
      case 'monitorar':
        Logger.log('Executando: iniciarMonitoramento()');
        resultado = iniciarMonitoramento();
        return ContentService.createTextOutput(JSON.stringify(resultado))
          .setMimeType(ContentService.MimeType.JSON);
      
      // ... resto do código ...
    }
  } catch (error) {
    // ... tratamento de erro ...
  }
}
```

**Localização no Code.gs:**
- Abra: `FormularioRegistroV2/backend/Code.gs`
- Procure pela função `doPost` (aproximadamente linha 333)
- Localize o `switch(action)`
- Adicione o novo case antes do `default`

### Passo 2: Criar Trigger Time-Based

1. Abra o Google Apps Script Editor
2. Clique em **Triggers** (ícone de relógio) no painel esquerdo
3. Clique em **Add Trigger**
4. Configure conforme abaixo:

```
Function to run: monitorarAlteracoes
Which deployment should be executed?: Head
Select event source: Time-driven
Select type of time based trigger: Minutes timer
Select minute interval: Every 1 minute
```

**Opções de intervalo:**
- **Every 1 minute** - Muito sensível (recomendado para testes)
- **Every 5 minutes** - Ideal para produção
- **Every 30 minutes** - Para uso leve
- **Every hour** - Menor carga no servidor

### Passo 3: Inicializar Sistema (executar uma única vez)

1. No editor do Apps Script, selecione a função **`iniciarMonitoramento`** no dropdown
2. Clique em **Executar** (▶️)
3. Aguarde a conclusão
4. Verifique os logs para confirmar inicialização

**Logs esperados:**
```
🚀 INICIANDO SISTEMA DE MONITORAMENTO
✅ MONITORAMENTO INICIADO COM SUCESSO!
Registros salvos: X
Último ID: [ID_AQUI]
```

---

## 🔄 Como Funciona

### Fluxo de Operação:

```
┌─────────────────────────────────────────────────┐
│ Trigger Time-Based (a cada minuto)              │
│ Executa: monitorarAlteracoes()                  │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
      ┌──────────────────────┐
      │ Lê Último ID SALVO   │
      │ Lê Último ID ATUAL   │
      │ Compara...           │
      └──────────────┬───────┘
                     │
         ┌───────────┴───────────┐
         │                       │
    IDs IGUAIS           IDs DIFERENTES ✨
    (Sem mudança)        (Mudança detectada!)
         │                       │
         ▼                       ▼
    ✅ Log          ┌─────────────────────────┐
    "Sem mudanças"  │ 🎉 ALTERAÇÃO DETECTADA! │
                    └────────────┬────────────┘
                                 │
                    ┌────────────┴──────────────┐
                    │                          │
                    ▼                          ▼
          ┌──────────────────┐      ┌──────────────────┐
          │ Salva Novo ID    │      │ Salva Registros  │
          │ Atualiza Storage │      │ Actualiza Local  │
          └──────────────┬───┘      └────────┬─────────┘
                         │                   │
                         └─────────┬─────────┘
                                   │
                                   ▼
                    ┌──────────────────────────┐
                    │ 📧 DISPARA NOTIFICAÇÃO   │
                    │ • Email                  │
                    │ • Webhook                │
                    │ • Dashboard Update       │
                    └──────────────────────────┘
```

### Componentes Principais:

#### 1. **Armazenamento (PropertiesService)**
- `MONITOR_LAST_ID` - Último ID processado
- `MONITOR_ALL_RECORDS` - JSON de todos os registros
- `MONITOR_LAST_CHECK` - Timestamp da última verificação
- `MONITOR_UPDATE_COUNT` - Contador de atualizações
- `MONITOR_ENABLED` - Status do monitoramento

#### 2. **Funções Principais**

| Função | Propósito | Quando Usar |
|--------|-----------|------------|
| `iniciarMonitoramento()` | Configuração inicial | Uma vez, na primeira vez |
| `monitorarAlteracoes()` | Loop de verificação | Trigger time-based (automático) |
| `procesarAlteracao()` | Processa mudança detectada | Automático quando alteração detectada |
| `obterStatusMonitoramento()` | Consultar status | Debug/Admin |
| `desativarMonitoramento()` | Pausar monitoramento | Admin |
| `ativarMonitoramento()` | Retomar monitoramento | Admin |

---

## 🧪 TESTES

### Teste 1: Verificar Inicialização

```javascript
// 1. No editor do Apps Script, execute:
iniciarMonitoramento()

// 2. Verifique os logs esperados:
// ✅ Monitoramento iniciado com sucesso
// ✅ Registros salvos: X
// ✅ Último ID: [ID_AQUI]
```

### Teste 2: Verificar Status

```javascript
// 1. Execute:
obterStatusMonitoramento()

// 2. Você deve ver:
// 📊 STATUS DO MONITORAMENTO
// 🔴 Status: ✅ ATIVO
// 📌 Último ID: [ID_AQUI]
// 📋 Total de Registros Salvos: X
// 📊 Total de Atualizações: 0
```

### Teste 3: Simular Monitoramento

```javascript
// 1. Execute:
monitorarAlteracoes()

// 2. Você deve ver:
// 🔍 VERIFICAÇÃO DE ALTERAÇÕES
// ✅ Sem alterações detectadas
```

### Teste 4: Teste Completo

```javascript
// Execute tudo de uma vez:
testarMonitoramentoCompleto()

// Isso vai:
// 1. Inicializar
// 2. Verificar status inicial
// 3. Simular monitoramento
// 4. Verificar status final
```

---

## 🔧 CUSTOMIZAÇÃO

### Alterar Intervalo de Verificação

Edite no Apps Script:

```javascript
// Triggers > Edit Trigger
Select minute interval: Every 5 minutes  // Mude conforme necessário
```

### Customizar Notificação

No arquivo `Code-Monitoramento.gs`, procure a função `dispararNotificacao()`:

```javascript
function dispararNotificacao(registro, novoID) {
  try {
    // ADICIONAR AQUI:
    
    // Opção 1: Enviar Email
    GmailApp.sendEmail(
      'admin@exemplo.com',
      'Novo registro detectado: ' + registro.nome,
      'ID: ' + novoID + '\nData: ' + registro.data
    );
    
    // Opção 2: Chamar Webhook
    UrlFetchApp.fetch('https://seu-webhook.com/notificacao', {
      method: 'post',
      payload: JSON.stringify({
        tipo: 'novo_registro',
        id: novoID,
        nome: registro.nome
      })
    });
    
    // Opção 3: Atualizar Planilha Admin
    const adminSheet = SpreadsheetApp.openById(ADMIN_SHEET_ID)
      .getSheetByName('Notificacoes');
    adminSheet.appendRow([
      new Date(),
      novoID,
      registro.nome,
      'PROCESSADO'
    ]);
    
    return { success: true };
  } catch (error) {
    Logger.log('Erro: ' + error);
    return { success: false, error: error };
  }
}
```

---

## 📊 ESTRUTURA DOS DADOS ARMAZENADOS

### Registro Salvo
```json
{
  "numeroLinha": 2,
  "id": "NOT001",
  "nome": "João Silva",
  "data": "2025-01-15",
  "idInterno": "0"
}
```

### Status do Sistema
```json
{
  "habilitado": true,
  "ultimoID": "NOT005",
  "totalRegistrosSalvos": 5,
  "totalAtualizacoes": 3,
  "ultimaVerificacao": "2025-01-15T14:30:00Z"
}
```

---

## ⚠️ TROUBLESHOOTING

### Problema: "Monitoramento não está detectando alterações"

**Solução:**
1. Execute `obterStatusMonitoramento()` para verificar status
2. Verifique se o trigger está ativo: **Triggers** (painel esquerdo)
3. Execute `iniciarMonitoramento()` novamente
4. Verifique se há ID na coluna Y (idNotificacao)

### Problema: "Último ID sempre igual"

**Solução:**
1. Verifique se está adicionando novos registros com IDs diferentes
2. Confirme que COLS.idNotificacao = 25 está correto
3. Execute `salvarTodosRegistros(sheet)` manualmente

### Problema: "Trigger não executa"

**Solução:**
1. Verifique se o trigger está criado: **Triggers** (painel)
2. Se não houver, crie um novo com **Add Trigger**
3. Verifique a função: `monitorarAlteracoes`
4. Verifique o tipo: `Time-driven`

### Problema: "Erro de Permission Denied"

**Solução:**
1. O script precisa de permissões para PropertiesService
2. Execute qualquer função manualmente (vai pedir permissão)
3. Clique em "Revisar permissões" > "Aceitar"

---

## 📝 LOGS DO SISTEMA

### Logs Normais
```
🔍 VERIFICAÇÃO DE ALTERAÇÕES - 2025-01-15T14:30:00Z
📌 Último ID SALVO: NOT004
📊 Último ID ATUAL: NOT005
✅ Sem alterações detectadas
```

### Logs com Alteração
```
🔍 VERIFICAÇÃO DE ALTERAÇÕES - 2025-01-15T14:31:00Z
📌 Último ID SALVO: NOT004
📊 Último ID ATUAL: NOT005
🎉 ALTERAÇÃO DETECTADA!
💾 Salvando novo último ID...
✅ Último ID atualizado: NOT005
📊 Total de atualizações detectadas: 1
📧 Disparando notificação de atualização...
✅ Notificação disparada
✅ ALTERAÇÃO PROCESSADA COM SUCESSO
```

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ Copiar o arquivo `Code-Monitoramento.gs`
2. ✅ Adicionar o case no `doPost()` do `Code.gs`
3. ✅ Executar `iniciarMonitoramento()` uma vez
4. ✅ Criar trigger time-based para `monitorarAlteracoes()`
5. ✅ Adicionar lógica de notificação na função `dispararNotificacao()`
6. ✅ Testar com novo registro

---

## 📞 SUPORTE

Se encontrar problemas:
1. Verifique os **Logs** (Ctrl+Enter no Apps Script)
2. Execute as funções de teste manualmente
3. Verifique se o trigger está ativo
4. Confirme que a planilha tem novos registros com IDs únicos

---

**Status:** ✅ Pronto para Uso
**Versão:** 1.0
**Última Atualização:** 2025-01-15
