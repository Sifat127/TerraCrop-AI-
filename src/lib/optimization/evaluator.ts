import { 
  FarmProfile, 
  EnvironmentalSnapshot, 
  Scenario, 
  ScenarioSimulationInput,
  FarmerPriority,
  WaterAvailability
} from '@/src/types';
import { generateRotationPlan } from './engine';
import { adjustSnapshotForScenario } from '@/src/lib/environment/snapshot';

export function generateStandardScenarios(
  farm: FarmProfile,
  environment: EnvironmentalSnapshot
): Scenario[] {
  // Scenario 1: Current Baseline
  const currentPlan = generateRotationPlan(farm, environment, 'Current Plan');
  
  // Scenario 2: AI Optimized
  const aiPlan = generateRotationPlan(farm, environment, 'AI Optimized');
  
  // Scenario 3: Water Saver
  const waterSaverPlan = generateRotationPlan(farm, environment, 'Water Saver');

  return [
    {
      id: 'scenario-current',
      name: 'Current Baseline Practice',
      description: 'Maintains current mono-crop or traditional cereal alternation without nitrogen-fixing rotation.',
      plan: currentPlan,
      adjustedEnvironment: environment,
      tradeoffs: {
        pros: [
          'Zero operational learning curve',
          'Existing seed supplier and buyer arrangements remain unchanged',
          'Immediate short-term predictability'
        ],
        cons: [
          'Soil organic carbon declines -8% over planning horizon',
          'Heavy irrigation consumption (+14% vs optimal balance)',
          'High vulnerability to rainfall deficits and heat spikes'
        ]
      }
    },
    {
      id: 'scenario-ai-optimized',
      name: 'AI Agro-Ecological Balanced',
      description: 'Deterministically balances soil biology restoration, groundwater preservation, and yield resilience.',
      plan: aiPlan,
      adjustedEnvironment: environment,
      tradeoffs: {
        pros: [
          `Soil health improves +${aiPlan.impact.soilHealthPercentChange}% via biological nitrogen fixation`,
          `Water demand decreased by ${Math.abs(aiPlan.impact.waterDemandPercentChange)}%`,
          `Climate risk exposure reduced by ${Math.abs(aiPlan.impact.climateRiskPercentChange)}%`,
          'Disrupts nematode and root-disease vectors across crop cycles'
        ],
        cons: [
          'Requires procuring secondary seed varieties (legumes/oilseeds)',
          'Slight operational adjustment to post-harvest handling'
        ]
      }
    },
    {
      id: 'scenario-water-saver',
      name: 'Maximum Water Conservation',
      description: 'Aggressively prioritizes drought-hardy pulses and minimal-irrigation brassicas to withstand severe drought.',
      plan: waterSaverPlan,
      adjustedEnvironment: environment,
      tradeoffs: {
        pros: [
          `Maximum groundwater preservation (${Math.abs(waterSaverPlan.impact.waterDemandPercentChange)}% lower water demand)`,
          'Lowest irrigation energy and pumping utility costs',
          'High resilience against acute thermal spikes and drought warnings'
        ],
        cons: [
          'Slightly lower gross tonnage yield compared to heavy staple cereals',
          'May require connecting with specialized pulse processors'
        ]
      }
    }
  ];
}

export function simulateCustomScenario(
  input: ScenarioSimulationInput
): Scenario {
  const adjustedEnv = adjustSnapshotForScenario(
    input.baseEnvironment,
    input.rainfallChangePercent,
    input.temperatureChangeC
  );

  const modifiedFarm: FarmProfile = {
    ...input.farmProfile,
    waterAvailability: input.waterAvailabilityOverride || input.farmProfile.waterAvailability,
    priorities: input.primaryPriorityOverride 
      ? [input.primaryPriorityOverride, ...input.farmProfile.priorities.filter(p => p !== input.primaryPriorityOverride)]
      : input.farmProfile.priorities
  };

  const plan = generateRotationPlan(
    modifiedFarm, 
    adjustedEnv, 
    'Custom'
  );

  const pros: string[] = [];
  const cons: string[] = [];

  if (input.rainfallChangePercent < 0) {
    cons.push(`Rainfall deficit of ${Math.abs(input.rainfallChangePercent)}% increases dependence on drought-tolerant rotations.`);
    pros.push('Plan adapts crop water requirements to avoid aquifer depletion.');
  } else if (input.rainfallChangePercent > 0) {
    pros.push(`Surplus moisture (+${input.rainfallChangePercent}%) supports higher-yielding succession crops.`);
  }

  if (input.temperatureChangeC > 0) {
    cons.push(`Thermal warming (+${input.temperatureChangeC}°C) elevates evapotranspiration stress.`);
    pros.push('Selected cultivars provide superior heat tolerance indices.');
  }

  pros.push(`Projected net soil health impact: +${plan.impact.soilHealthPercentChange}%`);
  pros.push(`Estimated yield impact: ${plan.impact.estimatedYieldPercentChange >= 0 ? '+' : ''}${plan.impact.estimatedYieldPercentChange}%`);

  return {
    id: `scenario-simulated-${Date.now()}`,
    name: `Microclimate Stress Simulation (${input.rainfallChangePercent >= 0 ? '+' : ''}${input.rainfallChangePercent}% Rain, ${input.temperatureChangeC >= 0 ? '+' : ''}${input.temperatureChangeC}°C)`,
    description: `Simulated farm performance under microclimatic variations with ${modifiedFarm.waterAvailability} water availability.`,
    plan,
    adjustedEnvironment: adjustedEnv,
    tradeoffs: {
      pros,
      cons
    }
  };
}
