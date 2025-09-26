import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Mail,
  FileText,
  Calendar
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
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
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Æditus
            </h1>
            <Badge variant="destructive" className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Admin Dashboard
            </Badge>
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

      <div className="container mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="revenue">Revenus</TabsTrigger>
            <TabsTrigger value="ambassadors">Ambassadeurs</TabsTrigger>
            <TabsTrigger value="content">Contenu</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
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
                  <CardTitle className="text-sm font-medium">Ambassadeurs</CardTitle>
                  <Crown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">42/50</div>
                  <p className="text-xs text-muted-foreground">8 places restantes</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taux de conversion</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3.2%</div>
                  <p className="text-xs text-muted-foreground">+0.5% ce mois</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Nouvelles Inscriptions</CardTitle>
                  <CardDescription>Évolution des inscriptions cette semaine</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+89</div>
                  <p className="text-xs text-muted-foreground">+15% par rapport à la semaine dernière</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Demandes Ambassadeur</CardTitle>
                  <CardDescription>En attente de traitement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">À traiter sous 48h</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Gestion des Utilisateurs
                </CardTitle>
                <CardDescription>
                  Gérez les comptes clients et leurs abonnements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Button>Exporter la liste</Button>
                    <Button variant="outline">Filtrer par plan</Button>
                  </div>
                  <p className="text-muted-foreground">
                    Interface de gestion des utilisateurs en développement
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Analytics Revenus
                </CardTitle>
                <CardDescription>
                  Suivi des revenus et métriques financières
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">€45,231</div>
                      <p className="text-sm text-muted-foreground">MRR</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">€542,772</div>
                      <p className="text-sm text-muted-foreground">ARR</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">€2,891</div>
                      <p className="text-sm text-muted-foreground">Commissions</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ambassadors">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-accent" />
                  Programme Ambassadeur
                </CardTitle>
                <CardDescription>
                  Gérez les ambassadeurs et leurs commissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-accent/10 rounded-lg p-4">
                      <div className="text-2xl font-bold">42/50</div>
                      <p className="text-sm text-muted-foreground">Places occupées</p>
                    </div>
                    <div className="bg-gradient-primary/10 rounded-lg p-4">
                      <div className="text-2xl font-bold">€2,891</div>
                      <p className="text-sm text-muted-foreground">Commissions ce mois</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Demandes en attente (12)</h4>
                    <Button>Traiter les demandes</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Gestion du Contenu Global
                </CardTitle>
                <CardDescription>
                  Supervisez le contenu généré par l'IA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Outils de modération et d'analytics de contenu à venir
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configuration Système
                </CardTitle>
                <CardDescription>
                  Paramètres globaux de la plateforme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4">
                    <Button variant="outline">Configuration IA</Button>
                    <Button variant="outline">Paramètres de facturation</Button>
                    <Button variant="outline">Notifications système</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}