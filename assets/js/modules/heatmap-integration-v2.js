/**
 * ======================================
 * HEATMAP INTEGRATION V2 - Versão Melhorada
 * ======================================
 * 
 * Novo heatmap com melhorias:
 * - Escolas mais espaçadas
 * - Regiões englobando todas as suas escolas
 * - Zoom máximo (dezoom máximo)
 * - Infos responsivas
 * - Integração completa com filtros do sistema
 */

// Estado global do mapa
const heatmapStateV2 = {
  zoom: 0.4, // Zoom inicial menor para ver mais
  minZoom: 0.2, // Zoom mínimo (dezoom máximo)
  maxZoom: 3.0,
  pan: { x: 0, y: 0 },
  hoveredId: null,
  selectedUnitId: null,
  isDragging: false,
  dragStart: { x: 0, y: 0 },
  unitsData: [],
  casesData: [],
  filteredCases: [],
  regionsData: {},
  bounds: { minLat: -20.35, maxLat: -20.25, minLng: -40.38, maxLng: -40.26 }
};

// Dados das regiões de Vitória (baseado no novo heatmap)
const regionsData = {
  "Centro": {
    id: "centro",
    name: "Centro",
    bounds: { minLat: -20.325, maxLat: -20.315, minLng: -40.345, maxLng: -40.33 },
    color: "rgba(239, 68, 68, 0.25)"
  },
  "Santo Antônio": {
    id: "santo-antonio",
    name: "Santo Antônio",
    bounds: { minLat: -20.315, maxLat: -20.295, minLng: -40.355, maxLng: -40.34 },
    color: "rgba(249, 115, 22, 0.25)"
  },
  "Jucutuquara": {
    id: "jucutuquara",
    name: "Jucutuquara",
    bounds: { minLat: -20.31, maxLat: -20.295, minLng: -40.335, maxLng: -40.315 },
    color: "rgba(234, 179, 8, 0.25)"
  },
  "Maruípe": {
    id: "maruipe",
    name: "Maruípe",
    bounds: { minLat: -20.3, maxLat: -20.28, minLng: -40.33, maxLng: -40.3 },
    color: "rgba(34, 197, 94, 0.25)"
  },
  "São Pedro": {
    id: "sao-pedro",
    name: "São Pedro",
    bounds: { minLat: -20.335, maxLat: -20.31, minLng: -40.37, maxLng: -40.345 },
    color: "rgba(239, 68, 68, 0.3)"
  },
  "Continental": {
    id: "continental",
    name: "Continental",
    bounds: { minLat: -20.32, maxLat: -20.295, minLng: -40.345, maxLng: -40.32 },
    color: "rgba(249, 115, 22, 0.25)"
  },
  "Bento Ferreira": {
    id: "bento-ferreira",
    name: "Bento Ferreira",
    bounds: { minLat: -20.315, maxLat: -20.295, minLng: -40.32, maxLng: -40.29 },
    color: "rgba(34, 197, 94, 0.2)"
  },
  "Jardim Camburi": {
    id: "jardim-camburi",
    name: "Jardim Camburi",
    bounds: { minLat: -20.285, maxLat: -20.26, minLng: -40.3, maxLng: -40.27 },
    color: "rgba(34, 197, 94, 0.2)"
  },
  "Jardim da Penha": {
    id: "jardim-da-penha",
    name: "Jardim da Penha",
    bounds: { minLat: -20.295, maxLat: -20.275, minLng: -40.31, maxLng: -40.285 },
    color: "rgba(34, 197, 94, 0.15)"
  }
};

/**
 * Inicializa o HeatMap V2 com dados reais
 */
function initializeHeatmapV2(casesData, columnNames) {
  console.log('[HeatMap V2] Inicializando com', casesData.length, 'casos');
  
  if (!casesData || casesData.length === 0) {
    console.warn('[HeatMap V2] Nenhum dado disponível');
    return;
  }
  
  heatmapStateV2.casesData = casesData;
  heatmapStateV2.filteredCases = casesData;
  
  // Construir dados de unidades (escolas) a partir dos casos
  const unitsMap = new Map();
  
  casesData.forEach(row => {
    const escolaNome = row[columnNames.escola];
    if (!escolaNome) return;
    
    const key = String(escolaNome).trim().toUpperCase();
    const regiao = row[columnNames.regiao] || 'Não Informada';
    
    if (!unitsMap.has(key)) {
      // Gerar coordenadas mais espaçadas baseadas no nome e região
      const coords = generateSpacedCoordinates(key, regiao);
      
      unitsMap.set(key, {
        id: key,
        name: escolaNome,
        region: regiao,
        category: getTipoInstituicao(escolaNome),
        latitude: coords.lat,
        longitude: coords.lng,
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
  
  heatmapStateV2.unitsData = Array.from(unitsMap.values());
  
  // Agrupar escolas por região para calcular bounds das regiões
  groupUnitsByRegion();
  
  // Calcular bounds automaticamente com mais espaço
  if (heatmapStateV2.unitsData.length > 0) {
    const lats = heatmapStateV2.unitsData.map(u => u.latitude);
    const lngs = heatmapStateV2.unitsData.map(u => u.longitude);
    
    const latRange = Math.max(...lats) - Math.min(...lats);
    const lngRange = Math.max(...lngs) - Math.min(...lngs);
    const padding = Math.max(latRange, lngRange) * 0.15; // 15% de padding
    
    heatmapStateV2.bounds = {
      minLat: Math.min(...lats) - padding,
      maxLat: Math.max(...lats) + padding,
      minLng: Math.min(...lngs) - padding,
      maxLng: Math.max(...lngs) + padding
    };
  }
  
  console.log('[HeatMap V2]', heatmapStateV2.unitsData.length, 'unidades identificadas');
  
  // Renderizar mapa
  renderHeatmapMapV2();
  renderHeatmapLegendV2();
  updateHeatmapStatisticsV2();
}

/**
 * Gera coordenadas mais espaçadas baseadas em hash e região
 */
function generateSpacedCoordinates(key, region) {
  // Hash baseado no nome
  const nameHash = key.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  // Hash baseado na região
  const regionHash = (region || '').split('').reduce((a, b) => {
    a = ((a << 3) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  // Obter bounds da região se disponível
  const regionInfo = regionsData[region];
  if (regionInfo && regionInfo.bounds) {
    const bounds = regionInfo.bounds;
    const latRange = bounds.maxLat - bounds.minLat;
    const lngRange = bounds.maxLng - bounds.minLng;
    
    // Distribuir escolas dentro da região com mais espaço
    const latOffset = (Math.abs(nameHash) % 100) / 100;
    const lngOffset = (Math.abs(regionHash) % 100) / 100;
    
    // Adicionar espaçamento mínimo entre escolas (0.002 graus ≈ 200m)
    const spacing = 0.002;
    const latSteps = Math.floor(latRange / spacing);
    const lngSteps = Math.floor(lngRange / spacing);
    
    const latStep = Math.floor((Math.abs(nameHash) % latSteps));
    const lngStep = Math.floor((Math.abs(regionHash) % lngSteps));
    
    return {
      lat: bounds.minLat + (latStep * spacing) + (spacing / 2),
      lng: bounds.minLng + (lngStep * spacing) + (spacing / 2)
    };
  }
  
  // Fallback: coordenadas baseadas em hash com mais espaçamento
  const baseLat = -20.3;
  const baseLng = -40.32;
  const spacing = 0.003; // Espaçamento maior (300m)
  
  const latOffset = ((Math.abs(nameHash) % 30) * spacing) - (15 * spacing);
  const lngOffset = ((Math.abs(regionHash) % 30) * spacing) - (15 * spacing);
  
  return {
    lat: baseLat + latOffset,
    lng: baseLng + lngOffset
  };
}

/**
 * Agrupa unidades por região para visualização
 */
function groupUnitsByRegion() {
  heatmapStateV2.regionsData = {};
  
  heatmapStateV2.unitsData.forEach(unit => {
    const regionName = unit.region || 'Não Informada';
    if (!heatmapStateV2.regionsData[regionName]) {
      heatmapStateV2.regionsData[regionName] = {
        units: [],
        bounds: null
      };
    }
    heatmapStateV2.regionsData[regionName].units.push(unit);
  });
  
  // Calcular bounds de cada região englobando todas as escolas
  Object.keys(heatmapStateV2.regionsData).forEach(regionName => {
    const region = heatmapStateV2.regionsData[regionName];
    if (region.units.length > 0) {
      const lats = region.units.map(u => u.latitude);
      const lngs = region.units.map(u => u.longitude);
      
      const padding = 0.005; // Padding para englobar todas as escolas
      region.bounds = {
        minLat: Math.min(...lats) - padding,
        maxLat: Math.max(...lats) + padding,
        minLng: Math.min(...lngs) - padding,
        maxLng: Math.max(...lngs) + padding
      };
    }
  });
}

/**
 * Retorna tipo de instituição baseado no nome
 */
function getTipoInstituicao(nome) {
  const nomeUpper = String(nome || '').toUpperCase();
  if (nomeUpper.includes('CMEI')) return 'CMEI';
  if (nomeUpper.includes('EMEF')) return 'EMEF';
  return 'Escola';
}

/**
 * Retorna cor baseada na intensidade
 */
function getIntensityColor(totalCases, maxCases) {
  if (maxCases === 0) return '#d1d5db';
  const ratio = totalCases / maxCases;
  
  if (ratio >= 0.8) return '#dc2626'; // Crítico - vermelho
  if (ratio >= 0.6) return '#f97316'; // Alto - laranja
  if (ratio >= 0.4) return '#eab308'; // Médio - amarelo
  if (ratio >= 0.2) return '#3b82f6'; // Baixo - azul
  return '#d1d5db'; // Nenhum - cinza
}

/**
 * Renderiza o mapa interativo V2
 */
function renderHeatmapMapV2() {
  const container = document.getElementById('heatmapContainer');
  if (!container) return;
  
  const canvas = container.querySelector('canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = container.clientWidth;
  const height = canvas.height = container.clientHeight;
  
  // Limpar canvas
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, width, height);
  
  // Aplicar transformação de zoom e pan
  ctx.save();
  const centerX = width / 2;
  const centerY = height / 2;
  ctx.translate(centerX, centerY);
  ctx.scale(heatmapStateV2.zoom, heatmapStateV2.zoom);
  ctx.translate(-centerX + heatmapStateV2.pan.x, -centerY + heatmapStateV2.pan.y);
  
  // Desenhar regiões englobando todas as escolas
  drawRegions(ctx, width, height);
  
  // Desenhar background grid
  drawGridBackground(ctx, width, height);
  
  // Calcular max casos para escala de cores
  let maxCases = 0;
  heatmapStateV2.unitsData.forEach(unit => {
    const casesCount = unit.cases.filter(c => heatmapStateV2.filteredCases.includes(c)).length;
    if (casesCount > maxCases) maxCases = casesCount;
  });
  
  // Desenhar unidades (pins) com mais espaçamento
  heatmapStateV2.unitsData.forEach(unit => {
    const x = lngToX(unit.longitude, width);
    const y = latToY(unit.latitude, height);
    
    const casesCount = unit.cases.filter(c => heatmapStateV2.filteredCases.includes(c)).length;
    
    // Desenhar pin
    drawPinV2(ctx, x, y, casesCount, maxCases, unit.id === heatmapStateV2.selectedUnitId);
    
    // Desenhar label ao hover
    if (unit.id === heatmapStateV2.hoveredId) {
      drawUnitLabelV2(ctx, x, y, unit, casesCount);
    }
  });
  
  ctx.restore();
  
  // Desenhar instruções se não houver dados
  if (heatmapStateV2.unitsData.length === 0) {
    ctx.fillStyle = '#999999';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Nenhuma escola/CMEI/EMEF encontrada', width / 2, height / 2);
  }
}

/**
 * Desenha regiões englobando todas as escolas
 */
function drawRegions(ctx, width, height) {
  Object.keys(heatmapStateV2.regionsData).forEach(regionName => {
    const region = heatmapStateV2.regionsData[regionName];
    if (!region.bounds || region.units.length === 0) return;
    
    const regionInfo = regionsData[regionName];
    const color = regionInfo ? regionInfo.color : 'rgba(148, 163, 184, 0.15)';
    
    const x1 = lngToX(region.bounds.minLng, width);
    const y1 = latToY(region.bounds.maxLat, height);
    const x2 = lngToX(region.bounds.maxLng, width);
    const y2 = latToY(region.bounds.minLat, height);
    
    // Desenhar retângulo da região
    ctx.fillStyle = color;
    ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
    
    // Borda da região
    ctx.strokeStyle = color.replace('0.25', '0.6').replace('0.2', '0.5').replace('0.15', '0.4');
    ctx.lineWidth = 2;
    ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
    
    // Label da região (se zoom suficiente)
    if (heatmapStateV2.zoom >= 0.5) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.font = `${12 * heatmapStateV2.zoom}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(regionName, (x1 + x2) / 2, (y1 + y2) / 2);
    }
  });
}

/**
 * Desenha grid de background
 */
function drawGridBackground(ctx, width, height) {
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  
  const gridSize = 50 / heatmapStateV2.zoom;
  
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
  const { minLng, maxLng } = heatmapStateV2.bounds;
  const range = maxLng - minLng;
  if (range === 0) return canvasWidth / 2;
  return ((lng - minLng) / range) * canvasWidth;
}

/**
 * Converte latitude para Y do canvas
 */
function latToY(lat, canvasHeight) {
  const { minLat, maxLat } = heatmapStateV2.bounds;
  const range = maxLat - minLat;
  if (range === 0) return canvasHeight / 2;
  return ((maxLat - lat) / range) * canvasHeight;
}

/**
 * Desenha um pin no mapa V2 (com melhor visualização)
 */
function drawPinV2(ctx, x, y, casesCount, maxCases, isSelected) {
  const baseRadius = 10;
  const maxRadius = 30;
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
  ctx.lineWidth = isSelected ? 4 : 2;
  ctx.stroke();
  
  // Número de casos
  if (casesCount > 0) {
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.max(10, Math.min(14, 12 * heatmapStateV2.zoom))}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(casesCount, x, y);
  }
}

/**
 * Desenha label da unidade ao hover (responsivo)
 */
function drawUnitLabelV2(ctx, x, y, unit, casesCount) {
  const fontSize = Math.max(10, Math.min(14, 12 * heatmapStateV2.zoom));
  const label = `${unit.name} (${casesCount} casos)`;
  
  ctx.font = `${fontSize}px Arial`;
  const metrics = ctx.measureText(label);
  const width = metrics.width + 16;
  const height = 28;
  
  const bgX = x - width / 2;
  const bgY = y - height - 15;
  
  // Background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
  ctx.fillRect(bgX, bgY, width, height);
  
  // Texto
  ctx.fillStyle = '#ffffff';
  ctx.font = `${fontSize}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x, bgY + height / 2);
}

/**
 * Renderiza legenda de cores V2
 */
function renderHeatmapLegendV2() {
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
      <div style="width: 20px; height: 20px; border-radius: 50%; background-color: ${item.color}; border: 2px solid #fff; box-shadow: 0 0 4px rgba(0,0,0,0.2);"></div>
      <span class="text-xs text-gray-600">${item.label}</span>
    `;
    legend.appendChild(div);
  });
}

/**
 * Atualiza dados filtrados do HeatMap V2
 */
function updateHeatmapFiltersV2(filteredData) {
  heatmapStateV2.filteredCases = filteredData || [];
  
  // Recalcular casos por unidade
  heatmapStateV2.unitsData.forEach(unit => {
    unit.cases = heatmapStateV2.casesData.filter(row => {
      const escola = row[window.columnNames?.escola];
      return escola && String(escola).trim().toUpperCase() === unit.id;
    });
  });
  
  console.log('[HeatMap V2] Filtrado para', filteredData.length, 'casos');
  
  renderHeatmapMapV2();
  updateHeatmapStatisticsV2();
}

/**
 * Atualiza estatísticas do HeatMap V2
 */
function updateHeatmapStatisticsV2() {
  const units = heatmapStateV2.unitsData || [];
  const filteredCases = heatmapStateV2.filteredCases || [];
  
  const unitsWithCases = units.filter(unit => {
    const count = unit.cases.filter(c => filteredCases.includes(c)).length;
    return count > 0;
  });
  
  const casesCounts = units.map(unit => {
    return unit.cases.filter(c => filteredCases.includes(c)).length;
  });
  
  const maxCases = casesCounts.length > 0 ? Math.max(...casesCounts) : 0;
  const meanCases = casesCounts.length > 0 
    ? (casesCounts.reduce((a, b) => a + b, 0) / casesCounts.length).toFixed(1)
    : 0;
  
  // Atualizar elementos (responsivo)
  const statsUnits = document.getElementById('heatmapStatsUnits');
  const statsCases = document.getElementById('heatmapStatsCases');
  const statsMax = document.getElementById('heatmapStatsMax');
  const statsMean = document.getElementById('heatmapStatsMean');
  
  if (statsUnits) statsUnits.textContent = unitsWithCases.length;
  if (statsCases) statsCases.textContent = filteredCases.length;
  if (statsMax) statsMax.textContent = maxCases;
  if (statsMean) statsMean.textContent = meanCases;
}

/**
 * Configura event listeners do mapa V2
 */
function setupHeatmapEventListenersV2() {
  const container = document.getElementById('heatmapContainer');
  const canvas = container?.querySelector('canvas');
  
  if (!canvas) return;
  
  // Mouse move para hover
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Converter coordenadas do mouse para coordenadas do mapa
    const mapX = (mouseX - rect.width / 2) / heatmapStateV2.zoom - heatmapStateV2.pan.x + rect.width / 2;
    const mapY = (mouseY - rect.height / 2) / heatmapStateV2.zoom - heatmapStateV2.pan.y + rect.height / 2;
    
    // Detectar unit sob mouse
    let hoveredUnit = null;
    let minDistance = Infinity;
    
    heatmapStateV2.unitsData.forEach(unit => {
      const pinX = lngToX(unit.longitude, canvas.width);
      const pinY = latToY(unit.latitude, canvas.height);
      const distance = Math.sqrt((mapX - pinX) ** 2 + (mapY - pinY) ** 2);
      
      if (distance < 40 && distance < minDistance) {
        minDistance = distance;
        hoveredUnit = unit.id;
      }
    });
    
    if (hoveredUnit !== heatmapStateV2.hoveredId) {
      heatmapStateV2.hoveredId = hoveredUnit;
      renderHeatmapMapV2();
      
      // Mostrar detalhes no painel lateral
      if (hoveredUnit) {
        const unit = heatmapStateV2.unitsData.find(u => u.id === hoveredUnit);
        if (unit) {
          showUnitDetailsV2(unit);
        }
      } else {
        hideUnitDetailsV2();
      }
    }
  });
  
  // Click para selecionar
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Converter coordenadas do mouse para coordenadas do mapa
    const mapX = (mouseX - rect.width / 2) / heatmapStateV2.zoom - heatmapStateV2.pan.x + rect.width / 2;
    const mapY = (mouseY - rect.height / 2) / heatmapStateV2.zoom - heatmapStateV2.pan.y + rect.height / 2;
    
    let clickedUnit = null;
    let minDistance = Infinity;
    
    heatmapStateV2.unitsData.forEach(unit => {
      const pinX = lngToX(unit.longitude, canvas.width);
      const pinY = latToY(unit.latitude, canvas.height);
      const distance = Math.sqrt((mapX - pinX) ** 2 + (mapY - pinY) ** 2);
      
      if (distance < 40 && distance < minDistance) {
        minDistance = distance;
        clickedUnit = unit.id;
      }
    });
    
    if (clickedUnit) {
      heatmapStateV2.selectedUnitId = heatmapStateV2.selectedUnitId === clickedUnit ? null : clickedUnit;
      renderHeatmapMapV2();
      
      if (heatmapStateV2.selectedUnitId) {
        const unit = heatmapStateV2.unitsData.find(u => u.id === heatmapStateV2.selectedUnitId);
        if (unit) {
          showUnitDetailsV2(unit);
        }
      } else {
        hideUnitDetailsV2();
      }
      
      // Dispara evento para sincronizar com tabela
      window.dispatchEvent(new CustomEvent('heatmapUnitSelected', { 
        detail: { unitId: heatmapStateV2.selectedUnitId } 
      }));
    }
  });
  
  // Zoom com wheel
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomAmount = e.deltaY > 0 ? -0.1 : 0.1;
    heatmapStateV2.zoom = Math.max(
      heatmapStateV2.minZoom, 
      Math.min(heatmapStateV2.maxZoom, heatmapStateV2.zoom + zoomAmount)
    );
    renderHeatmapMapV2();
  });
  
  // Drag para pan
  canvas.addEventListener('mousedown', (e) => {
    if (e.button === 0) { // Botão esquerdo
      heatmapStateV2.isDragging = true;
      heatmapStateV2.dragStart = { x: e.clientX, y: e.clientY };
      canvas.style.cursor = 'grabbing';
    }
  });
  
  canvas.addEventListener('mousemove', (e) => {
    if (heatmapStateV2.isDragging) {
      const dx = e.clientX - heatmapStateV2.dragStart.x;
      const dy = e.clientY - heatmapStateV2.dragStart.y;
      
      heatmapStateV2.pan.x += dx / heatmapStateV2.zoom;
      heatmapStateV2.pan.y += dy / heatmapStateV2.zoom;
      
      heatmapStateV2.dragStart = { x: e.clientX, y: e.clientY };
      renderHeatmapMapV2();
    }
  });
  
  canvas.addEventListener('mouseup', () => {
    heatmapStateV2.isDragging = false;
    canvas.style.cursor = 'default';
  });
  
  canvas.addEventListener('mouseleave', () => {
    heatmapStateV2.isDragging = false;
    heatmapStateV2.hoveredId = null;
    canvas.style.cursor = 'default';
    renderHeatmapMapV2();
    hideUnitDetailsV2();
  });
  
  // Botões de controle
  document.getElementById('btnZoomIn')?.addEventListener('click', () => {
    heatmapStateV2.zoom = Math.min(heatmapStateV2.maxZoom, heatmapStateV2.zoom + 0.2);
    renderHeatmapMapV2();
  });
  
  document.getElementById('btnZoomOut')?.addEventListener('click', () => {
    heatmapStateV2.zoom = Math.max(heatmapStateV2.minZoom, heatmapStateV2.zoom - 0.2);
    renderHeatmapMapV2();
  });
  
  document.getElementById('btnResetZoom')?.addEventListener('click', () => {
    heatmapStateV2.zoom = 0.4;
    heatmapStateV2.pan = { x: 0, y: 0 };
    renderHeatmapMapV2();
  });
  
  // Cursor pointer ao passar sobre pins
  canvas.style.cursor = 'default';
}

/**
 * Mostra detalhes da unidade no painel lateral (responsivo)
 */
function showUnitDetailsV2(unit) {
  const detailsDiv = document.getElementById('heatmapUnitDetails');
  if (!detailsDiv) return;
  
  const casesCount = unit.cases.filter(c => heatmapStateV2.filteredCases.includes(c)).length;
  
  const nameEl = document.getElementById('heatmapDetailName');
  const regionEl = document.getElementById('heatmapDetailRegion');
  const typeEl = document.getElementById('heatmapDetailType');
  const countEl = document.getElementById('heatmapDetailCount');
  
  if (nameEl) nameEl.textContent = unit.name;
  if (regionEl) regionEl.textContent = unit.region;
  if (typeEl) typeEl.textContent = unit.category;
  if (countEl) countEl.textContent = casesCount;
  
  detailsDiv.classList.remove('hidden');
}

/**
 * Esconde detalhes da unidade
 */
function hideUnitDetailsV2() {
  const detailsDiv = document.getElementById('heatmapUnitDetails');
  if (detailsDiv) {
    detailsDiv.classList.add('hidden');
  }
}

// Expor funções globalmente
window.initializeHeatmapV2 = initializeHeatmapV2;
window.updateHeatmapFiltersV2 = updateHeatmapFiltersV2;
window.setupHeatmapEventListenersV2 = setupHeatmapEventListenersV2;
window.heatmapStateV2 = heatmapStateV2;
