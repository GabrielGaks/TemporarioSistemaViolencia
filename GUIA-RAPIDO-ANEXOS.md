# 🚀 Guia Rápido: Integração do Sistema de Anexos

## ⚡ Implementação em 5 Passos

### 1️⃣ Incluir CSS e JavaScript em minhas-notificacoes.html

**Adicionar no `<head>` (após outros CSS):**
```html
<link rel="stylesheet" href="assets/css/anexos.css">
```

**Adicionar antes do `</body>` (após outros scripts):**
```html
<script src="assets/js/modules/anexos-handler.js"></script>
```

### 2️⃣ Modificar função exibirModal()

**Localização:** Linha ~1245 em minhas-notificacoes.html

**Adicionar ao FINAL da função, antes do `}`:**
```javascript
// ADICIONAR ESTA LINHA:
carregarAnexosModal(notif.idNotificacao);
```

**Exemplo completo:**
```javascript
function exibirModal(notif) {
  // ... código existente ...
  
  modalBody.innerHTML = `
    <!-- Todo o HTML existente do modal -->
  `;
  
  // ✅ ADICIONAR ESTA LINHA AQUI:
  carregarAnexosModal(notif.idNotificacao);
}
```

### 3️⃣ Adicionar Code-Anexos.gs no Apps Script

1. Abrir [Google Apps Script](https://script.google.com)
2. Encontrar projeto do sistema
3. Criar novo arquivo: `Code-Anexos.gs`
4. Copiar conteúdo de `backend/Code-Anexos.gs`
5. Salvar

### 4️⃣ Criar Tabela no Supabase

1. Acessar [Supabase Dashboard](https://supabase.com/dashboard)
2. Ir em **SQL Editor**
3. Copiar conteúdo de `docs/database/anexos-notificacoes.sql`
4. Executar query
5. Verificar criação em **Table Editor** → `anexos_notificacoes`

### 5️⃣ Configurar Permissões no Apps Script

1. No Apps Script, clicar em **⚙️ Project Settings**
2. Editar `appsscript.json`
3. Adicionar ao array `oauthScopes`:

```json
{
  "oauthScopes": [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/script.external_request"
  ]
}
```

4. **Deploy → New Deployment** (se ainda não fez)
5. Autorizar permissões quando solicitado

---

## ✅ Pronto! Testar

1. Abrir **minhas-notificacoes.html**
2. Clicar em uma notificação
3. Ver seção "📎 Anexos" no final do modal
4. Se aparecer "Nenhum anexo encontrado" = **FUNCIONOU!** ✅

---

## 🔧 Solução de Problemas

### ❌ Erro: "anexos.css not found"
**Solução:** Verificar caminho do arquivo CSS. Deve estar em `assets/css/anexos.css`

### ❌ Erro: "carregarAnexosModal is not defined"
**Solução:** Verificar se `anexos-handler.js` foi incluído ANTES do fechamento `</body>`

### ❌ Erro: "uploadAnexo is not defined" no Apps Script
**Solução:** 
1. Verificar se Code-Anexos.gs foi adicionado
2. Fazer novo Deploy
3. Testar função `obterPastaDrive()` no editor

### ❌ Anexos não aparecem no modal
**Solução:**
1. Abrir Console (F12)
2. Ver se há erros de rede
3. Verificar se tabela `anexos_notificacoes` existe no Supabase
4. Confirmar que chamada backend está funcionando

### ❌ Erro: "Failed to execute 'postMessage'"
**Solução:** Verificar URL do Apps Script no config.js está correto

---

## 📱 Próximos Passos (Opcional)

### Adicionar Upload em Formulários

**Em registro-novo-caso.html, adicionar antes do botão submit:**

```html
<div class="campo-anexos">
  <label for="anexos">📎 Anexar Arquivos (Opcional)</label>
  <input 
    type="file" 
    id="anexos" 
    multiple 
    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
  >
  <div id="preview-anexos" class="preview-anexos"></div>
  <p class="texto-ajuda">Máximo 10MB por arquivo • PDF, Imagens, Word, Excel</p>
</div>

<script>
// Preview de arquivos
document.getElementById('anexos').addEventListener('change', function(e) {
  const preview = document.getElementById('preview-anexos');
  criarPreviewAnexos(e.target.files, preview);
});

// Modificar função de salvar para incluir upload
async function salvarRegistro() {
  // ... salvar notificação normalmente ...
  const idNotificacao = resultado.idNotificacao;
  
  // Fazer upload dos anexos
  const arquivos = document.getElementById('anexos').files;
  if (arquivos.length > 0) {
    await uploadAnexos(
      idNotificacao,
      arquivos,
      (atual, total, nome) => {
        console.log(`Uploading ${nome} (${atual}/${total})`);
      },
      (sucessos, erros, total) => {
        console.log(`Upload concluído: ${sucessos} sucessos, ${erros} erros`);
      }
    );
  }
}
</script>
```

### Adicionar Exclusão em Cascata

**Em gerenciar-casos.html, modificar função de exclusão:**

```javascript
async function excluirNotificacao(id) {
  if (!confirm('Deseja realmente excluir esta notificação e todos os seus anexos?')) {
    return;
  }
  
  try {
    // 1. Excluir anexos primeiro
    await excluirTodosAnexos(id);
    
    // 2. Excluir notificação
    await chamarBackend('delete', { idNotificacao: id });
    
    alert('✅ Notificação e anexos excluídos!');
    location.reload();
  } catch (error) {
    alert('❌ Erro: ' + error.message);
  }
}
```

---

## 📊 Métricas de Sucesso

✅ Modal abre e mostra seção de anexos
✅ Spinner de loading aparece e depois desaparece
✅ "Nenhum anexo encontrado" aparece para notificações sem anexos
✅ Console (F12) não mostra erros
✅ Botões "Ver" e "Baixar" ficam estilizados corretamente

---

## 📚 Arquivos Criados

```
FormularioRegistroV2/
├── assets/
│   ├── css/
│   │   └── anexos.css ✅ NOVO
│   └── js/
│       └── modules/
│           └── anexos-handler.js ✅ NOVO
├── backend/
│   └── Code-Anexos.gs ✅ NOVO
├── docs/
│   └── database/
│       └── anexos-notificacoes.sql ✅ NOVO
├── IMPLEMENTACAO-ANEXOS.md ✅ NOVO
└── GUIA-RAPIDO-ANEXOS.md ✅ NOVO (este arquivo)
```

---

## 🎯 Checklist Final

- [ ] anexos.css incluído no HTML
- [ ] anexos-handler.js incluído no HTML
- [ ] `carregarAnexosModal()` chamado em `exibirModal()`
- [ ] Code-Anexos.gs adicionado ao Apps Script
- [ ] Tabela criada no Supabase
- [ ] Permissões configuradas no Apps Script
- [ ] Deploy feito no Apps Script
- [ ] Testado em uma notificação existente

---

## 💡 Dicas

- **Performance:** Anexos são carregados APÓS o modal abrir (assíncrono)
- **Compressão:** Automática para todos os arquivos
- **Segurança:** Arquivos salvos como privados no Drive
- **Limite:** 10MB por arquivo (configurável em `Code-Anexos.gs`)
- **Tipos permitidos:** PDF, imagens, Word, Excel

---

## 🆘 Suporte

Se encontrar problemas:
1. Ver console do navegador (F12)
2. Ver logs do Apps Script (View → Logs)
3. Verificar se rotas foram adicionadas no Code.gs
4. Confirmar que Supabase está acessível

---

**🎉 Sistema completo e pronto para uso!**
