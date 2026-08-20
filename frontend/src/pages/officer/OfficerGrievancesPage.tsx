import React, { useState } from 'react';
import { AlertOctagon, Filter } from 'lucide-react';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorAlert } from '../../components/common/ErrorAlert';

export const OfficerGrievancesPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#034E4E] tracking-tight">Grievance Management Queue</h1>
        <p className="text-xs sm:text-sm text-[#667085] mt-1">
          Review, assign, request clarification, or resolve citizen title discrepancy petitions.
        </p>
      </div>

      <ErrorAlert
        title="Work Queue Notice"
        message="Master grievance tickets and resolution timeline updates will sync with the database via backend endpoints."
      />

      {/* Filters */}
      <div className="tracia-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="sm:w-48 relative">
          <Filter className="w-4 h-4 absolute left-3 top-2.5 text-[#667085]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-[#D9E2E1] rounded-md focus:border-[#034E4E] focus:outline-none"
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
            className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-[#D9E2E1] rounded-md focus:border-[#034E4E] focus:outline-none"
          >
            <option value="">All Categories</option>
            <option value="ocr_mismatch">OCR Field Mismatch</option>
            <option value="ownership_dispute">Ownership Dispute</option>
            <option value="survey_error">Survey Error</option>
            <option value="illegal_mutation">Illegal Mutation Notice</option>
          </select>
        </div>
      </div>

      {/* Empty State */}
      <EmptyState
        title="No pending grievances found."
        description="Grievance petitions lodged by citizens will load into this administrative list."
        icon={<AlertOctagon className="w-6 h-6 text-[#034E4E]" />}
      />
    </div>
  );
};
