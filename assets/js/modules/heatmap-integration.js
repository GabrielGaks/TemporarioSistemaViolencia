/**
 * ======================================
 * INTEGRAÇÃO DO HEATMAP NO PAINEL
 * ======================================
 * 
 * Este módulo integra um mapa interativo com dados reais dos casos
 * - Sincroniza com os filtros do painel
 * - Renderiza escolas como pins no mapa
 * - Mostra intensidade de casos por localização
 * - Atualiza dinamicamente com filtros aplicados
 */

// Estado global do mapa
const heatmapState = {
  zoom: 0.6,
  pan: { x: 0, y: 0 },
  hoveredId: null,
  selectedUnitId: null,
  isDragging: false,
  dragStart: { x: 0, y: 0 },
  unitsData: [], // Dados das unidades (escolas/CMEI/EMEF)
  casesData: [], // Dados dos casos
  filteredCases: [], // Casos filtrados
  bounds: { minLat: -24, maxLat: -23, minLng: -47, maxLng: -46 }
};

/**
 * Inicializa o HeatMap com dados reais
 * @param {Array} casesData - Array de casos carregados da planilha
 * @param {Object} columnNames - Objeto com nomes de colunas mapeadas
 */
function initializeHeatmap(casesData, columnNames) {
  console.log('[HeatMap] Inicializando com', casesData.length, 'casos');
  
  if (!casesData || casesData.length === 0) {
    console.warn('[HeatMap] Nenhum dado disponível');
    return;
  }
  
  heatmapState.casesData = casesData;
  
  // Construir dados de unidades (escolas) a partir dos casos
  const unitsMap = new Map();
  
  casesData.forEach(row => {
    const escolaNome = row[columnNames.escola];
    if (!escolaNome) return;
    
    const key = String(escolaNome).trim().toUpperCase();
    
    if (!unitsMap.has(key)) {
      unitsMap.set(key, {
        id: key,
        name: escolaNome,
        region: row[columnNames.regiao] || 'Não Informada',
        category: window.getTipoInstituicao ? window.getTipoInstituicao(escolaNome) : 'Escola',
        latitude: generateLatitude(key),
        longitude: generateLongitude(key),
        totalCases: 0,
        cases: [],
        casesByType: {}
      });
    }
    
    const unit = unitsMap.get(key);
    unit.totalCases++;
    unit.cases.push(row);
    
    // Contagem por tipo de violência
    const tipo = row[columnNames.tipo] || 'Não Informado';
    unit.casesByType[tipo] = (unit.casesByType[tipo] || 0) + 1;
  });
  
  heatmapState.unitsData = Array.from(unitsMap.values());
  
  // Calcular bounds automaticamente
  if (heatmapState.unitsData.length > 0) {
    const lats = heatmapState.unitsData.map(u => u.latitude);
    const lngs = heatmapState.unitsData.map(u => u.longitude);
    
    heatmapState.bounds = {
      minLat: Math.min(...lats) - 0.05,
      maxLat: Math.max(...lats) + 0.05,
      minLng: Math.min(...lngs) - 0.05,
      maxLng: Math.max(...lngs) + 0.05
    };
  }
  
  console.log('[HeatMap] ' + heatmapState.unitsData.length + ' unidades identificadas');
  
  // Renderizar mapa
  renderHeatmapMap();
  renderHeatmapLegend();
}

/**
 * Gera latitude "fake" mas consistente baseada em hash da escola
 */
function generateLatitude(key) {
  const hash = key.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  // Intervalo realista: -23.6 a -23.5 (Vitória-ES)
  return -23.55 + (Math.abs(hash) % 100) / 1000;
}

/**
 * Gera longitude "fake" mas consistente baseada em hash da escola
 */
function generateLongitude(key) {
  const hash = key.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0) * 2;
    return a & a;
  }, 0);
  
  // Intervalo realista: -46.65 a -46.55 (Vitória-ES)
  return -46.6 + (Math.abs(hash) % 100) / 1000;
}

/**
 * Retorna cor baseada na intensidade (número de casos)
 */
function getIntensityColor(totalCases, maxCases) {
  const ratio = totalCases / Math.max(maxCases, 1);
  
  if (ratio >= 0.8) return '#dc2626'; // Crítico - vermelho
  if (ratio >= 0.6) return '#f97316'; // Alto - laranja
  if (ratio >= 0.4) return '#eab308'; // Médio - amarelo
  if (ratio >= 0.2) return '#3b82f6'; // Baixo - azul
  return '#d1d5db'; // Nenhum - cinza
}

/**
 * Retorna label de intensidade
 */
function getIntensityLabel(totalCases, maxCases) {
  const ratio = totalCases / Math.max(maxCases, 1);
  
  if (ratio >= 0.8) return 'Crítico';
  if (ratio >= 0.6) return 'Alto';
  if (ratio >= 0.4) return 'Médio';
  if (ratio >= 0.2) return 'Baixo';
  return 'Nenhum';
}

/**
 * Renderiza o mapa interativo
 */
function renderHeatmapMap() {
  const container = document.getElementById('heatmapContainer');
  if (!container) return;
  
  const canvas = container.querySelector('canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = container.clientWidth;
  const height = canvas.height = container.clientHeight;
  
  // Limpar canvas
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  
  // Desenhar background grid (opcional)
  drawGridBackground(ctx, width, height);
  
  // Calcular max casos para escala de cores
  let maxCases = 0;
  heatmapState.unitsData.forEach(unit => {
    const casesCount = unit.cases.filter(c => heatmapState.filteredCases.includes(c)).length;
    if (casesCount > maxCases) maxCases = casesCount;
  });
  
  // Desenhar unidades (pins)
  heatmapState.unitsData.forEach(unit => {
    const x = lngToX(unit.longitude, width);
    const y = latToY(unit.latitude, height);
    
    const casesCount = unit.cases.filter(c => heatmapState.filteredCases.includes(c)).length;
    
    // Desenhar pin
    drawPin(ctx, x, y, casesCount, maxCases, unit.id === heatmapState.selectedUnitId);
    
    // Desenhar label ao hover
    if (unit.id === heatmapState.hoveredId) {
      drawUnitLabel(ctx, x, y, unit, casesCount);
    }
  });
  
  // Desenhar instruções se não houver dados
  if (heatmapState.unitsData.length === 0) {
    ctx.fillStyle = '#999999';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Nenhuma escola/CMEI/EMEF encontrada', width / 2, height / 2);
  }
}

/**
 * Desenha grid de background
 */
function drawGridBackground(ctx, width, height) {
  ctx.strokeStyle = '#f0f0f0';
  ctx.lineWidth = 1;
  
  const gridSize = 50;
  
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

/**
 * Converte longitude para X do canvas
 */
function lngToX(lng, canvasWidth) {
  const { minLng, maxLng } = heatmapState.bounds;
  const range = maxLng - minLng;
  if (range === 0) return canvasWidth / 2;
  return ((lng - minLng) / range) * canvasWidth;
}

/**
 * Converte latitude para Y do canvas
 */
function latToY(lat, canvasHeight) {
  const { minLat, maxLat } = heatmapState.bounds;
  const range = maxLat - minLat;
  if (range === 0) return canvasHeight / 2;
  return ((maxLat - lat) / range) * canvasHeight;
}

/**
 * Desenha um pin no mapa
 */
function drawPin(ctx, x, y, casesCount, maxCases, isSelected) {
  const baseRadius = 8;
  const maxRadius = 24;
  const ratio = casesCount / Math.max(maxCases, 1);
  const radius = baseRadius + ratio * (maxRadius - baseRadius);
  
  const color = getIntensityColor(casesCount, maxCases);
  
  // Sombra
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.beginPath();
  ctx.arc(x + 2, y + 2, radius, 0, Math.PI * 2);
  ctx.fill();
  
  // Círculo principal
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  
  // Border
  ctx.strokeStyle = isSelected ? '#000' : '#ffffff';
  ctx.lineWidth = isSelected ? 3 : 2;
  ctx.stroke();
  
  // Número de casos
  if (casesCount > 0) {
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(casesCount, x, y);
  }
}

/**
 * Desenha label da unidade ao hover
 */
function drawUnitLabel(ctx, x, y, unit, casesCount) {
  const label = unit.name + ' (' + casesCount + ' casos)';
  
  ctx.font = '12px Arial';
  const metrics = ctx.measureText(label);
  const width = metrics.width + 16;
  const height = 28;
  
  const bgX = x - width / 2;
  const bgY = y - height - 10;
  
  // Background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.fillRect(bgX, bgY, width, height);
  
  // Texto
  ctx.fillStyle = '#ffffff';
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x, bgY + height / 2);
}

/**
 * Renderiza legenda de cores
 */
function renderHeatmapLegend() {
  const legend = document.getElementById('heatmapLegend');
  if (!legend) return;
  
  const intensidades = [
    { label: 'Crítico (80%+)', color: '#dc2626' },
    { label: 'Alto (60-80%)', color: '#f97316' },
    { label: 'Médio (40-60%)', color: '#eab308' },
    { label: 'Baixo (20-40%)', color: '#3b82f6' },
    { label: 'Nenhum (0-20%)', color: '#d1d5db' }
  ];
  
  legend.innerHTML = '<div class="text-sm font-semibold mb-3 text-gray-700">Legenda de Intensidade</div>';
  
  intensidades.forEach(item => {
    const div = document.createElement('div');
    div.className = 'flex items-center gap-2 mb-2';
    div.innerHTML = `
      <div style="width: 24px; height: 24px; border-radius: 50%; background-color: ${item.color}; border: 2px solid #fff; box-shadow: 0 0 4px rgba(0,0,0,0.2);"></div>
      <span class="text-xs text-gray-600">${item.label}</span>
    `;
    legend.appendChild(div);
  });
}

/**
 * Atualiza dados filtrados do HeatMap
 * @param {Array} filteredData - Dados filtrados
 */
function updateHeatmapFilters(filteredData) {
  heatmapState.filteredCases = filteredData || [];
  
  // Recalcular casos por unidade
  heatmapState.unitsData.forEach(unit => {
    unit.cases = heatmapState.casesData.filter(row => {
      const escola = row[window.columnNames?.escola];
      return escola && String(escola).trim().toUpperCase() === unit.id;
    });
  });
  
  console.log('[HeatMap] Filtrado para ' + filteredData.length + ' casos');
  
  renderHeatmapMap();
}

/**
 * Configura event listeners do mapa
 */
function setupHeatmapEventListeners() {
  const container = document.getElementById('heatmapContainer');
  const canvas = container?.querySelector('canvas');
  
  if (!canvas) return;
  
  // Mouse move para hover
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Detectar unit sob mouse
    let hoveredUnit = null;
    heatmapState.unitsData.forEach(unit => {
      const pinX = lngToX(unit.longitude, canvas.width);
      const pinY = latToY(unit.latitude, canvas.height);
      const distance = Math.sqrt((x - pinX) ** 2 + (y - pinY) ** 2);
      
      if (distance < 30) {
        hoveredUnit = unit.id;
      }
    });
    
    if (hoveredUnit !== heatmapState.hoveredId) {
      heatmapState.hoveredId = hoveredUnit;
      renderHeatmapMap();
      
      // Mostrar detalhes no painel lateral
      if (hoveredUnit) {
        const unit = heatmapState.unitsData.find(u => u.id === hoveredUnit);
        if (unit) {
          showUnitDetails(unit);
        }
      }
    }
  });
  
  // Click para selecionar
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    heatmapState.unitsData.forEach(unit => {
      const pinX = lngToX(unit.longitude, canvas.width);
      const pinY = latToY(unit.latitude, canvas.height);
      const distance = Math.sqrt((x - pinX) ** 2 + (y - pinY) ** 2);
      
      if (distance < 30) {
        heatmapState.selectedUnitId = heatmapState.selectedUnitId === unit.id ? null : unit.id;
        renderHeatmapMap();
        
        // Mostrar/esconder detalhes
        if (heatmapState.selectedUnitId) {
          showUnitDetails(unit);
        } else {
          hideUnitDetails();
        }
        
        // Dispara evento para sincronizar com tabela
        window.dispatchEvent(new CustomEvent('heatmapUnitSelected', { detail: { unitId: heatmapState.selectedUnitId } }));
      }
    });
  });
  
  // Zoom com wheel
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomAmount = e.deltaY > 0 ? -0.1 : 0.1;
    heatmapState.zoom = Math.max(0.3, Math.min(1.5, heatmapState.zoom + zoomAmount));
    renderHeatmapMap();
  });
  
  // Drag para pan
  canvas.addEventListener('mousedown', (e) => {
    heatmapState.isDragging = true;
    heatmapState.dragStart = { x: e.clientX, y: e.clientY };
  });
  
  canvas.addEventListener('mousemove', (e) => {
    if (!heatmapState.isDragging) return;
    
    const dx = e.clientX - heatmapState.dragStart.x;
    const dy = e.clientY - heatmapState.dragStart.y;
    
    heatmapState.pan.x += dx / canvas.width;
    heatmapState.pan.y += dy / canvas.height;
    
    heatmapState.dragStart = { x: e.clientX, y: e.clientY };
    
    renderHeatmapMap();
  });
  
  canvas.addEventListener('mouseup', () => {
    heatmapState.isDragging = false;
  });
  
  canvas.addEventListener('mouseleave', () => {
    heatmapState.isDragging = false;
    heatmapState.hoveredId = null;
    renderHeatmapMap();
  });
  
  // Botões de controle
  document.getElementById('btnZoomIn')?.addEventListener('click', () => {
    heatmapState.zoom = Math.min(1.5, heatmapState.zoom + 0.2);
    renderHeatmapMap();
  });
  
  document.getElementById('btnZoomOut')?.addEventListener('click', () => {
    heatmapState.zoom = Math.max(0.3, heatmapState.zoom - 0.2);
    renderHeatmapMap();
  });
  
  document.getElementById('btnResetZoom')?.addEventListener('click', () => {
    heatmapState.zoom = 0.6;
    heatmapState.pan = { x: 0, y: 0 };
    renderHeatmapMap();
  });
}

/**
 * Mostra detalhes da unidade no painel lateral
 */
function showUnitDetails(unit) {
  const detailsDiv = document.getElementById('heatmapUnitDetails');
  if (!detailsDiv) return;
  
  const casesCount = unit.cases.filter(c => heatmapState.filteredCases.includes(c)).length;
  
  document.getElementById('heatmapDetailName').textContent = unit.name;
  document.getElementById('heatmapDetailRegion').textContent = unit.region;
  document.getElementById('heatmapDetailType').textContent = unit.category;
  document.getElementById('heatmapDetailCount').textContent = casesCount;
  
  detailsDiv.classList.remove('hidden');
}

/**
 * Esconde detalhes da unidade
 */
function hideUnitDetails() {
  const detailsDiv = document.getElementById('heatmapUnitDetails');
  if (detailsDiv) {
    detailsDiv.classList.add('hidden');
  }
}

// Expor funções globalmente
window.initializeHeatmap = initializeHeatmap;
window.updateHeatmapFilters = updateHeatmapFilters;
window.setupHeatmapEventListeners = setupHeatmapEventListeners;
window.heatmapState = heatmapState;
