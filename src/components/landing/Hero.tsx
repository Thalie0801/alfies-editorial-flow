import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, Users } from "lucide-react";
import { useState, useEffect } from "react";

export function Hero() {
  const words = ["intelligent", "rapide", "fiable"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-gradient-hero opacity-5 animate-gradient-shift bg-size-200" />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-glow opacity-10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-glow opacity-10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge Ambassadeurs */}
          <div className="mb-8 animate-fade-in">
            <a href="#pricing">
              <Badge 
                variant="secondary" 
                className="bg-gradient-accent text-accent-foreground px-4 py-2 text-sm font-medium shadow-accent/20 shadow-lg cursor-pointer hover:scale-105 transition-transform"
              >
                <Users className="w-4 h-4 mr-2" />
                Programme Ambassadeurs • 50 places limitées
                <ArrowRight className="w-4 h-4 ml-2" />
              </Badge>
            </a>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 animate-slide-up">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Æditus,
            </span>
            <br />
            <span className="text-foreground">
              l'écosystème éditorial
            </span>
            <br />
            <span className="text-foreground">automatique complet</span>
            <br />
            <span className="bg-gradient-accent bg-clip-text text-transparent text-center">
              <span 
                key={currentWordIndex}
                className="inline-block animate-fade-in-scale"
              >
                {words[currentWordIndex]}
              </span>.
            </span>
          </h1>

          {/* Baseline */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 font-medium animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <span className="text-accent font-semibold">Grandir sans vous trahir.</span>
          </p>

          {/* Value Props */}
          <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center bg-card/50 backdrop-blur-sm border border-border/50 rounded-full px-4 py-2">
              <Sparkles className="w-4 h-4 text-primary mr-2" />
              <span className="text-sm font-medium">Génération automatique</span>
            </div>
            <div className="flex items-center bg-card/50 backdrop-blur-sm border border-border/50 rounded-full px-4 py-2">
              <Sparkles className="w-4 h-4 text-accent mr-2" />
              <span className="text-sm font-medium">Validation humaine</span>
            </div>
            <div className="flex items-center bg-card/50 backdrop-blur-sm border border-border/50 rounded-full px-4 py-2">
              <Sparkles className="w-4 h-4 text-primary mr-2" />
              <span className="text-sm font-medium">+Alfie pour accompagner</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-scale" style={{ animationDelay: '0.6s' }}>
            <Button variant="hero" size="xl" className="min-w-[200px]" asChild>
              <a href="/#pricing">
                <Sparkles className="w-5 h-5 mr-2" />
                Essai Essential 7j
              </a>
            </Button>
            <Button variant="outline" size="xl" className="min-w-[200px]" asChild>
              <a href="https://calendar.app.google/sgbD2dYgxXXfJE9X6">
                Réserver une démo
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-8 border-t border-border/50 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <p className="text-sm text-muted-foreground mb-4">
              Déjà adopté par <span className="font-semibold text-primary animate-pulse">15 marques</span> satisfaites
            </p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="text-xs text-muted-foreground">TechFlow</div>
              <div className="text-xs text-muted-foreground">NatureSync</div>
              <div className="text-xs text-muted-foreground">UrbanDesign</div>
              <div className="text-xs text-muted-foreground">FitnessPro</div>
              <div className="text-xs text-muted-foreground">CreativeStudio</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}