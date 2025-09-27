import { useState } from "react";
import { PricingCard } from "./PricingCard";
import { PricingToggle } from "./PricingToggle";


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
        "Programme ambassadeurs (10-15% commission)",
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
        "Programme ambassadeurs (10-15% commission)",
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
        "Programme ambassadeurs (10-15% commission)",
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
    },
    {
      name: "Ambassadeur",
      price: "49,90 €",
      originalPrice: "149 €",
      billing: "3 mois puis 149 €/mois",
      description: "Plan exclusif ambassadeurs - 50 places uniquement",
      features: [
        "Jusqu'à 4 réseaux sociaux",
        "1 vidéo HÉRO + 10 courts/mois",
        "2 articles SEO (1 200–1 500 mots)",
        "Carrousels + stories + visuels dédiés",
        "KPI complet + Alfie Copilot",
        "Commission ambassadeur 15%",
        "🎁 Fynk Basic inclus 3 mois",
        "Support prioritaire",
        "🏆 Statut exclusif Ambassadeur"
      ],
      ctaText: "Devenir Ambassadeur",
      badge: "Exclusif",
      priceId: "price_1SBeX0JsCoQneASNtGQ0LpIf", // 149€
      promotionCode: "AMBASSADEURS49",
      supportsFynk: false, // Déjà inclus 3 mois
      isPremium: true
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
            Tous nos plans incluent Alfie Copilot et l'affiliation (10-15%) pour devenir ambassadeur
          </p>
        </div>

        <PricingToggle isAnnual={isAnnual} onChange={setIsAnnual} />

        <div className="grid md:grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
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