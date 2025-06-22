export type UserRole = "student" | "teacher" | "admin";

export interface User {
  id: number;
  f_name: string;
  l_name: string;
  email: string;
  role: UserRole;
  other_id?: string;
  department?: string;
  level?: string;
  semester?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  clearError: () => void;
} 