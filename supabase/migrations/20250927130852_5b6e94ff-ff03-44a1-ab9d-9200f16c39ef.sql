-- Fix log_role_changes to avoid NULL user_id during signup
CREATE OR REPLACE FUNCTION public.log_role_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.role_audit_log (user_id, target_user_id, action, new_role)
        VALUES (COALESCE(auth.uid(), NEW.user_id), NEW.user_id, 'INSERT', NEW.role);
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO public.role_audit_log (user_id, target_user_id, action, old_role, new_role)
        VALUES (COALESCE(auth.uid(), NEW.user_id), NEW.user_id, 'UPDATE', OLD.role, NEW.role);
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO public.role_audit_log (user_id, target_user_id, action, old_role)
        VALUES (COALESCE(auth.uid(), OLD.user_id), OLD.user_id, 'DELETE', OLD.role);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$function$;