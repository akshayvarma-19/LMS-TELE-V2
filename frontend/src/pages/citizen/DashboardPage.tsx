import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Search,
  Upload,
  AlertOctagon,
  ChevronRight,
  Database,
} from 'lucide-react';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { EmptyState } from '../../components/common/EmptyState';

export const CitizenDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">Citizen Dashboard</h1>
        <p className="text-sm text-[#64748B] mt-1">
          Manage your land records, verify documents and track grievances.
        </p>
      </div>

      {/* System Status Message */}
      <ErrorAlert
        title="Data services are currently unavailable."
        message="Your records will appear here when the service is connected."
      />

      {/* Quick Actions Grid (2 columns) */}
      <div>
        <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Action 1: View My Land Records */}
          <Link
            to="/citizen/land-records"
            className="p-4 bg-white rounded-lg border border-[#D9E0E8] hover:border-[#1D4ED8] hover:shadow-xs transition-all flex items-start space-x-3.5 group"
          >
            <div className="w-9 h-9 rounded bg-[#F1F5F9] text-[#0B1F3A] flex items-center justify-center shrink-0 group-hover:bg-[#1D4ED8] group-hover:text-white transition-colors">
              <FileText className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-semibold text-[#0F172A] text-sm group-hover:text-[#1D4ED8] transition-colors">
                View My Land Records
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">Access verified ownership details and official titles.</p>
            </div>
          </Link>

          {/* Action 2: Search Land Records */}
          <Link
            to="/citizen/search"
            className="p-4 bg-white rounded-lg border border-[#D9E0E8] hover:border-[#1D4ED8] hover:shadow-xs transition-all flex items-start space-x-3.5 group"
          >
            <div className="w-9 h-9 rounded bg-[#F1F5F9] text-[#0B1F3A] flex items-center justify-center shrink-0 group-hover:bg-[#1D4ED8] group-hover:text-white transition-colors">
              <Search className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-semibold text-[#0F172A] text-sm group-hover:text-[#1D4ED8] transition-colors">
                Search Land Records
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">Search public registry records by survey number or village.</p>
            </div>
          </Link>

          {/* Action 3: Upload Document */}
          <Link
            to="/citizen/ocr"
            className="p-4 bg-white rounded-lg border border-[#D9E0E8] hover:border-[#1D4ED8] hover:shadow-xs transition-all flex items-start space-x-3.5 group"
          >
            <div className="w-9 h-9 rounded bg-[#F1F5F9] text-[#0B1F3A] flex items-center justify-center shrink-0 group-hover:bg-[#1D4ED8] group-hover:text-white transition-colors">
              <Upload className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-semibold text-[#0F172A] text-sm group-hover:text-[#1D4ED8] transition-colors">
                Upload Document
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">Verify physical deed document accuracy using OCR.</p>
            </div>
          </Link>

          {/* Action 4: Track Grievance */}
          <Link
            to="/citizen/grievances"
            className="p-4 bg-white rounded-lg border border-[#D9E0E8] hover:border-[#1D4ED8] hover:shadow-xs transition-all flex items-start space-x-3.5 group"
          >
            <div className="w-9 h-9 rounded bg-[#F1F5F9] text-[#0B1F3A] flex items-center justify-center shrink-0 group-hover:bg-[#1D4ED8] group-hover:text-white transition-colors">
              <AlertOctagon className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-semibold text-[#0F172A] text-sm group-hover:text-[#1D4ED8] transition-colors">
                Track Grievance
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">Check current resolution status and revenue officer updates.</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Main Two-Column Layout (My Land Records & Recent Grievances) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: My Land Records */}
        <div className="bg-white rounded-lg border border-[#D9E0E8] p-5">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E2E8F0]">
            <h2 className="text-sm font-bold text-[#0F172A] flex items-center space-x-2">
              <FileText className="w-4.5 h-4.5 text-[#0B1F3A]" />
              <span>My Land Records</span>
            </h2>
            <Link to="/citizen/land-records" className="text-xs font-semibold text-[#1D4ED8] hover:underline flex items-center">
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>

          <EmptyState
            title="No land records available."
            description="Your registered land properties will appear here automatically once the service is connected."
            icon={<Database className="w-5 h-5 text-slate-400" />}
          />
        </div>

        {/* RIGHT: Recent Grievances */}
        <div className="bg-white rounded-lg border border-[#D9E0E8] p-5">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E2E8F0]">
            <h2 className="text-sm font-bold text-[#0F172A] flex items-center space-x-2">
              <AlertOctagon className="w-4.5 h-4.5 text-[#0B1F3A]" />
              <span>Recent Grievances</span>
            </h2>
            <Link to="/citizen/grievances" className="text-xs font-semibold text-[#1D4ED8] hover:underline flex items-center">
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>

          <EmptyState
            title="No grievances submitted yet."
            description="Any grievances submitted by you will be listed here with live resolution status tracking."
            icon={<AlertOctagon className="w-5 h-5 text-slate-400" />}
          />
        </div>
      </div>
    </div>
  );
};
