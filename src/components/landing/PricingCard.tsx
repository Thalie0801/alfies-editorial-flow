import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Crown, Zap } from "lucide-react";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { supabase } from "@/integrations/supabase/client";
import type { User } from '@supabase/supabase-js';

interface FynkVariant {
  name: string;
  price: string;
  priceId: string;
  description: string;
  addedFeatures: string[];
}

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
  priceId?: string;
  promotionCode?: string;
  prefilledPromo?: string;
  trialNote?: string;
  supportsFynk?: boolean;
  fynkVariants?: FynkVariant[];
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
  priceId,
  promotionCode,
  prefilledPromo,
  trialNote,
  supportsFynk = false,
  fynkVariants = []
}: PricingCardProps) {
  const { createCheckoutSession, loading } = useStripeCheckout();
  const [user, setUser] = useState<User | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<"base" | number>("base");
  const cardVariant = isPremium ? "premium" : isPopular ? "hero" : "outline";
  const CardIcon = isPremium ? Crown : isPopular ? Zap : Sparkles;
  const showMonthlySuffix = !billing || billing.toLowerCase().includes("mensuel");

  // Get current pricing based on selection
  const currentPricing = selectedVariant === "base" 
    ? { name, price, priceId, description, features }
    : {
        name: fynkVariants[selectedVariant]?.name || name,
        price: fynkVariants[selectedVariant]?.price || price,
        priceId: fynkVariants[selectedVariant]?.priceId || priceId,
        description: fynkVariants[selectedVariant]?.description || description,
        features: [...features, ...(fynkVariants[selectedVariant]?.addedFeatures || [])]
      };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    checkAuth();
    return () => subscription.unsubscribe();
  }, []);

  const handleSubscribe = async () => {
    const currentPrice = currentPricing.priceId;
    if (currentPrice) {
      const finalPromoCode = prefilledPromo || promotionCode;

      // Vérifier la session utilisateur
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Utilisateur non connecté: lancer directement le paiement (guest)
        const params = new URLSearchParams({ plan: currentPrice });
        if (finalPromoCode) params.set('promo', finalPromoCode);
        try {
          await createCheckoutSession(
            currentPrice,
            finalPromoCode,
            `${window.location.origin}/signup?${params.toString()}`,
            `${window.location.origin}/`
          );
        } catch (error) {
          console.error('Checkout error (guest):', error);
        }
        return;
      }

      // Utilisateur connecté, procéder directement au checkout via Supabase Functions
      try {
        await createCheckoutSession(
          currentPrice,
          finalPromoCode,
          `${window.location.origin}/dashboard`,
          `${window.location.origin}/`
        );
      } catch (error) {
        console.error('Checkout error:', error);
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
            Exclusivité
          </Badge>
        </div>
      )}

      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <CardIcon className={`w-8 h-8 ${isPremium ? 'text-accent' : isPopular ? 'text-primary' : 'text-muted-foreground'}`} />
        </div>
        
        <h3 className="text-2xl font-bold mb-2">{currentPricing.name}</h3>
        <p className="text-muted-foreground mb-4">{currentPricing.description}</p>
        
        {/* Fynk Variants Selection */}
        {fynkVariants.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-col gap-2 text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`variant-${name}`}
                  checked={selectedVariant === "base"}
                  onChange={() => setSelectedVariant("base")}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 ${selectedVariant === "base" ? 'bg-primary border-primary' : 'border-border'}`} />
                <span>Plan de base</span>
              </label>
              {fynkVariants.map((variant, index) => (
                <label key={index} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`variant-${name}`}
                    checked={selectedVariant === index}
                    onChange={() => setSelectedVariant(index)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 ${selectedVariant === index ? 'bg-primary border-primary' : 'border-border'}`} />
                  <span>{variant.name.replace(/Essential \+ /, "")}</span>
                </label>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-center gap-2 mb-2">
          {originalPrice && (
            <span className="text-2xl text-muted-foreground line-through">
              {originalPrice}
            </span>
          )}
          <span className="text-4xl font-bold">{currentPricing.price}</span>
          {showMonthlySuffix && <span className="text-muted-foreground">/ mois</span>}
        </div>

        {billing && (
          <p className="text-sm text-muted-foreground mt-1">{billing}</p>
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
        {currentPricing.features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <span className="text-sm">{feature}</span>
          </div>
        ))}
      </div>

      <Button
        variant={isPremium ? "accent" : cardVariant} 
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