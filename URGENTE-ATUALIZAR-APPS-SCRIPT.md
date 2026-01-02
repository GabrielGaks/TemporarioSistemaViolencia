# ⚠️ URGENTE: Atualizar Google Apps Script

## 🔴 Problema Identificado

O email está sendo enviado com o link **ERRADO**:
```
❌ https://seu-usuario.github.io/seu-repo/FormularioRegistroV2/resetar-senha.html
```

Deveria ser:
```
✅ https://gabrielgaks.github.io/sistema-registro-violencia/FormularioRegistroV2/resetar-senha.html
```

## ✅ Solução Rápida (5 minutos)

### 1️⃣ Acesse o Google Apps Script

1. Vá para: **https://script.google.com**
2. Encontre o projeto **`Sistema-Auth`** (ou o nome do seu projeto de autenticação)
3. Clique para abrir

### 2️⃣ Localize a Linha 21

Procure por esta linha no código:

```javascript
const SITE_BASE_URL = 'https://seu-usuario.github.io/seu-repo/FormularioRegistroV2';
```

### 3️⃣ Substitua por Esta Linha

**COPIE E COLE ESTA LINHA COMPLETA:**

```javascript
const SITE_BASE_URL = 'https://gabrielgaks.github.io/sistema-registro-violencia/';
```

### 4️⃣ Salve o Código

1. Clique em **💾 Salvar** (ou pressione `Ctrl+S`)
2. Aguarde a confirmação

### 5️⃣ Teste Novamente

1. Acesse: https://gabrielgaks.github.io/sistema-registro-violencia/FormularioRegistroV2/recuperar-senha.html
2. Digite um email cadastrado
3. Verifique o email recebido
4. O link deve estar correto agora!

---

## 📋 Localização Exata

A linha que precisa ser alterada está na **linha 21** do arquivo, dentro da seção:

```javascript
// ========================================
// CONFIGURAÇÕES DE EMAIL
// ========================================
// URL base do site em produção (para links de reset de senha)
// ⚠️ IMPORTANTE: Configure com a URL real do seu site
// Exemplo: 'https://seu-usuario.github.io/seu-repo/FormularioRegistroV2'
// ou 'https://seudominio.com'
const SITE_BASE_URL = 'https://gabrielgaks.github.io/sistema-registro-violencia/FormularioRegistroV2'; // ✅ CORRETO
```

---

## 🔍 Como Verificar se Está Correto

Após atualizar, você pode testar executando a função `testarEnvioEmail`:

1. No editor do Apps Script, selecione a função `testarEnvioEmail`
2. Clique em **Executar** ▶️
3. Verifique os logs - deve mostrar:
   ```
   🌐 URL Base configurada: https://gabrielgaks.github.io/sistema-registro-violencia/FormularioRegistroV2
   ```

---

## ⚡ Alternativa: Copiar Todo o Arquivo

Se preferir garantir que está tudo atualizado:

1. Abra o arquivo local: `FormularioRegistroV2/backend/Code-Supabase.gs`
2. Selecione tudo (`Ctrl+A`)
3. Copie (`Ctrl+C`)
4. No Google Apps Script, apague todo o código antigo
5. Cole o novo código (`Ctrl+V`)
6. Salve (`Ctrl+S`)

---

## ✅ Após Atualizar

- ✅ Salve o código
- ✅ Teste enviando um email de recuperação
- ✅ Verifique se o link no email está correto
- ✅ O link deve ser: `https://gabrielgaks.github.io/sistema-registro-violencia/FormularioRegistroV2/resetar-senha.html?token=...`

---

**⏰ Faça isso AGORA para que os emails funcionem corretamente!**








