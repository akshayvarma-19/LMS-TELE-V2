import React, { useState, useEffect } from 'react';
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
  Loader2,
  Globe
} from 'lucide-react';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { EmptyState } from '../../components/common/EmptyState';
import { Land3DMap } from '../../components/common/Land3DMap';
import { landService } from '../../services/landService';
import type { LandRecord } from '../../types';

export const CitizenLandRecordDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [land, setLand] = useState<LandRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [show3DMap, setShow3DMap] = useState(false);

  useEffect(() => {
    const fetchLand = async () => {
      if (!id) return;
      setLoading(true);
      setErrorMsg(null);
      try {
        const res = await landService.getLandRecord(id);
        if ((res.status === 'success' || res.success) && res.data) {
          setLand(res.data);
        } else {
          setErrorMsg(res.message || 'Failed to fetch land record.');
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Error connecting to server.');
      } finally {
        setLoading(false);
      }
    };
    fetchLand();
  }, [id]);

  const handleOpen3DMap = (e: React.MouseEvent) => {
    e.preventDefault();
    setShow3DMap(true);
    setTimeout(() => {
      document.getElementById('3d-map-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-blue-700" />
        <span className="ml-2 text-sm text-slate-500">Loading property details...</span>
      </div>
    );
  }

  if (errorMsg || !land) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Link
            to="/citizen/land-records"
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Record Not Found</h1>
        </div>
        <ErrorAlert
          title="Failed to Load Details"
          message={errorMsg || 'Could not retrieve details for the specified land record.'}
        />
      </div>
    );
  }

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
              <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Land Title Record</span>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">ID: {id}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#034E4E] mt-0.5 tracking-tight">Property Detail View</h1>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleOpen3DMap}
            className="px-4 py-2 bg-[#034E4E] hover:bg-[#023B3B] text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Globe className="w-4 h-4" />
            <span>{show3DMap ? 'Scroll to 3D Map' : 'View in 3D Map'}</span>
          </button>

          <Link
            to="/citizen/ocr"
            className="tracia-btn-primary inline-flex items-center space-x-2 text-xs"
          >
            <Upload className="w-4 h-4" />
            <span>Verify with Document OCR</span>
          </Link>
        </div>
      </div>

      {/* 16 Core Fields Layout Grid View */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        {/* Section 1: Basic & Registration Information */}
        <div>
          <h2 className="text-xs font-extrabold text-[#101828] uppercase tracking-wider pb-2 border-b border-[#D9E2E1] flex items-center space-x-2">
            <Building className="w-4 h-4 text-[#034E4E]" />
            <span>1. Basic & Registration Information</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-xs">
            <div>
              <span className="block text-xs font-medium text-slate-500">Document Type</span>
              <span className="font-semibold text-slate-800">{land.document_type || 'Deed'}</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-500">Document Number</span>
              <span className="font-semibold text-slate-800 font-mono">{land.document_number || 'N/A'}</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-500">Registration Date</span>
              <span className="font-semibold text-slate-800">
                {land.registration_date ? new Date(land.registration_date).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-500">Registration Office</span>
              <span className="font-semibold text-slate-800">{land.registration_office || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Property & Location Details */}
        <div>
          <h2 className="text-xs font-extrabold text-[#101828] uppercase tracking-wider pb-2 border-b border-[#D9E2E1] flex items-center space-x-2">
            <FileText className="w-4 h-4 text-[#034E4E]" />
            <span>2. Location & Property Details</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-xs">
            <div>
              <span className="block text-xs font-medium text-slate-500">District</span>
              <span className="font-semibold text-slate-800">{land.district}</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-500">Taluk</span>
              <span className="font-semibold text-slate-800">{land.taluk}</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-500">Village</span>
              <span className="font-semibold text-slate-800">{land.village}</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-500">Survey Number</span>
              <span className="font-semibold text-slate-800 font-mono">{land.survey_number}</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-500">Patta Number</span>
              <span className="font-semibold text-slate-800 font-mono">{land.patta_number || 'N/A'}</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-500">Property Extent</span>
              <span className="font-semibold text-slate-800">{land.property_extent || 'N/A'}</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-500">Land Classification / Type</span>
              <span className="font-semibold text-slate-800">{land.land_type || 'N/A'}</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-500">Sale Consideration (₹)</span>
              <span className="font-semibold text-slate-800">
                {land.sale_consideration ? Number(land.sale_consideration).toLocaleString('en-IN') : 'N/A'}
              </span>
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
              <span className="block text-xs font-medium text-slate-500">Current Owner Name</span>
              <span className="font-semibold text-slate-800">{land.owner_name}</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-500">Previous Owner Name</span>
              <span className="font-semibold text-slate-800">{land.previous_owner || 'N/A'}</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-500">Parent Document Reference</span>
              <span className="font-semibold text-slate-800">{land.parent_document || 'N/A'}</span>
            </div>
            <div className="sm:col-span-3">
              <span className="block text-xs font-medium text-slate-500">Property Description</span>
              <span className="font-semibold text-slate-800 leading-relaxed">{land.property_description || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Geospatial Map Section */}
      {show3DMap && (
        <div id="3d-map-section" className="scroll-mt-6 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-[#034E4E] uppercase tracking-wider flex items-center space-x-2">
              <Globe className="w-4 h-4 text-[#034E4E]" />
              <span>TRACIA 3D Geospatial Globe View</span>
            </h3>
            <button
              onClick={() => setShow3DMap(false)}
              className="text-xs text-slate-500 hover:text-slate-700 underline cursor-pointer"
            >
              Hide 3D Map
            </button>
          </div>
          <Land3DMap
            latitude={land.latitude}
            longitude={land.longitude}
            surveyNumber={land.survey_number}
            pattaNumber={land.patta_number}
            village={land.village}
            taluk={land.taluk}
            district={land.district}
            propertyExtent={land.property_extent}
            landType={land.land_type}
          />
        </div>
      )}

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
