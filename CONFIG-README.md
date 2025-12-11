# 🔧 Guia de Configuração - config.js

## 📍 Localização
`FormularioRegistroV2/config.js`

---

## ⚙️ Como Usar

O arquivo `config.js` centraliza **todas as variáveis que você precisa alterar** quando:
- Implantar uma nova versão do Apps Script
- Mudar de planilha
- Alterar URLs ou chaves de API

### ✅ Vantagens
- **1 único arquivo** para alterar tudo
- **Não precisa** editar cada HTML separadamente
- **Menos erros** ao atualizar

---

## 🔑 Variáveis Principais

### **1. Apps Script - Autenticação**
```javascript
APPS_SCRIPT_AUTH: 'https://script.google.com/macros/s/SEU_SCRIPT_AUTH_AQUI/exec'
```

**Usado em:**
- `login.html`
- `gerenciar-usuarios.html`

**Como obter:**
1. Abra o projeto Apps Script de **Autenticação/Usuários**
2. Clique em **Implantar** > **Gerenciar implantações**
3. Copie a URL do Web App
4. Cole no `config.js`

---

### **2. Apps Script - Casos**
```javascript
APPS_SCRIPT_CASOS: 'https://script.google.com/macros/s/AKfycbw9n-x.../exec'
```

**Usado em:**
- `registro-novo-caso.html`
- `gerenciar-casos.html`
- *(painel-casos.html usa acesso direto à planilha)*

**Como obter:**
1. Abra o projeto Apps Script de **Casos/Registros**
2. Clique em **Implantar** > **Gerenciar implantações**
3. Copie a URL do Web App
4. Cole no `config.js`

---

### **3. ID da Planilha**
```javascript
SPREADSHEET_ID: '1A6a2ZLiHegPJBDpE3YLPGsa8RXVRLjpkXmKdauSlb9Y'
```

**Usado em:**
- `painel-casos.html` (leitura direta)
- Apps Script `Code.gs` (se você copiar o ID de lá)

**Como obter:**
1. Abra sua planilha no Google Sheets
2. Copie o ID da URL:
   ```
   https://docs.google.com/spreadsheets/d/SEU_ID_AQUI/edit
                                        ↑
                                   Copie isso
   ```
3. Cole no `config.js`

---

## 📝 Exemplo de Atualização

### Cenário: Nova implantação do Apps Script de Casos

**❌ Antes (SEM config.js):**
Você teria que editar 3 arquivos:
- `registro-novo-caso.html` (linha ~1155)
- `gerenciar-casos.html` (linha ~1069)
- `Code.gs` (comentário/documentação)

**✅ Agora (COM config.js):**
1. Abra apenas `config.js`
2. Altere a linha:
   ```javascript
   APPS_SCRIPT_CASOS: 'https://script.google.com/macros/s/NOVA_URL_AQUI/exec'
   ```
3. Salve
4. Pronto! ✅

---

## 🚨 Importante

### Limpar Cache do Navegador
Após alterar `config.js`, **SEMPRE limpe o cache**:

**Opção 1 - Hard Refresh:**
```
Ctrl + Shift + R  (Windows/Linux)
Cmd + Shift + R   (Mac)
```

**Opção 2 - Limpar Cache:**
```
Ctrl + Shift + Delete  (abre menu de limpeza)
```

### Por que?
O navegador guarda o `config.js` antigo em cache. Se não limpar, usará os valores antigos mesmo após salvar.

---

## 📂 Estrutura de Arquivos

```
FormularioRegistroV2/
├── config.js                    ← ARQUIVO DE CONFIGURAÇÃO
├── login.html                   (usa APPS_SCRIPT_AUTH)
├── gerenciar-usuarios.html      (usa APPS_SCRIPT_AUTH)
├── registro-novo-caso.html      (usa APPS_SCRIPT_CASOS)
├── gerenciar-casos.html         (usa APPS_SCRIPT_CASOS)
├── painel-casos.html            (usa SPREADSHEET_ID)
└── Code.gs                      (backend - Apps Script)
```

---

## 🔍 Como Verificar se Está Funcionando

### 1. Abra o Console do Navegador
```
F12 → Console
```

### 2. Digite:
```javascript
CONFIG
```

### 3. Você verá:
```javascript
{
  APPS_SCRIPT_AUTH: "https://script...",
  APPS_SCRIPT_CASOS: "https://script...",
  SPREADSHEET_ID: "1A6a2ZLi...",
  // ... outras configs
}
```

Se aparecer `CONFIG is not defined`, **limpe o cache** e recarregue (Ctrl+F5).

---

## 🛠️ Troubleshooting

### ❌ Erro: "CONFIG is not defined"
**Causa:** Cache do navegador não foi limpo

**Solução:**
1. Pressione `Ctrl + Shift + R`
2. Ou abra modo anônimo (`Ctrl + Shift + N`)

---

### ❌ Erro ao enviar formulário
**Causa:** URL do Apps Script incorreta

**Solução:**
1. Verifique se a URL em `config.js` está correta
2. Teste a URL diretamente no navegador:
   - Deve abrir uma página (pode ser erro CORS, mas abre)
   - Se der erro 404 → URL errada

---

### ❌ Login não funciona mas cadastro funciona
**Causa:** `APPS_SCRIPT_AUTH` e `APPS_SCRIPT_CASOS` trocados

**Solução:**
- Login usa `APPS_SCRIPT_AUTH`
- Cadastro usa `APPS_SCRIPT_CASOS`
- Certifique-se de que estão nas variáveis corretas

---

## 📌 Checklist de Deploy

Quando fizer uma nova implantação:

- [ ] Copiar URL do Apps Script Auth
- [ ] Colar em `CONFIG.APPS_SCRIPT_AUTH`
- [ ] Copiar URL do Apps Script Casos
- [ ] Colar em `CONFIG.APPS_SCRIPT_CASOS`
- [ ] Copiar ID da planilha (se mudou)
- [ ] Colar em `CONFIG.SPREADSHEET_ID`
- [ ] Salvar `config.js`
- [ ] Fazer Hard Refresh (Ctrl+Shift+R)
- [ ] Testar login
- [ ] Testar cadastro de caso
- [ ] Testar painel (visualização)

---

## 🎯 Resumo Rápido

| Variável | Onde Mudar | Quando Mudar |
|----------|-----------|--------------|
| `APPS_SCRIPT_AUTH` | config.js linha ~14 | Nova implantação do script de autenticação |
| `APPS_SCRIPT_CASOS` | config.js linha ~19 | Nova implantação do script de casos |
| `SPREADSHEET_ID` | config.js linha ~26 | Mudou de planilha |

**Regra de Ouro:** Sempre que implantar novo Apps Script = atualizar `config.js` + limpar cache.

---

📅 **Última atualização:** Dezembro 2025  
✅ **Status:** Todos os arquivos HTML já importam `config.js` automaticamente
