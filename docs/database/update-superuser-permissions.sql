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
