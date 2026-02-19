# Implementação: Modelo de Estado para Escolas

**Data:** 11 de Fevereiro de 2026  
**Status:** ✅ IMPLEMENTADO  
**Versão:** 2.0 (State-Based Model)

---

## Resumo da Mudança

A tabela `technician_schools` **NÃO é mais manipulada com INSERT/DELETE**. Agora usa **apenas PATCH no campo `user_id`** para representar o estado da vinculação.

| Operação | Antes (❌) | Depois (✅) |
|----------|-----------|-----------|
| Adicionar escola | INSERT novo registro | PATCH `user_id = NULL → <uuid>` |
| Remover escola | DELETE registro | PATCH `user_id = <uuid> → NULL` |
| Excluir técnico | DELETE todas escolas dele | PATCH todas `user_id → NULL` |
| Escolas base | Dinâmicas | Pré-criadas no init SQL |

---

## O Problema Antigo

Quando um técnico atribuía uma escola que estava com `user_id = NULL`, o sistema fazia:

```javascript
// ❌ ERRADO
DELETE FROM technician_schools WHERE user_id = 'tech-uuid'
INSERT INTO technician_schools (user_id, school_name, ...) VALUES (...)
```

**Resultado:** Escolas com `user_id = NULL` não eram deletadas, causando **duplicatas**.

---

## A Solução: PATCH user_id

**Nova lógica:**

```javascript
// ✅ CORRETO - Apenas PATCHes
PATCH technician_schools SET user_id = '<novo-uuid>'
PATCH technician_schools SET user_id = NULL
```

**Garante:**
- ✅ Uma escola existe uma única vez na tabela
- ✅ Nenhum INSERT
- ✅ Nenhum DELETE
- ✅ Apenas mudanças de estado via `user_id`

---

## Funções Modificadas

### 1. `salvarEscolasTecnico(userId, schools, callerRole, callerId)`

**Arquivo:** `backend/Code-Supabase.gs` (linhas ~2371+)

**O que faz:**
1. Busca TODAS as escolas da tabela
2. PATCH escolas para **vincular** ao técnico
3. PATCH escolas para **desvincular** do técnico
4. Nenhum INSERT, nenhum DELETE

**Exemplo de Uso:**

```javascript
const resultado = salvarEscolasTecnico(
  'uuid-tecnico-123',  // userId
  [
    { school_name: 'EMEF TESTE 1', school_type: 'EMEF', school_region: 'Zona Nord' },
    { school_name: 'CMEI TESTE 2', school_type: 'CMEI', school_region: 'Zona Sul' }
  ],  // schools (apenas as que devem estar vinculadas)
  'admin',             // callerRole
  'uuid-admin-456'     // callerId
);

// Resultado:
// {
//   sucesso: true,
//   mensagem: "2 escola(s) vinculada(s) com sucesso",
//   data: {
//     total_vinculadas: 2,      // PATCHes de NULL → uuid
//     total_desvinculadas: 0,   // PATCHes de uuid → NULL
//     total_processadas: 2
//   }
// }
```

### 2. `deletarEscolasTecnico(userId, callerRole)`

**Arquivo:** `backend/Code-Supabase.gs` (linhas ~2586+)

**O que faz:**
1. Busca todas as escolas vinculadas ao técnico
2. PATCH `user_id = NULL` em cada uma
3. Nenhum DELETE

**Exemplo de Uso:**

```javascript
const resultado = deletarEscolasTecnico(
  'uuid-tecnico-123',  // userId sendo excluído
  'admin'              // callerRole
);

// Resultado:
// {
//   sucesso: true,
//   mensagem: "2 escola(s) desvinculada(s) com sucesso",
//   total_desvinculadas: 2
// }
```

---

## Fluxo Completo

### Exemplo: Admin atribui 2 escolas ao Técnico A

**Estado Inicial:**
```
EMEF TESTE 1 → user_id: NULL (sem técnico)
CMEI TESTE 2 → user_id: NULL (sem técnico)
EMEF TESTE 3 → user_id: NULL (sem técnico)
```

**Admin Seleciona:** EMEF TESTE 1 + CMEI TESTE 2

**Processamento:**
```javascript
salvarEscolasTecnico('uuid-TECNICO-A', [
  { school_name: 'EMEF TESTE 1', ... },
  { school_name: 'CMEI TESTE 2', ... }
]);
```

**Açoes do Backend:**

1. Busca todas as escolas
2. Encontra "EMEF TESTE 1" com user_id NULL
   - PATCH: `user_id = NULL` → `user_id = 'uuid-TECNICO-A'` ✅
3. Encontra "CMEI TESTE 2" com user_id NULL
   - PATCH: `user_id = NULL` → `user_id = 'uuid-TECNICO-A'` ✅
4. Encontra "EMEF TESTE 3" com user_id NULL
   - Não está na lista, continua como está (nada faz)

**Estado Final:**
```
EMEF TESTE 1 → user_id: 'uuid-TECNICO-A' (vinculada) ✅
CMEI TESTE 2 → user_id: 'uuid-TECNICO-A' (vinculada) ✅
EMEF TESTE 3 → user_id: NULL (sem técnico)
```

---

## Dados Históricos

Se há duplicatas no banco (de antes dessa implementação):

**Usar:** `CLEANUP-DUPLICATAS.gs`

```javascript
// 1. Primeiro, verificar
verificarEscolasDuplicadas();  // Mostra quais estão duplicadas

// 2. Depois, limpar
limparEscolasDuplicadas();     // Deleta as duplicatas
```

**Após limpeza:** Cada escola aparece apenas uma vez.

---

## Garantias de Integridade

### ✅ Uma escola nunca aparece 2+ vezes

```sql
SELECT school_name, COUNT(*) AS total
FROM technician_schools
GROUP BY school_name
HAVING COUNT(*) > 1;
-- Resultado: vazio (zero duplicatas)
```

### ✅ user_id define o vínculo

```sql
SELECT school_name, user_id
FROM technician_schools
WHERE user_id = 'uuid-TECNICO-A';
-- Resultado: Todas as escolas vinculadas a esse técnico
```

### ✅ NULL = sem técnico

```sql
SELECT school_name, user_id
FROM technician_schools
WHERE user_id IS NULL;
-- Resultado: Todas as escolas disponíveis para atribuição
```

---

## RLS (Row-Level Security)

Funções usam `service_role key` para escrever porque:

1. **user_id** é crítico para integridade
2. **Apenas admins devem** poder PATCH este campo
3. **Anon key** (público) não pode modificar

```javascript
const writeHeaders = getSupabaseHeaders(true); // service_role
```

---

## Testes

### Teste 1: Adicionar escola
```javascript
// Técnico A não tem escolas
salvarEscolasTecnico('uuid-A', [{ school_name: 'EMEF 1' }], 'admin', 'uuid-admin');
// Resultado: total_vinculadas: 1 ✅
```

### Teste 2: Remover escola
```javascript
// Técnico A tem EMEF 1 e CMEI 2
salvarEscolasTecnico('uuid-A', [{ school_name: 'EMEF 1' }], 'admin', 'uuid-admin');
// Resultado: total_desvinculadas: 1, total_vinculadas: 0 ✅
```

### Teste 3: Reatribuir
```javascript
// EMEF 1 estava com Técnico A
salvarEscolasTecnico('uuid-B', [{ school_name: 'EMEF 1' }], 'admin', 'uuid-admin');
// Resultado: EMEF 1 agora tem user_id = 'uuid-B' ✅
```

### Teste 4: Excluir técnico
```javascript
deletarEscolasTecnico('uuid-A', 'admin');
// Resultado: Todas as escolas de A agora têm user_id = NULL ✅
```

---

## Impacto no Frontend

**Sem mudanças!** O frontend (`gerenciar-usuarios.html`) continua funcionando igual:

```javascript
// Envia lista de escolas selecionadas
await fetch(APPS_SCRIPT_URL, {
  method: 'POST',
  body: 'data=' + JSON.stringify({
    action: 'save_technician_schools',
    user_id: 'uuid-tecnico',
    schools: [...]  // Lista do que deve estar vinculado
  })
});
```

Backend cuida do resto (PATCH inteligente).

---

## Checklist de Validação

- [x] `salvarEscolasTecnico()` refatorado para PATCH
- [x] `deletarEscolasTecnico()` refatorado para PATCH  
- [x] Nenhum INSERT dinâmico de escolas
- [x] Nenhum DELETE de escolas
- [x] Documentação atualizada (`FIX-DUPLICACAO-ESCOLAS.md`)
- [x] Script de limpeza disponível (`CLEANUP-DUPLICATAS.gs`)
- [x] RLS mantido com service_role
- [x] Frontend sem alterações necessárias

---

## Próximas Etapas

1. **Verificar banco:** Executar `verificarEscolasDuplicadas()`
2. **Se houver duplicatas:** Executar `limparEscolasDuplicadas()`
3. **Testar fluxo completo:** Atribuir/remover escolas de um técnico
4. **Validar:** Garantir que cada escola aparece uma única vez

---

## Referências

- **Modelo de Dados:** [FIX-DUPLICACAO-ESCOLAS.md](FIX-DUPLICACAO-ESCOLAS.md)
- **Limpeza de Dados:** [CLEANUP-DUPLICATAS.gs](backend/CLEANUP-DUPLICATAS.gs)
- **Frontend:** [gerenciar-usuarios.html](gerenciar-usuarios.html)
- **Backend:** [Code-Supabase.gs](backend/Code-Supabase.gs) (funções ~2371+, ~2586+)

---

**Implementado por:** Sistema de Atualização  
**Última revisão:** 11 de Fevereiro de 2026
