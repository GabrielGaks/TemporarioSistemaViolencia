/**
 * ========================================
 * UPDATE NOTIFICATION - Componente de Notificação
 * ========================================
 * Notificação não intrusiva no canto da tela
 * ========================================
 */

(function() {
  'use strict';

  let notificationElement = null;
  let updateCallback = null;
  let autoDismissTimer = null;
  let isVisible = false;

  // Configurações padrão
  const defaultConfig = {
    autoDismiss: 10000, // 10 segundos
    position: 'top-right', // top-right, top-left, bottom-right, bottom-left
    animation: 'slide' // slide, fade
  };

  let config = { ...defaultConfig };

  /**
   * Obtém configuração do CONFIG global ou usa padrão
   */
  function getConfig() {
    if (typeof window !== 'undefined' && window.CONFIG) {
      return {
        autoDismiss: window.CONFIG.NOTIFICATION_AUTO_DISMISS || defaultConfig.autoDismiss,
        position: defaultConfig.position,
        animation: defaultConfig.animation
      };
    }
    return defaultConfig;
  }

  /**
   * Cria elemento de notificação
   */
  function createNotificationElement() {
    if (notificationElement) {
      return notificationElement;
    }

    config = getConfig();

    notificationElement = document.createElement('div');
    notificationElement.id = 'update-notification';
    notificationElement.className = 'update-notification';
    notificationElement.setAttribute('role', 'alert');
    notificationElement.setAttribute('aria-live', 'polite');

    // Posicionamento
    const positionClass = `update-notification--${config.position}`;
    notificationElement.classList.add(positionClass);

    notificationElement.innerHTML = `
      <div class="update-notification__content">
        <div class="update-notification__icon">🔄</div>
        <div class="update-notification__message">
          <div class="update-notification__title">Banco de dados atualizado</div>
          <div class="update-notification__text">Existem novas notificações disponíveis.</div>
        </div>
        <button class="update-notification__close" aria-label="Fechar" onclick="window.UpdateNotification.hide()">
          <span>×</span>
        </button>
      </div>
      <div class="update-notification__actions">
        <button class="update-notification__btn update-notification__btn--primary" onclick="window.UpdateNotification.updateNow()">
          Atualizar Agora
        </button>
        <button class="update-notification__btn update-notification__btn--secondary" onclick="window.UpdateNotification.hide()">
          Mais Tarde
        </button>
      </div>
    `;

    // Adiciona ao body
    if (document.body) {
      document.body.appendChild(notificationElement);
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        document.body.appendChild(notificationElement);
      });
    }

    return notificationElement;
  }

  /**
   * Mostra notificação
   */
  function showNotification() {
    if (!notificationElement) {
      createNotificationElement();
    }

    if (isVisible) {
      return; // Já está visível
    }

    // Cancela auto-dismiss anterior se existir
    if (autoDismissTimer) {
      clearTimeout(autoDismissTimer);
      autoDismissTimer = null;
    }

    // Mostra notificação
    notificationElement.classList.add('update-notification--visible');
    isVisible = true;

    // Auto-dismiss se configurado
    if (config.autoDismiss > 0) {
      autoDismissTimer = setTimeout(() => {
        this.hide();
      }, config.autoDismiss);
    }

    // Anima entrada
    setTimeout(() => {
      notificationElement.classList.add('update-notification--animate-in');
    }, 10);
  }

  /**
   * Esconde notificação
   */
  function hideNotification() {
    if (!notificationElement || !isVisible) {
      return;
    }

    // Cancela auto-dismiss
    if (autoDismissTimer) {
      clearTimeout(autoDismissTimer);
      autoDismissTimer = null;
    }

    // Anima saída
    notificationElement.classList.remove('update-notification--animate-in');
    notificationElement.classList.add('update-notification--animate-out');

    setTimeout(() => {
      notificationElement.classList.remove('update-notification--visible', 'update-notification--animate-out');
      isVisible = false;
    }, 300);
  }

  const UpdateNotification = {
    /**
     * Exibe notificação
     * @param {string} message - Mensagem personalizada (opcional)
     * @param {Object} options - Opções (callback, etc)
     */
    show: function(message, options = {}) {
      config = { ...getConfig(), ...options };

      if (options.callback && typeof options.callback === 'function') {
        updateCallback = options.callback;
      }

      // Atualiza mensagem se fornecida
      if (message) {
        if (!notificationElement) {
          createNotificationElement();
        }
        const messageElement = notificationElement.querySelector('.update-notification__text');
        if (messageElement) {
          messageElement.textContent = message;
        }
      }

      showNotification.call(this);
    },

    /**
     * Esconde notificação
     */
    hide: function() {
      hideNotification();
    },

    /**
     * Callback ao clicar em "Atualizar Agora"
     */
    updateNow: function() {
      hideNotification();

      if (updateCallback && typeof updateCallback === 'function') {
        try {
          updateCallback();
        } catch (error) {
          console.error('[UpdateNotification] Erro ao executar callback:', error);
        }
        updateCallback = null;
      } else {
        // Dispara evento customizado
        if (typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') {
          const event = new CustomEvent('updateRequested', {
            detail: {
              timestamp: Date.now(),
              source: 'UpdateNotification'
            }
          });
          window.dispatchEvent(event);
        }
      }
    },

    /**
     * Registra callback para atualização
     * @param {Function} callback - Função callback
     */
    onUpdate: function(callback) {
      if (typeof callback === 'function') {
        updateCallback = callback;
      }
    },

    /**
     * Verifica se está visível
     * @returns {boolean}
     */
    isVisible: function() {
      return isVisible;
    },

    /**
     * Atualiza configuração
     * @param {Object} newConfig - Nova configuração
     */
    updateConfig: function(newConfig) {
      config = { ...config, ...newConfig };
    }
  };

  // Listener para evento de mudança de dados
  // IMPORTANTE: Só mostra notificação se realmente houver mudanças confirmadas
  // Usa a mesma lógica que funcionou no teste manual
  if (typeof window !== 'undefined') {
    window.addEventListener('dataChanged', (event) => {
      // Verifica se o evento tem detalhes que confirmam mudanças reais
      const detail = event.detail || {};
      
      console.log('[UpdateNotification] Evento dataChanged recebido:', {
        source: detail.source,
        notificationIds: detail.notificationIds,
        timestamp: detail.timestamp
      });
      
      // Só mostra se:
      // 1. O evento tem notificationIds (mudanças confirmadas pelo servidor)
      // 2. E foi disparado pelo ChangeDetector (source: 'ChangeDetector')
      // Isso evita falsos positivos - mesma lógica do teste manual
      if (detail.source === 'ChangeDetector' && detail.notificationIds && detail.notificationIds.length > 0) {
        console.log('[UpdateNotification] ✅ Mudanças confirmadas, mostrando notificação. IDs:', detail.notificationIds);
        UpdateNotification.show('Banco de dados atualizado. Existem novas notificações disponíveis.');
      } else if (detail.source === 'ChangeDetector' && (!detail.notificationIds || detail.notificationIds.length === 0)) {
        // Se foi do ChangeDetector mas sem IDs, pode ser falso positivo - não mostra
        console.log('[UpdateNotification] ⚠️ Evento dataChanged recebido mas sem IDs confirmados - ignorando (possível falso positivo)');
      } else {
        // Para outros casos, deixa os callbacks específicos de cada página decidirem
        // Não mostra automaticamente aqui
        console.log('[UpdateNotification] ℹ️ Evento dataChanged recebido de outra fonte - deixando callbacks específicos decidirem');
      }
    });
  }

  // Exportar globalmente
  if (typeof window !== 'undefined') {
    window.UpdateNotification = UpdateNotification;
  }

  // Exportar para módulos (se suportado)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = UpdateNotification;
  }
})();
