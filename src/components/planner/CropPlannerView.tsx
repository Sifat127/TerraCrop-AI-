import React, { useState } from 'react';
import { 
  CalendarRange, 
  Sparkles, 
  Droplets, 
  ShieldCheck, 
  Sprout, 
  Volume2,
  VolumeX,
  FlaskConical,
  Info,
  ArrowRight
} from 'lucide-react';
import { FarmProfile, EnvironmentalSnapshot, RotationPlan } from '@/src/types';
import { CropCard } from './CropCard';
import { FactorBreakdownModal } from './FactorBreakdownModal';
import { NavTab } from '../layout/Sidebar';
import { useI18n } from '@/src/lib/i18n/context';

interface CropPlannerViewProps {
  farm: FarmProfile;
  environment: EnvironmentalSnapshot;
  plan: RotationPlan;
  baselinePlan: RotationPlan;
  onSelectStrategy: (strategy: 'AI Optimized' | 'Current Plan' | 'Water Saver') => void;
  onNavigate: (tab: NavTab) => void;
}

export const CropPlannerView: React.FC<CropPlannerViewProps> = ({
  farm,
  environment,
  plan,
  baselinePlan,
  onSelectStrategy,
  onNavigate
}) => {
  const { t, language, speak, stopSpeaking, isSpeaking } = useI18n();

  const [activeTab, setActiveTab] = useState<'AI Optimized' | 'Current Plan' | 'Water Saver'>(
    plan.strategy === 'Current Plan' ? 'Current Plan' : plan.strategy === 'Water Saver' ? 'Water Saver' : 'AI Optimized'
  );
  const [isFactorModalOpen, setIsFactorModalOpen] = useState(false);

  const activePlan = activeTab === 'Current Plan' ? baselinePlan : plan;
  const { impact } = activePlan;

  const handleTabChange = (tab: 'AI Optimized' | 'Current Plan' | 'Water Saver') => {
    setActiveTab(tab);
    onSelectStrategy(tab);
  };

  const handleSpeakOverview = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      const speech = language === 'bn'
        ? `ফসল পরিকল্পনার সারসংক্ষেপ: ${activePlan.summaryRecommendation}। মাটির উর্বরতা পরিবর্তন: ${impact.soilHealthPercentChange} শতাংশ। পানির চাহিদা পরিবর্তন: ${impact.waterDemandPercentChange} শতাংশ।`
        : `Crop plan summary: ${activePlan.summaryRecommendation}. Soil health change: ${impact.soilHealthPercentChange} percent. Water demand change: ${impact.waterDemandPercentChange} percent.`;
      speak(speech);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 lg:p-8 space-y-5 sm:space-y-7 bg-[#F1F4EF] min-h-full">
      <FactorBreakdownModal
        isOpen={isFactorModalOpen}
        onClose={() => setIsFactorModalOpen(false)}
        plan={activePlan}
      />

      {/* Header and Strategy Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-3xl font-semibold tracking-tight text-[#193D25]">
            {language === 'bn' ? 'ফসল পরিকল্পনা' : 'Crop Planner'}
          </h2>
          <p className="text-xs sm:text-sm text-[#697568] mt-0.5">
            {language === 'bn' 
              ? 'আপনার খামারের জন্য বহু-বছরের ফসল চক্র।' 
              : 'Explore a suitable path for your next crops.'}
          </p>
        </div>

        {/* Strategy Selector Pills */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="w-full sm:w-auto overflow-x-auto no-scrollbar py-0.5">
            <div className="inline-flex bg-white p-1 rounded-full border border-[#DCE2D8] shadow-2xs text-[11px] sm:text-xs min-w-max">
              <button
                onClick={() => handleTabChange('AI Optimized')}
                className={`px-3.5 sm:px-4 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
                  activeTab === 'AI Optimized'
                    ? 'bg-[#193D25] text-white shadow-xs font-semibold'
                    : 'text-[#697568] hover:text-[#193D25]'
                }`}
              >
                {language === 'bn' ? 'সুষম পরিকল্পনা' : 'AI Optimized'}
              </button>
              <button
                onClick={() => handleTabChange('Water Saver')}
                className={`px-3.5 sm:px-4 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
                  activeTab === 'Water Saver'
                    ? 'bg-[#193D25] text-white shadow-xs font-semibold'
                    : 'text-[#697568] hover:text-[#193D25]'
                }`}
              >
                {language === 'bn' ? 'জল সাশ্রয়ী' : 'Water Saver'}
              </button>
              <button
                onClick={() => handleTabChange('Current Plan')}
                className={`px-3.5 sm:px-4 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
                  activeTab === 'Current Plan'
                    ? 'bg-[#193D25] text-white shadow-xs font-semibold'
                    : 'text-[#697568] hover:text-[#193D25]'
                }`}
              >
                {language === 'bn' ? 'বর্তমান একক ফসল' : 'Current Practice'}
              </button>
            </div>
          </div>

          <button
            onClick={handleSpeakOverview}
            className={`min-h-[38px] min-w-[38px] p-2 rounded-full border transition-colors cursor-pointer flex items-center justify-center shrink-0 ${
              isSpeaking
                ? 'bg-[#B9822A]/15 border-[#B9822A] text-[#B9822A] animate-pulse'
                : 'bg-white border-[#DCE2D8] text-[#697568] hover:text-[#193D25]'
            }`}
            title="Listen to summary"
            aria-label="Listen to summary"
          >
            {isSpeaking ? <VolumeX className="w-4 h-4 text-[#B9822A]" /> : <Volume2 className="w-4 h-4 text-[#71966B]" />}
          </button>
        </div>
      </div>

      {/* Plan Summary Recommendation Card */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#DCE2D8] shadow-2xs space-y-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[11px] font-bold text-[#71966B] uppercase tracking-[0.14em]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'পরিকল্পনার সারসংক্ষেপ' : 'AGRONOMIC RATIONALE'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold text-[#193D25] leading-snug">
            {activePlan.summaryRecommendation}
          </h3>
        </div>

        {/* 3 Outcome Impact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-4 rounded-xl bg-[#F8F7F0] border border-[#DCE2D8]">
            <div className="flex items-center gap-2 text-xs text-[#8A9286] mb-1">
              <Sprout className="w-4 h-4 text-[#71966B]" />
              <span>{language === 'bn' ? 'মাটির উর্বরতা' : 'Soil Health Impact'}</span>
            </div>
            <div className="text-2xl font-medium text-[#193D25]">
              {impact.soilHealthPercentChange > 0 ? `+${impact.soilHealthPercentChange}%` : `${impact.soilHealthPercentChange}%`}
            </div>
            <div className="text-[11px] text-[#697568] mt-0.5">
              {impact.soilHealthPercentChange > 0 ? 'Biological N-replenishment' : 'Subsoil depletion'}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#F8F7F0] border border-[#DCE2D8]">
            <div className="flex items-center gap-2 text-xs text-[#8A9286] mb-1">
              <Droplets className="w-4 h-4 text-[#527DA5]" />
              <span>{language === 'bn' ? 'পানির চাহিদা' : 'Water Demand'}</span>
            </div>
            <div className="text-2xl font-medium text-[#193D25]">
              {impact.waterDemandPercentChange > 0 ? `+${impact.waterDemandPercentChange}%` : `${impact.waterDemandPercentChange}%`}
            </div>
            <div className="text-[11px] text-[#697568] mt-0.5">
              {impact.waterDemandPercentChange < 0 ? 'Conserves active groundwater' : 'Demanding irrigation'}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#F8F7F0] border border-[#DCE2D8]">
            <div className="flex items-center gap-2 text-xs text-[#8A9286] mb-1">
              <ShieldCheck className="w-4 h-4 text-[#B9822A]" />
              <span>{language === 'bn' ? 'আবহাওয়া ঝুঁকি' : 'Climate Risk Buffer'}</span>
            </div>
            <div className="text-2xl font-medium text-[#193D25]">
              {impact.climateRiskPercentChange <= 0 ? `${impact.climateRiskPercentChange}%` : `+${impact.climateRiskPercentChange}%`}
            </div>
            <div className="text-[11px] text-[#697568] mt-0.5">
              {impact.climateRiskPercentChange <= 0 ? 'Buffers dry spell volatility' : 'Higher climate vulnerability'}
            </div>
          </div>
        </div>

        {/* Buttons: Why this plan + Compare Plans */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={() => setIsFactorModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#193D25] hover:bg-[#285C35] text-white text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-2xs cursor-pointer"
          >
            <Info className="w-4 h-4" />
            <span>{language === 'bn' ? 'কেন এই পরিকল্পনা?' : 'Why This Plan?'}</span>
          </button>

          <button
            onClick={() => onNavigate('scenarios')}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-[#F2F1E8] border border-[#DCE2D8] text-[#243428] text-xs sm:text-sm font-medium transition-all shadow-2xs cursor-pointer"
          >
            <FlaskConical className="w-4 h-4 text-[#71966B]" />
            <span>{language === 'bn' ? 'পরিকল্পনা তুলনা করুন' : 'Compare Plans in Scenario Lab'}</span>
          </button>
        </div>
      </div>

      {/* Visual Timeline of Years */}
      <div className="space-y-4">
        <div className="text-[11px] font-bold text-[#8A9286] uppercase tracking-[0.14em]">
          {language === 'bn' ? 'বহু-বছরের ফসল চক্র' : 'MULTI-YEAR SUCCESSION SCHEDULE'}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activePlan.years.map((yearPlan, idx) => (
            <React.Fragment key={yearPlan.year}>
              <CropCard
                planYear={yearPlan}
                isFirst={idx === 0}
              />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
