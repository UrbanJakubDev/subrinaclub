import { savingPeriodApi } from "@/lib/api/savingPeriod/api"
import { useQuery } from "@tanstack/react-query"
import { queryClient } from "@/lib/config/query"

// Define the query keys for savingPeriod
export const savingPeriodKeys = {
   all: ['savingPeriods'] as const,
   lists: () => [...savingPeriodKeys.all, 'list'] as const,
   list: (filters: any) => [...savingPeriodKeys.lists(), { filters }] as const,
   details: () => [...savingPeriodKeys.all, 'detail'] as const,
   detail: (id: number) => [...savingPeriodKeys.details(), id] as const,
   byAccount: (accountId: number) => [...savingPeriodKeys.all, 'byAccount', accountId] as const,
   bySavingPeriodId: (savingPeriodId: number) => [...savingPeriodKeys.all, 'bySavingPeriodId', savingPeriodId] as const,
}

// Get all saving periods
export const useSavingPeriods = () => {
   return useQuery({
      queryKey: savingPeriodKeys.lists(),
      queryFn: savingPeriodApi.getAll,
      staleTime: 0,
      refetchOnMount: true,
   })
}

// Get a specific saving period by ID
export const useSavingPeriod = (id?: number) => {
   return useQuery({
      queryKey: savingPeriodKeys.detail(id as number),
      queryFn: () => savingPeriodApi.getById(id as number),
      enabled: !!id,
   })
}

// Get a saving period by account ID
export const useSavingPeriodByAccount = (accountId?: number) => {
   return useQuery({
      queryKey: savingPeriodKeys.byAccount(accountId as number),
      queryFn: () => savingPeriodApi.getByAccountId(accountId as number),
      enabled: !!accountId,
   })
}

// Get all saving periods by account ID
export const useSavingPeriodsByAccount = (accountId: number) => {
   return useQuery({
      queryKey: savingPeriodKeys.byAccount(accountId),
      queryFn: async () => {
         const response = await savingPeriodApi.getAllByAccountId(accountId);
         return response;
      },
      enabled: !!accountId,
      staleTime: 0,
      gcTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
   });
}

// Pre-fetch helper for saving period data
export const prefetchSavingPeriod = async (id: number) => {
   await queryClient.prefetchQuery({
      queryKey: savingPeriodKeys.detail(id),
      queryFn: () => savingPeriodApi.getById(id),
   })
}

// Invalidate all saving period queries
export const invalidateSavingPeriods = async () => {
   await queryClient.invalidateQueries({
      queryKey: savingPeriodKeys.all,
   })
} 

// Get transactions by saving period ID
export const useTransactionsBySavingPeriodId = (savingPeriodId?: number) => {
   return useQuery({
      queryKey: savingPeriodKeys.bySavingPeriodId(savingPeriodId as number),
      queryFn: () => savingPeriodApi.getTransactionsBySavingPeriodId(savingPeriodId as number),
      enabled: !!savingPeriodId,
   })
}