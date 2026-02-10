# PROMPT DE IMPLEMENTACAO - Sistema NAAM
## Refatoracao do Menu de Navegacao por Perfil de Usuario

---

# OBJETIVO

Refatorar o sistema de navegacao do NAAM para exibir menus personalizados baseados no perfil (role) do usuario logado. O botao "Sair" deve estar SEMPRE visivel para todos os usuarios.

---

# ESTRUTURA DE PERMISSOES POR PERFIL

## Matriz de Acesso

| Pagina | Visualizador | Estagiario | Tecnico | Admin |
|--------|:------------:|:----------:|:-------:|:-----:|
| Painel de Casos | ✅ | ✅ | ✅ | ✅ |
| Novo Registro | ❌ | ✅ | ✅ | ❌ |
| Gerenciar Registros | ❌ | ✅ | ❌ | ❌ |
| Minhas Notificacoes | ❌ | ❌ | ✅ | ❌ |
| Painel Admin | ❌ | ❌ | ❌ | ✅ |
| **Botao Sair** | ✅ | ✅ | ✅ | ✅ |

---

# DETALHAMENTO POR PERFIL

## 1. VISUALIZADOR (role: "visualizador")

**Descricao:** Usuario com acesso somente leitura ao painel de casos.

**Menu visivel:**
```
┌─────────────────────────────────────────────────┐
│ [📊 Painel de Casos]              [🚪 Sair]     │
└─────────────────────────────────────────────────┘
```

**Itens do menu:**
1. 📊 Painel de Casos → `painel-casos.html`
2. 🚪 Sair → Logout (sempre visivel)

**Restricoes:**
- NAO pode criar novos registros
- NAO pode editar registros
- NAO pode excluir registros
- Apenas visualiza dados no painel

---

## 2. ESTAGIARIO (role: "estagiario" ou "user")

**Descricao:** Usuario operacional que registra e gerencia casos.

**Menu visivel:**
```
┌───────────────────────────────────────────────────────────────────┐
│ [📊 Painel de Casos] [📝 Novo Registro] [📋 Gerenciar] [🚪 Sair]  │
└───────────────────────────────────────────────────────────────────┘
```

**Itens do menu:**
1. 📊 Painel de Casos → `painel-casos.html`
2. 📝 Novo Registro → `registro-novo-caso.html`
3. 📋 Gerenciar Registros → `gerenciar-casos.html`
4. 🚪 Sair → Logout (sempre visivel)

**Permissoes:**
- Pode criar novos registros
- Pode editar registros (proprios ou todos, conforme regra de negocio)
- Pode visualizar dados no painel
- Pode gerenciar registros existentes

---

## 3. TECNICO (role: "tecnico")

**Descricao:** Usuario tecnico que acompanha casos via notificacoes.

**Menu visivel:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│ [📊 Painel de Casos] [📝 Novo Registro] [🔔 Minhas Notificacoes] [🚪 Sair] │
└─────────────────────────────────────────────────────────────────────────┘
```

**Itens do menu:**
1. 📊 Painel de Casos → `painel-casos.html`
2. 📝 Novo Registro → `registro-novo-caso.html`
3. 🔔 Minhas Notificacoes → `minhas-notificacoes.html`
4. 🚪 Sair → Logout (sempre visivel)

**Permissoes:**
- Pode criar novos registros
- Pode visualizar dados no painel
- Pode acompanhar notificacoes dos casos
- NAO pode acessar gerenciamento de registros

---

## 4. ADMIN (role: "admin" ou "superuser")

**Descricao:** Administrador com acesso ao painel de usuarios e visualizacao completa de casos.

**Menu visivel:**
```
┌───────────────────────────────────────────────────────┐
│ [📊 Painel de Casos] [🔧 Painel Admin]    [🚪 Sair]   │
└───────────────────────────────────────────────────────┘
```

**Itens do menu:**
1. 📊 Painel de Casos → `painel-casos.html`
2. 🔧 Painel Admin → `gerenciar-usuarios.html`
3. 🚪 Sair → Logout (sempre visivel)

**Permissoes:**
- Pode visualizar TODOS os casos no painel
- Pode gerenciar usuarios (criar, editar, excluir)
- **ESPECIAL:** No modal de detalhes do caso (`#modal-detalhes`), deve visualizar:
  - Informacoes normais do caso
  - Historico de atualizacoes
  - **ANEXOS do caso** (diferencial do Admin)

---

# IMPLEMENTACAO DO MODAL DE DETALHES PARA ADMIN

## Estrutura do Modal `#modal-detalhes` para Admin

```
┌─────────────────────────────────────────────────────────────────┐
│ 👁️ Detalhes do Caso #123                                  [X]   │
├─────────────────────────────────────────────────────────────────┤
│ [Dados] [Violencia] [Escola] [Historico] [📎 Anexos]           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ABA: Anexos (VISIVEL APENAS PARA ADMIN)                        │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 📄 documento_caso_123.pdf                    [⬇️ Download]  │ │
│ │    Enviado por: Maria Silva - 15/01/2024 14:30             │ │
│ ├─────────────────────────────────────────────────────────────┤ │
│ │ 🖼️ evidencia_foto.jpg                        [⬇️ Download]  │ │
│ │    Enviado por: Joao Santos - 10/01/2024 09:00             │ │
│ ├─────────────────────────────────────────────────────────────┤ │
│ │ 📄 laudo_medico.pdf                          [⬇️ Download]  │ │
│ │    Enviado por: Admin - 08/01/2024 16:45                   │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ Total: 3 anexos                                                 │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                              [ Fechar ]         │
└─────────────────────────────────────────────────────────────────┘
```

**Regras para aba de Anexos:**
- A aba "Anexos" so deve aparecer se `userRole === 'admin'` ou `userRole === 'superuser'`
- Listar todos os anexos do caso com:
  - Icone baseado no tipo de arquivo (📄 PDF, 🖼️ Imagem, 📊 Excel, etc.)
  - Nome do arquivo
  - Quem enviou
  - Data/hora do envio
  - Botao de download

---

# LOGICA DE RENDERIZACAO DO MENU

## Pseudocodigo

```javascript
function renderizarMenu() {
  const userRole = sessionStorage.getItem('userRole');

  // Array base com itens visiveis para todos
  const menuItems = [];

  // Painel de Casos - TODOS os usuarios
  menuItems.push({
    href: 'painel-casos.html',
    icon: '📊',
    label: 'Painel de Casos',
    bgClass: 'bg-blue-500',
    hoverClass: 'hover:bg-blue-400'
  });

  // Novo Registro - Estagiario e Tecnico
  if (['user', 'estagiario', 'tecnico'].includes(userRole)) {
    menuItems.push({
      href: 'registro-novo-caso.html',
      icon: '📝',
      label: 'Novo Registro',
      bgClass: 'bg-blue-500',
      hoverClass: 'hover:bg-blue-400'
    });
  }

  // Gerenciar Registros - APENAS Estagiario
  if (['user', 'estagiario'].includes(userRole)) {
    menuItems.push({
      href: 'gerenciar-casos.html',
      icon: '📋',
      label: 'Gerenciar Registros',
      bgClass: 'bg-blue-500',
      hoverClass: 'hover:bg-blue-400'
    });
  }

  // Minhas Notificacoes - APENAS Tecnico
  if (userRole === 'tecnico') {
    menuItems.push({
      href: 'minhas-notificacoes.html',
      icon: '🔔',
      label: 'Minhas Notificacoes',
      bgClass: 'bg-purple-500',
      hoverClass: 'hover:bg-purple-400'
    });
  }

  // Painel Admin - APENAS Admin/Superuser
  if (['admin', 'superuser'].includes(userRole)) {
    menuItems.push({
      href: 'gerenciar-usuarios.html',
      icon: '🔧',
      label: 'Painel Admin',
      bgClass: 'bg-white text-blue-600',
      hoverClass: 'hover:shadow-lg'
    });
  }

  // Botao Sair - SEMPRE VISIVEL PARA TODOS
  menuItems.push({
    onclick: 'sair()',
    icon: '🚪',
    label: 'Sair',
    bgClass: 'bg-red-500',
    hoverClass: 'hover:bg-red-600',
    isButton: true
  });

  return menuItems;
}
```

---

# VERIFICACAO DE ACESSO POR PAGINA

## Tabela de Redirecionamento

| Pagina | Roles Permitidos | Redirecionar Para |
|--------|------------------|-------------------|
| `painel-casos.html` | TODOS | - |
| `registro-novo-caso.html` | estagiario, tecnico, user | `painel-casos.html` |
| `gerenciar-casos.html` | estagiario, user | `painel-casos.html` |
| `minhas-notificacoes.html` | tecnico | `painel-casos.html` |
| `gerenciar-usuarios.html` | admin, superuser | `painel-casos.html` |

## Codigo de Verificacao em Cada Pagina

```javascript
// No inicio de cada pagina protegida:
function verificarAcesso(rolesPermitidos) {
  const userRole = sessionStorage.getItem('userRole');

  if (!userRole) {
    // Nao logado - redireciona para login
    window.location.href = 'index.html';
    return false;
  }

  if (!rolesPermitidos.includes(userRole)) {
    // Sem permissao - redireciona para painel
    alert('Voce nao tem permissao para acessar esta pagina.');
    window.location.href = 'painel-casos.html';
    return false;
  }

  return true;
}

// Exemplo de uso em registro-novo-caso.html:
document.addEventListener('DOMContentLoaded', function() {
  verificarAcesso(['user', 'estagiario', 'tecnico']);
});

// Exemplo de uso em gerenciar-casos.html:
document.addEventListener('DOMContentLoaded', function() {
  verificarAcesso(['user', 'estagiario']);
});

// Exemplo de uso em minhas-notificacoes.html:
document.addEventListener('DOMContentLoaded', function() {
  verificarAcesso(['tecnico']);
});

// Exemplo de uso em gerenciar-usuarios.html:
document.addEventListener('DOMContentLoaded', function() {
  verificarAcesso(['admin', 'superuser']);
});
```

---

# FLUXO DE LOGIN ATUALIZADO

## Redirecionamento Pos-Login

```javascript
function redirecionarPosLogin(userRole) {
  switch(userRole) {
    case 'admin':
    case 'superuser':
      // Admin vai direto para o painel de casos
      window.location.href = 'painel-casos.html';
      break;

    case 'tecnico':
      // Tecnico vai para o painel de casos
      window.location.href = 'painel-casos.html';
      break;

    case 'estagiario':
    case 'user':
      // Estagiario vai para o painel de casos
      window.location.href = 'painel-casos.html';
      break;

    case 'visualizador':
      // Visualizador vai para o painel de casos
      window.location.href = 'painel-casos.html';
      break;

    default:
      // Fallback
      window.location.href = 'painel-casos.html';
  }
}
```

---

# ESTILOS DO MENU POR PERFIL

## Classes CSS para Cada Item

```css
/* Item de Menu Padrao */
.menu-item {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

/* Painel de Casos, Novo Registro, Gerenciar */
.menu-item-blue {
  background: #3B82F6;
  color: #FFFFFF;
}
.menu-item-blue:hover {
  background: #60A5FA;
}

/* Minhas Notificacoes */
.menu-item-purple {
  background: #8B5CF6;
  color: #FFFFFF;
}
.menu-item-purple:hover {
  background: #A78BFA;
}

/* Painel Admin */
.menu-item-admin {
  background: #FFFFFF;
  color: #2563EB;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.menu-item-admin:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

/* Botao Sair - SEMPRE VISIVEL */
.menu-item-sair {
  background: #EF4444;
  color: #FFFFFF;
}
.menu-item-sair:hover {
  background: #DC2626;
}
```

---

# RESUMO DAS ALTERACOES NECESSARIAS

## Arquivos a Modificar

1. **`painel-casos.html`**
   - Atualizar renderizacao do menu baseado em role
   - Adicionar aba de Anexos no modal de detalhes (apenas para admin)

2. **`registro-novo-caso.html`**
   - Adicionar verificacao de acesso (estagiario, tecnico)
   - Atualizar menu

3. **`gerenciar-casos.html`**
   - Adicionar verificacao de acesso (apenas estagiario)
   - Atualizar menu

4. **`minhas-notificacoes.html`**
   - Adicionar verificacao de acesso (apenas tecnico)
   - Atualizar menu

5. **`gerenciar-usuarios.html`**
   - Manter verificacao atual (admin, superuser)
   - Atualizar menu

6. **`index.html`** (Login)
   - Atualizar redirecionamento pos-login

## Novo Componente a Criar

- **Sistema de renderizacao de menu dinamico** que pode ser compartilhado entre todas as paginas

---

# CHECKLIST DE IMPLEMENTACAO

- [ ] Criar funcao `renderizarMenuPorRole()` reutilizavel
- [ ] Atualizar menu em `painel-casos.html`
- [ ] Atualizar menu em `registro-novo-caso.html` + verificacao de acesso
- [ ] Atualizar menu em `gerenciar-casos.html` + verificacao de acesso
- [ ] Atualizar menu em `minhas-notificacoes.html` + verificacao de acesso
- [ ] Atualizar menu em `gerenciar-usuarios.html`
- [ ] Implementar aba de Anexos no modal de detalhes para Admin
- [ ] Testar fluxo para cada perfil (Visualizador, Estagiario, Tecnico, Admin)
- [ ] Garantir que botao Sair aparece para TODOS os usuarios
- [ ] Testar redirecionamentos quando usuario sem permissao tenta acessar pagina

---

# FIM DO PROMPT DE IMPLEMENTACAO

**Prioridade:** Alta
**Complexidade:** Media
**Estimativa:** Depende da implementacao atual

**Pontos criticos:**
1. O botao "Sair" DEVE estar visivel para TODOS os usuarios
2. A aba de Anexos no modal de detalhes APENAS para Admin
3. Verificacao de acesso em cada pagina protegida
