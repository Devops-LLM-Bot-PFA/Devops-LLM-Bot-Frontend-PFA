import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAdmin } from '@/contexts/AdminContext';
import StatusBadge from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, User, Server, Calendar, Database } from 'lucide-react';

const AdminInstancesPage: React.FC = () => {
  const { allInstances, isLoading, startInstance, stopInstance, deleteInstance } = useAdmin();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [instanceToDelete, setInstanceToDelete] = useState<string | null>(null);
  const [selectedInstance, setSelectedInstance] = useState<string | null>(null);

  // Handle instance delete
  const handleDeleteInstance = async () => {
    if (!instanceToDelete) return;
    
    try {
      await deleteInstance(instanceToDelete);
      setInstanceToDelete(null);
      toast({
        title: "Instance Deleted",
        description: "The instance has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the instance. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Filter instances based on search term
  const filteredInstances = allInstances.filter(instance => {
    const matchesSearch = 
      instance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instance.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instance.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${instance.user.firstName} ${instance.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const selectedInstanceDetails = selectedInstance ? allInstances.find(inst => inst.id === selectedInstance) : null;

  // Show loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 flex items-center justify-center h-full">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-t-2 border-primary rounded-full animate-spin mb-4"></div>
            <p className="text-lg">Loading instances...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin - All Instances</h1>
            <p className="text-muted-foreground">Manage all user instances from here</p>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {filteredInstances.length} instances
          </Badge>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-grow">
            <Input
              placeholder="Search by name, ID, user name, or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
        
        {/* Instances Grid */}
        {filteredInstances.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Server className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No instances found matching your filters</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredInstances.map((instance) => (
              <Card key={instance.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{instance.name}</CardTitle>
                      <CardDescription className="text-sm">
                        ID: {instance.id}
                      </CardDescription>
                    </div>
                    <StatusBadge status="running" size="sm" />
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* User Information */}
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium text-sm">Owner</span>
                    </div>
                    <p className="text-sm font-medium">{instance.user.firstName} {instance.user.lastName}</p>
                    <p className="text-xs text-muted-foreground">{instance.user.email}</p>
                  </div>
                  
                  {/* Instance Details */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Plan:</span>
                      <Badge variant="outline" className="ml-1 text-xs">
                        {instance.plan}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Resources:</span>
                      <span className="ml-1">{instance.cpu}vCPU, {instance.memory}GB</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    Created {new Date(instance.createdAt).toLocaleDateString()}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Instance Details - {instance.name}</DialogTitle>
                          <DialogDescription>
                            Complete information about this instance
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="grid gap-6">
                          {/* Instance Info */}
                          <div>
                            <h4 className="font-semibold mb-3 flex items-center">
                              <Database className="h-4 w-4 mr-2" />
                              Instance Information
                            </h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">ID:</span>
                                <p className="font-mono">{instance.id}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Status:</span>
                                <div className="mt-1">
                                  <StatusBadge status="running" size="sm" />
                                </div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Plan:</span>
                                <p className="capitalize">{instance.plan}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Resources:</span>
                                <p>{instance.cpu}vCPU, {instance.memory}GB RAM, {instance.storage}GB Storage</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Created:</span>
                                <p>{new Date(instance.createdAt).toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Last Updated:</span>
                                <p>{new Date(instance.lastUpdated).toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* User Info */}
                          <div>
                            <h4 className="font-semibold mb-3 flex items-center">
                              <User className="h-4 w-4 mr-2" />
                              Owner Information
                            </h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">User ID:</span>
                                <p className="font-mono">{instance.user.id}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Name:</span>
                                <p>{instance.user.firstName} {instance.user.lastName}</p>
                              </div>
                              <div className="col-span-2">
                                <span className="text-muted-foreground">Email:</span>
                                <p>{instance.user.email}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => setInstanceToDelete(instance.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {/* Statistics */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Total Instances</p>
              <p className="text-2xl font-bold">{filteredInstances.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Running Instances</p>
              <p className="text-2xl font-bold text-green-600">{filteredInstances.filter(i => i.status === 'running').length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Total CPU</p>
              <p className="text-2xl font-bold">{filteredInstances.reduce((acc, i) => acc + i.cpu, 0)}vCPU</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Total RAM</p>
              <p className="text-2xl font-bold">{filteredInstances.reduce((acc, i) => acc + i.memory, 0)}GB</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={!!instanceToDelete} onOpenChange={(open) => !open && setInstanceToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete this instance and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteInstance}
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

export default AdminInstancesPage;
