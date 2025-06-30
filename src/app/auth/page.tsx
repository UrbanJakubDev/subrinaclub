'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';

type AuthMode = 'login' | 'register';

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleAuthSuccess = () => {
    router.push('/');
  };

  const handleSwitchToRegister = () => {
    setMode('register');
  };

  const handleSwitchToLogin = () => {
    setMode('login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo/Brand */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
            Subrina Club
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Správa zákazníků a transakcí
          </p>
        </div>

        {/* Auth Forms */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-4 px-6 text-sm font-medium text-center transition-colors ${
                mode === 'login'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-50 text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Přihlášení
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-4 px-6 text-sm font-medium text-center transition-colors ${
                mode === 'register'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-50 text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Registrace
            </button>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {mode === 'login' ? (
              <LoginForm
                onSuccess={handleAuthSuccess}
                onSwitchToRegister={handleSwitchToRegister}
                onForgotPassword={() => {
                  // TODO: Implement forgot password flow
                  console.log('Forgot password clicked');
                }}
              />
            ) : (
              <RegisterForm
                onSuccess={handleAuthSuccess}
                onSwitchToLogin={handleSwitchToLogin}
                allowedRoles={['CUSTOMER', 'SALES_MANAGER']}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            © 2024 Subrina Club. Všechna práva vyhrazena.
          </p>
        </div>
      </div>
    </div>
  );
} 