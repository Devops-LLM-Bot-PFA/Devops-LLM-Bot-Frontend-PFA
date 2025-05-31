
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { InstanceService, CreateInstanceRequest, InstancesListResponse, Instance } from '@/services/instanceService';
import { useToast } from '@/hooks/use-toast';

export function useInstances() {
  return useQuery({
    queryKey: ['instances'],
    queryFn: () => InstanceService.getAllInstances(),
  });
}

export function useCreateInstance() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: CreateInstanceRequest) => InstanceService.createInstance(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instances'] });
      toast({
        title: "Instance created!",
        description: "Your new instance is live.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Creation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteInstance() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (instanceId: string) => InstanceService.deleteInstance(instanceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instances'] });
      toast({
        title: "Instance deleted",
        description: "The instance has been successfully deleted.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Deletion failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
