/**
 * SCRIPT DE LIMPEZA: Remove registros duplicados de technician_schools
 * 
 * ⚠️ IMPORTANTE:
 * - Este script é para LIMPEZA DE DADOS HISTÓRICOS (se existirem duplicatas)
 * - A nova lógica (PATCH user_id) NÃO gera duplicatas
 * - Execute este script UMA VEZ se encontrar duplicatas no banco
 * 
 * Algoritmo:
 * 1. Busca todas as escolas que aparecem múltiplas vezes
 * 2. Mantém a linha "principal" e deleta as duplicatas
 * 3. Registra auditoria
 * 
 * Como usar:
 * 1. Abra o Apps Script (Code.gs)
 * 2. Cole este arquivo como um novo arquivo .gs
 * 3. Execute: verificarEscolasDuplicadas() primeiro (para ver o que será deletado)
 * 4. Se houver duplicatas, execute: limparEscolasDuplicadas()
 * 5. Verifique os logs
 */

function limparEscolasDuplicadas() {
  try {
    Logger.log('🔍 Iniciando limpeza de escolas duplicadas...');
    Logger.log('⚠️ Este script DELETA registros duplicados históricos');
    
    const readHeaders = getSupabaseHeaders(false);
    const writeHeaders = getSupabaseHeaders(true);
    
    if (writeHeaders.error) {
      Logger.log('❌ Erro ao obter headers: ' + writeHeaders.error);
      return;
    }

    // PASSO 1: Buscar todas as escolas agrupadas por nome
    const allUrl = `${SUPABASE_URL}/rest/v1/technician_schools?order=school_name.asc`;
    const readOptions = {
      method: 'get',
      headers: readHeaders,
      muteHttpExceptions: true
    };
    
    const response = UrlFetchApp.fetch(allUrl, readOptions);
    if (response.getResponseCode() !== 200) {
      Logger.log('❌ Erro ao buscar escolas: ' + response.getContentText());
      return;
    }
    
    const todasEscolas = JSON.parse(response.getContentText());
    Logger.log(`📚 Total de escolas na tabela: ${todasEscolas.length}`);

    // PASSO 2: Agrupar por nome para encontrar duplicatas
    const gruposPorNome = {};
    for (const escola of todasEscolas) {
      const nome = escola.school_name.trim().toLowerCase();
      if (!gruposPorNome[nome]) {
        gruposPorNome[nome] = [];
      }
      gruposPorNome[nome].push(escola);
    }

    // PASSO 3: Encontrar escolas duplicadas
    const escolarDuplicadas = Object.entries(gruposPorNome)
      .filter(([nome, registros]) => registros.length > 1);
    
    Logger.log(`⚠️ Encontradas ${escolarDuplicadas.length} escolas com múltiplos registros`);

    let totalRemovido = 0;
    const registrosRemovidos = [];

    // PASSO 4: Para cada escola duplicada, remover os duplicatos
    for (const [nomePadrao, registros] of escolarDuplicadas) {
      Logger.log(`\n🔴 Escola: "${nomePadrao}" tem ${registros.length} registros`);
      
      // Ordenar: primeiro os com user_id NOT NULL (corretos), depois NULL (duplicatos)
      registros.sort((a, b) => {
        if (a.user_id === null && b.user_id !== null) return 1;  // NULL vem depois
        if (a.user_id !== null && b.user_id === null) return -1; // NOT NULL vem primeiro
        return 0;
      });

      // Manter apenas o primeiro (correto), remover os demais
      const registroCorreto = registros[0];
      const registrosARemover = registros.slice(1);

      Logger.log(`   ✅ Mantendo: ID=${registroCorreto.id}, user_id=${registroCorreto.user_id || 'NULL'}`);
      
      for (const registroRemover of registrosARemover) {
        Logger.log(`   🗑️ Removendo: ID=${registroRemover.id}, user_id=${registroRemover.user_id || 'NULL'}`);
        
        const deleteUrl = `${SUPABASE_URL}/rest/v1/technician_schools?id=eq.${encodeURIComponent(registroRemover.id)}`;
        const deleteOptions = {
          method: 'delete',
          headers: writeHeaders,
          muteHttpExceptions: true
        };
        
        const deleteResponse = UrlFetchApp.fetch(deleteUrl, deleteOptions);
        if (deleteResponse.getResponseCode() === 204 || deleteResponse.getResponseCode() === 200) {
          totalRemovido++;
          registrosRemovidos.push({
            school_name: nomePadrao,
            id_removido: registroRemover.id,
            user_id_removido: registroRemover.user_id,
            id_mantido: registroCorreto.id,
            user_id_mantido: registroCorreto.user_id
          });
        } else {
          Logger.log(`      ❌ Falha ao remover: ${deleteResponse.getContentText()}`);
        }
      }
    }

    // PASSO 5: Registrar auditoria
    if (registrosRemovidos.length > 0) {
      adicionarSystemUpdate(
        'CLEANUP_DUPLICATES',
        'technician_schools',
        'system',
        `Limpeza de ${totalRemovido} registros duplicados`,
        {
          total_removido: totalRemovido,
          escolas_afetadas: [...new Set(registrosRemovidos.map(r => r.school_name))].length,
          detalhes: registrosRemovidos
        },
        'system'
      );
    }

    Logger.log(`\n✅ LIMPEZA CONCLUÍDA!`);
    Logger.log(`   Total removido: ${totalRemovido} registros`);
    Logger.log(`   Escolas afetadas: ${escolarDuplicadas.length}`);
    
    return {
      sucesso: true,
      total_removido: totalRemovido,
      escolas_afetadas: escolarDuplicadas.length,
      detalhes: registrosRemovidos
    };
    
  } catch (erro) {
    Logger.log('❌ Erro em limparEscolasDuplicadas: ' + erro.toString());
    Logger.log('Stack: ' + erro.stack);
    return {
      sucesso: false,
      mensagem: erro.message
    };
  }
}

/**
 * Função auxiliar para VERIFICAR duplicatas SEM remover
 * Use isto primeiro para ver o que será removido
 */
function verificarEscolasDuplicadas() {
  try {
    Logger.log('🔍 Verificando escolas duplicadas (SEM remover)...');
    
    const readHeaders = getSupabaseHeaders(false);
    
    const allUrl = `${SUPABASE_URL}/rest/v1/technician_schools?order=school_name.asc`;
    const readOptions = {
      method: 'get',
      headers: readHeaders,
      muteHttpExceptions: true
    };
    
    const response = UrlFetchApp.fetch(allUrl, readOptions);
    if (response.getResponseCode() !== 200) {
      Logger.log('❌ Erro ao buscar escolas: ' + response.getContentText());
      return;
    }
    
    const todasEscolas = JSON.parse(response.getContentText());

    // Agrupar por nome
    const gruposPorNome = {};
    for (const escola of todasEscolas) {
      const nome = escola.school_name.trim().toLowerCase();
      if (!gruposPorNome[nome]) {
        gruposPorNome[nome] = [];
      }
      gruposPorNome[nome].push(escola);
    }

    // Encontrar escolas duplicadas
    const escolaDuplicadas = Object.entries(gruposPorNome)
      .filter(([nome, registros]) => registros.length > 1);
    
    Logger.log(`\n📊 RELATÓRIO DE DUPLICATAS:`);
    Logger.log(`   Total de registros: ${todasEscolas.length}`);
    Logger.log(`   Escolas com múltiplos registros: ${escolaDuplicadas.length}`);

    for (const [nomePadrao, registros] of escolaDuplicadas) {
      Logger.log(`\n   "${nomePadrao}" (${registros.length} registros):`);
      for (const reg of registros) {
        Logger.log(`      - ID: ${reg.id}, user_id: ${reg.user_id || 'NULL'}, assigned_at: ${reg.assigned_at || 'N/A'}`);
      }
    }
    
    return {
      total_escolas: todasEscolas.length,
      escolas_com_duplicatas: escolaDuplicadas.length,
      detalhes: Object.fromEntries(escolaDuplicadas)
    };
    
  } catch (erro) {
    Logger.log('❌ Erro: ' + erro.toString());
  }
}
