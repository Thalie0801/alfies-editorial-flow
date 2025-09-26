import { Separator } from "@/components/ui/separator";
import logoAeditus from "@/assets/logo-aeditus.jpg";

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src={logoAeditus} 
                alt="Logo Æditus" 
                className="h-8 w-auto object-contain"
              />
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Æditus
              </span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              L'écosystème éditorial automatique complet avec validation humaine. 
              Grandir sans vous trahir.
            </p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Fait avec ❤️ en France</span>
            </div>
          </div>

          {/* Produit */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Produit</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#pricing" className="hover:text-foreground transition-colors">Tarifs</a></li>
              <li><a href="#fynk" className="hover:text-foreground transition-colors">Fynk</a></li>
              <li><a href="#ambassadeurs" className="hover:text-foreground transition-colors">Ambassadeurs</a></li>
              <li><a href="/simulator" className="hover:text-foreground transition-colors">Simulateur</a></li>
            </ul>
          </div>

          {/* Entreprise */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Entreprise</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">À propos</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Support</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex space-x-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-foreground transition-colors">Politique de confidentialité</a>
            <a href="#" className="hover:text-foreground transition-colors">CGV</a>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2024 Æditus. Tous droits réservés.
          </div>
        </div>
      </div>
    </footer>
  );
}