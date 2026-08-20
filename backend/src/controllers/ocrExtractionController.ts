import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { supabase } from '../lib/supabase.js';
import { ocrService } from '../services/ocrService.js';
import { ocrVerificationService } from '../services/ocrVerificationService.js';

export const ocrExtractionController = {
  /**
   * POST /api/citizen/ocr/:id/extract
   * Triggers text extraction and field identification for a document.
   */
  async extractOcr(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const citizenId = req.user?.id;
      const { id } = req.params;

      if (!citizenId) {
        res.status(401).json({
          success: false,
          error: { message: 'User authentication failed', code: 'UNAUTHORIZED' }
        });
        return;
      }

      if (!id || typeof id !== 'string' || id.trim() === '') {
        res.status(400).json({
          success: false,
          error: { message: 'Document ID is required.', code: 'BAD_REQUEST' }
        });
        return;
      }

      // Check document existence & ownership
      const { data: document, error: fetchError } = await supabase
        .from('land_documents')
        .select('uploaded_by')
        .eq('id', id)
        .maybeSingle();

      if (fetchError || !document) {
        res.status(404).json({
          success: false,
          error: { message: 'OCR record not found.', code: 'NOT_FOUND' }
        });
        return;
      }

      if (document.uploaded_by && citizenId && document.uploaded_by !== citizenId) {
        res.status(403).json({
          success: false,
          error: { message: 'Access denied. You do not own this OCR record.', code: 'FORBIDDEN' }
        });
        return;
      }

      // Run extraction (await to return the result immediately)
      const updatedRecord = await ocrService.processOcrRecord(id, citizenId);

      res.status(200).json({
        success: true,
        data: updatedRecord
      });
    } catch (err: any) {
      console.error('Extract OCR controller error:', err);
      res.status(500).json({
        success: false,
        error: {
          message: err.message || 'OCR processing failed.',
          code: 'OCR_PROCESSING_FAILED'
        }
      });
    }
  },

  /**
   * GET /api/citizen/ocr/:id/extracted
   * Retrieves current ocr_status, extracted text, and the 16 fields.
   */
  async getExtractedData(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const citizenId = req.user?.id;
      const { id } = req.params;

      if (!citizenId) {
        res.status(401).json({
          success: false,
          error: { message: 'User authentication failed', code: 'UNAUTHORIZED' }
        });
        return;
      }

      if (!id || typeof id !== 'string' || id.trim() === '') {
        res.status(400).json({
          success: false,
          error: { message: 'Document ID is required.', code: 'BAD_REQUEST' }
        });
        return;
      }

      // Get document details
      const { data: document, error: fetchError } = await supabase
        .from('land_documents')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (fetchError || !document) {
        res.status(404).json({
          success: false,
          error: { message: 'OCR record not found.', code: 'NOT_FOUND' }
        });
        return;
      }

      if (document.uploaded_by && citizenId && document.uploaded_by !== citizenId) {
        res.status(403).json({
          success: false,
          error: { message: 'Access denied. You do not own this OCR record.', code: 'FORBIDDEN' }
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: document
      });
    } catch (err: any) {
      console.error('Get extracted data controller error:', err);
      res.status(500).json({
        success: false,
        error: { message: 'Failed to retrieve extracted data.', code: 'INTERNAL_SERVER_ERROR' }
      });
    }
  },

  /**
   * GET /api/citizen/ocr/:id/verify
   * Computes comparison values against land_records dynamically.
   */
  async verifyOcr(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const citizenId = req.user?.id;
      const { id } = req.params;

      if (!citizenId) {
        res.status(401).json({
          success: false,
          error: { message: 'User authentication failed', code: 'UNAUTHORIZED' }
        });
        return;
      }

      if (!id || typeof id !== 'string' || id.trim() === '') {
        res.status(400).json({
          success: false,
          error: { message: 'Document ID is required.', code: 'BAD_REQUEST' }
        });
        return;
      }

      const result = await ocrVerificationService.verifyOcr(id, citizenId);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (err: any) {
      console.error('Verify OCR controller error:', err);
      const isNotFound = err.message.includes('not found') || err.message.includes('access denied');
      res.status(isNotFound ? 404 : 500).json({
        success: false,
        error: {
          message: err.message || 'Verification calculation failed.',
          code: isNotFound ? 'NOT_FOUND' : 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  },

  /**
   * POST /api/citizen/ocr/:id/reprocess
   * Re-extracts text and updates the existing record columns.
   */
  async reprocessOcr(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const citizenId = req.user?.id;
      const { id } = req.params;

      if (!citizenId) {
        res.status(401).json({
          success: false,
          error: { message: 'User authentication failed', code: 'UNAUTHORIZED' }
        });
        return;
      }

      if (!id || typeof id !== 'string' || id.trim() === '') {
        res.status(400).json({
          success: false,
          error: { message: 'Document ID is required.', code: 'BAD_REQUEST' }
        });
        return;
      }

      // Check document existence & ownership
      const { data: document, error: fetchError } = await supabase
        .from('land_documents')
        .select('uploaded_by')
        .eq('id', id)
        .maybeSingle();

      if (fetchError || !document) {
        res.status(404).json({
          success: false,
          error: { message: 'OCR record not found.', code: 'NOT_FOUND' }
        });
        return;
      }

      if (document.uploaded_by && citizenId && document.uploaded_by !== citizenId) {
        res.status(403).json({
          success: false,
          error: { message: 'Access denied. You do not own this OCR record.', code: 'FORBIDDEN' }
        });
        return;
      }

      // Reset ocr_status and re-run OCR extraction
      const updatedRecord = await ocrService.processOcrRecord(id, citizenId);

      res.status(200).json({
        success: true,
        data: updatedRecord
      });
    } catch (err: any) {
      console.error('Reprocess OCR controller error:', err);
      res.status(500).json({
        success: false,
        error: {
          message: err.message || 'OCR reprocessing failed.',
          code: 'OCR_REPROCESSING_FAILED'
        }
      });
    }
  },

  /**
   * POST /api/citizen/ocr/create-document
   * Creates a land_documents record using backend service role client (bypasses RLS).
   */
  async createDocument(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const citizenId = req.user?.id || '';
      const { land_id, file_name, file_url } = req.body;

      if (!land_id || !file_name || !file_url) {
        res.status(400).json({
          success: false,
          error: { message: 'land_id, file_name, and file_url are required.', code: 'BAD_REQUEST' }
        });
        return;
      }

      const { data: dbData, error: dbError } = await supabase
        .from('land_documents')
        .insert([
          {
            land_id,
            file_url,
            file_name,
            document_type: req.body.document_type || 'Title Deed',
            ocr_status: 'pending',
            uploaded_by: citizenId,
            uploaded_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (dbError) {
        console.error('Supabase DB insert error:', dbError);
        res.status(500).json({
          success: false,
          error: { message: dbError.message || 'Failed to create document record', code: 'DB_ERROR' }
        });
        return;
      }

      res.status(201).json({
        success: true,
        data: dbData
      });
    } catch (err: any) {
      console.error('Create document error:', err);
      res.status(500).json({
        success: false,
        error: { message: err.message || 'Failed to create document record', code: 'INTERNAL_SERVER_ERROR' }
      });
    }
  },

  /**
   * GET /api/citizen/ocr/documents
   * Fetches all OCR documents for the authenticated citizen (bypasses RLS).
   */
  async getAllDocuments(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const citizenId = req.user?.id;
      let query = supabase.from('land_documents').select('*').order('uploaded_at', { ascending: false });
      if (citizenId) {
        query = query.eq('uploaded_by', citizenId);
      }

      const { data, error } = await query;
      if (error) throw error;

      res.status(200).json({
        success: true,
        data
      });
    } catch (err: any) {
      console.error('Get all documents error:', err);
      res.status(500).json({
        success: false,
        error: { message: err.message || 'Failed to fetch documents', code: 'INTERNAL_SERVER_ERROR' }
      });
    }
  }
};
