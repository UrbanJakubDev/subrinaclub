import { API_BASE_URL, getHeaders, handleResponse } from '../config';
import {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  ChangePasswordData,
  ResetPasswordData,
  ResetPasswordConfirmData,
  InviteUserData,
  User,
  UserListResponse,
  UsersResponse,
  UpdateUserData,
  AuthTokens,
} from '@/types/auth';

const AUTH_BASE = `${API_BASE_URL}/auth`;

// Token management
export const getStoredTokens = (): AuthTokens | null => {
  if (typeof window === 'undefined') return null;
  
  const accessToken = localStorage.getItem('accessToken');
  const expiresIn = localStorage.getItem('tokenExpiresIn');
  
  if (!accessToken || !expiresIn) return null;
  
  return {
    accessToken,
    refreshToken: '', // API neposkytuje refresh token
    expiresIn: parseInt(expiresIn),
  };
};

export const storeTokens = (tokens: AuthTokens): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('accessToken', tokens.accessToken);
  localStorage.setItem('refreshToken', tokens.refreshToken);
  localStorage.setItem('tokenExpiresIn', tokens.expiresIn.toString());
  localStorage.setItem('tokenIssuedAt', Date.now().toString());
};

export const clearTokens = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('accessToken');
  localStorage.removeItem('tokenExpiresIn');
  localStorage.removeItem('tokenIssuedAt');
  localStorage.removeItem('user');
};

export const isTokenExpired = (): boolean => {
  const tokens = getStoredTokens();
  if (!tokens) return true;
  
  const issuedAt = localStorage.getItem('tokenIssuedAt');
  if (!issuedAt) return true;
  
  const now = Date.now();
  const tokenAge = now - parseInt(issuedAt);
  const expirationTime = tokens.expiresIn * 1000; // Convert to milliseconds
  
  return tokenAge >= expirationTime;
};

export const getAuthHeaders = (): Record<string, string> => {
  const tokens = getStoredTokens();
  const headers: Record<string, string> = getHeaders();
  
  console.log('Stored tokens:', tokens);
  console.log('Token expired:', isTokenExpired());
  
  if (tokens && !isTokenExpired()) {
    headers.Authorization = `Bearer ${tokens.accessToken}`;
    console.log('Authorization header added:', headers.Authorization);
  } else {
    console.log('No valid token found, skipping Authorization header');
  }
  
  return headers;
};

// Authentication endpoints
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await fetch(`${AUTH_BASE}/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(credentials),
  });
  
  const data = await handleResponse<AuthResponse>(response);
  
  // Debug: log the response structure
  console.log('Login response:', data);
  
  // Check if data has the expected structure
  if (!data || !data.access_token) {
    console.error('Invalid response structure:', data);
    throw new Error('Invalid response from server - missing access_token');
  }
  
  // Store the access token directly
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    // Set a default expiration (24 hours from now)
    localStorage.setItem('tokenExpiresIn', (24 * 60 * 60).toString());
    localStorage.setItem('tokenIssuedAt', Date.now().toString());
  }
  
  return data;
};

export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  const response = await fetch(`${AUTH_BASE}/register`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(userData),
  });
  
  const data = await handleResponse<AuthResponse>(response);
  
  // Store the access token directly
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    // Set a default expiration (24 hours from now)
    localStorage.setItem('tokenExpiresIn', (24 * 60 * 60).toString());
    localStorage.setItem('tokenIssuedAt', Date.now().toString());
  }
  
  return data;
};

export const logout = async (): Promise<void> => {
  // API neposkytuje refresh token, takže nemůžeme volat logout endpoint
  // Místo toho pouze vyčistíme lokální storage
  clearTokens();
};

export const refreshToken = async (): Promise<AuthTokens> => {
  // API neposkytuje refresh token mechanismus
  // Uživatel se musí znovu přihlásit
  throw new Error('Refresh token not supported by this API');
};

export const changePassword = async (passwordData: ChangePasswordData): Promise<void> => {
  const response = await fetch(`${AUTH_BASE}/change-password`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(passwordData),
  });
  
  await handleResponse(response);
};

export const requestPasswordReset = async (resetData: ResetPasswordData): Promise<void> => {
  const response = await fetch(`${AUTH_BASE}/forgot-password`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(resetData),
  });
  
  await handleResponse(response);
};

export const resetPassword = async (resetData: ResetPasswordConfirmData): Promise<void> => {
  const response = await fetch(`${AUTH_BASE}/reset-password`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(resetData),
  });
  
  await handleResponse(response);
};

// User management endpoints
export const getCurrentUser = async (): Promise<User> => {
  const response = await fetch(`${AUTH_BASE}/profile`, {
    headers: getAuthHeaders(),
  });
  
  const user = await handleResponse<User>(response);
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
  
  return user;
};

export const updateProfile = async (userData: Partial<UpdateUserData>): Promise<User> => {
  const response = await fetch(`${AUTH_BASE}/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });
  
  const user = await handleResponse<User>(response);
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
  
  return user;
};

// Admin-only endpoints
export const getUsers = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}): Promise<UsersResponse> => {
  const searchParams = new URLSearchParams();
  
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.search) searchParams.append('search', params.search);
  if (params?.role) searchParams.append('role', params.role);
  
  const url = `${API_BASE_URL}/users${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  
  const response = await fetch(url, {
    headers: getAuthHeaders(),
  });
  
  return handleResponse<UsersResponse>(response);
};

export const getUserById = async (userId: number): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    headers: getAuthHeaders(),
  });
  
  return handleResponse<User>(response);
};

export const createUser = async (userData: RegisterData): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });
  
  return handleResponse<User>(response);
};

export const updateUser = async (userId: number, userData: UpdateUserData): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });
  
  return handleResponse<User>(response);
};

export const deleteUser = async (userId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  
  await handleResponse(response);
};

export const inviteUser = async (inviteData: InviteUserData): Promise<void> => {
  const response = await fetch(`${AUTH_BASE}/invite`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(inviteData),
  });
  
  await handleResponse(response);
};

export const activateUser = async (userId: number): Promise<User> => {
  // For toggling user status, we should use the updateUser endpoint
  return updateUser(userId, { isActive: true });
};

export const deactivateUser = async (userId: number): Promise<User> => {
  // For toggling user status, we should use the updateUser endpoint
  return updateUser(userId, { isActive: false });
}; 