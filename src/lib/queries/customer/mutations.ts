import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customerApi } from '@/lib/api/customer/api';
import { customerKeys } from './queries';
import { Customer } from '@/types/customer';
import { queryClient } from '@/lib/config/query';

export const useCreateCustomer = () => {

  return useMutation({
    mutationFn: customerApi.create,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
    },
  });
};

export const useUpdateCustomer = () => {

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Customer> }) =>
      customerApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.all })
    }
  })
}

export const useDeleteCustomer = () => {
  return useMutation({
    mutationFn: customerApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.all })
    }
  })
}

