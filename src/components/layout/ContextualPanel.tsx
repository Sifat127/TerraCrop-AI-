import React from 'react';
import { 
  Sparkles, 
  CalendarRange, 
  Layers, 
  HelpCircle, 
  Check, 
  ArrowRight,
  Database,
  Sprout,
  ShieldCheck,
  Droplets
} from 'lucide-react';
import { FarmProfile, EnvironmentalSnapshot, RotationPlan } from '@/src/types';
import { NavTab } from './Sidebar';
import { useI18n } from '@/src/lib/i18n/context';

interface ContextualPanelProps {
  currentTab: NavTab;
  farm: FarmProfile;
  environment: EnvironmentalSnapshot;
  plan: RotationPlan;
  onNavigate: (tab: NavTab) => void;
  onSelectQuestion?: (q: string) => void;
}

export const ContextualPanel: React.FC<ContextualPanelProps> = ({
  currentTab,
  farm,
  environment,
  plan,
  onNavigate,
  onSelectQuestion,
}) => {
  const { language } = useI18n();

  // Render contextual content depending on active page
  return (
    <aside className="hidden xl:flex flex-col w-[280px] bg-[#F8F7F0] border-l border-[#DCE2D8] p-5 shrink-0 overflow-y-auto space-y-6 select-none text-xs transition-colors">
      {/* Overview Context Panel */}
      {currentTab === 'dashboard' && (
        <div className="space-y-6">
          <div>
            <div className="text-[10px] font-bold text-[#8A9286] uppercase tracking-[0.16em] mb-2">
              {language === 'bn' ? 'সংরক্ষিত পরিকল্পনা' : 'ACTIVE ROTATION'}
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-[#DCE2D8] shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#193D25]">{plan.strategy}</span>
                <span className="text-[10px] font-mono text-[#71966B]">{plan.years.length} Years</span>
              </div>
              <div className="space-y-1.5 text-[11px] text-[#697568]">
                {plan.years.map((y) => (
                  <div key={y.year} className="flex items-center justify-between py-0.5 border-b border-[#DCE2D8]/40 last:border-none">
                    <span>Year {y.year}: {y.crop.name.split(' ')[0]}</span>
                    <span className="font-medium text-[#193D25]">{y.crop.waterDemand} Water</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => onNavigate('planner')}
                className="w-full text-center py-1.5 rounded-xl bg-[#F1F4EF] hover:bg-[#DDE8D8] text-[#193D25] font-semibold text-[11px] transition-colors cursor-pointer"
              >
                {language === 'bn' ? 'পরিকল্পনা পরিবর্তন করুন' : 'View Full Schedule'}
              </button>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-[#8A9286] uppercase tracking-[0.16em] mb-2">
              {language === 'bn' ? 'দ্রুত জিজ্ঞাসা' : 'FREQUENT INQUIRIES'}
            </div>
            <div className="space-y-1.5">
              {[
                language === 'bn' ? 'কেন এই ফসলটি প্রস্তাব করা হলো?' : 'Why this crop was suggested?',
                language === 'bn' ? 'মাটির আর্দ্রতা কম হলে কী করণীয়?' : 'What does low soil moisture mean?',
                language === 'bn' ? 'কীভাবে জল সাশ্রয় সম্ভব?' : 'How can I conserve water?'
              ].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (onSelectQuestion) onSelectQuestion(q);
                    onNavigate('assistant');
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-white border border-[#DCE2D8] hover:border-[#71966B] text-[11px] text-[#243428] font-medium transition-all shadow-2xs cursor-pointer flex items-center justify-between group"
                >
                  <span className="line-clamp-1">{q}</span>
                  <ArrowRight className="w-3 h-3 text-[#8A9286] group-hover:text-[#193D25] shrink-0 ml-1 transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-[#DCE2D8] space-y-2">
            <div className="text-[10px] font-bold text-[#8A9286] uppercase tracking-[0.16em]">
              NASA TELEMETRY
            </div>
            <div className="space-y-1 text-[11px] text-[#697568]">
              <div className="flex justify-between">
                <span>SMAP Moisture</span>
                <span className="font-semibold text-[#193D25]">{environment.soilMoisture}% Vol</span>
              </div>
              <div className="flex justify-between">
                <span>MODIS NDVI</span>
                <span className="font-semibold text-[#193D25]">{environment.vegetationIndex}</span>
              </div>
              <div className="flex justify-between">
                <span>POWER Temp</span>
                <span className="font-semibold text-[#193D25]">{environment.temperature}°C</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Crop Planner Context Panel */}
      {currentTab === 'planner' && (
        <div className="space-y-6">
          <div>
            <div className="text-[10px] font-bold text-[#8A9286] uppercase tracking-[0.16em] mb-2">
              {language === 'bn' ? 'খামারের অগ্রাধিকার' : 'ACTIVE PRIORITIES'}
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-[#DCE2D8] shadow-2xs space-y-2">
              {farm.priorities.map((p, idx) => (
                <div key={idx} className="flex items-center gap-2 text-[11px] text-[#243428] font-medium">
                  <Check className="w-3 h-3 text-[#36764A] shrink-0" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-[#8A9286] uppercase tracking-[0.16em] mb-2">
              {language === 'bn' ? 'মডেল অনুমান' : 'OPTIMIZER WEIGHTS'}
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-[#DCE2D8] shadow-2xs space-y-2 text-[11px] text-[#697568]">
              <div className="flex justify-between">
                <span>Soil Health Impact</span>
                <span className="font-mono text-[#193D25]">{(plan.weights.soilWeight * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Water Conservation</span>
                <span className="font-mono text-[#193D25]">{(plan.weights.waterWeight * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Climate Buffer</span>
                <span className="font-mono text-[#193D25]">{(plan.weights.climateWeight * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Yield Feasibility</span>
                <span className="font-mono text-[#193D25]">{(plan.weights.yieldWeight * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#E9EFE6] border border-[#DCE2D8] text-[11px] text-[#243428] space-y-1">
            <div className="font-semibold text-[#193D25]">Deterministic Guarantee</div>
            <p className="text-[#697568] leading-relaxed">
              Identical soil, moisture, and predecessor crop inputs always calculate this exact rotation sequence.
            </p>
          </div>
        </div>
      )}

      {/* Scenario Lab Context Panel */}
      {currentTab === 'scenarios' && (
        <div className="space-y-6">
          <div>
            <div className="text-[10px] font-bold text-[#8A9286] uppercase tracking-[0.16em] mb-2">
              {language === 'bn' ? 'সিমুলেশন মডেল' : 'CLIMATE SCENARIOS'}
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-[#DCE2D8] shadow-2xs text-[11px] text-[#697568] space-y-2 leading-relaxed">
              <p>
                Adjust rainfall anomalies and heat shifts to observe dynamic trade-offs in water demand and soil replenishment.
              </p>
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-[#DCE2D8] shadow-2xs space-y-2 text-[11px]">
            <div className="font-semibold text-[#193D25]">Honest Comparison</div>
            <p className="text-[#697568] leading-relaxed">
              No plan is labeled universally superior. Every rotation exposes biological and hydrological trade-offs.
            </p>
          </div>
        </div>
      )}

      {/* Fallback for other views */}
      {['farm', 'climate', 'assistant', 'sources'].includes(currentTab) && (
        <div className="space-y-6">
          <div>
            <div className="text-[10px] font-bold text-[#8A9286] uppercase tracking-[0.16em] mb-2">
              {language === 'bn' ? 'খামার সারসংক্ষেপ' : 'FARM ATTRIBUTES'}
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-[#DCE2D8] shadow-2xs space-y-2 text-[11px] text-[#697568]">
              <div className="flex justify-between">
                <span>Soil Texture</span>
                <span className="font-semibold text-[#193D25]">{farm.soilType}</span>
              </div>
              <div className="flex justify-between">
                <span>Water Level</span>
                <span className="font-semibold text-[#193D25]">{farm.waterAvailability}</span>
              </div>
              <div className="flex justify-between">
                <span>Current Crop</span>
                <span className="font-semibold text-[#193D25] capitalize">{farm.currentCropId}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
