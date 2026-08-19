import { supabase } from '../lib/supabase.js';

export interface VerificationFieldResult {
  field: string;
  ocrValue: string | null;
  officialValue: string | null;
  status: 'MATCH' | 'MISMATCH' | 'NOT_AVAILABLE';
}

export interface VerificationResult {
  overallStatus: 'MATCH' | 'MISMATCH' | 'PROCESSING' | 'OCR_FAILED';
  mismatchCount: number;
  canRaiseGrievance: boolean;
  fields: VerificationFieldResult[];
}

function normalizeText(val: string | null | undefined): string {
  if (!val) return '';
  return val.trim().replace(/\s+/g, ' ').toLowerCase();
}

function normalizeDate(val: string | null | undefined): string {
  if (!val) return '';
  const cleaned = val.trim();
  
  // Try to parse DD-MM-YYYY or DD/MM/YYYY
  const dmyMatch = cleaned.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmyMatch) {
    const day = dmyMatch[1].padStart(2, '0');
    const month = dmyMatch[2].padStart(2, '0');
    const year = dmyMatch[3];
    return `${year}-${month}-${day}`;
  }
  
  // Try to parse YYYY-MM-DD
  const ymdMatch = cleaned.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (ymdMatch) {
    const year = ymdMatch[1];
    const month = ymdMatch[2].padStart(2, '0');
    const day = ymdMatch[3].padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  // Fallback to Date parse
  const parsed = Date.parse(cleaned);
  if (!isNaN(parsed)) {
    return new Date(parsed).toISOString().split('T')[0];
  }
  
  return normalizeText(val);
}

function normalizeAmount(val: string | null | undefined): string {
  if (!val) return '';
  // Remove currency signs, commas, whitespace
  const cleaned = val.trim().replace(/[₹$,\s]/g, '');
  const num = parseFloat(cleaned);
  if (!isNaN(num)) {
    return num.toString();
  }
  return normalizeText(val);
}

export const ocrVerificationService = {
  /**
   * Perform field-by-field verification of OCR record vs Land Record.
   */
  async verifyOcr(id: string, citizenId: string): Promise<VerificationResult> {
    // 1. Get OCR document record
    const { data: document, error: docError } = await supabase
      .from('land_documents')
      .select('*')
      .eq('id', id)
      .eq('uploaded_by', citizenId)
      .maybeSingle();

    if (docError || !document) {
      throw new Error('OCR document not found or access denied.');
    }

    // 2. Check OCR processing status
    if (document.ocr_status === 'processing' || document.ocr_status === 'pending') {
      return {
        overallStatus: 'PROCESSING',
        mismatchCount: 0,
        canRaiseGrievance: false,
        fields: []
      };
    }

    if (document.ocr_status === 'failed') {
      return {
        overallStatus: 'OCR_FAILED',
        mismatchCount: 0,
        canRaiseGrievance: false,
        fields: []
      };
    }

    // 3. Get corresponding official land record
    const { data: land, error: landError } = await supabase
      .from('land_records')
      .select('*')
      .eq('id', document.land_id)
      .maybeSingle();

    if (landError || !land) {
      throw new Error('Official land record not found.');
    }

    // 4. Define field map
    const fieldsToCompare = [
      { key: 'document_type', ocrKey: 'document_type', type: 'text' },
      { key: 'document_number', ocrKey: 'extracted_document_number', type: 'text' },
      { key: 'registration_date', ocrKey: 'extracted_registration_date', type: 'date' },
      { key: 'registration_office', ocrKey: 'extracted_registration_office', type: 'text' },
      { key: 'district', ocrKey: 'extracted_district', type: 'text' },
      { key: 'taluk', ocrKey: 'extracted_taluk', type: 'text' },
      { key: 'village', ocrKey: 'extracted_village', type: 'text' },
      { key: 'survey_number', ocrKey: 'extracted_survey_number', type: 'text' },
      { key: 'patta_number', ocrKey: 'extracted_patta_number', type: 'text' },
      { key: 'property_extent', ocrKey: 'extracted_property_extent', type: 'text' },
      { key: 'land_type', ocrKey: 'extracted_land_type', type: 'text' },
      { key: 'owner_name', ocrKey: 'extracted_owner_name', type: 'text' },
      { key: 'previous_owner', ocrKey: 'extracted_previous_owner', type: 'text' },
      { key: 'sale_consideration', ocrKey: 'extracted_sale_consideration', type: 'amount' },
      { key: 'property_description', ocrKey: 'extracted_property_description', type: 'text' },
      { key: 'parent_document', ocrKey: 'extracted_parent_document', type: 'text' }
    ];

    const results: VerificationFieldResult[] = [];
    let mismatchCount = 0;

    for (const field of fieldsToCompare) {
      const ocrValue = document[field.ocrKey] ?? null;
      const officialValue = land[field.key] ?? null;

      let status: 'MATCH' | 'MISMATCH' | 'NOT_AVAILABLE' = 'MATCH';

      if (ocrValue === null || officialValue === null) {
        status = 'NOT_AVAILABLE';
      } else {
        let isMatch = false;

        if (field.type === 'date') {
          isMatch = normalizeDate(ocrValue) === normalizeDate(officialValue);
        } else if (field.type === 'amount') {
          isMatch = normalizeAmount(ocrValue) === normalizeAmount(officialValue);
        } else {
          isMatch = normalizeText(ocrValue) === normalizeText(officialValue);
        }

        status = isMatch ? 'MATCH' : 'MISMATCH';
      }

      if (status === 'MISMATCH') {
        mismatchCount++;
      }

      results.push({
        field: field.key,
        ocrValue,
        officialValue,
        status
      });
    }

    const overallStatus = mismatchCount > 0 ? 'MISMATCH' : 'MATCH';

    return {
      overallStatus,
      mismatchCount,
      canRaiseGrievance: mismatchCount > 0,
      fields: results
    };
  }
};
