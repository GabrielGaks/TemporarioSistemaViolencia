# ✅ Implementação Concluída - Próximos Passos Manuais

## Status da Implementação

✅ **CONCLUÍDO (Automático):**
- [x] CSS adicionado em minhas-notificacoes.html
- [x] JavaScript adicionado em minhas-notificacoes.html  
- [x] Função exibirModal() modificada
- [x] Code-Anexos.gs criado
- [x] Rotas adicionadas em Code.gs

⏳ **PENDENTE (Manual - 2 passos):**
- [ ] Passo 4: Criar tabela no Supabase
- [ ] Passo 5: Configurar permissões Apps Script

---

## 🔧 Passo 4: Criar Tabela no Supabase

### Instruções:

1. **Acessar Supabase Dashboard:**
   - Abrir [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Fazer login com sua conta

2. **Abrir SQL Editor:**
   - No menu lateral, clicar em **"SQL Editor"**
   - Ou ir diretamente: Project → SQL Editor

3. **Criar nova query:**
   - Clicar em **"+ New Query"**
   - Nomear como `criar-tabela-anexos`

4. **Copiar SQL:**
   - Abrir arquivo: `FormularioRegistroV2/docs/database/anexos-notificacoes.sql`
   - Copiar TODO o conteúdo

5. **Executar:**
   - Colar no SQL Editor
   - Clicar em **"RUN"** (ou Ctrl+Enter)
   - Aguardar "Success" aparecer

6. **Verificar criação:**
   - Ir em **"Table Editor"** (menu lateral)
   - Procurar tabela `anexos_notificacoes`
   - Deve aparecer com 12 colunas

### ✅ Pronto quando:
- Tabela aparece em Table Editor
- Colunas: id, id_notificacao, nome_arquivo_original, etc.
- Status: "Success" na query

---

## 🔑 Passo 5: Configurar Permissões Apps Script

### Instruções:

1. **Abrir Google Apps Script:**
   - Ir em [https://script.google.com](https://script.google.com)
   - Encontrar o projeto: "Sistema-NAAM" ou similar

2. **Editar appsscript.json:**
   - No editor, clicar em **"⚙️ Project Settings"**
   - Na seção "Manifest file", clicar em **"appsscript.json"**
   - Ou no painel esquerdo, clicar no ícone **"{ }"** para abrir

3. **Localizar array oauthScopes:**
   ```json
   "oauthScopes": [
     "https://www.googleapis.com/auth/spreadsheets",
     ...
   ]
   ```

4. **Garantir que existem estas permissões:**
   - Se não estiverem lá, ADICIONAR:
   ```json
   "oauthScopes": [
     "https://www.googleapis.com/auth/spreadsheets",
     "https://www.googleapis.com/auth/drive.file",
     "https://www.googleapis.com/auth/drive",
     "https://www.googleapis.com/auth/script.external_request"
   ]
   ```

5. **Salvar:**
   - Ctrl+S ou clicar "Save"

6. **Fazer novo Deploy:**
   - Clicar em **"Deploy"** (topo direita)
   - Selecionar **"New deployment"**
   - Tipo: **"Web app"**
   - Execute as:: seu email
   - Who has access: **"Only myself"**
   - Clicar **"Deploy"**

7. **Autorizar permissões:**
   - Uma janela pedindo autorização aparecerá
   - Clicar na conta Google
   - Revisar permissões
   - Clicar **"Allow"**

8. **Copiar novo URL:**
   - Após deploy, novo URL será gerado
   - **IMPORTANTE:** Atualizar este URL em `config.js`:
   ```javascript
   // Em FormularioRegistroV2/config.js
   const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/d/NOVO-ID/usercontent";
   ```
   - Pegar o ID (NOVO-ID) da URL de deploy

### ✅ Pronto quando:
- appsscript.json salvo
- Deploy criado com sucesso
- Permissões autorizadas
- URL atualizado em config.js

---

## 🧪 Testar Sistema

### Teste 1: Visualizar Anexos
1. Abrir `minhas-notificacoes.html`
2. Clicar em qualquer notificação
3. Rolar até o final do modal
4. Ver seção **"📎 Anexos"**
5. Deve mostrar:
   - "Nenhum anexo encontrado" ✅
   - Ou lista de anexos com ícones

### Teste 2: Verificar Console
1. Pressionar F12 (Developer Tools)
2. Aba **"Console"**
3. Não deve haver erros vermelhos
4. Pode haver logs como:
   - "🚀 Inicializando página..."
   - "Carregando anexos..."

### Teste 3: Verificar Network
1. Em Developer Tools, aba **"Network"**
2. Clicar em notificação
3. Ver requisição `listarAnexosNotificacao`
4. Status 200 = ✅ OK
5. Status 404/500 = ❌ Erro no backend

---

## 🚀 Ativação do Upload (Próximo Passo)

Após os testes, você pode ativar upload de arquivos adicionando em `registro-novo-caso.html`:

```html
<!-- Adicionar no formulário, antes do botão de enviar -->
<div class="campo-anexos">
  <label for="anexos">📎 Anexar Arquivos (Opcional)</label>
  <input 
    type="file" 
    id="anexos" 
    multiple 
    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
  >
  <div id="preview-anexos" class="preview-anexos"></div>
  <p class="texto-ajuda">Máximo 10MB por arquivo</p>
</div>
```

E o JavaScript:
```javascript
// Adicionar no script do formulário
document.getElementById('anexos')?.addEventListener('change', function(e) {
  criarPreviewAnexos(e.target.files, document.getElementById('preview-anexos'));
});
```

---

## 📊 Checklist Final

- [ ] **Supabase:** Tabela `anexos_notificacoes` criada
- [ ] **Apps Script:** Permissões configuradas
- [ ] **Apps Script:** Novo deploy feito
- [ ] **config.js:** URL atualizada
- [ ] **Console:** Sem erros vermelhos
- [ ] **Modal:** Seção de anexos aparece
- [ ] **Network:** Chamada `listarAnexosNotificacao` com status 200

---

## ❓ Dúvidas Frequentes

**P: Como saber se a tabela foi criada?**
R: Abrir Supabase → Table Editor → procurar `anexos_notificacoes`

**P: Qual URL copiar do Apps Script deploy?**
R: A que aparece em "Deployment ID" ou no campo "URL"

**P: Onde atualizar o config.js?**
R: Em `FormularioRegistroV2/config.js`, procurar `GOOGLE_APPS_SCRIPT_URL`

**P: E se der erro "anexos-handler.js not found"?**
R: Verificar caminho do arquivo: deve estar em `assets/js/modules/anexos-handler.js`

**P: Como saber se Apps Script autorizado?**
R: Se Console não tiver erro 403, está OK

---

## 📚 Arquivos Envolvidos

```
✅ minhas-notificacoes.html (MODIFICADO)
   ├── CSS: assets/css/anexos.css (ADICIONADO)
   └── JS: assets/js/modules/anexos-handler.js (ADICIONADO)

✅ backend/Code.gs (MODIFICADO - rotas)

⏳ backend/Code-Anexos.gs (PRONTO para Apps Script)

⏳ docs/database/anexos-notificacoes.sql (PRONTO para Supabase)

⏳ config.js (PRECISA ATUALIZAR URL)
```

---

**🎉 Quando completar os 2 passos manuais, o sistema estará 100% funcional!**
