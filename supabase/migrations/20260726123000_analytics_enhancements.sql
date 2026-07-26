-- Migration: Add analytics fields and custom event tracking

ALTER TABLE public.page_views
ADD COLUMN browser TEXT,
ADD COLUMN os TEXT,
ADD COLUMN utm_source TEXT,
ADD COLUMN utm_medium TEXT,
ADD COLUMN utm_campaign TEXT,
ADD COLUMN utm_term TEXT,
ADD COLUMN utm_content TEXT;

CREATE INDEX IF NOT EXISTS page_views_browser_idx ON public.page_views (browser);
CREATE INDEX IF NOT EXISTS page_views_os_idx ON public.page_views (os);
CREATE INDEX IF NOT EXISTS page_views_utm_source_idx ON public.page_views (utm_source);
CREATE INDEX IF NOT EXISTS page_views_utm_medium_idx ON public.page_views (utm_medium);
CREATE INDEX IF NOT EXISTS page_views_utm_campaign_idx ON public.page_views (utm_campaign);

CREATE TABLE public.custom_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  path TEXT,
  properties JSONB,
  session_id TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS custom_events_created_at_idx ON public.custom_events (created_at DESC);
CREATE INDEX IF NOT EXISTS custom_events_event_name_idx ON public.custom_events (event_name);

GRANT INSERT ON public.custom_events TO anon, authenticated;
GRANT SELECT ON public.custom_events TO authenticated;
GRANT ALL ON public.custom_events TO service_role;
ALTER TABLE public.custom_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can log custom events" ON public.custom_events FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins read custom events" ON public.custom_events FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
