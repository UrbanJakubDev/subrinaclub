import { Customer } from '@/types/customer';
import { API_BASE_URL, getHeaders, handleResponse } from '../config';
import { ApiResponse } from '@/types/types';


export const customerApi = {
  getAll: async (active?: boolean): Promise<ApiResponse<Customer[]>> => {
    const url = `${API_BASE_URL}/customers${active !== undefined ? `?active=${active}` : ''}`;
    const response = await fetch(url, {
      headers: getHeaders(),
    });
    const result = await handleResponse<ApiResponse<Customer[]>>(response);
    return result;
  },

  getById: async (id: number): Promise<ApiResponse<Customer>> => {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      headers: getHeaders(),
    });
    const result = await handleResponse<ApiResponse<Customer>>(response);
    return result;
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

  update: async (id: number, data: Partial<Customer>): Promise<Customer> => {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await handleResponse<ApiResponse<Customer>>(response);
    return result.data;
  },

  delete: async (id: number): Promise<Customer> => {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const result = await handleResponse<ApiResponse<Customer>>(response);
    return result.data;
  },

  softDelete: async (id: number): Promise<Customer> => {
    const response = await fetch(`${API_BASE_URL}/customers/${id}/soft-delete`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const result = await handleResponse<ApiResponse<Customer>>(response);
    return result.data;
  },

  getNextRegistrationNumber: async (): Promise<ApiResponse<number>> => {
    const response = await fetch(`${API_BASE_URL}/customers/next-registration-number`, {
      headers: getHeaders(),
    });
    const result = await handleResponse<ApiResponse<number>>(response);
    return result;
  }
}; 