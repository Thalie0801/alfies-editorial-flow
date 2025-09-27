// Script pour configurer automatiquement les codes promo
import { supabase } from '@/integrations/supabase/client';

export const runPromoSetup = async () => {
  console.log('🚀 Configuration des codes promo en cours...');
  
  try {
    const { data, error } = await supabase.functions.invoke('setup-promo-codes');
    
    if (error) {
      console.error('❌ Erreur:', error);
      return false;
    }
    
    console.log('✅ Codes promo configurés:', data);
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la configuration:', error);
    return false;
  }
};

// Auto-exécution
if (typeof window !== 'undefined') {
  // Attendre 2 secondes puis configurer automatiquement
  setTimeout(() => {
    runPromoSetup().then(success => {
      if (success) {
        console.log('🎉 Configuration terminée avec succès !');
      }
    });
  }, 2000);
}