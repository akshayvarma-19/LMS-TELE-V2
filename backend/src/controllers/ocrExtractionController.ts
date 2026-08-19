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

      if (document.uploaded_by !== citizenId) {
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
        .select(`
          id, land_id, uploaded_by, ocr_status, extracted_text, document_type,
          extracted_document_number, extracted_registration_date, extracted_registration_office,
          extracted_district, extracted_taluk, extracted_village, extracted_survey_number,
          extracted_patta_number, extracted_property_extent, extracted_land_type, extracted_owner_name,
          extracted_previous_owner, extracted_sale_consideration, extracted_property_description,
          extracted_parent_document, uploaded_at, updated_at
        `)
        .eq('id', id)
        .maybeSingle();

      if (fetchError || !document) {
        res.status(404).json({
          success: false,
          error: { message: 'OCR record not found.', code: 'NOT_FOUND' }
        });
        return;
      }

      if (document.uploaded_by !== citizenId) {
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

      if (document.uploaded_by !== citizenId) {
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
  }
};
