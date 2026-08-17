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
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Officer Master Registry View</span>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">ID: {id || 'RECORD-ID'}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Full Administrative Record (16 Fields)</h1>
          </div>
        </div>

        <Link
          to={`/officer/land-records/${id || 'demo'}/edit`}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
        >
          <Edit className="w-4 h-4" />
          <span>Edit Record</span>
        </Link>
      </div>

      <ErrorAlert
        title="Backend Disconnected"
        message="Master database record details, audit logs, and mutation history will be fetched from Supabase."
      />

      {/* 16 Core Fields Layout Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-200 flex items-center space-x-2">
            <Building className="w-4 h-4 text-blue-700" />
            <span>1. Registration & Deed Information</span>
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
              <span className="block text-xs font-medium text-slate-500">Land Type</span>
              <span className="font-medium text-slate-800">--</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-500">Sale Consideration (₹)</span>
              <span className="font-medium text-slate-800">--</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-200 flex items-center space-x-2">
            <User className="w-4 h-4 text-blue-700" />
            <span>3. Ownership Information</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4 text-sm">
            <div>
              <span className="block text-xs font-medium text-slate-500">Current Owner Name</span>
              <span className="font-medium text-slate-800">--</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-500">Previous Owner</span>
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
    </div>
  );
};
