import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useStripeCheckout() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createCheckoutSession = async (
    priceId: string,
    promotionCode?: string,
    successUrl?: string,
    cancelUrl?: string,
    addons?: string[]
  ) => {
    setLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      console.debug('[Checkout] start', { priceId, hasToken: !!accessToken, addons, hasPromo: !!promotionCode });

      // Allow checkout without authentication; proceed to create guest session if needed


      console.debug('[Checkout] invoking edge function create-checkout');
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          price_id: priceId,
          promotion_code: promotionCode,
          success_url: successUrl,
          cancel_url: cancelUrl,
          addons: addons,
        },
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      });
      console.debug('[Checkout] function response', { hasUrl: !!data?.url, hasError: !!error });

      if (error) {
        console.error('Checkout error:', error);
        toast({
          title: "Erreur",
          description: `Impossible de créer la session de paiement${error?.message ? ` : ${error.message}` : ''}`,
          variant: "destructive",
        });
        return null;
      }

      if (data?.url) {
        window.location.assign(data.url);
        return data.url;
      }

      return null;
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la session de paiement",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createPortalSession = async (returnUrl?: string) => {
    setLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      const { data, error } = await supabase.functions.invoke('create-portal', {
        body: {
          return_url: returnUrl,
        },
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      });

      if (error) {
        console.error('Portal error:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'ouvrir le portail de facturation",
          variant: "destructive",
        });
        return null;
      }

      if (data?.url) {
        window.location.href = data.url;
        return data.url;
      }

      return null;
    } catch (error) {
      console.error('Portal error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ouverture du portail",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createCheckoutSession,
    createPortalSession,
  };
}