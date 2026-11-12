import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  CloudRain, 
  Sun, 
  Droplets, 
  Sprout, 
  Thermometer, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { GameCrop, GameWeatherScenario } from '@/src/types/game';
import { sound } from '@/src/lib/game/soundEffects';

interface SeasonSimulationModalProps {
  crop: GameCrop;
  scenario: GameWeatherScenario;
  onSimulationComplete: () => void;
}

export const SeasonSimulationModal: React.FC<SeasonSimulationModalProps> = ({
  crop,
  scenario,
  onSimulationComplete
}) => {
  const [currentDay, setCurrentDay] = useState(1);
  const [phaseMessage, setPhaseMessage] = useState('Germination & Emergence: Radicle develops in soil pores.');
  const [soilMoisture, setSoilMoisture] = useState(scenario.soilMoisturePercent);
  const [plantHealth, setPlantHealth] = useState(100);
  const [activeWeatherIcon, setActiveWeatherIcon] = useState('☀️');

  useEffect(() => {
    // 6 second progressive simulation
    const timeline = [
      {
        day: 5,
        msg: 'Emergence: Seedlings sprout. NASA SMAP records initial root-zone moisture.',
        moisture: scenario.soilMoisturePercent,
        health: 100,
        weather: '🌤️'
      },
      {
        day: 15,
        msg: 'Vegetative Growth: Active transpiration. Roots expand deeper into soil horizons.',
        moisture: Math.max(10, scenario.soilMoisturePercent - 4),
        health: 98,
        weather: '☀️'
      },
      {
        day: 25,
        msg: scenario.id === 'scenario_heavy_rain' 
          ? 'Weather Event: Monsoon cloudburst! Soil saturation reaches field capacity.' 
          : 'Weather Event: Mid-season dry spell! Evaporative demand peaks.',
        moisture: scenario.id === 'scenario_heavy_rain' ? 45 : Math.max(8, scenario.soilMoisturePercent - 8),
        health: crop.droughtTolerance === 'HIGH' ? 95 : crop.waterDemand === 'HIGH' ? 68 : 84,
        weather: scenario.id === 'scenario_heavy_rain' ? '🌧️' : '🔥'
      },
      {
        day: 35,
        msg: 'Flowering & Grain Filling: Crop utilizes stored soil reserves.',
        moisture: Math.max(12, scenario.soilMoisturePercent - 5),
        health: crop.droughtTolerance === 'HIGH' ? 96 : crop.waterDemand === 'HIGH' ? 62 : 82,
        weather: '🌤️'
      },
      {
        day: 40,
        msg: 'Physiological Maturity: Grain bulking complete. Ready for harvest!',
        moisture: Math.max(10, scenario.soilMoisturePercent - 6),
        health: crop.droughtTolerance === 'HIGH' ? 96 : crop.waterDemand === 'HIGH' ? 60 : 80,
        weather: '🌾'
      }
    ];

    timeline.forEach((step, idx) => {
      setTimeout(() => {
        setCurrentDay(step.day);
        setPhaseMessage(step.msg);
        setSoilMoisture(step.moisture);
        setPlantHealth(step.health);
        setActiveWeatherIcon(step.weather);
        sound.playStep();
      }, (idx + 1) * 1100);
    });

    const completionTimer = setTimeout(() => {
      sound.playHarvest();
      onSimulationComplete();
    }, 6200);

    return () => clearTimeout(completionTimer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md select-none font-mono">
      <div className="relative w-full max-w-xl bg-[#0B1220] rounded-3xl border-2 border-[#FFD54F] shadow-2xl p-6 sm:p-8 text-white space-y-6 text-center">
        {/* Animated Sprout Icon */}
        <div className="relative w-20 h-20 mx-auto rounded-3xl bg-[#1B5E20] border-2 border-[#4CAF50] flex items-center justify-center text-4xl shadow-xl">
          <span className="animate-bounce">🌱</span>
          <span className="absolute -top-1 -right-1 text-base">{activeWeatherIcon}</span>
        </div>

        <div>
          <span className="px-3 py-1 rounded-full bg-white/10 text-xs text-[#FFD54F] tracking-widest uppercase font-bold">
            SEASON SIMULATION IN PROGRESS
          </span>
          <h3 className="text-2xl font-bold text-white mt-2">
            DAY {currentDay} OF 40
          </h3>
          <p className="text-xs text-[#81C784] font-semibold mt-0.5">
            Crop: {crop.name} · Environment: {scenario.name}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden p-0.5 border border-white/20">
          <div 
            className="h-full bg-gradient-to-r from-[#4CAF50] to-[#FFD54F] rounded-full transition-all duration-700 ease-out"
            style={{ width: `${(currentDay / 40) * 100}%` }}
          />
        </div>

        {/* Real-Time Telemetry Counters */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-[#121E2F] p-3 rounded-2xl border border-white/10 flex items-center justify-between">
            <span className="text-white/60 flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-[#29B6F6]" />
              Soil Moisture:
            </span>
            <span className="font-bold text-[#81D4FA]">{soilMoisture}% Vol</span>
          </div>

          <div className="bg-[#121E2F] p-3 rounded-2xl border border-white/10 flex items-center justify-between">
            <span className="text-white/60 flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5 text-[#81C784]" />
              Crop Vigor:
            </span>
            <span className="font-bold text-[#A5D6A7]">{plantHealth}%</span>
          </div>
        </div>

        {/* Live Narrative Step */}
        <div className="p-4 rounded-2xl bg-[#152336] border border-white/15 text-xs text-slate-200 leading-relaxed min-h-[64px] flex items-center justify-center">
          <p className="animate-in fade-in duration-300">
            {phaseMessage}
          </p>
        </div>

        <div className="text-[11px] text-white/40 flex items-center justify-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#00E676] animate-ping" />
          <span>Simulating biological agro-ecosystem dynamics...</span>
        </div>
      </div>
    </div>
  );
};
