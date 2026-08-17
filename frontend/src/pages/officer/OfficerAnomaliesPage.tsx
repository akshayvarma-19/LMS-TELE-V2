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
        <h1 className="text-2xl font-bold text-slate-900">Anomaly Management & Risk Investigation</h1>
        <p className="text-sm text-slate-500 mt-1">
          Automated risk score evaluation, title overlap detection, and suspicious transfer flags.
        </p>
      </div>

      <ErrorAlert
        title="Anomaly Analytical Service Required"
        message="Backend workers perform server-side title comparison algorithms to compute risk scores and flag potential fraud patterns."
      />

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="sm:w-48 relative">
          <Filter className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
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
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
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
        icon={<ShieldAlert className="w-6 h-6 text-slate-400" />}
      />
    </div>
  );
};
