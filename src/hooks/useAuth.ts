
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthService, SignUpRequest, SignInRequest, ChangePasswordRequest } from '@/services/authService';
import { TokenManager } from '@/config/api';
import { useToast } from '@/hooks/use-toast';

export function useSignUp() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: SignUpRequest) => AuthService.signUp(data),
    onSuccess: (response) => {
      if (response.accessToken) {
        TokenManager.setToken(response.accessToken);
        queryClient.resetQueries();
      }
      toast({
        title: "Account created",
        description: "Welcome to DevOpsWizard!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useSignIn() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: SignInRequest) => AuthService.signIn(data),
    onSuccess: (response) => {
      if (response.accessToken) {
        TokenManager.setToken(response.accessToken);
        queryClient.resetQueries();
      }
      toast({
        title: "Welcome back",
        description: "You have been successfully logged in.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useChangePassword() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => AuthService.changePassword(data),
    onSuccess: () => {
      toast({
        title: "Password changed",
        description: "Your password has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Password change failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
