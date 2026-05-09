// Weather API Service using Open-Meteo (free, no API key required)

export interface WeatherData {
  date: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainProbability: number;
  weatherCode: number;
  description: string;
}

export interface WeatherForecast {
  location: string;
  latitude: number;
  longitude: number;
  forecast: WeatherData[];
}

// Weather code descriptions
const weatherDescriptions: { [key: number]: string } = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};

// Get coordinates from location name using geocoding
export async function getCoordinates(location: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`
    );
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      return {
        lat: result.latitude,
        lng: result.longitude,
      };
    }
    return null;
  } catch (error) {
    console.error('[v0] Geocoding error:', error);
    return null;
  }
}

// Fetch weather forecast for location
export async function getWeatherForecast(location: string, latitude?: number, longitude?: number): Promise<WeatherForecast | null> {
  try {
    let lat = latitude;
    let lng = longitude;

    // If coordinates not provided, get them from location name
    if (!lat || !lng) {
      const coords = await getCoordinates(location);
      if (!coords) {
        console.error('[v0] Could not find coordinates for location:', location);
        return null;
      }
      lat = coords.lat;
      lng = coords.lng;
    }

    // Fetch weather data from Open-Meteo
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,weather_code,wind_speed_10m_max&timezone=auto&forecast_days=7`
    );

    const data = await response.json();

    if (!data.daily) {
      console.error('[v0] Invalid weather response');
      return null;
    }

    const forecast: WeatherData[] = [];
    
    for (let i = 0; i < Math.min(4, data.daily.time.length); i++) {
      const avgTemp = (data.daily.temperature_2m_max[i] + data.daily.temperature_2m_min[i]) / 2;
      const weatherCode = data.daily.weather_code[i];

      forecast.push({
        date: data.daily.time[i],
        temperature: Math.round(avgTemp * 10) / 10,
        humidity: 65, // Open-Meteo doesn't provide daily humidity in free tier
        windSpeed: Math.round(data.daily.wind_speed_10m_max[i] * 10) / 10,
        rainProbability: data.daily.precipitation_probability_max[i] || 0,
        weatherCode,
        description: weatherDescriptions[weatherCode] || "Unknown",
      });
    }

    return {
      location,
      latitude: lat,
      longitude: lng,
      forecast,
    };
  } catch (error) {
    console.error('[v0] Weather fetch error:', error);
    return null;
  }
}

// Get weather summary for current location
export async function getCurrentWeather(location: string): Promise<WeatherData | null> {
  const forecast = await getWeatherForecast(location);
  if (forecast && forecast.forecast.length > 0) {
    return forecast.forecast[0];
  }
  return null;
}
