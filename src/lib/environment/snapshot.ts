import { EnvironmentalSnapshot } from '@/src/types';
import { fetchNasaEnvironmentalData } from './providers/nasa';
import { fetchWeatherProviderData } from './providers/weather';

export const DEFAULT_DEMO_COORDINATES = {
  latitude: 36.65, // Central Valley, California - productive agricultural corridor
  longitude: -119.85,
  address: 'Central Valley Agricultural District, Fresno County, CA',
  region: 'California Central Basin',
  country: 'United States'
};

export async function getEnvironmentalSnapshot(
  lat: number = DEFAULT_DEMO_COORDINATES.latitude,
  lon: number = DEFAULT_DEMO_COORDINATES.longitude
): Promise<EnvironmentalSnapshot> {
  try {
    const { snapshot } = await fetchNasaEnvironmentalData(lat, lon);
    const weather = await fetchWeatherProviderData(lat, lon);
    
    // Integrate weather forecast adjustment
    return {
      ...snapshot,
      temperature: weather.currentTemp,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.warn('Falling back to baseline environmental snapshot:', error);
    return getFallbackSnapshot();
  }
}

export function getFallbackSnapshot(): EnvironmentalSnapshot {
  return {
    temperature: 26.4,
    precipitation: 64, // mm/month
    vegetationIndex: 0.58, // NDVI healthy canopy
    soilMoisture: 42, // volumetric %
    droughtRisk: 'Moderate',
    droughtIndexScore: 48,
    climateTrend: '14.2% below 10-year NASA POWER seasonal precipitation normal',
    historicalRainfallAnomalyPercent: -14.2,
    solarRadiationKwh: 5.4,
    timestamp: new Date().toISOString(),
    source: 'NASA POWER Agroclimatology & MODIS NDVI (Demo Calibrated)',
    isDemo: true,
  };
}

/**
 * Adjust snapshot based on what-if scenario variables
 */
export function adjustSnapshotForScenario(
  base: EnvironmentalSnapshot,
  rainfallDeltaPercent: number,
  temperatureDeltaC: number
): EnvironmentalSnapshot {
  const adjustedPrecip = Math.max(5, Math.round(base.precipitation * (1 + rainfallDeltaPercent / 100)));
  const adjustedTemp = Number((base.temperature + temperatureDeltaC).toFixed(1));
  
  // Soil moisture responds strongly to precipitation delta and weakly to temperature (evaporation)
  const soilMoistureAdjustment = (rainfallDeltaPercent * 0.45) - (temperatureDeltaC * 1.8);
  const adjustedSoilMoisture = Math.min(90, Math.max(10, Math.round(base.soilMoisture + soilMoistureAdjustment)));
  
  // NDVI shifts accordingly
  const ndviShift = (rainfallDeltaPercent * 0.0025) - (temperatureDeltaC * 0.012);
  const adjustedNdvi = Number(Math.min(0.92, Math.max(0.18, base.vegetationIndex + ndviShift)).toFixed(2));
  
  // Recalculate drought risk
  let droughtRisk: EnvironmentalSnapshot['droughtRisk'] = 'Low';
  let droughtScore = 20;
  if (adjustedPrecip < 40 || adjustedSoilMoisture < 25) {
    droughtRisk = 'Severe';
    droughtScore = 88;
  } else if (adjustedPrecip < 70 || adjustedSoilMoisture < 36) {
    droughtRisk = 'High';
    droughtScore = 68;
  } else if (adjustedPrecip < 110 || adjustedSoilMoisture < 50) {
    droughtRisk = 'Moderate';
    droughtScore = 48;
  }

  return {
    ...base,
    temperature: adjustedTemp,
    precipitation: adjustedPrecip,
    soilMoisture: adjustedSoilMoisture,
    vegetationIndex: adjustedNdvi,
    droughtRisk,
    droughtIndexScore: droughtScore,
    climateTrend: rainfallDeltaPercent < 0 
      ? `Simulated: Rainfall reduced by ${Math.abs(rainfallDeltaPercent)}%, Temp +${temperatureDeltaC}°C`
      : `Simulated: Rainfall increased by ${rainfallDeltaPercent}%, Temp ${temperatureDeltaC >= 0 ? '+' : ''}${temperatureDeltaC}°C`,
    timestamp: new Date().toISOString(),
    source: `${base.source} + Microclimate Stress Simulation`,
  };
}
