import { API_BASE_URL, getHeaders } from '../config'
import { ApiResponse } from '@/types/types'
import { handleResponse } from '../config'
import { SalesManager } from '@/types/salesmanager'
import { Transaction } from '@/types/transaction'
import { Customer } from '@/types/customer'

export const salesManagerApi = {
    getAll: async (active: boolean): Promise<ApiResponse<SalesManager[]>> => {
        const response = await fetch(`${API_BASE_URL}/sales-managers?active=${active}`)
        const result = await handleResponse<ApiResponse<SalesManager[]>>(response)
        return result
    },

    getById: async (id: number): Promise<ApiResponse<SalesManager>> => {
        const response = await fetch(`${API_BASE_URL}/sales-managers/${id}`)
        const result = await handleResponse<ApiResponse<SalesManager>>(response)
        return result
    },

    create: async (data: Omit<SalesManager, 'id'>): Promise<SalesManager> => {
        const response = await fetch(`${API_BASE_URL}/sales-managers`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        })
        const result = await handleResponse<ApiResponse<SalesManager>>(response)
        return result.data
    },

    update: async (id: number, data: Partial<SalesManager>): Promise<SalesManager> => {
        const response = await fetch(`${API_BASE_URL}/sales-managers/${id}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify(data),
        })
        const result = await handleResponse<ApiResponse<SalesManager>>(response)
        return result.data
    },

    delete: async (id: number): Promise<SalesManager> => {
        const response = await fetch(`${API_BASE_URL}/sales-managers/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        })
        const result = await handleResponse<ApiResponse<SalesManager>>(response)
        return result.data
    },

    softDelete: async (id: number): Promise<SalesManager> => {
        const response = await fetch(`${API_BASE_URL}/sales-managers/${id}/soft-delete`, {
            method: 'DELETE',
            headers: getHeaders(),
        })
        const result = await handleResponse<ApiResponse<SalesManager>>(response)
        return result.data
    },

    getForSelect: async (): Promise<ApiResponse<SalesManager[]>> => {
        const response = await fetch(`${API_BASE_URL}/sales-managers/for-select`)
        const result = await handleResponse<ApiResponse<SalesManager[]>>(response)
        return result
    },

    getTransactions: async (
        salesManagerId: number,
        year: number,
    ): Promise<ApiResponse<Transaction[]>> => {
        const response = await fetch(
            `${API_BASE_URL}/sales-managers/${salesManagerId}/transactions?year=${year}`,
        )
        const result = await handleResponse<ApiResponse<Transaction[]>>(response)
        return result
    },

    getCustomers: async (
        salesManagerId: number,
        year: number,
    ): Promise<ApiResponse<Customer[]>> => {
        const response = await fetch(
            `${API_BASE_URL}/sales-managers/${salesManagerId}/customers?year=${year}`,
        )
        const result = await handleResponse<ApiResponse<Customer[]>>(response)
        return result
    },

    getCustomersCountsInfo: async (
        salesManagerId: number,
        year: number,
    ): Promise<ApiResponse<Customer[]>> => {
        const response = await fetch(
            `${API_BASE_URL}/sales-managers/${salesManagerId}/customers/info?year=${year}`,
        )
        const result = await handleResponse<ApiResponse<Customer[]>>(response)
        return result
    },
}
