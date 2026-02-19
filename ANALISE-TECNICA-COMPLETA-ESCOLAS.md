# 📋 ANÁLISE TÉCNICA COMPLETA - SISTEMA DE ESCOLAS

## 📌 ÍNDICE
1. [Arquitetura do Sistema](#arquitetura)
2. [Banco de Dados Supabase](#banco-de-dados)
3. [Backend (Google Apps Script)](#backend)
4. [Frontend](#frontend)
5. [Fluxo de Dados Atual](#fluxo-atual)
6. [Problemas da Implementação Atual](#problemas)
7. [Estrutura de Dados Detalhada](#estrutura-dados)
8. [APIs Disponíveis](#apis)
9. [Plano de Implementação](#plano)

---

## 1. ARQUITETURA DO SISTEMA {#arquitetura}

### Stack Tecnológico
```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND                              │
│  • HTML5 + JavaScript Vanilla                           │
│  • TailwindCSS (estilização)                            │
│  • Módulos JavaScript customizados                      │
│  • sessionStorage para autenticação                     │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ HTTPS (fetch/UrlFetchApp)
                   │
┌──────────────────▼──────────────────────────────────────┐
│              BACKEND (GOOGLE APPS SCRIPT)               │
│  • Code.gs (gestão de casos/planilhas)                 │
│  • Code-Supabase.gs (autenticação + CRUD usuários)     │
│  • doPost/doGet endpoints                               │
│  • Integração com Google Sheets                        │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ REST API
                   │
┌──────────────────▼──────────────────────────────────────┐
│                SUPABASE (PostgreSQL)                    │
│  • app_users (usuários)                                 │
│  • technician_schools (escolas x técnicos)             │
│  • password_reset_tokens                                │
│  • notifications_ids                                    │
│  • system_updates                                       │
└─────────────────────────────────────────────────────────┘
```

### Fluxo de Autenticação
```
1. Usuário faz login → Frontend envia credenciais
2. Backend valida em app_users (Supabase)
3. Retorna: { id, email, nome, role }
4. Frontend armazena em sessionStorage
5. Todas as requisições incluem o contexto do usuário
```

---

## 2. BANCO DE DADOS SUPABASE {#banco-de-dados}

### Tabela: `app_users`
Armazena todos os usuários do sistema com seus papéis.

```sql
CREATE TABLE app_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_uid UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  password_text TEXT NOT NULL,
  nome TEXT NOT NULL UNIQUE,  -- ⚠️ CRÍTICO: Nome único do usuário
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enum de roles
CREATE TYPE user_role AS ENUM (
  'superuser',     -- Acesso total
  'admin',         -- Gerencia usuários (exceto superuser)
  'tecnico',       -- Técnico com escolas atribuídas
  'estagiario',    -- Acesso a todas as escolas (sem restrição)
  'visualizador'   -- Apenas visualização
);
```

**Índices:**
- `idx_app_users_email` - Busca por email (login)
- `idx_app_users_nome_unique` - Nome único case-insensitive
- `idx_app_users_role` - Filtragem por papel

**Constraints:**
- Email único (case-sensitive)
- Nome único (case-insensitive via índice)
- Role obrigatório

---

### Tabela: `technician_schools`
Relacionamento N:N entre técnicos e escolas.

```sql
CREATE TABLE technician_schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES app_users(id) ON DELETE CASCADE,  -- FK técnico
  school_name TEXT NOT NULL,         -- Nome completo da escola
  school_type TEXT CHECK (school_type IN ('CMEI', 'EMEF')),  -- Tipo
  school_region TEXT,                -- Região geográfica
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  assigned_by UUID REFERENCES app_users(id) ON DELETE SET NULL,
  
  -- Previne duplicatas
  CONSTRAINT unique_user_school UNIQUE(user_id, school_name)
);
```

**Índices Importantes:**
```sql
-- Busca escolas de um técnico (query mais comum)
CREATE INDEX idx_technician_schools_user_id 
ON technician_schools(user_id);

-- Busca técnico responsável por escola
CREATE INDEX idx_technician_schools_school_name 
ON technician_schools(school_name);

-- Filtra por tipo (CMEI/EMEF)
CREATE INDEX idx_technician_schools_school_type 
ON technician_schools(school_type);

-- Consultas compostas (técnico + tipo)
CREATE INDEX idx_technician_schools_user_type 
ON technician_schools(user_id, school_type);
```

**Relacionamentos:**
- `user_id` → `app_users.id` (ON DELETE CASCADE)
- `assigned_by` → `app_users.id` (ON DELETE SET NULL)

**Políticas RLS (Row Level Security):**
- SELECT: Permitido para `authenticated` e `anon`
- INSERT/UPDATE/DELETE: Apenas `service_role` (segurança por app)

---

### Estrutura de Dados de Escola

```javascript
// Modelo no Backend (Supabase)
{
  "id": "uuid",
  "user_id": "uuid-do-tecnico",          // NULL = sem técnico
  "school_name": "EMEF Arthur da Costa", // Nome completo
  "school_type": "EMEF",                 // CMEI ou EMEF
  "school_region": "Centro",             // Região geográfica
  "assigned_at": "2026-01-15T10:30:00Z",
  "assigned_by": "uuid-do-admin"
}

// Modelo no Frontend (esperado pelo escolas-tecnico.js)
{
  "nomeOriginal": "EMEF Arthur da Costa",
  "tipo": "EMEF",
  "regiao": "Centro",
  "sigla": "EMEF Arthur" // Gerado dinamicamente
}
```

---

## 3. BACKEND (GOOGLE APPS SCRIPT) {#backend}

### Arquivos Principais

#### `Code-Supabase.gs`
Responsável por autenticação e gerenciamento de usuários/escolas.

**Configurações:**
```javascript
const SUPABASE_URL = 'https://aepdbpkrkokcnhfljury.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGci...'; // Anon key (frontend safe)
const SUPABASE_SERVICE_KEY = 'REPLACE_ME'; // Service role (backend only)
```

**Função Principal - doPost():**
```javascript
function doPost(e) {
  const dados = JSON.parse(e.parameter.data || e.postData.contents);
  const action = dados.action;
  
  switch(action) {
    case 'login': return realizarLogin(dados.email, dados.password);
    case 'list_technician_schools': return listarEscolasTecnico(dados.user_id);
    case 'list_assigned_schools': return listarTodasEscolasAtribuidas();
    case 'save_technician_schools': return salvarEscolasTecnico(...);
    case 'delete_technician_schools': return deletarEscolasTecnico(...);
    case 'get_all_available_schools': return obterEscolasDisponiveisSemTecnico();
    // ... outras actions
  }
}
```

---

### APIs de Escolas (Backend)

#### 1. `listarEscolasTecnico(userId)`
**Descrição:** Retorna todas as escolas atribuídas a um técnico específico.

**Request:**
```javascript
{
  "action": "list_technician_schools",
  "user_id": "uuid-do-tecnico"
}
```

**Response:**
```javascript
{
  "sucesso": true,
  "data": [
    {
      "id": "uuid",
      "school_name": "EMEF Arthur da Costa",
      "school_type": "EMEF",
      "school_region": "Centro",
      "assigned_at": "2026-01-15T10:30:00Z"
    }
  ],
  "total": 1
}
```

**Query SQL Gerada:**
```sql
SELECT id, school_name, school_type, school_region, assigned_at
FROM technician_schools
WHERE user_id = ?
ORDER BY school_name ASC
```

---

#### 2. `listarTodasEscolasAtribuidas()`
**Descrição:** Retorna TODAS as escolas que têm técnico atribuído.

**Request:**
```javascript
{
  "action": "list_assigned_schools"
}
```

**Response:**
```javascript
{
  "sucesso": true,
  "data": [
    {
      "school_name": "EMEF Arthur da Costa",
      "school_type": "EMEF",
      "school_region": "Centro",
      "user_id": "uuid-do-tecnico"
    }
  ],
  "total": 97
}
```

**Query SQL:**
```sql
SELECT school_name, school_type, school_region, user_id
FROM technician_schools
WHERE user_id IS NOT NULL
```

---

#### 3. `obterEscolasDisponiveisSemTecnico()`
**Descrição:** Retorna escolas órfãs (sem técnico atribuído).

**Request:**
```javascript
{
  "action": "get_all_available_schools"
}
```

**Response:**
```javascript
{
  "sucesso": true,
  "data": [
    {
      "school_name": "CMEI Nova Escola",
      "school_type": "CMEI",
      "school_region": "São Pedro"
    }
  ],
  "total": 5
}
```

**Query SQL:**
```sql
SELECT school_name, school_type, school_region
FROM technician_schools
WHERE user_id IS NULL
```

---

#### 4. `salvarEscolasTecnico(userId, schools, callerRole, callerId)`
**Descrição:** Atribui múltiplas escolas a um técnico (substituição completa).

**Lógica:**
1. Valida permissões (apenas admin/superuser)
2. Remove todas as escolas atuais do técnico
3. Insere novas atribuições
4. Registra em `system_updates`

**Request:**
```javascript
{
  "action": "save_technician_schools",
  "user_id": "uuid-do-tecnico",
  "schools": [
    {
      "school_name": "EMEF Arthur da Costa",
      "school_type": "EMEF",
      "school_region": "Centro"
    }
  ],
  "caller_role": "admin",
  "caller_id": "uuid-do-admin"
}
```

**Response:**
```javascript
{
  "sucesso": true,
  "mensagem": "Escolas atualizadas com sucesso",
  "total_atribuidas": 15
}
```

---

#### 5. `getTechnicianSchoolsForCache()`
**Descrição:** Retorna escolas agrupadas por técnico para cache no frontend.

**Response:**
```javascript
{
  "sucesso": true,
  "data": {
    "Amelinha": [
      { "nomeOriginal": "EMEF Aristóbulo", "tipo": "EMEF", "regiao": "Forte São João" }
    ],
    "Darison": [
      { "nomeOriginal": "CMEI Carlos Alberto", "tipo": "CMEI", "regiao": "São Pedro" }
    ]
  }
}
```

**Implementação Interna:**
```javascript
// 1. Busca todas as escolas atribuídas
SELECT school_name, school_type, school_region, user_id
FROM technician_schools
WHERE user_id IS NOT NULL

// 2. Busca nomes dos técnicos
SELECT id, nome FROM app_users

// 3. Agrupa escolas por nome do técnico
{
  "nome_tecnico": [array_de_escolas]
}
```

---

## 4. FRONTEND {#frontend}

### Arquivos JavaScript Relevantes

#### `assets/js/utils/escolas-tecnico.js`
**Módulo:** `window.NAVMEscolasTecnico`

**Responsabilidades:**
1. ✅ Armazenar lista hardcoded de escolas (fallback)
2. ✅ Cache de dados do Supabase
3. ✅ Filtrar escolas por técnico/role
4. ✅ Filtrar por tipo (CMEI/EMEF)
5. ✅ Identificar técnico por email ou nome
6. ✅ Obter região de uma escola

**Estrutura Hardcoded Atual:**
```javascript
const ESCOLAS_AMELINHA = [
  { nomeOriginal: "EMEF Aristóbulo", tipo: "EMEF", regiao: "Forte São João" },
  // ... 13 escolas
];

const ESCOLAS_POR_TECNICO = {
  'amelinha': ESCOLAS_AMELINHA,
  'libna': ESCOLAS_LIBNA,
  // ... 8 técnicos
};

const TODAS_ESCOLAS = [
  ...ESCOLAS_AMELINHA,
  ...ESCOLAS_LIBNA,
  // ... todas as escolas (97 no total)
];
```

**API Pública do Módulo:**
```javascript
window.NAVMEscolasTecnico = {
  // PRINCIPAIS
  getEscolasUsuario(emailOuNome, role, verTodas, nome),
  getRegiaoEscola(nomeEscola),
  identificarTecnico(email),
  identificarTecnicoPorNome(nome),
  
  // AUXILIARES
  podeVerTodasEscolas(role),
  isEstagiario(role),
  getRegioes(),
  filtrarPorTipo(escolas, tipo),
  filtrarPorRegiao(escolas, regiao),
  
  // SUPABASE
  carregarEscolasDeSupabase(),  // Promise<boolean>
  getEscolasDoCache(nomeTecnico), // Array<Escola> | null
  
  // DADOS
  TODAS_ESCOLAS,
  ESCOLAS_POR_TECNICO
};
```

---

#### Função Crítica: `getEscolasUsuario()`

**Assinatura:**
```javascript
getEscolasUsuario(emailOuNome, role, verTodas = false, nome = null)
```

**Lógica de Priorização:**
```
1. Se role = 'estagiario' → retorna TODAS_ESCOLAS
2. Se role = 'admin' ou 'superuser' → retorna TODAS_ESCOLAS
3. Se role = 'tecnico':
   a. Se verTodas = true → retorna TODAS_ESCOLAS
   b. Tenta buscar do cache Supabase (prioriza nome > email)
   c. Se não encontrar, usa fallback hardcoded
   d. Identifica pelo nome → email → fallback
4. Outros roles → retorna TODAS_ESCOLAS
```

**Exemplo de Uso:**
```javascript
const userEmail = sessionStorage.getItem('userEmail');
const userRole = sessionStorage.getItem('userRole');
const userName = sessionStorage.getItem('userName');

const escolas = window.NAVMEscolasTecnico.getEscolasUsuario(
  userEmail,  // "amelinha@tecnico.vitoria.es.gov.br"
  userRole,   // "tecnico"
  false,      // mostrandoTodasEscolas
  userName    // "Amelinha" ⚠️ PRIORIDADE
);
// Retorna: Array de 13 escolas da Amelinha
```

---

#### `registro-novo-caso.html`
**Elementos HTML:**

```html
<!-- Seletor de Tipo -->
<select id="tipoInstituicao" name="tipoInstituicao" required>
  <option value="">Selecione o tipo...</option>
  <option value="CMEI">CMEI - Centro Municipal de Educação Infantil</option>
  <option value="EMEF">EMEF - Escola Municipal de Ensino Fundamental</option>
</select>

<!-- Input de Escola (Autocomplete) -->
<input type="text" id="cmeiEmef" name="cmeiEmef" required disabled 
       placeholder="Primeiro selecione o tipo de instituição">
<div class="autocomplete-list" id="autocompleteList"></div>

<!-- Botão Ver Todas (Técnicos) -->
<div id="filtro-escolas-container" class="hidden">
  <button type="button" id="btnVerTodasEscolas">
    <span id="btnVerTodasIcone">🌐</span>
    <span id="btnVerTodasText">Ver Todas</span>
  </button>
</div>

<!-- Campo de Região (Auto-preenchido) -->
<input type="text" id="regiao-display" readonly>
<input type="hidden" id="regiao" name="regiao" required>
```

**JavaScript - Gerenciamento de Estado:**
```javascript
// Estado global
let tipoSelecionado = null;
let instituicoesFiltradas = [];
let escolasDisponiveis = [];
let mostrandoTodasEscolas = false;

// Listener do tipo de instituição
tipoInstituicaoSelect.addEventListener('change', function() {
  tipoSelecionado = this.value;
  
  if (tipoSelecionado) {
    // Filtra escolas pelo tipo
    instituicoesFiltradas = getInstituicoesFiltradas(tipoSelecionado);
    
    // Habilita input de escola
    cmeiEmefInput.disabled = false;
    cmeiEmefInput.placeholder = `Digite o nome da ${tipoSelecionado}...`;
  }
});
```

**Função de Filtragem:**
```javascript
function getInstituicoesFiltradas(tipo) {
  const userEmail = sessionStorage.getItem('userEmail');
  const userRole = sessionStorage.getItem('userRole');
  const userName = sessionStorage.getItem('userName');
  
  // Carrega escolas baseado no contexto do usuário
  if (escolasDisponiveis.length === 0) {
    escolasDisponiveis = window.NAVMEscolasTecnico.getEscolasUsuario(
      userEmail, 
      userRole, 
      mostrandoTodasEscolas, 
      userName  // ⚠️ PRIORIDADE
    );
  }
  
  // Filtra por tipo
  return escolasDisponiveis.filter(inst => inst.tipo === tipo);
}
```

---

### Sistema de Autocomplete

**Implementação Atual:**
```javascript
// 1. Usuário digita no campo
cmeiEmefInput.addEventListener('input', function() {
  const query = this.value.toLowerCase();
  
  if (query.length < 2) {
    autocompleteList.style.display = 'none';
    return;
  }
  
  // 2. Filtra escolas
  const matches = instituicoesFiltradas.filter(escola => 
    escola.nomeOriginal.toLowerCase().includes(query)
  );
  
  // 3. Renderiza sugestões
  renderizarSugestoes(matches);
});

// 4. Usuário seleciona escola
function selecionarEscola(escola) {
  cmeiEmefInput.value = escola.nomeOriginal;
  
  // Auto-preenche região
  const regiao = window.NAVMEscolasTecnico.getRegiaoEscola(escola.nomeOriginal);
  document.getElementById('regiao-display').value = regiao;
  document.getElementById('regiao').value = regiao;
  
  // Fecha autocomplete
  autocompleteList.style.display = 'none';
}
```

---

## 5. FLUXO DE DADOS ATUAL {#fluxo-atual}

### Cenário 1: Técnico Inserindo Novo Caso

```
1. Técnico faz login
   └─> Backend retorna: { id, email, nome: "Amelinha", role: "tecnico" }
   └─> Frontend armazena em sessionStorage

2. Acessa "Inserir Novo Caso"
   └─> registro-novo-caso.html carrega
   └─> Executa: inicializarFiltroEscolas()
   
3. inicializarFiltroEscolas() faz:
   a. Lê sessionStorage: { userName: "Amelinha", userRole: "tecnico" }
   b. Chama: NAVMEscolasTecnico.getEscolasUsuario("...", "tecnico", false, "Amelinha")
   c. Módulo retorna: 13 escolas da Amelinha (hardcoded)
   d. Armazena em: escolasDisponiveis = [...]
   e. Mostra botão "Ver Todas" (apenas técnicos)
   f. Atualiza indicador: "Mostrando suas 13 escolas atribuídas"

4. Técnico seleciona tipo: "EMEF"
   └─> Filtra: escolasDisponiveis.filter(e => e.tipo === "EMEF")
   └─> instituicoesFiltradas = [5 EMEFs da Amelinha]
   └─> Habilita campo cmeiEmef

5. Técnico digita: "Aristóbulo"
   └─> Autocomplete filtra: instituicoesFiltradas
   └─> Mostra: "EMEF Aristóbulo Barbosa Leão"
   
6. Técnico seleciona escola
   └─> Auto-preenche região: "Forte São João"
   
7. Técnico pode clicar "Ver Todas"
   └─> toggleVerTodasEscolas()
   └─> escolasDisponiveis = TODAS_ESCOLAS (97 escolas)
   └─> Recalcula instituicoesFiltradas
```

---

### Cenário 2: Estagiário Inserindo Novo Caso

```
1. Estagiário faz login
   └─> Backend retorna: { id, email, nome: "João", role: "estagiario" }

2. Acessa "Inserir Novo Caso"
   └─> inicializarFiltroEscolas()
   
3. Módulo detecta role = "estagiario"
   └─> getEscolasUsuario() retorna TODAS_ESCOLAS (97 escolas)
   └─> Não mostra botão "Ver Todas" (não é técnico)
   └─> escolasDisponiveis = [97 escolas]

4. Seleciona tipo: "CMEI"
   └─> Filtra: todas as 45 CMEIs da rede
   
5. Pode selecionar qualquer escola sem restrição
```

---

## 6. PROBLEMAS DA IMPLEMENTAÇÃO ATUAL {#problemas}

### 🚨 Problema 1: Lista Hardcoded no Frontend

**Localização:** `assets/js/utils/escolas-tecnico.js`

**Manifestação:**
```javascript
// Linhas 23-38
const ESCOLAS_AMELINHA = [
  { nomeOriginal: "EMEF Aristóbulo Barbosa Leão", tipo: "EMEF", regiao: "Forte São João" },
  // ... hardcoded
];

// Linhas 178-189
const ESCOLAS_POR_TECNICO = {
  'amelinha': ESCOLAS_AMELINHA,
  'libna': ESCOLAS_LIBNA,
  // ... hardcoded
};
```

**Impactos:**
- ❌ Escola criada → precisa alterar código JS
- ❌ Nome alterado → descasamento frontend/backend
- ❌ Técnico reatribuído → dados desatualizados
- ❌ Deploy necessário a cada mudança administrativa
- ❌ Risco de inconsistência entre ambientes
- ❌ Sem controle de versão de dados (dados = código)

---

### 🚨 Problema 2: Identificação de Técnico por Nome/Email

**Função Problemática:**
```javascript
// Linha 227
function identificarTecnicoPorNome(nome) {
  const nomeNorm = normalizar(nome);
  
  // Busca exata
  for (const tecnico of Object.keys(ESCOLAS_POR_TECNICO)) {
    if (nomeNorm === tecnico) {
      return tecnico;  // "amelinha"
    }
  }
  
  // Busca parcial (fallback perigoso)
  for (const tecnico of Object.keys(ESCOLAS_POR_TECNICO)) {
    if (nomeNorm.includes(tecnico) || tecnico.includes(nomeNorm)) {
      return tecnico;
    }
  }
  
  return null;  // ❌ Falha silenciosa
}
```

**Problemas:**
1. **Dependência de string matching:**
   - Nome "Amelinha Santos" pode não casar com chave "amelinha"
   - Nomes compostos (ex: "Carla Maria") → alias duplicado
   
2. **Fallback perigoso:**
   - "Maria Silva" pode casar com chave "maria"
   - "Joselma Santos" casa com "joselma"
   - Comportamento não determinístico

3. **Sem garantia de unicidade:**
   - Dois técnicos com "Maria" no nome
   - Sistema escolhe arbitrariamente

4. **Falha silenciosa:**
   - `return null` → frontend mostra lista vazia
   - Nenhum erro lançado
   - UX ruim

---

### 🚨 Problema 3: Sincronização Manual

**Onde ocorre:**
```javascript
// Backend tem 97 escolas no Supabase
// Frontend tem 97 escolas hardcoded

// ❓ Como garantir que são as MESMAS 97?
// ❓ Como detectar divergências?
// ❓ Quem é a fonte da verdade?
```

**Cenário de Falha Real:**
1. Admin adiciona "CMEI Nova Escola" no gerenciador (Supabase)
2. Técnico Amelinha recebe atribuição
3. Amelinha tenta inserir caso → escola não aparece (frontend desatualizado)
4. Desenvolvedor precisa:
   - Editar `escolas-tecnico.js`
   - Adicionar escola em `ESCOLAS_AMELINHA`
   - Adicionar escola em `TODAS_ESCOLAS`
   - Fazer commit, push, deploy
   - Limpar cache dos navegadores dos usuários

---

### 🚨 Problema 4: Cache do Supabase Não Utilizado

**Código existente mas não prioritário:**
```javascript
// Linha 499 - Função existe!
async function carregarEscolasDeSupabase() {
  try {
    const response = await fetch(`${APPS_SCRIPT_URL}?action=get_technician_schools_for_cache`);
    const resultado = await response.json();
    
    if (resultado.sucesso && resultado.data) {
      escolasPorTecnicoDB = resultado.data;  // ✅ CACHE ATUALIZADO
      cacheCarregado = true;
      usandoFallback = false;
      return true;
    }
  } catch (erro) {
    usandoFallback = true;  // ❌ FALLBACK HARDCODED
    return false;
  }
}
```

**Problema:**
- Linha 346-356: Tentativa de usar cache
- Linha 379-424: Fallback sempre acontece
- **O fallback é SEMPRE usado por falta de configuração correta**

---

### 🚨 Problema 5: Falta de Feedback ao Usuário

**Quando cache falha:**
```javascript
// Linha 381
console.warn('[EscolasTecnico] ⚠️ Cache Supabase ativo, mas técnico não encontrado');
console.log('[EscolasTecnico] ℹ️ Tentando fallback para dados hardcoded...');

// ❌ Usuário NÃO VÊ nada disso!
// ❌ Sistema silenciosamente usa dados desatualizados
// ❌ Nenhum alerta, modal ou indicador visual
```

**Impacto UX:**
- Técnico vê escolas antigas (desatribuídas)
- Técnico não vê escolas novas (atribuídas)
- Comportamento inconsistente entre sessões
- Dificulta suporte/debug

---

## 7. ESTRUTURA DE DADOS DETALHADA {#estrutura-dados}

### Tabela technician_schools - Estado Atual

**Distribuição Real (97 escolas):**
```sql
SELECT 
  u.nome as tecnico,
  COUNT(ts.id) as total,
  STRING_AGG(DISTINCT ts.school_type, ', ') as tipos
FROM technician_schools ts
JOIN app_users u ON ts.user_id = u.id
GROUP BY u.nome
ORDER BY u.nome;
```

**Resultado:**
```
tecnico    | total | tipos
-----------|-------|------------
Amelinha   | 13    | CMEI, EMEF
Darison    | 13    | CMEI, EMEF
Joselma    | 10    | CMEI, EMEF
Katiane    | 8     | CMEI, EMEF
Libna      | 13    | CMEI
Maria      | 13    | CMEI, EMEF
Rosangela  | 16    | CMEI, EMEF
Sílvia     | 11    | CMEI, EMEF
```

---

### Mapeamento Username → Nome do Técnico

**Problema:** Frontend precisa mapear email/nome para buscar no cache.

**Solução Atual (Hardcoded):**
```javascript
// Linha 178-189
const ESCOLAS_POR_TECNICO = {
  'amelinha': ESCOLAS_AMELINHA,  // ⚠️ Chave lowercase
  'libna': ESCOLAS_LIBNA,
  'rosangela': ESCOLAS_ROSANGELA,
  'darison': ESCOLAS_DARISON,
  'carla': ESCOLAS_CARLA_MARIA,
  'maria': ESCOLAS_CARLA_MARIA,  // ⚠️ Alias duplicado
  'joselma': ESCOLAS_JOSELMA,
  'silvia': ESCOLAS_SILVIA,
  'katiane': ESCOLAS_KATIANE
};
```

**Solução Ideal (Database-driven):**
```javascript
// Cache retornado pela API getTechnicianSchoolsForCache()
{
  "Amelinha": [...],  // ✅ Chave = nome exato do app_users.nome
  "Darison": [...],
  "Joselma": [...],
  "Katiane": [...],
  "Libna": [...],
  "Maria": [...],     // ✅ Nome único
  "Rosangela": [...],
  "Sílvia": [...]
}
```

---

### Campos Obrigatórios vs Opcionais

**Backend (technician_schools):**
```
OBRIGATÓRIOS:
- id (gerado automaticamente)
- school_name (NOT NULL)
- school_type (NOT NULL + CHECK)

OPCIONAIS:
- user_id (FK, pode ser NULL = escola órfã)
- school_region (pode ser NULL)
- assigned_at (default NOW())
- assigned_by (FK, pode ser NULL)
```

**Frontend (NAVMEscolasTecnico):**
```javascript
// Esperado por registro-novo-caso.html
{
  nomeOriginal: string,  // OBRIGATÓRIO
  tipo: "CMEI" | "EMEF", // OBRIGATÓRIO
  regiao: string,        // OBRIGATÓRIO (auto-preenchimento)
  sigla?: string         // Gerado dinamicamente
}
```

**Conversão Backend → Frontend:**
```javascript
function converterEscolaBackendParaFrontend(escolaDB) {
  return {
    nomeOriginal: escolaDB.school_name,
    tipo: escolaDB.school_type,
    regiao: escolaDB.school_region || 'Região não definida',  // ⚠️ Fallback
    sigla: gerarSigla(escolaDB.school_name)
  };
}
```

---

## 8. APIs DISPONÍVEIS {#apis}

### Resumo de Endpoints

| Endpoint | Método | Autenticação | Descrição |
|----------|--------|--------------|-----------|
| `/exec?action=list_technician_schools` | POST | ✅ | Lista escolas de um técnico |
| `/exec?action=list_assigned_schools` | POST | ✅ | Lista todas as escolas atribuídas |
| `/exec?action=get_all_available_schools` | POST | ✅ | Lista escolas sem técnico |
| `/exec?action=save_technician_schools` | POST | ✅ Admin | Atribui escolas a técnico |
| `/exec?action=delete_technician_schools` | POST | ✅ Admin | Remove atribuições |
| `/exec?action=get_technician_schools_for_cache` | GET | ❌ | Cache agrupado por técnico |

---

### Exemplo Completo: Buscar Escolas de um Técnico

**Frontend:**
```javascript
async function buscarEscolasTecnico(userId) {
  const response = await fetch(CONFIG.APPS_SCRIPT_AUTH, {
    method: 'POST',
    body: new URLSearchParams({
      data: JSON.stringify({
        action: 'list_technician_schools',
        user_id: userId
      })
    })
  });
  
  const resultado = await response.json();
  
  if (resultado.sucesso) {
    // Converte formato backend → frontend
    return resultado.data.map(escola => ({
      nomeOriginal: escola.school_name,
      tipo: escola.school_type,
      regiao: escola.school_region
    }));
  }
  
  throw new Error(resultado.mensagem);
}
```

**Backend (Code-Supabase.gs):**
```javascript
function listarEscolasTecnico(userId) {
  const url = `${SUPABASE_URL}/rest/v1/technician_schools?user_id=eq.${userId}&select=id,school_name,school_type,school_region,assigned_at&order=school_name.asc`;
  
  const response = UrlFetchApp.fetch(url, {
    method: 'get',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  
  const escolas = JSON.parse(response.getContentText());
  
  return {
    sucesso: true,
    data: escolas,
    total: escolas.length
  };
}
```

---

## 9. PLANO DE IMPLEMENTAÇÃO {#plano}

### 🎯 Objetivo Final
Eliminar completamente o hardcode e usar Supabase como única fonte da verdade.

---

### FASE 1: Preparação e Análise

#### Tarefa 1.1: Auditoria de Dados
```sql
-- Verificar integridade das escolas
SELECT 
  COUNT(*) as total_escolas,
  COUNT(DISTINCT school_name) as nomes_unicos,
  COUNT(CASE WHEN user_id IS NULL THEN 1 END) as orfas,
  COUNT(CASE WHEN school_region IS NULL THEN 1 END) as sem_regiao
FROM technician_schools;

-- Verificar se todos os técnicos têm escolas
SELECT 
  u.id, 
  u.nome, 
  u.email, 
  COUNT(ts.id) as total_escolas
FROM app_users u
LEFT JOIN technician_schools ts ON u.id = ts.user_id
WHERE u.role = 'tecnico'
GROUP BY u.id, u.nome, u.email
ORDER BY u.nome;
```

**Checklist:**
- [ ] Verificar se `app_users.nome` está preenchido para todos
- [ ] Verificar se todos os técnicos têm pelo menos 1 escola
- [ ] Validar se `school_region` está preenchido (ou aceitar NULL)
- [ ] Confirmar unicidade de `app_users.nome` (índice único)

---

#### Tarefa 1.2: Criar API de Busca por Técnico

**Backend - Nova função em Code-Supabase.gs:**
```javascript
/**
 * Busca escolas de um técnico pelo NOME (case-insensitive)
 * @param {string} nomeTecnico - Nome exato do técnico (ex: "Amelinha")
 * @returns {object} { sucesso, data: [escolas], total }
 */
function buscarEscolasPorNomeTecnico(nomeTecnico) {
  try {
    // 1. Busca o UUID do técnico pelo nome
    const urlUsuario = `${SUPABASE_URL}/rest/v1/app_users?nome=ilike.${encodeURIComponent(nomeTecnico)}&role=eq.tecnico&select=id,nome`;
    
    const responseUsuario = UrlFetchApp.fetch(urlUsuario, {
      method: 'get',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      muteHttpExceptions: true
    });
    
    const usuarios = JSON.parse(responseUsuario.getContentText());
    
    if (usuarios.length === 0) {
      return {
        sucesso: false,
        mensagem: 'Técnico não encontrado: ' + nomeTecnico
      };
    }
    
    const tecnicoId = usuarios[0].id;
    
    // 2. Busca escolas atribuídas ao técnico
    return listarEscolasTecnico(tecnicoId);
    
  } catch (erro) {
    Logger.log('Erro em buscarEscolasPorNomeTecnico: ' + erro);
    return {
      sucesso: false,
      mensagem: 'Erro ao buscar escolas: ' + erro.message
    };
  }
}
```

**Adicionar no switch do doPost:**
```javascript
case 'get_schools_by_technician_name':
  resultado = buscarEscolasPorNomeTecnico(dados.nome_tecnico);
  break;
```

---

### FASE 2: Refatoração do Frontend

#### Tarefa 2.1: Modificar escolas-tecnico.js

**Objetivo:** Fazer cache Supabase ser PRIORITÁRIO, fallback apenas como segurança.

**Modificações:**

```javascript
// ANTES (Linha 346-424)
function getEscolasUsuario(emailOuNome, role, verTodas = false, nome = null) {
  // ... lógica complexa com fallback sempre usado
}

// DEPOIS
async function getEscolasUsuario(emailOuNome, role, verTodas = false, nome = null) {
  // 1. Estagiários/Admins → todas
  if (isEstagiario(role) || role === 'admin' || role === 'superuser') {
    return [...TODAS_ESCOLAS].sort((a, b) => a.nomeOriginal.localeCompare(b.nomeOriginal));
  }
  
  // 2. Técnicos com "Ver Todas" ativo
  if (role === 'tecnico' && verTodas) {
    return [...TODAS_ESCOLAS].sort((a, b) => a.nomeOriginal.localeCompare(b.nomeOriginal));
  }
  
  // 3. Técnicos → PRIORIZA CACHE SUPABASE
  if (role === 'tecnico') {
    // 3.1 Tenta buscar do cache (se já carregado)
    if (cacheCarregado && !usandoFallback) {
      const escolasDB = getEscolasDoCache(nome || emailOuNome);
      if (escolasDB && escolasDB.length > 0) {
        console.log(`✅ [DB] Retornando ${escolasDB.length} escolas do Supabase`);
        return [...escolasDB].sort((a, b) => a.nomeOriginal.localeCompare(b.nomeOriginal));
      }
    }
    
    // 3.2 Se cache não carregou ainda, tenta carregar agora
    if (!cacheCarregado) {
      console.log('⏳ Cache não carregado, tentando buscar agora...');
      const carregou = await carregarEscolasDeSupabase();
      
      if (carregou) {
        const escolasDB = getEscolasDoCache(nome || emailOuNome);
        if (escolasDB && escolasDB.length > 0) {
          console.log(`✅ [DB] Retornando ${escolasDB.length} escolas (carregamento tardio)`);
          return [...escolasDB].sort((a, b) => a.nomeOriginal.localeCompare(b.nomeOriginal));
        }
      }
    }
    
    // 3.3 ÚLTIMO RECURSO: Fallback hardcoded
    console.warn('⚠️ [FALLBACK] Usando dados hardcoded');
    mostrarAvisoFallback(); // ⚠️ NOVA FUNÇÃO PARA ALERTAR USUÁRIO
    
    const tecnico = identificarTecnicoPorNome(nome) || identificarTecnico(emailOuNome);
    if (tecnico && ESCOLAS_POR_TECNICO[tecnico]) {
      return [...ESCOLAS_POR_TECNICO[tecnico]].sort((a, b) => a.nomeOriginal.localeCompare(b.nomeOriginal));
    }
    
    // 3.4 Falha total
    console.error('❌ Técnico não identificado e cache indisponível');
    return [];
  }
  
  // 4. Outros roles → todas
  return [...TODAS_ESCOLAS].sort((a, b) => a.nomeOriginal.localeCompare(b.nomeOriginal));
}
```

---

#### Tarefa 2.2: Adicionar Indicadores Visuais de Fallback

**Nova função:**
```javascript
/**
 * Mostra alerta discreto quando fallback é usado
 */
function mostrarAvisoFallback() {
  const banner = document.createElement('div');
  banner.id = 'aviso-fallback';
  banner.className = 'fixed top-16 right-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-lg z-50 max-w-md';
  banner.innerHTML = `
    <div class="flex items-start">
      <span class="text-2xl mr-3">⚠️</span>
      <div>
        <p class="font-bold">Modo Offline</p>
        <p class="text-sm">Usando dados locais. Algumas escolas podem estar desatualizadas.</p>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" class="ml-3 text-yellow-700 hover:text-yellow-900">✕</button>
    </div>
  `;
  
  document.body.appendChild(banner);
  
  // Auto-remove após 10 segundos
  setTimeout(() => banner.remove(), 10000);
}
```

---

#### Tarefa 2.3: Atualizar Inicialização

**Modificar DOMContentLoaded:**
```javascript
// ANTES (Linha 572-580)
document.addEventListener('DOMContentLoaded', async () => {
  console.log('[EscolasTecnico] 🚀 Iniciando carregamento automático do cache Supabase...');
  
  try {
    const sucesso = await window.NAVMEscolasTecnico.carregarEscolasDeSupabase();
    
    if (sucesso) {
      console.log('[EscolasTecnico] ✅ Cache Supabase carregado com sucesso na inicialização');
    } else {
      console.warn('[EscolasTecnico] ⚠️ Falha ao carregar cache Supabase - usando fallback hardcoded');
    }
  } catch (erro) {
    console.error('[EscolasTecnico] ❌ Erro na inicialização do cache:', erro);
  }
});

// DEPOIS
document.addEventListener('DOMContentLoaded', async () => {
  console.log('[EscolasTecnico] 🚀 Iniciando carregamento do cache Supabase...');
  
  // Mostra indicador de carregamento
  const statusIndicador = document.getElementById('status-cache-escolas');
  if (statusIndicador) {
    statusIndicador.textContent = '⏳ Carregando escolas...';
    statusIndicador.className = 'text-blue-600 text-xs';
  }
  
  try {
    const sucesso = await window.NAVMEscolasTecnico.carregarEscolasDeSupabase();
    
    if (sucesso) {
      console.log('[EscolasTecnico] ✅ Cache OK');
      if (statusIndicador) {
        statusIndicador.textContent = '✅ Escolas atualizadas';
        statusIndicador.className = 'text-green-600 text-xs';
        setTimeout(() => statusIndicador.style.display = 'none', 3000);
      }
    } else {
      console.warn('[EscolasTecnico] ⚠️ Falha - usando fallback');
      if (statusIndicador) {
        statusIndicador.textContent = '⚠️ Modo offline';
        statusIndicador.className = 'text-yellow-600 text-xs';
      }
    }
  } catch (erro) {
    console.error('[EscolasTecnico] ❌ Erro:', erro);
    if (statusIndicador) {
      statusIndicador.textContent = '❌ Erro ao carregar';
      statusIndicador.className = 'text-red-600 text-xs';
    }
  }
});
```

**HTML para indicador:**
```html
<!-- Adicionar em registro-novo-caso.html -->
<div id="status-cache-escolas" class="hidden"></div>
```

---

### FASE 3: Melhorias de Performance e UX

#### Tarefa 3.1: Implementar Retry Logic no Cache

```javascript
async function carregarEscolasDeSupabase(tentativas = 3) {
  if (cacheCarregado) return true;
  
  for (let i = 0; i < tentativas; i++) {
    try {
      console.log(`[Cache] Tentativa ${i + 1}/${tentativas}...`);
      
      if (typeof APPS_SCRIPT_URL === 'undefined') {
        throw new Error('APPS_SCRIPT_URL não definida');
      }
      
      const response = await fetch(`${APPS_SCRIPT_URL}?action=get_technician_schools_for_cache`, {
        method: 'GET',
        redirect: 'follow'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const resultado = await response.json();
      
      if (resultado.sucesso && resultado.data) {
        escolasPorTecnicoDB = resultado.data;
        cacheCarregado = true;
        usandoFallback = false;
        
        // Armazena no localStorage (backup local)
        try {
          localStorage.setItem('cache_escolas_tecnico', JSON.stringify({
            data: resultado.data,
            timestamp: Date.now()
          }));
        } catch (e) {
          console.warn('[Cache] Falha ao salvar no localStorage:', e);
        }
        
        console.log(`✅ Cache carregado: ${Object.keys(escolasPorTecnicoDB).length} técnicos`);
        return true;
      }
      
      throw new Error(resultado.mensagem || 'Resposta inválida');
      
    } catch (erro) {
      console.warn(`[Cache] Tentativa ${i + 1} falhou:`, erro.message);
      
      if (i < tentativas - 1) {
        // Aguarda antes de tentar novamente (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }
  
  // Todas as tentativas falharam → tenta carregar do localStorage
  try {
    const backup = localStorage.getItem('cache_escolas_tecnico');
    if (backup) {
      const { data, timestamp } = JSON.parse(backup);
      const idade = Date.now() - timestamp;
      const horasIdade = Math.floor(idade / 3600000);
      
      if (idade < 86400000) { // 24 horas
        escolasPorTecnicoDB = data;
        cacheCarregado = true;
        usandoFallback = false;
        console.warn(`⚠️ Usando backup local (${horasIdade}h atrás)`);
        return true;
      } else {
        console.warn(`❌ Backup local muito antigo (${horasIdade}h)`);
      }
    }
  } catch (e) {
    console.error('[Cache] Erro ao ler backup:', e);
  }
  
  // Falha total
  console.error('❌ Todas as tentativas falharam');
  usandoFallback = true;
  return false;
}
```

---

#### Tarefa 3.2: Adicionar Botão de Atualização Manual

**HTML:**
```html
<!-- Em registro-novo-caso.html, próximo ao botão "Ver Todas" -->
<button type="button" id="btnAtualizarEscolas" 
        class="text-xs px-2 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-700"
        title="Atualizar lista de escolas do servidor">
  🔄 Atualizar
</button>
```

**JavaScript:**
```javascript
document.getElementById('btnAtualizarEscolas')?.addEventListener('click', async function() {
  this.disabled = true;
  this.textContent = '⏳ Atualizando...';
  
  // Limpa cache
  cacheCarregado = false;
  escolasPorTecnicoDB = null;
  localStorage.removeItem('cache_escolas_tecnico');
  
  // Recarrega
  const sucesso = await window.NAVMEscolasTecnico.carregarEscolasDeSupabase();
  
  if (sucesso) {
    this.textContent = '✅ Atualizado';
    this.className = 'text-xs px-2 py-1 rounded bg-green-100 text-green-700';
    
    // Recarrega escolas do usuário
    const userEmail = sessionStorage.getItem('userEmail');
    const userRole = sessionStorage.getItem('userRole');
    const userName = sessionStorage.getItem('userName');
    escolasDisponiveis = window.NAVMEscolasTecnico.getEscolasUsuario(userEmail, userRole, mostrandoTodasEscolas, userName);
    
    // Re-filtra se tipo selecionado
    if (tipoSelecionado) {
      instituicoesFiltradas = getInstituicoesFiltradas(tipoSelecionado);
    }
    
    setTimeout(() => {
      this.textContent = '🔄 Atualizar';
      this.className = 'text-xs px-2 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-700';
      this.disabled = false;
    }, 3000);
  } else {
    this.textContent = '❌ Erro';
    this.className = 'text-xs px-2 py-1 rounded bg-red-100 text-red-700';
    
    setTimeout(() => {
      this.textContent = '🔄 Atualizar';
      this.className = 'text-xs px-2 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-700';
      this.disabled = false;
    }, 3000);
  }
});
```

---

### FASE 4: Remoção Gradual do Hardcode

#### Tarefa 4.1: Criar Flag de Controle

**config.js:**
```javascript
const CONFIG = {
  // ... configs existentes
  
  // ⚠️ FEATURE FLAG: Controla uso de hardcode
  USE_HARDCODED_SCHOOLS: false,  // ✅ false = apenas Supabase
  
  // Timeout para carregamento do cache (ms)
  CACHE_TIMEOUT: 10000,
  
  // Máximo de tentativas para carregar cache
  CACHE_MAX_RETRIES: 3
};
```

**Modificar escolas-tecnico.js:**
```javascript
// No fallback (Linha 379-424)
if (tecnico && ESCOLAS_POR_TECNICO[tecnico]) {
  // ⚠️ VERIFICAR FLAG ANTES DE USAR HARDCODE
  if (window.CONFIG && window.CONFIG.USE_HARDCODED_SCHOOLS) {
    const escolas = [...ESCOLAS_POR_TECNICO[tecnico]];
    console.log(`📦 [HARDCODE] Retornando ${escolas.length} escolas`);
    return escolas.sort((a, b) => a.nomeOriginal.localeCompare(b.nomeOriginal));
  } else {
    console.error('❌ Hardcode desabilitado por CONFIG. Cache Supabase falhou.');
    mostrarErroSemEscolas();
    return [];
  }
}
```

**Nova função de erro:**
```javascript
function mostrarErroSemEscolas() {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  modal.innerHTML = `
    <div class="bg-white rounded-lg p-6 max-w-md shadow-xl">
      <div class="flex items-center mb-4">
        <span class="text-4xl mr-3">❌</span>
        <h2 class="text-xl font-bold text-gray-800">Escolas Indisponíveis</h2>
      </div>
      <p class="text-gray-600 mb-4">
        Não foi possível carregar a lista de escolas do servidor. 
        Verifique sua conexão e tente novamente.
      </p>
      <div class="flex gap-3">
        <button onclick="location.reload()" 
                class="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          🔄 Recarregar Página
        </button>
        <button onclick="this.closest('.fixed').remove()" 
                class="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
          Cancelar
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
}
```

---

#### Tarefa 4.2: Plano de Rollout

**Semana 1: Teste em Desenvolvimento**
```javascript
// config.js
USE_HARDCODED_SCHOOLS: true,  // Hardcode ainda ativo
```
- Deploy com novo código
- Teste cache Supabase funcionando
- Verifique logs do console
- Confirme que fallback funciona

**Semana 2: Teste com Usuários Piloto**
```javascript
USE_HARDCODED_SCHOOLS: true,  // Hardcode ainda ativo
```
- Selecione 2-3 técnicos para teste
- Peça feedback sobre performance
- Monitore erros no backend (Apps Script logs)

**Semana 3: Rollout Gradual**
```javascript
USE_HARDCODED_SCHOOLS: false,  // ⚠️ DESABILITA HARDCODE
```
- Deploy em horário de baixo uso
- Monitore SLAs de resposta
- Prepare rollback rápido se necessário

**Semana 4: Cleanup**
- Se sucesso, remover código hardcoded
- Deletar constantes `ESCOLAS_*`
- Deletar objeto `ESCOLAS_POR_TECNICO`
- Manter apenas `TODAS_ESCOLAS` para compatibilidade (até confirmação total)

---

### FASE 5: Testes e Validação

#### Tarefa 5.1: Suite de Testes (Manual)

**Checklist de Validação:**

```
✅ Teste 1: Técnico com escolas atribuídas
  - Login como técnico (ex: Amelinha)
  - Acessar "Inserir Novo Caso"
  - Verificar se escolas carregam (console mostra "✅ [DB]")
  - Selecionar tipo CMEI → verificar filtro
  - Selecionar tipo EMEF → verificar filtro
  - Testar autocomplete
  - Verificar auto-preenchimento de região
  - Clicar "Ver Todas" → verificar expansão

✅ Teste 2: Estagiário (todas as escolas)
  - Login como estagiário
  - Verificar se vê todas as 97 escolas
  - Verificar se NÃO aparece botão "Ver Todas"
  - Testar filtro por tipo

✅ Teste 3: Admin (todas as escolas)
  - Login como admin
  - Verificar acesso completo
  
✅ Teste 4: Fallback (simular falha)
  - Desconectar internet
  - Acessar página
  - Verificar se aviso de fallback aparece
  - Verificar se fallback funciona (se habilitado)
  
✅ Teste 5: Cache persistente
  - Carregar página (primeira vez)
  - Verificar localStorage
  - Recarregar página (usar backup local)
  - Verificar se carrega mais rápido
  
✅ Teste 6: Botão atualizar
  - Clicar "🔄 Atualizar"
  - Verificar feedback visual
  - Verificar se escolas atualizam
  
✅ Teste 7: Performance
  - Medir tempo de carregamento do cache
  - Medir tempo de filtragem (tipo)
  - Medir tempo de autocomplete
  - Objetivo: < 1s para todas as operações
```

---

#### Tarefa 5.2: Logs Estruturados

**Adicionar em escolas-tecnico.js:**
```javascript
const LOGGER = {
  cache: {
    tentativa: (num, max) => console.log(`[Cache] Tentativa ${num}/${max}`),
    sucesso: (tecnicos) => console.log(`[Cache] ✅ Carregado: ${tecnicos} técnicos`),
    falha: (erro) => console.error(`[Cache] ❌ Falha: ${erro}`),
    backup: (horas) => console.warn(`[Cache] ⚠️ Backup local (${horas}h atrás)`),
  },
  
  usuario: {
    identificado: (nome, origem) => console.log(`[User] ✅ "${nome}" via ${origem}`),
    naoIdentificado: (nome, email) => console.warn(`[User] ❌ Não identificado: nome="${nome}", email="${email}"`),
  },
  
  escolas: {
    carregadas: (total, origem) => console.log(`[Escolas] ✅ ${total} escolas (${origem})`),
    filtradas: (total, tipo) => console.log(`[Escolas] 🔍 ${total} ${tipo}s`),
    vazio: () => console.error(`[Escolas] ❌ Lista vazia`),
  },
  
  perf: {
    inicio: (operacao) => console.time(`[Perf] ${operacao}`),
    fim: (operacao) => console.timeEnd(`[Perf] ${operacao}`),
  }
};

// Uso:
LOGGER.perf.inicio('carregarCache');
await carregarEscolasDeSupabase();
LOGGER.perf.fim('carregarCache');
```

---

### FASE 6: Documentação e Rollback

#### Tarefa 6.1: Documentar Arquitetura Final

**Criar arquivo:** `ARQUITETURA-ESCOLAS.md`

```markdown
# 🏗️ ARQUITETURA - SISTEMA DE ESCOLAS

## Fluxo de Dados

### 1. Inicialização (Carregamento da Página)
```
Usuario acessa registro-novo-caso.html
    └─> DOMContentLoaded dispara
        └─> escolas-tecnico.js:carregarEscolasDeSupabase()
            ├─> Fetch: GET /exec?action=get_technician_schools_for_cache
            │   └─> Backend: getTechnicianSchoolsForCache()
            │       └─> Supabase: SELECT * FROM technician_schools
            │           └─> Retorna: { "Amelinha": [...], "Darison": [...] }
            │
            ├─> Sucesso: 
            │   ├─> escolasPorTecnicoDB = resultado.data
            │   ├─> localStorage.setItem('cache_escolas_tecnico', ...)
            │   └─> cacheCarregado = true
            │
            └─> Falha:
                ├─> Tenta 3x com backoff exponencial
                ├─> Tenta carregar do localStorage (backup < 24h)
                └─> Se tudo falhar: usandoFallback = true
```

### 2. Seleção de Escola

```
Usuario clica em "Tipo de Instituição" → seleciona "EMEF"
    └─> Event listener dispara
        └─> getInstituicoesFiltradas("EMEF")
            ├─> getEscolasUsuario(email, role, verTodas, nome)
            │   ├─> Se role = 'tecnico' e !verTodas:
            │   │   └─> getEscolasDoCache(nome)
            │   │       └─> escolasPorTecnicoDB["Amelinha"]
            │   │           └─> Retorna: Array<Escola>
            │   │
            │   └─> Filtra: escolas.filter(e => e.tipo === "EMEF")
            │
            └─> instituicoesFiltradas = [5 EMEFs da Amelinha]
                └─> Habilita campo cmeiEmef
                    └─> Usuario digita → autocomplete filtra
                        └─> Usuario seleciona → auto-preenche região
```

## Pontos de Falha e Recuperação

| Ponto | Causa | Recuperação |
|-------|-------|-------------|
| Fetch falha | Rede/servidor | Retry 3x, depois backup local |
| Backup expirado | > 24h | Usa fallback hardcoded (se habilitado) |
| Cache vazio | Bug/corrupção | Força recarregamento |
| Técnico não encontrado | Nome divergente | Fallback ou erro com modal |
```

---

#### Tarefa 6.2: Plano de Rollback

**Se algo der errado:**

**Rollback Rápido (5 minutos):**
```javascript
// config.js
USE_HARDCODED_SCHOOLS: true  // ✅ REATIVA HARDCODE
```
- Commit + push
- Sistema volta a funcionar imediatamente

**Rollback Completo (30 minutos):**
1. Reverter commit no Git
2. Fazer deploy da versão anterior
3. Limpar cache dos navegadores (orientar usuários)
4. Notificar equipe

---

## 📊 RESUMO EXECUTIVO

### Estado Atual
- ❌ 97 escolas hardcoded em JavaScript
- ❌ Atualização manual a cada mudança
- ❌ Risco de inconsistência
- ⚠️ Fallback sempre usado (cache Supabase ignorado)

### Estado Ideal Pós-Implementação
- ✅ Fonte única da verdade: Supabase
- ✅ Atualização dinâmica via admin
- ✅ Cache inteligente com retry e backup
- ✅ Feedback visual claro ao usuário
- ✅ Performance otimizada (< 1s)
- ✅ Rollback em 5 minutos se necessário

### Estimativa de Esforço

| Fase | Tarefa | Tempo Estimado | Complexidade |
|------|--------|----------------|--------------|
| 1 | Auditoria de dados | 2h | Baixa |
| 1 | API busca por nome | 3h | Média |
| 2 | Refatorar escolas-tecnico.js | 5h | Alta |
| 2 | Indicadores visuais | 2h | Baixa |
| 3 | Retry logic + localStorage | 3h | Média |
| 3 | Botão atualizar | 1h | Baixa |
| 4 | Feature flags | 1h | Baixa |
| 4 | Rollout gradual | 8h | Média |
| 5 | Testes manuais | 4h | Média |
| 6 | Documentação | 3h | Baixa |
| **TOTAL** | | **32h** | **≈ 4 dias úteis** |

---

## 🔐 CONSIDERAÇÕES DE SEGURANÇA

### RLS (Row Level Security)
- ✅ `technician_schools` tem RLS ativo
- ✅ SELECT permitido para `authenticated` e `anon`
- ✅ Writes apenas via `service_role` (backend)
- ⚠️ Frontend usa `anon` key (seguro, readonly)

### Validação Backend
```javascript
// Sempre validar role antes de writes
if (callerRole !== 'admin' && callerRole !== 'superuser') {
  return { sucesso: false, mensagem: 'Sem permissão' };
}
```

### Prevenção de Injection
```javascript
// ❌ ERRADO
const url = `${SUPABASE_URL}/rest/v1/technician_schools?user_id=eq.${userId}`;

// ✅ CORRETO
const url = `${SUPABASE_URL}/rest/v1/technician_schools?user_id=eq.${encodeURIComponent(userId)}`;
```

---

## 📚 REFERÊNCIAS TÉCNICAS

### Documentação Utilizada
- [Supabase PostgREST API](https://postgrest.org/en/stable/)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Google Apps Script UrlFetchApp](https://developers.google.com/apps-script/reference/url-fetch/url-fetch-app)

### SQL Úteis para Debug

```sql
-- Ver escolas de um técnico
SELECT ts.school_name, ts.school_type, ts.school_region
FROM technician_schools ts
JOIN app_users u ON ts.user_id = u.id
WHERE u.nome = 'Amelinha';

-- Ver técnico de uma escola
SELECT u.nome, u.email, ts.assigned_at
FROM technician_schools ts
JOIN app_users u ON ts.user_id = u.id
WHERE ts.school_name ILIKE '%arthur%';

-- Ver escolas órfãs
SELECT school_name, school_type, school_region
FROM technician_schools
WHERE user_id IS NULL;

-- Estatísticas gerais
SELECT 
  COUNT(*) as total_escolas,
  COUNT(DISTINCT user_id) as tecnicos_com_escolas,
  COUNT(CASE WHEN user_id IS NULL THEN 1 END) as orfas
FROM technician_schools;
```

---

## ✅ CHECKLIST FINAL DE IMPLEMENTAÇÃO

**Antes de Começar:**
- [ ] Backup completo do banco de dados
- [ ] Backup do código frontend atual (Git tag)
- [ ] Notificar equipe sobre janela de manutenção
- [ ] Preparar ambiente de staging para testes

**Durante Implementação:**
- [ ] Seguir fases na ordem (1 → 6)
- [ ] Testar cada fase antes de avançar
- [ ] Documentar decisões e desvios do plano
- [ ] Manter feature flag ativa (rollback rápido)

**Após Deploy:**
- [ ] Monitorar logs por 48h
- [ ] Coletar feedback de usuários
- [ ] Verificar performance (< 1s para operações)
- [ ] Confirmar consistência de dados
- [ ] Documentar lições aprendidas

---

## 🎯 PRÓXIMOS PASSOS

1. **Aprovação**: Revisar este documento com a equipe
2. **Priorização**: Definir sprint/timeline
3. **Ambiente de Teste**: Configurar staging com dados reais (anonimizados)
4. **Kick-off**: Iniciar Fase 1 (Auditoria)

---

**Documento gerado em:** {{ date }}  
**Versão:** 1.0  
**Autor:** Sistema de Análise Técnica  
**Status:** PRONTO PARA IMPLEMENTAÇÃO
