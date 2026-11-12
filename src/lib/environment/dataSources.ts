import { DataSourceInfo } from '@/src/types';

export const DATA_SOURCES: DataSourceInfo[] = [
  {
    id: 'nasa-power',
    name: 'NASA POWER Agroclimatology',
    category: 'NASA Earth Observation',
    provider: 'NASA Langley Research Center',
    dataType: 'Solar Irradiance, Surface Temperature, Relative Humidity, Precipitation',
    frequency: 'Daily updates, 10-year climatological baseline',
    resolution: '0.5° × 0.5° Latitude/Longitude grid',
    status: 'Curated Agro-Model',
    description: 'Provides long-term satellite-derived meteorology and solar energy parameters specifically formatted for agricultural crop modeling.',
    influenceOnPlan: 'Dictates seasonal thermal units (GDD), solar radiation constraints, and long-term rainfall anomalies.',
    lastUpdated: 'Current Cycle (Demo Sync)'
  },
  {
    id: 'modis-ndvi',
    name: 'MODIS Terra/Aqua Normalized Difference Vegetation Index (NDVI)',
    category: 'NASA Earth Observation',
    provider: 'NASA Land Processes Distributed Active Archive Center (LP DAAC)',
    dataType: 'Surface reflectance, vegetation density, canopy chlorophyll absorption',
    frequency: '16-day composite',
    resolution: '250m ground resolution',
    status: 'Curated Agro-Model',
    description: 'Monitors photosynthetic vitality and canopy vigor over the farm perimeter, detecting early stress markers before visible foliage yellowing.',
    influenceOnPlan: 'Weights urgency for cover cropping and regenerative biological rest cycles when vegetation baseline deteriorates.',
    lastUpdated: '16-Day Window'
  },
  {
    id: 'smap-soil',
    name: 'NASA Soil Moisture Active Passive (SMAP)',
    category: 'NASA Earth Observation',
    provider: 'NASA Jet Propulsion Laboratory (JPL)',
    dataType: 'Top 5cm volumetric soil moisture and freeze/thaw state',
    frequency: '2-3 days repeat interval',
    resolution: '9km - 36km downscaled radiometric',
    status: 'Curated Agro-Model',
    description: 'Measures water content in the surface soil layer via L-band radiometry to track root-zone infiltration and moisture deficits.',
    influenceOnPlan: 'Directly bounds crop selection: penalizes water-intensive crops (e.g. flooded rice, field corn) during active moisture deficit periods.',
    lastUpdated: 'Active Satellite Track'
  },
  {
    id: 'soilgrids',
    name: 'ISRIC SoilGrids & Harmonized World Soil Database (HWSD)',
    category: 'Soil Database',
    provider: 'ISRIC - World Soil Information / FAO',
    dataType: 'Soil texture (clay/silt/sand fraction), bulk density, cation exchange capacity, pH',
    frequency: 'Static global spatial database',
    resolution: '250m spatial resolution',
    status: 'Curated Agro-Model',
    description: 'Predictive global digital soil mapping machine learning framework mapping physical and chemical soil properties.',
    influenceOnPlan: 'Filters compatible crops based on soil drainage, root penetration resistance, and nutrient buffering capacity.',
    lastUpdated: 'Standard Edition v2.0'
  },
  {
    id: 'crop-ontology',
    name: 'FAO AgMIP & ICARDA Crop Rotation Knowledge Graph',
    category: 'Crop Knowledge',
    provider: 'Food and Agriculture Organization (FAO) / AgMIP',
    dataType: 'Symbiotic crop successions, biological disease break periods, biological nitrogen fixation yields',
    frequency: 'Peer-reviewed agronomy database',
    resolution: '10 crop classes, 100+ succession interaction pairs',
    status: 'Curated Agro-Model',
    description: 'Empirical agro-ecological rules governing botanical family sequencing (e.g. Fabaceae preceding Poaceae) to prevent nematode and fungal pathogen buildup.',
    influenceOnPlan: 'Hard biological constraint: strictly eliminates high-risk crop successions (e.g. continuous paddy, Solanaceae back-to-back).',
    lastUpdated: '2026 Agro-Standard'
  },
  {
    id: 'deterministic-optimizer',
    name: 'TerraCrop Multi-Factor Agro-Ecological Optimizer',
    category: 'AI & Optimization',
    provider: 'TerraCrop Proprietary Deterministic Engine',
    dataType: 'Weighted Multi-Attribute Utility Theory (MAUT) & Dynamic Sequence Optimizer',
    frequency: 'Real-time deterministic execution',
    resolution: 'Deterministic mathematical solver',
    status: 'Live API',
    description: 'Evaluates permutations of rotations across 1-5 year horizons, balancing soil regeneration, water conservation, and climate risk according to farmer priorities.',
    influenceOnPlan: 'Produces the final numerical recommendation and year-by-year crop placement.',
    lastUpdated: 'Real-time Execution'
  },
  {
    id: 'gemini-assistant',
    name: 'Gemini Contextual Agro-Reasoning Layer',
    category: 'AI & Optimization',
    provider: 'Google AI Studio (@google/genai SDK)',
    dataType: 'Contextual synthesis and natural language explanation of optimizer output',
    frequency: 'Interactive conversational queries',
    resolution: 'Natural Language Reasoning',
    status: 'Live API',
    description: 'Synthesizes environmental sensor telemetry, farm constraints, and optimizer scoring to provide human-understandable agricultural rationale to the farmer.',
    influenceOnPlan: 'Explains "The Why" behind optimizer recommendations; does not alter raw mathematical scores.',
    lastUpdated: 'Live with Deterministic Fallback'
  }
];
