import React from 'react';
import { 
  X, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Coins, 
  Award,
  ChevronRight
} from 'lucide-react';
import { GameQuest } from '@/src/types/game';
import { sound } from '@/src/lib/game/soundEffects';

interface QuestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  quests: GameQuest[];
  onClaimReward: (questId: string) => void;
  playerLevel: number;
  playerTitle: string;
}

export const QuestsModal: React.FC<QuestsModalProps> = ({
  isOpen,
  onClose,
  quests,
  onClaimReward,
  playerLevel,
  playerTitle
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs select-none font-mono">
      <div className="relative w-full max-w-2xl bg-[#0B1220] rounded-3xl border-2 border-[#4CAF50] shadow-2xl flex flex-col max-h-[85vh] text-white overflow-hidden">
        {/* Header */}
        <div className="bg-[#111C2D] px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1B5E20] border border-[#4CAF50] flex items-center justify-center text-xl">
              🎯
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-[#81C784]">
                  FARM MISSIONS & MILESTONES
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] text-[#FFD54F] font-bold">
                  {playerTitle} · Lv.{playerLevel}
                </span>
              </div>
              <p className="text-[11px] text-white/60">
                Complete objectives to level up your farming title & unlock rewards
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

        {/* Quest List */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3">
          {quests.map((quest) => (
            <div
              key={quest.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                quest.completed
                  ? 'border-[#4CAF50] bg-[#102919]'
                  : 'border-white/15 bg-[#121E2F]'
              }`}
            >
              <div className="flex items-start gap-3">
                {quest.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-[#81C784] shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 text-white/30 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{quest.title}</span>
                    {quest.completed && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2E7D32] text-[#C8E6C9]">
                        COMPLETED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    {quest.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="flex flex-col items-end text-xs">
                  <span className="text-[#FFD54F] font-bold">+${quest.rewardCoins}</span>
                  <span className="text-[#64FFDA] text-[10px]">+{quest.rewardKnowledge} XP</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-[#111C2D] px-6 py-3 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
          <span>7 Farming Titles to Unlock (Explorer → Future Farmer)</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#388E3C] text-white font-bold cursor-pointer transition-colors"
          >
            CONTINUE FARMING
          </button>
        </div>
      </div>
    </div>
  );
};
