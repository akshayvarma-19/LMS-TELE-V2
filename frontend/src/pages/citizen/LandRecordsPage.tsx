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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Land Records</h1>
          <p className="text-sm text-slate-500 mt-1">
            Registered land holdings and official title documents associated with your identity.
          </p>
        </div>
      </div>

      <ErrorAlert
        title="Backend Service Required"
        message="Your land title holdings will be queried from Supabase when the backend API is active."
      />

      {/* Search & Filter Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by survey number or patta number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
          />
        </div>

        <div className="sm:w-48 relative">
          <Filter className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Filter by village..."
            value={villageFilter}
            onChange={(e) => setVillageFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
          />
        </div>
      </div>

      {/* Land Records List / Empty State */}
      <EmptyState
        title="No land records found."
        description="No registered land titles matched your search query or your identity has no recorded properties yet."
        icon={<FileText className="w-6 h-6 text-slate-400" />}
      />
    </div>
  );
};
