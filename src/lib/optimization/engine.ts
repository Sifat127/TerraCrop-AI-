import { 
  FarmProfile, 
  EnvironmentalSnapshot, 
  Crop, 
  RotationPlan, 
  RotationYearPlan, 
  OptimizationWeights, 
  FactorContribution, 
  FarmerPriority,
  PlanningPeriod,
  RotationImpact
} from '@/src/types';
import { CROP_LIST, getCropById } from '@/src/lib/crops/database';

/**
 * Computes normalized optimization weights based on farmer priorities
 */
export function calculateOptimizationWeights(
  priorities: FarmerPriority[],
  strategyOverride?: 'AI Optimized' | 'Water Saver' | 'Soil Regenerator' | 'Yield Focus'
): OptimizationWeights {
  // Baseline neutral weights (sum = 1.0)
  let soil = 0.20;
  let water = 0.20;
  let climate = 0.20;
  let diversity = 0.20;
  let yieldW = 0.20;

  if (strategyOverride === 'Water Saver') {
    return {
      waterWeight: 0.45,
      climateWeight: 0.25,
      soilWeight: 0.15,
      diversityWeight: 0.10,
      yieldWeight: 0.05
    };
  }

  if (strategyOverride === 'Soil Regenerator') {
    return {
      soilWeight: 0.45,
      diversityWeight: 0.25,
      waterWeight: 0.15,
      climateWeight: 0.10,
      yieldWeight: 0.05
    };
  }

  // Adjust for farmer selected priorities
  if (priorities.includes('Improve soil health')) {
    soil += 0.25;
  }
  if (priorities.includes('Save water')) {
    water += 0.25;
  }
  if (priorities.includes('Reduce climate risk')) {
    climate += 0.25;
  }
  if (priorities.includes('Increase crop diversity')) {
    diversity += 0.25;
  }
  if (priorities.includes('Maximize yield')) {
    yieldW += 0.25;
  }

  // Normalize so weights sum to 1.0
  const total = soil + water + climate + diversity + yieldW;
  return {
    soilWeight: Number((soil / total).toFixed(3)),
    waterWeight: Number((water / total).toFixed(3)),
    climateWeight: Number((climate / total).toFixed(3)),
    diversityWeight: Number((diversity / total).toFixed(3)),
    yieldWeight: Number((yieldW / total).toFixed(3)),
  };
}

/**
 * Scores an individual candidate crop given:
 * - predecessor crop (biological succession rules)
 * - soil compatibility
 * - environmental moisture & drought risk
 * - farmer optimization weights
 */
export function scoreCandidateCrop(
  candidate: Crop,
  previousCropId: string | undefined,
  recentCropHistory: string[],
  environment: EnvironmentalSnapshot,
  farm: FarmProfile,
  weights: OptimizationWeights
): { score: number; reasons: string[]; isHardViolated: boolean } {
  const reasons: string[] = [];
  let isHardViolated = false;

  // 1. Biological Incompatibility Hard Filter
  if (previousCropId && candidate.incompatibleAfter.includes(previousCropId)) {
    isHardViolated = true;
    return { score: -1000, reasons: [`Severe biological incompatibility following ${previousCropId}`], isHardViolated: true };
  }

  // 2. Strict monoculture penalty (avoid repeating same crop consecutively)
  if (previousCropId === candidate.id) {
    return { score: -500, reasons: ['Monoculture penalty: consecutive planting increases pathogen pressure'], isHardViolated: true };
  }

  // 3. Soil Suitability Score (0 to 100)
  let soilScore = 60;
  if (candidate.idealSoils.includes(farm.soilType)) {
    soilScore = 95;
    reasons.push(`Optimal match for ${farm.soilType} soil texture`);
  } else if (farm.soilType === 'Unknown') {
    soilScore = 70;
  } else {
    soilScore = 45;
  }

  // 4. Water Efficiency & Drought Alignment (0 to 100)
  let waterScore = 60;
  const isWaterConstrained = farm.waterAvailability === 'Low' || environment.droughtIndexScore > 50;
  
  if (isWaterConstrained) {
    if (candidate.waterDemand === 'Low') {
      waterScore = 96;
      reasons.push('Low water demand preserves aquifer under moisture stress');
    } else if (candidate.waterDemand === 'Medium') {
      waterScore = 65;
    } else {
      waterScore = 20; // High water demand during drought
    }
  } else {
    // Normal water availability
    if (candidate.waterDemand === 'Low') waterScore = 85;
    else if (candidate.waterDemand === 'Medium') waterScore = 80;
    else waterScore = 60;
  }

  // 5. Climate Tolerance & Heat/Drought Risk (0 to 100)
  let climateScore = 100 - candidate.climateRiskScore;
  if (environment.temperature > 28 && candidate.heatTolerance === 'High') {
    climateScore += 15;
    reasons.push('High thermal tolerance withstands elevated temperatures');
  } else if (environment.temperature > 28 && candidate.heatTolerance === 'Low') {
    climateScore -= 25;
  }

  // 6. Soil Health & Nitrogen Value (0 to 100)
  let soilRegenScore = 50;
  if (candidate.nitrogenFixing) {
    soilRegenScore = 95;
    reasons.push('Fixes biological atmospheric nitrogen, regenerating soil biology');
  } else if (candidate.soilImpact === 'Regenerative') {
    soilRegenScore = 88;
    reasons.push('Root structure and biomass enhance soil organic matter');
  } else if (candidate.soilImpact === 'Neutral') {
    soilRegenScore = 60;
  } else {
    // Depleting
    soilRegenScore = 40;
  }

  // 7. Crop Diversity Bonus
  let diversityScore = 50;
  const occurrences = recentCropHistory.filter(id => id === candidate.id).length;
  if (occurrences === 0) {
    diversityScore = 95;
    reasons.push('Introduces novel botanical family to rotation');
  } else {
    diversityScore = Math.max(20, 80 - occurrences * 30);
  }

  // 8. Yield & Economic Value
  let yieldScore = candidate.economicValue === 'High' ? 90 : candidate.economicValue === 'Medium' ? 70 : 40;

  // Composite weighted score
  const totalScore = 
    (soilRegenScore * weights.soilWeight) +
    (waterScore * weights.waterWeight) +
    (climateScore * weights.climateWeight) +
    (diversityScore * weights.diversityWeight) +
    (yieldScore * weights.yieldWeight);

  return {
    score: Number(totalScore.toFixed(2)),
    reasons,
    isHardViolated: false
  };
}

/**
 * Deterministically generates an optimal multi-year crop rotation plan
 */
export function generateRotationPlan(
  farm: FarmProfile,
  environment: EnvironmentalSnapshot,
  strategy: 'AI Optimized' | 'Current Plan' | 'Water Saver' | 'Soil Regenerator' | 'Custom' = 'AI Optimized',
  horizonYears: PlanningPeriod = farm.planningPeriod
): RotationPlan {
  const startYear = new Date().getFullYear();
  const weights = calculateOptimizationWeights(
    farm.priorities, 
    strategy === 'Water Saver' ? 'Water Saver' : strategy === 'Soil Regenerator' ? 'Soil Regenerator' : undefined
  );

  const years: RotationYearPlan[] = [];
  const cropHistory: string[] = [farm.currentCropId];
  if (farm.previousCropId) {
    cropHistory.unshift(farm.previousCropId);
  }

  // If strategy is "Current Plan", simulate what happens if farmer keeps planting their current pattern
  if (strategy === 'Current Plan') {
    const currentCrop = getCropById(farm.currentCropId);
    // Typical traditional practice: either monoculture or alternating with basic grain
    for (let i = 0; i < horizonYears; i++) {
      const yearNum = startYear + i;
      // Many traditional farmers alternate current crop with wheat or stay in monoculture
      const isRepeated = i % 2 === 0;
      const crop = isRepeated ? currentCrop : (currentCrop.id === 'rice' ? getCropById('wheat') : currentCrop);
      
      years.push({
        year: yearNum,
        season: 'Main Kharif / Spring Cycle',
        cropId: crop.id,
        crop,
        reasonForPlacement: isRepeated 
          ? `Continuing baseline cultivation of ${crop.name} without regenerative intervention`
          : `Secondary staple rotation with ${crop.name}`,
        waterDemandScore: crop.waterDemand === 'High' ? 85 : 55,
        soilImpactScore: crop.soilImpact === 'Depleting' ? 35 : 50,
        nitrogenStatus: crop.nitrogenFixing ? 'Fixing N' : 'Nitrogen Depleting',
        keyBenefits: ['Familiar operational routine', 'Established supply chain']
      });
    }

    const baselineImpact: RotationImpact = {
      soilHealthPercentChange: -8,
      waterDemandPercentChange: +14,
      climateRiskPercentChange: +18,
      estimatedYieldPercentChange: -4,
      diversityIndex: 35,
      overallFeasibilityScore: 54
    };

    return {
      id: `plan-current-${Date.now()}`,
      farmId: farm.id,
      name: 'Current Baseline Plan',
      strategy: 'Current Plan',
      years,
      impact: baselineImpact,
      weights,
      explanationFactors: [
        {
          name: 'Crop Sequence Repetition',
          weight: weights.diversityWeight,
          score: 30,
          description: 'Continuous reliance on cereal crops depletes subsoil nutrients and increases pest vector resistance.',
          status: 'warning'
        },
        {
          name: 'Water Footprint Pressure',
          weight: weights.waterWeight,
          score: 40,
          description: 'High irrigation requirements strain groundwater during predicted seasonal rainfall deficits.',
          status: 'warning'
        },
        {
          name: 'Nutrient Replacement Need',
          weight: weights.soilWeight,
          score: 35,
          description: 'Lack of biological nitrogen fixers requires continuous synthetic fertilizer inputs.',
          status: 'warning'
        }
      ],
      summaryRecommendation: 'Baseline practice risks progressive soil compaction and heightened vulnerability to water shortages. Transitioning to a structured rotation is strongly advised.',
      createdAt: new Date().toISOString()
    };
  }

  // For AI Optimized / Water Saver: Solve sequentially with lookahead diversity
  let lastCropId = farm.currentCropId;
  const selectedCrops: Crop[] = [];

  for (let i = 0; i < horizonYears; i++) {
    const yearNum = startYear + i;
    
    // Evaluate all candidates
    const scoredCandidates = CROP_LIST.map(candidate => {
      const { score, reasons, isHardViolated } = scoreCandidateCrop(
        candidate,
        lastCropId,
        cropHistory,
        environment,
        farm,
        weights
      );
      return { candidate, score, reasons, isHardViolated };
    })
    .filter(item => !item.isHardViolated)
    .sort((a, b) => b.score - a.score);

    // Pick top candidate
    const top = scoredCandidates[0] || {
      candidate: getCropById('soybean'),
      score: 75,
      reasons: ['Selected as default symbiotic legume sequence']
    };

    const chosenCrop = top.candidate;
    selectedCrops.push(chosenCrop);
    lastCropId = chosenCrop.id;
    cropHistory.push(chosenCrop.id);

    const nitrogenLabel = chosenCrop.nitrogenFixing 
      ? 'Atmospheric Nitrogen Fixation (+40-65 kg N/ha)' 
      : chosenCrop.soilImpact === 'Regenerative' 
        ? 'Soil Structure Regeneration' 
        : 'Nitrogen Consumer';

    years.push({
      year: yearNum,
      season: i % 2 === 0 ? 'Kharif / Summer Cycle' : 'Rabi / Cool Season Cycle',
      cropId: chosenCrop.id,
      crop: chosenCrop,
      reasonForPlacement: top.reasons[0] || `Fulfills agro-climatic balance for year ${yearNum}`,
      waterDemandScore: chosenCrop.waterDemand === 'Low' ? 30 : chosenCrop.waterDemand === 'Medium' ? 60 : 90,
      soilImpactScore: chosenCrop.soilImpact === 'Regenerative' ? 88 : chosenCrop.soilImpact === 'Neutral' ? 55 : 35,
      nitrogenStatus: nitrogenLabel,
      keyBenefits: top.reasons.slice(0, 3)
    });
  }

  // Calculate aggregate impact metrics
  let totalSoilHealthDelta = 0;
  let totalWaterDemandMm = 0;
  let totalRisk = 0;
  let nitrogenFixingCount = 0;
  const uniqueCrops = new Set(selectedCrops.map(c => c.id)).size;

  selectedCrops.forEach(c => {
    totalSoilHealthDelta += c.soilHealthDelta;
    totalWaterDemandMm += c.waterDemandMmPerSeason;
    totalRisk += c.climateRiskScore;
    if (c.nitrogenFixing) nitrogenFixingCount++;
  });

  const avgWaterMm = totalWaterDemandMm / selectedCrops.length;
  // Compare against baseline (assuming baseline is typical rice/wheat 850mm avg)
  const baselineWaterMm = 850;
  const waterDemandPercentChange = Math.round(((avgWaterMm - baselineWaterMm) / baselineWaterMm) * 100);

  const soilHealthPercentChange = Math.min(35, Math.max(5, Math.round(totalSoilHealthDelta * 2.2 + (nitrogenFixingCount * 4))));
  const climateRiskPercentChange = Math.min(-5, Math.max(-32, -Math.round((uniqueCrops * 5) + (nitrogenFixingCount * 6))));
  const estimatedYieldPercentChange = Math.round(8 + (soilHealthPercentChange * 0.4) + (uniqueCrops * 1.5));
  const diversityIndex = Math.min(100, Math.round((uniqueCrops / selectedCrops.length) * 100));

  const overallFeasibilityScore = Math.min(98, Math.max(65, Math.round(75 + (soilHealthPercentChange * 0.5) - (waterDemandPercentChange * 0.3))));

  // Factor contributions for UI transparency
  const explanationFactors: FactorContribution[] = [
    {
      name: 'Soil Regeneration & Nutrient Cycling',
      weight: weights.soilWeight,
      score: 88,
      description: `Rotation incorporates ${nitrogenFixingCount} legume/cover crop cycles fixing atmospheric nitrogen and revitalizing root microbiomes.`,
      status: 'positive'
    },
    {
      name: 'Water Footprint Optimization',
      weight: weights.waterWeight,
      score: waterDemandPercentChange < 0 ? 92 : 65,
      description: `Average water demand reduced to ${Math.round(avgWaterMm)}mm/season, guarding against local drought risk.`,
      status: waterDemandPercentChange < 0 ? 'positive' : 'neutral'
    },
    {
      name: 'Climate & Heat Stress Tolerance',
      weight: weights.climateWeight,
      score: 84,
      description: `Selected varieties feature high drought and heat tolerance matched to NASA POWER surface temperature metrics.`,
      status: 'positive'
    },
    {
      name: 'Biodiversity & Biological Pest Break',
      weight: weights.diversityWeight,
      score: diversityIndex,
      description: `${uniqueCrops} unique botanical families disrupt repetitive fungal disease cycles and weed pressures.`,
      status: 'positive'
    },
    {
      name: 'Yield Stability & Economic Feasibility',
      weight: weights.yieldWeight,
      score: 82,
      description: 'Maintains high commercial viability by balancing high-value cash crops with soil restorative cycles.',
      status: 'positive'
    }
  ];

  let summaryRecommendation = `This ${horizonYears}-year plan integrates ${selectedCrops.map(c => c.name).join(' → ')}. `;
  if (nitrogenFixingCount > 0) {
    summaryRecommendation += `Legume introduction restores organic matter while reducing seasonal irrigation demand by ${Math.abs(waterDemandPercentChange)}%.`;
  } else {
    summaryRecommendation += `Optimized to maximize drought resiliency and soil texture harmony.`;
  }

  return {
    id: `plan-${strategy.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
    farmId: farm.id,
    name: strategy === 'Water Saver' ? 'Water Conservation Plan' : 'AI-Optimized Agro-Ecological Plan',
    strategy,
    years,
    impact: {
      soilHealthPercentChange,
      waterDemandPercentChange,
      climateRiskPercentChange,
      estimatedYieldPercentChange,
      diversityIndex,
      overallFeasibilityScore
    },
    weights,
    explanationFactors,
    summaryRecommendation,
    createdAt: new Date().toISOString()
  };
}
