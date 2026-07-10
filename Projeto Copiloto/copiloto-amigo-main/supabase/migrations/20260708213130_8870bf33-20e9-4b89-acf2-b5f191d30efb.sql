
-- ticket_analyses
CREATE TABLE public.ticket_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ticket_title TEXT NOT NULL,
  ticket_description TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT NOT NULL,
  additional_context TEXT,
  ai_summary TEXT,
  probable_cause TEXT,
  recommended_steps TEXT[] NOT NULL DEFAULT '{}',
  suggested_response TEXT,
  confidence INTEGER NOT NULL DEFAULT 0,
  safety_alerts TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'Pendente',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ticket_analyses TO authenticated;
GRANT ALL ON public.ticket_analyses TO service_role;
ALTER TABLE public.ticket_analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_analyses_select" ON public.ticket_analyses FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own_analyses_insert" ON public.ticket_analyses FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_analyses_update" ON public.ticket_analyses FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_analyses_delete" ON public.ticket_analyses FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- human_decisions
CREATE TABLE public.human_decisions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  analysis_id UUID NOT NULL REFERENCES public.ticket_analyses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  decision TEXT NOT NULL,
  edited_response TEXT,
  comment TEXT,
  decided_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.human_decisions TO authenticated;
GRANT ALL ON public.human_decisions TO service_role;
ALTER TABLE public.human_decisions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_decisions_select" ON public.human_decisions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own_decisions_insert" ON public.human_decisions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_decisions_update" ON public.human_decisions FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_decisions_delete" ON public.human_decisions FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX human_decisions_analysis_idx ON public.human_decisions(analysis_id, decided_at DESC);

-- knowledge_sources
CREATE TABLE public.knowledge_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  analysis_id UUID NOT NULL REFERENCES public.ticket_analyses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  source_type TEXT NOT NULL DEFAULT 'kb',
  reference TEXT NOT NULL,
  relevance INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.knowledge_sources TO authenticated;
GRANT ALL ON public.knowledge_sources TO service_role;
ALTER TABLE public.knowledge_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_sources_select" ON public.knowledge_sources FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own_sources_insert" ON public.knowledge_sources FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_sources_delete" ON public.knowledge_sources FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX knowledge_sources_analysis_idx ON public.knowledge_sources(analysis_id);

-- Trigger to keep updated_at fresh
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_ticket_analyses_updated_at
BEFORE UPDATE ON public.ticket_analyses
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
