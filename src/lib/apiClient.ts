import { 
  FarmProfile, 
  EnvironmentalSnapshot, 
  RotationPlan, 
  Scenario, 
  ChatMessage, 
  DataSourceInfo,
  Crop,
  FarmerPriority,
  WaterAvailability,
  PlanningPeriod
} from '@/src/types';
import { CROP_LIST } from '@/src/lib/crops/database';
import { DATA_SOURCES } from '@/src/lib/environment/dataSources';
import { getEnvironmentalSnapshot } from '@/src/lib/environment/snapshot';
import { generateRotationPlan } from '@/src/lib/optimization/engine';
import { generateStandardScenarios, simulateCustomScenario } from '@/src/lib/optimization/evaluator';
import { askTerraAssistant } from '@/src/lib/ai/service';

export const apiClient = {
  async getFarm(defaultFarm: FarmProfile): Promise<FarmProfile> {
    try {
      const res = await fetch('/api/farm');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch {
      // Fallback to local
    }
    return defaultFarm;
  },

  async saveFarm(farm: FarmProfile): Promise<FarmProfile> {
    try {
      const res = await fetch('/api/farm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(farm)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch {
      // Fallback
    }
    return farm;
  },

  async getEnvironment(lat: number, lon: number): Promise<EnvironmentalSnapshot> {
    try {
      const res = await fetch(`/api/environment?lat=${lat}&lon=${lon}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch {
      // Fallback
    }
    return getEnvironmentalSnapshot(lat, lon);
  },

  async getCrops(): Promise<Crop[]> {
    try {
      const res = await fetch('/api/crops');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch {
      // Fallback
    }
    return CROP_LIST;
  },

  async getDataSources(): Promise<DataSourceInfo[]> {
    try {
      const res = await fetch('/api/data-sources');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch {
      // Fallback
    }
    return DATA_SOURCES;
  },

  async calculateRotation(
    farm: FarmProfile,
    environment: EnvironmentalSnapshot,
    strategy: 'AI Optimized' | 'Current Plan' | 'Water Saver' | 'Soil Regenerator' | 'Custom' = 'AI Optimized',
    horizonYears?: PlanningPeriod
  ): Promise<RotationPlan> {
    try {
      const res = await fetch('/api/rotation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ farm, environment, strategy, horizonYears })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch {
      // Fallback
    }
    return generateRotationPlan(farm, environment, strategy, horizonYears || farm.planningPeriod);
  },

  async getScenarios(farm: FarmProfile, environment: EnvironmentalSnapshot): Promise<Scenario[]> {
    try {
      const res = await fetch('/api/scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ farm, environment })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch {
      // Fallback
    }
    return generateStandardScenarios(farm, environment);
  },

  async simulateScenario(
    farm: FarmProfile,
    environment: EnvironmentalSnapshot,
    rainfallChangePercent: number,
    temperatureChangeC: number,
    waterAvailability?: WaterAvailability,
    priority?: FarmerPriority
  ): Promise<Scenario> {
    try {
      const res = await fetch('/api/scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farm,
          environment,
          rainfallChangePercent,
          temperatureChangeC,
          waterAvailability,
          priority
        })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch {
      // Fallback
    }
    return simulateCustomScenario({
      farmProfile: farm,
      baseEnvironment: environment,
      rainfallChangePercent,
      temperatureChangeC,
      waterAvailabilityOverride: waterAvailability,
      primaryPriorityOverride: priority
    });
  },

  async sendChatMessage(
    message: string,
    history: ChatMessage[],
    farm: FarmProfile,
    environment: EnvironmentalSnapshot,
    plan?: RotationPlan
  ): Promise<{ message: string; source: string; dataUsed?: ChatMessage['dataUsed'] }> {
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history, farm, environment, plan })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch {
      // Fallback
    }
    return askTerraAssistant(message, history, farm, environment, plan);
  }
};
