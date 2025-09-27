import { Button } from "@/components/ui/button";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";

export function FynkAddonCard() {
  const { createCheckoutSession, loading } = useStripeCheckout();

  const handleFynkBasic = async () => {
    try {
      await createCheckoutSession(
        "price_fynk_basic_29", // Price ID pour Fynk Basic à 29€
        undefined,
        `${window.location.origin}/dashboard`,
        `${window.location.origin}/`
      );
    } catch (error) {
      console.error('Checkout error for Fynk Basic:', error);
    }
  };

  const handleFynkPro = async () => {
    try {
      await createCheckoutSession(
        "price_fynk_pro_69", // Price ID pour Fynk Pro à 69€
        undefined,
        `${window.location.origin}/dashboard`,
        `${window.location.origin}/`
      );
    } catch (error) {
      console.error('Checkout error for Fynk Pro:', error);
    }
  };

  return (
    <div className="bg-gradient-card rounded-xl border p-6 text-center">
      <div className="text-2xl font-bold mb-2">Fynk</div>
      <p className="text-muted-foreground mb-4">Amplifiez votre engagement automatisé</p>
      <div className="space-y-3 mb-6">
        <div className="space-y-2">
          <div className="text-lg font-semibold text-primary">
            Basic: 29€/mois (~400 interactions)
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleFynkBasic}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Chargement..." : "Choisir Basic"}
          </Button>
        </div>
        <div className="space-y-2">
          <div className="text-lg font-semibold text-accent">
            Pro: 69€/mois (~1 500 interactions)
          </div>
          <Button 
            variant="accent" 
            size="sm" 
            onClick={handleFynkPro}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Chargement..." : "Choisir Pro"}
          </Button>
        </div>
      </div>
      <ul className="text-sm space-y-2 mb-6">
        <li>• Routines d'engagement automatisées</li>
        <li>• Modèles de commentaires adaptatifs</li>
        <li>• Analytics d'engagement avancés</li>
        <li>• Alfie Copilot inclus</li>
        <li>• Accès au tableau de bord</li>
        <li>• Programme ambassadeurs (15% commission)</li>
      </ul>
      <p className="text-xs text-muted-foreground">
        Fynk seul permet d'accéder au dashboard complet
      </p>
    </div>
  );
}