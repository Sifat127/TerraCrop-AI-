import React, { useState } from 'react';
import { 
  Sprout, 
  MapPin, 
  Droplets, 
  Layers, 
  CalendarRange, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle,
  Compass,
  Check,
  Edit3
} from 'lucide-react';
import { FarmProfile, SoilType, WaterAvailability, FarmerPriority, PlanningPeriod } from '@/src/types';
import { CROP_LIST } from '@/src/lib/crops/database';
import { useI18n } from '@/src/lib/i18n/context';
import { FarmLocationMapPicker } from '../common/FarmLocationMapPicker';

interface FarmProfileViewProps {
  initialProfile: FarmProfile;
  onSaveAndAnalyze: (profile: FarmProfile) => void;
  onOpenOnboarding?: () => void;
  isLoading?: boolean;
}

const PRESET_LOCATIONS = [
  { name: 'Indo-Gangetic Plain / Bengal Delta', lat: 23.81, lon: 90.41, region: 'Bengal Agro-Climatic Basin', country: 'Bangladesh / India' },
  { name: 'Corn Belt, Midwest (USA)', lat: 41.87, lon: -93.09, region: 'Midwest Agricultural Corridor', country: 'United States' },
  { name: 'Central Valley, California (USA)', lat: 36.65, lon: -119.85, region: 'California Central Basin', country: 'United States' },
  { name: 'Mato Grosso Savanna (Brazil)', lat: -12.68, lon: -55.99, region: 'Cerrado Agricultural Hub', country: 'Brazil' },
  { name: 'Darling Downs, Queensland (Australia)', lat: -27.56, lon: 151.95, region: 'Queensland Basin', country: 'Australia' }
];

const SOIL_TYPES: SoilType[] = ['Loamy', 'Sandy', 'Clay', 'Silty', 'Mixed', 'Unknown'];
const WATER_LEVELS: WaterAvailability[] = ['Low', 'Medium', 'High'];
const ALL_PRIORITIES: FarmerPriority[] = [
  'Improve soil health',
  'Save water',
  'Reduce climate risk',
  'Maximize yield',
  'Increase crop diversity'
];

export const FarmProfileView: React.FC<FarmProfileViewProps> = ({
  initialProfile,
  onSaveAndAnalyze,
  onOpenOnboarding,
  isLoading = false
}) => {
  const { t, language } = useI18n();

  const [name, setName] = useState(initialProfile.name);
  const [size, setSize] = useState(initialProfile.size.toString());
  const [unit, setUnit] = useState<'acres' | 'hectares'>(initialProfile.unit);
  const [lat, setLat] = useState(initialProfile.location.latitude.toString());
  const [lon, setLon] = useState(initialProfile.location.longitude.toString());
  const [address, setAddress] = useState(initialProfile.location.address);
  const [region, setRegion] = useState(initialProfile.location.region);
  const [soilType, setSoilType] = useState<SoilType>(initialProfile.soilType);
  const [currentCropId, setCurrentCropId] = useState(initialProfile.currentCropId);
  const [previousCropId, setPreviousCropId] = useState(initialProfile.previousCropId || 'wheat');
  const [waterAvailability, setWaterAvailability] = useState<WaterAvailability>(initialProfile.waterAvailability);
  const [irrigationAvailability, setIrrigationAvailability] = useState(initialProfile.irrigationAvailability);
  const [priorities, setPriorities] = useState<FarmerPriority[]>(initialProfile.priorities);
  const [planningPeriod, setPlanningPeriod] = useState<PlanningPeriod>(initialProfile.planningPeriod);
  const [showMapPicker, setShowMapPicker] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const togglePriority = (p: FarmerPriority) => {
    if (priorities.includes(p)) {
      if (priorities.length === 1) {
        setErrors(prev => ({ ...prev, priorities: 'At least one operational priority is required.' }));
        return;
      }
      setPriorities(priorities.filter(item => item !== p));
    } else {
      setPriorities([...priorities, p]);
      setErrors(prev => {
        const next = { ...prev };
        delete next.priorities;
        return next;
      });
    }
  };

  const handleApplyPreset = (loc: typeof PRESET_LOCATIONS[0]) => {
    setLat(loc.lat.toString());
    setLon(loc.lon.toString());
    setAddress(loc.name);
    setRegion(loc.region);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Farm name is required.';
    const parsedSize = parseFloat(size);
    if (isNaN(parsedSize) || parsedSize <= 0) newErrors.size = 'Enter a valid positive acreage/hectares.';
    const parsedLat = parseFloat(lat);
    if (isNaN(parsedLat) || parsedLat < -90 || parsedLat > 90) newErrors.lat = 'Latitude must be between -90 and +90.';
    const parsedLon = parseFloat(lon);
    if (isNaN(parsedLon) || parsedLon < -180 || parsedLon > 180) newErrors.lon = 'Longitude must be between -180 and +180.';
    if (priorities.length === 0) newErrors.priorities = 'Select at least one farm priority.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const updatedProfile: FarmProfile = {
      ...initialProfile,
      name: name.trim(),
      size: parsedSize,
      unit,
      location: {
        latitude: Number(parsedLat.toFixed(4)),
        longitude: Number(parsedLon.toFixed(4)),
        address: address || `${parsedLat.toFixed(2)}°, ${parsedLon.toFixed(2)}°`,
        region: region || 'Designated Agricultural Zone',
        country: initialProfile.location.country || 'Global'
      },
      soilType,
      currentCropId,
      previousCropId,
      waterAvailability,
      irrigationAvailability,
      priorities,
      planningPeriod,
      updatedAt: new Date().toISOString()
    };

    onSaveAndAnalyze(updatedProfile);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 space-y-7 bg-[#F1F4EF] min-h-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#193D25]">
            {language === 'bn' ? 'আমার খামার' : 'My Farm'}
          </h2>
          <p className="text-xs sm:text-sm text-[#697568] mt-0.5">
            {language === 'bn' 
              ? 'মাটির বৈশিষ্ট্য, পানির অবস্থা এবং ফসলের ইতিহাস নির্ধারণ করুন।' 
              : 'Soil parameters, geography, and botanical history.'}
          </p>
        </div>

        {onOpenOnboarding && (
          <button
            type="button"
            onClick={onOpenOnboarding}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-[#F2F1E8] border border-[#DCE2D8] text-xs font-semibold text-[#193D25] shadow-2xs transition-all cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-[#71966B]" />
            <span>{language === 'bn' ? '৫-ধাপের নির্দেশিত প্রস্তুতি' : 'Open Guided Setup'}</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Farm Identity & Soil */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card: Basic Identity */}
          <div className="bg-white rounded-2xl p-6 border border-[#DCE2D8] shadow-2xs space-y-4">
            <h3 className="font-semibold text-sm text-[#193D25] uppercase tracking-wider flex items-center gap-2">
              <Sprout className="w-4 h-4 text-[#71966B]" />
              <span>General Information</span>
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-medium text-[#697568]">Farm Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Green Valley Farm"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#243428] focus:outline-none focus:border-[#71966B] bg-white ${
                  errors.name ? 'border-[#B94B43]' : 'border-[#DCE2D8]'
                }`}
              />
              {errors.name && <p className="text-xs text-[#B94B43] mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#697568]">Cultivated Area</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.1"
                  value={size}
                  onChange={e => setSize(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DCE2D8] text-sm text-[#243428] focus:outline-none focus:border-[#71966B] bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#697568]">Measurement Unit</label>
                <div className="flex bg-[#F1F4EF] p-1 rounded-xl border border-[#DCE2D8]">
                  <button
                    type="button"
                    onClick={() => setUnit('acres')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                      unit === 'acres' ? 'bg-white text-[#193D25] shadow-2xs font-semibold' : 'text-[#697568]'
                    }`}
                  >
                    Acres
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnit('hectares')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                      unit === 'hectares' ? 'bg-white text-[#193D25] shadow-2xs font-semibold' : 'text-[#697568]'
                    }`}
                  >
                    Hectares
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Soil & Standing Crop */}
          <div className="bg-white rounded-2xl p-6 border border-[#DCE2D8] shadow-2xs space-y-4">
            <h3 className="font-semibold text-sm text-[#193D25] uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#71966B]" />
              <span>Soil Texture & Botanical History</span>
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#697568]">Predominant Soil Texture</label>
              <div className="grid grid-cols-3 gap-2">
                {SOIL_TYPES.map(st => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setSoilType(st)}
                    className={`py-2 px-3 text-xs font-medium rounded-xl border text-center transition-all cursor-pointer ${
                      soilType === st
                        ? 'border-[#193D25] bg-[#DDE8D8] text-[#193D25] font-semibold'
                        : 'border-[#DCE2D8] bg-white text-[#697568] hover:border-[#71966B]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#697568]">Current Standing Crop</label>
                <select
                  value={currentCropId}
                  onChange={e => setCurrentCropId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE2D8] bg-white text-xs sm:text-sm text-[#243428] focus:outline-none focus:border-[#71966B]"
                >
                  {CROP_LIST.map(crop => (
                    <option key={crop.id} value={crop.id}>
                      {crop.name} ({crop.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#697568]">Previous Predecessor Crop</label>
                <select
                  value={previousCropId}
                  onChange={e => setPreviousCropId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE2D8] bg-white text-xs sm:text-sm text-[#243428] focus:outline-none focus:border-[#71966B]"
                >
                  {CROP_LIST.map(crop => (
                    <option key={crop.id} value={crop.id}>
                      {crop.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Location & Priorities */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card: Location Presets */}
          <div className="bg-white rounded-2xl p-6 border border-[#DCE2D8] shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-[#193D25] uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#71966B]" />
                <span>Location & NASA Telemetry Grid</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowMapPicker(!showMapPicker)}
                className="text-xs font-semibold text-[#193D25] hover:text-[#285C35] underline cursor-pointer"
              >
                {showMapPicker ? 'Close Map' : 'Open Interactive Map'}
              </button>
            </div>

            {showMapPicker ? (
              <div className="pt-2">
                <FarmLocationMapPicker
                  initialLatitude={parseFloat(lat) || 23.81}
                  initialLongitude={parseFloat(lon) || 90.41}
                  initialAddress={address || name}
                  initialRegion={region}
                  onLocationChange={(loc) => {
                    setLat(loc.latitude.toString());
                    setLon(loc.longitude.toString());
                    setAddress(loc.address);
                    setRegion(loc.region);
                  }}
                  showAutoTriggerNotice={true}
                />
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setShowMapPicker(true)}
                  className="w-full py-2.5 px-4 rounded-xl border border-[#DCE2D8] bg-[#F8F7F0] hover:bg-[#DDE8D8]/50 text-xs font-semibold text-[#193D25] flex items-center justify-between cursor-pointer transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Compass className="w-3.5 h-3.5 text-[#285C35]" />
                    <span>Pinpoint on Real-Time Satellite Map</span>
                  </span>
                  <span className="text-[10px] text-[#8A9286] font-mono">
                    {parseFloat(lat).toFixed(2)}°, {parseFloat(lon).toFixed(2)}°
                  </span>
                </button>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-[#697568]">Representative Agro-Corridor</label>
                  <div className="space-y-1.5">
                    {PRESET_LOCATIONS.map(loc => (
                      <button
                        key={loc.name}
                        type="button"
                        onClick={() => handleApplyPreset(loc)}
                        className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between ${
                          region === loc.region
                            ? 'border-[#193D25] bg-[#DDE8D8]/50 text-[#193D25] font-semibold'
                            : 'border-[#DCE2D8] bg-white text-[#697568] hover:border-[#71966B]'
                        }`}
                      >
                        <div>
                          <div className="font-medium text-[#243428]">{loc.name}</div>
                          <div className="text-[10px] text-[#8A9286]">{loc.lat}°, {loc.lon}°</div>
                        </div>
                        {region === loc.region && <Check className="w-4 h-4 text-[#193D25]" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Card: Operational Priorities */}
          <div className="bg-white rounded-2xl p-6 border border-[#DCE2D8] shadow-2xs space-y-4">
            <h3 className="font-semibold text-sm text-[#193D25] uppercase tracking-wider flex items-center gap-2">
              <CalendarRange className="w-4 h-4 text-[#71966B]" />
              <span>Operational Priorities</span>
            </h3>

            <div className="space-y-2">
              {ALL_PRIORITIES.map(p => {
                const isSelected = priorities.includes(p);
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => togglePriority(p)}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-[#193D25] bg-[#DDE8D8]/50 text-[#193D25] font-semibold'
                        : 'border-[#DCE2D8] bg-white text-[#697568] hover:border-[#71966B]'
                    }`}
                  >
                    <span>{p}</span>
                    <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                      isSelected ? 'bg-[#193D25] border-[#193D25] text-white' : 'border-[#DCE2D8]'
                    }`}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 py-3 rounded-full bg-[#193D25] hover:bg-[#285C35] text-white font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Updating & Recalculating...' : 'Save & Sync Satellite Grid'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
