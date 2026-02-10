-- ============================================
-- TABELA DE ANEXOS DE NOTIFICAÇÕES
-- ============================================
-- Execute este SQL no Supabase SQL Editor

CREATE TABLE IF NOT EXISTS anexos_notificacoes (
  id SERIAL PRIMARY KEY,
  id_notificacao INTEGER NOT NULL,
  nome_arquivo_original VARCHAR(255) NOT NULL,
  nome_arquivo_storage VARCHAR(255) NOT NULL,
  tipo_arquivo VARCHAR(100) NOT NULL,
  tamanho_original INTEGER NOT NULL, -- bytes
  tamanho_comprimido INTEGER NOT NULL, -- bytes
  taxa_compressao DECIMAL(5,2), -- percentual economizado
  drive_file_id VARCHAR(255) NOT NULL, -- ID do arquivo no Google Drive
  url_download TEXT NOT NULL,
  data_upload TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  usuario_upload VARCHAR(255),
  
  -- Índices para performance
  CONSTRAINT fk_notificacao
    FOREIGN KEY (id_notificacao) 
    REFERENCES notifications_ids(id) 
    ON DELETE CASCADE
);

-- Índices
CREATE INDEX idx_anexos_id_notificacao ON anexos_notificacoes(id_notificacao);
CREATE INDEX idx_anexos_data_upload ON anexos_notificacoes(data_upload);

-- Comentários
COMMENT ON TABLE anexos_notificacoes IS 'Armazena metadados dos anexos das notificações';
COMMENT ON COLUMN anexos_notificacoes.taxa_compressao IS 'Percentual de economia de espaço após compressão';
COMMENT ON COLUMN anexos_notificacoes.drive_file_id IS 'ID do arquivo no Google Drive para exclusão';

-- RLS (Row Level Security) - Opcional mas recomendado
ALTER TABLE anexos_notificacoes ENABLE ROW LEVEL SECURITY;

-- Políticas simples - Segurança garantida pela aplicação (Google Apps Script)
CREATE POLICY "Permitir SELECT em anexos" ON anexos_notificacoes
  FOR SELECT USING (true);

CREATE POLICY "Permitir INSERT em anexos" ON anexos_notificacoes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir UPDATE em anexos" ON anexos_notificacoes
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Permitir DELETE em anexos" ON anexos_notificacoes
  FOR DELETE USING (true);
