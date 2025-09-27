import { supabase } from '@/integrations/supabase/client';

export async function setupPromoCodes() {
  try {
    console.log('Setting up promotion codes...');
    
    const { data, error } = await supabase.functions.invoke('setup-promo-codes');
    
    if (error) {
      console.error('Error setting up promo codes:', error);
      return { success: false, error };
    }
    
    console.log('Promo codes setup result:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error calling setup-promo-codes function:', error);
    return { success: false, error };
  }
}