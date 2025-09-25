import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Target, TrendingUp, Shield } from "lucide-react";

export function FynkSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Visual */}
            <div className="relative order-2 lg:order-1">
              <div className="relative bg-gradient-card rounded-2xl border border-border/50 p-8 shadow-lg">
                {/* Fynk Dashboard Mockup */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center">
                        <Zap className="w-4 h-4 text-accent-foreground" />
                      </div>
                      <span className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                        Fynk
                      </span>
                    </div>
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                      Active
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-primary/5 rounded-lg p-4">
                      <div className="text-2xl font-bold text-primary">+127%</div>
                      <div className="text-sm text-muted-foreground">Engagement</div>
                    </div>
                    <div className="bg-accent/5 rounded-lg p-4">
                      <div className="text-2xl font-bold text-accent">+89%</div>
                      <div className="text-sm text-muted-foreground">Reach</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm font-medium">Routines actives</div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-sm">Engagement matinal</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                      </div>
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-sm">Stories boost</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                      </div>
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-sm">Cross-promotion</span>
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-accent rounded-full animate-float" />
                <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-primary rounded-full animate-float" style={{ animationDelay: '3s' }} />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-8 order-1 lg:order-2">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                    Fynk
                  </span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                  Amplifiez votre <span className="bg-gradient-primary bg-clip-text text-transparent">engagement</span>
                </h2>
                <p className="text-xl text-muted-foreground">
                  Fynk orchestre intelligemment vos interactions pour maximiser votre visibilité tout en respectant les algorithmes.
                </p>
              </div>

              <div className="grid gap-6">
                <div className="flex gap-4 p-4 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Target className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Routines d'engagement</h3>
                    <p className="text-sm text-muted-foreground">
                      Cadences intelligentes et automatisées qui respectent les bonnes pratiques de chaque plateforme.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Modèles adaptatifs</h3>
                    <p className="text-sm text-muted-foreground">
                      Commentaires et interactions personnalisés selon votre tone de voix et vos objectifs.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Shield className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Protection anti-shadowban</h3>
                    <p className="text-sm text-muted-foreground">
                      Blacklist automatique et randomisation pour éviter les sanctions algorithmiques.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-accent/10 rounded-xl p-6 border border-accent/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className="bg-gradient-accent text-accent-foreground">Basic</Badge>
                    <span className="font-semibold">Fynk Basic</span>
                  </div>
                  <div className="text-3xl font-bold text-accent mb-2">29€</div>
                  <div className="text-sm text-muted-foreground mb-4">par mois</div>
                  <Button variant="default" size="sm" className="w-full">
                    Choisir Basic
                  </Button>
                </div>
                
                <div className="bg-gradient-accent/10 rounded-xl p-6 border border-accent/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className="bg-gradient-primary text-primary-foreground">Pro</Badge>
                    <span className="font-semibold">Fynk Pro</span>
                  </div>
                  <div className="text-3xl font-bold text-accent mb-2">69€</div>
                  <div className="text-sm text-muted-foreground mb-4">par mois</div>
                  <Button variant="default" size="sm" className="w-full">
                    Choisir Pro
                  </Button>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-bold text-accent mb-2">
                  Affiliation : 10%
                </div>
                <p className="text-xs text-muted-foreground">
                  Recommandez Fynk et touchez 10% de commission récurrente
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}