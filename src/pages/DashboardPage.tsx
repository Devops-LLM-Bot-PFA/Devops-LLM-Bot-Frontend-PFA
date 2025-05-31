import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useInstance } from '@/contexts/InstanceContext';
import { useCredentials } from '@/contexts/CredentialsContext';
import { useToast } from '@/hooks/use-toast';
import StatsCard from '@/components/ui/StatsCard';
import StatusBadge from '@/components/ui/StatusBadge';
import ChartCard from '@/components/ui/ChartCard';
import { Server, Activity, HardDrive, Database } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { instance, isLoading, createInstance, startInstance, stopInstance, stats } = useInstance();
  const { isSubmitted } = useCredentials();
  const { toast } = useToast();
  const [instanceName, setInstanceName] = useState('my-llm-bot');
  const [isCreating, setIsCreating] = useState(false);

  // Check if credentials are submitted
  useEffect(() => {
    if (!isSubmitted) {
      toast({
        title: "Credentials Required",
        description: "You need to set up your credentials first.",
        variant: "destructive"
      });
      navigate('/credentials');
    }
  }, [isSubmitted, navigate, toast]);

  // Handle instance creation
  const handleCreateInstance = async () => {
    if (!instanceName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a name for your instance.",
        variant: "destructive"
      });
      return;
    }
    
    setIsCreating(true);
    try {
      await createInstance(instanceName);
      toast({
        title: "Success",
        description: `Your instance "${instanceName}" is being created.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create your instance. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

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

  // Show loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 flex items-center justify-center h-full">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-t-2 border-primary rounded-full animate-spin mb-4"></div>
            <p className="text-lg">Loading your dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show creation form if no instance
  if (!instance) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-2">Create your first DevOps LLM Bot instance</p>
          </div>
          
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Create New Instance</CardTitle>
              <CardDescription>
                You can create one Kubernetes instance per account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="instanceName" className="text-sm font-medium">
                    Instance Name
                  </label>
                  <input
                    id="instanceName"
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={instanceName}
                    onChange={(e) => setInstanceName(e.target.value)}
                    placeholder="my-llm-bot"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                disabled={isCreating}
                onClick={handleCreateInstance}
              >
                {isCreating ? 'Creating...' : 'Create Instance'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // Show dashboard if instance exists
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{instance.name}</h1>
            <div className="flex items-center">
              <StatusBadge status={instance.status} />
              <span className="ml-3 flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-green-700 font-semibold">Active</span>
              </span>
            </div>
          </div>
          
          
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard 
            title="Status" 
            value="Active"
            icon={<Server className="h-5 w-5" />}
          />
          <StatsCard 
            title="CPU" 
            value="2.3 vCPU"
            icon={<Activity className="h-5 w-5" />}
            description="Current usage: 36%"
          />
          <StatsCard 
            title="Memory" 
            value="7.8 GB"
            icon={<HardDrive className="h-5 w-5" />}
            description="Current usage: 1.7 GB"
          />
          <StatsCard 
            title="Storage" 
            value="120 GB"
            icon={<Database className="h-5 w-5" />}
            description="SSD Storage"
            trend={2.3}
          />
        </div>
        
        {/* Charts: always show fake data if instance exists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartCard 
            title="CPU Utilization (%)" 
            data={stats.cpuUsage} 
            color="#0EA5E9"
            yAxisLabel="%"
          />
          <ChartCard 
            title="Memory Usage (%)" 
            data={stats.memoryUsage} 
            color="#8B5CF6"
            yAxisLabel="%"
          />
          <ChartCard 
            title="Network In (MB/s)" 
            data={stats.networkIn} 
            color="#10B981"
            yAxisLabel=" MB/s"
          />
          <ChartCard 
            title="Network Out (MB/s)" 
            data={stats.networkOut} 
            color="#F59E0B"
            yAxisLabel=" MB/s"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
