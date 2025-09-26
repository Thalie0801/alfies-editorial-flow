import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useStripeCheckout } from '@/hooks/useStripeCheckout';
import { 
  Crown, 
  Zap, 
  AlertTriangle, 
  Lock,
  BarChart3,
  FileText,
  Video,
  Image,
  Users
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';

interface SubscriptionGateProps {
  user: User;
  children: React.ReactNode;
  requiredForContent?: boolean;
}

export function SubscriptionGate({ user, children, requiredForContent = false }: SubscriptionGateProps) {
  const { subscription, planLimits, usage, loading, hasActiveSubscription, isInTrial, canPublish } = useSubscription(user);
  const { createCheckoutSession, createPortalSession } = useStripeCheckout();
  const navigate = useNavigate();

  // If user has no active subscription and this is required for content access
  if (!loading && !hasActiveSubscription() && requiredForContent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-destructive" />
            </div>
            <CardTitle>Abonnement requis</CardTitle>
            <CardDescription>
              Vous devez avoir un abonnement actif pour accéder à cette section.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => navigate('/pricing')} 
              className="w-full"
            >
              Voir les plans
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')} 
              className="w-full"
            >
              Retour au tableau de bord
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show trial warning for Essential plan
  if (subscription?.price_lookup_key === 'aeditus_essential_m' && isInTrial()) {
    return (
      <div className="space-y-6">
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <CardTitle className="text-orange-800 dark:text-orange-200">
                Essai Essential — Publication verrouillée
              </CardTitle>
            </div>
            <CardDescription className="text-orange-700 dark:text-orange-300">
              Vous pouvez créer des contenus en brouillon, mais la publication est bloquée pendant l'essai. 
              Activez votre abonnement pour publier.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => createCheckoutSession('aeditus_essential_m')}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Activer l'abonnement Essential (79€/mois)
            </Button>
          </CardContent>
        </Card>
        {children}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Subscription Status */}
      {subscription && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {subscription.price_lookup_key === 'aeditus_pro_m' ? (
                  <Crown className="w-5 h-5 text-accent" />
                ) : (
                  <Zap className="w-5 h-5 text-primary" />
                )}
                <CardTitle>
                  Plan {subscription.price_lookup_key?.replace('aeditus_', '').replace('_m', '').toUpperCase()}
                </CardTitle>
                <Badge 
                  variant={subscription.status === 'active' ? 'default' : 'secondary'}
                >
                  {subscription.status === 'active' ? 'Actif' : 
                   subscription.status === 'trialing' ? 'Essai' : 
                   subscription.status}
                </Badge>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => createPortalSession()}
              >
                Gérer l'abonnement
              </Button>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Usage Quotas */}
      {planLimits && usage && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuotaCard
            icon={<FileText className="w-4 h-4" />}
            title="Articles"
            used={usage.articles_used}
            limit={planLimits.articles}
          />
          <QuotaCard
            icon={<Video className="w-4 h-4" />}
            title="Vidéos HÉRO"
            used={usage.hero_used}
            limit={planLimits.hero}
          />
          <QuotaCard
            icon={<Zap className="w-4 h-4" />}
            title="Snacks"
            used={usage.snacks_used}
            limit={planLimits.snacks}
          />
          <QuotaCard
            icon={<Image className="w-4 h-4" />}
            title="Carrousels"
            used={usage.carousels_used}
            limit={planLimits.carousels}
          />
        </div>
      )}

      {children}
    </div>
  );
}

interface QuotaCardProps {
  icon: React.ReactNode;
  title: string;
  used: number;
  limit: number;
}

function QuotaCard({ icon, title, used, limit }: QuotaCardProps) {
  const percentage = limit === -1 ? 0 : limit === 0 ? 100 : Math.min((used / limit) * 100, 100);
  const isUnlimited = limit === -1;
  const isReachedLimit = !isUnlimited && used >= limit;

  return (
    <Card className={isReachedLimit ? 'border-destructive' : ''}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <span className="text-sm font-medium">{title}</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className={isReachedLimit ? 'text-destructive' : 'text-muted-foreground'}>
              {isUnlimited ? `${used} utilisés` : `${used} / ${limit}`}
            </span>
            {isUnlimited && (
              <Badge variant="outline" className="text-xs">
                Illimité
              </Badge>
            )}
          </div>
          
          {!isUnlimited && (
            <Progress 
              value={percentage} 
              className={`h-2 ${isReachedLimit ? '[&>div]:bg-destructive' : ''}`}
            />
          )}
          
          {isReachedLimit && (
            <div className="flex items-center gap-1 text-xs text-destructive">
              <AlertTriangle className="w-3 h-3" />
              Quota atteint
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}