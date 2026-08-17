import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Search,
  Upload,
  AlertOctagon,
  ShieldAlert,
  Bell,
  CheckCircle2,
  ChevronRight,
  Database,
} from 'lucide-react';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { EmptyState } from '../../components/common/EmptyState';

export const CitizenDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Citizen Dashboard</span>
            <h1 className="text-2xl font-bold text-white mt-1">Welcome to Digital Land Portal</h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Access your verified land titles, track submitted grievances, and perform automated document verification.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/citizen/search"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>Public Search</span>
            </Link>
            <Link
              to="/citizen/ocr"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              <Upload className="w-4 h-4 text-blue-400" />
              <span>OCR Verification</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Backend Status Alert */}
      <ErrorAlert
        title="Backend Disconnected"
        message="Your land records, grievances, and anomaly alerts will automatically populate from the database once the backend service is attached."
      />

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/citizen/land-records"
            className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-blue-500 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-3 group-hover:bg-blue-700 group-hover:text-white transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">View My Lands</h3>
            <p className="text-xs text-slate-500 mt-1">Access verified ownership details and documents.</p>
          </Link>

          <Link
            to="/citizen/search"
            className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-blue-500 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mb-3 group-hover:bg-slate-900 group-hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">Search Land Records</h3>
            <p className="text-xs text-slate-500 mt-1">Search public records by survey number or village.</p>
          </Link>

          <Link
            to="/citizen/ocr"
            className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-blue-500 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
              <Upload className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">Upload Document</h3>
            <p className="text-xs text-slate-500 mt-1">Verify document accuracy using automated OCR.</p>
          </Link>

          <Link
            to="/citizen/grievances"
            className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-blue-500 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:bg-amber-700 group-hover:text-white transition-colors">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">Track Grievance</h3>
            <p className="text-xs text-slate-500 mt-1">Check current resolution status and updates.</p>
          </Link>
        </div>
      </div>

      {/* Main Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Land Records & Grievances) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section: My Land Records */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-700" />
                <span>My Land Records</span>
              </h2>
              <Link to="/citizen/land-records" className="text-xs font-semibold text-blue-700 hover:underline flex items-center">
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            </div>
            <EmptyState
              title="No land records available yet."
              description="Your registered land properties will appear here automatically once the database is connected."
              icon={<Database className="w-6 h-6 text-slate-400" />}
            />
          </div>

          {/* Section: Recent Grievances */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <AlertOctagon className="w-5 h-5 text-amber-600" />
                <span>Recent Grievances</span>
              </h2>
              <Link to="/citizen/grievances" className="text-xs font-semibold text-blue-700 hover:underline flex items-center">
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            </div>
            <EmptyState
              title="No grievances submitted yet."
              description="Any grievances submitted by you will be listed here with live resolution status tracking."
              icon={<AlertOctagon className="w-6 h-6 text-slate-400" />}
            />
          </div>
        </div>

        {/* Right Column (Status & Alerts) */}
        <div className="space-y-6">
          {/* Verification Status */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Verification Status</span>
            </h2>
            <EmptyState
              title="No pending verifications"
              description="Document verification results will be displayed here after OCR processing."
            />
          </div>

          {/* Potential Anomaly Alerts */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2 mb-4">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <span>Potential Anomaly Alerts</span>
            </h2>
            <EmptyState
              title="No active alerts"
              description="Any system-detected discrepancy alerts related to your title will appear here safely."
            />
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2 mb-4">
              <Bell className="w-5 h-5 text-slate-700" />
              <span>Notifications</span>
            </h2>
            <EmptyState
              title="No new notifications"
              description="Updates regarding your records or grievances will arrive here."
            />
          </div>
        </div>
      </div>
    </div>
  );
};
