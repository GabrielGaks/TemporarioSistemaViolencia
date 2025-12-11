# 🚀 GUIA COMPLETO - IMPLANTAR APPS SCRIPT COM JSONP

## ❌ ERRO ATUAL
```
ERRO ao carregar script
A requisição falhou completamente.
```

Este erro acontece quando o Apps Script **NÃO está acessível** publicamente.

---

## ✅ SOLUÇÃO PASSO-A-PASSO

### 📍 PASSO 1: Abrir o Apps Script
1. Acesse: https://script.google.com/
2. Localize o projeto **CASOS** (que contém as funções de registro de violência)
3. Clique para abrir

---

### 📍 PASSO 2: Atualizar o Código
1. Abra o arquivo `Code.gs` no painel esquerdo
2. **Selecione TODO o código** (Ctrl+A)
3. **Delete** (Del ou Backspace)
4. **Cole** o novo código do arquivo `Code.gs` local
5. **Salve** (Ctrl+S ou ícone disquete)

---

### 📍 PASSO 3: Implantar (CRÍTICO!)

#### Opção A: NOVA IMPLANTAÇÃO (Primeira vez)
1. Clique em **"Implantar"** (canto superior direito)
2. Selecione **"Nova implantação"**
3. Clique no ícone de **engrenagem** ⚙️
4. Selecione **"Aplicativo da Web"**
5. Configure:
   ```
   Descrição: Sistema de Registro de Violência v2.0
   Executar como: Eu (sua conta do Google)
   Quem tem acesso: Qualquer pessoa  ⬅️ IMPORTANTE!
   ```
6. Clique em **"Implantar"**
7. **Autorize** o script (pode pedir login)
8. **Copie a URL** gerada (termina com `/exec`)

#### Opção B: ATUALIZAR IMPLANTAÇÃO EXISTENTE
1. Clique em **"Implantar"** (canto superior direito)
2. Selecione **"Gerenciar implantações"**
3. Localize a implantação ativa
4. Clique no ícone de **LÁPIS** (Editar) ✏️
5. Em **"Versão"**, selecione **"Nova versão"** ⬅️ OBRIGATÓRIO!
6. Em **"Quem tem acesso"**, verifique se está **"Qualquer pessoa"**
7. Clique em **"Implantar"**

---

### 📍 PASSO 4: Verificar URL

A URL deve ter este formato:
```
https://script.google.com/macros/s/AKfycby...................../exec
                                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                      ID ÚNICO DO SEU SCRIPT
```

**IMPORTANTE:** 
- A URL **SEMPRE** termina com `/exec`
- O ID é um código longo aleatório
- A URL permanece a mesma ao atualizar versões

---

### 📍 PASSO 5: Testar Manualmente

Cole esta URL no navegador (substitua pela sua URL):
```
https://script.google.com/macros/s/SUA_URL_AQUI/exec?action=list&callback=teste
```

**RESULTADO ESPERADO:**
```javascript
teste({"success":true,"data":[...]})
```

**Se aparecer isto, está FUNCIONANDO! ✅**

**Se der erro 403, 404 ou página em branco:**
- ❌ "Quem tem acesso" está errado
- ❌ Não é um "Aplicativo da Web"
- ❌ Não autorizou o script

---

### 📍 PASSO 6: Atualizar config.js (se necessário)

Se a URL mudou, atualize o `config.js`:

```javascript
APPS_SCRIPT_CASOS: 'https://script.google.com/macros/s/SUA_NOVA_URL_AQUI/exec',
```

---

### 📍 PASSO 7: Testar no TESTE-JSONP.html

1. Abra `TESTE-JSONP.html` no navegador
2. Pressione **Ctrl+Shift+R** (limpar cache)
3. Clique em **"Testar Conexão JSONP"**
4. Verifique o resultado:
   - ✅ **VERDE:** Funcionando!
   - ❌ **VERMELHO:** Volte ao Passo 3

---

## 🔧 PROBLEMAS COMUNS

### ❌ "Erro ao carregar script"
**Causa:** "Quem tem acesso" está como "Somente eu"  
**Solução:** Altere para "Qualquer pessoa" e reimplante (Passo 3B)

### ❌ "Timeout"
**Causa:** URL incorreta ou script não implantado  
**Solução:** Verifique a URL no config.js e reimplante

### ❌ "403 Forbidden"
**Causa:** Script não autorizado ou permissões erradas  
**Solução:** Reimplante e autorize novamente (Passo 3A)

### ❌ "Ação não reconhecida"
**Causa:** Código antigo ainda está rodando  
**Solução:** Crie "Nova versão" ao reimplantar (Passo 3B)

---

## ✅ CHECKLIST FINAL

Antes de testar, confirme:

- [ ] Código do `Code.gs` atualizado com suporte JSONP
- [ ] Implantado como **"Aplicativo da Web"**
- [ ] **"Quem tem acesso"** está como **"Qualquer pessoa"**
- [ ] **"Executar como"** está como **"Eu"**
- [ ] Script foi **autorizado** (pediu login na primeira vez)
- [ ] URL termina com `/exec`
- [ ] Teste manual no navegador funciona
- [ ] `config.js` tem a URL correta
- [ ] Cache do navegador foi limpo (Ctrl+Shift+R)

---

## 📞 TESTE RÁPIDO

Cole no console do navegador (F12):

```javascript
fetch('SUA_URL_AQUI/exec?action=list')
  .then(r => r.text())
  .then(console.log)
```

Se aparecer `<!DOCTYPE html>`, o script NÃO está como "Aplicativo da Web".  
Se aparecer JSON, está CORRETO!

---

## 🎯 RESUMO

O erro **"ERRO ao carregar script"** significa que o navegador não consegue acessar o Apps Script.

**99% dos casos** é porque:
1. Não implantou como "Aplicativo da Web"
2. "Quem tem acesso" não está como "Qualquer pessoa"
3. Não criou "Nova versão" ao atualizar

Siga o **PASSO 3** com atenção especial! 🚨
