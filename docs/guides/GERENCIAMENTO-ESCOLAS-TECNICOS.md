# 🏫 Sistema de Gerenciamento de Escolas por Técnico

## 📋 Visão Geral

Este documento detalha o sistema completo de atribuição de escolas para técnicos, implementado com integração Supabase e fallback hardcoded.

---

## 🎯 Funcionalidades

### Para Administradores/Superusers
- ✅ Gerenciar atribuição de escolas via modal intuitivo
- ✅ Interface dual-list com seleção múltipla
- ✅ Busca em tempo real nas duas listas
- ✅ Contador de escolas disponíveis e atribuídas
- ✅ Salvamento em lote no Supabase
- ✅ Remoção automática ao excluir técnico

### Para Técnicos
- ✅ Visualização automática apenas das escolas atribuídas
- ✅ Carregamento dinâmico do Supabase
- ✅ Fallback automático para dados hardcoded se API falhar
- ✅ Toggle "Ver Todas" para visualizar todas as escolas (opcional)

### Para Estagiários
- ✅ Acesso completo a todas as 97 escolas
- ✅ Sem restrições de visualização

---

## 🗃️ Estrutura do Banco de Dados

### Tabela `technician_schools`

```sql
CREATE TABLE technician_schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  school_name TEXT NOT NULL,
  school_type TEXT NOT NULL,
  school_region TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, school_name, school_type)
);
```

**Campos:**
- `user_id`: Referência ao técnico (FK para app_users)
- `school_name`: Nome completo da escola
- `school_type`: Tipo (CMEI, EMEF)
- `school_region`: Região (Centro, Maruípe, São Pedro, Forte São João)

**Índices:**
- `idx_tech_schools_user`: user_id (busca por técnico)
- `idx_tech_schools_name`: school_name (busca por escola)
- `idx_tech_schools_type`: school_type (filtro por tipo)
- `idx_tech_schools_composite`: user_id + school_type (queries otimizadas)

**Políticas RLS:**
- SELECT: Liberado para `anon`, `authenticated`
- INSERT/UPDATE/DELETE: Apenas `service_role`

---

## 🔧 Componentes Backend

### `backend/Code-Supabase.gs`

#### 1. **listarEscolasTecnico(userId)**
Lista todas as escolas atribuídas a um técnico.

**Endpoint:** `action=list_technician_schools`

**Payload:**
```json
{
  "action": "list_technician_schools",
  "user_id": "uuid-do-tecnico"
}
```

**Resposta:**
```json
{
  "sucesso": true,
  "data": {
    "schools": [
      {
        "id": "uuid",
        "school_name": "EMEF Exemplo",
        "school_type": "EMEF",
        "school_region": "Centro"
      }
    ],
    "total": 15
  }
}
```

---

#### 2. **salvarEscolasTecnico(userId, schools, callerRole, callerId)**
Salva escolas usando estratégia **full replace** (DELETE + INSERT).

**Endpoint:** `action=save_technician_schools`

**Payload:**
```json
{
  "action": "save_technician_schools",
  "user_id": "uuid-do-tecnico",
  "schools": [
    {
      "school_name": "EMEF Exemplo",
      "school_type": "EMEF",
      "school_region": "Centro"
    }
  ],
  "caller_role": "admin",
  "caller_id": "uuid-admin"
}
```

**Comportamento:**
1. Conta escolas existentes
2. DELETE todas as antigas
3. INSERT todas as novas
4. Registra em `system_updates`

**Resposta:**
```json
{
  "sucesso": true,
  "data": {
    "total": 15,
    "anterior": 10,
    "adicoes": 5,
    "remocoes": 0
  }
}
```

---

#### 3. **deletarEscolasTecnico(userId, callerRole)**
Remove todas as escolas ao deletar técnico (CASCADE explícito).

**Endpoint:** `action=delete_technician_schools`

**Payload:**
```json
{
  "action": "delete_technician_schools",
  "user_id": "uuid-do-tecnico",
  "caller_role": "superuser"
}
```

**Resposta:**
```json
{
  "sucesso": true,
  "data": {
    "total_removido": 15
  }
}
```

---

#### 4. **obterTodasEscolasDisponiveis()**
Retorna lista hardcoded das 97 escolas (fallback garantido).

**Endpoint:** `action=get_all_available_schools`

**Resposta:**
```json
{
  "sucesso": true,
  "data": {
    "schools": [...],
    "total": 97
  }
}
```

---

## 🎨 Componentes Frontend

### 1. **Modal de Gerenciamento** (`gerenciar-usuarios.html`)

#### Interface
```html
<div id="modalGerenciarEscolas" class="modal-overlay">
  <div class="modal-content-large">
    <div class="dual-list-selector">
      <!-- Lista de escolas disponíveis (esquerda) -->
      <div class="list-container">
        <input type="search" placeholder="🔍 Buscar nas disponíveis...">
        <ul id="listaEscolasDisponiveis"></ul>
        <div class="list-counter">0 disponíveis</div>
      </div>

      <!-- Botões de transferência -->
      <div class="transfer-buttons">
        <button onclick="adicionarEscolasSelecionadas()">→</button>
        <button onclick="removerEscolasSelecionadas()">←</button>
      </div>

      <!-- Lista de escolas atribuídas (direita) -->
      <div class="list-container">
        <input type="search" placeholder="🔍 Buscar nas atribuídas...">
        <ul id="listaEscolasAtribuidas"></ul>
        <div class="list-counter">0 atribuídas</div>
      </div>
    </div>
  </div>
</div>
```

---

#### Funções JavaScript

```javascript
// Abre modal + carrega dados
async function abrirModalEscolas(userId, nome, email)

// Carrega 97 escolas do backend (fallback)
async function carregarTodasEscolasDisponiveis()

// Carrega escolas já atribuídas ao técnico
async function carregarEscolasAtribuidas(userId)

// Renderiza ambas as listas com busca + seleção
function renderizarListaEscolas()

// Toggle seleção individual
function toggleSelecaoDisponivel(nomeEscola)
function toggleSelecaoAtribuida(nomeEscola)

// Transfere múltiplas escolas entre listas
function adicionarEscolasSelecionadas()
function removerEscolasSelecionadas()

// Salva no Supabase (full replace)
async function salvarEscolasAtribuidas()

// Atualiza estado dos botões transfer
function atualizarBotoesEscolas()
```

---

### 2. **Módulo de Cache** (`assets/js/utils/escolas-tecnico.js`)

#### Estado do Cache
```javascript
let escolasPorTecnicoDB = null;      // Cache indexado
let cacheCarregado = false;          // Flag de status
let usandoFallback = false;          // Flag de fallback
```

---

#### **carregarEscolasDeSupabase()**
Carrega dados de todos os técnicos em paralelo e indexa por 3 chaves.

**Fluxo:**
1. Busca lista de usuários (action=list_users)
2. Filtra apenas `role === 'tecnico'`
3. Para cada técnico: busca escolas (action=list_technician_schools) **em paralelo**
4. Indexa por:
   - `user_id`
   - `email` (normalizado)
   - `nome` (normalizado)

**Exemplo de cache:**
```javascript
{
  "uuid-123": [...escolas...],
  "amelinha@escolas.com": [...escolas...],
  "amelinha": [...escolas...]
}
```

**Retorno:**
- `true` se sucesso
- `false` se API falhar (ativa fallback)

---

#### **getEscolasDoCache(chave)**
Busca escolas usando qualquer chave (user_id, email, nome).

**Parâmetros:**
- `chave`: String (UUID, email ou nome)

**Retorno:**
- Array de escolas (formato interno com `nomeOriginal`, `tipo`, `regiao`)
- `null` se não encontrado

**Normalização:**
- Remove acentos
- Lowercase
- Remove espaços extras

---

#### **getEscolasUsuario()** (modificado)
Função principal com integração DB-first + fallback.

**Fluxo de decisão:**

```
┌─────────────────────────┐
│ role === 'estagiario'?  │──Sim──► Retorna TODAS_ESCOLAS
└────────────┬────────────┘
             Não
             │
┌────────────▼────────────┐
│ role === 'admin/super'? │──Sim──► Retorna TODAS_ESCOLAS
└────────────┬────────────┘
             Não
             │
┌────────────▼────────────┐
│   role === 'tecnico'?   │──Não──► Retorna TODAS_ESCOLAS
└────────────┬────────────┘
            Sim
             │
┌────────────▼────────────┐
│     verTodas=true?      │──Sim──► Retorna TODAS_ESCOLAS
└────────────┬────────────┘
             Não
             │
┌────────────▼────────────┐
│ cacheCarregado &&       │──Sim──► getEscolasDoCache()
│ !usandoFallback?        │              │
└────────────┬────────────┘              │
             Não                          │
             │                            │
┌────────────▼────────────┐              │
│ Busca em                │◄─────────Não─┤
│ ESCOLAS_POR_TECNICO     │              │
│ (hardcoded)             │              │
└─────────────────────────┘              │
                                         Sim
                                          │
                                          ▼
                                   Retorna escolas
```

---

## 🚀 Deploy & Migração

### Passo 1: Executar Migração SQL

```bash
# 1. Abra o Supabase Dashboard
# 2. Navegue para SQL Editor
# 3. Execute o arquivo:
docs/database/tecnico-escolas-migration.sql
```

**O que será criado:**
- ✅ Coluna `nome` na tabela `app_users`
- ✅ Extensão do enum `user_role` (tecnico, estagiario)
- ✅ Tabela `technician_schools`
- ✅ 4 índices otimizados
- ✅ Políticas RLS
- ✅ 2 helper functions

---

### Passo 2: Migrar Dados Hardcoded

#### Opção A: Console do Navegador (Recomendado)

```bash
# 1. Abra gerenciar-usuarios.html logado como superuser
# 2. Abra DevTools (F12) > Console
# 3. Copie e cole o conteúdo de:
scripts/migrate-schools-to-supabase.js

# 4. Execute:
migrarEscolasParaSupabase()
```

**Output esperado:**
```
╔════════════════════════════════════════════════╗
║   MIGRAÇÃO DE ESCOLAS PARA SUPABASE           ║
╚════════════════════════════════════════════════╝

📊 Total de técnicos: 7
📊 Total de escolas: 97

🔄 Processando: AMELINHA...
🔍 Buscando user_id para Amelinha...
✅ User ID encontrado: uuid-123
📤 Enviando 15 escolas para Amelinha...
✅ Amelinha: 15 escolas migradas

[... repete para todos os 7 técnicos ...]

╔════════════════════════════════════════════════╗
║             RELATÓRIO FINAL                    ║
╚════════════════════════════════════════════════╝

✅ Sucessos: 7/7
❌ Falhas: 0/7

📊 Detalhes dos sucessos:
  - amelinha: 15 escolas
  - libna: 15 escolas
  - rosangela: 16 escolas
  - darison: 15 escolas
  - carla: 15 escolas
  - joselma: 10 escolas
  - silvia: 11 escolas

🎉 Total de escolas migradas: 97
```

---

#### Opção B: Node.js

```bash
# 1. Adicione no topo do arquivo:
const fetch = require('node-fetch');

# 2. Configure manualmente:
const APPS_SCRIPT_URL = 'sua-url-apps-script';

# 3. Execute:
node scripts/migrate-schools-to-supabase.js
```

---

### Passo 3: Verificar Sistema

#### 1. **Verificar Cache Loading**
```javascript
// Console do navegador:
window.NAVMEscolasTecnico.carregarEscolasDeSupabase()

// Logs esperados:
// [EscolasTecnico] 🔄 Carregando escolas do Supabase...
// [EscolasTecnico] ✅ Técnicos encontrados: 7
// [EscolasTecnico] ✅ Cache carregado: 7 técnicos, 97 escolas
```

#### 2. **Verificar Modal**
```bash
# 1. Abra gerenciar-usuarios.html
# 2. Clique no botão 🏫 de um técnico
# 3. Verifique:
#    - Lista disponíveis carrega 97 escolas
#    - Lista atribuídas carrega escolas do técnico
#    - Busca funciona em ambas as listas
#    - Transferência funciona (→ e ←)
#    - Salvar persiste no Supabase
```

#### 3. **Verificar Integração**
```bash
# Como técnico no painel-casos.html:
# 1. Logue como técnico
# 2. Abra o filtro de escolas
# 3. Verifique que aparecem apenas as escolas atribuídas
# 4. Verifique logs no console:
#    [EscolasTecnico] ✅ Escolas carregadas do SUPABASE...
```

---

## 🛠️ Troubleshooting

### Problema: Cache não carrega

**Sintomas:**
```
[EscolasTecnico] ❌ Erro ao carregar Supabase: NetworkError
[EscolasTecnico] ⚠️ Usando fallback hardcoded
```

**Soluções:**
1. Verifique `CONFIG.APPS_SCRIPT_AUTH` está definido
2. Verifique permissões RLS no Supabase
3. Verifique logs do Apps Script
4. Sistema funciona com fallback automático

---

### Problema: Modal não abre

**Sintomas:**
Botão 🏫 não faz nada

**Soluções:**
1. Verifique console por erros JavaScript
2. Certifique-se que técnico tem `role === 'tecnico'`
3. Verifique se modal existe no HTML: `#modalGerenciarEscolas`

---

### Problema: Escolas não salvam

**Sintomas:**
```
❌ Erro ao salvar: 403 Forbidden
```

**Soluções:**
1. Verifique que está logado como admin/superuser
2. Verifique polícias RLS (service_role tem ALL)
3. Verifique payload no Network tab

---

### Problema: Técnico vê todas as escolas

**Sintomas:**
Técnico deveria ver 15 escolas, mas vê 97

**Soluções:**
1. Verifique `role` do usuário no sessionStorage
2. Verifique logs do console:
   ```
   [EscolasTecnico] Técnico identificado...
   ```
3. Verifique se toggle "Ver Todas" está ativo
4. Force recarga do cache:
   ```javascript
   window.NAVMEscolasTecnico.carregarEscolasDeSupabase()
   ```

---

## 📊 Estatísticas

### Dados Atuais (Hardcoded)
- **Total de escolas:** 97
- **Total de técnicos:** 7
- **Distribuição:**
  - Amelinha: 15 escolas (EMEF, Forte São João)
  - Libna: 15 escolas (CMEI, São Pedro)
  - Rosângela: 16 escolas (CMEI, Maruípe)
  - Darison: 15 escolas (EMEF, São Pedro)
  - Carla Maria: 15 escolas (EMEF, Maruípe)
  - Joselma: 10 escolas (EMEF, Centro)
  - Sílvia: 11 escolas (CMEI, Centro)

### Tipos de Escola
- **EMEF:** 55 escolas (56.7%)
- **CMEI:** 42 escolas (43.3%)

### Regiões
- **Forte São João:** 15 escolas (15.5%)
- **São Pedro:** 30 escolas (30.9%)
- **Maruípe:** 31 escolas (32.0%)
- **Centro:** 21 escolas (21.6%)

---

## 🔐 Segurança

### Permissões por Role

| Ação | visualizador | estagiario | tecnico | admin | superuser |
|------|--------------|------------|---------|-------|-----------|
| Ver todas escolas | ✅ | ✅ | ⚠️ Toggle | ✅ | ✅ |
| Ver escolas próprias | ❌ | ❌ | ✅ | ❌ | ❌ |
| Gerenciar atribuições | ❌ | ❌ | ❌ | ✅ | ✅ |
| Migrar dados | ❌ | ❌ | ❌ | ⚠️ | ✅ |

### Validações Backend
- ✅ Caller role verificado em todas as mutations
- ✅ User ID validado como UUID
- ✅ School payload validado (name, type, region obrigatórios)
- ✅ RLS impede escritas não autorizadas
- ✅ Cascade delete configurado (segurança referencial)

---

## 🎯 Próximas Melhorias

### Curto Prazo
- [ ] Dashboard de visualização de atribuições (admin)
- [ ] Exportar relatório de escolas por técnico (CSV/PDF)
- [ ] Histórico de alterações (audit trail)
- [ ] Notificação ao técnico quando escolas mudam

### Médio Prazo
- [ ] Atribuição por tipo de escola (CMEI/EMEF)
- [ ] Atribuição por região automática
- [ ] Balanceamento automático de carga (equalizar escolas)
- [ ] Sugestão de substitutos em ausências

### Longo Prazo
- [ ] Machine learning para prever demandas por escola
- [ ] Integração com calendário (férias, licenças)
- [ ] Rotação automática de responsabilidades
- [ ] Dashboard de métricas por escola/técnico

---

## 📝 Changelog

### v1.0.0 (2024-02-10)
- ✅ Criação da estrutura de banco (technician_schools)
- ✅ Backend CRUD completo (4 actions)
- ✅ Modal de gerenciamento com dual-list
- ✅ Cache Supabase + fallback hardcoded
- ✅ Integração com exclusão de usuário
- ✅ Script de migração de dados
- ✅ Documentação completa

---

## 📚 Referências

- [Documentação Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Google Apps Script - UrlFetchApp](https://developers.google.com/apps-script/reference/url-fetch/url-fetch-app)
- [tecnico-escolas-migration.sql](../database/tecnico-escolas-migration.sql)
- [migrate-schools-to-supabase.js](../../scripts/migrate-schools-to-supabase.js)

---

## 🆘 Suporte

**Problemas técnicos:**
- Verifique arquivo: `docs/troubleshooting/`
- Console logs com prefixo `[EscolasTecnico]`
- Network tab (aba XHR) para requisições ao backend

**Dúvidas sobre o fluxo:**
- Leia seção "Como Funciona" deste documento
- Diagramas de fluxo disponíveis em `DIAGRAMAS-SISTEMA.md`

---

**Última atualização:** 10/02/2024  
**Versão:** 1.0.0  
**Autor:** Sistema NAAM - NavM
