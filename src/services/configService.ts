import { httpClient, API_CONFIG } from '@/config/api';

// Types for configuration
export interface ConfigRequest {
  id?: string;
  webhookProxyUrl: string;
  appId: string;
  privateKey: string;
  webhookSecret: string;
  githubClientId: string;
  githubClientSecret: string;
}

export interface ConfigUpdateRequest extends Partial<ConfigRequest> {}

export interface UserConfig {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface MeResponse {
  user: {
    id: string;
    createdAt: string;
    updatedAt: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    location: string;
    isAdmin: boolean;
    subscriptionId: string | null;
  };
  config: {
    id: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  instance: any | null;
  subscription: any | null;
}

export class ConfigService {
  static async createConfig(data: ConfigRequest): Promise<void> {
    await httpClient.makeRequest<void>(
      API_CONFIG.ENDPOINTS.CONFIGS.CREATE,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  static async updateConfig(id: string, data: ConfigUpdateRequest): Promise<void> {
    await httpClient.makeRequest<void>(
      `${API_CONFIG.ENDPOINTS.CONFIGS.UPDATE}/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  }

  static async getConfigs(): Promise<UserConfig | null> {
    const response = await httpClient.makeRequest<MeResponse>(
      API_CONFIG.ENDPOINTS.USER.GET_ME,
      {
        method: 'GET',
      }
    );
    return response.config;
  }
}
