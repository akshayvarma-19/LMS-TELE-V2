import type { ApiResponse } from '../types';
import { request } from './api';

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const assistantService = {
  async sendAssistantMessage(_message: string): Promise<ApiResponse<{ reply: string }>> {
    return request<ApiResponse<{ reply: string }>>('/assistant/chat');
  }
};
