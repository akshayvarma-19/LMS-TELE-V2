import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, FileText, CheckCircle2, AlertTriangle, XCircle, MessageSquare, ShieldCheck, Download } from 'lucide-react';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { Badge } from '../../components/common/Badge';

export const OfficerApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [officerRemarks, setOfficerRemarks] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleAction = (actionType: 'approve' | 'request_info' | 'reject') => {
    setValidationError(null);
    setActionNotice(null);

    // Require remarks before Request Information or Reject
    if ((actionType === 'request_info' || actionType === 'reject') && !officerRemarks.trim()) {
      setValidationError(`Officer remarks/reason are required before taking action: "${actionType === 'request_info' ? 'Request Information' : 'Reject'}"`);
      return;
    }

    const actionTitles = {
      approve: 'Approved',
      request_info: 'Information Requested',
      reject: 'Rejected',
    };

    setActionNotice(
      `Frontend Ready: Action "${actionTitles[actionType]}" with remarks recorded. Real database update will trigger when backend API is live.`
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Link
          to="/officer/applications"
          className="p-2 rounded-lg bg-white border border-[#DDE5E3] text-[#172121] hover:bg-[#F4F8F7] transition-colors"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
        </Link>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-[#034E4E] uppercase tracking-wider">Application Verification</span>
            <span className="text-[11px] bg-[#F4F8F7] text-[#034E4E] px-2 py-0.5 rounded font-mono border border-[#DDE5E3]">
              APP-ID: {id || 'PENDING'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#034E4E] mt-0.5 tracking-tight">
            Government Application Verification View
          </h1>
        </div>
      </div>

      <ErrorAlert
        title="Backend Notice"
        message="Master application details, applicant identity, deed documents, and resolution logs will load from backend database tables."
      />

      {validationError && (
        <div className="p-3.5 rounded bg-[#FEF2F2] border border-[#EF4444]/30 text-[#B91C1C] text-xs font-bold flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-[#B91C1C] shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {actionNotice && (
        <div className="p-3.5 rounded bg-[#ECFDF5] border border-[#10B981]/30 text-[#047857] text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-[#047857] shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Structured Fieldsets Container */}
      <div className="tracia-card p-6 space-y-6">
        {/* Section 1: Citizen Details */}
        <div>
          <h2 className="text-xs font-extrabold text-[#172121] uppercase tracking-wider pb-2 border-b border-[#DDE5E3] flex items-center space-x-2">
            <User className="w-4 h-4 text-[#034E4E]" />
            <span>1. Citizen / Applicant Details</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-xs">
            <div>
              <span className="block font-medium text-[#667085]">Applicant Name</span>
              <span className="font-bold text-[#172121] mt-0.5 block">--</span>
            </div>
            <div>
              <span className="block font-medium text-[#667085]">Citizen Identity ID</span>
              <span className="font-bold text-[#172121] font-mono mt-0.5 block">--</span>
            </div>
            <div>
              <span className="block font-medium text-[#667085]">Contact Phone</span>
              <span className="font-bold text-[#172121] mt-0.5 block">--</span>
            </div>
            <div>
              <span className="block font-medium text-[#667085]">Email Address</span>
              <span className="font-bold text-[#172121] mt-0.5 block">--</span>
            </div>
          </div>
        </div>

        {/* Section 2: Land Details */}
        <div>
          <h2 className="text-xs font-extrabold text-[#172121] uppercase tracking-wider pb-2 border-b border-[#DDE5E3] flex items-center space-x-2">
            <FileText className="w-4 h-4 text-[#034E4E]" />
            <span>2. Associated Land Title Details</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-xs">
            <div>
              <span className="block font-medium text-[#667085]">Survey Number</span>
              <span className="font-bold text-[#172121] font-mono mt-0.5 block">--</span>
            </div>
            <div>
              <span className="block font-medium text-[#667085]">Patta Number</span>
              <span className="font-bold text-[#172121] font-mono mt-0.5 block">--</span>
            </div>
            <div>
              <span className="block font-medium text-[#667085]">Village & Taluk</span>
              <span className="font-bold text-[#172121] mt-0.5 block">--</span>
            </div>
            <div>
              <span className="block font-medium text-[#667085]">Property Extent</span>
              <span className="font-bold text-[#172121] mt-0.5 block">--</span>
            </div>
          </div>
        </div>

        {/* Section 3: Application Details */}
        <div>
          <h2 className="text-xs font-extrabold text-[#172121] uppercase tracking-wider pb-2 border-b border-[#DDE5E3] flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#034E4E]" />
            <span>3. Application Parameters & Justification</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-xs">
            <div>
              <span className="block font-medium text-[#667085]">Application Category</span>
              <span className="font-bold text-[#172121] mt-0.5 block">--</span>
            </div>
            <div>
              <span className="block font-medium text-[#667085]">Submission Date</span>
              <span className="font-bold text-[#172121] mt-0.5 block">--</span>
            </div>
            <div>
              <span className="block font-medium text-[#667085] mb-1">Current Status</span>
              <Badge variant="neutral">Pending Backend Data</Badge>
            </div>
            <div className="sm:col-span-3">
              <span className="block font-medium text-[#667085] mb-1">Applicant Justification Statement</span>
              <div className="p-3.5 bg-[#F4F8F7] border border-[#DDE5E3] rounded-lg text-xs text-[#172121] leading-relaxed">
                Application text statement will load here when connected to the backend API.
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Uploaded Documents */}
        <div>
          <h2 className="text-xs font-extrabold text-[#172121] uppercase tracking-wider pb-2 border-b border-[#DDE5E3] flex items-center space-x-2">
            <Download className="w-4 h-4 text-[#034E4E]" />
            <span>4. Uploaded Deed / Plan Documents</span>
          </h2>
          <div className="mt-3 p-4 bg-[#F4F8F7] border border-[#DDE5E3] rounded-lg text-center text-xs text-[#667085]">
            Document file previews and PDF inspection tools will render here from Supabase Storage.
          </div>
        </div>

        {/* Section 5: Officer Adjudication Controls */}
        <div className="p-5 rounded-xl bg-[#F4F8F7] border border-[#DDE5E3] space-y-4">
          <h3 className="text-xs font-extrabold text-[#172121] uppercase tracking-wider flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-[#034E4E]" />
            <span>Officer Adjudication Remarks & Actions</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-[#172121] mb-1">
              Officer Remarks / Reason <span className="text-rose-600">* (Required for Request Info & Reject)</span>
            </label>
            <textarea
              rows={3}
              value={officerRemarks}
              onChange={(e) => {
                setOfficerRemarks(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder="Enter revenue officer verification remarks, requested document specifications, or rejection rationale..."
              className="w-full px-3 py-2 bg-white border border-[#DDE5E3] rounded-lg text-xs focus:border-[#034E4E] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => handleAction('approve')}
              className="px-4 py-2 bg-[#047857] hover:bg-[#065F46] text-white font-bold text-xs rounded-lg transition-colors flex items-center space-x-1.5 shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve Application</span>
            </button>

            <button
              type="button"
              onClick={() => handleAction('request_info')}
              className="px-4 py-2 bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs rounded-lg transition-colors flex items-center space-x-1.5 shadow-xs"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Request Information</span>
            </button>

            <button
              type="button"
              onClick={() => handleAction('reject')}
              className="px-4 py-2 bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold text-xs rounded-lg transition-colors flex items-center space-x-1.5 shadow-xs"
            >
              <XCircle className="w-4 h-4" />
              <span>Reject Application</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
