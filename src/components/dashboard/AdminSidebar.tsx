import { NavLink, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Users,
  CreditCard,
  Crown,
  FileText,
  Newspaper,
  Settings,
  Shield,
  Activity,
  Brain,
  Puzzle,
  AlertTriangle,
  DollarSign,
  Gamepad2,
  UserCheck
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';

const menuItems = [
  { title: 'Aperçu', url: '/admin', icon: BarChart3 },
  { title: 'Comptes', url: '/admin/accounts', icon: Users },
  { title: 'Gestion des Rôles', url: '/admin/roles', icon: UserCheck },
  { title: 'Plans & Tarifs', url: '/admin/plans', icon: CreditCard },
  { title: 'Affiliation', url: '/admin/affiliation', icon: Crown },
  { title: 'Gamification', url: '/admin/gamification', icon: Gamepad2 },
  { title: 'Actualités', url: '/admin/news', icon: Newspaper },
  { title: 'Alfie Brain', url: '/admin/alfie', icon: Brain },
  { title: 'Intégrations', url: '/admin/integrations', icon: Puzzle },
  { title: 'Sécurité', url: '/admin/security', icon: Shield },
  { title: 'Observabilité', url: '/admin/monitoring', icon: Activity },
  { title: 'Paramètres', url: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const location = useLocation();
  
  const isActive = (url: string) => {
    if (url === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(url);
  };

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="border-b border-border">
        <div className="flex items-center gap-2 px-2 py-1">
          <h2 className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
            Æditus
          </h2>
          <Badge variant="destructive" className="text-xs flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Admin
          </Badge>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <NavLink to={item.url} className="flex items-center gap-3">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border">
        <div className="text-xs text-muted-foreground px-2">
          Administration système
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}