import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  HelpCircle, 
  Droplets, 
  Thermometer, 
  Layers,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { GameWeatherScenario } from '@/src/types/game';
import { sound } from '@/src/lib/game/soundEffects';

interface AskTerraModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: GameWeatherScenario;
  onCompareCrops: () => void;
}

interface ChatEntry {
  sender: 'player' | 'terra';
  text: string;
}

export const AskTerraModal: React.FC<AskTerraModalProps> = ({
  isOpen,
  onClose,
  scenario,
  onCompareCrops
}) => {
  const [messages, setMessages] = useState<ChatEntry[]>([
    {
      sender: 'terra',
      text: `Greetings, young farmer! 🌱 I'm Terra, your satellite-guided agronomic AI companion. Currently our sensors show ${scenario.temperatureC}°C with ${scenario.waterAvailability.toLowerCase()} water availability. What agricultural question is on your mind?`
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    'I have limited water. What should I consider?',
    'Should I plant paddy rice this season?',
    'How do legumes like lentils heal depleted soil?',
    'What does NASA SMAP tell us about drought?'
  ];

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    sound.playBlip();
    setMessages(prev => [...prev, { sender: 'player', text }]);
    setInputText('');
    setIsLoading(true);

    setTimeout(() => {
      let reply = '';
      const lower = text.toLowerCase();

      if (lower.includes('water') && (lower.includes('limit') || lower.includes('shortage') || lower.includes('save'))) {
        reply = `When water availability is ${scenario.waterAvailability.toLowerCase()} (${scenario.rainfallMm}mm rain), prioritize deep-rooted pulses like Lentils or Chickpeas. They require only 30-40% of the water of cereal grains and tap into deeper subsoil moisture without exhausting your reservoir.`;
      } else if (lower.includes('rice')) {
        reply = `Paddy rice generally demands substantial standing water (1,200mm+ water equivalent). In our current ${scenario.name} scenario with ${scenario.rainfallMm}mm rainfall, planting rice without flood irrigation carries a high risk of water stress. Consider Maize or Lentils instead!`;
      } else if (lower.includes('legume') || lower.includes('soil') || lower.includes('heal') || lower.includes('nitrogen')) {
        reply = `Legumes (lentils, soybeans, chickpeas, clover) partner with symbiotic Rhizobium bacteria in their root nodules. They pull nitrogen gas straight from the atmosphere and fix it into the soil as natural fertilizer, increasing soil health for subsequent crops!`;
      } else if (lower.includes('smap') || lower.includes('nasa') || lower.includes('satellite')) {
        reply = `NASA SMAP orbits Earth with an L-band microwave radiometer, measuring the volumetric water percentage in the top 5cm of soil globally. It gives farmers real-time drought warnings before crops start wilting!`;
      } else if (lower.includes('heat') || lower.includes('hot')) {
        reply = `Current surface temperatures are ${scenario.temperatureC}°C. When temperatures exceed 34°C, sensitive crops suffer pollen sterility. Choose heat-tolerant cultivars like field maize or tropical legumes that have robust protective leaf waxes.`;
      } else {
        reply = `Great inquiry! In sustainable agriculture, we balance four pillars: Water Availability, Soil Horizon Health, Climate Stress, and Crop Succession. You can compare our available seed varieties side-by-side to inspect their exact water and heat tolerance!`;
      }

      setMessages(prev => [...prev, { sender: 'terra', text: reply }]);
      setIsLoading(false);
      sound.playCoin();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-xs select-none font-mono">
      <div className="relative w-full max-w-2xl bg-[#0B1220] rounded-3xl border-2 border-[#00E676] shadow-2xl flex flex-col max-h-[85vh] text-white overflow-hidden">
        {/* Top Header */}
        <div className="bg-[#111C2D] px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#004D40] border border-[#00E676] flex items-center justify-center text-xl">
              🤖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#64FFDA]">TERRA AI AGRO-ASSISTANT</h3>
                <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
              </div>
              <p className="text-[11px] text-white/60">Grounded in NASA Telemetry & Agronomic Science</p>
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

        {/* Current Environment Context Pill */}
        <div className="bg-[#00241A] px-6 py-2 border-b border-[#004D40] text-[11px] text-[#A7FFEB] flex flex-wrap items-center justify-between gap-2">
          <span>Active Scenario: <strong>{scenario.name}</strong></span>
          <span>🌡 {scenario.temperatureC}°C · 🌧 {scenario.rainfallMm}mm · 💧 {scenario.waterAvailability}</span>
        </div>

        {/* Chat History Container */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${m.sender === 'player' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'terra' && (
                <div className="w-7 h-7 rounded-xl bg-[#004D40] border border-[#00E676] flex items-center justify-center text-xs shrink-0 mt-1">
                  🌱
                </div>
              )}
              <div
                className={`max-w-[85%] sm:max-w-[80%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'player'
                    ? 'bg-[#1976D2] text-white rounded-tr-xs'
                    : 'bg-[#152336] text-slate-100 border border-white/10 rounded-tl-xs shadow-md'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-[#64FFDA] p-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Terra is analyzing agricultural telemetry...</span>
            </div>
          )}
        </div>

        {/* Quick Suggested Question Chips */}
        <div className="px-5 py-2.5 bg-[#0e1724] border-t border-white/10 flex items-center gap-2 overflow-x-auto text-[11px] no-scrollbar">
          <span className="text-white/40 shrink-0">Ask:</span>
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(p)}
              className="shrink-0 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Bottom Input & Compare Crops Button */}
        <div className="p-4 bg-[#111C2D] border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              onCompareCrops();
            }}
            className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-[#004D40] hover:bg-[#00695C] border border-[#00E676] text-[#A7FFEB] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shrink-0 transition-colors"
          >
            <span>COMPARE SEEDS MATRIX</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex-1 flex items-center gap-2 w-full"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Terra about weather, crops, soil..."
              className="flex-1 px-4 py-3 rounded-2xl bg-[#0B1220] border border-white/20 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#00E676]"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-3 rounded-2xl bg-[#2E7D32] hover:bg-[#388E3C] disabled:opacity-40 text-white cursor-pointer transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
