import React, { useState, useEffect } from 'react';
import { 
  FarmProfile, 
  EnvironmentalSnapshot, 
  RotationPlan, 
  Scenario, 
  ChatMessage, 
  DataSourceInfo 
} from './types';
import { 
  loadFarmProfile, 
  saveFarmProfile, 
  loadEnvironmentSnapshot, 
  saveEnvironmentSnapshot, 
  loadActivePlan, 
  saveActivePlan, 
  loadScenarios, 
  saveScenarios, 
  loadChatHistory, 
  saveChatHistory, 
  resetToDemoDefaults,
  INITIAL_DEMO_FARM
} from './lib/storage/store';
import { apiClient } from './lib/apiClient';
import { generateRotationPlan } from './lib/optimization/engine';
import { generateStandardScenarios } from './lib/optimization/evaluator';
import { DATA_SOURCES } from './lib/environment/dataSources';

import { I18nProvider } from './lib/i18n/context';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { DemoBanner } from './components/common/DemoBanner';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardView } from './components/dashboard/DashboardView';
import { FarmProfileView } from './components/farm/FarmProfileView';
import { CropPlannerView } from './components/planner/CropPlannerView';
import { ScenarioLabView } from './components/scenario/ScenarioLabView';
import { ClimateMapView } from './components/map/ClimateMapView';
import { AskTerraView } from './components/assistant/AskTerraView';
import { DataSourcesView } from './components/sources/DataSourcesView';
import { SettingsModal } from './components/settings/SettingsModal';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { TerraFarmGame } from './components/game/TerraFarmGame';
import { AuthModal } from './components/auth/AuthModal';
import { UserProfileModal } from './components/auth/UserProfileModal';

type AppView = 'landing' | 'game' | NavTab;

function AppContent() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [farm, setFarm] = useState<FarmProfile>(loadFarmProfile);
  const [environment, setEnvironment] = useState<EnvironmentalSnapshot>(loadEnvironmentSnapshot);
  const [plan, setPlan] = useState<RotationPlan>(() => loadActivePlan(farm, environment));
  const [scenarios, setScenarios] = useState<Scenario[]>(() => loadScenarios(farm, environment));
  const [messages, setMessages] = useState<ChatMessage[]>(loadChatHistory);
  const [dataSources] = useState<DataSourceInfo[]>(DATA_SOURCES);

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [generationStepMessage, setGenerationStepMessage] = useState('');

  // Save changes to persistent storage
  useEffect(() => {
    saveFarmProfile(farm);
  }, [farm]);

  useEffect(() => {
    saveEnvironmentSnapshot(environment);
  }, [environment]);

  useEffect(() => {
    saveActivePlan(plan);
  }, [plan]);

  useEffect(() => {
    saveScenarios(scenarios);
  }, [scenarios]);

  useEffect(() => {
    saveChatHistory(messages);
  }, [messages]);

  // Handler: Generate / Recalculate AI Plan with progressive simulation feedback
  const handleGeneratePlan = async (strategy: 'AI Optimized' | 'Water Saver' | 'Current Plan' = 'AI Optimized') => {
    setIsGeneratingPlan(true);
    const steps = [
      'Querying NASA POWER and SMAP satellite telemetry...',
      'Analyzing soil texture, moisture, and root zone constraints...',
      'Evaluating biological crop succession matrices...',
      'Optimizing multi-attribute utility weights...',
      'Finalizing climate-adaptive rotation plan...'
    ];

    steps.forEach((msg, idx) => {
      setTimeout(() => {
        setGenerationStepMessage(msg);
      }, (idx + 1) * 260);
    });

    setTimeout(async () => {
      try {
        const newPlan = await apiClient.calculateRotation(farm, environment, strategy);
        const newScenarios = await apiClient.getScenarios(farm, environment);
        setPlan(newPlan);
        setScenarios(newScenarios);
      } catch (err) {
        console.error('Plan calculation error:', err);
      } finally {
        setIsGeneratingPlan(false);
        setGenerationStepMessage('');
      }
    }, 1400);
  };

  // Handler: Save Farm Profile & Re-analyze
  const handleSaveFarmProfile = async (updatedFarm: FarmProfile) => {
    setFarm(updatedFarm);
    setIsGeneratingPlan(true);
    setGenerationStepMessage('Synchronizing new farm parameters with Earth observation grid...');

    try {
      const newEnv = await apiClient.getEnvironment(
        updatedFarm.location.latitude,
        updatedFarm.location.longitude
      );
      setEnvironment(newEnv);

      const newPlan = await apiClient.calculateRotation(updatedFarm, newEnv, 'AI Optimized');
      const newScenarios = await apiClient.getScenarios(updatedFarm, newEnv);
      setPlan(newPlan);
      setScenarios(newScenarios);

      setCurrentView('dashboard');
    } catch (err) {
      console.error('Failed to analyze updated farm:', err);
      setCurrentView('dashboard');
    } finally {
      setIsGeneratingPlan(false);
      setGenerationStepMessage('');
    }
  };

  // Handler: Seamless Bridge from 2D Farm Game to Real TerraCrop AI
  const handleTransferFromGame = async (params: {
    cropId: string;
    scenario: any;
    suitabilityScore: number;
  }) => {
    const updatedFarm: FarmProfile = {
      ...farm,
      currentCropId: params.cropId
    };
    setFarm(updatedFarm);
    setCurrentView('planner');
    handleGeneratePlan('AI Optimized');
  };

  // Handler: Apply Scenario as Active Plan
  const handleApplyScenario = (scenario: Scenario) => {
    setPlan(scenario.plan);
    setCurrentView('planner');
  };

  // Handler: Reset to Demo Defaults
  const handleResetToDemo = () => {
    const defaults = resetToDemoDefaults();
    setFarm(defaults.farm);
    setEnvironment(defaults.env);
    setPlan(defaults.plan);
    setScenarios(defaults.scenarios);
    setMessages(loadChatHistory());
  };

  // Handler: Toggle measurement units
  const handleToggleUnit = () => {
    setFarm(prev => ({
      ...prev,
      unit: prev.unit === 'acres' ? 'hectares' : 'acres'
    }));
  };

  // Baseline plan for current practice comparison
  const baselinePlan = scenarios.find(s => s.id === 'scenario-current')?.plan || generateRotationPlan(farm, environment, 'Current Plan');

  // If viewing Landing Page
  if (currentView === 'landing') {
    return (
      <>
        <LandingPage
          onAnalyzeFarm={() => {
            setIsOnboardingOpen(true);
          }}
          onExploreDemo={() => setCurrentView('dashboard')}
          onOpenGame={() => setCurrentView('game')}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onOpenProfile={() => setIsProfileModalOpen(true)}
        />

        <OnboardingModal
          isOpen={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
          onComplete={(newProfile) => {
            setIsOnboardingOpen(false);
            handleSaveFarmProfile(newProfile);
          }}
          initialFarm={farm}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={() => {
            setIsAuthModalOpen(false);
            setCurrentView('dashboard');
          }}
        />

        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
      </>
    );
  }

  // If viewing Fullscreen Game Mode
  if (currentView === 'game') {
    return (
      <div className="fixed inset-0 z-50 bg-[#070D18]">
        <TerraFarmGame
          onReturnToApp={() => setCurrentView('dashboard')}
          onTransferToRealApp={handleTransferFromGame}
        />
      </div>
    );
  }

  const currentTab = currentView as NavTab;

  return (
    <div className="min-h-screen bg-[#F7FAF7] text-slate-900 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Demo & Provenance Status Banner */}
      <DemoBanner
        isDemo={environment.isDemo}
        onResetDemo={handleResetToDemo}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Layout Area: Persistent Sidebar + Canvas */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentView(tab)}
          farm={farm}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenOnboarding={() => setIsOnboardingOpen(true)}
          onGoToLanding={() => setCurrentView('landing')}
        />

        {/* Content Canvas */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto pb-20 lg:pb-8">
          <Header
            currentTab={currentTab}
            farm={farm}
            onOpenMobileMenu={() => setIsMobileDrawerOpen(true)}
            onGeneratePlanClick={() => handleGeneratePlan('AI Optimized')}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            isGeneratingPlan={isGeneratingPlan}
          />

          {/* Active Generation Progress Indicator */}
          {isGeneratingPlan && (
            <div className="bg-[#0B1220] text-white px-4 py-2.5 text-xs flex items-center justify-between border-b border-emerald-500/30 animate-in fade-in">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-mono text-emerald-400 font-semibold">{generationStepMessage}</span>
              </div>
              <span className="text-white/60 font-mono text-[11px] hidden sm:inline">
                TerraCrop Solver Active
              </span>
            </div>
          )}

          {/* Main View Router */}
          <main className="flex-1">
            {currentTab === 'dashboard' && (
              <DashboardView
                farm={farm}
                environment={environment}
                plan={plan}
                onNavigate={(tab) => setCurrentView(tab)}
                onOpenOnboarding={() => setIsOnboardingOpen(true)}
              />
            )}

            {currentTab === 'farm' && (
              <FarmProfileView
                initialProfile={farm}
                onSaveAndAnalyze={handleSaveFarmProfile}
                onOpenOnboarding={() => setIsOnboardingOpen(true)}
                isLoading={isGeneratingPlan}
              />
            )}

            {currentTab === 'planner' && (
              <CropPlannerView
                farm={farm}
                environment={environment}
                plan={plan}
                baselinePlan={baselinePlan}
                onSelectStrategy={handleGeneratePlan}
                onNavigate={(tab) => setCurrentView(tab)}
              />
            )}

            {currentTab === 'scenarios' && (
              <ScenarioLabView
                farm={farm}
                environment={environment}
                scenarios={scenarios}
                onApplyScenarioAsActivePlan={handleApplyScenario}
              />
            )}

            {currentTab === 'climate' && (
              <ClimateMapView
                farm={farm}
                environment={environment}
              />
            )}

            {currentTab === 'assistant' && (
              <AskTerraView
                farm={farm}
                environment={environment}
                plan={plan}
                messages={messages}
                onSendMessage={(msg) => setMessages(prev => [...prev, msg])}
                onClearChat={() => setMessages(loadChatHistory())}
              />
            )}

            {currentTab === 'sources' && (
              <DataSourcesView
                sources={dataSources}
              />
            )}

            {currentTab === 'game' && (
              <div className="h-[calc(100vh-112px)] w-full relative">
                <TerraFarmGame
                  onReturnToApp={() => setCurrentView('dashboard')}
                  onTransferToRealApp={handleTransferFromGame}
                />
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar & Slide-Over Drawer */}
      <MobileNav
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentView(tab)}
        isDrawerOpen={isMobileDrawerOpen}
        onCloseDrawer={() => setIsMobileDrawerOpen(false)}
        farm={farm}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onGoToLanding={() => setCurrentView('landing')}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* 5-Step Guided Setup Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={(newProfile) => {
          setIsOnboardingOpen(false);
          handleSaveFarmProfile(newProfile);
        }}
        initialFarm={farm}
      />

      {/* Application Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        farm={farm}
        onResetToDemo={handleResetToDemo}
        onToggleUnit={handleToggleUnit}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
      />

      {/* Cloudflare Turnstile Protected Supabase Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setIsAuthModalOpen(false);
        }}
      />

      {/* Farmer Profile & Cloud Sync Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}
