export type UserRole = "student" | "lecturer" | "admin";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  program?: string;  // For students
  year?: string;     // For students
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
} 