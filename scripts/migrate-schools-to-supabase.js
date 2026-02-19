/**
 * SCRIPT DE MIGRAÇÃO DE DADOS - Escolas para Supabase
 * =====================================================
 * 
 * Este script migra as atribuições de escolas hardcoded em escolas-tecnico.js
 * para a tabela technician_schools no Supabase.
 * 
 * INSTRUÇÕES DE USO:
 * ==================
 * 
 * OPÇÃO 1 - Executar no Console do Navegador:
 * 1. Abra gerenciar-usuarios.html no navegador
 * 2. Logue como superuser
 * 3. Abra o Console do Desenvolvedor (F12)
 * 4. Copie e cole todo este arquivo no console
 * 5. Execute: migrarEscolasParaSupabase()
 * 6. Aguarde a conclusão e verifique os logs
 * 
 * OPÇÃO 2 - Executar via Node.js (requer fetch):
 * 1. Instale node-fetch: npm install node-fetch
 * 2. Adicione no topo: const fetch = require('node-fetch');
 * 3. Configure APPS_SCRIPT_URL manualmente
 * 4. Execute: node scripts/migrate-schools-to-supabase.js
 * 
 * SEGURANÇA:
 * ==========
 * - Só execute este script UMA VEZ
 * - Verifique o Supabase após a execução
 * - Mantenha backup dos dados hardcoded
 * - Requer permissões de admin/superuser
 * 
 * @version 1.0.0
 * @date 2026-02-10
 */

// ========================================
// CONFIGURAÇÃO
// ========================================

// Mapeamento de chaves do array hardcoded para informações do usuário
// IMPORTANTE: Dados extraídos do CSV do Supabase (app_users com role=tecnico)
const TECNICOS_MAP = {
  darison: {
    email: 'dnalesso@edu.vitoria.es.gov.br',
    nome: 'Darison',
    user_id: 'bfa6a6dd-c72e-429e-ad4b-266f48696db6'
  },
  libna: {
    email: 'libna_correa@hotmail.com',
    nome: 'Libna',
    user_id: 'e2727c88-1527-483a-b1d4-376d73516284'
  },
  carla: {
    email: 'mclsantos1@edu.vitoria.es.gov.br',
    nome: 'Maria',
    user_id: 'e7c12ef9-1180-4819-8056-c36db4c1dbc4'
  },
  rosangela: {
    email: 'rgcarmo@prof.edu.vitoria.es.gov.br',
    nome: 'Rosangela',
    user_id: 'fa4613a3-e3bc-450f-a274-368ad5feb3c5'
  }
  // NOTA: amelinha, joselma e silvia não têm usuários correspondentes no banco
  // Remova as escolas dessas chaves do ESCOLAS_POR_TECNICO_MIGRATION ou crie os usuários primeiro
};

// ========================================
// DADOS HARDCODED (COPIADO DE escolas-tecnico.js)
// ========================================

const ESCOLAS_AMELINHA_MIGRATION = [
  { nomeOriginal: "EMEF Aristóbulo Barbosa Leão", tipo: "EMEF", regiao: "Forte São João" },
  { nomeOriginal: "EMEF Áurea Alice Peixoto", tipo: "EMEF", regiao: "Forte São João" },
  { nomeOriginal: "EMEF Bela Aurora", tipo: "EMEF", regiao: "Forte São João" },
  { nomeOriginal: "EMEF Bonfim", tipo: "EMEF", regiao: "Forte São João" },
  { nomeOriginal: "EMEF Caranã", tipo: "EMEF", regiao: "Forte São João" },
  { nomeOriginal: "EMEF Congós", tipo: "EMEF", regiao: "Forte São João" },
  { nomeOriginal: "EMEF Prof. Aracy Muniz Freire", tipo: "EMEF", regiao: "Forte São João" },
  { nomeOriginal: "EMEF Prof. Edna de Matos", tipo: "EMEF", regiao: "Forte São João" },
  { nomeOriginal: "EMEF Iraci Neves Nascimento", tipo: "EMEF", regiao: "Forte São João" },
  { nomeOriginal: "EMEF Professora Elza Lemos Andreatta", tipo: "EMEF", regiao: "Forte São João" },
  { nomeOriginal: "EMEF Profª. Marlucia Bettim Alves", tipo: "EMEF", regiao: "Forte São João" },
  { nomeOriginal: "EMEF Solange Alice Colombo", tipo: "EMEF", regiao: "Forte São João" },
  { nomeOriginal: "EMEF São João", tipo: "EMEF", regiao: "Forte São João" },
  { nomeOriginal: "EMEF Unidos Venceremos", tipo: "EMEF", regiao: "Forte São João" },
  { nomeOriginal: "EMEF Zilda Coppi Pereira", tipo: "EMEF", regiao: "Forte São João" }
];

const ESCOLAS_LIBNA_MIGRATION = [
  { nomeOriginal: "CMEI Darly Alves de Souza", tipo: "CMEI", regiao: "São Pedro" },
  { nomeOriginal: "CMEI Prof. José Everardo Correa de Araújo", tipo: "CMEI", regiao: "São Pedro" },
  { nomeOriginal: "CMEI Alaíde Moura Costa", tipo: "CMEI", regiao: "São Pedro" },
  { nomeOriginal: "CMEI Tia Marli", tipo: "CMEI", regiao: "São Pedro" },
  { nomeOriginal: "CMEI Professora Euzi Muniz de Freitas", tipo: "CMEI", regiao: "São Pedro" },
  { nomeOriginal: "CMEI Prof. Julio Ricas", tipo: "CMEI", regiao: "São Pedro" },
  { nomeOriginal: "CMEI Prof. Alércio Vieira Dias", tipo: "CMEI", regiao: "São Pedro" },
  { nomeOriginal: "CMEI Armando Sá", tipo: "CMEI", regiao: "São Pedro" },
  { nomeOriginal: "CMEI Tia Nilda", tipo: "CMEI", regiao: "São Pedro" },
  { nomeOriginal: "CMEI Almirante Lamego", tipo: "CMEI", regiao: "São Pedro" },
  { nomeOriginal: "CMEI Prof. Telmo Araújo", tipo: "CMEI", regiao: "São Pedro" },
  { nomeOriginal: "CMEI Vitória Régia Botelho Meriguetti", tipo: "CMEI", regiao: "São Pedro" },
  { nomeOriginal: "CMEI Aristides Marins Filho", tipo: "CMEI", regiao: "São Pedro" },
  { nomeOriginal: "CMEI Pequeno Anjo", tipo: "CMEI", regiao: "São Pedro" },
  { nomeOriginal: "CMEI Maria das Graças Oliveira Salles", tipo: "CMEI", regiao: "São Pedro" }
];

const ESCOLAS_ROSANGELA_MIGRATION = [
  { nomeOriginal: "CMEI Profª. Alcione Neves de Souza", tipo: "CMEI", regiao: "Maruípe" },
  { nomeOriginal: "CMEI Prof. José Lemos de Miranda", tipo: "CMEI", regiao: "Maruípe" },
  { nomeOriginal: "CMEI Prof. José Francisco Dias", tipo: "CMEI", regiao: "Maruípe" },
  { nomeOriginal: "CMEI Dirceu João Pagung", tipo: "CMEI", regiao: "Maruípe" },
  { nomeOriginal: "CMEI Darcy Ribeiro", tipo: "CMEI", regiao: "Maruípe" },
  { nomeOriginal: "CMEI Cora Aguilera Rodrigues", tipo: "CMEI", regiao: "Maruípe" },
  { nomeOriginal: "CMEI Henrique Valadares", tipo: "CMEI", regiao: "Maruípe" },
  { nomeOriginal: "CMEI Carmem Lyra", tipo: "CMEI", regiao: "Maruípe" },
  { nomeOriginal: "CMEI Cid Queiroz", tipo: "CMEI", regiao: "Maruípe" },
  { nomeOriginal: "CMEI Bairro da Penha", tipo: "CMEI", regiao: "Maruípe" },
  { nomeOriginal: "CMEI Profª. Santa Cruz Pratti", tipo: "CMEI", regiao: "Maruípe" },
  { nomeOriginal: "CMEI Joares Pereira de Almeida", tipo: "CMEI", regiao: "Maruípe" },
  { nomeOriginal: "CMEI Wania de Aguiar Beling", tipo: "CMEI", regiao: "Maruípe" },
  { nomeOriginal: "CMEI Valdete Ribeiro Soares", tipo: "CMEI", regiao: "Maruípe" },
  { nomeOriginal: "CMEI Nanci Rangel Andrada", tipo: "CMEI", regiao: "Maruípe" },
  { nomeOriginal: "CMEI Milton Lombardi", tipo: "CMEI", regiao: "Maruípe" }
];

const ESCOLAS_DARISON_MIGRATION = [
  { nomeOriginal: "EMEF Álvaro de Castro Mattos", tipo: "EMEF", regiao: "São Pedro" },
  { nomeOriginal: "EMEF Ângelo Zani", tipo: "EMEF", regiao: "São Pedro" },
  { nomeOriginal: "EMEF Arthur da Costa e Silva", tipo: "EMEF", regiao: "São Pedro" },
  { nomeOriginal: "EMEF Ernesto Alves Pinto Filho", tipo: "EMEF", regiao: "São Pedro" },
  { nomeOriginal: "EMEF Euza Maria Nascimento de Souza", tipo: "EMEF", regiao: "São Pedro" },
  { nomeOriginal: "EMEF Experimental de Vitória", tipo: "EMEF", regiao: "São Pedro" },
  { nomeOriginal: "EMEF Francisco Lacerda de Aguiar", tipo: "EMEF", regiao: "São Pedro" },
  { nomeOriginal: "EMEF José Áureo Monjardim", tipo: "EMEF", regiao: "São Pedro" },
  { nomeOriginal: "EMEF Lenir Borlot", tipo: "EMEF", regiao: "São Pedro" },
  { nomeOriginal: "EMEF Maria José Costa Moraes", tipo: "EMEF", regiao: "São Pedro" },
  { nomeOriginal: "EMEF Mauro Braga", tipo: "EMEF", regiao: "São Pedro" },
  { nomeOriginal: "EMEF Moacyr Avidos", tipo: "EMEF", regiao: "São Pedro" },
  { nomeOriginal: "EMEF Nice Avanza Pimentel", tipo: "EMEF", regiao: "São Pedro" },
  { nomeOriginal: "EMEF Paulo Roberto Vieira Gomes", tipo: "EMEF", regiao: "São Pedro" },
  { nomeOriginal: "EMEF Resistência", tipo: "EMEF", regiao: "São Pedro" }
];

const ESCOLAS_CARLA_MARIA_MIGRATION = [
  { nomeOriginal: "EMEF Admardo Serafim de Oliveira", tipo: "EMEF", regiao: "Maruípe" },
  { nomeOriginal: "EMEF Álvaro Granja Pellicon", tipo: "EMEF", regiao: "Maruípe" },
  { nomeOriginal: "EMEF de Andorinhas", tipo: "EMEF", regiao: "Maruípe" },
  { nomeOriginal: "EMEF Ceciliano Abel de Almeida", tipo: "EMEF", regiao: "Maruípe" },
  { nomeOriginal: "EMEF CSNU Itararé", tipo: "EMEF", regiao: "Maruípe" },
  { nomeOriginal: "EMEF Dirceu Cardoso de Paiva", tipo: "EMEF", regiao: "Maruípe" },
  { nomeOriginal: "EMEF Ebe Leste Amorim", tipo: "EMEF", regiao: "Maruípe" },
  { nomeOriginal: "EMEF Francisco Coelho Ávila Júnior", tipo: "EMEF", regiao: "Maruípe" },
  { nomeOriginal: "EMEF Izaura Marques da Silva", tipo: "EMEF", regiao: "Maruípe" },
  { nomeOriginal: "EMEF Marieta Escobar", tipo: "EMEF", regiao: "Maruípe" },
  { nomeOriginal: "EMEF Mario Gurgel", tipo: "EMEF", regiao: "Maruípe" },
  { nomeOriginal: "EMEF Profª Maria de Lourdes Amaral Machado", tipo: "EMEF", regiao: "Maruípe" },
  { nomeOriginal: "EMEF Otávio Manhães de Andrade", tipo: "EMEF", regiao: "Maruípe" },
  { nomeOriginal: "EMEF Profª. Veneranda Mendes dos Santos", tipo: "EMEF", regiao: "Maruípe" },
  { nomeOriginal: "EMEF Suzete Cuendet", tipo: "EMEF", regiao: "Maruípe" }
];

const ESCOLAS_JOSELMA_MIGRATION = [
  { nomeOriginal: "EMEF Adilson da Silva Castro", tipo: "EMEF", regiao: "Centro" },
  { nomeOriginal: "EMEF Álvaro Castro Mattos", tipo: "EMEF", regiao: "Centro" },
  { nomeOriginal: "EMEF Antonio José Rodrigues", tipo: "EMEF", regiao: "Centro" },
  { nomeOriginal: "EMEF Andyara Sant'Anna", tipo: "EMEF", regiao: "Centro" },
  { nomeOriginal: "EMEF Lizete Bernardo", tipo: "EMEF", regiao: "Centro" },
  { nomeOriginal: "EMEF Janira Ferreira Pessoa", tipo: "EMEF", regiao: "Centro" },
  { nomeOriginal: "EMEF Milenium", tipo: "EMEF", regiao: "Centro" },
  { nomeOriginal: "EMEF Padre Paviotti", tipo: "EMEF", regiao: "Centro" },
  { nomeOriginal: "EMEF Santulla Alvarenga", tipo: "EMEF", regiao: "Centro" },
  { nomeOriginal: "EMEF Tancredo de Almeida Neves", tipo: "EMEF", regiao: "Centro" }
];

const ESCOLAS_SILVIA_MIGRATION = [
  { nomeOriginal: "CMEI Nossa Senhora da Penha", tipo: "CMEI", regiao: "Centro" },
  { nomeOriginal: "CMEI Vovó Benta", tipo: "CMEI", regiao: "Centro" },
  { nomeOriginal: "CMEI Renascer", tipo: "CMEI", regiao: "Centro" },
  { nomeOriginal: "CMEI Independência", tipo: "CMEI", regiao: "Centro" },
  { nomeOriginal: "CMEI Eliane Rodrigues dos Santos", tipo: "CMEI", regiao: "Centro" },
  { nomeOriginal: "CMEI Luiz Cláudio Monteiro de Souza", tipo: "CMEI", regiao: "Centro" },
  { nomeOriginal: "CMEI Frahia Jacob", tipo: "CMEI", regiao: "Centro" },
  { nomeOriginal: "CMEI Violeta", tipo: "CMEI", regiao: "Centro" },
  { nomeOriginal: "CMEI Criança Feliz", tipo: "CMEI", regiao: "Centro" },
  { nomeOriginal: "CMEI Alice Holz Acre", tipo: "CMEI", regiao: "Centro" },
  { nomeOriginal: "CMEI Helena Aguiar Pimentel", tipo: "CMEI", regiao: "Centro" }
];

// Mapa completo de escolas por técnico
// SOMENTE técnicos que existem no banco de dados
const ESCOLAS_POR_TECNICO_MIGRATION = {
  darison: ESCOLAS_DARISON_MIGRATION,
  libna: ESCOLAS_LIBNA_MIGRATION,
  rosangela: ESCOLAS_ROSANGELA_MIGRATION,
  carla: ESCOLAS_CARLA_MARIA_MIGRATION
  
  // REMOVIDOS (não existem usuários no banco):
  // amelinha: ESCOLAS_AMELINHA_MIGRATION,
  // joselma: ESCOLAS_JOSELMA_MIGRATION,
  // silvia: ESCOLAS_SILVIA_MIGRATION
};

// ========================================
// FUNÇÕES DE MIGRAÇÃO
// ========================================

/**
 * Busca ID do usuário pelo email
 */
async function buscarUserId(email) {
  try {
    const APPS_SCRIPT_URL = typeof CONFIG !== 'undefined' ? CONFIG.APPS_SCRIPT_AUTH : null;
    
    if (!APPS_SCRIPT_URL) {
      throw new Error('CONFIG.APPS_SCRIPT_AUTH não definido. Execute este script no browser após fazer login.');
    }

    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'data=' + encodeURIComponent(JSON.stringify({
        action: 'list_users'
      }))
    });

    if (!response.ok) {
      throw new Error('Erro na requisição: ' + response.status);
    }

    const resultado = await response.json();

    if (!resultado.sucesso) {
      throw new Error(resultado.mensagem || 'Erro ao buscar usuários');
    }

    const usuario = resultado.data.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!usuario) {
      throw new Error(`Usuário não encontrado: ${email}`);
    }

    return usuario.id;

  } catch (erro) {
    console.error(`Erro ao buscar user_id para ${email}:`, erro);
    return null;
  }
}

/**
 * Migra escolas de um técnico para o Supabase
 */
async function migrarEscolasTecnico(tecnicoKey, escolas) {
  try {
    const tecnicoInfo = TECNICOS_MAP[tecnicoKey];
    
    if (!tecnicoInfo) {
      console.error(`❌ Técnico não encontrado no mapa: ${tecnicoKey}`);
      return { sucesso: false, erro: 'Técnico não mapeado' };
    }

    // Busca user_id se não estiver setado
    if (!tecnicoInfo.user_id) {
      console.log(`🔍 Buscando user_id para ${tecnicoInfo.nome} (${tecnicoInfo.email})...`);
      tecnicoInfo.user_id = await buscarUserId(tecnicoInfo.email);
      
      if (!tecnicoInfo.user_id) {
        return {
          sucesso: false,
          erro: `Usuário não encontrado no banco: ${tecnicoInfo.email}. Crie o usuário primeiro!`
        };
      }
      
      console.log(`✅ User ID encontrado: ${tecnicoInfo.user_id}`);
    }

    // Formata payload para o backend
    const escolasFormatadas = escolas.map(escola => ({
      school_name: escola.nomeOriginal,
      school_type: escola.tipo,
      school_region: escola.regiao
    }));

    console.log(`📤 Enviando ${escolasFormatadas.length} escolas para ${tecnicoInfo.nome}...`);
    
    // Debug: mostra primeira escola como exemplo
    console.log(`📝 Exemplo de escola:`, escolasFormatadas[0]);
    console.log(`👤 User ID: ${tecnicoInfo.user_id}`);
    console.log(`🔑 Caller: ${sessionStorage.getItem('userRole')} (${sessionStorage.getItem('userId')})`);

    const APPS_SCRIPT_URL = typeof CONFIG !== 'undefined' ? CONFIG.APPS_SCRIPT_AUTH : null;
    
    if (!APPS_SCRIPT_URL) {
      throw new Error('CONFIG.APPS_SCRIPT_AUTH não definido');
    }

    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'data=' + encodeURIComponent(JSON.stringify({
        action: 'save_technician_schools',
        user_id: tecnicoInfo.user_id,
        schools: escolasFormatadas,
        caller_role: sessionStorage.getItem('userRole') || 'superuser',
        caller_id: sessionStorage.getItem('userId')
      }))
    });

    console.log(`📡 Status HTTP: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Erro HTTP ${response.status}:`, errorText);
      throw new Error(`Erro na requisição: ${response.status} - ${errorText.substring(0, 200)}`);
    }

    const resultado = await response.json();

    // Log completo da resposta para debug
    console.log(`📋 Resposta do backend para ${tecnicoInfo.nome}:`, JSON.stringify(resultado, null, 2));

    if (resultado.sucesso) {
      console.log(`✅ ${tecnicoInfo.nome}: ${resultado.data.total} escolas migradas`);
      return { sucesso: true, total: resultado.data.total };
    } else {
      const mensagemErro = resultado.mensagem || resultado.error || 'Erro desconhecido';
      console.error(`❌ Detalhes do erro para ${tecnicoInfo.nome}:`, resultado);
      throw new Error(mensagemErro);
    }

  } catch (erro) {
    console.error(`❌ Erro ao migrar ${tecnicoKey}:`, erro);
    return { sucesso: false, erro: erro.message };
  }
}

/**
 * FUNÇÃO PRINCIPAL - Migra todos os técnicos
 */
async function migrarEscolasParaSupabase() {
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║   MIGRAÇÃO DE ESCOLAS PARA SUPABASE           ║');
  console.log('╚════════════════════════════════════════════════╝\n');

  console.log(`📊 Total de técnicos: ${Object.keys(ESCOLAS_POR_TECNICO_MIGRATION).length}`);
  console.log(`📊 Total de escolas: ${Object.values(ESCOLAS_POR_TECNICO_MIGRATION).reduce((sum, arr) => sum + arr.length, 0)}\n`);

  const resultados = [];

  for (const [tecnicoKey, escolas] of Object.entries(ESCOLAS_POR_TECNICO_MIGRATION)) {
    console.log(`\n🔄 Processando: ${tecnicoKey.toUpperCase()}...`);
    
    const resultado = await migrarEscolasTecnico(tecnicoKey, escolas);
    resultados.push({ tecnico: tecnicoKey, ...resultado });

    // Aguarda 500ms entre requisições para não sobrecarregar
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Relatório final
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║             RELATÓRIO FINAL                    ║');
  console.log('╚════════════════════════════════════════════════╝\n');

  const sucessos = resultados.filter(r => r.sucesso);
  const falhas = resultados.filter(r => !r.sucesso);

  console.log(`✅ Sucessos: ${sucessos.length}/${resultados.length}`);
  console.log(`❌ Falhas: ${falhas.length}/${resultados.length}\n`);

  if (sucessos.length > 0) {
    console.log('📊 Detalhes dos sucessos:');
    sucessos.forEach(r => {
      console.log(`  - ${r.tecnico}: ${r.total} escolas`);
    });
  }

  if (falhas.length > 0) {
    console.log('\n⚠️ Detalhes das falhas:');
    falhas.forEach(r => {
      console.log(`  - ${r.tecnico}: ${r.erro}`);
    });
  }

  const totalMigrado = sucessos.reduce((sum, r) => sum + (r.total || 0), 0);
  console.log(`\n🎉 Total de escolas migradas: ${totalMigrado}`);

  console.log('\n═══════════════════════════════════════════════');
  console.log('PRÓXIMOS PASSOS:');
  console.log('1. Verifique o Supabase (tabela technician_schools)');
  console.log('2. Teste o modal de gerenciar escolas');
  console.log('3. Verifique se os técnicos veem suas escolas corretamente');
  console.log('═══════════════════════════════════════════════\n');

  return resultados;
}

// ========================================
// INSTRUÇÕES DE USO
// ========================================

console.log('%c╔════════════════════════════════════════════════╗', 'color: #3b82f6; font-weight: bold;');
console.log('%c║  SCRIPT DE MIGRAÇÃO DE ESCOLAS - CARREGADO     ║', 'color: #3b82f6; font-weight: bold;');
console.log('%c╚════════════════════════════════════════════════╝', 'color: #3b82f6; font-weight: bold;');
console.log('\n%cPara iniciar a migração, execute:', 'color: #10b981; font-weight: bold;');
console.log('%c  migrarEscolasParaSupabase()', 'color: #fbbf24; font-weight: bold; font-size: 14px;');
console.log('\n%c⚠️ ATENÇÃO: Execute apenas UMA VEZ!', 'color: #ef4444; font-weight: bold;');
console.log('%c⚠️ Certifique-se de estar logado como superuser/admin', 'color: #ef4444; font-weight: bold;');
console.log('\n');

// Exporta função para uso em Node.js (se aplicável)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { migrarEscolasParaSupabase };
}
