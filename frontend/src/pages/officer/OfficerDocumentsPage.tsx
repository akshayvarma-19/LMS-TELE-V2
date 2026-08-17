import React, { useState } from 'react';
import { FolderKanban, Filter } from 'lucide-react';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorAlert } from '../../components/common/ErrorAlert';

export const OfficerDocumentsPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Uploaded Deed Documents & OCR Logs</h1>
        <p className="text-sm text-slate-500 mt-1">
          Review uploaded paper deeds, extracted metadata, and OCR processing logs.
        </p>
      </div>

      <ErrorAlert
        title="Storage & OCR Service Status"
        message="Master deed document files and extracted OCR field tables will load from Supabase Storage & Database."
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
            <option value="">All OCR Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Empty State */}
      <EmptyState
        title="No uploaded documents found."
        description="Documents uploaded for optical verification will be listed here with extraction metrics."
        icon={<FolderKanban className="w-6 h-6 text-slate-400" />}
      />
    </div>
  );
};
