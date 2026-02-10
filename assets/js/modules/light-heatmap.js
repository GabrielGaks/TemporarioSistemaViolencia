/**
 * ======================================
 * LIGHT HEATMAP - Mapa de Calor Estilo Light Map
 * ======================================
 * 
 * Heatmap geográfico real com:
 * - Cartografia real de Vitória-ES (OpenStreetMap)
 * - Gradientes suaves estilo "light map"
 * - Totalmente responsivo ao tamanho do canvas
 * - Sem pins grandes, apenas gradientes de calor
 * - Intensidade baseada em densidade real
 */

// Estado do light heatmap
const lightHeatmapState = {
  // Leaflet map instance
  map: null,
  
  // Dados
  casesData: [],
  filteredCases: [],
  unitsData: [],
  heatmapPoints: [], // Pontos para o heatmap
  
  // Bounds geográficos de Vitória-ES
  bounds: {
    minLat: -20.35,
    maxLat: -20.25,
    minLng: -40.38,
    maxLng: -40.26
  },
  
  // Configuração do heatmap
  heatmapRadius: 50, // Raio base do heatmap (será ajustado responsivamente)
  heatmapIntensity: 0.6,
  heatmapGradient: null
};

/**
 * Inicializa o light heatmap
 */
function initializeLightHeatmap(casesData, columnNames) {
  console.log('[LightHeatmap] Inicializando com', casesData.length, 'casos');
  
  if (!casesData || casesData.length === 0) {
    console.warn('[LightHeatmap] Nenhum dado disponível');
    return;
  }
  
  lightHeatmapState.casesData = casesData;
  lightHeatmapState.filteredCases = casesData;
  
  // Processar dados de unidades
  processUnitsForHeatmap(casesData, columnNames);
  
  // Gerar pontos do heatmap
  generateHeatmapPoints();
  
  // Criar gradiente do heatmap
  createHeatmapGradient();
  
  // Inicializar mapa Leaflet
  initializeLeafletMap();
  
  console.log('[LightHeatmap] Mapa inicializado:', {
    units: lightHeatmapState.unitsData.length,
    points: lightHeatmapState.heatmapPoints.length
  });
  
  // Renderizar heatmap sobre o mapa
  renderLightHeatmap();
  updateLightHeatmapLegend();
}

/**
 * Inicializa mapa Leaflet com cartografia real
 */
function initializeLeafletMap() {
  if (lightHeatmapState.map) {
    lightHeatmapState.map.remove();
  }
  
  // Criar mapa Leaflet centrado em Vitória-ES
  lightHeatmapState.map = L.map('map', {
    center: [-20.315, -40.308], // Centro de Vitória-ES
    zoom: 12,
    zoomControl: false, // Usaremos controles customizados
    attributionControl: true
  });
  
  // Adicionar camada de tiles do OpenStreetMap (estilo escuro para light map)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(lightHeatmapState.map);
  
  // Ajustar bounds para mostrar toda a área de Vitória-ES
  const bounds = [
    [lightHeatmapState.bounds.minLat, lightHeatmapState.bounds.minLng],
    [lightHeatmapState.bounds.maxLat, lightHeatmapState.bounds.maxLng]
  ];
  
  lightHeatmapState.map.fitBounds(bounds, { padding: [20, 20] });
  
  // Event listeners para atualizar heatmap quando mapa mudar
  lightHeatmapState.map.on('moveend', () => {
    renderLightHeatmap();
  });
  
  lightHeatmapState.map.on('zoomend', () => {
    renderLightHeatmap();
  });
  
  lightHeatmapState.map.on('resize', () => {
    renderLightHeatmap();
  });
}

/**
 * Processa unidades para o heatmap
 */
function processUnitsForHeatmap(casesData, columnNames) {
  const unitsMap = new Map();
  
  casesData.forEach(row => {
    const escolaNome = row[columnNames.escola];
    if (!escolaNome) return;
    
    const key = String(escolaNome).trim().toUpperCase();
    const regiao = row[columnNames.regiao] || 'Não Informada';
    
    if (!unitsMap.has(key)) {
      const coords = generateGeographicCoordinates(escolaNome, regiao);
      
      unitsMap.set(key, {
        id: key,
        name: escolaNome,
        region: regiao,
        latitude: coords.lat,
        longitude: coords.lng,
        totalCases: 0,
        cases: []
      });
    }
    
    const unit = unitsMap.get(key);
    unit.totalCases++;
    unit.cases.push(row);
  });
  
  lightHeatmapState.unitsData = Array.from(unitsMap.values());
}

/**
 * Gera coordenadas geográficas
 */
function generateGeographicCoordinates(escolaNome, regiao) {
  // Hash para coordenadas consistentes
  const hash = escolaNome.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  // Distribuir dentro dos bounds de Vitória-ES
  const latRange = lightHeatmapState.bounds.maxLat - lightHeatmapState.bounds.minLat;
  const lngRange = lightHeatmapState.bounds.maxLng - lightHeatmapState.bounds.minLng;
  
  const latOffset = (Math.abs(hash) % 100) / 100;
  const lngOffset = ((Math.abs(hash * 2)) % 100) / 100;
  
  return {
    lat: lightHeatmapState.bounds.minLat + (latOffset * latRange * 0.9) + (latRange * 0.05),
    lng: lightHeatmapState.bounds.minLng + (lngOffset * lngRange * 0.9) + (lngRange * 0.05)
  };
}

/**
 * Gera pontos do heatmap baseados nas unidades
 */
function generateHeatmapPoints() {
  lightHeatmapState.heatmapPoints = [];
  
  lightHeatmapState.unitsData.forEach(unit => {
    const casesCount = unit.cases.filter(c => 
      lightHeatmapState.filteredCases.includes(c)
    ).length;
    
    if (casesCount > 0) {
      // Criar múltiplos pontos para gradiente suave
      const intensity = Math.min(casesCount / 10, 1.0); // Normalizar até 10 casos = intensidade máxima
      
      lightHeatmapState.heatmapPoints.push({
        x: unit.longitude,
        y: unit.latitude,
        intensity: intensity,
        cases: casesCount,
        unit: unit
      });
    }
  });
}

/**
 * Cria gradiente do heatmap (estilo light map)
 */
function createHeatmapGradient() {
  // Gradiente estilo "light map": azul escuro → azul claro → branco
  lightHeatmapState.heatmapGradient = {
    0.0: 'rgba(30, 60, 120, 0)',      // Transparente
    0.2: 'rgba(30, 60, 120, 0.1)',    // Azul muito escuro
    0.4: 'rgba(59, 130, 246, 0.3)',   // Azul médio
    0.6: 'rgba(96, 165, 250, 0.5)',   // Azul claro
    0.8: 'rgba(147, 197, 253, 0.7)',  // Azul muito claro
    1.0: 'rgba(219, 234, 254, 0.9)'   // Branco azulado (brilho)
  };
}

/**
 * Renderiza o light heatmap sobre o mapa Leaflet
 */
function renderLightHeatmap() {
  if (!lightHeatmapState.map) return;
  
  const canvas = document.getElementById('heatmapCanvas');
  if (!canvas) return;
  
  const container = document.getElementById('heatmapContainer');
  if (!container) return;
  
  const width = canvas.width = container.clientWidth;
  const height = canvas.height = container.clientHeight;
  
  const ctx = canvas.getContext('2d');
  
  // Limpar canvas
  ctx.clearRect(0, 0, width, height);
  
  // Obter zoom atual do Leaflet
  const currentZoom = lightHeatmapState.map.getZoom();
  
  // Calcular raio responsivo baseado no zoom do Leaflet
  const baseRadius = Math.min(width, height) * 0.08;
  const zoomFactor = Math.pow(2, 12 - currentZoom); // Ajustar baseado no zoom
  lightHeatmapState.heatmapRadius = Math.max(15, Math.min(150, baseRadius * zoomFactor));
  
  // Renderizar heatmap
  renderHeatmapLayer(ctx, width, height);
}

// Funções de tile removidas - agora usando Leaflet

/**
 * Renderiza camada de heatmap
 */
function renderHeatmapLayer(ctx, width, height) {
  if (lightHeatmapState.heatmapPoints.length === 0) return;
  
  // Criar imagem temporária para acumular o heatmap
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  
  // Desenhar cada ponto do heatmap
  lightHeatmapState.heatmapPoints.forEach(point => {
    const x = lngToX(point.x, width);
    const y = latToY(point.y, height);
    const radius = lightHeatmapState.heatmapRadius * (0.5 + point.intensity * 0.5);
    
    // Criar gradiente radial para cada ponto
    const gradient = tempCtx.createRadialGradient(x, y, 0, x, y, radius);
    
    // Aplicar gradiente do heatmap
    Object.keys(lightHeatmapState.heatmapGradient).forEach(stop => {
      const stopValue = parseFloat(stop);
      const color = lightHeatmapState.heatmapGradient[stop];
      // Ajustar opacidade baseado na intensidade do ponto
      const adjustedColor = adjustColorOpacity(color, point.intensity);
      gradient.addColorStop(stopValue, adjustedColor);
    });
    
    tempCtx.fillStyle = gradient;
    tempCtx.beginPath();
    tempCtx.arc(x, y, radius, 0, Math.PI * 2);
    tempCtx.fill();
  });
  
  // Aplicar composição para suavizar (screen para efeito de luz sobre mapa)
  ctx.globalCompositeOperation = 'screen';
  ctx.drawImage(tempCanvas, 0, 0);
  ctx.globalCompositeOperation = 'source-over';
  
  // Adicionar linhas conectando pontos próximos (estilo light map)
  drawConnectingLines(ctx, width, height);
}

/**
 * Ajusta opacidade da cor baseado na intensidade
 */
function adjustColorOpacity(color, intensity) {
  // Extrair valores RGB e alpha
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!match) return color;
  
  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);
  const baseAlpha = parseFloat(match[4] || '1');
  const adjustedAlpha = baseAlpha * intensity * lightHeatmapState.heatmapIntensity;
  
  return `rgba(${r}, ${g}, ${b}, ${adjustedAlpha})`;
}

/**
 * Desenha linhas conectando pontos próximos (estilo light map)
 */
function drawConnectingLines(ctx, width, height) {
  ctx.strokeStyle = 'rgba(96, 165, 250, 0.3)';
  ctx.lineWidth = 1 / lightHeatmapState.zoom;
  
  const maxDistance = lightHeatmapState.heatmapRadius * 2;
  
  for (let i = 0; i < lightHeatmapState.heatmapPoints.length; i++) {
    const point1 = lightHeatmapState.heatmapPoints[i];
    const x1 = lngToX(point1.x, width);
    const y1 = latToY(point1.y, height);
    
    for (let j = i + 1; j < lightHeatmapState.heatmapPoints.length; j++) {
      const point2 = lightHeatmapState.heatmapPoints[j];
      const x2 = lngToX(point2.x, width);
      const y2 = latToY(point2.y, height);
      
      const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      
      if (distance < maxDistance) {
        // Intensidade da linha baseada na proximidade
        const lineIntensity = 1 - (distance / maxDistance);
        ctx.strokeStyle = `rgba(96, 165, 250, ${0.2 * lineIntensity})`;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    }
  }
}

/**
 * Converte longitude para X do canvas usando Leaflet
 */
function lngToX(lng, canvasWidth) {
  if (!lightHeatmapState.map) {
    const { minLng, maxLng } = lightHeatmapState.bounds;
    const range = maxLng - minLng;
    if (range === 0) return canvasWidth / 2;
    return ((lng - minLng) / range) * canvasWidth;
  }
  
  const point = lightHeatmapState.map.latLngToContainerPoint([0, lng]);
  return point.x;
}

/**
 * Converte latitude para Y do canvas usando Leaflet
 */
function latToY(lat, canvasHeight) {
  if (!lightHeatmapState.map) {
    const { minLat, maxLat } = lightHeatmapState.bounds;
    const range = maxLat - minLat;
    if (range === 0) return canvasHeight / 2;
    return ((maxLat - lat) / range) * canvasHeight;
  }
  
  const point = lightHeatmapState.map.latLngToContainerPoint([lat, 0]);
  return point.y;
}

/**
 * Renderiza overlays do mapa
 */
function renderMapOverlays(ctx, width, height) {
  // Esta função pode ser usada para adicionar controles, labels, etc.
  // que não devem ser transformados com o zoom/pan
}

/**
 * Atualiza legenda do light heatmap
 */
function updateLightHeatmapLegend() {
  const legend = document.getElementById('heatmapLegend');
  if (!legend) return;
  
  const maxCases = Math.max(1, ...lightHeatmapState.heatmapPoints.map(p => p.cases));
  
  legend.innerHTML = `
    <div class="text-sm font-semibold mb-3 text-gray-200">💡 Mapa de Calor</div>
    <div class="text-xs text-gray-300 mb-3">Intensidade baseada em casos</div>
    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 rounded-full bg-blue-400/90 shadow-lg shadow-blue-400/50"></div>
        <span class="text-xs text-gray-300">Alta intensidade (${Math.ceil(maxCases * 0.8)}+ casos)</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 rounded-full bg-blue-500/60 shadow-lg shadow-blue-500/30"></div>
        <span class="text-xs text-gray-300">Média intensidade</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 rounded-full bg-blue-600/40 shadow-lg shadow-blue-600/20"></div>
        <span class="text-xs text-gray-300">Baixa intensidade</span>
      </div>
    </div>
    <div class="mt-3 pt-3 border-t border-gray-600 text-xs text-gray-400">
      Total: ${lightHeatmapState.filteredCases.length} casos
    </div>
  `;
}

/**
 * Atualiza dados filtrados
 */
function updateLightHeatmapFilters(filteredData) {
  lightHeatmapState.filteredCases = filteredData || [];
  
  // Recalcular pontos do heatmap
  generateHeatmapPoints();
  
  // Renderizar
  renderLightHeatmap();
  updateLightHeatmapLegend();
  updateLightHeatmapStatistics();
}

/**
 * Atualiza estatísticas
 */
function updateLightHeatmapStatistics() {
  const units = lightHeatmapState.unitsData || [];
  const filteredCases = lightHeatmapState.filteredCases || [];
  
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
 * Configura event listeners
 */
function setupLightHeatmapListeners() {
  if (!lightHeatmapState.map) return;
  
  const container = document.getElementById('heatmapContainer');
  if (!container) return;
  
  // Redimensionar canvas quando container mudar de tamanho
  const resizeObserver = new ResizeObserver(() => {
    if (lightHeatmapState.map) {
      setTimeout(() => {
        lightHeatmapState.map.invalidateSize();
        renderLightHeatmap();
      }, 100);
    }
  });
  resizeObserver.observe(container);
  
  // Botões de controle (usar métodos do Leaflet)
  document.getElementById('btnZoomIn')?.addEventListener('click', () => {
    if (lightHeatmapState.map) {
      lightHeatmapState.map.zoomIn();
    }
  });
  
  document.getElementById('btnZoomOut')?.addEventListener('click', () => {
    if (lightHeatmapState.map) {
      lightHeatmapState.map.zoomOut();
    }
  });
  
  document.getElementById('btnResetZoom')?.addEventListener('click', () => {
    if (lightHeatmapState.map) {
      const bounds = [
        [lightHeatmapState.bounds.minLat, lightHeatmapState.bounds.minLng],
        [lightHeatmapState.bounds.maxLat, lightHeatmapState.bounds.maxLng]
      ];
      lightHeatmapState.map.fitBounds(bounds, { padding: [20, 20] });
    }
  });
}

// Expor funções globalmente
window.initializeLightHeatmap = initializeLightHeatmap;
window.updateLightHeatmapFilters = updateLightHeatmapFilters;
window.setupLightHeatmapListeners = setupLightHeatmapListeners;
window.lightHeatmapState = lightHeatmapState;
