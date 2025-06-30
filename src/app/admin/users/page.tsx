'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useUsers } from '@/lib/queries/auth/queries';
import { useCreateUser, useUpdateUser, useDeleteUser, useActivateUser, useDeactivateUser } from '@/lib/queries/auth/mutations';
import { User, UserRole } from '@/types/auth';
import { Plus, Search, Edit, Trash2, UserCheck, UserX, Eye } from 'lucide-react';
import { UserForm } from '@/components/auth/UserForm';


export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  const { data: usersData, isLoading, error } = useUsers({
    page: currentPage,
    limit: 10,
    search: searchTerm || undefined,
    role: selectedRole || undefined,
  });

  // Debug: log the actual response structure
  console.log('Users API response:', usersData);

  // Helper function to get users array from response
  const getUsersArray = () => {
    if (!usersData) return [];
    if (Array.isArray(usersData)) return usersData;
    if (usersData.users && Array.isArray(usersData.users)) return usersData.users;
    return [];
  };

  const users = getUsersArray();

  // Helper function to get total count
  const getTotalCount = () => {
    if (!usersData) return 0;
    if (Array.isArray(usersData)) return usersData.length;
    if (usersData.total !== undefined) return usersData.total;
    return users.length;
  };

  const totalCount = getTotalCount();

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const activateUserMutation = useActivateUser();
  const deactivateUserMutation = useDeactivateUser();

  const handleCreateUser = async (userData: any) => {
    try {
      await createUserMutation.mutateAsync(userData);
      setShowUserForm(false);
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  const handleUpdateUser = async (userData: any) => {
    if (!editingUser) return;
    
    try {
      await updateUserMutation.mutateAsync({
        userId: editingUser.id,
        userData,
      });
      setShowUserForm(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Opravdu chcete smazat tohoto uživatele?')) {
      try {
        await deleteUserMutation.mutateAsync(userId);
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const handleToggleUserStatus = async (user: User) => {
    try {
      if (user.isActive) {
        await deactivateUserMutation.mutateAsync(user.id);
      } else {
        await activateUserMutation.mutateAsync(user.id);
      }
    } catch (error) {
      console.error('Failed to toggle user status:', error);
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

  const getStatusBadge = (isActive: boolean) => (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isActive
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
      }`}
    >
      {isActive ? 'Aktivní' : 'Neaktivní'}
    </span>
  );

  const getDisplayName = (user: any) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.email || 'Uživatel';
  };

  const getInitials = (user: any) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user.email ? user.email[0].toUpperCase() : 'U';
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Chyba při načítání uživatelů
          </h2>
          <p className="text-gray-500">
            {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute roles={['ADMIN']}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Správa uživatelů
          </h1>
          <p className="text-gray-600">
            Spravujte uživatele systému a jejich oprávnění
          </p>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Hledat uživatele..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Všechny role</option>
                <option value="ADMIN">Administrátor</option>
                <option value="SALES_MANAGER">Sales Manager</option>
                <option value="CUSTOMER">Zákazník</option>
                <option value="GUEST">Host</option>
              </select>
            </div>
            <button
              onClick={() => setShowUserForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nový uživatel
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Uživatel
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vytvořeno
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Akce
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {getInitials(user)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {getDisplayName(user)}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {getRoleLabel(user.role)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(user.isActive)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString('cs-CZ')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowUserDetails(true);
                              }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingUser(user);
                                setShowUserForm(true);
                              }}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleToggleUserStatus(user)}
                              className={user.isActive ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"}
                            >
                              {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalCount > 10 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Předchozí
                    </button>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage * 10 >= totalCount}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Další
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Zobrazeno{' '}
                        <span className="font-medium">{(currentPage - 1) * 10 + 1}</span>
                        {' '}až{' '}
                        <span className="font-medium">
                          {Math.min(currentPage * 10, totalCount)}
                        </span>
                        {' '}z{' '}
                        <span className="font-medium">{totalCount}</span>
                        {' '}výsledků
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Předchozí
                        </button>
                        <button
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage * 10 >= totalCount}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Další
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* User Form Modal */}
        {showUserForm && (
          <UserForm
            user={editingUser}
            onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
            onClose={() => {
              setShowUserForm(false);
              setEditingUser(null);
            }}
          />
        )}

        {/* User Details Modal */}
        {showUserDetails && selectedUser && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">User Details</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="text-sm text-gray-900">{getDisplayName(selectedUser)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <p className="text-sm text-gray-900">{selectedUser.role}</p>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => {
                      setShowUserDetails(false);
                      setSelectedUser(null);
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 