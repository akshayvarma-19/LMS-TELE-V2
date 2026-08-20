import React, { useState } from 'react';
import { Search, Filter, FileText } from 'lucide-react';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorAlert } from '../../components/common/ErrorAlert';

export const CitizenLandRecordsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [villageFilter, setVillageFilter] = useState('');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#034E4E] tracking-tight">My Land Records</h1>
        <p className="text-xs sm:text-sm text-[#667085] mt-1">
          Registered land holdings and official title documents associated with your identity.
        </p>
      </div>

      <ErrorAlert
        title="Backend Service Notice"
        message="Your land title holdings will be queried live from TRACIA registry when connected."
      />

      {/* Search & Filter Controls */}
      <div className="tracia-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#667085]" />
          <input
            type="text"
            placeholder="Search by survey number or patta number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-[#D9E2E1] rounded-md focus:border-[#034E4E] focus:outline-none"
          />
        </div>

        <div className="sm:w-48 relative">
          <Filter className="w-4 h-4 absolute left-3 top-2.5 text-[#667085]" />
          <input
            type="text"
            placeholder="Filter by village..."
            value={villageFilter}
            onChange={(e) => setVillageFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-[#D9E2E1] rounded-md focus:border-[#034E4E] focus:outline-none"
          />
        </div>
      </div>

      {/* Land Records List / Empty State */}
      <EmptyState
        title="No land records found."
        description="No registered land titles matched your search query or your identity has no recorded properties yet."
        icon={<FileText className="w-6 h-6 text-[#034E4E]" />}
      />
    </div>
  );
};
