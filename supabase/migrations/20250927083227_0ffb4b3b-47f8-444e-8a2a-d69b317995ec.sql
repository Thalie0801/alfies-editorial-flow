-- Fix security vulnerability: Restrict profiles access to authenticated users only
-- Remove the overly permissive policy that allows public access to all profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create a secure policy that only allows users to view their own profile
CREATE POLICY "Users can view their own profile only" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Optional: Allow authenticated users to view basic profile info of other users
-- (Uncomment if your app needs this functionality for user directories, etc.)
-- CREATE POLICY "Authenticated users can view basic profile info" 
-- ON public.profiles 
-- FOR SELECT 
-- TO authenticated
-- USING (true);