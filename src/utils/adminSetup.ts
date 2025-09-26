import { supabase } from '@/integrations/supabase/client';

/**
 * Function to make a user admin. This should be called after user registration.
 * In production, this would be handled through a secure admin interface.
 */
export async function makeUserAdmin(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: 'admin'
      });

    if (error) {
      console.error('Error making user admin:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error:', error);
    return { success: false, error };
  }
}

/**
 * Function to check if current user is admin
 */
export async function checkIsAdmin() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }

    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    return !error && data?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}