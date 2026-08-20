import React, { useEffect, useRef, useState } from 'react';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import { MapPin, Info, AlertTriangle, RefreshCw } from 'lucide-react';

export interface Land3DMapProps {
  latitude?: number;
  longitude?: number;
  surveyNumber?: string;
  pattaNumber?: string;
  village?: string;
  taluk?: string;
  district?: string;
  propertyExtent?: string;
  landType?: string;
  className?: string;
}

export const Land3DMap: React.FC<Land3DMapProps> = ({
  latitude,
  longitude,
  surveyNumber,
  pattaNumber,
  village,
  taluk,
  district,
  propertyExtent,
  landType,
  className = 'h-[450px]'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenMissing, setTokenMissing] = useState(false);

  const hasCoordinates =
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    !isNaN(latitude) &&
    !isNaN(longitude) &&
    (latitude !== 0 || longitude !== 0);

  useEffect(() => {
    const token = import.meta.env.VITE_CESIUM_ION_TOKEN;

    if (!token || typeof token !== 'string' || token.trim() === '') {
      setTokenMissing(true);
      setLoading(false);
      return;
    }

    Cesium.Ion.defaultAccessToken = token.trim();

    if (!containerRef.current) return;

    let viewer: Cesium.Viewer | null = null;

    const initCesium = async () => {
      try {
        setLoading(true);
        setError(null);

        // Create Terrain Provider
        let terrainProvider: Cesium.TerrainProvider | undefined;
        try {
          terrainProvider = await Cesium.createWorldTerrainAsync({
            requestWaterMask: true,
            requestVertexNormals: true
          });
        } catch (tErr) {
          console.warn('Cesium World Terrain fallback notice:', tErr);
        }

        if (!containerRef.current) return;

        viewer = new Cesium.Viewer(containerRef.current, {
          terrainProvider,
          animation: false,
          timeline: false,
          fullscreenButton: false,
          baseLayerPicker: true,
          geocoder: true,
          homeButton: true,
          sceneModePicker: true,
          navigationHelpButton: false,
          infoBox: true,
          selectionIndicator: true
        });

        viewerRef.current = viewer;

        // Enable depth testing against terrain
        viewer.scene.globe.depthTestAgainstTerrain = true;

        if (hasCoordinates && latitude && longitude) {
          // Add Marker Entity
          const pinBuilder = new Cesium.PinBuilder();
          const pinColor = Cesium.Color.fromCssColorString('#034E4E');

          const entity = viewer.entities.add({
            name: `Land Title Parcel ${surveyNumber ? `(Survey: ${surveyNumber})` : ''}`,
            position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
            billboard: {
              image: pinBuilder.fromColor(pinColor, 48).toDataURL(),
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            },
            label: {
              text: surveyNumber ? `Survey No: ${surveyNumber}` : 'Land Parcel',
              font: 'bold 13px sans-serif',
              fillColor: Cesium.Color.WHITE,
              outlineColor: Cesium.Color.fromCssColorString('#034E4E'),
              outlineWidth: 3,
              style: Cesium.LabelStyle.FILL_AND_OUTLINE,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              pixelOffset: new Cesium.Cartesian2(0, -52),
              heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            },
            description: `
              <div style="font-family: sans-serif; padding: 10px; color: #101828; line-height: 1.5;">
                <div style="display: inline-block; background: #F4F8F7; color: #034E4E; font-size: 11px; font-weight: bold; padding: 3px 8px; border-radius: 4px; border: 1px solid #D9E2E1; margin-bottom: 8px;">
                  Approximate Land Location
                </div>
                <h3 style="color: #034E4E; font-size: 14px; font-weight: bold; margin: 0 0 8px 0; border-bottom: 1px solid #E4E7EC; padding-bottom: 4px;">
                  Registered Land Parcel Information
                </h3>
                ${surveyNumber ? `<p style="margin: 4px 0;"><b>Survey Number:</b> ${surveyNumber}</p>` : ''}
                ${pattaNumber ? `<p style="margin: 4px 0;"><b>Patta Number:</b> ${pattaNumber}</p>` : ''}
                ${village ? `<p style="margin: 4px 0;"><b>Village:</b> ${village}</p>` : ''}
                ${taluk ? `<p style="margin: 4px 0;"><b>Taluk:</b> ${taluk}</p>` : ''}
                ${district ? `<p style="margin: 4px 0;"><b>District:</b> ${district}</p>` : ''}
                ${propertyExtent ? `<p style="margin: 4px 0;"><b>Property Extent:</b> ${propertyExtent}</p>` : ''}
                ${landType ? `<p style="margin: 4px 0;"><b>Land Classification:</b> ${landType}</p>` : ''}
                <p style="margin-top: 10px; font-size: 11px; color: #667085;">
                  <b>Coordinates:</b> ${latitude.toFixed(6)}° N, ${longitude.toFixed(6)}° E
                </p>
                <p style="margin-top: 4px; font-size: 10px; color: #98A2B3; font-style: italic;">
                  * Coordinates represent a geographic point and are not an official cadastral boundary.
                </p>
              </div>
            `
          });

          viewer.selectedEntity = entity;

          // Fly Camera to Location with Tilt and Heading
          viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, 1200),
            orientation: {
              heading: Cesium.Math.toRadians(0.0),
              pitch: Cesium.Math.toRadians(-45.0),
              roll: 0.0
            },
            duration: 2.5
          });
        } else {
          // Default camera view of Tamil Nadu / India region
          viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(79.13, 12.92, 450000),
            orientation: {
              heading: Cesium.Math.toRadians(0.0),
              pitch: Cesium.Math.toRadians(-55.0),
              roll: 0.0
            }
          });
        }

        setLoading(false);
      } catch (err: any) {
        console.error('Cesium initialization error:', err);
        setError(err.message || 'Failed to initialize 3D Globe Viewer');
        setLoading(false);
      }
    };

    initCesium();

    return () => {
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [latitude, longitude, surveyNumber]);

  if (tokenMissing) {
    return (
      <div className={`w-full ${className} bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-center items-center p-6 text-center`}>
        <AlertTriangle className="w-10 h-10 text-amber-600 mb-3" />
        <h3 className="text-sm font-bold text-slate-900">Cesium Ion Access Token Missing</h3>
        <p className="text-xs text-slate-500 max-w-md mt-1">
          Please configure <code className="bg-slate-200 px-1.5 py-0.5 rounded font-mono text-[11px]">VITE_CESIUM_ION_TOKEN</code> in your frontend <code className="bg-slate-200 px-1.5 py-0.5 rounded font-mono text-[11px]">.env</code> file to enable 3D Cesium World Terrain visualization.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`w-full ${className} bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-center items-center p-6 text-center`}>
        <AlertTriangle className="w-10 h-10 text-rose-600 mb-3" />
        <h3 className="text-sm font-bold text-slate-900">3D Globe Initialization Error</h3>
        <p className="text-xs text-slate-500 max-w-md mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
      {/* Top Banner Notice for Location Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white border-b border-slate-200 px-4 py-2.5 gap-2 text-xs">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-[#034E4E] shrink-0" />
          <span className="font-bold text-[#034E4E]">TRACIA 3D Geospatial Viewer</span>
          {surveyNumber && (
            <span className="bg-slate-100 text-slate-700 font-mono px-2 py-0.5 rounded text-[11px]">
              Survey: {surveyNumber}
            </span>
          )}
        </div>

        {!hasCoordinates ? (
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-medium">
            <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Location data unavailable</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <span className="bg-[#F4F8F7] border border-[#D9E2E1] text-[#034E4E] px-2 py-0.5 rounded text-[11px] font-semibold">
              Approximate Land Location
            </span>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] font-medium font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{latitude?.toFixed(5)}° N, {longitude?.toFixed(5)}° E</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Cesium Container */}
      <div className={`relative w-full ${className}`}>
        {loading && (
          <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-xs flex items-center justify-center space-x-2">
            <RefreshCw className="w-5 h-5 text-[#034E4E] animate-spin" />
            <span className="text-xs font-semibold text-[#034E4E]">Loading Cesium World Terrain 3D Globe...</span>
          </div>
        )}

        <div ref={containerRef} className="w-full h-full" />

        {/* Overlay Warning when coordinates are not in database */}
        {!hasCoordinates && !loading && (
          <div className="absolute bottom-4 left-4 right-4 z-10 max-w-md bg-white/95 backdrop-blur-xs border border-slate-200 rounded-xl p-3 shadow-md text-xs space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-slate-900">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Location Data Unavailable</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Geospatial coordinates (Latitude & Longitude) have not been registered for this land record in official records yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
