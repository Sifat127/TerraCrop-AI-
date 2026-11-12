import React from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';

interface DemoBannerProps {
  isDemo: boolean;
  onResetDemo: () => void;
  onOpenSettings: () => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({
  isDemo,
  onResetDemo,
  onOpenSettings
}) => {
  return (
    <div className="bg-[#F8F7F0] border-b border-[#DCE2D8] px-4 sm:px-8 py-2 text-xs text-[#697568] flex flex-wrap items-center justify-between gap-3 transition-colors">
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 text-[#285C35] font-semibold text-[11px] uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#36764A]" />
          NASA Agro-Model Active
        </span>
        <span className="text-[#DCE2D8] hidden sm:inline">|</span>
        <span className="text-[#697568] hidden md:inline text-[11px]">
          Calibrated with NASA POWER & SMAP soil telemetry · Benchmark Farm Data
        </span>
      </div>

      <div className="flex items-center gap-3 text-[11px]">
        <button
          onClick={onResetDemo}
          className="flex items-center gap-1 text-[#697568] hover:text-[#193D25] transition-colors cursor-pointer font-medium"
          title="Reset farm to initial demo state"
        >
          <RotateCcw className="w-3 h-3 text-[#71966B]" />
          <span>Reset Demo</span>
        </button>
        <span className="text-[#DCE2D8]">·</span>
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-1 text-[#285C35] hover:text-[#193D25] font-semibold transition-colors cursor-pointer"
        >
          <Sparkles className="w-3 h-3 text-[#71966B]" />
          <span>Preferences & Units</span>
        </button>
      </div>
    </div>
  );
};
