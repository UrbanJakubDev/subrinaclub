import { useQuery } from '@tanstack/react-query';
import { customerApi } from '@/lib/api/customer/api';
import { Customer } from '@/types/customer';

export const customerKeys = {
  all: ['customers'] as const,
  list: (active: boolean) => [...customerKeys.all, { active }] as const,
  detail: (id: number) => [...customerKeys.all, id] as const,
};

interface CustomerResponse {
  data: Customer[];
  metadata: {
    loadedAt: string;
    timezone: string;
  }
}

export const useCustomers = (active: boolean) => {
  return useQuery<CustomerResponse>({
    queryKey: customerKeys.list(active),
    queryFn: () => customerApi.getAll(active),
    refetchOnMount: true,
    staleTime: 0,
  });
};

export const useCustomer = (id: number) => {
  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: () => customerApi.getById(id),
    enabled: !!id,
  });
};
