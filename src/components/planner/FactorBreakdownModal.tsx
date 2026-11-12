import React from 'react';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, Scale, Info } from 'lucide-react';
import { RotationPlan } from '@/src/types';
import { useI18n } from '@/src/lib/i18n/context';

interface FactorBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: RotationPlan;
}

export const FactorBreakdownModal: React.FC<FactorBreakdownModalProps> = ({
  isOpen,
  onClose,
  plan
}) => {
  const { language } = useI18n();
  if (!isOpen) return null;

  const { weights, explanationFactors } = plan;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#181E19]/40 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-[#DCE2D8] overflow-hidden text-[#243428]">
        {/* Header */}
        <div className="bg-[#F8F7F0] p-6 border-b border-[#DCE2D8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#DDE8D8] text-[#193D25] flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-[#193D25]">
                {language === 'bn' ? 'অপটিমাইজার গণনার কারণ ও গুরুত্ব' : 'Optimizer Calculation Factors'}
              </h3>
              <p className="text-xs text-[#697568]">
                {language === 'bn' ? 'স্বচ্ছ বহুগুণবিশিষ্ট অগ্রাধিকার স্কোরিং' : 'Transparent Multi-Attribute Utility Scoring Weights'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#697568] hover:text-[#193D25] hover:bg-[#EDF1EA] cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Formula Callout */}
          <div className="p-4 rounded-2xl bg-[#F1F4EF] border border-[#DCE2D8] text-xs text-[#243428] space-y-2">
            <div className="font-semibold text-[#193D25] flex items-center gap-1.5">
              <Info className="w-4 h-4 text-[#71966B]" />
              <span>DETERMINISTIC FORMULATION:</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#DCE2D8] font-mono text-[11px] leading-relaxed overflow-x-auto text-[#193D25]">
              Score = (w_soil × S_soil) + (w_water × S_water) + (w_climate × S_climate) + (w_diversity × S_diversity) + (w_yield × S_yield)
            </div>
            <p className="text-[11px] text-[#697568]">
              Weights dynamically scale based on your selected farm priorities and NASA climate risk indicators.
            </p>
          </div>

          {/* Active Weights Distribution */}
          <div>
            <h4 className="text-[11px] font-bold text-[#8A9286] uppercase tracking-[0.14em] mb-3">
              Active Optimization Weights (Sum = 100%)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center text-xs">
              <div className="p-3.5 rounded-xl bg-[#F8F7F0] border border-[#DCE2D8]">
                <div className="text-[10px] text-[#697568] font-medium">Soil Health</div>
                <div className="text-base font-semibold text-[#193D25] mt-1">{(weights.soilWeight * 100).toFixed(0)}%</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F8F7F0] border border-[#DCE2D8]">
                <div className="text-[10px] text-[#697568] font-medium">Water Saving</div>
                <div className="text-base font-semibold text-[#527DA5] mt-1">{(weights.waterWeight * 100).toFixed(0)}%</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F8F7F0] border border-[#DCE2D8]">
                <div className="text-[10px] text-[#697568] font-medium">Climate Risk</div>
                <div className="text-base font-semibold text-[#B9822A] mt-1">{(weights.climateWeight * 100).toFixed(0)}%</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F8F7F0] border border-[#DCE2D8]">
                <div className="text-[10px] text-[#697568] font-medium">Diversity</div>
                <div className="text-base font-semibold text-[#36764A] mt-1">{(weights.diversityWeight * 100).toFixed(0)}%</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F8F7F0] border border-[#DCE2D8]">
                <div className="text-[10px] text-[#697568] font-medium">Gross Yield</div>
                <div className="text-base font-semibold text-[#697568] mt-1">{(weights.yieldWeight * 100).toFixed(0)}%</div>
              </div>
            </div>
          </div>

          {/* Factor Details Breakdown */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold text-[#8A9286] uppercase tracking-[0.14em]">
              Evaluated Factor Contributions
            </h4>
            {explanationFactors.map((factor, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-[#DCE2D8] bg-[#F8F7F0] hover:border-[#71966B]/60 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    {factor.status === 'positive' && <CheckCircle2 className="w-4 h-4 text-[#36764A]" />}
                    {factor.status === 'warning' && <AlertTriangle className="w-4 h-4 text-[#B9822A]" />}
                    {factor.status === 'neutral' && <ShieldCheck className="w-4 h-4 text-[#8A9286]" />}
                    <span className="font-semibold text-xs sm:text-sm text-[#193D25]">{factor.name}</span>
                  </div>
                  <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full ${
                    factor.weight > 0 ? 'bg-[#DDE8D8] text-[#193D25]' : 'bg-[#F2F1E8] text-[#697568]'
                  }`}>
                    {factor.weight > 0 ? `+${(factor.weight * 100).toFixed(0)}% weight` : `${(factor.weight * 100).toFixed(0)}% weight`}
                  </span>
                </div>
                <p className="text-xs text-[#697568] leading-relaxed">
                  {factor.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 bg-[#F8F7F0] border-t border-[#DCE2D8] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#193D25] hover:bg-[#285C35] text-white text-xs font-semibold tracking-wide transition-all shadow-2xs cursor-pointer"
          >
            {language === 'bn' ? 'বন্ধ করুন' : 'Close Factors'}
          </button>
        </div>
      </div>
    </div>
  );
};
