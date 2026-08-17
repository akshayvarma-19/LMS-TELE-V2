import type { Notification, ApiResponse } from '../types';
import { request } from './api';

export const notificationService = {
  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    return request<ApiResponse<Notification[]>>('/notifications');
  },

  async markAsRead(_id: string): Promise<ApiResponse<void>> {
    return request<ApiResponse<void>>(`/notifications/${_id}/read`);
  }
};
