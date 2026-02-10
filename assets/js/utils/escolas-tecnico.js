/**
 * SISTEMA DE MAPEAMENTO DE ESCOLAS POR TÉCNICO - NAAM
 *
 * Responsabilidades:
 * - Mapear escolas por técnico
 * - Associar cada escola a uma região
 * - Fornecer funções para filtrar escolas baseado no usuário logado
 *
 * @version 1.0.0
 * @author Sistema NAAM
 */

window.NAVMEscolasTecnico = (function() {
  'use strict';

  // ========================================
  // ESCOLAS POR TÉCNICO (com região)
  // ========================================

  const ESCOLAS_AMELINHA = [
    { nomeOriginal: "EMEF Aristóbulo Barbosa Leão", tipo: "EMEF", regiao: "Forte São João" },
    { nomeOriginal: "EMEF Alvimar Silva", tipo: "EMEF", regiao: "Santo Antônio" },
    { nomeOriginal: "EMEF Anacleta Schneider Lucas", tipo: "EMEF", regiao: "Forte São João" },
    { nomeOriginal: "EMEF EJA PROF Admardo Serafim de Oliveira", tipo: "EMEF", regiao: "Santo Antônio" },
    { nomeOriginal: "EMEF Ceciliano Abel de Almeida", tipo: "EMEF", regiao: "Maruípe" },
    { nomeOriginal: "CMEI Dr Denizart Santos", tipo: "CMEI", regiao: "Centro" },
    { nomeOriginal: "EMEF Edna de Mattos Siqueira Gáudio", tipo: "EMEF", regiao: "Centro" },
    { nomeOriginal: "CMEI Ernestina Pessoa", tipo: "CMEI", regiao: "Centro" },
    { nomeOriginal: "EMEF Irma Jacinta Soares de Souza Lima", tipo: "EMEF", regiao: "Forte São João" },
    { nomeOriginal: "EMEF Izaura Marques da Silva", tipo: "EMEF", regiao: "Maruípe" },
    { nomeOriginal: "EMEF Prof. Joao Bandeira", tipo: "EMEF", regiao: "Maruípe" },
    { nomeOriginal: "CMEI TI Luiza Pereira Muniz Correa", tipo: "CMEI", regiao: "Santo Antônio" },
    { nomeOriginal: "EMEF Mauro Braga", tipo: "EMEF", regiao: "Centro" },
    { nomeOriginal: "CMEITI Menino Jesus", tipo: "CMEI", regiao: "Centro" },
    { nomeOriginal: "EMEF São Vicente de Paulo", tipo: "EMEF", regiao: "Centro" }
  ];

  const ESCOLAS_LIBNA = [
    { nomeOriginal: "EMEF Jose Aureo Monjardim", tipo: "EMEF", regiao: "Maruípe" },
    { nomeOriginal: "CMEI Magnólia Dias Miranda Cunha", tipo: "CMEI", regiao: "São Pedro" },
    { nomeOriginal: "EMEF Marieta Escobar", tipo: "EMEF", regiao: "Maruípe" },
    { nomeOriginal: "EMEF Maria Jose Costa Moraes", tipo: "EMEF", regiao: "São Pedro" },
    { nomeOriginal: "CMEI Maria Nazareth Menegueli", tipo: "CMEI", regiao: "Maruípe" },
    { nomeOriginal: "EMEF Neusa Nunes Goncalves", tipo: "EMEF", regiao: "São Pedro" },
    { nomeOriginal: "EMEF Otto Ewald Junior", tipo: "EMEF", regiao: "Maruípe" },
    { nomeOriginal: "CMEI Odila Simões", tipo: "CMEI", regiao: "Centro" },
    { nomeOriginal: "EMEF Rita de Cassia Oliveira", tipo: "EMEF", regiao: "Maruípe" },
    { nomeOriginal: "CMEI Robson Jose Nassur Peixoto", tipo: "CMEI", regiao: "Forte São João" },
    { nomeOriginal: "EMEF Ronaldo Soares", tipo: "EMEF", regiao: "São Pedro" },
    { nomeOriginal: "EMEF Suzete Cuendet", tipo: "EMEF", regiao: "Maruípe" },
    { nomeOriginal: "CMEI Silvanete da Silva Rosa Rocha", tipo: "CMEI", regiao: "São Pedro" },
    { nomeOriginal: "EMEF Vercenílio da Silva Pascoal", tipo: "EMEF", regiao: "São Pedro" },
    { nomeOriginal: "CMEI Yolanda Lucas da Silva", tipo: "CMEI", regiao: "Santo Antônio" }
  ];

  const ESCOLAS_ROSANGELA = [
    { nomeOriginal: "EMEF Adão Benezath", tipo: "EMEF", regiao: "Continental" },
    { nomeOriginal: "EMEF Amilton Monteiro Da Silva", tipo: "EMEF", regiao: "Santo Antônio" },
    { nomeOriginal: "EMEF Adilson da Silva Castro", tipo: "EMEF", regiao: "Forte São João" },
    { nomeOriginal: "EMEF Adevalni Sysesmundo Ferreira De Azavedo", tipo: "EMEF", regiao: "Continental" },
    { nomeOriginal: "CMEI Cecilia Meireles", tipo: "CMEI", regiao: "Forte São João" },
    { nomeOriginal: "CMEI Darcy Vargas", tipo: "CMEI", regiao: "Santo Antônio" },
    { nomeOriginal: "CMEI Eldina Maria Soares Braga", tipo: "CMEI", regiao: "Santo Antônio" },
    { nomeOriginal: "EMEF Elzira Vivacqua dos Santos", tipo: "EMEF", regiao: "Continental" },
    { nomeOriginal: "CMEI Geisla da Cruz Militão", tipo: "CMEI", regiao: "São Pedro" },
    { nomeOriginal: "CMEI Jacyntha Ferreira de Souza Simões TI", tipo: "CMEI", regiao: "Continental" },
    { nomeOriginal: "EMEF Jose Lemos de Miranda TI", tipo: "EMEF", regiao: "Maruípe" },
    { nomeOriginal: "EMEF Moacyr Avidos", tipo: "EMEF", regiao: "Centro" },
    { nomeOriginal: "EMEF Marechal Mascarenhas de Moraes", tipo: "EMEF", regiao: "Continental" },
    { nomeOriginal: "EMEF Orlandina D Almeida Lucas", tipo: "EMEF", regiao: "Maruípe" },
    { nomeOriginal: "CMEI Rubens Duarte de Albuquerque", tipo: "CMEI", regiao: "Maruípe" },
    { nomeOriginal: "CMEI Rubens Jose Vervloet Gomes", tipo: "CMEI", regiao: "Continental" }
  ];

  const ESCOLAS_DARISON = [
    { nomeOriginal: "CMEI Professor Carlos Alberto Martinelli de Souza", tipo: "CMEI", regiao: "Maruípe" },
    { nomeOriginal: "CMEI Darcy Castello de Mendonça", tipo: "CMEI", regiao: "Continental" },
    { nomeOriginal: "EMEF Francisco Lacerda de Aguiar", tipo: "EMEF", regiao: "São Pedro" },
    { nomeOriginal: "CMEI Laurentina Mendonça Correa", tipo: "CMEI", regiao: "Maruípe" },
    { nomeOriginal: "CMEI Lidia Rocha Feitosa", tipo: "CMEI", regiao: "Maruípe" },
    { nomeOriginal: "CMEI Maria Goretti Coutinho Cosme", tipo: "CMEI", regiao: "Maruípe" },
    { nomeOriginal: "CMEI Nelcy da Silva Braga", tipo: "CMEI", regiao: "Maruípe" },
    { nomeOriginal: "EMEF Octacílio Lomba", tipo: "EMEF", regiao: "Maruípe" },
    { nomeOriginal: "CMEI Professora Cida Barreto", tipo: "CMEI", regiao: "Continental" },
    { nomeOriginal: "CMEI Doutor Pedro Feu Rosa", tipo: "CMEI", regiao: "Maruípe" },
    { nomeOriginal: "CMEI Padre Giovanni Bartesaghi", tipo: "CMEI", regiao: "São Pedro" },
    { nomeOriginal: "EMEF Padre Guido Ceotto", tipo: "EMEF", regiao: "Jardim Camburi" },
    { nomeOriginal: "CMEI DR Thomaz Tommasi TI", tipo: "CMEI", regiao: "Maruípe" },
    { nomeOriginal: "UFES", tipo: "EMEF", regiao: "Continental" },
    { nomeOriginal: "CMEI Valdívia da Penha Antunes Rodrigues", tipo: "CMEI", regiao: "Maruípe" }
  ];

  const ESCOLAS_CARLA_MARIA = [
    { nomeOriginal: "EMEF Álvaro de Castro Mattos", tipo: "EMEF", regiao: "Continental" },
    { nomeOriginal: "CMEI Anisio Spinola Teixeira", tipo: "CMEI", regiao: "São Pedro" },
    { nomeOriginal: "CMEI Carlita Correa Pereira", tipo: "CMEI", regiao: "Centro" },
    { nomeOriginal: "CMEI Gilda De Athayde Ramos", tipo: "CMEI", regiao: "São Pedro" },
    { nomeOriginal: "EMEF Custódia Dias de Campos", tipo: "EMEF", regiao: "Maruípe" },
    { nomeOriginal: "CMEI Dom João Batista Da Motta E Albuquerque", tipo: "CMEI", regiao: "Forte São João" },
    { nomeOriginal: "CMEI Ocarlina Nunes Andrade", tipo: "CMEI", regiao: "Maruípe" },
    { nomeOriginal: "EMEF Regina Maria Silva", tipo: "EMEF", regiao: "Santo Antônio" },
    { nomeOriginal: "CMEI Reinado Ridolfi", tipo: "CMEI", regiao: "Continental" },
    { nomeOriginal: "CMEITI Sebastião Perovano", tipo: "CMEI", regiao: "Continental" },
    { nomeOriginal: "CMEI Terezinha Vasconcellos Salvador", tipo: "CMEI", regiao: "Forte São João" },
    { nomeOriginal: "EMEF Zilda Andrade", tipo: "EMEF", regiao: "Maruípe" },
    { nomeOriginal: "CMEI Zilmar Alves de Melo", tipo: "CMEI", regiao: "São Pedro" },
    { nomeOriginal: "CMEI Zenaide Genoveva Marcarine Cavalcanti", tipo: "CMEI", regiao: "Continental" },
    { nomeOriginal: "CMEI Zélia Viana de Aguiar", tipo: "CMEI", regiao: "Forte São João" }
  ];

  const ESCOLAS_JOSELMA = [
    { nomeOriginal: "EMEF Alberto de Almeida", tipo: "EMEF", regiao: "Santo Antônio" },
    { nomeOriginal: "CMEI Ana Maria Chaves Colares", tipo: "CMEI", regiao: "Continental" },
    { nomeOriginal: "EMEF Eber Louzada Zippinotti", tipo: "EMEF", regiao: "Continental" },
    { nomeOriginal: "EMEF Eunice Pereira Silveira TI", tipo: "EMEF", regiao: "Maruípe" },
    { nomeOriginal: "EMEF Eliane Rodrigues dos Santos", tipo: "EMEF", regiao: "São Pedro" },
    { nomeOriginal: "CMEI Georgina Trindade de Faria", tipo: "CMEI", regiao: "São Pedro" },
    { nomeOriginal: "EMEF Maria Leonor Pereira Da Silva", tipo: "EMEF", regiao: "Forte São João" },
    { nomeOriginal: "EMEF Paulo Reglus Neves Freire", tipo: "EMEF", regiao: "Santo Antônio" },
    { nomeOriginal: "CMEI Rubem Braga", tipo: "CMEI", regiao: "Forte São João" },
    { nomeOriginal: "EMEF Tancredo de Almeida Neves", tipo: "EMEF", regiao: "São Pedro" }
  ];

  const ESCOLAS_SILVIA = [
    { nomeOriginal: "EMEF Arthur da Costa e Silva", tipo: "EMEF", regiao: "Maruípe" },
    { nomeOriginal: "CMEI Alvaro Fernandes Lima", tipo: "CMEI", regiao: "Santo Antônio" },
    { nomeOriginal: "EMEF Heloisa Abreu Júdice de Mattos", tipo: "EMEF", regiao: "Santo Antônio" },
    { nomeOriginal: "EMEF Juscelino Kubitschek de Oliveira", tipo: "EMEF", regiao: "Continental" },
    { nomeOriginal: "EMEF Lenir Borlot", tipo: "EMEF", regiao: "São Pedro" },
    { nomeOriginal: "EMEF Maria Stella de Novaes", tipo: "EMEF", regiao: "Santo Antônio" },
    { nomeOriginal: "EMEF Prezideu Amorim", tipo: "EMEF", regiao: "Maruípe" },
    { nomeOriginal: "EMEF Padre Anchieta", tipo: "EMEF", regiao: "Forte São João" },
    { nomeOriginal: "EMEF Paulo Roberto Vieira Gomes", tipo: "EMEF", regiao: "Maruípe" },
    { nomeOriginal: "CMEI Professora Sophia Musenginy Loureiro", tipo: "CMEI", regiao: "Maruípe" },
    { nomeOriginal: "EMEF Maria Madalena Oliveira Domingues", tipo: "EMEF", regiao: "Continental" }
  ];

  // ========================================
  // LISTA COMPLETA DE TODAS AS ESCOLAS
  // ========================================
  const TODAS_ESCOLAS = [
    ...ESCOLAS_AMELINHA,
    ...ESCOLAS_LIBNA,
    ...ESCOLAS_ROSANGELA,
    ...ESCOLAS_DARISON,
    ...ESCOLAS_CARLA_MARIA,
    ...ESCOLAS_JOSELMA,
    ...ESCOLAS_SILVIA
  ];

  // ========================================
  // MAPEAMENTO TÉCNICO -> ESCOLAS
  // ========================================
  const ESCOLAS_POR_TECNICO = {
    'amelinha': ESCOLAS_AMELINHA,
    'libna': ESCOLAS_LIBNA,
    'rosangela': ESCOLAS_ROSANGELA,
    'darison': ESCOLAS_DARISON,
    'carla': ESCOLAS_CARLA_MARIA,
    'maria': ESCOLAS_CARLA_MARIA,  // Alias para Carla/Maria
    'joselma': ESCOLAS_JOSELMA,
    'silvia': ESCOLAS_SILVIA
  };

  // ========================================
  // FUNÇÕES AUXILIARES
  // ========================================

  /**
   * Normaliza texto para comparação (lowercase, trim, remove acentos)
   * @param {string} texto
   * @returns {string}
   */
  function normalizar(texto) {
    if (!texto) return '';
    return texto
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  /**
   * Identifica o técnico pelo nome diretamente
   * @param {string} nome - Nome do usuário (ex: "Darison")
   * @returns {string|null} Chave do técnico ou null
   */
  function identificarTecnicoPorNome(nome) {
    if (!nome) return null;

    const nomeNorm = normalizar(nome);

    // Busca exata primeiro
    for (const tecnico of Object.keys(ESCOLAS_POR_TECNICO)) {
      if (nomeNorm === tecnico) {
        return tecnico;
      }
    }

    // Busca parcial (nome contém tecnico ou tecnico contém nome)
    for (const tecnico of Object.keys(ESCOLAS_POR_TECNICO)) {
      if (nomeNorm.includes(tecnico) || tecnico.includes(nomeNorm)) {
        return tecnico;
      }
    }

    // Busca por início do nome
    for (const tecnico of Object.keys(ESCOLAS_POR_TECNICO)) {
      if (nomeNorm.startsWith(tecnico.substring(0, 4)) || tecnico.startsWith(nomeNorm.substring(0, 4))) {
        return tecnico;
      }
    }

    return null;
  }

  /**
   * Identifica o técnico pelo email
   * Extrai a primeira parte do email antes do @
   * @param {string} email - Email do usuário
   * @returns {string|null} Nome do técnico ou null
   */
  function identificarTecnico(email) {
    if (!email) return null;

    // Extrai a primeira parte do email (antes do @)
    const partes = email.split('@');
    if (partes.length === 0) return null;

    const nomeEmail = normalizar(partes[0]);

    // Verifica se corresponde a algum técnico conhecido
    for (const tecnico of Object.keys(ESCOLAS_POR_TECNICO)) {
      if (nomeEmail.includes(tecnico) || tecnico.includes(nomeEmail)) {
        return tecnico;
      }
    }

    // Tentativa de match parcial
    for (const tecnico of Object.keys(ESCOLAS_POR_TECNICO)) {
      if (nomeEmail.startsWith(tecnico.substring(0, 4))) {
        return tecnico;
      }
    }

    return null;
  }

  /**
   * Verifica se o usuário pode ver todas as escolas (toggle)
   * @param {string} role - Cargo do usuário
   * @returns {boolean}
   */
  function podeVerTodasEscolas(role) {
    // Apenas técnicos têm o botão de toggle
    return role === 'tecnico';
  }

  /**
   * Verifica se o usuário é estagiário
   * @param {string} role - Cargo do usuário
   * @returns {boolean}
   */
  function isEstagiario(role) {
    return role === 'estagiario' || role === 'user';
  }

  /**
   * Obtém escolas disponíveis para o usuário
   * @param {string} emailOuNome - Email ou nome do usuário
   * @param {string} role - Cargo do usuário (tecnico, estagiario, user, admin, superuser)
   * @param {boolean} verTodas - Se deve mostrar todas escolas (toggle)
   * @param {string} [nome] - Nome do usuário (opcional, priorizado sobre email)
   * @returns {Array} Array de escolas filtradas
   */
  function getEscolasUsuario(emailOuNome, role, verTodas = false, nome = null) {
    // Estagiários sempre veem todas
    if (isEstagiario(role)) {
      console.log('[EscolasTecnico] Estagiário identificado - mostrando todas as escolas');
      return [...TODAS_ESCOLAS].sort((a, b) => a.nomeOriginal.localeCompare(b.nomeOriginal));
    }

    // Admin e superuser também veem todas
    if (role === 'admin' || role === 'superuser') {
      console.log('[EscolasTecnico] Admin/Superuser identificado - mostrando todas as escolas');
      return [...TODAS_ESCOLAS].sort((a, b) => a.nomeOriginal.localeCompare(b.nomeOriginal));
    }

    // Técnicos
    if (role === 'tecnico') {
      // Se pediu para ver todas
      if (verTodas) {
        console.log('[EscolasTecnico] Toggle "Ver Todas" ativo - mostrando todas as escolas');
        return [...TODAS_ESCOLAS].sort((a, b) => a.nomeOriginal.localeCompare(b.nomeOriginal));
      }

      // PRIORIDADE 1: Identifica pelo nome (mais confiável)
      let tecnico = null;
      if (nome) {
        tecnico = identificarTecnicoPorNome(nome);
        if (tecnico) {
          console.log(`[EscolasTecnico] Técnico identificado pelo NOME: "${nome}" -> ${tecnico}`);
        }
      }

      // PRIORIDADE 2: Tenta pelo email
      if (!tecnico && emailOuNome) {
        tecnico = identificarTecnico(emailOuNome);
        if (tecnico) {
          console.log(`[EscolasTecnico] Técnico identificado pelo EMAIL: "${emailOuNome}" -> ${tecnico}`);
        }
      }

      // PRIORIDADE 3: Tenta o primeiro parâmetro como nome direto
      if (!tecnico && emailOuNome && !emailOuNome.includes('@')) {
        tecnico = identificarTecnicoPorNome(emailOuNome);
        if (tecnico) {
          console.log(`[EscolasTecnico] Técnico identificado pelo parâmetro como NOME: "${emailOuNome}" -> ${tecnico}`);
        }
      }

      if (tecnico && ESCOLAS_POR_TECNICO[tecnico]) {
        const escolas = [...ESCOLAS_POR_TECNICO[tecnico]].sort((a, b) => a.nomeOriginal.localeCompare(b.nomeOriginal));
        console.log(`[EscolasTecnico] Retornando ${escolas.length} escolas para técnico ${tecnico}`);
        return escolas;
      }

      // Se não encontrou o técnico, NÃO faz fallback automático - retorna array vazio para evitar mostrar todas
      console.warn(`[EscolasTecnico] Técnico não identificado para: email="${emailOuNome}", nome="${nome}". Retornando lista vazia.`);
      return [];
    }

    // Outros roles (visualizador) - todas as escolas
    return [...TODAS_ESCOLAS].sort((a, b) => a.nomeOriginal.localeCompare(b.nomeOriginal));
  }

  /**
   * Obtém a região de uma escola pelo nome
   * @param {string} nomeEscola - Nome da escola
   * @returns {string|null} Região da escola ou null
   */
  function getRegiaoEscola(nomeEscola) {
    if (!nomeEscola) return null;

    const nomeNorm = normalizar(nomeEscola);

    // Busca exata primeiro
    for (const escola of TODAS_ESCOLAS) {
      if (normalizar(escola.nomeOriginal) === nomeNorm) {
        return escola.regiao;
      }
    }

    // Busca parcial (contém)
    for (const escola of TODAS_ESCOLAS) {
      const escolaNorm = normalizar(escola.nomeOriginal);
      if (escolaNorm.includes(nomeNorm) || nomeNorm.includes(escolaNorm)) {
        return escola.regiao;
      }
    }

    return null;
  }

  /**
   * Obtém o técnico responsável por uma escola
   * @param {string} nomeEscola - Nome da escola
   * @returns {string|null} Nome do técnico ou null
   */
  function getTecnicoResponsavel(nomeEscola) {
    if (!nomeEscola) return null;

    const nomeNorm = normalizar(nomeEscola);

    for (const [tecnico, escolas] of Object.entries(ESCOLAS_POR_TECNICO)) {
      for (const escola of escolas) {
        if (normalizar(escola.nomeOriginal) === nomeNorm) {
          return tecnico.charAt(0).toUpperCase() + tecnico.slice(1);
        }
      }
    }

    return null;
  }

  /**
   * Obtém lista de regiões disponíveis
   * @returns {Array} Array de regiões únicas
   */
  function getRegioes() {
    const regioes = new Set();
    TODAS_ESCOLAS.forEach(e => regioes.add(e.regiao));
    return Array.from(regioes).sort();
  }

  /**
   * Filtra escolas por tipo (CMEI ou EMEF)
   * @param {Array} escolas - Array de escolas
   * @param {string} tipo - "CMEI" ou "EMEF"
   * @returns {Array} Escolas filtradas
   */
  function filtrarPorTipo(escolas, tipo) {
    if (!tipo) return escolas;
    return escolas.filter(e => e.tipo === tipo);
  }

  /**
   * Filtra escolas por região
   * @param {Array} escolas - Array de escolas
   * @param {string} regiao - Nome da região
   * @returns {Array} Escolas filtradas
   */
  function filtrarPorRegiao(escolas, regiao) {
    if (!regiao) return escolas;
    return escolas.filter(e => e.regiao === regiao);
  }

  // ========================================
  // API PÚBLICA
  // ========================================
  return {
    // Funções principais
    getEscolasUsuario,
    getRegiaoEscola,
    identificarTecnico,
    identificarTecnicoPorNome,  // Nova função para identificar pelo nome
    podeVerTodasEscolas,
    getTecnicoResponsavel,

    // Funções auxiliares
    getRegioes,
    filtrarPorTipo,
    filtrarPorRegiao,
    isEstagiario,

    // Dados
    TODAS_ESCOLAS,
    ESCOLAS_POR_TECNICO
  };
})();

// Log de inicialização
console.log('[EscolasTecnico] Módulo carregado. Total de escolas:', window.NAVMEscolasTecnico.TODAS_ESCOLAS.length);
