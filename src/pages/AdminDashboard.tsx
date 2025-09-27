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
import { SecureRoleManager } from '@/components/admin/SecureRoleManager';

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    checkAuth();
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt !",
    });
  };


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
              <Route path="/roles" element={<RoleManagementPage />} />
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
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuration Gamification</CardTitle>
          <CardDescription>Gérez les défis, points et récompenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 bg-primary/10 rounded">
                <div className="text-2xl font-bold">247</div>
                <p className="text-sm">Joueurs actifs</p>
              </div>
              <div className="p-4 bg-accent/10 rounded">
                <div className="text-2xl font-bold">8</div>
                <p className="text-sm">Défis actifs</p>
              </div>
              <div className="p-4 bg-secondary/10 rounded">
                <div className="text-2xl font-bold">156K</div>
                <p className="text-sm">Points distribués</p>
              </div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Défis en cours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Publier 7 posts cette semaine</span>
                      <Badge>89 participants</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Première publication TikTok</span>
                      <Badge variant="secondary">23 participants</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Connecter 3 plateformes</span>
                      <Badge variant="outline">45 participants</Badge>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Créer un nouveau défi
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Classement Top 10</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[1,2,3,4,5].map((rank) => (
                      <div key={rank} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="w-6 text-center font-medium">#{rank}</span>
                          <span>user_{rank}@email.com</span>
                        </div>
                        <span className="font-medium">{2500 - rank * 200} pts</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Voir classement complet
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
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
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Intégrations & Connecteurs</CardTitle>
          <CardDescription>Gérez les clés API et statuts des connecteurs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="p-4 border rounded">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium">Fynk CRM</span>
                </div>
                <p className="text-sm text-muted-foreground">142 comptes connectés</p>
                <p className="text-xs text-green-600">Opérationnel</p>
              </div>
              
              <div className="p-4 border rounded">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium">Meta Business</span>
                </div>
                <p className="text-sm text-muted-foreground">89 comptes connectés</p>
                <p className="text-xs text-green-600">Opérationnel</p>
              </div>
              
              <div className="p-4 border rounded">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="font-medium">LinkedIn</span>
                </div>
                <p className="text-sm text-muted-foreground">67 comptes connectés</p>
                <p className="text-xs text-yellow-600">Limite API atteinte</p>
              </div>
              
              <div className="p-4 border rounded">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="font-medium">TikTok Business</span>
                </div>
                <p className="text-sm text-muted-foreground">23 comptes connectés</p>
                <p className="text-xs text-red-600">Erreur API</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Clés API Master</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">OpenAI API</span>
                      <Badge className="bg-green-100 text-green-800">Actif</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">ElevenLabs TTS</span>
                      <Badge className="bg-green-100 text-green-800">Actif</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Stripe Payments</span>
                      <Badge className="bg-green-100 text-green-800">Actif</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Resend Email</span>
                      <Badge className="bg-yellow-100 text-yellow-800">Limite proche</Badge>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Gérer les clés
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Webhooks & Monitoring</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Meta Webhooks</span>
                      <span className="text-xs text-green-600">99.8% uptime</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">LinkedIn Webhooks</span>
                      <span className="text-xs text-yellow-600">94.2% uptime</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Retry Queue</span>
                      <span className="text-xs">47 jobs pending</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Voir les logs
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
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
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres Plateforme</CardTitle>
          <CardDescription>Configuration générale et pages légales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Branding</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Logo Æditus</label>
                      <div className="mt-1 p-3 border rounded bg-muted/50">
                        <span className="text-sm text-muted-foreground">logo-aeditus.jpg</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Logo Fynk</label>
                      <div className="mt-1 p-3 border rounded bg-muted/50">
                        <span className="text-sm text-muted-foreground">logo-fynk.svg</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      Modifier les logos
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Pages Légales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">RGPD & Confidentialité</span>
                      <Button variant="outline" size="sm">Éditer</Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Conditions d'utilisation</span>
                      <Button variant="outline" size="sm">Éditer</Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Mentions légales</span>
                      <Button variant="outline" size="sm">Éditer</Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Politique cookies</span>
                      <Button variant="outline" size="sm">Éditer</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Bannières & Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Mode maintenance</p>
                        <p className="text-xs text-muted-foreground">Désactive l'accès client</p>
                      </div>
                      <Button variant="outline" size="sm">Configurer</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Bannière d'annonce</p>
                        <p className="text-xs text-muted-foreground">Message promotionnel</p>
                      </div>
                      <Button variant="outline" size="sm">Configurer</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Feature Flags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Gamification</span>
                      <Badge className="bg-green-100 text-green-800">Activé</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Simulateur</span>
                      <Badge className="bg-green-100 text-green-800">Activé</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Affiliation</span>
                      <Badge className="bg-green-100 text-green-800">Activé</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">AI Voiceover</span>
                      <Badge className="bg-yellow-100 text-yellow-800">Beta</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RoleManagementPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Rôles Utilisateurs</CardTitle>
          <CardDescription>Administration sécurisée des rôles avec audit complet</CardDescription>
        </CardHeader>
        <CardContent>
          <SecureRoleManager />
        </CardContent>
      </Card>
    </div>
  );
}