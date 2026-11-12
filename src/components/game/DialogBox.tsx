import React, { useState } from 'react';
import { NPCCharacter } from '@/src/types/game';
import { sound } from '@/src/lib/game/soundEffects';

interface DialogBoxProps {
  npc: NPCCharacter;
  onClose: () => void;
  onAction?: (actionKey: string) => void;
}

export const DialogBox: React.FC<DialogBoxProps> = ({ npc, onClose, onAction }) => {
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const handleNext = () => {
    sound.playBlip();
    if (dialogueIndex < npc.dialogue.length - 1) {
      setDialogueIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in select-none font-mono">
      <div className="relative w-full max-w-xl bg-[#0B1220] rounded-3xl border-3 border-[#4CAF50] shadow-2xl p-5 sm:p-7 text-white space-y-4">
        {/* Header: NPC Identity */}
        <div className="flex items-center justify-between border-b border-white/15 pb-3">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl font-bold border-2 border-white/20 shadow-inner"
              style={{ backgroundColor: npc.avatarColor }}
            >
              {npc.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-base font-bold text-[#81C784] tracking-wide">{npc.name}</h3>
              <p className="text-[11px] text-white/60 uppercase tracking-widest">{npc.role}</p>
            </div>
          </div>

          <div className="text-[11px] text-white/50 bg-white/5 px-2.5 py-1 rounded-lg">
            {dialogueIndex + 1} / {npc.dialogue.length}
          </div>
        </div>

        {/* Dialogue Text Body */}
        <div className="min-h-[72px] sm:min-h-[84px] text-sm sm:text-base leading-relaxed text-slate-100 flex items-center">
          <p className="animate-in fade-in duration-200">
            "{npc.dialogue[dialogueIndex]}"
          </p>
        </div>

        {/* Tip Badge */}
        {npc.tip && (
          <div className="bg-[#1B2E1E] p-2.5 rounded-xl border border-[#388E3C] text-[11px] text-[#A5D6A7] flex items-center gap-2">
            <span>💡</span>
            <span>AGRI WISDOM: {npc.tip}</span>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-white/50 hover:text-white underline cursor-pointer"
          >
            Skip Dialogue
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#388E3C] text-white text-xs font-bold tracking-wider shadow-lg transition-transform hover:scale-105 cursor-pointer flex items-center gap-1.5"
          >
            <span>{dialogueIndex < npc.dialogue.length - 1 ? 'NEXT →' : 'UNDERSTOOD ✔'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
