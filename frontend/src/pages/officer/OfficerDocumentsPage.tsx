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
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#034E4E] tracking-tight">Uploaded Deed Documents & OCR Logs</h1>
        <p className="text-xs sm:text-sm text-[#667085] mt-1">
          Review uploaded paper deeds, extracted metadata, and OCR processing logs.
        </p>
      </div>

      <ErrorAlert
        title="Storage & OCR Notice"
        message="Master deed document files and extracted OCR field tables will load from Supabase Storage & Database."
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
        icon={<FolderKanban className="w-6 h-6 text-[#034E4E]" />}
      />
    </div>
  );
};
