import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSubscription } from '@/hooks/useSubscription';
import { useUserRole, type UserRole } from '@/hooks/useUserRole';
import type { User } from '@supabase/supabase-js';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  redirectTo?: string;
  requireSubscription?: boolean;
}

export function ProtectedRoute({ 
  children, 
  requiredRole = 'client',
  redirectTo = '/auth',
  requireSubscription = false
}: ProtectedRouteProps) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const { role, loading: roleLoading } = useUserRole(user);
  const { hasActiveSubscription, loading: subLoading } = useSubscription(user);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setAuthLoading(false);
      
      if (!session) {
        navigate(redirectTo);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setUser(null);
        navigate(redirectTo);
      } else {
        setUser(session.user);
      }
    });

    checkAuth();
    return () => subscription.unsubscribe();
  }, [navigate, redirectTo]);

  useEffect(() => {
    if (!authLoading && !roleLoading && user) {
      if (requiredRole === 'admin' && role !== 'admin') {
        navigate('/dashboard'); // Redirect non-admin to client dashboard
      }
      
      // Check subscription requirement for dashboard routes
      if (requireSubscription && !subLoading && !hasActiveSubscription()) {
        navigate('/#pricing');
      }
    }
  }, [authLoading, roleLoading, subLoading, user, role, requiredRole, hasActiveSubscription, requireSubscription, navigate]);

  if (authLoading || roleLoading || (requireSubscription && subLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}