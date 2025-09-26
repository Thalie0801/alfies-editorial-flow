import { Button } from "@/components/ui/button";
import { Calculator, TrendingUp } from "lucide-react";

export function SimulatorButton() {
  return (
    <div className="text-center py-16">
      <div className="bg-gradient-card rounded-2xl border border-border/50 p-8 max-w-2xl mx-auto shadow-lg">
        <div className="flex items-center justify-center mb-6">
          <div className="p-3 bg-gradient-primary rounded-xl">
            <Calculator className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold mb-4">
          Calculez votre <span className="bg-gradient-accent bg-clip-text text-transparent">ROI potentiel</span>
        </h3>
        
        <p className="text-muted-foreground mb-6">
          Estimez l'impact combiné d'Æditus + Fynk sur votre visibilité, vos leads et vos revenus d'affiliation
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button variant="hero" size="lg" className="min-w-[200px]" asChild>
            <a href="/simulator">
              <TrendingUp className="w-5 h-5 mr-2" />
              Simulateur de gains
            </a>
          </Button>
          <div className="text-sm text-muted-foreground">
            Gratuit • Sans inscription
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-border/50">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-primary">+30-60%</div>
              <div className="text-xs text-muted-foreground">Visibilité</div>
            </div>
            <div>
              <div className="text-lg font-bold text-accent">10-15%</div>
              <div className="text-xs text-muted-foreground">Affiliation</div>
            </div>
            <div>
              <div className="text-lg font-bold text-primary">ROI</div>
              <div className="text-xs text-muted-foreground">Calculé</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}