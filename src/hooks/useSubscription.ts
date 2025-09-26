import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

export interface Subscription {
  id: string;
  user_id: string;
  status: string;
  price_lookup_key: string | null;
  period_start: string | null;
  period_end: string | null;
  cancel_at_period_end: boolean;
  trial_end: string | null;
  created_at: string;
  updated_at: string;
  addons: string[] | null;
}

export interface PlanLimits {
  plan_key: string;
  articles: number;
  networks: number;
  hero: number;
  snacks: number;
  carousels: number;
  stories: number;
  covers: number;
  posts: number;
  fynk_interactions_max: number;
}

export interface UsageTracking {
  id: string;
  user_id: string;
  month_year: string;
  articles_used: number;
  hero_used: number;
  snacks_used: number;
  carousels_used: number;
  stories_used: number;
  covers_used: number;
  posts_used: number;
  fynk_interactions_used: number;
  created_at: string;
  updated_at: string;
}

export function useSubscription(user: User | null) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [planLimits, setPlanLimits] = useState<PlanLimits | null>(null);
  const [usage, setUsage] = useState<UsageTracking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      if (!user) {
        setSubscription(null);
        setPlanLimits(null);
        setUsage(null);
        setLoading(false);
        return;
      }

      try {
        // Sync subscription state from Stripe before reading DB
        const { data: syncData, error: syncError } = await supabase.functions.invoke('check-subscription');
        if (syncError) {
          console.error('Error invoking check-subscription:', syncError);
        } else {
          console.log('check-subscription sync result:', syncData);
        }

        // Fetch subscription
        const { data: subData, error: subError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (subError) {
          console.error('Error fetching subscription:', subError);
        } else if (subData) {
          // Convert JSON addons to string array
          const subscription = {
            ...subData,
            addons: Array.isArray(subData.addons) ? subData.addons : []
          } as Subscription;
          setSubscription(subscription);

          // Fetch plan limits if we have a price lookup key
          if (subscription.price_lookup_key) {
            const { data: limitsData, error: limitsError } = await supabase
              .from('plan_limits')
              .select('*')
              .eq('plan_key', subscription.price_lookup_key)
              .single();

            if (limitsError) {
              console.error('Error fetching plan limits:', limitsError);
            } else {
              setPlanLimits(limitsData);
            }
          }
        }

        // Fetch usage for current month
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
        const { data: usageData, error: usageError } = await supabase
          .from('usage_tracking')
          .select('*')
          .eq('user_id', user.id)
          .eq('month_year', currentMonth)
          .maybeSingle();

        if (usageError) {
          console.error('Error fetching usage:', usageError);
        } else if (usageData) {
          setUsage(usageData);
        } else {
          // Create usage tracking for current month if it doesn't exist
          const { data: newUsage, error: createError } = await supabase
            .from('usage_tracking')
            .insert({
              user_id: user.id,
              month_year: currentMonth,
            })
            .select()
            .single();

          if (createError) {
            console.error('Error creating usage tracking:', createError);
          } else {
            setUsage(newUsage);
          }
        }

      } catch (error) {
        console.error('Error fetching subscription data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [user]);

  // Helper functions
  const hasActiveSubscription = () => {
    return subscription && ['active', 'trialing'].includes(subscription.status);
  };

  const isInTrial = () => {
    return subscription?.status === 'trialing';
  };

  const canPublish = () => {
    if (!subscription) return false;
    if (subscription.price_lookup_key === 'aeditus_essential_m' && isInTrial()) {
      return false; // Essential trial blocks publishing
    }
    return hasActiveSubscription();
  };

  const hasReachedLimit = (type: keyof UsageTracking) => {
    if (!planLimits || !usage) return false;
    
    const limit = planLimits[type as keyof PlanLimits] as number;
    const used = usage[type] as number;
    
    // -1 means unlimited
    if (limit === -1) return false;
    
    return used >= limit;
  };

  const getUsagePercentage = (type: keyof UsageTracking) => {
    if (!planLimits || !usage) return 0;
    
    const limit = planLimits[type as keyof PlanLimits] as number;
    const used = usage[type] as number;
    
    if (limit === -1) return 0; // Unlimited
    if (limit === 0) return 100; // No quota allowed
    
    return Math.min((used / limit) * 100, 100);
  };

  return {
    subscription,
    planLimits,
    usage,
    loading,
    hasActiveSubscription,
    isInTrial,
    canPublish,
    hasReachedLimit,
    getUsagePercentage,
  };
}