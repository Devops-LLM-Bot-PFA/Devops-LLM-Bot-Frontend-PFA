import { httpClient } from '@/config/api';
import { API_CONFIG, TokenManager } from '@/config/api';

// Types for authentication
export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  location?: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface ChangePasswordRequest {
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface AuthResponse {
  accessToken: string;
}

export class AuthService {
  static async signUp(data: SignUpRequest): Promise<AuthResponse> {
    const response = await httpClient.makeRequest<AuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH.SIGN_UP,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );

    // Store the token
    if (response.accessToken) {
      TokenManager.setToken(response.accessToken);
    }

    return response;
  }

  static async signIn(data: SignInRequest): Promise<AuthResponse> {
    const response = await httpClient.makeRequest<AuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH.SIGN_IN,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );

    // Store the token
    if (response.accessToken) {
      TokenManager.setToken(response.accessToken);
    }

    return response;
  }

  static async changePassword(data: ChangePasswordRequest): Promise<void> {
    await httpClient.makeRequest<void>(
      API_CONFIG.ENDPOINTS.AUTH.CHANGE_PASSWORD,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  }

  static logout(): void {
    TokenManager.removeToken();
  }
}
