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
          className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Officer Review Action</span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">#{id || 'G-TICKET-ID'}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Grievance Adjudication</h1>
        </div>
      </div>

      <ErrorAlert
        title="Backend Status"
        message="Changing grievance status logs audit details and notifies citizens via email / notification panel."
      />

      {actionNotice && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
          {actionNotice}
        </div>
      )}

      {/* Ticket Details */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="block text-xs font-medium text-slate-500">Ticket Number</span>
            <span className="font-semibold text-slate-900 font-mono">--</span>
          </div>
          <div>
            <span className="block text-xs font-medium text-slate-500">Citizen ID</span>
            <span className="font-medium text-slate-800 font-mono">--</span>
          </div>
          <div>
            <span className="block text-xs font-medium text-slate-500">Land Title Reference</span>
            <span className="font-medium text-slate-800 font-mono">--</span>
          </div>
          <div>
            <span className="block text-xs font-medium text-slate-500">Current Status</span>
            <Badge variant="neutral">Pending Backend</Badge>
          </div>
        </div>

        {/* Officer Action Form Controls */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-blue-700" />
            <span>Adjudication & Officer Findings</span>
          </h3>

          <textarea
            rows={3}
            value={officerComment}
            onChange={(e) => setOfficerComment(e.target.value)}
            placeholder="Enter official revenue findings, verification remarks, or instructions for citizen..."
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
          />

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={() => handleOfficerAction('Under Review')}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
            >
              Mark Under Review
            </button>
            <button
              onClick={() => handleOfficerAction('Request Additional Info')}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
            >
              Request Additional Info
            </button>
            <button
              onClick={() => handleOfficerAction('Resolve')}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
            >
              Resolve Grievance
            </button>
            <button
              onClick={() => handleOfficerAction('Reject')}
              className="px-4 py-2 bg-rose-700 hover:bg-rose-600 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
            >
              Reject Petition
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
