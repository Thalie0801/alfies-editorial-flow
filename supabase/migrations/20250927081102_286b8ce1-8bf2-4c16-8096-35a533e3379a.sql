-- Fix all functions to have proper search_path set

-- Fix get_or_create_usage_tracking function
CREATE OR REPLACE FUNCTION public.get_or_create_usage_tracking(user_id_param UUID)
RETURNS TABLE(
  id UUID,
  user_id UUID,
  month_year TEXT,
  articles_used INTEGER,
  hero_videos_used INTEGER,
  snacks_used INTEGER,
  carousels_used INTEGER,
  fynk_interactions_used INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_month_year TEXT;
  existing_record RECORD;
BEGIN
  -- Get current month-year
  current_month_year := to_char(now(), 'YYYY-MM');
  
  -- Try to get existing record
  SELECT * INTO existing_record
  FROM public.usage_tracking ut
  WHERE ut.user_id = user_id_param AND ut.month_year = current_month_year;
  
  -- If no record exists, create one
  IF existing_record IS NULL THEN
    INSERT INTO public.usage_tracking (user_id, month_year, articles_used, hero_videos_used, snacks_used, carousels_used, fynk_interactions_used)
    VALUES (user_id_param, current_month_year, 0, 0, 0, 0, 0)
    RETURNING * INTO existing_record;
  END IF;
  
  -- Return the record
  RETURN QUERY SELECT 
    existing_record.id,
    existing_record.user_id,
    existing_record.month_year,
    existing_record.articles_used,
    existing_record.hero_videos_used,
    existing_record.snacks_used,
    existing_record.carousels_used,
    existing_record.fynk_interactions_used;
END;
$$;

-- Fix update_updated_at_column function  
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'client');
  
  RETURN NEW;
END;
$$;