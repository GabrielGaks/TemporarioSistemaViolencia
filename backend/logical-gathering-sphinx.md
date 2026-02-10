# Prompt Completo para Google Stitch - Refatoracao de Design

## Objetivo
Criar um prompt abrangente e autocontido para o Google Stitch refatorar completamente o design/interface do sistema FormularioRegistroV2 (Sistema de Registro de Violencia Escolar).

---

# PROMPT PARA GOOGLE STITCH

## SECAO 1 - VISAO GERAL DO SISTEMA

### Nome e Proposito
**Nome:** NAAM - Sistema de Notificacao de Atos contra Alunos Menores
**Proposito:** Sistema web para registro, gerenciamento e acompanhamento de casos de violencia escolar em escolas publicas municipais (CMEIs e EMEFs).

### Publico-alvo e Personas

| Persona | Role | Funcoes | Frequencia de Uso |
|---------|------|---------|-------------------|
| **Operador** | user | Registra novos casos, edita proprios registros, ve notificacoes | Diario |
| **Visualizador** | visualizador | Apenas consulta dados no painel | Semanal |
| **Administrador** | admin | Gerencia usuarios, acesso total aos casos | Diario |
| **Superusuario** | superuser | Controle total do sistema | Conforme necessidade |

### Objetivos de Negocio
1. Centralizar registros de violencia escolar
2. Acompanhar encaminhamentos (Conselho Tutelar, CREAS, etc.)
3. Gerar relatorios e estatisticas por escola/regiao
4. Garantir rastreabilidade e auditoria dos casos

### Stack Tecnologico Frontend
- **HTML5** com Tailwind CSS (utility-first)
- **JavaScript** vanilla (ES6+)
- **CSS** customizado (styles-elegant.css, atualizacoes.css)
- **Bibliotecas:** Flatpickr (datepicker), Chart.js (graficos)
- **Backend:** Google Apps Script + Supabase

---

## SECAO 2 - INVENTARIO COMPLETO DE TELAS

### 2.1 Tela: Login (index.html)
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

### 2.2 Tela: Painel de Casos (painel-casos.html)
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

### 2.3 Tela: Novo Registro (registro-novo-caso.html)
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

### 2.4 Tela: Gerenciar Casos (gerenciar-casos.html)
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

### 2.5 Tela: Gerenciar Usuarios (gerenciar-usuarios.html)
**Proposito:** Administracao de usuarios do sistema
**Acesso:** Apenas Admin e Superuser

**Elementos:**
- Tabela de usuarios
- Filtro por email
- Modal para adicionar/editar usuario
- Badges de role coloridos
- Confirmacao de exclusao

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
└─────────────────────────────────────────────────────────┘
```

---

### 2.6 Tela: Minhas Notificacoes (minhas-notificacoes.html)
**Proposito:** Ver notificacoes de casos criados/atualizados
**Acesso:** Todos os usuarios autenticados

**Elementos:**
- Lista de notificacoes agrupadas por aluno
- Badge de contagem
- Filtro por status (lido/nao lido)
- Link para editar caso

---

### 2.7 Tela: Recuperar Senha (recuperar-senha.html)
**Proposito:** Solicitar reset de senha
**Acesso:** Publico

---

### 2.8 Tela: Resetar Senha (resetar-senha.html)
**Proposito:** Definir nova senha via token
**Acesso:** Publico (com token valido)

---

## SECAO 3 - BIBLIOTECA DE COMPONENTES

### 3.1 Botoes

#### Botao Primario (.btn-primary-elegant)
- **Variantes:** Padrao, Loading, Disabled
- **Tamanhos:** SM (py-2 px-4), MD (py-2.5 px-6), LG (py-3 px-8)
- **Estados:**
  - Normal: Gradiente azul (#3b82f6 → #1d4ed8)
  - Hover: translateY(-3px), shadow aumentada
  - Active: translateY(-1px), scale(0.98)
  - Disabled: opacity 0.6, cursor not-allowed
- **Efeito:** Ripple circular ao clicar

#### Botao Secundario (.btn-secondary-elegant)
- Background: Gradiente cinza (#64748b → #334155)

#### Botao Perigo (.btn-danger-elegant)
- Background: Gradiente vermelho (#ef4444 → #b91c1c)

### 3.2 Inputs

#### Input Elegante (.input-elegant)
- **Border:** 2px solid #e2e8f0
- **Estados:**
  - Focus: border #3b82f6, shadow azul, scale(1.02)
  - Error: border #ef4444, background #fee2e2
  - Disabled: opacity 0.6, background #f9fafb

#### Select Customizado (.select-elegant)
- Mesmo estilo do input
- Seta customizada que rota ao abrir
- Dropdown com max-height e scroll

#### Checkbox Elegante (.checkbox-elegant)
- 22x22px, border-radius 6px
- Checked: Gradiente azul, checkmark branco animado

### 3.3 Cards

#### Card Elegante (.card-elegant)
- Background: Gradiente branco com glassmorphism
- Backdrop-filter: blur(10px)
- Shadow: 0 8px 32px rgba(0,0,0,0.1)
- Hover: translateY(-8px), scale(1.02), shimmer effect

### 3.4 Tabelas

#### Tabela Elegante (.table-elegant)
- Header: Background gradiente cinza claro, uppercase, letter-spacing
- Rows: Hover com gradiente azul sutil, translateX(4px)
- Border: 1px solid #f1f5f9

### 3.5 Modais

#### Modal Elegante (.modal-elegant)
- Overlay: rgba(0,0,0,0.6), backdrop-filter blur(8px)
- Content: Glassmorphism, shadow 0 20px 60px
- Animacao: scaleIn com cubic-bezier bounce

### 3.6 Alertas

#### Alert Elegante (.alert-elegant)
- Border-left: 4px solid (cor do tipo)
- Background: Gradiente sutil da cor
- Animacao: slideDown 0.4s
- Auto-dismiss: 10 segundos

**Tipos:**
- Success: Verde (#22c55e)
- Error: Vermelho (#ef4444)
- Warning: Laranja (#fb923c)
- Info: Azul (#3b82f6)

### 3.7 Badges

#### Badge Elegante (.badge-elegant)
- Pill shape (border-radius 9999px)
- Padding: 6px 12px
- Font: 12px, 600, uppercase
- Hover: scale(1.1), rotate(5deg)

### 3.8 Tags/Chips

- Multi-selecao com X para remover
- Background suave da cor associada
- Animacao ao adicionar/remover

### 3.9 Loading States

#### Spinner Ring
- 3 circulos pulsando em sequencia
- Cores: Gradiente roxo/indigo

#### Progress Bar
- Shimmer animado
- Gradiente roxo

#### Skeleton Loading
- Pulse animation
- Background gradiente animado

---

## SECAO 4 - DESIGN SYSTEM ATUAL

### 4.1 Paleta de Cores (HEX)

#### Primarias
| Nome | HEX | Uso |
|------|-----|-----|
| Blue-500 | #3b82f6 | Botoes, links, focus |
| Blue-600 | #2563eb | Hover states |
| Blue-700 | #1d4ed8 | Active states |
| Blue-800 | #1e40af | Text emphasis |

#### Secundarias (Roxo)
| Nome | HEX | Uso |
|------|-----|-----|
| Purple-500 | #8b5cf6 | Acentos, badges |
| Purple-600 | #7c3aed | Hover |
| Purple-700 | #6d28d9 | Active |
| Indigo-500 | #6366f1 | Alternativo |

#### Estados
| Estado | HEX | Background | Border |
|--------|-----|------------|--------|
| Success | #22c55e | #d1fae5 | #6ee7b7 |
| Error | #ef4444 | #fee2e2 | #fecaca |
| Warning | #f59e0b | #fef3c7 | #fcd34d |
| Info | #3b82f6 | #dbeafe | #93c5fd |

#### Neutras
| Nome | HEX | Uso |
|------|-----|-----|
| Gray-50 | #f9fafb | Backgrounds |
| Gray-100 | #f3f4f6 | Hover backgrounds |
| Gray-200 | #e5e7eb | Borders |
| Gray-300 | #d1d5db | Disabled |
| Gray-400 | #9ca3af | Placeholder |
| Gray-500 | #6b7280 | Secondary text |
| Gray-600 | #4b5563 | Body text |
| Gray-700 | #374151 | Headings |
| Gray-800 | #1f2937 | Dark text |
| Gray-900 | #111827 | Darkest |

### 4.2 Tipografia

| Elemento | Font | Size | Weight | Line-height |
|----------|------|------|--------|-------------|
| H1 | System UI | 3-5rem | 700 | 1.2 |
| H2 | System UI | 2-3rem | 600 | 1.3 |
| H3 | System UI | 1.5rem | 600 | 1.4 |
| Body | System UI | 14px | 400 | 1.6 |
| Small | System UI | 12px | 500 | 1.5 |
| Label | System UI | 14px | 600 | 1.4 |
| Button | System UI | 14px | 600 | 1 |

**Font Stack:** `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`

### 4.3 Espacamentos

| Token | Valor | Uso |
|-------|-------|-----|
| xs | 4px | Gaps minimos |
| sm | 8px | Padding interno |
| md | 16px | Padding padrao |
| lg | 24px | Margem entre secoes |
| xl | 32px | Espacamento maior |
| 2xl | 48px | Entre blocos |

### 4.4 Breakpoints

| Nome | Min-width | Uso |
|------|-----------|-----|
| sm | 640px | Mobile landscape |
| md | 768px | Tablets |
| lg | 1024px | Desktop |
| xl | 1280px | Large screens |

### 4.5 Elevacoes (Box-Shadow)

| Nivel | Valor | Uso |
|-------|-------|-----|
| sm | 0 1px 2px rgba(0,0,0,0.05) | Inputs |
| md | 0 4px 6px rgba(0,0,0,0.1) | Cards |
| lg | 0 10px 15px rgba(0,0,0,0.1) | Dropdowns |
| xl | 0 20px 25px rgba(0,0,0,0.1) | Modais |
| 2xl | 0 25px 50px rgba(0,0,0,0.25) | Dialogs |

### 4.6 Border Radius

| Token | Valor | Uso |
|-------|-------|-----|
| sm | 4px | Badges pequenos |
| md | 6px | Inputs, buttons |
| lg | 8px | Cards |
| xl | 12px | Modais |
| 2xl | 16px | Containers |
| full | 9999px | Pills, avatares |

### 4.7 Transicoes

| Tipo | Duracao | Easing |
|------|---------|--------|
| Fast | 150ms | ease |
| Normal | 300ms | cubic-bezier(0.4, 0, 0.2, 1) |
| Slow | 500ms | cubic-bezier(0.4, 0, 0.2, 1) |
| Bounce | 400ms | cubic-bezier(0.68, -0.55, 0.265, 1.55) |

---

## SECAO 5 - PROBLEMAS IDENTIFICADOS

### 5.1 Inconsistencias Visuais
1. **Gradientes misturados** - Alguns botoes usam gradiente, outros cor solida
2. **Border-radius variavel** - 6px em alguns, 8px em outros, 12px em outros
3. **Sombras inconsistentes** - Diferentes valores em componentes similares
4. **Emojis como icones** - Dependencia de emojis para icones (📊, 📝, 🔔)

### 5.2 Problemas de UX
1. **Formulario muito longo** - 30+ campos em uma pagina
2. **Campos condicionais confusos** - Aparecem/desaparecem sem contexto claro
3. **Sem indicador de progresso claro** - Progress bar existe mas pouco visivel
4. **Mensagens de erro genericas** - Nao especificam qual campo tem problema
5. **Navegacao entre abas no modal** - Pode perder dados ao trocar

### 5.3 Questoes de Acessibilidade
1. **Falta ARIA labels** - Modais sem role="dialog"
2. **Navegacao por teclado incompleta** - Selects customizados sem arrow keys
3. **Cor como unica informacao** - Badges de role apenas com cor
4. **Foco nao visivel** - Alguns elementos sem focus ring
5. **Contraste em warnings** - Amarelo pode ter contraste baixo

### 5.4 Performance Visual
1. **Muitas animacoes simultaneas** - Pode causar jank em dispositivos fracos
2. **Backdrop-filter pesado** - Blur em overlays afeta performance
3. **Gradientes complexos** - Multiplos gradientes renderizados

### 5.5 Responsividade
1. **Tabelas em mobile** - Scroll horizontal, dificil de usar
2. **Modal muito largo** - Pode cortar em telas pequenas
3. **Menu mobile** - Hamburguer simples, sem gestos

---

## SECAO 6 - OBJETIVOS DA REFATORACAO

### 6.1 O Que MANTER
- Paleta de cores atual (azul/roxo/verde/vermelho)
- Sistema de permissoes por role
- Fluxo de autenticacao
- Estrutura de 8 paginas
- Auto-save de formularios
- Sistema de tags/chips
- Gradientes como identidade visual

### 6.2 O Que MELHORAR
1. **Consistencia** - Unificar border-radius, shadows, espacamentos
2. **Acessibilidade** - Adicionar ARIA, melhorar contraste, focus states
3. **Formularios** - Quebrar em steps com wizard, validacao em tempo real
4. **Tabelas** - Cards em mobile, melhor paginacao
5. **Icones** - Substituir emojis por biblioteca de icones (Lucide, Heroicons)
6. **Loading** - Estados de skeleton mais sofisticados
7. **Feedback** - Toasts mais informativos, micro-interacoes

### 6.3 Novos Padroes a Implementar
1. **Design Tokens** - Variáveis CSS centralizadas
2. **Component Library** - Documentacao de uso de cada componente
3. **Dark Mode Ready** - Preparar estrutura para tema escuro futuro
4. **Motion System** - Animacoes consistentes e configuráveis
5. **Spacing Scale** - Escala de 4px (4, 8, 12, 16, 24, 32, 48, 64)

### 6.4 Referencias de Design (Inspiracao)
- Linear.app - Limpeza e micro-interacoes
- Notion - Organizacao e hierarquia
- Tailwind UI - Componentes e padroes
- Vercel Dashboard - Elegancia e performance

### 6.5 Restricoes Tecnicas
- Manter compatibilidade com Tailwind CSS
- IDs e names de formularios NAO podem mudar
- Backend (Apps Script) nao sera alterado
- Deve funcionar em Chrome, Firefox, Safari, Edge
- Deve funcionar offline (service worker futuro)

---

## SECAO 7 - REQUISITOS ESPECIFICOS

### 7.1 Acessibilidade (WCAG 2.1 AA)
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

### 7.2 Suporte de Browsers
- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+
- Mobile Safari iOS 14+
- Chrome Android 90+

### 7.3 Dispositivos-alvo
- Desktop (1920x1080, 1366x768)
- Laptop (1440x900, 1280x800)
- Tablet (1024x768, 768x1024)
- Mobile (375x667, 390x844, 412x915)

### 7.4 Performance Esperada
- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1
- First Input Delay < 100ms
- Animacoes a 60fps

### 7.5 Animacoes/Microinteracoes Desejadas
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

## SECAO 8 - ENTREGAVEIS ESPERADOS

### 8.1 Design System Completo
- [ ] Tokens de cor (CSS variables)
- [ ] Tokens de tipografia
- [ ] Tokens de espacamento
- [ ] Tokens de sombra
- [ ] Tokens de border-radius
- [ ] Tokens de transicao

### 8.2 Componentes Refatorados
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

### 8.3 Guia de Estilo
- [ ] Principios de design
- [ ] Uso de cores
- [ ] Uso de tipografia
- [ ] Uso de espacamento
- [ ] Uso de icones
- [ ] Padroes de layout
- [ ] Do's and Don'ts

### 8.4 Documentacao de Uso
- [ ] Como usar cada componente
- [ ] Codigo de exemplo
- [ ] Variantes disponiveis
- [ ] Props/modificadores
- [ ] Acessibilidade de cada componente

---

## ANEXO: CODIGOS DE COR COMPLETOS

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
  --color-secondary-500: #8b5cf6;
  --color-secondary-600: #7c3aed;
  --color-secondary-700: #6d28d9;

  /* Success */
  --color-success-50: #f0fdf4;
  --color-success-100: #dcfce7;
  --color-success-500: #22c55e;
  --color-success-600: #16a34a;
  --color-success-700: #15803d;

  /* Error */
  --color-error-50: #fef2f2;
  --color-error-100: #fee2e2;
  --color-error-500: #ef4444;
  --color-error-600: #dc2626;
  --color-error-700: #b91c1c;

  /* Warning */
  --color-warning-50: #fffbeb;
  --color-warning-100: #fef3c7;
  --color-warning-500: #f59e0b;
  --color-warning-600: #d97706;
  --color-warning-700: #b45309;

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
}
```

---

## FIM DO PROMPT

Este prompt contem todas as informacoes necessarias para o Google Stitch compreender o sistema atual e criar uma refatoracao de design completa, sem acesso ao codigo-fonte.
