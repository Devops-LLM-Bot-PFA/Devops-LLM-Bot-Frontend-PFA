import { toast } from '@/hooks/use-toast';

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://your-api-base-url.com/api',
  ENDPOINTS: {
    AUTH: {
      SIGN_UP: '/auth/sign-up',
      SIGN_IN: '/auth/sign-in',
      CHANGE_PASSWORD: '/auth/change-password',
    },
    CONFIGS: {
      CREATE: '/configs',
      UPDATE: '/configs', // /:id will be appended
    },
    SUBSCRIPTIONS: {
      GET_ALL: '/subscriptions',
      SELECT: '/subscriptions/users', // /:subscriptionId will be appended
    },
    INSTANCES: {
      GET_ALL: '/instances',
      CREATE: '/instances',
      DELETE: '/instances', // /:instanceId will be appended
    },
    USER: {
      GET_ME: '/me',
      UPDATE_ME: '/me',
    },
  },
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

// Token management
export const TokenManager = {
  getToken: (): string | null => {
    return localStorage.getItem('devops-auth-token');
  },
  
  setToken: (token: string): void => {
    localStorage.setItem('devops-auth-token', token);
  },
  
  removeToken: (): void => {
    localStorage.removeItem('devops-auth-token');
  },
  
  getAuthHeaders: (): { [key: string]: string } => {
    const token = TokenManager.getToken();
    return {
      ...API_CONFIG.HEADERS,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  },
};

// HTTP Client with interceptors
export const createHttpClient = () => {
  const makeRequest = async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    // Request interceptor - automatically add auth headers
    const headers = {
      ...TokenManager.getAuthHeaders(),
      ...options.headers,
    };

    console.log('Sending request:', {
      url,
      method: options.method,
      body: options.body,
      headers,
    });

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Response interceptor - handle auth errors
      if (response.status === 401 || response.status === 403) {
        TokenManager.removeToken();
        toast({
          title: "Session expired",
          description: "Please log in again.",
          variant: "destructive",
        });
        window.location.href = '/auth';
        throw new Error('Unauthorized');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }

      // Handle no content responses
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return {} as T;
      }

      return response.json();
    } catch (error) {
      console.error('HTTP Request failed:', error);
      throw error;
    }
  };

  return { makeRequest };
};

export const httpClient = createHttpClient();
