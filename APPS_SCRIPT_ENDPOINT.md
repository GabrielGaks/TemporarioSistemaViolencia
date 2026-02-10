# Endpoint de Verificação de Mudanças - Apps Script

## Objetivo
Implementar um endpoint no Google Apps Script que retorna informações sobre a última modificação dos dados, permitindo detecção eficiente de mudanças sem precisar baixar todos os dados.

## Implementação no Apps Script

Adicione a seguinte função no seu Apps Script (projeto de Casos):

```javascript
/**
 * Verifica atualizações sem retornar todos os dados
 * Retorna apenas metadados para comparação
 */
function checkUpdates(data) {
  try {
    const action = data.action;
    
    if (action !== 'checkUpdates') {
      return {
        success: false,
        message: 'Ação inválida'
      };
    }
    
    // Abre a planilha
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME || 'Página1');
    
    if (!sheet) {
      return {
        success: false,
        message: 'Planilha não encontrada'
      };
    }
    
    // Obtém informações da última modificação
    const lastRow = sheet.getLastRow();
    const lastColumn = sheet.getLastColumn();
    
    // Obtém timestamp da última modificação da planilha
    // Nota: Google Sheets não expõe diretamente o timestamp de modificação
    // Vamos usar uma abordagem alternativa: verificar a última linha modificada
    // ou usar uma coluna de timestamp se existir
    
    // Opção 1: Usar última linha como indicador (mais simples)
    const totalRecords = lastRow - 1; // Subtrai cabeçalho
    
    // Opção 2: Se você tiver uma coluna de data/hora de modificação, use ela
    // const lastModifiedColumn = sheet.getRange(2, COLUNA_TIMESTAMP, lastRow - 1, 1);
    // const lastModifiedValues = lastModifiedColumn.getValues();
    // const lastModified = lastModifiedValues
    //   .map(row => row[0])
    //   .filter(val => val instanceof Date)
    //   .sort((a, b) => b.getTime() - a.getTime())[0];
    
    // Para uma solução mais precisa, você pode:
    // 1. Adicionar uma coluna "Última Modificação" que é atualizada automaticamente
    // 2. Usar um trigger onEdit para atualizar essa coluna
    // 3. Ler o valor mais recente dessa coluna aqui
    
    // Por enquanto, vamos usar a contagem de registros e um hash simples
    // Gera um hash baseado nas últimas linhas (últimas 10 linhas modificadas)
    let hashData = '';
    if (lastRow > 1) {
      const sampleRows = Math.min(10, lastRow - 1);
      const range = sheet.getRange(lastRow - sampleRows + 1, 1, sampleRows, lastColumn);
      const values = range.getValues();
      hashData = JSON.stringify(values);
    }
    
    // Hash simples (você pode usar uma biblioteca de hash se preferir)
    let hash = 0;
    for (let i = 0; i < hashData.length; i++) {
      const char = hashData.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const hashString = Math.abs(hash).toString(36);
    
    return {
      success: true,
      totalRecords: totalRecords,
      lastRow: lastRow,
      hash: hashString,
      // Se você implementar timestamp, adicione aqui:
      // lastModified: lastModified ? lastModified.toISOString() : null
    };
    
  } catch (error) {
    console.error('Erro em checkUpdates:', error);
    return {
      success: false,
      message: error.toString()
    };
  }
}
```

## Modificar a função principal do Apps Script

No seu handler principal (doPost ou similar), adicione o caso:

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.parameter.data || '{}');
    const action = data.action;
    
    // ... outros casos existentes ...
    
    // Novo caso para verificação de mudanças
    if (action === 'checkUpdates') {
      return ContentService
        .createTextOutput(JSON.stringify(checkUpdates(data)))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // ... resto do código ...
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## Solução Avançada: Trigger para Timestamp Automático

Para uma detecção mais precisa, você pode adicionar uma coluna de timestamp que é atualizada automaticamente:

### 1. Adicione uma coluna "Última Modificação" na planilha

### 2. Crie um trigger onEdit no Apps Script:

```javascript
/**
 * Trigger que atualiza timestamp quando uma linha é modificada
 */
function onEdit(e) {
  const sheet = e.source.getActiveSheet();
  const range = e.range;
  const row = range.getRow();
  
  // Ignora cabeçalho
  if (row === 1) return;
  
  // Encontra a coluna de timestamp (ajuste o índice conforme necessário)
  const timestampColumn = sheet.getLastColumn() + 1; // Última coluna + 1
  
  // Atualiza timestamp
  sheet.getRange(row, timestampColumn).setValue(new Date());
  
  // Opcional: formata a célula
  sheet.getRange(row, timestampColumn).setNumberFormat('dd/MM/yyyy HH:mm:ss');
}
```

### 3. Modifique checkUpdates para usar essa coluna:

```javascript
function checkUpdates(data) {
  // ... código anterior ...
  
  // Lê a última modificação da coluna de timestamp
  const timestampColumn = sheet.getLastColumn(); // Assumindo que é a última coluna
  const timestampRange = sheet.getRange(2, timestampColumn, lastRow - 1, 1);
  const timestamps = timestampRange.getValues()
    .map(row => row[0])
    .filter(val => val instanceof Date);
  
  const lastModified = timestamps.length > 0 
    ? timestamps.sort((a, b) => b.getTime() - a.getTime())[0]
    : null;
  
  return {
    success: true,
    totalRecords: totalRecords,
    lastModified: lastModified ? lastModified.toISOString() : null,
    hash: hashString
  };
}
```

## Benefícios

1. **Performance**: Não precisa baixar todos os dados para verificar mudanças
2. **Precisão**: Usa timestamp real da última modificação
3. **Eficiência**: Reduz carga no servidor e no cliente
4. **Confiabilidade**: Evita falsos positivos

## Notas

- O endpoint `checkUpdates` é chamado periodicamente (a cada 45 segundos por padrão)
- Se o endpoint não estiver disponível, o sistema usa método alternativo de comparação de hash
- O sistema funciona mesmo sem esse endpoint, mas será menos eficiente
