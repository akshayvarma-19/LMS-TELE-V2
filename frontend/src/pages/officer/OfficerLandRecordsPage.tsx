import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, PlusCircle, FileText, Loader2, ArrowRight } from 'lucide-react';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { landService } from '../../services/landService';
import type { LandRecord } from '../../types';

export const OfficerLandRecordsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [lands, setLands] = useState<LandRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchLands = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const res = await landService.getAllLandRecords();
        if ((res.success || res.status === 'success') && res.data) {
          setLands(res.data);
        } else {
          setErrorMsg(res.message || 'Failed to load master registry records.');
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to connect to the backend server.');
      } finally {
        setLoading(false);
      }
    };
    fetchLands();
  }, []);

  const filteredLands = lands.filter((land) => {
    const matchSearch =
      !searchTerm ||
      land.survey_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      land.patta_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      land.owner_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      land.land_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDistrict =
      !districtFilter ||
      land.district?.toLowerCase().includes(districtFilter.toLowerCase());
    return matchSearch && matchDistrict;
  });

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

      {errorMsg && (
        <ErrorAlert
          title="Registry Fetch Error"
          message={errorMsg}
        />
      )}

      {/* Search & Filters */}
      <div className="tracia-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#667085]" />
          <input
            type="text"
            placeholder="Search by survey, patta, land ID, or owner name..."
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

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#034E4E]" />
          <p className="text-xs text-[#667085] font-semibold">Synchronizing registry table...</p>
        </div>
      ) : filteredLands.length === 0 ? (
        <EmptyState
          title="No land records found."
          description={
            searchTerm || districtFilter
              ? "No registered land titles matched your search query. Try clearing filters."
              : "The registry currently has no properties recorded in the database."
          }
          icon={<FileText className="w-6 h-6 text-[#034E4E]" />}
        />
      ) : (
        /* Administrative Land Registry Table */
        <div className="tracia-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#F4F8F7] border-b border-[#D9E2E1] text-[#034E4E] uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Land ID</th>
                  <th className="p-4">Survey & Patta</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Owner Name</th>
                  <th className="p-4">Extent / Type</th>
                  <th className="p-4">Document No</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFAFA]/20 text-[#101828]">
                {filteredLands.map((land) => (
                  <tr key={land.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-600">
                      {land.land_id || 'N/A'}
                    </td>
                    <td className="p-4">
                      <div className="font-bold">Survey: {land.survey_number}</div>
                      <div className="text-[10px] text-slate-500 font-mono">Patta: {land.patta_number || 'N/A'}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold">{land.village}</div>
                      <div className="text-[10px] text-slate-500">{land.taluk}, {land.district}</div>
                    </td>
                    <td className="p-4 font-semibold text-slate-900">
                      {land.owner_name || 'N/A'}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold">{land.property_extent || 'N/A'}</div>
                      <div className="text-[10px] text-slate-500 capitalize">{land.land_type || 'N/A'}</div>
                    </td>
                    <td className="p-4 font-mono text-slate-500 text-[11px]">
                      {land.document_number || 'N/A'}
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        to={`/officer/land-records/${land.id}`}
                        className="inline-flex items-center space-x-1 text-[#034E4E] hover:text-[#023B3B] font-bold text-xs bg-[#F4F8F7] hover:bg-[#D9E2E1] py-1.5 px-3 rounded-md transition-all"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
