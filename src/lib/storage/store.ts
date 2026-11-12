import { 
  FarmProfile, 
  EnvironmentalSnapshot, 
  RotationPlan, 
  Scenario, 
  ChatMessage 
} from '@/src/types';
import { DEFAULT_DEMO_COORDINATES, getFallbackSnapshot } from '@/src/lib/environment/snapshot';
import { generateRotationPlan } from '@/src/lib/optimization/engine';
import { generateStandardScenarios } from '@/src/lib/optimization/evaluator';

export const INITIAL_DEMO_FARM: FarmProfile = {
  id: 'farm-green-valley',
  name: 'Green Valley Farm',
  location: DEFAULT_DEMO_COORDINATES,
  size: 25,
  unit: 'acres',
  soilType: 'Loamy',
  currentCropId: 'rice',
  previousCropId: 'wheat',
  waterAvailability: 'Medium',
  irrigationAvailability: true,
  priorities: ['Improve soil health', 'Save water'],
  planningPeriod: 3,
  createdAt: '2026-03-01T08:00:00Z',
  updatedAt: '2026-03-26T10:00:00Z'
};

const STORAGE_KEYS = {
  FARM: 'terracrop_farm_profile_v1',
  ENVIRONMENT: 'terracrop_env_snapshot_v1',
  ACTIVE_PLAN: 'terracrop_active_plan_v1',
  SCENARIOS: 'terracrop_scenarios_v1',
  CHAT: 'terracrop_chat_history_v1',
  IS_DEMO: 'terracrop_is_demo_v1'
};

export function loadFarmProfile(): FarmProfile {
  if (typeof window === 'undefined') return INITIAL_DEMO_FARM;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FARM);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse stored farm profile', e);
  }
  return INITIAL_DEMO_FARM;
}

export function saveFarmProfile(farm: FarmProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.FARM, JSON.stringify(farm));
  } catch (e) {
    console.error('Failed to save farm profile', e);
  }
}

export function loadEnvironmentSnapshot(): EnvironmentalSnapshot {
  if (typeof window === 'undefined') return getFallbackSnapshot();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ENVIRONMENT);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse stored environment snapshot', e);
  }
  return getFallbackSnapshot();
}

export function saveEnvironmentSnapshot(env: EnvironmentalSnapshot): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.ENVIRONMENT, JSON.stringify(env));
  } catch (e) {
    console.error('Failed to save environment snapshot', e);
  }
}

export function loadActivePlan(farm: FarmProfile, env: EnvironmentalSnapshot): RotationPlan {
  if (typeof window === 'undefined') {
    return generateRotationPlan(farm, env, 'AI Optimized');
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_PLAN);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse active plan', e);
  }
  const defaultPlan = generateRotationPlan(farm, env, 'AI Optimized');
  saveActivePlan(defaultPlan);
  return defaultPlan;
}

export function saveActivePlan(plan: RotationPlan): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PLAN, JSON.stringify(plan));
  } catch (e) {
    console.error('Failed to save active plan', e);
  }
}

export function loadScenarios(farm: FarmProfile, env: EnvironmentalSnapshot): Scenario[] {
  if (typeof window === 'undefined') {
    return generateStandardScenarios(farm, env);
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SCENARIOS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse scenarios', e);
  }
  const defaults = generateStandardScenarios(farm, env);
  saveScenarios(defaults);
  return defaults;
}

export function saveScenarios(scenarios: Scenario[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.SCENARIOS, JSON.stringify(scenarios));
  } catch (e) {
    console.error('Failed to save scenarios', e);
  }
}

export function loadChatHistory(): ChatMessage[] {
  const initialMessages: ChatMessage[] = [
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `Welcome to **TerraCrop AI**. I'm Terra, your agro-ecological intelligence assistant. 

I'm currently connected to your farm profile (**Green Valley Farm**, Loamy soil, 25 acres) and calibrated NASA Earth observation telemetry. 

You can ask me questions about crop sequencing, soil microbiome health, water conservation trade-offs, or why certain rotations were selected by the optimizer.`,
      timestamp: '2026-03-26T10:00:00Z',
      dataUsed: {
        rainfall: '64 mm/month (-14.2% anomaly)',
        temperature: '26.4°C',
        soilCondition: 'Loamy texture, 42% moisture, NDVI 0.58',
        currentCrop: 'rice',
        activePriorities: ['Improve soil health', 'Save water'],
        waterStatus: 'Medium availability (Drought Risk: Moderate)',
      }
    }
  ];

  if (typeof window === 'undefined') return initialMessages;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHAT);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse chat history', e);
  }
  return initialMessages;
}

export function saveChatHistory(history: ChatMessage[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(history));
  } catch (e) {
    console.error('Failed to save chat history', e);
  }
}

export function resetToDemoDefaults(): { farm: FarmProfile; env: EnvironmentalSnapshot; plan: RotationPlan; scenarios: Scenario[] } {
  const farm = { ...INITIAL_DEMO_FARM };
  const env = getFallbackSnapshot();
  const plan = generateRotationPlan(farm, env, 'AI Optimized');
  const scenarios = generateStandardScenarios(farm, env);
  
  if (typeof window !== 'undefined') {
    saveFarmProfile(farm);
    saveEnvironmentSnapshot(env);
    saveActivePlan(plan);
    saveScenarios(scenarios);
    localStorage.removeItem(STORAGE_KEYS.CHAT);
  }

  return { farm, env, plan, scenarios };
}
