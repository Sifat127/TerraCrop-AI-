import React from 'react';
import { 
  LayoutDashboard, 
  Sprout, 
  CalendarRange, 
  Globe2, 
  FlaskConical, 
  MessageSquareText, 
  Database, 
  Settings, 
  User, 
  Compass,
  ChevronRight,
  ExternalLink,
  Gamepad2
} from 'lucide-react';
import { FarmProfile } from '@/src/types';
import { BrandLogo } from '../common/BrandLogo';
import { useI18n } from '@/src/lib/i18n/context';

export type NavTab = 
  | 'dashboard' 
  | 'farm' 
  | 'planner' 
  | 'climate' 
  | 'scenarios' 
  | 'assistant' 
  | 'sources'
  | 'game';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  farm: FarmProfile;
  onOpenSettings: () => void;
  onOpenOnboarding: () => void;
  onGoToLanding: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  farm,
  onOpenSettings,
  onOpenOnboarding,
  onGoToLanding,
}) => {
  const { t, language } = useI18n();

  const primaryItems = [
    { id: 'dashboard' as NavTab, label: language === 'bn' ? 'ওভারভিউ' : 'Overview', icon: LayoutDashboard },
    { id: 'farm' as NavTab, label: language === 'bn' ? 'আমার খামার' : 'My Farm', icon: Sprout },
    { id: 'planner' as NavTab, label: language === 'bn' ? 'ফসল পরিকল্পনা' : 'Crop Planner', icon: CalendarRange },
    { id: 'scenarios' as NavTab, label: language === 'bn' ? 'পরিস্থিতি পরীক্ষা' : 'Scenario Lab', icon: FlaskConical },
    { id: 'climate' as NavTab, label: language === 'bn' ? 'আবহাওয়া মানচিত্র' : 'Climate Map', icon: Globe2 },
    { id: 'assistant' as NavTab, label: language === 'bn' ? 'টেরা সহকারী' : 'Ask Terra', icon: MessageSquareText },
    { id: 'game' as NavTab, label: language === 'bn' ? 'ফার্ম গেম' : 'Farm Game 🎮', icon: Gamepad2 },
  ];

  const secondaryItems = [
    { id: 'sources' as NavTab, label: language === 'bn' ? 'তথ্যের উৎস' : 'Data Sources', icon: Database },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-[240px] bg-[#EDF1EA] border-r border-[#DCE2D8] text-[#243428] select-none shrink-0 h-screen sticky top-0 transition-colors">
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-[#DCE2D8] flex items-center justify-between">
        <button 
          onClick={onGoToLanding}
          className="flex items-center text-left hover:opacity-85 transition-opacity cursor-pointer"
          title="Back to Landing Page"
        >
          <BrandLogo size="md" />
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
        <div className="space-y-1">
          <div className="px-3 pb-1.5 text-[10px] font-bold text-[#8A9286] uppercase tracking-[0.16em]">
            {language === 'bn' ? 'ওয়ার্কস্পেস' : 'WORKSPACE'}
          </div>
          {primaryItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer text-left ${
                  isActive
                    ? 'bg-[#DDE8D8] text-[#193D25] font-semibold shadow-2xs'
                    : 'text-[#697568] hover:bg-[#F2F5F0] hover:text-[#193D25]'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#193D25]' : 'text-[#8A9286]'}`} />
                <span className="flex-1 truncate">{item.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#285C35] shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        <div className="space-y-1 pt-2 border-t border-[#DCE2D8]/60">
          <div className="px-3 pb-1.5 text-[10px] font-bold text-[#8A9286] uppercase tracking-[0.16em]">
            {language === 'bn' ? 'তথ্য ও সহায়তা' : 'INTELLIGENCE'}
          </div>
          {secondaryItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer text-left ${
                  isActive
                    ? 'bg-[#DDE8D8] text-[#193D25] font-semibold'
                    : 'text-[#697568] hover:bg-[#F2F5F0] hover:text-[#193D25]'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#193D25]' : 'text-[#8A9286]'}`} />
                <span className="flex-1 truncate">{item.label}</span>
              </button>
            );
          })}

          {/* Guided Setup trigger */}
          <button
            onClick={onOpenOnboarding}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-[#285C35] hover:bg-[#DDE8D8]/60 transition-all cursor-pointer text-left"
          >
            <Compass className="w-4 h-4 shrink-0 text-[#285C35]" />
            <span className="flex-1 truncate">{language === 'bn' ? 'নির্দেশিত প্রস্তুতি' : 'Guided Setup (5 Steps)'}</span>
          </button>
        </div>
      </nav>

      {/* Active Farm & Profile Footer */}
      <div className="p-3 border-t border-[#DCE2D8] bg-[#E9EFE6]/60">
        <div 
          onClick={() => onSelectTab('farm')}
          className="p-2.5 rounded-xl bg-white border border-[#DCE2D8] shadow-2xs hover:border-[#71966B] transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-[11px] text-[#8A9286] mb-0.5">
            <span className="truncate">{farm.location.region || 'Active Farm'}</span>
            <span className="font-semibold text-[#193D25]">{farm.size} {farm.unit}</span>
          </div>
          <div className="text-xs font-semibold text-[#193D25] truncate">
            {farm.name}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 px-1 text-xs">
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 text-[#697568] hover:text-[#193D25] transition-colors cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-[#8A9286]" />
            <span>{t.settings}</span>
          </button>

          <button
            onClick={onGoToLanding}
            className="flex items-center gap-1 text-[11px] text-[#8A9286] hover:text-[#193D25] transition-colors cursor-pointer"
            title="Overview Website"
          >
            <span>Overview</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </aside>
  );
};
