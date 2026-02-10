/**
 * ============================================
 * DRIVE FOLDER MANAGER - ESTRUTURA HIERÁRQUICA (v2)
 * ============================================
 * Responsável por manter a organização de pastas no Google Drive:
 * Raiz -> Técnico -> Criança -> Notificação
 * 
 * ESTRATÉGIA DE IDENTIFICAÇÃO (Standard DriveApp):
 * - Nome: Formato legível "PREFIXO_Identificador"
 * - Descrição: JSON com metadados para validação robusta
 */

const DRIVE_MANAGER_CONFIG = {
  ROOT_FOLDER_NAME: 'NAAM_Sistema_Arquivos',
  CACHE_EXPIRATION: 21600, // 6 horas
  LOCK_WAIT_MS: 30000
};

/**
 * Obtém a pasta de destino final para um anexo, criando a hierarquia se necessário.
 * @param {string} emailTecnico - Email do usuário logado
 * @param {string} nomeCrianca - Nome da criança/estudante
 * @param {number|string} idNotificacao - ID da notificação
 * @return {GoogleAppsScript.Drive.Folder} Pasta onde o arquivo deve ser salvo
 */
function getAnexoDestinationFolder(emailTecnico, nomeCrianca, idNotificacao) {
  const lock = LockService.getScriptLock();
  
  try {
    lock.waitLock(DRIVE_MANAGER_CONFIG.LOCK_WAIT_MS);
    
    // 1. Raiz
    const rootFolder = getOrCreateRootFolder();
    
    // 2. Técnico
    const tecnicoFolder = getOrCreateTechnicianFolder(rootFolder, emailTecnico);
    
    // 3. Criança
    const childFolder = getOrCreateChildFolder(tecnicoFolder, nomeCrianca);
    
    // 4. Notificação
    const notificationFolder = getOrCreateNotificationFolder(childFolder, idNotificacao);
    
    return notificationFolder;
    
  } catch (e) {
    Logger.log('[DriveManager] Erro fatal: ' + e.toString());
    throw e;
  } finally {
    lock.releaseLock();
  }
}

/**
 * 1. RAÍZ DO SISTEMA
 */
function getOrCreateRootFolder() {
  const cache = CacheService.getScriptCache();
  const cacheKey = 'drive_root_folder_id_v2';
  const cachedId = cache.get(cacheKey);
  
  if (cachedId) {
    try {
      return DriveApp.getFolderById(cachedId);
    } catch (e) {
      cache.remove(cacheKey);
    }
  }
  
  const folders = DriveApp.getFoldersByName(DRIVE_MANAGER_CONFIG.ROOT_FOLDER_NAME);
  if (folders.hasNext()) {
    const folder = folders.next();
    cache.put(cacheKey, folder.getId(), DRIVE_MANAGER_CONFIG.CACHE_EXPIRATION);
    return folder;
  }
  
  const newFolder = DriveApp.createFolder(DRIVE_MANAGER_CONFIG.ROOT_FOLDER_NAME);
  newFolder.setDescription('Pasta Raiz do Sistema NAAM - NÃO REMOVER');
  // newFolder.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.NONE); // Opcional
  cache.put(cacheKey, newFolder.getId(), DRIVE_MANAGER_CONFIG.CACHE_EXPIRATION);
  return newFolder;
}

/**
 * 2. PASTA DO TÉCNICO
 * Nome: "TÉCNICO - {email}"
 */
function getOrCreateTechnicianFolder(parentFolder, emailTecnico) {
  if (!emailTecnico) emailTecnico = 'desconhecido@sistema';
  
  const folderName = `TÉCNICO - ${emailTecnico.toLowerCase()}`;
  const description = JSON.stringify({ type: 'TECNICO', email: emailTecnico });
  
  return getOrCreateFolderByNameAndDescription(parentFolder, folderName, description);
}

/**
 * 3. PASTA DA CRIANÇA
 * Nome: "CRIANÇA - {Nome}"
 */
function getOrCreateChildFolder(parentFolder, nomeCrianca) {
  if (!nomeCrianca) nomeCrianca = 'Sem Nome';
  
  const safeName = nomeCrianca.replace(/[\/\\\:\*\?\"\<\>\|]/g, '').trim().substring(0, 50);
  const folderName = `CRIANÇA - ${safeName}`;
  
  // Usamos um hash simples para diferenciação interna se necessário, mas o nome é o principal
  const description = JSON.stringify({ type: 'CRIANCA', nome_original: nomeCrianca });
  
  return getOrCreateFolderByNameAndDescription(parentFolder, folderName, description);
}

/**
 * 4. PASTA DA NOTIFICAÇÃO
 * Nome: "NOTIFICAÇÃO #{ID}"
 */
function getOrCreateNotificationFolder(parentFolder, idNotificacao) {
  if (!idNotificacao && idNotificacao !== 0) {
    Logger.log('[DriveManager] ALERTA: Tentativa de criar pasta com ID nulo/vazio');
    return parentFolder; // Retorna pai para não quebrar, ou poderia lançar erro
  }
  const folderName = `NOTIFICAÇÃO #${idNotificacao}`;
  const description = JSON.stringify({ type: 'NOTIFICACAO', id: idNotificacao });
  
  return getOrCreateFolderByNameAndDescription(parentFolder, folderName, description);
}

/**
 * FUNÇÃO GENÉRICA: Busca por nome exato dentro da pasta pai
 * Se não encontrar, cria e define descrição.
 */
function getOrCreateFolderByNameAndDescription(parentFolder, folderName, description) {
  const folders = parentFolder.getFoldersByName(folderName);
  
  // Itera para encontrar (se houver duplicatas, pega a primeira não-lixeira)
  while (folders.hasNext()) {
    const folder = folders.next();
    // Poderíamos validar description aqui, mas confiança no nome + pai é suficiente para 99%
    if (!folder.isTrashed()) {
      return folder;
    }
  }
  
  // Cria nova
  Logger.log(`[DriveManager] Criando pasta: ${folderName}`);
  const newFolder = parentFolder.createFolder(folderName);
  newFolder.setDescription(description);
  
  return newFolder;
}
