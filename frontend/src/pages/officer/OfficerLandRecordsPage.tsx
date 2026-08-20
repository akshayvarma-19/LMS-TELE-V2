import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, PlusCircle, FileText } from 'lucide-react';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorAlert } from '../../components/common/ErrorAlert';

export const OfficerLandRecordsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#034E4E] tracking-tight">Land Title Registry</h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-1">
            Complete official land title records database with full 16-field administrative visibility.
          </p>
        </div>

        <Link
          to="/officer/land-records/new"
          className="tracia-btn-primary inline-flex items-center space-x-2 text-xs self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Land Record</span>
        </Link>
      </div>

      <ErrorAlert
        title="Database Notice"
        message="Master registry land records will load directly from the Supabase PostgreSQL database once connected."
      />

      {/* Search & Filters */}
      <div className="tracia-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#667085]" />
          <input
            type="text"
            placeholder="Search by survey number, patta number, or owner name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-[#D9E2E1] rounded-md focus:border-[#034E4E] focus:outline-none"
          />
        </div>

        <div className="sm:w-48 relative">
          <Filter className="w-4 h-4 absolute left-3 top-2.5 text-[#667085]" />
          <input
            type="text"
            placeholder="Filter by district..."
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-[#D9E2E1] rounded-md focus:border-[#034E4E] focus:outline-none"
          />
        </div>
      </div>

      {/* Empty State */}
      <EmptyState
        title="No land records found."
        description="Master registry entries will appear in an administrative table once backend connection is active."
        icon={<FileText className="w-6 h-6 text-[#034E4E]" />}
      />
    </div>
  );
};
