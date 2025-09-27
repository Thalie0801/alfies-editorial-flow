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
      priceId: isAnnual ? "price_essential_annual" : "price_1SBwSvJsCoQneASNaDNsm22b", // 79€ mensuel
      trialNote: "Publication verrouillée pendant l'essai",
      trialDays: 7,
      supportsFynk: true,
      fynkVariants: [
        {
          name: "Essential + Fynk Basic",
          price: isAnnual ? "96 €" : "108 €", // 79 + 29
          priceId: isAnnual ? "price_essential_fynk_basic_annual" : "price_1SBwTkJsCoQneASNpAwXW8K4",
          description: "Essential + Fynk Basic inclus",
          addedFeatures: ["🎁 Fynk Basic inclus (~400 interactions)"]
        },
        {
          name: "Essential + Fynk Pro", 
          price: isAnnual ? "126 €" : "148 €", // 79 + 69
          priceId: isAnnual ? "price_essential_fynk_pro_annual" : "price_1SBwTsJsCoQneASNT4Dx43re",
          description: "Essential + Fynk Pro inclus",
          addedFeatures: ["🎁 Fynk Pro inclus (~1 500 interactions)"]
        }
      ]
    },
    {
      name: "Starter", 
      price: isAnnual ? "143.20 €" : "179 €",
      originalPrice: isAnnual ? "179 €" : undefined,
      billing: isAnnual ? "Facturé annuellement (-20% la 1ère année)" : "Facturé mensuellement",
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
      discount: isAnnual ? "-20% la 1ère année" : "Code promo STARTER25 → -25% le 1er mois",
      priceId: isAnnual ? "price_starter_annual_discount" : "price_1SBwT5JsCoQneASNq8NSEfT3", // 179€ mensuel
      promotionCode: isAnnual ? undefined : "STARTER25",
      supportsFynk: true,
      fynkVariants: [
        {
          name: "Starter + Fynk Basic",
          price: isAnnual ? "176 €" : "208 €", // 179 + 29
          priceId: isAnnual ? "price_starter_fynk_basic_annual" : "price_1SBwU1JsCoQneASN1WLAzdHw",
          description: "Starter + Fynk Basic inclus",
          addedFeatures: ["🎁 Fynk Basic inclus (~400 interactions)"]
        },
        {
          name: "Starter + Fynk Pro", 
          price: isAnnual ? "206 €" : "248 €", // 179 + 69
          priceId: isAnnual ? "price_starter_fynk_pro_annual" : "price_1SBwUJJsCoQneASNKEa0RNzw",
          description: "Starter + Fynk Pro inclus",
          addedFeatures: ["🎁 Fynk Pro inclus (~1 500 interactions)"]
        }
      ]
    },
    {
      name: "Pro",
      price: isAnnual ? "319.20 €" : "399 €", 
      originalPrice: isAnnual ? "399 €" : undefined,
      billing: isAnnual ? "Facturé annuellement (-20% la 1ère année)" : "Facturé mensuellement",
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
      discount: isAnnual ? "-20% la 1ère année" : "Code promo PRO25 → -25% le 1er mois",
      priceId: isAnnual ? "price_pro_annual_discount" : "price_1SBwTDJsCoQneASNxDaRP2PC", // 399€ mensuel
      promotionCode: isAnnual ? undefined : "PRO25",
      supportsFynk: true,
      fynkVariants: [
        {
          name: "Pro + Fynk Basic",
          price: isAnnual ? "361 €" : "428 €", // 399 + 29
          priceId: isAnnual ? "price_pro_fynk_basic_annual" : "price_1SBwUSJsCoQneASNhzwWZKKB",
          description: "Pro + Fynk Basic inclus",
          addedFeatures: ["🎁 Fynk Basic inclus (~400 interactions)"]
        },
        {
          name: "Pro + Fynk Pro", 
          price: isAnnual ? "391 €" : "468 €", // 399 + 69
          priceId: isAnnual ? "price_pro_fynk_pro_annual" : "price_1SBwUcJsCoQneASNYCVum0gF",
          description: "Pro + Fynk Pro inclus",
          addedFeatures: ["🎁 Fynk Pro inclus (~1 500 interactions)"]
        }
      ]
    },
    {
      name: "Ambassadeur",
      price: "149 €",
      originalPrice: undefined,
      billing: "Facturé mensuellement",
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
      priceId: "price_1SByRBJsCoQneASN8ouw2Zrt", // 149€ ambassadeur
      discount: "Code AMBASSADEUR50 disponible → -99,10€",
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