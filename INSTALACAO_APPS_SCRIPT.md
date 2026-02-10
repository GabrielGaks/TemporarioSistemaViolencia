# Instalação do Google Apps Script

## Passo a Passo para Configuração

### 1. Criar Novo Projeto no Google Apps Script

1. Acesse [script.google.com](https://script.google.com)
2. Clique em **"Novo projeto"**
3. Renomeie o projeto para "Sistema de Registro - Casos"

### 2. Configurar o Código

1. **Delete o código padrão** que vem no editor
2. **Cole todo o conteúdo** do arquivo `Code.gs` no editor
3. **Configure as constantes** no início do arquivo:
   ```javascript
   const SPREADSHEET_ID = 'SEU_ID_DA_PLANILHA_AQUI';
   const SHEET_NAME = 'Página1'; // ou o nome da sua aba
   ```

### 3. Obter o ID da Planilha

1. Abra sua planilha do Google Sheets
2. Olhe a URL: `https://docs.google.com/spreadsheets/d/ID_AQUI/edit`
3. Copie o `ID_AQUI` e cole na constante `SPREADSHEET_ID`

### 4. Salvar o Projeto

1. Clique em **"Salvar"** (ícone de disquete) ou pressione `Ctrl+S`
2. Dê um nome ao projeto se ainda não deu

### 5. Implantar como Aplicativo Web

1. Clique em **"Implantar"** > **"Nova implantação"**
2. Clique no ícone de engrenagem ⚙️ ao lado de **"Tipo"**
3. Selecione **"Aplicativo da Web"**
4. Configure:
   - **Descrição**: "Sistema de Registro - Endpoint de Casos"
   - **Executar como**: "Eu"
   - **Quem tem acesso**: "Qualquer pessoa"
5. Clique em **"Implantar"**
6. **Copie a URL** que aparece (será algo como: `https://script.google.com/macros/s/.../exec`)
7. Esta URL deve ser configurada em `config.js` como `APPS_SCRIPT_CASOS`

### 6. Configurar Permissões

1. Na primeira execução, o Google pedirá permissões
2. Clique em **"Revisar permissões"**
3. Selecione sua conta Google
4. Clique em **"Avançado"** > **"Ir para [Nome do Projeto] (não seguro)"**
5. Clique em **"Permitir"**

### 7. (Opcional) Configurar Trigger Automático

Para atualizar timestamps automaticamente quando houver edições:

1. No editor do Apps Script, clique em **"Triggers"** (relógio) no menu lateral
2. Clique em **"+ Adicionar trigger"** (canto inferior direito)
3. Configure:
   - **Escolha qual função executar**: `onEdit`
   - **Escolha qual evento de fonte de execução**: "No editor de planilhas"
   - **Selecione o tipo de evento**: "Ao editar"
   - **Falha na notificação**: "Imediatamente"
4. Clique em **"Salvar"**

**OU** execute a função `criarTriggerOnEdit()` uma vez:
1. Selecione a função `criarTriggerOnEdit` no dropdown
2. Clique em **"Executar"**
3. Autorize as permissões se solicitado

### 8. Testar o Endpoint

Você pode testar o endpoint usando:

```javascript
// No console do navegador ou Postman
fetch('SUA_URL_DO_APPS_SCRIPT', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: 'data=' + encodeURIComponent(JSON.stringify({
    action: 'checkUpdates'
  }))
})
.then(r => r.json())
.then(console.log);
```

Deve retornar algo como:
```json
{
  "success": true,
  "totalRecords": 150,
  "hash": "abc123...",
  "lastModified": "2024-01-15T10:30:00.000Z"
}
```

## Estrutura do Código

O arquivo `Code.gs` contém:

- **Configurações**: IDs e nomes das planilhas
- **doPost/doGet**: Handlers principais de requisições
- **handleCheckUpdates**: Endpoint de verificação de mudanças
- **handleList**: Lista todos os registros
- **handleListarMinhasNotificacoes**: Lista notificações por usuário
- **handleSalvar/Atualizar/Deletar**: CRUD de registros
- **Funções auxiliares**: Timestamp, contagem, etc.

## Funcionalidades Implementadas

✅ **checkUpdates**: Verifica mudanças sem baixar todos os dados
✅ **Timestamp automático**: Atualiza data de modificação
✅ **Hash de verificação**: Compara mudanças eficientemente
✅ **Contagem por usuário**: Retorna contagem específica
✅ **Trigger onEdit**: Atualiza timestamp automaticamente

## Troubleshooting

### Erro: "Planilha não encontrada"
- Verifique se o `SPREADSHEET_ID` está correto
- Verifique se a planilha está compartilhada com a conta do Apps Script

### Erro: "Permissão negada"
- Verifique as permissões do Apps Script
- Certifique-se de que "Executar como: Eu" está configurado

### Trigger não funciona
- Verifique se o trigger foi criado corretamente
- Execute `criarTriggerOnEdit()` manualmente

### Endpoint retorna erro
- Verifique os logs no Apps Script (Ver > Logs de execução)
- Verifique se a ação está sendo enviada corretamente

## Notas Importantes

1. **Segurança**: A URL do Apps Script deve ser mantida em segredo
2. **Performance**: O endpoint `checkUpdates` é otimizado para ser rápido
3. **Timestamp**: A coluna de timestamp é criada automaticamente se não existir
4. **Compatibilidade**: Funciona com planilhas existentes sem necessidade de modificação

## Próximos Passos

Após instalar:
1. Configure a URL em `config.js` como `APPS_SCRIPT_CASOS`
2. Teste o sistema de detecção de mudanças
3. Monitore os logs para garantir que está funcionando
