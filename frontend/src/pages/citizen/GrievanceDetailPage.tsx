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
          className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Grievance Ticket</span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">#{id || 'G-TICKET-ID'}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Grievance Details & Tracking</h1>
        </div>
      </div>

      <ErrorAlert
        title="Backend Required"
        message="Live officer resolution status, comments, and status audit updates will be rendered from backend database records."
      />

      {/* Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="block text-xs font-medium text-slate-500">Grievance Number</span>
            <span className="font-semibold text-slate-900 font-mono">--</span>
          </div>
          <div>
            <span className="block text-xs font-medium text-slate-500">Category</span>
            <span className="font-medium text-slate-800">--</span>
          </div>
          <div>
            <span className="block text-xs font-medium text-slate-500">Submission Date</span>
            <span className="font-medium text-slate-800">--</span>
          </div>
          <div>
            <span className="block text-xs font-medium text-slate-500">Current Status</span>
            <Badge variant="neutral">Pending Backend</Badge>
          </div>
        </div>

        <div>
          <span className="block text-xs font-medium text-slate-500 mb-1">Grievance Description</span>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 leading-relaxed">
            Description will appear here when connected to the backend API.
          </div>
        </div>

        <div>
          <span className="block text-xs font-medium text-slate-500 mb-1">Assigned Officer Comment</span>
          <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-xl text-sm text-slate-700 italic">
            Officer comments will be posted here during review.
          </div>
        </div>
      </div>

      {/* Status Timeline UI Component */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center space-x-2">
          <Clock className="w-5 h-5 text-blue-700" />
          <span>Resolution Lifecycle Timeline</span>
        </h2>

        <div className="relative border-l-2 border-slate-200 ml-4 space-y-6 pl-6 pt-2">
          <div className="relative">
            <div className="absolute -left-[31px] bg-slate-300 rounded-full p-1 border-2 border-white">
              <FileText className="w-3.5 h-3.5 text-slate-600" />
            </div>
            <h4 className="text-xs font-bold text-slate-700">1. Submitted</h4>
            <p className="text-xs text-slate-500">Citizen lodges title mismatch report.</p>
          </div>

          <div className="relative">
            <div className="absolute -left-[31px] bg-slate-300 rounded-full p-1 border-2 border-white">
              <UserCheck className="w-3.5 h-3.5 text-slate-600" />
            </div>
            <h4 className="text-xs font-bold text-slate-700">2. Under Review</h4>
            <p className="text-xs text-slate-500">Revenue officer inspects physical and digital registers.</p>
          </div>

          <div className="relative">
            <div className="absolute -left-[31px] bg-slate-300 rounded-full p-1 border-2 border-white">
              <AlertOctagon className="w-3.5 h-3.5 text-slate-600" />
            </div>
            <h4 className="text-xs font-bold text-slate-700">3. Additional Information Required</h4>
            <p className="text-xs text-slate-500">Officer requests additional certified deed copies if needed.</p>
          </div>

          <div className="relative">
            <div className="absolute -left-[31px] bg-slate-300 rounded-full p-1 border-2 border-white">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
            </div>
            <h4 className="text-xs font-bold text-slate-700">4. Resolved / Rectified</h4>
            <p className="text-xs text-slate-500">Official registry entry rectified or complaint resolved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
