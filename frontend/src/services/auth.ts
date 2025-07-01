import axios from 'axios';
import type { LoginRequest, RegisterRequest, AuthResponse, User } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const authApi = axios.create({
  baseURL: `${API_BASE_URL}/api/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor pour ajouter le token aux requêtes
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor pour gérer les réponses et erreurs
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const postLogin = async (data: LoginRequest): Promise<AuthResponse> => {
  const formData = new URLSearchParams();
  formData.append('username', data.username);
  formData.append('password', data.password);
  
  const response = await authApi.post<AuthResponse>('/login', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  
  return response.data;
};

export const postRegister = async (data: RegisterRequest): Promise<User> => {
  const response = await authApi.post<User>('/register', data);
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await authApi.get<User>('/me');
  return response.data;
};

export const updateUserProfile = async (data: Partial<User>): Promise<User> => {
  const response = await authApi.put<User>('/me', data);
  return response.data;
};

export const getUserProfile = async (userId: number): Promise<User> => {
  const response = await authApi.get<User>(`/users/${userId}`);
  return response.data;
};

export const authService = {
  postLogin,
  postRegister,
  getCurrentUser,
  updateUserProfile,
  getUserProfile,
}; 