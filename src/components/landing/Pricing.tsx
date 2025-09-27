import { useState } from "react";
import { PricingCard } from "./PricingCard";
import { PricingToggle } from "./PricingToggle";
import { FynkCard } from "./FynkCard";

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  const getPlans = (isAnnual: boolean) => [
    {
      name: "Essential",
      price: isAnnual ? "67 €" : "79 €",
      originalPrice: isAnnual ? "79 €" : undefined,
      billing: isAnnual ? "Facturé annuellement" : "Facturé mensuellement",
      description: "1 réseau social au choix",
      features: [
        "12 posts par mois",
        "1 visuel ou vidéo / semaine", 
        "Bibliothèque tonale + briefs illimités",
        "KPI Lite (impressions, abonnés)",
        "Alfie Copilot",
        "Affiliation 10% (Ambassadeurs jusqu'à 15%)",
        "Options : articles & Fynk activables",
        "✨ Essai gratuit 7 jours"
      ],
      ctaText: "Commencer l'essai 7 jours",
      badge: "Essai — sans publication",
      priceId: "price_1SBeX0JsCoQneASNtGQ0LpIf", // 79€
      trialNote: "Publication verrouillée pendant l'essai",
      supportsFynk: false,
      annualSavings: isAnnual ? "≈ 2 mois offerts" : undefined
    },
    {
      name: "Starter", 
      price: isAnnual ? "151 €" : "179 €",
      originalPrice: isAnnual ? "179 €" : undefined,
      billing: isAnnual ? "Facturé annuellement" : "Facturé mensuellement",
      description: "Plan éditorial complet",
      features: [
        "Jusqu'à 4 réseaux sociaux",
        "1 vidéo HÉRO + 10 courts/mois",
        "2 articles SEO (1 200–1 500 mots)", 
        "Carrousels + stories + visuels dédiés",
        "KPI complet + Alfie Copilot",
        "✗ Pas d'essai"
      ],
      ctaText: "Choisir Starter",
      isPopular: true,
      discount: "−25% le 1er mois → 134,25 €",
      priceId: "price_1SBeWOJsCoQneASNQS5Nx5D5", // 179€
      promotionCode: "LAUNCH25",
      supportsFynk: true,
      annualSavings: isAnnual ? "≈ 2 mois offerts" : undefined
    },
    {
      name: "Pro",
      price: isAnnual ? "336 €" : "399 €", 
      originalPrice: isAnnual ? "399 €" : undefined,
      billing: isAnnual ? "Facturé annuellement" : "Facturé mensuellement",
      description: "Présence étendue",
      features: [
        "Jusqu'à 7 réseaux sociaux",
        "3–4 vidéos HÉRO + courts illimités",
        "4 articles SEO (1 500–2 000 mots)",
        "Bilans hebdo + recalibrage automatique",
        "Alfie Copilot",
        "Accès prioritaire aux nouveautés",
        "✗ Pas d'essai"
      ],
      ctaText: "Choisir Pro",
      isPremium: true,
      discount: "−25% le 1er mois → 299,25 €",
      priceId: "price_1SBeSdJsCoQneASNrW627hLX", // 399€
      promotionCode: "LAUNCH25",
      supportsFynk: true,
      annualSavings: isAnnual ? "≈ 2 mois offerts" : undefined
    }
  ];

  const plans = getPlans(isAnnual);

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Plans <span className="bg-gradient-primary bg-clip-text text-transparent">Æditus</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tous nos plans incluent l'affiliation (10-15%) et l'accès à Alfie, votre copilot éditorial
          </p>
        </div>

        <PricingToggle isAnnual={isAnnual} onChange={setIsAnnual} />

        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>

        {/* Add-ons Section */}
        <div className="mt-16 pt-16 border-t border-border">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-4">Add-ons & Bundles</h3>
            <p className="text-muted-foreground">Boostez votre performance avec nos extensions</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FynkCard />
            
             <div className="bg-gradient-card rounded-xl border p-6 text-center">
               <div className="text-2xl font-bold mb-2">Boost</div>
               <p className="text-muted-foreground mb-4">Plus de contenus vidéos</p>
               <div className="text-lg font-semibold text-primary mb-4">
                 79€/mois - +10 vidéos
               </div>
               <ul className="text-sm space-y-2 mb-6">
                 <li>• Vidéos HÉRO supplémentaires</li>
                 <li>• Courts-métrages illimités</li>
                 <li>• Formats personnalisés</li>
               </ul>
               <p className="text-xs text-muted-foreground">
                 Ajoutez Boost lors de la souscription
               </p>
             </div>
          </div>
        </div>

        {/* Terms Section */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            <strong>Arrêt d'abonnement :</strong> à la prochaine date anniversaire. Pas de remboursement.
          </p>
        </div>
      </div>
    </section>
  );
}