export interface ExtractedFields {
  document_type: string | null;
  extracted_document_number: string | null;
  extracted_registration_date: string | null;
  extracted_registration_office: string | null;
  extracted_district: string | null;
  extracted_taluk: string | null;
  extracted_village: string | null;
  extracted_survey_number: string | null;
  extracted_patta_number: string | null;
  extracted_property_extent: string | null;
  extracted_land_type: string | null;
  extracted_owner_name: string | null;
  extracted_previous_owner: string | null;
  extracted_sale_consideration: string | null;
  extracted_property_description: string | null;
  extracted_parent_document: string | null;
}

export const ocrFieldExtractor = {
  /**
   * Parse 16 official land record fields from raw OCR text using regexes.
   */
  extractFields(text: string): ExtractedFields {
    const lines = text.split(/\r?\n/);
    
    // Helper to find a value based on a list of regex patterns
    const findValue = (patterns: RegExp[]): string | null => {
      // 1. Try matching line by line
      for (const line of lines) {
        for (const pattern of patterns) {
          const match = line.match(pattern);
          if (match && match[1]) {
            const val = match[1].trim();
            if (val) return val;
          }
        }
      }
      
      // 2. Try matching on the full text as a fallback
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

      extracted_document_number: findValue([
        /document\s*(?:number|no\.?)\s*:\s*(\S+)/i,
        /doc\s*(?:number|no\.?)\s*:\s*(\S+)/i,
        /reg(?:istration)?\s*(?:number|no\.?)\s*:\s*(\S+)/i,
        /deed\s*(?:number|no\.?)\s*:\s*(\S+)/i
      ]),

      extracted_registration_date: findValue([
        /registration\s*date\s*:\s*(\S+)/i,
        /date\s*of\s*registration\s*:\s*(\S+)/i,
        /reg(?:istration)?\s*date\s*:\s*(\S+)/i,
        /date\s*:\s*(\d{2}[-/]\d{2}[-/]\d{4}|\d{4}[-/]\d{2}[-/]\d{2})/i
      ]),

      extracted_registration_office: findValue([
        /sub\s*registrar\s*office\s*:\s*(.*)/i,
        /registration\s*office\s*:\s*(.*)/i,
        /office\s*of\s*the\s*sub\s*registrar\s*:\s*(.*)/i,
        /sro\s*:\s*(.*)/i
      ]),

      extracted_district: findValue([
        /district\s*:\s*([a-zA-Z\s]+)/i,
        /dist\.?\s*:\s*([a-zA-Z\s]+)/i
      ]),

      extracted_taluk: findValue([
        /taluk\s*:\s*([a-zA-Z\s]+)/i,
        /tehsil\s*:\s*([a-zA-Z\s]+)/i
      ]),

      extracted_village: findValue([
        /village\s*:\s*([a-zA-Z\s]+)/i
      ]),

      extracted_survey_number: findValue([
        /survey\s*(?:number|no\.?)\s*:\s*(\S+)/i,
        /s\.?\s*no\.?\s*:\s*(\S+)/i,
        /survey\s*:\s*(\S+)/i
      ]),

      extracted_patta_number: findValue([
        /patta\s*(?:number|no\.?)\s*:\s*(\S+)/i,
        /patta\s*:\s*(\S+)/i
      ]),

      extracted_property_extent: findValue([
        /property\s*extent\s*:\s*(.*)/i,
        /extent\s*:\s*(.*)/i,
        /area\s*:\s*(.*)/i
      ]),

      extracted_land_type: findValue([
        /land\s*type\s*:\s*(.*)/i,
        /type\s*of\s*land\s*:\s*(.*)/i,
        /classification\s*:\s*(.*)/i
      ]),

      extracted_owner_name: findValue([
        /owner\s*(?:name)?\s*:\s*(.*)/i,
        /current\s*owner\s*:\s*(.*)/i,
        /purchaser\s*:\s*(.*)/i,
        /buyer\s*:\s*(.*)/i,
        /name\s*of\s*owner\s*:\s*(.*)/i
      ]),

      extracted_previous_owner: findValue([
        /previous\s*owner\s*:\s*(.*)/i,
        /seller\s*:\s*(.*)/i,
        /vendor\s*:\s*(.*)/i,
        /name\s*of\s*previous\s*owner\s*:\s*(.*)/i
      ]),

      extracted_sale_consideration: findValue([
        /sale\s*consideration\s*:\s*(.*)/i,
        /consideration\s*amount\s*:\s*(.*)/i,
        /property\s*value\s*:\s*(.*)/i,
        /value\s*:\s*(.*)/i
      ]),

      extracted_property_description: findValue([
        /property\s*description\s*:\s*(.*)/i,
        /description\s*:\s*(.*)/i
      ]),

      extracted_parent_document: findValue([
        /parent\s*document\s*:\s*(.*)/i,
        /parent\s*doc\s*:\s*(.*)/i
      ])
    };
  }
};
