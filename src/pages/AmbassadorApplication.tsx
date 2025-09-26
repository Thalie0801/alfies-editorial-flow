import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Crown, Users, Clock, CheckCircle } from "lucide-react";
import { Navigation } from "@/components/landing/Navigation";
import { useToast } from "@/hooks/use-toast";

export function AmbassadorApplication() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    website: "",
    socialMedia: "",
    audience: "",
    motivation: "",
    experience: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    toast({
      title: "Candidature envoyée !",
      description: "Nous reviendrons vers vous sous 48h maximum.",
    });
    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-8">
                <Button variant="ghost" className="mb-4" asChild>
                  <a href="/">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour à l'accueil
                  </a>
                </Button>
              </div>

              <Card className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-primary-foreground" />
                </div>
                
                <h1 className="text-3xl font-bold mb-4">
                  Candidature <span className="bg-gradient-accent bg-clip-text text-transparent">reçue</span> !
                </h1>
                
                <p className="text-lg text-muted-foreground mb-6">
                  Merci pour votre candidature au programme Ambassadeur Æditus.
                </p>
                
                <div className="bg-accent/10 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-accent" />
                    <span className="font-semibold">Réponse sous 48h</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Notre équipe étudie votre profil et vous contactera rapidement.
                  </p>
                </div>

                <Button asChild>
                  <a href="/">
                    Retour à l'accueil
                  </a>
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Button variant="ghost" className="mb-4" asChild>
                <a href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour à l'accueil
                </a>
              </Button>
              
              <div className="text-center mb-8">
                <Badge className="bg-gradient-accent text-accent-foreground px-4 py-2 mb-4">
                  <Crown className="w-4 h-4 mr-2" />
                  Programme Exclusif • 49,90€ (3 mois) → 149€
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  Devenir <span className="bg-gradient-accent bg-clip-text text-transparent">Ambassadeur</span> Æditus
                </h1>
                <p className="text-lg text-muted-foreground">
                  Rejoignez notre programme d'ambassadeurs et bénéficiez de 10-15% de commission
                </p>
              </div>

              {/* Counter */}
              <div className="flex justify-center mb-8">
                <div className="inline-flex items-center gap-3 bg-card/50 backdrop-blur-sm border border-border/50 rounded-full px-6 py-3">
                  <Users className="w-5 h-5 text-accent" />
                  <span className="font-semibold">Places restantes :</span>
                  <Badge variant="destructive" className="bg-red-500 text-white">
                    42/50
                  </Badge>
                </div>
              </div>
            </div>

            {/* Form */}
            <Card className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Nom complet *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Votre nom complet"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="company">Entreprise</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Nom de votre entreprise"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Site web</Label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://votre-site.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="socialMedia">Réseaux sociaux principaux</Label>
                  <Input
                    id="socialMedia"
                    name="socialMedia"
                    value={formData.socialMedia}
                    onChange={handleChange}
                    placeholder="LinkedIn, Instagram, etc."
                  />
                </div>

                <div>
                  <Label htmlFor="audience">Taille de votre audience</Label>
                  <Input
                    id="audience"
                    name="audience"
                    value={formData.audience}
                    onChange={handleChange}
                    placeholder="ex: 5000 followers LinkedIn, 2000 Instagram..."
                  />
                </div>

                <div>
                  <Label htmlFor="motivation">Pourquoi souhaitez-vous devenir ambassadeur Æditus ? *</Label>
                  <Textarea
                    id="motivation"
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Expliquez votre motivation et comment vous envisagez de promouvoir Æditus..."
                  />
                </div>

                <div>
                  <Label htmlFor="experience">Expérience en affiliation ou partenariats</Label>
                  <Textarea
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Décrivez votre expérience en marketing d'affiliation ou partenariats..."
                  />
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Critères de sélection</h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div>• Entrepreneur actif avec audience engagée</div>
                    <div>• Alignement avec les valeurs d'Æditus</div>
                    <div>• Capacité à recommander authentiquement</div>
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full">
                  <Crown className="w-5 h-5 mr-2" />
                  Envoyer ma candidature
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  Réponse sous 48h maximum • Les critères de sélection sont étudiés individuellement
                </p>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}