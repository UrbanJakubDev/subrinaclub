import { API_BASE_URL, getHeaders } from "../config";
import { ApiResponse } from "@/types/types";
import { handleResponse } from "../config";
import { Transaction } from "@/types/transaction";

export const transactionApi = {
    getAll: async (): Promise<ApiResponse<Transaction[]>> => {
        const response = await fetch(`${API_BASE_URL}/transactions`);
        const result = await handleResponse<ApiResponse<Transaction[]>>(response);
        return result;
    },

    getById: async (id: number): Promise<ApiResponse<Transaction>> => {
        const response = await fetch(`${API_BASE_URL}/transactions/${id}`);
        const result = await handleResponse<ApiResponse<Transaction>>(response);
        return result;
    },

    getByAccountId: async (accountId: number): Promise<ApiResponse<Transaction[]>> => {
        const response = await fetch(`${API_BASE_URL}/transactions?accountId=${accountId}`);
        const result = await handleResponse<ApiResponse<Transaction[]>>(response);
        return result;
    },

    getBySavingPeriodId: async (savingPeriodId: number): Promise<ApiResponse<Transaction[]>> => {
        const response = await fetch(`${API_BASE_URL}/transactions?savingPeriodId=${savingPeriodId}`);
        const result = await handleResponse<ApiResponse<Transaction[]>>(response);
        return result;
    },

    create: async (data: Omit<Transaction, 'id'>): Promise<Transaction> => {
        const response = await fetch(`${API_BASE_URL}/transactions`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        const result = await handleResponse<ApiResponse<Transaction>>(response);
        return result.data;
    },

    update: async (id: number, data: Partial<Transaction>): Promise<Transaction> => {
        const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        const result = await handleResponse<ApiResponse<Transaction>>(response);
        return result.data;
    },

    delete: async (id: number): Promise<Transaction> => {
        const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        const result = await handleResponse<ApiResponse<Transaction>>(response);
        return result.data;
    },

    softDelete: async (id: number): Promise<Transaction> => {
        const response = await fetch(`${API_BASE_URL}/transactions/${id}/soft-delete`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        const result = await handleResponse<ApiResponse<Transaction>>(response);
        return result.data;
    }
} 