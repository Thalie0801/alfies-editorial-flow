-- Fix critical security issues

-- 1. Secure plan_limits table - require authentication to view business data
DROP POLICY IF EXISTS "Plan limits are viewable by everyone" ON public.plan_limits;

CREATE POLICY "Plan limits are viewable by authenticated users only" 
ON public.plan_limits 
FOR SELECT 
TO authenticated
USING (true);

-- 2. Add admin-only policies for user_roles management
CREATE POLICY "Only admins can insert user roles" 
ON public.user_roles 
FOR INSERT 
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update user roles" 
ON public.user_roles 
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete user roles" 
ON public.user_roles 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. Create audit logging table for role changes
CREATE TABLE public.role_audit_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    target_user_id uuid NOT NULL,
    action text NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    old_role app_role,
    new_role app_role,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.role_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Only admins can view role audit logs" 
ON public.role_audit_log 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger function for role audit logging
CREATE OR REPLACE FUNCTION public.log_role_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.role_audit_log (user_id, target_user_id, action, new_role)
        VALUES (auth.uid(), NEW.user_id, 'INSERT', NEW.role);
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO public.role_audit_log (user_id, target_user_id, action, old_role, new_role)
        VALUES (auth.uid(), NEW.user_id, 'UPDATE', OLD.role, NEW.role);
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO public.role_audit_log (user_id, target_user_id, action, old_role)
        VALUES (auth.uid(), OLD.user_id, 'DELETE', OLD.role);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for role audit logging
CREATE TRIGGER role_audit_insert_trigger
    AFTER INSERT ON public.user_roles
    FOR EACH ROW EXECUTE FUNCTION public.log_role_changes();

CREATE TRIGGER role_audit_update_trigger
    AFTER UPDATE ON public.user_roles
    FOR EACH ROW EXECUTE FUNCTION public.log_role_changes();

CREATE TRIGGER role_audit_delete_trigger
    AFTER DELETE ON public.user_roles
    FOR EACH ROW EXECUTE FUNCTION public.log_role_changes();