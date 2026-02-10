# Prompt de Design para Framer - Sistema NAAM

## Contexto para a IA
Você é um Designer UI/UX especialista em **Framer**. Sua tarefa é gerar um design system completo e protótipos de alta fidelidade para o **NAAM (Sistema de Notificação de Atos contra Alunos Menores)**.

O objetivo é criar uma interface **moderna, elegante e acessível**, utilizando todo o poder do Framer (Stacks, Grids, Components, Variants e Effects).

---

## 1. Visão Geral do Projeto
- **Nome:** NAAM
- **Propósito:** Registro e gestão de casos de violência escolar.
- **Estética Desejada:** "Elegant Corporate". Limpo, profissional, mas com toques modernos (glassmorphism sutil, sombras suaves, gradientes refinados).
- **Dispositivos:** Responsivo (Desktop First, mas totalmente adaptável para Mobile e Tablet).

## 2. Estrutura do Site (Pages)

Crie as seguintes páginas no projeto Framer:

### 2.1 Página de Login (Home)
- **Layout:** Centralizado, minimalista.
- **Elementos:**
  - Logo do NAAM com gradiente sutil.
  - Card de login com efeito "Glass" (fundo branco com leve transparência e blur).
  - Inputs de Email e Senha com estados (Default, Focus, Error).
  - Botão de ação primária com gradiente (Blue-500 to Blue-700).
  - Link discreto para "Esqueci minha senha".

### 2.2 Dashboard (Painel de Casos)
- **Estrutura:** Layout com Sidebar lateral (expansível/colapsável) e Área de Conteúdo principal.
- **Sidebar:** Menu de navegação com ícones (Home, Novo Caso, Gerenciar, Notificações, Sair).
- **Conteúdo:**
  - **KPIs/Cards de Resumo:** 3 a 4 cards no topo com estatísticas (Total de Casos, Casos Pendentes, etc). Use ícones com fundos coloridos suaves.
  - **Filtros:** Barra de ferramentas com Selects e Search bar.
  - **Tabela de Dados:** Tabela moderna. Use *Stacks* para as linhas. Hover effect nas linhas (leve mudança de cor e scale).
  - **Badges:** Use componentes variantes para os status (Pendente, Concluído, Em Análise).

### 2.3 Formulário de Novo Registro
- **Conceito:** Wizard / Multi-step form.
- **UI:** Barra de progresso visual no topo.
- **Agrupamento:** Divida o formulário em cartões (Cards) separados por seções (Dados do Aluno, Dados da Violência, etc).
- **Inputs:** Use inputs grandes e legíveis.
- **Componentes Especiais:**
  - **Tags Input:** Para seleção múltipla.
  - **Drag & Drop:** Área para upload de anexos com visual tracejado.

### 2.4 Gerenciamento de Usuários (Admin)
- **Foco:** Tabela de usuários com ações rápidas (Editar, Excluir).
- **Modal:** Desenhe um componente de Modal para edição de usuário, com overlay escuro com blur.

---

## 3. Design System & Componentes (Assets)

Crie os seguintes componentes mestre no Framer com variantes:

### 3.1 Cores (Color Styles)
Defina estes estilos globais:
- **Primary:** Blue-500 (#3b82f6) a Blue-700.
- **Secondary:** Purple-500 (#8b5cf6) para acentos.
- **Success:** Green-500 (#22c55e).
- **Warning:** Amber-500 (#f59e0b).
- **Danger:** Red-500 (#ef4444).
- **Surface:** Gray-50 (#f9fafb) para fundos, White (#ffffff) para cards.
- **Text:** Gray-800 (#1f2937) para títulos, Gray-600 (#4b5563) para corpo.

### 3.2 Tipografia (Text Styles)
- **Font Family:** Inter ou Sans-serif moderna similar.
- **H1:** 32px a 48px, Bold.
- **H2:** 24px a 32px, SemiBold.
- **Body:** 16px, Regular.
- **Small:** 14px, Medium (para labels e legendas).

### 3.3 Botões (Button Component)
Crie um componente `Button` com as variantes:
- **Type:** Primary (Gradiente), Secondary (Outline ou Gray), Ghost.
- **State:** Default, Hover (Scale 1.05), Pressed (Scale 0.95), Disabled (Opacity 0.5).
- **Icon:** Opção de ícone à esquerda ou direita.

### 3.4 Inputs (Input Component)
Crie um componente `Input` com variantes:
- **State:** Idle, Focused (Borda Azul + Sombra), Error (Borda Vermelha), Filled.

### 3.5 Cards
- Use *Effects* de Sombra: `0px 4px 20px rgba(0,0,0,0.05)`.
- Border-radius: `16px` ou `12px` para consistência.

---

## 4. Interações e Animações
- Adicione **Appear Effects** sutis ao carregar a página (Fade In + Slide Up).
- Adicione transições de **Hover** em todos os elementos interativos.
- Use **Scroll Transforms** se houver elementos que devem fixar ou animar ao rolar (ex: Header fixo com blur).

---

## 5. Instruções Específicas para IA
- Ao gerar o layout, priorize o **Auto-Layout (Stacks)** para garantir que o design seja responsivo.
- Mantenha o espaçamento consistente (use múltiplos de 8px: 8, 16, 24, 32, 48).
- O design deve transmitir **fidelidade e seriedade**, dado o tema sensível (violência escolar), mas sem ser deprimente; deve ser limpo e eficiente para o operador.
