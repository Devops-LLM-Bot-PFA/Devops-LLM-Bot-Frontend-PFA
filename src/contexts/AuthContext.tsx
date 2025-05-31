import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { TokenManager } from '@/config/api';
import { UserService } from '@/services/userService';
import { AuthService } from '@/services/authService';
import { UserProfile } from '@/services/userService';
import { ConfigService } from '@/services/configService';

// Define the User type
export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isAdmin: boolean;
};

type ProfileUpdateData = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  location?: string;
};

// Define the Auth context type
type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (provider: 'google' | 'github') => void;
  loginWithEmail: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (data: ProfileUpdateData) => boolean;
};

// Create the Auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
type AuthProviderProps = {
  children: ReactNode;
};

// Create the Auth provider
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Bootstrap authentication on app start
  useEffect(() => {
    const bootstrapAuth = async () => {
      const token = TokenManager.getToken();
      if (token) {
        try {
          const response = await UserService.getUserDetails();
          const userData: User = {
            id: response.user.id,
            name: `${response.user.firstName} ${response.user.lastName}`.trim(),
            email: response.user.email,
            isAdmin: response.user.isAdmin || false, // Check for isAdmin property
          };
          setUser(userData);
        } catch (error) {
          console.error('Failed to bootstrap auth:', error);
          // If token is invalid, remove it
          TokenManager.removeToken();
        }
      }
      setIsLoading(false);
    };

    bootstrapAuth();
  }, []);

  // Real login function for OAuth
  const login = (provider: 'google' | 'github') => {
    // Redirect to backend OAuth endpoint
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://your-api-base-url.com/api';
    window.location.href = `${baseUrl}/auth/oauth/${provider}`;
  };

  // Handle OAuth callback (parse token from URL)
  useEffect(() => {
    const url = new URL(window.location.href);
    const accessToken = url.searchParams.get('accessToken');
    if (accessToken) {
      TokenManager.setToken(accessToken);
      // Remove token from URL
      url.searchParams.delete('accessToken');
      window.history.replaceState({}, document.title, url.pathname);
      // Fetch user details
      UserService.getUserDetails().then((response) => {
        const userData: User = {
          id: response.user.id,
          name: `${response.user.firstName} ${response.user.lastName}`.trim(),
          email: response.user.email,
          isAdmin: response.user.isAdmin || false, // Check for isAdmin property
        };
        setUser(userData);
        console.log("OAuth Callback - Full UserDetailsResponse:", response);
        
        // Explicitly check for config using ConfigService.getConfigs()
        ConfigService.getConfigs().then((configResponse) => {
          console.log("OAuth Callback - ConfigService.getConfigs response:", configResponse);
          if (configResponse) {
            navigate('/dashboard');
          } else {
            navigate('/credentials');
          }
        }).catch((configError) => {
          console.error("Error fetching config during OAuth callback:", configError);
          navigate('/credentials'); // Fallback to credentials if config fetch fails
        });

        toast({
          title: 'Login successful',
          description: `Welcome, ${userData.name}!`,
        });

      }).catch(() => {
        TokenManager.removeToken();
      });
    }
  }, [navigate, toast]);

  // Email login function
  const loginWithEmail = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await AuthService.signIn({ email, password });
      TokenManager.setToken(response.accessToken);
      // Fetch user details
      const userResponse = await UserService.getUserDetails();
      const userData: User = {
        id: userResponse.user.id,
        name: `${userResponse.user.firstName} ${userResponse.user.lastName}`.trim(),
        email: userResponse.user.email,
        isAdmin: userResponse.user.isAdmin || false, // Check for isAdmin property
      };
      setUser(userData);
      console.log("Email Login - Full UserDetailsResponse:", userResponse);

      // Explicitly check for config using ConfigService.getConfigs()
      try {
        const configResponse = await ConfigService.getConfigs();
        console.log("Email Login - ConfigService.getConfigs response:", configResponse);
        if (configResponse) {
          navigate('/dashboard');
        } else {
          navigate('/credentials');
        }
      } catch (configError) {
        console.error("Error fetching config during email login:", configError);
        navigate('/credentials'); // Fallback to credentials if config fetch fails
      }

      toast({
        title: "Login successful",
        description: `Welcome, ${userData.name}!`,
      });
      setIsLoading(false);
      
      // No longer redirect based on isAdmin here; that's handled by config check above
      // if (userData.isAdmin) {
      //   // If admin, still allow admin page access regardless of config
      //   // This part needs careful consideration based on exact admin flow. For now, keep as is if no config for admin
      //   // If you want admins to always go to admin page, move this condition before config check
      //   // For simplicity, let's assume admin also needs config or goes to credentials for now
      //   // If admin always goes to /admin, this block can be outside the config check
      //   // but within the overall successful login flow.
      //   navigate('/admin'); // Assuming admin always goes to /admin regardless of config for now
      // }

      return true;
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login.",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  // Update user profile
  const updateUserProfile = (data: ProfileUpdateData): boolean => {
    if (!user) return false;
    
    try {
      const updatedUser = { ...user };
      
      if (data.firstName || data.lastName) {
        updatedUser.name = `${data.firstName || user.name.split(' ')[0]} ${data.lastName || user.name.split(' ')[1] || ''}`.trim();
      }
      if (data.email) updatedUser.email = data.email;
      
      setUser(updatedUser);
      
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error updating profile",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    TokenManager.removeToken();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      loginWithEmail,
      logout,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
