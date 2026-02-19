# 🏫 Ecossistema de Escolas e Técnicos — Documentação Completa

> Última atualização: 12/02/2026

---

## Visão Geral

O sistema possui **dois subsistemas independentes** que lidam com escolas:

| Subsistema | Arquivo | Usado em | Propósito |
|---|---|---|---|
| **Mapeamento por Técnico** | `assets/js/utils/escolas-tecnico.js` | `registro-novo-caso.html`, `gerenciar-casos.html` | Filtrar escolas **pelo técnico logado** |
| **Filtro do Painel** | Inline em `painel-casos.html` | `painel-casos.html` | Buscar/filtrar escolas **nos resultados da tabela** |

---

## 1. Sistema de Mapeamento por Técnico (`escolas-tecnico.js`)

### Arquitetura

O módulo é um IIFE exposto em `window.NAVMEscolasTecnico`. Ele possui duas fontes de dados com prioridade:

1. **Supabase (Cache DB)** — carregado automaticamente no `DOMContentLoaded` via Apps Script (`action=get_technician_schools_for_cache`).
2. **Fallback Hardcoded** — arrays de escolas diretamente no código, usados se o Supabase falhar.

### Técnicos Cadastrados

| Técnico | Chave | Escolas |
|---|---|---|
| Amelinha | `amelinha` | 15 |
| Libna | `libna` | 15 |
| Rosângela | `rosangela` | 16 |
| Darison | `darison` | 15 |
| Carla/Maria | `carla` / `maria` (alias) | 15 |
| Joselma | `joselma` | 10 |
| Sílvia | `silvia` | 11 |
| Katiane | `katiane` | 7 |

Cada escola é um objeto `{ nomeOriginal, tipo, regiao }`.

### Identificação do Técnico

O sistema usa 3 estratégias em cascata:

1. **Por Nome** (`identificarTecnicoPorNome`) — Match exato → parcial → por início (4 primeiros chars).
2. **Por Email** (`identificarTecnico`) — Extrai parte antes do `@`, faz match parcial contra as chaves.
3. **Parâmetro como nome direto** — Se não contiver `@`, tenta como nome.

### Regras de Visibilidade por Cargo (Role)

| Role | Comportamento |
|---|---|
| `estagiario` / `user` | Vê **todas** as escolas |
| `admin` / `superuser` | Vê **todas** as escolas |
| `tecnico` | Vê **apenas suas escolas**. Tem toggle "Ver Todas" |
| Outros | Vê todas |

### Fluxo de Decisão (`getEscolasUsuario`)

```
1. É estagiário/user/admin/superuser? → TODAS_ESCOLAS
2. É técnico com toggle "Ver Todas"? → TODAS_ESCOLAS
3. Cache Supabase carregado?
   a. Busca por nome no cache → encontrou? retorna
   b. Busca por email no cache → encontrou? retorna
   c. Não encontrou? → vai pro fallback hardcoded
4. Fallback hardcoded:
   a. Identifica por nome → retorna escolas do técnico
   b. Identifica por email → retorna escolas do técnico
   c. Tenta parâmetro como nome → retorna
   d. Nenhum match → retorna [] (vazio)
```

### API Pública

| Função | Descrição |
|---|---|
| `getEscolasUsuario(email, role, verTodas, nome)` | Lista filtrada de escolas |
| `getRegiaoEscola(nome)` | Região de uma escola |
| `identificarTecnico(email)` | Técnico pelo email |
| `identificarTecnicoPorNome(nome)` | Técnico pelo nome |
| `podeVerTodasEscolas(role)` | `true` se role é `tecnico` |
| `getTecnicoResponsavel(nomeEscola)` | Técnico responsável pela escola |
| `getRegioes()` | Lista de regiões únicas |
| `filtrarPorTipo(escolas, tipo)` | Filtra por CMEI/EMEF |
| `filtrarPorRegiao(escolas, regiao)` | Filtra por região |
| `carregarEscolasDeSupabase()` | Carrega cache do Supabase (async) |

### Inicialização

```
Página carrega → DOMContentLoaded
  → carregarEscolasDeSupabase()
    → fetch(APPS_SCRIPT_URL?action=get_technician_schools_for_cache)
      → Sucesso: escolasPorTecnicoDB = data, cacheCarregado = true
      → Falha: usandoFallback = true (usa dados hardcoded)
```

---

## 2. Sistema de Filtro do Painel de Casos (`painel-casos.html`)

> [!IMPORTANT]
> O painel de casos **NÃO usa** `escolas-tecnico.js`. Toda a lógica de escolas é independente.

### Fontes de Dados

#### a) CSVs Inline (para tipo e siglas)

Dois CSVs embutidos no HTML (~linha 3765):

```
CSV_CMEIS = "Nome,Sigla\nAdácio Bispo dos Santos TI,ABS\n..."
CSV_EMEFS = "Nome,Sigla\nAlberto de Almeida,AA\n..."
```

Processados por `processarCSVs()` que gera:

```javascript
CMEI_SIGLAS["ABS"] = "Adácio Bispo dos Santos TI"
EMEF_SIGLAS["AA"] = "Alberto de Almeida"
```

#### b) Dados da Planilha (para lista de escolas disponíveis)

As escolas no autocomplete vêm dos **dados reais da planilha**:

```javascript
const valores = buildNormalizedOptions(columnNames.escola, data);
createCheckboxes('filterEscolaContainer', valores, 'escola');
```

`buildNormalizedOptions()` itera todos os registros, pega o valor da coluna "escola", normaliza e gera valores únicos. **Só aparecem escolas que possuem pelo menos um caso registrado.**

### Como o Sistema Identifica o Tipo da Escola

A função `getTipoInstituicao(nomeEscola)` usa a seguinte cascata:

```
1. É sigla exata de EMEF? (ex: "AA") → "EMEF"
2. É sigla exata de CMEI? (ex: "ABS") → "CMEI"
3. Contém sigla de EMEF como palavra isolada? → "EMEF"
4. Contém sigla de CMEI como palavra isolada? → "CMEI"
5. Texto contém "EMEF"? → "EMEF"
6. Texto contém "CMEI"? → "CMEI"
7. Nada → null ("Não Encontrada")
```

Usada em dois momentos:
- **Criação do filtro "Tipo de Instituição"** (~linha 6331): gera checkboxes CMEI/EMEF/Não Encontrada
- **Filtragem dos registros** (~linha 6803): compara tipo do registro contra tipos selecionados

### Como Funciona o Autocomplete de Busca (`setupEscolaAutocomplete`)

#### Fluxo de Inicialização

```
Dados carregados da planilha
  → buildNormalizedOptions() extrai valores únicos da coluna "escola"
  → createCheckboxes() cria inputs hidden em #filterEscolaContainer
  → MutationObserver detecta novos checkboxes
  → rebuildCache() constrói array "cached" com metadados
```

#### `rebuildCache()` (~linha 5101)

Lê todos os checkboxes hidden e para cada um:
- Pega o `data-value` (sigla, ex: "AA")
- Tenta resolver via `getNomeFromSigla()` → "EMEF Alberto de Almeida"
- Detecta tipo via `getTipoInstituicao()` → "EMEF"
- Armazena: `{ checkboxValue, value, tipo, sigla, siglaNormalized, normalized }`

#### `filterItems(termRaw)` (~linha 5183)

Quando o usuário digita, filtra o cache usando **3 algoritmos** (OR):
1. **Match por palavras** — cada palavra do termo precisa existir no nome normalizado
2. **Match por sigla** — o termo (sem espaços) existe na sigla normalizada
3. **Match por iniciais consecutivas** — a sigla começa com o termo digitado

Itens já selecionados são excluídos dos resultados.

#### `render(results)` (~linha 5238)

Exibe até 60 resultados, cada item terá:
- Badge colorido (CMEI = azul, EMEF = verde)
- Nome da escola (sem o prefixo de tipo)
- Sigla correspondente

#### `selectItem(it)` (~linha 5216)

Ao clicar, marca o checkbox oculto correspondente, renderiza tags e dispara `applyFilters()`.

### Filtragem dos Registros (~linha 6810)

Quando `applyFilters()` roda, para o filtro de escola:

```javascript
if (filters.escolas.length && columnNames.escola) {
  const rowVals = String(row[columnNames.escola] || '').split(',').map(v => v.trim());
  const rowNorms = rowVals.map(v => normalizeText(v)).filter(v => v);
  const filterNorms = filters.escolas.map(v => normalizeText(v));
  const ok = rowNorms.some(rn => filterNorms.includes(rn));
  if (!ok) return false;
}
```

Compara os valores normalizados da coluna "escola" do registro contra os valores normalizados dos filtros selecionados.

---

## Diferenças entre os Dois Subsistemas

| Aspecto | `escolas-tecnico.js` | `painel-casos.html` |
|---|---|---|
| **Propósito** | Filtrar escolas por técnico logado | Filtrar escolas nos resultados da tabela |
| **Fonte das escolas** | Lista hardcoded + Supabase | Dados reais da planilha |
| **Tipo (CMEI/EMEF)** | Propriedade `tipo` de cada escola | Detectado via `getTipoInstituicao()` + CSVs de siglas |
| **Escolas disponíveis** | Todas mapeadas (constantes) | Apenas com pelo menos 1 caso registrado |
| **Regiões** | Propriedade `regiao` de cada escola | Não usa regiões |
| **Importado onde** | `registro-novo-caso.html`, `gerenciar-casos.html` | Apenas `painel-casos.html` (inline) |

---

## Pontos de Atenção

1. **Escolas duplicadas entre técnicos** — Algumas escolas estão em mais de uma lista (ex: "EMEF Vercenílio da Silva Pascoal" em `ESCOLAS_LIBNA` e `ESCOLAS_KATIANE`).
2. **`TODAS_ESCOLAS` pode ter duplicatas** — É apenas um spread de todos os arrays.
3. **Técnico não reconhecido retorna `[]`** — Intencional para evitar vazamento de dados.
4. **Alias "carla"/"maria"** — Ambas apontam para a mesma lista.
5. **CSVs inline no painel** — São uma cópia estática; precisam ser atualizados manualmente se escolas mudarem.
6. **Painel não filtra por técnico** — Qualquer usuário com acesso ao painel vê todas as escolas que têm casos.
