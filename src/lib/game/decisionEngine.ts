import { GameCrop, GameWeatherScenario, HarvestResult } from '@/src/types/game';

interface EvaluationWeights {
  waterWeight: number;
  temperatureWeight: number;
  soilWeight: number;
  seasonWeight: number;
  priorityWeight: number;
}

export function evaluateCropDecision(
  crop: GameCrop,
  scenario: GameWeatherScenario,
  farmerPriority: string = 'Save water and protect soil',
  customWeights?: Partial<EvaluationWeights>
): HarvestResult {
  const weights: EvaluationWeights = {
    waterWeight: 0.28,
    temperatureWeight: 0.22,
    soilWeight: 0.20,
    seasonWeight: 0.15,
    priorityWeight: 0.15,
    ...customWeights
  };

  // 1. Water Compatibility (0-100)
  let waterScore = 75;
  if (scenario.waterAvailability === 'Severe Drought' || scenario.waterAvailability === 'Limited') {
    if (crop.droughtTolerance === 'HIGH' || crop.waterDemand === 'LOW') {
      waterScore = 95;
    } else if (crop.waterDemand === 'MEDIUM') {
      waterScore = 65;
    } else {
      waterScore = 25; // Rice in drought
    }
  } else if (scenario.waterAvailability === 'Abundant') {
    if (crop.waterDemand === 'HIGH') {
      waterScore = 98; // Rice in monsoon
    } else if (crop.droughtTolerance === 'HIGH' && crop.category.includes('Legume')) {
      waterScore = 60; // Legumes can suffer root rot if waterlogged
    } else {
      waterScore = 80;
    }
  } else {
    // Moderate
    waterScore = crop.waterDemand === 'MEDIUM' ? 90 : 80;
  }

  // 2. Temperature Compatibility (0-100)
  let tempScore = 80;
  if (scenario.temperatureC >= 35) {
    if (crop.heatTolerance === 'HIGH') {
      tempScore = 94;
    } else if (crop.heatTolerance === 'MEDIUM') {
      tempScore = 60;
    } else {
      tempScore = 30; // Potato or winter wheat in severe heatwave
    }
  } else if (scenario.temperatureC <= 20) {
    if (crop.seasonSuitability.includes('Winter')) {
      tempScore = 96;
    } else {
      tempScore = 65;
    }
  } else {
    tempScore = 88;
  }

  // 3. Soil Compatibility & Benefit (0-100)
  let soilScore = 70;
  if (crop.soilBenefit === 'HIGH' || crop.nitrogenFixing) {
    soilScore = 95;
  } else if (crop.soilBenefit === 'MEDIUM') {
    soilScore = 80;
  } else {
    soilScore = 55;
  }

  // 4. Season Compatibility (0-100)
  let seasonScore = crop.seasonSuitability.includes(scenario.season) ? 95 : 50;

  // 5. Priority Alignment (0-100)
  let priorityScore = 75;
  const pLower = farmerPriority.toLowerCase();
  if (pLower.includes('water') && (crop.waterDemand === 'LOW' || crop.droughtTolerance === 'HIGH')) {
    priorityScore = 95;
  } else if (pLower.includes('soil') && crop.nitrogenFixing) {
    priorityScore = 98;
  } else if (pLower.includes('yield') && crop.baseYieldKg > 3500) {
    priorityScore = 92;
  } else if (pLower.includes('heat') && crop.heatTolerance === 'HIGH') {
    priorityScore = 94;
  }

  // Aggregate weighted suitability
  const rawSuitability = 
    waterScore * weights.waterWeight +
    tempScore * weights.temperatureWeight +
    soilScore * weights.soilWeight +
    seasonScore * weights.seasonWeight +
    priorityScore * weights.priorityWeight;

  const suitabilityScore = Math.min(100, Math.max(10, Math.round(rawSuitability)));

  // Yield calculation
  const yieldPenaltyFactor = suitabilityScore / 100;
  const yieldPercent = Math.round(Math.min(100, Math.max(20, yieldPenaltyFactor * 100)));
  const yieldKg = Math.round(crop.baseYieldKg * (yieldPercent / 100));

  // Water Used calculation
  let baseWaterPercent = crop.waterDemand === 'HIGH' ? 88 : crop.waterDemand === 'MEDIUM' ? 58 : 32;
  if (scenario.waterAvailability === 'Limited' && crop.waterDemand === 'HIGH') {
    baseWaterPercent = 98; // drained entire farm reservoir
  }
  const waterUsedPercent = Math.min(100, Math.max(15, baseWaterPercent));

  // Soil Impact
  let soilImpactScore = crop.nitrogenFixing ? 18 : crop.soilBenefit === 'MEDIUM' ? 4 : -8;
  if (scenario.id === 'scenario_soil_recovery' && crop.nitrogenFixing) {
    soilImpactScore = 26;
  }

  // Climate Risk Level
  let climateRiskLevel: 'Low' | 'Medium' | 'High' = 'Medium';
  if (suitabilityScore >= 78) {
    climateRiskLevel = 'Low';
  } else if (suitabilityScore < 55) {
    climateRiskLevel = 'High';
  }

  // Sustainability Index (0-100)
  const sustainabilityScore = Math.round(
    (suitabilityScore * 0.45) +
    (crop.nitrogenFixing ? 25 : 10) +
    ((100 - waterUsedPercent) * 0.30)
  );

  // Economy rewards
  const grossRevenue = yieldKg * crop.marketPricePerKg;
  const coinsEarned = Math.max(15, Math.round(grossRevenue / 18));
  const knowledgeGained = suitabilityScore >= 75 ? 35 : 20;

  // Transparent Educational Narratives
  let whatHappened = '';
  let whatCanYouLearn = '';

  if (suitabilityScore >= 80) {
    whatHappened = `Outstanding decision! ${crop.name} harmonized with the ${scenario.name.toLowerCase()} conditions. NASA SMAP and GPM telemetry confirm soil moisture stayed within the optimal physiological band.`;
    whatCanYouLearn = `Choosing genetics suited to ${scenario.waterAvailability.toLowerCase()} water budgets and high soil health yields reliable harvests without depleting groundwater reserves.`;
  } else if (suitabilityScore >= 60) {
    whatHappened = `${crop.name} survived the season with acceptable vigor, but encountered moderate stress during peak thermal or moisture fluctuations.`;
    whatCanYouLearn = `While workable, crops with stronger drought tolerance or lower water demand would have conserved more water and boosted sustainability.`;
  } else {
    whatHappened = `The crop encountered severe climate stress. Rainfall was ${scenario.rainfallMm}mm (${scenario.waterAvailability.toLowerCase()}) while ${crop.name} requires substantial water and lower heat.`;
    whatCanYouLearn = `Under these conditions, planting deep-rooted, drought-resilient legumes (like Lentils or Chickpeas) protects both your soil biology and your bank account!`;
  }

  return {
    cropId: crop.id,
    cropName: crop.name,
    suitabilityScore,
    yieldPercent,
    yieldKg,
    waterUsedPercent,
    soilImpactScore,
    climateRiskLevel,
    sustainabilityScore,
    coinsEarned,
    knowledgeGained,
    factors: {
      waterCompatibility: Math.round(waterScore),
      temperatureCompatibility: Math.round(tempScore),
      soilCompatibility: Math.round(soilScore),
      seasonCompatibility: Math.round(seasonScore),
      priorityAlignment: Math.round(priorityScore)
    },
    whatHappened,
    whatCanYouLearn,
    scenario
  };
}
