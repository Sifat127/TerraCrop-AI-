import React from 'react';
import { RotationYearPlan } from '@/src/types';
import { Droplets, Sprout, ShieldCheck, Check, Sparkles, Volume2, Clock } from 'lucide-react';
import { useI18n } from '@/src/lib/i18n/context';

interface CropCardProps {
  planYear: RotationYearPlan;
  isFirst?: boolean;
}

export const CropCard: React.FC<CropCardProps> = ({ planYear, isFirst = false }) => {
  const { crop, year, reasonForPlacement, keyBenefits } = planYear;
  const { language, speak } = useI18n();

  const localizedName = language === 'bn' && crop.localNames?.bn ? crop.localNames.bn : crop.name;

  const handleSpeakCard = () => {
    const speech = language === 'bn'
      ? `${year}ম বছর: ${localizedName}। প্রস্তাবের কারণ: ${reasonForPlacement}। পানির প্রয়োজন: ${crop.waterDemand === 'Low' ? 'কম' : crop.waterDemand === 'Medium' ? 'মাঝারি' : 'বেশি'}।`
      : `Year ${year}: ${crop.name}. Reason: ${reasonForPlacement}. Water demand: ${crop.waterDemand}.`;
    speak(speech);
  };

  const waterColor = {
    Low: 'text-[#285C35] bg-[#DDE8D8]/60 border-[#DCE2D8]',
    Medium: 'text-[#527DA5] bg-[#F1F4EF] border-[#DCE2D8]',
    High: 'text-[#B9822A] bg-[#F8F7F0] border-[#DCE2D8]',
  }[crop.waterDemand];

  const soilColor = {
    Regenerative: 'text-[#193D25] bg-[#DDE8D8] border-[#DCE2D8] font-semibold',
    Neutral: 'text-[#697568] bg-[#F1F4EF] border-[#DCE2D8]',
    Depleting: 'text-[#B9822A] bg-[#F8F7F0] border-[#DCE2D8]',
  }[crop.soilImpact];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#DCE2D8] shadow-2xs hover:border-[#71966B]/80 transition-all flex flex-col justify-between min-w-0">
      <div>
        {/* Year Header & Audio Button */}
        <div className="flex items-center justify-between gap-2 flex-wrap pb-3 sm:pb-3.5 border-b border-[#DCE2D8]/70 mb-3.5 sm:mb-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-lg sm:text-2xl font-serif font-bold text-[#193D25] tracking-tight">
              {language === 'bn' ? `${year}ম বছর` : `Year ${year}`}
            </span>
            <span className="text-[#8A9286]">·</span>
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#697568]">
              {isFirst 
                ? (language === 'bn' ? 'বর্তমান ফসল' : 'Current Crop') 
                : (language === 'bn' ? 'প্রস্তাবিত ক্রম' : 'Planned Crop')}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleSpeakCard}
              className="p-1.5 rounded-full text-[#697568] hover:text-[#193D25] hover:bg-[#F1F4EF] transition-colors cursor-pointer"
              title="Listen to this year's plan"
              aria-label="Listen"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
            <span className={`text-[9px] sm:text-[10px] uppercase font-semibold px-2 sm:px-2.5 py-0.5 rounded-full border ${soilColor}`}>
              {crop.soilImpact === 'Regenerative' 
                ? (language === 'bn' ? 'উর্বরতা বাড়ায়' : 'Builds Soil') 
                : crop.soilImpact === 'Neutral' 
                  ? (language === 'bn' ? 'নিরপেক্ষ' : 'Neutral') 
                  : (language === 'bn' ? 'পুষ্টি গ্রহণকারী' : 'Heavy Feeder')}
            </span>
          </div>
        </div>

        {/* Crop Hero */}
        <div className="flex items-start gap-3 sm:gap-4 mb-3.5 sm:mb-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#F8F7F0] border border-[#DCE2D8] flex items-center justify-center text-2xl sm:text-3xl shrink-0 shadow-2xs">
            {crop.icon}
          </div>
          <div>
            <h4 className="text-lg font-semibold text-[#193D25] leading-tight">
              {localizedName}
            </h4>
            <div className="text-xs text-[#8A9286] mt-0.5">
              {crop.category} · {crop.growingDurationDays} {language === 'bn' ? 'দিন মেয়াদ' : 'days to harvest'}
            </div>
            <p className="text-xs text-[#697568] mt-1 line-clamp-2 leading-relaxed">
              {crop.description}
            </p>
          </div>
        </div>

        {/* Agronomic Properties Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-4">
          <div className="p-3 rounded-xl bg-[#F8F7F0] border border-[#DCE2D8]/80">
            <div className="text-[10px] uppercase font-bold text-[#8A9286] tracking-wider flex items-center gap-1">
              <Droplets className="w-3 h-3 text-[#527DA5]" />
              <span>{language === 'bn' ? 'পানির চাহিদা' : 'Water Needs'}</span>
            </div>
            <div className="font-semibold text-[#193D25] mt-1">
              {crop.waterDemand} ({crop.waterDemandMmPerSeason} mm)
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#F8F7F0] border border-[#DCE2D8]/80">
            <div className="text-[10px] uppercase font-bold text-[#8A9286] tracking-wider flex items-center gap-1">
              <Sprout className="w-3 h-3 text-[#71966B]" />
              <span>{language === 'bn' ? 'নাইট্রোজেন' : 'Soil Impact'}</span>
            </div>
            <div className="font-semibold text-[#193D25] mt-1 truncate">
              {crop.nitrogenFixing ? 'Biological N Fixer' : 'Nutrient Consumer'}
            </div>
          </div>
        </div>

        {/* Reason for Placement */}
        <div className="p-3.5 rounded-xl bg-[#EAF2E7] border border-[#DCE2D8] text-xs text-[#193D25] mb-4">
          <div className="font-bold text-[10px] uppercase tracking-wider text-[#285C35] mb-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#285C35]" />
            <span>{language === 'bn' ? 'কেন এই ফসল?' : 'Why Selected:'}</span>
          </div>
          <p className="leading-relaxed font-normal text-[#243428]">
            {reasonForPlacement}
          </p>
        </div>
      </div>

      {/* Key Benefits Bullet List */}
      <div className="pt-3 border-t border-[#DCE2D8]/60">
        <div className="text-[10px] font-bold text-[#8A9286] uppercase tracking-wider mb-2">
          {language === 'bn' ? 'প্রধান সুবিধাসমূহ' : 'Key Benefits'}
        </div>
        <div className="space-y-1.5">
          {keyBenefits.map((benefit, bIdx) => (
            <div key={bIdx} className="text-xs text-[#697568] flex items-start gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#36764A] shrink-0 mt-0.5" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
