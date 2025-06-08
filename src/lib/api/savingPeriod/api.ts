import { API_BASE_URL, getHeaders } from '../config'
import { ApiResponse } from '@/types/types'
import { handleResponse } from '../config'
import { SavingPeriod } from '@/types/types'
import { Transaction } from '@/types/transaction'

export const savingPeriodApi = {
    getAll: async (): Promise<ApiResponse<SavingPeriod[]>> => {
        const response = await fetch(`${API_BASE_URL}/saving-periods`)
        const result = await handleResponse<ApiResponse<SavingPeriod[]>>(response)
        return result
    },

    getById: async (id: number): Promise<ApiResponse<SavingPeriod>> => {
        const response = await fetch(`${API_BASE_URL}/saving-periods/${id}`)
        const result = await handleResponse<ApiResponse<SavingPeriod>>(response)
        return result
    },

    getTransactionsBySavingPeriodId: async (id: number): Promise<ApiResponse<Transaction[]>> => {
        const response = await fetch(`${API_BASE_URL}/saving-periods/${id}/transactions`)
        const result = await handleResponse<ApiResponse<Transaction[]>>(response)
        return result
    },

    getByAccountId: async (accountId: number): Promise<ApiResponse<SavingPeriod>> => {
        const response = await fetch(`${API_BASE_URL}/saving-periods?accountId=${accountId}&active=true`)
        const result = await handleResponse<ApiResponse<SavingPeriod>>(response)
        return result
    },

    getAllByAccountId: async (accountId: number): Promise<ApiResponse<SavingPeriod[]>> => {
        const response = await fetch(`${API_BASE_URL}/saving-periods?accountId=${accountId}`)
        const result = await handleResponse<ApiResponse<SavingPeriod[]>>(response)
        return result
    },

 

    create: async (data: Omit<SavingPeriod, 'id'>): Promise<SavingPeriod> => {
        const response = await fetch(`${API_BASE_URL}/saving-periods`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        })
        const result = await handleResponse<ApiResponse<SavingPeriod>>(response)
        return result.data
    },

    update: async (id: number, data: Partial<SavingPeriod>): Promise<SavingPeriod> => {
        const response = await fetch(`${API_BASE_URL}/saving-periods/${id}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify(data),
        })
        const result = await handleResponse<ApiResponse<SavingPeriod>>(response)
        return result.data
    },

    delete: async (id: number): Promise<SavingPeriod> => {
        const response = await fetch(`${API_BASE_URL}/saving-periods/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        })
        const result = await handleResponse<ApiResponse<SavingPeriod>>(response)
        return result.data
    },

    softDelete: async (id: number): Promise<SavingPeriod> => {
        const response = await fetch(`${API_BASE_URL}/saving-periods/${id}/soft-delete`, {
            method: 'PATCH',
            headers: getHeaders(),
        })
        const result = await handleResponse<ApiResponse<SavingPeriod>>(response)
        return result.data
    },

    closePeriod: async (
        id: number,
        data: { createNewPeriod: boolean; startYear?: number; startQuarter?: number },
    ): Promise<SavingPeriod> => {
        const response = await fetch(`${API_BASE_URL}/saving-periods/${id}/close`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        })
        const result = await handleResponse<ApiResponse<SavingPeriod>>(response)
        return result.data
    },
}
