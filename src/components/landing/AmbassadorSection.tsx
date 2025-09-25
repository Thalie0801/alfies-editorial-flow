import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Users, Gift, Percent, Star } from "lucide-react";

export function AmbassadorSection() {
  return (
    <section id="ambassadeurs" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-accent/5 to-primary/5">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12">
            <Badge className="bg-gradient-accent text-accent-foreground px-4 py-2 mb-4">
              <Crown className="w-4 h-4 mr-2" />
              Programme Exclusif • 49,90€
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Devenez <span className="bg-gradient-accent bg-clip-text text-transparent">Ambassadeur</span> Æditus
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              10% de commission sur tous vos parrainages, puis 15% après 20 clients
            </p>
            
            {/* Counter */}
            <div className="inline-flex items-center gap-3 bg-card/50 backdrop-blur-sm border border-border/50 rounded-full px-6 py-3">
              <Users className="w-5 h-5 text-accent" />
              <span className="font-semibold">Places restantes :</span>
              <Badge variant="destructive" className="bg-red-500 text-white">
                42/50
              </Badge>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-gradient-card rounded-xl border border-border/50 p-6 text-center">
              <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center mx-auto mb-4">
                <Percent className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="font-bold mb-2">10→15%</h3>
              <p className="text-sm text-muted-foreground">Commission évolutive après 20 clients</p>
            </div>

            <div className="bg-gradient-card rounded-xl border border-border/50 p-6 text-center">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-bold mb-2">Accès prioritaire</h3>
              <p className="text-sm text-muted-foreground">Nouvelles fonctionnalités en avant-première</p>
            </div>

            <div className="bg-gradient-card rounded-xl border border-border/50 p-6 text-center">
              <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center mx-auto mb-4">
                <Gift className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="font-bold mb-2">Primes exclusives</h3>
              <p className="text-sm text-muted-foreground">Bonus sur performance et slots sponsorisés</p>
            </div>

            <div className="bg-gradient-card rounded-xl border border-border/50 p-6 text-center">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <Crown className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-bold mb-2">Statut Elite</h3>
              <p className="text-sm text-muted-foreground">15% après 20 clients parrainés</p>
            </div>
          </div>


          {/* Requirements */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 mb-8">
            <h3 className="font-bold mb-4">Critères de sélection</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div>• Entrepreneur actif avec audience engagée</div>
              <div>• Alignement avec les valeurs d'Æditus</div>
              <div>• Capacité à recommander authentiquement</div>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-4">
            <Button variant="default" size="xl" className="min-w-[250px]">
              <Crown className="w-5 h-5 mr-2" />
              Candidater Ambassadeur
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}