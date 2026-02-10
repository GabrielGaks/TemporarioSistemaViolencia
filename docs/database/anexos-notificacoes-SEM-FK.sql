-- ============================================
-- CRIAR TABELA SEM FOREIGN KEY (Solução Temporária)
-- ============================================
-- Execute este SQL PRIMEIRO se a tabela notificacoes não existir

-- Criar tabela SEM restrição de foreign key
CREATE TABLE IF NOT EXISTS anexos_notificacoes (
  id SERIAL PRIMARY KEY,
  id_notificacao INTEGER NOT NULL,
  nome_arquivo_original VARCHAR(255) NOT NULL,
  nome_arquivo_storage VARCHAR(255) NOT NULL,
  tipo_arquivo VARCHAR(100) NOT NULL,
  tamanho_original INTEGER NOT NULL,
  tamanho_comprimido INTEGER NOT NULL,
  taxa_compressao DECIMAL(5,2),
  drive_file_id VARCHAR(255) NOT NULL,
  url_download TEXT NOT NULL,
  data_upload TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  usuario_upload VARCHAR(255)
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_anexos_id_notificacao ON anexos_notificacoes(id_notificacao);
CREATE INDEX IF NOT EXISTS idx_anexos_data_upload ON anexos_notificacoes(data_upload);

-- Comentários
COMMENT ON TABLE anexos_notificacoes IS 'Armazena metadados dos anexos das notificações';
COMMENT ON COLUMN anexos_notificacoes.taxa_compressao IS 'Percentual de economia de espaço após compressão';
COMMENT ON COLUMN anexos_notificacoes.drive_file_id IS 'ID do arquivo no Google Drive para exclusão';

-- ============================================
-- PRÓXIMO PASSO: Adicionar Foreign Key
-- ============================================
-- Execute isto APÓS confirmar que tabela 'notificacoes' existe:

/*
ALTER TABLE anexos_notificacoes
ADD CONSTRAINT fk_notificacao
FOREIGN KEY (id_notificacao) 
REFERENCES notificacoes(id) 
ON DELETE CASCADE;
*/

-- ============================================
-- RLS (Row Level Security) - OPCIONAL
-- ============================================

ALTER TABLE anexos_notificacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver anexos das próprias notificações" ON anexos_notificacoes
  FOR SELECT USING (true);

CREATE POLICY "Usuários podem inserir anexos" ON anexos_notificacoes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Usuários podem atualizar anexos" ON anexos_notificacoes
  FOR UPDATE WITH CHECK (true);

CREATE POLICY "Usuários podem deletar anexos" ON anexos_notificacoes
  FOR DELETE USING (true);
