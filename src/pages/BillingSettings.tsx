import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSubscription } from '@/hooks/useSubscription';
import { useStripeCheckout } from '@/hooks/useStripeCheckout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Crown, 
  Zap, 
  ArrowLeft,
  ExternalLink,
  Calendar,
  CreditCard,
  Package,
  BarChart3
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';

export function BillingSettings() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const { subscription, planLimits, usage, loading: subLoading } = useSubscription(user);
  const { createPortalSession, createCheckoutSession } = useStripeCheckout();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
      
      if (!session) {
        navigate('/auth');
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setUser(null);
        navigate('/auth');
      } else {
        setUser(session.user);
      }
    });

    checkAuth();
    return () => subscription.unsubscribe();
  }, [navigate]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getPlanDisplayName = (lookupKey: string | null) => {
    if (!lookupKey) return 'Aucun plan';
    return lookupKey.replace('aeditus_', '').replace('_m', '').toUpperCase();
  };

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
          <h1 className="text-3xl font-bold">Facturation et abonnement</h1>
          <p className="text-muted-foreground">Gérez votre abonnement et consultez vos quotas</p>
        </div>
      </div>

      {/* Subscription Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {subscription?.price_lookup_key === 'aeditus_pro_m' ? (
              <Crown className="w-5 h-5 text-accent" />
            ) : (
              <Zap className="w-5 h-5 text-primary" />
            )}
            Abonnement actuel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {subscription ? (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Plan</label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg font-semibold">
                      {getPlanDisplayName(subscription.price_lookup_key)}
                    </span>
                    <Badge 
                      variant={subscription.status === 'active' ? 'default' : 'secondary'}
                    >
                      {subscription.status === 'active' ? 'Actif' : 
                       subscription.status === 'trialing' ? 'Essai' : 
                       subscription.status}
                    </Badge>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Période actuelle</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {formatDate(subscription.period_start)} - {formatDate(subscription.period_end)}
                    </span>
                  </div>
                </div>

                {subscription.trial_end && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Fin d'essai</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(subscription.trial_end)}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button 
                    onClick={async () => {
                      const { url } = await createPortalSession(`${window.location.origin}/settings/billing`) || {};
                      if (url) {
                        window.location.href = url;
                      }
                    }}
                    className="flex items-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    Gérer mon abonnement
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-4">
                <h3 className="font-semibold">Actions rapides</h3>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => navigate('/pricing')}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Voir tous les plans
                  </Button>
                  
                  {subscription.price_lookup_key !== 'aeditus_pro_m' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => createCheckoutSession('aeditus_pro_m', 'LAUNCH25')}
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Passer au Pro
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun abonnement actif</h3>
              <p className="text-muted-foreground mb-4">
                Souscrivez à un plan pour accéder à toutes les fonctionnalités d'Æditus
              </p>
              <Button onClick={() => navigate('/pricing')}>
                Voir les plans
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Quotas */}
      {planLimits && usage && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Utilisation mensuelle
            </CardTitle>
            <CardDescription>
              Quotas pour le mois en cours (reset le 1er de chaque mois)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <UsageItem
                title="Articles SEO"
                used={usage.articles_used}
                limit={planLimits.articles}
              />
              <UsageItem
                title="Vidéos HÉRO"
                used={usage.hero_used}
                limit={planLimits.hero}
              />
              <UsageItem
                title="Snacks vidéo"
                used={usage.snacks_used}
                limit={planLimits.snacks}
              />
              <UsageItem
                title="Carrousels"
                used={usage.carousels_used}
                limit={planLimits.carousels}
              />
              <UsageItem
                title="Stories"
                used={usage.stories_used}
                limit={planLimits.stories}
              />
              <UsageItem
                title="Covers"
                used={usage.covers_used}
                limit={planLimits.covers}
              />
              <UsageItem
                title="Posts totaux"
                used={usage.posts_used}
                limit={planLimits.posts}
              />
              <UsageItem
                title="Réseaux"
                used={0} // Will be calculated based on connected networks
                limit={planLimits.networks}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add-ons */}
      <Card>
        <CardHeader>
          <CardTitle>Add-ons disponibles</CardTitle>
          <CardDescription>
            Boostez votre plan avec des extensions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Boost Vidéo</h3>
              <p className="text-sm text-muted-foreground mb-3">
                +10 vidéos supplémentaires par mois
              </p>
              <div className="flex items-center justify-between">
                <span className="font-semibold">79€/mois</span>
                <Button 
                  size="sm"
                  onClick={() => createCheckoutSession('aeditus_boost_m')}
                >
                  Ajouter
                </Button>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Fynk Pro</h3>
              <p className="text-sm text-muted-foreground mb-3">
                ~1500 interactions d'engagement automatisées
              </p>
              <div className="flex items-center justify-between">
                <span className="font-semibold">69€/mois</span>
                <Button 
                  size="sm"
                  onClick={() => createCheckoutSession('fynk_pro_m')}
                >
                  Ajouter
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface UsageItemProps {
  title: string;
  used: number;
  limit: number;
}

function UsageItem({ title, used, limit }: UsageItemProps) {
  const isUnlimited = limit === -1;
  const percentage = isUnlimited ? 0 : limit === 0 ? 100 : Math.min((used / limit) * 100, 100);
  const isReachedLimit = !isUnlimited && used >= limit;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{title}</span>
        {isUnlimited && (
          <Badge variant="outline" className="text-xs">
            Illimité
          </Badge>
        )}
      </div>
      
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className={isReachedLimit ? 'text-destructive' : 'text-muted-foreground'}>
            {isUnlimited ? `${used} utilisés` : `${used} / ${limit}`}
          </span>
          {!isUnlimited && (
            <span className="text-xs text-muted-foreground">
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
        
        {!isUnlimited && (
          <Progress 
            value={percentage} 
            className={`h-2 ${isReachedLimit ? '[&>div]:bg-destructive' : ''}`}
          />
        )}
      </div>
    </div>
  );
}