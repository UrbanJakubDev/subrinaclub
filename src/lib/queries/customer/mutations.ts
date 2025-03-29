import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customerApi } from '@/lib/api/customer/api';
import { customerKeys } from './queries';

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: customerApi.create,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
    },
  });
};

// Add other mutations as needed 