/**
 * ========================================
 * MÓDULO DE SEGURANÇA
 * ========================================
 * Utilitários para sanitização, validação e proteção
 * ========================================
 */

(function() {
  'use strict';

  const Security = {
    
    /**
     * Sanitiza string removendo caracteres perigosos
     * @param {string} input - String a ser sanitizada
     * @param {boolean} allowHTML - Se permite HTML básico (default: false)
     * @returns {string} String sanitizada
     */
    sanitizeString: function(input, allowHTML = false) {
      if (typeof input !== 'string') {
        return String(input || '');
      }
      
      let sanitized = input.trim();
      
      if (!allowHTML) {
        // Remove tags HTML
        sanitized = sanitized.replace(/<[^>]*>/g, '');
        // Escapa caracteres especiais
        sanitized = sanitized
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;')
          .replace(/\//g, '&#x2F;');
      }
      
      // Remove caracteres de controle
      sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');
      
      return sanitized;
    },
    
    /**
     * Valida email
     * @param {string} email - Email a ser validado
     * @returns {boolean} True se válido
     */
    validateEmail: function(email) {
      if (!email || typeof email !== 'string') {
        return false;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email.trim()) && email.length <= 255;
    },
    
    /**
     * Valida URL
     * @param {string} url - URL a ser validada
     * @returns {boolean} True se válido
     */
    validateURL: function(url) {
      console.log('[Security] validateURL chamada com:', url);
      
      if (!url || typeof url !== 'string') {
        console.error('[Security] URL não é string ou está vazia');
        return false;
      }
      
      try {
        const urlObj = new URL(url);
        console.log('[Security] URL parseada:', {
          protocol: urlObj.protocol,
          hostname: urlObj.hostname,
          href: urlObj.href
        });
        
        // Aceita https: e http: (Google Apps Script usa https)
        // Também aceita domínios do Google
        const isHTTP = ['http:', 'https:'].includes(urlObj.protocol);
        const isGoogleDomain = urlObj.hostname.includes('google.com') || urlObj.hostname.includes('googleapis.com');
        
        console.log('[Security] Validação:', {
          isHTTP: isHTTP,
          isGoogleDomain: isGoogleDomain,
          resultado: isHTTP && (isGoogleDomain || urlObj.protocol === 'https:')
        });
        
        return isHTTP && (isGoogleDomain || urlObj.protocol === 'https:');
      } catch (e) {
        console.error('[Security] Erro ao fazer parse da URL:', url, e);
        return false;
      }
    },
    
    /**
     * Sanitiza objeto removendo propriedades perigosas
     * @param {Object} obj - Objeto a ser sanitizado
     * @param {Array<string>} skipKeys - Chaves que não devem ser sanitizadas
     * @returns {Object} Objeto sanitizado
     */
    sanitizeObject: function(obj, skipKeys = []) {
      if (!obj || typeof obj !== 'object') {
        return {};
      }
      
      const sanitized = {};
      const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
      
      for (const key in obj) {
        if (obj.hasOwnProperty(key) && !dangerousKeys.includes(key)) {
          const value = obj[key];
          
          if (typeof value === 'string') {
            // Se a chave está na lista de skip, não sanitiza
            sanitized[key] = skipKeys.includes(key) ? value : this.sanitizeString(value);
          } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            sanitized[key] = this.sanitizeObject(value, skipKeys);
          } else if (Array.isArray(value)) {
            sanitized[key] = value.map(item => 
              typeof item === 'string' ? this.sanitizeString(item) : item
            );
          } else {
            sanitized[key] = value;
          }
        }
      }
      
      return sanitized;
    },
    
    /**
     * Valida e sanitiza dados de formulário
     * @param {FormData|Object} formData - Dados do formulário
     * @returns {Object} Dados sanitizados
     */
    sanitizeFormData: function(formData) {
      const data = {};
      
      if (formData instanceof FormData) {
        for (const [key, value] of formData.entries()) {
          if (typeof value === 'string') {
            data[key] = this.sanitizeString(value);
          } else {
            data[key] = value;
          }
        }
      } else if (typeof formData === 'object' && formData !== null) {
        return this.sanitizeObject(formData);
      }
      
      return data;
    },
    
    /**
     * Previne XSS em conteúdo HTML
     * @param {string} html - HTML a ser sanitizado
     * @returns {string} HTML seguro
     */
    sanitizeHTML: function(html) {
      if (typeof html !== 'string') {
        return '';
      }
      
      const div = document.createElement('div');
      div.textContent = html;
      return div.innerHTML;
    },
    
    /**
     * Valida se string não contém scripts maliciosos
     * @param {string} input - String a validar
     * @returns {boolean} True se seguro
     */
    isSafeString: function(input) {
      if (typeof input !== 'string') {
        return false;
      }
      
      const dangerousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /<iframe/i,
        /<object/i,
        /<embed/i
      ];
      
      return !dangerousPatterns.some(pattern => pattern.test(input));
    },
    
    /**
     * Limita tamanho de string
     * @param {string} input - String a limitar
     * @param {number} maxLength - Tamanho máximo
     * @returns {string} String limitada
     */
    limitLength: function(input, maxLength = 1000) {
      if (typeof input !== 'string') {
        return '';
      }
      
      return input.length > maxLength ? input.substring(0, maxLength) : input;
    },
    
    /**
     * Gera token CSRF simples (para proteção básica)
     * @returns {string} Token
     */
    generateCSRFToken: function() {
      const array = new Uint8Array(16);
      crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    },
    
    /**
     * Valida token CSRF
     * @param {string} token - Token a validar
     * @param {string} storedToken - Token armazenado
     * @returns {boolean} True se válido
     */
    validateCSRFToken: function(token, storedToken) {
      return token && storedToken && token === storedToken;
    },
    
    /**
     * Previne injeção SQL básica (para validação client-side)
     * @param {string} input - String a validar
     * @returns {boolean} True se seguro
     */
    isSQLSafe: function(input) {
      if (typeof input !== 'string') {
        return true;
      }
      
      const sqlPatterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
        /(--|;|\/\*|\*\/|'|"|`)/,
        /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i
      ];
      
      return !sqlPatterns.some(pattern => pattern.test(input));
    },
    
    /**
     * Valida idade
     * @param {number|string} age - Idade a validar
     * @param {number} min - Idade mínima (default: 0)
     * @param {number} max - Idade máxima (default: 120)
     * @returns {boolean} True se válido
     */
    validateAge: function(age, min = 0, max = 120) {
      const ageNum = parseInt(age, 10);
      return !isNaN(ageNum) && ageNum >= min && ageNum <= max;
    },
    
    /**
     * Valida data
     * @param {string} dateString - Data a validar (formato YYYY-MM-DD)
     * @returns {boolean} True se válido
     */
    validateDate: function(dateString) {
      if (!dateString || typeof dateString !== 'string') {
        return false;
      }
      
      const date = new Date(dateString);
      return date instanceof Date && !isNaN(date.getTime());
    },
    
    /**
     * Sanitiza URL para uso seguro
     * @param {string} url - URL a sanitizar
     * @returns {string} URL sanitizada ou string vazia
     */
    sanitizeURL: function(url) {
      if (!url || typeof url !== 'string') {
        return '';
      }
      
      try {
        const urlObj = new URL(url);
        // Permite apenas http e https
        if (!['http:', 'https:'].includes(urlObj.protocol)) {
          return '';
        }
        return urlObj.toString();
      } catch (e) {
        return '';
      }
    },
    
    /**
     * Remove informações sensíveis de logs
     * @param {*} data - Dados a limpar
     * @returns {*} Dados sem informações sensíveis
     */
    sanitizeForLog: function(data) {
      if (typeof data === 'string') {
        // Remove URLs de Apps Script
        return data.replace(/https:\/\/script\.google\.com\/macros\/s\/[^\/]+/g, '[REDACTED_URL]')
                   .replace(/AKfyc[a-zA-Z0-9_-]+/g, '[REDACTED_ID]')
                   .replace(/eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g, '[REDACTED_TOKEN]');
      }
      
      if (typeof data === 'object' && data !== null) {
        const sanitized = Array.isArray(data) ? [] : {};
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            const sensitiveKeys = ['password', 'token', 'key', 'secret', 'auth', 'credential'];
            if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
              sanitized[key] = '[REDACTED]';
            } else {
              sanitized[key] = this.sanitizeForLog(data[key]);
            }
          }
        }
        return sanitized;
      }
      
      return data;
    }
  };
  
  // Exportar globalmente
  if (typeof window !== 'undefined') {
    window.Security = Security;
  }
  
  // Exportar para módulos (se suportado)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Security;
  }
})();

