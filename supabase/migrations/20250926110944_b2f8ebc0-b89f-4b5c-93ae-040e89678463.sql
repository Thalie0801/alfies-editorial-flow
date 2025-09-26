-- Add Fynk interactions quota to plan_limits
ALTER TABLE public.plan_limits 
ADD COLUMN IF NOT EXISTS fynk_interactions_max integer DEFAULT 0;

-- Add Fynk interactions tracking to usage_tracking
ALTER TABLE public.usage_tracking 
ADD COLUMN IF NOT EXISTS fynk_interactions_used integer DEFAULT 0;

-- Add addons column to subscriptions table
ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS addons jsonb DEFAULT '[]'::jsonb;

-- Update plan limits with Fynk quotas
UPDATE public.plan_limits 
SET fynk_interactions_max = 400 
WHERE plan_key = 'fynk_basic_m';

INSERT INTO public.plan_limits (plan_key, posts, covers, stories, carousels, snacks, hero, networks, articles, fynk_interactions_max)
VALUES 
  ('fynk_basic_m', 0, 0, 0, 0, 0, 0, 0, 0, 400),
  ('fynk_pro_m', 0, 0, 0, 0, 0, 0, 0, 0, 1500)
ON CONFLICT (plan_key) DO UPDATE SET
  fynk_interactions_max = EXCLUDED.fynk_interactions_max;