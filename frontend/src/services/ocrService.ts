import type { LandDocument, LandVerification, ApiResponse } from '../types';
import { request } from './api';

export const ocrService = {
  async uploadLandDocument(_landId: string, _file: File): Promise<ApiResponse<LandDocument>> {
    return request<ApiResponse<LandDocument>>('/ocr/upload');
  },

  async getVerificationResults(_documentId: string): Promise<ApiResponse<LandVerification>> {
    return request<ApiResponse<LandVerification>>(`/ocr/verifications/${_documentId}`);
  },

  async getAllDocuments(): Promise<ApiResponse<LandDocument[]>> {
    return request<ApiResponse<LandDocument[]>>('/officer/documents');
  }
};
