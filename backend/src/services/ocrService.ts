import fs from 'fs';
import path from 'path';
import { createWorker } from 'tesseract.js';
import pdfParse from 'pdf-parse';
import { supabase } from '../lib/supabase.js';
import { ocrFieldExtractor } from './ocrFieldExtractor.js';

export const ocrService = {
  /**
   * Downloads a document from a URL or reads it from the local filesystem.
   */
  async getDocumentBuffer(fileUrl: string): Promise<Buffer> {
    if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch file from URL: ${response.statusText} (Status: ${response.status})`);
      }
      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } else {
      // Treat as local file path
      const resolvedPath = path.resolve(fileUrl);
      if (!fs.existsSync(resolvedPath)) {
        throw new Error(`Local file not found at path: ${resolvedPath}`);
      }
      return fs.promises.readFile(resolvedPath);
    }
  },

  /**
   * Processes a document (PDF or Image) and returns the extracted text.
   */
  async extractRawText(buffer: Buffer, fileName: string): Promise<string> {
    const ext = path.extname(fileName).toLowerCase();

    if (ext === '.pdf') {
      try {
        const data = await (pdfParse as any)(buffer);
        const text = data.text || '';
        
        if (text.trim() === '') {
          throw new Error('PDF has no selectable text. Scanned PDFs are not supported directly without page rendering dependencies.');
        }
        
        return text;
      } catch (err: any) {
        throw new Error(`PDF text extraction failed: ${err.message}`);
      }
    } else if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      let worker;
      try {
        worker = await createWorker('eng');
        const { data: { text } } = await worker.recognize(buffer);
        return text || '';
      } catch (err: any) {
        throw new Error(`Tesseract OCR processing failed: ${err.message}`);
      } finally {
        if (worker) {
          await worker.terminate();
        }
      }
    } else {
      throw new Error(`Unsupported file extension: ${ext}. Supported formats: PDF, JPG, JPEG, PNG.`);
    }
  },

  /**
   * Handles the processing workflow for a specific land document ID.
   */
  async processOcrRecord(id: string, citizenId: string): Promise<any> {
    // 1. Retrieve the document record from the database
    const { data: document, error: fetchError } = await supabase
      .from('land_documents')
      .select('*')
      .eq('id', id)
      .eq('uploaded_by', citizenId)
      .maybeSingle();

    if (fetchError || !document) {
      throw new Error('Document record not found or access denied.');
    }

    // 2. Check if processing is already completed/processing
    if (document.ocr_status === 'processing') {
      throw new Error('Document is already being processed.');
    }

    // 3. Set status to processing
    await supabase
      .from('land_documents')
      .update({
        ocr_status: 'processing',
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    try {
      // 4. Download document buffer
      const buffer = await this.getDocumentBuffer(document.file_url);

      // 5. Extract raw text
      const rawText = await this.extractRawText(buffer, document.file_name);

      // 6. Run field extractor
      const extractedFields = ocrFieldExtractor.extractFields(rawText);

      // 7. Update document record with success status and extracted fields
      const { data: updatedDoc, error: updateError } = await supabase
        .from('land_documents')
        .update({
          ocr_status: 'completed',
          extracted_text: rawText,
          ...extractedFields,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw new Error(`Failed to save extracted data: ${updateError.message}`);
      }

      // Trigger notification for successful OCR completion
      try {
        const { notificationService } = await import('./notificationService.js');
        await notificationService.createNotification(
          citizenId,
          'ocr',
          'OCR Extraction Completed',
          `OCR processing for deed "${document.file_name}" completed successfully. You can now review mismatches.`,
          'land_documents',
          id
        );
      } catch (e: any) {
        console.error('Warning: Failed to create OCR completion notification:', e.message);
      }

      return updatedDoc;
    } catch (err: any) {
      console.error('OCR processing error for document ID:', id, err);

      // 8. Update status to failed
      await supabase
        .from('land_documents')
        .update({
          ocr_status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      // Trigger notification for failed OCR processing
      try {
        const { notificationService } = await import('./notificationService.js');
        await notificationService.createNotification(
          citizenId,
          'ocr',
          'OCR Extraction Failed',
          `OCR processing for document "${document.file_name}" failed. Please ensure the file is readable and try again.`,
          'land_documents',
          id
        );
      } catch (e: any) {
        console.error('Warning: Failed to create OCR failure notification:', e.message);
      }

      throw err;
    }
  }
};
