import React, { useState } from 'react';
import { Layers, Maximize2, MapPin, Eye, Satellite, Droplets, Sun, Sparkles } from 'lucide-react';
import { FarmProfile, EnvironmentalSnapshot } from '@/src/types';

interface QuickMapProps {
  farm: FarmProfile;
  environment: EnvironmentalSnapshot;
  onOpenFullMap?: () => void;
}

export const QuickMap: React.FC<QuickMapProps> = ({
  farm,
  environment,
  onOpenFullMap
}) => {
  const [activeLayer, setActiveLayer] = useState<'ndvi' | 'moisture' | 'thermal'>('ndvi');

  return (
    <div className="bg-white rounded-2xl border border-[#DCE2D8] p-5 text-[#243428] flex flex-col justify-between overflow-hidden relative shadow-2xs">
      {/* Top Map Bar */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#DCE2D8] gap-2 z-10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#36764A] animate-pulse" />
          <span className="text-xs font-semibold text-[#193D25] uppercase tracking-wider">
            NASA SATELLITE RADAR · PARCEL SCAN
          </span>
          <span className="text-[#8A9286] text-xs hidden sm:inline">|</span>
          <span className="text-xs text-[#697568] font-mono hidden sm:inline">
            {farm.location.latitude.toFixed(3)}°N, {farm.location.longitude.toFixed(3)}°W
          </span>
        </div>

        {/* Layer Switcher Pills */}
        <div className="flex items-center gap-1 bg-[#F1F4EF] p-1 rounded-full border border-[#DCE2D8] text-xs">
          <button
            onClick={() => setActiveLayer('ndvi')}
            className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
              activeLayer === 'ndvi' 
                ? 'bg-[#193D25] text-white font-semibold shadow-xs' 
                : 'text-[#697568] hover:text-[#193D25]'
            }`}
          >
            NDVI
          </button>
          <button
            onClick={() => setActiveLayer('moisture')}
            className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
              activeLayer === 'moisture' 
                ? 'bg-[#193D25] text-white font-semibold shadow-xs' 
                : 'text-[#697568] hover:text-[#193D25]'
            }`}
          >
            Moisture
          </button>
          <button
            onClick={() => setActiveLayer('thermal')}
            className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
              activeLayer === 'thermal' 
                ? 'bg-[#193D25] text-white font-semibold shadow-xs' 
                : 'text-[#697568] hover:text-[#193D25]'
            }`}
          >
            Thermal
          </button>
        </div>
      </div>

      {/* Main Map SVG Simulation Container — Clean Earth-Toned Canvas */}
      <div className="relative my-4 w-full h-64 sm:h-72 bg-[#E9EFE6] rounded-xl border border-[#DCE2D8] overflow-hidden flex items-center justify-center">
        {/* Subtle Topographical Grid overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern-quick" width="36" height="36" patternUnits="userSpaceOnUse">
              <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#CBD8C7" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern-quick)" />
        </svg>

        {/* Farm Boundary Geometry */}
        <svg className="w-full h-full max-w-lg p-4 z-10" viewBox="0 0 500 300">
          <defs>
            <radialGradient id="ndviGradQuick" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#71966B" stopOpacity="0.85" />
              <stop offset="70%" stopColor="#36764A" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#193D25" stopOpacity="0.35" />
            </radialGradient>
            <radialGradient id="moistureGradQuick" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#7DAECF" stopOpacity="0.85" />
              <stop offset="70%" stopColor="#527DA5" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#2E5070" stopOpacity="0.35" />
            </radialGradient>
            <radialGradient id="thermalGradQuick" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#E2A64D" stopOpacity="0.85" />
              <stop offset="70%" stopColor="#B9822A" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#8C5C15" stopOpacity="0.35" />
            </radialGradient>
          </defs>

          {/* Surrounding Farmland Parcels in warm earth tones */}
          <polygon points="40,30 180,20 160,110 30,100" fill="#DFE6DC" opacity="0.85" stroke="#C8D4C4" strokeWidth="1.5" />
          <polygon points="190,20 380,30 350,120 170,115" fill="#E4EBE0" opacity="0.85" stroke="#C8D4C4" strokeWidth="1.5" />
          <polygon points="360,125 470,130 440,240 330,230" fill="#DDE5D9" opacity="0.85" stroke="#C8D4C4" strokeWidth="1.5" />
          <polygon points="50,110 180,120 150,250 40,240" fill="#E2EAE0" opacity="0.85" stroke="#C8D4C4" strokeWidth="1.5" />

          {/* Active Target Farm Parcel (Highlighted) */}
          <polygon
            points="180,130 330,135 300,260 160,255"
            fill={
              activeLayer === 'ndvi'
                ? 'url(#ndviGradQuick)'
                : activeLayer === 'moisture'
                ? 'url(#moistureGradQuick)'
                : 'url(#thermalGradQuick)'
            }
            stroke="#193D25"
            strokeWidth="2.5"
            className="transition-all duration-500 filter drop-shadow-sm"
          />

          {/* Farm Label Tag inside Parcel */}
          <g transform="translate(205, 185)">
            <rect x="0" y="0" width="85" height="28" rx="14" fill="#FFFFFF" opacity="0.95" stroke="#DCE2D8" strokeWidth="1" />
            <text x="42.5" y="17" fill="#193D25" fontSize="10.5" fontWeight="600" textAnchor="middle">
              {farm.size} {farm.unit}
            </text>
          </g>
        </svg>

        {/* Floating Telemetry Badge */}
        <div className="absolute top-4 left-4 p-3 bg-white/95 backdrop-blur-md rounded-xl border border-[#DCE2D8] text-xs space-y-1 shadow-2xs z-20">
          <div className="text-[10px] text-[#8A9286] font-semibold uppercase tracking-wider">
            {activeLayer === 'ndvi' ? 'Vegetation Index' : activeLayer === 'moisture' ? 'Topsoil Hydration' : 'Surface Heat'}
          </div>
          <div className="text-base font-semibold text-[#193D25]">
            {activeLayer === 'ndvi' && `${environment.vegetationIndex} NDVI`}
            {activeLayer === 'moisture' && `${environment.soilMoisture}% Vol`}
            {activeLayer === 'thermal' && `${environment.temperature}°C`}
          </div>
          <div className="text-[10px] text-[#697568]">
            {activeLayer === 'ndvi' && 'Healthy canopy vigor'}
            {activeLayer === 'moisture' && 'Normal root moisture'}
            {activeLayer === 'thermal' && 'Steady diurnal range'}
          </div>
        </div>
      </div>

      {/* Bottom Summary Bar */}
      <div className="pt-1 flex flex-wrap items-center justify-between text-xs gap-3">
        <div className="flex items-center gap-2 text-[#697568]">
          <Satellite className="w-3.5 h-3.5 text-[#71966B]" />
          <span>MODIS & SMAP 250m Spatial Boundary Resolution</span>
        </div>

        {onOpenFullMap && (
          <button
            onClick={onOpenFullMap}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#193D25] hover:text-[#285C35] hover:underline cursor-pointer"
          >
            <span>Expand Multi-Layer Analysis</span>
            <Maximize2 className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
