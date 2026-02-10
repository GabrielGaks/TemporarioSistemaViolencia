/* ============================================
   SISTEMA DE LOADING INDICATOR ELEGANTE
   Indicador de carregamento reutilizável com UX aprimorada
   ============================================ */

(function() {
  'use strict';

  // Função para mostrar indicador elegante
  function mostrarIndicadorCarregamentoElegante(mensagem = 'Carregando...') {
    // Remove indicador anterior se existir
    const indicadorAnterior = document.getElementById('indicadorCarregamentoElegante');
    if (indicadorAnterior) {
      indicadorAnterior.remove();
    }
    
    // Cria novo indicador elegante
    const indicador = document.createElement('div');
    indicador.id = 'indicadorCarregamentoElegante';
    indicador.className = 'indicador-carregamento-elegante';
    indicador.innerHTML = `
      <div class="indicador-overlay"></div>
      <div class="indicador-conteudo">
        <div class="indicador-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
        </div>
        <div class="indicador-texto">
          <p class="indicador-mensagem">${mensagem}</p>
          <div class="indicador-progresso">
            <div class="indicador-barra" id="indicador-barra-progresso"></div>
          </div>
          <p class="indicador-percentual" id="indicador-percentual">0%</p>
        </div>
      </div>
    `;
    document.body.appendChild(indicador);
    
    // Anima entrada
    setTimeout(() => indicador.classList.add('show'), 10);
  }
  
  // Função para atualizar indicador
  function atualizarIndicadorCarregamento(mensagem, percentual) {
    const indicador = document.getElementById('indicadorCarregamentoElegante');
    if (!indicador) return;
    
    const mensagemEl = indicador.querySelector('.indicador-mensagem');
    const barraEl = document.getElementById('indicador-barra-progresso');
    const percentualEl = document.getElementById('indicador-percentual');
    
    if (mensagemEl) mensagemEl.textContent = mensagem;
    if (barraEl) {
      barraEl.style.width = `${percentual}%`;
      barraEl.style.transition = 'width 0.3s ease';
    }
    if (percentualEl) percentualEl.textContent = `${percentual}%`;
  }
  
  // Função para ocultar indicador
  function ocultarIndicadorCarregamentoElegante() {
    const indicador = document.getElementById('indicadorCarregamentoElegante');
    if (indicador) {
      indicador.classList.remove('show');
      setTimeout(() => indicador.remove(), 300);
    }
  }

  // Exporta funções para uso global
  window.loadingIndicator = {
    show: mostrarIndicadorCarregamentoElegante,
    update: atualizarIndicadorCarregamento,
    hide: ocultarIndicadorCarregamentoElegante,
    // Aliases para compatibilidade
    mostrar: mostrarIndicadorCarregamentoElegante,
    atualizar: atualizarIndicadorCarregamento,
    ocultar: ocultarIndicadorCarregamentoElegante
  };

  // Funções globais para compatibilidade com código existente
  window.mostrarIndicadorCarregamentoElegante = mostrarIndicadorCarregamentoElegante;
  window.atualizarIndicadorCarregamento = atualizarIndicadorCarregamento;
  window.ocultarIndicadorCarregamentoElegante = ocultarIndicadorCarregamentoElegante;
  
  // Funções genéricas para substituir loadings antigos
  window.mostrarLoading = function(mensagem = 'Carregando...') {
    mostrarIndicadorCarregamentoElegante(mensagem);
  };
  
  window.esconderLoading = function() {
    ocultarIndicadorCarregamentoElegante();
  };
  
  window.ocultarLoading = function() {
    ocultarIndicadorCarregamentoElegante();
  };

})();
