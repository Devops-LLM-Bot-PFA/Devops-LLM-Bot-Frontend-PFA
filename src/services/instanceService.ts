import { httpClient, API_CONFIG } from '@/config/api';

// Types for instance management
export interface Instance {
  id: string;
  name: string;
  status: 'creating' | 'running' | 'stopped' | 'error';
  createdAt: string;
  lastUpdated: string;
  cpu: number;
  memory: number;
  storage: number;
  plan: 'free' | 'pro' | 'enterprise';
  userId: string;
  configId?: string;
}

export interface CreateInstanceRequest {
  name?: string;
}

export type InstancesListResponse = Instance[];

export class InstanceService {
  static async getAllInstances(): Promise<InstancesListResponse> {
    return httpClient.makeRequest<InstancesListResponse>(
      API_CONFIG.ENDPOINTS.INSTANCES.GET_ALL
    );
  }

  static async createInstance(data: CreateInstanceRequest = {}): Promise<Instance> {
    return httpClient.makeRequest<Instance>(
      API_CONFIG.ENDPOINTS.INSTANCES.CREATE,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  static async deleteInstance(instanceId: string): Promise<void> {
    await httpClient.makeRequest<void>(
      `${API_CONFIG.ENDPOINTS.INSTANCES.DELETE}/${instanceId}`,
      {
        method: 'DELETE',
      }
    );
  }
}
