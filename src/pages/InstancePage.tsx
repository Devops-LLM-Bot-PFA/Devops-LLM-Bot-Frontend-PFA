import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useInstance } from '@/contexts/InstanceContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import StatusBadge from '@/components/ui/StatusBadge';
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
import { Server, Activity, HardDrive, Database } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';

const InstancePage: React.FC = () => {
  const { instance, isLoading, startInstance, stopInstance, deleteInstance } = useInstance();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { user } = useAuth();

  // Handle instance start
  const handleStartInstance = async () => {
    try {
      await startInstance();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start your instance. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle instance stop
  const handleStopInstance = async () => {
    try {
      await stopInstance();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to stop your instance. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle instance delete
  const handleDeleteInstance = async () => {
    try {
      await deleteInstance();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete your instance. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 flex items-center justify-center h-full">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-t-2 border-primary rounded-full animate-spin mb-4"></div>
            <p className="text-lg">Loading instance details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show message if no instance
  if (!instance) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-8">Instance Management</h1>
          
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>No Instance Found</CardTitle>
              <CardDescription>
                You don't have any Kubernetes instance yet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                Create your first instance from the dashboard
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <a href="/dashboard">Go to Dashboard</a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // Show instance details
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-8">Instance Management</h1>
        
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{instance.name}</CardTitle>
                  <CardDescription className="mt-2 flex items-center">
                    <StatusBadge status="running" className="mr-2" />
                    <span className="flex items-center gap-1 ml-2">
                      <span className="inline-block w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-green-700 font-semibold text-sm">Active</span>
                    </span>
                    <span className="ml-4">Created on {new Date(instance.createdAt).toLocaleDateString()}</span>
                  </CardDescription>
                </div>
                
                <div className="flex items-center space-x-2">
                  {instance.status === 'running' ? (
                    <Button 
                      variant="outline" 
                      className="bg-devops-red/10 text-devops-red hover:bg-devops-red/20 border-devops-red/20"
                      onClick={handleStopInstance}
                    >
                      Stop Instance
                    </Button>
                  ) : instance.status === 'stopped' ? (
                    <Button 
                      variant="outline" 
                      className="bg-devops-green/10 text-devops-green hover:bg-devops-green/20 border-devops-green/20"
                      onClick={handleStartInstance}
                    >
                      Start Instance
                    </Button>
                  ) : null}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-8">
                {/* Instance details */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Instance Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Instance ID</span>
                        <span className="font-medium">{instance.id}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Status</span>
                        <span className="font-medium capitalize">
                          <span className="flex items-center gap-1">
                            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            Active
                          </span>
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Created</span>
                        <span className="font-medium">{new Date(instance.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">vCPU</span>
                        <span className="font-medium">1 cores</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Memory</span>
                        <span className="font-medium">0.7 GB</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Storage</span>
                        <span className="font-medium">607 MB SSD</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Instance access */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Access Details</h3>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="mb-4">
                      <p className="font-medium">API Endpoint:</p>
                      <code className="block bg-card p-2 rounded mt-1 text-sm overflow-x-auto">
                        https://{instance.name}-{instance.id}.devopswizard.cloud/api
                      </code>
                    </div>
                    <div>
                      <p className="font-medium">Access Token:</p>
                      <div className="flex items-center mt-1">
                        <code className="bg-card p-2 rounded text-sm flex-grow overflow-hidden">
                          ••••••••••••••••••••••••••••••••••••••••••••••••••
                        </code>
                        <Button variant="outline" size="sm" className="ml-2 whitespace-nowrap">
                          Copy Token
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Fake interactive chart and logs: always show if instance exists */}
                <div className="grid md:grid-cols-2 gap-8 mt-8">
                  {/* Fake Chart */}
                  <div className="bg-white rounded-xl shadow p-6">
                    <h4 className="font-semibold mb-4">CPU Usage (Fake Data)</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={[
                        { time: '10:00', value: 30 },
                        { time: '10:05', value: 45 },
                        { time: '10:10', value: 60 },
                        { time: '10:15', value: 50 },
                        { time: '10:20', value: 70 },
                        { time: '10:25', value: 55 },
                        { time: '10:30', value: 65 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Fake Logs */}
                  <div className="bg-white rounded-xl shadow p-6">
                    <h4 className="font-semibold mb-4">Recent Logs (Fake Data)</h4>
                    <div className="h-48 overflow-y-auto text-xs font-mono bg-gray-50 rounded p-2 border border-gray-100">
                      <div className="mb-2 text-green-600">[10:00:01] Instance started successfully.</div>
                      <div className="mb-2 text-blue-600">[10:01:15] Health check passed.</div>
                      <div className="mb-2 text-yellow-600">[10:03:42] CPU usage spike detected.</div>
                      <div className="mb-2 text-blue-600">[10:05:00] Health check passed.</div>
                      <div className="mb-2 text-green-600">[10:10:00] Autoscaling event: +1 vCPU.</div>
                      <div className="mb-2 text-blue-600">[10:15:00] Health check passed.</div>
                      <div className="mb-2 text-gray-600">[10:20:00] Scheduled backup completed.</div>
                      <div className="mb-2 text-blue-600">[10:25:00] Health check passed.</div>
                      <div className="mb-2 text-green-600">[10:30:00] Instance running smoothly.</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="border-t pt-6 flex justify-between">
              {instance && user?.id && (
                <Button
                  variant="outline"
                  onClick={() => {
                    const domain = import.meta.env.VITE_BOT_DOMAIN || 'bot.devops-wizard.com';
                    window.open(`https://${domain}/${user.id}/probot`, '_blank');
                  }}
                >
                  Check instance
                </Button>
              )}
              <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
                Delete Instance
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete your instance "{instance?.name}". This action cannot be undone.
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

export default InstancePage;
