export type UserRole = 'citizen' | 'officer';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  full_name: string;
  phone: string;
  created_at: string;
}

export interface LandRecord {
  id: string;
  land_id: string;
  owner_id: string;
  document_type: string;
  document_number: string;
  registration_date: string;
  registration_office: string;
  district: string;
  taluk: string;
  village: string;
  survey_number: string;
  patta_number: string;
  property_extent: string;
  land_type: string;
  owner_name: string;
  previous_owner: string;
  sale_consideration: number | string;
  property_description: string;
  parent_document: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
}

/**
 * Restricted fields for public search (Non-owners)
 * ONLY exposes survey_number, property_extent, village, taluk, district
 */
export interface PublicLandRecord {
  survey_number: string;
  property_extent: string;
  village: string;
  taluk: string;
  district: string;
  has_anomaly_warning?: boolean;
}

export interface LandTransfer {
  id: string;
  land_id: string;
  previous_owner: string;
  new_owner: string;
  transfer_date: string;
  document_number: string;
  sale_consideration: number | string;
  created_at: string;
}

export interface LandDocument {
  id: string;
  land_id: string;
  uploaded_by: string;
  document_type: string;
  file_name: string;
  file_url: string;
  extracted_text?: string;
  extracted_document_number?: string;
  extracted_registration_date?: string;
  extracted_registration_office?: string;
  extracted_district?: string;
  extracted_taluk?: string;
  extracted_village?: string;
  extracted_survey_number?: string;
  extracted_patta_number?: string;
  extracted_property_extent?: string;
  extracted_land_type?: string;
  extracted_owner_name?: string;
  extracted_previous_owner?: string;
  extracted_sale_consideration?: string;
  extracted_property_description?: string;
  extracted_parent_document?: string;
  ocr_status: 'pending' | 'processing' | 'completed' | 'failed';
  uploaded_at: string;
  updated_at: string;
}

export interface FieldMismatch {
  field_name: string;
  field_label: string;
  official_value: string;
  extracted_value: string;
  status: 'match' | 'mismatch' | 'unavailable';
}

export interface LandVerification {
  id: string;
  land_id: string;
  document_id: string;
  match_status: 'matched' | 'mismatched' | 'pending';
  mismatches: FieldMismatch[];
  verified_at: string;
}

export interface LandAnomaly {
  id: string;
  land_id: string;
  anomaly_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  risk_score: number;
  description: string;
  status: 'detected' | 'under_review' | 'reviewed' | 'false_positive';
  created_at: string;
}

export type GrievanceStatus = 'submitted' | 'under_review' | 'info_required' | 'resolved' | 'rejected';
export type GrievanceCategory = 'ocr_mismatch' | 'ownership_dispute' | 'survey_error' | 'illegal_mutation' | 'other';

export interface Grievance {
  id: string;
  grievance_number: string;
  citizen_id: string;
  land_id: string;
  category: GrievanceCategory;
  description: string;
  status: GrievanceStatus;
  officer_comment?: string;
  created_at: string;
  updated_at: string;
}

export interface GrievanceUpdate {
  id: string;
  grievance_id: string;
  old_status: GrievanceStatus;
  new_status: GrievanceStatus;
  comment: string;
  updated_by: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'ocr' | 'grievance' | 'land_record' | 'system';
  is_read: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: string;
  created_at: string;
}

export interface ApiResponse<T> {
  success?: boolean;
  status?: string;
  data?: T;
  error?: string;
  message?: string;
}

export interface LandSearchFilter {
  survey_number?: string;
  village?: string;
  taluk?: string;
  district?: string;
}

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
