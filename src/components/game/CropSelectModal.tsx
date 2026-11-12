import React, { useState } from 'react';
import { 
  X, 
  Sprout, 
  Droplets, 
  Thermometer, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  ArrowRight,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import { GameCrop, GameWeatherScenario } from '@/src/types/game';
import { GAME_CROPS } from '@/src/lib/game/cropData';
import { sound } from '@/src/lib/game/soundEffects';

interface CropSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: GameWeatherScenario;
  onPlantCrop: (crop: GameCrop) => void;
  farmerPriority: string;
}

export const CropSelectModal: React.FC<CropSelectModalProps> = ({
  isOpen,
  onClose,
  scenario,
  onPlantCrop,
  farmerPriority
}) => {
  const [selectedCropId, setSelectedCropId] = useState<string>(GAME_CROPS[0].id);
  const [isConfirmStep, setIsConfirmStep] = useState(false);

  if (!isOpen) return null;

  const selectedCrop = GAME_CROPS.find(c => c.id === selectedCropId) || GAME_CROPS[0];

  const handleSelectCrop = (cropId: string) => {
    sound.playBlip();
    setSelectedCropId(cropId);
    setIsConfirmStep(false);
  };

  const handleConfirmPlant = () => {
    sound.playHarvest();
    onPlantCrop(selectedCrop);
  };

  const getBadgeColor = (level: 'LOW' | 'MEDIUM' | 'HIGH') => {
    switch (level) {
      case 'HIGH': return 'bg-[#2E7D32]/40 text-[#A5D6A7] border-[#2E7D32]';
      case 'MEDIUM': return 'bg-[#F57F17]/30 text-[#FFE082] border-[#F57F17]';
      case 'LOW': return 'bg-[#C62828]/30 text-[#EF9A9A] border-[#C62828]';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs select-none font-mono">
      <div className="relative w-full max-w-4xl bg-[#0B1220] rounded-3xl border-2 border-[#4CAF50] shadow-2xl flex flex-col max-h-[92vh] text-white overflow-hidden">
        {/* Top Header */}
        <div className="bg-[#111C2D] px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1B5E20] border border-[#4CAF50] flex items-center justify-center text-xl">
              🌾
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#81C784] tracking-wide">
                CROP DECISION MATRIX
              </h3>
              <p className="text-[11px] text-white/60">
                Current Scenario: {scenario.name} ({scenario.waterAvailability} Water, {scenario.temperatureC}°C)
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

        {/* Priority Banner */}
        <div className="bg-[#00241A] px-6 py-2 border-b border-[#004D40] text-[11px] text-[#A7FFEB] flex flex-wrap items-center justify-between gap-2">
          <span>Farmer Objective: <strong>{farmerPriority}</strong></span>
          <span className="text-[#81D4FA]">Choose carefully — results will be simulated over 40 days!</span>
        </div>

        {/* Content Body: Grid of Crops */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {!isConfirmStep ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {GAME_CROPS.map((crop) => {
                  const isSelected = crop.id === selectedCropId;
                  return (
                    <button
                      key={crop.id}
                      type="button"
                      onClick={() => handleSelectCrop(crop.id)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? 'border-[#00E676] bg-[#12281E] shadow-xl ring-2 ring-[#00E676]/30'
                          : 'border-white/10 bg-[#121B2A] hover:border-white/30 hover:bg-[#182436]'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-sm font-bold text-white flex items-center gap-1.5">
                            <span>{crop.name}</span>
                            {crop.nitrogenFixing && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#2E7D32] text-[#A5D6A7]">
                                N-Fixing
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-white/50">{crop.category} · {crop.growthDays} Days</div>
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-[#00E676] text-[#0B1220] flex items-center justify-center font-bold text-xs">
                            ✓
                          </div>
                        )}
                      </div>

                      {/* Stat Pills */}
                      <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                        <div className={`p-1.5 rounded-lg border flex items-center justify-between ${getBadgeColor(crop.waterDemand)}`}>
                          <span>Water:</span>
                          <span className="font-bold">{crop.waterDemand}</span>
                        </div>
                        <div className={`p-1.5 rounded-lg border flex items-center justify-between ${getBadgeColor(crop.droughtTolerance)}`}>
                          <span>Drought:</span>
                          <span className="font-bold">{crop.droughtTolerance}</span>
                        </div>
                        <div className={`p-1.5 rounded-lg border flex items-center justify-between ${getBadgeColor(crop.heatTolerance)}`}>
                          <span>Heat:</span>
                          <span className="font-bold">{crop.heatTolerance}</span>
                        </div>
                        <div className={`p-1.5 rounded-lg border flex items-center justify-between ${getBadgeColor(crop.soilBenefit)}`}>
                          <span>Soil Gain:</span>
                          <span className="font-bold">{crop.soilBenefit}</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                        {crop.description}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Crop Agronomic Detail Card */}
              <div className="bg-[#121E2F] p-4 rounded-2xl border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-[#FFD54F] flex items-center gap-1.5">
                    <span>💡</span>
                    <span>Agronomic Insight: {selectedCrop.name}</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {selectedCrop.agronomicTip}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsConfirmStep(true)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#388E3C] text-white text-xs font-bold tracking-wider shadow-lg transition-transform hover:scale-105 cursor-pointer shrink-0"
                >
                  PREPARE TO PLANT SEEDS →
                </button>
              </div>
            </>
          ) : (
            /* Confirmation Step */
            <div className="max-w-lg mx-auto p-6 rounded-3xl bg-[#121E2F] border-2 border-[#FFD54F] space-y-5 text-center my-6">
              <div className="w-14 h-14 rounded-full bg-[#FFD54F]/20 border border-[#FFD54F] flex items-center justify-center text-3xl mx-auto">
                🌱
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">
                  CONFIRM PLANTING DECISION
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  You are planting <strong>{selectedCrop.name}</strong> under <strong>{scenario.name}</strong> conditions.
                </p>
              </div>

              <div className="bg-[#0B1220] p-4 rounded-2xl border border-white/10 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/60">Water Availability:</span>
                  <span className="font-bold text-[#81D4FA]">{scenario.waterAvailability} ({scenario.rainfallMm}mm)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Crop Water Demand:</span>
                  <span className="font-bold text-white">{selectedCrop.waterDemand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Crop Drought Tolerance:</span>
                  <span className="font-bold text-white">{selectedCrop.droughtTolerance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Soil Benefit:</span>
                  <span className="font-bold text-[#A5D6A7]">{selectedCrop.soilBenefit}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsConfirmStep(false)}
                  className="px-5 py-2.5 rounded-xl border border-white/20 text-xs font-bold text-white/70 hover:text-white cursor-pointer"
                >
                  ← GO BACK
                </button>

                <button
                  type="button"
                  onClick={handleConfirmPlant}
                  className="px-7 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#388E3C] text-white text-xs font-bold tracking-wider shadow-xl transition-transform hover:scale-105 cursor-pointer"
                >
                  YES, PLANT SEEDS NOW! 🌱
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
