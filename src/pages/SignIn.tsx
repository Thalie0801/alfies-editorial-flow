import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useStripeCheckout } from '@/hooks/useStripeCheckout';
import { Loader2 } from 'lucide-react';

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { createCheckoutSession } = useStripeCheckout();

  useEffect(() => {
    // Gérer les retours de paiement Stripe
    const paymentStatus = searchParams.get('payment');
    if (paymentStatus === 'success') {
      toast({
        title: "Paiement réussi",
        description: "Votre abonnement a été activé avec succès !",
      });
    } else if (paymentStatus === 'cancelled') {
      toast({
        title: "Paiement annulé",
        description: "Votre paiement a été annulé. Vous pouvez réessayer quand vous le souhaitez.",
        variant: "destructive",
      });
    }

    // Gérer la confirmation d'email
    const hash = window.location.hash;
    if (hash.includes('type=signup') || hash.includes('type=email_change')) {
      toast({
        title: "Email confirmé",
        description: "Votre email a été confirmé avec succès ! Connectez-vous maintenant.",
      });
    }
  }, [searchParams, toast]);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setTimeout(() => {
          handlePostAuthFlow();
        }, 400);
      }
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        handlePostAuthFlow();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, searchParams]);

  const handlePostAuthFlow = async () => {
    console.debug('[SignIn] handlePostAuthFlow start');
    // S'assurer que la session (token) est bien disponible avant d'appeler Stripe
    const ensureSession = async () => {
      for (let i = 0; i < 10; i++) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) return session;
        await new Promise((r) => setTimeout(r, 200));
      }
      return null;
    };

    const session = await ensureSession();
    console.debug('[SignIn] ensureSession result', { hasSession: !!session });

    const planParam = searchParams.get('plan');
    const promoParam = searchParams.get('promo') || undefined;
    const addonParams = searchParams.getAll('addon').filter((addon) => addon && addon.trim().length > 0);
    const uniqueAddons = addonParams.length ? Array.from(new Set(addonParams)) : undefined;
    console.debug('[SignIn] URL params', { planParam, promoParam, addons: uniqueAddons });

    if (planParam) {
      // Si plan dans l'URL, créer checkout session
      try {
        console.debug('[SignIn] Calling createCheckoutSession');
        const url = await createCheckoutSession(
          planParam,
          promoParam,
          `${window.location.origin}/dashboard`,
          `${window.location.origin}/`,
          uniqueAddons
        );
        console.debug('[SignIn] createCheckoutSession returned', { hasUrl: !!url });
        if (!url) {
          toast({
            title: "Paiement non démarré",
            description: "Impossible d’ouvrir Stripe. Réessayez ou contactez le support.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('[SignIn] Error creating checkout session:', error);
        toast({
          title: "Erreur de paiement",
          description: "La création de la session de paiement a échoué.",
          variant: "destructive",
        });
      }
    } else {
      // Sinon rediriger vers dashboard
      console.debug('[SignIn] No planParam, navigate to /dashboard');
      navigate('/dashboard');
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Gestion spéciale pour l'email non confirmé
        if (error.message.includes('Email not confirmed') || error.message.includes('email_not_confirmed')) {
          toast({
            title: "Email non confirmé",
            description: "Veuillez d'abord cliquer sur le lien de confirmation dans votre email avant de vous connecter.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erreur de connexion",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        // Auth state change will handle the navigation and subscription processing
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Connexion</CardTitle>
          <CardDescription className="text-center">
            Accédez à votre espace client Æditus
          </CardDescription>
          {searchParams.get('plan') && (
            <div className="mx-6 -mt-2 mb-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-sm border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">ℹ️</span>
                <span className="font-medium text-blue-800 dark:text-blue-200">
                  Confirmez votre email avant de vous connecter pour activer votre abonnement {searchParams.get('plan')?.replace(/_/g, ' ').toUpperCase()}
                </span>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Pas encore de compte ?{' '}
              <Button
                variant="link"
                className="p-0 h-auto font-normal"
                onClick={() => navigate('/signup')}
              >
                S'inscrire
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}