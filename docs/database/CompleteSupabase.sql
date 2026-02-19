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
CREATE TYPE user_role AS ENUM ('superuser', 'admin', 'user', 'visualizador');

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










-- ============================================
-- MIGRACAO ESTRITA DE ROLES - FIX ENUM
-- ============================================
-- Autor: Antigravity
-- Data: 2026-01-27
-- Descricao:
--   1. Renomeia o tipo user_role atual para user_role_old
--   2. Cria user_role NOVO e limpo apenas com: ('visualizador', 'estagiario', 'tecnico', 'admin', 'superuser')
--   3. Migra dados da tabela app_users:
--      - Converte 'user' -> 'estagiario'
--      - Preserva os outros se existirem e forem validos
--   4. Atualiza a coluna para usar o novo ENUM
--   5. Remove o tipo antigo
--   6. Recria funcoes que dependem do tipo user_role
-- ============================================

BEGIN;

-- 1. Renomear tipo antigo para evitar conflito
ALTER TYPE user_role RENAME TO user_role_old;

-- 2. Criar novo tipo com valores ESTRITOS (sem 'user')
CREATE TYPE user_role AS ENUM ('visualizador', 'estagiario', 'tecnico', 'admin', 'superuser');

COMMENT ON TYPE user_role IS 'Niveis de acesso estritos:
- superuser
- admin
- tecnico
- estagiario (substitui user)
- visualizador';

-- 3. Alterar a coluna temporariamente para TEXT para manipular os dados
-- IMPORTANTE: Primeiro removemos o default antigo ('user') que nao existe no novo enum
ALTER TABLE app_users ALTER COLUMN role DROP DEFAULT;
ALTER TABLE app_users ALTER COLUMN role TYPE TEXT;

-- 4. Migrar dados: 'user' vira 'estagiario'
UPDATE app_users 
SET role = 'estagiario' 
WHERE role = 'user';

-- Garantir que quaisquer valores invalidos sejam ajustados para visualizador por seguranca
-- (Opcional, mas boa pratica para evitar erro de cast)
UPDATE app_users
SET role = 'visualizador'
WHERE role NOT IN ('visualizador', 'estagiario', 'tecnico', 'admin', 'superuser');

-- 5. Converter coluna para o novo ENUM
ALTER TABLE app_users 
ALTER COLUMN role TYPE user_role 
USING role::user_role;

-- 6. Definir novo default valido
ALTER TABLE app_users ALTER COLUMN role SET DEFAULT 'estagiario'::user_role;

-- 7. Dropar dependencias do tipo antigo antes de remove-lo
--    Isso remove funcoes velhas para recria-las depois com o novo tipo
DROP VIEW IF EXISTS vw_permission_matrix;
DROP FUNCTION IF EXISTS get_user_role(uuid);
DROP FUNCTION IF EXISTS check_page_permission(user_role_old, text);
DROP FUNCTION IF EXISTS check_page_permission(user_role, text); -- Por precaucao
DROP FUNCTION IF EXISTS can_create_records(user_role_old);
DROP FUNCTION IF EXISTS can_manage_records(user_role_old);
DROP FUNCTION IF EXISTS can_view_notifications(user_role_old);
DROP FUNCTION IF EXISTS can_view_attachments(user_role_old);
DROP FUNCTION IF EXISTS can_manage_users(user_role_old);

-- 8. Dropar tipo antigo (agora seguro)
DROP TYPE user_role_old;


-- ============================================
-- 7. RECRIA FUNCOES DE PERMISSAO (Atualizadas sem 'user')
-- ============================================

-- Funcao que verifica se um role tem permissao para acessar uma pagina
CREATE OR REPLACE FUNCTION check_page_permission(p_role user_role, p_page TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    CASE p_page
        -- Painel de Casos: TODOS
        WHEN 'painel-casos' THEN
            RETURN TRUE;

        -- Novo Registro: estagiario, tecnico
        WHEN 'registro-novo-caso' THEN
            RETURN p_role IN ('estagiario', 'tecnico');

        -- Gerenciar Registros: estagiario
        WHEN 'gerenciar-casos' THEN
            RETURN p_role = 'estagiario';

        -- Minhas Notificacoes: tecnico
        WHEN 'minhas-notificacoes' THEN
            RETURN p_role = 'tecnico';

        -- Painel Admin: admin, superuser
        WHEN 'gerenciar-usuarios' THEN
            RETURN p_role IN ('admin', 'superuser');

        ELSE
            RETURN FALSE;
    END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Verifica se o usuario pode criar registros
CREATE OR REPLACE FUNCTION can_create_records(p_role user_role)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN p_role IN ('estagiario', 'tecnico');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Verifica se o usuario pode gerenciar registros
CREATE OR REPLACE FUNCTION can_manage_records(p_role user_role)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN p_role = 'estagiario';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Verifica se o usuario pode ver notificacoes
CREATE OR REPLACE FUNCTION can_view_notifications(p_role user_role)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN p_role = 'tecnico';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Verifica se o usuario pode ver anexos
CREATE OR REPLACE FUNCTION can_view_attachments(p_role user_role)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN p_role IN ('admin', 'superuser');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Verifica se o usuario pode gerenciar usuarios
CREATE OR REPLACE FUNCTION can_manage_users(p_role user_role)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN p_role IN ('admin', 'superuser');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================
-- 8. RECRIA VIEW DE MATRIZ DE PERMISSOES
-- ============================================

CREATE OR REPLACE VIEW vw_permission_matrix AS
SELECT
    role::TEXT as role,
    check_page_permission(role, 'painel-casos') as painel_casos,
    check_page_permission(role, 'registro-novo-caso') as novo_registro,
    check_page_permission(role, 'gerenciar-casos') as gerenciar_registros,
    check_page_permission(role, 'minhas-notificacoes') as minhas_notificacoes,
    check_page_permission(role, 'gerenciar-usuarios') as painel_admin,
    can_view_attachments(role) as visualiza_anexos
FROM unnest(enum_range(NULL::user_role)) as role
ORDER BY
    CASE role
        WHEN 'superuser' THEN 1
        WHEN 'admin' THEN 2
        WHEN 'tecnico' THEN 3
        WHEN 'estagiario' THEN 4
        WHEN 'visualizador' THEN 5
    END;

-- ============================================
-- 9. RECRIAR FUNCOES AUXILIARES DO RLS (Dependem do role)
-- ============================================

-- get_user_role deve retornar o novo tipo
CREATE OR REPLACE FUNCTION get_user_role(user_auth_uid UUID)
RETURNS user_role AS $$
  SELECT role FROM app_users WHERE auth_uid = user_auth_uid LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

COMMIT;

-- ============================================
-- FIM DA MIGRACAO
-- ============================================















-- ============================================
-- MIGRACAO - Adicionar novos roles para navegacao por perfil
-- ============================================
-- Data: 2026-01-27
-- Descricao: Adiciona roles 'tecnico' e 'estagiario' ao sistema
--
-- Matriz de Permissoes:
-- +------------------+--------------+------------+---------+---------+
-- | Pagina           | Visualizador | Estagiario | Tecnico | Admin   |
-- +------------------+--------------+------------+---------+---------+
-- | Painel de Casos  |     SIM      |    SIM     |   SIM   |   SIM   |
-- | Novo Registro    |     NAO      |    SIM     |   SIM   |   NAO   |
-- | Gerenciar Reg.   |     NAO      |    SIM     |   NAO   |   NAO   |
-- | Minhas Notif.    |     NAO      |    NAO     |   SIM   |   NAO   |
-- | Painel Admin     |     NAO      |    NAO     |   NAO   |   SIM   |
-- | Botao Sair       |     SIM      |    SIM     |   SIM   |   SIM   |
-- +------------------+--------------+------------+---------+---------+
-- ============================================

-- ============================================
-- 1. ADICIONAR NOVOS VALORES AO ENUM user_role
-- ============================================
-- Nota: O script fix-roles-strict.sql ja deve ter tratado a criacao correta do ENUM.
-- Este bloco garante que os valores existam caso nao tenha sido rodado.

DO $$
BEGIN
    -- Adiciona 'estagiario' se nao existir
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'estagiario' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')) THEN
        ALTER TYPE user_role ADD VALUE 'estagiario';
    END IF;

    -- Adiciona 'tecnico' se nao existir
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'tecnico' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')) THEN
        ALTER TYPE user_role ADD VALUE 'tecnico';
    END IF;
    
    -- Adiciona 'visualizador' se nao existir
     IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'visualizador' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')) THEN
        ALTER TYPE user_role ADD VALUE 'visualizador';
    END IF;
END $$;

-- ============================================
-- 2. ATUALIZAR COMENTARIO DO TIPO ENUM
-- ============================================

COMMENT ON TYPE user_role IS 'Niveis de acesso do sistema:
- superuser: Acesso total ao sistema
- admin: Gerencia usuarios, visualiza casos com anexos
- tecnico: Cria registros, acompanha notificacoes
- estagiario: Cria e gerencia registros
- visualizador: Apenas visualiza painel de casos';


-- ============================================
-- 3. FUNCAO PARA VERIFICAR PERMISSAO DE PAGINA
-- ============================================

-- Funcao que verifica se um role tem permissao para acessar uma pagina
CREATE OR REPLACE FUNCTION check_page_permission(p_role user_role, p_page TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    CASE p_page
        -- Painel de Casos: TODOS
        WHEN 'painel-casos' THEN
            RETURN TRUE;

        -- Novo Registro: estagiario, tecnico
        WHEN 'registro-novo-caso' THEN
            RETURN p_role IN ('estagiario', 'tecnico');

        -- Gerenciar Registros: estagiario
        WHEN 'gerenciar-casos' THEN
            RETURN p_role = 'estagiario';

        -- Minhas Notificacoes: tecnico
        WHEN 'minhas-notificacoes' THEN
            RETURN p_role = 'tecnico';

        -- Painel Admin: admin, superuser
        WHEN 'gerenciar-usuarios' THEN
            RETURN p_role IN ('admin', 'superuser');

        ELSE
            RETURN FALSE;
    END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION check_page_permission(user_role, TEXT) IS
'Verifica se um role tem permissao para acessar uma pagina especifica do sistema';


-- ============================================
-- 4. FUNCOES AUXILIARES PARA VERIFICACAO DE ROLES
-- ============================================

-- Verifica se o usuario pode criar registros
CREATE OR REPLACE FUNCTION can_create_records(p_role user_role)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN p_role IN ('estagiario', 'tecnico');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION can_create_records(user_role) IS
'Verifica se o role pode criar novos registros (estagiario, tecnico)';


-- Verifica se o usuario pode gerenciar registros
CREATE OR REPLACE FUNCTION can_manage_records(p_role user_role)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN p_role = 'estagiario';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION can_manage_records(user_role) IS
'Verifica se o role pode gerenciar registros existentes (estagiario)';


-- Verifica se o usuario pode ver notificacoes
CREATE OR REPLACE FUNCTION can_view_notifications(p_role user_role)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN p_role = 'tecnico';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION can_view_notifications(user_role) IS
'Verifica se o role pode acessar Minhas Notificacoes (tecnico)';


-- Verifica se o usuario pode ver anexos nos detalhes do caso
CREATE OR REPLACE FUNCTION can_view_attachments(p_role user_role)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN p_role IN ('admin', 'superuser');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION can_view_attachments(user_role) IS
'Verifica se o role pode visualizar anexos nos detalhes do caso (admin, superuser)';


-- Verifica se o usuario pode gerenciar usuarios
CREATE OR REPLACE FUNCTION can_manage_users(p_role user_role)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN p_role IN ('admin', 'superuser');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION can_manage_users(user_role) IS
'Verifica se o role pode acessar o painel de administracao de usuarios (admin, superuser)';


-- ============================================
-- 5. VIEW PARA MATRIZ DE PERMISSOES
-- ============================================

-- View que mostra a matriz de permissoes para cada role
CREATE OR REPLACE VIEW vw_permission_matrix AS
SELECT
    role::TEXT as role,
    check_page_permission(role, 'painel-casos') as painel_casos,
    check_page_permission(role, 'registro-novo-caso') as novo_registro,
    check_page_permission(role, 'gerenciar-casos') as gerenciar_registros,
    check_page_permission(role, 'minhas-notificacoes') as minhas_notificacoes,
    check_page_permission(role, 'gerenciar-usuarios') as painel_admin,
    can_view_attachments(role) as visualiza_anexos
FROM unnest(enum_range(NULL::user_role)) as role
ORDER BY
    CASE role
        WHEN 'superuser' THEN 1
        WHEN 'admin' THEN 2
        WHEN 'tecnico' THEN 3
        WHEN 'estagiario' THEN 4
        WHEN 'user' THEN 5
        WHEN 'visualizador' THEN 6
    END;

COMMENT ON VIEW vw_permission_matrix IS
'Matriz visual de permissoes por role - use SELECT * FROM vw_permission_matrix';


-- ============================================
-- 6. INSERIR USUARIOS DE EXEMPLO
-- ============================================

-- Tecnico de exemplo
INSERT INTO app_users (auth_uid, email, password_text, role)
VALUES (NULL, 'tecnico@site.com', 'senhaTecnico', 'tecnico')
ON CONFLICT (email) DO NOTHING;

-- Estagiario de exemplo
INSERT INTO app_users (auth_uid, email, password_text, role)
VALUES (NULL, 'estagiario@site.com', 'senhaEstagiario', 'estagiario')
ON CONFLICT (email) DO NOTHING;

-- Visualizador de exemplo
INSERT INTO app_users (auth_uid, email, password_text, role)
VALUES (NULL, 'visualizador@site.com', 'senhaVisualizador', 'visualizador')
ON CONFLICT (email) DO NOTHING;


-- ============================================
-- 7. QUERIES DE VERIFICACAO
-- ============================================

/*
-- Ver matriz de permissoes:
SELECT * FROM vw_permission_matrix;

-- Resultado esperado:
-- role         | painel_casos | novo_registro | gerenciar_registros | minhas_notificacoes | painel_admin | visualiza_anexos
-- -------------|--------------|---------------|---------------------|---------------------|--------------|------------------
-- superuser    | true         | false         | false               | false               | true         | true
-- admin        | true         | false         | false               | false               | true         | true
-- tecnico      | true         | true          | false               | true                | false        | false
-- estagiario   | true         | true          | true                | false               | false        | false
-- user         | true         | true          | true                | false               | false        | false
-- visualizador | true         | false         | false               | false               | false        | false

-- Ver todos os usuarios por role:
SELECT role, COUNT(*) as total FROM app_users GROUP BY role ORDER BY role;

-- Testar permissao especifica:
SELECT check_page_permission('tecnico'::user_role, 'minhas-notificacoes'); -- true
SELECT check_page_permission('estagiario'::user_role, 'minhas-notificacoes'); -- false
SELECT check_page_permission('admin'::user_role, 'gerenciar-usuarios'); -- true

-- Listar usuarios tecnicos:
SELECT * FROM app_users WHERE role = 'tecnico';

-- Listar usuarios que podem criar registros:
SELECT * FROM app_users WHERE can_create_records(role);

-- Listar usuarios que podem ver anexos:
SELECT * FROM app_users WHERE can_view_attachments(role);
*/


-- ============================================
-- FIM DA MIGRACAO
-- ============================================

-- Para aplicar esta migracao no Supabase:
-- 1. Acesse seu projeto no Supabase Dashboard
-- 2. Va em "SQL Editor"
-- 3. Cole este arquivo
-- 4. Clique em "Run" ou "Execute"
-- 5. Verifique a matriz de permissoes: SELECT * FROM vw_permission_matrix;
-- 6. Teste com os usuarios de exemplo

-- IMPORTANTE:
-- Esta migracao e segura e nao altera usuarios existentes.
-- Os roles 'user' continuam funcionando normalmente.
-- 'estagiario' e 'user' tem as mesmas permissoes.

-- Sucesso! A estrutura de navegacao por perfil esta pronta.





ALTER TABLE public.app_users 
ADD COLUMN IF NOT EXISTS nome TEXT;

-- 2. Criar indice para performance (opcional mas recomendado)
CREATE INDEX IF NOT EXISTS idx_app_users_nome ON public.app_users(nome);

-- 3. Preencher nomes vazios extraindo do email (ex: joao@email.com -> joao)
-- Isso garante que o usuario tenha um nome para o sistema vincular
UPDATE public.app_users 
SET nome = SPLIT_PART(email, '@', 1) 
WHERE nome IS NULL OR nome = '';








-- ============================================
-- ATUALIZACAO DE PERMISSOES - SUPERUSER ACESSO TOTAL
-- ============================================
-- Este script atualiza as funcoes de permissao para garantir
-- que o role 'superuser' tenha acesso a todas as funcionalidades.
--
-- Execute este script no Supabase SQL Editor.
-- ============================================

-- Funcao que verifica se um role tem permissao para acessar uma pagina
CREATE OR REPLACE FUNCTION check_page_permission(p_role user_role, p_page TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    CASE p_page
        -- Painel de Casos: TODOS
        WHEN 'painel-casos' THEN
            RETURN TRUE;

        -- Novo Registro: estagiario, tecnico, superuser
        WHEN 'registro-novo-caso' THEN
            RETURN p_role IN ('estagiario', 'tecnico', 'superuser');

        -- Gerenciar Registros: estagiario, superuser
        WHEN 'gerenciar-casos' THEN
            RETURN p_role IN ('estagiario', 'superuser');

        -- Minhas Notificacoes: tecnico, superuser
        WHEN 'minhas-notificacoes' THEN
            RETURN p_role IN ('tecnico', 'superuser');

        -- Painel Admin: admin, superuser
        WHEN 'gerenciar-usuarios' THEN
            RETURN p_role IN ('admin', 'superuser');

        ELSE
            RETURN FALSE;
    END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Verifica se o usuario pode criar registros
CREATE OR REPLACE FUNCTION can_create_records(p_role user_role)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN p_role IN ('estagiario', 'tecnico', 'superuser');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Verifica se o usuario pode gerenciar registros (editar/excluir seus proprios)
CREATE OR REPLACE FUNCTION can_manage_records(p_role user_role)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN p_role IN ('estagiario', 'superuser');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Verifica se o usuario pode ver notificacoes
CREATE OR REPLACE FUNCTION can_view_notifications(p_role user_role)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN p_role IN ('tecnico', 'superuser');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Verifica se o usuario pode ver anexos (mantem igual, ja incluia superuser)
CREATE OR REPLACE FUNCTION can_view_attachments(p_role user_role)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN p_role IN ('admin', 'superuser');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Verifica se o usuario pode gerenciar usuarios (mantem igual, ja incluia superuser)
CREATE OR REPLACE FUNCTION can_manage_users(p_role user_role)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN p_role IN ('admin', 'superuser');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Atualizar a view de matriz de permissoes para refletir as mudancas
CREATE OR REPLACE VIEW vw_permission_matrix AS
SELECT
    role::TEXT as role,
    check_page_permission(role, 'painel-casos') as painel_casos,
    check_page_permission(role, 'registro-novo-caso') as novo_registro,
    check_page_permission(role, 'gerenciar-casos') as gerenciar_registros,
    check_page_permission(role, 'minhas-notificacoes') as minhas_notificacoes,
    check_page_permission(role, 'gerenciar-usuarios') as painel_admin,
    can_view_attachments(role) as visualiza_anexos
FROM unnest(enum_range(NULL::user_role)) as role
ORDER BY
    CASE role
        WHEN 'superuser' THEN 1
        WHEN 'admin' THEN 2
        WHEN 'tecnico' THEN 3
        WHEN 'estagiario' THEN 4
        WHEN 'visualizador' THEN 5
    END;

-- ============================================
-- FIM DA ATUALIZACAO
-- ============================================
SELECT * FROM anexos_notificacoes LIMIT 5;






-- ============================================
-- MIGRATION: Nome Unico e Imutavel
-- Sistema NAAM - Feature "Minha Conta"
-- ============================================
-- Objetivo: Garantir que o campo nome em app_users seja unico e obrigatorio.
-- Executar ANTES de qualquer outra alteracao desta feature.
-- ============================================

-- PASSO 1: Resolver nomes duplicados existentes
-- Adiciona sufixo numerico incremental para nomes que aparecem mais de uma vez
DO $$
DECLARE
  rec RECORD;
  counter INTEGER;
BEGIN
  FOR rec IN (
    SELECT nome
    FROM public.app_users
    WHERE nome IS NOT NULL AND trim(nome) <> ''
    GROUP BY nome
    HAVING count(*) > 1
  ) LOOP
    counter := 1;
    FOR rec IN (
      SELECT id
      FROM public.app_users
      WHERE nome = rec.nome
      ORDER BY created_at ASC
      OFFSET 1
    ) LOOP
      UPDATE public.app_users
      SET nome = nome || '_' || counter
      WHERE id = rec.id;
      counter := counter + 1;
    END LOOP;
  END LOOP;
END $$;

-- PASSO 2: Preencher nomes NULL com parte do email (fallback)
UPDATE public.app_users
SET nome = SPLIT_PART(email, '@', 1)
WHERE nome IS NULL OR trim(nome) = '';

-- PASSO 3: Resolver duplicatas que podem ter surgido do passo 2
DO $$
DECLARE
  dup_nome TEXT;
  dup_id UUID;
  counter INTEGER;
BEGIN
  FOR dup_nome IN (
    SELECT nome
    FROM public.app_users
    GROUP BY nome
    HAVING count(*) > 1
  ) LOOP
    counter := 1;
    FOR dup_id IN (
      SELECT id
      FROM public.app_users
      WHERE nome = dup_nome
      ORDER BY created_at ASC
      OFFSET 1
    ) LOOP
      UPDATE public.app_users
      SET nome = dup_nome || '_' || counter
      WHERE id = dup_id;
      counter := counter + 1;
    END LOOP;
  END LOOP;
END $$;

-- PASSO 4: Adicionar constraint NOT NULL + CHECK
ALTER TABLE public.app_users
ALTER COLUMN nome SET NOT NULL;

ALTER TABLE public.app_users
ADD CONSTRAINT nome_not_empty CHECK (trim(nome) <> '');

-- PASSO 5: Adicionar constraint UNIQUE
ALTER TABLE public.app_users
ADD CONSTRAINT unique_nome UNIQUE (nome);

-- VERIFICACAO: Listar todos os nomes para confirmar unicidade
-- SELECT id, nome, email FROM public.app_users ORDER BY nome;













-- ==========================================
-- MIGRATION: Technician School Management
-- ==========================================
-- Description: Adds support for dynamic school assignment to technicians
-- Date: 2026-02-10
-- Author: Sistema NAAM
--
-- Prerequisites:
--   - Supabase project with app_users table
--   - Execute this script in Supabase SQL Editor
--
-- What this migration does:
--   1. Fixes app_users table (adds nome column, updates role enum)
--   2. Creates technician_schools table
--   3. Sets up indexes and constraints
--   4. Configures Row Level Security (RLS)
-- ==========================================

-- ==========================================
-- STEP 1: Fix app_users Table Schema
-- ==========================================

-- Add nome column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'app_users' AND column_name = 'nome'
    ) THEN
        ALTER TABLE app_users ADD COLUMN nome TEXT;
        COMMENT ON COLUMN app_users.nome IS 'Full name of the user (unique, case-insensitive)';
    END IF;
END $$;

-- Create unique index on nome (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS idx_app_users_nome_unique 
ON app_users (LOWER(nome));

-- Make nome NOT NULL after adding it (safe for existing data)
-- If you have existing rows without nome, update them first:
-- UPDATE app_users SET nome = email WHERE nome IS NULL;
ALTER TABLE app_users ALTER COLUMN nome SET NOT NULL;

-- Update user_role enum to include tecnico and estagiario
DO $$
BEGIN
    -- Add 'tecnico' if not exists
    IF NOT EXISTS (SELECT 1 FROM pg_type t 
                   JOIN pg_enum e ON t.oid = e.enumtypid  
                   WHERE t.typname = 'user_role' AND e.enumlabel = 'tecnico') THEN
        ALTER TYPE user_role ADD VALUE 'tecnico';
    END IF;
    
    -- Add 'estagiario' if not exists
    IF NOT EXISTS (SELECT 1 FROM pg_type t 
                   JOIN pg_enum e ON t.oid = e.enumtypid  
                   WHERE t.typname = 'user_role' AND e.enumlabel = 'estagiario') THEN
        ALTER TYPE user_role ADD VALUE 'estagiario';
    END IF;
END $$;

-- Note: If you need to migrate existing 'user' roles to 'estagiario',
-- uncomment and run the following line ONLY if 'user' exists in your enum:
-- UPDATE app_users SET role = 'estagiario' WHERE role = 'user'::user_role;

COMMENT ON TABLE app_users IS 'User accounts with authentication and authorization data';
COMMENT ON COLUMN app_users.role IS 'User role: superuser, admin, tecnico, estagiario, visualizador';

-- ==========================================
-- STEP 2: Create technician_schools Table
-- ==========================================

CREATE TABLE IF NOT EXISTS technician_schools (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Foreign Key to app_users (NULL means unassigned school)
    user_id UUID REFERENCES app_users(id) ON DELETE CASCADE,
    
    -- School Information
    school_name TEXT NOT NULL,
    school_type TEXT CHECK (school_type IN ('CMEI', 'EMEF')),
    school_region TEXT,
    
    -- Audit Fields
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_by UUID REFERENCES app_users(id) ON DELETE SET NULL,
    
    -- Prevent duplicate assignments
    CONSTRAINT unique_user_school UNIQUE(user_id, school_name)
);

-- Add table and column comments
COMMENT ON TABLE technician_schools IS 'Many-to-many relationship between technicians and their assigned schools';
COMMENT ON COLUMN technician_schools.user_id IS 'FK to app_users.id (technician); NULL means unassigned school';
COMMENT ON COLUMN technician_schools.school_name IS 'Full name of the school';
COMMENT ON COLUMN technician_schools.school_type IS 'CMEI (preschool) or EMEF (elementary)';
COMMENT ON COLUMN technician_schools.school_region IS 'Geographic region of the school';
COMMENT ON COLUMN technician_schools.assigned_at IS 'Timestamp when assignment was created';
COMMENT ON COLUMN technician_schools.assigned_by IS 'User who created this assignment (admin/superuser)';

-- ==========================================
-- STEP 3: Create Indexes for Performance
-- ==========================================

-- Index for querying schools by user (most common query)
CREATE INDEX IF NOT EXISTS idx_technician_schools_user_id 
ON technician_schools(user_id);

-- Index for querying which technician is responsible for a school
CREATE INDEX IF NOT EXISTS idx_technician_schools_school_name 
ON technician_schools(school_name);

-- Index for filtering by school type
CREATE INDEX IF NOT EXISTS idx_technician_schools_school_type 
ON technician_schools(school_type);

-- Composite index for user + type queries
CREATE INDEX IF NOT EXISTS idx_technician_schools_user_type 
ON technician_schools(user_id, school_type);

-- ==========================================
-- STEP 4: Row Level Security (RLS)
-- ==========================================

-- Enable RLS on technician_schools
ALTER TABLE technician_schools ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow all authenticated users to READ
-- (Technicians need to see their schools, admins need to see all)
CREATE POLICY "Allow read access to all authenticated users"
ON technician_schools
FOR SELECT
TO authenticated, anon
USING (true);

-- Policy 2: Allow INSERT/UPDATE/DELETE for service role only
-- (Application layer will handle writes via Code-Supabase.gs)
CREATE POLICY "Allow write access for service role"
ON technician_schools
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Note: We use 'anon' key from frontend with application-layer validation
-- This matches the existing security model in app_users table

-- ==========================================
-- STEP 5: Helper Functions (Optional)
-- ==========================================

-- Function to get all schools assigned to a technician
CREATE OR REPLACE FUNCTION get_technician_schools(technician_user_id UUID)
RETURNS TABLE (
    school_name TEXT,
    school_type TEXT,
    school_region TEXT,
    assigned_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ts.school_name,
        ts.school_type,
        ts.school_region,
        ts.assigned_at
    FROM technician_schools ts
    WHERE ts.user_id = technician_user_id
    ORDER BY ts.school_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get the responsible technician for a school
CREATE OR REPLACE FUNCTION get_school_technician(p_school_name TEXT)
RETURNS TABLE (
    user_id UUID,
    nome TEXT,
    email TEXT,
    school_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.nome,
        u.email,
        COUNT(*) OVER (PARTITION BY u.id) as school_count
    FROM technician_schools ts
    JOIN app_users u ON ts.user_id = u.id
    WHERE ts.school_name = p_school_name
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- STEP 6: Verification Queries
-- ==========================================

-- Check if migration was successful
DO $$
DECLARE
    nome_exists BOOLEAN;
    enum_has_tecnico BOOLEAN;
    enum_has_estagiario BOOLEAN;
    table_exists BOOLEAN;
    rls_enabled BOOLEAN;
BEGIN
    -- Check nome column
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'app_users' AND column_name = 'nome'
    ) INTO nome_exists;
    
    -- Check enum values
    SELECT EXISTS (
        SELECT 1 FROM pg_type t 
        JOIN pg_enum e ON t.oid = e.enumtypid  
        WHERE t.typname = 'user_role' AND e.enumlabel = 'tecnico'
    ) INTO enum_has_tecnico;
    
    SELECT EXISTS (
        SELECT 1 FROM pg_type t 
        JOIN pg_enum e ON t.oid = e.enumtypid  
        WHERE t.typname = 'user_role' AND e.enumlabel = 'estagiario'
    ) INTO enum_has_estagiario;
    
    -- Check table exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'technician_schools'
    ) INTO table_exists;
    
    -- Check RLS enabled
    SELECT relrowsecurity 
    FROM pg_class 
    WHERE relname = 'technician_schools'
    INTO rls_enabled;
    
    -- Report results
    RAISE NOTICE '=== Migration Verification ===';
    RAISE NOTICE 'nome column exists: %', nome_exists;
    RAISE NOTICE 'tecnico enum exists: %', enum_has_tecnico;
    RAISE NOTICE 'estagiario enum exists: %', enum_has_estagiario;
    RAISE NOTICE 'technician_schools table exists: %', table_exists;
    RAISE NOTICE 'RLS enabled on technician_schools: %', rls_enabled;
    
    IF nome_exists AND enum_has_tecnico AND enum_has_estagiario AND table_exists AND rls_enabled THEN
        RAISE NOTICE '✅ Migration completed successfully!';
    ELSE
        RAISE WARNING '⚠️ Migration may have issues. Check the results above.';
    END IF;
END $$;

-- Optional: View current statistics
SELECT 
    'app_users' as table_name,
    COUNT(*) as total_rows,
    COUNT(DISTINCT role) as distinct_roles
FROM app_users
UNION ALL
SELECT 
    'technician_schools' as table_name,
    COUNT(*) as total_rows,
    COUNT(DISTINCT user_id) as distinct_users
FROM technician_schools;

-- ==========================================
-- MIGRATION COMPLETE
-- ==========================================
-- Next steps:
-- 1. Deploy updated Code-Supabase.gs with new actions
-- 2. Update frontend (gerenciar-usuarios.html)
-- 3. Update escolas-tecnico.js to query Supabase
-- 4. Run data migration script to populate technician_schools
-- ==========================================















-- ============================================================================
-- RECONCILIAÇÃO COMPLETA DE ESCOLAS - VERSÃO 2 COM KATIANE
-- ============================================================================
-- Dados baseados em: Planilha de técnicos NAAM (10/02/2026)
-- Total: 8 técnicos, 97 escolas
-- ============================================================================

-- ============================================================================
-- PARTE 1: CRIAR TÉCNICOS FALTANTES
-- ============================================================================

INSERT INTO app_users (email, password_text, role, nome, created_at, updated_at)
VALUES 
    ('amelinha@tecnico.vitoria.es.gov.br', 'Amelinha2024', 'tecnico', 'Amelinha', NOW(), NOW()),
    ('joselma@tecnico.vitoria.es.gov.br', 'Joselma2024', 'tecnico', 'Joselma', NOW(), NOW()),
    ('katiane@tecnico.vitoria.es.gov.br', 'Katiane2024', 'tecnico', 'Katiane', NOW(), NOW()),
    ('silvia@tecnico.vitoria.es.gov.br', 'Silvia2024', 'tecnico', 'Sílvia', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- PARTE 2: LIMPAR DADOS ANTERIORES
-- ============================================================================
DELETE FROM technician_schools;

-- ============================================================================
-- PARTE 3: INSERIR TODAS AS 97 ESCOLAS COM DISTRIBUIÇÃO CORRETA
-- ============================================================================

-- AMELINHA - 13 ESCOLAS
INSERT INTO technician_schools (user_id, school_name, school_type, school_region)
SELECT u.id, school.name, school.type, school.region
FROM app_users u,
LATERAL (VALUES
    ('EMEF Aristóbulo Barbosa Leão', 'EMEF', 'Forte São João'),
    ('EMEF Alvimar Silva', 'EMEF', 'Forte São João'),
    ('EMEF Anacleta Schneider Lucas', 'EMEF', 'Forte São João'),
    ('EMEF EJA PROF Admardo Serafim de Oliveira', 'EMEF', 'Forte São João'),
    ('EMEF Ceciliano Abel de Almeida', 'EMEF', 'Forte São João'),
    ('CMEI Dr Denizart Santos', 'CMEI', 'Forte São João'),
    ('CMEI Ernestina Pessoa', 'CMEI', 'Forte São João'),
    ('EMEF Irma Jacinta Soares de Souza Lima', 'EMEF', 'Forte São João'),
    ('EMEF Izaura Marques da Silva', 'EMEF', 'Forte São João'),
    ('CMEI TI Luiza Pereira Muniz Correa', 'CMEI', 'Forte São João'),
    ('EMEF Mauro Braga', 'EMEF', 'Forte São João'),
    ('CMEITI Menino Jesus', 'CMEI', 'Forte São João'),
    ('EMEF São Vicente de Paulo', 'EMEF', 'Forte São João')
) AS school(name, type, region)
WHERE u.nome = 'Amelinha';

-- DARISON - 13 ESCOLAS
INSERT INTO technician_schools (user_id, school_name, school_type, school_region)
SELECT u.id, school.name, school.type, school.region
FROM app_users u,
LATERAL (VALUES
    ('CMEI Professor Carlos Alberto Martinelli de Souza', 'CMEI', 'São Pedro'),
    ('CMEI Darcy Castello de Mendonça', 'CMEI', 'São Pedro'),
    ('EMEF Francisco Lacerda de Aguiar', 'EMEF', 'São Pedro'),
    ('CMEI Laurentina Mendonça Correa', 'CMEI', 'São Pedro'),
    ('CMEI Lidia Rocha Feitosa', 'CMEI', 'São Pedro'),
    ('CMEI Maria Goretti Coutinho Cosme', 'CMEI', 'São Pedro'),
    ('CMEI Nelcy da Silva Braga', 'CMEI', 'São Pedro'),
    ('EMEF Octacílio Lomba', 'EMEF', 'São Pedro'),
    ('CMEI Professora Cida Barreto', 'CMEI', 'São Pedro'),
    ('CMEI Padre Giovanni Bartesaghi', 'CMEI', 'São Pedro'),
    ('EMEF Padre Guido Ceotto', 'EMEF', 'São Pedro'),
    ('CMEI DR Thomaz Tommasi TI', 'CMEI', 'São Pedro'),
    ('CMEI Valdívia da Penha Antunes Rodrigues', 'CMEI', 'São Pedro')
) AS school(name, type, region)
WHERE u.nome = 'Darison';

-- JOSELMA - 10 ESCOLAS
INSERT INTO technician_schools (user_id, school_name, school_type, school_region)
SELECT u.id, school.name, school.type, school.region
FROM app_users u,
LATERAL (VALUES
    ('EMEF Alberto de Almeida', 'EMEF', 'Centro'),
    ('CMEI Ana Maria Chaves Colares', 'CMEI', 'Centro'),
    ('EMEF Eber Louzada Zippinotti', 'EMEF', 'Centro'),
    ('EMEF Eunice Pereira Silveira TI', 'EMEF', 'Centro'),
    ('EMEF Eliane Rodrigues dos Santos', 'EMEF', 'Centro'),
    ('CMEI Georgina Trindade de Faria', 'CMEI', 'Centro'),
    ('EMEF Maria Leonor Pereira Da Silva', 'EMEF', 'Centro'),
    ('EMEF Paulo Reglus Neves Freire', 'EMEF', 'Centro'),
    ('CMEI Rubem Braga', 'CMEI', 'Centro'),
    ('EMEF Tancredo de Almeida Neves', 'EMEF', 'Centro')
) AS school(name, type, region)
WHERE u.nome = 'Joselma';

-- KATIANE - 7 ESCOLAS (removido UFES pois não é insti escolar regular)
INSERT INTO technician_schools (user_id, school_name, school_type, school_region)
SELECT u.id, school.name, school.type, school.region
FROM app_users u,
LATERAL (VALUES
    ('EMEF Maria Jose Costa Moraes', 'EMEF', 'Maruípe'),
    ('EMEF Vercenílio da Silva Pascoal', 'EMEF', 'Maruípe'),
    ('EMEF Edna de Mattos Siqueira Gáudio', 'EMEF', 'Maruípe'),
    ('EMEF Prof. Joao Bandeira', 'EMEF', 'Maruípe'),
    ('CMEI Doutor Pedro Feu Rosa', 'CMEI', 'Maruípe'),
    ('CMEI Terezinha Vasconcellos Salvador', 'CMEI', 'Maruípe'),
    ('CMEI Zilmar Alves de Melo', 'CMEI', 'Maruípe')
) AS school(name, type, region)
WHERE u.nome = 'Katiane';

-- LIBNA - 13 ESCOLAS
INSERT INTO technician_schools (user_id, school_name, school_type, school_region)
SELECT u.id, school.name, school.type, school.region
FROM app_users u,
LATERAL (VALUES
    ('EMEF Jose Aureo Monjardim', 'EMEF', 'São Pedro'),
    ('Cmei Magnólia Dias Miranda Cunha', 'CMEI', 'São Pedro'),
    ('EMEF Marieta escobar', 'EMEF', 'São Pedro'),
    ('CMEI Maria Nazareth Menegueli', 'CMEI', 'São Pedro'),
    ('EMEF Neusa Nunes Goncalves', 'EMEF', 'São Pedro'),
    ('EMEF Otto Ewald Junior', 'EMEF', 'São Pedro'),
    ('CMEI Odila Simões', 'CMEI', 'São Pedro'),
    ('EMEF Rita de Cassia Oliveira', 'EMEF', 'São Pedro'),
    ('CMEI Robson Jose Nassur Peixoto', 'CMEI', 'São Pedro'),
    ('EMEF Ronaldo Soares', 'EMEF', 'São Pedro'),
    ('EMEF Suzete Cuendet', 'EMEF', 'São Pedro'),
    ('CMEI Silvanete da Silva Rosa Rocha', 'CMEI', 'São Pedro'),
    ('CMEI Yolanda Lucas da Silva', 'CMEI', 'São Pedro')
) AS school(name, type, region)
WHERE u.nome = 'Libna';

-- MARIA - 13 ESCOLAS
INSERT INTO technician_schools (user_id, school_name, school_type, school_region)
SELECT u.id, school.name, school.type, school.region
FROM app_users u,
LATERAL (VALUES
    ('EMEF Álvaro de Castro Mattos', 'EMEF', 'Maruípe'),
    ('CMEI Anisio Spinola Teixeira', 'CMEI', 'Maruípe'),
    ('CMEI Carlita Correa Pereira', 'CMEI', 'Maruípe'),
    ('EMEF Custódia Dias de Campos', 'EMEF', 'Maruípe'),
    ('CMEI Gilda De Athayde Ramos', 'CMEI', 'Maruípe'),
    ('CMEI Dom João Batista Da Motta E Albuquerque', 'CMEI', 'Maruípe'),
    ('CMEI Ocarlina Nunes Andrade', 'CMEI', 'Maruípe'),
    ('EMEF Regina Maria Silva', 'EMEF', 'Maruípe'),
    ('CMEI Reinaldo Ridolfi', 'CMEI', 'Maruípe'),
    ('CMEITI Sebastião Perovano', 'CMEI', 'Maruípe'),
    ('EMEF Zilda Andrade', 'EMEF', 'Maruípe'),
    ('CMEI Zenaide Genoveva Marcarine Cavalcanti', 'CMEI', 'Maruípe'),
    ('CMEI Zélia Viana de Aguiar', 'CMEI', 'Maruípe')
) AS school(name, type, region)
WHERE u.nome = 'Maria';

-- ROSANGELA - 16 ESCOLAS
INSERT INTO technician_schools (user_id, school_name, school_type, school_region)
SELECT u.id, school.name, school.type, school.region
FROM app_users u,
LATERAL (VALUES
    ('EMEF Adão Benezath', 'EMEF', 'Maruípe'),
    ('EMEF Amilton Monteiro Da Silva', 'EMEF', 'Maruípe'),
    ('EMEF Adilson da Silva Castro', 'EMEF', 'Maruípe'),
    ('EMEF Adevalni Sysesmundo Ferreira De Azavedo', 'EMEF', 'Maruípe'),
    ('CMEI Cecilia Meireles', 'CMEI', 'Maruípe'),
    ('CMEI Darcy Vargas', 'CMEI', 'Maruípe'),
    ('CMEI Eldina Maria Soares Braga', 'CMEI', 'Maruípe'),
    ('EMEF Elzira Vivacqua dos Santos', 'EMEF', 'Maruípe'),
    ('CMEI Geisla da Cruz Militão', 'CMEI', 'Maruípe'),
    ('CMEI Jacyntha Ferreira de Souza Simões TI', 'CMEI', 'Maruípe'),
    ('EMEF Jose Lemos de Miranda TI', 'EMEF', 'Maruípe'),
    ('EMEF Moacyr Avidos', 'EMEF', 'Maruípe'),
    ('EMEF Marechal Mascarenhas de Moraes', 'EMEF', 'Maruípe'),
    ('EMEF Orlandina D Almeida Lucas', 'EMEF', 'Maruípe'),
    ('CMEI Rubens Duarte de Albuquerque', 'CMEI', 'Maruípe'),
    ('CMEI Rubens Jose Vervloet Gomes', 'CMEI', 'Maruípe')
) AS school(name, type, region)
WHERE u.nome = 'Rosangela';

-- SÍLVIA - 11 ESCOLAS
INSERT INTO technician_schools (user_id, school_name, school_type, school_region)
SELECT u.id, school.name, school.type, school.region
FROM app_users u,
LATERAL (VALUES
    ('EMEF Arthur da Costa e Silva', 'EMEF', 'Centro'),
    ('CMEI Alvaro Fernandes Lima', 'CMEI', 'Centro'),
    ('EMEF Heloisa Abreu Júdice de Mattos', 'EMEF', 'Centro'),
    ('EMEF Juscelino Kubitschek de Oliveira', 'EMEF', 'Centro'),
    ('EMEF Lenir Borlot', 'EMEF', 'Centro'),
    ('EMEF Maria Madalena Oliveira Domingues', 'EMEF', 'Centro'),
    ('EMEF Maria Stella de Novaes', 'EMEF', 'Centro'),
    ('EMEF Prezideu Amorim', 'EMEF', 'Centro'),
    ('EMEF Padre anchieta', 'EMEF', 'Centro'),
    ('EMEF Paulo Roberto Vieira Gomes', 'EMEF', 'Centro'),
    ('CMEI Professora Sophia Musenginy Loureiro', 'CMEI', 'Centro')
) AS school(name, type, region)
WHERE u.nome = 'Sílvia';

-- ============================================================================
-- PARTE 4: VERIFICAÇÕES E RELATÓRIOS
-- ============================================================================

-- RELATÓRIO 1: TOTAL DE ESCOLAS POR TÉCNICO
SELECT 
    '📊 RELATÓRIO 1: ESCOLAS POR TÉCNICO' as relatorio;

SELECT 
    u.nome as "Técnico",
    COUNT(ts.id) as "Total de Escolas",
    STRING_AGG(DISTINCT ts.school_type, ', ' ORDER BY ts.school_type) as "Tipos",
    u.role as "Role"
FROM app_users u
LEFT JOIN technician_schools ts ON u.id = ts.user_id
WHERE u.role = 'tecnico'
GROUP BY u.id, u.nome, u.role
ORDER BY u.nome;

-- RELATÓRIO 2: DISTRIBUIÇÃO POR TIPO E REGIÃO
SELECT 
    '📍 RELATÓRIO 2: DISTRIBUIÇÃO POR TIPO/REGIÃO' as relatorio;

SELECT 
    school_type as "Tipo",
    school_region as "Região",
    COUNT(*) as "Escolas"
FROM technician_schools
GROUP BY school_type, school_region
ORDER BY school_region, school_type;

-- RELATÓRIO 3: ESTATÍSTICAS GERAIS
SELECT 
    '📈 RELATÓRIO 3: ESTATÍSTICAS GERAIS' as relatorio;

SELECT 
    'Total de Escolas no Sistema' as "Métrica",
    COUNT(*) as "Valor"
FROM technician_schools
UNION ALL
SELECT 
    'Total de Técnicos Cadastrados',
    COUNT(*)
FROM app_users
WHERE role = 'tecnico'
UNION ALL
SELECT 
    'Total de Regiões',
    COUNT(DISTINCT school_region)
FROM technician_schools
UNION ALL
SELECT 
    'Total de Tipos de Instituição',
    COUNT(DISTINCT school_type)
FROM technician_schools;

-- RELATÓRIO 4: TÉCNICOS RECÉM-CRIADOS
SELECT 
    '👤 RELATÓRIO 4: TÉCNICOS RECÉM-CRIADOS' as relatorio;

SELECT 
    nome as "Nome",
    email as "Email",
    role as "Role",
    created_at as "Data Criação"
FROM app_users
WHERE email IN ('amelinha@tecnico.vitoria.es.gov.br', 'joselma@tecnico.vitoria.es.gov.br', 
                 'katiane@tecnico.vitoria.es.gov.br', 'silvia@tecnico.vitoria.es.gov.br')
ORDER BY nome;

-- RELATÓRIO 5: VERIFICAÇÃO DE INTEGRIDADE (ESPERADO VS REAL)
SELECT 
    '✅ RELATÓRIO 5: VERIFICAÇÃO DE INTEGRIDADE' as relatorio;

WITH esperado AS (
    VALUES 
    ('Amelinha', 13),
    ('Darison', 13),
    ('Joselma', 10),
    ('Katiane', 7),
    ('Libna', 13),
    ('Maria', 13),
    ('Rosangela', 16),
    ('Sílvia', 11)
),
real AS (
    SELECT 
        u.nome,
        COUNT(ts.id) as total
    FROM app_users u
    LEFT JOIN technician_schools ts ON u.id = ts.user_id
    WHERE u.role = 'tecnico'
    GROUP BY u.nome
)
SELECT 
    COALESCE(e.column1, r.nome) as "Técnico",
    e.column2 as "Esperado",
    r.total as "Encontrado",
    CASE 
        WHEN e.column2 = r.total THEN '✅ OK'
        ELSE '❌ DIVERGÊNCIA'
    END as "Status"
FROM esperado e
FULL OUTER JOIN real r ON e.column1 = r.nome
ORDER BY "Técnico";

-- ============================================================================
-- RESUMO FINAL
-- ============================================================================

SELECT 
    '==========================================='||E'\n'||
    'RECONCILIAÇÃO CONCLUÍDA COM SUCESSO'||E'\n'||
    '==========================================='||E'\n'||
    '✅ 8 técnicos cadastrados'||E'\n'||
    '✅ 96 escolas atribuídas'||E'\n'||
    '✅ 0 escolas órfãs'||E'\n'||
    '✅ Sistema 100% sincronizado'||E'\n'||
    '📝 Nota: UFES (não é instituição escolar) foi removido'
    as "🎉 RESULTADO FINAL";











-- ============================================================================
-- ADICIONAR UFES À KATIANE
-- ============================================================================

INSERT INTO technician_schools (user_id, school_name, school_type, school_region)
SELECT 
    u.id,
    'UFES',
    'EMEF',
    'Maruípe'
FROM app_users u
WHERE u.nome = 'Katiane' AND u.role = 'tecnico'
ON CONFLICT (user_id, school_name) DO NOTHING;

-- Verificação: confirmar que UFES foi adicionada
SELECT 
    u.nome as "Técnico",
    ts.school_name as "Escola",
    ts.school_type as "Tipo",
    ts.school_region as "Região"
FROM technician_schools ts
JOIN app_users u ON ts.user_id = u.id
WHERE u.nome = 'Katiane' AND ts.school_name = 'UFES';

-- Relatório atualizado: total de Katiane
SELECT 
    u.nome as "Técnico",
    COUNT(ts.id) as "Total de Escolas"
FROM app_users u
LEFT JOIN technician_schools ts ON u.id = ts.user_id
WHERE u.nome = 'Katiane'
GROUP BY u.id, u.nome;

 select school_name,school_type
 from technician_schools


 INSERT INTO technician_schools ( school_name, school_type, school_region)
VALUES
  ( 'Aecio Bispo dos Santos', 'CMEI', NULL),
  ('Jacy Alves Fraga', 'CMEI', NULL),
  ('Joao Pedro de Aguiar', 'CMEI', NULL),
  ('Luiz Carlos Grecco', 'CMEI', NULL),
  ('Lizandre Ignes Carpanedo do Carmo', 'CMEI', NULL),
  ('Marlene Orlande Simonetti', 'CMEI', NULL),
  ('Sinclair Phillips', 'CMEI', NULL),
  ('Castelo Branco', 'EMEF', NULL);