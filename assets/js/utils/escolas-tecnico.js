/**
 * SISTEMA DE MAPEAMENTO DE ESCOLAS POR TÉCNICO - NAAM
 *
 * Responsabilidades:
 * - Mapear escolas por técnico (Supabase + fallback hardcoded)
 * - Associar cada escola a uma região
 * - Fornecer funções para filtrar escolas baseado no usuário logado
 *
 * @version 2.0.0 - Integração com Supabase
 * @author Sistema NAAM
 */

window.NAVMEscolasTecnico = (function () {
  'use strict';

  // ========================================
  // CACHE E ESTADO
  // ========================================
  let escolasPorTecnicoDB = null; // Cache do Supabase (agrupado por tecnico)
  let todasEscolasDB = null;      // TODAS as escolas do DB (para "Ver Todas")
  let cacheCarregado = false;
  let usandoFallback = false;

  // ========================================
  // ESCOLAS POR TÉCNICO (FALLBACK HARDCODED)
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
    { nomeOriginal: "EMEF Arthur da Costa e Silva", tipo: "EMEF", regiao: "Centro" },
    { nomeOriginal: "CMEI Alvaro Fernandes Lima", tipo: "CMEI", regiao: "Centro" },
    { nomeOriginal: "EMEF Heloisa Abreu Júdice de Mattos", tipo: "EMEF", regiao: "Centro" },
    { nomeOriginal: "EMEF Juscelino Kubitschek de Oliveira", tipo: "EMEF", regiao: "Centro" },
    { nomeOriginal: "EMEF Lenir Borlot", tipo: "EMEF", regiao: "Centro" },
    { nomeOriginal: "EMEF Maria Madalena Oliveira Domingues", tipo: "EMEF", regiao: "Centro" },
    { nomeOriginal: "EMEF Maria Stella de Novaes", tipo: "EMEF", regiao: "Centro" },
    { nomeOriginal: "EMEF Prezideu Amorim", tipo: "EMEF", regiao: "Centro" },
    { nomeOriginal: "EMEF Padre Anchieta", tipo: "EMEF", regiao: "Centro" },
    { nomeOriginal: "EMEF Paulo Roberto Vieira Gomes", tipo: "EMEF", regiao: "Centro" },
    { nomeOriginal: "CMEI Professora Sophia Musenginy Loureiro", tipo: "CMEI", regiao: "Centro" }
  ];

  const ESCOLAS_KATIANE = [
    { nomeOriginal: "EMEF Maria Jose Costa Moraes", tipo: "EMEF", regiao: "Maruípe" },
    { nomeOriginal: "EMEF Vercenílio da Silva Pascoal", tipo: "EMEF", regiao: "Maruípe" },
    { nomeOriginal: "EMEF Edna de Mattos Siqueira Gáudio", tipo: "EMEF", regiao: "Maruípe" },
    { nomeOriginal: "EMEF Prof. Joao Bandeira", tipo: "EMEF", regiao: "Maruípe" },
    { nomeOriginal: "CMEI Doutor Pedro Feu Rosa", tipo: "CMEI", regiao: "Maruípe" },
    { nomeOriginal: "CMEI Terezinha Vasconcellos Salvador", tipo: "CMEI", regiao: "Maruípe" },
    { nomeOriginal: "CMEI Zilmar Alves de Melo", tipo: "CMEI", regiao: "Maruípe" }
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
    ...ESCOLAS_SILVIA,
    ...ESCOLAS_KATIANE
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
    'silvia': ESCOLAS_SILVIA,
    'katiane': ESCOLAS_KATIANE
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

  function normalizarEscola(escola) {
    if (!escola) return null;

    const nomeOriginal = escola.nomeOriginal || escola.school_name || '';
    const tipo = escola.tipo || escola.school_type || '';

    return {
      ...escola,
      nomeOriginal,
      tipo,
      regiao: escola.regiao || escola.school_region || '',
      sigla: escola.sigla || escola.school_sigla || '',
      ti: escola.ti === true || escola.TI === true,
      eja: escola.eja === true || escola.EJA === true
    };
  }

  function normalizarListaEscolas(escolas) {
    if (!Array.isArray(escolas)) return [];
    return escolas.map(normalizarEscola).filter(Boolean);
  }

  function normalizarMapaEscolasPorTecnico(mapa) {
    if (!mapa || typeof mapa !== 'object') return {};

    const normalizado = {};
    Object.keys(mapa).forEach(chave => {
      normalizado[chave] = normalizarListaEscolas(mapa[chave]);
    });

    return normalizado;
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
  async function getEscolasUsuario(emailOuNome, role, verTodas = false, nome = null) {
    const sortEscolas = (arr) => [...arr].sort((a, b) => {
      const nomeA = (a && a.nomeOriginal) ? a.nomeOriginal : '';
      const nomeB = (b && b.nomeOriginal) ? b.nomeOriginal : '';
      return nomeA.localeCompare(nomeB);
    });

    // Helper: retorna todas escolas do DB, aguardando cache se necessario
    async function getTodasEscolas() {
      // Se DB ja carregado, usa direto
      if (todasEscolasDB && todasEscolasDB.length > 0) {
        console.log(`[Escolas] Usando ${todasEscolasDB.length} escolas do banco de dados`);
        return todasEscolasDB;
      }
      // Tenta carregar o cache do Supabase agora
      if (!cacheCarregado) {
        console.log('[Escolas] Cache nao carregado para getTodasEscolas, carregando agora...');
        await carregarEscolasDeSupabase();
      }
      // Verifica novamente apos carregamento
      if (todasEscolasDB && todasEscolasDB.length > 0) {
        console.log(`[Escolas] Usando ${todasEscolasDB.length} escolas do banco de dados (pos-cache)`);
        return todasEscolasDB;
      }
      // Fallback: usa lista hardcoded como ultima opcao
      const completas = getTodasEscolasCompletas();
      console.warn(`[Escolas] DB indisponivel, usando ${completas.length} escolas hardcoded como fallback`);
      return completas;
    }

    // Estagiarios sempre veem todas
    if (isEstagiario(role)) {
      return sortEscolas(await getTodasEscolas());
    }

    // Admin e superuser tambem veem todas
    if (role === 'admin' || role === 'superuser') {
      return sortEscolas(await getTodasEscolas());
    }

    // Tecnicos
    if (role === 'tecnico') {
      // Se pediu para ver todas
      if (verTodas) {
        return sortEscolas(await getTodasEscolas());
      }

      // ========================================
      // PRIORIDADE 1: Cache Supabase ja carregado
      // ========================================
      if (cacheCarregado && !usandoFallback && escolasPorTecnicoDB) {
        const escolasDB = getEscolasDoCache(nome || emailOuNome);
        if (escolasDB && escolasDB.length > 0) {
          console.log(`[Escolas] Cache: ${escolasDB.length} escolas de "${nome || emailOuNome}"`);
          return sortEscolas(escolasDB);
        }
        console.warn(`[Escolas] Cache ativo mas tecnico nao encontrado: "${nome || emailOuNome}"`);
      }

      // ========================================
      // PRIORIDADE 2: Tenta carregar cache agora
      // ========================================
      if (!cacheCarregado) {
        console.log('[Escolas] Cache nao carregado, tentando agora...');
        const sucesso = await carregarEscolasDeSupabase();
        if (sucesso) {
          const escolasDB = getEscolasDoCache(nome || emailOuNome);
          if (escolasDB && escolasDB.length > 0) {
            console.log(`[Escolas] Cache tardio: ${escolasDB.length} escolas`);
            return sortEscolas(escolasDB);
          }
        }
      }

      // ========================================
      // PRIORIDADE 3: Fallback hardcoded
      // ========================================
      const useHardcode = (typeof CONFIG === 'undefined' || CONFIG.USE_HARDCODED_SCHOOLS !== false);

      if (!useHardcode) {
        console.error('[Escolas] Cache falhou e hardcode desabilitado');
        mostrarErroSemEscolas();
        return [];
      }

      console.warn('[Escolas] [FALLBACK] Usando dados hardcoded');
      mostrarAvisoFallback();

      let tecnico = null;
      if (nome) {
        tecnico = identificarTecnicoPorNome(nome);
      }
      if (!tecnico && emailOuNome) {
        tecnico = identificarTecnico(emailOuNome);
      }
      if (!tecnico && emailOuNome && !emailOuNome.includes('@')) {
        tecnico = identificarTecnicoPorNome(emailOuNome);
      }

      if (tecnico && ESCOLAS_POR_TECNICO[tecnico]) {
        const escolas = ESCOLAS_POR_TECNICO[tecnico];
        console.log(`[Escolas] [HARDCODE] ${escolas.length} escolas de "${tecnico}"`);
        return sortEscolas(escolas);
      }

      console.warn(`[Escolas] Tecnico nao identificado: nome="${nome}", email="${emailOuNome}"`);
      return [];
    }

    // Outros roles (visualizador) - todas as escolas
    return sortEscolas(await getTodasEscolas());
  }

  // ========================================
  // FEEDBACK VISUAL
  // ========================================

  function mostrarAvisoFallback() {
    const existente = document.getElementById('aviso-fallback-escolas');
    if (existente) existente.remove();

    const banner = document.createElement('div');
    banner.id = 'aviso-fallback-escolas';
    banner.style.cssText = 'position:fixed;top:70px;right:16px;max-width:380px;z-index:9999;padding:12px 16px;border-radius:8px;border-left:4px solid #f59e0b;background:#fef3c7;color:#92400e;box-shadow:0 4px 12px rgba(0,0,0,0.15);font-size:13px;';
    banner.innerHTML = `
      <div style="display:flex;align-items:flex-start;gap:8px;">
        <span style="font-size:18px;flex-shrink:0;">&#9888;&#65039;</span>
        <div style="flex:1;">
          <strong>Modo Offline</strong><br>
          <span style="font-size:12px;">Usando dados locais. Escolas podem estar desatualizadas.</span>
        </div>
        <button onclick="this.closest('#aviso-fallback-escolas').remove()" style="background:none;border:none;cursor:pointer;font-size:16px;color:#92400e;">&times;</button>
      </div>`;
    document.body.appendChild(banner);
    setTimeout(() => { if (banner.parentElement) banner.remove(); }, 12000);
  }

  function mostrarErroSemEscolas() {
    const existente = document.getElementById('modal-erro-escolas');
    if (existente) existente.remove();

    const modal = document.createElement('div');
    modal.id = 'modal-erro-escolas';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:99999;';
    modal.innerHTML = `
      <div style="background:white;border-radius:12px;padding:24px;max-width:400px;width:90%;box-shadow:0 20px 40px rgba(0,0,0,0.3);">
        <h2 style="margin:0 0 12px;font-size:18px;color:#1f2937;">Escolas Indisponiveis</h2>
        <p style="color:#6b7280;font-size:14px;margin:0 0 20px;">Nao foi possivel carregar a lista de escolas do servidor. Verifique sua conexao e tente novamente.</p>
        <div style="display:flex;gap:12px;">
          <button onclick="location.reload()" style="flex:1;padding:10px;border-radius:8px;border:none;background:#3b82f6;color:white;cursor:pointer;font-weight:600;">Recarregar</button>
          <button onclick="document.getElementById('modal-erro-escolas').remove()" style="flex:1;padding:10px;border-radius:8px;border:1px solid #d1d5db;background:white;cursor:pointer;font-weight:600;color:#374151;">Fechar</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
  }

  /**
   * Obtém a região de uma escola pelo nome
   * @param {string} nomeEscola - Nome da escola
   * @returns {string|null} Região da escola ou null
   */
  function getRegiaoEscola(nomeEscola) {
    if (!nomeEscola) return null;

    const nomeNorm = normalizar(nomeEscola);

    // Prioriza dados do DB/cache se disponíveis
    if (todasEscolasDB && todasEscolasDB.length > 0) {
      for (const escola of todasEscolasDB) {
        if (normalizar(escola.nomeOriginal) === nomeNorm) {
          return escola.regiao || null;
        }
      }

      for (const escola of todasEscolasDB) {
        const escolaNorm = normalizar(escola.nomeOriginal);
        if (escolaNorm.includes(nomeNorm) || nomeNorm.includes(escolaNorm)) {
          return escola.regiao || null;
        }
      }
    }

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
  // MAPEAMENTO DE SIGLAS (CMEI e EMEF)
  // Fonte centralizada para resolução sigla→nome
  // ========================================

  const SIGLAS_CMEI = {
    'ABS': 'Adácio Bispo dos Santos TI',
    'AFL': 'Álvaro Fernandes Lima TI',
    'AMCC': 'Ana Maria Chaves Colares',
    'AST': 'Anízio Spínola Teixeira',
    'EAMS': 'Carlos Alberto Martinelli de Souza TI',
    'CCP': 'Carlita Corrêa Pereira TI',
    'CM': 'Carlos Mendes',
    'DCM': 'Darcy Castello de Mendonça',
    'JBMA': 'Dom. João Batista da Motta e Albuquerque TI',
    'DS': 'Dr. Denizart Santos TI',
    'DV': 'Darcy Vargas',
    'EMSB': 'Edlma Maria Soares Braga TTI',
    'EP': 'Ernestina Pessoa',
    'GAR': 'Gilda de Athayde Ramos',
    'GCM': 'Gisela da Cruz Militão',
    'GTF': 'Georgiana da Trindade Faria',
    'HAF': 'Hecy Alves Fraga TI',
    'JFSS': 'Jacivinha Ferreira de Souza Simões TI',
    'JPA': 'Juízo Pedro de Aguiar',
    'LCG': 'Luiz Carlos Grecco TI',
    'LMC': 'Laurentina Mendonça Corrêa',
    'LPMC': 'Luíza Pereira Muniz Corrêa TI',
    'LRF': 'Lidia Rocha Feitosa',
    'LICC': 'Lisandra Ignes Carpanedo do Carmo',
    'MUMC': 'Magnólia Dias Miranda Cunha TTI',
    'MGCC': 'Maria Goretti Coutinho Cosme TI',
    'MJ': 'Menino Jesus TI',
    'MNM': 'Maria Nazareth Menegueli TTI',
    'MDS': 'Marlene Dilande Simonetti',
    'NSB': 'Nalcyrley Silva Braga',
    'ONA': 'Oscalina Nunes Andrade',
    'OS': 'Odila Simões',
    'PCB': 'Professora Cida Barreto',
    'PFR': 'Dr. Pedro Feu Rosa',
    'PGB': 'Padre Giovanni Bartesaghi TTI',
    'RB': 'Rubem Braga',
    'RDA': 'Rubens Duarte de Albuquerque TTI',
    'RJNP': 'Robson José Nassur Peçoto TI',
    'RJVG': 'Rubens José Vervloet Gomes TI',
    'RR': 'Reinaldo Ridolfi',
    'SML': 'Professora Sophia Musengiyvi Loureiro',
    'SP': 'Sinclair Phillips',
    'SSRR': 'Silvanete da Silva Rosa Rocha TI',
    'TT': 'Thomas Tommasi TTI',
    'TVS': 'Terezinha Vasconcellos Salvador',
    'VPAR': 'Valdivia de Penna Antunes Rodrigues TI',
    'VLS': 'Yolanda Lucas da Silva',
    'ZAM': 'Zilmar Alves de Melo',
    'ZGMC': 'Zulmira Gomes Martins Marcarini Cavalcanti',
    'ZVA': 'Zélia Viana de Aguiar'
  };

  const SIGLAS_EMEF = {
    'AA': 'Alberto de Almeida',
    'AB': 'Adão Benezath',
    'ABL': 'Aristóbulo Barbosa Leão',
    'ACM': 'Álvaro de Castro Mattos',
    'ACS': 'Arthur da Costa e Silva',
    'AMS': 'Amilton Monteiro da Silva',
    'AS': 'Alvimar Silva',
    'ASC': 'Adilson da Silva Castro',
    'ASFA': 'Adevalni Sysesmundo Ferreira de Azevedo',
    'ASLC': 'Anacleta Schneider Lucas TI',
    'CAA': 'Ceciliano Abel de Almeida',
    'CB': 'Castelo Branco',
    'CDC': 'Custódia Dias de Campos',
    'EJA ASO': 'CEJA Prof. Admardo Serafim de Oliveira',
    'ELZ': 'Éber Louzada Zippinotti',
    'EMSG': 'Edna de Mattos Siqueira Gaudio TI',
    'EPS': 'Eunice Perreira Silveira TI',
    'ERS': 'Eliane Rodrigues dos Santos',
    'UFES': 'Escola Experimental de Vitória-UFES',
    'EVS': 'Elzira Vivacqua dos Santos',
    'FLA': 'Francisco Lacerda de Aguiar',
    'HAJM': 'Heloisa Abreu Júdice de Mattos',
    'IJSSL': 'Irmã Jacinta Soares de Souza Lima',
    'IMS': 'Izaura Marques da Silva TI',
    'JAM': 'José Áureo Monjardim TI',
    'JB': 'João Bandeira',
    'JKO': 'Juscelino Kubitschek de Oliveira',
    'JLM': 'José Lemos de Miranda TI',
    'LB': 'Lenir Borlot',
    'MA': 'Moacyr Avidos TI',
    'MB': 'Mauro Braga',
    'ME': 'Marieta Escobar',
    'MJCM': 'Maria José Costa Moraes',
    'MLPS': 'Maria Leonor Pereira da Silva',
    'MMM': 'Marechal Mascarenhas de Moraes',
    'MMOD': 'Maria Madalena Oliveira Domingues',
    'MSN': 'Maria Stella de Novaes',
    'NNG': 'Neusa Nunes Gonçalves',
    'ODAL': "Orlandina D'Almeida Lucas",
    'OEJ': 'Otto Ewald Júnior',
    'OL': 'Octacílio Lomba',
    'PA': 'Prezideu Amorim',
    'PAN': 'Padre Anchieta',
    'PGC': 'Padre Guido Ceotto',
    'PRNF': 'Paulo Reglus Neves Freire TI',
    'PRVG': 'Paulo Roberto Vieira Gomes',
    'RCO': 'Rita de Cássia Oliveira',
    'RMS': 'Regina Maria Silva',
    'RS': 'Ronaldo Soares',
    'SC': 'Suzete Cuendet',
    'SVP': 'São Vicente de Paulo',
    'TAN': 'Tancredo de Almeida Neves',
    'VSP': 'Vercenílio da Silva Pascoal',
    'ZA': 'Zilda Andrade'
  };

  /**
   * Constroi mapas de sigla dinamicamente a partir dos dados do banco (todasEscolasDB)
   * @returns {{ cmei: Object, emef: Object }|null} null se dados do DB indisponiveis
   */
  function buildSiglaMapsFromDB() {
    if (!todasEscolasDB || todasEscolasDB.length === 0) return null;
    const cmei = {}, emef = {};
    todasEscolasDB.forEach(e => {
      if (e.sigla) {
        const nome = e.nomeOriginal || '';
        if (e.tipo === 'CMEI') {
          // Remove prefixo "CMEI " se presente no nomeOriginal
          cmei[e.sigla] = nome.replace(/^CMEI\s+/i, '');
        } else if (e.tipo === 'EMEF') {
          emef[e.sigla] = nome.replace(/^EMEF\s+/i, '');
        }
      }
    });
    // Verifica se encontrou dados suficientes
    if (Object.keys(cmei).length === 0 && Object.keys(emef).length === 0) return null;
    console.log(`[Escolas] Sigla maps do DB: ${Object.keys(cmei).length} CMEIs, ${Object.keys(emef).length} EMEFs`);
    return { cmei, emef };
  }

  /**
   * Retorna o mapeamento completo de siglas para uso externo
   * Prioriza dados do banco de dados, fallback para hardcoded
   * @returns {{ cmei: Object, emef: Object }}
   */
  function getSiglaNomeMap() {
    const dbMap = buildSiglaMapsFromDB();
    if (dbMap) return dbMap;
    // Fallback: usa mapas hardcoded quando DB indisponivel
    console.warn('[Escolas] getSiglaNomeMap: usando mapas hardcoded (DB indisponivel)');
    return { cmei: SIGLAS_CMEI, emef: SIGLAS_EMEF };
  }

  /**
   * Identifica o tipo de instituição pela sigla
   * @param {string} sigla - Sigla da escola (ex: "AA", "ABS")
   * @returns {string|null} "CMEI", "EMEF" ou null
   */
  function getTipoInstituicaoBySigla(sigla) {
    if (!sigla) return null;
    const s = String(sigla).trim().toUpperCase();
    if (SIGLAS_EMEF[s]) return 'EMEF';
    if (SIGLAS_CMEI[s]) return 'CMEI';
    return null;
  }

  /**
   * Resolve sigla para nome completo com prefixo de tipo
   * @param {string} sigla - Sigla da escola
   * @returns {string} "CMEI NomeCompleto" ou "EMEF NomeCompleto" ou ""
   */
  function getNomeCompletoPorSigla(sigla) {
    if (!sigla) return '';
    const s = String(sigla).trim().toUpperCase();
    if (SIGLAS_CMEI[s]) return 'CMEI ' + SIGLAS_CMEI[s];
    if (SIGLAS_EMEF[s]) return 'EMEF ' + SIGLAS_EMEF[s];
    return '';
  }

  /**
   * Verifica se a escola é de Educação de Jovens e Adultos (EJA)
   * @param {string} escolaValor - Sigla ou nome
   * @returns {boolean}
   */
  function isEJA(escolaValor) {
    if (!escolaValor) return false;
    // Prioriza DB
    if (todasEscolasDB && todasEscolasDB.length > 0) {
      const val = String(escolaValor).trim().toLowerCase();
      // Tenta match exato de sigla ou nome
      const match = todasEscolasDB.find(e =>
        (e.sigla && e.sigla.toLowerCase() === val) ||
        (e.nomeOriginal && e.nomeOriginal.toLowerCase() === val)
      );
      if (match) return match.eja === true;

      // Tenta match parcial no nome
      const matchPartial = todasEscolasDB.find(e =>
        e.nomeOriginal && e.nomeOriginal.toLowerCase().includes(val)
      );
      if (matchPartial) return matchPartial.eja === true;
    }

    // Fallback: detecção antiga por string (pode ser removido futuramente)
    const s = String(escolaValor).toUpperCase();
    return s.includes('EJA');
  }

  /**
   * Verifica se a escola é Tempo Integral (TI)
   * @param {string} escolaValor - Sigla ou nome da escola
   * @returns {boolean}
   */
  function isTempoIntegral(escolaValor) {
    if (!escolaValor) return false;

    // Prioriza DB (Fonte da Verdade)
    if (todasEscolasDB && todasEscolasDB.length > 0) {
      const val = String(escolaValor).trim().toLowerCase();

      const match = todasEscolasDB.find(e =>
        (e.sigla && e.sigla.toLowerCase() === val) ||
        (e.nomeOriginal && e.nomeOriginal.toLowerCase() === val)
      );
      if (match) return match.ti === true;

      const matchPartial = todasEscolasDB.find(e =>
        e.nomeOriginal && e.nomeOriginal.toLowerCase().includes(val)
      );
      if (matchPartial) return matchPartial.ti === true;
    }

    // Fallback legado se o cache do DB falhar
    return isTempoIntegralBySigla(escolaValor);
  }

  /**
   * @deprecated Use isTempoIntegral()
   * Mantido apenas para compatibilidade, agora redireciona ou usa fallback
   */
  function isTempoIntegralBySigla(escolaValor) {
    if (!escolaValor) return false;

    // Se temos DB, a função principal já resolveu.
    // Se esta função for chamada diretamente e tiver DB, usamos a lógica nova.
    if (todasEscolasDB && todasEscolasDB.length > 0) {
      // Evita recursão infinita chamando a lógica interna de busca se necessário,
      // mas aqui vamos assumir que chamadas legadas podem cair no string check se DB falhar.
    }

    const sigla = String(escolaValor).trim().toUpperCase();
    let nomeCompleto = SIGLAS_CMEI[sigla] || SIGLAS_EMEF[sigla] || String(escolaValor).trim();
    const nomeUpper = nomeCompleto.toUpperCase();
    return nomeUpper.endsWith(' TI') || nomeUpper.endsWith(' TTI');
  }

  /**
   * Gera lista COMPLETA de escolas a partir dos mapeamentos de siglas
   * Garante cobertura total (CMEI + EMEF), sem depender de atribuições por técnico
   * @returns {Array} Array de { nomeOriginal, tipo, regiao, sigla }
   */
  function getTodasEscolasCompletas() {
    const escolas = [];
    const vistos = new Set();

    // Gera a partir de SIGLAS_CMEI
    Object.keys(SIGLAS_CMEI).forEach(sigla => {
      const nome = SIGLAS_CMEI[sigla];
      const nomeOriginal = 'CMEI ' + nome;
      const key = nomeOriginal.toLowerCase();
      if (!vistos.has(key)) {
        vistos.add(key);
        // Busca match no DB para pegar flags atualizadas
        const matchDB = todasEscolasDB ? todasEscolasDB.find(e =>
          (e.sigla && e.sigla === sigla) ||
          (e.nomeOriginal && e.nomeOriginal.toLowerCase().includes(nome.toLowerCase()))
        ) : null;

        // Fallback para array hardcoded TODAS_ESCOLAS se DB falhar
        const matchHardcoded = TODAS_ESCOLAS.find(e =>
          e.nomeOriginal && e.nomeOriginal.toLowerCase().includes(nome.toLowerCase())
        );

        escolas.push({
          nomeOriginal,
          tipo: 'CMEI',
          regiao: matchDB ? matchDB.regiao : (matchHardcoded ? matchHardcoded.regiao : ''),
          sigla,
          ti: matchDB ? matchDB.ti === true : (nomeOriginal.toUpperCase().endsWith(' TI')),
          eja: matchDB ? matchDB.eja === true : (nomeOriginal.toUpperCase().includes('EJA'))
        });
      }
    });

    // Gera a partir de SIGLAS_EMEF
    Object.keys(SIGLAS_EMEF).forEach(sigla => {
      const nome = SIGLAS_EMEF[sigla];
      const nomeOriginal = 'EMEF ' + nome;
      const key = nomeOriginal.toLowerCase();
      if (!vistos.has(key)) {
        vistos.add(key);

        const matchDB = todasEscolasDB ? todasEscolasDB.find(e =>
          (e.sigla && e.sigla === sigla) ||
          (e.nomeOriginal && e.nomeOriginal.toLowerCase().includes(nome.toLowerCase()))
        ) : null;

        const matchHardcoded = TODAS_ESCOLAS.find(e =>
          e.nomeOriginal && e.nomeOriginal.toLowerCase().includes(nome.toLowerCase())
        );

        escolas.push({
          nomeOriginal,
          tipo: 'EMEF',
          regiao: matchDB ? matchDB.regiao : (matchHardcoded ? matchHardcoded.regiao : ''),
          sigla,
          ti: matchDB ? matchDB.ti === true : (nomeOriginal.toUpperCase().endsWith(' TI')),
          eja: matchDB ? matchDB.eja === true : (nomeOriginal.toUpperCase().includes('EJA'))
        });
      }
    });

    return escolas;
  }

  // ========================================
  // CARREGAMENTO DO SUPABASE
  // ========================================

  /**
   * Resolve a URL do Apps Script para chamadas de cache
   * Prioriza: CONFIG.APPS_SCRIPT_AUTH > APPS_SCRIPT_URL global > null
   */
  function resolverAppsScriptURL() {
    if (typeof CONFIG !== 'undefined' && CONFIG.APPS_SCRIPT_AUTH && !CONFIG.APPS_SCRIPT_AUTH.includes('SEU_ID_AQUI')) {
      return CONFIG.APPS_SCRIPT_AUTH;
    }
    if (typeof APPS_SCRIPT_URL !== 'undefined') {
      return APPS_SCRIPT_URL;
    }
    return null;
  }

  async function carregarEscolasDeSupabase() {
    if (cacheCarregado) return true;

    const tentativas = (typeof CONFIG !== 'undefined' && CONFIG.CACHE_MAX_RETRIES) ? CONFIG.CACHE_MAX_RETRIES : 3;
    const maxIdade = (typeof CONFIG !== 'undefined' && CONFIG.CACHE_MAX_AGE) ? CONFIG.CACHE_MAX_AGE : 86400000;

    // Tenta carregar do servidor com retry
    for (let i = 0; i < tentativas; i++) {
      try {
        console.log(`[Cache] Tentativa ${i + 1}/${tentativas}...`);

        const url = resolverAppsScriptURL();
        if (!url) {
          throw new Error('Nenhuma URL de Apps Script disponivel (CONFIG.APPS_SCRIPT_AUTH ou APPS_SCRIPT_URL)');
        }

        const response = await fetch(url, {
          method: 'POST',
          redirect: 'follow',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            data: JSON.stringify({ action: 'get_technician_schools_for_cache' })
          })
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const resultado = await response.json();

        if (resultado.sucesso && resultado.data) {
          escolasPorTecnicoDB = normalizarMapaEscolasPorTecnico(resultado.data);
          todasEscolasDB = normalizarListaEscolas(resultado.todasEscolas || []);
          cacheCarregado = true;
          usandoFallback = false;

          // Salva backup no localStorage
          try {
            localStorage.setItem('cache_escolas_tecnico', JSON.stringify({
              data: escolasPorTecnicoDB,
              todasEscolas: todasEscolasDB,
              timestamp: Date.now()
            }));
          } catch (e) {
            console.warn('[Cache] Falha ao salvar backup local:', e.message);
          }

          const totalTodas = todasEscolasDB ? todasEscolasDB.length : 0;
          console.log(`[Cache] Carregado: ${Object.keys(escolasPorTecnicoDB).length} tecnicos, ${totalTodas} escolas totais`);
          return true;
        }

        throw new Error(resultado.mensagem || 'Resposta invalida');

      } catch (erro) {
        console.warn(`[Cache] Tentativa ${i + 1} falhou: ${erro.message}`);

        if (i < tentativas - 1) {
          const espera = Math.pow(2, i) * 1000;
          await new Promise(resolve => setTimeout(resolve, espera));
        }
      }
    }

    // Todas as tentativas falharam - tenta localStorage
    try {
      const backupStr = localStorage.getItem('cache_escolas_tecnico');
      if (backupStr) {
        const backup = JSON.parse(backupStr);
        const idade = Date.now() - backup.timestamp;

        if (idade < maxIdade) {
          escolasPorTecnicoDB = normalizarMapaEscolasPorTecnico(backup.data);
          todasEscolasDB = normalizarListaEscolas(backup.todasEscolas || []);
          cacheCarregado = true;
          usandoFallback = false;
          const horasIdade = Math.floor(idade / 3600000);
          console.warn(`[Cache] Usando backup local (${horasIdade}h de idade)`);
          return true;
        } else {
          console.warn('[Cache] Backup local expirado, descartando');
          localStorage.removeItem('cache_escolas_tecnico');
        }
      }
    } catch (e) {
      console.error('[Cache] Erro ao ler backup:', e.message);
    }

    console.error('[Cache] Todas as tentativas falharam');
    usandoFallback = true;
    return false;
  }

  /**
   * Busca escolas do cache DB se disponível
   */
  function getEscolasDoCache(nomeTecnico) {
    if (!cacheCarregado || !escolasPorTecnicoDB) return null;

    // Normaliza chave de busca
    const chave = Object.keys(escolasPorTecnicoDB).find(k =>
      k.toLowerCase().includes(nomeTecnico.toLowerCase()) ||
      nomeTecnico.toLowerCase().includes(k.toLowerCase())
    );

    return chave ? normalizarListaEscolas(escolasPorTecnicoDB[chave]) : null;
  }

  /**
   * Reseta o cache para forcar recarregamento do servidor
   */
  function resetarCache() {
    cacheCarregado = false;
    escolasPorTecnicoDB = null;
    todasEscolasDB = null;
    usandoFallback = false;
    try { localStorage.removeItem('cache_escolas_tecnico'); } catch (e) { }
    console.log('[Cache] Reset completo');
  }

  // ========================================
  // API PUBLICA
  // ========================================
  return {
    // Funcoes principais
    getEscolasUsuario,
    getRegiaoEscola,
    identificarTecnico,
    identificarTecnicoPorNome,
    podeVerTodasEscolas,
    getTecnicoResponsavel,

    // Funcoes auxiliares
    getRegioes,
    filtrarPorTipo,
    filtrarPorRegiao,
    isEstagiario,

    // Integracao Supabase
    carregarEscolasDeSupabase,
    getEscolasDoCache,
    resetarCache,

    // Feedback visual
    mostrarAvisoFallback,
    mostrarErroSemEscolas,

    // Dados
    TODAS_ESCOLAS,
    ESCOLAS_POR_TECNICO,

    // Siglas (mapeamento sigla→nome)
    getSiglaNomeMap,
    buildSiglaMapsFromDB,
    getTipoInstituicaoBySigla,
    getNomeCompletoPorSigla,
    isTempoIntegral,
    isEJA,
    isTempoIntegralBySigla,
    SIGLAS_CMEI,
    SIGLAS_EMEF,
    getTodasEscolasCompletas
  };
})();

// Log de inicializacao
console.log('[EscolasTecnico] Modulo carregado. Total de escolas:', window.NAVMEscolasTecnico.TODAS_ESCOLAS.length);

// ========================================
// INICIALIZACAO AUTOMATICA DO CACHE SUPABASE
// ========================================
document.addEventListener('DOMContentLoaded', async () => {
  console.log('[EscolasTecnico] Iniciando carregamento do cache Supabase...');

  try {
    const sucesso = await window.NAVMEscolasTecnico.carregarEscolasDeSupabase();

    if (sucesso) {
      console.log('[EscolasTecnico] Cache Supabase carregado com sucesso');
    } else {
      console.warn('[EscolasTecnico] Falha ao carregar cache - usando fallback');
    }
  } catch (erro) {
    console.error('[EscolasTecnico] Erro na inicializacao do cache:', erro);
  }
});
