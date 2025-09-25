import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import logoAeditus from "@/assets/logo-aeditus.jpg";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <img 
                src={logoAeditus} 
                alt="Logo Æditus" 
                className="h-8 w-auto object-contain"
              />
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Æditus
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a
                href="#about"
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                L'écosystème complet
              </a>
              <a
                href="#pricing"
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                Essai gratuit
              </a>
              <a
                href="#ambassadeurs"
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                Programme Ambassadeur
              </a>
              <a
                href="#faq"
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                FAQ
              </a>
            </div>
          </div>

          {/* CTA & Theme Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="outline" size="sm">
              Se connecter
            </Button>
            <Button variant="default" size="sm">
              <a href="#pricing">Essai gratuit</a>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-card border border-border rounded-lg mt-2 mb-4">
              <a
                href="#about"
                className="block px-3 py-2 text-base font-medium text-foreground/80 hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                L'écosystème complet
              </a>
              <a
                href="#pricing"
                className="block px-3 py-2 text-base font-medium text-foreground/80 hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                Essai gratuit
              </a>
              <a
                href="#ambassadeurs"
                className="block px-3 py-2 text-base font-medium text-foreground/80 hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                Programme Ambassadeur
              </a>
              <a
                href="#faq"
                className="block px-3 py-2 text-base font-medium text-foreground/80 hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                FAQ
              </a>
              <div className="pt-4 border-t border-border">
                <div className="flex flex-col space-y-2">
                  <Button variant="outline" size="sm">
                    Se connecter
                  </Button>
                  <Button variant="default" size="sm">
                    <a href="#pricing">Essai gratuit</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}