import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PricingToggle } from "./PricingToggle";
import { X, Sparkles, Crown } from "lucide-react";

export function StickyBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnnual, setIsAnnual] = useState(false);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Left - Pricing Toggle */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:block">
              <span className="text-sm font-medium">Choix tarifaire :</span>
            </div>
            <PricingToggle isAnnual={isAnnual} onChange={setIsAnnual} />
          </div>

          {/* Center - Quick Prices */}
          <div className="flex items-center gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold">Essential</div>
              <div className="text-primary">{isAnnual ? "63,20 €" : "79,00 €"}/mois</div>
            </div>
            <div className="text-center relative">
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-primary text-primary-foreground text-xs">
                Populaire
              </Badge>
              <div className="font-semibold pt-3">Starter</div>
              <div className="text-primary">{isAnnual ? "143,20 €" : "179,00 €"}/mois</div>
            </div>
            <div className="text-center relative">
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-accent text-accent-foreground text-xs">
                <Crown className="w-3 h-3 mr-1" />
                Pro
              </Badge>
              <div className="font-semibold pt-3">Pro</div>
              <div className="text-primary">{isAnnual ? "319,20 €" : "399,00 €"}/mois</div>
            </div>
          </div>

          {/* Right - CTAs */}
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Essai Essential 7j
            </Button>
            <Button variant="premium" size="sm">
              Choisir Pro
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsVisible(false)}
              className="ml-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Layout Adjustments */}
        <div className="lg:hidden mt-3 pt-3 border-t border-border">
          <div className="text-center text-xs text-muted-foreground">
            {!isAnnual && "Promo 1er mois : Starter 134,25€ • Pro 299,25€"}
            {isAnnual && "Économisez 20% avec la facturation annuelle"}
          </div>
        </div>
      </div>
    </div>
  );
}