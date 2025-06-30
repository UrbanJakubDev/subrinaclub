'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole } from '@/types/auth';
import { useCurrentUser, useIsAuthenticated } from '@/lib/queries/auth/queries';
import { useLogout } from '@/lib/queries/auth/mutations';
import { getStoredTokens, clearTokens } from '@/lib/api/auth/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  hasPermission: (resource: string, action: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Role-based permissions configuration
const ROLE_PERMISSIONS: Record<UserRole, Array<{ resource: string; action: string }>> = {
  ADMIN: [
    { resource: 'users', action: 'read' },
    { resource: 'users', action: 'create' },
    { resource: 'users', action: 'update' },
    { resource: 'users', action: 'delete' },
    { resource: 'customers', action: 'read' },
    { resource: 'customers', action: 'create' },
    { resource: 'customers', action: 'update' },
    { resource: 'customers', action: 'delete' },
    { resource: 'transactions', action: 'read' },
    { resource: 'transactions', action: 'create' },
    { resource: 'transactions', action: 'update' },
    { resource: 'transactions', action: 'delete' },
    { resource: 'reports', action: 'read' },
    { resource: 'accounts', action: 'read' },
    { resource: 'accounts', action: 'create' },
    { resource: 'accounts', action: 'update' },
    { resource: 'accounts', action: 'delete' },
    { resource: 'sales-managers', action: 'read' },
    { resource: 'sales-managers', action: 'create' },
    { resource: 'sales-managers', action: 'update' },
    { resource: 'sales-managers', action: 'delete' },
    { resource: 'dealers', action: 'read' },
    { resource: 'dealers', action: 'create' },
    { resource: 'dealers', action: 'update' },
    { resource: 'dealers', action: 'delete' },
    { resource: 'bonuses', action: 'read' },
    { resource: 'bonuses', action: 'create' },
    { resource: 'bonuses', action: 'update' },
    { resource: 'bonuses', action: 'delete' },
  ],
  SALES_MANAGER: [
    { resource: 'customers', action: 'read' },
    { resource: 'customers', action: 'create' },
    { resource: 'customers', action: 'update' },
    { resource: 'transactions', action: 'read' },
    { resource: 'transactions', action: 'create' },
    { resource: 'transactions', action: 'update' },
    { resource: 'accounts', action: 'read' },
    { resource: 'accounts', action: 'update' },
    { resource: 'reports', action: 'read' },
    { resource: 'bonuses', action: 'read' },
  ],
  CUSTOMER: [
    { resource: 'profile', action: 'read' },
    { resource: 'profile', action: 'update' },
    { resource: 'transactions', action: 'read' },
    { resource: 'accounts', action: 'read' },
  ],
  GUEST: [
    { resource: 'profile', action: 'read' },
  ],
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { data: user, isLoading, error } = useCurrentUser();
  const { isAuthenticated } = useIsAuthenticated();
  const logoutMutation = useLogout();

  useEffect(() => {
    // Check if we have stored tokens on mount
    const tokens = getStoredTokens();
    if (!tokens) {
      clearTokens();
    }
    setIsInitialized(true);
  }, []);

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error('Logout failed:', error);
      // Clear tokens anyway
      clearTokens();
    }
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  const hasPermission = (resource: string, action: string): boolean => {
    if (!user) return false;
    
    const userPermissions = ROLE_PERMISSIONS[user.role] || [];
    return userPermissions.some(
      permission => permission.resource === resource && permission.action === action
    );
  };

  const value: AuthContextType = {
    user: user || null,
    isLoading: isLoading || !isInitialized,
    isAuthenticated,
    logout,
    hasRole,
    hasPermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 