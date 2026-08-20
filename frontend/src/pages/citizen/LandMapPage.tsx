import React, { useState } from 'react';
import { Map, Layers, Navigation, Info, Compass } from 'lucide-react';
import { ErrorAlert } from '../../components/common/ErrorAlert';

export const CitizenLandMapPage: React.FC = () => {
  const [selectedLand] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#034E4E] tracking-tight">3D Cadastral Land Map</h1>
        <p className="text-xs sm:text-sm text-[#667085] mt-1">
          Spatial representation and boundary visualization for registered land holdings.
        </p>
      </div>

      <ErrorAlert
        title="Spatial Engine Notice"
        message="Geographic parcel boundaries and 3D terrain rendering will activate when GIS spatial API endpoints are connected."
      />

      {/* Map Layout Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Map Canvas Placeholder Area */}
        <div className="lg:col-span-2 bg-[#012F2F] rounded-lg border border-[#023B3B] relative overflow-hidden flex flex-col items-center justify-center text-white p-8">
          <div className="absolute top-4 left-4 flex space-x-2 z-10">
            <button className="px-3 py-1.5 bg-[#023B3B] text-white border border-white/20 text-xs font-semibold rounded flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-white" />
              <span>Cadastral Boundary</span>
            </button>
            <button className="px-3 py-1.5 bg-[#023B3B] text-white border border-white/20 text-xs font-semibold rounded flex items-center space-x-1.5">
              <Compass className="w-3.5 h-3.5 text-white" />
              <span>3D Elevation</span>
            </button>
          </div>

          <div className="text-center max-w-md space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#034E4E] flex items-center justify-center mx-auto text-white border border-white/20">
              <Map className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-white">Spatial Map Ready</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Map data will appear when geographic boundary polygon data is available from the GIS database server.
            </p>
          </div>
        </div>

        {/* Selected Land Side Panel */}
        <div className="tracia-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-extrabold text-[#101828] uppercase tracking-wider pb-3 border-b border-[#D9E2E1] flex items-center space-x-2">
              <Navigation className="w-4 h-4 text-[#034E4E]" />
              <span>Parcel Information</span>
            </h3>

            {selectedLand ? (
              <div className="mt-4 space-y-3 text-xs">
                <div>
                  <span className="block font-medium text-[#667085]">Selected Survey No</span>
                  <span className="font-bold text-[#101828]">{selectedLand}</span>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-[#667085]">
                <Info className="w-8 h-8 text-[#034E4E] mx-auto mb-2" />
                <p className="text-xs font-bold text-[#101828]">No parcel selected</p>
                <p className="text-xs text-[#667085] mt-1">
                  Click a cadastral survey boundary on the map canvas to inspect land parameters.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#D9E2E1] text-[11px] text-[#667085] text-center">
            GPS Datum: WGS 84 • Scale: 1:500
          </div>
        </div>
      </div>
    </div>
  );
};
