import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  MessageCircle,
  Calendar,
  Sparkles,
  FileImage,
  Share2,
  Crown,
  Gamepad2,
  Puzzle,
  CreditCard,
  Newspaper,
  HelpCircle,
  Settings,
  BarChart3,
  Kanban
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
  { title: 'Accueil', url: '/dashboard', icon: Home },
  { title: 'Alfie', url: '/dashboard/alfie', icon: MessageCircle },
  { title: 'Plan', url: '/dashboard/plan', icon: Kanban },
  { title: 'Générer', url: '/dashboard/generate', icon: Sparkles },
  { title: 'Assets', url: '/dashboard/assets', icon: FileImage },
  { title: 'Publications', url: '/dashboard/publications', icon: Share2 },
  { title: 'Affiliation', url: '/dashboard/affiliation', icon: Crown },
  { title: 'Gamification', url: '/dashboard/gamification', icon: Gamepad2 },
  { title: 'Intégrations', url: '/dashboard/integrations', icon: Puzzle },
  { title: 'Facturation', url: '/dashboard/billing', icon: CreditCard },
  { title: 'Actualités', url: '/dashboard/news', icon: Newspaper },
  { title: 'Support', url: '/dashboard/support', icon: HelpCircle },
  { title: 'Paramètres', url: '/dashboard/settings', icon: Settings },
];

export function ClientSidebar() {
  const location = useLocation();
  
  const isActive = (url: string) => {
    if (url === '/dashboard') {
      return location.pathname === '/dashboard';
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
          <Badge variant="secondary" className="text-xs">Client</Badge>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
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
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">A</span>
          </kbd>{' '}
          pour Alfie •{' '}
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘K</span>
          </kbd>{' '}
          recherche
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}