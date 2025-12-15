<div align="center">

# 🛡️ Sistema de Registro de Violência Escolar

![Status](https://img.shields.io/badge/status-ativo-success?style=for-the-badge)
![Versão](https://img.shields.io/badge/versão-2.2-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![GitHub Stars](https://img.shields.io/github/stars/GabrielGaks/sistema-registro-violencia?style=for-the-badge&logo=github)
![GitHub Forks](https://img.shields.io/github/forks/GabrielGaks/sistema-registro-violencia?style=for-the-badge&logo=github)

**Sistema web completo e moderno para registro, gerenciamento e acompanhamento de casos de violência escolar**

[🌐 Acessar Sistema](https://gabrielgaks.github.io/sistema-registro-violencia/FormularioRegistroV2/index.html) • [🚀 Funcionalidades](#-funcionalidades) • [🛠️ Tecnologias](#️-tecnologias) • [📦 Instalação](#-instalação) • [🔒 Segurança](#-segurança) • [📚 Documentação](#-documentação)

[![Deploy](https://img.shields.io/badge/Deploy-GitHub%20Pages-blue?style=for-the-badge&logo=github)](https://gabrielgaks.github.io/sistema-registro-violencia/FormularioRegistroV2/index.html)
[![Issues](https://img.shields.io/github/issues/GabrielGaks/sistema-registro-violencia?style=for-the-badge&logo=github)](https://github.com/GabrielGaks/sistema-registro-violencia/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/GabrielGaks/sistema-registro-violencia?style=for-the-badge&logo=github)](https://github.com/GabrielGaks/sistema-registro-violencia/pulls)

</div>

---

## 📋 Índice

- [📖 Sobre o Projeto](#-sobre-o-projeto)
- [✨ Funcionalidades](#-funcionalidades)
- [🛠️ Tecnologias](#️-tecnologias)
- [🏗️ Arquitetura](#️-arquitetura)
- [👥 Equipe](#-equipe)
- [📦 Instalação](#-instalação)
- [⚙️ Configuração](#️-configuração)
- [🔒 Segurança](#-segurança)
- [📁 Estrutura do Projeto](#-estrutura-do-projeto)
- [🚀 Deploy](#-deploy)
- [📚 Documentação](#-documentação)
- [🤝 Contribuindo](#-contribuindo)
- [📊 Estatísticas](#-estatísticas)
- [📝 Licença](#-licença)

---

## 📖 Sobre o Projeto

Sistema desenvolvido para a **Secretaria Municipal de Educação de Vitória/ES** para registro e acompanhamento de casos de violência escolar na rede municipal de ensino. O sistema oferece uma solução completa e moderna para gestão de dados, com interface intuitiva, gráficos interativos e controle de acesso baseado em roles.

### 🎯 Objetivos

- ✅ **Registro centralizado** de casos de violência escolar
- ✅ **Gestão completa** de dados com interface intuitiva
- ✅ **Visualizações interativas** com gráficos e estatísticas
- ✅ **Controle de acesso** baseado em roles e permissões
- ✅ **Segurança robusta** com validações e sanitização
- ✅ **Responsivo** para desktop, tablet e mobile
- ✅ **Exportação de dados** em PDF com gráficos e estatísticas

### 🏢 Contexto

Sistema desenvolvido para atender às necessidades da Secretaria Municipal de Educação de Vitória/ES, permitindo o registro, acompanhamento e análise de casos de violência escolar em toda a rede municipal de ensino, contribuindo para a proteção e segurança de crianças e adolescentes.

### 🌟 Destaques

- 🎨 **Interface moderna** e intuitiva
- 📊 **Dashboard interativo** com gráficos em tempo real
- 🔐 **Sistema de autenticação** robusto e seguro
- 📱 **100% responsivo** para todos os dispositivos
- 🚀 **Performance otimizada** para grandes volumes de dados
- 🔒 **Segurança em primeiro lugar** com validações e sanitização

---

## ✨ Funcionalidades

### 🔐 Sistema de Autenticação

| Funcionalidade | Descrição |
|----------------|-----------|
| 🔑 **Login Seguro** | Autenticação via Supabase com criptografia |
| 👥 **4 Níveis de Acesso** | superuser, admin, user, visualizador |
| 🔒 **Controle de Permissões** | Acesso granular por role |
| 💾 **Sessão Persistente** | SessionStorage para manter login |
| 🔄 **Redirecionamento Automático** | Baseado em role do usuário |
| 👤 **Gerenciamento de Usuários** | CRUD completo de usuários |
| 🔐 **Recuperação de Senha** | Sistema completo com email |

#### 📊 Roles e Permissões

| Role | Permissões |
|------|------------|
| **superuser** | Acesso total ao sistema (criar/editar/deletar qualquer usuário e caso) |
| **admin** | Gerenciar usuários (user e visualizador), criar/editar/deletar casos |
| **user** | Criar novos casos, editar/deletar próprios casos, visualizar painel |
| **visualizador** | Apenas visualização (read-only) do painel de casos |

### 📝 Formulário de Registro

- ✅ **Autocomplete inteligente** para 106 escolas (CMEIs e EMEFs)
- ✅ **Sistema de tags** para encaminhamentos múltiplos
- ✅ **Sugestões predefinidas** (15+ opções comuns)
- ✅ **Validação em tempo real** com feedback visual
- ✅ **Conversão automática** de dados (datas, gênero, etc.)
- ✅ **Preservação de siglas** existentes
- ✅ **Interface responsiva** e acessível
- ✅ **Autocomplete inteligente** com similaridade de strings

### 📊 Painel de Casos (Dashboard)

- 📈 **Gráficos interativos** com Chart.js
- 📉 **Estatísticas em tempo real**
- 🔍 **Filtros avançados** (data, escola, tipo de violência)
- 📄 **Exportação para PDF** com gráficos e estatísticas
- 📋 **Tabela de dados** completa e pesquisável
- 🎨 **Visualizações modernas** e responsivas
- 📊 **Top 5 Escolas** com mais casos
- 📅 **Análise temporal** de ocorrências

### 👥 Gerenciamento de Usuários

- ➕ **Criação de usuários** com roles
- ✏️ **Edição de permissões** e dados
- 🗑️ **Exclusão segura** de usuários
- 🔍 **Busca e filtros** avançados
- 📊 **Visualização de permissões** por role

### 🔄 Gerenciamento de Casos

- ➕ **Criação** de novos casos
- ✏️ **Edição** de casos existentes
- 🗑️ **Exclusão** de casos
- 🔍 **Busca e filtros** avançados
- 📋 **Visualização detalhada** de cada caso
- 📄 **Paginação inteligente** para grandes volumes

### 🔐 Recuperação de Senha

- 📧 **Envio de email** com link de recuperação
- 🔑 **Tokens seguros** com expiração
- ✅ **Validação de tokens** antes do reset
- 🔒 **Reset seguro** de senha

---

## 🛠️ Tecnologias

### Frontend

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) | 5 | Estrutura das páginas |
| ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) | 3 | Estilização |
| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) | ES6+ | Lógica e interatividade |
| ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) | CDN | Framework CSS utilitário |
| ![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat-square&logo=chart.js&logoColor=white) | 4.4.0 | Gráficos interativos |
| ![html2pdf.js](https://img.shields.io/badge/html2pdf.js-FF6B6B?style=flat-square) | 0.10.1 | Exportação para PDF |

### Backend

| Tecnologia | Uso |
|------------|-----|
| ![Google Apps Script](https://img.shields.io/badge/Google_Apps_Script-4285F4?style=flat-square&logo=google-cloud&logoColor=white) | API serverless para casos e autenticação |
| ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white) | Banco de dados PostgreSQL e autenticação |
| ![Google Sheets](https://img.shields.io/badge/Google_Sheets-34A853?style=flat-square&logo=google-sheets&logoColor=white) | Armazenamento de casos |

### Segurança

| Módulo | Funcionalidade |
|--------|----------------|
| 🔒 **security.js** | Sanitização XSS, validações, prevenção SQL injection |
| 📝 **logger.js** | Sistema de logging seguro com remoção de dados sensíveis |
| 🌐 **api.js** | Wrapper de API com validações e sanitização automática |

### Bibliotecas e Ferramentas

- **TailwindCSS** - Framework CSS utilitário via CDN
- **Chart.js** - Gráficos interativos e responsivos
- **html2pdf.js** - Conversão de HTML para PDF
- **Supabase JS Client** - Cliente JavaScript para Supabase
- **Google Apps Script** - Backend serverless

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (HTML/JS)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Login      │  │  Registro    │  │   Painel     │      │
│  │   (Auth)     │  │  (Casos)     │  │  (Dashboard) │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                  │               │
│         └─────────────────┼──────────────────┘               │
│                           │                                   │
└───────────────────────────┼───────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                │                       │
        ┌───────▼────────┐    ┌────────▼────────┐
        │  Supabase      │    │  Google Apps     │
        │  (Auth + DB)   │    │  Script (API)   │
        └───────┬────────┘    └────────┬────────┘
                │                      │
        ┌───────▼────────┐    ┌────────▼────────┐
        │  PostgreSQL    │    │  Google Sheets  │
        │  (Usuários)    │    │  (Casos)        │
        └────────────────┘    └─────────────────┘
```

### 🔄 Fluxo de Dados

1. **Autenticação**: Usuário faz login → Supabase valida → Retorna token
2. **Registro de Caso**: Formulário → Google Apps Script → Google Sheets
3. **Visualização**: Painel → Google Apps Script → Google Sheets → Gráficos
4. **Gerenciamento**: CRUD → Google Apps Script → Google Sheets/Supabase

---

## 👥 Equipe

Este projeto foi desenvolvido por uma equipe dedicada de profissionais comprometidos com a educação e segurança de crianças e adolescentes.

### 👨‍💻 Desenvolvedores

- **Equipe de Desenvolvimento** - Secretaria Municipal de Educação de Vitória/ES
  - Desenvolvimento Full-Stack
  - Arquitetura e Design de Sistema
  - Implementação de Segurança
  - Interface e Experiência do Usuário

### 🎨 Design e UX

- **Equipe de Design** - Interface e Experiência do Usuário
  - Design responsivo e moderno
  - Experiência do usuário otimizada
  - Acessibilidade e usabilidade

### 🔒 Segurança

- **Equipe de Segurança** - Implementação de Medidas de Segurança
  - Validação e sanitização de dados
  - Proteção contra vulnerabilidades
  - Auditoria e logging seguro

### 📊 Análise de Dados

- **Equipe de Análise** - Visualizações e Estatísticas
  - Gráficos interativos
  - Análise de tendências
  - Relatórios e exportação

### 🏫 Parceiros

- **Secretaria Municipal de Educação de Vitória/ES**
  - Requisitos e especificações
  - Testes e validação
  - Suporte e feedback

---

## 📦 Instalação

### Pré-requisitos

- 🌐 Navegador moderno (Chrome, Firefox, Edge, Safari)
- 📧 Conta Google (para Google Apps Script e Sheets)
- 🔐 Conta Supabase (para autenticação e banco de dados)
- 📁 Servidor web local ou GitHub Pages

### 1️⃣ Clone o Repositório

```bash
git clone https://github.com/GabrielGaks/sistema-registro-violencia.git
cd sistema-registro-violencia/FormularioRegistroV2
```

### 2️⃣ Configure as Credenciais

```bash
# Copie o template de configuração
cp config.local.example.js config.local.js

# Edite config.local.js com suas credenciais
# ⚠️ NUNCA faça commit deste arquivo!
```

### 3️⃣ Configure o Backend

#### Google Apps Script - Autenticação

1. Acesse [Google Apps Script](https://script.google.com)
2. Crie novo projeto: `Sistema-Auth`
3. Cole o código de `backend/Code-Supabase.gs`
4. Configure as credenciais do Supabase
5. Implante como aplicativo web

#### Google Apps Script - Casos

1. Crie novo projeto: `Sistema-Casos`
2. Cole o código de `backend/Code.gs`
3. Configure o ID da planilha Google Sheets
4. Implante como aplicativo web

#### Supabase

1. Crie projeto no [Supabase](https://supabase.com)
2. Execute os scripts SQL em `docs/database/`:
   - `supabase-setup.sql`
   - `password-reset-tokens.sql`
3. Configure Row Level Security (RLS)

### 4️⃣ Configure Google Sheets

1. Crie uma planilha no Google Sheets
2. Configure as colunas conforme o formato esperado
3. Compartilhe como "Qualquer pessoa com o link pode visualizar"
4. Copie o ID da planilha para `config.local.js`

---

## ⚙️ Configuração

### 📝 Arquivo `config.local.js`

```javascript
const CONFIG_LOCAL = {
  // URLs do Google Apps Script
  APPS_SCRIPT_AUTH: 'https://script.google.com/macros/s/SEU_ID_AUTH/exec',
  APPS_SCRIPT_CASOS: 'https://script.google.com/macros/s/SEU_ID_CASOS/exec',
  
  // ID da planilha Google Sheets
  SPREADSHEET_ID: 'SEU_ID_PLANILHA',
  
  // Credenciais Supabase
  SUPABASE_URL: 'https://seu-projeto.supabase.co',
  SUPABASE_KEY: 'sua-chave-anon',
  
  // URL base do site (para emails de recuperação)
  BASE_URL: 'https://gabrielgaks.github.io/sistema-registro-violencia/FormularioRegistroV2'
};
```

### 🔐 Variáveis de Ambiente (Opcional)

Para produção, você pode usar variáveis de ambiente:

```bash
export APPS_SCRIPT_AUTH_URL="https://..."
export APPS_SCRIPT_CASOS_URL="https://..."
export SPREADSHEET_ID="..."
export SUPABASE_URL="https://..."
export SUPABASE_ANON_KEY="..."
```

---

## 🔒 Segurança

### 🛡️ Módulos de Segurança Implementados

#### 1. **security.js** - Módulo de Segurança

```javascript
// Sanitização XSS
const safe = Security.sanitizeString(userInput);

// Validação de email
if (Security.validateEmail(email)) { /* ... */ }

// Sanitização de objetos
const safeData = Security.sanitizeObject(formData);

// Prevenção SQL Injection
const safeQuery = Security.preventSQLInjection(query);
```

**Funcionalidades:**
- ✅ Sanitização de strings (prevenção XSS)
- ✅ Validação de email, URL, data, idade
- ✅ Sanitização de objetos e formulários
- ✅ Prevenção de injeção SQL básica
- ✅ Geração e validação de tokens CSRF
- ✅ Limitação de tamanho de strings

#### 2. **logger.js** - Sistema de Logging Seguro

```javascript
// Logging condicional (apenas em modo debug)
Logger.log('Mensagem de log');
Logger.error('Erro ocorrido');
Logger.warn('Aviso importante');

// Remoção automática de dados sensíveis
Logger.log({ email: 'user@example.com', token: 'abc123' });
// Output: { email: '[REDACTED]', token: '[REDACTED]' }
```

**Funcionalidades:**
- ✅ Logging condicional (apenas se `DEBUG_MODE` ativo)
- ✅ Remoção automática de dados sensíveis
- ✅ Diferentes níveis de log (log, error, warn, info, success)

#### 3. **api.js** - Wrapper de API Seguro

```javascript
// Chamadas de API com validação automática
try {
  const result = await API.login(email, password);
  // Dados já sanitizados e validados
} catch (error) {
  // Erro tratado
}
```

**Funcionalidades:**
- ✅ Validação de URLs antes de requisições
- ✅ Sanitização automática de dados enviados
- ✅ Timeout configurável
- ✅ Tratamento de erros padronizado
- ✅ Métodos específicos (login, saveCase, updateCase, etc.)

### 🔐 Boas Práticas Implementadas

- ✅ **Credenciais protegidas**: `config.local.js` no `.gitignore`
- ✅ **Sanitização de inputs**: Todos os dados do usuário são sanitizados
- ✅ **Validação de dados**: Validação antes de processar
- ✅ **Tokens seguros**: Tokens de recuperação com expiração
- ✅ **Row Level Security**: RLS configurado no Supabase
- ✅ **HTTPS obrigatório**: Todas as comunicações via HTTPS
- ✅ **SessionStorage seguro**: Tokens armazenados de forma segura

### 📋 Checklist de Segurança

- [x] Sanitização de inputs (XSS)
- [x] Validação de dados
- [x] Prevenção SQL Injection
- [x] Tokens CSRF
- [x] Logging seguro (sem dados sensíveis)
- [x] Credenciais protegidas (.gitignore)
- [x] HTTPS obrigatório
- [x] Row Level Security (RLS)
- [x] Tokens com expiração
- [x] Validação de URLs

---

## 📁 Estrutura do Projeto

```
FormularioRegistroV2/
│
├── 📄 *.html                    # Páginas HTML (raiz)
│   ├── index.html               # Login
│   ├── registro-novo-caso.html  # Formulário de registro
│   ├── gerenciar-casos.html    # Gerenciamento de casos
│   ├── gerenciar-usuarios.html  # Gerenciamento de usuários
│   ├── painel-casos.html       # Dashboard
│   ├── recuperar-senha.html    # Recuperação de senha
│   └── resetar-senha.html      # Reset de senha
│
├── 📜 config.js                 # Configuração principal
├── 📜 config.local.example.js   # Template de config local
│
├── 📁 assets/                   # Recursos estáticos
│   ├── css/
│   │   └── styles-elegant.css   # Estilos compartilhados
│   └── js/
│       ├── modules/             # Módulos específicos
│       │   └── dashboard-stats.js
│       └── utils/               # Utilitários compartilhados
│           ├── api.js           # Módulo de API
│           ├── security.js       # Módulo de segurança
│           ├── logger.js         # Sistema de logging
│           ├── config-loader.js  # Carregador de config
│           └── page-transitions.js
│
├── 📁 backend/                  # Código do Google Apps Script
│   ├── Code.gs                  # Backend - Casos
│   └── Code-Supabase.gs         # Backend - Autenticação
│
├── 📁 docs/                     # Documentação
│   ├── README.md                # Documentação completa
│   ├── guides/                  # Guias de uso
│   │   ├── CONFIG-README.md
│   │   ├── DEPLOY-GITHUB.md
│   │   ├── GUIA-IMPLANTACAO.md
│   │   └── GRUPOS-ENCAMINHAMENTO-GUIA.md
│   ├── security/                # Segurança
│   │   ├── SECURITY.md
│   │   └── README-SEGURANCA.md
│   ├── troubleshooting/          # Solução de problemas
│   │   ├── TROUBLESHOOTING-RESET-SENHA.md
│   │   ├── RESOLVER-PERMISSAO-EMAIL.md
│   │   ├── CONFIGURAR-EMAIL-PRODUCAO.md
│   │   ├── SOLUCAO-404-RESET-SENHA.md
│   │   └── SOLUCAO-POPUP-NAO-APARECE.md
│   └── database/                # Scripts SQL
│       ├── supabase-setup.sql
│       └── password-reset-tokens.sql
│
└── 📁 legacy/                   # Arquivos legados
    └── Index-GoogleSheets.html
```

---

## 🚀 Deploy

### 🌐 Acesso ao Sistema

**🔗 Link de Acesso:** [https://gabrielgaks.github.io/sistema-registro-violencia/FormularioRegistroV2/index.html](https://gabrielgaks.github.io/sistema-registro-violencia/FormularioRegistroV2/index.html)

### GitHub Pages

1. **Faça push do código para o GitHub**
   ```bash
   git add .
   git commit -m "Atualização do sistema"
   git push origin main
   ```

2. **Configure GitHub Pages**
   - Vá em Settings → Pages
   - Selecione branch `main` e pasta `/FormularioRegistroV2`
   - Salve

3. **Configure URLs no `config.local.js`**
   ```javascript
   BASE_URL: 'https://gabrielgaks.github.io/sistema-registro-violencia/FormularioRegistroV2'
   ```

### Servidor Local

```bash
# Com Python
python -m http.server 8000

# Com Node.js (http-server)
npx http-server -p 8000

# Com PHP
php -S localhost:8000
```

Acesse: `http://localhost:8000`

---

## 📚 Documentação

### 📖 Documentação Completa

- **[Documentação Principal](docs/README.md)** - Guia completo do sistema
- **[Estrutura do Projeto](ESTRUTURA-PROJETO.md)** - Estrutura detalhada
- **[Guia de Segurança](docs/security/SECURITY.md)** - Medidas de segurança
- **[Guia de Deploy](docs/guides/DEPLOY-GITHUB.md)** - Deploy no GitHub Pages
- **[Guia de Implantação](docs/guides/GUIA-IMPLANTACAO.md)** - Configuração inicial

### 🔧 Troubleshooting

- **[Troubleshooting Reset Senha](docs/troubleshooting/TROUBLESHOOTING-RESET-SENHA.md)**
- **[Resolver Permissão Email](docs/troubleshooting/RESOLVER-PERMISSAO-EMAIL.md)**
- **[Configurar Email Produção](docs/troubleshooting/CONFIGURAR-EMAIL-PRODUCAO.md)**

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga estes passos:

1. **Fork o projeto**
2. **Crie uma branch** (`git checkout -b feature/nova-funcionalidade`)
3. **Commit suas mudanças** (`git commit -m 'Adiciona nova funcionalidade'`)
4. **Push para a branch** (`git push origin feature/nova-funcionalidade`)
5. **Abra um Pull Request**

### 📋 Padrões de Código

- ✅ Use ESLint para manter consistência
- ✅ Siga os padrões de nomenclatura existentes
- ✅ Adicione comentários em código complexo
- ✅ Mantenha a documentação atualizada

### 🐛 Reportar Bugs

Encontrou um bug? [Abra uma issue](https://github.com/GabrielGaks/sistema-registro-violencia/issues) descrevendo:
- 📝 Descrição do problema
- 🔄 Passos para reproduzir
- 💻 Ambiente (navegador, sistema operacional)
- 📸 Screenshots (se aplicável)

---

## 📊 Estatísticas

![GitHub Stars](https://img.shields.io/github/stars/GabrielGaks/sistema-registro-violencia?style=social)
![GitHub Forks](https://img.shields.io/github/forks/GabrielGaks/sistema-registro-violencia?style=social)
![GitHub Watchers](https://img.shields.io/github/watchers/GabrielGaks/sistema-registro-violencia?style=social)

![GitHub Issues](https://img.shields.io/github/issues/GabrielGaks/sistema-registro-violencia)
![GitHub Pull Requests](https://img.shields.io/github/issues-pr/GabrielGaks/sistema-registro-violencia)
![GitHub Last Commit](https://img.shields.io/github/last-commit/GabrielGaks/sistema-registro-violencia)

### 📈 Métricas do Projeto

- 📦 **35+ arquivos** organizados
- 📝 **8.700+ linhas** de código
- 🎨 **7 páginas** HTML
- 🔧 **2 backends** (Google Apps Script)
- 📚 **Documentação completa** organizada
- 🔒 **Módulos de segurança** implementados

---

## 📝 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

**Resumo da licença:**
- ✅ Uso comercial
- ✅ Modificação
- ✅ Distribuição
- ✅ Uso privado
- ⚠️ Sem garantia

---

## 👥 Autores

- **Equipe de Desenvolvimento** - Secretaria Municipal de Educação de Vitória/ES
  - Desenvolvimento Full-Stack
  - Arquitetura e Design de Sistema
  - Implementação de Segurança
  - Interface e Experiência do Usuário

---

## 🙏 Agradecimentos

Este sistema foi desenvolvido com dedicação para apoiar o combate à violência escolar e a proteção de crianças e adolescentes da rede municipal de ensino de Vitória/ES.

**Agradecimentos especiais:**

- 🏫 **Secretaria Municipal de Educação de Vitória/ES**
- 👨‍🏫 **Profissionais da educação** que utilizam o sistema
- 👨‍💻 **Comunidade open-source**
- 🌟 **Todos que contribuíram** com feedback e sugestões

---

<div align="center">

**⭐ Se este projeto foi útil, considere dar uma estrela! ⭐**

[⬆ Voltar ao topo](#-sistema-de-registro-de-violência-escolar)

---

### 🛡️ Sistema de Registro de Violência Escolar v2.2

**Desenvolvido com ❤️ para educação e segurança de crianças**

_Dezembro de 2025_

---

[![Reportar Bug](https://img.shields.io/badge/🐛-Reportar_Bug-red?style=for-the-badge)](https://github.com/GabrielGaks/sistema-registro-violencia/issues)
[![Solicitar Funcionalidade](https://img.shields.io/badge/✨-Nova_Funcionalidade-green?style=for-the-badge)](https://github.com/GabrielGaks/sistema-registro-violencia/issues)
[![Acessar Sistema](https://img.shields.io/badge/🌐-Acessar_Sistema-blue?style=for-the-badge)](https://gabrielgaks.github.io/sistema-registro-violencia/FormularioRegistroV2/index.html)

**Made with ❤️ for education and children's safety**

</div>
