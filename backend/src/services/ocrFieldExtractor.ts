export interface ExtractedFields {
  document_type: string | null;
  extracted_owner: string | null;
  extracted_survey_number: string | null;
  extracted_area: string | null;
  extracted_patta: string | null;
  extracted_village: string | null;
  extracted_taluk: string | null;
  extracted_district: string | null;
  extracted_classification: string | null;
}

export const ocrFieldExtractor = {
  /**
   * Parse official land record fields from raw OCR text using regexes.
   */
  extractFields(text: string): ExtractedFields {
    const lines = text.split(/\r?\n/);
    
    // Helper to find a value based on a list of regex patterns
    const findValue = (patterns: RegExp[]): string | null => {
      for (const line of lines) {
        for (const pattern of patterns) {
          const match = line.match(pattern);
          if (match && match[1]) {
            const val = match[1].trim();
            if (val) return val;
          }
        }
      }
      
      for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
          const val = match[1].trim();
          if (val) return val;
        }
      }
      
      return null;
    };

    return {
      document_type: findValue([
        /document\s*type\s*:\s*(.*)/i,
        /type\s*of\s*document\s*:\s*(.*)/i,
        /deed\s*type\s*:\s*(.*)/i,
        /(sale\s*deed|gift\s*deed|partition\s*deed)/i
      ]),

      extracted_owner: findValue([
        /owner\s*(?:name)?\s*:\s*(.*)/i,
        /current\s*owner\s*:\s*(.*)/i,
        /purchaser\s*:\s*(.*)/i,
        /buyer\s*:\s*(.*)/i,
        /name\s*of\s*owner\s*:\s*(.*)/i
      ]),

      extracted_survey_number: findValue([
        /survey\s*(?:number|no\.?)\s*:\s*(\S+)/i,
        /s\.?\s*no\.?\s*:\s*(\S+)/i,
        /survey\s*:\s*(\S+)/i
      ]),

      extracted_area: findValue([
        /property\s*extent\s*:\s*(.*)/i,
        /extent\s*:\s*(.*)/i,
        /area\s*:\s*(.*)/i
      ]),

      extracted_patta: findValue([
        /patta\s*(?:number|no\.?)\s*:\s*(\S+)/i,
        /patta\s*:\s*(\S+)/i
      ]),

      extracted_village: findValue([
        /village\s*:\s*([a-zA-Z\s]+)/i
      ]),

      extracted_taluk: findValue([
        /taluk\s*:\s*([a-zA-Z\s]+)/i,
        /tehsil\s*:\s*([a-zA-Z\s]+)/i
      ]),

      extracted_district: findValue([
        /district\s*:\s*([a-zA-Z\s]+)/i,
        /dist\.?\s*:\s*([a-zA-Z\s]+)/i
      ]),

      extracted_classification: findValue([
        /land\s*type\s*:\s*(.*)/i,
        /type\s*of\s*land\s*:\s*(.*)/i,
        /classification\s*:\s*(.*)/i
      ])
    };
  }
};
