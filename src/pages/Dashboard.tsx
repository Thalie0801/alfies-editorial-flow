import { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { ClientSidebar } from '@/components/dashboard/ClientSidebar';
import { AlfieChat } from '@/components/dashboard/AlfieChat';
import { useToast } from '@/hooks/use-toast';
import { useUserRole } from '@/hooks/useUserRole';
import { useSubscription } from '@/hooks/useSubscription';
import { useStripeCheckout } from '@/hooks/useStripeCheckout';

import { 
  BarChart3, 
  FileText, 
  TrendingUp, 
  Users,
  LogOut,
  Crown,
  Zap,
  ExternalLink,
  Shield
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import dashboardMockup from '@/assets/dashboard-mockup.png';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isAlfieOpen, setIsAlfieOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { role, loading: roleLoading } = useUserRole(user);
  const [searchParams] = useSearchParams();
  

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      
      // Gérer les paramètres de checkout après connexion
      if (session?.user) {
        handlePostAuthCheckout();
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      
      if (event === 'SIGNED_IN' && session?.user) {
        setTimeout(() => {
          handlePostAuthCheckout();
        }, 1000);
      }
    });

    checkAuth();
    return () => subscription.unsubscribe();
  }, []);
  
  const handlePostAuthCheckout = async () => {
    // Ne plus relancer le checkout automatiquement
    // L'utilisateur est déjà passé par le paiement
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt !",
    });
  };


  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">Chargement...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex">
        <ClientSidebar />
        
        <SidebarInset className="flex-1">
          {/* Header */}
          <header className="border-b bg-card/50 backdrop-blur-sm">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div className="flex items-center gap-4">
                  <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    Dashboard Client
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {user?.email}
                </span>
                {role === 'admin' && (
                  <Button variant="secondary" size="sm" onClick={() => navigate('/admin')}>
                    <Shield className="w-4 h-4 mr-2" />
                    Admin
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6">
            <DashboardOverview />
          </main>
        </SidebarInset>
        
        <AlfieChat 
          isOpen={isAlfieOpen} 
          onToggle={() => setIsAlfieOpen(!isAlfieOpen)} 
        />
      </div>
    </SidebarProvider>
  );
}


// Dashboard Overview Component
function DashboardOverview() {
  return (
    <div className="space-y-6">

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="h-32">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Posts créés</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+12% ce mois</p>
            <Button variant="link" size="sm" className="h-auto p-0 mt-1">
              Voir le détail
            </Button>
          </CardContent>
        </Card>

        <Card className="h-32">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2.4k</div>
            <p className="text-xs text-muted-foreground">+18% ce mois</p>
            <Button variant="link" size="sm" className="h-auto p-0 mt-1">
              Voir le détail
            </Button>
          </CardContent>
        </Card>

        <Card className="h-32">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portée</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.8k</div>
            <p className="text-xs text-muted-foreground">+25% ce mois</p>
            <Button variant="link" size="sm" className="h-auto p-0 mt-1">
              Voir le détail
            </Button>
          </CardContent>
        </Card>

        <Card className="h-32">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score IA</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">+5% ce mois</p>
            <Button variant="link" size="sm" className="h-auto p-0 mt-1">
              Voir le détail
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-accent" />
              Plan Actuel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Æditus Pro</span>
                  <Badge className="bg-gradient-accent">Actif</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  50 posts/mois • Analytics avancées • Support prioritaire
                </p>
              </div>
              <Button variant="outline" className="w-full">
                Gérer l'abonnement
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Fynk Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Fynk Pro</span>
                  <Badge variant="secondary">Connecté</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Engagement automatisé • Anti-shadowban • Routines IA
                </p>
              </div>
              <Button variant="outline" className="w-full">
                Configurer Fynk
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-accent" />
              Affiliation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-2xl font-bold">€142.50</div>
                <p className="text-sm text-muted-foreground">Solde disponible</p>
              </div>
              <div className="text-sm">
                <div className="flex justify-between">
                  <span>Clics ce mois:</span>
                  <span>47</span>
                </div>
                <div className="flex justify-between">
                  <span>Conversions:</span>
                  <span>3</span>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Gérer l'affiliation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Placeholder components for other pages
function AlfiePage() {
  return <div className="p-4">Page Alfie en développement</div>;
}

function PlanPage() {
  return <div className="p-4">Page Plan (Kanban/Calendrier) en développement</div>;
}

function GeneratePage() {
  return <div className="p-4">Page Génération de contenu en développement</div>;
}

function AssetsPage() {
  return <div className="p-4">Page Assets en développement</div>;
}

function PublicationsPage() {
  return <div className="p-4">Page Publications en développement</div>;
}

function AffiliationPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Programme d'Affiliation</CardTitle>
          <CardDescription>Gagnez 30% de commission sur chaque vente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">€142.50</div>
                <p className="text-sm text-muted-foreground">Solde disponible</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">47</div>
                <p className="text-sm text-muted-foreground">Clics ce mois</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">3</div>
                <p className="text-sm text-muted-foreground">Conversions</p>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Votre lien d'affiliation</label>
              <div className="flex gap-2 mt-1">
                <input 
                  readOnly 
                  value="https://aeditus.fr/ref/votre-code" 
                  className="flex-1 px-3 py-2 border rounded text-sm bg-muted"
                />
                <Button size="sm">Copier</Button>
              </div>
            </div>
            
            <Button className="w-full">
              Demander un retrait (min. €50)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function GamificationPage() {
  return <div className="p-4">Page Gamification en développement</div>;
}

function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Fynk
            </CardTitle>
            <CardDescription>Automatisation de l'engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Badge variant="secondary">Connecté</Badge>
              <p className="text-sm text-muted-foreground">
                Engagement automatisé actif sur LinkedIn et Instagram
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Configurer</Button>
                <Button variant="ghost" size="sm">Tester</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Autres intégrations</CardTitle>
            <CardDescription>Bientôt disponibles</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Meta Business, Twitter API, TikTok for Business...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function BillingPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Facturation</CardTitle>
          <CardDescription>Gérez votre abonnement et vos factures</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded">
              <div>
                <h3 className="font-medium">Æditus Pro</h3>
                <p className="text-sm text-muted-foreground">€49/mois • Renouvellement le 15/02/2024</p>
              </div>
              <Badge>Actif</Badge>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline">Voir les factures</Button>
              <Button variant="outline">Modifier le plan</Button>
            </div>
            
            <div className="border-t pt-4">
              <Button variant="ghost" className="text-destructive">
                Annuler à la prochaine échéance
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                Aucun remboursement pour la période en cours
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function NewsPage() {
  return <div className="p-4">Page Actualités en développement</div>;
}

function SupportPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Centre d'aide</CardTitle>
          <CardDescription>Trouvez des réponses à vos questions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button className="w-full justify-start" variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              Documentation
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              Vidéos tutoriels
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              Contacter le support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsPage() {
  return <div className="p-4">Page Paramètres en développement</div>;
}