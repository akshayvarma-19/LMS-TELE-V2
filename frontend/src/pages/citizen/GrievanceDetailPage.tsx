import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, FileText, UserCheck, CheckCircle2, Loader2 } from 'lucide-react';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { Badge } from '../../components/common/Badge';
import { grievanceService } from '../../services/grievanceService';
import type { Grievance, GrievanceUpdate } from '../../types';

export const CitizenGrievanceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [grievance, setGrievance] = useState<Grievance | null>(null);
  const [updates, setUpdates] = useState<GrievanceUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchGrievanceDetails = async () => {
      if (!id) return;
      setLoading(true);
      setErrorMsg(null);
      try {
        const [gRes, uRes] = await Promise.all([
          grievanceService.getGrievance(id),
          grievanceService.getGrievanceUpdates(id)
        ]);

        if ((gRes.status === 'success' || gRes.success) && gRes.data) {
          setGrievance(gRes.data);
        } else {
          setErrorMsg(gRes.message || 'Failed to load grievance details.');
        }

        if ((uRes.status === 'success' || uRes.success) && uRes.data) {
          setUpdates(uRes.data);
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Error connecting to server.');
      } finally {
        setLoading(false);
      }
    };
    fetchGrievanceDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-blue-700" />
        <span className="ml-2 text-sm text-slate-500">Loading grievance details...</span>
      </div>
    );
  }

  if (errorMsg || !grievance) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center space-x-3">
          <Link
            to="/citizen/grievances"
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Grievance Not Found</h1>
        </div>
        <ErrorAlert
          title="Failed to Load Details"
          message={errorMsg || 'Could not retrieve details for the specified grievance ticket.'}
        />
      </div>
    );
  }

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
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Grievance Ticket</span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">#{id}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#034E4E] mt-0.5 tracking-tight">Grievance Details & Tracking</h1>
        </div>
      </div>

      {/* Overview Card */}
      <div className="tracia-card p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="block text-xs font-medium text-slate-500">Grievance Number</span>
            <span className="font-semibold text-slate-900 font-mono">{grievance.id.slice(0, 8)}</span>
          </div>
          <div>
            <span className="block text-xs font-medium text-slate-500">Category</span>
            <span className="font-semibold text-slate-800 capitalize">
              {grievance.category.replace(/_/g, ' ')}
            </span>
          </div>
          <div>
            <span className="block text-xs font-medium text-slate-500">Submission Date</span>
            <span className="font-semibold text-slate-800">
              {grievance.created_at ? new Date(grievance.created_at).toLocaleDateString() : 'N/A'}
            </span>
          </div>
          <div>
            <span className="block text-xs font-medium text-slate-500">Current Status</span>
            <Badge variant={
              grievance.status === 'resolved' 
                ? 'success' 
                : grievance.status === 'under_review' 
                ? 'warning' 
                : grievance.status === 'rejected'
                ? 'danger'
                : 'neutral'
            }>
              {grievance.status.replace(/_/g, ' ')}
            </Badge>
          </div>
        </div>

        <div>
          <span className="block text-xs font-medium text-slate-500 mb-1">Grievance Description</span>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 leading-relaxed">
            {grievance.description}
          </div>
        </div>

        {grievance.officer_comment && (
          <div>
            <span className="block text-xs font-medium text-slate-500 mb-1">Assigned Officer Comment</span>
            <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-xl text-sm text-slate-700 italic font-mono">
              {grievance.officer_comment}
            </div>
          </div>
        )}
      </div>

      {/* Status Timeline UI Component */}
      <div className="tracia-card p-6">
        <h2 className="text-xs font-extrabold text-[#101828] uppercase tracking-wider mb-4 flex items-center space-x-2 border-b border-[#D9E2E1] pb-3">
          <Clock className="w-4 h-4 text-[#034E4E]" />
          <span>Resolution Lifecycle Timeline</span>
        </h2>

        {updates.length === 0 ? (
          <div className="text-slate-500 text-xs py-4 pl-4 border-l-2 border-slate-200 ml-4">
            No status change timeline logs found. Initial status is <b>{grievance.status.replace(/_/g, ' ')}</b>.
          </div>
        ) : (
          <div className="relative border-l-2 border-slate-200 ml-4 space-y-6 pl-6 pt-2">
            {updates.map((update, idx) => (
              <div key={update.id || idx} className="relative">
                <div className="absolute -left-[31px] bg-slate-300 rounded-full p-1 border-2 border-white">
                  {update.new_status === 'resolved' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : update.new_status === 'under_review' ? (
                    <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                  ) : (
                    <FileText className="w-3.5 h-3.5 text-slate-600" />
                  )}
                </div>
                <h4 className="text-xs font-bold text-slate-700 font-mono">
                  Status updated to <span className="capitalize">{update.new_status.replace(/_/g, ' ')}</span>
                </h4>
                {update.comment && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 mt-1 max-w-lg leading-relaxed font-mono">
                    {update.comment}
                  </p>
                )}
                <span className="block text-[10px] text-slate-400 mt-1">
                  {new Date(update.created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
