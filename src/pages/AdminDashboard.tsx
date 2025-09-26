import { useState, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/dashboard/AdminSidebar';
import { useToast } from '@/hooks/use-toast';
import { 
  Users,
  BarChart3,
  DollarSign,
  TrendingUp,
  Settings,
  LogOut,
  Shield,
  Crown,
  FileText,
  AlertTriangle,
  Activity,
  Clock
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      // TODO: Check if user is admin
      setUser(session.user);
      setLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/auth');
      } else {
        setUser(session.user);
      }
    });

    checkAuth();
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt !",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex">
        <AdminSidebar />
        
        <SidebarInset className="flex-1">
          {/* Header */}
          <header className="border-b bg-card/50 backdrop-blur-sm">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div className="flex items-center gap-4">
                  <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    Administration
                  </h1>
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Admin
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {user?.email}
                </span>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<AdminOverview />} />
              <Route path="/accounts" element={<AccountsPage />} />
              <Route path="/plans" element={<PlansPage />} />
              <Route path="/affiliation" element={<AdminAffiliationPage />} />
              <Route path="/gamification" element={<AdminGamificationPage />} />
              <Route path="/news" element={<AdminNewsPage />} />
              <Route path="/alfie" element={<AlfieBrainPage />} />
              <Route path="/integrations" element={<AdminIntegrationsPage />} />
              <Route path="/security" element={<SecurityPage />} />
              <Route path="/monitoring" element={<MonitoringPage />} />
              <Route path="/settings" element={<AdminSettingsPage />} />
            </Routes>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

// Admin Overview Component
function AdminOverview() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+12% ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus MRR</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€45,231</div>
            <p className="text-xs text-muted-foreground">+20% ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incidents 24h</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">2 résolus</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latence TTS p95</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2s</div>
            <p className="text-xs text-muted-foreground">Dans la norme</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Ambassadeurs</CardTitle>
            <CardDescription>Programme d'affiliation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">42/50</div>
              <p className="text-sm text-muted-foreground">Places occupées</p>
              <div className="text-sm">
                <div className="flex justify-between">
                  <span>En attente:</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span>Commissions:</span>
                  <span className="font-medium">€2,891</span>
                </div>
              </div>
              <Button size="sm" className="w-full">Traiter les demandes</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Files de traitement</CardTitle>
            <CardDescription>Jobs en cours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>En attente:</span>
                <span>47</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>En cours:</span>
                <span>12</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Erreurs:</span>
                <span className="text-destructive">3</span>
              </div>
              <Button size="sm" variant="outline" className="w-full">
                Voir les détails
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Coûts IA/TTS</CardTitle>
            <CardDescription>Ce mois</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">€1,247</div>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>OpenAI:</span>
                  <span>€892</span>
                </div>
                <div className="flex justify-between">
                  <span>ElevenLabs:</span>
                  <span>€355</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Seuil: €2,000/mois
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Placeholder components for admin pages
function AccountsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Comptes</CardTitle>
          <CardDescription>Administrez les utilisateurs et leurs abonnements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Button>Filtrer par statut</Button>
              <Button variant="outline">Exporter CSV</Button>
              <Button variant="outline">Actions groupées</Button>
            </div>
            <p className="text-muted-foreground">
              Table des utilisateurs avec filtres, actions et KYC en développement
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PlansPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Plans & Tarifs</CardTitle>
          <CardDescription>Configurez les plans d'abonnement et promotions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 border rounded">
                <h3 className="font-medium">Æditus Pro</h3>
                <p className="text-2xl font-bold">€49/mois</p>
                <Badge className="text-xs">-25% 1er mois</Badge>
              </div>
              <div className="p-4 border rounded">
                <h3 className="font-medium">Bundle Æditus + Fynk</h3>
                <p className="text-2xl font-bold">€89/mois</p>
                <Badge variant="secondary" className="text-xs">Populaire</Badge>
              </div>
            </div>
            <Button>Modifier les plans</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminAffiliationPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Programme Ambassadeur</CardTitle>
          <CardDescription>Gérez les candidatures et paiements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-accent/10 rounded">
                <div className="text-2xl font-bold">42/50</div>
                <p className="text-sm">Places occupées</p>
              </div>
              <div className="p-4 bg-primary/10 rounded">
                <div className="text-2xl font-bold">12</div>
                <p className="text-sm">Demandes en attente</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button>Traiter les demandes</Button>
              <Button variant="outline">Gérer les paiements</Button>
              <Button variant="outline">Codes d'affiliation</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminGamificationPage() {
  return <div className="p-4">Page Admin Gamification en développement</div>;
}

function AdminNewsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Actualités & Changelog</CardTitle>
          <CardDescription>Publiez des news visibles dans l'app client</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button>Créer une actualité</Button>
            <p className="text-muted-foreground">
              Interface de publication et historique en développement
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AlfieBrainPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuration Alfie</CardTitle>
          <CardDescription>Paramètres globaux de l'IA</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4">
              <Button variant="outline">Ton et personnalité</Button>
              <Button variant="outline">Voix par défaut</Button>
              <Button variant="outline">Garde-fous et modération</Button>
              <Button variant="outline">Quotas TTS</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminIntegrationsPage() {
  return <div className="p-4">Page Admin Intégrations en développement</div>;
}

function SecurityPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sécurité & Audit</CardTitle>
          <CardDescription>Logs d'audit et gestion des accès</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4">
              <Button variant="outline">Logs d'audit</Button>
              <Button variant="outline">Sessions actives</Button>
              <Button variant="outline">Feature flags</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MonitoringPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Observabilité</CardTitle>
          <CardDescription>Monitoring système et performances</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">99.9%</div>
                <p className="text-sm text-muted-foreground">Uptime</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">1.2s</div>
                <p className="text-sm text-muted-foreground">Latence p95</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">3</div>
                <p className="text-sm text-muted-foreground">Erreurs 24h</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminSettingsPage() {
  return <div className="p-4">Page Admin Paramètres en développement</div>;
}