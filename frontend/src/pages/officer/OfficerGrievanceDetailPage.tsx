import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { Badge } from '../../components/common/Badge';

export const OfficerGrievanceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [officerComment, setOfficerComment] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleOfficerAction = (action: string) => {
    setActionNotice(`Backend Connection Required. Action "${action}" with comment will trigger grievance_updates row creation when backend API is live.`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center space-x-3">
        <Link
          to="/officer/grievances"
          className="p-2 rounded-lg bg-white border border-[#D9E2E1] text-[#101828] hover:bg-[#F4F8F7] transition-colors"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
        </Link>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider">Officer Review Action</span>
            <span className="text-[11px] bg-[#F4F8F7] text-[#034E4E] px-2 py-0.5 rounded font-mono border border-[#D9E2E1]">#{id || 'G-TICKET-ID'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#034E4E] mt-0.5 tracking-tight">Grievance Adjudication</h1>
        </div>
      </div>

      <ErrorAlert
        title="Backend Notice"
        message="Changing grievance status logs audit details and notifies citizens via notification panel."
      />

      {actionNotice && (
        <div className="p-3 rounded bg-[#F4F8F7] border border-[#D9E2E1] text-xs text-[#034E4E]">
          {actionNotice}
        </div>
      )}

      {/* Ticket Details */}
      <div className="tracia-card p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="block font-medium text-[#667085]">Ticket Number</span>
            <span className="font-bold text-[#101828] font-mono mt-0.5 block">--</span>
          </div>
          <div>
            <span className="block font-medium text-[#667085]">Citizen ID</span>
            <span className="font-bold text-[#101828] font-mono mt-0.5 block">--</span>
          </div>
          <div>
            <span className="block font-medium text-[#667085]">Land Title Reference</span>
            <span className="font-bold text-[#101828] font-mono mt-0.5 block">--</span>
          </div>
          <div>
            <span className="block font-medium text-[#667085] mb-1">Current Status</span>
            <Badge variant="neutral">Pending Backend</Badge>
          </div>
        </div>

        {/* Officer Action Form Controls */}
        <div className="p-5 rounded-lg bg-[#F4F8F7] border border-[#D9E2E1] space-y-4">
          <h3 className="text-xs font-extrabold text-[#101828] uppercase tracking-wider flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-[#034E4E]" />
            <span>Adjudication & Officer Findings</span>
          </h3>

          <textarea
            rows={3}
            value={officerComment}
            onChange={(e) => setOfficerComment(e.target.value)}
            placeholder="Enter official revenue findings, verification remarks, or instructions for citizen..."
            className="w-full px-3 py-2 bg-white border border-[#D9E2E1] rounded-md text-xs focus:border-[#034E4E] focus:outline-none"
          />

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={() => handleOfficerAction('Under Review')}
              className="tracia-btn-primary text-xs"
            >
              Mark Under Review
            </button>
            <button
              onClick={() => handleOfficerAction('Request Additional Info')}
              className="tracia-btn-secondary text-xs"
            >
              Request Info
            </button>
            <button
              onClick={() => handleOfficerAction('Resolve')}
              className="px-3.5 py-1.5 bg-[#047857] hover:bg-[#065F46] text-white font-bold text-xs rounded-md transition-colors"
            >
              Resolve Grievance
            </button>
            <button
              onClick={() => handleOfficerAction('Reject')}
              className="px-3.5 py-1.5 bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold text-xs rounded-md transition-colors"
            >
              Reject Petition
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
