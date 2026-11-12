import React from 'react';
import { 
  Home, 
  Sprout, 
  CalendarRange, 
  MessageSquareText, 
  X, 
  Globe2, 
  FlaskConical, 
  Database, 
  Settings,
  Compass,
  ArrowRight,
  Gamepad2
} from 'lucide-react';
import { NavTab } from './Sidebar';
import { FarmProfile } from '@/src/types';
import { BrandLogo } from '../common/BrandLogo';
import { useI18n } from '@/src/lib/i18n/context';
import { useAuth } from '@/src/lib/supabase/AuthContext';
import { User as UserIcon } from 'lucide-react';

interface MobileNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isDrawerOpen: boolean;
  onCloseDrawer: () => void;
  farm: FarmProfile;
  onOpenSettings: () => void;
  onOpenOnboarding: () => void;
  onGoToLanding: () => void;
  onOpenAuth?: () => void;
  onOpenProfile?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentTab,
  onSelectTab,
  isDrawerOpen,
  onCloseDrawer,
  farm,
  onOpenSettings,
  onOpenOnboarding,
  onGoToLanding,
  onOpenAuth,
  onOpenProfile,
}) => {
  const { t, language } = useI18n();
  const { user, profile } = useAuth();

  const bottomTabs: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: language === 'bn' ? 'হোম' : 'Home', icon: Home },
    { id: 'farm', label: language === 'bn' ? 'খামার' : 'My Farm', icon: Sprout },
    { id: 'planner', label: language === 'bn' ? 'পরিকল্পনা' : 'Crop Plan', icon: CalendarRange },
    { id: 'assistant', label: language === 'bn' ? 'টেরা' : 'Ask Terra', icon: MessageSquareText },
  ];

  return (
    <>
      {/* Persistent Bottom Bar on Mobile/Tablet */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#DCE2D8] px-1.5 sm:px-3 py-1 safe-area-pb shadow-lg">
        <div className="grid grid-cols-4 gap-1 items-center max-w-md mx-auto">
          {bottomTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex flex-col items-center justify-center min-h-[50px] py-1.5 px-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive 
                    ? 'text-[#193D25] bg-[#DDE8D8]/70 shadow-2xs font-bold' 
                    : 'text-[#697568] hover:text-[#193D25]'
                }`}
                aria-label={tab.label}
              >
                <Icon className={`w-4 h-4 mb-1 ${isActive ? 'text-[#193D25]' : 'text-[#8A9286]'}`} />
                <span className="truncate max-w-[70px] text-[10px] sm:text-[11px] tracking-tight">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Slide-over Mobile Drawer for More Navigation */}
      {isDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            onClick={onCloseDrawer} 
            className="fixed inset-0 bg-[#181E19]/40 backdrop-blur-xs transition-opacity" 
          />

          {/* Drawer Body */}
          <div className="relative w-[85vw] max-w-sm bg-[#F8F7F0] text-[#243428] flex flex-col h-full shadow-2xl p-4 sm:p-5 border-r border-[#DCE2D8] overscroll-contain">
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#DCE2D8]">
              <BrandLogo size="sm" />
              <button
                onClick={onCloseDrawer}
                className="min-h-[44px] min-w-[44px] p-2 rounded-xl text-[#697568] hover:text-[#193D25] hover:bg-[#F1F4EF] flex items-center justify-center cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Farm Header Summary */}
            <div className="py-3 px-3.5 my-3 rounded-2xl bg-white border border-[#DCE2D8] text-xs">
              <div className="font-semibold text-[#193D25]">{farm.name}</div>
              <div className="text-[#8A9286] text-[11px] mt-0.5">{farm.location.region} · {farm.size} {farm.unit}</div>
            </div>

            {/* Links */}
            <div className="py-2 space-y-1.5 flex-1 overflow-y-auto">
              <div className="text-[10px] font-bold text-[#8A9286] uppercase tracking-[0.16em] px-3 pt-1 pb-1">
                {language === 'bn' ? 'ওয়ার্কস্পেস' : 'WORKSPACE'}
              </div>
              {bottomTabs.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      onCloseDrawer();
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive ? 'bg-[#DDE8D8] text-[#193D25]' : 'text-[#697568] hover:bg-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <div className="text-[10px] font-bold text-[#8A9286] uppercase tracking-[0.16em] px-3 pt-4 pb-1">
                {language === 'bn' ? 'উন্নত অপশন' : 'MORE TOOLS'}
              </div>
              {[
                { id: 'game' as NavTab, label: language === 'bn' ? 'ফার্ম গেম' : 'Farm Game 🎮', icon: Gamepad2 },
                { id: 'scenarios' as NavTab, label: language === 'bn' ? 'পরিস্থিতি পরীক্ষা' : 'Scenario Lab', icon: FlaskConical },
                { id: 'climate' as NavTab, label: language === 'bn' ? 'আবহাওয়া মানচিত্র' : 'Climate Map', icon: Globe2 },
                { id: 'sources' as NavTab, label: language === 'bn' ? 'তথ্যের উৎস' : 'Data Sources', icon: Database },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      onCloseDrawer();
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive ? 'bg-[#DDE8D8] text-[#193D25]' : 'text-[#697568] hover:bg-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <button
                onClick={() => {
                  onCloseDrawer();
                  onOpenOnboarding();
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#285C35] hover:bg-[#DDE8D8]/60 transition-all cursor-pointer mt-2"
              >
                <Compass className="w-4 h-4" />
                <span>{language === 'bn' ? 'নির্দেশিত প্রস্তুতি' : 'Guided Setup (5 Steps)'}</span>
              </button>
            </div>

            {/* Bottom Controls */}
            <div className="pt-4 border-t border-[#DCE2D8] space-y-2 text-xs">
              {user ? (
                <button
                  onClick={() => {
                    onCloseDrawer();
                    if (onOpenProfile) onOpenProfile();
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl bg-[#DDE8D8]/70 text-[#193D25] font-semibold transition-colors cursor-pointer"
                >
                  <UserIcon className="w-4 h-4 text-[#193D25]" />
                  <span className="truncate">{profile?.full_name || user.email || 'Farmer Account'}</span>
                </button>
              ) : (
                onOpenAuth && (
                  <button
                    onClick={() => {
                      onCloseDrawer();
                      onOpenAuth();
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl bg-[#193D25] text-white font-semibold transition-colors cursor-pointer"
                  >
                    <UserIcon className="w-4 h-4 text-[#A5D6A7]" />
                    <span>{language === 'bn' ? 'সাইন ইন / নিবন্ধন' : 'Sign In / Create Account'}</span>
                  </button>
                )
              )}

              <button
                onClick={() => {
                  onCloseDrawer();
                  onOpenSettings();
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-[#697568] hover:text-[#193D25] hover:bg-white transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4 text-[#8A9286]" />
                <span>{t.settings}</span>
              </button>

              <button
                onClick={() => {
                  onCloseDrawer();
                  onGoToLanding();
                }}
                className="w-full text-center text-[11px] text-[#8A9286] hover:text-[#193D25] py-1 transition-colors"
              >
                {language === 'bn' ? 'মূল ওয়েবসাইটে ফিরুন' : 'Back to Website'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
