import { useQuery } from '@tanstack/react-query';
import { getCurrentUser, getUsers, getUserById } from '@/lib/api/auth/api';
import { getStoredTokens, isTokenExpired } from '@/lib/api/auth/api';
import { User } from '@/types/auth';

// Helper function to get user from localStorage
const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing stored user:', error);
    return null;
  }
};

// Get current user query
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser,
    enabled: !!getStoredTokens() && !isTokenExpired(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401/403 errors
      if (error?.statusCode === 401 || error?.statusCode === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

// Get users list (admin only)
export const useUsers = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => getUsers(params),
    enabled: !!getStoredTokens() && !isTokenExpired(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error: any) => {
      if (error?.statusCode === 401 || error?.statusCode === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

// Get specific user by ID
export const useUser = (userId: number) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId && !!getStoredTokens() && !isTokenExpired(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      if (error?.statusCode === 401 || error?.statusCode === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

// Check if user is authenticated
export const useIsAuthenticated = () => {
  const { data: user, isLoading, error } = useCurrentUser();
  
  return {
    isAuthenticated: !!user && !error,
    isLoading,
    user,
  };
};

// Get user role
export const useUserRole = () => {
  const { data: user } = useCurrentUser();
  
  return {
    role: user?.role || null,
    isAdmin: user?.role === 'ADMIN',
    isSalesManager: user?.role === 'SALES_MANAGER',
    isCustomer: user?.role === 'CUSTOMER',
    isGuest: user?.role === 'GUEST',
  };
}; 