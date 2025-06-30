'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';
import LoadingSpinner from '@/components/ui/loadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: UserRole[];
  permissions?: Array<{ resource: string; action: string }>;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  roles,
  permissions,
  redirectTo = '/login',
  fallback,
}) => {
  const { user, isLoading, isAuthenticated, hasRole, hasPermission } = useAuth();
  const router = useRouter();

  // Use useEffect for navigation to avoid setState during render
  useEffect(() => {
    if (!isLoading) {
      // Redirect to login if not authenticated
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      // Check role-based access
      if (roles && roles.length > 0) {
        if (!hasRole(roles)) {
          router.push(redirectTo);
          return;
        }
      }

      // Check permission-based access
      if (permissions && permissions.length > 0) {
        const hasAllPermissions = permissions.every(({ resource, action }) =>
          hasPermission(resource, action)
        );

        if (!hasAllPermissions) {
          router.push(redirectTo);
          return;
        }
      }
    }
  }, [isLoading, isAuthenticated, user, roles, permissions, hasRole, hasPermission, router, redirectTo]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Show fallback or access denied message while redirecting
  if (!isAuthenticated) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Přihlášení vyžadováno
          </h2>
          <p className="text-gray-500">
            Pro přístup k této stránce se musíte přihlásit.
          </p>
        </div>
      </div>
    );
  }

  // Check role-based access
  if (roles && roles.length > 0) {
    if (!hasRole(roles)) {
      return fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Nedostatečná oprávnění
            </h2>
            <p className="text-gray-500">
              Nemáte oprávnění pro přístup k této stránce.
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Požadované role: {roles.join(', ')}
            </p>
          </div>
        </div>
      );
    }
  }

  // Check permission-based access
  if (permissions && permissions.length > 0) {
    const hasAllPermissions = permissions.every(({ resource, action }) =>
      hasPermission(resource, action)
    );

    if (!hasAllPermissions) {
      return fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Nedostatečná oprávnění
            </h2>
            <p className="text-gray-500">
              Nemáte oprávnění pro přístup k této stránce.
            </p>
          </div>
        </div>
      );
    }
  }

  // User is authenticated and has required permissions
  return <>{children}</>;
};

// Higher-order component for protecting pages
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<ProtectedRouteProps, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ProtectedRoute {...options}>
      <Component {...props} />
    </ProtectedRoute>
  );

  WrappedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Hook for conditional rendering based on permissions
export const usePermission = () => {
  const { hasRole, hasPermission } = useAuth();

  return {
    hasRole,
    hasPermission,
    can: (resource: string, action: string) => hasPermission(resource, action),
    isAdmin: () => hasRole('ADMIN'),
    isSalesManager: () => hasRole('SALES_MANAGER'),
    isCustomer: () => hasRole('CUSTOMER'),
    isGuest: () => hasRole('GUEST'),
  };
}; 