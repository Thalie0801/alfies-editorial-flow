import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function AuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Preserve original search params (plan, promo, addon...)
  const search = location.search || '';
  const hash = location.hash || '';
  const isError = (hash || '').includes('error=');

  useEffect(() => {
    const params = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);
    const type = params.get('type');
    const error = params.get('error');
    const errorCode = params.get('error_code');
    const errorDescription = params.get('error_description');

    if (type === 'signup' || type === 'email_change') {
      toast({ title: 'Email confirmé', description: 'Vous pouvez maintenant vous connecter.' });
      // Redirect to signin after email confirmation
      setTimeout(() => {
        navigate('/signin');
      }, 1500);
    }
    if (error || errorCode) {
      toast({
        title: 'Lien invalide ou expiré',
        description: decodeURIComponent(errorDescription || 'Veuillez redemander un nouveau lien.'),
        variant: 'destructive',
      });
    }
  }, [hash, toast]);

  useEffect(() => {
    if (!isError && search) {
      // Auto-redirect to signin with params after 2 seconds
      const timer = setTimeout(() => {
        navigate(`/signin${search}`);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isError, search, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">{isError ? 'Lien de confirmation invalide ou expiré' : 'Email confirmé !'}</CardTitle>
          <CardDescription className="text-center">
            {isError
              ? "Le lien est invalide ou expiré. Veuillez vous reconnecter pour recevoir un nouveau mail."
              : search 
                ? "Redirection automatique vers le paiement..."
                : "Votre email est confirmé. Vous pouvez maintenant vous connecter."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {isError ? (
            <>
              <Button className="w-full" onClick={() => navigate(`/signin${search}`)}>
                Continuer vers la connexion
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => navigate(`/signin`)}>
                Aller à la connexion (sans paramètres)
              </Button>
            </>
          ) : search ? (
            <div className="text-center space-y-2">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="text-sm text-muted-foreground">Redirection vers le paiement en cours...</p>
              <Button variant="ghost" className="w-full" onClick={() => navigate(`/signin${search}`)}>
                Continuer manuellement
              </Button>
            </div>
          ) : (
            <Button className="w-full" onClick={() => navigate('/signin')}>
              Se connecter
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
