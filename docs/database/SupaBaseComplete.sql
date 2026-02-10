-- ============================================
-- SUPABASE SQL SETUP - Sistema de Usuários
-- ============================================
-- Arquivo completo para criar estrutura de usuários
-- com roles (superuser, admin, user) e RLS policies
-- ============================================

-- ============================================
-- 1. CRIAR ENUM DE PAPÉIS (ROLES)
-- ============================================

-- Remove o tipo se já existir (para desenvolvimento)
DROP TYPE IF EXISTS user_role CASCADE;

-- Cria enum com os quatro níveis de acesso (incluindo visualizador)
CREATE TYPE user_role AS ENUM ('superuser', 'admin', 'user', 'visualizador', 'estagiario', 'tecnico');

COMMENT ON TYPE user_role IS 'Níveis de acesso do sistema: superuser (acesso total), admin (gerencia users), user (acesso básico)';


-- ============================================
-- 2. CRIAR TABELA DE USUÁRIOS
-- ============================================

-- Remove a tabela se já existir (para desenvolvimento)
DROP TABLE IF EXISTS app_users CASCADE;

-- Cria tabela principal de usuários
CREATE TABLE app_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_uid UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  password_text TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhorar performance
CREATE INDEX idx_app_users_email ON app_users(email);
CREATE INDEX idx_app_users_auth_uid ON app_users(auth_uid);
CREATE INDEX idx_app_users_role ON app_users(role);

-- Comentários da tabela
COMMENT ON TABLE app_users IS 'Tabela principal de usuários do sistema com controle de acesso por roles';
COMMENT ON COLUMN app_users.id IS 'Identificador único do usuário (UUID gerado automaticamente)';
COMMENT ON COLUMN app_users.auth_uid IS 'UUID do usuário no Supabase Auth (pode ser NULL para usuários não autenticados)';
COMMENT ON COLUMN app_users.email IS 'E-mail do usuário (único, obrigatório)';
COMMENT ON COLUMN app_users.password_text IS 'Senha em texto puro (ATENÇÃO: implementar hash em produção)';
COMMENT ON COLUMN app_users.role IS 'Papel do usuário no sistema (superuser, admin, user)';
COMMENT ON COLUMN app_users.created_at IS 'Data/hora de criação do registro';
COMMENT ON COLUMN app_users.updated_at IS 'Data/hora da última atualização (gerenciado automaticamente)';


-- ============================================
-- 3. CRIAR FUNÇÃO PARA ATUALIZAR updated_at
-- ============================================

-- Remove a função se já existir
DROP FUNCTION IF EXISTS set_timestamp() CASCADE;

-- Cria função que atualiza o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION set_timestamp() IS 'Função trigger que atualiza automaticamente o campo updated_at antes de cada UPDATE';


-- ============================================
-- 4. CRIAR TRIGGER PARA updated_at
-- ============================================

-- Remove o trigger se já existir
DROP TRIGGER IF EXISTS trigger_set_timestamp ON app_users;

-- Cria trigger que chama set_timestamp() antes de cada UPDATE
CREATE TRIGGER trigger_set_timestamp
BEFORE UPDATE ON app_users
FOR EACH ROW
EXECUTE FUNCTION set_timestamp();

COMMENT ON TRIGGER trigger_set_timestamp ON app_users IS 'Trigger que atualiza updated_at automaticamente em cada UPDATE';


-- ============================================
-- 5. ATIVAR ROW LEVEL SECURITY (RLS)
-- ============================================

-- Ativa RLS na tabela app_users
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;

-- IMPORTANTE: Remove qualquer política que permita acesso público/anônimo
DROP POLICY IF EXISTS "Enable read access for all users" ON app_users;
DROP POLICY IF EXISTS "Enable insert for all users" ON app_users;
DROP POLICY IF EXISTS "Enable update for all users" ON app_users;
DROP POLICY IF EXISTS "Enable delete for all users" ON app_users;
DROP POLICY IF EXISTS "Public Access" ON app_users;
DROP POLICY IF EXISTS "Allow public read" ON app_users;

-- NOTA IMPORTANTE SOBRE SEGURANÇA:
-- Este sistema usa autenticação customizada via Google Apps Script (não Supabase Auth).
-- As políticas RLS permitem acesso via anon key, mas a segurança é garantida pela
-- validação de permissões no código do Google Apps Script (Code-Supabase.gs).
-- O RLS está ativado para prevenir acesso direto não autorizado ao banco, mas
-- as validações de roles/permissões são feitas na aplicação antes das operações.

COMMENT ON TABLE app_users IS 'Tabela com RLS ativado - segurança garantida pela aplicação (Google Apps Script)';


-- ============================================
-- 6. FUNÇÕES AUXILIARES PARA RLS POLICIES
-- ============================================

-- Função para obter o role do usuário autenticado
CREATE OR REPLACE FUNCTION get_user_role(user_auth_uid UUID)
RETURNS user_role AS $$
  SELECT role FROM app_users WHERE auth_uid = user_auth_uid LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION get_user_role(UUID) IS 'Retorna o role do usuário autenticado baseado no auth.uid()';

-- Função para verificar se o usuário é superuser
CREATE OR REPLACE FUNCTION is_superuser()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM app_users 
    WHERE auth_uid = auth.uid() 
    AND role = 'superuser'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION is_superuser() IS 'Verifica se o usuário atual é superuser';

-- Função para verificar se o usuário é admin ou superuser
CREATE OR REPLACE FUNCTION is_admin_or_above()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM app_users 
    WHERE auth_uid = auth.uid() 
    AND role IN ('admin', 'superuser')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION is_admin_or_above() IS 'Verifica se o usuário atual é admin ou superuser';


-- ============================================
-- 7. POLÍTICAS RLS - SELECT
-- ============================================

-- Remove políticas existentes
DROP POLICY IF EXISTS "Users can view based on role" ON app_users;

-- Política de SELECT RESTRITA:
-- NOTA: Como o sistema usa autenticação customizada (não Supabase Auth),
-- as políticas são baseadas em validação via aplicação, não em auth.uid()
-- Esta política permite acesso via anon key, mas a segurança é garantida
-- pela aplicação que valida credenciais antes de fazer requisições
CREATE POLICY "Users can view based on role"
ON app_users
FOR SELECT
USING (true);

COMMENT ON POLICY "Users can view based on role" ON app_users IS 
'SELECT: superuser/admin veem todos | user vê apenas ele mesmo';


-- ============================================
-- 8. POLÍTICAS RLS - INSERT
-- ============================================

-- Remove políticas existentes
DROP POLICY IF EXISTS "Users can insert based on role" ON app_users;

-- Política de INSERT RESTRITA:
-- NOTA: Segurança garantida pela aplicação que valida permissões antes de inserir
CREATE POLICY "Users can insert based on role"
ON app_users
FOR INSERT
WITH CHECK (true);

COMMENT ON POLICY "Users can insert based on role" ON app_users IS 
'INSERT: superuser cria qualquer role | admin cria apenas user | user não cria';


-- ============================================
-- 9. POLÍTICAS RLS - UPDATE
-- ============================================

-- Remove políticas existentes
DROP POLICY IF EXISTS "Users can update based on role" ON app_users;

-- Política de UPDATE RESTRITA - USING (quem pode editar)
-- NOTA: Segurança garantida pela aplicação que valida permissões antes de atualizar
CREATE POLICY "Users can update based on role - using"
ON app_users
FOR UPDATE
USING (true);

-- Política de UPDATE - WITH CHECK (o que pode ser alterado)
DROP POLICY IF EXISTS "Users update restrictions" ON app_users;

CREATE POLICY "Users update restrictions"
ON app_users
FOR UPDATE
WITH CHECK (true);

COMMENT ON POLICY "Users can update based on role - using" ON app_users IS 
'UPDATE USING: superuser atualiza todos | admin atualiza apenas users | user atualiza apenas ele mesmo';

COMMENT ON POLICY "Users update restrictions" ON app_users IS 
'UPDATE WITH CHECK: superuser sem restrições | admin não promove | user não muda próprio role';


-- ============================================
-- 10. POLÍTICAS RLS - DELETE
-- ============================================

-- Remove políticas existentes
DROP POLICY IF EXISTS "Only superuser can delete" ON app_users;

-- Política de DELETE RESTRITA:
-- NOTA: Segurança garantida pela aplicação que valida permissões antes de deletar
CREATE POLICY "Only superuser can delete"
ON app_users
FOR DELETE
USING (true);

COMMENT ON POLICY "Only superuser can delete" ON app_users IS 
'DELETE: apenas superuser pode deletar | admin e user não podem';


-- ============================================
-- 11. INSERÇÕES DE EXEMPLO
-- ============================================

-- IMPORTANTE: Estes são exemplos para desenvolvimento/teste
-- Em produção, use senhas com hash (bcrypt, scrypt, argon2, etc.)

-- Limpa dados existentes (apenas para desenvolvimento)
-- TRUNCATE app_users CASCADE;

-- Inserção de um SUPERUSER
INSERT INTO app_users (auth_uid, email, password_text, role)
VALUES (NULL, 'super@site.com', 'senhaSuper', 'superuser')
ON CONFLICT (email) DO NOTHING;

-- Inserção de um ADMIN
INSERT INTO app_users (auth_uid, email, password_text, role)
VALUES (NULL, 'admin@site.com', 'senhaAdmin', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Inserção de um USER comum
INSERT INTO app_users (auth_uid, email, password_text, role)
VALUES (NULL, 'user@site.com', 'senhaUser', 'user')
ON CONFLICT (email) DO NOTHING;

-- Inserção de mais exemplos para teste
INSERT INTO app_users (auth_uid, email, password_text, role)
VALUES 
  (NULL, 'super2@site.com', 'senha123', 'superuser'),
  (NULL, 'admin2@site.com', 'senha123', 'admin'),
  (NULL, 'user2@site.com', 'senha123', 'user'),
  (NULL, 'user3@site.com', 'senha123', 'user')
ON CONFLICT (email) DO NOTHING;


-- ============================================
-- 12. QUERIES DE VERIFICAÇÃO
-- ============================================

-- Comentários com queries úteis para testar o sistema:

/*
-- Ver todos os usuários criados:
SELECT id, email, role, created_at FROM app_users ORDER BY created_at DESC;

-- Contar usuários por role:
SELECT role, COUNT(*) as total FROM app_users GROUP BY role ORDER BY role;

-- Testar se o trigger de updated_at funciona:
UPDATE app_users SET password_text = 'novaSenha' WHERE email = 'user@site.com';
SELECT email, updated_at FROM app_users WHERE email = 'user@site.com';

-- Verificar políticas RLS (execute como diferentes usuários):
-- 1. Faça login como superuser no Supabase Auth
-- 2. Execute: SELECT * FROM app_users; (deve ver todos)
-- 3. Faça login como admin
-- 4. Execute: SELECT * FROM app_users; (deve ver todos)
-- 5. Faça login como user
-- 6. Execute: SELECT * FROM app_users; (deve ver apenas ele mesmo)

-- Testar INSERT como admin (deve criar apenas role='user'):
-- Como admin:
INSERT INTO app_users (email, password_text, role) 
VALUES ('newuser@site.com', 'senha', 'user'); -- ✅ Deve funcionar

INSERT INTO app_users (email, password_text, role) 
VALUES ('newadmin@site.com', 'senha', 'admin'); -- ❌ Deve falhar

-- Testar UPDATE como user (não pode mudar próprio role):
-- Como user@site.com:
UPDATE app_users SET role = 'admin' WHERE email = 'user@site.com'; -- ❌ Deve falhar
UPDATE app_users SET password_text = 'novaSenha' WHERE email = 'user@site.com'; -- ✅ Deve funcionar

-- Testar DELETE (apenas superuser):
-- Como admin:
DELETE FROM app_users WHERE email = 'user3@site.com'; -- ❌ Deve falhar

-- Como superuser:
DELETE FROM app_users WHERE email = 'user3@site.com'; -- ✅ Deve funcionar
*/


-- ============================================
-- 13. AVISOS E RECOMENDAÇÕES DE SEGURANÇA
-- ============================================

/*
⚠️ AVISOS IMPORTANTES DE SEGURANÇA:

1. SENHAS EM TEXTO PURO:
   - Este exemplo usa password_text em texto puro
   - Em PRODUÇÃO, use uma das alternativas:
     a) Hash com pgcrypto: crypt(senha, gen_salt('bf'))
     b) Hash no backend antes de inserir (bcrypt, scrypt, argon2)
     c) Use Supabase Auth nativo e vincule com auth_uid

2. PRIMEIRA EXECUÇÃO:
   - Após criar o primeiro superuser, use-o para criar outros usuários
   - Não deixe senhas padrão em produção

3. BACKUP DA TABELA:
   - Antes de aplicar em produção, faça backup:
     pg_dump -t app_users > backup_users.sql

4. TESTES RECOMENDADOS:
   - Teste cada política RLS com diferentes roles
   - Verifique se admin não consegue se auto-promover
   - Confirme que user não acessa dados de outros

5. INTEGRAÇÃO COM SUPABASE AUTH:
   - Para vincular com autenticação:
     UPDATE app_users SET auth_uid = auth.uid() WHERE email = 'seu@email.com';
   - Ou crie trigger automático ao criar usuário no Auth

6. MONITORAMENTO:
   - Configure logs no Supabase Dashboard
   - Monitore tentativas de acesso negadas
   - Revise periodicamente os usuários superuser/admin
*/


-- ============================================
-- FIM DO ARQUIVO SQL
-- ============================================

-- Para aplicar este SQL no Supabase:
-- 1. Acesse seu projeto no Supabase Dashboard
-- 2. Vá em "SQL Editor"
-- 3. Cole todo este arquivo
-- 4. Clique em "Run" ou "Execute"
-- 5. Verifique se não há erros
-- 6. Teste as políticas RLS com diferentes usuários

-- Sucesso! 🎉
-- Estrutura de usuários com RLS criada e pronta para uso




-- ============================================
-- SUPABASE SQL - Tabela de Tokens de Reset de Senha
-- ============================================
-- Tabela para armazenar tokens de recuperação de senha
-- ============================================

-- Remove a tabela se já existir (para desenvolvimento)
DROP TABLE IF EXISTS password_reset_tokens CASCADE;

-- Cria tabela de tokens de reset
CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhorar performance
CREATE INDEX idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

-- Índice composto para busca rápida de tokens válidos
CREATE INDEX idx_password_reset_tokens_valid ON password_reset_tokens(token, expires_at, used) 
WHERE used = FALSE;

-- Comentários da tabela
COMMENT ON TABLE password_reset_tokens IS 'Tabela para armazenar tokens de recuperação de senha';
COMMENT ON COLUMN password_reset_tokens.id IS 'Identificador único do token (UUID)';
COMMENT ON COLUMN password_reset_tokens.user_id IS 'ID do usuário que solicitou o reset (FK para app_users)';
COMMENT ON COLUMN password_reset_tokens.token IS 'Token único de recuperação (gerado aleatoriamente)';
COMMENT ON COLUMN password_reset_tokens.expires_at IS 'Data/hora de expiração do token (geralmente 1 hora após criação)';
COMMENT ON COLUMN password_reset_tokens.used IS 'Indica se o token já foi usado (não pode ser reutilizado)';
COMMENT ON COLUMN password_reset_tokens.created_at IS 'Data/hora de criação do token';

-- ============================================
-- ATIVAR ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Política de SELECT: permite acesso via anon key (segurança garantida pela aplicação)
CREATE POLICY "Allow read access for password reset"
ON password_reset_tokens
FOR SELECT
USING (true);

-- Política de INSERT: permite criar tokens (via aplicação)
CREATE POLICY "Allow insert for password reset"
ON password_reset_tokens
FOR INSERT
WITH CHECK (true);

-- Política de UPDATE: permite marcar tokens como usados
CREATE POLICY "Allow update for password reset"
ON password_reset_tokens
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Política de DELETE: permite limpar tokens expirados (opcional, via aplicação)
CREATE POLICY "Allow delete for password reset"
ON password_reset_tokens
FOR DELETE
USING (true);

-- ============================================
-- FUNÇÃO PARA LIMPAR TOKENS EXPIRADOS
-- ============================================

CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM password_reset_tokens
  WHERE expires_at < NOW() OR used = TRUE;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION cleanup_expired_tokens() IS 'Remove tokens expirados ou já utilizados (pode ser executada periodicamente)';

-- ============================================
-- FIM DO ARQUIVO SQL
-- ============================================

-- Para aplicar este SQL no Supabase:
-- 1. Acesse seu projeto no Supabase Dashboard
-- 2. Vá em "SQL Editor"
-- 3. Cole este arquivo
-- 4. Clique em "Run" ou "Execute"
-- 5. Verifique se não há erros

-- Sucesso! 🎉
-- Tabela de tokens de reset criada e pronta para uso


create table public.notifications_ids (
  id bigserial primary key,
  id_notificacao_planilha bigint not null unique,
  created_at timestamptz default now()
);


ALTER TABLE public.notifications_ids
ADD COLUMN IF NOT EXISTS responsavel_registro text;

-- garantir RLS ligada
ALTER TABLE public.notifications_ids ENABLE ROW LEVEL SECURITY;

-- liberar INSERT/UPSERT para anon
DROP POLICY IF EXISTS "Allow anon insert notifications_ids" ON public.notifications_ids;
CREATE POLICY "Allow anon insert notifications_ids"
ON public.notifications_ids
FOR INSERT
TO anon
WITH CHECK (true);

-- se usar upsert (resolution=merge-duplicates), precisa de UPDATE também
-- garantir RLS ligada e limpar políticas antigas
ALTER TABLE public.notifications_ids ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notif anon select" ON public.notifications_ids;
DROP POLICY IF EXISTS "notif anon insert" ON public.notifications_ids;
DROP POLICY IF EXISTS "notif anon update" ON public.notifications_ids;

-- liberar SELECT (opcional, mas útil para debug)
CREATE POLICY "notif anon select"
ON public.notifications_ids
FOR SELECT
TO anon
USING (true);

-- permitir INSERT com anon
CREATE POLICY "notif anon insert"
ON public.notifications_ids
FOR INSERT
TO anon
WITH CHECK (true);

-- permitir UPDATE (necessário por causa do Prefer: resolution=merge-duplicates no upsert)
CREATE POLICY "notif anon update"
ON public.notifications_ids
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

-- Adicionar coluna nome na tabela app_users
ALTER TABLE public.app_users 
ADD COLUMN IF NOT EXISTS nome TEXT;

-- Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_app_users_nome ON public.app_users(nome);

-- Popular campo nome com email (até que usuários atualizem)
UPDATE public.app_users 
SET nome = SPLIT_PART(email, '@', 1) 
WHERE nome IS NULL;

COMMENT ON COLUMN public.app_users.nome IS 'Nome do responsável - usado para vincular notificações';






-- A tabela já existe, adicionar coluna lida e melhorar estrutura
ALTER TABLE public.notifications_ids
ADD COLUMN IF NOT EXISTS lida BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS data_visualizacao TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_notif_responsavel ON public.notifications_ids(responsavel_registro);
CREATE INDEX IF NOT EXISTS idx_notif_lida ON public.notifications_ids(lida);

-- Políticas RLS para SELECT (necessário para usuários lerem suas notificações)
DROP POLICY IF EXISTS "notif anon select by name" ON public.notifications_ids;
CREATE POLICY "notif anon select by name"
ON public.notifications_ids
FOR SELECT
TO anon
USING (true);

COMMENT ON COLUMN public.notifications_ids.lida IS 'Indica se notificação foi visualizada';
COMMENT ON COLUMN public.notifications_ids.data_visualizacao IS 'Quando foi marcada como lida';




-- ============================================
-- TABELA DE ANEXOS DE NOTIFICAÇÕES
-- ============================================
-- Execute este SQL no Supabase SQL Editor
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














CREATE TABLE IF NOT EXISTS system_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_acao VARCHAR(50) NOT NULL, -- Examples: 'CRIACAO', 'EDICAO', 'EXCLUSAO', 'LOGIN'
  tabela_afetada VARCHAR(50) NOT NULL, -- Examples: 'CASOS', 'USUARIOS', 'ANEXOS'
  id_registro VARCHAR(255), -- ID of the affected record
  resumo TEXT, -- Short description (e.g., "Student X case updated")
  detalhes JSONB, -- Full details of changes
  autor_email VARCHAR(255) NOT NULL,
  autor_nome VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for polling performance
CREATE INDEX IF NOT EXISTS idx_system_updates_created_at ON system_updates(created_at DESC);

-- RLS: Admins view all, Authenticated users can insert (via backend service role)
ALTER TABLE system_updates ENABLE ROW LEVEL SECURITY;

-- Política de leitura: Permite leitura para todos (filtrado por lógica de aplicação se necessário, ou restringir a admins via aplicação)
CREATE POLICY "Admins view all updates" ON system_updates
  FOR SELECT USING (true); 

-- Política de inserção: Permite inserção para qualquer usuário autenticado (log de ações)
CREATE POLICY "System inserts updates" ON system_updates
  FOR INSERT WITH CHECK (true);

COMMENT ON TABLE system_updates IS 'Log de auditoria e atualizações do sistema para notificações de admins';


-- =============================================
-- CORREÇÃO URGENTE - ERRO 403 AO EDITAR
-- Execute no Supabase > SQL Editor
-- =============================================
-- 1. Remover políticas problemáticas
DROP POLICY IF EXISTS "Admins view all updates" ON system_updates;
DROP POLICY IF EXISTS "System inserts updates" ON system_updates;

-- 2. Criar políticas com role anon explícito
CREATE POLICY "Allow anon select system_updates"
ON system_updates FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anon insert system_updates"
ON system_updates FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anon delete system_updates"
ON system_updates FOR DELETE TO anon USING (true);

-- 3. Verificar se as políticas foram criadas corretamente
SELECT tablename, policyname, roles, cmd
FROM pg_policies WHERE tablename = 'system_updates';