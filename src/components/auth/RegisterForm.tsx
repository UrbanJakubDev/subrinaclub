'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRegister } from '@/lib/queries/auth/mutations';
import { RegisterData, UserRole } from '@/types/auth';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react';

const registerSchema = yup.object({
  firstName: yup
    .string()
    .min(2, 'Jméno musí mít alespoň 2 znaky')
    .required('Jméno je povinné'),
  lastName: yup
    .string()
    .min(2, 'Příjmení musí mít alespoň 2 znaky')
    .required('Příjmení je povinné'),
  email: yup
    .string()
    .email('Zadejte platnou emailovou adresu')
    .required('Email je povinný'),
  password: yup
    .string()
    .min(8, 'Heslo musí mít alespoň 8 znaků')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Heslo musí obsahovat alespoň jedno malé písmeno, jedno velké písmeno a číslici'
    )
    .required('Heslo je povinné'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Hesla se neshodují')
    .required('Potvrzení hesla je povinné'),
  role: yup
    .string()
    .oneOf(['CUSTOMER', 'SALES_MANAGER'], 'Vyberte platnou roli')
    .required('Role je povinná'),
}).required();

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
  allowedRoles?: UserRole[];
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onSwitchToLogin,
  allowedRoles = ['CUSTOMER', 'SALES_MANAGER'],
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch,
  } = useForm<RegisterData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      role: 'CUSTOMER',
    },
  });

  const onSubmit = async (data: RegisterData) => {
    try {
      await registerMutation.mutateAsync(data);
      onSuccess?.();
    } catch (error: any) {
      if (error.message) {
        setError('root', {
          type: 'manual',
          message: error.message,
        });
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Registrace
          </h2>
          <p className="text-gray-600">
            Vytvořte si nový účet
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {errors.root && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-800">
                    {errors.root.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                Jméno
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('firstName')}
                  type="text"
                  id="firstName"
                  className={`block w-full pl-10 pr-3 py-3 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.firstName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Jan"
                />
              </div>
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Příjmení
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('lastName')}
                  type="text"
                  id="lastName"
                  className={`block w-full pl-10 pr-3 py-3 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.lastName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Novák"
                />
              </div>
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('email')}
                type="email"
                id="email"
                className={`block w-full pl-10 pr-3 py-3 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="vas@email.cz"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              {...register('role')}
              id="role"
              className={`block w-full px-3 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.role ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              {allowedRoles.includes('CUSTOMER') && (
                <option value="CUSTOMER">Zákazník</option>
              )}
              {allowedRoles.includes('SALES_MANAGER') && (
                <option value="SALES_MANAGER">Sales Manager</option>
              )}
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">
                {errors.role.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Heslo
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                id="password"
                className={`block w-full pl-10 pr-12 py-3 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Potvrzení hesla
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                className={`block w-full pl-10 pr-12 py-3 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || registerMutation.isPending}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting || registerMutation.isPending ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Registrace...
              </div>
            ) : (
              'Registrovat se'
            )}
          </button>
        </form>

        {onSwitchToLogin && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Již máte účet?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Přihlásit se
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}; 