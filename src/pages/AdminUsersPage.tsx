
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  instances: number;
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: string;
  lastActive: string;
  status: 'active' | 'inactive' | 'suspended';
}

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [userToSuspend, setUserToSuspend] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // Fetch users (mock data)
  useEffect(() => {
    const generateMockUsers = (): User[] => {
      const roles: ('admin' | 'user')[] = ['user', 'user', 'user', 'user', 'admin'];
      const plans: ('free' | 'pro' | 'enterprise')[] = ['free', 'free', 'free', 'pro', 'enterprise'];
      const statuses: ('active' | 'inactive' | 'suspended')[] = ['active', 'active', 'active', 'inactive', 'suspended'];
      const names = ['John Smith', 'Emily Johnson', 'Michael Brown', 'Sarah Davis', 'David Wilson', 'Jennifer Martinez', 'Robert Taylor', 'Jessica Anderson', 'William Thomas', 'Lisa Jackson'];
      
      return Array(20).fill(null).map((_, index) => {
        const id = `user-${Math.random().toString(36).substr(2, 9)}`;
        const randomNameIndex = Math.floor(Math.random() * names.length);
        const name = names[randomNameIndex];
        const email = `${name.toLowerCase().replace(' ', '.')}@example.com`;
        const role = roles[Math.floor(Math.random() * roles.length)];
        const instances = Math.floor(Math.random() * 3);
        const plan = plans[Math.floor(Math.random() * plans.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        // Generate a date between 1 and 365 days ago
        const createdAtDate = new Date();
        createdAtDate.setDate(createdAtDate.getDate() - Math.floor(Math.random() * 365) - 1);
        
        // Generate a date between creation and now
        const lastActiveDate = new Date();
        const creationTime = createdAtDate.getTime();
        const nowTime = Date.now();
        lastActiveDate.setTime(creationTime + Math.random() * (nowTime - creationTime));
        
        return {
          id,
          name,
          email,
          role,
          instances,
          plan,
          createdAt: createdAtDate.toISOString(),
          lastActive: lastActiveDate.toISOString(),
          status,
        };
      });
    };

    // Simulate API call
    setTimeout(() => {
      setUsers(generateMockUsers());
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesPlan = planFilter === 'all' || user.plan === planFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesPlan && matchesStatus;
  });

  // Handle user suspension
  const handleSuspendUser = () => {
    if (!userToSuspend) return;
    
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userToSuspend 
          ? { ...user, status: user.status === 'suspended' ? 'active' : 'suspended' } 
          : user
      )
    );
    setUserToSuspend(null);
  };

  // Handle user deletion
  const handleDeleteUser = () => {
    if (!userToDelete) return;
    
    setUsers(prevUsers => 
      prevUsers.filter(user => user.id !== userToDelete)
    );
    setUserToDelete(null);
  };

  // Show loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 flex items-center justify-center h-full">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-t-2 border-primary rounded-full animate-spin mb-4"></div>
            <p className="text-lg">Loading users...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-8">User Management</h1>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-grow">
            <Input
              placeholder="Search by name, email or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="w-full md:w-40">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Role: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-40">
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Plan: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-40">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Users Table */}
        <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left py-3 px-4 font-medium">Name</th>
                  <th className="text-left py-3 px-4 font-medium">Email</th>
                  <th className="text-left py-3 px-4 font-medium">Role</th>
                  <th className="text-left py-3 px-4 font-medium">Plan</th>
                  <th className="text-left py-3 px-4 font-medium">Instances</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Created</th>
                  <th className="text-left py-3 px-4 font-medium">Last Active</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-6 text-center text-muted-foreground">
                      No users found matching your filters
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-t">
                      <td className="py-3 px-4 font-medium">{user.name}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4 capitalize">{user.role}</td>
                      <td className="py-3 px-4 capitalize">{user.plan}</td>
                      <td className="py-3 px-4">{user.instances}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.status === 'active' ? 'bg-devops-green/10 text-devops-green' : 
                          user.status === 'inactive' ? 'bg-devops-yellow/10 text-devops-yellow' : 
                          'bg-devops-red/10 text-devops-red'
                        }`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-sm">{new Date(user.lastActive).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className={`h-8 ${
                              user.status === 'suspended' ? 
                              'text-devops-green' : 
                              'text-devops-yellow'
                            }`}
                            onClick={() => setUserToSuspend(user.id)}
                          >
                            {user.status === 'suspended' ? 'Activate' : 'Suspend'}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 text-destructive"
                            onClick={() => setUserToDelete(user.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Statistics */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Total Users</p>
            <p className="text-2xl font-bold">{filteredUsers.length}</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Active Users</p>
            <p className="text-2xl font-bold">{filteredUsers.filter(u => u.status === 'active').length}</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Total Admins</p>
            <p className="text-2xl font-bold">{filteredUsers.filter(u => u.role === 'admin').length}</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Paying Users</p>
            <p className="text-2xl font-bold">{filteredUsers.filter(u => u.plan !== 'free').length}</p>
          </div>
        </div>
      </div>
      
      {/* Suspend confirmation dialog */}
      <AlertDialog open={!!userToSuspend} onOpenChange={(open) => !open && setUserToSuspend(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {users.find(u => u.id === userToSuspend)?.status === 'suspended' 
                ? 'Activate User Account?' 
                : 'Suspend User Account?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {users.find(u => u.id === userToSuspend)?.status === 'suspended' 
                ? 'This will reactivate the user account and restore access to all features.'
                : 'This will suspend the user account and prevent access to the platform.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSuspendUser}>
              {users.find(u => u.id === userToSuspend)?.status === 'suspended' 
                ? 'Activate' 
                : 'Suspend'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User Account?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete this user and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default AdminUsersPage;
