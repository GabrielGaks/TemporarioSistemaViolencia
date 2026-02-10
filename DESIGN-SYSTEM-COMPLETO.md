# Design System Completo - Sistema de Registro de Violência Escolar

> **Documento autocontido para refatoração de design**
> Este documento contém TODAS as especificações visuais do sistema atual.

---

## 1. CORES

### 1.1 Cores Primárias

| Nome | Código Hex | Uso |
|------|------------|-----|
| **Primária** | `#3B82F6` | Botões, links, elementos de destaque |
| **Primária Hover** | `#2563EB` | Estado hover de elementos primários |
| **Primária Active** | `#1D4ED8` | Estado active/pressed |
| **Primária Dark** | `#1E40AF` | Textos em badges, ênfases fortes |

### 1.2 Cores Secundárias

| Nome | Código Hex | Uso |
|------|------------|-----|
| **Cinza Slate 50** | `#F8FAFC` | Background de headers de tabela |
| **Cinza Slate 100** | `#F1F5F9` | Backgrounds alternativos, scrollbar track |
| **Cinza Slate 200** | `#E2E8F0` | Bordas de inputs, separadores |
| **Cinza Slate 300** | `#CBD5E1` | Bordas de checkboxes, elementos secundários |
| **Cinza Slate 400** | `#94A3B8` | Ícones inativos, textos terciários |
| **Cinza Slate 500** | `#64748B` | Textos secundários |
| **Cinza Slate 600** | `#475569` | Textos em botões secondary |
| **Cinza Slate 700** | `#334155` | Hover de botões secondary |

### 1.3 Cores de Background

| Nome | Código Hex | Uso |
|------|------------|-----|
| **Background Principal** | `#FFFFFF` | Fundo de cards, modais, corpo |
| **Background Secundário** | `#F9FAFB` | Fundo de seções alternativas |
| **Background Terciário** | `#F3F4F6` | Fundo de inputs, áreas inativas |
| **Background Gradiente** | `from-blue-50 via-indigo-50 to-purple-50` | Fundo geral da página |
| **Background Cards** | `rgba(255, 255, 255, 0.8)` com `backdrop-blur-lg` | Cards com glassmorphism |

### 1.4 Cores de Texto

| Nome | Código Hex | Uso |
|------|------------|-----|
| **Texto Principal** | `#111827` (gray-900) | Títulos H1, H2 |
| **Texto Secundário** | `#374151` (gray-700) | Parágrafos, textos de corpo |
| **Texto Terciário** | `#6B7280` (gray-500) | Labels, textos de ajuda |
| **Texto Quaternário** | `#9CA3AF` (gray-400) | Placeholders, textos inativos |
| **Texto em Primária** | `#FFFFFF` | Texto em botões primários |
| **Texto Link** | `#3B82F6` | Links interativos |
| **Texto Link Hover** | `#2563EB` | Links no hover |

### 1.5 Cores de Borda

| Nome | Código Hex | Uso |
|------|------------|-----|
| **Borda Padrão** | `#E5E7EB` (gray-200) | Bordas de cards, inputs |
| **Borda Secundária** | `#D1D5DB` (gray-300) | Bordas mais visíveis |
| **Borda Focus** | `#3B82F6` | Bordas no estado focus |
| **Borda Hover** | `#CBD5E1` | Bordas no hover |
| **Borda Erro** | `#EF4444` | Bordas de campos com erro |

### 1.6 Cores de Feedback

| Tipo | Background | Texto | Borda/Accent |
|------|------------|-------|--------------|
| **Sucesso** | `#D1FAE5` (green-100) | `#065F46` (green-800) | `#10B981` / `#22C55E` |
| **Erro** | `#FEE2E2` (red-100) | `#B91C1C` (red-700) | `#EF4444` / `#DC2626` |
| **Aviso** | `#FEF3C7` (yellow-100) | `#92400E` (yellow-800) | `#FB923C` / `#F59E0B` |
| **Informação** | `#DBEAFE` (blue-100) | `#1E40AF` (blue-800) | `#3B82F6` / `#60A5FA` |

### 1.7 Cores de Alertas (Gradientes)

| Tipo | Gradiente |
|------|-----------|
| **Sucesso** | `from-green-500 to-green-600` |
| **Erro** | `from-red-500 to-red-600` |
| **Aviso** | `from-yellow-500 to-yellow-600` |
| **Informação** | `from-blue-500 to-blue-600` |

### 1.8 Cores de Badges de Papel/Role

| Badge | Background | Texto | Ícone |
|-------|------------|-------|-------|
| **SUPERUSER** | `#FEF3C7` (amber-100) | `#92400E` (amber-800) | 🔱 |
| **ADMIN** | `#DBEAFE` (blue-100) | `#1E40AF` (blue-800) | 👔 |
| **USER** | `#D1FAE5` (green-100) | `#065F46` (green-800) | 👤 |
| **VISUALIZADOR** | `#E5E7EB` (gray-200) | `#374151` (gray-700) | 👁️ |

### 1.9 Cores de Badges de Tipo de Escola

| Badge | Background | Texto |
|-------|------------|-------|
| **CMEI** | `#DBEAFE` (blue-100) | `#1E40AF` (blue-800) |
| **EMEF** | `#D1FAE5` (green-100) | `#065F46` (green-800) |

### 1.10 Cores de Ações em Log/Sistema

| Ação | Background | Texto |
|------|------------|-------|
| **CRIAÇÃO/INSERT** | `#D1FAE5` bg + border green-200 | `#065F46` |
| **EDIÇÃO/UPDATE** | `#DBEAFE` bg + border blue-200 | `#1E40AF` |
| **EXCLUSÃO/DELETE** | `#FEE2E2` bg + border red-200 | `#B91C1C` |
| **LOGIN** | `#E9D5FF` bg + border purple-200 | `#6B21A8` |

### 1.11 Cores Especiais (Roxo - Notificações)

| Nome | Código Hex | Uso |
|------|------------|-----|
| **Roxo Primário** | `#8B5CF6` | Botões de download, badges de anexos |
| **Roxo Hover** | `#7C3AED` | Hover de elementos roxos |
| **Roxo Active** | `#6D28D9` | Estado active |
| **Roxo Light** | `#EDE9FE` | Background de grupos/cards roxos |
| **Roxo Very Light** | `#FAF5FF` | Hover de campos de anexo |

### 1.12 Gradientes

```css
/* Gradiente Primário (Botões) */
linear-gradient(135deg, #3B82F6 0%, #2563EB 50%, #1D4ED8 100%)

/* Gradiente Secundário */
linear-gradient(135deg, #64748B 0%, #475569 100%)

/* Gradiente Perigo */
linear-gradient(135deg, #EF4444 0%, #DC2626 100%)

/* Gradiente Sucesso */
linear-gradient(135deg, #10B981 0%, #059669 50%, #047857 100%)

/* Gradiente Roxo */
linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)

/* Gradiente de Página (Background) */
linear-gradient(to bottom right, #EFF6FF, #EEF2FF, #F5F3FF)

/* Gradiente Elegante (Overlay) */
linear-gradient(135deg, #667EEA 0%, #764BA2 100%)

/* Gradiente de Header de Tabela */
linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)

/* Gradiente Cards Ativos */
linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)

/* Gradiente Menu */
linear-gradient(to right, #2563EB, #1D4ED8)
```

---

## 2. TIPOGRAFIA

### 2.1 Família de Fontes

```css
/* Fonte Principal */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', 'Helvetica Neue', Arial, sans-serif;

/* Para Next.js/Tailwind */
font-family: 'Geist', 'Geist Fallback', sans-serif;

/* Fonte Mono */
font-family: 'Geist Mono', 'Geist Mono Fallback', ui-monospace, monospace;
```

### 2.2 Escala de Tamanhos

| Elemento | Tamanho Desktop | Tamanho Mobile | Peso | Line Height |
|----------|-----------------|----------------|------|-------------|
| **H1 (Título Principal)** | 48px / 3rem | 32px / 2rem | 700 (bold) | 1.2 |
| **H2 (Título de Seção)** | 32px / 2rem | 24px / 1.5rem | 700 (bold) | 1.25 |
| **H3 (Subtítulo)** | 24px / 1.5rem | 20px / 1.25rem | 600 (semibold) | 1.3 |
| **H4 (Título Card)** | 20px / 1.25rem | 18px / 1.125rem | 600 (semibold) | 1.4 |
| **Body Large** | 18px / 1.125rem | 16px / 1rem | 400 (normal) | 1.6 |
| **Body** | 16px / 1rem | 14px / 0.875rem | 400 (normal) | 1.5 |
| **Body Small** | 14px / 0.875rem | 13px | 400 (normal) | 1.5 |
| **Label** | 14px / 0.875rem | 14px | 700 (bold) | 1.4 |
| **Caption** | 12px / 0.75rem | 11px | 500 (medium) | 1.4 |
| **Badge Text** | 12px / 0.75rem | 11px | 600 (semibold) | 1 |
| **Button Text** | 14px / 0.875rem | 14px | 600-700 | 1 |
| **Input Text** | 16px / 1rem | 16px (evita zoom iOS) | 400 | 1.5 |
| **Placeholder** | 16px / 1rem | 16px | 400 | 1.5 |
| **Breadcrumb** | 14px | 13px | 500 | 1.4 |
| **Tooltip** | 12px | 11px | 500 | 1.4 |

### 2.3 Pesos de Fonte Utilizados

- **300** - Light (não usado ativamente)
- **400** - Normal/Regular (textos de corpo, inputs)
- **500** - Medium (links, captions, descrições)
- **600** - Semibold (subtítulos, botões, labels fortes)
- **700** - Bold (títulos, labels, botões importantes)
- **800** - Extrabold (badges especiais de deficiência)

### 2.4 Espaçamento entre Letras

| Elemento | Letter Spacing |
|----------|----------------|
| **Títulos** | Normal (0) |
| **Badges** | 0.5px |
| **Botões Uppercase** | 0.5px |
| **Labels Uppercase** | 0.3px - 0.5px |
| **Texto de Tabela Header** | 0.5px |

### 2.5 Transformações de Texto

- **Badges**: `text-transform: uppercase`
- **Botões Elegantes**: `text-transform: uppercase`
- **Headers de Tabela**: `text-transform: uppercase`
- **Labels de Tipo de Ação**: `text-transform: uppercase`

---

## 3. ESPAÇAMENTOS

### 3.1 Escala Base (Múltiplos de 4px)

| Token | Valor | Uso Comum |
|-------|-------|-----------|
| **0** | 0px | Reset |
| **1** | 4px | Gaps mínimos, margin de ícones |
| **2** | 8px | Gaps pequenos, padding interno de badges |
| **3** | 12px | Padding de botões pequenos, gaps médios |
| **4** | 16px | Padding padrão de cards, gaps entre elementos |
| **5** | 20px | Padding de seções |
| **6** | 24px | Padding de cards grandes, gaps de seção |
| **8** | 32px | Padding de modais, espaçamento de seções |
| **10** | 40px | Espaçamento entre seções grandes |
| **12** | 48px | Margem de página |
| **16** | 64px | Espaçamento de seções principais |

### 3.2 Padding de Componentes

| Componente | Padding |
|------------|---------|
| **Botão Primário** | 12px 24px (py-3 px-6) |
| **Botão Pequeno** | 8px 16px (py-2 px-4) |
| **Botão Ícone** | 8px (p-2) |
| **Input** | 12px 16px (py-3 px-4) |
| **Card** | 24px (p-6) |
| **Card Pequeno** | 16px (p-4) |
| **Modal** | 24px (p-6) |
| **Badge** | 4px 12px (py-1 px-3) |
| **Badge Pequeno** | 2px 8px |
| **Célula de Tabela** | 16px (px-6 py-4) |
| **Header de Tabela** | 16px (px-6 py-4) |
| **Alerta** | 16px 24px (py-4 px-6) |
| **Checkbox Container** | 12px 16px |

### 3.3 Gaps (Espaçamentos entre Elementos)

| Contexto | Gap |
|----------|-----|
| **Grid de Cards** | 16px (gap-4) |
| **Itens de Formulário** | 24px (space-y-6) |
| **Botões lado a lado** | 8px-12px (gap-2 a gap-3) |
| **Ícone + Texto** | 8px (gap-2) |
| **Lista de Items** | 12px (gap-3) |
| **Seções de Página** | 24px (mb-6) |

### 3.4 Container Max-Width

| Container | Max-Width |
|-----------|-----------|
| **Página Principal** | 1280px (max-w-5xl) |
| **Formulário de Login** | 512px (max-w-lg) |
| **Modal Grande** | 896px (max-w-4xl) |
| **Modal Médio** | 672px (max-w-2xl) |
| **Modal Pequeno** | 448px (max-w-md) |
| **Notificação Toast** | 400px |

---

## 4. BORDAS E CANTOS

### 4.1 Border Radius

| Componente | Radius | Tailwind Class |
|------------|--------|----------------|
| **Botões** | 12px | `rounded-xl` |
| **Cards** | 16px | `rounded-2xl` |
| **Inputs** | 12px | `rounded-xl` |
| **Modais** | 16px | `rounded-2xl` |
| **Badges** | 9999px (pill) | `rounded-full` |
| **Badges Quadrados** | 6px | `rounded-md` |
| **Checkboxes** | 5px-6px | `rounded-md` |
| **Tabelas** | 8px | `rounded-lg` |
| **Tooltips** | 6px | `rounded-md` |
| **Alertas** | 12px | `rounded-xl` |
| **Dropdown** | 16px (superior) 16px (inferior) | `rounded-2xl` |
| **Tags** | 9999px | `rounded-full` |
| **Ícones em Container** | 12px-16px | `rounded-xl` a `rounded-2xl` |
| **Avatar/Ícone Circular** | 50% | `rounded-full` |

### 4.2 Border Width

| Estado | Largura |
|--------|---------|
| **Padrão** | 1px |
| **Inputs** | 2px |
| **Focus** | 2px |
| **Cards Destaque** | 2px |
| **Alertas (borda lateral)** | 4px |
| **Separadores** | 1px |

### 4.3 Border Style

- **Padrão**: `solid`
- **Upload/Drag Area**: `dashed`
- **Separadores**: `solid`

---

## 5. SOMBRAS

### 5.1 Escala de Sombras

| Nome | Valor CSS | Uso |
|------|-----------|-----|
| **Shadow SM** | `0 1px 2px rgba(0, 0, 0, 0.05)` | Elementos sutis |
| **Shadow** | `0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)` | Cards padrão |
| **Shadow MD** | `0 4px 6px rgba(0, 0, 0, 0.1)` | Cards em hover |
| **Shadow LG** | `0 10px 15px rgba(0, 0, 0, 0.1)` | Dropdowns |
| **Shadow XL** | `0 20px 25px rgba(0, 0, 0, 0.15)` | Modais |
| **Shadow 2XL** | `0 25px 50px rgba(0, 0, 0, 0.25)` | Modais elevados |

### 5.2 Sombras Específicas por Componente

```css
/* Card Padrão */
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

/* Card Hover */
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(59, 130, 246, 0.2);

/* Modal */
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

/* Botão Primário Hover */
box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);

/* Botão Primário com cor */
box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);

/* Input Focus */
box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1), 0 8px 16px rgba(59, 130, 246, 0.15);

/* Checkbox Focus */
box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);

/* Checkbox Checked */
box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.3);

/* Dropdown */
box-shadow: 0 22px 55px rgba(15, 23, 42, 0.18), 0 10px 22px rgba(15, 23, 42, 0.10);

/* Toast/Notificação */
box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05);

/* Badge */
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

/* Badge Hover */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

/* Alerta */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

/* Grupo de Notificação Hover */
box-shadow: 0 12px 28px rgba(167, 139, 250, 0.18);

/* Glow Effect (Azul) */
box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);

/* Glow Intenso */
box-shadow: 0 0 30px rgba(59, 130, 246, 0.6);
```

---

## 6. ÍCONES

### 6.1 Biblioteca de Ícones

O sistema utiliza **Emojis nativos** como ícones principais, complementados por **SVGs inline** para ações específicas.

### 6.2 Tamanhos de Ícones

| Contexto | Tamanho |
|----------|---------|
| **Ícone Grande (Header)** | 48px - 64px (text-5xl a text-6xl) |
| **Ícone de Card** | 28px - 32px (text-3xl) |
| **Ícone de Botão** | 20px (text-xl) |
| **Ícone de Input** | 16px - 20px |
| **Ícone de Badge** | 12px - 14px |
| **Ícone SVG Padrão** | 20px (w-5 h-5) |
| **Ícone SVG Pequeno** | 16px (w-4 h-4) |
| **Ícone SVG Grande** | 24px (w-6 h-6) |

### 6.3 Mapeamento de Ícones por Função

| Função | Emoji/Ícone |
|--------|-------------|
| **Usuário/Perfil** | 👤 |
| **Login/Autenticação** | 🔓 🔒 🔐 |
| **E-mail** | 📧 |
| **Senha** | 🔑 |
| **Dashboard/Painel** | 📊 |
| **Novo Registro** | 📝 ➕ |
| **Gerenciar** | 📋 🔧 |
| **Notificações** | 🔔 |
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
| **Informação** | ℹ️ |
| **Calendário/Data** | 📅 |
| **Escola** | 🏫 |
| **Criança** | 👶 |
| **Anexo/Arquivo** | 📎 📄 |
| **Menu Mobile** | ☰ (SVG) |
| **Fechar** | ✕ (SVG) |
| **Chevron/Seta** | ▼ ▲ → ← (SVG) |
| **Superuser** | 🔱 |
| **Admin** | 👔 |
| **Criação** | ➕ |
| **Empty State** | 📭 |

### 6.4 SVGs Utilizados

```html
<!-- Fechar (X) -->
<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
</svg>

<!-- Menu Hamburger -->
<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
</svg>

<!-- Seta Direita -->
<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
</svg>

<!-- Refresh/Atualizar -->
<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
</svg>
```

---

## 7. COMPONENTES

### 7.1 Botões

#### Botão Primário

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

#### Botão Secundário

```css
/* Estado Normal */
background: linear-gradient(135deg, #64748B 0%, #475569 100%);
color: #FFFFFF;
/* ou versão light: */
background: #F3F4F6;
color: #374151;
border: 1px solid #E5E7EB;

/* Estado Hover */
background: linear-gradient(135deg, #475569 0%, #334155 100%);
/* ou light: */
background: #E5E7EB;
border-color: #D1D5DB;
```

#### Botão Perigo (Danger)

```css
/* Estado Normal */
background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
color: #FFFFFF;

/* Estado Hover */
background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%);
box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
```

#### Botão de Ação (Ícone)

```css
/* Editar (Azul Claro) */
background: #DBEAFE;
color: #3B82F6;
padding: 8px 12px;
border-radius: 8px;

/* Hover */
background: #BFDBFE;

/* Excluir (Vermelho Claro) */
background: #FEE2E2;
color: #EF4444;

/* Hover */
background: #FECACA;
```

#### Botão Roxo (Download/Anexos)

```css
background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
color: #FFFFFF;

/* Hover */
background: linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%);
box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
```

### 7.2 Inputs

#### Input Padrão

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

#### Select

```css
/* Mesmo estilo do input, com: */
cursor: pointer;
appearance: none;
background-image: url("chevron-down.svg");
background-position: right 12px center;
background-repeat: no-repeat;
padding-right: 40px;
```

#### Textarea

```css
/* Mesmo estilo do input, com: */
min-height: 80px;
resize: vertical;
font-family: inherit;
```

#### Checkbox Elegante

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

### 7.3 Badges

#### Badge Padrão (Pill)

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

#### Badge de Contagem

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

### 7.4 Cards

#### Card Padrão

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

/* Efeito Shimmer (::before) - opcional */
background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
```

#### Card de Filtro

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
box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
```

### 7.5 Tabelas

#### Estrutura Geral

```css
/* Tabela */
border-collapse: separate;
border-spacing: 0;
width: 100%;
min-width: 800px; /* Para scroll horizontal em mobile */

/* Container */
overflow-x: auto;
border-radius: 8px;
max-height: 600px;
overflow-y: auto;
```

#### Header

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

#### Linhas

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
  transition: all 0.2s ease;
}

/* Última linha sem borda */
tr:last-child td {
  border-bottom: none;
}
```

### 7.6 Modais

#### Overlay

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

#### Conteúdo do Modal

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

#### Header do Modal

```css
padding: 16px 24px;
border-bottom: 1px solid #F1F5F9;
background: #F9FAFB;
border-radius: 16px 16px 0 0;
display: flex;
align-items: center;
justify-content: space-between;
```

#### Footer do Modal

```css
padding: 16px 24px;
border-top: 1px solid #F1F5F9;
background: #F9FAFB;
border-radius: 0 0 16px 16px;
display: flex;
justify-content: flex-end;
gap: 12px;
```

### 7.7 Alertas/Notificações

#### Alerta Inline

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

/* Informação */
background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%);
border-left-color: #3B82F6;
color: #1E40AF;
```

#### Toast Notification

```css
position: fixed;
top: 20px;
right: 20px;
max-width: 400px;
min-width: 320px;
background: #FFFFFF;
border-radius: 12px;
box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05);
z-index: 10000;
animation: toastSlideIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);

/* Conteúdo */
padding: 16px;
display: flex;
align-items: flex-start;
gap: 12px;

/* Barra de progresso */
position: absolute;
bottom: 0;
left: 0;
height: 3px;
background: linear-gradient(90deg, #3B82F6 0%, #60A5FA 50%, #3B82F6 100%);
animation: progressBar 15s linear forwards;
```

### 7.8 Dropdowns/Autocomplete

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

## 8. LAYOUT E ESTRUTURA

### 8.1 Menu de Navegação

#### Desktop Menu (Top Bar)

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

/* Link Padrão */
padding: 10px 20px;
background: #3B82F6;
color: #FFFFFF;
border-radius: 8px;
font-size: 14px;
font-weight: 600;
transition: all 0.3s ease;

/* Link Hover */
background: #60A5FA;

/* Link Ativo (Página Atual) */
background: #FFFFFF;
color: #2563EB;
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

/* Botão Sair */
background: #EF4444;
/* Hover: */ background: #DC2626;
```

#### Mobile Menu (Hamburger)

```css
/* Botão Hamburger */
display: none; /* Visível apenas em mobile */

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

/* Itens empilhados verticalmente */
flex-direction: column;
gap: 8px;
margin-top: 12px;

/* Link Mobile */
text-align: center;
padding: 12px 20px;
```

### 8.2 Header de Página

```css
background: #FFFFFF;
border-radius: 16px;
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
padding: 24px;
margin-bottom: 24px;

/* Layout Interno */
display: flex;
align-items: center;
justify-content: center;
gap: 16px;

/* Ícone */
width: 56px;
height: 56px;
display: flex;
align-items: center;
justify-content: center;
border-radius: 50%;
background: #DBEAFE;
color: #2563EB;
font-size: 28px;

/* Título */
font-size: 32px (desktop) / 24px (mobile);
font-weight: 700;
background: linear-gradient(to right, #2563EB, #1D4ED8);
-webkit-background-clip: text;
color: transparent;
text-align: center;

/* Subtítulo */
color: #6B7280;
font-size: 14px;
margin-top: 4px;
```

### 8.3 Grid System

#### Breakpoints

| Nome | Largura | Uso |
|------|---------|-----|
| **sm** | 640px | Mobile landscape |
| **md** | 768px | Tablet |
| **lg** | 1024px | Desktop pequeno |
| **xl** | 1280px | Desktop |
| **2xl** | 1536px | Desktop grande |

#### Grid de Filtros

```css
display: grid;
grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
gap: 16px;
align-items: start;
```

#### Grid de Cards de Estatística

```css
display: grid;
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
gap: 16px;
```

### 8.4 Container Principal

```css
max-width: 1280px; /* max-w-5xl */
margin: 0 auto;
padding: 32px 16px;
```

---

## 9. ANIMAÇÕES E TRANSIÇÕES

### 9.1 Timing Functions

```css
/* Padrão suave */
cubic-bezier(0.4, 0, 0.2, 1)

/* Entrada com bounce */
cubic-bezier(0.68, -0.55, 0.265, 1.55)

/* Saída suave */
cubic-bezier(0.4, 0, 0.6, 1)

/* Entrada rápida */
cubic-bezier(0.16, 1, 0.3, 1)

/* Linear */
linear
```

### 9.2 Durações

| Tipo | Duração |
|------|---------|
| **Fast** | 150ms - 200ms |
| **Normal** | 300ms |
| **Medium** | 400ms |
| **Slow** | 500ms - 600ms |

### 9.3 Keyframes Principais

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

/* Slide In From Right */
@keyframes slideInFromRight {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}

/* Slide In From Left */
@keyframes slideInFromLeft {
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
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

/* Pulse */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
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

/* Shimmer (skeleton loading) */
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

/* Float */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

/* Glow */
@keyframes glow {
  0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
  50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.6); }
}

/* Progress Bar */
@keyframes progressBar {
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
}

/* Toast Slide In */
@keyframes toastSlideIn {
  0% { opacity: 0; transform: translateX(400px) scale(0.8); }
  60% { transform: translateX(-10px) scale(1.05); }
  100% { opacity: 1; transform: translateX(0) scale(1); }
}

/* Dropdown Slide */
@keyframes dropdownSlide {
  from { opacity: 0; transform: translateY(-10px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* Row Animation (tabela) */
@keyframes slideInRow {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
}
```

### 9.4 Transições Padrão

```css
/* Transição Global */
transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
transition-duration: 150ms;

/* Botões */
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

/* Cards */
transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

/* Inputs */
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

/* Links */
transition: all 0.3s ease;

/* Modais */
transition: opacity 0.2s ease-out;
```

### 9.5 Animações de Página

```css
/* Entrada de Página */
@keyframes pageEnter {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
animation: pageEnter 0.5s cubic-bezier(0.2, 0, 0, 1) forwards;

/* Saída de Página */
@keyframes pageExit {
  from { opacity: 1; }
  to { opacity: 0; }
}
animation: pageExit 0.25s ease-out forwards;
```

### 9.6 Acessibilidade

```css
/* Respeita preferência de movimento reduzido */
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

## 10. RESPONSIVIDADE

### 10.1 Breakpoints e Comportamentos

| Breakpoint | Comportamento |
|------------|---------------|
| **< 640px** | Mobile: Menu hamburger, cards empilhados, botões full-width |
| **640px - 768px** | Mobile landscape: Ajustes de padding |
| **768px - 1024px** | Tablet: Menu horizontal parcial, grid 2 colunas |
| **> 1024px** | Desktop: Layout completo, todas features visíveis |

### 10.2 Mobile Specific

```css
@media (max-width: 768px) {
  /* Menu */
  .mobile-menu-button { display: flex !important; }
  .desktop-menu { display: none !important; }

  /* Tabelas */
  table { min-width: unset; }
  .table-wrapper { overflow-x: auto; }

  /* Cards */
  .filter-card { flex-direction: column; }

  /* Botões */
  button { min-height: 44px; } /* Touch target */

  /* Fontes */
  h1 { font-size: 32px; }
  h2 { font-size: 24px; }

  /* Notificações */
  .toast {
    width: calc(100% - 40px);
    left: 20px;
    right: 20px;
  }
}

/* Touch devices */
@media (hover: none) and (pointer: coarse) {
  button, a, input, select {
    min-height: 44px;
  }
}
```

### 10.3 Tabelas em Mobile

- Scroll horizontal habilitado
- Largura mínima removida
- Células com padding reduzido
- Alternativa: conversão para cards

---

## 11. PÁGINAS/TELAS

### 11.1 Tela de Login (index.html)

**Layout:**
- Centralizado vertical e horizontal
- Container máximo: 512px
- Background: gradiente azul-indigo-roxo

**Elementos:**
1. **Header Card**
   - Ícone: 👤 em container azul (60px)
   - Título: "Bem-vindo" (gradiente azul)
   - Subtítulo: "Sistema de Registro de Violência Escolar"

2. **Card de Login**
   - Background: branco 80% com blur
   - Título: "Entrar no Sistema"
   - Linha decorativa: gradiente azul (20px largura, 4px altura)
   - Campos: E-mail, Senha (com toggle visualização)
   - Checkbox: "Mostrar senha"
   - Botão: "Entrar" (primário, full-width)
   - Link: "Esqueci minha senha"
   - Footer: informação de acesso restrito

3. **Rodapé**
   - Versão do sistema

### 11.2 Painel de Casos (painel-casos.html)

**Layout:**
- Container: 1280px
- Menu de navegação no topo
- Header com título e stats

**Elementos:**
1. **Menu de Navegação** (descrito em 8.1)

2. **Header**
   - Ícone: 📊
   - Título: "Painel de Casos de Violência Escolar"
   - Subtítulo com email do usuário

3. **Cards de Estatísticas** (grid 4 colunas)
   - Total de Casos
   - Casos este Mês
   - Escolas Envolvidas
   - etc.

4. **Seção de Filtros**
   - Cards clicáveis para categorias
   - Painel expansível com checkboxes
   - Campo de busca por escola (autocomplete)

5. **Tabela de Registros**
   - Header fixo
   - Colunas: ID, Data, Escola, Tipo, Status, Ações
   - Linhas com hover effect
   - Paginação

### 11.3 Gerenciar Usuários (gerenciar-usuarios.html)

**Layout:**
- Container: 1280px
- Estrutura similar ao painel

**Elementos:**
1. **Header**
   - Ícone: 🔧
   - Título: "Painel Administrativo"
   - Subtítulo: "Gerenciamento de Usuários"

2. **Área de Filtros**
   - Campo de busca por e-mail
   - Botão "Adicionar Usuário"

3. **Tabela de Usuários**
   - Colunas: E-mail, Papel (badge), Criado em, Ações
   - Ações: Editar, Excluir

4. **Seção de Logs**
   - Lista de atividades recentes
   - Cards clicáveis com detalhes

5. **Modais**
   - Adicionar/Editar Usuário
   - Confirmar Exclusão
   - Detalhes de Atividade

### 11.4 Novo Registro (registro-novo-caso.html)

**Layout:**
- Container: 1024px
- Formulário em steps ou seções

**Elementos:**
1. **Header** com título e descrição
2. **Formulário Multi-seção**
   - Dados da Escola
   - Dados da Criança
   - Detalhes do Caso
   - Anexos (upload)
3. **Botões de Ação** (Cancelar, Salvar)

### 11.5 Minhas Notificações (minhas-notificacoes.html)

**Layout:**
- Container: 1280px
- Accordion de grupos

**Elementos:**
1. **Header** com ícone 🔔

2. **Filtros**
   - Status (Todas, Não lidas, Lidas)
   - Data

3. **Accordions por Criança**
   - Header clicável com nome e contador
   - Lista de notificações expandível
   - Badge de não lidas

4. **Cards de Notificação**
   - Ícone de tipo
   - Título e descrição
   - Data
   - Ações (marcar como lida)

---

## 12. ESTADOS ESPECIAIS

### 12.1 Loading States

#### Spinner Global

```css
.spinner {
  border: 4px solid rgba(59, 130, 246, 0.1);
  border-top: 4px solid #3B82F6;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}
```

#### Skeleton Loading

```css
.skeleton {
  animation: shimmer 1.5s ease-in-out infinite;
  background: linear-gradient(90deg, #F0F0F0 25%, #E0E0E0 50%, #F0F0F0 75%);
  background-size: 200% 100%;
}
```

#### Loading Indicator Elegante (Modal)

```css
/* Overlay escuro com blur */
/* Spinner com 3 bolinhas pulsantes */
/* Barra de progresso animada */
/* Texto de status */
```

### 12.2 Empty States

```css
/* Container centralizado */
text-align: center;
padding: 48px;
color: #6B7280;

/* Ícone grande */
font-size: 64px;
margin-bottom: 16px;
opacity: 0.5;

/* Texto */
font-size: 18px;
font-weight: 500;

/* Subtexto */
font-size: 14px;
color: #9CA3AF;
margin-top: 8px;
```

### 12.3 Error States

```css
/* Campo com erro */
border-color: #EF4444;
background-color: #FEE2E2;
animation: shakeError 0.5s;

/* Mensagem de erro */
color: #DC2626;
font-size: 12px;
margin-top: 4px;

/* Ícone de erro */
animation: xShake 0.5s;
```

### 12.4 Success States

```css
/* Checkmark animado */
animation: checkmarkDraw 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);

/* Destaque verde suave */
box-shadow: 0 0 20px rgba(16, 185, 129, 0.15);
```

---

## 13. SCROLLBARS

### 13.1 Scrollbar Elegante

```css
/* Track */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #F1F5F9;
  border-radius: 10px;
}

/* Thumb */
::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
  border-radius: 10px;
  transition: background 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
}

/* Firefox */
scrollbar-width: thin;
scrollbar-color: #3B82F6 #F1F5F9;
```

### 13.2 Scrollbar Inteligente (aparece no hover)

```css
.custom-scrollbar {
  overflow-y: auto;
  scrollbar-width: none; /* Firefox: oculto por padrão */
}

.custom-scrollbar::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}

/* Mostra no hover */
.custom-scrollbar:hover {
  scrollbar-width: thin;
}

.custom-scrollbar:hover::-webkit-scrollbar {
  width: 8px;
  display: block;
}
```

---

## 14. TOKENS DE DESIGN (RESUMO)

### Cores Primárias
- `--color-primary`: #3B82F6
- `--color-primary-hover`: #2563EB
- `--color-primary-active`: #1D4ED8

### Cores de Feedback
- `--color-success`: #10B981
- `--color-error`: #EF4444
- `--color-warning`: #F59E0B
- `--color-info`: #3B82F6

### Espaçamentos
- `--spacing-xs`: 4px
- `--spacing-sm`: 8px
- `--spacing-md`: 16px
- `--spacing-lg`: 24px
- `--spacing-xl`: 32px
- `--spacing-2xl`: 48px

### Border Radius
- `--radius-sm`: 6px
- `--radius-md`: 8px
- `--radius-lg`: 12px
- `--radius-xl`: 16px
- `--radius-full`: 9999px

### Sombras
- `--shadow-sm`: 0 1px 2px rgba(0,0,0,0.05)
- `--shadow-md`: 0 4px 6px rgba(0,0,0,0.1)
- `--shadow-lg`: 0 10px 15px rgba(0,0,0,0.1)
- `--shadow-xl`: 0 20px 25px rgba(0,0,0,0.15)

### Transições
- `--transition-fast`: 150ms
- `--transition-normal`: 300ms
- `--transition-slow`: 500ms
- `--easing-default`: cubic-bezier(0.4, 0, 0.2, 1)
- `--easing-bounce`: cubic-bezier(0.68, -0.55, 0.265, 1.55)

---

## 15. BIBLIOTECAS E DEPENDÊNCIAS

### CSS Framework
- **TailwindCSS** (via CDN)

### JavaScript Libraries
- **Chart.js** v4.4.0 - Gráficos
- **html2pdf.js** v0.10.1 - Geração de PDF
- **Flatpickr** - Date picker

### Fontes
- Geist (Next.js)
- System fonts como fallback

### Ícones
- Emojis nativos (principal)
- SVGs inline (ações)

---

*Documento gerado em: Janeiro 2026*
*Sistema: Sistema de Registro de Violência Escolar v2.3*
