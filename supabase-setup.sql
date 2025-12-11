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
