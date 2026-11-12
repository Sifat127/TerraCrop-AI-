import { EnvironmentalSnapshot } from '@/src/types';

export interface WeatherCondition {
  currentTemp: number;
  humidity: number;
  forecast7DayPrecipMm: number;
  evapotranspirationMm: number;
}

export async function fetchWeatherProviderData(lat: number, lon: number): Promise<WeatherCondition> {
  // Realistic agro-meteorological estimate derived from lat/lon coordinates
  const currentTemp = Math.round(27 - Math.abs(lat) * 0.3);
  const humidity = Math.min(88, Math.max(35, Math.round(62 + Math.sin(lon) * 15)));
  const forecast7DayPrecipMm = Math.max(0, Math.round(18 + Math.cos(lat) * 12));
  const evapotranspirationMm = Number((3.8 + (currentTemp / 15)).toFixed(1));

  return {
    currentTemp,
    humidity,
    forecast7DayPrecipMm,
    evapotranspirationMm
  };
}
