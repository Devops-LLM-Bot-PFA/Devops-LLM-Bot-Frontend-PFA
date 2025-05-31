import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';
import { InstanceService } from '@/services/instanceService';
import { UserService } from '@/services/userService';

// Define the instance type
export type InstanceStatus = 'creating' | 'running' | 'stopped' | 'error';

export type Instance = {
  id: string;
  name: string;
  status: InstanceStatus;
  createdAt: string;
  lastUpdated: string;
  cpu: number;
  memory: number;
  storage: number;
  plan: 'free' | 'pro' | 'enterprise';
};

// Define the instance context type
type InstanceContextType = {
  instance: Instance | null;
  isLoading: boolean;
  error: string | null;
  createInstance: (name: string) => Promise<void>;
  startInstance: () => Promise<void>;
  stopInstance: () => Promise<void>;
  deleteInstance: () => Promise<void>;
  stats: {
    cpuUsage: number[];
    memoryUsage: number[];
    networkIn: number[];
    networkOut: number[];
  };
};

// Create the instance context
const InstanceContext = createContext<InstanceContextType | undefined>(undefined);

// Instance provider props
type InstanceProviderProps = {
  children: ReactNode;
};

// Create the instance provider
export const InstanceProvider: React.FC<InstanceProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [instance, setInstance] = useState<Instance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    cpuUsage: Array(24).fill(0).map(() => Math.random() * 80 + 5),
    memoryUsage: Array(24).fill(0).map(() => Math.random() * 60 + 20),
    networkIn: Array(24).fill(0).map(() => Math.random() * 50),
    networkOut: Array(24).fill(0).map(() => Math.random() * 30),
  });

  // Fetch instance from backend on mount and when user changes
  const fetchInstance = async () => {
    if (!user) {
      setInstance(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const userDetails = await UserService.getUserDetails();
      setInstance(userDetails.instance || null);
    } catch (err: any) {
      setError('Failed to fetch instance');
      setInstance(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInstance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Create instance via backend
  const createInstance = async (name: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await InstanceService.createInstance({ name });
      toast({
        title: 'Instance Created',
        description: `Your instance ${name} is now running!`,
      });
      await fetchInstance();
    } catch (err: any) {
      setError(err.message || 'Failed to create instance');
      toast({
        title: 'Error',
        description: err.message || 'Failed to create instance.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete instance via backend
  const deleteInstance = async () => {
    if (!instance) {
      setError('No instance available');
      return Promise.reject('No instance available');
    }
    setIsLoading(true);
    setError(null);
    try {
      await InstanceService.deleteInstance(instance.id);
      toast({
        title: 'Instance Deleted',
        description: `Your instance ${instance.name} has been deleted.`,
        variant: 'destructive',
      });
      await fetchInstance();
    } catch (err: any) {
      setError(err.message || 'Failed to delete instance');
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete instance.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // The following are placeholders; implement start/stop as needed with real API
  const startInstance = async () => {
    toast({ title: 'Not implemented', description: 'Start instance is not implemented in backend.' });
    return Promise.resolve();
  };
  const stopInstance = async () => {
    toast({ title: 'Not implemented', description: 'Stop instance is not implemented in backend.' });
    return Promise.resolve();
  };

  // Update instance stats periodically when running
  useEffect(() => {
    if (instance?.status === 'running') {
      const interval = setInterval(() => {
        setStats(prev => ({
          cpuUsage: [...prev.cpuUsage.slice(1), Math.random() * 80 + 5],
          memoryUsage: [...prev.memoryUsage.slice(1), Math.random() * 60 + 20],
          networkIn: [...prev.networkIn.slice(1), Math.random() * 50],
          networkOut: [...prev.networkOut.slice(1), Math.random() * 30],
        }));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [instance?.status]);

  return (
    <InstanceContext.Provider value={{
      instance,
      isLoading,
      error,
      createInstance,
      startInstance,
      stopInstance,
      deleteInstance,
      stats
    }}>
      {children}
    </InstanceContext.Provider>
  );
};

// Custom hook to use the instance context
export const useInstance = () => {
  const context = useContext(InstanceContext);
  if (context === undefined) {
    throw new Error('useInstance must be used within an InstanceProvider');
  }
  return context;
};
