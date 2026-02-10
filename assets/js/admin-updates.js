/**
 * ADMIN UPDATES SYSTEM
 * Gerencia a busca e exibição de atividades recentes do sistema
 */

const AdminUpdates = {
    state: {
        lastCheck: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Padrão: últimas 24h
        updates: [],
        pollingInterval: null,
        isPolling: false
    },

    elements: {
        container: null,
        list: null,
        status: null
    },

    init() {
        console.log('🔄 [AdminUpdates] Inicializando...');

        // Verifica se estamos na página de admin (procura pelo container)
        this.elements.container = document.getElementById('admin-updates-container');
        this.elements.list = document.getElementById('updates-list');
        this.elements.status = document.getElementById('updates-status');

        if (this.elements.container) {
            this.startPolling();
        } else {
            console.log('ℹ️ [AdminUpdates] Container não encontrado. Script inativo nesta página.');
        }
    },

    startPolling() {
        if (this.state.isPolling) return;

        this.state.isPolling = true;
        this.updateStatus('Conectado', 'text-green-600', 'bg-green-400');

        this.checkUpdates(); // Primeira verificação imediata

        // Configura intervalo (padrão 30s)
        this.state.pollingInterval = setInterval(() => {
            this.checkUpdates();
        }, 30000);
    },

    stopPolling() {
        if (this.state.pollingInterval) {
            clearInterval(this.state.pollingInterval);
            this.state.isPolling = false;
            this.updateStatus('Parado', 'text-gray-500', 'bg-gray-400');
        }
    },

    async checkUpdates() {
        this.updateStatus('Atualizando...', 'text-blue-600', 'bg-blue-400', true);

        try {
            // Usa as funções globais do Code.gs via google.script.run (se disponível)
            // Ou via fetch endpoint se configurado. Assumindo Apps Script Web App.

            // Verifica URL do backend
            const scriptURL = typeof CONFIG !== 'undefined' ? CONFIG.APPS_SCRIPT_CASOS : null;

            if (!scriptURL) {
                console.warn('⚠️ [AdminUpdates] URL do backend não configurada.');
                this.updateStatus('Erro de Config', 'text-red-500', 'bg-red-400');
                return;
            }

            // Fallback para fetch POST (método robusto para Web App)
            const data = new URLSearchParams();
            data.append('action', 'checkUpdates');
            data.append('lastCheck', this.state.lastCheck);

            fetch(scriptURL, {
                method: 'POST',
                body: data
            })
                .then(response => response.json())
                .then(data => this.onUpdatesReceived(data))
                .catch(err => {
                    console.error('❌ [AdminUpdates] Erro:', err);
                    this.updateStatus('Erro de Conexão', 'text-red-500', 'bg-red-400');
                });

        } catch (e) {
            console.error('❌ [AdminUpdates] Erro crítico:', e);
        }
    },

    manualCheck() {
        this.checkUpdates();
    },

    onUpdatesReceived(response) {
        if (!response || !response.success) {
            console.warn('⚠️ [AdminUpdates] Falha na resposta:', response);
            this.updateStatus('Erro no Servidor', 'text-orange-500', 'bg-orange-400');
            return;
        }

        const newUpdates = response.updates || [];

        // Atualiza timestamp para próxima verificação
        if (response.serverTime) {
            this.state.lastCheck = response.serverTime; // Sincroniza com servidor
        } else {
            this.state.lastCheck = new Date().toISOString();
        }

        // Se houver atualizações, adiciona ao topo
        if (newUpdates.length > 0) {
            // Combina e remove duplicatas (por ID se houver, ou brute force)
            const currentIds = new Set(this.state.updates.map(u => u.id));
            const uniqueNew = newUpdates.filter(u => !currentIds.has(u.id));

            this.state.updates = [...uniqueNew, ...this.state.updates].slice(0, 100); // Mantém últimos 100
            this.renderList();

            // Feedback visual rápido
            const count = uniqueNew.length;
            if (count > 0) {
                this.showToastNotification(`${count} nova(s) atividade(s)!`);
            }
        } else if (this.state.updates.length === 0) {
            this.renderEmptyState();
        }

        this.updateStatus('Monitorando', 'text-green-600', 'bg-green-400');
    },

    renderList() {
        if (!this.elements.list) return;

        if (this.state.updates.length === 0) {
            this.renderEmptyState();
            return;
        }

        this.elements.list.innerHTML = this.state.updates.map(item => {
            const icon = this.getIconForType(item.tipo_acao);
            const colorClass = this.getColorClassForType(item.tipo_acao);
            const date = new Date(item.created_at).toLocaleString('pt-BR');
            const author = item.autor_nome || item.autor_email || 'Sistema';

            return `
                <div class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-100 animate-fade-in">
                    <div class="p-2 rounded-lg shadow-sm text-lg border ${colorClass}">
                        ${icon}
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex justify-between items-start">
                            <h4 class="text-sm font-semibold text-gray-800 truncate">
                                ${item.resumo || 'Atividade do Sistema'}
                            </h4>
                            <span class="text-xs text-gray-400 whitespace-nowrap ml-2">${date}</span>
                        </div>
                        <p class="text-xs text-gray-600 mt-1 line-clamp-2">
                            ${this.formatDetails(item.detalhes)}
                        </p>
                        <div class="mt-2 flex items-center gap-2">
                            <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                                ${author}
                            </span>
                            <span class="text-xs text-gray-400">• ${item.tabela_afetada || 'Geral'}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    renderEmptyState() {
        if (!this.elements.list) return;
        this.elements.list.innerHTML = `
            <div class="flex flex-col items-center justify-center py-8 text-gray-400 text-center">
                <span class="text-4xl mb-2">😴</span>
                <p class="text-sm">Nenhuma atividade registrada nas últimas 24h.</p>
            </div>
         `;
    },

    getIconForType(type) {
        // Normaliza para upper case para garantir compatibilidade
        const t = (type || '').toUpperCase();

        switch (t) {
            case 'CRIACAO':
            case 'INSERT':
                return '➕';

            case 'EDICAO':
            case 'UPDATE':
                return '✏️';

            case 'EXCLUSAO':
            case 'DELETE':
                return '🗑️';

            case 'LOGIN': return '🔑';
            default: return 'ℹ️';
        }
    },

    getColorClassForType(type) {
        const t = (type || '').toUpperCase();

        switch (t) {
            case 'CRIACAO':
            case 'INSERT':
                return 'bg-green-100 text-green-700 border-green-200';

            case 'EDICAO':
            case 'UPDATE':
                return 'bg-blue-100 text-blue-700 border-blue-200';

            case 'EXCLUSAO':
            case 'DELETE':
                return 'bg-red-100 text-red-700 border-red-200';

            case 'LOGIN':
                return 'bg-amber-100 text-amber-700 border-amber-200';

            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    },

    formatDetails(detailsJson) {
        try {
            const details = typeof detailsJson === 'string' ? JSON.parse(detailsJson) : detailsJson;
            if (details.campos_atualizados) return `Alterado: ${details.campos_atualizados}`;
            if (details.motivo) return `Motivo: ${details.motivo}`;
            if (details.email) return `Email: ${details.email}`;
            return JSON.stringify(details); // Fallback
        } catch (e) {
            return detailsJson || '';
        }
    },

    updateStatus(text, colorClass, dotColorClass, pulse = false) {
        if (!this.elements.status) return;

        let html = `<span class="w-2 h-2 rounded-full ${dotColorClass} mr-2 ${pulse ? 'animate-pulse' : ''}"></span> ${text}`;
        this.elements.status.innerHTML = html;
        this.elements.status.className = `text-sm flex items-center ${colorClass}`;
    },

    showToastNotification(msg) {
        // Usa o sistema de alerta existente se possível, ou um console log discreto
        if (typeof mostrarAlerta === 'function') {
            mostrarAlerta(msg, 'info');
        } else {
            console.log(`🔔 [AdminUpdates] ${msg}`);
        }
    },

    /**
     * FUNÇÃO DE DEBUG MANUAL (Solicitada pelo Admin)
     * Loop infinito para verificar conexão com backend e detectar erros.
     * Uso: AdminUpdates.startDebugLoop() no console.
     */
    startDebugLoop() {
        console.clear();
        console.log('🐞 [DEBUG MODE] Iniciando Loop de Verificação (5s)...');
        console.log('----------------------------------------------------');

        // Para polling normal se estiver rodando
        this.stopPolling();

        let count = 1;

        const debugInterval = setInterval(() => {
            const time = new Date().toLocaleTimeString();
            console.log(`[${time}] 🔄 Tentativa #${count} - Conectando...`);

            const scriptURL = typeof CONFIG !== 'undefined' ? CONFIG.APPS_SCRIPT_CASOS : null;
            if (!scriptURL) {
                console.error('❌ URL do Backend não encontrada em CONFIG.');
                return;
            }

            const data = new URLSearchParams();
            data.append('action', 'checkUpdates');
            data.append('lastCheck', new Date(Date.now() - 60000).toISOString()); // Sempre pega último minuto

            fetch(scriptURL, {
                method: 'POST',
                body: data
            })
                .then(response => {
                    console.log(`[${time}] 📡 Status: ${response.status} ${response.statusText}`);
                    return response.text();
                })
                .then(text => {
                    try {
                        const json = JSON.parse(text);
                        if (json.success) {
                            console.log(`[${time}] ✅ SUCESSO!`, json);
                        } else {
                            console.warn(`[${time}] ⚠️ RETORNOU ERRO:`, json);
                        }
                    } catch (e) {
                        console.error(`[${time}] ❌ ERRO DE PARSE (Provável erro no GAS):`, text.substring(0, 200) + '...');
                    }
                })
                .catch(err => {
                    console.error(`[${time}] ❌ ERRO DE REDE:`, err);
                });

            count++;
        }, 5000); // 5 segundos

        console.log(`✅ Loop iniciado. Para parar, recarregue a página.`);
        return "Debug Loop Iniciado";
    }
};

// Injeta estilos CSS necessários para animação
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-5px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
        animation: fadeIn 0.3s ease-out forwards;
    }
`;
document.head.appendChild(style);

// Auto-init ao carregar página
document.addEventListener('DOMContentLoaded', () => {
    AdminUpdates.init();
});
