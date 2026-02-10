# ⚡ GUIA RÁPIDO - SISTEMA DE MONITORAMENTO

## 🚀 Setup em 5 Minutos

### 1. Copiar Arquivo
- O arquivo `Code-Monitoramento.gs` já está criado em seu backend

### 2. Integrar no Code.gs
**Status:** ✅ JÁ FEITO - Os cases foram adicionados ao `doPost()`

```javascript
case 'monitorar':
  Logger.log('Executando: iniciarMonitoramento()');
  resultado = iniciarMonitoramento();
  
case 'statusMonitor':
  Logger.log('Executando: obterStatusMonitoramento()');
  resultado = obterStatusMonitoramento();
```

### 3. Executar Inicialização (UMA VEZ)

No Google Apps Script Editor:

```
1. Abra: Code.gs (ou qualquer arquivo .gs do seu projeto)
2. No dropdown de funções (à direita de ▶️), selecione: iniciarMonitoramento
3. Clique em ▶️ (Executar)
4. Verifique os logs (Ctrl+Enter)
```

**Logs esperados:**
```
🚀 INICIANDO SISTEMA DE MONITORAMENTO
✅ MONITORAMENTO INICIADO COM SUCESSO!
Registros salvos: X
Último ID: NOT001 (ou o ID do seu último registro)
```

### 4. Criar Trigger Time-Based

No Google Apps Script Editor:

```
1. Clique em ⏰ (Triggers) no painel esquerdo
2. Clique em "Add Trigger" (botão azul)
3. Configure:
   - Function to run: monitorarAlteracoes
   - Event source: Time-driven
   - Type: Minutes timer
   - Interval: Every 1 minute (ou 5 minutos)
4. Clique em "Save"
```

### 5. Pronto! ✅

O sistema agora está:
- ✅ Salvando registros localmente
- ✅ Comparando IDs periodicamente
- ✅ Pronto para disparar notificações

---

## 📝 Comandos Úteis

### Verificar Status
```javascript
obterStatusMonitoramento()
```

Output esperado:
```
📊 STATUS DO MONITORAMENTO
🔴 Status: ✅ ATIVO
📌 Último ID: NOT005
📋 Total de Registros Salvos: 5
📊 Total de Atualizações: 2
⏰ Última Verificação: 2025-01-15T14:30:00Z
```

### Desativar Temporariamente
```javascript
desativarMonitoramento()
```

### Reativar
```javascript
ativarMonitoramento()
```

### Testar Tudo
```javascript
testarMonitoramentoCompleto()
```

---

## 🔔 Customizar Notificações

No arquivo `Code-Monitoramento.gs`, procure a função `dispararNotificacao()` (linha ~530) e adicione seu código:

```javascript
function dispararNotificacao(registro, novoID) {
  try {
    Logger.log('📢 Notificação Disparada: ' + novoID);
    
    // ===== ADICIONE AQUI =====
    
    // Opção 1: Email
    GmailApp.sendEmail('seu-email@gmail.com', 
      'Novo registro: ' + registro.nome, 
      'ID: ' + novoID);
    
    // Opção 2: Slack Webhook
    UrlFetchApp.fetch('https://hooks.slack.com/seu-webhook', {
      method: 'post',
      payload: JSON.stringify({
        text: '🎉 Novo registro: ' + registro.nome + ' (ID: ' + novoID + ')'
      })
    });
    
    // ========================
    
    return { success: true };
  } catch (error) {
    Logger.log('Erro: ' + error);
    return { success: false };
  }
}
```

---

## 🧪 Teste Rápido

1. **Adicione um novo registro na planilha** com um ID único (coluna Y)

2. **Aguarde** 1-5 minutos (dependendo do intervalo do trigger)

3. **Verifique o status:**
   ```javascript
   obterStatusMonitoramento()
   ```

4. **Procure por:**
   - `Total de Atualizações: 1` (aumentou de 0)
   - `Último ID: [SEU_NOVO_ID]` (mudou para o ID do novo registro)

---

## ✅ Checklist de Implementação

- [ ] Arquivo `Code-Monitoramento.gs` criado
- [ ] Cases adicionados ao `doPost()` em `Code.gs`
- [ ] Função `iniciarMonitoramento()` executada
- [ ] Trigger time-based criado para `monitorarAlteracoes()`
- [ ] Função `dispararNotificacao()` customizada
- [ ] Teste com novo registro realizado
- [ ] Logs verificados

---

## 📊 Dados Armazenados

O sistema armazena em `PropertiesService` (Google App Scripts Storage):

```
MONITOR_LAST_ID         → "NOT005"
MONITOR_ALL_RECORDS     → [{ id, nome, data, ... }, ...]
MONITOR_LAST_CHECK      → "2025-01-15T14:30:00Z"
MONITOR_UPDATE_COUNT    → "3"
MONITOR_ENABLED         → "true"
```

Limite: 10 MB (mais que suficiente para 1000+ registros)

---

## 🆘 Problemas Comuns

| Problema | Solução |
|----------|---------|
| "Não detecta mudanças" | Execute `iniciarMonitoramento()` novamente |
| "Trigger não roda" | Verifique em Triggers se está criado e ativo |
| "Permission denied" | Execute qualquer função manualmente (vai pedir permissão) |
| "Último ID não atualiza" | Verifique se o novo registro tem ID diferente na coluna Y |
| "Logs vazios" | Clique em "▶️ Executar" manualmente, não de F5 |

---

## 📞 Referência Rápida

**Arquivo Principal:** `Code-Monitoramento.gs`
**Integração:** `Code.gs` (doPost, adicionado)
**Documentação Completa:** `IMPLEMENTACAO-MONITORAMENTO.md`
**Configuração:** Google Apps Script > Triggers

---

**Status:** ✅ Pronto para Usar
