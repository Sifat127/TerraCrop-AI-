import React, { useRef } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Hand } from 'lucide-react';
import { sound } from '@/src/lib/game/soundEffects';

interface MobileGameControlsProps {
  onMove: (vx: number, vy: number) => void;
  onInteract: () => void;
}

export const MobileGameControls: React.FC<MobileGameControlsProps> = ({
  onMove,
  onInteract
}) => {
  const handleTouchStart = (vx: number, vy: number) => {
    onMove(vx, vy);
  };

  const handleTouchEnd = () => {
    onMove(0, 0);
  };

  return (
    <div className="md:hidden pointer-events-none fixed inset-x-0 bottom-24 px-3 flex items-end justify-between z-40 select-none">
      {/* Virtual D-Pad Left */}
      <div className="pointer-events-auto bg-[#0B1220]/85 backdrop-blur-md p-1.5 rounded-2xl border-2 border-white/25 shadow-2xl flex flex-col items-center gap-1">
        <button
          type="button"
          onTouchStart={() => handleTouchStart(0, -1)}
          onTouchEnd={handleTouchEnd}
          onMouseDown={() => handleTouchStart(0, -1)}
          onMouseUp={handleTouchEnd}
          className="w-11 h-11 rounded-2xl bg-white/10 active:bg-[#4CAF50] text-white flex items-center justify-center font-bold text-lg active:scale-95 transition-transform"
        >
          <ArrowUp className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onTouchStart={() => handleTouchStart(-1, 0)}
            onTouchEnd={handleTouchEnd}
            onMouseDown={() => handleTouchStart(-1, 0)}
            onMouseUp={handleTouchEnd}
            className="w-11 h-11 rounded-2xl bg-white/10 active:bg-[#4CAF50] text-white flex items-center justify-center font-bold text-lg active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-[10px] text-white/40 font-mono">
            WALK
          </div>

          <button
            type="button"
            onTouchStart={() => handleTouchStart(1, 0)}
            onTouchEnd={handleTouchEnd}
            onMouseDown={() => handleTouchStart(1, 0)}
            onMouseUp={handleTouchEnd}
            className="w-11 h-11 rounded-2xl bg-white/10 active:bg-[#4CAF50] text-white flex items-center justify-center font-bold text-lg active:scale-95 transition-transform"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <button
          type="button"
          onTouchStart={() => handleTouchStart(0, 1)}
          onTouchEnd={handleTouchEnd}
          onMouseDown={() => handleTouchStart(0, 1)}
          onMouseUp={handleTouchEnd}
          className="w-11 h-11 rounded-2xl bg-white/10 active:bg-[#4CAF50] text-white flex items-center justify-center font-bold text-lg active:scale-95 transition-transform"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
      </div>

      {/* Action / Interact Button Right */}
      <div className="pointer-events-auto">
        <button
          type="button"
          onClick={() => {
            sound.playBlip();
            onInteract();
          }}
          className="w-18 h-18 rounded-3xl bg-[#2E7D32] active:bg-[#388E3C] border-3 border-[#81C784] shadow-2xl text-white flex flex-col items-center justify-center gap-1 active:scale-90 transition-transform cursor-pointer"
        >
          <Hand className="w-6 h-6 text-white" />
          <span className="text-[10px] font-bold font-mono tracking-wider">[E] ACT</span>
        </button>
      </div>
    </div>
  );
};
