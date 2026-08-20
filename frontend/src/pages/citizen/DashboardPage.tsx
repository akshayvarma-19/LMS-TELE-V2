import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Search,
  Upload,
  AlertOctagon,
  ChevronRight,
  Database,
  Loader2
} from 'lucide-react';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { EmptyState } from '../../components/common/EmptyState';
import { landService } from '../../services/landService';
import { grievanceService } from '../../services/grievanceService';
import type { LandRecord, Grievance } from '../../types';

export const CitizenDashboardPage: React.FC = () => {
  const [lands, setLands] = useState<LandRecord[]>([]);
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const [landsRes, grievancesRes] = await Promise.all([
          landService.getMyLandRecords(),
          grievanceService.getMyGrievances()
        ]);

        if ((landsRes.status === 'success' || landsRes.success) && landsRes.data) {
          setLands(landsRes.data);
        }
        if ((grievancesRes.status === 'success' || grievancesRes.success) && grievancesRes.data) {
          setGrievances(grievancesRes.data);
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to connect to backend services.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6 bg-white text-[#1F1F1F]">
      {/* Page Heading */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#034E4E] tracking-tight">TRACIA Citizen Dashboard</h1>
        <p className="text-sm text-[#526262] mt-1">
          Manage your land records, verify documents and track grievances.
        </p>
      </div>

      {errorMsg && (
        <ErrorAlert
          title="Service Connection Error"
          message={errorMsg}
        />
      )}

      {/* Quick Actions Grid (2 columns) */}
      <div>
        <h2 className="text-sm font-bold text-[#1F1F1F] uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Action 1: View My Land Records */}
          <Link
            to="/citizen/land-records"
            className="p-4 bg-white rounded-lg border border-[#E5E5E5] hover:border-[rgb(17,110,110)] transition-all flex items-start space-x-3.5 group"
          >
            <div className="w-9 h-9 rounded bg-white border border-[#E5E5E5] text-[rgb(3,78,78)] flex items-center justify-center shrink-0 group-hover:bg-[rgb(3,78,78)] group-hover:text-white transition-colors">
              <FileText className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-semibold text-[#1F1F1F] text-sm group-hover:text-[rgb(3,78,78)] transition-colors">
                View My Land Records
              </h3>
              <p className="text-xs text-[#1F1F1F]/70 mt-0.5">Access verified ownership details and official titles.</p>
            </div>
          </Link>

          {/* Action 2: Search Land Records */}
          <Link
            to="/citizen/search"
            className="p-4 bg-white rounded-lg border border-[#E5E5E5] hover:border-[rgb(17,110,110)] transition-all flex items-start space-x-3.5 group"
          >
            <div className="w-9 h-9 rounded bg-white border border-[#E5E5E5] text-[rgb(3,78,78)] flex items-center justify-center shrink-0 group-hover:bg-[rgb(3,78,78)] group-hover:text-white transition-colors">
              <Search className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-semibold text-[#1F1F1F] text-sm group-hover:text-[rgb(3,78,78)] transition-colors">
                Search Land Records
              </h3>
              <p className="text-xs text-[#1F1F1F]/70 mt-0.5">Search public registry records by survey number or village.</p>
            </div>
          </Link>

          {/* Action 3: Upload Document */}
          <Link
            to="/citizen/ocr"
            className="p-4 bg-white rounded-lg border border-[#E5E5E5] hover:border-[rgb(17,110,110)] transition-all flex items-start space-x-3.5 group"
          >
            <div className="w-9 h-9 rounded bg-white border border-[#E5E5E5] text-[rgb(3,78,78)] flex items-center justify-center shrink-0 group-hover:bg-[rgb(3,78,78)] group-hover:text-white transition-colors">
              <Upload className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-semibold text-[#1F1F1F] text-sm group-hover:text-[rgb(3,78,78)] transition-colors">
                Upload Document
              </h3>
              <p className="text-xs text-[#1F1F1F]/70 mt-0.5">Verify physical deed document accuracy using OCR.</p>
            </div>
          </Link>

          {/* Action 4: Track Grievance */}
          <Link
            to="/citizen/grievances"
            className="p-4 bg-white rounded-lg border border-[#E5E5E5] hover:border-[rgb(17,110,110)] transition-all flex items-start space-x-3.5 group"
          >
            <div className="w-9 h-9 rounded bg-white border border-[#E5E5E5] text-[rgb(3,78,78)] flex items-center justify-center shrink-0 group-hover:bg-[rgb(3,78,78)] group-hover:text-white transition-colors">
              <AlertOctagon className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-semibold text-[#1F1F1F] text-sm group-hover:text-[rgb(3,78,78)] transition-colors">
                Track Grievance
              </h3>
              <p className="text-xs text-[#1F1F1F]/70 mt-0.5">Check current resolution status and revenue officer updates.</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Main Two-Column Layout (My Land Records & Recent Grievances) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: My Land Records */}
        <div className="bg-white rounded-lg border border-[#E5E5E5] p-5 flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E5E5E5]">
            <h2 className="text-sm font-bold text-[#1F1F1F] flex items-center space-x-2">
              <FileText className="w-4.5 h-4.5 text-[rgb(3,78,78)]" />
              <span>My Land Records</span>
            </h2>
            <Link to="/citizen/land-records" className="text-xs font-semibold text-[rgb(17,110,110)] hover:underline flex items-center">
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8 flex-1">
              <Loader2 className="w-6 h-6 animate-spin text-[rgb(3,78,78)]" />
            </div>
          ) : lands.length === 0 ? (
            <EmptyState
              title="No land records available."
              description="Your registered land properties will appear here automatically."
              icon={<Database className="w-5 h-5 text-[rgb(30,139,139)]" />}
            />
          ) : (
            <div className="space-y-3">
              {lands.slice(0, 3).map((land) => (
                <Link
                  key={land.id}
                  to={`/citizen/land-records/${land.id}`}
                  className="block p-3 rounded-lg border border-[#E5E5E5] hover:border-[rgb(3,78,78)] transition-all text-xs"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800">Survey No: {land.survey_number}</span>
                    <span className="font-mono text-slate-500">{land.village}</span>
                  </div>
                  <div className="mt-1 flex justify-between text-slate-500 text-[10px]">
                    <span>Patta: {land.patta_number || 'N/A'}</span>
                    <span>Extent: {land.property_extent || 'N/A'}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Recent Grievances */}
        <div className="bg-white rounded-lg border border-[#E5E5E5] p-5 flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E5E5E5]">
            <h2 className="text-sm font-bold text-[#1F1F1F] flex items-center space-x-2">
              <AlertOctagon className="w-4.5 h-4.5 text-[rgb(3,78,78)]" />
              <span>Recent Grievances</span>
            </h2>
            <Link to="/citizen/grievances" className="text-xs font-semibold text-[rgb(17,110,110)] hover:underline flex items-center">
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8 flex-1">
              <Loader2 className="w-6 h-6 animate-spin text-[rgb(3,78,78)]" />
            </div>
          ) : grievances.length === 0 ? (
            <EmptyState
              title="No grievances submitted yet."
              description="Any grievances submitted by you will be listed here with live resolution status tracking."
              icon={<AlertOctagon className="w-5 h-5 text-[rgb(30,139,139)]" />}
            />
          ) : (
            <div className="space-y-3">
              {grievances.slice(0, 3).map((g) => (
                <Link
                  key={g.id}
                  to={`/citizen/grievances/${g.id}`}
                  className="block p-3 rounded-lg border border-[#E5E5E5] hover:border-[rgb(3,78,78)] transition-all text-xs"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800 capitalize">{g.category.replace(/_/g, ' ')}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full uppercase ${
                      g.status === 'resolved' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : g.status === 'under_review' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>{g.status.replace(/_/g, ' ')}</span>
                  </div>
                  <p className="mt-1 text-[#526262] text-[10px] line-clamp-1">{g.description}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
