import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, AlertOctagon, CheckCircle2, Clock, FileText, UserCheck } from 'lucide-react';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { Badge } from '../../components/common/Badge';

export const CitizenGrievanceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Link
          to="/citizen/grievances"
          className="p-2 rounded-lg bg-white border border-[#D9E2E1] text-[#101828] hover:bg-[#F4F8F7] transition-colors"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
        </Link>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider">Grievance Ticket</span>
            <span className="text-[11px] bg-[#F4F8F7] text-[#034E4E] px-2 py-0.5 rounded font-mono border border-[#D9E2E1]">
              #{id || 'G-TICKET-ID'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#034E4E] mt-0.5 tracking-tight">Grievance Details & Tracking</h1>
        </div>
      </div>

      <ErrorAlert
        title="Backend Notice"
        message="Live officer resolution status, comments, and status audit updates will be rendered from backend database records."
      />

      {/* Overview Card */}
      <div className="tracia-card p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="block font-medium text-[#667085]">Grievance Number</span>
            <span className="font-bold text-[#101828] font-mono mt-0.5 block">--</span>
          </div>
          <div>
            <span className="block font-medium text-[#667085]">Category</span>
            <span className="font-bold text-[#101828] mt-0.5 block">--</span>
          </div>
          <div>
            <span className="block font-medium text-[#667085]">Submission Date</span>
            <span className="font-bold text-[#101828] mt-0.5 block">--</span>
          </div>
          <div>
            <span className="block font-medium text-[#667085] mb-1">Current Status</span>
            <Badge variant="neutral">Pending Backend</Badge>
          </div>
        </div>

        <div>
          <span className="block text-xs font-bold text-[#101828] mb-1.5">Grievance Description</span>
          <div className="p-4 bg-[#F4F8F7] border border-[#D9E2E1] rounded-md text-xs text-[#101828] leading-relaxed">
            Description will appear here when connected to the backend API.
          </div>
        </div>

        <div>
          <span className="block text-xs font-bold text-[#101828] mb-1.5">Assigned Officer Comment</span>
          <div className="p-4 bg-[#EAF4F3] border border-[#0B6868]/30 rounded-md text-xs text-[#034E4E] italic">
            Officer comments will be posted here during review.
          </div>
        </div>
      </div>

      {/* Status Timeline UI Component */}
      <div className="tracia-card p-6">
        <h2 className="text-xs font-extrabold text-[#101828] uppercase tracking-wider mb-4 flex items-center space-x-2 border-b border-[#D9E2E1] pb-3">
          <Clock className="w-4 h-4 text-[#034E4E]" />
          <span>Resolution Lifecycle Timeline</span>
        </h2>

        <div className="relative border-l-2 border-[#D9E2E1] ml-4 space-y-6 pl-6 pt-2">
          <div className="relative">
            <div className="absolute -left-[31px] bg-[#034E4E] text-white rounded-full p-1 border-2 border-white">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs font-bold text-[#101828]">1. Submitted</h4>
            <p className="text-xs text-[#667085]">Citizen lodges title mismatch report.</p>
          </div>

          <div className="relative">
            <div className="absolute -left-[31px] bg-[#D9E2E1] text-[#667085] rounded-full p-1 border-2 border-white">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs font-bold text-[#667085]">2. Under Review</h4>
            <p className="text-xs text-[#667085]">Revenue officer inspects physical and digital registers.</p>
          </div>

          <div className="relative">
            <div className="absolute -left-[31px] bg-[#D9E2E1] text-[#667085] rounded-full p-1 border-2 border-white">
              <AlertOctagon className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs font-bold text-[#667085]">3. Additional Information Required</h4>
            <p className="text-xs text-[#667085]">Officer requests additional certified deed copies if needed.</p>
          </div>

          <div className="relative">
            <div className="absolute -left-[31px] bg-[#D9E2E1] text-[#667085] rounded-full p-1 border-2 border-white">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs font-bold text-[#667085]">4. Resolved / Rectified</h4>
            <p className="text-xs text-[#667085]">Official registry entry rectified or complaint resolved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
