import { Button } from "@/components/ui/button";
import { MessageCircle, Lightbulb, TrendingUp, Sparkles } from "lucide-react";

export function AlfieSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-primary rounded-lg">
                    <Sparkles className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <span className="text-lg font-semibold text-primary">Rencontrez Alfie</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                  Votre <span className="bg-gradient-accent bg-clip-text text-transparent">copilot éditorial</span> vous accompagne
                </h2>
                <p className="text-xl text-muted-foreground">
                  Alfie ne se contente pas de générer du contenu. Il apprend votre style, guide votre stratégie et optimise vos performances.
                </p>
              </div>

              <div className="grid gap-6">
                <div className="flex gap-4 p-4 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MessageCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Onboarding guidé</h3>
                    <p className="text-sm text-muted-foreground">
                      Alfie transforme votre Brand Kit en ToneGuide personnalisé et vous accompagne pas à pas.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Idéation intelligente</h3>
                    <p className="text-sm text-muted-foreground">
                      Propose des sujets pertinents, détecte les doublons et classe par priorité selon vos objectifs.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Coaching KPI</h3>
                    <p className="text-sm text-muted-foreground">
                      Analyse vos métriques et vous donne 3 actions concrètes chaque semaine pour améliorer vos performances.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg">
                  Découvrir Alfie
                </Button>
                <Button variant="outline" size="lg">
                  Voir une démo
                </Button>
              </div>
            </div>

            {/* Visual */}
            <div className="relative">
              <div className="relative bg-gradient-card rounded-2xl border border-border/50 p-8 shadow-lg">
                {/* Chat Interface Mockup */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="font-semibold">Alfie</div>
                      <div className="text-xs text-muted-foreground">Votre copilot éditorial</div>
                    </div>
                    <div className="ml-auto w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  </div>

                  <div className="space-y-4">
                    <div className="bg-primary/10 rounded-lg p-3 text-sm">
                      Bonjour ! J'ai analysé vos dernières publications. Voulez-vous que je vous propose 3 sujets tendance pour cette semaine ?
                    </div>
                    
                    <div className="bg-muted rounded-lg p-3 text-sm ml-8">
                      Oui, avec focus sur l'engagement !
                    </div>
                    
                    <div className="bg-primary/10 rounded-lg p-3 text-sm">
                      Parfait ! Voici 3 sujets qui devraient booster votre engagement de +40% :
                      <br />🎯 "Les 5 erreurs qui tuent votre productivité"
                      <br />💡 "Comment j'ai automatisé 80% de ma comm'"
                      <br />🚀 "Le secret des entrepreneurs qui réussissent"
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-accent rounded-full animate-float" />
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-primary rounded-full animate-float" style={{ animationDelay: '2s' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}