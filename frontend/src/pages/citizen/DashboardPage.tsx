import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Search,
  Upload,
  AlertOctagon,
  ChevronRight,
  Database,
  Map,
  ArrowRight,
  ClipboardList,
  Loader2
} from 'lucide-react';
import { EmptyState } from '../../components/common/EmptyState';
import { Badge } from '../../components/common/Badge';
import { landService } from '../../services/landService';
import { grievanceService } from '../../services/grievanceService';
import type { LandRecord, Grievance } from '../../types';

export const CitizenDashboardPage: React.FC = () => {
  const [lands, setLands] = useState<LandRecord[]>([]);
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loadingLands, setLoadingLands] = useState(true);
  const [loadingGrievances, setLoadingGrievances] = useState(true);

  const fetchDashboardData = async () => {
    setLoadingLands(true);
    setLoadingGrievances(true);

    try {
      const res = await landService.getMyLandRecords();
      if ((res.status === 'success' || res.success) && res.data) {
        setLands(res.data);
      }
    } catch (e) {
      console.error('Error fetching dashboard land records:', e);
    } finally {
      setLoadingLands(false);
    }

    try {
      const res = await grievanceService.getMyGrievances();
      if ((res.status === 'success' || res.success) && res.data) {
        setGrievances(res.data);
      }
    } catch (e) {
      console.error('Error fetching dashboard grievances:', e);
    } finally {
      setLoadingGrievances(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'success';
      case 'rejected':
        return 'danger';
      case 'info_required':
        return 'warning';
      case 'under_review':
        return 'info';
      default:
        return 'neutral';
    }
  };

  const getCategoryLabel = (cat: string) => {
    const categories: Record<string, string> = {
      'ocr_mismatch': 'OCR Deed Mismatch',
      'ownership_dispute': 'Ownership Dispute',
      'survey_error': 'Survey / Boundary Error',
      'illegal_mutation': 'Illegal Mutation Action',
      'other': 'Other Query'
    };
    return categories[cat] || cat;
  };

  return (
    <div className="space-y-6">
      {/* Citizen Hero Banner */}
      <div className="tracia-card p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
        <div className="space-y-2 max-w-xl">
          <p className="text-xs font-bold text-[#667085] tracking-wider uppercase">Welcome back,</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#034E4E] tracking-tight">
            TRACIA Citizen Portal
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
            Manage your land records, verify documents, submit applications, and track grievances.
          </p>
        </div>

        {/* Line Graphic */}
        <div className="w-full md:w-96 h-24 shrink-0 flex items-center justify-center opacity-85">
          <svg viewBox="0 0 400 100" className="w-full h-full" fill="none" stroke="#034E4E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="20" y1="85" x2="380" y2="85" stroke="#034E4E" strokeWidth="2" />
            <path d="M 40 30 Q 50 20 60 30 Q 70 20 80 30 L 350 30 Q 360 20 370 30 Q 380 20 390 30" stroke="#DDE5E3" strokeDasharray="3 3" />
            <path d="M 110 85 L 110 55 L 140 55 L 140 85 Z" stroke="#0B6868" />
            <path d="M 105 55 L 125 40 L 145 55 Z" stroke="#0B6868" />
            <rect x="120" y="65" width="10" height="20" stroke="#0B6868" />
            <circle cx="90" cy="65" r="10" stroke="#034E4E" />
            <line x1="90" y1="75" x2="90" y2="85" stroke="#034E4E" />
            <path d="M 160 85 L 160 45 L 205 45 L 205 85 Z" stroke="#034E4E" strokeWidth="1.75" />
            <path d="M 155 45 L 182.5 30 L 210 45 Z" stroke="#034E4E" strokeWidth="1.75" />
            <line x1="171" y1="45" x2="171" y2="85" stroke="#034E4E" />
            <line x1="182" y1="45" x2="182" y2="85" stroke="#034E4E" />
            <line x1="194" y1="45" x2="194" y2="85" stroke="#034E4E" />
            <rect x="225" y="25" width="30" height="60" rx="1" stroke="#0B6868" strokeWidth="1.5" />
            <rect x="232" y="33" width="6" height="7" stroke="#0B6868" />
            <rect x="242" y="33" width="6" height="7" stroke="#0B6868" />
            <rect x="232" y="46" width="6" height="7" stroke="#0B6868" />
            <rect x="242" y="46" width="6" height="7" stroke="#0B6868" />
            <rect x="232" y="59" width="6" height="7" stroke="#0B6868" />
            <rect x="242" y="59" width="6" height="7" stroke="#0B6868" />
            <line x1="280" y1="85" x2="280" y2="60" stroke="#034E4E" strokeWidth="2" />
            <circle cx="280" cy="55" r="5" stroke="#034E4E" strokeWidth="2" />
          </svg>
        </div>
      </div>

      {/* QUICK ACTIONS Grid */}
      <div>
        <h2 className="text-xs font-extrabold text-[#172121] uppercase tracking-wider mb-3">
          QUICK ACTIONS
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/citizen/land-records"
            className="tracia-card-interactive p-4 flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#034E4E] text-white flex items-center justify-center shrink-0 shadow-xs">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#172121] text-xs sm:text-sm group-hover:text-[#034E4E] transition-colors">
                  View My Land Records
                </h3>
                <p className="text-[11px] text-[#667085] mt-0.5 leading-snug">
                  Access verified ownership details and official titles.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#667085] group-hover:text-[#034E4E] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
          </Link>

          <Link
            to="/citizen/search"
            className="tracia-card-interactive p-4 flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#034E4E] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#172121] text-xs sm:text-sm group-hover:text-[#034E4E] transition-colors">
                  Search Land Records
                </h3>
                <p className="text-[11px] text-[#667085] mt-0.5 leading-snug">
                  Search public registry records by survey number or village.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#667085] group-hover:text-[#034E4E] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
          </Link>

          <Link
            to="/citizen/applications"
            className="tracia-card-interactive p-4 flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#034E4E] text-white flex items-center justify-center shrink-0 shadow-xs">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#172121] text-xs sm:text-sm group-hover:text-[#034E4E] transition-colors">
                  Land Applications
                </h3>
                <p className="text-[11px] text-[#667085] mt-0.5 leading-snug">
                  Submit land transfer, construction, or classification change petitions.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#667085] group-hover:text-[#034E4E] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
          </Link>

          <Link
            to="/citizen/grievances"
            className="tracia-card-interactive p-4 flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#034E4E] text-white flex items-center justify-center shrink-0 shadow-xs">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#172121] text-xs sm:text-sm group-hover:text-[#034E4E] transition-colors">
                  Track Grievance
                </h3>
                <p className="text-[11px] text-[#667085] mt-0.5 leading-snug">
                  Check current resolution status and receive officer updates.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#667085] group-hover:text-[#034E4E] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
          </Link>

          <Link
            to="/citizen/ocr"
            className="tracia-card-interactive p-4 flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#034E4E] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#172121] text-xs sm:text-sm group-hover:text-[#034E4E] transition-colors">
                  Upload Document
                </h3>
                <p className="text-[11px] text-[#667085] mt-0.5 leading-snug">
                  Verify physical deed document accuracy using OCR.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#667085] group-hover:text-[#034E4E] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
          </Link>

          <Link
            to="/citizen/map"
            className="tracia-card-interactive p-4 flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#034E4E] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Map className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#172121] text-xs sm:text-sm group-hover:text-[#034E4E] transition-colors">
                  3D Land Map
                </h3>
                <p className="text-[11px] text-[#667085] mt-0.5 leading-snug">
                  Explore land parcels and boundaries in interactive 3D view.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#667085] group-hover:text-[#034E4E] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
          </Link>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: My Land Records */}
        <div className="tracia-card p-5 flex flex-col justify-start space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#DDE5E3]">
            <h2 className="text-xs sm:text-sm font-extrabold text-[#172121] flex items-center space-x-2">
              <FileText className="w-4.5 h-4.5 text-[#034E4E]" />
              <span>My Land Records</span>
            </h2>
            <Link
              to="/citizen/land-records"
              className="text-xs font-semibold text-[#034E4E] hover:underline flex items-center px-2.5 py-1 rounded-lg bg-[#F4F8F7] border border-[#DDE5E3] transition-colors"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>

          {loadingLands ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="w-5 h-5 animate-spin text-[#034E4E]" />
              <span className="ml-2 text-xs text-slate-500">Loading land records...</span>
            </div>
          ) : lands.length === 0 ? (
            <EmptyState
              title="No land records available."
              description="Your registered land properties will appear here automatically."
              icon={<Database className="w-5 h-5 text-[#034E4E]" />}
            />
          ) : (
            <div className="space-y-2">
              {lands.slice(0, 3).map((land) => (
                <Link
                  key={land.id}
                  to={`/citizen/land-records/${land.id}`}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-[#034E4E] hover:bg-slate-50 transition-all bg-white"
                >
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900 text-xs font-mono">Survey No: {land.survey_number}</div>
                    <div className="text-[11px] text-slate-500">{land.village}, {land.district}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-[#034E4E]">{land.property_extent || land.property_extent || 'N/A'}</div>
                    <div className="text-[10px] text-slate-400 font-mono">Patta: {land.patta_number || 'N/A'}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Recent Grievances */}
        <div className="tracia-card p-5 flex flex-col justify-start space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#DDE5E3]">
            <h2 className="text-xs sm:text-sm font-extrabold text-[#172121] flex items-center space-x-2">
              <AlertOctagon className="w-4.5 h-4.5 text-[#034E4E]" />
              <span>Recent Grievances</span>
            </h2>
            <Link
              to="/citizen/grievances"
              className="text-xs font-semibold text-[#034E4E] hover:underline flex items-center px-2.5 py-1 rounded-lg bg-[#F4F8F7] border border-[#DDE5E3] transition-colors"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>

          {loadingGrievances ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="w-5 h-5 animate-spin text-[#034E4E]" />
              <span className="ml-2 text-xs text-slate-500">Loading grievances...</span>
            </div>
          ) : grievances.length === 0 ? (
            <EmptyState
              title="No grievances submitted yet."
              description="Any grievances submitted by you will be listed here with status tracking."
              icon={<AlertOctagon className="w-5 h-5 text-[#034E4E]" />}
            />
          ) : (
            <div className="space-y-2">
              {grievances.slice(0, 3).map((grv) => (
                <Link
                  key={grv.id}
                  to={`/citizen/grievances/${grv.id}`}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-[#034E4E] hover:bg-slate-50 transition-all bg-white"
                >
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900 text-xs font-mono">{grv.grievance_number}</div>
                    <div className="text-[11px] text-slate-500">{getCategoryLabel(grv.category)}</div>
                  </div>
                  <div>
                    <Badge variant={getStatusBadgeVariant(grv.status)}>
                      {grv.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
