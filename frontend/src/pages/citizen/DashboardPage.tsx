import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Search,
  Upload,
  AlertOctagon,
  FileCheck,
  Map,
  Database,
  ChevronRight,
} from 'lucide-react';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { EmptyState } from '../../components/common/EmptyState';

export const CitizenDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Welcome Banner (Dark Blue #0F172A - NO buttons on top right) */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-800">
        <div>
          <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Citizen Dashboard</span>
          <h1 className="text-2xl font-bold text-white mt-1">Welcome to Digital Land Portal</h1>
          <p className="text-slate-400 text-sm mt-1.5 max-w-2xl leading-relaxed">
            Access your verified land titles, track submitted grievances, and perform automated document verification.
          </p>
        </div>
      </div>

      {/* Backend Status Alert */}
      <ErrorAlert
        title="Backend Disconnected"
        message="Your land records and grievances will automatically populate from the database once the backend service is attached."
      />

      {/* Quick Actions Grid (2 boxes per row) */}
      <div>
        <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Action 1: View My Lands */}
          <Link
            to="/citizen/land-records"
            className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-400 hover:shadow-md transition-all group flex items-start space-x-4"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 group-hover:bg-blue-700 transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">View My Lands</h3>
              <p className="text-xs text-slate-500 mt-1">Access verified ownership details and documents.</p>
            </div>
          </Link>

          {/* Action 2: Search Land Records */}
          <Link
            to="/citizen/search"
            className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-400 hover:shadow-md transition-all group flex items-start space-x-4"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 group-hover:bg-blue-700 transition-colors">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Search Land Records</h3>
              <p className="text-xs text-slate-500 mt-1">Search public records by survey number or village.</p>
            </div>
          </Link>

          {/* Action 3: Upload Document */}
          <Link
            to="/citizen/ocr"
            className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-400 hover:shadow-md transition-all group flex items-start space-x-4"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 group-hover:bg-blue-700 transition-colors">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Upload Document</h3>
              <p className="text-xs text-slate-500 mt-1">Verify document accuracy using automated OCR.</p>
            </div>
          </Link>

          {/* Action 4: Track Grievance */}
          <Link
            to="/citizen/grievances"
            className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-400 hover:shadow-md transition-all group flex items-start space-x-4"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 group-hover:bg-blue-700 transition-colors">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Track Grievance</h3>
              <p className="text-xs text-slate-500 mt-1">Check current resolution status and officer updates.</p>
            </div>
          </Link>

          {/* Action 5: View My Grievances */}
          <Link
            to="/citizen/grievances"
            className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-400 hover:shadow-md transition-all group flex items-start space-x-4"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 group-hover:bg-blue-700 transition-colors">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">View My Grievances</h3>
              <p className="text-xs text-slate-500 mt-1">Lodge title petitions and track progress.</p>
            </div>
          </Link>

          {/* Action 6: 3D Land Map */}
          <Link
            to="/citizen/map"
            className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-400 hover:shadow-md transition-all group flex items-start space-x-4"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 group-hover:bg-blue-700 transition-colors">
              <Map className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">3D Land Map</h3>
              <p className="text-xs text-slate-500 mt-1">Inspect cadastral survey boundaries and elevation.</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Main Dashboard Grid: My Land Records & Recent Grievances */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section: My Land Records */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-slate-900" />
                <span>My Land Records</span>
              </h2>
              <Link to="/citizen/land-records" className="text-xs font-semibold text-blue-700 hover:underline flex items-center">
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            </div>
            <EmptyState
              title="No land records found."
              description="Your registered land properties will appear here automatically once the database is connected."
              icon={<Database className="w-6 h-6 text-slate-400" />}
            />
          </div>
        </div>

        {/* Section: Recent Grievances */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <AlertOctagon className="w-5 h-5 text-slate-900" />
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
      </div>
    </div>
  );
};
