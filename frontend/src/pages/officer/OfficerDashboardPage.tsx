import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  PlusCircle,
  AlertOctagon,
  ShieldAlert,
  FolderKanban,
  Database,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { EmptyState } from '../../components/common/EmptyState';

export const OfficerDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Officer Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Revenue Officer Admin</span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">Land Records Administration</h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Inspect registered land titles, manage citizen grievances, execute mutation records, and review document OCR verifications.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/officer/land-records/new"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Land Record</span>
            </Link>
            <Link
              to="/officer/grievances"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              <AlertOctagon className="w-4 h-4 text-amber-400" />
              <span>Review Grievances</span>
            </Link>
          </div>
        </div>
      </div>

      <ErrorAlert
        title="Backend Disconnected"
        message="System telemetry metrics, total title count, active grievance queues, and anomaly scores will refresh automatically from the Supabase database."
      />

      {/* Officer Metric Cards Grid (Empty / Placeholder States - NO fake numbers) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Land Records</span>
            <FileText className="w-5 h-5 text-blue-700" />
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono">--</div>
          <p className="text-xs text-slate-400 mt-1">Awaiting backend data</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Grievances</span>
            <AlertOctagon className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono">--</div>
          <p className="text-xs text-slate-400 mt-1">Awaiting backend data</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Under Review</span>
            <FolderKanban className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono">--</div>
          <p className="text-xs text-slate-400 mt-1">Awaiting backend data</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Potential Anomalies</span>
            <ShieldAlert className="w-5 h-5 text-rose-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono">--</div>
          <p className="text-xs text-slate-400 mt-1">Awaiting backend data</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">OCR Verifications</span>
            <FileText className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono">--</div>
          <p className="text-xs text-slate-400 mt-1">Awaiting backend data</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recent System Updates</span>
            <Database className="w-5 h-5 text-slate-700" />
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono">--</div>
          <p className="text-xs text-slate-400 mt-1">Awaiting backend data</p>
        </div>
      </div>

      {/* Main Administrative Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Land Records Administrative Queue */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-700" />
              <span>Registry Land Holdings</span>
            </h2>
            <Link to="/officer/land-records" className="text-xs font-semibold text-blue-700 hover:underline flex items-center">
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>
          <EmptyState
            title="No land records found."
            description="Registry titles created by officers will appear here for editing and mutation management."
          />
        </div>

        {/* Grievance Work Queue */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <AlertOctagon className="w-5 h-5 text-amber-600" />
              <span>Pending Grievance Queue</span>
            </h2>
            <Link to="/officer/grievances" className="text-xs font-semibold text-blue-700 hover:underline flex items-center">
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>
          <EmptyState
            title="No pending grievances."
            description="Citizen title disputes and OCR mismatch reports will queue here for revenue officer review."
          />
        </div>
      </div>
    </div>
  );
};
