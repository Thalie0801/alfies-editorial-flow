import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, TrendingUp, Users, Euro } from "lucide-react";
import { Navigation } from "@/components/landing/Navigation";

export function Simulator() {
  const [plan, setPlan] = useState<'essential' | 'starter' | 'pro'>('starter');
  const [channels, setChannels] = useState([4]);
  const [currentAudience, setCurrentAudience] = useState([10000]);
  const [conversionRate, setConversionRate] = useState([2]);
  const [avgOrder, setAvgOrder] = useState([150]);
  const [visibilityUplift, setVisibilityUplift] = useState([45]);
  const [fynkPlan, setFynkPlan] = useState<'none' | 'basic' | 'pro'>('none');
  const [affiliateStatus, setAffiliateStatus] = useState<'client' | 'ambassador'>('client');
  const [referrals, setReferrals] = useState([2]);

  // Calculs
  const planPrices = {
    essential: { monthly: 79, annual: 63.20 },
    starter: { monthly: 179, annual: 143.20 },
    pro: { monthly: 399, annual: 319.20 }
  };

  const fynkPrices = {
    none: 0,
    basic: 29,
    pro: 69
  };

  const reachAdd = Math.round(currentAudience[0] * (visibilityUplift[0] / 100));
  const visitsAdd = Math.round(reachAdd * 0.015); // 1.5% CTR moyen
  const leads = Math.round(visitsAdd * (conversionRate[0] / 100));
  const additionalRevenue = leads * avgOrder[0];
  
  const affiliateRate = affiliateStatus === 'ambassador' ? 0.15 : 0.10;
  const averagePlanPrice = 200; // Prix moyen des plans
  const affiliateRevenue = referrals[0] * averagePlanPrice * affiliateRate;
  
  const monthlyCost = planPrices[plan].monthly + fynkPrices[fynkPlan];
  const totalGains = additionalRevenue + affiliateRevenue;
  const netROI = totalGains - monthlyCost;
  const roiPercentage = monthlyCost > 0 ? ((netROI / monthlyCost) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Button variant="ghost" className="mb-4" asChild>
                <a href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour à l'accueil
                </a>
              </Button>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                Simulateur de <span className="bg-gradient-primary bg-clip-text text-transparent">plus-value</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Calculez la valeur ajoutée d'Æditus + Fynk pour votre entreprise
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Configuration */}
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Configuration de base</h3>
                  
                  <div className="space-y-6">
                    {/* Plan Æditus */}
                    <div>
                      <label className="text-sm font-medium mb-3 block">Plan Æditus</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['essential', 'starter', 'pro'] as const).map((p) => (
                          <Button
                            key={p}
                            variant={plan === p ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPlan(p)}
                            className="capitalize"
                          >
                            {p}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Canaux */}
                    <div>
                      <label className="text-sm font-medium mb-3 block">
                        Canaux actifs: {channels[0]}
                      </label>
                      <Slider
                        value={channels}
                        onValueChange={setChannels}
                        max={7}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    {/* Audience */}
                    <div>
                      <label className="text-sm font-medium mb-3 block">
                        Audience actuelle: {currentAudience[0].toLocaleString()} impressions/mois
                      </label>
                      <Slider
                        value={currentAudience}
                        onValueChange={setCurrentAudience}
                        max={100000}
                        min={1000}
                        step={1000}
                        className="w-full"
                      />
                    </div>

                    {/* Taux de conversion */}
                    <div>
                      <label className="text-sm font-medium mb-3 block">
                        Taux de conversion site: {conversionRate[0]}%
                      </label>
                      <Slider
                        value={conversionRate}
                        onValueChange={setConversionRate}
                        max={10}
                        min={0.5}
                        step={0.1}
                        className="w-full"
                      />
                    </div>

                    {/* Panier moyen */}
                    <div>
                      <label className="text-sm font-medium mb-3 block">
                        Panier moyen: {avgOrder[0]}€
                      </label>
                      <Slider
                        value={avgOrder}
                        onValueChange={setAvgOrder}
                        max={500}
                        min={50}
                        step={10}
                        className="w-full"
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Options avancées</h3>
                  
                  <div className="space-y-6">
                    {/* Uplift visibilité */}
                    <div>
                      <label className="text-sm font-medium mb-3 block">
                        Uplift visibilité: +{visibilityUplift[0]}%
                      </label>
                      <Slider
                        value={visibilityUplift}
                        onValueChange={setVisibilityUplift}
                        max={100}
                        min={20}
                        step={5}
                        className="w-full"
                      />
                    </div>

                    {/* Fynk */}
                    <div>
                      <label className="text-sm font-medium mb-3 block">Fynk</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['none', 'basic', 'pro'] as const).map((f) => (
                          <Button
                            key={f}
                            variant={fynkPlan === f ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFynkPlan(f)}
                            className="capitalize"
                          >
                            {f === 'none' ? 'Non' : f}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Statut affiliation */}
                    <div>
                      <label className="text-sm font-medium mb-3 block">Statut</label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant={affiliateStatus === 'client' ? "default" : "outline"}
                          size="sm"
                          onClick={() => setAffiliateStatus('client')}
                        >
                          Client (10%)
                        </Button>
                        <Button
                          variant={affiliateStatus === 'ambassador' ? "default" : "outline"}
                          size="sm"
                          onClick={() => setAffiliateStatus('ambassador')}
                        >
                          Ambassadeur (15%)
                        </Button>
                      </div>
                    </div>

                    {/* Parrainages */}
                    <div>
                      <label className="text-sm font-medium mb-3 block">
                        Parrainages/mois: {referrals[0]}
                      </label>
                      <Slider
                        value={referrals}
                        onValueChange={setReferrals}
                        max={10}
                        min={0}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>
                </Card>
              </div>

              {/* Résultats */}
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                    Impact estimé
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        +{reachAdd.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Reach additionnel</div>
                    </div>
                    <div className="text-center p-4 bg-accent/5 rounded-lg">
                      <div className="text-2xl font-bold text-accent">
                        +{visitsAdd.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Visites/mois</div>
                    </div>
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {leads}
                      </div>
                      <div className="text-sm text-muted-foreground">Leads/mois</div>
                    </div>
                    <div className="text-center p-4 bg-accent/5 rounded-lg">
                      <div className="text-2xl font-bold text-accent">
                        {additionalRevenue.toLocaleString()}€
                      </div>
                      <div className="text-sm text-muted-foreground">CA additionnel</div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Euro className="w-5 h-5 mr-2 text-accent" />
                    ROI Calculation
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">CA additionnel</span>
                      <span className="font-semibold">+{additionalRevenue.toLocaleString()}€</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Revenus affiliation</span>
                      <span className="font-semibold">+{affiliateRevenue.toLocaleString()}€</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Coût abonnement</span>
                      <span>-{monthlyCost}€</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">ROI net</span>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            {netROI > 0 ? '+' : ''}{netROI.toLocaleString()}€
                          </div>
                          <Badge variant={roiPercentage > 0 ? "default" : "destructive"}>
                            {roiPercentage > 0 ? '+' : ''}{roiPercentage.toFixed(0)}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-primary/5 border-primary/20">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-primary" />
                    Conseils Alfie
                  </h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>Concentrez-vous sur {channels[0] > 3 ? 'la qualité plutôt que la quantité' : 'l\'expansion vers plus de canaux'} pour maximiser l'impact.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                      <span>Votre taux de conversion de {conversionRate[0]}% {conversionRate[0] > 3 ? 'est excellent' : 'peut être amélioré'} - Alfie vous aidera à optimiser vos contenus.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>{fynkPlan === 'none' ? 'Ajoutez Fynk pour amplifier encore votre engagement' : 'Excellent choix avec Fynk ! Votre visibilité va s\'envoler'}.</span>
                    </div>
                  </div>
                </Card>

                <div className="flex gap-4">
                  <Button className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Exporter PDF
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="https://calendar.app.google/sgbD2dYgxXXfJE9X6">
                      Réserver une démo
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <Card className="mt-8 p-6 bg-muted/50">
              <h4 className="font-semibold mb-2">Méthodologie & Disclaimer</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ces estimations sont basées sur des moyennes sectorielles et l'expérience de nos clients existants. 
                Les résultats réels peuvent varier selon votre secteur, la qualité de votre offre et votre audience. 
                L'uplift de visibilité de +30-60% correspond à la moyenne observée sur nos 15 premières marques clientes. 
                Les calculs d'affiliation supposent un prix moyen de 200€/mois par filleul.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}