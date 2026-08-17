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
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Land Title Record</span>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">ID: {id || 'RECORD-ID'}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Property Detail View</h1>
          </div>
        </div>

        <Link
          to="/citizen/ocr"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span>Verify with Document OCR</span>
        </Link>
      </div>

      <ErrorAlert
        title="Backend Disconnected"
        message="Full ownership details, transfer logs, and document verification history will load when connected to the backend API."
      />

      {/* 16 Core Fields Layout Grid View Placeholder */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        {/* Section 1: Basic & Registration Information */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-200 flex items-center space-x-2">
            <Building className="w-4 h-4 text-blue-700" />
            <span>1. Basic & Registration Information</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
            <div>
              <span className="block text-xs font-medium text-slate-500">Document Type</span>
              <span className="font-medium text-slate-800">--</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-500">Document Number</span>
              <span className="font-medium text-slate-800 font-mono">--</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-500">Registration Date</span>
              <span className="font-medium text-slate-800">--</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-500">Registration Office</span>
              <span className="font-medium text-slate-800">--</span>
            </div>
          </div>
        </div>

        {/* Section 2: Property & Boundary Information */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-200 flex items-center space-x-2">
            <FileText className="w-4 h-4 text-blue-700" />
            <span>2. Location & Property Details</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
            <div>
              <span className="block text-xs font-medium text-slate-500">District</span>
              <span className="font-medium text-slate-800">--</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-500">Taluk</span>
              <span className="font-medium text-slate-800">--</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-500">Village</span>
              <span className="font-medium text-slate-800">--</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-500">Survey Number</span>
              <span className="font-medium text-slate-800 font-mono">--</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-500">Patta Number</span>
              <span className="font-medium text-slate-800 font-mono">--</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-500">Property Extent</span>
              <span className="font-medium text-slate-800">--</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-500">Land Classification / Type</span>
              <span className="font-medium text-slate-800">--</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-500">Sale Consideration (₹)</span>
              <span className="font-medium text-slate-800">--</span>
            </div>
          </div>
        </div>

        {/* Section 3: Ownership Information */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-200 flex items-center space-x-2">
            <User className="w-4 h-4 text-blue-700" />
            <span>3. Ownership Details</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4 text-sm">
            <div>
              <span className="block text-xs font-medium text-slate-500">Current Owner Name</span>
              <span className="font-medium text-slate-800">--</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-500">Previous Owner Name</span>
              <span className="font-medium text-slate-800">--</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-500">Parent Document Reference</span>
              <span className="font-medium text-slate-800">--</span>
            </div>
            <div className="sm:col-span-3">
              <span className="block text-xs font-medium text-slate-500">Property Description</span>
              <span className="font-medium text-slate-800">--</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Tabs / Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Transfer / Mutation History */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 mb-4">
            <History className="w-4 h-4 text-slate-700" />
            <span>Transfer & Mutation History</span>
          </h3>
          <EmptyState
            title="No transfer history logged"
            description="Mutation logs will be populated from the database."
          />
        </div>

        {/* OCR & Verification Status */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 mb-4">
            <FileCheck className="w-4 h-4 text-emerald-600" />
            <span>Document OCR Verification</span>
          </h3>
          <EmptyState
            title="No document verified yet"
            description="Upload your paper title document to perform automatic field matching."
          />
        </div>

        {/* Anomaly Information */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 mb-4">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Anomaly Status</span>
          </h3>
          <EmptyState
            title="No anomalies detected"
            description="System cross-checks title records to protect against fraudulent transfers."
          />
        </div>

        {/* Audit Log */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 mb-4">
            <Clock className="w-4 h-4 text-slate-700" />
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
