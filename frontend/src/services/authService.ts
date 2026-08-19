import type { User, ApiResponse } from '../types';
import { request } from './api';

export interface LoginCredentials {
  username?: string;
  email?: string;
  password?: string;
  role?: 'citizen' | 'officer';
}

export interface RegisterCredentials {
  name: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  role: 'citizen' | 'officer';
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ token?: string; user: any; session: any }>> {
    return request<ApiResponse<{ token?: string; user: any; session: any }>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  async register(credentials: RegisterCredentials): Promise<ApiResponse<{ user: any }>> {
    return request<ApiResponse<{ user: any }>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return request<ApiResponse<User>>('/auth/me');
  },

  async logout(): Promise<void> {
    localStorage.removeItem('supabase_session');
  },

  async updateProfile(_data: Partial<User>): Promise<ApiResponse<User>> {
    return request<ApiResponse<User>>('/auth/profile');
  }
};

