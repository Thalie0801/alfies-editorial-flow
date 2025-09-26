import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSubscription } from '@/hooks/useSubscription';
import { useStripeCheckout } from '@/hooks/useStripeCheckout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Zap,
  TrendingUp,
  BarChart3,
  Settings
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';

export function EngagementSettings() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const { subscription, planLimits, usage, loading: subLoading } = useSubscription(user);
  const { createCheckoutSession, createPortalSession } = useStripeCheckout();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
      
      if (!session) {
        navigate('/signin');
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setUser(null);
        navigate('/signin');
      } else {
        setUser(session.user);
      }
    });

    checkAuth();
    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading || subLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const hasActiveFynk = subscription?.addons && 
    Array.isArray(subscription.addons) && 
    subscription.addons.some((addon: string) => addon.includes('fynk_'));
    
  const activeFynkTier = hasActiveFynk ? 
    subscription?.addons?.find((addon: string) => addon.includes('fynk_'))?.replace('fynk_', '').replace('_m', '') : null;

  const fynkQuota = activeFynkTier === 'basic' ? 400 : activeFynkTier === 'pro' ? 1500 : 0;
  const fynkUsed = usage?.fynk_interactions_used || 0;

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Paramètres d'engagement</h1>
          <p className="text-muted-foreground">Gérez vos outils d'engagement automatisé</p>
        </div>
      </div>

      {/* Fynk Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Fynk - Engagement automatisé
          </CardTitle>
          <CardDescription>
            Automatisez vos interactions pour maximiser votre engagement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {hasActiveFynk ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Statut actuel</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="default">Actif</Badge>
                    <span className="text-sm capitalize">
                      Fynk {activeFynkTier} - {fynkQuota.toLocaleString()} interactions/mois
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    const { url } = await createPortalSession(`${window.location.origin}/settings/engagement`) || {};
                    if (url) {
                      window.location.href = url;
                    }
                  }}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Gérer via Stripe
                </Button>
              </div>

              {/* Usage Stats */}
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Utilisation ce mois</span>
                  <span className="text-sm text-muted-foreground">
                    {fynkUsed.toLocaleString()} / {fynkQuota.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-background rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((fynkUsed / fynkQuota) * 100, 100)}%` }}
                  />
                </div>
                {fynkUsed >= fynkQuota && (
                  <p className="text-sm text-destructive mt-2">
                    Quota atteint - les interactions sont suspendues
                  </p>
                )}
              </div>

              {/* Upgrade/Downgrade */}
              <div className="space-y-3">
                <h4 className="font-medium">Actions disponibles</h4>
                <div className="flex gap-3">
                  {activeFynkTier === 'basic' && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => createCheckoutSession('fynk_pro_m')}
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Passer à Fynk Pro
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      const { url } = await createPortalSession(`${window.location.origin}/settings/engagement`) || {};
                      if (url) {
                        window.location.href = url;
                      }
                    }}
                  >
                    Modifier ou annuler
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Fynk non activé</h3>
              <p className="text-muted-foreground mb-4">
                Activez Fynk pour automatiser vos interactions et booster votre engagement
              </p>
              <div className="space-y-3">
                <div className="grid sm:grid-cols-2 gap-3 max-w-md mx-auto">
                  <Button
                    variant="outline"
                    onClick={() => createCheckoutSession('fynk_basic_m')}
                  >
                    Fynk Basic - 29€
                    <span className="block text-xs text-muted-foreground">~400 interactions</span>
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => createCheckoutSession('fynk_pro_m')}
                  >
                    Fynk Pro - 69€
                    <span className="block text-xs text-muted-foreground">~1 500 interactions</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analytics */}
      {hasActiveFynk && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Analytics d'engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <BarChart3 className="w-12 h-12 mx-auto mb-4" />
              <p>Analytics d'engagement à venir...</p>
              <p className="text-sm">Consultez vos métriques détaillées bientôt</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}