# ARQUITETURA DE ESCOLAS: Modelo de Estado (user_id)

## Modelo de Dados

A tabela `technician_schools` armazena o **estado atual** da vinculação entre técnicos e escolas. Cada escola existe **UMA ÚNICA VEZ** na tabela.

### Estrutura
```sql
technician_schools:
  id → UUID (chave primária)
  school_name → TEXT (nome da escola)
  school_type → TEXT (EMEF, CMEI, etc)
  school_region → TEXT (região/zona)
  user_id → UUID (NULLABLE - define o vínculo)
  assigned_at → TIMESTAMP
  assigned_by → UUID
```

## Regra Fundamental

**A escola está NUNCA é criada, deletada ou duplicada. Seu estado é definido APENAS pelo campo `user_id`:**

- `user_id = NULL` → Escola não tem técnico atribuído
- `user_id = <uuid>` → Escola está vinculada ao técnico com esse UUID

## Operações Permitidas

### ✅ Ao ADICIONAR escola a um técnico

**Operação: PATCH**

```sql
UPDATE technician_schools
SET user_id = '<tecnico-uuid>'
WHERE school_name = 'ESCOLA-X' AND user_id IS NULL;
```

**Código (Backend):**
```javascript
const patchPayload = { user_id: userId };
// Via Supabase REST: PATCH /rest/v1/technician_schools?id=eq.<escola-id>
```

**Resultado:** Uma linha, com `user_id` atualizado

### ✅ Ao REMOVER escola de um técnico

**Operação: PATCH**

```sql
UPDATE technician_schools
SET user_id = NULL
WHERE school_name = 'ESCOLA-X' AND user_id = '<tecnico-uuid>';
```

**Código (Backend):**
```javascript
const patchPayload = { user_id: null };
// Via Supabase REST: PATCH /rest/v1/technician_schools?id=eq.<escola-id>
```

**Resultado:** Uma linha, com `user_id` voltando para NULL

## Operações PROIBIDAS ❌

### ❌ Nunca DELETE registros

```javascript
// PROIBIDO!
DELETE FROM technician_schools WHERE user_id = '<tecnico-uuid>';
```

➡️ Se uma escola não tem mais técnico, apenas `SET user_id = NULL`

### ❌ Nunca INSERT novos registros

```javascript
// PROIBIDO!
INSERT INTO technician_schools (user_id, school_name, ...)
VALUES ('<tecnico-uuid>', 'NOVA-ESCOLA', ...);
```

➡️ Se a escola não existe, é porque **não foi cadastrada no sistema ainda**. Escolas só são criadas uma vez, durante inicialização via SQL.

### ❌ Nunca crie duplicatas

```javascript
// PROIBIDO! Isso causa duas linhas da mesma escola
INSERT INTO technician_schools (user_id, school_name, ...)
VALUES ('<tecnico-uuid>', 'ESCOLA-X', ...);
INSERT INTO technician_schools (user_id, school_name, ...)
VALUES (null, 'ESCOLA-X', ...);  // ❌ Duplicata!
```

## Fluxo de Uso (Correto)

### 1️⃣ Inicialização do Sistema

```sql
-- Uma única vez, INSERTS de todas as escolas base
INSERT INTO technician_schools (user_id, school_name, school_type, school_region)
VALUES 
  (NULL, 'EMEF TESTE 1', 'EMEF', 'Zona Nord'),
  (NULL, 'CMEI TESTE 2', 'CMEI', 'Zona Sul'),
  (NULL, 'EMEF TESTE 3', 'EMEF', 'Zona Leste');
```

**Estado inicial:** Todas com `user_id = NULL` (nenhuma vinculada)

### 2️⃣ Admin atribui escolas ao Técnico A

**Entrada:** Telefone envia lista de escolas selecionadas

**Processamento (salvarEscolasTecnico):**
1. Busca TODAS as escolas da tabela
2. Para cada NOVA escola selecionada:
   - Se `user_id = NULL`: PATCH → `user_id = 'TECNICO-A'`
   - Se `user_id = outro-tecnico`: PATCH → `user_id = 'TECNICO-A'`
3. Para cada escola que Técnico A TINHA mas foi REMOVIDA:
   - PATCH → `user_id = NULL`

**Estado após:**
```
EMEF TESTE 1 → user_id = NULL (não selecionada, desvinculada)
CMEI TESTE 2 → user_id = 'uuid-TECNICO-A' (selecionada, vinculada)
EMEF TESTE 3 → user_id = 'uuid-TECNICO-A' (selecionada, vinculada)
```

### 3️⃣ Admin remove algumas escolas do Técnico A

**Entrada:** Nova lista com menos escolas

**Processamento:**
1. Busca escolas que Técnico A tinha
2. Faz PATCH `user_id = NULL` nas que foram removidas

**Estado após:**
```
EMEF TESTE 1 → user_id = NULL (continua desvinculada)
CMEI TESTE 2 → user_id = NULL (foi desvinculada)
EMEF TESTE 3 → user_id = 'uuid-TECNICO-A' (continua vinculada)
```

### 4️⃣ Técnico A é excluído

**Processamento (deletarEscolasTecnico):**
1. Busca TODAS escolas com `user_id = 'TECNICO-A'`
2. Faz PATCH `user_id = NULL` em cada uma

**Estado após:**
```
EMEF TESTE 1 → user_id = NULL
CMEI TESTE 2 → user_id = NULL
EMEF TESTE 3 → user_id = NULL  // ← Foi desvinculada
```

**Importante:** Nenhum registro foi deletado! As escolas continuam existindo, só foram desvinculadas.

## Implementação (Backend)

### Função: salvarEscolasTecnico()

Localização: `backend/Code-Supabase.gs` (linhas ~2371+)

**Lógica:**
1. Busca todas as escolas da tabela
2. PATCHes escolas para vincular (APENAS PATCH no user_id)
3. PATCHes escolas para desvincular (APENAS PATCH user_id = NULL)
4. **Nunca** INSERT, nunca DELETE

**Assinatura:**
```javascript
function salvarEscolasTecnico(userId, schools, callerRole, callerId)
// userId: UUID do técnico
// schools: Array de escolas selecionadas [{school_name, school_type, school_region}]
// Retorna: { sucesso, mensagem, data: { total_vinculadas, total_desvinculadas } }
```

### Função: deletarEscolasTecnico()

Localização: `backend/Code-Supabase.gs` (linhas ~2596+)

**Lógica:**
1. Busca todas as escolas vinculadas ao técnico
2. PATCH `user_id = NULL` em cada uma
3. **Nunca** DELETE

## Validação de Integridade

### ✅ Correto

```sql
-- Todas as escolas existem uma única vez
SELECT COUNT(*) AS total_escolas FROM technician_schools;
-- 3

-- Pode haver múltiplos técnicos
SELECT DISTINCT user_id FROM technician_schools;
-- NULL, uuid-TECNICO-A, uuid-TECNICO-B

-- Uma escola está em uma única "lista" (um único técnico OU NULL)
SELECT school_name, COUNT(*) AS duplicatas
FROM technician_schools
GROUP BY school_name
HAVING COUNT(*) > 1;
-- (deve retornar vazio - zero duplicatas)
```

### ❌ Errado (Exemplo de Bug)

```sql
-- Mesma escola, duas vezes
SELECT * FROM technician_schools
WHERE school_name = 'EMEF TESTE 1';

-- ID: abc-123, user_id: NULL, school_name: EMEF TESTE 1
-- ID: def-456, user_id: uuid-TECNICO-A, school_name: EMEF TESTE 1 ❌ DUPLICATA!
```

**Solução:** Usar a função `limparEscolasDuplicadas()` em `CLEANUP-DUPLICATAS.gs`

## Frontend

Localização: `gerenciar-usuarios.html` (linha ~2855+)

**Função:** `salvarEscolasAtribuidas()`

**O que faz:**
1. Coleta escolas selecionadas pelo admin
2. Envia para backend via `action: 'save_technician_schools'`
3. Backend cuida do PATCH

**O que NÃO faz:**
- Não cria escolas novas
- Não deleta escolas da tabela
- Apenas marca o que foi selecionado

## RLS (Row-Level Security)

A tabela usa **service_role key** para writes para garantir que:
- Apenas admins/superusers podem PATCH user_id
- Dados não são duplicados acidentalmente
- Integridade é mantida

## Resumo da Mudança

| Operação | Antes (❌ Errado) | Depois (✅ Correto) |
|----------|------------------|-------------------|
| Adicionar escola a técnico | INSERT novo registro | PATCH user_id = NULL → user_id |
| Remover escola de técnico | DELETE registro | PATCH user_id = técnico → NULL |
| Excluir técnico | DELETE todas suas escolas | PATCH user_id = NULL |
| Escolas base | Criadas dinamicamente | Criadas uma vez via SQL |

---

**Data:** 2026-02-11
**Versão:** 2.0 (Model State-Based)
**Funções alteradas:** `salvarEscolasTecnico()`, `deletarEscolasTecnico()`
**Status:** ✅ Implementado

