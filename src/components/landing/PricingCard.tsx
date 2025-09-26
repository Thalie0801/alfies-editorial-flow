import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Crown, Zap } from "lucide-react";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { User } from '@supabase/supabase-js';

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
  supportsFynk?: boolean;
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
  trialNote,
  supportsFynk = false
}: PricingCardProps) {
  const { createCheckoutSession, loading } = useStripeCheckout();
  const [user, setUser] = useState<User | null>(null);
  const cardVariant = isPremium ? "premium" : isPopular ? "hero" : "outline";
  const CardIcon = isPremium ? Crown : isPopular ? Zap : Sparkles;

  const [fynkEnabled, setFynkEnabled] = useState(false);
  const [fynkTier, setFynkTier] = useState<"basic" | "pro">("basic");

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
    if (!user) {
      // Redirect to auth if not logged in
      window.location.href = '/auth';
      return;
    }

    if (lookupKey) {
      const finalPromoCode = prefilledPromo || promotionCode;
      const addons = fynkEnabled && supportsFynk ? [`fynk_${fynkTier}_m`] : undefined;
      
      const { url } = await createCheckoutSession(
        lookupKey,
        finalPromoCode,
        `${window.location.origin}/dashboard`,
        `${window.location.origin}/pricing`,
        addons
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

      {/* Fynk Add-on */}
      {supportsFynk && (
        <div className="border-t pt-6 mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor={`fynk-${name}`} className="text-sm font-medium">
                Ajouter Fynk
              </Label>
              <p className="text-xs text-muted-foreground">
                Engagement automatisé
              </p>
            </div>
            <Switch
              id={`fynk-${name}`}
              checked={fynkEnabled}
              onCheckedChange={setFynkEnabled}
            />
          </div>

          {fynkEnabled && (
            <RadioGroup value={fynkTier} onValueChange={(value: "basic" | "pro") => setFynkTier(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="basic" id={`fynk-basic-${name}`} />
                <Label htmlFor={`fynk-basic-${name}`} className="text-sm">
                  Basic - 29€/mois (~400 interactions)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pro" id={`fynk-pro-${name}`} />
                <Label htmlFor={`fynk-pro-${name}`} className="text-sm">
                  Pro - 69€/mois (~1 500 interactions)
                </Label>
              </div>
            </RadioGroup>
          )}

          {name === "Essential" && fynkEnabled && (
            <p className="text-xs text-orange-600 font-medium">
              Fynk s'activera à l'issue de l'essai
            </p>
          )}
        </div>
      )}

      <Button 
        variant={cardVariant} 
        size="lg" 
        className="w-full"
        onClick={handleSubscribe}
        disabled={loading}
      >
        {loading ? "Chargement..." : 
         !user ? "Se connecter pour commencer" : 
         ctaText}
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