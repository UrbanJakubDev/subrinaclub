import { salesManagerApi } from '@/lib/api/salesManager/api'
import { Customer } from '@/types/customer'
import { SalesManager } from '@/types/salesmanager'
import { Transaction } from '@/types/transaction'
import { ApiResponse } from '@/types/types'
import { useQuery } from '@tanstack/react-query'

export const salesManagerKeys = {
    all: ['salesManagers'] as const,
    list: (active: boolean) => [...salesManagerKeys.all, { active }] as const,
    detail: (id: number) => [...salesManagerKeys.all, id] as const,
    transactions: (salesManagerId: number, year: number) =>
        [...salesManagerKeys.all, 'transactions', salesManagerId, year] as const,
    customers: (salesManagerId: number, year: number) =>
        [...salesManagerKeys.all, 'customers', salesManagerId, year] as const,
    customersCountsInfo: (salesManagerId: number, year: number) =>
        [...salesManagerKeys.all, 'customers', salesManagerId, year, 'countsInfo'] as const,
}

export const useSalesManagers = (active: boolean) => {
    return useQuery<ApiResponse<SalesManager[]>>({
        queryKey: salesManagerKeys.list(active),
        queryFn: () => salesManagerApi.getAll(active),
    })
}

export const useSalesManager = (id: number) => {
    return useQuery<ApiResponse<SalesManager>>({
        queryKey: salesManagerKeys.detail(id),
        queryFn: () => salesManagerApi.getById(id),
        enabled: !!id,
    })
}

export const useSalesManagersForSelect = () => {
    return useQuery<ApiResponse<SalesManager[]>>({
        queryKey: salesManagerKeys.all,
        queryFn: () => salesManagerApi.getForSelect(),
    })
}

export const useSalesManagerTransactions = (salesManagerId: number, year: number) => {
    return useQuery<ApiResponse<Transaction[]>>({
        queryKey: salesManagerKeys.transactions(salesManagerId, year),
        queryFn: () => salesManagerApi.getTransactions(salesManagerId, year),
        enabled: !!salesManagerId && !!year,
    })
}

export const useSalesManagerCustomers = (salesManagerId: number, year: number) => {
    return useQuery<ApiResponse<Customer[]>>({
        queryKey: salesManagerKeys.customers(salesManagerId, year),
        queryFn: () => salesManagerApi.getCustomers(salesManagerId, year),
    })
}

export const useSalesManagerCustomersCountsInfo = (salesManagerId: number, year: number) => {
    return useQuery<ApiResponse<Customer[]>>({
        queryKey: salesManagerKeys.customersCountsInfo(salesManagerId, year),
        queryFn: () => salesManagerApi.getCustomersCountsInfo(salesManagerId, year),
    })
}
