<div align="center">

# 🛡️ Sistema de Registro de Violência Escolar

![Status](https://img.shields.io/badge/status-produção-success?style=for-the-badge)
![Versão](https://img.shields.io/badge/versão-2.3-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![Maintenance](https://img.shields.io/badge/maintenance-ativo-brightgreen?style=for-the-badge)
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
- [🗓️ Roadmap](#-roadmap)
- [🤝 Contribuindo](#-contribuindo)
- [📊 Estatísticas](#-estatísticas)
- [📝 Licença](#-licença)

---

## 📖 Sobre o Projeto

Sistema desenvolvido para a **Secretaria Municipal de Educação de Vitória/ES** para registro e acompanhamento de casos de violência escolar na rede municipal de ensino. O sistema oferece uma solução completa, moderna e robusta para gestão de dados, com interface intuitiva, gráficos interativos e controle de acesso baseado em roles.

**Status:** ✅ Versão final (v2.3) - Pronto para produção com suporte para atualizações futuras

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

- 🎨 **Interface moderna** e intuitiva, totalmente responsiva
- 📊 **Dashboard interativo** com gráficos em tempo real e estatísticas avançadas
- 🔐 **Sistema de autenticação** robusto e seguro com 4 níveis de acesso
- 📱 **100% responsivo** para todos os dispositivos (mobile, tablet, desktop)
- 🚀 **Performance otimizada** para grandes volumes de dados
- 🔒 **Segurança em primeiro lugar** com validações, sanitização e proteção contra vulnerabilidades
- 🔄 **Arquitetura escalável** preparada para atualizações futuras
- 💾 **Exportação de relatórios** em PDF com gráficos e análises
- 📧 **Sistema de recuperação de senha** seguro e confiável
- 🎯 **Filtros avançados** com busca inteligente e autocomplete

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

### ✅ Requisitos do Sistema

#### Navegadores Suportados

| Navegador | Versão Mínima | Status |
|-----------|---------------|--------|
| 🔵 Chrome | 90+ | ✅ Totalmente suportado |
| 🟠 Firefox | 88+ | ✅ Totalmente suportado |
| 🔶 Edge | 90+ | ✅ Totalmente suportado |
| 🟣 Safari | 14+ | ✅ Totalmente suportado |
| 🟢 Opera | 76+ | ✅ Totalmente suportado |

#### Requisitos de Servidor

- 📊 **Espaço em disco**: 50MB (código + documentação)
- 🔗 **Conexão Internet**: Obrigatória (APIs externas)
- 🌐 **Protocolo**: HTTPS (recomendado para produção)
- 🔐 **SSL/TLS**: Certificado válido (para autenticação)

#### Requisitos de Conta

- 📧 **Google Account** (para Google Apps Script e Sheets)
- 🔐 **Supabase Account** (para autenticação e banco de dados)
- 🐙 **GitHub Account** (para deploy em GitHub Pages - opcional)

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

## 🗓️ Roadmap

### ✅ Versão 2.3 (Atual - Janeiro 2026)

**Versão Final com Foco em Estabilidade e Qualidade**

- ✅ Sistema de autenticação com 4 níveis de acesso
- ✅ Dashboard com gráficos interativos
- ✅ Gerenciamento completo de casos
- ✅ Gerenciamento de usuários
- ✅ Sistema de recuperação de senha
- ✅ Validações e sanitização de segurança
- ✅ Exportação de relatórios em PDF
- ✅ Interface 100% responsiva
- ✅ Documentação completa
- ✅ Pronto para produção

### 🚀 Versão 3.0 (Futuro)

**Recursos Planejados para Próximas Atualizações**

#### Q1/Q2 2026 (Curto Prazo)

- 🔄 **Sistema de Sincronização** - Sincronização automática entre dispositivos
- ♿ **Acessibilidade (WCAG 2.1)** - Conformidade completa
- 📧 **Automação de Notificações** - Alertas inteligentes
- 🔐 **Two-Factor Authentication** - Segurança adicional com 2FA

#### Q3/Q4 2026 (Médio Prazo)

- 🌐 **Internacionalização (i18n)** - Suporte a múltiplos idiomas (PT, EN, ES)
- 🗺️ **Mapa Interativo** - Visualização geográfica de casos
- 📊 **Relatórios Avançados** - Análises preditivas com IA
- 📱 **Progressive Web App (PWA)** - Funcionalidade offline

#### 2027+ (Longo Prazo)

- 📱 **Aplicativo Mobile Nativo** - iOS e Android
- 🤖 **Machine Learning** - Detecção automática de padrões
- 🔔 **Sistema de Notificações Push** - Alertas em tempo real
- 📈 **Analytics Avançado** - Dashboard de métricas detalhadas

### 💡 Ideias em Discussão

- 🎓 **Sistema de Treinamento** - Capacitação de usuários
- 🤝 **API Pública** - Para integrações com outros sistemas
- 📡 **Webhook Support** - Integração com plataformas externas
- 🔗 **Single Sign-On (SSO)** - Integração com Active Directory

**Nota:** Este roadmap pode ser atualizado conforme feedback da comunidade e prioridades de desenvolvimento.

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Este projeto está aberto para melhorias contínuas e atualizações futuras. Siga estes passos:

### 📝 Como Contribuir

1. **Fork o projeto**
2. **Crie uma branch** para sua funcionalidade (`git checkout -b feature/nova-funcionalidade`)
3. **Commit suas mudanças** (`git commit -m 'Adiciona nova funcionalidade'`)
4. **Push para a branch** (`git push origin feature/nova-funcionalidade`)
5. **Abra um Pull Request** descrevendo detalhadamente a sua contribuição

### 💡 Sugestões de Melhorias Futuras

Este projeto está aberto para as seguintes atualizações:

- 🌐 **Internacionalização (i18n)** - Suporte a múltiplos idiomas
- 📱 **App Mobile Nativa** - Aplicativos iOS e Android
- 🤖 **IA e Machine Learning** - Análise preditiva de violência
- 🔔 **Sistema de Notificações** - Alertas em tempo real
- 📧 **Automação de Emails** - Notificações automáticas para casos urgentes
- 🗺️ **Mapa Interativo** - Visualização geográfica de casos
- 📊 **Relatórios Avançados** - Análises mais profundas
- 🔐 **Two-Factor Authentication** - Segurança adicional
- ♿ **Acessibilidade (WCAG)** - Conformidade completa com padrões
- 📱 **Progressive Web App (PWA)** - Funcionalidade offline

### 📋 Padrões de Código

- ✅ Use ESLint para manter consistência
- ✅ Siga os padrões de nomenclatura existentes
- ✅ Adicione comentários em código complexo
- ✅ Mantenha a documentação atualizada
- ✅ Testes unitários para novas funcionalidades

### 🐛 Reportar Bugs

Encontrou um bug? [Abra uma issue](https://github.com/GabrielGaks/sistema-registro-violencia/issues) descrevendo:
- 📝 Descrição clara do problema
- 🔄 Passos detalhados para reproduzir
- 💻 Ambiente (navegador, versão, SO)
- 📸 Screenshots ou vídeos (se aplicável)
- ⚠️ Comportamento esperado vs. comportamento atual

---

## ❓ Perguntas Frequentes (FAQ)

### 🔒 Segurança

**P: Minhas dados estão seguros?**
R: Sim! Todos os dados são protegidos com criptografia, validação de inputs, sanitização contra XSS e SQL injection. Utilizamos Supabase com Row Level Security (RLS) e HTTPS obrigatório.

**P: Como os dados são armazenados?**
R: Os casos são armazenados em Google Sheets, e os usuários/senhas em Supabase (PostgreSQL). Ambos com backup automático.

**P: Como funciona a recuperação de senha?**
R: Um email é enviado com um link seguro que expira em 24 horas. O token é validado antes de permitir o reset.

### 🚀 Instalação e Deploy

**P: Posso executar localmente?**
R: Sim! Use `python -m http.server 8000` ou qualquer outro servidor web local.

**P: Como fazer deploy no GitHub Pages?**
R: Configure o repositório em Settings → Pages, selecione a branch `main` e pasta `/FormularioRegistroV2`.

**P: Funciona offline?**
R: Não, requer internet para autenticação e acesso aos dados. Funcionalidade offline está no roadmap.

### 👥 Usuários e Permissões

**P: Quantos usuários o sistema suporta?**
R: Ilimitado! O Supabase escala automaticamente.

**P: Posso modificar os níveis de acesso?**
R: Sim! Edite os roles em `config.js` e ajuste as permissões no código.

**P: Como redefinir a senha de um usuário?**
R: Admins podem resetar senhas através da página de gerenciamento de usuários.

### 📊 Funcionalidades

**P: Posso exportar os dados em outros formatos?**
R: Atualmente suporta PDF. CSV está no roadmap.

**P: Os gráficos são em tempo real?**
R: Sim! Atualizam assim que novos casos são adicionados.

**P: Posso personalizar o sistema?**
R: Sim! O código é aberto e você pode modificar conforme necessário.

### 🐛 Troubleshooting

**P: Estou recebendo erro 404 no reset de senha?**
R: Veja [SOLUCAO-404-RESET-SENHA.md](docs/troubleshooting/SOLUCAO-404-RESET-SENHA.md)

**P: O email não está sendo enviado?**
R: Verifique [CONFIGURAR-EMAIL-PRODUCAO.md](docs/troubleshooting/CONFIGURAR-EMAIL-PRODUCAO.md)

**P: Encontrei um bug, como reportar?**
R: Abra uma issue em [GitHub Issues](https://github.com/GabrielGaks/sistema-registro-violencia/issues) com detalhes do problema.

---

## 📊 Estatísticas

![GitHub Stars](https://img.shields.io/github/stars/GabrielGaks/sistema-registro-violencia?style=social)
![GitHub Forks](https://img.shields.io/github/forks/GabrielGaks/sistema-registro-violencia?style=social)
![GitHub Watchers](https://img.shields.io/github/watchers/GabrielGaks/sistema-registro-violencia?style=social)

![GitHub Issues](https://img.shields.io/github/issues/GabrielGaks/sistema-registro-violencia)
![GitHub Pull Requests](https://img.shields.io/github/issues-pr/GabrielGaks/sistema-registro-violencia)
![GitHub Last Commit](https://img.shields.io/github/last-commit/GabrielGaks/sistema-registro-violencia)

### 📈 Métricas do Projeto

- 📦 **35+ arquivos** bem organizados e estruturados
- 📝 **8.700+ linhas** de código profissional e documentado
- 🎨 **7 páginas** HTML com design responsivo
- 🔧 **2 backends** Google Apps Script otimizados
- 📚 **Documentação completa** e organizada para fácil manutenção
- 🔒 **3 módulos de segurança** implementados (security, logger, api)
- ✅ **100% funcional** em produção
- 🚀 **Performance otimizada** com tempos de carregamento <2s

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

## 👥 Autores e Contribuidores

- **Equipe de Desenvolvimento** - Secretaria Municipal de Educação de Vitória/ES
  - Desenvolvimento Full-Stack
  - Arquitetura e Design de Sistema
  - Implementação de Segurança
  - Interface e Experiência do Usuário

---

## 🙏 Agradecimentos

Este projeto foi desenvolvido com dedicação e comprometimento para apoiar a proteção e segurança de crianças e adolescentes da rede municipal de ensino de Vitória/ES.

### 👏 Agradecimentos Especiais

- 🏫 **Secretaria Municipal de Educação de Vitória/ES** - Apoio, feedback e confiança no projeto
- 👨‍🏫 **Profissionais da educação** - Que utilizam o sistema e fornecem feedback valioso
- 🔧 **Comunidade open-source** - Ferramentas e bibliotecas que tornaram isso possível:
  - [TailwindCSS](https://tailwindcss.com/) - Framework CSS moderno e responsivo
  - [Chart.js](https://www.chartjs.org/) - Gráficos interativos e responsivos
  - [Supabase](https://supabase.com/) - Backend PostgreSQL como serviço
  - [Google Apps Script](https://script.google.com/) - Backend serverless
  - [html2pdf.js](https://ekoopmans.github.io/html2pdf.js/) - Geração de PDFs
- 🌟 **Todos que contribuíram** - Com código, feedback, testes e sugestões

### 🤝 Contribuidores

Agradecemos a todos que contribuem ou contribuíram com este projeto através de:
- 📝 Issues e bug reports
- 💡 Sugestões de funcionalidades
- 🔧 Correções e melhorias de código
- 📚 Melhorias na documentação
- 🧪 Testes e validação

---

## 📝 Histórico de Versões

### v2.3 (Janeiro 2026) - Versão Final
**Status:** ✅ Produção - Versão Estável

**Melhorias:**
- 🎨 Interface melhorada com responsividade aprimorada
- 🔒 Segurança reforçada com sanitização avançada
- 📊 Dashboard otimizado com melhor performance
- 🐛 Correção de múltiplos bugs reportados
- 📚 Documentação completa e atualizada
- 🚀 Performance otimizada para grandes volumes

**Notas:**
- Versão final pronta para produção
- Suporte garantido para atualizações futuras
- Arquitetura escalável para futuras extensões

### v2.2 (Dezembro 2025)
**Status:** ✅ Arquivado

**Features:**
- Sistema de autenticação com Supabase
- Dashboard com gráficos Chart.js
- Gerenciamento de casos e usuários
- Exportação de relatórios em PDF
- Sistema de recuperação de senha

### v2.1 (Outubro 2025)
**Status:** ✅ Arquivado

**Melhorias:**
- Validação avançada de formulários
- Filtros inteligentes no painel
- Melhor acessibilidade

### v2.0 (Agosto 2025)
**Status:** ✅ Arquivado

**Features Principais:**
- Primeira versão do FormularioRegistroV2
- Interface moderna com TailwindCSS
- Sistema de roles baseado em permissões

---

<div align="center">

**⭐ Se este projeto foi útil para você ou sua organização, considere dar uma estrela! ⭐**

[⬆ Voltar ao topo](#-sistema-de-registro-de-violência-escolar)

---

### 🛡️ Sistema de Registro de Violência Escolar v2.3

**Versão Final - Pronto para Produção com Suporte para Atualizações Futuras**

**Desenvolvido com ❤️ para educação, segurança e proteção de crianças**

_Janeiro de 2026_

---

### 📞 Suporte e Contato

Tem dúvidas ou precisa de suporte? 

- 📧 **Email**: Entre em contato através das [issues do repositório](https://github.com/GabrielGaks/sistema-registro-violencia/issues)
- 🐛 **Bug Reports**: [Abra uma issue com detalhes](https://github.com/GabrielGaks/sistema-registro-violencia/issues)
- 💬 **Discussões**: Participe das [discussões da comunidade](https://github.com/GabrielGaks/sistema-registro-violencia/discussions)
- 🌐 **Website**: [Acesse o sistema em produção](https://gabrielgaks.github.io/sistema-registro-violencia/FormularioRegistroV2/index.html)
- 📚 **Documentação**: [Veja a documentação completa](docs/README.md)

---

[![Reportar Bug](https://img.shields.io/badge/🐛-Reportar_Bug-red?style=for-the-badge)](https://github.com/GabrielGaks/sistema-registro-violencia/issues)
[![Solicitar Funcionalidade](https://img.shields.io/badge/✨-Nova_Funcionalidade-green?style=for-the-badge)](https://github.com/GabrielGaks/sistema-registro-violencia/issues)
[![Acessar Sistema](https://img.shields.io/badge/🌐-Acessar_Sistema-blue?style=for-the-badge)](https://gabrielgaks.github.io/sistema-registro-violencia/FormularioRegistroV2/index.html)
[![Ver Documentação](https://img.shields.io/badge/📚-Documentação-blueviolet?style=for-the-badge)](docs/README.md)

**Made with ❤️ for education, safety and children's protection**

</div>
