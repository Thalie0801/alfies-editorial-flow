import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { roleAssignmentSchema, type RoleAssignmentFormData } from '@/lib/validationSchemas';
import { Shield, User, Clock } from 'lucide-react';

interface UserRole {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
  profiles?: {
    display_name: string;
  };
}

interface AuditLog {
  id: string;
  user_id: string;
  target_user_id: string;
  action: string;
  old_role?: string;
  new_role?: string;
  created_at: string;
}

export function SecureRoleManager() {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUserId, setNewUserId] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'client'>('client');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchUserRoles();
    fetchAuditLogs();
  }, []);

  const fetchUserRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          *,
          profiles:user_id (
            display_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserRoles(data || []);
    } catch (error) {
      console.error('Error fetching user roles:', error);
      toast.error('Failed to load user roles');
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('role_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setAuditLogs(data || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  const assignRole = async () => {
    if (!newUserId.trim()) {
      toast.error('User ID is required');
      return;
    }

    // Validate input
    try {
      const validatedData: RoleAssignmentFormData = roleAssignmentSchema.parse({
        userId: newUserId.trim(),
        role: newRole
      });

      setProcessing(true);

      // Check if user already has a role
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', validatedData.userId)
        .single();

      if (existingRole) {
        // Update existing role
        const { error } = await supabase
          .from('user_roles')
          .update({ role: validatedData.role })
          .eq('user_id', validatedData.userId);

        if (error) throw error;
        toast.success(`Role updated to ${validatedData.role}`);
      } else {
        // Insert new role
        const { error } = await supabase
          .from('user_roles')
          .insert({
            user_id: validatedData.userId,
            role: validatedData.role
          });

        if (error) throw error;
        toast.success(`Role assigned: ${validatedData.role}`);
      }

      setNewUserId('');
      setNewRole('client');
      fetchUserRoles();
      fetchAuditLogs();
    } catch (error: any) {
      if (error.name === 'ZodError') {
        toast.error(error.errors[0]?.message || 'Invalid input');
      } else {
        console.error('Error assigning role:', error);
        toast.error('Failed to assign role');
      }
    } finally {
      setProcessing(false);
    }
  };

  const deleteRole = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this user role?')) return;

    try {
      setProcessing(true);
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
      toast.success('Role removed successfully');
      fetchUserRoles();
      fetchAuditLogs();
    } catch (error) {
      console.error('Error removing role:', error);
      toast.error('Failed to remove role');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Role Assignment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Assign User Role
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="userId">User ID (UUID)</Label>
            <Input
              id="userId"
              value={newUserId}
              onChange={(e) => setNewUserId(e.target.value)}
              placeholder="Enter user UUID"
              className="font-mono text-sm"
            />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Select value={newRole} onValueChange={(value: 'admin' | 'client') => setNewRole(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={assignRole} disabled={processing}>
            {processing ? 'Processing...' : 'Assign Role'}
          </Button>
        </CardContent>
      </Card>

      {/* Current User Roles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Current User Roles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {userRoles.map((userRole) => (
              <div key={userRole.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">
                    {userRole.profiles?.display_name || 'Unknown User'}
                  </p>
                  <p className="text-sm text-muted-foreground font-mono">
                    {userRole.user_id}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Role: <span className="font-medium capitalize">{userRole.role}</span>
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteRole(userRole.user_id)}
                  disabled={processing}
                >
                  Remove
                </Button>
              </div>
            ))}
            {userRoles.length === 0 && (
              <p className="text-muted-foreground text-center py-4">No user roles found</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Audit Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Role Change Audit Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium capitalize">{log.action}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Target User: <span className="font-mono">{log.target_user_id}</span>
                </p>
                {log.old_role && log.new_role && (
                  <p className="text-sm">
                    Role changed from <span className="font-medium">{log.old_role}</span> to{' '}
                    <span className="font-medium">{log.new_role}</span>
                  </p>
                )}
                {log.action === 'INSERT' && log.new_role && (
                  <p className="text-sm">
                    Role assigned: <span className="font-medium">{log.new_role}</span>
                  </p>
                )}
                {log.action === 'DELETE' && log.old_role && (
                  <p className="text-sm">
                    Role removed: <span className="font-medium">{log.old_role}</span>
                  </p>
                )}
              </div>
            ))}
            {auditLogs.length === 0 && (
              <p className="text-muted-foreground text-center py-4">No audit logs found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}