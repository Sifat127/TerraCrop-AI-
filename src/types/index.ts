export type SoilType = 'Loamy' | 'Sandy' | 'Clay' | 'Silty' | 'Mixed' | 'Unknown';

export type WaterAvailability = 'Low' | 'Medium' | 'High';

export type PlanningPeriod = 1 | 3 | 5;

export type FarmerPriority = 
  | 'Improve soil health'
  | 'Save water'
  | 'Reduce climate risk'
  | 'Maximize yield'
  | 'Increase crop diversity';

export interface FarmLocation {
  latitude: number;
  longitude: number;
  address: string;
  region: string;
  country: string;
}

export interface FarmProfile {
  id: string;
  name: string;
  location: FarmLocation;
  size: number;
  unit: 'acres' | 'hectares';
  soilType: SoilType;
  currentCropId: string;
  previousCropId?: string;
  waterAvailability: WaterAvailability;
  irrigationAvailability: boolean;
  priorities: FarmerPriority[];
  planningPeriod: PlanningPeriod;
  createdAt: string;
  updatedAt: string;
}

export type CropCategory = 'Cereal' | 'Legume' | 'Oilseed' | 'Vegetable' | 'Cover Crop' | 'Fiber';

export interface Crop {
  id: string;
  name: string;
  localNames?: Record<string, string>;
  category: CropCategory;
  waterDemand: 'Low' | 'Medium' | 'High'; // water requirement
  waterDemandMmPerSeason: number; // approximate mm
  soilImpact: 'Regenerative' | 'Neutral' | 'Depleting';
  soilHealthDelta: number; // -10 to +15
  nitrogenFixing: boolean;
  droughtTolerance: 'Low' | 'Moderate' | 'High';
  heatTolerance: 'Low' | 'Moderate' | 'High';
  growingDurationDays: number;
  idealSoils: SoilType[];
  compatibleAfter: string[]; // crop IDs that can precede this crop safely
  incompatibleAfter: string[]; // crop IDs that should NOT precede this crop (pest/disease/nutrient conflict)
  climateRiskScore: number; // 0-100 baseline vulnerability
  typicalYieldTonPerHectare: number;
  economicValue: 'Low' | 'Medium' | 'High';
  carbonSequestration: 'Low' | 'Medium' | 'High';
  description: string;
  icon: string;
}

export interface EnvironmentalSnapshot {
  temperature: number; // °C
  precipitation: number; // mm/month
  vegetationIndex: number; // NDVI 0.0 - 1.0
  soilMoisture: number; // volumetric % (0-100)
  droughtRisk: 'Low' | 'Moderate' | 'High' | 'Severe';
  droughtIndexScore: number; // 0-100
  climateTrend: string;
  historicalRainfallAnomalyPercent: number; // e.g. -14% vs 10-yr normal
  solarRadiationKwh: number;
  timestamp: string;
  source: string;
  isDemo: boolean;
}

export interface RotationYearPlan {
  year: number;
  season: string;
  cropId: string;
  crop: Crop;
  reasonForPlacement: string;
  waterDemandScore: number;
  soilImpactScore: number;
  nitrogenStatus: string;
  keyBenefits: string[];
}

export interface RotationImpact {
  soilHealthPercentChange: number;
  waterDemandPercentChange: number;
  climateRiskPercentChange: number;
  estimatedYieldPercentChange: number;
  diversityIndex: number; // 0-100
  overallFeasibilityScore: number; // 0-100
}

export interface OptimizationWeights {
  soilWeight: number;
  waterWeight: number;
  climateWeight: number;
  diversityWeight: number;
  yieldWeight: number;
}

export interface FactorContribution {
  name: string;
  weight: number;
  score: number;
  description: string;
  status: 'positive' | 'neutral' | 'warning';
}

export interface RotationPlan {
  id: string;
  farmId: string;
  name: string;
  strategy: 'AI Optimized' | 'Current Plan' | 'Water Saver' | 'Soil Regenerator' | 'Custom';
  years: RotationYearPlan[];
  impact: RotationImpact;
  weights: OptimizationWeights;
  explanationFactors: FactorContribution[];
  summaryRecommendation: string;
  createdAt: string;
}

export interface ScenarioSimulationInput {
  farmProfile: FarmProfile;
  baseEnvironment: EnvironmentalSnapshot;
  rainfallChangePercent: number; // -30 to +30
  temperatureChangeC: number; // -5 to +5
  waterAvailabilityOverride?: WaterAvailability;
  primaryPriorityOverride?: FarmerPriority;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  plan: RotationPlan;
  adjustedEnvironment: EnvironmentalSnapshot;
  tradeoffs: {
    pros: string[];
    cons: string[];
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  dataUsed?: {
    rainfall: string;
    temperature: string;
    soilCondition: string;
    currentCrop: string;
    activePriorities: string[];
    waterStatus: string;
  };
}

export interface DataSourceInfo {
  id: string;
  name: string;
  category: 'NASA Earth Observation' | 'Weather & Climate' | 'Soil Database' | 'Crop Knowledge' | 'AI & Optimization';
  provider: string;
  dataType: string;
  frequency: string;
  resolution: string;
  status: 'Live API' | 'Curated Agro-Model' | 'Demo Provider';
  description: string;
  influenceOnPlan: string;
  lastUpdated: string;
}
