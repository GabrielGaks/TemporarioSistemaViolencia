# 📋 Sistema de Registro de Casos de Violência Escolar

Sistema web moderno para registro e acompanhamento de casos de violência escolar, integrado com Google Sheets via Google Apps Script.

## 🎨 Características

- ✅ Interface moderna e responsiva (Tailwind CSS)
- ✅ Integração com Google Sheets via Apps Script
- ✅ Autocomplete inteligente para 106 escolas (CMEIs e EMEFs)
- ✅ Busca por nome completo ou sigla (ex: "ACM" encontra "Ana Chaves Mendes")
- ✅ Validação de campos em tempo real
- ✅ Dropdowns customizados com animações
- ✅ Design adaptável (mobile, tablet, desktop)
- ✅ Conversão automática de dados (S/N, siglas, datas DD/MM/YYYY)
- ✅ **Deploy gratuito** (GitHub Pages + Apps Script)
- ✅ **Sem necessidade de criar projeto no Google Cloud**

## 🚀 Deploy Rápido

### **Passo 1**: Configure o Apps Script Backend

1. Acesse https://script.google.com
2. Crie novo projeto: "Formulario-Violencia-Escolar"
3. Cole o conteúdo do arquivo `Code.gs`
4. Deploy como Web App (Executar como: Eu / Acesso: Qualquer pessoa)
5. **Copie a URL gerada** (ex: `https://script.google.com/macros/s/XXXXX/exec`)

### **Passo 2**: Configure o Frontend

1. Abra `index.html`
2. Encontre a linha (por volta da 900):
   ```javascript
   const APPS_SCRIPT_URL = 'COLE_AQUI_A_URL_DO_SEU_WEB_APP';
   ```
3. Cole a URL do Apps Script

### **Passo 3**: Deploy no GitHub Pages

1. Crie repositório no GitHub
2. Faça upload de `index.html`
3. Ative GitHub Pages (Settings > Pages > Branch: main)
4. Acesse: `https://SEU_USUARIO.github.io/SEU_REPO/`

📖 **Tutorial detalhado**: Veja [`DEPLOY-GITHUB.md`](./DEPLOY-GITHUB.md)

## 📁 Estrutura do Projeto

```
FormularioRegistroV2/
├── index.html           # Frontend (hospedado no GitHub Pages)
├── Code.gs             # Backend (hospedado no Apps Script)
├── DEPLOY-GITHUB.md    # Tutorial de deploy passo a passo
├── README.md           # Este arquivo
└── .gitignore          # Arquivos ignorados pelo Git
```

## 🏗️ Arquitetura

```
┌─────────────────────┐
│   GitHub Pages      │  ← Frontend (HTML/CSS/JS)
│   (index.html)      │
└──────────┬──────────┘
           │ fetch() POST
           ↓
┌─────────────────────┐
│  Google Apps Script │  ← Backend (Code.gs)
│     (doPost)         │
└──────────┬──────────┘
           │ appendRow()
           ↓
┌─────────────────────┐
│   Google Sheets     │  ← Banco de Dados
│   (Planilha)        │
└─────────────────────┘
```

## 📊 Formato dos Dados Salvos

Os registros são salvos na planilha com 18 colunas:

| # | Coluna | Formato | Exemplo |
|---|--------|---------|---------|
| 1 | Criança/Estudante | Texto | João Silva |
| 2 | Data da NT | DD/MM/YYYY | 28/11/2025 |
| 3 | Idade | Número | 12 |
| 4 | Identidade de Gênero | Texto | Masculino |
| 5 | PCD/Transtorno | S/N/vazio | S |
| 6 | Raça/Cor | Texto | Parda |
| 7 | Tipo de Violência | Texto | Verbal |
| 8 | Encaminhamento | Texto | Conselho Tutelar |
| 9 | CMEI/EMEF | Sigla | AMCC |
| 10 | Região | Texto | Centro |
| 11 | Responsável | Texto | Maria Santos |
| 12-18 | Perguntas (Sim/Não) | S/N/vazio | S, N, S, N, S, N, S |

## 🛠️ Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Estilização**: Tailwind CSS v3 (CDN)
- **Backend**: Google Apps Script
- **Banco de Dados**: Google Sheets
- **Hospedagem**: GitHub Pages (gratuito)

## 📱 Responsividade

O sistema é totalmente responsivo com breakpoints:

- **Mobile**: < 640px (layout empilhado, botões menores)
- **Tablet**: 640px - 768px (layout híbrido)
- **Desktop**: > 768px (layout completo lado a lado)

## 🎯 Funcionalidades

### Autocomplete Inteligente
- Busca por nome completo: "Ana Maria"
- Busca por sigla/iniciais: "ACM" encontra "Ana Maria Chaves Colares"
- 106 instituições (51 CMEIs + 55 EMEFs)

### Conversão Automática de Dados
- **Sim/Não** → **S/N** (economiza espaço na planilha)
- **Nome completo da escola** → **Sigla** (ex: CMEI Ana Maria → AMCC)
- **Data ISO** (YYYY-MM-DD) → **Data BR** (DD/MM/YYYY)

### Validação
- 8 campos obrigatórios marcados com *
- Validação em tempo real
- Mensagens de erro claras
- Destaque visual de campos não preenchidos

## 🆘 Solução de Problemas

### "Configure a URL do Apps Script Web App no código!"
- Você esqueceu de colar a URL do Web App no `index.html`
- Procure por `APPS_SCRIPT_URL` e cole a URL

### "Registro enviado" mas não aparece na planilha
- Verifique o ID da planilha no `Code.gs` (linha 6)
- Verifique o nome da aba (linha 9)
- Abra Apps Script > Execuções para ver erros

### CORS Error no Console
- É normal quando usa `mode: 'no-cors'`
- O registro foi salvo mesmo assim
- Para ver erros, acesse Apps Script > Execuções

### "Acesso negado"
- No deploy do Apps Script, certifique-se que "Quem tem acesso" está como "Qualquer pessoa"

## 🔄 Atualizações

### Atualizar Frontend:
```bash
git add index.html
git commit -m "Atualização"
git push
```
GitHub Pages atualiza automaticamente.

### Atualizar Backend:
1. Edite `Code.gs` no Apps Script
2. Salve (Ctrl+S)
3. Implantar > Gerenciar implantações > Editar > Nova versão > Implantar

## 💰 Custos

- **GitHub Pages**: ✅ GRATUITO
- **Google Apps Script**: ✅ GRATUITO  
- **Google Sheets**: ✅ GRATUITO

**Total: R$ 0,00** 🎉

## 🔐 Segurança

- A URL do Apps Script é "secreta" (hash aleatório)
- Apenas quem tem a URL pode enviar dados
- Validação de campos obrigatórios no backend
- Para mais segurança, adicione verificação de token no `Code.gs`

## 📞 Suporte

Para problemas ou dúvidas:
1. Abra o Console do navegador (F12 > Console)
2. No Apps Script, vá em "Execuções" e veja os logs
3. Consulte [`DEPLOY-GITHUB.md`](./DEPLOY-GITHUB.md)

## 📄 Licença

Este projeto é de uso interno da Secretaria Municipal de Educação de Vitória/ES.

## 🙏 Créditos

Desenvolvido para auxiliar no registro e acompanhamento de casos de violência escolar na rede municipal de ensino de Vitória/ES.

---

**Última atualização**: 28/11/2025  
**Versão**: 2.0 (GitHub Pages + Apps Script)
