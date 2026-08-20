import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FileText,
  ArrowLeft,
  Building,
  User,
  History,
  FileCheck,
  ShieldAlert,
  Clock,
  Upload,
} from 'lucide-react';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { EmptyState } from '../../components/common/EmptyState';

export const CitizenLandRecordDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-6">
      {/* Header with Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link
            to="/citizen/land-records"
            className="p-2 rounded-lg bg-white border border-[#D9E2E1] text-[#101828] hover:bg-[#F4F8F7] transition-colors"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-[#034E4E] uppercase tracking-wider">Land Title Record</span>
              <span className="text-[11px] bg-[#F4F8F7] text-[#034E4E] px-2 py-0.5 rounded font-mono border border-[#D9E2E1]">
                ID: {id || 'RECORD-ID'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#034E4E] mt-0.5 tracking-tight">Property Detail View</h1>
          </div>
        </div>

        <Link
          to="/citizen/ocr"
          className="tracia-btn-primary inline-flex items-center space-x-2 text-xs"
        >
          <Upload className="w-4 h-4" />
          <span>Verify with Document OCR</span>
        </Link>
      </div>

      <ErrorAlert
        title="Backend Notice"
        message="Full ownership details, transfer logs, and document verification history will load when connected to the live API."
      />

      {/* 16 Core Fields Layout Grid View Placeholder */}
      <div className="tracia-card p-6 space-y-6">
        {/* Section 1: Basic & Registration Information */}
        <div>
          <h2 className="text-xs font-extrabold text-[#101828] uppercase tracking-wider pb-2 border-b border-[#D9E2E1] flex items-center space-x-2">
            <Building className="w-4 h-4 text-[#034E4E]" />
            <span>1. Basic & Registration Information</span>
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

        {/* Section 2: Property & Boundary Information */}
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
              <span className="block font-medium text-[#667085]">Land Classification / Type</span>
              <span className="font-bold text-[#101828] mt-0.5 block">--</span>
            </div>
            <div>
              <span className="block font-medium text-[#667085]">Sale Consideration (₹)</span>
              <span className="font-bold text-[#101828] mt-0.5 block">--</span>
            </div>
          </div>
        </div>

        {/* Section 3: Ownership Information */}
        <div>
          <h2 className="text-xs font-extrabold text-[#101828] uppercase tracking-wider pb-2 border-b border-[#D9E2E1] flex items-center space-x-2">
            <User className="w-4 h-4 text-[#034E4E]" />
            <span>3. Ownership Details</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4 text-xs">
            <div>
              <span className="block font-medium text-[#667085]">Current Owner Name</span>
              <span className="font-bold text-[#101828] mt-0.5 block">--</span>
            </div>
            <div>
              <span className="block font-medium text-[#667085]">Previous Owner Name</span>
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

      {/* Detail Tabs / Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Transfer / Mutation History */}
        <div className="tracia-card p-5">
          <h3 className="text-xs font-extrabold text-[#101828] uppercase tracking-wider flex items-center space-x-2 mb-3 pb-2 border-b border-[#D9E2E1]">
            <History className="w-4 h-4 text-[#034E4E]" />
            <span>Transfer & Mutation History</span>
          </h3>
          <EmptyState
            title="No transfer history logged"
            description="Mutation logs will be populated from the database."
          />
        </div>

        {/* OCR & Verification Status */}
        <div className="tracia-card p-5">
          <h3 className="text-xs font-extrabold text-[#101828] uppercase tracking-wider flex items-center space-x-2 mb-3 pb-2 border-b border-[#D9E2E1]">
            <FileCheck className="w-4 h-4 text-[#034E4E]" />
            <span>Document OCR Verification</span>
          </h3>
          <EmptyState
            title="No document verified yet"
            description="Upload your paper title document to perform automatic field matching."
          />
        </div>

        {/* Anomaly Information */}
        <div className="tracia-card p-5">
          <h3 className="text-xs font-extrabold text-[#101828] uppercase tracking-wider flex items-center space-x-2 mb-3 pb-2 border-b border-[#D9E2E1]">
            <ShieldAlert className="w-4 h-4 text-[#D97706]" />
            <span>Anomaly Status</span>
          </h3>
          <EmptyState
            title="No anomalies detected"
            description="System cross-checks title records to protect against fraudulent transfers."
          />
        </div>

        {/* Audit Log */}
        <div className="tracia-card p-5">
          <h3 className="text-xs font-extrabold text-[#101828] uppercase tracking-wider flex items-center space-x-2 mb-3 pb-2 border-b border-[#D9E2E1]">
            <Clock className="w-4 h-4 text-[#034E4E]" />
            <span>Audit & Access Trail</span>
          </h3>
          <EmptyState
            title="No audit history"
            description="Authorized modifications and access logs are recorded for transparency."
          />
        </div>
      </div>
    </div>
  );
};
