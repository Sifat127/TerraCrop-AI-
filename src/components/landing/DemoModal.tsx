import React from 'react';
import { X, Play, CheckCircle2, Sparkles, ArrowRight, ShieldCheck, Compass } from 'lucide-react';
import { useI18n } from '@/src/lib/i18n/context';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchDemoApp: () => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({
  isOpen,
  onClose,
  onLaunchDemoApp
}) => {
  const { language } = useI18n();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#181E19]/40 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-[#DCE2D8] overflow-hidden text-[#243428]">
        {/* Header */}
        <div className="bg-[#F8F7F0] p-4 sm:p-6 border-b border-[#DCE2D8] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#DDE8D8] text-[#193D25] flex items-center justify-center shrink-0">
              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-base sm:text-lg text-[#193D25] truncate">
                {language === 'bn' ? 'টেরাক্রপ এআই পরিচিতি ও পদ্ধতি' : 'TerraCrop AI Walkthrough'}
              </h3>
              <p className="text-[11px] sm:text-xs text-[#697568] truncate">
                {language === 'bn' ? '৪টি মূল পদক্ষেপে আবহাওয়া-সচেতন কৃষি সহায়তা' : 'Agro-Ecological Decision Support in 4 Key Steps'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="min-h-[38px] min-w-[38px] p-2 rounded-xl text-[#697568] hover:text-[#193D25] hover:bg-[#EDF1EA] cursor-pointer flex items-center justify-center shrink-0"
            aria-label="Close walkthrough"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 rounded-xl bg-[#F8F7F0] border border-[#DCE2D8]">
              <div className="text-[11px] font-bold text-[#193D25] uppercase tracking-wider mb-1">
                Step 1: Satellite & Soil Observe
              </div>
              <p className="text-xs text-[#697568] leading-relaxed">
                Connect your farm coordinates. TerraCrop pulls NASA POWER thermal records, SMAP soil moisture, and MODIS NDVI vegetation vigor in real time.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F8F7F0] border border-[#DCE2D8]">
              <div className="text-[11px] font-bold text-[#193D25] uppercase tracking-wider mb-1">
                Step 2: Constraint Optimization
              </div>
              <p className="text-xs text-[#697568] leading-relaxed">
                Our deterministic optimizer calculates biological succession rules, preventing continuous crop pathogen buildup and balancing moisture budgets.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F8F7F0] border border-[#DCE2D8]">
              <div className="text-[11px] font-bold text-[#193D25] uppercase tracking-wider mb-1">
                Step 3: Multi-Year Rotation Planner
              </div>
              <p className="text-xs text-[#697568] leading-relaxed">
                Explore transparent 1 to 5-year crop rotations with quantified projections: Soil Health (+35%), Water Demand (-60%), and Climate Risk (-15%).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F8F7F0] border border-[#DCE2D8]">
              <div className="text-[11px] font-bold text-[#193D25] uppercase tracking-wider mb-1">
                Step 4: Scenario Lab Simulation
              </div>
              <p className="text-xs text-[#697568] leading-relaxed">
                Stress test your farm under climate changes: decrease seasonal rainfall by 30% or add +3°C heatwaves to observe how rotations adapt dynamically.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#DDE8D8]/60 border border-[#DCE2D8] flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#285C35] shrink-0" />
            <div className="text-xs text-[#243428]">
              <strong className="text-[#193D25]">Deterministic & Grounded:</strong> TerraCrop AI never invents numerical recommendations through an LLM. Pure agro-ecological science powers the math, while AI explains "The Why."
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 px-6 bg-[#F8F7F0] border-t border-[#DCE2D8] flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs text-[#697568] hover:text-[#193D25] font-medium px-4 py-2 cursor-pointer"
          >
            {language === 'bn' ? 'বাতিল' : 'Cancel'}
          </button>
          <button
            onClick={() => {
              onClose();
              onLaunchDemoApp();
            }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#193D25] hover:bg-[#285C35] text-white text-xs font-semibold tracking-wide transition-all shadow-2xs cursor-pointer"
          >
            <span>{language === 'bn' ? 'ওয়ার্কস্পেস খুলুন' : 'Launch Workspace'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
