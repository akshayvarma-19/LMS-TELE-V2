import React, { useState, useEffect } from 'react';
import { Search, Filter, FileText, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { landService } from '../../services/landService';
import type { LandRecord } from '../../types';

export const CitizenLandRecordsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [villageFilter, setVillageFilter] = useState('');
  const [lands, setLands] = useState<LandRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchLands = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const res = await landService.getMyLandRecords();
        if ((res.status === 'success' || res.success) && res.data) {
          setLands(res.data);
        } else {
          setErrorMsg(res.message || 'Failed to fetch land records.');
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Error connecting to server.');
      } finally {
        setLoading(false);
      }
    };
    fetchLands();
  }, []);

  const filteredLands = lands.filter((land) => {
    const matchSearch =
      land.survey_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      land.patta_number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchVillage =
      !villageFilter ||
      land.village?.toLowerCase().includes(villageFilter.toLowerCase());
    return matchSearch && matchVillage;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#034E4E] tracking-tight">My Land Records</h1>
        <p className="text-xs sm:text-sm text-[#667085] mt-1">
          Registered land holdings and official title documents associated with your identity.
        </p>
      </div>

      {errorMsg && (
        <ErrorAlert
          title="Backend Error"
          message={errorMsg}
        />
      )}

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
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-700" />
          <span className="ml-2 text-sm text-slate-500">Loading land records...</span>
        </div>
      ) : filteredLands.length === 0 ? (
        <EmptyState
          title="No land records found."
          description="No registered land titles matched your search query or your identity has no recorded properties yet."
          icon={<FileText className="w-6 h-6 text-slate-400" />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLands.map((land) => (
            <Link
              key={land.id}
              to={`/citizen/land-records/${land.id}`}
              className="block bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-blue-500 transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-700">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-xs bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-600">
                  {land.document_type || 'Deed'}
                </span>
              </div>
              <div className="mt-4 space-y-2">
                <h3 className="font-bold text-slate-900 text-sm">
                  Survey No: {land.survey_number}
                </h3>
                <p className="text-xs text-slate-500">
                  {land.village}, {land.taluk}, {land.district}
                </p>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                  <div>
                    <span className="block text-[10px] text-slate-400">Patta Number</span>
                    <span className="font-semibold font-mono">{land.patta_number || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400">Property Extent</span>
                    <span className="font-semibold">{land.property_extent || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
