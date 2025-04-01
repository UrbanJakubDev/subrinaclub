import { API_BASE_URL, getHeaders } from "../config";
import { ApiResponse } from "@/types/types";
import { handleResponse } from "../config";
import { Bonus } from "@/types/bonus";

export const bonusApi = {
    getAll: async (): Promise<ApiResponse<Bonus[]>> => {
        const response = await fetch(`${API_BASE_URL}/bonuses`);
        const result = await handleResponse<ApiResponse<Bonus[]>>(response);
        return result;
    },

    getById: async (id: number): Promise<ApiResponse<Bonus>> => {
        const response = await fetch(`${API_BASE_URL}/bonuses/${id}`);
        const result = await handleResponse<ApiResponse<Bonus>>(response);
        return result;
    },

    getActive: async (): Promise<ApiResponse<Bonus[]>> => {
        const response = await fetch(`${API_BASE_URL}/bonuses/active`);
        const result = await handleResponse<ApiResponse<Bonus[]>>(response);
        return result;
    },

    create: async (data: Omit<Bonus, 'id'>): Promise<Bonus> => {
        const response = await fetch(`${API_BASE_URL}/bonuses`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        const result = await handleResponse<ApiResponse<Bonus>>(response);
        return result.data;
    },

    update: async (id: number, data: Partial<Bonus>): Promise<Bonus> => {
        const response = await fetch(`${API_BASE_URL}/bonuses/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        const result = await handleResponse<ApiResponse<Bonus>>(response);
        return result.data;
    },

    delete: async (id: number): Promise<Bonus> => {
        const response = await fetch(`${API_BASE_URL}/bonuses/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        const result = await handleResponse<ApiResponse<Bonus>>(response);
        return result.data;
    },

    softDelete: async (id: number): Promise<Bonus> => {
        const response = await fetch(`${API_BASE_URL}/bonuses/${id}/soft-delete`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        const result = await handleResponse<ApiResponse<Bonus>>(response);
        return result.data;
    },

    getForSelect: async (): Promise<ApiResponse<Bonus[]>> => {
        const response = await fetch(`${API_BASE_URL}/bonuses/for-select`);
        const result = await handleResponse<ApiResponse<Bonus[]>>(response);
        return result;
    }
} 