import React, { useState } from 'react';
import { 
  Globe2, 
  Layers, 
  Sun, 
  CloudRain, 
  Droplets, 
  Sprout, 
  AlertTriangle, 
  Compass, 
  Clock, 
  Satellite, 
  Maximize2,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Info,
  CheckCircle2
} from 'lucide-react';
import { FarmProfile, EnvironmentalSnapshot } from '@/src/types';
import { useI18n } from '@/src/lib/i18n/context';

interface ClimateMapViewProps {
  farm: FarmProfile;
  environment: EnvironmentalSnapshot;
}

type MapLayerType = 'temperature' | 'rainfall' | 'vegetation' | 'moisture' | 'drought';

export const ClimateMapView: React.FC<ClimateMapViewProps> = ({
  farm,
  environment
}) => {
  const { language } = useI18n();
  const [activeLayer, setActiveLayer] = useState<MapLayerType>('vegetation');
  const [timeWindow, setTimeWindow] = useState<'current' | '30day' | '90day'>('current');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const layerMeta: Record<MapLayerType, {
    title: string;
    satellite: string;
    value: string;
    unit: string;
    scaleMin: string;
    scaleMax: string;
    gradient: string;
    status: string;
    description: string;
    icon: React.FC<{ className?: string }>;
  }> = {
    temperature: {
      title: 'Land Surface Temperature (LST)',
      satellite: 'NASA POWER Agroclimatology & MODIS Thermal',
      value: `${environment.temperature}`,
      unit: '°C',
      scaleMin: '15°C',
      scaleMax: '42°C',
      gradient: 'from-[#F3D7A5] via-[#E2A64D] to-[#B94B43]',
      status: environment.temperature > 30 ? 'Thermal Vigilance' : 'Favorable Thermal Band',
      description: 'Daily skin temperature observations assessing seasonal growing degree days (GDD) and acute evapotranspiration heat spikes.',
      icon: Sun
    },
    rainfall: {
      title: 'Precipitation Accumulation & Anomaly',
      satellite: 'NASA GPM (Global Precipitation Measurement)',
      value: `${environment.precipitation}`,
      unit: 'mm / month',
      scaleMin: '0 mm',
      scaleMax: '200 mm',
      gradient: 'from-[#F5EEDC] via-[#7DAECF] to-[#2E5070]',
      status: `${environment.historicalRainfallAnomalyPercent}% vs 10-Yr Baseline`,
      description: 'Microwave and radar satellite precipitation estimates capturing precipitation volume and historical deviation.',
      icon: CloudRain
    },
    vegetation: {
      title: 'Canopy Chlorophyll Index (NDVI)',
      satellite: 'MODIS Terra/Aqua 250m Resolution',
      value: `${environment.vegetationIndex}`,
      unit: 'NDVI (0-1)',
      scaleMin: '0.10 Sparse',
      scaleMax: '0.90 Dense',
      gradient: 'from-[#F2F1E8] via-[#71966B] to-[#193D25]',
      status: 'Healthy Photosynthetic Canopy',
      description: 'Normalized Difference Vegetation Index measuring active chlorophyll absorption across field boundaries.',
      icon: Sprout
    },
    moisture: {
      title: 'Surface Soil Moisture (0-5cm)',
      satellite: 'NASA SMAP L-Band Radiometer',
      value: `${environment.soilMoisture}`,
      unit: '% Volumetric',
      scaleMin: '5% Arid',
      scaleMax: '65% Saturation',
      gradient: 'from-[#F8F7F0] via-[#7DAECF] to-[#193D25]',
      status: 'Moderate Root-Zone Hydration',
      description: 'Radiometric soil dielectric measurements detecting topsoil water content independently of cloud coverage.',
      icon: Droplets
    },
    drought: {
      title: 'Agro-Hydrological Drought Vulnerability',
      satellite: 'NASA GRACE-FO & Soil Moisture Stress Index',
      value: `${environment.droughtRisk}`,
      unit: `(${environment.droughtIndexScore}/100)`,
      scaleMin: '0 Minimal',
      scaleMax: '100 Severe',
      gradient: 'from-[#DDE8D8] via-[#B9822A] to-[#B94B43]',
      status: environment.droughtRisk === 'Low' ? 'Low Volatility Buffer' : 'Guarded Hydration State',
      description: 'Gravity recovery sub-surface hydrological deficit model correlated with historical drought indices.',
      icon: AlertTriangle
    }
  };

  const currentMeta = layerMeta[activeLayer];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 space-y-7 bg-[#F1F4EF] min-h-full">
      {/* Top Header & Temporal Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#193D25]">
            {language === 'bn' ? 'আবহাওয়া ও উপগ্রহ মানচিত্র' : 'Climate & Earth Observation Map'}
          </h2>
          <p className="text-xs sm:text-sm text-[#697568] mt-0.5">
            {language === 'bn' 
              ? 'নাসার উপগ্রহ থেকে সংগৃহীত সরাসরি মাটির আর্দ্রতা, তাপমাত্রা ও পাতার সূচক।' 
              : 'Calibrated satellite radiometric passes across your agricultural boundary and microclimatic zone.'}
          </p>
        </div>

        {/* Temporal Window Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-full border border-[#DCE2D8] text-xs shadow-2xs">
          <Clock className="w-3.5 h-3.5 text-[#8A9286] ml-2" />
          <button
            onClick={() => setTimeWindow('current')}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
              timeWindow === 'current' ? 'bg-[#193D25] text-white shadow-xs font-semibold' : 'text-[#697568] hover:text-[#193D25]'
            }`}
          >
            Real-time
          </button>
          <button
            onClick={() => setTimeWindow('30day')}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
              timeWindow === '30day' ? 'bg-[#193D25] text-white shadow-xs font-semibold' : 'text-[#697568] hover:text-[#193D25]'
            }`}
          >
            30-Day Trend
          </button>
          <button
            onClick={() => setTimeWindow('90day')}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
              timeWindow === '90day' ? 'bg-[#193D25] text-white shadow-xs font-semibold' : 'text-[#697568] hover:text-[#193D25]'
            }`}
          >
            90-Day Seasonal
          </button>
        </div>
      </div>

      {/* Layer Navigation Tabs — Adaline Style */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {(Object.keys(layerMeta) as MapLayerType[]).map((key) => {
          const item = layerMeta[key];
          const ItemIcon = item.icon;
          const isActive = activeLayer === key;
          return (
            <button
              key={key}
              onClick={() => setActiveLayer(key)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'border-[#193D25] bg-[#DDE8D8] text-[#193D25] shadow-2xs font-semibold'
                  : 'border-[#DCE2D8] bg-white text-[#243428] hover:border-[#71966B]/60 hover:bg-[#F8F7F0]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <ItemIcon className={`w-4 h-4 ${isActive ? 'text-[#193D25]' : 'text-[#71966B]'}`} />
                <span className={`text-[10px] font-mono uppercase ${isActive ? 'text-[#193D25]' : 'text-[#8A9286]'}`}>
                  {key}
                </span>
              </div>
              <div>
                <div className={`text-xs font-semibold leading-tight ${isActive ? 'text-[#193D25]' : 'text-[#243428]'}`}>
                  {key === 'temperature' && 'Temperature'}
                  {key === 'rainfall' && 'Rainfall'}
                  {key === 'vegetation' && 'Canopy (NDVI)'}
                  {key === 'moisture' && 'Soil Moisture'}
                  {key === 'drought' && 'Drought Index'}
                </div>
                <div className="text-xs font-mono font-bold mt-1 text-[#285C35]">
                  {item.value} {item.unit.split(' ')[0]}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Map Canvas Area — Warm Earth-Tone Cartography (No harsh black) */}
      <div className="relative rounded-2xl bg-white border border-[#DCE2D8] p-5 sm:p-7 shadow-2xs text-[#243428] overflow-hidden">
        {/* Top Floating Map Controls */}
        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#DCE2D8] gap-3 z-20 relative">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#36764A] animate-pulse" />
            <span className="text-xs font-semibold text-[#193D25] uppercase tracking-wider">
              {currentMeta.satellite}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoomLevel(prev => Math.min(2.0, prev + 0.25))}
              className="p-1.5 rounded-lg border border-[#DCE2D8] bg-[#F1F4EF] hover:bg-[#DDE8D8] text-[#193D25] transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.75, prev - 0.25))}
              className="p-1.5 rounded-lg border border-[#DCE2D8] bg-[#F1F4EF] hover:bg-[#DDE8D8] text-[#193D25] transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="px-2.5 py-1 rounded-lg border border-[#DCE2D8] bg-[#F1F4EF] hover:bg-[#DDE8D8] text-xs font-medium text-[#193D25] transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Map Body: Earth-Toned Satellite Canvas */}
        <div className="relative my-4 w-full h-80 sm:h-[420px] bg-[#E8EFE5] rounded-xl border border-[#DCE2D8] overflow-hidden flex items-center justify-center">
          {/* Subtle Topographical Pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="climate-grid-clean" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#CBD8C7" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#climate-grid-clean)" />
          </svg>

          {/* Geospatial Geometry & Parcel Heatmap */}
          <div 
            className="w-full h-full flex items-center justify-center transition-transform duration-300"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <svg className="w-full h-full max-w-2xl p-4 z-10" viewBox="0 0 700 450">
              <defs>
                <radialGradient id="climVegGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#71966B" stopOpacity="0.85" />
                  <stop offset="65%" stopColor="#36764A" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#193D25" stopOpacity="0.35" />
                </radialGradient>
                <radialGradient id="climRainGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#7DAECF" stopOpacity="0.85" />
                  <stop offset="65%" stopColor="#527DA5" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#2E5070" stopOpacity="0.35" />
                </radialGradient>
                <radialGradient id="climTempGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#E2A64D" stopOpacity="0.85" />
                  <stop offset="65%" stopColor="#B9822A" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#B94B43" stopOpacity="0.35" />
                </radialGradient>
                <radialGradient id="climMoistGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#7DAECF" stopOpacity="0.85" />
                  <stop offset="65%" stopColor="#36764A" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#193D25" stopOpacity="0.35" />
                </radialGradient>
                <radialGradient id="climDroughtGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#DDE8D8" stopOpacity="0.85" />
                  <stop offset="65%" stopColor="#B9822A" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#B94B43" stopOpacity="0.35" />
                </radialGradient>
              </defs>

              {/* Surrounding Farmland Parcels in gentle agricultural tones */}
              <polygon points="60,40 260,30 230,160 40,150" fill="#DFE6DC" opacity="0.9" stroke="#C8D4C4" strokeWidth="1.5" />
              <polygon points="275,30 540,40 500,170 245,165" fill="#E4EBE0" opacity="0.9" stroke="#C8D4C4" strokeWidth="1.5" />
              <polygon points="515,180 670,185 630,340 470,330" fill="#DDE5D9" opacity="0.9" stroke="#C8D4C4" strokeWidth="1.5" />
              <polygon points="70,165 260,175 210,360 60,345" fill="#E2EAE0" opacity="0.9" stroke="#C8D4C4" strokeWidth="1.5" />
              <polygon points="225,370 450,380 430,440 210,430" fill="#DFE6DC" opacity="0.9" stroke="#C8D4C4" strokeWidth="1.5" />

              {/* Target Farm Polygon (High Radiometric Definition) */}
              <polygon
                points="260,185 475,190 435,365 235,355"
                fill={
                  activeLayer === 'vegetation'
                    ? 'url(#climVegGrad)'
                    : activeLayer === 'rainfall'
                    ? 'url(#climRainGrad)'
                    : activeLayer === 'temperature'
                    ? 'url(#climTempGrad)'
                    : activeLayer === 'moisture'
                    ? 'url(#climMoistGrad)'
                    : 'url(#climDroughtGrad)'
                }
                stroke="#193D25"
                strokeWidth="3"
                className="transition-all duration-700 filter drop-shadow-md"
              />

              {/* Farm Center Label Tag */}
              <g transform="translate(300, 260)">
                <rect x="0" y="0" width="110" height="32" rx="16" fill="#FFFFFF" opacity="0.95" stroke="#DCE2D8" strokeWidth="1.5" />
                <text x="55" y="20" fill="#193D25" fontSize="11" fontWeight="700" textAnchor="middle">
                  {farm.name}
                </text>
              </g>
            </svg>
          </div>

          {/* Floating Observation Legend Card */}
          <div className="absolute bottom-4 left-4 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-[#DCE2D8] shadow-sm max-w-xs space-y-2 z-20">
            <div className="flex items-center justify-between text-xs font-semibold text-[#193D25]">
              <span>Radiometric Scale</span>
              <span className="text-[#8A9286] font-mono text-[10px]">{currentMeta.unit}</span>
            </div>
            {/* Color Gradient Strip */}
            <div className={`h-2.5 rounded-full bg-gradient-to-r ${currentMeta.gradient} border border-[#DCE2D8]`} />
            <div className="flex justify-between text-[10px] font-mono text-[#697568]">
              <span>{currentMeta.scaleMin}</span>
              <span>{currentMeta.scaleMax}</span>
            </div>
            <div className="text-[11px] text-[#243428] font-medium pt-1 border-t border-[#DCE2D8]">
              Status: <span className="font-semibold text-[#193D25]">{currentMeta.status}</span>
            </div>
          </div>
        </div>

        {/* Bottom Details Footer */}
        <div className="pt-4 border-t border-[#DCE2D8] flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="space-y-1 max-w-2xl">
            <div className="font-semibold text-[#193D25] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#71966B]" />
              <span>{currentMeta.title}</span>
            </div>
            <p className="text-[#697568] leading-relaxed">
              {currentMeta.description}
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 text-xs font-mono text-[#8A9286]">
            <span>Lat: {farm.location.latitude.toFixed(4)}°</span>
            <span>Lon: {farm.location.longitude.toFixed(4)}°</span>
            <span className="flex items-center gap-1 text-[#36764A]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
