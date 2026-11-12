import React, { useState } from 'react';
import { 
  ArrowRight, 
  Play, 
  ChevronDown,
  Languages,
  Check,
  Compass,
  Sprout,
  Droplets,
  Sun,
  ShieldCheck,
  Globe2,
  CalendarRange,
  FlaskConical,
  Database,
  Gamepad2
} from 'lucide-react';
import { DemoModal } from './DemoModal';
import { BrandLogo } from '../common/BrandLogo';
import { useI18n } from '@/src/lib/i18n/context';
import { useAuth } from '@/src/lib/supabase/AuthContext';

interface LandingPageProps {
  onAnalyzeFarm: () => void;
  onExploreDemo: () => void;
  onOpenGame?: () => void;
  onOpenAuth?: () => void;
  onOpenProfile?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onAnalyzeFarm,
  onExploreDemo,
  onOpenGame,
  onOpenAuth,
  onOpenProfile
}) => {
  const { language, setLanguage } = useI18n();
  const { user, profile } = useAuth();
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const heroLandscapeImg = '/src/assets/images/terracrop_landscape_1790451681529.jpg';

  return (
    <div className="min-h-screen bg-[#F8F7F0] text-[#243428] font-sans antialiased selection:bg-[#DDE8D8] selection:text-[#193D25]">
      <DemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onLaunchDemoApp={onExploreDemo}
      />

      {/* Slim Top Navigation Bar — Adaline Style with Mobile-First Adaptability */}
      <header className="sticky top-0 z-40 bg-[#F8F7F0]/95 backdrop-blur-md border-b border-[#DCE2D8]/80 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2">
          {/* Mobile: Brand Logo on Left | Desktop: Centered */}
          <div className="flex items-center md:hidden shrink-0">
            <BrandLogo size="sm" />
          </div>

          {/* Desktop Left Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-7 text-[12px] font-medium uppercase tracking-[0.14em] text-[#697568]">
            <div className="relative group">
              <button 
                onClick={() => setActiveDropdown(activeDropdown === 'products' ? null : 'products')}
                className="flex items-center gap-1.5 hover:text-[#193D25] transition-colors cursor-pointer py-2"
                aria-expanded={activeDropdown === 'products'}
              >
                <span>{language === 'bn' ? 'মডেল ও ডেটা' : 'PRODUCTS'}</span>
                <ChevronDown className="w-3 h-3 text-[#8A9286] group-hover:text-[#193D25] transition-transform group-hover:rotate-180" />
              </button>

              {activeDropdown === 'products' && (
                <div className="absolute top-full left-0 mt-1 w-64 p-3 bg-white rounded-2xl shadow-xl border border-[#DCE2D8] text-xs space-y-1.5 animate-in fade-in z-50">
                  <button 
                    onClick={() => { setActiveDropdown(null); onExploreDemo(); }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-[#F1F4EF] text-[#243428] font-medium transition-colors"
                  >
                    <div className="font-semibold text-[#193D25]">Crop Rotation Planner</div>
                    <div className="text-[11px] text-[#697568] mt-0.5">Multi-year biological solver</div>
                  </button>
                  <button 
                    onClick={() => { setActiveDropdown(null); onExploreDemo(); }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-[#F1F4EF] text-[#243428] font-medium transition-colors"
                  >
                    <div className="font-semibold text-[#193D25]">NASA Telemetry Grid</div>
                    <div className="text-[11px] text-[#697568] mt-0.5">SMAP, MODIS & POWER feeds</div>
                  </button>
                  <button 
                    onClick={() => { setActiveDropdown(null); onExploreDemo(); }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-[#F1F4EF] text-[#243428] font-medium transition-colors"
                  >
                    <div className="font-semibold text-[#193D25]">Scenario Lab</div>
                    <div className="text-[11px] text-[#697568] mt-0.5">Microclimate stress simulator</div>
                  </button>
                </div>
              )}
            </div>

            <a href="#how-it-works" className="hover:text-[#193D25] transition-colors py-2">
              {language === 'bn' ? 'পদ্ধতি' : 'METHODOLOGY'}
            </a>
            <a href="#nasa-data" className="hover:text-[#193D25] transition-colors py-2">
              {language === 'bn' ? 'নাসা ডেটা' : 'EARTH DATA'}
            </a>
          </nav>

          {/* Desktop Center Brand Logo */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
            <BrandLogo size="md" />
          </div>

          {/* Right Action Items — Responsive Spacing and Sizing */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Language toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
              className="min-h-[40px] flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border border-[#DCE2D8] bg-white hover:bg-[#F2F1E8] text-[10px] sm:text-[11px] font-semibold tracking-wider text-[#243428] transition-colors cursor-pointer"
              title="Change Language"
              aria-label="Change Language"
            >
              <Languages className="w-3.5 h-3.5 text-[#71966B]" />
              <span>{language === 'en' ? 'বাংলা' : 'EN'}</span>
            </button>

            {/* Watch Demo button (Desktop & Tablet) */}
            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="hidden sm:inline-flex min-h-[40px] items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full border border-[#DCE2D8] bg-white hover:bg-[#F2F1E8] text-[11px] font-semibold uppercase tracking-[0.12em] text-[#243428] shadow-2xs transition-all cursor-pointer"
            >
              <span>{language === 'bn' ? 'ডেমো দেখুন' : 'WATCH DEMO'}</span>
              <div className="w-4 h-4 rounded-full bg-[#243428] text-white flex items-center justify-center">
                <Play className="w-2 h-2 ml-0.5 fill-current" />
              </div>
            </button>

            {/* Farm Game button positioned on the right beside Watch Demo */}
            {onOpenGame && (
              <button
                onClick={onOpenGame}
                className="inline-flex min-h-[40px] items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-[#1B5E20] hover:bg-[#285C35] text-white border border-[#81C784] shadow-2xs hover:shadow-md transition-all font-semibold text-[10px] sm:text-[11px] uppercase tracking-[0.08em] sm:tracking-[0.1em] cursor-pointer hover:scale-[1.02]"
                title="Play 2D Interactive Farm Game"
              >
                <Gamepad2 className="w-3.5 h-3.5 text-[#A5D6A7]" />
                <span>{language === 'bn' ? 'ফার্ম গেম' : 'FARM GAME'}</span>
              </button>
            )}

            {/* Sign In / Signed-In Farmer Account Button */}
            {user ? (
              <button
                type="button"
                onClick={onOpenProfile || onExploreDemo}
                className="min-h-[40px] inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#DDE8D8] hover:bg-[#cfe0c8] text-[#193D25] border border-[#71966B]/40 font-semibold text-[10px] sm:text-[11px] tracking-wide shadow-2xs transition-colors cursor-pointer whitespace-nowrap"
                title="Open Farmer Account"
              >
                <span className="w-5 h-5 rounded-full bg-[#193D25] text-white flex items-center justify-center text-[10px] font-bold">
                  {profile?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'F'}
                </span>
                <span className="max-w-[96px] truncate">
                  {profile?.full_name || 'My Farm'}
                </span>
              </button>
            ) : (
              onOpenAuth && (
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="min-h-[40px] inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#193D25] hover:bg-[#285C35] text-white font-semibold text-[10px] sm:text-[11px] uppercase tracking-[0.08em] shadow-2xs transition-colors cursor-pointer whitespace-nowrap"
                  title="Sign In or Create Account"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#A5D6A7]" />
                  <span>{language === 'bn' ? 'সাইন ইন' : 'Sign In'}</span>
                </button>
              )
            )}
          </div>
        </div>
      </header>

      {/* Hero Section — Immersive Cinematic Pastoral Atmosphere with Slow Background Animation */}
      <section className="relative min-h-[680px] sm:min-h-[740px] lg:min-h-[820px] flex flex-col justify-between overflow-hidden text-center">
        {/* Background Landscape Image with Slow Ambient Ken-Burns Animation */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={heroLandscapeImg}
            alt="Serene agricultural landscape with gentle green hills, tranquil river, and soft morning light"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center animate-hero-immersive"
          />

          {/* Top Atmospheric Vignette blending with Header */}
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#F8F7F0] via-[#F8F7F0]/65 to-transparent" />

          {/* Radial Atmospheric Scrim for crisp typographic legibility */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 80% 70% at 50% 45%, rgba(248, 247, 240, 0.88) 0%, rgba(248, 247, 240, 0.72) 48%, rgba(248, 247, 240, 0.38) 78%, rgba(24, 30, 25, 0.32) 100%)'
            }}
          />

          {/* Bottom Atmosphere Feathering into Footer Strip */}
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#181E19] via-[#181E19]/70 to-transparent" />
        </div>

        {/* Hero Foreground Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-6 pt-12 sm:pt-20 lg:pt-24 pb-6 flex flex-col items-center space-y-5 sm:space-y-6 animate-hero-content">
          {/* Subtle Technology Badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#DCE2D8] text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] text-[#193D25] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#36764A] animate-pulse shrink-0" />
            <span className="truncate">NASA Open Science & Agronomic Intelligence</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-[68px] font-medium tracking-[-0.03em] leading-[1.14] sm:leading-[1.08] text-[#193D25] drop-shadow-2xs break-words px-2 max-w-full">
            {language === 'bn' ? (
              <>আপনার খামার বুঝুন। <br className="hidden xs:inline" />আগামীর পরিকল্পনা করুন।</>
            ) : (
              <>Understand Your Farm. <br className="hidden xs:inline" />Plan What Comes Next.</>
            )}
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-[#243428] max-w-xl mx-auto font-normal leading-relaxed px-3">
            {language === 'bn'
              ? 'নাসার আর্থ অবজারভেশন উপগ্রহ তথ্য, আবহাওয়া এবং এআই প্রযুক্তিকে রূপান্তর করুন আপনার খামারের সহজ সিদ্ধান্তে।'
              : 'Turn NASA Earth observations, climate information, and AI into simple insights for your farm.'}
          </p>

          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center justify-center gap-3 pt-1 px-4">
            <button
              onClick={onAnalyzeFarm}
              className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-3 rounded-full bg-[#193D25] hover:bg-[#285C35] text-white text-sm font-semibold tracking-wide transition-all shadow-md hover:shadow-xl hover:scale-[1.02] cursor-pointer group"
            >
              <span>{language === 'bn' ? 'আমার খামার অনুসন্ধান করুন' : 'Explore My Farm'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 rounded-full bg-white/95 hover:bg-white text-[#193D25] border border-[#DCE2D8] text-sm font-semibold tracking-wide shadow-sm hover:shadow-md backdrop-blur-md transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-[#193D25] fill-current" />
              <span>{language === 'bn' ? 'কীভাবে কাজ করে দেখুন' : 'See How It Works'}</span>
            </button>
          </div>

          {/* Understated Credibility Strip */}
          <div className="pt-4 sm:pt-6 pb-2 w-full max-w-full px-2">
            <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] text-[#193D25]/80 mb-2.5">
              POWERED BY & INTEGRATED WITH
            </div>
            <div className="inline-flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-1.5 py-2 px-4 sm:px-6 rounded-2xl sm:rounded-full bg-white/80 backdrop-blur-md border border-[#DCE2D8]/80 text-[11px] sm:text-xs font-semibold tracking-wider text-[#243428] shadow-2xs max-w-full">
              <span className="flex items-center gap-1.5 hover:text-[#193D25] transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-[#71966B] shrink-0" />
                NASA POWER
              </span>
              <span className="flex items-center gap-1.5 hover:text-[#193D25] transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-[#71966B] shrink-0" />
                NASA SMAP
              </span>
              <span className="flex items-center gap-1.5 hover:text-[#193D25] transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-[#71966B] shrink-0" />
                MODIS TERRA
              </span>
              <span className="flex items-center gap-1.5 hover:text-[#193D25] transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-[#71966B] shrink-0" />
                ISRIC SOILGRIDS
              </span>
              <span className="flex items-center gap-1.5 hover:text-[#193D25] transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-[#71966B] shrink-0" />
                GPM IMERG
              </span>
            </div>
          </div>

          {/* Floating Telemetry Badge positioned over the pastoral landscape */}
          <div className="mt-3 p-3.5 sm:p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#DCE2D8] shadow-lg text-left max-w-md w-full">
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-semibold text-[#8A9286] uppercase tracking-wider mb-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#36764A] animate-pulse shrink-0" />
                Live Earth Observation Overpass
              </span>
              <span className="font-mono text-[#193D25]">250m Resolution</span>
            </div>
            <div className="text-xs sm:text-sm font-semibold text-[#193D25]">
              {language === 'bn' 
                ? 'গ্রিন ভ্যালি কৃষি অঞ্চল · স্বাভাবিক আর্দ্রতা' 
                : 'Central Basin Agro-Grid · Soil Moisture 34% Vol'}
            </div>
            <p className="text-[11px] sm:text-xs text-[#697568] mt-0.5 leading-relaxed">
              {language === 'bn'
                ? 'পরবর্তী মৌসুমে নাইট্রোজেন বৃদ্ধিকারী ডালজাতীয় ফসল প্রস্তাবিত।'
                : 'Fallow nitrogen recovery cycle ready. Legume succession optimal.'}
            </p>
          </div>
        </div>

        {/* Dark Understated Bottom Information Strip (Adaline Footer Bar Style) */}
        <div className="relative z-10 bg-[#181E19] text-white py-3.5 sm:py-4 px-4 sm:px-6 border-t border-white/10">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 text-xs text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3">
              <BrandLogo variant="monochrome-white" size="sm" />
              <span className="text-white/40 hidden sm:inline">|</span>
              <span className="text-white/70 text-[11px]">
                {language === 'bn' ? 'আবহাওয়া সচেতন কৃষি সিদ্ধান্ত প্ল্যাটফর্ম' : 'Deterministic Agro-Ecological Decision Support'}
              </span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 text-white/60 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#71966B]" />
                {language === 'bn' ? 'ডেমো মোড প্রস্তুত' : 'Zero-Key Demo Active'}
              </span>
              <span>·</span>
              <button 
                onClick={onExploreDemo}
                className="text-white hover:text-white/90 underline underline-offset-2 cursor-pointer min-h-[36px] flex items-center"
              >
                {language === 'bn' ? 'অ্যাপে প্রবেশ করুন' : 'Launch Workspace'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white border-b border-[#DCE2D8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="max-w-xl mb-16 space-y-2">
            <span className="text-[11px] font-bold text-[#71966B] uppercase tracking-[0.2em]">
              {language === 'bn' ? 'পদ্ধতি' : 'METHODOLOGY'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-[#193D25]">
              {language === 'bn' ? 'সহজ ৩ ধাপে সিদ্ধান্ত গ্রহণ' : 'Simple, transparent decision support'}
            </h2>
            <p className="text-sm text-[#697568]">
              {language === 'bn'
                ? 'কোনো জটিল অনুমান নয়। বাস্তব উপগ্রহ ডেটা ও বৈজ্ঞানিক নিয়মে পরবর্তী ফসলের দিকনির্দেশনা।'
                : 'No blind AI guesses. Real satellite physics combined with biological crop succession matrices.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-7 rounded-2xl bg-[#F8F7F0] border border-[#DCE2D8] space-y-4">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#DCE2D8] flex items-center justify-center text-[#193D25] font-serif font-bold text-base">
                01
              </div>
              <h3 className="text-lg font-semibold text-[#193D25]">
                {language === 'bn' ? 'আপনার খামার চিহ্নিত করুন' : 'Tell Us About Your Farm'}
              </h3>
              <p className="text-xs sm:text-sm text-[#697568] leading-relaxed">
                {language === 'bn'
                  ? 'আপনার অবস্থান, জমির পরিমাণ, মাটির ধরন এবং বর্তমান ফসল ৫টি সহজ প্রশ্নের মাধ্যমে নির্বাচন করুন।'
                  : 'Enter your region, acreage, soil texture, and standing crop in five plain-language steps.'}
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-[#F8F7F0] border border-[#DCE2D8] space-y-4">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#DCE2D8] flex items-center justify-center text-[#193D25] font-serif font-bold text-base">
                02
              </div>
              <h3 className="text-lg font-semibold text-[#193D25]">
                {language === 'bn' ? 'উপগ্রহ তথ্য পর্যালোচনা' : 'See What Is Happening'}
              </h3>
              <p className="text-xs sm:text-sm text-[#697568] leading-relaxed">
                {language === 'bn'
                  ? 'নাসার স্যাটেলাইট পর্যবেক্ষণ থেকে মাটির আর্দ্রতা, বৃষ্টির বিচ্যুতি এবং উদ্ভিদের সবুজ সতেজতা পর্যবেক্ষণ করুন।'
                  : 'Inspect calibrated NASA POWER temperature, SMAP topsoil hydration, and MODIS vegetation health.'}
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-[#F8F7F0] border border-[#DCE2D8] space-y-4">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#DCE2D8] flex items-center justify-center text-[#193D25] font-serif font-bold text-base">
                03
              </div>
              <h3 className="text-lg font-semibold text-[#193D25]">
                {language === 'bn' ? 'ফসল পরিকল্পনা ও তুলনা' : 'Explore Your Crop Plan'}
              </h3>
              <p className="text-xs sm:text-sm text-[#697568] leading-relaxed">
                {language === 'bn'
                  ? 'মাটির উর্বরতা বৃদ্ধি ও জল বাঁচিয়ে বহু-বছরের ফসল চক্র দেখুন এবং ভিন্ন পরিস্থিতিতে কী ঘটবে তা তুলনা করুন।'
                  : 'Receive deterministic multi-year rotations that replenish nitrogen, cut water demand, and break soil disease.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Earth Observation Data Section */}
      <section id="nasa-data" className="py-24 bg-[#F1F4EF] border-b border-[#DCE2D8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
            <div className="max-w-xl space-y-2">
              <span className="text-[11px] font-bold text-[#71966B] uppercase tracking-[0.2em]">
                SATELLITE CALIBRATION
              </span>
              <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-[#193D25]">
                Direct Earth observation telemetry
              </h2>
              <p className="text-sm text-[#697568]">
                Sensors calibrated to track regional hydrology, temperature anomalies, and photosynthetic vitality.
              </p>
            </div>

            <button
              onClick={onExploreDemo}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#DCE2D8] bg-white hover:bg-[#F2F1E8] text-xs font-semibold uppercase tracking-wider text-[#193D25] self-start transition-all cursor-pointer shadow-2xs"
            >
              <span>Explore Interactive Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 rounded-2xl bg-white border border-[#DCE2D8] space-y-2">
              <div className="text-[11px] font-semibold text-[#8A9286] uppercase tracking-wider">NASA POWER</div>
              <div className="text-xl font-medium text-[#193D25]">Climatology & Radiation</div>
              <p className="text-xs text-[#697568] mt-1 leading-relaxed">
                10-year historical baselines for surface solar radiation, heating degree days, and rainfall anomalies.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#DCE2D8] space-y-2">
              <div className="text-[11px] font-semibold text-[#8A9286] uppercase tracking-wider">NASA SMAP</div>
              <div className="text-xl font-medium text-[#193D25]">L-Band Soil Hydration</div>
              <p className="text-xs text-[#697568] mt-1 leading-relaxed">
                Radiometer topsoil moisture percentage measurements to determine drought risk and irrigation conservation.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#DCE2D8] space-y-2">
              <div className="text-[11px] font-semibold text-[#8A9286] uppercase tracking-wider">MODIS TERRA</div>
              <div className="text-xl font-medium text-[#193D25]">Vegetation Canopy (NDVI)</div>
              <p className="text-xs text-[#697568] mt-1 leading-relaxed">
                250-meter resolution normalized difference vegetation index capturing crop vigor and cover dynamics.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#DCE2D8] space-y-2">
              <div className="text-[11px] font-semibold text-[#8A9286] uppercase tracking-wider">ISRIC SOILGRIDS</div>
              <div className="text-xl font-medium text-[#193D25]">Soil Texture & pH</div>
              <p className="text-xs text-[#697568] mt-1 leading-relaxed">
                Global pedological mapping calibrating clay, silt, sand ratios and biological nutrient retention.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-24 bg-[#F8F7F0] text-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-8 space-y-6">
          <BrandLogo size="lg" className="justify-center mb-4" />
          <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-[#193D25]">
            {language === 'bn' ? 'আজই আপনার খামার দিয়ে শুরু করুন' : 'Start planning your next season'}
          </h2>
          <p className="text-sm sm:text-base text-[#697568]">
            {language === 'bn'
              ? 'বিনা খরচে জিরো-কি ডেমো মোডে সব ফিচার পরীক্ষা করুন।'
              : 'Zero API keys required to explore. Complete deterministic agro-intelligence at your fingertips.'}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onAnalyzeFarm}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#193D25] hover:bg-[#285C35] text-white text-sm font-semibold tracking-wide transition-all shadow-md cursor-pointer"
            >
              <span>{language === 'bn' ? 'আমার খামার দিয়ে শুরু করুন' : 'Get Started with My Farm'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onExploreDemo}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white hover:bg-[#F2F1E8] text-[#243428] border border-[#DCE2D8] text-sm font-semibold tracking-wide shadow-2xs transition-all cursor-pointer"
            >
              <span>{language === 'bn' ? 'ডেমো পরীক্ষা করুন' : 'Open Demo Workspace'}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
