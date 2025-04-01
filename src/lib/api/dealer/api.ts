import { API_BASE_URL, getHeaders } from "../config";
import { ApiResponse } from "@/types/types";
import { handleResponse } from "../config";
import { Dealer } from "@/types/dealer";

export const dealerApi = {
    getAll: async (): Promise<ApiResponse<Dealer[]>> => {
        const response = await fetch(`${API_BASE_URL}/dealers`);
        const result = await handleResponse<ApiResponse<Dealer[]>>(response);
        return result;
    },

    getById: async (id: number): Promise<ApiResponse<Dealer>> => {
        const response = await fetch(`${API_BASE_URL}/dealers/${id}`);
        const result = await handleResponse<ApiResponse<Dealer>>(response);
        return result;
    },

    create: async (data: Omit<Dealer, 'id'>): Promise<Dealer> => {
        const response = await fetch(`${API_BASE_URL}/dealers`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        const result = await handleResponse<ApiResponse<Dealer>>(response);
        return result.data;
    },

    update: async (id: number, data: Partial<Dealer>): Promise<Dealer> => {
        const response = await fetch(`${API_BASE_URL}/dealers/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        const result = await handleResponse<ApiResponse<Dealer>>(response);
        return result.data;
    },

    delete: async (id: number): Promise<Dealer> => {
        const response = await fetch(`${API_BASE_URL}/dealers/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        const result = await handleResponse<ApiResponse<Dealer>>(response);
        return result.data;
    },

    softDelete: async (id: number): Promise<Dealer> => {
        const response = await fetch(`${API_BASE_URL}/dealers/${id}/soft-delete`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        const result = await handleResponse<ApiResponse<Dealer>>(response);
        return result.data;
    },

    getForSelect: async (): Promise<ApiResponse<Dealer[]>> => {
        const response = await fetch(`${API_BASE_URL}/dealers/for-select`);
        const result = await handleResponse<ApiResponse<Dealer[]>>(response);
        return result;
    }
}
