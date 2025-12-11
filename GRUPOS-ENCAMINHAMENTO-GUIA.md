# 📋 Sistema de Grupos Expansíveis - Encaminhamento

## ✅ Implementação Concluída

O sistema de grupos expansíveis para o filtro de Encaminhamento foi implementado com sucesso no arquivo `painel-casos.html`.

---

## 🎯 Recursos Implementados

### 1. **Grupos Predefinidos**
Os encaminhamentos são organizados em 5 grupos principais:

```javascript
const encaminhamentosAgrupados = {
  redeAssistencia: ['Assistência Social','CRAS','CREAS','Casa Rosa','Psicólogo'],
  redeSaude: ['Saúde','UBS','US','CAPSIN'],
  redeEducacao: ['NAAM','Educação','Escola'],
  conselhoTutelar: ['CT'],
  redeSegurancaJustica: ['DACLE','DEAM','DEPI','DPCA','Defensoria Pública','Ministério Público','Outras delegacias']
};
```

### 2. **Filtragem Dinâmica**
- ✅ Apenas encaminhamentos que **existem na planilha** são exibidos
- ✅ Grupos sem filhos presentes **não aparecem** na interface
- ✅ Comparação usa normalização de texto (ignora acentos, maiúsculas)

### 3. **Detecção de Termos Não Mapeados**
- ✅ Grupo especial **"⚠️ Outros detectados"** com borda pontilhada amarela
- ✅ Lista encaminhamentos que não estão em nenhum grupo predefinido
- ✅ Aparece apenas se houver termos novos

### 4. **Interação Checkbox Grupo ↔ Filhos**
- ✅ **Marcar grupo** → seleciona todos os filhos
- ✅ **Desmarcar grupo** → desmarca todos os filhos
- ✅ **Marcar alguns filhos** → grupo fica com estado `indeterminate` (traço)
- ✅ **Marcar todos os filhos** → grupo fica marcado automaticamente

### 5. **Badges de Contagem**
- ✅ **Badge por grupo** mostra quantos filhos estão selecionados
- ✅ **Badge total** no título da seção soma todos os encaminhamentos selecionados
- ✅ Animação suave ao aparecer/desaparecer

### 6. **Painéis Expansíveis**
- ✅ Clique no header para expandir/recolher
- ✅ Ícone de seta gira ao abrir/fechar
- ✅ Animação suave com `max-height` transition

### 7. **Lógica de Filtro OR**
- ✅ Selecionar múltiplos encaminhamentos = **união** (mostrar linhas com **qualquer um** dos selecionados)
- ✅ Suporta valores múltiplos na célula separados por `,` e `/`
- ✅ Exemplo: Planilha tem "CT/UBS" → marcar "CT" **ou** "UBS" retorna essa linha

---

## 🔧 Como Funciona (Internamente)

### **1. Inicialização**
```javascript
// No initializeFilters(), linha ~1805:
if (columnNames.encaminhamento) {
  const valores = buildNormalizedOptions(columnNames.encaminhamento, data);
  buildEncaminhamentoGroups(valores); // ← Nova função
}
```

### **2. Construção dos Grupos**
A função `buildEncaminhamentoGroups(availableEncaminhamentos)`:

1. **Normaliza** `availableEncaminhamentos` (extraídos da planilha)
2. Para cada grupo, **filtra** apenas filhos presentes:
   ```javascript
   const childrenPresent = children.filter(child => 
     availableNormalized.includes(normalizeText(child))
   );
   ```
3. Se `childrenPresent.length === 0` → **não renderiza** o grupo
4. Renderiza grupos com `renderEncaminhamentoGroup(groupKey, childrenPresent)`
5. Detecta termos não mapeados e cria `renderOutrosDetectados()`

### **3. Coleta de Valores Selecionados**
```javascript
// Substituído no applyFilters(), linha ~2367:
encaminhamentos: gatherSelectedEncaminhamentos(), // ← Em vez de getCheckedValues('encaminhamento')
```

### **4. Filtragem de Dados**
```javascript
// Substituído no applyFilters(), linha ~2467:
if (filters.encaminhamentos.length && columnNames.encaminhamento) {
  if (!matchEncaminhamentoCell(row[columnNames.encaminhamento], filters.encaminhamentos)) {
    return false;
  }
}
```

---

## 🎨 Estilo Visual

### **Grupos Normais**
- Borda cinza `#e5e7eb`
- Header com gradiente azul suave ao hover
- Background branco

### **Grupo "Outros Detectados"**
- Borda **pontilhada** amarela `#f59e0b`
- Background amarelo claro `#fffbeb`
- Header com gradiente amarelo

### **Cards de Filhos**
- Background cinza claro `bg-gray-50`
- Borda `border-gray-200`
- Para "Outros": background âmbar `bg-amber-50`, borda `border-amber-300`

### **Badges**
- Background azul `#3b82f6`
- Fonte branca, tamanho `0.75rem`
- Animação `badgePop` ao aparecer

---

## 📍 Localização no Código

| Componente | Linhas (aprox.) | Descrição |
|-----------|----------------|-----------|
| **CSS Grupos** | ~240-340 | Classes `.encaminhamento-group`, `.group-header`, `.group-body` |
| **Objeto `encaminhamentosAgrupados`** | ~1150 | Definição dos grupos e nomes amigáveis |
| **Funções de Construção** | ~1150-1450 | `buildEncaminhamentoGroups()`, `renderEncaminhamentoGroup()`, etc. |
| **Handlers de Eventos** | ~1350-1450 | `onGroupCheckboxChange()`, `onChildCheckboxChange()` |
| **Funções de Badge** | ~1430-1470 | `updateGroupBadge()`, `updateBadgeEncaminhamentoTotal()` |
| **Coleta & Match** | ~1470-1510 | `gatherSelectedEncaminhamentos()`, `matchEncaminhamentoCell()` |
| **Integração em `initializeFilters`** | ~1805 | Chamada `buildEncaminhamentoGroups(valores)` |
| **Integração em `applyFilters`** | ~2367, ~2467 | Uso de `gatherSelectedEncaminhamentos()` e `matchEncaminhamentoCell()` |
| **Limpeza em `clearFilters`** | ~2635 | Adiciona `cb.indeterminate = false` e limpa `.group-badge` |

---

## 🧪 Testes Recomendados

### **Cenário 1: Grupo com Todos os Filhos Presentes**
1. Planilha contém: `"CRAS, CREAS, Psicólogo"`
2. Resultado: Grupo "Rede de Assistência Social" aparece com 3 filhos
3. Marcar grupo → marca todos os 3 filhos
4. Badge mostra `3`

### **Cenário 2: Grupo com Alguns Filhos Presentes**
1. Planilha contém: `"Saúde, UBS"`
2. Resultado: Grupo "Rede de Saúde" aparece apenas com 2 filhos (US e CAPSIN não aparecem)

### **Cenário 3: Grupo sem Filhos**
1. Planilha não contém: nenhum encaminhamento de "Rede de Segurança e Justiça"
2. Resultado: Grupo não aparece

### **Cenário 4: Termos Não Mapeados**
1. Planilha contém: `"CAPS-AD, Rede de Proteção"`
2. Resultado: Grupo "⚠️ Outros detectados" aparece com esses 2 termos

### **Cenário 5: Estado Indeterminado**
1. Grupo com 4 filhos, marcar 2 deles
2. Resultado: Checkbox do grupo fica com traço (indeterminate)
3. Badge mostra `2`

### **Cenário 6: Filtro OR**
1. Marcar "CT" e "Saúde"
2. Planilha tem linha com `"CT/UBS/Educação"`
3. Resultado: Linha aparece (contém CT)

### **Cenário 7: Limpar Filtros**
1. Marcar vários grupos
2. Clicar "Limpar Filtros"
3. Resultado: Todos os checkboxes desmarcados, badges ocultos, grupos recolhidos

---

## 🔄 Extensibilidade

### **Adicionar Novo Grupo**
```javascript
const encaminhamentosAgrupados = {
  // ... grupos existentes ...
  novoGrupo: ['Termo1', 'Termo2', 'Termo3']
};

const grupoNomes = {
  // ... nomes existentes ...
  novoGrupo: 'Nome Amigável do Novo Grupo'
};
```

### **Adicionar Filho a Grupo Existente**
```javascript
redeAssistencia: ['Assistência Social','CRAS','CREAS','Casa Rosa','Psicólogo','NovoTermo'],
```

### **Mudar Ordem dos Grupos**
A ordem de exibição segue a ordem no objeto `encaminhamentosAgrupados` (JavaScript mantém ordem de inserção desde ES2015).

---

## 📝 Notas Técnicas

1. **Normalização de Texto**: Usa `normalizeText()` existente (remove acentos, converte para minúsculas)

2. **Separadores Múltiplos**: A extração de `availableEncaminhamentos` usa `buildNormalizedOptions()` que já separa por `,` e `/`

3. **Performance**: Construção dos grupos ocorre apenas 1x no carregamento da planilha (não re-renderiza ao filtrar)

4. **Compatibilidade**: Usa apenas CSS Tailwind + classes customizadas já existentes no projeto

5. **Acessibilidade**: 
   - Labels clicáveis (`<label for="...">`)
   - Estado `indeterminate` para grupos parcialmente selecionados
   - Cores com contraste adequado

---

## 🐛 Troubleshooting

### **Problema: Grupo não aparece**
- **Causa**: Nenhum filho existe na planilha
- **Solução**: Verificar se os termos do grupo estão escritos corretamente e aparecem nos dados

### **Problema: Termo aparece em "Outros detectados" mas deveria estar em um grupo**
- **Causa**: Normalização diferente ou termo não está no array do grupo
- **Solução**: Adicionar o termo ao grupo correto em `encaminhamentosAgrupados`

### **Problema: Badge não atualiza**
- **Causa**: Evento `onchange` não está disparando
- **Solução**: Verificar console do navegador, testar manualmente chamando `updateBadgeEncaminhamentoTotal()`

### **Problema: Filtro não funciona (linhas não aparecem)**
- **Causa**: Normalização entre células e selecionados pode estar diferente
- **Solução**: Adicionar `console.log()` em `matchEncaminhamentoCell()` para debug

---

## ✨ Resultado Final

O filtro de Encaminhamento agora é:
- ✅ **Organizado** em grupos lógicos
- ✅ **Dinâmico** (adapta-se aos dados da planilha)
- ✅ **Intuitivo** (estado indeterminate, badges)
- ✅ **Extensível** (fácil adicionar novos grupos/termos)
- ✅ **Visual** (animações, hover effects, cores)
- ✅ **Funcional** (lógica OR, multi-valor, normalização)

---

**Implementado em**: `painel-casos.html`  
**Data**: Dezembro 2025  
**Status**: ✅ Pronto para uso
