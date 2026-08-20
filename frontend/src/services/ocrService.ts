import { supabase } from '../lib/supabase';
import type { LandDocument, VerificationResult, ApiResponse } from '../types';
import { request } from './api';

export const ocrService = {
  async uploadLandDocument(landId: string, file: File): Promise<ApiResponse<LandDocument>> {
    try {
      // 1. Upload file to Supabase Storage bucket 'deed_documents'
      const fileName = `${Date.now()}_${file.name}`;
      const bucketName = 'deed_documents';
      
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file);

      if (uploadError) {
        throw new Error(`Upload to storage failed: ${uploadError.message}`);
      }

      // 2. Get public URL of the uploaded document
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      // 3. Create document record in Supabase database table `land_documents`
      const sessionStr = localStorage.getItem('supabase_session');
      let userId = '';
      if (sessionStr) {
        try {
          const session = JSON.parse(sessionStr);
          userId = session.user?.id || '';
        } catch (e) {}
      }

      const { data: dbData, error: dbError } = await supabase
        .from('land_documents')
        .insert([
          {
            land_id: landId,
            file_url: publicUrl,
            file_name: file.name,
            ocr_status: 'pending',
            uploaded_by: userId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (dbError) {
        throw dbError;
      }

      return {
        status: 'success',
        data: dbData as LandDocument
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
      const { data, error } = await supabase
        .from('land_documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { status: 'success', data: data as LandDocument[] };
    } catch (err: any) {
      return { status: 'error', message: err.message || 'Failed to load documents' };
    }
  }
};
