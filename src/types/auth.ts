export type UserRole = 'ADMIN' | 'SALES_MANAGER' | 'CUSTOMER' | 'GUEST';

export interface User {
  id: number;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Optional properties that might be present
  firstName?: string;
  lastName?: string;
  lastLoginAt?: Date;
  // For SALES_MANAGER role
  assignedCustomers?: number[];
  // For CUSTOMER role
  customerId?: number;
  // API specific properties
  salesManager?: any;
  customer?: any;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordData {
  email: string;
}

export interface ResetPasswordConfirmData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface InviteUserData {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  message?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// Permission types
export interface Permission {
  resource: string;
  action: string;
}

export interface RolePermissions {
  role: UserRole;
  permissions: Permission[];
}

// Route protection types
export interface ProtectedRouteConfig {
  roles: UserRole[];
  redirectTo?: string;
}

// User management types
export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

// Alternativní typ pro případ, že API vrací pole přímo
export type UsersResponse = User[] | UserListResponse;

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: UserRole;
  isActive?: boolean;
} 