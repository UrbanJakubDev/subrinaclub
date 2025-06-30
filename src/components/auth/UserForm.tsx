'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { User, UserRole } from '@/types/auth';
import { X, User as UserIcon, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  role: UserRole;
  isActive: boolean;
}

interface UserFormProps {
  user?: User | null;
  onSubmit: (data: UserFormData) => Promise<void>;
  onClose: () => void;
}

const createUserSchema = yup.object({
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
    .when('$isEdit', {
      is: false,
      then: (schema) => schema
        .min(8, 'Heslo musí mít alespoň 8 znaků')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          'Heslo musí obsahovat alespoň jedno malé písmeno, jedno velké písmeno a číslici'
        )
        .required('Heslo je povinné'),
      otherwise: (schema) => schema.optional(),
    }),
  confirmPassword: yup
    .string()
    .when('password', {
      is: (password: string) => password && password.length > 0,
      then: (schema) => schema
        .oneOf([yup.ref('password')], 'Hesla se neshodují')
        .required('Potvrzení hesla je povinné'),
      otherwise: (schema) => schema.optional(),
    }),
  role: yup
    .string()
    .oneOf(['ADMIN', 'SALES_MANAGER', 'CUSTOMER', 'GUEST'], 'Vyberte platnou roli')
    .required('Role je povinná'),
  isActive: yup.boolean().required(),
}).required();

export const UserForm: React.FC<UserFormProps> = ({
  user,
  onSubmit,
  onClose,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = !!user;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<UserFormData>({
    resolver: yupResolver(createUserSchema),
    context: { isEdit },
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      role: user?.role || 'CUSTOMER',
      isActive: user?.isActive ?? true,
    },
  });

  const handleFormSubmit = async (data: UserFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } catch (error: any) {
      if (error.message) {
        setError('root', {
          type: 'manual',
          message: error.message,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleLabel = (role: UserRole) => {
    const roleLabels: Record<UserRole, string> = {
      ADMIN: 'Administrátor',
      SALES_MANAGER: 'Sales Manager',
      CUSTOMER: 'Zákazník',
      GUEST: 'Host',
    };
    return roleLabels[role];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? 'Upravit uživatele' : 'Nový uživatel'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
          {errors.root && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-800">
                {errors.root.message}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                Jméno
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
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
                  <UserIcon className="h-5 w-5 text-gray-400" />
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
              <option value="ADMIN">{getRoleLabel('ADMIN')}</option>
              <option value="SALES_MANAGER">{getRoleLabel('SALES_MANAGER')}</option>
              <option value="CUSTOMER">{getRoleLabel('CUSTOMER')}</option>
              <option value="GUEST">{getRoleLabel('GUEST')}</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">
                {errors.role.message}
              </p>
            )}
          </div>

          {!isEdit && (
            <>
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
            </>
          )}

          <div className="flex items-center">
            <input
              {...register('isActive')}
              type="checkbox"
              id="isActive"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Aktivní účet
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Zrušit
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEdit ? 'Ukládání...' : 'Vytváření...'}
                </div>
              ) : (
                isEdit ? 'Uložit změny' : 'Vytvořit uživatele'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 