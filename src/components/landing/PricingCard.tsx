import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Crown, Zap } from "lucide-react";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";

interface PricingCardProps {
  name: string;
  price: string;
  originalPrice?: string;
  billing?: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  isPremium?: boolean;
  ctaText: string;
  badge?: string;
  discount?: string;
  lookupKey?: string;
  promotionCode?: string;
  prefilledPromo?: string;
  trialNote?: string;
}

export function PricingCard({
  name,
  price,
  originalPrice,
  billing,
  description,
  features,
  isPopular,
  isPremium,
  ctaText,
  badge,
  discount,
  lookupKey,
  promotionCode,
  prefilledPromo,
  trialNote
}: PricingCardProps) {
  const { createCheckoutSession, loading } = useStripeCheckout();
  const cardVariant = isPremium ? "premium" : isPopular ? "hero" : "outline";
  const CardIcon = isPremium ? Crown : isPopular ? Zap : Sparkles;

  const handleSubscribe = async () => {
    if (lookupKey) {
      const finalPromoCode = prefilledPromo || promotionCode;
      const { url } = await createCheckoutSession(
        lookupKey,
        finalPromoCode,
        `${window.location.origin}/dashboard`,
        `${window.location.origin}/pricing`
      ) || {};
      
      if (url) {
        window.location.href = url;
      }
    }
  };

  return (
    <div className={`relative bg-gradient-card rounded-2xl border p-8 transition-all duration-300 hover:scale-105 ${
      isPopular ? 'border-primary shadow-primary' : isPremium ? 'border-accent shadow-accent' : 'border-border hover:border-primary/50'
    }`}>
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-gradient-primary text-primary-foreground px-4 py-1">
            Recommandé
          </Badge>
        </div>
      )}

      {/* Premium Badge */}
      {isPremium && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-gradient-accent text-accent-foreground px-4 py-1">
            <Crown className="w-4 h-4 mr-1" />
            Premium
          </Badge>
        </div>
      )}

      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <CardIcon className={`w-8 h-8 ${isPremium ? 'text-accent' : isPopular ? 'text-primary' : 'text-muted-foreground'}`} />
        </div>
        
        <h3 className="text-2xl font-bold mb-2">{name}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        
        <div className="flex items-center justify-center gap-2 mb-2">
          {originalPrice && (
            <span className="text-2xl text-muted-foreground line-through">
              {originalPrice}
            </span>
          )}
          <span className="text-4xl font-bold">{price}</span>
          {billing && <span className="text-muted-foreground">/ mois</span>}
        </div>
        
        {billing && !billing.includes('mois') && (
          <p className="text-sm text-muted-foreground">{billing}</p>
        )}
        
        {discount && (
          <p className="text-sm text-accent font-medium mt-2">{discount}</p>
        )}
        
        {trialNote && (
          <p className="text-xs text-orange-600 font-medium mt-2">{trialNote}</p>
        )}
        
        {badge && (
          <Badge variant="secondary" className="mt-2">
            {badge}
          </Badge>
        )}
      </div>

      <div className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <span className="text-sm">{feature}</span>
          </div>
        ))}
      </div>

      <Button 
        variant={cardVariant} 
        size="lg" 
        className="w-full"
        onClick={handleSubscribe}
        disabled={loading}
      >
        {loading ? "Chargement..." : ctaText}
      </Button>
      
      {promotionCode && !prefilledPromo && (
        <div className="text-center mt-3">
          <span className="text-xs text-muted-foreground">
            Code promo disponible : <strong>{promotionCode}</strong>
          </span>
        </div>
      )}
    </div>
  );
}