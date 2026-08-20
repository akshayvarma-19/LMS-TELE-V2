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
      .maybeSingle();

    if (docError || !document) {
      throw new Error('OCR document not found.');
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

    // Helper to get official land value from record
    const getOfficialValue = (keys: string[]): string | null => {
      for (const k of keys) {
        if (land[k] !== undefined && land[k] !== null && String(land[k]).trim() !== '') {
          return String(land[k]).trim();
        }
      }
      return null;
    };

    // 4. Define field map
    const fieldsToCompare = [
      { key: 'document_type', altKeys: ['document_type'], ocrKey: 'document_type', type: 'text' },
      { key: 'owner_name', altKeys: ['owner_name'], ocrKey: 'extracted_owner', type: 'text' },
      { key: 'survey_number', altKeys: ['survey_number'], ocrKey: 'extracted_survey_number', type: 'text' },
      { key: 'property_extent', altKeys: ['land_extent_acres', 'property_extent'], ocrKey: 'extracted_area', type: 'extent' },
      { key: 'patta_number', altKeys: ['patta_number'], ocrKey: 'extracted_patta', type: 'text' },
      { key: 'village', altKeys: ['village'], ocrKey: 'extracted_village', type: 'text' },
      { key: 'taluk', altKeys: ['taluk'], ocrKey: 'extracted_taluk', type: 'text' },
      { key: 'district', altKeys: ['district'], ocrKey: 'extracted_district', type: 'text' },
      { key: 'land_type', altKeys: ['land_classification', 'land_type'], ocrKey: 'extracted_classification', type: 'text' }
    ];

    const results: VerificationFieldResult[] = [];
    let mismatchCount = 0;

    for (const field of fieldsToCompare) {
      const ocrValue = document[field.ocrKey] !== undefined && document[field.ocrKey] !== null ? String(document[field.ocrKey]).trim() : null;
      let officialValue = getOfficialValue(field.altKeys);

      // Default document_type if missing in land record
      if (field.key === 'document_type' && !officialValue) {
        officialValue = 'Sale Deed';
      }

      let status: 'MATCH' | 'MISMATCH' | 'NOT_AVAILABLE' = 'MATCH';

      if (!ocrValue && !officialValue) {
        status = 'NOT_AVAILABLE';
      } else if (!ocrValue || !officialValue) {
        status = 'MISMATCH';
      } else {
        let isMatch = false;

        if (field.type === 'date') {
          isMatch = normalizeDate(ocrValue) === normalizeDate(officialValue);
        } else if (field.type === 'amount') {
          isMatch = normalizeAmount(ocrValue) === normalizeAmount(officialValue);
        } else if (field.type === 'extent') {
          const numOcr = parseFloat(ocrValue.replace(/[^0-9.]/g, ''));
          const numOfficial = parseFloat(officialValue.replace(/[^0-9.]/g, ''));
          isMatch = !isNaN(numOcr) && !isNaN(numOfficial) ? Math.abs(numOcr - numOfficial) < 0.01 : normalizeText(ocrValue) === normalizeText(officialValue);
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
