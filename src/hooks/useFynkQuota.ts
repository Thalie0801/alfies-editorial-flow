import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type SubscriptionRow = { addons: string[] | null };
type PlanLimitsRow = { fynk_interactions_max: number | null };

export function useFynkQuota() {
  const { toast } = useToast();

  const incrementFynkUsage = async (userId: string) => {
    try {
      // Get current month-year
      const currentMonth = new Date().toISOString().slice(0, 7);
      
      // Get or create usage tracking
      const { data: tracking, error: trackingError } = await supabase
        .rpc('get_or_create_usage_tracking', { user_id_param: userId });

      if (trackingError) {
        console.error('Error getting usage tracking:', trackingError);
        return false;
      }

      // Check current usage and limits
      const { data: usage } = await supabase
        .from('usage_tracking')
        .select('fynk_interactions_used')
        .eq('user_id', userId)
        .eq('month_year', currentMonth)
        .single();

      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('addons')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const addons = Array.isArray(subscription?.addons) ? subscription.addons as string[] : null;
      if (!addons) {
        toast({
          title: "Fynk non activé",
          description: "Activez Fynk pour utiliser les interactions automatisées",
          variant: "destructive",
        });
        return false;
      }

      // Get Fynk addon and quota
      const fynkAddon = addons.find((addon: string) => addon.includes('fynk_'));

      if (!fynkAddon) {
        toast({
          title: "Fynk non activé",
          description: "Aucun plan Fynk trouvé dans votre abonnement",
          variant: "destructive",
        });
        return false;
      }

      const { data: limits } = await supabase
        .from('plan_limits')
        .select('fynk_interactions_max')
        .eq('plan_key', fynkAddon as string)
        .single();

      const currentUsage = usage?.fynk_interactions_used || 0;
      const quota = limits?.fynk_interactions_max || 0;

      if (currentUsage >= quota) {
        const tierName = fynkAddon.includes('basic') ? 'Basic' : 'Pro';
        const nextTier = fynkAddon.includes('basic') ? 'Pro' : null;
        
        toast({
          title: "Quota Fynk atteint",
          description: nextTier 
            ? `Quota ${tierName} atteint — passez à Fynk ${nextTier} pour continuer`
            : "Quota Fynk Pro atteint pour ce mois",
          variant: "destructive",
        });
        return false;
      }

      // Increment usage
      const { error: updateError } = await supabase
        .from('usage_tracking')
        .update({ 
          fynk_interactions_used: currentUsage + 1 
        })
        .eq('user_id', userId)
        .eq('month_year', currentMonth);

      if (updateError) {
        console.error('Error updating Fynk usage:', updateError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in incrementFynkUsage:', error);
      return false;
    }
  };

  const checkFynkQuota = async (userId: string): Promise<{ canUse: boolean; remaining: number; quota: number }> => {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7);
      
      const { data: usage } = await supabase
        .from('usage_tracking')
        .select('fynk_interactions_used')
        .eq('user_id', userId)
        .eq('month_year', currentMonth)
        .maybeSingle();

      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('addons')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const addons = Array.isArray(subscription?.addons) ? subscription.addons as string[] : null;
      if (!addons) {
        return { canUse: false, remaining: 0, quota: 0 };
      }

      const fynkAddon = addons.find((addon: string) => addon.includes('fynk_'));

      if (!fynkAddon) {
        return { canUse: false, remaining: 0, quota: 0 };
      }

      const { data: limits } = await supabase
        .from('plan_limits')
        .select('fynk_interactions_max')
        .eq('plan_key', fynkAddon as string)
        .single();

      const currentUsage = usage?.fynk_interactions_used || 0;
      const quota = limits?.fynk_interactions_max || 0;
      const remaining = Math.max(0, quota - currentUsage);

      return {
        canUse: remaining > 0,
        remaining,
        quota
      };
    } catch (error) {
      console.error('Error checking Fynk quota:', error);
      return { canUse: false, remaining: 0, quota: 0 };
    }
  };

  return {
    incrementFynkUsage,
    checkFynkQuota,
  };
}