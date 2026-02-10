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
