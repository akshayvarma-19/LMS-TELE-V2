import React, { useState, useEffect } from 'react';
import { AlertOctagon, Filter, Loader2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { grievanceService } from '../../services/grievanceService';
import type { Grievance } from '../../types';

export const OfficerGrievancesPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchGrievances = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const res = await grievanceService.getAllGrievances({
          status: statusFilter || undefined,
          category: categoryFilter || undefined
        });

        if ((res.status === 'success' || res.success) && res.data) {
          setGrievances(res.data);
        } else {
          setErrorMsg(res.message || 'Failed to fetch grievances queue.');
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Error connecting to server.');
      } finally {
        setLoading(false);
      }
    };
    fetchGrievances();
  }, [statusFilter, categoryFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Grievance Management Queue</h1>
        <p className="text-sm text-slate-500 mt-1">
          Review, assign, request clarification, or resolve citizen title discrepancy petitions.
        </p>
      </div>

      {errorMsg && (
        <ErrorAlert
          title="Backend Error"
          message={errorMsg}
        />
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="sm:w-48 relative">
          <Filter className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="info_required">Additional Info Required</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="sm:w-56 relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">All Categories</option>
            <option value="ocr_mismatch">OCR Field Mismatch</option>
            <option value="ownership_dispute">Ownership Dispute</option>
            <option value="survey_error">Survey Boundary Error</option>
            <option value="illegal_mutation">Unexplained Title Modification</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Grievances List / Empty State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#034E4E]" />
          <span className="ml-2 text-sm text-slate-500">Loading grievances queue...</span>
        </div>
      ) : grievances.length === 0 ? (
        <EmptyState
          title="No pending grievances found."
          description="Grievance petitions lodged by citizens will load into this administrative list."
          icon={<AlertOctagon className="w-6 h-6 text-slate-400" />}
        />
      ) : (
        <div className="space-y-4">
          {grievances.map((g) => (
            <Link
              key={g.id}
              to={`/officer/grievances/${g.id}`}
              className="block bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-blue-500 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm capitalize">
                      {g.category.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-mono">
                      ID: {g.id.slice(0, 8)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">{g.description}</p>
                </div>
                
                <div className="flex items-center space-x-3 self-end sm:self-auto shrink-0">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full uppercase ${
                    g.status === 'resolved' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : g.status === 'under_review' 
                      ? 'bg-blue-100 text-blue-800' 
                      : g.status === 'rejected'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {g.status.replace(/_/g, ' ')}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
