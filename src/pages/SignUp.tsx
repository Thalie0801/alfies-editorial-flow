import { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import HCaptcha from '@hcaptcha/react-hcaptcha';

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!captchaToken) {
      toast({
        title: "Vérification requise",
        description: "Veuillez compléter le captcha pour continuer.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);

    try {
      const planParam = searchParams.get('plan');
      const promoParam = searchParams.get('promo');
      const addonParams = searchParams.getAll('addon');
      const redirectParams = new URLSearchParams();

      if (planParam) {
        redirectParams.set('plan', planParam);
      }

      if (promoParam) {
        redirectParams.set('promo', promoParam);
      }

      addonParams.forEach((addon) => {
        if (addon) {
          redirectParams.append('addon', addon);
        }
      });

      const redirectQuery = redirectParams.toString();
      const baseUrl = window.location.origin;
      const redirectUrl = redirectQuery
        ? `${baseUrl}/auth/callback?${redirectQuery}`
        : `${baseUrl}/auth/callback`;
      
      console.debug('[SignUp] Setting emailRedirectTo:', redirectUrl);
        
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          captchaToken: captchaToken
        }
      });

      // Reset captcha after signup attempt
      captchaRef.current?.resetCaptcha();
      setCaptchaToken(null);

      if (error) {
        toast({
          title: "Erreur d'inscription",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Inscription réussie",
          description: "Vérifiez votre email et cliquez sur le lien de confirmation pour activer votre compte et procéder au paiement.",
        });
        // Rediriger vers signin avec les paramètres après inscription
        const currentParams = searchParams.toString();
        navigate(`/signin${currentParams ? `?${currentParams}` : ''}`);
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
          <CardTitle className="text-2xl text-center">Inscription</CardTitle>
          <CardDescription className="text-center">
            Créez votre compte Æditus
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
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
                placeholder="Minimum 6 caractères"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Vérification anti-robot</Label>
              <HCaptcha
                ref={captchaRef}
                sitekey="10000000-ffff-ffff-ffff-000000000001" // Test key - replace with your actual key
                onVerify={(token) => setCaptchaToken(token)}
                onExpire={() => setCaptchaToken(null)}
                onError={() => setCaptchaToken(null)}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading || !captchaToken}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Inscription...
                </>
              ) : (
                "S'inscrire"
              )}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Déjà un compte ?{' '}
              <Button
                variant="link"
                className="p-0 h-auto font-normal"
                onClick={() => navigate('/signin')}
              >
                Se connecter
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}