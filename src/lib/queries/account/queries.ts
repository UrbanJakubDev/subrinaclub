import { accountApi } from "@/lib/api/account/api"
import { Account } from "@/types/types"
import { ApiResponse } from "@/types/types"
import { useQuery } from "@tanstack/react-query"

export const accountKeys = {
    all: ['accounts'] as const,
    detail: (id: number) => [...accountKeys.all, id] as const,
    customer: (customerId: number) => [...accountKeys.all, 'customer', customerId] as const,
}

export const useAccounts = () => {
    return useQuery<ApiResponse<Account[]>>({
        queryKey: accountKeys.all,
        queryFn: () => accountApi.getAll(),
    })
}

export const useAccount = (id: number) => {
    return useQuery<ApiResponse<Account>>({
        queryKey: accountKeys.detail(id),
        queryFn: () => accountApi.getById(id),
        
    })
}

export const useAccountByCustomerId = (customerId: number) => {
    return useQuery<ApiResponse<Account>>({
        queryKey: accountKeys.customer(customerId),
        queryFn: () => accountApi.getByCustomerId(customerId),
        enabled: !!customerId,
    })
} 