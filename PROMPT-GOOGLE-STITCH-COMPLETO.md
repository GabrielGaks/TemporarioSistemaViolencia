# PROMPT COMPLETO PARA GOOGLE STITCH
## Refatoracao de Design - Sistema NAAM

> **Documento Unificado e Autocontido**
> Contém TODAS as informações necessárias para refatorar o design sem acesso ao código-fonte.

---

# PARTE 1 - VISAO GERAL DO SISTEMA

## 1.1 Nome e Proposito

**Nome:** NAAM - Sistema de Notificacao de Atos contra Alunos Menores
**Proposito:** Sistema web para registro, gerenciamento e acompanhamento de casos de violencia escolar em escolas publicas municipais (CMEIs e EMEFs).

## 1.2 Publico-alvo e Personas

| Persona | Role | Funcoes | Frequencia de Uso |
|---------|------|---------|-------------------|
| **Operador** | user | Registra novos casos, edita proprios registros, ve notificacoes | Diario |
| **Visualizador** | visualizador | Apenas consulta dados no painel | Semanal |
| **Administrador** | admin | Gerencia usuarios, acesso total aos casos | Diario |
| **Superusuario** | superuser | Controle total do sistema | Conforme necessidade |

## 1.3 Objetivos de Negocio

1. Centralizar registros de violencia escolar
2. Acompanhar encaminhamentos (Conselho Tutelar, CREAS, etc.)
3. Gerar relatorios e estatisticas por escola/regiao
4. Garantir rastreabilidade e auditoria dos casos

## 1.4 Stack Tecnologico Frontend

- **HTML5** com Tailwind CSS (utility-first)
- **JavaScript** vanilla (ES6+)
- **CSS** customizado (styles-elegant.css, atualizacoes.css)
- **Bibliotecas:** Flatpickr (datepicker), Chart.js (graficos)
- **Backend:** Google Apps Script + Supabase

---

# PARTE 2 - INVENTARIO COMPLETO DE TELAS

## 2.1 Tela: Login (index.html)

**Proposito:** Autenticacao de usuarios no sistema
**Acesso:** Publico

**Elementos:**
- Logo/icone do sistema (emoji em circulo gradiente)
- Titulo "NAAM" com subtitulo descritivo
- Campo email (input text com icone)
- Campo senha (input password com toggle visibilidade)
- Botao "Entrar" (gradiente azul)
- Link "Esqueci minha senha"
- Mensagens de erro/sucesso (toast)

**Layout Textual:**
```
┌─────────────────────────────────────┐
│         [Logo Gradiente]            │
│              NAAM                   │
│   Sistema de Notificacao de Atos    │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 👤 Email                    │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ 🔒 Senha            [👁]    │   │
│  └─────────────────────────────┘   │
│                                     │
│       [ ENTRAR (gradiente) ]        │
│                                     │
│       Esqueci minha senha →         │
└─────────────────────────────────────┘
```

**Fluxo:** Login → Redireciona por role (admin→usuarios, user→casos, visualizador→painel)

---

## 2.2 Tela: Painel de Casos (painel-casos.html)

**Proposito:** Visualizacao e analise de dados de casos
**Acesso:** Todos os usuarios autenticados

**Elementos:**
- Menu de navegacao (desktop/mobile)
- Cabecalho com titulo e icone
- Secao de filtros (escola, tipo violencia, data, status)
- Tabela de casos com paginacao
- Graficos estatisticos (Chart.js)
- Botao "Atualizar Dados"
- Badge de novas notificacoes

**Layout Textual:**
```
┌─────────────────────────────────────────────────────────┐
│ [Menu] Painel | Novo | Gerenciar | Notificacoes | Sair  │
├─────────────────────────────────────────────────────────┤
│  📊 Painel de Casos                                     │
│  Visualize e analise os registros do sistema            │
├─────────────────────────────────────────────────────────┤
│ 🔍 FILTROS                                              │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐            │
│ │ Escola │ │ Tipo   │ │ Data   │ │ Status │            │
│ └────────┘ └────────┘ └────────┘ └────────┘            │
│                        [🔄 Atualizar] [🗑 Limpar]        │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ID │ Aluno │ Escola │ Tipo │ Data │ Status │ Acoes │ │
│ ├────┼───────┼────────┼──────┼──────┼────────┼───────┤ │
│ │ 1  │ ...   │ ...    │ ...  │ ...  │ ...    │ [👁]  │ │
│ │ 2  │ ...   │ ...    │ ...  │ ...  │ ...    │ [👁]  │ │
│ └─────────────────────────────────────────────────────┘ │
│                    [< 1 2 3 ... >]                       │
├─────────────────────────────────────────────────────────┤
│ 📈 ESTATISTICAS                                         │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐      │
│ │ [Grafico 1]  │ │ [Grafico 2]  │ │ [Grafico 3]  │      │
│ │ Por Tipo     │ │ Por Escola   │ │ Por Periodo  │      │
│ └──────────────┘ └──────────────┘ └──────────────┘      │
└─────────────────────────────────────────────────────────┘
```

---

## 2.3 Tela: Novo Registro (registro-novo-caso.html)

**Proposito:** Criar novo caso de violencia
**Acesso:** Operadores e Admins (visualizadores sao redirecionados)

**Elementos:**
- Progress bar de preenchimento (8 secoes)
- Secoes colapsiveis do formulario
- Campos com validacao em tempo real
- Auto-save em localStorage
- Sistema de tags para multi-selecao
- Autocomplete para escolas/nomes
- Campos condicionais (aparecem conforme selecao)

**Secoes do Formulario:**
1. Dados da Crianca/Estudante
2. Situacao da Violencia
3. Contexto do Incidente
4. Dados Escolares
5. Encaminhamentos
6. Documentacao/Anexos
7. Observacoes
8. Revisao e Envio

**Layout Textual (Secao 1):**
```
┌─────────────────────────────────────────────────────────┐
│ [Menu de Navegacao]                                     │
├─────────────────────────────────────────────────────────┤
│  📝 Novo Registro de Caso                               │
│  ═══════════════════════════════════════                │
│  Progresso: [████████░░░░░░░░░░] 40%                    │
├─────────────────────────────────────────────────────────┤
│ ▼ SECAO 1: Dados da Crianca/Estudante                   │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Nome da Crianca *          │ Idade *               │ │
│ │ ┌─────────────────────┐    │ ┌─────────────────┐   │ │
│ │ │ [Autocomplete]      │    │ │ [Numero]        │   │ │
│ │ └─────────────────────┘    │ └─────────────────┘   │ │
│ │                                                     │ │
│ │ Identidade de Genero *     │ Raca/Cor *            │ │
│ │ ┌─────────────────────┐    │ ┌─────────────────┐   │ │
│ │ │ [Select Elegante]   │    │ │ [Select]        │   │ │
│ │ └─────────────────────┘    │ └─────────────────┘   │ │
│ │                                                     │ │
│ │ PCD/Transtorno *                                    │ │
│ │ ┌─────────────────────┐                            │ │
│ │ │ [Sim/Nao]           │                            │ │
│ │ └─────────────────────┘                            │ │
│ │   ↳ Se "Sim": [Tags de transtornos]                │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ► SECAO 2: Situacao da Violencia (clique para expandir) │
│ ► SECAO 3: Contexto do Incidente                        │
│ ...                                                     │
├─────────────────────────────────────────────────────────┤
│ [💾 Rascunho salvo automaticamente]                     │
│                                                         │
│       [ CANCELAR ]    [ ✅ REGISTRAR CASO ]             │
└─────────────────────────────────────────────────────────┘
```

---

## 2.4 Tela: Gerenciar Casos (gerenciar-casos.html)

**Proposito:** Editar, visualizar e excluir casos existentes
**Acesso:** Operadores e Admins

**Elementos:**
- Tabela de casos com busca
- Filtros avancados
- Modal de edicao com abas
- Historico de atualizacoes com badges de status
- Botoes de acao (editar, excluir, ver detalhes)
- Sistema de anexos

**Layout Textual:**
```
┌─────────────────────────────────────────────────────────┐
│ [Menu de Navegacao]                                     │
├─────────────────────────────────────────────────────────┤
│  📋 Gerenciar Registros                                 │
│  Visualize, edite ou exclua registros existentes        │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🔍 Buscar: [________________] [🔄 Carregar]         │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ 🔍 FILTROS AVANCADOS                                    │
│ [Escola ▼] [Tipo ▼] [Data ▼] [Status ▼] [Aplicar]      │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ☑ │ ID │ Aluno │ Escola │ Data │ Acoes             │ │
│ ├───┼────┼───────┼────────┼──────┼───────────────────┤ │
│ │ ☐ │ 1  │ Ana   │ EMEF X │ 10/01│ [✏] [👁] [🗑]     │ │
│ │ ☐ │ 2  │ Joao  │ CMEI Y │ 11/01│ [✏] [👁] [🗑]     │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Exibindo 1-10 de 150 registros    [< 1 2 3 ... >]      │
└─────────────────────────────────────────────────────────┘

MODAL DE EDICAO:
┌─────────────────────────────────────────────────────────┐
│ ✏️ Editar Registro #123                          [X]    │
├─────────────────────────────────────────────────────────┤
│ [Dados] [Violencia] [Escola] [Historico] [Anexos]      │
├─────────────────────────────────────────────────────────┤
│ ABA: Historico de Atualizacoes                          │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 📅 15/01/2024 14:30  [🟡 Pendente]                  │ │
│ │ 👤 Maria Silva                                      │ │
│ │ Encaminhado ao Conselho Tutelar                     │ │
│ ├─────────────────────────────────────────────────────┤ │
│ │ 📅 10/01/2024 09:00  [🟢 Concluido]                 │ │
│ │ 👤 Joao Santos                                      │ │
│ │ Caso registrado inicialmente                        │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ADICIONAR NOVA ATUALIZACAO:                             │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [Textarea para nova atualizacao]                    │ │
│ └─────────────────────────────────────────────────────┘ │
│ Status: [Pendente ▼]                                    │
│                     [➕ Adicionar Atualizacao]          │
├─────────────────────────────────────────────────────────┤
│        [ CANCELAR ]         [ 💾 SALVAR ALTERACOES ]    │
└─────────────────────────────────────────────────────────┘
```

---

## 2.5 Tela: Gerenciar Usuarios (gerenciar-usuarios.html)

**Proposito:** Administracao de usuarios do sistema
**Acesso:** Apenas Admin e Superuser

**Elementos:**
- Tabela de usuarios
- Filtro por email
- Modal para adicionar/editar usuario
- Badges de role coloridos
- Confirmacao de exclusao
- Logs de atividades do sistema

**Layout Textual:**
```
┌─────────────────────────────────────────────────────────┐
│ [Menu de Navegacao]                                     │
├─────────────────────────────────────────────────────────┤
│  🔧 Painel Administrativo                               │
│  Gerencie usuarios e permissoes do sistema              │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🔍 Buscar usuario: [______________]                 │ │
│ │                                 [➕ Novo Usuario]    │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Email              │ Papel           │ Acoes        │ │
│ ├────────────────────┼─────────────────┼──────────────┤ │
│ │ admin@escola.gov   │ [🔵 Admin]      │ [✏] [🗑]    │ │
│ │ maria@escola.gov   │ [🟢 Operador]   │ [✏] [🗑]    │ │
│ │ joao@escola.gov    │ [⚪ Visualiz.]  │ [✏] [🗑]    │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Total: 25 usuarios                                      │
├─────────────────────────────────────────────────────────┤
│ 📋 ATIVIDADES RECENTES DO SISTEMA                       │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [➕ CRIACAO] Novo caso registrado - Maria - 14:30   │ │
│ │ [✏️ EDICAO] Caso #123 atualizado - Joao - 13:00     │ │
│ │ [🔐 LOGIN] Admin logou no sistema - 09:00          │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 2.6 Tela: Minhas Notificacoes (minhas-notificacoes.html)

**Proposito:** Ver notificacoes de casos criados/atualizados
**Acesso:** Todos os usuarios autenticados

**Elementos:**
- Lista de notificacoes agrupadas por aluno
- Badge de contagem
- Filtro por status (lido/nao lido)
- Link para editar caso
- Accordion colapsivel por crianca

**Layout Textual:**
```
┌─────────────────────────────────────────────────────────┐
│ [Menu de Navegacao]                                     │
├─────────────────────────────────────────────────────────┤
│  🔔 Minhas Notificacoes                                 │
│  Acompanhe atualizacoes dos seus casos                  │
├─────────────────────────────────────────────────────────┤
│ FILTROS: [Todas] [Nao lidas] [Lidas]                    │
├─────────────────────────────────────────────────────────┤
│ ▼ Ana Silva (3 notificacoes)                            │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🔴 Caso atualizado - EMEF Centro - 15/01 14:30     │ │
│ │ 🔴 Novo encaminhamento - 14/01 10:00               │ │
│ │ ⚪ Caso visualizado - 10/01 09:00                  │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ► Joao Santos (1 notificacao)                           │
│ ► Maria Oliveira (5 notificacoes)                       │
└─────────────────────────────────────────────────────────┘
```

---

## 2.7 Tela: Recuperar Senha (recuperar-senha.html)

**Proposito:** Solicitar reset de senha
**Acesso:** Publico

---

## 2.8 Tela: Resetar Senha (resetar-senha.html)

**Proposito:** Definir nova senha via token
**Acesso:** Publico (com token valido)

---

# PARTE 3 - DESIGN SYSTEM ATUAL

## 3.1 CORES

### 3.1.1 Cores Primarias

| Nome | Codigo Hex | Uso |
|------|------------|-----|
| **Primaria** | `#3B82F6` | Botoes, links, elementos de destaque |
| **Primaria Hover** | `#2563EB` | Estado hover de elementos primarios |
| **Primaria Active** | `#1D4ED8` | Estado active/pressed |
| **Primaria Dark** | `#1E40AF` | Textos em badges, enfases fortes |

### 3.1.2 Cores Secundarias (Roxo)

| Nome | Codigo Hex | Uso |
|------|------------|-----|
| **Roxo Primario** | `#8B5CF6` | Botoes de download, badges de anexos |
| **Roxo Hover** | `#7C3AED` | Hover de elementos roxos |
| **Roxo Active** | `#6D28D9` | Estado active |
| **Roxo Light** | `#EDE9FE` | Background de grupos/cards roxos |
| **Indigo** | `#6366F1` | Alternativo |

### 3.1.3 Cores de Background

| Nome | Codigo Hex | Uso |
|------|------------|-----|
| **Background Principal** | `#FFFFFF` | Fundo de cards, modais, corpo |
| **Background Secundario** | `#F9FAFB` | Fundo de secoes alternativas |
| **Background Terciario** | `#F3F4F6` | Fundo de inputs, areas inativas |
| **Background Gradiente** | `from-blue-50 via-indigo-50 to-purple-50` | Fundo geral da pagina |
| **Background Cards** | `rgba(255, 255, 255, 0.8)` com `backdrop-blur-lg` | Cards com glassmorphism |

### 3.1.4 Cores de Texto

| Nome | Codigo Hex | Uso |
|------|------------|-----|
| **Texto Principal** | `#111827` (gray-900) | Titulos H1, H2 |
| **Texto Secundario** | `#374151` (gray-700) | Paragrafos, textos de corpo |
| **Texto Terciario** | `#6B7280` (gray-500) | Labels, textos de ajuda |
| **Texto Quaternario** | `#9CA3AF` (gray-400) | Placeholders, textos inativos |
| **Texto em Primaria** | `#FFFFFF` | Texto em botoes primarios |
| **Texto Link** | `#3B82F6` | Links interativos |

### 3.1.5 Cores de Borda

| Nome | Codigo Hex | Uso |
|------|------------|-----|
| **Borda Padrao** | `#E5E7EB` (gray-200) | Bordas de cards, inputs |
| **Borda Secundaria** | `#D1D5DB` (gray-300) | Bordas mais visiveis |
| **Borda Focus** | `#3B82F6` | Bordas no estado focus |
| **Borda Hover** | `#CBD5E1` | Bordas no hover |
| **Borda Erro** | `#EF4444` | Bordas de campos com erro |

### 3.1.6 Cores de Feedback

| Tipo | Background | Texto | Borda/Accent |
|------|------------|-------|--------------|
| **Sucesso** | `#D1FAE5` (green-100) | `#065F46` (green-800) | `#10B981` / `#22C55E` |
| **Erro** | `#FEE2E2` (red-100) | `#B91C1C` (red-700) | `#EF4444` / `#DC2626` |
| **Aviso** | `#FEF3C7` (yellow-100) | `#92400E` (yellow-800) | `#FB923C` / `#F59E0B` |
| **Informacao** | `#DBEAFE` (blue-100) | `#1E40AF` (blue-800) | `#3B82F6` / `#60A5FA` |

### 3.1.7 Cores de Alertas (Gradientes)

| Tipo | Gradiente |
|------|-----------|
| **Sucesso** | `from-green-500 to-green-600` |
| **Erro** | `from-red-500 to-red-600` |
| **Aviso** | `from-yellow-500 to-yellow-600` |
| **Informacao** | `from-blue-500 to-blue-600` |

### 3.1.8 Cores de Badges de Papel/Role

| Badge | Background | Texto | Icone |
|-------|------------|-------|-------|
| **SUPERUSER** | `#FEF3C7` (amber-100) | `#92400E` (amber-800) | 🔱 |
| **ADMIN** | `#DBEAFE` (blue-100) | `#1E40AF` (blue-800) | 👔 |
| **USER** | `#D1FAE5` (green-100) | `#065F46` (green-800) | 👤 |
| **VISUALIZADOR** | `#E5E7EB` (gray-200) | `#374151` (gray-700) | 👁️ |

### 3.1.9 Cores de Badges de Tipo de Escola

| Badge | Background | Texto |
|-------|------------|-------|
| **CMEI** | `#DBEAFE` (blue-100) | `#1E40AF` (blue-800) |
| **EMEF** | `#D1FAE5` (green-100) | `#065F46` (green-800) |

### 3.1.10 Cores de Acoes em Log/Sistema

| Acao | Background | Texto |
|------|------------|-------|
| **CRIACAO/INSERT** | `#D1FAE5` bg + border green-200 | `#065F46` |
| **EDICAO/UPDATE** | `#DBEAFE` bg + border blue-200 | `#1E40AF` |
| **EXCLUSAO/DELETE** | `#FEE2E2` bg + border red-200 | `#B91C1C` |
| **LOGIN** | `#E9D5FF` bg + border purple-200 | `#6B21A8` |

### 3.1.11 Gradientes

```css
/* Gradiente Primario (Botoes) */
linear-gradient(135deg, #3B82F6 0%, #2563EB 50%, #1D4ED8 100%)

/* Gradiente Secundario */
linear-gradient(135deg, #64748B 0%, #475569 100%)

/* Gradiente Perigo */
linear-gradient(135deg, #EF4444 0%, #DC2626 100%)

/* Gradiente Sucesso */
linear-gradient(135deg, #10B981 0%, #059669 50%, #047857 100%)

/* Gradiente Roxo */
linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)

/* Gradiente de Pagina (Background) */
linear-gradient(to bottom right, #EFF6FF, #EEF2FF, #F5F3FF)

/* Gradiente Menu */
linear-gradient(to right, #2563EB, #1D4ED8)

/* Gradiente Cards Ativos */
linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)

/* Gradiente Header de Tabela */
linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)
```

---

## 3.2 TIPOGRAFIA

### 3.2.1 Familia de Fontes

```css
/* Fonte Principal */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', 'Helvetica Neue', Arial, sans-serif;

/* Fonte Mono */
font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
```

### 3.2.2 Escala de Tamanhos

| Elemento | Tamanho Desktop | Tamanho Mobile | Peso | Line Height |
|----------|-----------------|----------------|------|-------------|
| **H1 (Titulo Principal)** | 48px / 3rem | 32px / 2rem | 700 (bold) | 1.2 |
| **H2 (Titulo de Secao)** | 32px / 2rem | 24px / 1.5rem | 700 (bold) | 1.25 |
| **H3 (Subtitulo)** | 24px / 1.5rem | 20px / 1.25rem | 600 (semibold) | 1.3 |
| **H4 (Titulo Card)** | 20px / 1.25rem | 18px / 1.125rem | 600 (semibold) | 1.4 |
| **Body Large** | 18px / 1.125rem | 16px / 1rem | 400 (normal) | 1.6 |
| **Body** | 16px / 1rem | 14px / 0.875rem | 400 (normal) | 1.5 |
| **Body Small** | 14px / 0.875rem | 13px | 400 (normal) | 1.5 |
| **Label** | 14px / 0.875rem | 14px | 700 (bold) | 1.4 |
| **Caption** | 12px / 0.75rem | 11px | 500 (medium) | 1.4 |
| **Badge Text** | 12px / 0.75rem | 11px | 600 (semibold) | 1 |
| **Button Text** | 14px / 0.875rem | 14px | 600-700 | 1 |
| **Input Text** | 16px / 1rem | 16px (evita zoom iOS) | 400 | 1.5 |

### 3.2.3 Pesos de Fonte Utilizados

- **400** - Normal/Regular (textos de corpo, inputs)
- **500** - Medium (links, captions, descricoes)
- **600** - Semibold (subtitulos, botoes, labels fortes)
- **700** - Bold (titulos, labels, botoes importantes)
- **800** - Extrabold (badges especiais)

### 3.2.4 Espacamento entre Letras

| Elemento | Letter Spacing |
|----------|----------------|
| **Titulos** | Normal (0) |
| **Badges** | 0.5px |
| **Botoes Uppercase** | 0.5px |
| **Labels Uppercase** | 0.3px - 0.5px |
| **Headers de Tabela** | 0.5px |

---

## 3.3 ESPACAMENTOS

### 3.3.1 Escala Base (Multiplos de 4px)

| Token | Valor | Uso Comum |
|-------|-------|-----------|
| **xs** | 4px | Gaps minimos, margin de icones |
| **sm** | 8px | Gaps pequenos, padding interno de badges |
| **md** | 16px | Padding padrao de cards, gaps entre elementos |
| **lg** | 24px | Padding de cards grandes, gaps de secao |
| **xl** | 32px | Padding de modais, espacamento de secoes |
| **2xl** | 48px | Margem de pagina |

### 3.3.2 Padding de Componentes

| Componente | Padding |
|------------|---------|
| **Botao Primario** | 12px 24px (py-3 px-6) |
| **Botao Pequeno** | 8px 16px (py-2 px-4) |
| **Botao Icone** | 8px (p-2) |
| **Input** | 12px 16px (py-3 px-4) |
| **Card** | 24px (p-6) |
| **Modal** | 24px (p-6) |
| **Badge** | 4px 12px (py-1 px-3) |
| **Celula de Tabela** | 16px (px-6 py-4) |
| **Alerta** | 16px 24px (py-4 px-6) |

### 3.3.3 Container Max-Width

| Container | Max-Width |
|-----------|-----------|
| **Pagina Principal** | 1280px (max-w-5xl) |
| **Formulario de Login** | 512px (max-w-lg) |
| **Modal Grande** | 896px (max-w-4xl) |
| **Modal Medio** | 672px (max-w-2xl) |
| **Modal Pequeno** | 448px (max-w-md) |

---

## 3.4 BORDAS E CANTOS

### 3.4.1 Border Radius

| Componente | Radius | Tailwind Class |
|------------|--------|----------------|
| **Botoes** | 12px | `rounded-xl` |
| **Cards** | 16px | `rounded-2xl` |
| **Inputs** | 12px | `rounded-xl` |
| **Modais** | 16px | `rounded-2xl` |
| **Badges** | 9999px (pill) | `rounded-full` |
| **Checkboxes** | 5px-6px | `rounded-md` |
| **Tabelas** | 8px | `rounded-lg` |
| **Alertas** | 12px | `rounded-xl` |

### 3.4.2 Border Width

| Estado | Largura |
|--------|---------|
| **Padrao** | 1px |
| **Inputs** | 2px |
| **Focus** | 2px |
| **Cards Destaque** | 2px |

---

## 3.5 SOMBRAS

### 3.5.1 Escala de Sombras

| Nome | Valor CSS | Uso |
|------|-----------|-----|
| **Shadow SM** | `0 1px 2px rgba(0, 0, 0, 0.05)` | Elementos sutis |
| **Shadow** | `0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)` | Cards padrao |
| **Shadow MD** | `0 4px 6px rgba(0, 0, 0, 0.1)` | Cards em hover |
| **Shadow LG** | `0 10px 15px rgba(0, 0, 0, 0.1)` | Dropdowns |
| **Shadow XL** | `0 20px 25px rgba(0, 0, 0, 0.15)` | Modais |
| **Shadow 2XL** | `0 25px 50px rgba(0, 0, 0, 0.25)` | Modais elevados |

### 3.5.2 Sombras Especificas

```css
/* Card Padrao */
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

/* Card Hover */
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(59, 130, 246, 0.2);

/* Modal */
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

/* Botao Primario Hover */
box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);

/* Input Focus */
box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1), 0 8px 16px rgba(59, 130, 246, 0.15);

/* Checkbox Checked */
box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.3);

/* Dropdown */
box-shadow: 0 22px 55px rgba(15, 23, 42, 0.18), 0 10px 22px rgba(15, 23, 42, 0.10);
```

---

## 3.6 ICONES

### 3.6.1 Biblioteca Atual

O sistema utiliza **Emojis nativos** como icones principais, complementados por **SVGs inline** para acoes especificas.

### 3.6.2 Tamanhos de Icones

| Contexto | Tamanho |
|----------|---------|
| **Icone Grande (Header)** | 48px - 64px (text-5xl a text-6xl) |
| **Icone de Card** | 28px - 32px (text-3xl) |
| **Icone de Botao** | 20px (text-xl) |
| **Icone de Input** | 16px - 20px |
| **Icone de Badge** | 12px - 14px |
| **Icone SVG Padrao** | 20px (w-5 h-5) |
| **Icone SVG Pequeno** | 16px (w-4 h-4) |
| **Icone SVG Grande** | 24px (w-6 h-6) |

### 3.6.3 Mapeamento de Icones por Funcao

| Funcao | Emoji/Icone |
|--------|-------------|
| **Usuario/Perfil** | 👤 |
| **Login/Autenticacao** | 🔓 🔒 🔐 |
| **E-mail** | 📧 |
| **Senha** | 🔑 |
| **Dashboard/Painel** | 📊 |
| **Novo Registro** | 📝 ➕ |
| **Gerenciar** | 📋 🔧 |
| **Notificacoes** | 🔔 |
| **Sair/Logout** | 🚪 |
| **Editar** | ✏️ |
| **Excluir/Deletar** | 🗑️ |
| **Salvar** | 💾 |
| **Download** | ⬇️ |
| **Visualizar** | 👁️ |
| **Buscar** | 🔍 |
| **Filtrar** | 🎛️ |
| **Atualizar/Refresh** | 🔄 |
| **Sucesso** | ✅ |
| **Erro** | ❌ |
| **Aviso** | ⚠️ |
| **Informacao** | ℹ️ |
| **Calendario/Data** | 📅 |
| **Escola** | 🏫 |
| **Crianca** | 👶 |
| **Anexo/Arquivo** | 📎 📄 |
| **Superuser** | 🔱 |
| **Admin** | 👔 |
| **Criacao** | ➕ |
| **Empty State** | 📭 |

---

# PARTE 4 - COMPONENTES DETALHADOS

## 4.1 BOTOES

### Botao Primario (.btn-primary-elegant)

```css
/* Estado Normal */
background: linear-gradient(135deg, #3B82F6 0%, #2563EB 50%, #1D4ED8 100%);
color: #FFFFFF;
padding: 12px 24px;
border-radius: 12px;
font-size: 14px;
font-weight: 600-700;
letter-spacing: 0.5px;
text-transform: uppercase;
border: none;
box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

/* Estado Hover */
background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 50%, #1E40AF 100%);
transform: translateY(-3px);
box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);

/* Estado Active */
transform: translateY(-1px);
box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);

/* Estado Disabled */
opacity: 0.5;
cursor: not-allowed;
```

### Botao Secundario (.btn-secondary-elegant)

```css
/* Estado Normal */
background: linear-gradient(135deg, #64748B 0%, #475569 100%);
color: #FFFFFF;
/* ou versao light: */
background: #F3F4F6;
color: #374151;
border: 1px solid #E5E7EB;

/* Estado Hover */
background: linear-gradient(135deg, #475569 0%, #334155 100%);
```

### Botao Perigo (Danger)

```css
/* Estado Normal */
background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
color: #FFFFFF;

/* Estado Hover */
background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%);
box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
```

### Botao de Acao (Icone)

```css
/* Editar (Azul Claro) */
background: #DBEAFE;
color: #3B82F6;
padding: 8px 12px;
border-radius: 8px;
/* Hover: */ background: #BFDBFE;

/* Excluir (Vermelho Claro) */
background: #FEE2E2;
color: #EF4444;
/* Hover: */ background: #FECACA;
```

---

## 4.2 INPUTS

### Input Padrao (.input-elegant)

```css
/* Estado Normal */
width: 100%;
padding: 12px 16px;
border: 2px solid #E2E8F0;
border-radius: 12px;
font-size: 16px;
background: rgba(255, 255, 255, 0.9);
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

/* Estado Hover */
border-color: #CBD5E1;
background: #FFFFFF;
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

/* Estado Focus */
outline: none;
border-color: #3B82F6;
background: #FFFFFF;
transform: scale(1.02);
box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1), 0 8px 16px rgba(59, 130, 246, 0.15);

/* Estado Erro */
border-color: #EF4444;
background-color: #FEE2E2;
animation: shakeError 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97);

/* Placeholder */
color: #9CA3AF;
```

### Checkbox Elegante

```css
/* Estado Normal */
appearance: none;
width: 22px;
height: 22px;
border: 2px solid #CBD5E1;
border-radius: 6px;
background-color: #FFFFFF;
cursor: pointer;
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

/* Estado Hover */
border-color: #3B82F6;
box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15), 0 2px 8px rgba(59, 130, 246, 0.2);
transform: scale(1.1);

/* Estado Checked */
background: linear-gradient(135deg, #3B82F6 0%, #2563EB 50%, #1D4ED8 100%);
border-color: #2563EB;
box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.3);
transform: scale(1.05);

/* Checkmark (::after) */
content: '✓';
color: #FFFFFF;
font-size: 14px;
font-weight: bold;
animation: checkPop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

---

## 4.3 BADGES

### Badge Padrao (Pill)

```css
display: inline-flex;
align-items: center;
justify-content: center;
padding: 6px 12px;
border-radius: 9999px;
font-size: 12px;
font-weight: 600;
text-transform: uppercase;
letter-spacing: 0.5px;
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

/* Hover */
transform: scale(1.1) rotate(5deg);
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
```

### Badge de Contagem

```css
display: inline-flex;
align-items: center;
justify-content: center;
min-width: 18px;
height: 18px;
padding: 0 6px;
border-radius: 9999px;
font-size: 11px;
font-weight: 700;
background: #2563EB;
color: #FFFFFF;
border: 2px solid #FFFFFF;
animation: badgePop 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

---

## 4.4 CARDS

### Card Padrao (.card-elegant)

```css
background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.5);
border-radius: 16px;
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
padding: 24px;
transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

/* Hover */
transform: translateY(-8px) scale(1.02);
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(59, 130, 246, 0.2);
```

### Card de Filtro

```css
cursor: pointer;
min-height: 56px;
padding: 12px;
border: 2px solid #E5E7EB;
border-radius: 12px;
background: #FFFFFF;
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

/* Hover */
transform: translateY(-2px);
border-color: #3B82F6;
box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);

/* Ativo */
border-color: #2563EB;
background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
```

---

## 4.5 TABELAS

### Estrutura Geral (.table-elegant)

```css
/* Tabela */
border-collapse: separate;
border-spacing: 0;
width: 100%;

/* Container */
overflow-x: auto;
border-radius: 8px;
max-height: 600px;
overflow-y: auto;
```

### Header

```css
background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%);

th {
  padding: 16px 24px;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.5px;
  color: #475569;
  border-bottom: 2px solid #E2E8F0;
  text-align: left;
}
```

### Linhas

```css
tr {
  transition: all 0.3s ease;
  border-bottom: 1px solid #F1F5F9;
}

tr:hover {
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.05), transparent);
  transform: translateX(4px);
  box-shadow: -4px 0 8px rgba(59, 130, 246, 0.15);
}

td {
  padding: 16px 24px;
}
```

---

## 4.6 MODAIS

### Overlay

```css
position: fixed;
top: 0;
left: 0;
right: 0;
bottom: 0;
background: rgba(0, 0, 0, 0.5);
backdrop-filter: blur(4px);
z-index: 9999;
display: flex;
align-items: center;
justify-content: center;
animation: fadeIn 0.2s ease-out;
```

### Conteudo do Modal

```css
background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.5);
border-radius: 16px;
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
max-width: 95vw;
max-height: 95vh;
overflow-y: auto;
animation: scaleIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

---

## 4.7 ALERTAS/NOTIFICACOES

### Alerta Inline (.alert-elegant)

```css
padding: 16px 24px;
border-radius: 12px;
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
border-left: 4px solid;
backdrop-filter: blur(10px);
display: flex;
align-items: center;
gap: 12px;
animation: slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1);

/* Cores por tipo */
/* Sucesso */
background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%);
border-left-color: #22C55E;
color: #15803D;

/* Erro */
background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%);
border-left-color: #EF4444;
color: #B91C1C;

/* Aviso */
background: linear-gradient(135deg, rgba(251, 146, 60, 0.1) 0%, rgba(251, 146, 60, 0.05) 100%);
border-left-color: #FB923C;
color: #C2410C;

/* Informacao */
background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%);
border-left-color: #3B82F6;
color: #1E40AF;
```

---

## 4.8 DROPDOWNS/AUTOCOMPLETE

```css
position: absolute;
top: 100%;
left: 0;
right: 0;
background: rgba(255, 255, 255, 0.98);
border: 1px solid rgba(148, 163, 184, 0.55);
border-radius: 16px;
max-height: 250px;
overflow-y: auto;
z-index: 1000;
box-shadow: 0 22px 55px rgba(15, 23, 42, 0.18), 0 10px 22px rgba(15, 23, 42, 0.10);
backdrop-filter: blur(10px);
animation: dropdownSlide 0.3s cubic-bezier(0.4, 0, 0.2, 1);

/* Item */
padding: 12px 14px;
cursor: pointer;
border-bottom: 1px solid #F3F4F6;
transition: all 0.2s ease;

/* Item Hover */
background-color: #EFF6FF;
```

---

# PARTE 5 - LAYOUT E NAVEGACAO

## 5.1 Menu de Navegacao

### Desktop Menu (Top Bar)

```css
/* Container */
background: linear-gradient(to right, #2563EB, #1D4ED8);
border-radius: 12px;
padding: 12px 16px;
margin-bottom: 24px;
box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);

/* Itens de Menu */
display: flex;
flex-wrap: wrap;
gap: 8px;
justify-content: center;
align-items: center;

/* Link Padrao */
padding: 10px 20px;
background: #3B82F6;
color: #FFFFFF;
border-radius: 8px;
font-size: 14px;
font-weight: 600;
transition: all 0.3s ease;

/* Link Hover */
background: #60A5FA;

/* Link Ativo (Pagina Atual) */
background: #FFFFFF;
color: #2563EB;
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

/* Botao Sair */
background: #EF4444;
/* Hover: */ background: #DC2626;
```

### Mobile Menu (Hamburger)

```css
/* Botao Hamburger */
display: none; /* Visivel apenas em mobile */

@media (max-width: 768px) {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  color: #FFFFFF;
  font-weight: 600;
}

/* Menu Dropdown */
max-height: 0;
overflow: hidden;
transition: max-height 0.3s ease-in-out;

/* Menu Aberto */
max-height: 500px;
```

## 5.2 Header de Pagina

```css
background: #FFFFFF;
border-radius: 16px;
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
padding: 24px;
margin-bottom: 24px;

/* Icone */
width: 56px;
height: 56px;
border-radius: 50%;
background: #DBEAFE;
color: #2563EB;
font-size: 28px;

/* Titulo */
font-size: 32px;
font-weight: 700;
background: linear-gradient(to right, #2563EB, #1D4ED8);
-webkit-background-clip: text;
color: transparent;
```

## 5.3 Breakpoints

| Nome | Largura | Uso |
|------|---------|-----|
| **sm** | 640px | Mobile landscape |
| **md** | 768px | Tablet |
| **lg** | 1024px | Desktop pequeno |
| **xl** | 1280px | Desktop |

---

# PARTE 6 - ANIMACOES E TRANSICOES

## 6.1 Timing Functions

```css
/* Padrao suave */
cubic-bezier(0.4, 0, 0.2, 1)

/* Entrada com bounce */
cubic-bezier(0.68, -0.55, 0.265, 1.55)

/* Saida suave */
cubic-bezier(0.4, 0, 0.6, 1)

/* Entrada rapida */
cubic-bezier(0.16, 1, 0.3, 1)
```

## 6.2 Duracoes

| Tipo | Duracao |
|------|---------|
| **Fast** | 150ms - 200ms |
| **Normal** | 300ms |
| **Medium** | 400ms |
| **Slow** | 500ms - 600ms |

## 6.3 Keyframes Principais

```css
/* Fade In com Scale */
@keyframes fadeInScale {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* Slide Down */
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Slide Up */
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Scale In (com bounce) */
@keyframes scaleIn {
  0% { opacity: 0; transform: scale(0.8); }
  50% { transform: scale(1.05); }
  100% { opacity: 1; transform: scale(1); }
}

/* Spin (para loaders) */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Check Pop (para checkboxes) */
@keyframes checkPop {
  0% { transform: translate(-50%, -50%) scale(0) rotate(-180deg); opacity: 0; }
  50% { transform: translate(-50%, -50%) scale(1.3) rotate(10deg); }
  100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 1; }
}

/* Badge Pop */
@keyframes badgePop {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

/* Shake Error */
@keyframes shakeError {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}
```

## 6.4 Acessibilidade

```css
/* Respeita preferencia de movimento reduzido */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

# PARTE 7 - PROBLEMAS IDENTIFICADOS

## 7.1 Inconsistencias Visuais

1. **Gradientes misturados** - Alguns botoes usam gradiente, outros cor solida
2. **Border-radius variavel** - 6px em alguns, 8px em outros, 12px em outros
3. **Sombras inconsistentes** - Diferentes valores em componentes similares
4. **Emojis como icones** - Dependencia de emojis para icones (📊, 📝, 🔔)

## 7.2 Problemas de UX

1. **Formulario muito longo** - 30+ campos em uma pagina
2. **Campos condicionais confusos** - Aparecem/desaparecem sem contexto claro
3. **Sem indicador de progresso claro** - Progress bar existe mas pouco visivel
4. **Mensagens de erro genericas** - Nao especificam qual campo tem problema
5. **Navegacao entre abas no modal** - Pode perder dados ao trocar

## 7.3 Questoes de Acessibilidade

1. **Falta ARIA labels** - Modais sem role="dialog"
2. **Navegacao por teclado incompleta** - Selects customizados sem arrow keys
3. **Cor como unica informacao** - Badges de role apenas com cor
4. **Foco nao visivel** - Alguns elementos sem focus ring
5. **Contraste em warnings** - Amarelo pode ter contraste baixo

## 7.4 Performance Visual

1. **Muitas animacoes simultaneas** - Pode causar jank em dispositivos fracos
2. **Backdrop-filter pesado** - Blur em overlays afeta performance
3. **Gradientes complexos** - Multiplos gradientes renderizados

## 7.5 Responsividade

1. **Tabelas em mobile** - Scroll horizontal, dificil de usar
2. **Modal muito largo** - Pode cortar em telas pequenas
3. **Menu mobile** - Hamburguer simples, sem gestos

---

# PARTE 8 - OBJETIVOS DA REFATORACAO

## 8.1 O Que MANTER

- Paleta de cores atual (azul/roxo/verde/vermelho)
- Sistema de permissoes por role
- Fluxo de autenticacao
- Estrutura de 8 paginas
- Auto-save de formularios
- Sistema de tags/chips
- Gradientes como identidade visual

## 8.2 O Que MELHORAR

1. **Consistencia** - Unificar border-radius, shadows, espacamentos
2. **Acessibilidade** - Adicionar ARIA, melhorar contraste, focus states
3. **Formularios** - Quebrar em steps com wizard, validacao em tempo real
4. **Tabelas** - Cards em mobile, melhor paginacao
5. **Icones** - Substituir emojis por biblioteca de icones (Lucide, Heroicons)
6. **Loading** - Estados de skeleton mais sofisticados
7. **Feedback** - Toasts mais informativos, micro-interacoes

## 8.3 Novos Padroes a Implementar

1. **Design Tokens** - Variaveis CSS centralizadas
2. **Component Library** - Documentacao de uso de cada componente
3. **Dark Mode Ready** - Preparar estrutura para tema escuro futuro
4. **Motion System** - Animacoes consistentes e configuraveis
5. **Spacing Scale** - Escala de 4px (4, 8, 12, 16, 24, 32, 48, 64)

## 8.4 Referencias de Design (Inspiracao)

- **Linear.app** - Limpeza e micro-interacoes
- **Notion** - Organizacao e hierarquia
- **Tailwind UI** - Componentes e padroes
- **Vercel Dashboard** - Elegancia e performance

## 8.5 Restricoes Tecnicas

- Manter compatibilidade com Tailwind CSS
- IDs e names de formularios NAO podem mudar
- Backend (Apps Script) nao sera alterado
- Deve funcionar em Chrome, Firefox, Safari, Edge
- Deve funcionar offline (service worker futuro)

---

# PARTE 9 - REQUISITOS ESPECIFICOS

## 9.1 Acessibilidade (WCAG 2.1 AA)

- [ ] Contraste minimo 4.5:1 para texto
- [ ] Contraste minimo 3:1 para componentes UI
- [ ] Todos os inputs com labels associadas
- [ ] Modais com role="dialog" e aria-modal="true"
- [ ] Focus trap em modais
- [ ] Skip links para navegacao
- [ ] Textos alternativos em imagens
- [ ] Navegacao completa por teclado
- [ ] Estados de foco visiveis
- [ ] Nao depender apenas de cor para informacao

## 9.2 Suporte de Browsers

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+
- Mobile Safari iOS 14+
- Chrome Android 90+

## 9.3 Dispositivos-alvo

- Desktop (1920x1080, 1366x768)
- Laptop (1440x900, 1280x800)
- Tablet (1024x768, 768x1024)
- Mobile (375x667, 390x844, 412x915)

## 9.4 Performance Esperada

- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1
- First Input Delay < 100ms
- Animacoes a 60fps

## 9.5 Animacoes/Microinteracoes Desejadas

1. **Page Transitions** - Fade suave entre paginas
2. **Button Feedback** - Ripple ou scale no click
3. **Form Validation** - Shake sutil em erro, check em sucesso
4. **Loading States** - Skeleton → conteudo com fade
5. **Notifications** - Slide-in da direita, auto-dismiss
6. **Modals** - Scale + fade, backdrop blur
7. **Accordions** - Height transition suave
8. **Tooltips** - Fade + translate sutil
9. **Progress** - Shimmer na barra
10. **Hover States** - Elevacao sutil em cards

---

# PARTE 10 - ENTREGAVEIS ESPERADOS

## 10.1 Design System Completo

- [ ] Tokens de cor (CSS variables)
- [ ] Tokens de tipografia
- [ ] Tokens de espacamento
- [ ] Tokens de sombra
- [ ] Tokens de border-radius
- [ ] Tokens de transicao

## 10.2 Componentes Refatorados

- [ ] Botoes (3 variantes x 3 tamanhos x 4 estados)
- [ ] Inputs (text, email, password, number, date)
- [ ] Selects (single, multi, searchable)
- [ ] Checkboxes e Radios
- [ ] Cards (padrao, destacado, compact)
- [ ] Tabelas (desktop e mobile)
- [ ] Modais (sm, md, lg, fullscreen)
- [ ] Alertas (4 tipos)
- [ ] Badges (8 cores)
- [ ] Tags/Chips
- [ ] Tabs
- [ ] Accordions
- [ ] Progress bars
- [ ] Spinners
- [ ] Skeletons
- [ ] Tooltips
- [ ] Toasts

## 10.3 Guia de Estilo

- [ ] Principios de design
- [ ] Uso de cores
- [ ] Uso de tipografia
- [ ] Uso de espacamento
- [ ] Uso de icones
- [ ] Padroes de layout
- [ ] Do's and Don'ts

## 10.4 Documentacao de Uso

- [ ] Como usar cada componente
- [ ] Codigo de exemplo
- [ ] Variantes disponiveis
- [ ] Props/modificadores
- [ ] Acessibilidade de cada componente

---

# ANEXO: CODIGOS DE COR COMPLETOS (CSS VARIABLES)

```css
:root {
  /* Primarias */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-200: #bfdbfe;
  --color-primary-300: #93c5fd;
  --color-primary-400: #60a5fa;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  --color-primary-800: #1e40af;
  --color-primary-900: #1e3a8a;

  /* Secundarias (Roxo) */
  --color-secondary-400: #a78bfa;
  --color-secondary-500: #8b5cf6;
  --color-secondary-600: #7c3aed;
  --color-secondary-700: #6d28d9;

  /* Success */
  --color-success-50: #f0fdf4;
  --color-success-100: #dcfce7;
  --color-success-200: #bbf7d0;
  --color-success-500: #22c55e;
  --color-success-600: #16a34a;
  --color-success-700: #15803d;
  --color-success-800: #065f46;

  /* Error */
  --color-error-50: #fef2f2;
  --color-error-100: #fee2e2;
  --color-error-200: #fecaca;
  --color-error-500: #ef4444;
  --color-error-600: #dc2626;
  --color-error-700: #b91c1c;

  /* Warning */
  --color-warning-50: #fffbeb;
  --color-warning-100: #fef3c7;
  --color-warning-200: #fde68a;
  --color-warning-500: #f59e0b;
  --color-warning-600: #d97706;
  --color-warning-700: #b45309;
  --color-warning-800: #92400e;

  /* Neutras */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;

  /* Espacamentos */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Sombras */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
  --shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.25);

  /* Transicoes */
  --transition-fast: 150ms;
  --transition-normal: 300ms;
  --transition-slow: 500ms;
  --easing-default: cubic-bezier(0.4, 0, 0.2, 1);
  --easing-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

---

# FIM DO PROMPT

Este prompt contem todas as informacoes necessarias para o Google Stitch compreender o sistema atual e criar uma refatoracao de design completa, sem acesso ao codigo-fonte.

**Estrutura do documento:**
- Parte 1-2: Contexto e telas do sistema
- Parte 3-4: Design System atual detalhado
- Parte 5-6: Layout, navegacao e animacoes
- Parte 7-8: Problemas e objetivos
- Parte 9-10: Requisitos e entregaveis
- Anexo: CSS Variables prontas para uso

---

*Documento gerado em: Janeiro 2026*
*Sistema: NAAM - Sistema de Notificacao de Atos contra Alunos Menores v2.3*
