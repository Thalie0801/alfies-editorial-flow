-- Create plan limits table for quota management
CREATE TABLE public.plan_limits (
  plan_key text PRIMARY KEY,
  articles integer NOT NULL DEFAULT 0,
  networks integer NOT NULL DEFAULT 1,
  hero integer NOT NULL DEFAULT 0,
  snacks integer NOT NULL DEFAULT 0,
  carousels integer NOT NULL DEFAULT 0,
  stories integer NOT NULL DEFAULT 0,
  covers integer NOT NULL DEFAULT 0,
  posts integer NOT NULL DEFAULT 0
);

-- Insert plan limits for all plans
INSERT INTO public.plan_limits (plan_key, articles, networks, hero, snacks, carousels, stories, covers, posts) VALUES
('aeditus_essential_m', 0, 1, 4, 0, 0, 0, 0, 12),
('aeditus_starter_m', 2, 4, 1, 10, 4, 6, 3, 30),
('aeditus_pro_m', 4, 7, 4, -1, 6, 8, 4, 60),
('aeditus_amb_m', 2, 3, 2, 8, 3, 4, 2, 30);

-- Create stripe customers table
CREATE TABLE public.stripe_customers (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_id text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (user_id),
  UNIQUE (customer_id)
);

-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL,
  price_lookup_key text,
  period_start timestamp with time zone,
  period_end timestamp with time zone,
  cancel_at_period_end boolean DEFAULT false,
  trial_end timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create usage tracking table for monthly quotas
CREATE TABLE public.usage_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month_year text NOT NULL, -- Format: YYYY-MM for tracking monthly usage
  articles_used integer DEFAULT 0,
  hero_used integer DEFAULT 0,
  snacks_used integer DEFAULT 0,
  carousels_used integer DEFAULT 0,
  stories_used integer DEFAULT 0,
  covers_used integer DEFAULT 0,
  posts_used integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, month_year)
);

-- Enable RLS on all tables
ALTER TABLE public.plan_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

-- RLS policies for plan_limits (readable by all authenticated users)
CREATE POLICY "Plan limits are readable by authenticated users" 
ON public.plan_limits 
FOR SELECT 
TO authenticated 
USING (true);

-- RLS policies for stripe_customers
CREATE POLICY "Users can view their own stripe customer data" 
ON public.stripe_customers 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stripe customer data" 
ON public.stripe_customers 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- RLS policies for subscriptions
CREATE POLICY "Users can view their own subscriptions" 
ON public.subscriptions 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions" 
ON public.subscriptions 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" 
ON public.subscriptions 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

-- RLS policies for usage_tracking
CREATE POLICY "Users can view their own usage" 
ON public.usage_tracking 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage" 
ON public.usage_tracking 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage" 
ON public.usage_tracking 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

-- Function to get current month-year in Europe/Paris timezone
CREATE OR REPLACE FUNCTION get_current_month_year()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT to_char(now() AT TIME ZONE 'Europe/Paris', 'YYYY-MM');
$$;

-- Function to get or create usage tracking for current month
CREATE OR REPLACE FUNCTION get_or_create_usage_tracking(user_id_param uuid)
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
  current_month text;
  tracking_id uuid;
BEGIN
  current_month := get_current_month_year();
  
  INSERT INTO public.usage_tracking (user_id, month_year)
  VALUES (user_id_param, current_month)
  ON CONFLICT (user_id, month_year) DO NOTHING
  RETURNING id INTO tracking_id;
  
  IF tracking_id IS NULL THEN
    SELECT id INTO tracking_id 
    FROM public.usage_tracking 
    WHERE user_id = user_id_param AND month_year = current_month;
  END IF;
  
  RETURN tracking_id;
END;
$$;

-- Trigger to update updated_at on subscriptions
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to update updated_at on usage_tracking
CREATE TRIGGER update_usage_tracking_updated_at
  BEFORE UPDATE ON public.usage_tracking
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();