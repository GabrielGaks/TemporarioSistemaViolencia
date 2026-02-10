# 📎 Implementação Completa do Sistema de Anexos

## ✅ Arquivos Já Criados

### 1. Code-Anexos.gs ✅
- Localização: `backend/Code-Anexos.gs`
- Funções implementadas:
  - `comprimirArquivo()` - Compressão automática
  - `uploadAnexo()` - Upload para Google Drive
  - `listarAnexosNotificacao()` - Listar anexos
  - `excluirAnexo()` - Excluir anexo individual
  - `excluirTodosAnexosNotificacao()` - Exclusão em cascata

### 2. Rotas no Code.gs ✅
- Adicionadas 4 novas rotas no doPost:
  - `uploadAnexo`
  - `listarAnexosNotificacao`
  - `excluirAnexo`
  - `excluirTodosAnexosNotificacao`

### 3. SQL Schema ✅
- Arquivo: `docs/database/anexos-notificacoes.sql`
- Tabela `anexos_notificacoes` com:
  - Foreign key com CASCADE delete
  - Campos de compressão
  - Google Drive integration

## ⏳ Pendente de Implementação

### 1. CSS para Anexos em minhas-notificacoes.html

**Adicionar antes de `</style>` (linha 669):**

```css
/* ========================================
   ANEXOS
   ======================================== */
.secao-anexos {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 2px solid #e5e7eb;
}

.secao-anexos-titulo {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.lista-anexos {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.anexo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.3s ease;
  animation: slideUp 0.3s ease-out;
}

.anexo-item:hover {
  background: linear-gradient(135deg, #fff 0%, #f9fafb 100%);
  border-color: #8b5cf6;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.1);
  transform: translateY(-2px);
}

.anexo-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.anexo-tipo-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.anexo-detalhes {
  flex: 1;
  min-width: 0;
}

.anexo-nome {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.anexo-metadata {
  font-size: 12px;
  color: #6b7280;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.anexo-compressao {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  color: #065f46;
  padding: 2px 8px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 11px;
}

.anexo-acoes {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.anexo-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.anexo-btn-download {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
}

.anexo-btn-download:hover {
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
  transform: translateY(-1px);
}

.anexo-btn-view {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.anexo-btn-view:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  transform: translateY(-1px);
}

.anexos-vazio {
  text-align: center;
  padding: 32px;
  color: #9ca3af;
  font-size: 14px;
}

.anexos-vazio-icon {
  font-size: 48px;
  margin-bottom: 12px;
  opacity: 0.5;
}

.anexos-loading {
  text-align: center;
  padding: 24px;
  color: #6b7280;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.anexos-loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #e5e7eb;
  border-top-color: #8b5cf6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@media (max-width: 640px) {
  .anexo-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  .anexo-acoes {
    width: 100%;
  }
  .anexo-btn {
    flex: 1;
    justify-content: center;
  }
}
```

### 2. JavaScript para Anexos em minhas-notificacoes.html

**Adicionar após a função `exibirModal()` (por volta da linha 1245):**

```javascript
// Adicionar ao final da função exibirModal, antes do fechamento }
// Carregar anexos da notificação
carregarAnexosModal(notif.idNotificacao);

// ========================================
// FUNÇÕES DE ANEXOS
// ========================================
async function carregarAnexosModal(idNotificacao) {
  const modalBody = document.getElementById('modal-body');
  
  // Adicionar seção de anexos ao final do modal
  const secaoAnexos = `
    <div class="secao-anexos">
      <div class="secao-anexos-titulo">
        <span>📎</span>
        <span>Anexos</span>
      </div>
      <div id="lista-anexos">
        <div class="anexos-loading">
          <div class="anexos-loading-spinner"></div>
          <span>Carregando anexos...</span>
        </div>
      </div>
    </div>
  `;
  
  modalBody.insertAdjacentHTML('beforeend', secaoAnexos);
  
  try {
    const resultado = await chamarBackend('listarAnexosNotificacao', {
      idNotificacao: idNotificacao
    });
    
    renderizarAnexos(resultado.anexos || []);
  } catch (error) {
    console.error('Erro ao carregar anexos:', error);
    document.getElementById('lista-anexos').innerHTML = `
      <div class="anexos-vazio">
        <div class="anexos-vazio-icon">⚠️</div>
        <div>Erro ao carregar anexos</div>
      </div>
    `;
  }
}

function renderizarAnexos(anexos) {
  const listaAnexos = document.getElementById('lista-anexos');
  
  if (!anexos || anexos.length === 0) {
    listaAnexos.innerHTML = `
      <div class="anexos-vazio">
        <div class="anexos-vazio-icon">📁</div>
        <div>Nenhum anexo encontrado</div>
      </div>
    `;
    return;
  }
  
  const htmlAnexos = anexos.map(anexo => {
    const icone = obterIconeTipoArquivo(anexo.tipo_arquivo);
    const tamanhoMB = (anexo.tamanho_comprimido / 1024 / 1024).toFixed(2);
    const compressao = anexo.taxa_compressao ? `${anexo.taxa_compressao.toFixed(1)}%` : '0%';
    
    return `
      <div class="anexo-item">
        <div class="anexo-info">
          <div class="anexo-tipo-icon">${icone}</div>
          <div class="anexo-detalhes">
            <p class="anexo-nome" title="${anexo.nome_arquivo_original}">${anexo.nome_arquivo_original}</p>
            <div class="anexo-metadata">
              <span class="anexo-metadata-item">💾 ${tamanhoMB} MB</span>
              ${anexo.taxa_compressao > 0 ? `<span class="anexo-compressao">-${compressao}</span>` : ''}
              <span class="anexo-metadata-item">📅 ${formatarDataUpload(anexo.data_upload)}</span>
            </div>
          </div>
        </div>
        <div class="anexo-acoes">
          <button class="anexo-btn anexo-btn-view" onclick="visualizarAnexo('${anexo.url_download}', '${anexo.tipo_arquivo}')">
            👁️ Ver
          </button>
          <button class="anexo-btn anexo-btn-download" onclick="baixarAnexo('${anexo.url_download}', '${anexo.nome_arquivo_original}')">
            ⬇️ Baixar
          </button>
        </div>
      </div>
    `;
  }).join('');
  
  listaAnexos.innerHTML = htmlAnexos;
}

function obterIconeTipoArquivo(tipo) {
  if (tipo.includes('pdf')) return '📄';
  if (tipo.includes('image')) return '🖼️';
  if (tipo.includes('word') || tipo.includes('document')) return '📝';
  if (tipo.includes('excel') || tipo.includes('spreadsheet')) return '📊';
  return '📎';
}

function formatarDataUpload(dataISO) {
  if (!dataISO) return 'Data não disponível';
  const data = new Date(dataISO);
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function visualizarAnexo(url, tipo) {
  window.open(url, '_blank');
}

function baixarAnexo(url, nomeArquivo) {
  const link = document.createElement('a');
  link.href = url;
  link.download = nomeArquivo;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
```

### 3. Criar Tabela no Supabase

**Executar no SQL Editor do Supabase:**

```sql
-- Ver arquivo: docs/database/anexos-notificacoes.sql
-- Copiar e executar todo o conteúdo
```

### 4. Upload de Anexos (registro-novo-caso.html)

**Adicionar campo de anexos no formulário:**

```html
<!-- Adicionar antes do botão de enviar -->
<div class="campo-anexos">
  <label for="anexos">📎 Anexar Arquivos (Opcional)</label>
  <input type="file" id="anexos" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx">
  <div id="preview-anexos" class="preview-anexos"></div>
  <p class="texto-ajuda">Máximo 10MB por arquivo • PDF, Imagens, Word, Excel</p>
</div>
```

**JavaScript para preview e upload:**

```javascript
document.getElementById('anexos').addEventListener('change', function(e) {
  const arquivos = Array.from(e.target.files);
  const preview = document.getElementById('preview-anexos');
  
  preview.innerHTML = arquivos.map(arquivo => {
    const tamanhoMB = (arquivo.size / 1024 / 1024).toFixed(2);
    const icone = arquivo.type.includes('image') ? '🖼️' : '📄';
    
    return `
      <div class="preview-item">
        <span>${icone} ${arquivo.name}</span>
        <span>${tamanhoMB} MB</span>
      </div>
    `;
  }).join('');
});

// Modificar função de salvar para incluir anexos
async function salvarComAnexos(idNotificacao, arquivos) {
  for (const arquivo of arquivos) {
    const reader = new FileReader();
    
    reader.onload = async function(e) {
      const dataBase64 = e.target.result.split(',')[1];
      
      await chamarBackend('uploadAnexo', {
        arquivo: {
          name: arquivo.name,
          mimeType: arquivo.type,
          dataBase64: dataBase64
        },
        idNotificacao: idNotificacao,
        emailUsuario: sessionStorage.getItem('userEmail')
      });
    };
    
    reader.readAsDataURL(arquivo);
  }
}
```

### 5. Exclusão em Cascata

**Modificar função de exclusão em gerenciar-casos.html:**

```javascript
async function excluirNotificacao(id) {
  if (!confirm('Deseja realmente excluir esta notificação e todos os seus anexos?')) {
    return;
  }
  
  try {
    // Excluir anexos primeiro
    await chamarBackend('excluirTodosAnexosNotificacao', {
      idNotificacao: id
    });
    
    // Depois excluir notificação
    await chamarBackend('delete', {
      idNotificacao: id
    });
    
    alert('Notificação e anexos excluídos com sucesso!');
    location.reload();
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao excluir: ' + error.message);
  }
}
```

## 🔧 Configuração Apps Script

### Adicionar permissões no appsscript.json:

```json
{
  "timeZone": "America/Sao_Paulo",
  "dependencies": {},
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "oauthScopes": [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/script.external_request"
  ]
}
```

### Deploy:
1. Copiar todo conteúdo de `Code-Anexos.gs` para o Apps Script
2. Fazer deploy como Web App
3. Autorizar permissões do Google Drive

## ✅ Checklist de Implementação

- [x] Code-Anexos.gs criado
- [x] Rotas adicionadas no Code.gs
- [x] Schema SQL criado
- [ ] CSS adicionado em minhas-notificacoes.html
- [ ] JavaScript adicionado em minhas-notificacoes.html
- [ ] Tabela criada no Supabase
- [ ] Campo de upload em registro-novo-caso.html
- [ ] Função de salvar com anexos
- [ ] Exclusão em cascata
- [ ] Permissões Apps Script configuradas
- [ ] Deploy e testes

## 🧪 Testes

1. **Upload:**
   - Testar PDF pequeno (< 1MB)
   - Testar imagem grande (> 5MB)
   - Testar múltiplos arquivos
   - Verificar compressão nos logs

2. **Visualização:**
   - Abrir modal de notificação
   - Verificar listagem de anexos
   - Testar botão "Ver"
   - Testar botão "Baixar"

3. **Exclusão:**
   - Excluir anexo individual
   - Excluir notificação com anexos
   - Verificar se arquivos foram removidos do Drive

4. **Performance:**
   - Upload de arquivo 10MB
   - Listagem com 10+ anexos
   - Compressão de PDF grande

## 📊 Métricas de Compressão Esperadas

- **PDF:** 30-70% de redução
- **Imagens:** 50-90% de redução
- **Documentos Word/Excel:** 20-50% de redução

## 🔒 Segurança

- ✅ Validação de tipos de arquivo
- ✅ Limite de 10MB por arquivo
- ✅ RLS policies no Supabase
- ✅ Arquivos privados no Drive
- ✅ URLs compartilháveis apenas com link
- ✅ Associação usuário-notificação-anexo

## 🚀 Próximos Passos

1. Implementar CSS e JavaScript no HTML
2. Criar tabela no Supabase
3. Adicionar campo de upload no formulário
4. Testar upload e visualização
5. Implementar exclusão em cascata
6. Fazer testes de carga
7. Documentar para usuários finais
