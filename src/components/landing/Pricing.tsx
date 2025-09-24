import { useState } from "react";
import { PricingToggle } from "./PricingToggle";
import { PricingCard } from "./PricingCard";

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Essential",
      price: isAnnual ? "63,20 €" : "79,00 €",
      originalPrice: isAnnual ? "79,00 €" : undefined,
      description: "Parfait pour débuter votre présence digitale",
      features: [
        "1 réseau social au choix (12 posts/mois)",
        "1 visuel ou vidéo / semaine",
        "Bibliothèque tonale + briefs illimités",
        "KPI Lite (impressions, abonnés)",
        "Affiliation 10%",
        "Options : articles & Fynk activables",
        "Essai 7 jours (sans publication)"
      ],
      ctaText: "Essayer 7 jours",
      badge: "Essai gratuit"
    },
    {
      name: "Starter",
      price: isAnnual ? "143,20 €" : "179,00 €",
      originalPrice: isAnnual ? "179,00 €" : undefined,
      description: "La solution complète pour une présence pro",
      features: [
        "Plan éditorial complet (jusqu'à 4 réseaux)",
        "1 vidéo HÉRO + 10 courts/mois",
        "2 articles SEO (1 200–1 500 mots)",
        "Carrousels + stories + visuels dédiés",
        "KPI complet + Copilot Alfie",
        "Support prioritaire",
        "Formation incluse"
      ],
      isPopular: true,
      ctaText: "Choisir Starter",
      discount: isAnnual ? "" : "−25% le 1er mois → 134,25 €"
    },
    {
      name: "Pro",
      price: isAnnual ? "319,20 €" : "399,00 €",
      originalPrice: isAnnual ? "399,00 €" : undefined,
      description: "Pour les entrepreneurs ambitieux",
      features: [
        "Présence étendue (jusqu'à 7 réseaux)",
        "3–4 vidéos HÉRO + courts illimités",
        "4 articles SEO (1 500–2 000 mots)",
        "Bilans hebdo + recalibrage automatique",
        "Accès prioritaire aux nouveautés",
        "Account manager dédié",
        "Intégrations avancées"
      ],
      isPremium: true,
      ctaText: "Choisir Pro",
      discount: isAnnual ? "" : "−25% le 1er mois → 299,25 €"
    }
  ];

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Choisissez votre <span className="bg-gradient-primary bg-clip-text text-transparent">croissance</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tous nos plans incluent l'affiliation (10-15%) et l'accès à Alfie, votre copilot éditorial
          </p>
        </div>

        <PricingToggle isAnnual={isAnnual} onChange={setIsAnnual} />

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
            <div className="bg-gradient-card rounded-xl border p-6 text-center">
              <div className="text-2xl font-bold mb-2">Fynk</div>
              <p className="text-muted-foreground mb-4">Amplifiez votre engagement</p>
              <div className="text-lg font-semibold text-accent mb-4">
                −10% en bundle avec Starter/Pro
              </div>
              <ul className="text-sm space-y-2 mb-6">
                <li>• Routines d'engagement automatisées</li>
                <li>• Modèles de commentaires adaptatifs</li>
                <li>• Analytics d'engagement avancés</li>
              </ul>
            </div>
            
            <div className="bg-gradient-card rounded-xl border p-6 text-center">
              <div className="text-2xl font-bold mb-2">Crédits Vidéos</div>
              <p className="text-muted-foreground mb-4">Plus de contenus vidéos</p>
              <div className="text-lg font-semibold text-primary mb-4">
                Packs 5 / 15 / 50 crédits
              </div>
              <ul className="text-sm space-y-2 mb-6">
                <li>• Vidéos HÉRO supplémentaires</li>
                <li>• Courts-métrages illimités</li>
                <li>• Formats personnalisés</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}