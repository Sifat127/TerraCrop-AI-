import React, { useState } from 'react';
import { 
  FlaskConical, 
  Layers, 
  TrendingUp, 
  Droplets, 
  Sprout, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  Sparkles, 
  ArrowRight,
  Sun,
  CloudRain,
  Check,
  X
} from 'lucide-react';
import { 
  FarmProfile, 
  EnvironmentalSnapshot, 
  Scenario, 
  WaterAvailability, 
  FarmerPriority 
} from '@/src/types';
import { simulateCustomScenario } from '@/src/lib/optimization/evaluator';
import { useI18n } from '@/src/lib/i18n/context';

interface ScenarioLabViewProps {
  farm: FarmProfile;
  environment: EnvironmentalSnapshot;
  scenarios: Scenario[];
  onApplyScenarioAsActivePlan: (scenario: Scenario) => void;
}

export const ScenarioLabView: React.FC<ScenarioLabViewProps> = ({
  farm,
  environment,
  scenarios: initialScenarios,
  onApplyScenarioAsActivePlan
}) => {
  const { language } = useI18n();

  const [scenarioList, setScenarioList] = useState<Scenario[]>(initialScenarios);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(initialScenarios[1]?.id || initialScenarios[0]?.id);

  // Scenario Simulator Inputs
  const [rainfallChange, setRainfallChange] = useState<number>(-15); // -15% rainfall
  const [tempChange, setTempChange] = useState<number>(2.0); // +2°C
  const [waterOverride, setWaterOverride] = useState<WaterAvailability>(farm.waterAvailability);
  const [priorityOverride, setPriorityOverride] = useState<FarmerPriority>('Save water');

  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStepText, setSimulationStepText] = useState('');

  const selectedScenario = scenarioList.find(s => s.id === selectedScenarioId) || scenarioList[0];

  const handleRunSimulation = () => {
    setIsSimulating(true);
    const steps = [
      'Analyzing microclimatic environmental variations...',
      'Evaluating physiological crop heat & water tolerances...',
      'Testing biological succession combinations...',
      'Synthesizing multi-attribute trade-off matrix...'
    ];

    steps.forEach((text, i) => {
      setTimeout(() => {
        setSimulationStepText(text);
      }, (i + 1) * 300);
    });

    setTimeout(() => {
      const simulated = simulateCustomScenario({
        farmProfile: farm,
        baseEnvironment: environment,
        rainfallChangePercent: rainfallChange,
        temperatureChangeC: tempChange,
        waterAvailabilityOverride: waterOverride,
        primaryPriorityOverride: priorityOverride
      });

      setScenarioList(prev => {
        const filtered = prev.filter(s => !s.id.startsWith('scenario-simulated'));
        return [...filtered, simulated];
      });
      setSelectedScenarioId(simulated.id);
      setIsSimulating(false);
      setSimulationStepText('');
    }, 1300);
  };

  const handleApplyPreset = (rain: number, temp: number, water: WaterAvailability, priority: FarmerPriority) => {
    setRainfallChange(rain);
    setTempChange(temp);
    setWaterOverride(water);
    setPriorityOverride(priority);
  };

  const handleResetScenarios = () => {
    setRainfallChange(0);
    setTempChange(0);
    setWaterOverride(farm.waterAvailability);
    setPriorityOverride(farm.priorities[0] || 'Improve soil health');
    setScenarioList(initialScenarios);
    setSelectedScenarioId(initialScenarios[1]?.id || initialScenarios[0]?.id);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 space-y-7 bg-[#F1F4EF] min-h-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#193D25]">
            {language === 'bn' ? 'পরিস্থিতি পরীক্ষা' : 'Scenario Lab'}
          </h2>
          <p className="text-xs sm:text-sm text-[#697568] mt-0.5">
            {language === 'bn' 
              ? 'আবহাওয়া বা জল পরিবর্তিত হলে কী হতে পারে তা পরীক্ষা করুন।' 
              : 'Explore how changing conditions could affect your crop plan.'}
          </p>
        </div>

        <button
          onClick={handleResetScenarios}
          className="inline-flex items-center gap-1.5 text-xs text-[#697568] hover:text-[#193D25] px-3.5 py-2 rounded-full border border-[#DCE2D8] bg-white hover:bg-[#F2F1E8] transition-colors cursor-pointer self-start sm:self-auto shadow-2xs"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#71966B]" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Main Two-Column Layout: Left Controls, Right Comparisons */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Scenario Controls & Sliders */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Scenario Preset Cards */}
          <div className="bg-white rounded-2xl p-6 border border-[#DCE2D8] shadow-2xs space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8A9286] block">
              Quick Climate Stress Cards
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleApplyPreset(-25, 1.5, 'Low', 'Save water')}
                className="p-3 rounded-xl border border-[#DCE2D8] bg-[#F8F7F0] hover:border-[#71966B] text-left text-xs space-y-1 transition-all cursor-pointer"
              >
                <div className="font-semibold text-[#193D25] flex items-center gap-1">
                  <CloudRain className="w-3.5 h-3.5 text-[#527DA5]" /> Less Rain
                </div>
                <div className="text-[10px] text-[#697568]">-25% Precipitation</div>
              </button>

              <button
                type="button"
                onClick={() => handleApplyPreset(-5, 3.5, 'Medium', 'Reduce climate risk')}
                className="p-3 rounded-xl border border-[#DCE2D8] bg-[#F8F7F0] hover:border-[#71966B] text-left text-xs space-y-1 transition-all cursor-pointer"
              >
                <div className="font-semibold text-[#193D25] flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-[#B9822A]" /> More Heat
                </div>
                <div className="text-[10px] text-[#697568]">+3.5°C Temperature</div>
              </button>

              <button
                type="button"
                onClick={() => handleApplyPreset(-30, 4.0, 'Low', 'Save water')}
                className="p-3 rounded-xl border border-[#DCE2D8] bg-[#F8F7F0] hover:border-[#71966B] text-left text-xs space-y-1 transition-all cursor-pointer"
              >
                <div className="font-semibold text-[#193D25] flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-[#B9822A]" /> Less Water
                </div>
                <div className="text-[10px] text-[#697568]">Restricted Irrigation</div>
              </button>

              <button
                type="button"
                onClick={() => handleApplyPreset(0, 0, 'Medium', 'Improve soil health')}
                className="p-3 rounded-xl border border-[#DCE2D8] bg-[#F8F7F0] hover:border-[#71966B] text-left text-xs space-y-1 transition-all cursor-pointer"
              >
                <div className="font-semibold text-[#193D25] flex items-center gap-1">
                  <Sprout className="w-3.5 h-3.5 text-[#36764A]" /> Focus on Soil
                </div>
                <div className="text-[10px] text-[#697568]">Max Organic Humus</div>
              </button>
            </div>
          </div>

          {/* Precision Adjustment Sliders */}
          <div className="bg-white rounded-2xl p-6 border border-[#DCE2D8] shadow-2xs space-y-5">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8A9286] block">
              Parameter Adjustments
            </span>

            {/* Rainfall Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-[#243428]">Rainfall Change:</span>
                <span className={`font-mono font-semibold ${rainfallChange < 0 ? 'text-[#B9822A]' : 'text-[#36764A]'}`}>
                  {rainfallChange > 0 ? `+${rainfallChange}%` : `${rainfallChange}%`}
                </span>
              </div>
              <input
                type="range"
                min="-30"
                max="30"
                step="5"
                value={rainfallChange}
                onChange={e => setRainfallChange(Number(e.target.value))}
                className="w-full accent-[#193D25] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#8A9286]">
                <span>-30% Drought</span>
                <span>Baseline</span>
                <span>+30% Wet</span>
              </div>
            </div>

            {/* Temperature Shift Slider */}
            <div className="space-y-2 pt-2 border-t border-[#DCE2D8]/60">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-[#243428]">Temperature Shift:</span>
                <span className={`font-mono font-semibold ${tempChange > 0 ? 'text-[#B9822A]' : 'text-[#527DA5]'}`}>
                  {tempChange > 0 ? `+${tempChange.toFixed(1)}°C` : `${tempChange.toFixed(1)}°C`}
                </span>
              </div>
              <input
                type="range"
                min="-5"
                max="5"
                step="0.5"
                value={tempChange}
                onChange={e => setTempChange(Number(e.target.value))}
                className="w-full accent-[#193D25] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#8A9286]">
                <span>-5.0°C Cooler</span>
                <span>Baseline</span>
                <span>+5.0°C Warming</span>
              </div>
            </div>

            {/* Recalculate Button */}
            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="w-full py-3 rounded-full bg-[#193D25] hover:bg-[#285C35] text-white font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isSimulating ? (simulationStepText || 'Simulating...') : 'Run Scenario Simulation'}
            </button>
          </div>
        </div>

        {/* Right Column: Comparative Scenarios & Trade-offs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8A9286] block">
              Strategic Plan Comparison
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {scenarioList.map(s => {
                const isSelected = s.id === selectedScenarioId;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedScenarioId(s.id)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#193D25] bg-white shadow-2xs ring-1 ring-[#193D25]'
                        : 'border-[#DCE2D8] bg-white hover:border-[#71966B]'
                    }`}
                  >
                    <div>
                      <div className="text-[10px] font-mono text-[#8A9286] uppercase mb-1">{s.plan.strategy}</div>
                      <div className="font-semibold text-sm text-[#193D25] leading-snug line-clamp-1">{s.name}</div>
                    </div>
                    <div className="mt-3 text-[11px] text-[#697568]">
                      Soil {s.plan.impact.soilHealthPercentChange > 0 ? `+${s.plan.impact.soilHealthPercentChange}%` : `${s.plan.impact.soilHealthPercentChange}%`}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Scenario Details & Trade-offs */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#DCE2D8] shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#DCE2D8]">
              <div>
                <span className="text-[11px] font-semibold text-[#71966B] uppercase tracking-wider block">
                  {selectedScenario.plan.strategy} Analysis
                </span>
                <h3 className="text-xl font-semibold text-[#193D25]">
                  {selectedScenario.name}
                </h3>
              </div>
              <button
                onClick={() => onApplyScenarioAsActivePlan(selectedScenario)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#193D25] hover:bg-[#285C35] text-white text-xs font-semibold tracking-wide transition-all shadow-2xs cursor-pointer self-start sm:self-auto"
              >
                <span>Apply as Active Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#697568] leading-relaxed">
              {selectedScenario.description}
            </p>

            {/* Sequence Pills */}
            <div className="p-3.5 rounded-xl bg-[#F8F7F0] border border-[#DCE2D8] text-xs">
              <span className="text-[10px] uppercase font-bold text-[#8A9286] block mb-1">
                Crop Succession Sequence:
              </span>
              <div className="flex flex-wrap items-center gap-2 font-medium text-[#193D25]">
                {selectedScenario.plan.years.map((y, idx) => (
                  <React.Fragment key={y.year}>
                    <span>{y.crop.icon} Year {y.year}: {y.crop.name.split(' ')[0]}</span>
                    {idx < selectedScenario.plan.years.length - 1 && <span className="text-[#8A9286]">→</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Trade-offs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#EAF2E7] border border-[#DCE2D8] space-y-2">
                <span className="text-xs font-semibold text-[#193D25] flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#36764A]" /> Advantages & Buffers
                </span>
                <ul className="space-y-1.5 text-xs text-[#243428]">
                  {selectedScenario.tradeoffs.pros.map((pro, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-[#36764A]">•</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#F8F7F0] border border-[#DCE2D8] space-y-2">
                <span className="text-xs font-semibold text-[#193D25] flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-[#B9822A]" /> Compromises & Cautions
                </span>
                <ul className="space-y-1.5 text-xs text-[#697568]">
                  {selectedScenario.tradeoffs.cons.map((con, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-[#B9822A]">•</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
