import React from 'react';
import { X, Settings, RotateCcw, Sparkles, CheckCircle2, Type, Languages, Compass } from 'lucide-react';
import { FarmProfile } from '@/src/types';
import { useI18n, TextSize } from '@/src/lib/i18n/context';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  farm: FarmProfile;
  onResetToDemo: () => void;
  onToggleUnit: () => void;
  onOpenOnboarding: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  farm,
  onResetToDemo,
  onToggleUnit,
  onOpenOnboarding,
}) => {
  const { t, language, setLanguage, textSize, setTextSize } = useI18n();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#181E19]/40 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-[#DCE2D8] overflow-hidden text-[#243428]">
        {/* Header */}
        <div className="bg-[#F8F7F0] p-4 sm:p-6 border-b border-[#DCE2D8] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#DDE8D8] text-[#193D25] flex items-center justify-center shrink-0">
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-base sm:text-lg text-[#193D25] truncate">{t.settings}</h3>
              <p className="text-[11px] sm:text-xs text-[#697568] truncate">Language, Text Size & Preferences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="min-h-[38px] min-w-[38px] p-2 rounded-xl text-[#697568] hover:text-[#193D25] hover:bg-[#EDF1EA] cursor-pointer flex items-center justify-center shrink-0"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Language Selector */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-[#8A9286] uppercase tracking-[0.14em] flex items-center gap-1.5">
              <Languages className="w-4 h-4 text-[#71966B]" />
              <span>Language / ভাষা</span>
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setLanguage('en')}
                className={`p-3.5 rounded-2xl border font-semibold text-xs sm:text-sm text-left transition-all cursor-pointer ${
                  language === 'en'
                    ? 'border-[#193D25] bg-[#DDE8D8] text-[#193D25] shadow-2xs'
                    : 'border-[#DCE2D8] bg-white text-[#243428] hover:border-[#71966B]/60 hover:bg-[#F8F7F0]'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('bn')}
                className={`p-3.5 rounded-2xl border font-semibold text-xs sm:text-sm text-left transition-all cursor-pointer ${
                  language === 'bn'
                    ? 'border-[#193D25] bg-[#DDE8D8] text-[#193D25] shadow-2xs'
                    : 'border-[#DCE2D8] bg-white text-[#243428] hover:border-[#71966B]/60 hover:bg-[#F8F7F0]'
                }`}
              >
                বাংলা (Bangla)
              </button>
            </div>
          </div>

          {/* Text Size Accessibility Selector */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-[#8A9286] uppercase tracking-[0.14em] flex items-center gap-1.5">
              <Type className="w-4 h-4 text-[#71966B]" />
              <span>{t.textSize}</span>
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {(['normal', 'large', 'extra-large'] as TextSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => setTextSize(size)}
                  className={`p-3 rounded-2xl border font-semibold text-xs text-center transition-all cursor-pointer ${
                    textSize === size
                      ? 'border-[#193D25] bg-[#DDE8D8] text-[#193D25] shadow-2xs'
                      : 'border-[#DCE2D8] bg-white text-[#697568] hover:border-[#71966B]/60 hover:bg-[#F8F7F0]'
                  }`}
                >
                  {size === 'normal' ? t.normalText : size === 'large' ? t.largeText : t.extraLargeText}
                </button>
              ))}
            </div>
          </div>

          {/* Units */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-[#8A9286] uppercase tracking-[0.14em] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#71966B]" />
              <span>Area Units</span>
            </h4>
            <div className="flex items-center justify-between p-3.5 bg-[#F8F7F0] rounded-2xl border border-[#DCE2D8]">
              <div>
                <div className="font-semibold text-sm text-[#193D25]">Acreage vs Hectares</div>
                <div className="text-xs text-[#697568]">Currently displaying: {farm.unit}</div>
              </div>
              <button
                onClick={onToggleUnit}
                className="px-4 py-2 bg-white hover:bg-[#F2F1E8] border border-[#DCE2D8] text-xs font-semibold text-[#193D25] rounded-full transition-colors cursor-pointer shadow-2xs"
              >
                Switch to {farm.unit === 'acres' ? 'Hectares' : 'Acres'}
              </button>
            </div>
          </div>

          {/* Guided Setup Relaunch */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-[#8A9286] uppercase tracking-[0.14em] flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#71966B]" />
              <span>Farm Setup Flow</span>
            </h4>
            <button
              onClick={() => {
                onClose();
                onOpenOnboarding();
              }}
              className="w-full p-3.5 bg-[#F8F7F0] hover:bg-[#DDE8D8]/50 border border-[#DCE2D8] rounded-2xl text-left transition-colors flex items-center justify-between cursor-pointer"
            >
              <div>
                <div className="font-semibold text-sm text-[#193D25]">{t.guidedSetup}</div>
                <div className="text-xs text-[#697568]">5-step wizard with location, soil, and crop presets</div>
              </div>
              <Compass className="w-5 h-5 text-[#285C35]" />
            </button>
          </div>

          {/* Demo Reset */}
          <div className="pt-2 border-t border-[#DCE2D8]">
            <div className="flex items-center justify-between p-3.5 bg-[#F8F7F0] rounded-2xl border border-[#DCE2D8]">
              <div>
                <div className="font-semibold text-sm text-[#193D25]">Reset Demo Farm</div>
                <div className="text-xs text-[#697568]">Restore default agricultural conditions</div>
              </div>
              <button
                onClick={() => {
                  onResetToDemo();
                  onClose();
                }}
                className="px-4 py-2 bg-white hover:bg-[#F2F1E8] border border-[#DCE2D8] text-xs font-semibold text-[#B94B43] rounded-full transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 bg-[#F8F7F0] border-t border-[#DCE2D8] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-[#193D25] hover:bg-[#285C35] text-white text-xs font-semibold tracking-wide transition-all shadow-2xs cursor-pointer"
          >
            {language === 'bn' ? 'সম্পন্ন' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
