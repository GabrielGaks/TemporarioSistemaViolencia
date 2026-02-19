# PROMPT COMPLETO: Sistema de Seleção de Escola - Modal de Edição

## 🎯 OBJETIVO PRINCIPAL

Gemini, você precisa implementar NO MODAL DE EDIÇÃO DE REGISTRO ([gerenciar-casos.html](gerenciar-casos.html)) o **EXATO MESMO SISTEMA** de seleção de instituição de ensino que existe no modal de inserir novo caso ([registro-novo-caso.html](registro-novo-caso.html)).

O sistema deve ser **BIT A BIT IDÊNTICO**, incluindo:
- ✅ Botão "Ver Todas Escolas" / "Minhas Escolas"  
- ✅ Filtro automático por técnico logado
- ✅ Indicador visual de filtro ativo
- ✅ Toda a lógica de toggle entre "minhas escolas" e "todas as escolas"
- ✅ Mesmos estilos CSS
- ✅ Mesma estrutura HTML
- ✅ Mesma lógica JavaScript

---

## 📚 CONTEXTO DO SISTEMA ATUAL

### 1. ARQUIVOS PRINCIPAIS ENVOLVIDOS

#### Arquivo de Origem (REFERÊNCIA - O QUE COPIAR):
- **[registro-novo-caso.html](registro-novo-caso.html)** - Linhas 2088-2114
  - Contém a implementação COMPLETA e FUNCIONAL
  - Este é o modelo a ser replicado

#### Arquivo de Destino (ONDE IMPLEMENTAR):
- **[gerenciar-casos.html](gerenciar-casos.html)** - Linhas 3620-3660
  - Atualmente NÃO possui o botão "Ver Todas Escolas"
  - Precisa receber a implementação completa

#### Módulos JavaScript Usados:
- **[assets/js/utils/escolas-tecnico.js](assets/js/utils/escolas-tecnico.js)**
  - Módulo `window.NAVMEscolasTecnico`
  - Funções principais:
    - `getEscolasUsuario(email, role, verTodas, nome)` - Busca escolas do usuário
    - `identificarTecnicoPorNome(nome)` - Identifica técnico pelo nome
    - `identificarTecnico(email)` - Identifica técnico pelo email
    - `getRegiaoEscola(nomeEscola)` - Retorna região da escola

#### Backend (Supabase):
- **[backend/Code-Supabase.gs](backend/Code-Supabase.gs)** - Linhas 2147-2195
  - Função `listarEscolasTecnico(userId)` - Retorna escolas do técnico
  - Endpoint: `/rest/v1/technician_schools?user_id=eq.{userId}`
  - Retorna: `{ school_name, school_type, school_region }`

---

## 🧩 ESTRUTURA HTML - MODAL DE INSERÇÃO (REFERÊNCIA)

### Localização: [registro-novo-caso.html](registro-novo-caso.html#L2088-L2114)

```html
<!-- CMEI/EMEF com Autocomplete -->
<div class="md:col-span-2">
  <!-- CABEÇALHO: Label + Botão Ver Todas -->
  <div class="flex items-center justify-between mb-2">
    <label for="cmeiEmef" class="block text-sm font-semibold text-gray-700">
      Instituição de Ensino <span class="text-red-500">*</span>
    </label>
    
    <!-- ⭐ BOTÃO VER TODAS - APENAS PARA TÉCNICOS -->
    <div id="filtro-escolas-container" class="hidden">
      <button type="button" id="btnVerTodasEscolas"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-sm hover:shadow-md"
        title="Alternar entre suas escolas e todas as escolas">
        <span id="btnVerTodasIcone">🌐</span>
        <span id="btnVerTodasText">Ver Todas</span>
      </button>
    </div>
  </div>
  
  <!-- CAMPO DE INPUT COM AUTOCOMPLETE -->
  <div class="autocomplete-wrapper">
    <input type="text" id="cmeiEmef" name="cmeiEmef" required disabled autocomplete="off"
      class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/60 focus:border-green-500 transition-all duration-200 bg-white shadow-sm disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-500"
      placeholder="Primeiro selecione o tipo de instituição">
    <div class="autocomplete-list" id="autocompleteList"></div>
  </div>
  
  <!-- ⭐ INDICADOR DE FILTRO ATIVO (APENAS TÉCNICOS) -->
  <div id="filtroAtivoContainer" class="hidden mt-1.5">
    <p id="filtroAtivoIndicador" class="text-xs text-green-600 flex items-center gap-1">
      <span>✓</span> 
      <span id="filtroAtivoTexto">Mostrando suas escolas atribuídas</span>
    </p>
  </div>
  
  <p class="text-xs text-gray-500 mt-1.5">Digite para filtrar as instituições disponíveis</p>
</div>
```

### ⚠️ IMPORTANTE: IDs NO MODAL DE EDIÇÃO

No modal de edição, os IDs devem ter prefixo `edit_`:

```html
<!-- EQUIVALENTE PARA MODAL DE EDIÇÃO -->
<div id="edit_filtro-escolas-container" class="hidden">
  <button type="button" id="edit_btnVerTodasEscolas"
    class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-sm hover:shadow-md"
    title="Alternar entre suas escolas e todas as escolas">
    <span id="edit_btnVerTodasIcone">🌐</span>
    <span id="edit_btnVerTodasText">Ver Todas</span>
  </button>
</div>

<div id="edit_filtroAtivoContainer" class="hidden mt-1.5">
  <p id="edit_filtroAtivoIndicador" class="text-xs text-green-600 flex items-center gap-1">
    <span>✓</span> 
    <span id="edit_filtroAtivoTexto">Mostrando suas escolas atribuídas</span>
  </p>
</div>
```

---

## 🎨 CSS NECESSÁRIO

### Localização: [registro-novo-caso.html](registro-novo-caso.html#L212-L232)

O CSS já existe no gerenciar-casos.html (é compartilhado), mas confirme a presença de:

```css
/* Estilos para Autocomplete */
.autocomplete-wrapper {
  position: relative;
}

.autocomplete-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #d1d5db;
  border-top: none;
  border-radius: 0 0 0.75rem 0.75rem;
  max-height: 250px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15);
  display: none;
}

.autocomplete-list.show {
  display: block;
}
```

---

## ⚙️ LÓGICA JAVASCRIPT - MODAL DE INSERÇÃO (REFERÊNCIA)

### 1. VARIÁVEIS DE ESTADO

Localização: [registro-novo-caso.html](registro-novo-caso.html#L4850-L4950)

```javascript
// VARIÁVEIS GLOBAIS DO SISTEMA DE ESCOLAS
let escolasDisponiveis = []; // Array de escolas carregadas (filtradas ou todas)
let mostrandoTodasEscolas = false; // Estado do toggle
let tipoSelecionado = ''; // CMEI ou EMEF
let instituicoesFiltradas = []; // Instituições filtradas pelo tipo
```

### 2. FUNÇÃO DE INICIALIZAÇÃO

Localização: [registro-novo-caso.html](registro-novo-caso.html#L4855-L4920)

```javascript
async function inicializarFiltroEscolas() {
  const userEmail = sessionStorage.getItem('userEmail');
  const userRole = sessionStorage.getItem('userRole');
  const userName = sessionStorage.getItem('userName'); // PRIORIDADE: usar nome

  console.log('[Escolas] Inicializando filtro de escolas...');
  console.log('[Escolas] Nome:', userName, '| Email:', userEmail, '| Role:', userRole);

  // Verifica se o módulo está disponível
  if (!window.NAVMEscolasTecnico) {
    console.warn('[Escolas] Modulo NAVMEscolasTecnico não carregado. Usando lista padrão.');
    return;
  }

  // Feedback visual: carregando
  mostrarStatusEscolas('Carregando escolas...', 'loading');

  // Carrega escolas do usuário (ASSÍNCRONO) - PRIORIZA NOME sobre EMAIL
  escolasDisponiveis = await window.NAVMEscolasTecnico.getEscolasUsuario(
    userEmail, 
    userRole, 
    mostrandoTodasEscolas, 
    userName
  );
  
  console.log('[Escolas] Total de escolas disponíveis:', escolasDisponiveis.length);

  // Feedback visual: resultado
  if (escolasDisponiveis.length > 0) {
    mostrarStatusEscolas(escolasDisponiveis.length + ' escolas carregadas', 'success');
  } else {
    mostrarStatusEscolas('Nenhuma escola encontrada', 'error');
  }

  // Verifica se é técnico para mostrar botão "Ver Todas"
  const isTecnico = userRole === 'tecnico';

  if (isTecnico) {
    const filtroContainer = document.getElementById('filtro-escolas-container');
    const filtroAtivoContainer = document.getElementById('filtroAtivoContainer');

    // MOSTRA OS ELEMENTOS APENAS PARA TÉCNICOS
    if (filtroContainer) filtroContainer.classList.remove('hidden');
    if (filtroAtivoContainer) filtroAtivoContainer.classList.remove('hidden');

    // Identifica o técnico - PRIORIZA NOME sobre EMAIL
    let tecnico = null;
    if (userName) {
      tecnico = window.NAVMEscolasTecnico.identificarTecnicoPorNome(userName);
    }
    if (!tecnico && userEmail) {
      tecnico = window.NAVMEscolasTecnico.identificarTecnico(userEmail);
    }

    if (tecnico) {
      console.log('[Escolas] Técnico identificado:', tecnico);
      atualizarIndicadorFiltro();
    } else {
      console.warn('[Escolas] Técnico não identificado. Nome:', userName, '| Email:', userEmail);
    }
  }

  // Configura evento do botão "Ver Todas"
  const btnVerTodas = document.getElementById('btnVerTodasEscolas');
  if (btnVerTodas) {
    btnVerTodas.addEventListener('click', toggleVerTodasEscolas);
  }
}
```

### 3. FUNÇÃO DE TOGGLE

Localização: [registro-novo-caso.html](registro-novo-caso.html#L4925-L4980)

```javascript
async function toggleVerTodasEscolas() {
  mostrandoTodasEscolas = !mostrandoTodasEscolas;

  const userEmail = sessionStorage.getItem('userEmail');
  const userRole = sessionStorage.getItem('userRole');
  const userName = sessionStorage.getItem('userName');

  // Feedback visual
  mostrarStatusEscolas(
    mostrandoTodasEscolas ? 'Carregando todas as escolas...' : 'Carregando suas escolas...', 
    'loading'
  );

  // Recarrega escolas com o novo estado (ASSÍNCRONO)
  escolasDisponiveis = await window.NAVMEscolasTecnico.getEscolasUsuario(
    userEmail, 
    userRole, 
    mostrandoTodasEscolas, 
    userName
  );

  // Feedback visual: resultado
  mostrarStatusEscolas(
    escolasDisponiveis.length + ' escolas ' + (mostrandoTodasEscolas ? 'totais' : 'atribuídas'), 
    'success'
  );

  // Atualiza UI do botão
  const btnTexto = document.getElementById('btnVerTodasText');
  const btnIcone = document.getElementById('btnVerTodasIcone');

  if (mostrandoTodasEscolas) {
    if (btnTexto) btnTexto.textContent = 'Minhas Escolas';
    if (btnIcone) btnIcone.textContent = '👤';
  } else {
    if (btnTexto) btnTexto.textContent = 'Ver Todas';
    if (btnIcone) btnIcone.textContent = '🌐';
  }

  // Limpa campo de escola e região
  const cmeiEmefInput = document.getElementById('cmeiEmef');
  const regiaoDisplay = document.getElementById('regiao-display');
  const regiaoHidden = document.getElementById('regiao');

  if (cmeiEmefInput) cmeiEmefInput.value = '';
  if (regiaoDisplay) regiaoDisplay.value = '';
  if (regiaoHidden) regiaoHidden.value = '';

  // Re-filtra instituições se um tipo já estiver selecionado
  if (tipoSelecionado) {
    instituicoesFiltradas = getInstituicoesFiltradas(tipoSelecionado);
  }

  // Atualiza indicador DEPOIS de re-filtrar
  atualizarIndicadorFiltro();

  console.log('[Escolas] Toggle Ver Todas:', mostrandoTodasEscolas, '| Total filtrado:', instituicoesFiltradas.length);
}
```

### 4. FUNÇÃO DE ATUALIZAÇÃO DO INDICADOR

Localização: [registro-novo-caso.html](registro-novo-caso.html#L4985-L5010)

```javascript
function atualizarIndicadorFiltro() {
  const indicador = document.getElementById('filtroAtivoIndicador');
  const texto = document.getElementById('filtroAtivoTexto');

  if (!indicador || !texto) return;

  // Usa a quantidade filtrada por tipo se houver tipo selecionado
  const quantidadeExibida = tipoSelecionado && instituicoesFiltradas.length > 0
    ? instituicoesFiltradas.length
    : escolasDisponiveis.length;

  const tipoTexto = tipoSelecionado ? ` (${tipoSelecionado})` : '';

  if (mostrandoTodasEscolas) {
    indicador.className = 'text-xs text-orange-600 flex items-center gap-1';
    texto.textContent = `Mostrando todas as ${quantidadeExibida} escolas${tipoTexto}`;
  } else {
    indicador.className = 'text-xs text-green-600 flex items-center gap-1';
    texto.textContent = `Mostrando suas ${quantidadeExibida} escolas atribuídas${tipoTexto}`;
  }
}
```

### 5. FEEDBACK VISUAL (OPCIONAL MAS RECOMENDADO)

```javascript
function mostrarStatusEscolas(mensagem, tipo) {
  // tipo: 'loading', 'success', 'error'
  const statusEl = document.getElementById('escolasStatusFeedback');
  if (!statusEl) {
    // Cria o elemento na primeira vez
    const wrapper = document.querySelector('.autocomplete-wrapper');
    if (!wrapper) return;
    
    const status = document.createElement('p');
    status.id = 'escolasStatusFeedback';
    status.className = 'text-xs mt-1 transition-opacity duration-300';
    wrapper.parentElement.insertBefore(status, wrapper.nextSibling);
  }

  const statusEl = document.getElementById('escolasStatusFeedback');
  
  if (tipo === 'loading') {
    statusEl.textContent = '⏳ ' + mensagem;
    statusEl.className = 'text-xs mt-1 text-blue-600';
  } else if (tipo === 'success') {
    statusEl.textContent = '✅ ' + mensagem;
    statusEl.className = 'text-xs mt-1 text-green-600';
  } else if (tipo === 'error') {
    statusEl.textContent = '❌ ' + mensagem;
    statusEl.className = 'text-xs mt-1 text-red-600';
  }
  
  // Remove após 3 segundos
  setTimeout(() => { statusEl.style.opacity = '0'; }, 3000);
  setTimeout(() => { statusEl.style.opacity = '1'; }, 50);
}
```

---

## 🔄 ADAPTAÇÃO PARA MODAL DE EDIÇÃO

### DIFERENÇAS CRÍTICAS:

1. **PREFIXO DOS IDs**: Todos os IDs devem ter `edit_` como prefixo
   - `filtro-escolas-container` → `edit_filtro-escolas-container`
   - `btnVerTodasEscolas` → `edit_btnVerTodasEscolas`
   - `btnVerTodasIcone` → `edit_btnVerTodasIcone`
   - `btnVerTodasText` → `edit_btnVerTodasText`
   - `filtroAtivoContainer` → `edit_filtroAtivoContainer`
   - `filtroAtivoIndicador` → `edit_filtroAtivoIndicador`
   - `filtroAtivoTexto` → `edit_filtroAtivoTexto`

2. **VARIÁVEIS GLOBAIS**: Criar variáveis separadas para edição
   ```javascript
   let edit_escolasDisponiveis = [];
   let edit_mostrandoTodasEscolas = false;
   let edit_tipoSelecionado = '';
   let edit_instituicoesFiltradas = [];
   ```

3. **NOMES DE FUNÇÕES**: Adicionar sufixo `Edit`
   - `inicializarFiltroEscolas()` → `inicializarFiltroEscolasEdit()`
   - `toggleVerTodasEscolas()` → `toggleVerTodasEscolasEdit()`
   - `atualizarIndicadorFiltro()` → `atualizarIndicadorFiltroEdit()`
   - `mostrarStatusEscolas()` → `mostrarStatusEscolasEdit()`

4. **INTEGRAÇÃO COM SISTEMA EXISTENTE**:
   - A função `configurarEventosInstituicaoEdit()` já existe em [gerenciar-casos.html](gerenciar-casos.html#L5782)
   - Adicionar a inicialização do filtro dentro dessa função
   - O sistema de autocomplete já funciona, só falta o botão de toggle

---

## 📍 LOCAL EXATO DE IMPLEMENTAÇÃO

### Arquivo: [gerenciar-casos.html](gerenciar-casos.html)

#### 1. HTML (Linhas ~3640-3660):

```html
<!-- ANTES (ATUAL) -->
<div class="md:col-span-2">
  <label for="edit_cmeiEmef" class="block text-sm font-semibold text-gray-700 mb-2">
    Instituição de Ensino <span class="text-red-500">*</span>
  </label>
  <div class="autocomplete-wrapper">
    <input type="text" id="edit_cmeiEmef" ...>
    <div class="autocomplete-list" id="edit_autocompleteList"></div>
  </div>
  <p class="text-xs text-gray-500 mt-1.5">Digite para filtrar as instituições disponíveis</p>
</div>

<!-- DEPOIS (COM BOTÃO) -->
<div class="md:col-span-2">
  <!-- Adicionar wrapper flex e botão -->
  <div class="flex items-center justify-between mb-2">
    <label for="edit_cmeiEmef" class="block text-sm font-semibold text-gray-700">
      Instituição de Ensino <span class="text-red-500">*</span>
    </label>
    <!-- NOVO: Botão Ver Todas -->
    <div id="edit_filtro-escolas-container" class="hidden">
      <button type="button" id="edit_btnVerTodasEscolas"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-sm hover:shadow-md"
        title="Alternar entre suas escolas e todas as escolas">
        <span id="edit_btnVerTodasIcone">🌐</span>
        <span id="edit_btnVerTodasText">Ver Todas</span>
      </button>
    </div>
  </div>
  
  <div class="autocomplete-wrapper">
    <input type="text" id="edit_cmeiEmef" ...>
    <div class="autocomplete-list" id="edit_autocompleteList"></div>
  </div>
  
  <!-- NOVO: Indicador de filtro ativo -->
  <div id="edit_filtroAtivoContainer" class="hidden mt-1.5">
    <p id="edit_filtroAtivoIndicador" class="text-xs text-green-600 flex items-center gap-1">
      <span>✓</span> 
      <span id="edit_filtroAtivoTexto">Mostrando suas escolas atribuídas</span>
    </p>
  </div>
  
  <p class="text-xs text-gray-500 mt-1.5">Digite para filtrar as instituições disponíveis</p>
</div>
```

#### 2. JAVASCRIPT (Adicionar após linha ~5900):

Adicionar as 4 funções adaptadas:
- `inicializarFiltroEscolasEdit()`
- `toggleVerTodasEscolasEdit()`
- `atualizarIndicadorFiltroEdit()`
- `mostrarStatusEscolasEdit()`

E no local onde `configurarEventosInstituicaoEdit()` é chamado, adicionar também:
```javascript
configurarEventosInstituicaoEdit();
inicializarFiltroEscolasEdit(); // NOVA LINHA
```

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### HTML:
- [ ] Adicionar `<div class="flex items-center justify-between mb-2">` ao redor do label
- [ ] Adicionar botão `edit_btnVerTodasEscolas` com ícones `edit_btnVerTodasIcone` e texto `edit_btnVerTodasText`
- [ ] Adicionar container `edit_filtro-escolas-container` (inicialmente hidden)
- [ ] Adicionar indicador `edit_filtroAtivoContainer` (inicialmente hidden)
- [ ] Manter estrutura de autocomplete existente intacta

### CSS:
- [ ] Confirmar presença de `.autocomplete-wrapper` e `.autocomplete-list`
- [ ] Confirmar classes Tailwind do botão (gradiente azul-indigo)

### JAVASCRIPT:
- [ ] Criar variáveis globais: `edit_escolasDisponiveis`, `edit_mostrandoTodasEscolas`, `edit_tipoSelecionado`, `edit_instituicoesFiltradas`
- [ ] Implementar `inicializarFiltroEscolasEdit()`
  - [ ] Buscar `userEmail`, `userRole`, `userName` do sessionStorage
  - [ ] Chamar `window.NAVMEscolasTecnico.getEscolasUsuario()`
  - [ ] Verificar se `userRole === 'tecnico'` para mostrar botão
  - [ ] Configurar event listener do botão
- [ ] Implementar `toggleVerTodasEscolasEdit()`
  - [ ] Alternar estado `edit_mostrandoTodasEscolas`
  - [ ] Recarregar escolas com novo estado
  - [ ] Atualizar texto/ícone do botão
  - [ ] Limpar campos de escola e região
  - [ ] Re-filtrar por tipo se necessário
- [ ] Implementar `atualizarIndicadorFiltroEdit()`
  - [ ] Atualizar cor (verde = minhas escolas, laranja = todas)
  - [ ] Atualizar texto com quantidade correta
- [ ] Implementar `mostrarStatusEscolasEdit()` (opcional)
  - [ ] Feedback visual de carregamento/sucesso/erro
- [ ] Integrar com `configurarEventosInstituicaoEdit()`
  - [ ] Atualizar lógica existente para usar `edit_escolasDisponiveis` em vez de fixo
  - [ ] Remover linha 5811 que força "todas as escolas" sempre: `const todasEscolas = await window.NAVMEscolasTecnico.getEscolasUsuario(userEmail, userRole, true);`
  - [ ] Usar `edit_mostrandoTodasEscolas` como parâmetro
- [ ] Chamar `inicializarFiltroEscolasEdit()` ao abrir o modal

### INTEGRAÇÃO:
- [ ] Garantir que `assets/js/utils/escolas-tecnico.js` está carregado
- [ ] Testar com técnico logado (deve mostrar botão)
- [ ] Testar com estagiário/user logado (não deve mostrar botão)
- [ ] Testar toggle entre "Ver Todas" e "Minhas Escolas"
- [ ] Verificar se lista de escolas muda corretamente
- [ ] Confirmar que indicador visual atualiza corretamente
- [ ] Testar filtro por tipo (CMEI/EMEF) em ambos os modos

---

## 🔍 REGRAS DE LÓGICA

### QUEM VÊ O QUÊ:

| Tipo de Usuário | Comportamento |
|-----------------|---------------|
| **Estagiário / User** | Sempre vê TODAS as escolas. Botão NÃO aparece. |
| **Técnico** | Por padrão vê SUAS escolas atribuídas. Botão aparece para alternar. |
| **Admin / Superuser** | Sempre vê TODAS as escolas. Botão NÃO aparece. |

### ESTADOS DO BOTÃO:

| Estado | Texto | Ícone | Cor Indicador | Texto Indicador |
|--------|-------|-------|---------------|-----------------|
| Inicial (técnico) | "Ver Todas" | 🌐 | Verde | "Mostrando suas X escolas atribuídas" |
| Após toggle | "Minhas Escolas" | 👤 | Laranja | "Mostrando todas as X escolas" |

### PRIORIDADE DE IDENTIFICAÇÃO:

1. **Nome do usuário** (`userName` do sessionStorage) → `identificarTecnicoPorNome()`
2. **Email do usuário** (`userEmail` do sessionStorage) → `identificarTecnico()`
3. **Fallback**: Se não identificar, mostrar todas as escolas

---

## 🚨 PONTOS CRÍTICOS DE ATENÇÃO

### 1. ASYNC/AWAIT
A função `getEscolasUsuario()` é **ASSÍNCRONA**. Use `await`:
```javascript
edit_escolasDisponiveis = await window.NAVMEscolasTecnico.getEscolasUsuario(...);
```

### 2. CONFLITO COM LÓGICA EXISTENTE
No `configurarEventosInstituicaoEdit()` linha 5811, há:
```javascript
const todasEscolas = await window.NAVMEscolasTecnico.getEscolasUsuario(userEmail, userRole, true);
```
Este `true` força mostrar TODAS as escolas sempre. **MUDAR PARA**:
```javascript
const escolasFiltradas = await window.NAVMEscolasTecnico.getEscolasUsuario(
  userEmail, 
  userRole, 
  edit_mostrandoTodasEscolas, 
  userName
);
```

### 3. PRESERVAR VALOR AO CARREGAR EDIÇÃO
Quando o modal de edição abre com dados existentes, NÃO limpar o campo de escola. Use a flag `data-loading="true"`:
```javascript
cmeiEmefInput.setAttribute('data-loading', 'true');
// ... carrega dados ...
cmeiEmefInput.removeAttribute('data-loading');
```

### 4. ESCOPO DAS VARIÁVEIS
Use variáveis globais separadas (`edit_*`) para evitar conflitos com o modal de inserção.

---

## 📝 RESULTADO ESPERADO

Após a implementação, o modal de edição deve:

1. ✅ Exibir botão "Ver Todas Escolas" APENAS para técnicos
2. ✅ Inicialmente mostrar apenas as escolas do técnico logado
3. ✅ Ao clicar no botão, alternar para "Todas as escolas"
4. ✅ Botão muda para "Minhas Escolas" com ícone 👤
5. ✅ Indicador visual mostra estado atual (verde ou laranja)
6. ✅ Quantidade de escolas exibida de forma dinâmica
7. ✅ Filtro por tipo (CMEI/EMEF) funciona em ambos os modos
8. ✅ Campo de escola e região limpos ao alternar
9. ✅ Sistema idêntico ao modal de inserção

---

## 🧪 TESTE DE VALIDAÇÃO

### Cenário 1: Técnico Darison
1. Fazer login como usuário com nome "Darison"
2. Abrir modal de edição de um caso
3. ✅ Botão "Ver Todas" deve aparecer
4. ✅ Lista deve mostrar apenas 15 escolas (escolas do Darison)
5. ✅ Indicador: "Mostrando suas 15 escolas atribuídas"
6. Clicar em "Ver Todas"
7. ✅ Botão muda para "Minhas Escolas" com ícone 👤
8. ✅ Lista mostra todas as ~115 escolas
9. ✅ Indicador: "Mostrando todas as 115 escolas" (laranja)

### Cenário 2: Estagiário
1. Fazer login como estagiário
2. Abrir modal de edição
3. ✅ Botão NÃO deve aparecer
4. ✅ Lista mostra todas as escolas desde o início

### Cenário 3: Filtro por Tipo
1. Como técnico, selecionar "CMEI"
2. ✅ Indicador mostra: "Mostrando suas X escolas atribuídas (CMEI)"
3. Clicar em "Ver Todas"
4. ✅ Indicador: "Mostrando todas as Y escolas (CMEI)"
5. ✅ Quantidade muda corretamente

---

## 📚 REFERÊNCIAS RÁPIDAS

| Componente | Arquivo | Linha(s) |
|------------|---------|----------|
| HTML Referência | [registro-novo-caso.html](registro-novo-caso.html) | 2088-2114 |
| JS Inicialização | [registro-novo-caso.html](registro-novo-caso.html) | 4855-4920 |
| JS Toggle | [registro-novo-caso.html](registro-novo-caso.html) | 4925-4980 |
| JS Indicador | [registro-novo-caso.html](registro-novo-caso.html) | 4985-5010 |
| Módulo Escolas | [assets/js/utils/escolas-tecnico.js](assets/js/utils/escolas-tecnico.js) | 1-971 |
| Local Implementação | [gerenciar-casos.html](gerenciar-casos.html) | 3640-3660, 5900+ |
| CSS Autocomplete | [registro-novo-caso.html](registro-novo-caso.html) | 212-232 |
| Backend Supabase | [backend/Code-Supabase.gs](backend/Code-Supabase.gs) | 2147-2195 |

---

## 🎯 RESUMO EXECUTIVO

**O QUE FAZER:**
Copiar EXATAMENTE o sistema de filtro de escolas por técnico do modal de INSERÇÃO para o modal de EDIÇÃO.

**PRINCIPAIS MUDANÇAS:**
1. Adicionar botão "Ver Todas Escolas" no HTML
2. Adicionar indicador visual de filtro ativo
3. Implementar 4 funções JS com prefixo `Edit`
4. Atualizar `configurarEventosInstituicaoEdit()` para usar filtro dinâmico
5. Chamar `inicializarFiltroEscolasEdit()` ao abrir modal

**RESULTADO:**
Modal de edição com funcionalidade IDÊNTICA ao modal de inserção, permitindo técnicos alternarem entre suas escolas e todas as escolas.
