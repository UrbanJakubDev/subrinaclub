import { Customer } from '@/types/customer';
import { API_BASE_URL, getHeaders, handleResponse } from '../config';

// Add this interface for the API response structure
interface ApiResponse<T> {
  data: T;
  metadata: {
    loadedAt: string;
    timezone: string;
  }
}

export const customerApi = {
  getAll: async (active?: boolean): Promise<Customer[]> => {
    const url = `${API_BASE_URL}/customers${active !== undefined ? `?active=${active}` : ''}`;
    const response = await fetch(url, {
      headers: getHeaders(),
    });
    const result = await handleResponse<ApiResponse<Customer[]>>(response);
    return result // Return just the data part to maintain compatibility
  },

  getById: async (id: number): Promise<Customer> => {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      headers: getHeaders(),
    });
    const result = await handleResponse<ApiResponse<Customer>>(response);
    return result.data;
  },

  create: async (data: Omit<Customer, 'id'>): Promise<Customer> => {
    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await handleResponse<ApiResponse<Customer>>(response);
    return result.data;
  },

  // Add other methods as needed
}; 