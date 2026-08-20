import React, { useState, useEffect } from 'react';
import { Navigation, Info, Building, MapPin, Loader2 } from 'lucide-react';
import { Land3DMap } from '../../components/common/Land3DMap';
import { landService } from '../../services/landService';
import type { LandRecord } from '../../types';

export const CitizenLandMapPage: React.FC = () => {
  const [lands, setLands] = useState<LandRecord[]>([]);
  const [selectedLand, setSelectedLand] = useState<LandRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLands = async () => {
      setLoading(true);
      try {
        const res = await landService.getMyLandRecords();
        if ((res.success || res.status === 'success') && Array.isArray(res.data) && res.data.length > 0) {
          setLands(res.data);
          // Prefer record with valid coordinates or default to first record
          const foundWithCoords = res.data.find(
            l => typeof l.latitude === 'number' && typeof l.longitude === 'number'
          );
          setSelectedLand(foundWithCoords || res.data[0]);
        }
      } catch (err) {
        console.error('Failed to load user lands for 3D map:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLands();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#034E4E] tracking-tight">Cesium 3D World Terrain Map</h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-1">
            Interactive 3D Geospatial representation and elevation terrain view for land holdings.
          </p>
        </div>

        {/* Property Selector Dropdown */}
        {lands.length > 0 && (
          <div className="flex items-center space-x-2 bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
            <Building className="w-4 h-4 text-[#034E4E] shrink-0" />
            <label className="text-xs font-bold text-slate-700 shrink-0">Select Property:</label>
            <select
              value={selectedLand?.id || ''}
              onChange={(e) => {
                const matched = lands.find(l => l.id === e.target.value);
                if (matched) setSelectedLand(matched);
              }}
              className="text-xs font-semibold text-[#034E4E] bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#034E4E]"
            >
              {lands.map((land) => (
                <option key={land.id} value={land.id}>
                  {land.village} (Survey: {land.survey_number}) {land.latitude ? '📍 3D Coordinates Available' : ''}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Map Layout Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real Cesium 3D Globe Canvas Area */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="h-[550px] bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center space-y-2">
              <Loader2 className="w-8 h-8 text-[#034E4E] animate-spin" />
              <span className="text-xs font-semibold text-slate-600">Loading property coordinates...</span>
            </div>
          ) : (
            <Land3DMap
              key={selectedLand?.id || 'default-map'}
              className="h-[550px]"
              latitude={selectedLand?.latitude}
              longitude={selectedLand?.longitude}
              surveyNumber={selectedLand?.survey_number}
              pattaNumber={selectedLand?.patta_number}
              village={selectedLand?.village}
              taluk={selectedLand?.taluk}
              district={selectedLand?.district}
              propertyExtent={selectedLand?.property_extent}
              landType={selectedLand?.land_type}
            />
          )}
        </div>

        {/* Selected Land Side Panel */}
        <div className="tracia-card p-6 flex flex-col justify-between h-[550px]">
          <div>
            <h3 className="text-xs font-extrabold text-[#101828] uppercase tracking-wider pb-3 border-b border-[#D9E2E1] flex items-center space-x-2">
              <Navigation className="w-4 h-4 text-[#034E4E]" />
              <span>Selected Land Information</span>
            </h3>

            {selectedLand ? (
              <div className="py-4 space-y-3 text-xs">
                <div className="p-3 bg-[#F4F8F7] rounded-xl border border-[#D9E2E1] space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-[#034E4E] font-bold">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedLand.village}, {selectedLand.taluk}</span>
                  </div>
                  <p className="text-[11px] text-slate-600"><b>District:</b> {selectedLand.district}</p>
                  <p className="text-[11px] text-slate-600 font-mono"><b>Survey No:</b> {selectedLand.survey_number}</p>
                  <p className="text-[11px] text-slate-600 font-mono"><b>Patta No:</b> {selectedLand.patta_number || 'N/A'}</p>
                  <p className="text-[11px] text-slate-600"><b>Extent:</b> {selectedLand.property_extent || 'N/A'}</p>
                  <p className="text-[11px] text-slate-600"><b>Type:</b> {selectedLand.land_type || 'N/A'}</p>
                  {selectedLand.latitude && selectedLand.longitude ? (
                    <div className="mt-2 pt-2 border-t border-[#D9E2E1] text-[11px] font-mono text-emerald-700 font-bold">
                      📍 {selectedLand.latitude.toFixed(5)}° N, {selectedLand.longitude.toFixed(5)}° E
                    </div>
                  ) : (
                    <div className="mt-2 pt-2 border-t border-[#D9E2E1] text-[11px] text-amber-700 font-medium">
                      ⚠️ No 3D coordinates registered yet.
                    </div>
                  )}
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-[11px] space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-slate-900">
                    <Info className="w-3.5 h-3.5 text-[#034E4E]" />
                    <span>Navigation Guide</span>
                  </div>
                  <ul className="list-disc list-inside text-slate-600 space-y-1 text-[11px] mt-1">
                    <li><b>Left Click + Drag:</b> Pan / Rotate camera</li>
                    <li><b>Right Click + Drag:</b> Zoom camera level</li>
                    <li><b>Middle Click / Ctrl + Drag:</b> Tilt 3D elevation</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-[#667085]">
                <Info className="w-8 h-8 text-[#034E4E] mx-auto mb-2" />
                <p className="text-xs font-bold text-[#101828]">No land selected</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#D9E2E1] text-[11px] text-[#667085] text-center font-mono">
            Datum: WGS 84 • Cesium World Terrain Engine
          </div>
        </div>
      </div>
    </div>
  );
};
