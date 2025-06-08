import { API_BASE_URL, getHeaders } from "../config";
import { ApiResponse } from "@/types/types";
import { handleResponse } from "../config";
import { Account } from "@/types/types";
import { Transaction } from "@/types/transaction";

export const accountApi = {
    getAll: async (): Promise<ApiResponse<Account[]>> => {
        const response = await fetch(`${API_BASE_URL}/accounts`, {
            headers: {
                ...getHeaders(),
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });
        const result = await handleResponse<ApiResponse<Account[]>>(response);
        return result;
    },

    getById: async (id: number): Promise<ApiResponse<Account>> => {
        const response = await fetch(`${API_BASE_URL}/accounts/${id}`, {
            headers: {
                ...getHeaders(),
                'Cache-Control': 'no-cache'
            }
        });
        const result = await handleResponse<ApiResponse<Account>>(response);
        return result;
    },

    getTransactionsByAccountId: async (id: number): Promise<ApiResponse<Transaction[]>> => {
        const response = await fetch(`${API_BASE_URL}/accounts/${id}/transactions`, {
            headers: {
                ...getHeaders(),
                'Cache-Control': 'no-cache'
            }
        });
        const result = await handleResponse<ApiResponse<Transaction[]>>(response);
        return result;
    },

    getByCustomerId: async (customerId: number): Promise<ApiResponse<Account>> => {
        const response = await fetch(`${API_BASE_URL}/accounts/customer/${customerId}`, {
            headers: {
                ...getHeaders(),
                'Cache-Control': 'no-cache'
            }
        });
        const result = await handleResponse<ApiResponse<Account>>(response);
        return result;
    },

    create: async (data: Omit<Account, 'id'>): Promise<Account> => {
        const response = await fetch(`${API_BASE_URL}/accounts`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        const result = await handleResponse<ApiResponse<Account>>(response);
        return result.data;
    },

    update: async (id: number, data: Partial<Account>): Promise<Account> => {
        const response = await fetch(`${API_BASE_URL}/accounts/${id}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        const result = await handleResponse<ApiResponse<Account>>(response);
        return result.data;
    },

    delete: async (id: number): Promise<Account> => {
        const response = await fetch(`${API_BASE_URL}/accounts/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        const result = await handleResponse<ApiResponse<Account>>(response);
        return result.data;
    },

    softDelete: async (id: number): Promise<Account> => {
        const response = await fetch(`${API_BASE_URL}/accounts/${id}/soft-delete`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        const result = await handleResponse<ApiResponse<Account>>(response);
        return result.data;
    }
} 