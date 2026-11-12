import React from 'react';
import { 
  Trophy, 
  Droplets, 
  Sprout, 
  ShieldAlert, 
  Coins, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { HarvestResult } from '@/src/types/game';
import { sound } from '@/src/lib/game/soundEffects';

interface HarvestResultModalProps {
  result: HarvestResult;
  onTryAnotherCrop: () => void;
  onOpenTerraCropAnalysis: (result: HarvestResult) => void;
  onAskTerra: () => void;
}

export const HarvestResultModal: React.FC<HarvestResultModalProps> = ({
  result,
  onTryAnotherCrop,
  onOpenTerraCropAnalysis,
  onAskTerra
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md select-none font-mono">
      <div className="relative w-full max-w-2xl bg-[#0B1220] rounded-3xl border-2 border-[#00E676] shadow-2xl flex flex-col max-h-[92vh] text-white overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="bg-[#111C2D] px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1B5E20] border border-[#00E676] flex items-center justify-center text-xl shadow-lg">
              🌾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-[#81C784]">
                  SEASON HARVEST COMPLETE
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#00E676]/20 text-[#00E676] text-[10px] font-bold">
                  {result.suitabilityScore >= 75 ? 'RESILIENT' : 'STRESSED'}
                </span>
              </div>
              <p className="text-[11px] text-white/60">
                Crop: {result.cropName} · Scenario: {result.scenario.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-[#FFD54F] flex items-center gap-1">
              <Coins className="w-3.5 h-3.5" />
              <span>+${result.coinsEarned}</span>
            </div>
            <div className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-[#64FFDA] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>+{result.knowledgeGained} XP</span>
            </div>
          </div>
        </div>

        {/* Scrollable Metrics & Educational Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Main Key KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Suitability Score */}
            <div className="bg-[#121E2F] p-3.5 rounded-2xl border border-white/10 text-center">
              <div className="text-[10px] text-white/60 uppercase">Suitability</div>
              <div className="text-2xl font-black text-[#64FFDA] mt-0.5">
                {result.suitabilityScore}<span className="text-xs text-white/50">/100</span>
              </div>
              <div className="text-[10px] text-white/40 mt-1">Scenario Fit</div>
            </div>

            {/* Yield Achieved */}
            <div className="bg-[#121E2F] p-3.5 rounded-2xl border border-white/10 text-center">
              <div className="text-[10px] text-white/60 uppercase">Harvest Yield</div>
              <div className="text-2xl font-black text-[#FFD54F] mt-0.5">
                {result.yieldPercent}%
              </div>
              <div className="text-[10px] text-white/40 mt-1">{result.yieldKg} kg total</div>
            </div>

            {/* Water Budget Used */}
            <div className="bg-[#121E2F] p-3.5 rounded-2xl border border-white/10 text-center">
              <div className="text-[10px] text-white/60 uppercase">Water Used</div>
              <div className="text-2xl font-black text-[#81D4FA] mt-0.5">
                {result.waterUsedPercent}%
              </div>
              <div className="text-[10px] text-white/40 mt-1">Aquifer impact</div>
            </div>

            {/* Soil Organic Impact */}
            <div className="bg-[#121E2F] p-3.5 rounded-2xl border border-white/10 text-center">
              <div className="text-[10px] text-white/60 uppercase">Soil Impact</div>
              <div className={`text-2xl font-black mt-0.5 ${result.soilImpactScore >= 0 ? 'text-[#81C784]' : 'text-[#EF9A9A]'}`}>
                {result.soilImpactScore >= 0 ? `+${result.soilImpactScore}` : result.soilImpactScore}
              </div>
              <div className="text-[10px] text-white/40 mt-1">Nutrient delta</div>
            </div>
          </div>

          {/* Factor Breakdown Matrix (Transparent Decision Engine) */}
          <div className="bg-[#121E2F] p-4 rounded-2xl border border-white/15 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span>DECISION FACTORS BREAKDOWN</span>
              <span className="text-[10px] text-[#A5D6A7]">Weighted Multi-Criteria Analysis</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between bg-white/5 p-2 rounded-xl">
                <span className="text-white/70">💧 Water Compatibility:</span>
                <span className="font-bold text-[#81D4FA]">{result.factors.waterCompatibility}/100</span>
              </div>
              <div className="flex items-center justify-between bg-white/5 p-2 rounded-xl">
                <span className="text-white/70">🌡️ Temperature Compatibility:</span>
                <span className="font-bold text-[#FFD54F]">{result.factors.temperatureCompatibility}/100</span>
              </div>
              <div className="flex items-center justify-between bg-white/5 p-2 rounded-xl">
                <span className="text-white/70">🌱 Soil Compatibility:</span>
                <span className="font-bold text-[#81C784]">{result.factors.soilCompatibility}/100</span>
              </div>
              <div className="flex items-center justify-between bg-white/5 p-2 rounded-xl">
                <span className="text-white/70">📅 Season Timing:</span>
                <span className="font-bold text-[#CE93D8]">{result.factors.seasonCompatibility}/100</span>
              </div>
            </div>
          </div>

          {/* What Happened? */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFD54F] flex items-center gap-1.5">
              <span>🔍</span>
              <span>WHAT HAPPENED?</span>
            </h4>
            <div className="text-xs text-slate-200 leading-relaxed bg-[#121E2F] p-3.5 rounded-2xl border border-white/10">
              {result.whatHappened}
            </div>
          </div>

          {/* What Can You Learn? */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#81C784] flex items-center gap-1.5">
              <span>💡</span>
              <span>WHAT CAN YOU LEARN?</span>
            </h4>
            <div className="text-xs text-slate-200 leading-relaxed bg-[#121E2F] p-3.5 rounded-2xl border border-white/10">
              {result.whatCanYouLearn}
            </div>
          </div>
        </div>

        {/* Bottom Actions: Try Another Crop, Ask Terra, & Direct Bridge to Real TerraCrop AI */}
        <div className="bg-[#111C2D] px-6 py-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onTryAnotherCrop}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-white/20 hover:bg-white/10 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>TRY ANOTHER CROP</span>
            </button>

            <button
              type="button"
              onClick={onAskTerra}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#004D40] hover:bg-[#00695C] border border-[#00E676] text-[#A7FFEB] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>🤖 ASK TERRA</span>
            </button>
          </div>

          {/* THE REAL PRODUCT BRIDGE BUTTON */}
          <button
            type="button"
            onClick={() => onOpenTerraCropAnalysis(result)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#388E3C] text-white text-xs font-bold tracking-wider shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-105 cursor-pointer"
          >
            <span>OPEN IN TERRACROP AI PLANNER</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
