-- Tabelle für gespeicherte Ergebnisse mit Standort
CREATE TABLE IF NOT EXISTS public.results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  city TEXT,
  region TEXT,
  country TEXT,
  answers JSONB NOT NULL,
  party_matches JSONB NOT NULL
);

-- Index für Map-Abfragen
CREATE INDEX IF NOT EXISTS idx_results_location ON public.results (lat, lng);
CREATE INDEX IF NOT EXISTS idx_results_created ON public.results (created_at DESC);

-- RLS: Jeder kann einfügen (anonym), jeder kann lesen (für Map)
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert" ON public.results
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read" ON public.results
  FOR SELECT USING (true);
