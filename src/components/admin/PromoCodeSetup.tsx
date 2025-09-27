import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { setupPromoCodes } from '@/utils/setupPromoCodes';
import { useToast } from '@/hooks/use-toast';

export function PromoCodeSetup() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const handleSetup = async () => {
    setLoading(true);
    try {
      const response = await setupPromoCodes();
      setResult(response);
      
      if (response.success) {
        toast({
          title: "Codes promo configurés",
          description: "Les codes LAUNCH25 et AMBASSADEUR50 sont maintenant actifs",
        });
      } else {
        toast({
          title: "Erreur",
          description: "Erreur lors de la configuration des codes promo",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Setup error:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la configuration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Configuration des codes promo</CardTitle>
        <CardDescription>
          Créer les codes promotionnels LAUNCH25 et AMBASSADEUR50 dans Stripe
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleSetup} 
          disabled={loading}
          className="w-full"
        >
          {loading ? "Configuration en cours..." : "Configurer les codes promo"}
        </Button>
        
        {result && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Résultat:</h4>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}