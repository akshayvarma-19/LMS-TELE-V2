import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, FileText, CheckCircle2, AlertTriangle, XCircle, MessageSquare, ShieldCheck, Download, Loader2 } from 'lucide-react';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { Badge } from '../../components/common/Badge';
import { applicationService } from '../../services/applicationService';
import type { ApplicationRecord } from '../../types';

export const OfficerApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [app, setApp] = useState<ApplicationRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [officerRemarks, setOfficerRemarks] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const fetchDetail = async () => {
    if (!id) return;
    setLoading(true);
    setValidationError(null);
    try {
      const res = await applicationService.getApplication(id);
      if ((res.status === 'success' || res.success) && res.data) {
        setApp(res.data);
        setOfficerRemarks(res.data.officer_remarks || '');
      } else {
        setValidationError(res.message || 'Failed to fetch application details.');
      }
    } catch (err: any) {
      console.error('Error fetching application detail:', err);
      setValidationError(err.message || 'Error connecting to application service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleAction = async (actionType: 'approve' | 'request_info' | 'reject') => {
    setValidationError(null);
    setActionNotice(null);

    if (!id) return;

    // Require remarks before Request Information or Reject
    if ((actionType === 'request_info' || actionType === 'reject') && !officerRemarks.trim()) {
      setValidationError(`Officer remarks/reason are required before taking action: "${actionType === 'request_info' ? 'Request Information' : 'Reject'}"`);
      return;
    }

    try {
      setLoading(true);
      const res = await applicationService.adjudicateApplication(id, actionType, officerRemarks.trim());

      if (res.success || res.status === 'success') {
        const actionTitles = {
          approve: 'Approved',
          request_info: 'Information Requested',
          reject: 'Rejected',
        };
        setActionNotice(`Application successfully ${actionTitles[actionType]}!`);
        setTimeout(() => {
          navigate('/officer/applications');
        }, 1500);
      } else {
        setValidationError(res.message || 'Failed to adjudicate application.');
      }
    } catch (err: any) {
      setValidationError(err.message || 'An error occurred during adjudication.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'danger';
      case 'info_required':
        return 'warning';
      case 'under_review':
        return 'info';
      default:
        return 'neutral';
    }
  };

  const getCategoryLabel = (cat: string) => {
    const typeLabels: Record<string, string> = {
      'sale_transfer': 'Land Sale / Transfer',
      'construction_approval': 'Construction Approval',
      'land_use_change': 'Land Use Change',
      'other_approval': 'Other Approval'
    };
    return typeLabels[cat] || cat;
  };

  if (loading && !app) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-[#034E4E]" />
        <span className="ml-2 text-xs text-slate-500 font-semibold">Loading application details...</span>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center space-x-3">
          <Link
            to="/officer/applications"
            className="p-2 rounded-lg bg-white border border-[#DDE5E3] text-[#172121] hover:bg-[#F4F8F7] transition-colors"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </Link>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#034E4E] tracking-tight">Application Not Found</h1>
        </div>
        <ErrorAlert
          title="Not Found"
          message={validationError || 'Could not load details for the selected application ID.'}
        />
      </div>
    );
  }

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
              APP-ID: {app.id}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#034E4E] mt-0.5 tracking-tight">
            Government Application Verification View
          </h1>
        </div>
      </div>

      {validationError && (
        <div className="p-3.5 rounded bg-[#FEF2F2] border border-[#EF4444]/30 text-[#B91C1C] text-xs font-bold flex items-center space-x-2 animate-pulse">
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
              <span className="font-bold text-[#172121] mt-0.5 block">{app.applicant_name}</span>
            </div>
            <div>
              <span className="block font-medium text-[#667085]">Citizen Identity ID</span>
              <span className="font-bold text-[#172121] font-mono mt-0.5 block">{app.citizen_id}</span>
            </div>
            <div>
              <span className="block font-medium text-[#667085]">Contact Phone</span>
              <span className="font-bold text-[#172121] mt-0.5 block">{app.phone || 'N/A'}</span>
            </div>
            <div>
              <span className="block font-medium text-[#667085]">Email Address</span>
              <span className="font-bold text-[#172121] mt-0.5 block">{app.email || 'N/A'}</span>
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
              <span className="font-bold text-[#172121] font-mono mt-0.5 block">{app.survey_number}</span>
            </div>
            <div>
              <span className="block font-medium text-[#667085]">Patta Number</span>
              <span className="font-bold text-[#172121] font-mono mt-0.5 block">{app.patta_number}</span>
            </div>
            <div>
              <span className="block font-medium text-[#667085]">Village & Taluk</span>
              <span className="font-bold text-[#172121] mt-0.5 block">{app.village}, {app.taluk}</span>
            </div>
            <div>
              <span className="block font-medium text-[#667085]">Property Extent</span>
              <span className="font-bold text-[#172121] mt-0.5 block">{app.property_extent}</span>
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
              <span className="font-bold text-[#172121] mt-0.5 block">{getCategoryLabel(app.type)}</span>
            </div>
            <div>
              <span className="block font-medium text-[#667085]">Submission Date</span>
              <span className="font-bold text-[#172121] mt-0.5 block">
                {new Date(app.created_at).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="block font-medium text-[#667085] mb-1">Current Status</span>
              <Badge variant={getStatusBadgeVariant(app.status)}>
                {app.status.replace('_', ' ')}
              </Badge>
            </div>
            <div className="sm:col-span-3">
              <span className="block font-medium text-[#667085] mb-1">Applicant Justification Statement</span>
              <div className="p-3.5 bg-[#F4F8F7] border border-[#DDE5E3] rounded-lg text-xs text-[#172121] leading-relaxed">
                {app.details}
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
          <div className="mt-3 p-4 bg-[#F4F8F7] border border-[#DDE5E3] rounded-lg text-xs flex justify-between items-center">
            <div className="flex items-center space-x-2 text-slate-700">
              <FileText className="w-4 h-4 text-[#034E4E]" />
              <span className="font-semibold font-mono">{app.document_name}</span>
            </div>
            <button
              onClick={() => alert(`Downloading document: ${app.document_name}`)}
              className="px-3 py-1.5 bg-white border border-[#DDE5E3] hover:bg-[#EAF4F3] text-[#034E4E] font-bold text-[10px] rounded-lg cursor-pointer transition-all"
            >
              Download Deed
            </button>
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
              className="px-4 py-2 bg-[#047857] hover:bg-[#065F46] text-white font-bold text-xs rounded-lg transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve Application</span>
            </button>

            <button
              type="button"
              onClick={() => handleAction('request_info')}
              className="px-4 py-2 bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs rounded-lg transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Request Information</span>
            </button>

            <button
              type="button"
              onClick={() => handleAction('reject')}
              className="px-4 py-2 bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold text-xs rounded-lg transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer"
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
