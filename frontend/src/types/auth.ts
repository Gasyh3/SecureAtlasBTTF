export interface User {
  id: number;
  username?: string;
  email: string;
  firstname?: string;
  lastname?: string;
  picture_profile?: string;
  role: 'student' | 'instructor';
  created_at: string;
  updated_at: string;
}

export interface UserPublic {
  id: number;
  username?: string;
  firstname?: string;
  lastname?: string;
  picture_profile?: string;
  role: 'student' | 'instructor';
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username?: string;
  email: string;
  firstname?: string;
  lastname?: string;
  picture_profile?: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
} 