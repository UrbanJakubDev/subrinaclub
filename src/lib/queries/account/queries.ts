import { accountApi } from '@/lib/api/account/api'
import { useQuery } from '@tanstack/react-query'

export const accountKeys = {
    all: ['accounts'] as const,
    detail: (id: number) => [...accountKeys.all, id] as const,
    customer: (customerId: number) => [...accountKeys.all, 'customer', customerId] as const,
    transactions: (accountId: number) => [...accountKeys.all, 'transactions', accountId] as const,
}

export const useAccounts = () => {
    return useQuery({
        queryKey: accountKeys.all,
        queryFn: () => accountApi.getAll(),
        staleTime: 60000, // 1 minute
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
    })
}

export const useAccount = (id: number) => {
    return useQuery({
        queryKey: accountKeys.detail(id),
        queryFn: () => accountApi.getById(id),
        enabled: !!id,
        retry: 1,
        refetchOnWindowFocus: false,
    })
}

export const useAccountByCustomerId = (customerId: number) => {
    return useQuery({
        queryKey: accountKeys.customer(customerId),
        queryFn: () => accountApi.getByCustomerId(customerId),
        enabled: !!customerId,
        retry: 1,
        refetchOnWindowFocus: false,
    })
}

export const useTransactionsByAccount = (accountId: number) => {
    return useQuery({
        queryKey: accountKeys.transactions(accountId),
        queryFn: () => accountApi.getTransactionsByAccountId(accountId),
        enabled: !!accountId,
        retry: 1,
        refetchOnWindowFocus: false,
    })
}