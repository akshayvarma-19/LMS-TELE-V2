import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Building, FileText, User, Loader2, Globe } from 'lucide-react';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { Land3DMap } from '../../components/common/Land3DMap';
import { landService } from '../../services/landService';
import type { LandRecord } from '../../types';

export const OfficerLandRecordDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [land, setLand] = useState<LandRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [show3DMap, setShow3DMap] = useState(false);

  useEffect(() => {
    const fetchLandDetail = async () => {
      if (!id) return;
      setLoading(true);
      setErrorMsg(null);
      try {
        const res = await landService.getLandRecord(id);
        if ((res.success || res.status === 'success') && res.data) {
          setLand(res.data);
        } else {
          setErrorMsg(res.message || 'Failed to load land record details.');
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to connect to the backend server.');
      } finally {
        setLoading(false);
      }
    };
    fetchLandDetail();
  }, [id]);

  const handleOpen3DMap = (e: React.MouseEvent) => {
    e.preventDefault();
    setShow3DMap(true);
    setTimeout(() => {
      document.getElementById('officer-3d-map')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#034E4E]" />
        <p className="text-xs text-[#667085] font-semibold">Retrieving registry file details...</p>
      </div>
    );
  }

  if (errorMsg || !land) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Link
            to="/officer/land-records"
            className="p-2 rounded-lg bg-white border border-[#D9E2E1] text-[#101828] hover:bg-[#F4F8F7] transition-colors"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </Link>
          <h1 className="text-xl font-bold text-[#034E4E]">Error Loading Record</h1>
        </div>
        <ErrorAlert title="Registry Load Failure" message={errorMsg || 'Requested land record details could not be found.'} />
      </div>
    );
  }

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
              <span className="text-[11px] bg-[#F4F8F7] text-[#034E4E] px-2 py-0.5 rounded font-mono border border-[#D9E2E1]">ID: {land.land_id || 'RECORD-ID'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#034E4E] mt-0.5 tracking-tight">Full Administrative Record (16 Fields)</h1>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={handleOpen3DMap}
            className="px-4 py-2 bg-[#034E4E] hover:bg-[#023B3B] text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Globe className="w-4 h-4" />
            <span>{show3DMap ? 'Scroll to 3D Map' : 'View in 3D Map'}</span>
          </button>

          <Link
            to={`/officer/land-records/${id}/edit`}
            className="tracia-btn-primary inline-flex items-center space-x-2 text-xs"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Record</span>
          </Link>
        </div>
      </div>

      {/* 16 Core Fields Layout Grid */}
      <div className="tracia-card p-6 space-y-6">
        <div>
          <h2 className="text-xs font-extrabold text-[#101828] uppercase tracking-wider pb-2 border-b border-[#D9E2E1] flex items-center space-x-2">
            <Building className="w-4 h-4 text-[#034E4E]" />
            <span>1. Registration & Deed Information</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-xs text-slate-800">
            <div>
              <span className="block font-medium text-[#667085]">Document Type</span>
              <span className="font-bold text-[#101828] mt-0.5 block capitalize">{land.document_type || 'Deed'}</span>
            </div>
            <div>
              <span className="block font-medium text-[#667085]">Document Number</span>
              <span className="font-bold text-[#101828] font-mono mt-0.5 block">{land.document_number || 'N/A'}</span>
            </div>
            <div>
              <span className="block font-medium text-[#667085]">Registration Date</span>
              <span className="font-bold text-[#101828] mt-0.5 block">{land.registration_date || 'N/A'}</span>
            </div>
            <div>
              <span className="block font-medium text-[#667085]">Registration Office</span>
              <span className="font-bold text-[#101828] mt-0.5 block">{land.registration_office || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xs font-extrabold text-[#101828] uppercase tracking-wider pb-2 border-b border-[#D9E2E1] flex items-center space-x-2">
            <FileText className="w-4 h-4 text-[#034E4E]" />
            <span>2. Location & Property Details</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-xs text-slate-800">
            <div>
              <span className="block font-medium text-[#667085]">District</span>
              <span className="font-bold text-[#101828] mt-0.5 block">{land.district || 'N/A'}</span>
            </div>
            <div>
              <span className="block font-medium text-[#667085]">Taluk</span>
              <span className="font-bold text-[#101828] mt-0.5 block">{land.taluk || 'N/A'}</span>
            </div>
            <div>
              <span className="block font-medium text-[#667085]">Village</span>
              <span className="font-bold text-[#101828] mt-0.5 block">{land.village || 'N/A'}</span>
            </div>
            <div>
              <span className="block font-medium text-[#667085]">Survey Number</span>
              <span className="font-bold text-[#101828] font-mono mt-0.5 block">{land.survey_number || 'N/A'}</span>
            </div>
            <div>
              <span className="block font-medium text-[#667085]">Patta Number</span>
              <span className="font-bold text-[#101828] font-mono mt-0.5 block">{land.patta_number || 'N/A'}</span>
            </div>
            <div>
              <span className="block font-medium text-[#667085]">Property Extent</span>
              <span className="font-bold text-[#101828] mt-0.5 block">{land.property_extent || 'N/A'}</span>
            </div>
            <div>
              <span className="block font-medium text-[#667085]">Land Type</span>
              <span className="font-bold text-[#101828] mt-0.5 block capitalize">{land.land_type || 'N/A'}</span>
            </div>
            <div>
              <span className="block font-medium text-[#667085]">Sale Consideration</span>
              <span className="font-bold text-[#101828] mt-0.5 block">
                {land.sale_consideration ? `₹ ${Number(land.sale_consideration).toLocaleString('en-IN')}` : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xs font-extrabold text-[#101828] uppercase tracking-wider pb-2 border-b border-[#D9E2E1] flex items-center space-x-2">
            <User className="w-4 h-4 text-[#034E4E]" />
            <span>3. Ownership Information</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4 text-xs text-slate-800">
            <div>
              <span className="block font-medium text-[#667085]">Current Owner Name</span>
              <span className="font-bold text-[#101828] mt-0.5 block">{land.owner_name || 'N/A'}</span>
            </div>
            <div>
              <span className="block font-medium text-[#667085]">Previous Owner</span>
              <span className="font-bold text-[#101828] mt-0.5 block">{land.previous_owner || 'N/A'}</span>
            </div>
            <div>
              <span className="block font-medium text-[#667085]">Parent Document Reference</span>
              <span className="font-bold text-[#101828] mt-0.5 block font-mono">{land.parent_document || 'N/A'}</span>
            </div>
            <div className="sm:col-span-3">
              <span className="block font-medium text-[#667085]">Property Description</span>
              <span className="font-bold text-[#101828] mt-0.5 block leading-relaxed">{land.property_description || 'No description provided.'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Geospatial Map Section */}
      {show3DMap && (
        <div id="officer-3d-map" className="scroll-mt-6 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-[#034E4E] uppercase tracking-wider flex items-center space-x-2">
              <Globe className="w-4 h-4 text-[#034E4E]" />
              <span>TRACIA 3D Master Registry Globe View</span>
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
    </div>
  );
};
