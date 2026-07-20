-- Product combos: bundle multiple products under one named offer.
-- Run once in Supabase Dashboard → SQL Editor.

CREATE TABLE IF NOT EXISTS public.combos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tagline TEXT DEFAULT '',
  description TEXT DEFAULT '',
  price NUMERIC NOT NULL CHECK (price > 0),
  image_url TEXT,
  is_in_stock BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.combo_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  combo_id UUID NOT NULL REFERENCES public.combos(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  sort_order INT NOT NULL DEFAULT 0,
  UNIQUE (combo_id, product_id)
);

CREATE INDEX IF NOT EXISTS combo_items_combo_id_idx ON public.combo_items(combo_id);
CREATE INDEX IF NOT EXISTS combo_items_product_id_idx ON public.combo_items(product_id);

ALTER TABLE public.combos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.combo_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "combos public read" ON public.combos;
CREATE POLICY "combos public read"
  ON public.combos FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "combo_items public read" ON public.combo_items;
CREATE POLICY "combo_items public read"
  ON public.combo_items FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "combos authenticated all" ON public.combos;
CREATE POLICY "combos authenticated all"
  ON public.combos FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "combo_items authenticated all" ON public.combo_items;
CREATE POLICY "combo_items authenticated all"
  ON public.combo_items FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
