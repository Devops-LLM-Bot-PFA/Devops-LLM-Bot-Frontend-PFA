import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { InstanceStatus } from './InstanceContext';
import { InstanceService, Instance } from '@/services/instanceService';

// Extended instance type with user information
export interface AdminInstance extends Instance {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

// Define the admin context type
type AdminContextType = {
  allInstances: AdminInstance[];
  isLoading: boolean;
  error: string | null;
  startInstance: (instanceId: string) => Promise<void>;
  stopInstance: (instanceId: string) => Promise<void>;
  deleteInstance: (instanceId: string) => Promise<void>;
  getInstanceDetails: (instanceId: string) => AdminInstance | null;
  getSystemStatus: () => {
    totalInstances: number;
    runningInstances: number;
    stoppedInstances: number;
    errorInstances: number;
    totalCpuUsage: number;
    totalMemoryUsage: number;
  };
};

// Create the admin context
const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Admin provider props
type AdminProviderProps = {
  children: ReactNode;
};

// Create the admin provider
export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [allInstances, setAllInstances] = useState<AdminInstance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch real instances from API and map to AdminInstance with dummy data
  const fetchInstances = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await InstanceService.getAllInstances();
      console.log("Fetched instances from /instances:", response);
      const mapped = (response || []).map((apiInstance: Instance, idx: number) => ({
        id: apiInstance.id || `instance-${idx}`,
        name: apiInstance.name || `Instance ${idx+1}`,
        status: 'running' as InstanceStatus,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        cpu: 1,
        memory: 0.7,
        storage: 0.6,
        plan: 'pro',
        user: {
          id: (apiInstance as any).user?.id || 'unknown',
          firstName: (apiInstance as any).user?.firstName || 'N/A',
          lastName: (apiInstance as any).user?.lastName || '',
          email: (apiInstance as any).user?.email || '',
        },
      })) as AdminInstance[];
      setAllInstances(mapped);
    } catch (err: any) {
      setError('Failed to fetch instances');
      setAllInstances([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.isAdmin) {
      fetchInstances();
    }
  }, [user]);

  // Delete instance via API
  const deleteInstance = async (instanceId: string) => {
    setIsLoading(true);
    try {
      await InstanceService.deleteInstance(instanceId);
      await fetchInstances();
    } catch (err) {
      setError('Failed to delete instance');
    } finally {
      setIsLoading(false);
    }
  };

  // No start/stop logic, always running
  const startInstance = async () => Promise.resolve();
  const stopInstance = async () => Promise.resolve();

  return (
    <AdminContext.Provider value={{
      allInstances,
      isLoading,
      error,
      startInstance,
      stopInstance,
      deleteInstance,
      getInstanceDetails: (instanceId) => allInstances.find(inst => inst.id === instanceId) || null,
      getSystemStatus: () => ({
        totalInstances: allInstances.length,
        runningInstances: allInstances.length,
        stoppedInstances: 0,
        errorInstances: 0,
        totalCpuUsage: allInstances.length,
        totalMemoryUsage: allInstances.length * 0.7,
      })
    }}>
      {children}
    </AdminContext.Provider>
  );
};

// Custom hook to use the admin context
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
