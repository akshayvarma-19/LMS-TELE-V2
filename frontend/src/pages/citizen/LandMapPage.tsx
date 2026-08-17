import React, { useState } from 'react';
import { Map, Layers, Navigation, Info, Compass } from 'lucide-react';
import { ErrorAlert } from '../../components/common/ErrorAlert';

export const CitizenLandMapPage: React.FC = () => {
  const [selectedLand] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">3D Cadastral Land Map</h1>
          <p className="text-sm text-slate-500 mt-1">
            Spatial representation and boundary visualization for registered land holdings.
          </p>
        </div>
      </div>

      <ErrorAlert
        title="Spatial Engine Disconnected"
        message="Geographic parcel boundaries and 3D terrain rendering will activate when GIS spatial API endpoints are connected."
      />

      {/* Map Layout Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Map Canvas Placeholder Area */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 relative overflow-hidden flex flex-col items-center justify-center text-slate-400 p-8 shadow-inner">
          <div className="absolute top-4 left-4 flex space-x-2 z-10">
            <button className="px-3 py-1.5 bg-slate-800/90 text-slate-200 border border-slate-700 text-xs rounded-lg flex items-center space-x-1.5 shadow-sm">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>Cadastral Boundary</span>
            </button>
            <button className="px-3 py-1.5 bg-slate-800/90 text-slate-200 border border-slate-700 text-xs rounded-lg flex items-center space-x-1.5 shadow-sm">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>3D Elevation</span>
            </button>
          </div>

          <div className="text-center max-w-md space-y-3">
            <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-blue-400 border border-slate-700 shadow-md">
              <Map className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-white">Spatial Map Ready</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Map data will appear when geographic boundary polygon data is available from the GIS database server.
            </p>
          </div>
        </div>

        {/* Selected Land Side Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-200 flex items-center space-x-2">
              <Navigation className="w-4 h-4 text-blue-700" />
              <span>Parcel Information</span>
            </h3>

            {selectedLand ? (
              <div className="mt-4 space-y-3 text-xs">
                <div>
                  <span className="block font-medium text-slate-500">Selected Survey No</span>
                  <span className="font-bold text-slate-900">{selectedLand}</span>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500">
                <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-700">No parcel selected</p>
                <p className="text-xs text-slate-400 mt-1">
                  Click a cadastral survey boundary on the map canvas to inspect land parameters.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-200 text-xs text-slate-400 text-center">
            GPS Datum: WGS 84 • Scale: 1:500
          </div>
        </div>
      </div>
    </div>
  );
};
