import { supabase } from '../lib/supabase';
import type { LandDocument, VerificationResult, ApiResponse } from '../types';
import { request } from './api';

export const ocrService = {
  async uploadLandDocument(landId: string, file: File): Promise<ApiResponse<LandDocument>> {
    try {
      // 1. Try uploading file to Supabase Storage bucket 'deed_documents'
      const fileName = `${Date.now()}_${file.name}`;
      const bucketName = 'deed_documents';
      let publicUrl = '';
      
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file);

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(fileName);
        publicUrl = urlData?.publicUrl || '';
      } else {
        console.warn(`Supabase storage upload error (${uploadError.message}). Falling back to Data URL encoding.`);
        publicUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Failed to read file for fallback upload'));
          reader.readAsDataURL(file);
        });
      }

      // 2. Create document record via Express backend API (using service role key to bypass RLS)
      const res = await request<any>('/citizen/ocr/create-document', {
        method: 'POST',
        body: JSON.stringify({
          land_id: landId,
          file_name: file.name,
          file_url: publicUrl
        })
      });

      const docData = res.data || res;
      if (!docData || res.error || (res.success === false)) {
        throw new Error(res.error?.message || res.message || 'Failed to create document record');
      }

      return {
        status: 'success',
        data: docData as LandDocument
      };
    } catch (err: any) {
      return {
        status: 'error',
        message: err.message || 'Failed to upload document'
      };
    }
  },

  async startOcrExtraction(documentId: string): Promise<ApiResponse<LandDocument>> {
    return request<ApiResponse<LandDocument>>(`/citizen/ocr/${documentId}/extract`, {
      method: 'POST'
    });
  },

  async getExtractedData(documentId: string): Promise<ApiResponse<LandDocument>> {
    return request<ApiResponse<LandDocument>>(`/citizen/ocr/${documentId}/extracted`);
  },

  async getVerificationResults(documentId: string): Promise<ApiResponse<VerificationResult>> {
    return request<ApiResponse<VerificationResult>>(`/citizen/ocr/${documentId}/verify`);
  },

  async reprocessOcr(documentId: string): Promise<ApiResponse<LandDocument>> {
    return request<ApiResponse<LandDocument>>(`/citizen/ocr/${documentId}/reprocess`, {
      method: 'POST'
    });
  },

  async getAllDocuments(): Promise<ApiResponse<LandDocument[]>> {
    try {
      const sessionStr = localStorage.getItem('supabase_session');
      let role = 'citizen';
      if (sessionStr) {
        try {
          const session = JSON.parse(sessionStr);
          role = session.user?.user_metadata?.role || session.role || 'citizen';
        } catch (e) {}
      }
      const endpoint = role === 'officer' ? '/officer/ocr/documents' : '/citizen/ocr/documents';
      const res = await request<any>(endpoint);
      const docs = res.data || res;
      return { status: 'success', data: docs as LandDocument[] };
    } catch (err: any) {
      return { status: 'error', message: err.message || 'Failed to load documents' };
    }
  }
};
