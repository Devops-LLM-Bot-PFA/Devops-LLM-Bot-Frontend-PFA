import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ConfigService, ConfigRequest, ConfigUpdateRequest } from '@/services/configService';
import { useToast } from '@/hooks/use-toast';

export function useCreateConfig() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: ConfigRequest) => ConfigService.createConfig(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'configs'] });
      toast({
        title: "Configuration created",
        description: "Your configuration has been saved successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Configuration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateConfig() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ConfigUpdateRequest }) => 
      ConfigService.updateConfig(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'configs'] });
      toast({
        title: "Configuration updated",
        description: "Your configuration has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
