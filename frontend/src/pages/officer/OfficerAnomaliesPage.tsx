import React, { useState, useEffect } from 'react';
import { ShieldAlert, Filter, AlertTriangle, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { grievanceService } from '../../services/grievanceService';
import { ocrService } from '../../services/ocrService';
import type { Grievance, LandDocument } from '../../types';

interface AnomalyItem {
  id: string;
  type: 'ocr_grievance' | 'ocr_mismatch';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: string;
  land_id: string;
  created_at: string;
  link: string;
}

export const OfficerAnomaliesPage: React.FC = () => {
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [anomalies, setAnomalies] = useState<AnomalyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnomalies = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const [grievancesRes, docsRes] = await Promise.all([
          grievanceService.getAllGrievances({ category: 'ocr_mismatch' }),
          ocrService.getAllDocuments()
        ]);

        const items: AnomalyItem[] = [];

        // 1. Map OCR Mismatch Grievances
        if ((grievancesRes.status === 'success' || grievancesRes.success) && Array.isArray(grievancesRes.data)) {
          grievancesRes.data.forEach((g: Grievance) => {
            items.push({
              id: g.id,
              type: 'ocr_grievance',
              title: `Citizen Grievance: ${g.grievance_number || 'OCR Discrepancy'}`,
              description: g.description,
              severity: 'high',
              status: g.status,
              land_id: g.land_id,
              created_at: g.created_at,
              link: `/officer/grievances/${g.id}`
            });
          });
        }

        // 2. Map OCR Documents with extracted fields/mismatches
        if ((docsRes.status === 'success' || docsRes.success) && Array.isArray(docsRes.data)) {
          docsRes.data.forEach((doc: LandDocument) => {
            if (doc.ocr_status === 'completed' || doc.ocr_status === 'failed') {
              items.push({
                id: doc.id,
                type: 'ocr_mismatch',
                title: `OCR Document Field Mismatch: ${doc.file_name}`,
                description: `Extracted Owner: ${doc.extracted_owner_name || 'Unmatched'} | Extracted Extent: ${doc.extracted_property_extent || 'Unmatched'} | Patta: ${doc.extracted_patta_number || 'Unmatched'}`,
                severity: doc.ocr_status === 'failed' ? 'critical' : 'medium',
                status: doc.ocr_status === 'completed' ? 'detected' : 'review_required',
                land_id: doc.land_id,
                created_at: doc.uploaded_at || doc.updated_at,
                link: `/officer/documents`
              });
            }
          });
        }

        setAnomalies(items);
      } catch (err: any) {
        setErrorMsg(err.message || 'Error fetching anomaly investigation data.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnomalies();
  }, []);

  const filteredAnomalies = anomalies.filter(item => {
    const matchSeverity = !severityFilter || item.severity === severityFilter;
    const matchStatus = !statusFilter || item.status === statusFilter;
    return matchSeverity && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#034E4E] tracking-tight">Anomaly Management & Risk Investigation</h1>
        <p className="text-xs sm:text-sm text-[#667085] mt-1">
          Automated risk score evaluation, title mismatch alerts, and OCR discrepancy investigation queue.
        </p>
      </div>

      {errorMsg && <ErrorAlert title="Anomaly System Notice" message={errorMsg} />}

      {/* Filters */}
      <div className="tracia-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="sm:w-48 relative">
          <Filter className="w-4 h-4 absolute left-3 top-2.5 text-[#667085]" />
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-[#D9E2E1] rounded-md focus:border-[#034E4E] focus:outline-none"
          >
            <option value="">All Severities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div className="sm:w-48 relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-[#D9E2E1] rounded-md focus:border-[#034E4E] focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="detected">Detected</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
          </select>
        </div>
      </div>

      {/* Anomalies Queue */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#034E4E]" />
          <p className="text-xs text-[#667085] font-semibold">Running risk matrix calculations...</p>
        </div>
      ) : filteredAnomalies.length === 0 ? (
        <EmptyState
          title="No anomaly records detected."
          description="Records flagged by OCR discrepancies or citizen mismatch petitions will appear in this review queue."
          icon={<ShieldAlert className="w-6 h-6 text-[#034E4E]" />}
        />
      ) : (
        <div className="space-y-4">
          {filteredAnomalies.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className="block bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-rose-500 hover:shadow-md transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4.5 h-4.5 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-500 font-mono">Land ID: {item.land_id} • ID: {item.id.slice(0, 8)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-auto shrink-0">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full uppercase ${
                    item.severity === 'critical'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : item.severity === 'high'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}>
                    {item.severity} Risk
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium">
                {item.description}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
