import React, { useState, useEffect } from 'react';
import { FolderKanban, Filter, FileText, CheckCircle2, Clock, ExternalLink, Loader2 } from 'lucide-react';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { ocrService } from '../../services/ocrService';
import type { LandDocument } from '../../types';

export const OfficerDocumentsPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [documents, setDocuments] = useState<LandDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const res = await ocrService.getAllDocuments();
        if ((res.status === 'success' || res.success) && Array.isArray(res.data)) {
          setDocuments(res.data);
        } else {
          setErrorMsg(res.message || 'Failed to retrieve uploaded documents.');
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Error connecting to OCR documents service.');
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  const filteredDocuments = documents.filter(doc => {
    if (!statusFilter) return true;
    return doc.ocr_status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#034E4E] tracking-tight">Uploaded Deed Documents & OCR Logs</h1>
        <p className="text-xs sm:text-sm text-[#667085] mt-1">
          Review uploaded paper deeds, extracted metadata, and OCR verification status logs.
        </p>
      </div>

      {errorMsg && <ErrorAlert title="OCR Queue Error" message={errorMsg} />}

      {/* Filters */}
      <div className="tracia-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="sm:w-48 relative">
          <Filter className="w-4 h-4 absolute left-3 top-2.5 text-[#667085]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-[#D9E2E1] rounded-md focus:border-[#034E4E] focus:outline-none"
          >
            <option value="">All OCR Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Documents List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#034E4E]" />
          <p className="text-xs text-[#667085] font-semibold">Retrieving OCR document repository...</p>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <EmptyState
          title="No uploaded documents found."
          description="Documents uploaded for optical verification will be listed here with extraction metrics."
          icon={<FolderKanban className="w-6 h-6 text-[#034E4E]" />}
        />
      ) : (
        <div className="space-y-4">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-[#034E4E] transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F4F8F7] border border-[#D9E2E1] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-[#034E4E]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{doc.file_name || 'Title Deed Document'}</h3>
                    <p className="text-xs text-slate-500 font-mono">Land ID: {doc.land_id || 'N/A'} • Doc ID: {doc.id.slice(0, 8)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-start sm:self-auto">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full uppercase flex items-center space-x-1 ${
                    doc.ocr_status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : doc.ocr_status === 'processing'
                      ? 'bg-blue-100 text-blue-800'
                      : doc.ocr_status === 'failed'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {doc.ocr_status === 'completed' ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                    <span>{doc.ocr_status}</span>
                  </span>

                  {doc.file_url && (
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-[#F4F8F7] hover:bg-[#E4ECEB] text-[#034E4E] rounded-lg text-xs font-semibold flex items-center space-x-1 border border-[#D9E2E1] transition-colors"
                    >
                      <span>View File</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Extracted OCR Fields Grid View for Officers */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="block text-[11px] font-medium text-slate-500">Extracted Owner</span>
                  <span className="font-bold text-slate-900">{doc.extracted_owner_name || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-[11px] font-medium text-slate-500">Extracted Survey No</span>
                  <span className="font-bold text-slate-900 font-mono">{doc.extracted_survey_number || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-[11px] font-medium text-slate-500">Extracted Patta No</span>
                  <span className="font-bold text-slate-900 font-mono">{doc.extracted_patta_number || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-[11px] font-medium text-slate-500">Extracted Extent</span>
                  <span className="font-bold text-slate-900">{doc.extracted_property_extent || 'N/A'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
