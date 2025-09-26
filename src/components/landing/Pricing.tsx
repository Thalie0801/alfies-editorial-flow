import { useState } from "react";
import { PricingCard } from "./PricingCard";

export function Pricing() {

  const plans = [
    {
      name: "Essential",
      price: "99 €",
      billing: "Facturé mensuellement",
      description: "Parfait pour débuter avec les outils IA",
      features: [
        "3 posts par mois",
        "1 story par mois", 
        "1 cover par mois",
        "Templates de base",
        "Support email",
        "✨ Essai gratuit 7 jours"
      ],
      ctaText: "Commencer l'essai 7 jours",
      badge: "Essai — publication verrouillée",
      lookupKey: "aeditus_essential_m",
      trialNote: "Publication verrouillée pendant l'essai"
    },
    {
      name: "Starter", 
      price: "179 €",
      billing: "Facturé mensuellement",
      description: "Pour les créateurs qui veulent plus de contenus",
      features: [
        "10 posts par mois",
        "5 stories par mois",
        "3 covers par mois", 
        "2 carousels par mois",
        "Templates premium",
        "Support prioritaire"
      ],
      ctaText: "Choisir Starter",
      isPopular: true,
      discount: "−25% le 1er mois avec LAUNCH25 → 134,25 €",
      lookupKey: "aeditus_starter_m",
      promotionCode: "LAUNCH25"
    },
    {
      name: "Pro",
      price: "399 €", 
      billing: "Facturé mensuellement",
      description: "Pour les professionnels exigeants",
      features: [
        "Posts illimités",
        "Stories illimitées",
        "Covers illimitées",
        "Carousels illimités",
        "Snacks illimités",
        "Templates exclusifs",
        "Support VIP"
      ],
      ctaText: "Choisir Pro",
      isPremium: true,
      discount: "−25% le 1er mois avec LAUNCH25 → 299,25 €",
      lookupKey: "aeditus_pro_m",
      promotionCode: "LAUNCH25"
    },
    {
      name: "Ambassadeurs",
      price: "49,90 €",
      originalPrice: "149 €",
      billing: "pendant 3 mois, puis 149 €",
      description: "Offre spéciale pour nos ambassadeurs",
      features: [
        "2 HÉRO par mois",
        "8 snacks par mois",
        "2 articles par mois",
        "3 réseaux sociaux",
        "Templates ambassadeurs",
        "Support dédié"
      ],
      ctaText: "Obtenir l'offre ambassadeur",
      badge: "Programme ambassadeur",
      discount: "Code AMBASSADEURS49 pré-appliqué",
      lookupKey: "aeditus_amb_m",
      prefilledPromo: "AMBASSADEURS49"
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
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