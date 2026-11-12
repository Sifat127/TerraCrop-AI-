export type WeatherType = 'sunny' | 'rain' | 'storm' | 'cloudy' | 'hot' | 'dry';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export interface GameCrop {
  id: string;
  name: string;
  nameBn?: string;
  category: string;
  waterDemand: 'LOW' | 'MEDIUM' | 'HIGH';
  droughtTolerance: 'LOW' | 'MEDIUM' | 'HIGH';
  heatTolerance: 'LOW' | 'MEDIUM' | 'HIGH';
  soilCompatibility: 'LOW' | 'MEDIUM' | 'HIGH';
  soilBenefit: 'LOW' | 'MEDIUM' | 'HIGH';
  nitrogenFixing: boolean;
  growthDays: number;
  seasonSuitability: ('Summer' | 'Monsoon' | 'Winter' | 'Spring')[];
  baseYieldKg: number;
  marketPricePerKg: number;
  seedCost: number;
  description: string;
  agronomicTip: string;
}

export interface GameWeatherScenario {
  id: string;
  name: string;
  nameBn?: string;
  season: 'Summer' | 'Monsoon' | 'Winter' | 'Spring';
  temperatureC: number;
  rainfallMm: number;
  soilMoisturePercent: number;
  waterAvailability: 'Abundant' | 'Moderate' | 'Limited' | 'Severe Drought';
  description: string;
  nasaContext: string;
  defaultPriority: string;
}

export interface GameQuest {
  id: string;
  title: string;
  titleBn?: string;
  description: string;
  rewardKnowledge: number;
  rewardCoins: number;
  completed: boolean;
  targetObject?: string;
}

export interface NPCCharacter {
  id: string;
  name: string;
  role: string;
  avatarColor: string;
  dialogue: string[];
  dialogueBn?: string[];
  tip?: string;
}

export interface KnowledgeCard {
  id: string;
  category: 'WEATHER' | 'WATER' | 'SOIL' | 'CROPS' | 'NASA' | 'SUSTAINABILITY';
  title: string;
  summary: string;
  details: string;
  icon: string;
  unlocked: boolean;
}

export interface HarvestResult {
  cropId: string;
  cropName: string;
  suitabilityScore: number;
  yieldPercent: number;
  yieldKg: number;
  waterUsedPercent: number;
  soilImpactScore: number;
  climateRiskLevel: 'Low' | 'Medium' | 'High';
  sustainabilityScore: number;
  coinsEarned: number;
  knowledgeGained: number;
  factors: {
    waterCompatibility: number;
    temperatureCompatibility: number;
    soilCompatibility: number;
    seasonCompatibility: number;
    priorityAlignment: number;
  };
  whatHappened: string;
  whatCanYouLearn: string;
  scenario: GameWeatherScenario;
}

export interface PlayerStats {
  name: string;
  energy: number;
  maxEnergy: number;
  water: number;
  maxWater: number;
  coins: number;
  knowledge: number;
  level: number;
  title: string;
  inventory: {
    seeds: Record<string, number>;
    tools: string[];
    waterBuckets: number;
  };
}

export interface FarmPlotState {
  id: number;
  x: number;
  y: number;
  prepared: boolean;
  plantedCropId: string | null;
  growthStage: number; // 0: empty, 1: seed, 2: sprout, 3: growing, 4: mature
  watered: boolean;
  harvestReady: boolean;
}
