# 🔧 Atualizar Link do Email no Google Apps Script

## ⚠️ Problema
O link no email ainda está usando o valor antigo: `https://seu-usuario.github.io/seu-repo/FormularioRegistroV2`

## ✅ Solução

Você precisa atualizar o código no **Google Apps Script** para usar o link correto.

### 📋 Passo a Passo

#### 1️⃣ Acesse o Google Apps Script

1. Vá para: https://script.google.com
2. Encontre o projeto **`Sistema-Auth`** (ou o nome que você deu para o projeto de autenticação)
3. Clique para abrir

#### 2️⃣ Localize a Linha do SITE_BASE_URL

1. No editor, procure pela linha:
   ```javascript
   const SITE_BASE_URL = 'https://seu-usuario.github.io/seu-repo/FormularioRegistroV2';
   ```

2. **Substitua** por:
   ```javascript
   const SITE_BASE_URL = 'https://gabrielgaks.github.io/sistema-registro-violencia/FormularioRegistroV2';
   ```

   Ou simplesmente copie e cole esta linha completa (linha 21 do arquivo):

```javascript
const SITE_BASE_URL = 'https://gabrielgaks.github.io/sistema-registro-violencia/FormularioRegistroV2'; // ✅ Configurado para GitHub Pages
```

#### 3️⃣ Salve o Código

1. Clique em **💾 Salvar** (ou pressione `Ctrl+S`)
2. Aguarde a confirmação de salvamento

#### 4️⃣ (Opcional) Faça um Novo Deploy

Se você já fez deploy anteriormente, pode ser necessário fazer um novo deploy:

1. Vá em **Implantar** → **Gerenciar implantações**
2. Clique nos **3 pontinhos** (⋮) ao lado da implantação atual
3. Selecione **Editar**
4. Clique em **Implantar**

**OU** simplesmente salve o código (o deploy existente já usará o código atualizado).

#### 5️⃣ Teste

1. Acesse: https://gabrielgaks.github.io/sistema-registro-violencia/FormularioRegistroV2/recuperar-senha.html
2. Digite um email cadastrado
3. Verifique o email recebido
4. O link deve ser: `https://gabrielgaks.github.io/sistema-registro-violencia/FormularioRegistroV2/resetar-senha.html?token=...`

---

## 🔍 Verificação Rápida

Para verificar se está correto, você pode executar a função de teste no Apps Script:

1. No editor do Apps Script, selecione a função `testarEnvioEmail`
2. Clique em **Executar** ▶️
3. Verifique os logs - deve mostrar:
   ```
   🌐 URL Base configurada: https://gabrielgaks.github.io/sistema-registro-violencia/FormularioRegistroV2
   ```

---

## 📝 Localização Exata no Código

A linha que precisa ser alterada está aproximadamente na **linha 21** do arquivo `Code-Supabase.gs`:

```javascript
// ========================================
// CONFIGURAÇÕES DE EMAIL
// ========================================
// URL base do site em produção (para links de reset de senha)
// ⚠️ IMPORTANTE: Configure com a URL real do seu site
// Exemplo: 'https://seu-usuario.github.io/seu-repo/FormularioRegistroV2'
// ou 'https://seudominio.com'
const SITE_BASE_URL = 'https://gabrielgaks.github.io/sistema-registro-violencia/FormularioRegistroV2'; // ✅ Configurado para GitHub Pages
```

---

## ✅ Após Atualizar

Após fazer a alteração:
- ✅ Salve o código
- ✅ Teste enviando um email de recuperação
- ✅ Verifique se o link no email está correto

---

**💡 Dica:** Você pode copiar todo o conteúdo do arquivo `backend/Code-Supabase.gs` local e colar no Google Apps Script para garantir que está tudo atualizado!

