import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Loader2, Clock, CheckCircle2, UserCheck, FileText } from 'lucide-react';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { Badge } from '../../components/common/Badge';
import { grievanceService } from '../../services/grievanceService';
import type { Grievance, GrievanceUpdate } from '../../types';

export const OfficerGrievanceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [grievance, setGrievance] = useState<Grievance | null>(null);
  const [updates, setUpdates] = useState<GrievanceUpdate[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [officerComment, setOfficerComment] = useState('');

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

  useEffect(() => {
    fetchGrievanceDetails();
  }, [id]);

  const handleOfficerAction = async (newStatus: Grievance['status']) => {
    if (!id) return;
    if (!officerComment.trim()) {
      setActionNotice('Please enter official remarks or comments explaining the decision.');
      return;
    }
    
    setSubmitting(true);
    setActionNotice(null);
    try {
      const res = await grievanceService.updateGrievanceStatus(id, newStatus, officerComment.trim());
      if (res.status === 'success' || res.success) {
        setOfficerComment('');
        setActionNotice(`Successfully updated grievance status to: ${newStatus}`);
        fetchGrievanceDetails();
      } else {
        setActionNotice(res.message || 'Failed to update grievance status.');
      }
    } catch (err: any) {
      setActionNotice(err.message || 'Error submitting action.');
    } finally {
      setSubmitting(false);
    }
  };

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
            to="/officer/grievances"
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
      <div className="flex items-center space-x-3">
        <Link
          to="/officer/grievances"
          className="p-2 rounded-lg bg-white border border-[#D9E2E1] text-[#101828] hover:bg-[#F4F8F7] transition-colors"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
        </Link>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Officer Review Action</span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">#{id}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#034E4E] mt-0.5 tracking-tight">Grievance Adjudication</h1>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3 rounded bg-[#F4F8F7] border border-[#D9E2E1] text-xs text-[#034E4E]">
          {actionNotice}
        </div>
      )}

      {/* Ticket Details */}
      <div className="tracia-card p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="block text-xs font-medium text-slate-500">Ticket Number</span>
            <span className="font-semibold text-slate-900 font-mono">{grievance.id.slice(0, 8)}</span>
          </div>
          <div>
            <span className="block text-xs font-medium text-slate-500">Category</span>
            <span className="font-semibold text-slate-900 capitalize">{grievance.category.replace(/_/g, ' ')}</span>
          </div>
          <div>
            <span className="block text-xs font-medium text-slate-500">Land Title Reference</span>
            <span className="font-semibold text-slate-800 font-mono">{grievance.land_id.slice(0, 8)}</span>
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
            <span className="block text-xs font-medium text-slate-500 mb-1">Previous Officer Remarks</span>
            <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-xl text-sm text-slate-700 italic">
              {grievance.officer_comment}
            </div>
          </div>
        )}

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
              onClick={() => handleOfficerAction('under_review')}
              disabled={submitting}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors disabled:opacity-50"
            >
              Mark Under Review
            </button>
            <button
              onClick={() => handleOfficerAction('info_required')}
              disabled={submitting}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors disabled:opacity-50"
            >
              Request Info
            </button>
            <button
              onClick={() => handleOfficerAction('resolved')}
              disabled={submitting}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors disabled:opacity-50"
            >
              Resolve Grievance
            </button>
            <button
              onClick={() => handleOfficerAction('rejected')}
              disabled={submitting}
              className="px-4 py-2 bg-rose-700 hover:bg-rose-600 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors disabled:opacity-50"
            >
              Reject Petition
            </button>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center space-x-2">
          <Clock className="w-5 h-5 text-blue-700" />
          <span>Resolution Lifecycle Timeline</span>
        </h2>

        {updates.length === 0 ? (
          <div className="text-slate-500 text-xs py-4 pl-4 border-l-2 border-slate-200 ml-4">
            No status updates logged yet. Current status: <b>{grievance.status.replace(/_/g, ' ')}</b>.
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
