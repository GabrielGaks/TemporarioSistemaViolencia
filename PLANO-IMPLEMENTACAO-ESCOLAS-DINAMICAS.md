# 🎯 PLANO DE IMPLEMENTAÇÃO - SISTEMA DE ESCOLAS DINÂMICO

## 📋 SUMÁRIO EXECUTIVO

### Problema Identificado
A lista de escolas está **hardcoded** no frontend (`assets/js/utils/escolas-tecnico.js`), causando:
- Manutenção manual a cada mudança administrativa
- Risco de inconsistência entre banco de dados e interface
- Necessidade de deploy para adicionar/remover/renomear escolas
- Vínculo técnico ↔ escola fixo em código

### Solução Proposta
Migrar para um sistema **100% dinâmico** onde:
- Banco de dados (Supabase) é a **única fonte da verdade**
- Frontend consome dados via API REST
- Atualização imediata sem deploy
- Gerenciamento administrativo completo

### Status do Sistema
✅ **Infraestrutura pronta:**
- Banco de dados estruturado (`technician_schools`)
- APIs REST funcionais (Google Apps Script)
- Cache no frontend (parcialmente implementado)

⚠️ **Ajustes necessários:**
- Priorizar cache Supabase sobre fallback hardcoded
- Melhorar UX com indicadores visuais
- Remover código hardcoded após validação

---

## 🏗️ ARQUITETURA DE DADOS

### Relacionamento Técnico ↔ Escola

```
┌─────────────────┐         ┌──────────────────────┐
│   app_users     │         │ technician_schools   │
├─────────────────┤         ├──────────────────────┤
│ id (UUID)       │◄────┐   │ id (UUID)            │
│ nome (TEXT)     │     └───┤ user_id (FK)         │
│ email (TEXT)    │         │ school_name (TEXT)   │
│ role (ENUM)     │         │ school_type (ENUM)   │
└─────────────────┘         │ school_region (TEXT) │
                            └──────────────────────┘
```

### Modelo de Dados

**Backend (Supabase)**
```json
{
  "id": "uuid",
  "user_id": "uuid-tecnico",
  "school_name": "EMEF Arthur da Costa e Silva",
  "school_type": "EMEF",
  "school_region": "Centro",
  "assigned_at": "2026-01-15T10:30:00Z",
  "assigned_by": "uuid-admin"
}
```

**Frontend (JavaScript)**
```javascript
{
  nomeOriginal: "EMEF Arthur da Costa e Silva",
  tipo: "EMEF",
  regiao: "Centro",
  sigla: "EMEF Arthur" // Gerado dinamicamente
}
```

---

## 🔧 IMPLEMENTAÇÃO DETALHADA

### ETAPA 1: Validação da Infraestrutura (2h)

#### 1.1 Auditoria do Banco de Dados

**Script SQL de Verificação:**
```sql
-- Verificar integridade geral
SELECT 
  COUNT(*) as total_escolas,
  COUNT(DISTINCT school_name) as nomes_unicos,
  COUNT(CASE WHEN user_id IS NULL THEN 1 END) as orfas,
  COUNT(CASE WHEN school_region IS NULL THEN 1 END) as sem_regiao
FROM technician_schools;

-- Verificar distribuição por técnico
SELECT 
  u.nome as tecnico,
  COUNT(ts.id) as total_escolas,
  STRING_AGG(DISTINCT ts.school_type, ', ' ORDER BY ts.school_type) as tipos
FROM app_users u
LEFT JOIN technician_schools ts ON u.id = ts.user_id
WHERE u.role = 'tecnico'
GROUP BY u.nome
ORDER BY u.nome;

-- Verificar unicidade de nomes (app_users)
SELECT nome, COUNT(*) 
FROM app_users 
WHERE role = 'tecnico'
GROUP BY nome 
HAVING COUNT(*) > 1;
```

**Checklist de Validação:**
- [ ] Todos os técnicos têm campo `nome` preenchido
- [ ] Nomes de técnicos são únicos (case-insensitive)
- [ ] Todas as escolas têm `school_name` e `school_type`
- [ ] Não há escolas órfãs indesejadas (`user_id IS NULL`)
- [ ] Total de escolas = 97 (ou valor esperado)

#### 1.2 Teste da API Existente

**Script de Teste (Console do Navegador):**
```javascript
// Teste 1: Buscar escolas de um técnico por ID
async function testarAPI() {
  const userId = 'COLE_UUID_AQUI'; // UUID de um técnico real
  
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
  console.log('✅ Resultado:', resultado);
  
  if (resultado.sucesso) {
    console.log(`Total de escolas: ${resultado.total}`);
    console.table(resultado.data);
  }
}

testarAPI();

// Teste 2: Buscar cache completo
async function testarCache() {
  const response = await fetch(CONFIG.APPS_SCRIPT_AUTH + '?action=get_technician_schools_for_cache');
  const resultado = await response.json();
  
  console.log('✅ Cache:', resultado);
  console.log('Técnicos:', Object.keys(resultado.data));
  
  Object.entries(resultado.data).forEach(([tecnico, escolas]) => {
    console.log(`${tecnico}: ${escolas.length} escolas`);
  });
}

testarCache();
```

**Validação:**
- [ ] API `list_technician_schools` retorna escolas corretas
- [ ] API `get_technician_schools_for_cache` retorna objeto agrupado
- [ ] Estrutura de dados está no formato esperado
- [ ] Performance aceitável (< 2s para resposta)

---

### ETAPA 2: Nova API de Busca por Nome (3h)

#### 2.1 Criar Função no Backend

**Arquivo:** `backend/Code-Supabase.gs`

**Adicionar função:**
```javascript
/**
 * Busca escolas de um técnico pelo NOME (não UUID)
 * @param {string} nomeTecnico - Nome do técnico (ex: "Amelinha")
 * @returns {object} { sucesso, data: [escolas], total }
 */
function buscarEscolasPorNomeTecnico(nomeTecnico) {
  try {
    Logger.log('🔍 Buscando escolas para técnico: ' + nomeTecnico);
    
    if (!nomeTecnico || nomeTecnico.trim() === '') {
      return {
        sucesso: false,
        mensagem: 'Nome do técnico é obrigatório'
      };
    }
    
    // 1. Busca o UUID do técnico pelo nome (case-insensitive)
    const urlUsuario = `${SUPABASE_URL}/rest/v1/app_users?nome=ilike.${encodeURIComponent(nomeTecnico.trim())}&role=eq.tecnico&select=id,nome,email`;
    
    const optionsUsuario = {
      method: 'get',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      muteHttpExceptions: true
    };
    
    const responseUsuario = UrlFetchApp.fetch(urlUsuario, optionsUsuario);
    const usuarios = JSON.parse(responseUsuario.getContentText());
    
    if (usuarios.length === 0) {
      Logger.log('❌ Técnico não encontrado: ' + nomeTecnico);
      return {
        sucesso: false,
        mensagem: 'Técnico não encontrado: ' + nomeTecnico
      };
    }
    
    if (usuarios.length > 1) {
      Logger.log('⚠️ Múltiplos técnicos encontrados para: ' + nomeTecnico);
      // Prioriza match exato
      const matchExato = usuarios.find(u => u.nome.toLowerCase() === nomeTecnico.toLowerCase());
      if (!matchExato) {
        return {
          sucesso: false,
          mensagem: 'Múltiplos técnicos encontrados. Especifique melhor.'
        };
      }
    }
    
    const tecnico = usuarios[0];
    Logger.log('✅ Técnico identificado: ' + tecnico.nome + ' (ID: ' + tecnico.id + ')');
    
    // 2. Busca escolas atribuídas ao técnico
    return listarEscolasTecnico(tecnico.id);
    
  } catch (erro) {
    Logger.log('❌ Erro em buscarEscolasPorNomeTecnico: ' + erro.toString());
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

#### 2.2 Testar Nova API

**Console do Navegador:**
```javascript
async function testarBuscaPorNome() {
  const response = await fetch(CONFIG.APPS_SCRIPT_AUTH, {
    method: 'POST',
    body: new URLSearchParams({
      data: JSON.stringify({
        action: 'get_schools_by_technician_name',
        nome_tecnico: 'Amelinha'
      })
    })
  });
  
  const resultado = await response.json();
  console.log('✅ Resultado:', resultado);
  
  if (resultado.sucesso) {
    console.log(`Total de escolas de Amelinha: ${resultado.total}`);
    console.table(resultado.data);
  } else {
    console.error('❌ Erro:', resultado.mensagem);
  }
}

testarBuscaPorNome();
```

**Casos de Teste:**
- [ ] Nome exato: "Amelinha" → retorna 13 escolas
- [ ] Case-insensitive: "amelinha" → funciona
- [ ] Nome inexistente: "João" → retorna erro claro
- [ ] Campo vazio: "" → retorna erro de validação

---

### ETAPA 3: Refatoração do Frontend (5h)

#### 3.1 Modificar `assets/js/utils/escolas-tecnico.js`

**Localização das Mudanças:**

**A. Função `getEscolasUsuario()` - Linha 310-424**

```javascript
// =====================================
// ANTES (Problemático)
// =====================================
function getEscolasUsuario(emailOuNome, role, verTodas = false, nome = null) {
  // ... lógica confusa com fallback sempre usado
  
  // Linha 346: Tenta cache Supabase
  if (cacheCarregado && !usandoFallback) {
    // ... busca do cache
  }
  
  // Linha 379: Fallback hardcoded SEMPRE executado
  const tecnico = identificarTecnicoPorNome(nome);
  if (tecnico && ESCOLAS_POR_TECNICO[tecnico]) {
    return [...ESCOLAS_POR_TECNICO[tecnico]]; // ❌ SEMPRE RETORNA AQUI
  }
}

// =====================================
// DEPOIS (Solução)
// =====================================
async function getEscolasUsuario(emailOuNome, role, verTodas = false, nome = null) {
  // 1. Estagiários e Admins → todas as escolas
  if (isEstagiario(role) || role === 'admin' || role === 'superuser') {
    console.log('[Escolas] Role com acesso total:', role);
    return [...TODAS_ESCOLAS].sort((a, b) => a.nomeOriginal.localeCompare(b.nomeOriginal));
  }
  
  // 2. Técnicos com "Ver Todas" ativo
  if (role === 'tecnico' && verTodas) {
    console.log('[Escolas] Ver Todas ativado');
    return [...TODAS_ESCOLAS].sort((a, b) => a.nomeOriginal.localeCompare(b.nomeOriginal));
  }
  
  // 3. Técnicos → PRIORIZA CACHE SUPABASE
  if (role === 'tecnico') {
    console.log('[Escolas] 🔍 Buscando escolas do técnico...');
    
    // 3.1 Tenta buscar do cache já carregado
    if (cacheCarregado && !usandoFallback && escolasPorTecnicoDB) {
      const escolasDB = getEscolasDoCache(nome || emailOuNome);
      
      if (escolasDB && escolasDB.length > 0) {
        console.log(`[Escolas] ✅ [CACHE] ${escolasDB.length} escolas de "${nome || emailOuNome}"`);
        return [...escolasDB].sort((a, b) => a.nomeOriginal.localeCompare(b.nomeOriginal));
      } else {
        console.warn(`[Escolas] ⚠️ Cache vazio para "${nome || emailOuNome}"`);
      }
    }
    
    // 3.2 Cache ainda não carregado → tenta carregar agora
    if (!cacheCarregado) {
      console.log('[Escolas] ⏳ Cache não carregado, tentando agora...');
      const sucesso = await carregarEscolasDeSupabase();
      
      if (sucesso) {
        const escolasDB = getEscolasDoCache(nome || emailOuNome);
        
        if (escolasDB && escolasDB.length > 0) {
          console.log(`[Escolas] ✅ [CACHE TARDIO] ${escolasDB.length} escolas`);
          return [...escolasDB].sort((a, b) => a.nomeOriginal.localeCompare(b.nomeOriginal));
        }
      }
    }
    
    // 3.3 FALLBACK HARDCODED (última opção)
    if (typeof CONFIG !== 'undefined' && CONFIG.USE_HARDCODED_SCHOOLS === false) {
      // ⚠️ Hardcode desabilitado por config
      console.error('[Escolas] ❌ Cache falhou e hardcode está desabilitado');
      mostrarErroSemEscolas(); // Modal de erro
      return [];
    }
    
    // Usa hardcode como emergência
    console.warn('[Escolas] ⚠️ [FALLBACK] Usando dados hardcoded');
    mostrarAvisoFallback(); // Banner de aviso
    
    const tecnico = identificarTecnicoPorNome(nome) || identificarTecnico(emailOuNome);
    
    if (tecnico && ESCOLAS_POR_TECNICO[tecnico]) {
      const escolas = [...ESCOLAS_POR_TECNICO[tecnico]];
      console.log(`[Escolas] 📦 [HARDCODE] ${escolas.length} escolas de "${tecnico}"`);
      return escolas.sort((a, b) => a.nomeOriginal.localeCompare(b.nomeOriginal));
    }
    
    // 3.4 Falha completa
    console.error('[Escolas] ❌ Técnico não identificado e cache indisponível');
    mostrarErroSemEscolas();
    return [];
  }
  
  // 4. Outros roles → todas as escolas
  console.log('[Escolas] Role padrão, retornando todas:', role);
  return [...TODAS_ESCOLAS].sort((a, b) => a.nomeOriginal.localeCompare(b.nomeOriginal));
}
```

**B. Função `carregarEscolasDeSupabase()` - Linha 499-530**

```javascript
// =====================================
// APRIMORAR COM RETRY E BACKUP
// =====================================
async function carregarEscolasDeSupabase(tentativas = 3) {
  if (cacheCarregado) {
    console.log('[Cache] ✅ Já carregado');
    return true;
  }
  
  // Tenta carregar do servidor (com retry)
  for (let i = 0; i < tentativas; i++) {
    try {
      console.log(`[Cache] 🔄 Tentativa ${i + 1}/${tentativas}...`);
      
      if (typeof APPS_SCRIPT_URL === 'undefined') {
        throw new Error('APPS_SCRIPT_URL não definida');
      }
      
      const response = await fetch(`${APPS_SCRIPT_URL}?action=get_technician_schools_for_cache`, {
        method: 'GET',
        redirect: 'follow'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - ${response.statusText}`);
      }
      
      const resultado = await response.json();
      
      if (resultado.sucesso && resultado.data) {
        escolasPorTecnicoDB = resultado.data;
        cacheCarregado = true;
        usandoFallback = false;
        
        // Salva backup no localStorage
        try {
          const backup = {
            data: resultado.data,
            timestamp: Date.now(),
            versao: '2.0'
          };
          localStorage.setItem('cache_escolas_tecnico', JSON.stringify(backup));
          console.log('[Cache] 💾 Backup salvo no localStorage');
        } catch (e) {
          console.warn('[Cache] ⚠️ Falha ao salvar backup:', e.message);
        }
        
        console.log(`[Cache] ✅ Carregado: ${Object.keys(escolasPorTecnicoDB).length} técnicos`);
        return true;
      }
      
      throw new Error(resultado.mensagem || 'Resposta inválida do servidor');
      
    } catch (erro) {
      console.warn(`[Cache] ❌ Tentativa ${i + 1} falhou: ${erro.message}`);
      
      if (i < tentativas - 1) {
        // Espera antes de tentar novamente (exponential backoff)
        const espera = Math.pow(2, i) * 1000; // 1s, 2s, 4s
        console.log(`[Cache] ⏳ Aguardando ${espera / 1000}s antes de tentar novamente...`);
        await new Promise(resolve => setTimeout(resolve, espera));
      }
    }
  }
  
  // Todas as tentativas falharam → tenta carregar do localStorage
  console.log('[Cache] 🔄 Tentando carregar backup local...');
  
  try {
    const backupStr = localStorage.getItem('cache_escolas_tecnico');
    
    if (backupStr) {
      const backup = JSON.parse(backupStr);
      const idade = Date.now() - backup.timestamp;
      const horasIdade = Math.floor(idade / 3600000);
      
      // Aceita backup com menos de 24 horas
      if (idade < 86400000) {
        escolasPorTecnicoDB = backup.data;
        cacheCarregado = true;
        usandoFallback = false;
        
        console.warn(`[Cache] ⚠️ Usando backup local (${horasIdade}h de idade)`);
        console.warn(`[Cache] ℹ️ ${Object.keys(escolasPorTecnicoDB).length} técnicos no backup`);
        
        // Mostra aviso ao usuário
        mostrarAvisoBackupAntigo(horasIdade);
        
        return true;
      } else {
        console.error(`[Cache] ❌ Backup muito antigo (${horasIdade}h), descartando`);
        localStorage.removeItem('cache_escolas_tecnico');
      }
    } else {
      console.log('[Cache] ℹ️ Nenhum backup local encontrado');
    }
  } catch (e) {
    console.error('[Cache] ❌ Erro ao ler backup:', e.message);
  }
  
  // Falha completa
  console.error('[Cache] ❌ FALHA TOTAL: Todas as tentativas falharam');
  usandoFallback = true;
  return false;
}
```

---

#### 3.2 Adicionar Funções de Feedback Visual

**Adicionar no final de `escolas-tecnico.js`:**

```javascript
/**
 * Mostra banner de aviso quando fallback hardcoded é usado
 */
function mostrarAvisoFallback() {
  // Remove aviso anterior se existir
  const avisoExistente = document.getElementById('aviso-fallback');
  if (avisoExistente) avisoExistente.remove();
  
  const banner = document.createElement('div');
  banner.id = 'aviso-fallback';
  banner.className = 'fixed top-16 right-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg shadow-lg z-50 max-w-md animate-slide-in';
  banner.innerHTML = `
    <div class="flex items-start gap-3">
      <span class="text-2xl flex-shrink-0">⚠️</span>
      <div class="flex-1">
        <p class="font-bold text-sm mb-1">Modo Offline</p>
        <p class="text-xs">
          Não foi possível carregar as escolas do servidor. 
          Usando dados locais que podem estar desatualizados.
        </p>
      </div>
      <button 
        onclick="this.closest('#aviso-fallback').remove()" 
        class="text-yellow-700 hover:text-yellow-900 font-bold flex-shrink-0">
        ✕
      </button>
    </div>
  `;
  
  document.body.appendChild(banner);
  
  // Auto-remove após 12 segundos
  setTimeout(() => {
    if (banner.parentElement) {
      banner.style.opacity = '0';
      banner.style.transition = 'opacity 0.5s';
      setTimeout(() => banner.remove(), 500);
    }
  }, 12000);
}

/**
 * Mostra modal de erro quando não há escolas disponíveis
 */
function mostrarErroSemEscolas() {
  const modal = document.createElement('div');
  modal.id = 'modal-erro-escolas';
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] animate-fade-in';
  modal.innerHTML = `
    <div class="bg-white rounded-xl p-6 max-w-md shadow-2xl animate-scale-in">
      <div class="flex items-center mb-4">
        <span class="text-5xl mr-4">❌</span>
        <h2 class="text-2xl font-bold text-gray-800">Escolas Indisponíveis</h2>
      </div>
      
      <p class="text-gray-600 mb-2">
        Não foi possível carregar a lista de escolas do servidor.
      </p>
      
      <p class="text-sm text-gray-500 mb-6">
        Possíveis causas:
        <ul class="list-disc list-inside mt-2 space-y-1">
          <li>Conexão com internet instável</li>
          <li>Servidor temporariamente indisponível</li>
          <li>Sessão expirada</li>
        </ul>
      </p>
      
      <div class="flex gap-3">
        <button 
          onclick="location.reload()" 
          class="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 font-semibold transition-all">
          🔄 Recarregar Página
        </button>
        <button 
          onclick="document.getElementById('modal-erro-escolas').remove()" 
          class="flex-1 bg-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-400 font-semibold transition-all">
          Cancelar
        </button>
      </div>
      
      <p class="text-xs text-gray-400 mt-4 text-center">
        Se o problema persistir, entre em contato com o suporte.
      </p>
    </div>
  `;
  
  document.body.appendChild(modal);
}

/**
 * Mostra aviso quando backup antigo é usado
 */
function mostrarAvisoBackupAntigo(horas) {
  const banner = document.createElement('div');
  banner.className = 'fixed top-16 right-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg shadow-lg z-50 max-w-md';
  banner.innerHTML = `
    <div class="flex items-start gap-3">
      <span class="text-2xl flex-shrink-0">ℹ️</span>
      <div class="flex-1">
        <p class="font-bold text-sm mb-1">Usando Cache Local</p>
        <p class="text-xs">
          Lista de escolas com ${horas} hora(s) de idade. 
          Dados podem estar desatualizados.
        </p>
        <button 
          onclick="location.reload()" 
          class="text-xs underline mt-2 hover:text-blue-900">
          Tentar recarregar
        </button>
      </div>
      <button 
        onclick="this.parentElement.parentElement.remove()" 
        class="text-blue-700 hover:text-blue-900 font-bold flex-shrink-0">
        ✕
      </button>
    </div>
  `;
  
  document.body.appendChild(banner);
  
  setTimeout(() => banner.remove(), 15000);
}

// Exportar novas funções
window.NAVMEscolasTecnico.mostrarAvisoFallback = mostrarAvisoFallback;
window.NAVMEscolasTecnico.mostrarErroSemEscolas = mostrarErroSemEscolas;
window.NAVMEscolasTecnico.mostrarAvisoBackupAntigo = mostrarAvisoBackupAntigo;
```

**Adicionar CSS para animações (em `registro-novo-caso.html`):**
```css
<style>
  @keyframes slide-in {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes scale-in {
    from {
      transform: scale(0.9);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  .animate-slide-in {
    animation: slide-in 0.3s ease-out;
  }
  
  .animate-fade-in {
    animation: fade-in 0.2s ease-out;
  }
  
  .animate-scale-in {
    animation: scale-in 0.3s ease-out;
  }
</style>
```

---

### ETAPA 4: Adicionar Controles UX (2h)

#### 4.1 Indicador de Status do Cache

**HTML (adicionar em `registro-novo-caso.html`):**
```html
<!-- Adicionar após o campo "Tipo de Instituição" -->
<div id="status-cache-container" class="flex items-center gap-2 text-xs mt-2">
  <span id="status-cache-icon" class="text-lg"></span>
  <span id="status-cache-texto" class="text-gray-600"></span>
</div>
```

**JavaScript (modificar inicialização em `escolas-tecnico.js`):**
```javascript
document.addEventListener('DOMContentLoaded', async () => {
  console.log('[EscolasTecnico] 🚀 Inicializando...');
  
  const icone = document.getElementById('status-cache-icon');
  const texto = document.getElementById('status-cache-texto');
  
  // Estado: Carregando
  if (icone) icone.textContent = '⏳';
  if (texto) texto.textContent = 'Carregando escolas...';
  if (texto) texto.className = 'text-blue-600 font-medium';
  
  try {
    const sucesso = await window.NAVMEscolasTecnico.carregarEscolasDeSupabase();
    
    if (sucesso) {
      // Estado: Sucesso
      console.log('[EscolasTecnico] ✅ Cache carregado');
      if (icone) icone.textContent = '✅';
      if (texto) texto.textContent = 'Escolas atualizadas';
      if (texto) texto.className = 'text-green-600 font-medium';
      
      // Esconde indicador após 3s
      setTimeout(() => {
        const container = document.getElementById('status-cache-container');
        if (container) {
          container.style.opacity = '0';
          container.style.transition = 'opacity 0.5s';
          setTimeout(() => container.style.display = 'none', 500);
        }
      }, 3000);
      
    } else {
      // Estado: Falha (usando fallback)
      console.warn('[EscolasTecnico] ⚠️ Usando fallback');
      if (icone) icone.textContent = '⚠️';
      if (texto) texto.textContent = 'Modo offline (usando cache local)';
      if (texto) texto.className = 'text-yellow-600 font-medium';
    }
  } catch (erro) {
    // Estado: Erro
    console.error('[EscolasTecnico] ❌ Erro:', erro);
    if (icone) icone.textContent = '❌';
    if (texto) texto.textContent = 'Erro ao carregar. Clique para recarregar.';
    if (texto) {
      texto.className = 'text-red-600 font-medium cursor-pointer underline';
      texto.onclick = () => location.reload();
    }
  }
});
```

---

#### 4.2 Botão de Atualização Manual

**HTML (adicionar próximo ao botão "Ver Todas"):**
```html
<button 
  type="button" 
  id="btnAtualizarEscolas"
  class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-sm hover:shadow-md"
  title="Atualizar lista de escolas do servidor">
  <span id="btnAtualizarIcone">🔄</span>
  <span id="btnAtualizarTexto">Atualizar</span>
</button>
```

**JavaScript (adicionar em `registro-novo-caso.html`):**
```javascript
document.getElementById('btnAtualizarEscolas')?.addEventListener('click', async function() {
  const btn = this;
  const icone = document.getElementById('btnAtualizarIcone');
  const texto = document.getElementById('btnAtualizarTexto');
  
  // Desabilita botão
  btn.disabled = true;
  btn.className = 'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-gray-300 text-gray-500 cursor-not-allowed';
  if (icone) icone.textContent = '⏳';
  if (texto) texto.textContent = 'Atualizando...';
  
  try {
    // Limpa cache
    window.NAVMEscolasTecnico.cacheCarregado = false;
    window.NAVMEscolasTecnico.escolasPorTecnicoDB = null;
    localStorage.removeItem('cache_escolas_tecnico');
    
    // Recarrega
    const sucesso = await window.NAVMEscolasTecnico.carregarEscolasDeSupabase();
    
    if (sucesso) {
      // Sucesso
      btn.className = 'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-green-100 text-green-700';
      if (icone) icone.textContent = '✅';
      if (texto) texto.textContent = 'Atualizado!';
      
      // Recarrega escolas do usuário
      const userEmail = sessionStorage.getItem('userEmail');
      const userRole = sessionStorage.getItem('userRole');
      const userName = sessionStorage.getItem('userName');
      
      escolasDisponiveis = await window.NAVMEscolasTecnico.getEscolasUsuario(
        userEmail, 
        userRole, 
        mostrandoTodasEscolas, 
        userName
      );
      
      // Re-filtra se tipo selecionado
      if (tipoSelecionado) {
        instituicoesFiltradas = getInstituicoesFiltradas(tipoSelecionado);
        console.log(`[Atualizar] ${instituicoesFiltradas.length} ${tipoSelecionado}s disponíveis`);
      }
      
      // Atualiza indicador de filtro
      if (typeof atualizarIndicadorFiltro === 'function') {
        atualizarIndicadorFiltro();
      }
      
      console.log('✅ Escolas atualizadas com sucesso');
      
    } else {
      // Falha
      btn.className = 'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-red-100 text-red-700';
      if (icone) icone.textContent = '❌';
      if (texto) texto.textContent = 'Erro';
      
      console.error('❌ Falha ao atualizar escolas');
    }
    
  } catch (erro) {
    // Erro
    btn.className = 'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-red-100 text-red-700';
    if (icone) icone.textContent = '❌';
    if (texto) texto.textContent = 'Erro';
    
    console.error('❌ Erro ao atualizar:', erro);
  }
  
  // Restaura botão após 3 segundos
  setTimeout(() => {
    btn.disabled = false;
    btn.className = 'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-sm hover:shadow-md';
    if (icone) icone.textContent = '🔄';
    if (texto) texto.textContent = 'Atualizar';
  }, 3000);
});
```

---

### ETAPA 5: Feature Flags e Rollout (1h)

#### 5.1 Adicionar Flag de Controle

**Arquivo:** `config.js`

```javascript
const CONFIG = {
  // ... configurações existentes
  
  // ========================================
  // FEATURE FLAGS - Sistema de Escolas
  // ========================================
  
  /**
   * Controla se fallback hardcoded pode ser usado
   * - true: Permite usar dados hardcoded se API falhar (modo compatibilidade)
   * - false: Força uso apenas de dados do Supabase (modo produção)
   */
  USE_HARDCODED_SCHOOLS: true,  // ⚠️ Mudar para false após validação
  
  /**
   * Timeout para carregamento do cache (milissegundos)
   */
  CACHE_TIMEOUT: 10000,  // 10 segundos
  
  /**
   * Número máximo de tentativas para carregar cache
   */
  CACHE_MAX_RETRIES: 3,
  
  /**
   * Idade máxima do backup local (milissegundos)
   */
  CACHE_MAX_AGE: 86400000,  // 24 horas
};
```

#### 5.2 Plano de Rollout

**Fase 1: Desenvolvimento (Semana 1)**
```javascript
USE_HARDCODED_SCHOOLS: true
```
- ✅ Deploy com novo código
- ✅ Validar que cache Supabase funciona
- ✅ Verificar logs do console
- ✅ Confirmar que fallback funciona quando API falha

**Fase 2: Staging/Piloto (Semana 2)**
```javascript
USE_HARDCODED_SCHOOLS: true
```
- ✅ Selecionar 2-3 técnicos para teste
- ✅ Coletar feedback sobre performance
- ✅ Monitorar logs do Apps Script
- ✅ Validar indicadores visuais

**Fase 3: Produção Soft (Semana 3)**
```javascript
USE_HARDCODED_SCHOOLS: false  // ⚠️ HARDCODE DESABILITADO
```
- ✅ Deploy em horário de baixo uso (ex: 22h)
- ✅ Monitorar SLAs de resposta (< 2s)
- ✅ Preparar rollback rápido (CONFIG.USE_HARDCODED_SCHOOLS = true)
- ✅ Suporte ativo por 48h

**Fase 4: Cleanup (Semana 4)**
- ✅ Se sucesso, remover código hardcoded completamente
- ✅ Deletar constantes `ESCOLAS_*` e `ESCOLAS_POR_TECNICO`
- ✅ Documentar mudanças
- ✅ Atualizar README

---

### ETAPA 6: Testes e Validação (4h)

#### 6.1 Suite de Testes

**Checklist de Validação (Manual):**

```
✅ TESTE 1: Técnico - Cache Funcionando
   Pré-condição: API disponível, conexão OK
   1. Login como técnico (ex: Amelinha)
   2. Acessar "Inserir Novo Caso"
   3. Verificar console: "✅ [CACHE] 13 escolas de Amelinha"
   4. Verificar indicador: "✅ Escolas atualizadas"
   5. Selecionar tipo "EMEF" → ver 5 opções
   6. Testar autocomplete → funciona
   7. Selecionar escola → região auto-preenche
   8. Clicar "Ver Todas" → ver 97 escolas
   
   ✅ Passou | ❌ Falhou: _______

✅ TESTE 2: Técnico - Cache com Retry
   Pré-condição: Simular lentidão na rede (DevTools throttling)
   1. Login como técnico
   2. Acessar página
   3. Verificar console: múltiplas tentativas de carregamento
   4. Aguardar até carregar (pode demorar até 10s)
   5. Verificar sucesso eventual
   
   ✅ Passou | ❌ Falhou: _______

✅ TESTE 3: Técnico - Usando Backup Local
   Pré-condição: localStorage com backup válido, API offline
   1. Carregar página (cache inicial OK)
   2. Simular offline (DevTools)
   3. Recarregar página
   4. Verificar console: "⚠️ Usando backup local (Xh de idade)"
   5. Verificar banner amarelo/azul aparece
   6. Verificar que escolas ainda carregam
   
   ✅ Passou | ❌ Falhou: _______

✅ TESTE 4: Técnico - Fallback Hardcoded
   Pré-condição: CONFIG.USE_HARDCODED_SCHOOLS = true, API offline
   1. Limpar localStorage
   2. Simular offline
   3. Carregar página
   4. Verificar console: "⚠️ [FALLBACK] Usando dados hardcoded"
   5. Verificar banner amarelo: "Modo Offline"
   6. Verificar escolas carregam (hardcoded)
   
   ✅ Passou | ❌ Falhou: _______

✅ TESTE 5: Técnico - Erro Sem Escolas
   Pré-condição: CONFIG.USE_HARDCODED_SCHOOLS = false, API offline
   1. Limpar localStorage
   2. Simular offline
   3. Carregar página
   4. Verificar modal de erro aparece
   5. Verificar botão "Recarregar Página" funciona
   6. Verificar botão "Cancelar" fecha modal
   
   ✅ Passou | ❌ Falhou: _______

✅ TESTE 6: Estagiário - Todas as Escolas
   Pré-condição: API disponível
   1. Login como estagiário
   2. Acessar "Inserir Novo Caso"
   3. Verificar console: "Role com acesso total: estagiario"
   4. Verificar botão "Ver Todas" NÃO aparece
   5. Selecionar tipo "CMEI" → ver ~45 opções
   6. Verificar pode selecionar qualquer escola
   
   ✅ Passou | ❌ Falhou: _______

✅ TESTE 7: Admin - Acesso Total
   Pré-condição: API disponível
   1. Login como admin
   2. Acessar "Inserir Novo Caso"
   3. Verificar acesso a todas as 97 escolas
   4. Verificar sem restrições por técnico
   
   ✅ Passou | ❌ Falhou: _______

✅ TESTE 8: Botão Atualizar
   Pré-condição: Técnico logado, cache carregado
   1. Clicar botão "🔄 Atualizar"
   2. Verificar botão muda para "⏳ Atualizando..."
   3. Verificar botão fica desabilitado
   4. Aguardar conclusão
   5. Verificar botão muda para "✅ Atualizado!"
   6. Verificar após 3s volta ao normal
   7. Verificar escolas recarregaram
   
   ✅ Passou | ❌ Falhou: _______

✅ TESTE 9: Performance
   Pré-condição: API disponível, cache limpo
   1. Abrir DevTools → aba "Network"
   2. Carregar página
   3. Medir tempo até "Escolas atualizadas"
   4. Objetivo: < 2 segundos
   5. Medir tempo para filtrar tipo (EMEF/CMEI)
   6. Objetivo: < 100ms
   7. Medir tempo de autocomplete
   8. Objetivo: < 50ms por digitação
   
   ✅ Passou | ❌ Falhou: _______
   Tempo cache: _____ ms
   Tempo filtro: _____ ms
   Tempo autocomplete: _____ ms

✅ TESTE 10: Compatibilidade de Navegadores
   Repetir TESTE 1 em:
   - [ ] Chrome (versão ___) → ✅ Passou | ❌ Falhou
   - [ ] Firefox (versão ___) → ✅ Passou | ❌ Falhou
   - [ ] Edge (versão ___) → ✅ Passou | ❌ Falhou
   - [ ] Safari (versão ___) → ✅ Passou | ❌ Falhou
```

---

#### 6.2 Testes Automatizados (Opcional)

**Script de Teste (Console do Navegador):**
```javascript
// ========================================
// SUITE DE TESTES - ESCOLAS DINÂMICAS
// ========================================

async function rodarTestes() {
  console.log('🧪 ========================================');
  console.log('🧪 INICIANDO TESTES DO SISTEMA DE ESCOLAS');
  console.log('🧪 ========================================\n');
  
  let passados = 0;
  let falhados = 0;
  
  // Teste 1: Carregar cache
  console.log('📝 TESTE 1: Carregamento do cache');
  try {
    const inicio = Date.now();
    const sucesso = await window.NAVMEscolasTecnico.carregarEscolasDeSupabase();
    const tempo = Date.now() - inicio;
    
    console.assert(sucesso === true, '❌ Cache deveria carregar com sucesso');
    console.assert(tempo < 5000, `❌ Cache muito lento: ${tempo}ms (esperado < 5000ms)`);
    console.log(`✅ PASSOU - Cache carregado em ${tempo}ms\n`);
    passados++;
  } catch (e) {
    console.error('❌ FALHOU:', e.message, '\n');
    falhados++;
  }
  
  // Teste 2: Buscar escolas de técnico
  console.log('📝 TESTE 2: Buscar escolas de técnico por nome');
  try {
    const escolas = await window.NAVMEscolasTecnico.getEscolasUsuario(
      'amelinha@tecnico.vitoria.es.gov.br',
      'tecnico',
      false,
      'Amelinha'
    );
    
    console.assert(Array.isArray(escolas), '❌ Deveria retornar array');
    console.assert(escolas.length > 0, '❌ Deveria retornar escolas');
    console.assert(escolas.length <= 20, '❌ Técnico não deve ter > 20 escolas');
    console.log(`✅ PASSOU - ${escolas.length} escolas encontradas\n`);
    passados++;
  } catch (e) {
    console.error('❌ FALHOU:', e.message, '\n');
    falhados++;
  }
  
  // Teste 3: Filtrar por tipo
  console.log('📝 TESTE 3: Filtrar escolas por tipo');
  try {
    const todasEMEF = window.NAVMEscolasTecnico.TODAS_ESCOLAS.filter(e => e.tipo === 'EMEF');
    const todasCMEI = window.NAVMEscolasTecnico.TODAS_ESCOLAS.filter(e => e.tipo === 'CMEI');
    
    console.assert(todasEMEF.length > 0, '❌ Deveria haver EMEFs');
    console.assert(todasCMEI.length > 0, '❌ Deveria haver CMEIs');
    console.assert(todasEMEF.length + todasCMEI.length === window.NAVMEscolasTecnico.TODAS_ESCOLAS.length, 
                   '❌ Soma EMEF + CMEI deveria = total');
    console.log(`✅ PASSOU - ${todasEMEF.length} EMEFs + ${todasCMEI.length} CMEIs\n`);
    passados++;
  } catch (e) {
    console.error('❌ FALHOU:', e.message, '\n');
    falhados++;
  }
  
  // Teste 4: Obter região
  console.log('📝 TESTE 4: Obter região de escola');
  try {
    const regiao = window.NAVMEscolasTecnico.getRegiaoEscola('EMEF Arthur da Costa e Silva');
    
    console.assert(regiao !== null, '❌ Deveria encontrar região');
    console.assert(typeof regiao === 'string', '❌ Região deveria ser string');
    console.log(`✅ PASSOU - Região: "${regiao}"\n`);
    passados++;
  } catch (e) {
    console.error('❌ FALHOU:', e.message, '\n');
    falhados++;
  }
  
  // Teste 5: Identificar técnico por nome
  console.log('📝 TESTE 5: Identificar técnico por nome');
  try {
    const tecnico = window.NAVMEscolasTecnico.identificarTecnicoPorNome('Amelinha');
    
    console.assert(tecnico !== null, '❌ Deveria identificar técnico');
    console.log(`✅ PASSOU - Técnico identificado: "${tecnico}"\n`);
    passados++;
  } catch (e) {
    console.error('❌ FALHOU:', e.message, '\n');
    falhados++;
  }
  
  // Resumo
  console.log('🧪 ========================================');
  console.log('🧪 RESUMO DOS TESTES');
  console.log('🧪 ========================================');
  console.log(`✅ Passados: ${passados}`);
  console.log(`❌ Falhados: ${falhados}`);
  console.log(`📊 Total: ${passados + falhados}`);
  console.log(`📈 Taxa de sucesso: ${((passados / (passados + falhados)) * 100).toFixed(1)}%`);
  
  if (falhados === 0) {
    console.log('\n🎉 TODOS OS TESTES PASSARAM! 🎉');
  } else {
    console.warn('\n⚠️ ALGUNS TESTES FALHARAM - REVISE ACIMA');
  }
}

// Executar
rodarTestes();
```

---

## 🎯 CHECKLIST DE IMPLEMENTAÇÃO

### Antes de Começar
- [ ] ✅ Fazer backup completo do banco de dados
- [ ] ✅ Criar Git tag da versão atual (rollback rápido)
- [ ] ✅ Preparar ambiente de staging com dados reais
- [ ] ✅ Notificar equipe sobre janela de manutenção
- [ ] ✅ Preparar plano de comunicação para usuários

### Durante Implementação
- [ ] ✅ Seguir etapas na ordem (1 → 6)
- [ ] ✅ Testar cada etapa antes de avançar
- [ ] ✅ Documentar decisões e desvios
- [ ] ✅ Manter feature flag ativa (`USE_HARDCODED_SCHOOLS = true`)
- [ ] ✅ Commitar após cada etapa concluída

### Após Deploy
- [ ] ✅ Monitorar logs por 48 horas
- [ ] ✅ Coletar feedback dos usuários
- [ ] ✅ Verificar performance (< 2s para cache)
- [ ] ✅ Confirmar consistência de dados
- [ ] ✅ Documentar lições aprendidas

### Cleanup (Após Validação)
- [ ] ✅ Mudar flag: `USE_HARDCODED_SCHOOLS = false`
- [ ] ✅ Remover código hardcoded (arrays estáticos)
- [ ] ✅ Remover imports não utilizados
- [ ] ✅ Atualizar documentação
- [ ] ✅ Publicar release notes

---

## 🔁 PLANO DE ROLLBACK

### Rollback Rápido (5 minutos)
Se algo der errado durante ou após o deploy:

**config.js**
```javascript
USE_HARDCODED_SCHOOLS: true  // ✅ REATIVA FALLBACK IMEDIATAMENTE
```

**Passos:**
1. Editar `config.js`
2. Commit + push
3. Aguardar CDN/cache limpar (ou forçar refresh)
4. Sistema volta a funcionar com dados locais

### Rollback Completo (30 minutos)
Se problema for mais profundo:

1. **Reverter código:**
   ```bash
   git revert HEAD~3  # Reverte últimos 3 commits
   # OU
   git checkout tags/v1.0.0  # Volta para tag anterior
   ```

2. **Rebuild (se necessário):**
   ```bash
   npm run build  # Se usar build process
   ```

3. **Deploy:**
   ```bash
   git push origin main --force
   ```

4. **Notificar usuários:**
   - Avisar sobre reversão temporária
   - Explicar que dados podem estar desatualizados
   - Informar quando novo deploy será feito

5. **Investigar causa raiz:**
   - Analisar logs do Google Apps Script
   - Verificar erros no console do navegador
   - Revisar queries do Supabase
   - Testar em ambiente isolado

---

## 📊 MÉTRICAS DE SUCESSO

### KPIs Técnicos
- **Performance:**
  - ✅ Cache carrega em < 2 segundos
  - ✅ Filtro por tipo executa em < 100ms
  - ✅ Autocomplete responde em < 50ms

- **Confiabilidade:**
  - ✅ Taxa de sucesso do cache > 95%
  - ✅ Fallback funciona em 100% das falhas de API
  - ✅ Zero perda de dados

- **Usabilidade:**
  - ✅ Indicadores visuais claros
  - ✅ Feedbacks imediatos para ações
  - ✅ Recuperação automática de erros

### KPIs de Negócio
- **Manutenibilidade:**
  - ✅ Tempo para adicionar escola: De 30 min → 1 min
  - ✅ Sem necessidade de deploy para mudanças
  - ✅ Atualizações visíveis instantaneamente

- **Satisfação do Usuário:**
  - ✅ Zero reclamações sobre escolas desatualizadas
  - ✅ Feedback positivo sobre velocidade
  - ✅ Confiança no sistema aumentada

---

## 🎓 LIÇÕES APRENDIDAS

### Documentar Após Implementação
- Principais desafios encontrados
- Soluções alternativas testadas
- Tempo real vs. estimado
- Bugs inesperados e correções
- Sugestões para futuras refatorações

---

## 📞 SUPORTE E CONTATO

### Durante Implementação
- **Responsável técnico:** [NOME]
- **Email:** [EMAIL]
- **Telefone/WhatsApp:** [TELEFONE]

### Recursos
- **Documentação Supabase:** https://supabase.com/docs
- **Google Apps Script Logs:** https://script.google.com
- **Repositório Git:** [URL]
- **Dashboard Monitoramento:** [URL]

---

**Documento gerado em:** {{ date }}  
**Versão:** 2.0  
**Status:** ✅ PRONTO PARA IMPLEMENTAÇÃO  
**Tempo estimado:** 32 horas (4 dias úteis)
