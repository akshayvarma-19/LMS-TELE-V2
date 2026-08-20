import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Building, FileText, User } from 'lucide-react';
import { ErrorAlert } from '../../components/common/ErrorAlert';

export const OfficerLandRecordDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link
            to="/officer/land-records"
            className="p-2 rounded-lg bg-white border border-[#D9E2E1] text-[#101828] hover:bg-[#F4F8F7] transition-colors"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider">Officer Master Registry View</span>
              <span className="text-[11px] bg-[#F4F8F7] text-[#034E4E] px-2 py-0.5 rounded font-mono border border-[#D9E2E1]">ID: {id || 'RECORD-ID'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#034E4E] mt-0.5 tracking-tight">Full Administrative Record (16 Fields)</h1>
          </div>
        </div>

        <Link
          to={`/officer/land-records/${id || 'demo'}/edit`}
          className="tracia-btn-primary inline-flex items-center space-x-2 text-xs self-start sm:self-auto"
        >
          <Edit className="w-4 h-4" />
          <span>Edit Record</span>
        </Link>
      </div>

      <ErrorAlert
        title="Backend Notice"
        message="Master database record details, audit logs, and mutation history will be fetched from Supabase."
      />

      {/* 16 Core Fields Layout Grid */}
      <div className="tracia-card p-6 space-y-6">
        <div>
          <h2 className="text-xs font-extrabold text-[#101828] uppercase tracking-wider pb-2 border-b border-[#D9E2E1] flex items-center space-x-2">
            <Building className="w-4 h-4 text-[#034E4E]" />
            <span>1. Registration & Deed Information</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-xs">
            <div>
              <span className="block font-medium text-[#667085]">Document Type</span>
              <span className="font-bold text-[#101828] mt-0.5 block">--</span>
            </div>
            <div>
              <span className="block font-medium text-[#667085]">Document Number</span>
              <span className="font-bold text-[#101828] font-mono mt-0.5 block">--</span>
            </div>
            <div>
              <span className="block font-medium text-[#667085]">Registration Date</span>
              <span className="font-bold text-[#101828] mt-0.5 block">--</span>
            </div>
            <div>
              <span className="block font-medium text-[#667085]">Registration Office</span>
              <span className="font-bold text-[#101828] mt-0.5 block">--</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xs font-extrabold text-[#101828] uppercase tracking-wider pb-2 border-b border-[#D9E2E1] flex items-center space-x-2">
            <FileText className="w-4 h-4 text-[#034E4E]" />
            <span>2. Location & Property Details</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-xs">
            <div>
              <span className="block font-medium text-[#667085]">District</span>
              <span className="font-bold text-[#101828] mt-0.5 block">--</span>
            </div>
            <div>
              <span className="block font-medium text-[#667085]">Taluk</span>
              <span className="font-bold text-[#101828] mt-0.5 block">--</span>
            </div>
            <div>
              <span className="block font-medium text-[#667085]">Village</span>
              <span className="font-bold text-[#101828] mt-0.5 block">--</span>
            </div>
            <div>
              <span className="block font-medium text-[#667085]">Survey Number</span>
              <span className="font-bold text-[#101828] font-mono mt-0.5 block">--</span>
            </div>
            <div>
              <span className="block font-medium text-[#667085]">Patta Number</span>
              <span className="font-bold text-[#101828] font-mono mt-0.5 block">--</span>
            </div>
            <div>
              <span className="block font-medium text-[#667085]">Property Extent</span>
              <span className="font-bold text-[#101828] mt-0.5 block">--</span>
            </div>
            <div>
              <span className="block font-medium text-[#667085]">Land Type</span>
              <span className="font-bold text-[#101828] mt-0.5 block">--</span>
            </div>
            <div>
              <span className="block font-medium text-[#667085]">Sale Consideration (₹)</span>
              <span className="font-bold text-[#101828] mt-0.5 block">--</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xs font-extrabold text-[#101828] uppercase tracking-wider pb-2 border-b border-[#D9E2E1] flex items-center space-x-2">
            <User className="w-4 h-4 text-[#034E4E]" />
            <span>3. Ownership Information</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4 text-xs">
            <div>
              <span className="block font-medium text-[#667085]">Current Owner Name</span>
              <span className="font-bold text-[#101828] mt-0.5 block">--</span>
            </div>
            <div>
              <span className="block font-medium text-[#667085]">Previous Owner</span>
              <span className="font-bold text-[#101828] mt-0.5 block">--</span>
            </div>
            <div>
              <span className="block font-medium text-[#667085]">Parent Document Reference</span>
              <span className="font-bold text-[#101828] mt-0.5 block">--</span>
            </div>
            <div className="sm:col-span-3">
              <span className="block font-medium text-[#667085]">Property Description</span>
              <span className="font-bold text-[#101828] mt-0.5 block">--</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
