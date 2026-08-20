import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  PlusCircle,
  AlertOctagon,
  ShieldAlert,
  FolderKanban,
  Database,
  ChevronRight,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { EmptyState } from '../../components/common/EmptyState';
import { landService } from '../../services/landService';
import { grievanceService } from '../../services/grievanceService';
import { ocrService } from '../../services/ocrService';
import type { LandRecord, Grievance, LandDocument } from '../../types';

export const OfficerDashboardPage: React.FC = () => {
  const [landRecords, setLandRecords] = useState<LandRecord[]>([]);
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [documents, setDocuments] = useState<LandDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const [landsRes, grievancesRes, docsRes] = await Promise.all([
          landService.getMyLandRecords(),
          grievanceService.getAllGrievances(),
          ocrService.getAllDocuments()
        ]);

        if ((landsRes.status === 'success' || landsRes.success) && Array.isArray(landsRes.data)) {
          setLandRecords(landsRes.data);
        }
        if ((grievancesRes.status === 'success' || grievancesRes.success) && Array.isArray(grievancesRes.data)) {
          setGrievances(grievancesRes.data);
        }
        if ((docsRes.status === 'success' || docsRes.success) && Array.isArray(docsRes.data)) {
          setDocuments(docsRes.data);
        }
      } catch (err: any) {
        console.error('Failed to load officer dashboard data:', err);
        setErrorMsg(err.message || 'Error loading administrative telemetry metrics.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardMetrics();
  }, []);

  const pendingGrievances = grievances.filter(g => g.status === 'submitted' || g.status === 'under_review');
  const ocrMismatches = grievances.filter(g => g.category === 'ocr_mismatch').length + documents.filter(d => d.ocr_status === 'completed' || d.ocr_status === 'failed').length;

  return (
    <div className="space-y-6">
      {/* Officer Hero Banner */}
      <div className="tracia-card p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4.5 h-4.5 text-[#034E4E]" />
            <span className="text-xs font-extrabold text-[#034E4E] uppercase tracking-wider">
              TRACIA Revenue Administration
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#034E4E] tracking-tight">
            Land Records Administration
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
            Inspect registered land titles, manage citizen grievances, execute mutation records, and review document OCR verifications.
          </p>
          <div className="flex flex-wrap gap-2.5 pt-2">
            <Link
              to="/officer/land-records/new"
              className="tracia-btn-primary inline-flex items-center space-x-2 text-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Land Record</span>
            </Link>
            <Link
              to="/officer/grievances"
              className="tracia-btn-secondary inline-flex items-center space-x-2 text-xs"
            >
              <AlertOctagon className="w-4 h-4 text-[#034E4E]" />
              <span>Review Grievances</span>
            </Link>
          </div>
        </div>

        {/* Administrative Civic Line Graphic */}
        <div className="w-full md:w-80 h-24 shrink-0 flex items-center justify-center opacity-85">
          <svg viewBox="0 0 350 100" className="w-full h-full" fill="none" stroke="#034E4E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="20" y1="85" x2="330" y2="85" stroke="#034E4E" strokeWidth="2" />
            <path d="M 50 85 L 50 35 L 180 35 L 180 85 Z" stroke="#034E4E" strokeWidth="2" />
            <path d="M 40 35 L 115 15 L 190 35 Z" stroke="#034E4E" strokeWidth="2" />
            <line x1="75" y1="35" x2="75" y2="85" stroke="#0B6868" />
            <line x1="100" y1="35" x2="100" y2="85" stroke="#0B6868" />
            <line x1="125" y1="35" x2="125" y2="85" stroke="#0B6868" />
            <line x1="150" y1="35" x2="150" y2="85" stroke="#0B6868" />
            <circle cx="115" cy="55" r="10" stroke="#034E4E" strokeWidth="1.5" />
            <rect x="220" y="45" width="40" height="40" rx="2" stroke="#0B6868" />
            <rect x="230" y="35" width="40" height="40" rx="2" stroke="#034E4E" />
            <line x1="240" y1="45" x2="260" y2="45" stroke="#034E4E" />
            <line x1="240" y1="53" x2="260" y2="53" stroke="#034E4E" />
            <line x1="240" y1="61" x2="255" y2="61" stroke="#034E4E" />
          </svg>
        </div>
      </div>

      {errorMsg && <ErrorAlert title="Dashboard Notice" message={errorMsg} />}

      {/* Officer Metric Cards Grid (Unified System) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="tracia-card p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#667085] uppercase tracking-wider">Total Land Records</span>
            <div className="w-8 h-8 rounded-lg bg-[#034E4E] text-white flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-[#101828] font-mono">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : landRecords.length}
          </div>
          <p className="text-[11px] text-[#667085] mt-1">Master registry titles</p>
        </div>

        <div className="tracia-card p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#667085] uppercase tracking-wider">Pending Grievances</span>
            <div className="w-8 h-8 rounded-lg bg-[#034E4E] text-white flex items-center justify-center shrink-0">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-[#101828] font-mono">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : pendingGrievances.length}
          </div>
          <p className="text-[11px] text-[#667085] mt-1">Requires officer action</p>
        </div>

        <div className="tracia-card p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#667085] uppercase tracking-wider">Under Review</span>
            <div className="w-8 h-8 rounded-lg bg-[#034E4E] text-white flex items-center justify-center shrink-0">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-[#101828] font-mono">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : grievances.filter(g => g.status === 'under_review').length}
          </div>
          <p className="text-[11px] text-[#667085] mt-1">Active investigations</p>
        </div>

        <div className="tracia-card p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#667085] uppercase tracking-wider">Potential Anomalies</span>
            <div className="w-8 h-8 rounded-lg bg-[#034E4E] text-white flex items-center justify-center shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-[#101828] font-mono">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : ocrMismatches}
          </div>
          <p className="text-[11px] text-[#667085] mt-1">OCR mismatches & disputes</p>
        </div>

        <div className="tracia-card p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#667085] uppercase tracking-wider">OCR Verifications</span>
            <div className="w-8 h-8 rounded-lg bg-[#034E4E] text-white flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-[#101828] font-mono">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : documents.length}
          </div>
          <p className="text-[11px] text-[#667085] mt-1">Uploaded deed documents</p>
        </div>

        <div className="tracia-card p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#667085] uppercase tracking-wider">Resolved Petitions</span>
            <div className="w-8 h-8 rounded-lg bg-[#034E4E] text-white flex items-center justify-center shrink-0">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-[#101828] font-mono">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : grievances.filter(g => g.status === 'resolved').length}
          </div>
          <p className="text-[11px] text-[#667085] mt-1">Completed reviews</p>
        </div>
      </div>

      {/* Main Administrative Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Land Records Administrative Queue */}
        <div className="tracia-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#D9E2E1]">
            <h2 className="text-xs sm:text-sm font-extrabold text-[#101828] flex items-center space-x-2">
              <FileText className="w-4.5 h-4.5 text-[#034E4E]" />
              <span>Registry Land Holdings</span>
            </h2>
            <Link to="/officer/land-records" className="text-xs font-semibold text-[#034E4E] hover:underline flex items-center px-2.5 py-1 rounded-lg bg-[#F4F8F7] border border-[#D9E2E1] transition-colors">
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>
          
          {loading ? (
            <div className="py-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-[#034E4E]" /></div>
          ) : landRecords.length === 0 ? (
            <EmptyState title="No land records found." description="Registry titles created by officers will appear here." />
          ) : (
            <div className="space-y-3">
              {landRecords.slice(0, 4).map((land) => (
                <Link key={land.id} to={`/officer/land-records/${land.id}`} className="block p-3 rounded-xl bg-slate-50 hover:bg-[#F4F8F7] border border-slate-200 transition-colors">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{land.village} (Survey: {land.survey_number})</span>
                    <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-slate-200 text-[#034E4E]">{land.land_id}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Owner: {land.owner_name} • District: {land.district}</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Grievance Work Queue */}
        <div className="tracia-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#D9E2E1]">
            <h2 className="text-xs sm:text-sm font-extrabold text-[#101828] flex items-center space-x-2">
              <AlertOctagon className="w-4.5 h-4.5 text-[#034E4E]" />
              <span>Pending Grievance Queue</span>
            </h2>
            <Link to="/officer/grievances" className="text-xs font-semibold text-[#034E4E] hover:underline flex items-center px-2.5 py-1 rounded-lg bg-[#F4F8F7] border border-[#D9E2E1] transition-colors">
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-[#034E4E]" /></div>
          ) : grievances.length === 0 ? (
            <EmptyState title="No pending grievances." description="Citizen title disputes and OCR mismatch reports will queue here." />
          ) : (
            <div className="space-y-3">
              {grievances.slice(0, 4).map((g) => (
                <Link key={g.id} to={`/officer/grievances/${g.id}`} className="block p-3 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 transition-colors">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 capitalize">{g.category.replace(/_/g, ' ')}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">{g.status}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-1">{g.description}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
