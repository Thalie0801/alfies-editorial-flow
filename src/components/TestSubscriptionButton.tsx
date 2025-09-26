import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function TestSubscriptionButton() {
  const [loading, setLoading] = useState(false);

  const checkSubscription = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        toast.error('Erreur lors de la vérification: ' + error.message);
        console.error('Error:', error);
        return;
      }

      console.log('Subscription check result:', data);
      
      if (data.hasActiveSubscription) {
        toast.success(`✅ Abonnement actif trouvé !
Status: ${data.subscription.status}
Plan: ${data.subscription.price_lookup_key || 'N/A'}
Fin période: ${data.subscription.period_end ? new Date(data.subscription.period_end).toLocaleDateString() : 'N/A'}`);
      } else {
        toast.warning('❌ Aucun abonnement actif trouvé');
        if (data.allSubscriptions?.length > 0) {
          console.log('Found subscriptions:', data.allSubscriptions);
          toast.info(`Abonnements trouvés: ${data.allSubscriptions.length} (mais inactifs)`);
        }
      }
    } catch (error) {
      toast.error('Erreur de connexion: ' + (error as Error).message);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={checkSubscription} 
      disabled={loading}
      variant="outline"
      className="mb-4"
    >
      {loading ? 'Vérification...' : '🔍 Vérifier abonnement Stripe'}
    </Button>
  );
}