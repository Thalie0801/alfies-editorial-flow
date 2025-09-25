import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

export function AboutSection() {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-card">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div>
            <Badge variant="secondary" className="mb-6">
              L'écosystème complet
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Æditus, bien plus qu'un <span className="bg-gradient-primary bg-clip-text text-transparent">simple outil</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Æditus est un écosystème éditorial automatisé qui génère, orchestre et publie vos contenus multi-formats. 
              De l'idée à la publication, en passant par la validation humaine, nous prenons en charge l'intégralité 
              de votre stratégie éditoriale.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground">Génération automatique intelligente</h4>
                  <p className="text-muted-foreground">Articles, carrousels, vidéos et posts adaptés à votre marque</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground">Validation humaine systématique</h4>
                  <p className="text-muted-foreground">Chaque contenu est vérifié avant publication</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground">Publication multi-plateformes</h4>
                  <p className="text-muted-foreground">Orchestration automatique sur tous vos réseaux</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative">
            <div className="bg-card rounded-2xl border shadow-lg p-6">
              <div className="aspect-[4/3] bg-gradient-to-br from-secondary to-muted rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">📊</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Aperçu du dashboard Æditus
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Interface intuitive de gestion<br />de vos contenus et KPIs
                  </p>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium shadow-accent/20 shadow-lg">
              +60% visibilité
            </div>
            <div className="absolute -bottom-4 -left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium shadow-primary/20 shadow-lg">
              +20h/mois
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}