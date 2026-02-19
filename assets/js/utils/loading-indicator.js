/* ============================================
   SISTEMA DE SMART LOADER (INDICADOR INTELIGENTE)
   Substitui o antigo loading estático por uma experiência
   dinâmica, contextual e profissional.
   ============================================ */

(function () {
  'use strict';

  class SmartLoader {
    constructor() {
      this.elementId = 'smart-loader-container';
      this.styleId = 'smart-loader-styles';
      this.timer = null;
      this.timeoutTimer = null;
      this.currentStateIndex = 0;

      // Estados sequenciais simulados para UX rica
      this.states = [
        'Validando credenciais...',
        'Verificando permissões de acesso...',
        'Conectando ao banco de dados...',
        'Preparando seu ambiente seguro...'
      ];

      this.injectStyles();
    }

    injectStyles() {
      if (document.getElementById(this.styleId)) return;

      const style = document.createElement('style');
      style.id = this.styleId;
      style.textContent = `
        .smart-loader-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          visibility: hidden;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .smart-loader-overlay.show {
          opacity: 1;
          visibility: visible;
        }

        .smart-loader-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: scale(0.95) translateY(10px);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .smart-loader-overlay.show .smart-loader-content {
          transform: scale(1) translateY(0);
        }

        /* Spinner Premium */
        .smart-spinner {
          width: 48px;
          height: 48px;
          border: 3px solid rgba(59, 130, 246, 0.1);
          border-left-color: #3B82F6;
          border-radius: 50%;
          animation: smart-spin 1s linear infinite;
          margin-bottom: 1.5rem;
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.2);
        }

        @keyframes smart-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Texto Dinâmico */
        .smart-text-container {
          height: 24px; /* Fixed height to prevent jumping */
          overflow: hidden;
          position: relative;
          width: 300px;
          text-align: center;
        }

        .smart-text {
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          color: #374151; /* gray-700 */
          position: absolute;
          width: 100%;
          top: 0;
          left: 0;
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.5s ease;
        }

        .smart-text.active {
          opacity: 1;
          transform: translateY(0);
        }

        .smart-text.exit {
          opacity: 0;
          transform: translateY(-10px);
        }

        /* Mensagem de Erro/Timeout */
        .smart-error-container {
          text-align: center;
          display: none;
          animation: fadeIn 0.3s ease;
        }
        
        .smart-error-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: #EF4444;
        }

        .smart-btn-retry {
          margin-top: 1rem;
          padding: 0.5rem 1.5rem;
          background-color: #fff;
          border: 1px solid #d1d5db;
          color: #374151;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }

        .smart-btn-retry:hover {
          background-color: #f9fafb;
          border-color: #9ca3af;
        }
      `;
      document.head.appendChild(style);
    }

    createDOM() {
      // Remove anterior se existir
      this.removeDOM();

      const overlay = document.createElement('div');
      overlay.id = this.elementId;
      overlay.className = 'smart-loader-overlay';
      overlay.innerHTML = `
        <div class="smart-loader-content" id="smart-loader-content">
          <div class="smart-spinner" id="smart-spinner"></div>
          
          <div class="smart-text-container" id="smart-text-container">
            <div class="smart-text active" id="smart-text-main">Iniciando...</div>
          </div>

          <div class="smart-error-container" id="smart-error-container">
            <div class="smart-error-icon">⚠️</div>
            <p class="text-gray-900 font-medium text-lg mb-1">Ops, demorou um pouco</p>
            <p class="text-gray-500 text-sm mb-4">O servidor está demorando para responder.</p>
            <button class="smart-btn-retry" onclick="window.location.reload()">Tentar novamente</button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);
      return overlay;
    }

    removeDOM() {
      const existing = document.getElementById(this.elementId);
      if (existing) existing.remove();
    }

    show(initialMessage = 'Validando credenciais...') {
      let overlay = document.getElementById(this.elementId);
      if (!overlay) {
        overlay = this.createDOM();
      }

      // Reset state
      this.currentStateIndex = 0;
      this.updateText(initialMessage);

      // Visual Reset
      document.getElementById('smart-content')?.classList.remove('hidden');
      document.getElementById('smart-error-container') && (document.getElementById('smart-error-container').style.display = 'none');
      document.getElementById('smart-spinner') && (document.getElementById('smart-spinner').style.display = 'block');
      document.getElementById('smart-text-container') && (document.getElementById('smart-text-container').style.display = 'block');

      // Show overlay
      // Pequeno delay para permitir renderização do DOM
      requestAnimationFrame(() => {
        overlay.classList.add('show');
      });

      // Start Simulation
      this.startStateSimulation();

      // Start Safety Timeout (15s)
      this.startTimeoutTimer();
    }

    hide() {
      const overlay = document.getElementById(this.elementId);
      if (!overlay) return;

      this.stopSimulation();
      this.stopTimeoutTimer();

      overlay.classList.remove('show');
      setTimeout(() => {
        this.removeDOM();
      }, 400); // Wait for transition
    }

    updateText(text) {
      const container = document.getElementById('smart-text-container');
      if (!container) return;

      const current = container.querySelector('.smart-text.active');
      if (current && current.textContent === text) return;

      // Create new text element
      const newText = document.createElement('div');
      newText.className = 'smart-text';
      newText.textContent = text;

      container.appendChild(newText);

      // Animate transition
      requestAnimationFrame(() => {
        if (current) {
          current.classList.remove('active');
          current.classList.add('exit');
        }
        newText.classList.add('active');

        // Cleanup old element
        setTimeout(() => {
          if (current) current.remove();
        }, 500);
      });
    }

    startStateSimulation() {
      this.stopSimulation();

      this.timer = setInterval(() => {
        this.currentStateIndex++;
        if (this.currentStateIndex < this.states.length) {
          this.updateText(this.states[this.currentStateIndex]);
        } else {
          // Mantém a última mensagem ou ciclo se desejar
          this.stopSimulation();
        }
      }, 2000); // Change text every 2s
    }

    stopSimulation() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }

    startTimeoutTimer() {
      this.stopTimeoutTimer();
      // 15 segundos timeout
      this.timeoutTimer = setTimeout(() => {
        this.showTimeoutError();
      }, 15000);
    }

    stopTimeoutTimer() {
      if (this.timeoutTimer) {
        clearTimeout(this.timeoutTimer);
        this.timeoutTimer = null;
      }
    }

    showTimeoutError() {
      this.stopSimulation();

      const spinner = document.getElementById('smart-spinner');
      const textContainer = document.getElementById('smart-text-container');
      const errorContainer = document.getElementById('smart-error-container');

      if (spinner) spinner.style.display = 'none';
      if (textContainer) textContainer.style.display = 'none';

      if (errorContainer) {
        errorContainer.style.display = 'block';
      }
    }
  }

  // Instância singleton
  const loader = new SmartLoader();

  // API Pública (Compatível com código antigo)
  window.loadingIndicator = {
    show: (msg) => loader.show(msg),
    hide: () => loader.hide(),
    update: (msg) => loader.updateText(msg) // Add update capability
  };

  // Funções Globais Legadas
  window.mostrarLoading = (msg) => loader.show(msg);
  window.esconderLoading = () => loader.hide();
  window.ocultarLoading = () => loader.hide();

})();
