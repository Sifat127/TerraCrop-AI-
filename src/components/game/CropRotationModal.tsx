import React, { useState } from 'react';
import { 
  X, 
  RotateCw, 
  Sparkles, 
  Droplets, 
  Sprout, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { GAME_CROPS } from '@/src/lib/game/cropData';
import { sound } from '@/src/lib/game/soundEffects';

interface CropRotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyRotationToApp: (rotationCropIds: string[]) => void;
}

export const CropRotationModal: React.FC<CropRotationModalProps> = ({
  isOpen,
  onClose,
  onApplyRotationToApp
}) => {
  const [year1Crop, setYear1Crop] = useState<string>('rice');
  const [year2Crop, setYear2Crop] = useState<string>('lentils');
  const [year3Crop, setYear3Crop] = useState<string>('maize');

  if (!isOpen) return null;

  const crop1 = GAME_CROPS.find(c => c.id === year1Crop) || GAME_CROPS[0];
  const crop2 = GAME_CROPS.find(c => c.id === year2Crop) || GAME_CROPS[1];
  const crop3 = GAME_CROPS.find(c => c.id === year3Crop) || GAME_CROPS[2];

  // Evaluate 3-year biological rotation rules
  const hasMonocultureViolation = (year1Crop === year2Crop) || (year2Crop === year3Crop);
  const hasLegumeBreak = crop1.nitrogenFixing || crop2.nitrogenFixing || crop3.nitrogenFixing;
  const highWaterCount = [crop1, crop2, crop3].filter(c => c.waterDemand === 'HIGH').length;

  let sustainabilityScore = 75;
  if (!hasMonocultureViolation) sustainabilityScore += 15;
  else sustainabilityScore -= 25;

  if (hasLegumeBreak) sustainabilityScore += 12;
  else sustainabilityScore -= 15;

  if (highWaterCount <= 1) sustainabilityScore += 8;
  else sustainabilityScore -= 12;

  sustainabilityScore = Math.min(100, Math.max(20, sustainabilityScore));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs select-none font-mono">
      <div className="relative w-full max-w-3xl bg-[#0B1220] rounded-3xl border-2 border-[#81C784] shadow-2xl flex flex-col max-h-[90vh] text-white overflow-hidden">
        {/* Header */}
        <div className="bg-[#111C2D] px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1B5E20] border border-[#81C784] flex items-center justify-center text-xl">
              🔄
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#81C784] tracking-wide">
                MULTI-YEAR CROP ROTATION SIMULATOR
              </h3>
              <p className="text-[11px] text-white/60">
                Plan a 3-year cycle to break pest chains and regenerate soil biology
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Year Sequence Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Year 1 */}
            <div className="bg-[#121E2F] p-4 rounded-2xl border border-white/15 space-y-3">
              <span className="text-[10px] font-bold text-[#81D4FA] uppercase tracking-wider block">
                YEAR 1 · PRIMARY CROP
              </span>
              <select
                value={year1Crop}
                onChange={(e) => {
                  sound.playBlip();
                  setYear1Crop(e.target.value);
                }}
                className="w-full p-2.5 rounded-xl bg-[#0B1220] border border-white/20 text-xs font-bold text-white outline-none cursor-pointer"
              >
                {GAME_CROPS.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.waterDemand} Water)</option>
                ))}
              </select>
              <div className="text-[11px] text-slate-300">
                {crop1.description}
              </div>
            </div>

            {/* Year 2 */}
            <div className="bg-[#121E2F] p-4 rounded-2xl border border-white/15 space-y-3">
              <span className="text-[10px] font-bold text-[#A5D6A7] uppercase tracking-wider block">
                YEAR 2 · ROTATION / BREAK
              </span>
              <select
                value={year2Crop}
                onChange={(e) => {
                  sound.playBlip();
                  setYear2Crop(e.target.value);
                }}
                className="w-full p-2.5 rounded-xl bg-[#0B1220] border border-white/20 text-xs font-bold text-white outline-none cursor-pointer"
              >
                {GAME_CROPS.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.nitrogenFixing ? 'N-Fixing Legume' : c.category})</option>
                ))}
              </select>
              <div className="text-[11px] text-slate-300">
                {crop2.description}
              </div>
            </div>

            {/* Year 3 */}
            <div className="bg-[#121E2F] p-4 rounded-2xl border border-white/15 space-y-3">
              <span className="text-[10px] font-bold text-[#FFD54F] uppercase tracking-wider block">
                YEAR 3 · SUCCESSION CROP
              </span>
              <select
                value={year3Crop}
                onChange={(e) => {
                  sound.playBlip();
                  setYear3Crop(e.target.value);
                }}
                className="w-full p-2.5 rounded-xl bg-[#0B1220] border border-white/20 text-xs font-bold text-white outline-none cursor-pointer"
              >
                {GAME_CROPS.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.category})</option>
                ))}
              </select>
              <div className="text-[11px] text-slate-300">
                {crop3.description}
              </div>
            </div>
          </div>

          {/* Biological Trade-offs & Score Card */}
          <div className="bg-[#152336] p-5 rounded-2xl border border-white/15 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">3-Year Agronomic Evaluation</h4>
                <p className="text-[11px] text-white/60">Succession Compatibility & Ecological Balance</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-white/60">Sustainability Score:</span>
                <div className="text-2xl font-black text-[#64FFDA]">
                  {sustainabilityScore}<span className="text-xs text-white/50">/100</span>
                </div>
              </div>
            </div>

            {/* Rule Feedback Items */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                {hasMonocultureViolation ? (
                  <AlertTriangle className="w-4 h-4 text-[#EF5350] shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-[#66BB6A] shrink-0" />
                )}
                <span className={hasMonocultureViolation ? 'text-[#EF9A9A]' : 'text-[#C8E6C9]'}>
                  {hasMonocultureViolation 
                    ? 'Monoculture Penalty: Consecutive duplicate crops invite soil pathogens and root nematodes!' 
                    : 'Biodiversity Check: No consecutive monoculture detected. Pest lifecycle disrupted.'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {hasLegumeBreak ? (
                  <CheckCircle2 className="w-4 h-4 text-[#66BB6A] shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-[#FFA726] shrink-0" />
                )}
                <span className={hasLegumeBreak ? 'text-[#C8E6C9]' : 'text-[#FFE0B2]'}>
                  {hasLegumeBreak 
                    ? 'Nitrogen Credit: Legume phase captures free biological atmospheric nitrogen for following crops!' 
                    : 'Notice: No legume break detected. Soil will require more external synthetic fertilizers.'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#111C2D] px-6 py-4 border-t border-white/10 flex items-center justify-between gap-3">
          <span className="text-[11px] text-white/60 hidden sm:inline">
            Connects seamlessly into the TerraCrop AI Multi-Year Rotation Engine
          </span>

          <button
            type="button"
            onClick={() => {
              sound.playHarvest();
              onApplyRotationToApp([year1Crop, year2Crop, year3Crop]);
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#388E3C] text-white text-xs font-bold tracking-wider shadow-lg transition-transform hover:scale-105 cursor-pointer flex items-center justify-center gap-2 ml-auto"
          >
            <span>APPLY TO REAL TERRACROP AI</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
