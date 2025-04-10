import { transactionApi } from "@/lib/api/transaction/api"
import { Transaction } from "@/types/transaction"
import { ApiResponse } from "@/types/types"
import { useQuery } from "@tanstack/react-query"

export const transactionKeys = {
    all: ['transactions'] as const,
    detail: (id: number) => [...transactionKeys.all, id] as const,
    account: (accountId: number) => [...transactionKeys.all, 'account', accountId] as const,
    savingPeriod: (savingPeriodId: number) => [...transactionKeys.all, 'savingPeriod', savingPeriodId] as const,
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
    return useQuery<ApiResponse<Transaction[]>>({
        queryKey: transactionKeys.account(accountId),
        queryFn: () => transactionApi.getByAccountId(accountId),
        enabled: !!accountId,
    })
}

export const useTransactionsBySavingPeriodId = (savingPeriodId: number) => {
    return useQuery<ApiResponse<Transaction[]>>({
        queryKey: transactionKeys.savingPeriod(savingPeriodId),
        queryFn: () => transactionApi.getBySavingPeriodId(savingPeriodId),
        enabled: !!savingPeriodId,
    })
} 