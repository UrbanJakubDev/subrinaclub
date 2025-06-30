import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  login,
  register,
  logout,
  refreshToken,
  changePassword,
  requestPasswordReset,
  resetPassword,
  updateProfile,
  createUser,
  updateUser,
  deleteUser,
  inviteUser,
  activateUser,
  deactivateUser,
} from '@/lib/api/auth/api';
import {
  LoginCredentials,
  RegisterData,
  ChangePasswordData,
  ResetPasswordData,
  ResetPasswordConfirmData,
  UpdateUserData,
  InviteUserData,
} from '@/types/auth';

// Authentication mutations
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // Invalidate and refetch user data
      queryClient.setQueryData(['user'], data.user);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      console.error('Register error:', error);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Clear all queries and user data
      queryClient.clear();
      queryClient.setQueryData(['user'], null);
    },
    onError: (error) => {
      console.error('Logout error:', error);
      // Still clear the cache even if logout fails
      queryClient.clear();
      queryClient.setQueryData(['user'], null);
    },
  });
};

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: refreshToken,
    onError: (error) => {
      console.error('Token refresh error:', error);
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
    onError: (error) => {
      console.error('Change password error:', error);
    },
  });
};

export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: requestPasswordReset,
    onError: (error) => {
      console.error('Password reset request error:', error);
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
    onError: (error) => {
      console.error('Password reset error:', error);
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['user'], updatedUser);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      console.error('Update profile error:', error);
    },
  });
};

// Admin mutations
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.error('Create user error:', error);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, userData }: { userId: number; userData: UpdateUserData }) =>
      updateUser(userId, userData),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', updatedUser.id] });
    },
    onError: (error) => {
      console.error('Update user error:', error);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.error('Delete user error:', error);
    },
  });
};

export const useInviteUser = () => {
  return useMutation({
    mutationFn: inviteUser,
    onError: (error) => {
      console.error('Invite user error:', error);
    },
  });
};

export const useActivateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: activateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.error('Activate user error:', error);
    },
  });
};

export const useDeactivateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deactivateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.error('Deactivate user error:', error);
    },
  });
}; 