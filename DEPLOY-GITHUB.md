# 🚀 Deploy Rápido - GitHub + Google Apps Script

## 📋 Visão Geral

Este sistema funciona assim:
- **Frontend (index.html)**: Hospedado no GitHub Pages (GRATUITO)
- **Backend (Code.gs)**: Hospedado no Google Apps Script (GRATUITO)
- **Dados**: Salvos na planilha do Google Sheets

**Não precisa criar projeto no Google Cloud!** ✅

---

## ⚙️ Passo 1: Configurar o Google Apps Script

### 1.1 Criar o projeto no Apps Script

1. Acesse: https://script.google.com
2. Clique em **"Novo projeto"**
3. Nome do projeto: `Formulario-Violencia-Escolar`

### 1.2 Adicionar o código backend

1. Apague o conteúdo padrão do arquivo `Code.gs`
2. **Cole todo o conteúdo do arquivo `Code.gs` deste repositório**
3. Salve (Ctrl+S)

### 1.3 Fazer Deploy como Web App

1. Clique em **"Implantar"** (canto superior direito)
2. Escolha **"Nova implantação"**
3. Clique no ícone ⚙️ e selecione **"Aplicativo da Web"**
4. Configure:
   - **Executar como**: Eu (sua conta)
   - **Quem tem acesso**: Qualquer pessoa *(importante para aceitar requests do GitHub)*
5. Clique em **"Implantar"**
6. **Autorize o aplicativo** quando solicitado
7. **COPIE A URL** que aparece (parecida com `https://script.google.com/macros/s/XXXXX/exec`)

---

## 🌐 Passo 2: Configurar o Frontend

### 2.1 Colar a URL do Apps Script

1. Abra o arquivo `index.html`
2. Encontre a linha (por volta da linha 900):
   ```javascript
   const APPS_SCRIPT_URL = 'COLE_AQUI_A_URL_DO_SEU_WEB_APP';
   ```
3. **Substitua** pela URL que você copiou:
   ```javascript
   const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/XXXXX/exec';
   ```
4. Salve o arquivo

### 2.2 Fazer Deploy no GitHub

1. **Crie um repositório no GitHub** (pode ser público ou privado)
   
2. **Faça o upload dos arquivos**:
   ```bash
   git init
   git add index.html
   git commit -m "Deploy inicial"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
   git push -u origin main
   ```

3. **Ative o GitHub Pages**:
   - Vá em: **Settings** > **Pages**
   - **Source**: Deploy from a branch
   - **Branch**: `main` / `root`
   - Clique em **"Save"**

4. **Acesse seu formulário**:
   - URL: `https://SEU_USUARIO.github.io/SEU_REPO/index.html`

---

## ✅ Passo 3: Testar

1. Acesse a URL do GitHub Pages
2. Preencha o formulário
3. Clique em "Salvar Registro"
4. Verifique se os dados apareceram na planilha do Google Sheets

---

## 🔧 Estrutura Final

```
GitHub Pages (Frontend)
    ↓ envia dados via fetch()
Google Apps Script (Backend - Code.gs)
    ↓ processa e salva
Google Sheets (Planilha)
```

---

## 📊 Configuração da Planilha

Certifique-se que a planilha tem estas colunas na **linha 1** (na ordem):

1. Criança/ Estudante
2. Data da NT
3. Idade
4. Identidade de Gênero
5. É PCD/tem Transtorno?
6. Raça/Cor
7. Tipo de Violência
8. Encaminhamento
9. CMEI/EMEF
10. Região
11. Responsável pelo Registro
12. fonte informadores foi a escola?
13. violência identificada pela escola ocorrida na escola
14. Algum profissional da escola foi autor da violência
15. Album estudante foi autor da violência?
16. violência identificada pela escola não ocorrida na escola
17. ocorreu na escola? 1.1
18. violência informada a escola por qualquer um dos agentes que a compõe 1.2

---

## 🆘 Problemas Comuns

### "Configure a URL do Apps Script"
- Você esqueceu de colar a URL no `index.html`
- Verifique a linha com `APPS_SCRIPT_URL`

### "Registro enviado" mas não aparece na planilha
- Verifique o ID da planilha no `Code.gs` (linha 6)
- Verifique o nome da aba no `Code.gs` (linha 9)
- Abra o Apps Script > Execuções > veja se há erros

### CORS Error
- É normal com `mode: 'no-cors'`
- O registro foi salvo mesmo assim
- Para ver erros, abra: Apps Script > Execuções

### "Acesso negado"
- No Apps Script, verifique que "Quem tem acesso" está como "Qualquer pessoa"
- Faça uma nova implantação se necessário

---

## 🔄 Atualizações

### Para atualizar o Frontend:
1. Edite o `index.html` localmente
2. `git add index.html`
3. `git commit -m "Atualização"`
4. `git push`
5. GitHub Pages atualiza automaticamente

### Para atualizar o Backend:
1. Edite o `Code.gs` no Apps Script
2. Salve (Ctrl+S)
3. **Importante**: Vá em Implantar > Gerenciar implantações > ✏️ Editar > Nova versão > Implantar

---

## 💰 Custos

- **GitHub Pages**: GRATUITO
- **Google Apps Script**: GRATUITO
- **Google Sheets**: GRATUITO

**Total: R$ 0,00** 🎉

---

## 🔐 Segurança

- A URL do Apps Script é "secreta" (difícil de adivinhar)
- Apenas quem tem a URL pode enviar dados
- Para mais segurança, adicione verificação de token no `Code.gs`

---

## 📞 Suporte

Se algo não funcionar:
1. Abra o Console do navegador (F12)
2. Vá na aba "Console" e veja os erros
3. No Apps Script, vá em "Execuções" e veja os logs

---

**Última atualização**: 28/11/2025
