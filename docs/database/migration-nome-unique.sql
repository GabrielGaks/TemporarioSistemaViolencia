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
