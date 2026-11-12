import React, { useState } from 'react';
import { 
  Droplets, 
  Sun, 
  CloudRain, 
  Layers, 
  Sparkles, 
  ArrowRight, 
  Clock,
  Compass,
  CalendarRange,
  ChevronDown,
  ChevronUp,
  Sprout,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { FarmProfile, EnvironmentalSnapshot, RotationPlan } from '@/src/types';
import { StatCard } from './StatCard';
import { QuickMap } from './QuickMap';
import { NavTab } from '../layout/Sidebar';
import { useI18n } from '@/src/lib/i18n/context';

interface DashboardViewProps {
  farm: FarmProfile;
  environment: EnvironmentalSnapshot;
  plan: RotationPlan;
  onNavigate: (tab: NavTab) => void;
  onOpenOnboarding: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  farm,
  environment,
  plan,
  onNavigate,
  onOpenOnboarding
}) => {
  const { t, language } = useI18n();
  const [observationPeriod, setObservationPeriod] = useState<'current' | '30d' | '10y'>('current');
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  // Derive plain-language indicators for the 5-second rule
  const isWaterLow = environment.soilMoisture < 25 || environment.historicalRainfallAnomalyPercent < -10;
  const isWeatherWarm = environment.temperature > 32;
  const isVegHealthy = environment.vegetationIndex >= 0.45;

  const farmStatusHeadline = isWaterLow 
    ? (language === 'bn' ? 'মাটিতে জলের মাত্রা স্বাভাবিকের চেয়ে কম' : 'Water in the soil is lower than usual') 
    : (language === 'bn' ? 'আপনার খামারের পরিস্থিতি বর্তমানে ভালো' : 'Your farm conditions are looking good');

  const waterStatus = environment.soilMoisture < 20 
    ? (language === 'bn' ? 'কম জল / শুকনো' : 'Lower than usual')
    : environment.soilMoisture < 35 
      ? (language === 'bn' ? 'মাঝারি আর্দ্রতা' : 'Moderate hydration') 
      : (language === 'bn' ? 'পর্যাপ্ত জল' : 'Good moisture');

  const weatherStatus = environment.temperature > 32 
    ? (language === 'bn' ? 'গরম আবহাওয়া' : 'Warmer this week') 
    : (language === 'bn' ? 'স্বাভাবিক উষ্ণতা' : 'Seasonal normal');

  const vegStatus = environment.vegetationIndex >= 0.5 
    ? (language === 'bn' ? 'সবুজ ও সতেজ' : 'Mostly stable & green') 
    : (language === 'bn' ? 'যত্ন প্রয়োজন' : 'Vigor under watch');

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 lg:p-8 space-y-5 sm:space-y-7 bg-[#F1F4EF] min-h-full">
      {/* Top Header & Selectors matching Adaline Reference B */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-1">
        <div>
          <h2 className="text-xl sm:text-3xl font-semibold tracking-tight text-[#193D25]">
            {language === 'bn' ? 'খামার ওভারভিউ' : 'Farm Overview'}
          </h2>
          <p className="text-xs sm:text-sm text-[#697568] mt-0.5">
            {language === 'bn' ? 'এখানে আপনার খামারের বর্তমান অবস্থা প্রদর্শিত হচ্ছে।' : 'Here is what is happening on your farm.'}
          </p>
        </div>

        {/* Observation Period Selector */}
        <div className="w-full sm:w-auto overflow-x-auto no-scrollbar py-0.5">
          <div className="inline-flex bg-white p-1 rounded-full border border-[#DCE2D8] shadow-2xs text-[11px] sm:text-xs min-w-max">
            <button
              onClick={() => setObservationPeriod('current')}
              className={`px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
                observationPeriod === 'current'
                  ? 'bg-[#193D25] text-white shadow-xs font-semibold'
                  : 'text-[#697568] hover:text-[#193D25]'
              }`}
            >
              {language === 'bn' ? 'বর্তমান মৌসুম' : 'Current Season'}
            </button>
            <button
              onClick={() => setObservationPeriod('30d')}
              className={`px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
                observationPeriod === '30d'
                  ? 'bg-[#193D25] text-white shadow-xs font-semibold'
                  : 'text-[#697568] hover:text-[#193D25]'
              }`}
            >
              {language === 'bn' ? 'গত ৩০ দিন' : 'Last 30 Days'}
            </button>
            <button
              onClick={() => setObservationPeriod('10y')}
              className={`px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
                observationPeriod === '10y'
                  ? 'bg-[#193D25] text-white shadow-xs font-semibold'
                  : 'text-[#697568] hover:text-[#193D25]'
              }`}
            >
              {language === 'bn' ? '১০-বছরের গড়' : '10-Yr Normal'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Status Card: "Your Farm at a Glance" */}
      <div className="rounded-2xl p-4 sm:p-7 bg-white border border-[#DCE2D8] shadow-2xs space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#DCE2D8]/70">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-2 h-2 rounded-full ${isWaterLow ? 'bg-[#B9822A]' : 'bg-[#36764A]'}`} />
              <span className="text-[11px] uppercase font-bold tracking-[0.14em] text-[#8A9286]">
                {language === 'bn' ? 'খামারের সার্বিক অবস্থা' : 'YOUR FARM AT A GLANCE'}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#193D25] tracking-tight">
              {farmStatusHeadline}
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#8A9286] font-mono shrink-0">
            <Clock className="w-3.5 h-3.5" />
            <span>NASA Observation: {environment.timestamp || 'Today'}</span>
          </div>
        </div>

        {/* 3 Clear Indicators: Water, Weather, Vegetation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#F8F7F0] border border-[#DCE2D8] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#193D25]">
                <Droplets className="w-4 h-4 text-[#527DA5]" />
                <span>{language === 'bn' ? 'মাটিতে জল' : 'Water'}</span>
              </div>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                isWaterLow ? 'bg-[#B9822A]/15 text-[#B9822A]' : 'bg-[#DDE8D8] text-[#193D25]'
              }`}>
                {waterStatus}
              </span>
            </div>
            <p className="text-xs text-[#697568] leading-relaxed">
              {isWaterLow 
                ? (language === 'bn' ? 'স্যাটেলাইট তথ্যে স্বাভাবিকের চেয়ে কম আর্দ্রতা পাওয়া গেছে।' : 'Recent satellite telemetry indicates drier topsoil conditions than the 10-year baseline.')
                : (language === 'bn' ? 'মাটিতে গাছের জন্য পর্যাপ্ত পরিমাণ আর্দ্রতা রয়েছে।' : 'Adequate topsoil hydration for steady seasonal root development.')}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F8F7F0] border border-[#DCE2D8] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#193D25]">
                <Sun className="w-4 h-4 text-[#B9822A]" />
                <span>{language === 'bn' ? 'আবহাওয়া ও তাপ' : 'Weather'}</span>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#F2F1E8] text-[#193D25]">
                {environment.temperature}°C · {weatherStatus}
              </span>
            </div>
            <p className="text-xs text-[#697568] leading-relaxed">
              {language === 'bn' 
                ? 'বর্তমান তাপমাত্রা এবং সৌর বিকিরণ স্বাভাবিক মাত্রায় স্থিতিশীল রয়েছে।' 
                : 'Mean daytime surface heating Degree Days match normal seasonal ranges.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F8F7F0] border border-[#DCE2D8] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#193D25]">
                <Sprout className="w-4 h-4 text-[#71966B]" />
                <span>{language === 'bn' ? 'উদ্ভিদ সতেজতা' : 'Vegetation'}</span>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#DDE8D8] text-[#193D25]">
                {vegStatus}
              </span>
            </div>
            <p className="text-xs text-[#697568] leading-relaxed">
              {language === 'bn'
                ? 'সবুজ পাতার ঘনত্ব (NDVI ০.৫৮) উদ্ভিদের সুস্থ বৃদ্ধির সংকেত দিচ্ছে।'
                : 'MODIS 250m radiometric canopy index confirms healthy vegetative cover.'}
            </p>
          </div>
        </div>
      </div>

      {/* 4 Analytics Metric Cards with Sparklines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label={language === 'bn' ? 'বৃষ্টিপাত' : 'Recent Rainfall'}
          value={environment.precipitation}
          unit="mm"
          icon={CloudRain}
          trendText={`${environment.historicalRainfallAnomalyPercent}% vs 10-Yr`}
          trendDirection={environment.historicalRainfallAnomalyPercent < 0 ? 'down' : 'up'}
          explanation={language === 'bn' ? 'মাসিক মোট বৃষ্টিপাত' : 'NASA GPM IMERG 30-day accumulation'}
          source="GPM IMERG"
          sparklineData={[42, 48, 55, 61, 58, 62, environment.precipitation]}
        />

        <StatCard
          label={language === 'bn' ? 'পৃষ্ঠ তাপমাত্রা' : 'Surface Temp'}
          value={environment.temperature}
          unit="°C"
          icon={Sun}
          trendText={weatherStatus}
          trendDirection={environment.temperature > 30 ? 'up' : 'neutral'}
          explanation={language === 'bn' ? 'নাসা পাওয়ার থেকে প্রাপ্ত' : 'NASA POWER diurnal meteorological average'}
          source="NASA POWER"
          sparklineData={[24, 25, 27, 28, 29, 31, environment.temperature]}
        />

        <StatCard
          label={language === 'bn' ? 'মাটির আর্দ্রতা' : 'Soil Moisture'}
          value={environment.soilMoisture}
          unit="% Vol"
          icon={Droplets}
          trendText={environment.soilMoisture < 25 ? 'Low Hydration' : 'Normal Moisture'}
          trendDirection={environment.soilMoisture < 25 ? 'down' : 'up'}
          explanation={language === 'bn' ? 'এল-ব্যান্ড রেডিওমেট্রি' : 'NASA SMAP 0-5cm active topsoil water band'}
          source="NASA SMAP"
          sparklineData={[38, 36, 34, 32, 30, 29, environment.soilMoisture]}
        />

        <StatCard
          label={language === 'bn' ? 'উদ্ভিদ সূচক (NDVI)' : 'Vegetation Trend'}
          value={environment.vegetationIndex}
          unit="NDVI"
          icon={Sprout}
          trendText={vegStatus}
          trendDirection="up"
          explanation={language === 'bn' ? 'সবুজ পাতার ঘনত্ব' : 'MODIS Terra 250m spectral canopy vitality'}
          source="MODIS Terra"
          sparklineData={[0.42, 0.46, 0.50, 0.53, 0.56, 0.57, environment.vegetationIndex]}
        />
      </div>

      {/* Main Prominent Action Card: "Plan Your Next Crop" */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#DCE2D8] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2 text-[11px] font-bold text-[#71966B] uppercase tracking-[0.14em]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'পরবর্তী ফসলের পরামর্শ' : 'RECOMMENDED ACTION'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold text-[#193D25]">
            {language === 'bn' ? 'আপনার পরবর্তী ফসলের পরিকল্পনা করুন' : 'Plan Your Next Crop'}
          </h3>
          <p className="text-xs sm:text-sm text-[#697568] leading-relaxed">
            {language === 'bn'
              ? 'আপনার মাটির উর্বরতা রক্ষা ও জল বাঁচিয়ে পরবর্তী মৌসুমের সেরা ফসল চক্র নির্বাচন করুন।'
              : 'Explore crops that may suit your farm based on NASA Earth observations, local soil constraints, and biological rotation rules.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('planner')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#193D25] hover:bg-[#285C35] text-white text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-sm cursor-pointer"
          >
            <span>{language === 'bn' ? 'ফসল পরিকল্পনাকারী খুলুন' : 'Open Crop Planner'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('assistant')}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-[#F2F1E8] border border-[#DCE2D8] text-[#243428] text-xs sm:text-sm font-medium transition-all cursor-pointer shadow-2xs"
          >
            <span>{language === 'bn' ? 'টেরাকে কারণ জিজ্ঞাসা করুন' : 'Ask Terra Why'}</span>
          </button>
        </div>
      </div>

      {/* Farm Location Map Canvas */}
      <div className="rounded-2xl overflow-hidden bg-white border border-[#DCE2D8] shadow-2xs">
        <div className="p-4 px-6 border-b border-[#DCE2D8] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#193D25]">
            <Compass className="w-4 h-4 text-[#71966B]" />
            <span>{farm.name} — Spatial Telemetry Grid</span>
          </div>
          <button
            onClick={() => onNavigate('climate')}
            className="text-xs font-medium text-[#285C35] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Open Climate Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <QuickMap
          farm={farm}
          environment={environment}
          onOpenFullMap={() => onNavigate('climate')}
        />
      </div>
    </div>
  );
};
