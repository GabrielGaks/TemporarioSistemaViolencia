const fs = require('fs');
const path = require('path');

const filePath = 'c:\\Users\\Nitro V15\\Documents\\Projeto NAAM\\FormularioRegistroV2\\painel-casos.html';
const content = fs.readFileSync(filePath, 'utf8');

const anchor = 'function populateSelect(selectId, options) {';
const functionsCode = `
      // ============================================
      // AUTOCOMPLETE: ESCOLAS
      // ============================================
      function setupEscolaAutocomplete() {
        setupGenericAutocomplete({
           searchId: 'filterEscolaSearch',
           listId: 'filterEscolaAutocompleteList',
           tagsId: 'filterEscolaSelectedTags',
           containerId: 'filterEscolaContainer',
           placeholder: 'Digite para buscar escola...',
           onSelectionChange: applyFilters
        });
      }

      // ============================================
      // AUTOCOMPLETE: TIPO DEFICIÊNCIA
      // ============================================
      function setupTipoDeficienciaAutocomplete() {
        setupGenericAutocomplete({
           searchId: 'filterTipoDeficienciaSearch',
           listId: 'filterTipoDeficienciaAutocompleteList',
           tagsId: 'filterTipoDeficienciaSelectedTags',
           containerId: 'filterTipoDeficienciaContainer',
           placeholder: 'Digite para buscar transtorno...',
           onSelectionChange: applyFilters
        });
      }

      // ============================================
      // GENERIC AUTOCOMPLETE LOGIC
      // ============================================
      function setupGenericAutocomplete(config) {
        const searchInput = document.getElementById(config.searchId);
        const listContainer = document.getElementById(config.listId);
        const tagsContainer = document.getElementById(config.tagsId);
        const checkboxesContainer = document.getElementById(config.containerId);

        if (!searchInput || !listContainer || !tagsContainer || !checkboxesContainer) {
            console.warn('Autocomplete elements not found for', config.searchId);
            return;
        }

        // 1. Get options from hidden checkboxes
        function getOptions() {
            const labels = Array.from(checkboxesContainer.querySelectorAll('.checkbox-label'));
            return labels.map(label => {
                const input = document.getElementById(label.getAttribute('for'));
                return {
                    label: label.textContent.trim(),
                    value: input ? input.value : label.textContent.trim(),
                    input: input
                };
            }).filter(opt => opt.input); // Only those with inputs
        }

        // 2. Render Tags
        function renderTags() {
            tagsContainer.innerHTML = '';
            const options = getOptions();
            const selected = options.filter(opt => opt.input.checked);

            selected.forEach(opt => {
                const tag = document.createElement('div');
                tag.className = 'selected-tag';
                tag.innerHTML = \`
                    \${opt.label}
                    <button class="ml-1 text-gray-400 hover:text-red-500 focus:outline-none" aria-label="Remover">
                         <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                \`;
                tag.querySelector('button').addEventListener('click', (e) => {
                    e.stopPropagation();
                    opt.input.checked = false;
                    renderTags();
                    if(config.onSelectionChange) config.onSelectionChange();
                });
                tagsContainer.appendChild(tag);
            });
            
            // Show/Hide wrapper styling if needed
            tagsContainer.style.display = selected.length > 0 ? 'flex' : 'none';
        }

        // 3. Filter Logic
        searchInput.addEventListener('input', () => {
            const term = searchInput.value.toLowerCase();
            if (term.length < 2) {
                listContainer.style.display = 'none';
                return;
            }

            const options = getOptions();
            const matches = options.filter(opt => !opt.input.checked && opt.label.toLowerCase().includes(term));

            if (matches.length === 0) {
                listContainer.innerHTML = '<div class="no-results">Nenhum resultado encontrado</div>';
            } else {
                listContainer.innerHTML = '';
                matches.forEach(opt => {
                    const item = document.createElement('div');
                    item.className = 'autocomplete-item';
                    item.textContent = opt.label;
                    item.addEventListener('click', () => {
                        opt.input.checked = true;
                        searchInput.value = '';
                        listContainer.style.display = 'none';
                        renderTags();
                        if(config.onSelectionChange) config.onSelectionChange();
                    });
                    listContainer.appendChild(item);
                });
            }
            listContainer.style.display = 'block';
            listContainer.classList.add('show');
        });

        // Close on click outside
        document.addEventListener('click', (e) => {
             if (!searchInput.contains(e.target) && !listContainer.contains(e.target)) {
                 listContainer.style.display = 'none';
             }
        });

        // Focus behaviors
        searchInput.addEventListener('focus', () => {
             if(searchInput.value.length >= 2) listContainer.style.display = 'block';
        });

        // Initial render
        renderTags();
        
        // Listen for external changes (e.g. "Clear Filters")
        // We observer the container or inputs? 
        // Simpler: expose a refresh function or just hook into applyFilters if possible, 
        // but here we just rely on the fact that applyFilters re-reads inputs. 
        // Updates TO the UI from external sources (like clear button) might need an event listener.
        const inputs = checkboxesContainer.querySelectorAll('input');
        inputs.forEach(input => {
             input.addEventListener('change', renderTags);
        });
      }

`;

if (content.includes('function setupEscolaAutocomplete')) {
    console.log('Functions already exist. Skipping.');
} else {
    const newContent = content.replace(anchor, functionsCode + '\n\n' + anchor);
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Successfully inserted autocomplete functions.');
}
