// ========================================
// DASHBOARD E ESTATÍSTICAS
// ========================================
// Arquivo separado para funcionalidades de análise e exportação
// Evita que o HTML fique muito longo e cause problemas de parsing

// ==============================
// FUNÇÕES AUXILIARES
// ==============================
function normalizeText(str) {
  if (!str) return '';
  return String(str)
    .normalize('NFD') // Normaliza caracteres Unicode (remove acentos)
    .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos (acentos)
    .toLowerCase() // Converte para minúsculas
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove caracteres invisíveis (zero-width space, etc)
    .replace(/[^a-z0-9\s\/]/g, ' ') // Remove caracteres especiais, mantém letras, números, espaços e /
    .replace(/[\s\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]+/g, ' ') // Normaliza todos os tipos de espaços (incluindo não-quebráveis) para um único espaço
    .trim(); // Remove espaços no início e fim
}

// ==============================
// EXPORTAÇÃO DE DADOS
// ==============================
function exportarCSV() {
  try {
    if (!window.filteredData || window.filteredData.length === 0) {
      alert('Não há registros filtrados para exportar.');
      return;
    }

    const headers = Object.keys(window.filteredData[0]);
    const linhas = [];
    linhas.push(headers.join(';'));

    window.filteredData.forEach(row => {
      const linha = headers.map(h => {
        let val = row[h];
        if (val === null || val === undefined) val = '';
        val = String(val).replace(/"/g, '""');
        return `"${val}"`;
      }).join(';');
      linhas.push(linha);
    });

    const csvContent = linhas.join('\r\n');
    const bom = '\uFEFF';
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `casos_violencia_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro ao exportar CSV:', error);
    alert('Erro ao exportar CSV. Verifique o console para mais detalhes.');
  }
}

function exportarExcel() {
  try {
    if (!window.filteredData || window.filteredData.length === 0) {
      alert('Não há registros filtrados para exportar.');
      return;
    }

    const headers = Object.keys(window.filteredData[0]);
    let html = '<html><head><meta charset="utf-8"></head><body><table border="1">';
    html += '<tr style="background-color: #4472C4; color: white; font-weight: bold;">';

    headers.forEach(h => {
      html += '<th style="padding: 8px; text-align: center;">' + h + '</th>';
    });
    html += '</tr>';

    window.filteredData.forEach(row => {
      html += '<tr>';
      headers.forEach(h => {
        const val = row[h] !== null && row[h] !== undefined ? String(row[h]) : '';
        html += '<td style="padding: 5px;">' + val.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</td>';
      });
      html += '</tr>';
    });

    html += '</table></body></html>';

    const bom = '\uFEFF';
    const blob = new Blob([bom + html], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `casos_violencia_${new Date().toISOString().split('T')[0]}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro ao exportar Excel:', error);
    alert('Erro ao exportar Excel. Verifique o console para mais detalhes.');
  }
}

// ========================================
// FUNÇÃO AUXILIAR: Capturar gráficos como imagens
// ========================================
function capturarGraficosComoImagens() {
  const imagens = {};
  const canvasIds = [
    'chartTipoViolencia', 'chartTipoViolenciaInstitucional', 'chartRegiao', 'chartEscola', 'chartIdade',
    'chartGenero', 'chartRaca', 'chartTemporal', 'chartEncaminhamento',
    'chartAutor', 'chartOcorreuEscola', 'chartCorrelacaoTipoIdade',
    'chartComparativoTemporal', 'chartTendenciaAnual'
  ];

  canvasIds.forEach(canvasId => {
    const canvas = document.getElementById(canvasId);
    // Verifica se o canvas existe, tem dimensões e está visível (offsetParent não é null)
    if (canvas && canvas.offsetParent !== null && canvas.width > 0 && canvas.height > 0) {
      try {
        const dataURL = canvas.toDataURL('image/png');
        imagens[canvasId] = dataURL;
      } catch (e) {
        console.warn('Não foi possível capturar gráfico:', canvasId, e);
      }
    }
  });

  return imagens;
}

// ========================================
// FUNÇÃO AUXILIAR: Coletar estatísticas do dashboard
// ========================================
function coletarEstatisticasDashboard() {
  const stats = {};

  // KPIs principais
  stats.totalCasos = document.getElementById('kpiTotalCasos')?.textContent || '0';
  stats.casosFiltrados = document.getElementById('kpiCasosFiltrados')?.textContent || '0';
  stats.percentualFiltrados = document.getElementById('kpiCasosFiltradosPercentual')?.textContent || '0%';
  stats.topEscola = document.getElementById('kpiTopEscola')?.textContent || '-';
  stats.topEscolaCasos = document.getElementById('kpiTopEscolaCasos')?.textContent || '-';
  stats.tipoFrequente = document.getElementById('kpiTipoFrequente')?.textContent || '-';
  stats.tipoFrequenteCasos = document.getElementById('kpiTipoFrequenteCasos')?.textContent || '-';

  // Estatísticas descritivas (idade)
  stats.mediaIdade = document.getElementById('statMediaIdade')?.textContent || '-';
  stats.medianaIdade = document.getElementById('statMedianaIdade')?.textContent || '-';
  stats.idadeMin = document.getElementById('statIdadeMin')?.textContent || '-';
  stats.idadeMax = document.getElementById('statIdadeMax')?.textContent || '-';
  stats.desvioPadrao = document.getElementById('statDesvioPadrao')?.textContent || '-';

  // Análise temporal
  stats.casosEsteMes = document.getElementById('statCasosEsteMes')?.textContent || '0';
  stats.casosMesAnterior = document.getElementById('statCasosMesAnterior')?.textContent || '0';
  stats.variacaoMensal = document.getElementById('statVariacaoMensal')?.textContent || '0%';

  // Top 5 Escolas - Recalcula diretamente dos dados para evitar duplicatas
  const escolaCol = window.columnNames?.escola;
  if (escolaCol && window.filteredData) {
    const dados = {};
    const mapaNormalizado = {};

    window.filteredData.forEach(row => {
      const escola = row[escolaCol];
      if (escola) {
        const original = String(escola).trim();
        const cleaned = original.replace(/[\s\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]+/g, ' ').trim();
        const norm = normalizeText(cleaned);

        if (norm) {
          dados[norm] = (dados[norm] || 0) + 1;

          if (!mapaNormalizado[norm]) {
            mapaNormalizado[norm] = cleaned;
          } else {
            const currentLength = mapaNormalizado[norm].replace(/\s+/g, '').length;
            const newLength = cleaned.replace(/\s+/g, '').length;
            if (newLength > currentLength || (newLength === currentLength && cleaned.length < mapaNormalizado[norm].length)) {
              mapaNormalizado[norm] = cleaned;
            }
          }
        }
      }
    });

    const escolasCount = Object.entries(dados)
      .map(([norm, count]) => [mapaNormalizado[norm] || norm, count])
      .sort((a, b) => {
        if (b[1] !== a[1]) return b[1] - a[1];
        return a[0].localeCompare(b[0], 'pt-BR');
      })
      .slice(0, 5);

    stats.top5Escolas = escolasCount.map(([escola, count]) => ({
      escola,
      casos: count.toString()
    }));
  } else {
    // Fallback: tenta pegar do DOM se não houver dados
    const top5Element = document.getElementById('top5Escolas');
    if (top5Element) {
      // Pega apenas os divs diretos que contêm os dados (não divs aninhados)
      const top5Items = Array.from(top5Element.children).filter(child =>
        child.tagName === 'DIV' &&
        child.querySelector('span.text-gray-700') &&
        child.querySelector('span.text-blue-600')
      );
      stats.top5Escolas = top5Items.slice(0, 5).map(item => {
        const escola = item.querySelector('span.text-gray-700')?.textContent?.trim() || '';
        const casos = item.querySelector('span.text-blue-600')?.textContent?.trim() || '';
        return { escola, casos };
      }).filter(item => item.escola && item.casos); // Remove itens vazios
    }
  }

  return stats;
}

// ========================================
// EXPORTAÇÃO DE PDF COMPLETA
// ========================================
// ========================================
// EXPORTAÇÃO DE PDF COMPLETA
// ========================================
async function exportarPDF(imagensCustomizadas = null) {
  try {
    if (!window.filteredData || window.filteredData.length === 0) {
      alert('Não há registros filtrados para exportar.');
      return;
    }

    // Verifica se html2pdf está disponível
    if (typeof html2pdf === 'undefined') {
      console.error('❌ html2pdf não está carregado!');
      alert('Erro: Biblioteca html2pdf não foi carregada. Verifique a conexão com a internet.');
      return;
    }

    console.log('✅ html2pdf disponível');

    // Mostra loading
    const loadingMsg = document.createElement('div');
    loadingMsg.id = 'pdfLoading';
    loadingMsg.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:20px;border-radius:10px;box-shadow:0 4px 6px rgba(0,0,0,0.1);z-index:10000;';
    loadingMsg.innerHTML = '<div style="text-align:center;"><div style="border:4px solid #f3f3f3;border-top:4px solid #3498db;border-radius:50%;width:40px;height:40px;animation:spin 1s linear infinite;margin:0 auto 10px;"></div><p>Gerando PDF completo...</p></div>';
    document.body.appendChild(loadingMsg);

    // Adiciona animação de spin
    const style = document.createElement('style');
    style.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
    document.head.appendChild(style);

    // Captura gráficos e estatísticas
    console.log('📸 Capturando gráficos...');

    // Se recebeu imagens customizadas (do smart export), usa elas. Senão, captura o estado atual.
    const imagensGraficos = imagensCustomizadas || capturarGraficosComoImagens();

    console.log('📊 Gráficos capturados:', Object.keys(imagensGraficos).length);

    console.log('📈 Coletando estatísticas...');
    const estatisticas = coletarEstatisticasDashboard();
    console.log('✅ Estatísticas coletadas:', estatisticas);

    const headers = Object.keys(window.filteredData[0]);
    const dataExportacao = new Date().toLocaleString('pt-BR');

    console.log('📋 Total de registros:', window.filteredData.length);
    console.log('📋 Headers:', headers.length);

    // Cria HTML para o PDF (apenas conteúdo, não documento completo)
    let html = `
  <style>
    @page {
      margin: 1.5cm;
      size: A4;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 11px;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #2563eb;
    }
    .header h1 {
      color: #1e40af;
      font-size: 24px;
      margin: 0 0 10px 0;
    }
    .header .meta {
      color: #6b7280;
      font-size: 12px;
    }
    .section {
      margin-bottom: 30px;
      page-break-inside: avoid;
    }
    .section-title {
      background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
      color: white;
      padding: 12px 20px;
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 15px;
      border-radius: 6px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin-bottom: 20px;
    }
    .stat-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 15px;
    }
    .stat-label {
      font-size: 10px;
      color: #64748b;
      margin-bottom: 5px;
      text-transform: uppercase;
      font-weight: 600;
    }
    .stat-value {
      font-size: 18px;
      font-weight: bold;
      color: #1e293b;
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 20px;
    }
    .kpi-card {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
    }
    .kpi-label {
      font-size: 10px;
      opacity: 0.9;
      margin-bottom: 8px;
    }
    .kpi-value {
      font-size: 24px;
      font-weight: bold;
    }
    .chart-container {
      margin: 20px 0;
      page-break-inside: avoid;
      text-align: center;
    }
    .chart-title {
      font-weight: bold;
      font-size: 13px;
      margin-bottom: 10px;
      color: #1e293b;
    }
    .chart-image {
      max-width: 100%;
      height: auto;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .charts-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
      font-size: 9px;
    }
    th {
      background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
      color: white;
      padding: 8px 6px;
      text-align: left;
      font-weight: 600;
      border: 1px solid #1e40af;
    }
    td {
      padding: 6px;
      border: 1px solid #e2e8f0;
      word-wrap: break-word;
    }
    tr:nth-child(even) {
      background-color: #f8fafc;
    }
    .top5-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .top5-item {
      display: flex;
      justify-content: space-between;
      padding: 8px;
      border-bottom: 1px solid #e2e8f0;
    }
    .top5-item:last-child {
      border-bottom: none;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #e2e8f0;
      text-align: center;
      color: #64748b;
      font-size: 10px;
    }
    @media print {
      .section {
        page-break-inside: avoid;
      }
      .chart-container {
        page-break-inside: avoid;
      }
    }
  </style>
  <div class="header">
    <h1>📊 Relatório Completo de Casos de Violência Escolar</h1>
    <div class="meta">
      <p><strong>Data de Exportação:</strong> ${dataExportacao}</p>
      <p><strong>Total de Registros:</strong> ${window.filteredData.length}</p>
    </div>
  </div>
  
  <!-- Seção: KPIs Principais -->
  <div class="section">
    <div class="section-title">📈 Indicadores Principais (KPIs)</div>
    <div class="kpi-grid">
      <div class="kpi-card" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);">
        <div class="kpi-label">Total de Casos</div>
        <div class="kpi-value">${estatisticas.totalCasos}</div>
      </div>
      <div class="kpi-card" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
        <div class="kpi-label">Casos Filtrados</div>
        <div class="kpi-value">${estatisticas.casosFiltrados}</div>
        <div style="font-size: 9px; opacity: 0.9; margin-top: 5px;">${estatisticas.percentualFiltrados}</div>
      </div>
      <div class="kpi-card" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);">
        <div class="kpi-label">Top Escola</div>
        <div class="kpi-value" style="font-size: 14px;">${estatisticas.topEscola}</div>
        <div style="font-size: 9px; opacity: 0.9; margin-top: 5px;">${estatisticas.topEscolaCasos}</div>
      </div>
      <div class="kpi-card" style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);">
        <div class="kpi-label">Tipo Mais Frequente</div>
        <div class="kpi-value" style="font-size: 14px;">${estatisticas.tipoFrequente}</div>
        <div style="font-size: 9px; opacity: 0.9; margin-top: 5px;">${estatisticas.tipoFrequenteCasos}</div>
      </div>
    </div>
  </div>
  
  <!-- Seção: Estatísticas Descritivas -->
  <div class="section">
    <div class="section-title">📊 Estatísticas Descritivas (Idade)</div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Média</div>
        <div class="stat-value">${estatisticas.mediaIdade}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Mediana</div>
        <div class="stat-value">${estatisticas.medianaIdade}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Idade Mínima</div>
        <div class="stat-value">${estatisticas.idadeMin}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Idade Máxima</div>
        <div class="stat-value">${estatisticas.idadeMax}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Desvio Padrão</div>
        <div class="stat-value">${estatisticas.desvioPadrao}</div>
      </div>
    </div>
  </div>
  
  <!-- Seção: Análise Temporal -->
  <div class="section">
    <div class="section-title">📅 Análise Temporal</div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Casos Este Mês</div>
        <div class="stat-value">${estatisticas.casosEsteMes}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Casos Mês Anterior</div>
        <div class="stat-value">${estatisticas.casosMesAnterior}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Variação Mensal</div>
        <div class="stat-value">${estatisticas.variacaoMensal}</div>
      </div>
    </div>
  </div>
  
  <!-- Seção: Top 5 Escolas -->
  ${estatisticas.top5Escolas && estatisticas.top5Escolas.length > 0 ? `
  <div class="section">
    <div class="section-title">🏆 Top 5 Escolas</div>
    <ul class="top5-list">
      ${estatisticas.top5Escolas.map((item, index) => `
        <li class="top5-item">
          <span><strong>${index + 1}º</strong> ${item.escola}</span>
          <strong>${item.casos}</strong>
        </li>
      `).join('')}
    </ul>
  </div>
  ` : ''}
  
  <!-- Seção: Gráficos -->
  <div class="section">
    <div class="section-title">📈 Gráficos e Visualizações</div>
    <div class="charts-grid">
      ${imagensGraficos.chartTipoViolencia ? `
        <div class="chart-container">
          <div class="chart-title">Tipos de Violência</div>
          <img src="${imagensGraficos.chartTipoViolencia}" class="chart-image" alt="Gráfico de Tipos de Violência">
        </div>
      ` : ''}
      ${imagensGraficos.chartTipoViolenciaInstitucional ? `
        <div class="chart-container">
          <div class="chart-title">🏛️ Violência Institucional</div>
          <img src="${imagensGraficos.chartTipoViolenciaInstitucional}" class="chart-image" alt="Gráfico de Violência Institucional">
        </div>
      ` : ''}
      ${imagensGraficos.chartRegiao ? `
        <div class="chart-container">
          <div class="chart-title">Casos por Região</div>
          <img src="${imagensGraficos.chartRegiao}" class="chart-image" alt="Gráfico de Regiões">
        </div>
      ` : ''}
      ${imagensGraficos.chartEscola ? `
        <div class="chart-container">
          <div class="chart-title">Top 10 Escolas</div>
          <img src="${imagensGraficos.chartEscola}" class="chart-image" alt="Gráfico de Escolas">
        </div>
      ` : ''}
      ${imagensGraficos.chartIdade ? `
        <div class="chart-container">
          <div class="chart-title">Faixa Etária</div>
          <img src="${imagensGraficos.chartIdade}" class="chart-image" alt="Gráfico de Idade">
        </div>
      ` : ''}
      ${imagensGraficos.chartGenero ? `
        <div class="chart-container">
          <div class="chart-title">Gênero (M/F)</div>
          <img src="${imagensGraficos.chartGenero}" class="chart-image" alt="Gráfico de Gênero">
        </div>
      ` : ''}
      ${imagensGraficos.chartRaca ? `
        <div class="chart-container">
          <div class="chart-title">Raça/Cor</div>
          <img src="${imagensGraficos.chartRaca}" class="chart-image" alt="Gráfico de Raça/Cor">
        </div>
      ` : ''}
      ${imagensGraficos.chartTemporal ? `
        <div class="chart-container">
          <div class="chart-title">Evolução Temporal</div>
          <img src="${imagensGraficos.chartTemporal}" class="chart-image" alt="Gráfico Temporal">
        </div>
      ` : ''}
      ${imagensGraficos.chartEncaminhamento ? `
        <div class="chart-container">
          <div class="chart-title">Encaminhamentos</div>
          <img src="${imagensGraficos.chartEncaminhamento}" class="chart-image" alt="Gráfico de Encaminhamentos">
        </div>
      ` : ''}
      ${imagensGraficos.chartAutor ? `
        <div class="chart-container">
          <div class="chart-title">Autor da Notificação</div>
          <img src="${imagensGraficos.chartAutor}" class="chart-image" alt="Gráfico de Autor">
        </div>
      ` : ''}
      ${imagensGraficos.chartOcorreuEscola ? `
        <div class="chart-container">
          <div class="chart-title">Ocorreu na Escola</div>
          <img src="${imagensGraficos.chartOcorreuEscola}" class="chart-image" alt="Gráfico de Ocorrência">
        </div>
      ` : ''}
      ${imagensGraficos.chartCorrelacaoTipoIdade ? `
        <div class="chart-container">
          <div class="chart-title">Correlação Tipo x Idade</div>
          <img src="${imagensGraficos.chartCorrelacaoTipoIdade}" class="chart-image" alt="Gráfico de Correlação">
        </div>
      ` : ''}
      ${imagensGraficos.chartComparativoTemporal ? `
        <div class="chart-container">
          <div class="chart-title">Comparativo Temporal</div>
          <img src="${imagensGraficos.chartComparativoTemporal}" class="chart-image" alt="Gráfico Comparativo">
        </div>
      ` : ''}
      ${imagensGraficos.chartTendenciaAnual ? `
        <div class="chart-container">
          <div class="chart-title">Tendência Anual</div>
          <img src="${imagensGraficos.chartTendenciaAnual}" class="chart-image" alt="Gráfico de Tendência">
        </div>
      ` : ''}
    </div>
  </div>
  
  <!-- Seção: Tabela de Dados -->
  <div class="section">
    <div class="section-title">📋 Dados Detalhados dos Registros</div>
    <table>
      <thead>
        <tr>
          ${headers.map(h => `<th>${h}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${window.filteredData.map(row => `
          <tr>
            ${headers.map(h => {
      const val = row[h] !== null && row[h] !== undefined ? String(row[h]) : '';
      return `<td>${val.replace(/</g, '&lt;').replace(/>/g, '&gt;').substring(0, 100)}</td>`;
    }).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  
  <div class="footer">
    <p>Relatório gerado automaticamente pelo Sistema de Registro de Violência Escolar</p>
    <p>${dataExportacao}</p>
  </div>
    `;

    // Usa window.print() que é mais confiável para conteúdo complexo
    console.log('🏗️ Criando janela de impressão...');
    console.log('📄 HTML criado, tamanho:', html.length, 'caracteres');

    // Extrai o conteúdo HTML (sem a tag <style>)
    const htmlContent = html.replace(/<style>[\s\S]*?<\/style>/, '');

    // Cria uma nova janela para o relatório
    const printWindow = window.open('', '_blank', 'width=1200,height=800');

    if (!printWindow) {
      alert('Por favor, permita pop-ups para gerar o PDF.');
      if (loadingMsg && loadingMsg.parentNode) {
        document.body.removeChild(loadingMsg);
      }
      if (style && style.parentNode) {
        document.head.removeChild(style);
      }
      return;
    }

    // Escreve o HTML completo na nova janela com estilos completos
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Relatório Completo - Casos de Violência Escolar</title>
        <style>
          @page {
            margin: 1.5cm;
            size: A4;
          }
          * {
            box-sizing: border-box;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 11px;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 20px;
            background-color: white;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #2563eb;
          }
          .header h1 {
            color: #1e40af;
            font-size: 24px;
            margin: 0 0 10px 0;
          }
          .header .meta {
            color: #6b7280;
            font-size: 12px;
          }
          .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
          }
          .section-title {
            background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
            color: white;
            padding: 12px 20px;
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 15px;
            border-radius: 6px;
          }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 20px;
          }
          .stat-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 15px;
          }
          .stat-label {
            font-size: 10px;
            color: #64748b;
            margin-bottom: 5px;
            text-transform: uppercase;
            font-weight: 600;
          }
          .stat-value {
            font-size: 18px;
            font-weight: bold;
            color: #1e293b;
          }
          .kpi-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-bottom: 20px;
          }
          .kpi-card {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
          }
          .kpi-label {
            font-size: 10px;
            opacity: 0.9;
            margin-bottom: 8px;
          }
          .kpi-value {
            font-size: 24px;
            font-weight: bold;
          }
          .chart-container {
            margin: 20px 0;
            page-break-inside: avoid;
            text-align: center;
          }
          .chart-title {
            font-weight: bold;
            font-size: 13px;
            margin-bottom: 10px;
            color: #1e293b;
          }
          .chart-image {
            max-width: 100%;
            height: auto;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            display: block;
            margin: 0 auto;
          }
          .charts-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            font-size: 9px;
          }
          th {
            background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
            color: white;
            padding: 8px 6px;
            text-align: left;
            font-weight: 600;
            border: 1px solid #1e40af;
          }
          td {
            padding: 6px;
            border: 1px solid #e2e8f0;
            word-wrap: break-word;
            max-width: 150px;
          }
          tr:nth-child(even) {
            background-color: #f8fafc;
          }
          .top5-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .top5-item {
            display: flex;
            justify-content: space-between;
            padding: 8px;
            border-bottom: 1px solid #e2e8f0;
          }
          .top5-item:last-child {
            border-bottom: none;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
            text-align: center;
            color: #64748b;
            font-size: 10px;
          }
          @media print {
            body {
              padding: 0;
            }
            .section {
              page-break-inside: avoid;
            }
            .chart-container {
              page-break-inside: avoid;
            }
            .kpi-grid {
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `);

    printWindow.document.close();

    // Aguarda o carregamento completo
    const waitForLoad = () => {
      return new Promise((resolve) => {
        if (printWindow.document.readyState === 'complete') {
          resolve();
        } else {
          printWindow.onload = resolve;
          // Timeout de segurança
          setTimeout(resolve, 2000);
        }
      });
    };

    await waitForLoad();

    console.log('✅ Conteúdo carregado na janela de impressão');

    // Aguarda um pouco mais para garantir que as imagens carregaram
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Remove loading
    if (loadingMsg && loadingMsg.parentNode) {
      document.body.removeChild(loadingMsg);
    }
    if (style && style.parentNode) {
      document.head.removeChild(style);
    }

    // Abre o diálogo de impressão
    printWindow.focus();
    printWindow.print();

    console.log('✅ Diálogo de impressão aberto. Use "Salvar como PDF" para gerar o arquivo.');

    // Fecha a janela após impressão (ou após 30 segundos)
    setTimeout(() => {
      if (printWindow && !printWindow.closed) {
        printWindow.close();
      }
    }, 30000);

  } catch (error) {
    console.error('Erro ao exportar PDF:', error);
    alert('Erro ao exportar PDF. Verifique o console para mais detalhes.');

    // Remove loading se ainda estiver visível
    const loading = document.getElementById('pdfLoading');
    if (loading) {
      document.body.removeChild(loading);
    }
  }
}

// ==============================
// ANÁLISE ESTATÍSTICA
// ==============================
function calcularEstatisticas() {
  try {
    if (!window.filteredData || window.filteredData.length === 0) {
      return;
    }

    if (!window.columnNames || !window.columnNames.idade) {
      return;
    }

    const idadeCol = window.columnNames.idade;
    const idades = window.filteredData
      .map(row => {
        const idade = parseInt(row[idadeCol]);
        return isNaN(idade) ? null : idade;
      })
      .filter(idade => idade !== null && idade >= 0 && idade <= 120);

    if (idades.length === 0) return;

    const idadesOrdenadas = [...idades].sort((a, b) => a - b);
    const media = idades.reduce((sum, idade) => sum + idade, 0) / idades.length;
    const mediana = idadesOrdenadas.length % 2 === 0
      ? (idadesOrdenadas[idadesOrdenadas.length / 2 - 1] + idadesOrdenadas[idadesOrdenadas.length / 2]) / 2
      : idadesOrdenadas[Math.floor(idadesOrdenadas.length / 2)];
    const min = Math.min(...idades);
    const max = Math.max(...idades);
    const variancia = idades.reduce((sum, idade) => sum + Math.pow(idade - media, 2), 0) / idades.length;
    const desvioPadrao = Math.sqrt(variancia);

    const statMedia = document.getElementById('statMediaIdade');
    const statMediana = document.getElementById('statMedianaIdade');
    const statMin = document.getElementById('statIdadeMin');
    const statMax = document.getElementById('statIdadeMax');
    const statDesvio = document.getElementById('statDesvioPadrao');

    if (statMedia) statMedia.textContent = media.toFixed(2) + ' anos';
    if (statMediana) statMediana.textContent = mediana.toFixed(2) + ' anos';
    if (statMin) statMin.textContent = min + ' anos';
    if (statMax) statMax.textContent = max + ' anos';
    if (statDesvio) statDesvio.textContent = desvioPadrao.toFixed(2) + ' anos';
  } catch (error) {
    console.error('Erro ao calcular estatísticas:', error);
  }
}

// ==============================
// ATUALIZAR KPIs DO DASHBOARD
// ==============================
function atualizarKPIs() {
  try {
    if (!window.originalData || window.originalData.length === 0) {
      return;
    }

    if (!window.columnNames) {
      return;
    }

    const escolaCol = window.columnNames.escola;
    const tipoCol = window.columnNames.tipo;
    const dataCol = window.columnNames.data || window.columnNames.dataNT;

    const totalCasos = window.originalData.length;
    const kpiTotal = document.getElementById('kpiTotalCasos');
    if (kpiTotal) kpiTotal.textContent = totalCasos.toLocaleString('pt-BR');

    const casosFiltrados = window.filteredData.length;
    const kpiFiltrados = document.getElementById('kpiCasosFiltrados');
    if (kpiFiltrados) kpiFiltrados.textContent = casosFiltrados.toLocaleString('pt-BR');
    const percentual = totalCasos > 0 ? ((casosFiltrados / totalCasos) * 100).toFixed(1) : 0;
    const kpiPercentual = document.getElementById('kpiCasosFiltradosPercentual');
    if (kpiPercentual) kpiPercentual.textContent = percentual + '% do total';

    if (escolaCol) {
      // Usa normalização para agrupar escolas com nomes similares (espaços, maiúsculas, etc)
      const dados = {};
      const mapaNormalizado = {};
      const debugMap = {}; // Para debug: mostra todas as variações agrupadas

      window.filteredData.forEach(row => {
        const escola = row[escolaCol];
        if (escola) {
          const original = String(escola).trim();
          // Remove espaços extras e caracteres invisíveis
          const cleaned = original.replace(/[\s\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]+/g, ' ').trim();
          const norm = normalizeText(cleaned);

          if (norm) {
            dados[norm] = (dados[norm] || 0) + 1;

            // Mantém o nome original mais limpo (sem espaços extras) para exibição
            if (!mapaNormalizado[norm]) {
              mapaNormalizado[norm] = cleaned;
              debugMap[norm] = [cleaned];
            } else {
              // Prefere o nome mais curto (sem espaços extras) ou mais completo se tiver mais informação
              const currentLength = mapaNormalizado[norm].replace(/\s+/g, '').length;
              const newLength = cleaned.replace(/\s+/g, '').length;

              // Se o novo nome tem mais conteúdo (ignorando espaços), usa ele
              // Caso contrário, prefere o mais curto (mais limpo)
              if (newLength > currentLength || (newLength === currentLength && cleaned.length < mapaNormalizado[norm].length)) {
                mapaNormalizado[norm] = cleaned;
              }

              // Guarda todas as variações para debug
              if (!debugMap[norm].includes(cleaned)) {
                debugMap[norm].push(cleaned);
              }
            }
          }
        }
      });

      // Log para debug (pode remover depois)
      console.log('🔍 Debug Top 5 Escolas - Agrupamentos:', debugMap);
      console.log('📊 Contagens normalizadas:', dados);

      // Converte de volta para nomes originais e ordena
      const escolasCount = Object.entries(dados)
        .map(([norm, count]) => [mapaNormalizado[norm] || norm, count])
        .sort((a, b) => {
          // Ordena por contagem (decrescente), depois por nome (alfabético)
          if (b[1] !== a[1]) return b[1] - a[1];
          return a[0].localeCompare(b[0], 'pt-BR');
        });

      console.log('✅ Top 5 Escolas final:', escolasCount.slice(0, 5));

      const topEscola = escolasCount[0];
      if (topEscola) {
        const kpiTopEscola = document.getElementById('kpiTopEscola');
        const kpiTopEscolaCasos = document.getElementById('kpiTopEscolaCasos');
        if (kpiTopEscola) kpiTopEscola.textContent = topEscola[0];
        if (kpiTopEscolaCasos) kpiTopEscolaCasos.textContent = topEscola[1] + ' casos';
      }

      const top5 = escolasCount.slice(0, 5);
      const top5Html = top5.map(([escola, count], index) => {
        return '<div class="flex items-center justify-between py-2' + (index < top5.length - 1 ? ' border-b border-gray-200' : '') + '"><div class="flex items-center gap-2"><span class="text-lg font-bold text-gray-400">' + (index + 1) + 'º</span><span class="text-gray-700 font-medium">' + escola + '</span></div><span class="text-lg font-bold text-blue-600">' + count + '</span></div>';
      }).join('');

      const top5Element = document.getElementById('top5Escolas');
      if (top5Element) {
        top5Element.innerHTML = top5Html || '<div class="text-gray-400 text-center py-4">Sem dados</div>';
      }
    }

    if (tipoCol) {
      const tiposCount = {};
      window.filteredData.forEach(row => {
        const tipos = String(row[tipoCol] || '').split(',').map(t => t.trim()).filter(t => t);
        tipos.forEach(tipo => {
          tiposCount[tipo] = (tiposCount[tipo] || 0) + 1;
        });
      });

      const topTipo = Object.entries(tiposCount).sort((a, b) => b[1] - a[1])[0];
      if (topTipo) {
        const kpiTipo = document.getElementById('kpiTipoFrequente');
        const kpiTipoCasos = document.getElementById('kpiTipoFrequenteCasos');
        if (kpiTipo) kpiTipo.textContent = topTipo[0];
        if (kpiTipoCasos) kpiTipoCasos.textContent = topTipo[1] + ' casos';
      }
    }

    if (dataCol) {
      // Função auxiliar para parsear datas do Google Sheets
      function parseDateCell(value) {
        const str = String(value || '').trim();
        if (!str) return null;

        // Formato Date(YYYY,M,D) do Google Sheets (mês já vem base-0)
        const dateMatch = str.match(/^Date\((\d{4}),(\d{1,2}),(\d{1,2})\)$/);
        if (dateMatch) {
          const ano = parseInt(dateMatch[1], 10);
          const mes = parseInt(dateMatch[2], 10); // Já está em base-0 (0=janeiro, 11=dezembro)
          const dia = parseInt(dateMatch[3], 10);
          return new Date(ano, mes, dia);
        }

        // Tenta parsear formato DD/MM/YYYY ou DD/MM/YY
        if (str.includes('/')) {
          const partes = str.split('/').map(p => parseInt(p.trim(), 10)).filter(p => !isNaN(p));
          if (partes.length === 3) {
            const dia = partes[0];
            const mes = partes[1];
            let ano = partes[2];

            // Se o ano tiver apenas 2 dígitos, assume 20XX
            if (ano < 100) {
              ano = ano < 50 ? 2000 + ano : 1900 + ano;
            }

            // Validação básica
            if (dia >= 1 && dia <= 31 && mes >= 1 && mes <= 12 && ano >= 1900 && ano <= 2100) {
              return new Date(ano, mes - 1, dia);
            }
          }
        }

        // Tenta parsear como Date ISO ou outros formatos
        const parsed = new Date(str);
        if (!isNaN(parsed.getTime())) {
          return parsed;
        }

        return null;
      }

      const agora = new Date();
      const mesAtual = agora.getMonth();
      const anoAtual = agora.getFullYear();
      const mesAnterior = mesAtual === 0 ? 11 : mesAtual - 1;
      const anoAnterior = mesAtual === 0 ? anoAtual - 1 : anoAtual;

      let casosEsteMes = 0;
      let casosMesAnterior = 0;

      window.filteredData.forEach(row => {
        const rawData = row[dataCol];
        if (!rawData) return;

        const data = parseDateCell(rawData);
        if (!data || isNaN(data.getTime())) return;

        const rowMes = data.getMonth();
        const rowAno = data.getFullYear();

        if (rowMes === mesAtual && rowAno === anoAtual) {
          casosEsteMes++;
        } else if (rowMes === mesAnterior && rowAno === anoAnterior) {
          casosMesAnterior++;
        }
      });

      const statEsteMes = document.getElementById('statCasosEsteMes');
      const statMesAnterior = document.getElementById('statCasosMesAnterior');
      if (statEsteMes) statEsteMes.textContent = casosEsteMes.toLocaleString('pt-BR');
      if (statMesAnterior) statMesAnterior.textContent = casosMesAnterior.toLocaleString('pt-BR');

      const variacao = casosMesAnterior > 0
        ? (((casosEsteMes - casosMesAnterior) / casosMesAnterior) * 100).toFixed(1)
        : casosEsteMes > 0 ? '100.0' : '0.0';

      const variacaoElement = document.getElementById('statVariacaoMensal');
      if (variacaoElement) {
        variacaoElement.textContent = (variacao > 0 ? '+' : '') + variacao + '%';
        variacaoElement.className = variacao > 0
          ? 'text-3xl font-bold text-red-600'
          : variacao < 0
            ? 'text-3xl font-bold text-green-600'
            : 'text-3xl font-bold text-gray-600';
      }
    }

    calcularEstatisticas();
  } catch (error) {
    console.error('Erro ao atualizar KPIs:', error);
  }
}

