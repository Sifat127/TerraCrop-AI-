import React, { useState } from 'react';
import { 
  MapPin, 
  Sprout, 
  Droplets, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles,
  HelpCircle,
  LocateFixed,
  X,
  Search,
  Compass,
  Layers,
  Globe2
} from 'lucide-react';
import { FarmProfile, SoilType, FarmerPriority } from '@/src/types';
import { CROP_LIST } from '@/src/lib/crops/database';
import { useI18n } from '@/src/lib/i18n/context';
import { FarmLocationMapPicker } from '../common/FarmLocationMapPicker';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (profile: FarmProfile) => void;
  initialFarm: FarmProfile;
}

const REGIONAL_PRESETS = [
  { name: 'Indo-Gangetic Plain / Bengal Delta', lat: 23.8103, lon: 90.4125, region: 'Bengal Agro-Climatic Basin', country: 'Bangladesh / India' },
  { name: 'Corn Belt, Midwest', lat: 41.8780, lon: -93.0977, region: 'Midwest Agricultural Corridor', country: 'United States' },
  { name: 'Central Valley, California', lat: 36.6500, lon: -119.8500, region: 'California Central Basin', country: 'United States' },
  { name: 'Mato Grosso Savanna', lat: -12.6819, lon: -55.9926, region: 'Cerrado Agricultural Hub', country: 'Brazil' },
  { name: 'Darling Downs, Queensland', lat: -27.5598, lon: 151.9507, region: 'Queensland Basin', country: 'Australia' }
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  initialFarm
}) => {
  const { t, language } = useI18n();

  const [step, setStep] = useState(1);
  const [isFinishing, setIsFinishing] = useState(false);
  const [showLocationMap, setShowLocationMap] = useState(false);

  // Step 1: Location state
  const [locationName, setLocationName] = useState(initialFarm.location.address || 'Bengal Agro-Climatic Basin');
  const [regionName, setRegionName] = useState(initialFarm.location.region || 'Bengal Basin');
  const [latitude, setLatitude] = useState(initialFarm.location.latitude);
  const [longitude, setLongitude] = useState(initialFarm.location.longitude);

  // Step 2: Size
  const [size, setSize] = useState<number>(initialFarm.size || 5);
  const [unit, setUnit] = useState<'acres' | 'hectares'>(initialFarm.unit || 'acres');

  // Step 3: Soil
  const [soilType, setSoilType] = useState<SoilType>(initialFarm.soilType || 'Loamy');

  // Step 4: Current Crop
  const [currentCropId, setCurrentCropId] = useState<string>(initialFarm.currentCropId || 'rice');

  // Step 5: Priorities
  const [priorities, setPriorities] = useState<FarmerPriority[]>(
    initialFarm.priorities.length > 0 ? initialFarm.priorities : ['Save water', 'Improve soil health']
  );

  if (!isOpen) return null;

  const handleUseCurrentLocationClick = () => {
    // When clicking "Use Current Location", open the map and input search immediately!
    setShowLocationMap(true);
  };

  const handleLocationPicked = (loc: {
    address: string;
    region: string;
    latitude: number;
    longitude: number;
  }) => {
    setLocationName(loc.address);
    setRegionName(loc.region);
    setLatitude(loc.latitude);
    setLongitude(loc.longitude);
  };

  const handleSelectPreset = (preset: typeof REGIONAL_PRESETS[0]) => {
    setLocationName(preset.name);
    setRegionName(preset.region);
    setLatitude(preset.lat);
    setLongitude(preset.lon);
  };

  const togglePriority = (p: FarmerPriority) => {
    if (priorities.includes(p)) {
      if (priorities.length > 1) {
        setPriorities(priorities.filter(item => item !== p));
      }
    } else {
      if (priorities.length < 3) {
        setPriorities([...priorities, p]);
      }
    }
  };

  const handleFinish = () => {
    setIsFinishing(true);
    const updatedFarm: FarmProfile = {
      ...initialFarm,
      name: locationName.split(',')[0] + (language === 'bn' ? ' খামার' : ' Farm'),
      location: {
        address: locationName,
        region: regionName,
        latitude,
        longitude,
        country: 'Auto-Identified'
      },
      size,
      unit,
      soilType,
      currentCropId,
      priorities,
      updatedAt: new Date().toISOString()
    };

    setTimeout(() => {
      setIsFinishing(false);
      onComplete(updatedFarm);
    }, 1000);
  };

  const soilOptions: { type: SoilType; label: string; desc: string; icon: string }[] = [
    { type: 'Loamy', label: t.soilLoamy, desc: language === 'bn' ? 'উর্বর, নরম, জল ও বায়ু সহজে চলাচল করে' : 'Dark, crumbly, holds balanced moisture', icon: '🌱' },
    { type: 'Clay', label: t.soilClay, desc: language === 'bn' ? 'ভারী আঠালো মাটি, জল ধরে রাখে' : 'Dense, sticky when wet, holds high water', icon: '🧱' },
    { type: 'Sandy', label: t.soilSandy, desc: language === 'bn' ? 'হালকা মাটি, জল দ্রুত শুকিয়ে যায়' : 'Gritty, drains quickly, needs regular watering', icon: '🏖️' },
    { type: 'Silty', label: t.soilSilty, desc: language === 'bn' ? 'নদীর পলি মাটি, নরম ও পুষ্টিকর' : 'Smooth like flour, fertile river sediment', icon: '🌊' },
    { type: 'Unknown', label: t.notSure, desc: language === 'bn' ? 'আমরা স্যাটেলাইট তথ্য দিয়ে অনুমান করব' : "We'll estimate using regional satellite soil models", icon: '❓' }
  ];

  const priorityOptions: { key: FarmerPriority; label: string; icon: string }[] = [
    { key: 'Save water', label: t.priorityWater, icon: '💧' },
    { key: 'Improve soil health', label: t.prioritySoil, icon: '🌱' },
    { key: 'Reduce climate risk', label: t.priorityClimate, icon: '🛡️' },
    { key: 'Maximize yield', label: t.priorityYield, icon: '🌾' },
    { key: 'Increase crop diversity', label: t.priorityDiversity, icon: '🔄' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#181E19]/45 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#DCE2D8] overflow-hidden flex flex-col max-h-[94vh] text-[#243428]">
        {/* Top Header — Adaline Style */}
        <div className="bg-[#F8F7F0] px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#DCE2D8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#36764A] animate-pulse shrink-0" />
            <span className="text-[11px] sm:text-xs uppercase font-bold tracking-[0.14em] text-[#193D25]">
              {t.step} {step} {t.of} 5
            </span>
          </div>
          <button
            onClick={onClose}
            className="min-h-[38px] min-w-[38px] p-1.5 rounded-xl text-[#697568] hover:text-[#193D25] hover:bg-[#EDF1EA] transition-colors cursor-pointer flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[#DCE2D8]/40 h-1.5">
          <div 
            className="bg-[#193D25] h-1.5 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-7 space-y-5 sm:space-y-6">
          {/* STEP 1: LOCATION */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg sm:text-2xl font-semibold text-[#193D25] tracking-tight">
                  {t.step1Title}
                </h3>
                <p className="text-xs sm:text-sm text-[#697568] mt-1 leading-relaxed">
                  {t.step1Desc}
                </p>
              </div>

              {/* Real-time Map & Location Search Mode */}
              {showLocationMap ? (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#193D25] flex items-center gap-1.5">
                      <Globe2 className="w-4 h-4 text-[#71966B]" />
                      <span>{language === 'bn' ? 'রিয়েল-টাইম অবস্থান ও মানচিত্র নির্বাচন' : 'Real-Time Location & Interactive Map'}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowLocationMap(false)}
                      className="text-xs text-[#697568] hover:text-[#193D25] underline cursor-pointer"
                    >
                      {language === 'bn' ? 'তালিকায় ফিরে যান' : 'Back to list view'}
                    </button>
                  </div>

                  <FarmLocationMapPicker
                    initialLatitude={latitude}
                    initialLongitude={longitude}
                    initialAddress={locationName}
                    initialRegion={regionName}
                    onLocationChange={handleLocationPicked}
                    showAutoTriggerNotice={true}
                  />
                </div>
              ) : (
                /* Initial Selection Mode with Primary Location Trigger */
                <div className="space-y-4">
                  {/* Primary "Use Current Location" Action Button with Radar Scan Animation */}
                  <button
                    type="button"
                    onClick={handleUseCurrentLocationClick}
                    className="w-full min-h-[54px] flex items-center justify-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#DDE8D8]/70 border-2 border-[#71966B]/50 text-[#193D25] font-semibold hover:bg-[#DDE8D8] hover:border-[#193D25] transition-all cursor-pointer shadow-2xs group relative overflow-hidden"
                  >
                    <div className="relative flex items-center justify-center shrink-0">
                      <span className="absolute w-8 h-8 rounded-full bg-[#71966B]/30 group-hover:animate-ping" />
                      <LocateFixed className="w-5 h-5 text-[#285C35] group-hover:rotate-45 transition-transform duration-300" />
                    </div>
                    <span className="text-sm sm:text-base font-semibold">
                      {t.useMyLocation}
                    </span>
                  </button>

                  {/* Secondary "Write Location & Pick on Map" Trigger */}
                  <button
                    type="button"
                    onClick={() => setShowLocationMap(true)}
                    className="w-full py-3 px-3.5 sm:px-4 rounded-2xl bg-white hover:bg-[#F8F7F0] border border-[#DCE2D8] text-xs font-semibold text-[#193D25] flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Search className="w-3.5 h-3.5 text-[#71966B] shrink-0" />
                    <span className="truncate">{language === 'bn' ? 'খামারের নাম লিখে মানচিত্রে পিন নির্বাচন করুন' : 'Write location name & pinpoint on real-time map'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#8A9286] shrink-0" />
                  </button>

                  {/* Regional Presets List */}
                  <div className="space-y-2 pt-1">
                    <label className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8A9286] block">
                      {language === 'bn' ? 'অথবা জনপ্রিয় কৃষি অঞ্চল বেছে নিন:' : 'Or choose your farming region:'}
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {REGIONAL_PRESETS.map((preset) => {
                        const isSelected = locationName === preset.name;
                        return (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => handleSelectPreset(preset)}
                            className={`text-left p-3 sm:p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'border-[#193D25] bg-[#DDE8D8] font-semibold text-[#193D25] shadow-2xs'
                                : 'border-[#DCE2D8] hover:border-[#71966B]/60 text-[#243428] bg-white hover:bg-[#F8F7F0]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <MapPin className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#193D25]' : 'text-[#71966B]'}`} />
                              <div className="min-w-0">
                                <div className="text-xs sm:text-sm font-semibold truncate">{preset.name}</div>
                                <div className="text-[11px] sm:text-xs text-[#697568] truncate">{preset.region}</div>
                              </div>
                            </div>
                            {isSelected && (
                              <Check className="w-4 h-4 text-[#193D25] shrink-0 ml-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: SIZE */}
          {step === 2 && (
            <div className="space-y-5 sm:space-y-6">
              <div>
                <h3 className="text-lg sm:text-2xl font-semibold text-[#193D25] tracking-tight">
                  {t.step2Title}
                </h3>
                <p className="text-xs sm:text-sm text-[#697568] mt-1 leading-relaxed">
                  {t.step2Desc}
                </p>
              </div>

              {/* Big Number Selector in Adaline Card */}
              <div className="bg-[#F8F7F0] p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#DCE2D8] text-center space-y-4">
                <div className="flex items-center justify-center gap-3 sm:gap-5">
                  <button
                    type="button"
                    onClick={() => setSize(prev => Math.max(0.5, prev - 1))}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white border border-[#DCE2D8] text-2xl font-bold text-[#193D25] hover:bg-[#F2F1E8] flex items-center justify-center shadow-2xs cursor-pointer transition-colors shrink-0"
                    aria-label="Decrease size"
                  >
                    -
                  </button>
                  <div className="min-w-[90px] sm:min-w-[130px]">
                    <span className="text-4xl sm:text-5xl font-semibold text-[#193D25] tracking-tight">
                      {size}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSize(prev => prev + 1)}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white border border-[#DCE2D8] text-2xl font-bold text-[#193D25] hover:bg-[#F2F1E8] flex items-center justify-center shadow-2xs cursor-pointer transition-colors shrink-0"
                    aria-label="Increase size"
                  >
                    +
                  </button>
                </div>

                {/* Unit Switcher */}
                <div className="inline-flex bg-white p-1 rounded-full border border-[#DCE2D8] shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setUnit('acres')}
                    className={`px-4 sm:px-5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      unit === 'acres' 
                        ? 'bg-[#193D25] text-white shadow-2xs' 
                        : 'text-[#697568] hover:text-[#193D25]'
                    }`}
                  >
                    {t.acres}
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnit('hectares')}
                    className={`px-4 sm:px-5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      unit === 'hectares' 
                        ? 'bg-[#193D25] text-white shadow-2xs' 
                        : 'text-[#697568] hover:text-[#193D25]'
                    }`}
                  >
                    {t.hectares}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SOIL */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg sm:text-2xl font-semibold text-[#193D25] tracking-tight">
                  {t.step3Title}
                </h3>
                <p className="text-xs sm:text-sm text-[#697568] mt-1 leading-relaxed">
                  {t.step3Desc}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {soilOptions.map((opt) => {
                  const isSelected = soilType === opt.type;
                  return (
                    <button
                      key={opt.type}
                      type="button"
                      onClick={() => setSoilType(opt.type)}
                      className={`text-left p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'border-[#193D25] bg-[#DDE8D8] text-[#193D25] font-semibold shadow-2xs'
                          : 'border-[#DCE2D8] hover:border-[#71966B]/60 text-[#243428] bg-white hover:bg-[#F8F7F0]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl shrink-0">{opt.icon}</span>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-semibold">{opt.label}</div>
                          <div className="text-[11px] sm:text-xs text-[#697568] mt-0.5 leading-tight">{opt.desc}</div>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 ml-2 ${
                        isSelected ? 'bg-[#193D25] border-[#193D25] text-white' : 'border-[#DCE2D8] bg-white'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: CURRENT CROP */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg sm:text-2xl font-semibold text-[#193D25] tracking-tight">
                  {t.step4Title}
                </h3>
                <p className="text-xs sm:text-sm text-[#697568] mt-1 leading-relaxed">
                  {t.step4Desc}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {CROP_LIST.slice(0, 8).map((crop) => {
                  const isSelected = currentCropId === crop.id;
                  const localizedName = (crop.localNames && crop.localNames[language]) || crop.name;
                  return (
                    <button
                      key={crop.id}
                      type="button"
                      onClick={() => setCurrentCropId(crop.id)}
                      className={`text-left p-3.5 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'border-[#193D25] bg-[#DDE8D8] text-[#193D25] shadow-2xs'
                          : 'border-[#DCE2D8] hover:border-[#71966B]/60 text-[#243428] bg-white hover:bg-[#F8F7F0]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] uppercase font-bold text-[#8A9286] tracking-wider">
                          {crop.category}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-[#193D25]" />}
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-semibold leading-tight">{localizedName}</div>
                        <div className="text-[11px] text-[#697568] mt-0.5">{crop.waterDemand} Water</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: PRIORITIES */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-[#193D25] tracking-tight">
                  {t.step5Title}
                </h3>
                <p className="text-xs sm:text-sm text-[#697568] mt-1">
                  {t.step5Desc}
                </p>
              </div>

              <div className="space-y-2.5">
                {priorityOptions.map((opt) => {
                  const isSelected = priorities.includes(opt.key);
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => togglePriority(opt.key)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'border-[#193D25] bg-[#DDE8D8] text-[#193D25] font-semibold shadow-2xs'
                          : 'border-[#DCE2D8] hover:border-[#71966B]/60 text-[#243428] bg-white hover:bg-[#F8F7F0]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{opt.icon}</span>
                        <span className="text-sm font-semibold">{opt.label}</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                        isSelected ? 'bg-[#193D25] border-[#193D25] text-white' : 'border-[#DCE2D8] bg-white'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="bg-[#F8F7F0] border-t border-[#DCE2D8] p-4 sm:p-5 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(prev => prev - 1)}
              className="min-h-[44px] px-5 py-2.5 rounded-full border border-[#DCE2D8] text-[#243428] font-semibold hover:bg-white flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t.back}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-4 py-2.5 rounded-full text-[#697568] font-medium hover:text-[#193D25] transition-colors cursor-pointer text-xs"
            >
              {t.skip}
            </button>
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep(prev => prev + 1)}
              className="min-h-[44px] px-7 py-2.5 rounded-full bg-[#193D25] hover:bg-[#285C35] text-white font-semibold text-xs tracking-wide flex items-center gap-2 shadow-2xs transition-all cursor-pointer ml-auto"
            >
              <span>{t.next}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              disabled={isFinishing}
              className="min-h-[44px] px-7 py-2.5 rounded-full bg-[#193D25] hover:bg-[#285C35] text-white font-semibold text-xs tracking-wide flex items-center gap-2 shadow-sm transition-all cursor-pointer ml-auto disabled:opacity-60"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#DDE8D8]" />
              <span>{isFinishing ? (language === 'bn' ? 'সংযুক্ত হচ্ছে...' : 'Connecting...') : t.finishOnboarding}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
