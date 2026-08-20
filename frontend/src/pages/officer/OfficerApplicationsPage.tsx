import React, { useState } from 'react';
import { Filter, ClipboardCheck } from 'lucide-react';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorAlert } from '../../components/common/ErrorAlert';

export const OfficerApplicationsPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#034E4E] tracking-tight">
          Application Verification Queue
        </h1>
        <p className="text-xs sm:text-sm text-[#667085] mt-1">
          Review, inspect site parameters, and verify citizen land applications.
        </p>
      </div>

      <ErrorAlert
        title="Application Queue Status"
        message="Citizen land applications (Sale/Transfer, Construction, Land Use Change) will load from the Supabase database when connected."
      />

      {/* Filters */}
      <div className="tracia-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="sm:w-48 relative">
          <Filter className="w-4 h-4 absolute left-3 top-2.5 text-[#667085]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-[#DDE5E3] rounded-md focus:border-[#034E4E] focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="info_required">Information Requested</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="sm:w-56 relative">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-[#DDE5E3] rounded-md focus:border-[#034E4E] focus:outline-none"
          >
            <option value="">All Application Types</option>
            <option value="sale_transfer">Land Sale / Transfer</option>
            <option value="construction_approval">Construction Approval</option>
            <option value="land_use_change">Land Use Change</option>
            <option value="other_approval">Other Approval</option>
          </select>
        </div>
      </div>

      {/* Empty State */}
      <EmptyState
        title="No applications pending verification."
        description="Citizen applications submitted for revenue officer verification will populate into this queue."
        icon={<ClipboardCheck className="w-6 h-6 text-[#034E4E]" />}
      />
    </div>
  );
};
