import { httpClient, API_CONFIG } from '@/config/api';

// Types for user management
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  location?: string;
  avatar?: string;
  isAdmin?: boolean; // Add isAdmin property
  createdAt: string;
  lastUpdated: string;
}

export interface UserDetailsResponse {
  user: UserProfile;
  configuration?: any; // Replace with your actual config type
  instance?: any; // Replace with your actual instance type
  subscription?: any; // Replace with your actual subscription type
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  location?: string;
}

export class UserService {
  static async getUserDetails(): Promise<UserDetailsResponse> {
    return httpClient.makeRequest<UserDetailsResponse>(
      API_CONFIG.ENDPOINTS.USER.GET_ME,
      { 
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      }
    );
  }

  static async updateUserProfile(data: UpdateUserRequest): Promise<UserDetailsResponse> {
    return httpClient.makeRequest<UserDetailsResponse>(
      API_CONFIG.ENDPOINTS.USER.UPDATE_ME,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  }
}
