import type { ApiResponse } from '../types';
import { request } from './api';

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const assistantService = {
  async sendAssistantMessage(message: string): Promise<ApiResponse<{ message: string }>> {
    return request<ApiResponse<{ message: string }>>('/assistant/message', {
      method: 'POST',
      body: JSON.stringify({ message })
    });
  }
};
