import { GoogleGenAI } from '@google/genai';
import { FarmProfile, EnvironmentalSnapshot, RotationPlan, ChatMessage } from '@/src/types';
import { buildSystemPrompt } from './prompts';

export interface ChatResponseResult {
  message: string;
  source: 'gemini' | 'deterministic-fallback';
  dataUsed: ChatMessage['dataUsed'];
}

/**
 * Generate AI explanation or answer questions contextual to the farm state
 */
export async function askTerraAssistant(
  userQuery: string,
  history: ChatMessage[],
  farm: FarmProfile,
  env: EnvironmentalSnapshot,
  plan?: RotationPlan
): Promise<ChatResponseResult> {
  const dataUsed: ChatMessage['dataUsed'] = {
    rainfall: `${env.precipitation} mm/month (${env.historicalRainfallAnomalyPercent}% anomaly)`,
    temperature: `${env.temperature}°C`,
    soilCondition: `${farm.soilType} texture, ${env.soilMoisture}% moisture, NDVI ${env.vegetationIndex}`,
    currentCrop: farm.currentCropId,
    activePriorities: [...farm.priorities],
    waterStatus: `${farm.waterAvailability} availability (Drought Risk: ${env.droughtRisk})`,
  };

  const apiKey = typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : undefined;

  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = buildSystemPrompt(farm, env, plan);
      
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemInstruction}\n\nUser Question: ${userQuery}` }] }
        ],
      });

      if (response.text) {
        return {
          message: response.text,
          source: 'gemini',
          dataUsed
        };
      }
    } catch (err) {
      console.warn('Gemini API call failed or timed out, activating deterministic agro-reasoning fallback:', err);
    }
  }

  // High-fidelity Deterministic Agronomic Fallback
  const fallbackMessage = generateDeterministicExplanation(userQuery, farm, env, plan);
  return {
    message: fallbackMessage,
    source: 'deterministic-fallback',
    dataUsed
  };
}

/**
 * Deterministic domain-specific agronomic explanation engine
 */
export function generateDeterministicExplanation(
  query: string,
  farm: FarmProfile,
  env: EnvironmentalSnapshot,
  plan?: RotationPlan
): string {
  const q = query.toLowerCase();

  if (q.includes('legume') || q.includes('soybean') || q.includes('lentil') || q.includes('chickpea') || q.includes('why did you recommend')) {
    const isWaterLow = farm.waterAvailability === 'Low' || env.droughtRisk === 'High' || env.droughtRisk === 'Severe';
    const chosenLegume = plan?.years.find(y => y.crop.category === 'Legume')?.crop.name || 'legumes';

    return `The optimizer sequenced **${chosenLegume}** for three direct agro-ecological reasons:

1. **Biological Nitrogen Fixation**: Your baseline cultivation of ${farm.currentCropId} depletes soil nitrogen reserves. Legumes engage in symbiotic relationships with *Rhizobium* bacteria, capturing atmospheric nitrogen and depositing approximately 45–65 kg N/ha into the soil profile without requiring synthetic ammoniacal fertilizers.
2. **Moisture Conservation**: With your water availability designated as **${farm.waterAvailability}** and NASA POWER observation recording rainfall at **${env.precipitation} mm/month** (${env.historicalRainfallAnomalyPercent}% anomaly), pulses offer a low seasonal evapotranspiration footprint (280–450 mm vs. 1,200 mm for paddy rice).
3. **Biological Disease Interruption**: Introducing a non-grass legume breaks fungal spore cycles (such as *Rhizoctonia solani* and cereal cyst nematodes) which accumulate rapidly under mono-cropping.`;
  }

  if (q.includes('water') || q.includes('drought') || q.includes('irrigation') || q.includes('rainfall')) {
    return `Based on Earth observations from **NASA POWER** and **SMAP**, your farm is currently experiencing **${env.droughtRisk}** drought vulnerability with topsoil volumetric moisture at **${env.soilMoisture}%**.

• Current monthly rainfall is running **${Math.abs(env.historicalRainfallAnomalyPercent)}% below 10-year seasonal normals**.
• To protect groundwater, the optimizer prioritized crops with taproot architectures (such as chickpeas and mustard) that extract moisture from deeper subsoil horizons rather than shallow-rooted moisture-sensitive crops.
• If you switch to the **Water Saver** scenario in the Scenario Lab, overall seasonal water consumption drops by an additional **${plan ? Math.abs(plan.impact.waterDemandPercentChange) : 23}%**.`;
  }

  if (q.includes('soil') || q.includes('health') || q.includes('organic') || q.includes('texture')) {
    return `Your farm profile indicates **${farm.soilType}** soil texture. 

• **Soil Suitability**: ${farm.soilType} soils benefit significantly from increased organic matter to improve cation exchange capacity and water holding retention.
• **Regeneration Pathway**: The recommended plan generates a projected **+${plan?.impact.soilHealthPercentChange || 18}% net soil health improvement** over your ${farm.planningPeriod}-year planning window by combining nitrogen-fixing legumes with deep-root bio-fumigants.
• **Microbial Diversity**: Incorporating multiple botanical families stimulates diverse mycorrhizal fungi colonies and earthworm activity.`;
  }

  if (q.includes('rice every year') || q.includes('monoculture') || q.includes('same crop')) {
    return `Continuous mono-cropping (planting the same crop year after year) presents severe compounding vulnerabilities:

1. **Soil Compaction & Anaerobic Hardpans**: Continuous flooding or repeated shallow tillage degrades soil aggregate stability.
2. **Pathogen & Pest Proliferation**: Fungal spores and nematodes that target specific crops multiply exponentially when the host crop is consistently available.
3. **Nutrient Mining**: Repeatedly extracting identical macronutrient ratios rapidly exhausts specific micronutrient reserves (e.g., zinc and iron in continuous rice).
4. **Economic Risk**: Volatility in single commodity prices leaves the farm vulnerable compared to diversified seasonal cash crops.`;
  }

  if (q.includes('scenario') || q.includes('what if') || q.includes('simulate') || q.includes('rainfall decreases')) {
    return `In the **Scenario Lab**, you can simulate climate stress scenarios directly:

• **-20% Rainfall**: The optimizer adjusts crop selection to drought-hardy pulses like chickpeas or lentils, preventing total crop failure.
• **+2°C Warming**: Crops with higher thermal tolerance (e.g., maize and cover crops) receive higher preference over heat-sensitive spring wheat.
• You can inspect the trade-offs on the **Scenario Lab** tab where side-by-side matrices show exact soil health, water demand, and yield consequences.`;
  }

  // General comprehensive summary
  return `Analyzing your farm (**${farm.name}**, ${farm.size} ${farm.unit}) under current NASA satellite observations:

• **Active Strategy**: ${plan?.name || 'AI Optimized Agro-Ecological Plan'}
• **Climate Baseline**: Temperature ${env.temperature}°C, Precipitation ${env.precipitation} mm/month, Soil Moisture ${env.soilMoisture}%.
• **Recommended Rotation Sequence**: ${plan?.years.map(y => `${y.year}: ${y.crop.name}`).join(' → ') || 'Soybean → Wheat → Maize'}
• **Projected Resilience**: Soil Health +${plan?.impact.soilHealthPercentChange || 18}%, Water Demand ${plan?.impact.waterDemandPercentChange || -23}%, Climate Risk ${plan?.impact.climateRiskPercentChange || -15}%.

You can ask me specific questions like: *"Why did you recommend legumes?"*, *"How does my soil texture affect this plan?"*, or *"What happens if rainfall decreases by 20%?"*`;
}
