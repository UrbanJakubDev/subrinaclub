import { useQuery } from '@tanstack/react-query';
import { customerApi } from '@/lib/api/customer/api';
import { Customer } from '@/types/customer';
import { ApiResponse } from '@/types/types';



export const customerKeys = {
  all: ['customers'] as const,
  list: (active: boolean) => [...customerKeys.all, { active }] as const,
  detail: (id: number) => [...customerKeys.all, id] as const,
  nextRegistrationNumber: () => [...customerKeys.all, 'nextRegistrationNumber'] as const,
};

export const useCustomers = (active: boolean) => {
  return useQuery<ApiResponse<Customer[]>>({
    queryKey: customerKeys.list(active),
    queryFn: () => customerApi.getAll(active),
    refetchOnMount: true,
    staleTime: 0,
  });
};

export const useCustomer = (id: number) => {
  return useQuery<ApiResponse<Customer>>({
    queryKey: ['customer', id],
    queryFn: () => customerApi.getById(id),
    enabled: !!id,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useNextRegistrationNumber = () => {
  return useQuery<ApiResponse<number>>({
    queryKey: customerKeys.nextRegistrationNumber(),
    queryFn: () => customerApi.getNextRegistrationNumber(),
    staleTime: 0, // Always fresh data when requested
    refetchOnMount: true,
  });
};
