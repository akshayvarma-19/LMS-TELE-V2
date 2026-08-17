import React, { useState } from 'react';
import { AlertOctagon, Filter, Plus } from 'lucide-react';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorAlert } from '../../components/common/ErrorAlert';

export const CitizenGrievancesPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('ocr_mismatch');
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const handleSubmitGrievance = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setNotice(null);

    setTimeout(() => {
      setSubmitting(false);
      setNotice('Backend Service Required. Grievances will be lodged directly into the database once backend is connected.');
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Grievances</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track reported title mismatches, survey disputes, and officer resolution status updates.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Raise New Grievance</span>
        </button>
      </div>

      <ErrorAlert
        title="Grievance Service Status"
        message="Submitted grievances and officer review timelines will populate live from the database when connected."
      />

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
            <option value="illegal_mutation">Illegal Mutation Notice</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Empty State */}
      <EmptyState
        title="No grievances submitted yet."
        description="When you lodge a grievance for title verification or boundary resolution, it will appear here."
        icon={<AlertOctagon className="w-6 h-6 text-slate-400" />}
      />

      {/* Raise Grievance Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Lodge Title Grievance</h3>
              <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-slate-600 text-sm">
                ✕
              </button>
            </div>

            {notice && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                {notice}
              </div>
            )}

            <form onSubmit={handleSubmitGrievance} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Grievance Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="ocr_mismatch">OCR Field Mismatch</option>
                  <option value="ownership_dispute">Ownership Dispute</option>
                  <option value="survey_error">Survey Boundary Error</option>
                  <option value="illegal_mutation">Unexplained Title Modification</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description & Supporting Facts</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide detailed explanation of the discrepancy..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Grievance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
