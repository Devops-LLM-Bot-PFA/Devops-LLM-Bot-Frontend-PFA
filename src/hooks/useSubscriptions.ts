
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SubscriptionService, Subscription, UserSubscriptionResponse } from '@/services/subscriptionService';
import { useToast } from '@/hooks/use-toast';

export function useSubscriptions() {
  return useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => SubscriptionService.getAllSubscriptions(),
  });
}

export function useSelectSubscription() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (subscriptionId: string) => SubscriptionService.selectSubscription(subscriptionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'details'] });
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast({
        title: "Subscription updated",
        description: "Your subscription has been changed successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Subscription change failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
