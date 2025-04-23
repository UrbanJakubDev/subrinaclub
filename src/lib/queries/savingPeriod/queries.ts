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
}

// Get all saving periods
export const useSavingPeriods = () => {
   return useQuery({
      queryKey: savingPeriodKeys.lists(),
      queryFn: savingPeriodApi.getAll,
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
export const useSavingPeriodsByAccount = (accountId?: number) => {
   return useQuery({
      queryKey: savingPeriodKeys.byAccount(accountId as number),
      queryFn: () => savingPeriodApi.getAllByAccountId(accountId as number),
      enabled: !!accountId,
   })
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