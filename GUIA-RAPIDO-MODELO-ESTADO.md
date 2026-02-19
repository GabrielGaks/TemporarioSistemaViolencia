# GUIA RÁPIDO: Modelo de Estado para Escolas

## 📋 Resumo

A tabela `technician_schools` agora funciona **apenas com mudança de estado via `user_id`**. Sem INSERT, sem DELETE, sem duplicatas.

---

## 🎯 O Novo Modelo

```
user_id = NULL          → Escola SEM técnico
user_id = '<uuid>'      → Escola COM técnico
```

**Tudo mais permanece igual!**

---

## 🔄 Operações

### Atribuir Escola a Técnico

```javascript
salvarEscolasTecnico('uuid-tecnico', [
  { school_name: 'EMEF 1', school_type: 'EMEF', school_region: 'Zona' }
]);
// Resultado: user_id = NULL → user_id = 'uuid-tecnico'
```

### Remover Escola de Técnico

```javascript
// Mesma função, mas sem a escola na lista
salvarEscolasTecnico('uuid-tecnico', [
  // EMEF 1 foi removida
]);
// Resultado: user_id = 'uuid-tecnico' → user_id = NULL
```

### Excluir Técnico

```javascript
deletarEscolasTecnico('uuid-tecnico');
// Resultado: Todas suas escolas voltam para user_id = NULL
```

---

## 📍 Arquivos Modificados

| Arquivo | Mudança |
|---------|---------|
| `backend/Code-Supabase.gs` | `salvarEscolasTecnico()` - linhas ~2371+ |
| `backend/Code-Supabase.gs` | `deletarEscolasTecnico()` - linhas ~2586+ |
| `gerenciar-usuarios.html` | NENHUMA (continua igual) |

---

## ✅ O Que Foi Garantido

```
✅ Uma escola = uma linha na tabela
✅ Nenhum INSERT dinâmico
✅ Nenhum DELETE na tabela
✅ Nenhuma duplicata
✅ Estado controlado por user_id
✅ RLS mantido
✅ Frontend compatível
```

---

## 🧹 Se Houver Dados Duplicados (Antes)

```javascript
// 1. Verificar
verificarEscolasDuplicadas();

// 2. Limpar (se houver)
limparEscolasDuplicadas();
```

Função: `backend/CLEANUP-DUPLICATAS.gs`

---

## 📚 Documentação Completa

1. **[FIX-DUPLICACAO-ESCOLAS.md](FIX-DUPLICACAO-ESCOLAS.md)** - O modelo explicado
2. **[IMPLEMENTACAO-MODELO-ESTADO-ESCOLAS.md](IMPLEMENTACAO-MODELO-ESTADO-ESCOLAS.md)** - Como funciona
3. **[VERIFICACAO-MODELO-ESTADO.md](VERIFICACAO-MODELO-ESTADO.md)** - Validação

---

## 🚀 Pronto para Usar

Tudo implementado, testado e validado. Nenhuma ação necessária ✅

---

**Mais dúvidas?** Veja os documentos acima.
