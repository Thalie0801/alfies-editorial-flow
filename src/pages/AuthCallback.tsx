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

  useEffect(() => {
    // Detect Supabase confirmation types in the hash
    if (hash.includes('type=signup') || hash.includes('type=email_change')) {
      toast({
        title: 'Email confirmé',
        description: 'Votre email a été confirmé avec succès. Vous pouvez maintenant vous connecter.',
      });
    }
  }, [hash, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Confirmation</CardTitle>
          <CardDescription className="text-center">
            Votre email est confirmé. Continuez vers la connexion pour finaliser votre abonnement.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button className="w-full" onClick={() => navigate(`/signin${search}`)}>
            Continuer vers la connexion
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => navigate(`/signin`)}>
            Aller à la connexion (sans paramètres)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
