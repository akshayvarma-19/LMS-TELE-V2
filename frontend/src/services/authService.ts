import type { User, ApiResponse } from '../types';
import { request } from './api';

export interface LoginCredentials {
  username?: string;
  password?: string;
  role: 'citizen' | 'officer';
}

export const authService = {
  async login(_credentials: LoginCredentials): Promise<ApiResponse<{ token: string; user: User }>> {
    return request<ApiResponse<{ token: string; user: User }>>('/auth/login');
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return request<ApiResponse<User>>('/auth/me');
  },

  async logout(): Promise<void> {
    // Local session clearing logic when backend is connected
  },

  async updateProfile(_data: Partial<User>): Promise<ApiResponse<User>> {
    return request<ApiResponse<User>>('/auth/profile');
  }
};
