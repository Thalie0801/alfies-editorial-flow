import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Users, Mail, User, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const ambassadorContactSchema = z.object({
  name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères").max(100, "Le nom ne peut dépasser 100 caractères"),
  email: z.string().trim().email("Adresse email invalide").max(255, "L'email ne peut dépasser 255 caractères"),
  company: z.string().trim().max(100, "Le nom de l'entreprise ne peut dépasser 100 caractères").optional(),
  socialMedia: z.string().trim().max(200, "Les réseaux sociaux ne peuvent dépasser 200 caractères").optional(),
  message: z.string().trim().min(10, "Le message doit contenir au moins 10 caractères").max(1000, "Le message ne peut dépasser 1000 caractères"),
});

type AmbassadorContactForm = z.infer<typeof ambassadorContactSchema>;

export function AmbassadorContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<AmbassadorContactForm>({
    name: "",
    email: "",
    company: "",
    socialMedia: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof AmbassadorContactForm, string>>>({});
  const { toast } = useToast();

  const handleInputChange = (field: keyof AmbassadorContactForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    try {
      ambassadorContactSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof AmbassadorContactForm, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof AmbassadorContactForm] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez corriger les erreurs dans le formulaire",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implémenter l'envoi d'email via edge function
      // Simuler l'envoi pour l'instant
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Demande envoyée !",
        description: "Nous vous contacterons dans les plus brefs délais pour discuter du programme Ambassadeur.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        company: "",
        socialMedia: "",
        message: "",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de votre demande. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-section py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Crown className="w-12 h-12 text-accent" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Rejoindre le Programme <span className="bg-gradient-accent bg-clip-text text-transparent">Ambassadeur</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Seulement 50 places disponibles pour notre programme exclusif
          </p>
        </div>

        <Card className="bg-gradient-card border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              Votre candidature Ambassadeur
            </CardTitle>
            <CardDescription>
              Parlez-nous de vous et de votre motivation à rejoindre notre programme d'ambassadeurs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nom complet *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Votre nom complet"
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="votre@email.com"
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Entreprise / Marque</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  placeholder="Nom de votre entreprise ou marque (optionnel)"
                  className={errors.company ? "border-destructive" : ""}
                />
                {errors.company && <p className="text-sm text-destructive">{errors.company}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="socialMedia">Réseaux sociaux</Label>
                <Input
                  id="socialMedia"
                  value={formData.socialMedia}
                  onChange={(e) => handleInputChange("socialMedia", e.target.value)}
                  placeholder="@votre_handle, liens vers vos profils (optionnel)"
                  className={errors.socialMedia ? "border-destructive" : ""}
                />
                {errors.socialMedia && <p className="text-sm text-destructive">{errors.socialMedia}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Votre motivation *
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="Parlez-nous de votre expérience, votre audience, et pourquoi vous souhaitez devenir ambassadeur Æditus..."
                  rows={6}
                  className={errors.message ? "border-destructive" : ""}
                />
                {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
              </div>

              <div className="bg-accent/10 p-4 rounded-lg">
                <h3 className="font-medium text-accent mb-2">Avantages du Programme Ambassadeur :</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Commission 10% puis 15% après 20 clients actifs</li>
                  <li>• 3 mois de Fynk Basic offerts</li>
                  <li>• Support prioritaire et accès aux nouveautés</li>
                  <li>• Statut exclusif et reconnaissance communautaire</li>
                </ul>
              </div>

              <Button
                type="submit"
                variant="accent"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Envoi en cours..."
                ) : (
                  <>
                    <Crown className="w-4 h-4 mr-2" />
                    Envoyer ma candidature
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}