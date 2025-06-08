import { transactionApi } from '@/lib/api/transaction/api'
import { Transaction } from '@/types/transaction'
import { ApiResponse } from '@/types/types'
import { useQuery } from '@tanstack/react-query'

export const transactionKeys = {
    all: ['transactions'] as const,
    detail: (id: number) => [...transactionKeys.all, id] as const,
    byAccount: (accountId: number) => [...transactionKeys.all, 'byAccount', accountId] as const,
}

export const useTransactions = () => {
    return useQuery<ApiResponse<Transaction[]>>({
        queryKey: transactionKeys.all,
        queryFn: () => transactionApi.getAll(),
    })
}

export const useTransaction = (id: number) => {
    return useQuery<ApiResponse<Transaction>>({
        queryKey: transactionKeys.detail(id),
        queryFn: () => transactionApi.getById(id),
        enabled: !!id,
    })
}

export const useTransactionsByAccount = (accountId: number) => {
    return useQuery({
        queryKey: transactionKeys.byAccount(accountId),
        queryFn: () => transactionApi.getByAccountId(accountId),
        enabled: !!accountId,
    })
}

