import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useStripeCheckout } from '@/hooks/useStripeCheckout';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createCheckoutSession } = useStripeCheckout();

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard');
      }
    };
    checkUser();
  }, [navigate]);

  // Handle payment status from URL
  useEffect(() => {
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
  }, [searchParams, toast]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Email ou mot de passe incorrect');
        } else if (error.message.includes('Email not confirmed') || error.message.includes('email_not_confirmed')) {
          setError('Veuillez confirmer votre email avant de vous connecter');
        } else {
          setError(error.message);
        }
        return;
      }

      if (data.user) {
        toast({
          title: "Connexion réussie",
          description: "Bienvenue !",
        });

        // Check for intended plan in URL params and redirect to checkout
        const plan = searchParams.get('plan');
        const promo = searchParams.get('promo');
        const addons = searchParams.getAll('addon');
        
        if (plan) {
          // Show success message and redirect to checkout immediately
          toast({
            title: "Connexion réussie !",
            description: "Redirection vers le paiement...",
          });
          
          // Auto-redirect to checkout without delay
          const successUrl = `${window.location.origin}/dashboard?payment=success`;
          const cancelUrl = `${window.location.origin}/`;
          await createCheckoutSession(plan, promo || undefined, successUrl, cancelUrl, addons.length ? addons : undefined);
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setError('Une erreur est survenue lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        setError('Erreur lors de la connexion avec Google');
        console.error('Google sign in error:', error);
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/50 to-primary/5 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Se connecter</CardTitle>
          <CardDescription>
            Connectez-vous à votre compte Aeditus
          </CardDescription>
          {searchParams.get('plan') && (
            <Alert>
              <AlertDescription>
                Confirmez votre email avant de vous connecter pour activer votre abonnement {searchParams.get('plan')?.replace(/_/g, ' ').toUpperCase()}
              </AlertDescription>
            </Alert>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continuer avec Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ou continuer avec
              </span>
            </div>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
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

          {searchParams.get('plan') && (
            <div className="space-y-2">
              <Button
                className="w-full"
                variant="secondary"
                onClick={async () => {
                  const plan = searchParams.get('plan')!;
                  const promo = searchParams.get('promo') || undefined;
                  const addons = searchParams.getAll('addon').filter((a) => a && a.trim().length > 0);
                  await createCheckoutSession(
                    plan,
                    promo,
                    `${window.location.origin}/dashboard?payment=success`,
                    `${window.location.origin}/signin?payment=cancelled&plan=${plan}`,
                    addons.length ? Array.from(new Set(addons)) : undefined
                  );
                }}
              >
                Poursuivre le paiement Stripe
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Si la redirection ne démarre pas automatiquement, cliquez ici.
              </p>
            </div>
          )}

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Pas encore de compte ?{' '}
              <Link
                to="/signup"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                S'inscrire
              </Link>
            </p>
            <p className="text-sm text-muted-foreground">
              <Link
                to="/"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Retour à l'accueil
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}