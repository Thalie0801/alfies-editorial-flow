import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Send, Users, Briefcase, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message envoyé !",
        description: "Nous vous recontacterons dans les plus brefs délais.",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Button>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Parlons de votre <span className="bg-gradient-primary bg-clip-text text-transparent">projet</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Notre équipe est là pour vous accompagner dans votre stratégie de contenu et répondre à toutes vos questions.
            </p>
          </div>

          {/* Contact Options */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center p-6">
              <CardHeader>
                <Users className="w-8 h-8 mx-auto mb-4 text-primary" />
                <CardTitle className="text-lg">Consultation gratuite</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  30 minutes d'échange pour analyser vos besoins et vous proposer la meilleure solution.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardHeader>
                <Briefcase className="w-8 h-8 mx-auto mb-4 text-primary" />
                <CardTitle className="text-lg">Partenariat</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Vous êtes une agence ou un consultant ? Explorons les possibilités de collaboration.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardHeader>
                <MessageCircle className="w-8 h-8 mx-auto mb-4 text-primary" />
                <CardTitle className="text-lg">Support technique</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Besoin d'aide avec la plateforme ? Notre équipe technique vous accompagne.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Contactez-nous</CardTitle>
              <CardDescription className="text-center">
                Remplissez le formulaire ci-dessous et nous vous recontacterons rapidement.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input 
                      id="firstName" 
                      required 
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input 
                      id="lastName" 
                      required 
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    required 
                    placeholder="votre@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Entreprise</Label>
                  <Input 
                    id="company" 
                    placeholder="Nom de votre entreprise (optionnel)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Sujet de votre demande *</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un sujet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="demo">Demande de démonstration</SelectItem>
                      <SelectItem value="pricing">Questions sur les tarifs</SelectItem>
                      <SelectItem value="partnership">Partenariat</SelectItem>
                      <SelectItem value="support">Support technique</SelectItem>
                      <SelectItem value="ambassador">Programme ambassadeur</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea 
                    id="message" 
                    required 
                    placeholder="Décrivez-nous votre projet, vos besoins ou vos questions..."
                    rows={5}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Envoi en cours..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Envoyer le message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="text-center mt-12 space-y-4">
            <p className="text-muted-foreground">
              Vous préférez nous contacter directement ?
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="mailto:contact@aeditus.fr" 
                className="text-primary hover:underline"
              >
                contact@aeditus.fr
              </a>
              <span className="hidden sm:inline text-muted-foreground">•</span>
              <span className="text-muted-foreground">
                Réponse sous 24h en moyenne
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}