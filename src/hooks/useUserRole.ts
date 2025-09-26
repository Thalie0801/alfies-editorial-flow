import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'client' | null;

export function useUserRole(user: User | null) {
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching user roles:', error);
          setRole('client'); // Default to client on error
        } else {
          const roles = (data as Array<{ role: string }>) || [];
          const isAdmin = roles.some(r => r.role === 'admin');
          const candidate = isAdmin ? 'admin' : (roles[0]?.role ?? 'client');
          const nextRole: UserRole = candidate === 'admin' ? 'admin' : 'client';
          setRole(nextRole);
        }

      } catch (error) {
        console.error('Error:', error);
        setRole('client');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  return { role, loading };
}