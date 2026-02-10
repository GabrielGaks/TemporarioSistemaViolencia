# Integração do Endpoint checkUpdates no Backend Existente

## Arquivos Criados

1. **`Code.gs`** - Arquivo principal completo com todas as funcionalidades
2. **`backend/Code-CheckUpdates.gs`** - Arquivo complementar para adicionar ao backend existente
3. **`backend/Code-Anexos.gs`** - Já existente (sistema de anexos)

## Opção 1: Usar o Code.gs Completo (Recomendado)

Se você não tem um backend existente ou quer substituir:

1. Abra o Google Apps Script
2. **Delete todo o código existente**
3. **Cole o conteúdo completo** de `Code.gs`
4. Configure as constantes no início:
   ```javascript
   const SPREADSHEET_ID = 'SEU_ID_DA_PLANILHA';
   const SHEET_NAME = 'Página1';
   ```
5. Se usar anexos, adicione também o conteúdo de `backend/Code-Anexos.gs` no mesmo arquivo
6. Configure as constantes do Supabase (se usar anexos):
   ```javascript
   const SUPABASE_URL = 'https://seu-projeto.supabase.co';
   const SUPABASE_ANON_KEY = 'sua-chave-anon';
   ```

## Opção 2: Adicionar ao Backend Existente

Se você já tem um `Code.gs` funcionando:

### Passo 1: Adicionar a função handleCheckUpdates

1. Abra seu `Code.gs` existente
2. Copie a função `handleCheckUpdates()` de `backend/Code-CheckUpdates.gs`
3. Cole no final do arquivo (antes das funções auxiliares)

### Passo 2: Adicionar no switch/case do doPost

No seu `doPost()` existente, adicione:

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.parameter.data || '{}');
    const action = data.action;
    
    switch(action) {
      // ... seus casos existentes ...
      
      case 'checkUpdates':  // <-- ADICIONAR
        return handleCheckUpdates(data);  // <-- ADICIONAR
      
      // ... resto do código ...
    }
  } catch (error) {
    // ... tratamento de erro ...
  }
}
```

### Passo 3: Adicionar funções auxiliares

Copie estas funções de `backend/Code-CheckUpdates.gs`:

- `atualizarTimestamp(sheet, row)` - Atualiza timestamp de uma linha
- `contarNotificacoesUsuario(sheet, emailUsuario)` - Conta notificações por usuário

**NOTA**: Se você já tem uma função `createResponse()`, não precisa duplicar. Use a existente.

### Passo 4: (Opcional) Adicionar trigger onEdit

Para atualização automática de timestamp:

1. Copie a função `onEdit()` de `backend/Code-CheckUpdates.gs`
2. Configure o trigger:
   - Vá em **Triggers** > **Add Trigger**
   - Função: `onEdit`
   - Evento: **On edit**
   - Salve

**OU** execute a função `criarTriggerOnEdit()` uma vez no editor.

## Configuração das Constantes

No início do seu `Code.gs`, adicione ou ajuste:

```javascript
// Se já existir, não precisa duplicar
const SPREADSHEET_ID = 'SEU_ID_DA_PLANILHA';
const SHEET_NAME = 'Página1';

// Nova constante para timestamp (opcional)
const TIMESTAMP_COLUMN_INDEX = null; // null = última coluna + 1 (criada automaticamente)
```

## Teste

Após integrar, teste o endpoint:

1. No editor do Apps Script, execute a função `TESTE_checkUpdates()`
2. Ou faça uma requisição manual:
   ```javascript
   fetch('SUA_URL_APPS_SCRIPT', {
     method: 'POST',
     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
     body: 'data=' + encodeURIComponent(JSON.stringify({
       action: 'checkUpdates'
     }))
   })
   .then(r => r.json())
   .then(console.log);
   ```

## Resposta Esperada

```json
{
  "success": true,
  "totalRecords": 150,
  "totalRecordsAll": 150,
  "lastRow": 151,
  "lastColumn": 20,
  "hash": "abc123...",
  "lastModified": "2024-01-15T10:30:00.000Z",
  "timestampColumn": 21
}
```

## Funcionalidades Implementadas

✅ **checkUpdates**: Verifica mudanças sem baixar todos os dados
✅ **Timestamp automático**: Cria e atualiza coluna de timestamp
✅ **Hash de verificação**: Compara mudanças eficientemente
✅ **Contagem por usuário**: Retorna contagem específica se email fornecido
✅ **Trigger onEdit**: Atualiza timestamp automaticamente (opcional)

## Compatibilidade

- ✅ Funciona com planilhas existentes
- ✅ Não requer modificação da estrutura atual
- ✅ Detecta colunas automaticamente
- ✅ Cria coluna de timestamp se não existir
- ✅ Compatível com sistema de anexos existente

## Troubleshooting

### Erro: "Planilha não encontrada"
- Verifique se `SPREADSHEET_ID` está correto
- Verifique se a planilha está compartilhada

### Timestamp não atualiza
- Execute `criarTriggerOnEdit()` uma vez
- Ou configure o trigger manualmente em Triggers

### Hash sempre diferente
- Isso é normal se houver mudanças
- O sistema compara hash + timestamp + contagem para evitar falsos positivos
