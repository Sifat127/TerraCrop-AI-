import React, { useState } from 'react';
import { 
  X, 
  Satellite, 
  CloudRain, 
  Activity, 
  Sun, 
  Info, 
  ExternalLink,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { NASA_STATION_CARDS } from '@/src/lib/game/gameData';
import { sound } from '@/src/lib/game/soundEffects';

interface NasaStationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuizStart?: () => void;
}

export const NasaStationModal: React.FC<NasaStationModalProps> = ({
  isOpen,
  onClose,
  onQuizStart
}) => {
  const [selectedCardId, setSelectedCardId] = useState(NASA_STATION_CARDS[0].id);

  if (!isOpen) return null;

  const currentCard = NASA_STATION_CARDS.find(c => c.id === selectedCardId) || NASA_STATION_CARDS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs select-none font-mono">
      <div className="relative w-full max-w-4xl bg-[#0B1220] rounded-3xl border-2 border-[#1976D2] shadow-2xl flex flex-col max-h-[90vh] text-white overflow-hidden">
        {/* Header: NASA Branding */}
        <div className="bg-[#0D47A1] px-6 py-4 flex items-center justify-between border-b border-white/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white text-[#0D47A1] flex items-center justify-center text-xl font-bold shadow-md">
              🚀
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold tracking-wide text-white">
                  NASA EARTH OBSERVATION CENTER
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#D32F2F] text-[10px] font-bold tracking-widest text-white">
                  OPEN SCIENCE
                </span>
              </div>
              <p className="text-[11px] text-blue-200">Constellation Satellite Telemetry for Global Agriculture</p>
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

        {/* Scientific Responsibility Notice (As specifically mandated by the prompt) */}
        <div className="bg-[#102A43] px-6 py-2.5 border-b border-[#243B53] text-[11px] text-[#9FB3C8] flex items-center gap-2">
          <Info className="w-4 h-4 text-[#486581] shrink-0" />
          <span>
            <strong>Scientist's Note:</strong> NASA satellite observations provide broad environmental context. Real farm decisions must synthesize satellite telemetry with local soil texture, farmer priorities, and economic goals.
          </span>
        </div>

        {/* Main Content Grid: Satellite Selector on Left, Detailed View on Right */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 min-h-0">
          {/* Left Column: 4 Satellite Cards */}
          <div className="md:col-span-5 p-4 border-r border-white/10 space-y-2.5 bg-[#0e1724]">
            {NASA_STATION_CARDS.map((card) => {
              const isSelected = card.id === selectedCardId;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => {
                    sound.playBlip();
                    setSelectedCardId(card.id);
                  }}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-[#29B6F6] bg-[#102a45] shadow-lg'
                      : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{card.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-white">{card.title}</div>
                      <div className="text-[10px] text-white/60">{card.subtitle}</div>
                    </div>
                  </div>
                  {isSelected && <ChevronRight className="w-4 h-4 text-[#29B6F6]" />}
                </button>
              );
            })}

            {/* Quick Quiz Callout */}
            <div className="p-3.5 rounded-2xl bg-[#004D40]/60 border border-[#00E676]/40 text-xs space-y-2 mt-4">
              <div className="font-bold text-[#64FFDA] flex items-center gap-1.5">
                <span>🎓</span>
                <span>TEST YOUR NASA KNOWLEDGE</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Answer simple questions to earn +30 Knowledge XP and coins!
              </p>
            </div>
          </div>

          {/* Right Column: Deep Satellite Profile */}
          <div className="md:col-span-7 p-6 space-y-5 bg-[#0B1220]">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl mr-2">{currentCard.icon}</span>
                <span className="text-lg font-bold text-[#64FFDA]">{currentCard.title}</span>
                <div className="text-xs text-white/60 mt-0.5">{currentCard.subtitle}</div>
              </div>
              <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-[10px] font-mono text-[#81D4FA]">
                {currentCard.spec}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-white/5 p-3.5 rounded-2xl border border-white/10">
              {currentCard.shortDesc}
            </p>

            {/* Card 1: What is it? */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFD54F] flex items-center gap-1.5">
                <span>🛰️</span>
                <span>WHAT IS IT?</span>
              </h4>
              <div className="text-xs text-slate-300 leading-relaxed pl-5 border-l-2 border-[#FFD54F]">
                {currentCard.whatIsIt}
              </div>
            </div>

            {/* Card 2: How does it help farmers? */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#81C784] flex items-center gap-1.5">
                <span>🌱</span>
                <span>HOW DOES IT HELP FARMERS?</span>
              </h4>
              <div className="text-xs text-slate-300 leading-relaxed pl-5 border-l-2 border-[#81C784]">
                {currentCard.howItHelps}
              </div>
            </div>

            {/* Live Telemetry Simulation Bar */}
            <div className="p-3.5 rounded-2xl bg-[#00241A] border border-[#004D40] text-xs text-[#A7FFEB] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00E676] animate-pulse" />
                <span>Sensor Orbital Track: Live Overpass Active</span>
              </div>
              <span className="font-bold text-[#00E676]">CALIBRATED ✔</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#0e1724] px-6 py-3.5 border-t border-white/10 flex items-center justify-between">
          <span className="text-[11px] text-white/50">
            TerraCrop AI integrates real NASA Earth Science APIs
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-[#1976D2] hover:bg-[#1E88E5] text-white text-xs font-bold tracking-wider cursor-pointer shadow-md transition-all"
          >
            RETURN TO FARM
          </button>
        </div>
      </div>
    </div>
  );
};
