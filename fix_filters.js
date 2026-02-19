const fs = require('fs');
const path = require('path');

const filePath = 'c:\\Users\\Nitro V15\\Documents\\Projeto NAAM\\FormularioRegistroV2\\painel-casos.html';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

const startMarker = 'function initializeFilters(data) { // TEST REPLACEMENT';
let startIndex = -1;
let endIndex = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(startMarker)) {
        startIndex = i;
        break;
    }
}

if (startIndex === -1) {
    console.error('Could not find start marker');
    process.exit(1);
}

// Find the end index (scan for the closing brace of the function)
// We know it ends around line 7328, which is roughly startIndex + 80 lines.
// But scanning for "      }" at indentation level 6 might be tricky if there are nested blocks.
// However, I observed the file content ends with empty lines after 7328.
// And checking line 7328 in previous view showed "      }".
// Let's explicitly check around there.

// Better yet, I know the exact lines I want to replace based on previous interaction context: 7249 to 7328.
// Let's verify line 7249 matches startMarker.
// Note: line numbers in tools are 1-based, array is 0-based. So index should be 7248.

if (lines[7248].includes(startMarker)) {
    console.log('Confirmed start at line 7249');
    startIndex = 7248;
} else {
    console.log('Line 7249 does not match marker. Found at ' + (startIndex + 1));
}

// End index 7328 -> array index 7327.
endIndex = 7327;
console.log('Replacing from line ' + (startIndex + 1) + ' to ' + (endIndex + 1));

const newFunction = `      function initializeFilters(data) {
        // 1. Validação de Idade (Min <= Max)
        const idadeMin = document.getElementById('filterIdadeMin');
        const idadeMax = document.getElementById('filterIdadeMax');
        
        function validateAge() {
            const min = parseInt(idadeMin.value);
            const max = parseInt(idadeMax.value);
            if (!isNaN(min) && !isNaN(max) && min > max) {
                idadeMax.setCustomValidity("A idade máxima deve ser maior ou igual à mínima.");
                idadeMax.reportValidity();
            } else {
                idadeMax.setCustomValidity("");
            }
            applyFilters();
        }

        if (idadeMin && idadeMax) {
            idadeMin.addEventListener('input', validateAge);
            idadeMax.addEventListener('input', validateAge);
        }

        // 2. Região
        if (columnNames.regiao) {
          const valores = buildNormalizedOptions(columnNames.regiao, data);
          createCheckboxes('filterRegiaoContainer', valores, 'regiao');
        }

        // 3. Tipo Violência (Cards)
        if (columnNames.tipo) {
          const valores = buildNormalizedOptionsTipoViolencia(columnNames.tipo, data);
          createViolenceTypeCards('filterTipoViolenciaContainer', valores, 'tipoViolencia');
          setTimeout(verificarViolenciaInstitucionalNoFiltro, 500);
        }

        // 4. Escola & Tipo Instituição
        if (columnNames.escola) {
             const tiposSet = new Set();
             data.forEach(row => {
                const tipo = getTipoInstituicao(row[columnNames.escola]);
                if (tipo) tiposSet.add(tipo);
                else if (row[columnNames.escola]) tiposSet.add('Não Encontrada');
             });
             const tiposInstituicao = Array.from(tiposSet).sort();
             createCheckboxes('filterTipoInstituicaoContainer', tiposInstituicao, 'tipoInstituicao');

             const valores = buildNormalizedOptions(columnNames.escola, data);
             createCheckboxes('filterEscolaContainer', valores, 'escola');
        }

        // 5. Criança / Perfil Section (Refactored)
        // Gênero -> Chips
        if (columnNames.genero) {
          const valores = buildGeneroOptions(data);
          createToggleChips('filterGeneroContainer', valores, 'genero');
        }
        // Raça/Cor -> Checkboxes (Grid)
        if (columnNames.raca) {
          const valores = buildRacaOptions(data);
          createCheckboxes('filterRacaContainer', valores, 'raca');
        }
        // Orientação Sexual -> Radio
        const colOrientacao = columnNames.orientacao || columnNames.orientacaoSexual;
        if (colOrientacao) {
           let valores = buildNormalizedOptions(colOrientacao, data);
           if (valores.length === 0) valores = ['Heterossexual', 'Homossexual', 'Bissexual', 'Outros', 'Não Declarado'];
           createModernRadio('filterOrientacaoContainer', valores, 'orientacao');
        }
        
        // PCD Listener
        const pcdSelect = document.getElementById('filterPCD');
        if(pcdSelect) {
            pcdSelect.addEventListener('change', () => {
                applyFilters();
                const tipoDefContainer = document.getElementById('section-tipoDeficiencia');
                if(tipoDefContainer) {
                    if(pcdSelect.value === 'S') tipoDefContainer.classList.remove('hidden');
                    else tipoDefContainer.classList.add('hidden');
                }
            });
        }
        // Tipo Deficiência (Detalhe)
        if (columnNames.detalhePCD) {
            const valoresBrutos = buildNormalizedOptions(columnNames.detalhePCD, data);
            const valoresNormalizados = normalizarListaTranstornos(valoresBrutos);
            createCheckboxes('filterTipoDeficienciaContainer', valoresNormalizados, 'tipoDeficiencia');
        }

        // 6. Violência Institucional
        if (columnNames.tipoViolenciaInstitucional) {
          buildViolenciaInstitucionalGroups(data);
        }

        // 7. Encaminhamento
        const colEnc = columnNames.encaminhamento;
        if (colEnc) {
          const values = buildNormalizedOptions(colEnc, data);
          buildEncaminhamentoGroups(values);
        }
        
        // Autocompletes
        if (typeof setupEscolaAutocomplete === 'function') setupEscolaAutocomplete();
        if (typeof setupTipoDeficienciaAutocomplete === 'function') setupTipoDeficienciaAutocomplete();
      }`;

// Replace lines
lines.splice(startIndex, endIndex - startIndex + 1, newFunction);

const newContent = lines.join('\n');
fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Successfully replaced initializeFilters');
