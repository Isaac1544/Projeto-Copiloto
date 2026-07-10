ALTER TABLE public.ticket_analyses
  ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE public.human_decisions
  ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE public.knowledge_sources
  ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE public.ticket_analyses
  ADD COLUMN IF NOT EXISTS public_session_id TEXT,
  ADD COLUMN IF NOT EXISTS ticket_payload JSONB;

ALTER TABLE public.human_decisions
  ADD COLUMN IF NOT EXISTS actor_label TEXT;

CREATE INDEX IF NOT EXISTS ticket_analyses_public_session_idx
  ON public.ticket_analyses(public_session_id, created_at DESC);
