import React, { useState } from 'react';
import { ShieldAlert, Filter } from 'lucide-react';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorAlert } from '../../components/common/ErrorAlert';

export const OfficerAnomaliesPage: React.FC = () => {
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#034E4E] tracking-tight">Anomaly Management & Risk Investigation</h1>
        <p className="text-xs sm:text-sm text-[#667085] mt-1">
          Automated risk score evaluation, title overlap detection, and suspicious transfer flags.
        </p>
      </div>

      <ErrorAlert
        title="Anomaly Analytical Notice"
        message="Backend workers perform server-side title comparison algorithms to compute risk scores and flag potential fraud patterns."
      />

      {/* Filters */}
      <div className="tracia-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="sm:w-48 relative">
          <Filter className="w-4 h-4 absolute left-3 top-2.5 text-[#667085]" />
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-[#D9E2E1] rounded-md focus:border-[#034E4E] focus:outline-none"
          >
            <option value="">All Severities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div className="sm:w-48 relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-[#D9E2E1] rounded-md focus:border-[#034E4E] focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="detected">Detected</option>
            <option value="under_review">Under Review</option>
            <option value="reviewed">Reviewed</option>
            <option value="false_positive">False Positive</option>
          </select>
        </div>
      </div>

      {/* Empty State */}
      <EmptyState
        title="No anomaly records detected."
        description="Records flagged by automated background analytical algorithms will appear in this review queue."
        icon={<ShieldAlert className="w-6 h-6 text-[#034E4E]" />}
      />
    </div>
  );
};
