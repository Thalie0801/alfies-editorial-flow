import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useStripeCheckout() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createCheckoutSession = async (
    lookupKey: string,
    promotionCode?: string,
    successUrl?: string,
    cancelUrl?: string,
    addons?: string[]
  ) => {
    setLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      // If not authenticated, redirect to auth with intended plan
      if (!accessToken) {
        toast({
          title: "Connexion requise",
          description: "Veuillez vous connecter pour continuer le paiement.",
        });
        const authUrl = `${window.location.origin}/signup?plan=${encodeURIComponent(lookupKey)}`;
        window.location.href = authUrl;
        return null;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          lookup_key: lookupKey,
          promotion_code: promotionCode,
          success_url: successUrl,
          cancel_url: cancelUrl,
          addons: addons,
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

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
        window.location.href = data.url;
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