'use client';

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { MOCK_FARMS, MOCK_DEVICES, MOCK_FINANCE, MOCK_SCHEDULES, MOCK_USER } from '@/lib/mock-data';
import { Language, translations } from '@/lib/translations';

interface LocationData {
  display: string;
  city: string;
  state: string;
  loading: boolean;
}

interface WeatherData {
  temp: number | null;
  humidity: number | null;
  condition: string;
  weatherCode: number;
  loading: boolean;
}

interface FarmingContextType {
  farms: typeof MOCK_FARMS;
  setFarms: React.Dispatch<React.SetStateAction<typeof MOCK_FARMS>>;
  devices: typeof MOCK_DEVICES;
  setDevices: React.Dispatch<React.SetStateAction<typeof MOCK_DEVICES>>;
  schedules: typeof MOCK_SCHEDULES;
  setSchedules: React.Dispatch<React.SetStateAction<typeof MOCK_SCHEDULES>>;
  selectedCrop: string;
  setSelectedCrop: (crop: string) => void;
  finance: typeof MOCK_FINANCE;
  location: LocationData;
  weather: WeatherData;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.english;
}

const FarmingContext = createContext<FarmingContextType | null>(null);

const getWeatherCondition = (code: number) => {
  if (code === 0) return { label: "Sunny", color: "text-yellow-500" };
  if (code <= 3) return { label: "Partly Cloudy", color: "text-yellow-600" };
  if (code <= 48) return { label: "Foggy", color: "text-gray-400" };
  if (code <= 67) return { label: "Rainy", color: "text-blue-500" };
  if (code <= 82) return { label: "Showers", color: "text-blue-600" };
  if (code >= 95) return { label: "Thunderstorm", color: "text-purple-600" };
  return { label: "Clear", color: "text-yellow-500" };
};

export const FarmingProvider = ({ children }: { children: React.ReactNode }) => {
  const [farms, setFarms] = useState(MOCK_FARMS);
  const [devices, setDevices] = useState(MOCK_DEVICES);
  const [schedules, setSchedules] = useState(MOCK_SCHEDULES);
  const [selectedCrop, setSelectedCrop] = useState("Wheat");
  const [language, setLanguage] = useState<Language>('english');
  
  const t = useMemo(() => translations[language], [language]);

  const [location, setLocation] = useState<LocationData>({
    display: `${MOCK_USER.village}, ${MOCK_USER.district}`,
    city: MOCK_USER.district,
    state: MOCK_USER.state,
    loading: true
  });
  const [weather, setWeather] = useState<WeatherData>({
    temp: null,
    humidity: null,
    condition: "Loading...",
    weatherCode: 0,
    loading: true
  });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Fetch Location
            const locRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`);
            const locData = await locRes.json();
            if (locData.address) {
              const city = locData.address.city || locData.address.town || locData.address.district || "";
              const state = locData.address.state || "";
              const village = locData.address.village || locData.address.suburb || "";
              setLocation({
                display: [village, city, state].filter(Boolean).join(", "),
                city,
                state,
                loading: false
              });
            }

            // Fetch Weather
            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code`);
            const weatherData = await weatherRes.json();
            if (weatherData.current) {
              const cond = getWeatherCondition(weatherData.current.weather_code);
              setWeather({
                temp: Math.round(weatherData.current.temperature_2m),
                humidity: Math.round(weatherData.current.relative_humidity_2m),
                weatherCode: weatherData.current.weather_code,
                condition: cond.label,
                loading: false
              });
            }
          } catch (error) {
            console.error("Location/Weather fetch failed", error);
            setLocation(prev => ({ ...prev, loading: false }));
            setWeather(prev => ({ ...prev, loading: false }));
          }
        },
        () => {
          setLocation(prev => ({ ...prev, loading: false }));
          setWeather(prev => ({ ...prev, loading: false }));
        }
      );
    }
  }, []);

  const finance = useMemo(() => {
    const baseProfit = 80000;
    const baseLoss = 12000;
    const farmProfit = farms.reduce((acc, farm) => acc + (parseFloat(farm.area) * 15000), 0);
    const deviceCost = (devices.length * 1200) + (devices.filter(d => d.status === 'ON').length * 2500);

    const multipliers: Record<string, number> = {
      "Wheat": 1.2, "Rice (Paddy)": 1.1, "Maize (Corn)": 1.4, "Makhana (Foxnut)": 2.5, "Potato": 1.6,
    };
    const multiplier = multipliers[selectedCrop] || 1.0;

    const calculatedProfit = Math.round((baseProfit + farmProfit) * multiplier);
    return {
      ...MOCK_FINANCE,
      total_profit: `₹${calculatedProfit.toLocaleString()}`,
      total_loss: `₹${deviceCost.toLocaleString()}`,
      prediction: `Based on your current location in ${location.city}, ${selectedCrop} is a ${multiplier > 1.5 ? 'highly strategic' : 'stable'} choice. ${selectedCrop === 'Makhana (Foxnut)' && location.state === 'Bihar' ? 'Your Bihar location is world-class for Makhana.' : ''} With ${weather.temp}°C and ${weather.humidity}% humidity, we project optimal growth conditions for your ${farms.length} plots.`
    };
  }, [farms, devices, selectedCrop, location, weather]);

  return (
    <FarmingContext.Provider value={{
      farms, setFarms,
      devices, setDevices,
      schedules, setSchedules,
      selectedCrop, setSelectedCrop,
      finance,
      location,
      weather,
      language,
      setLanguage,
      t
    }}>
      {children}
    </FarmingContext.Provider>
  );
};

export const useFarming = () => {
  const context = useContext(FarmingContext);
  if (!context) throw new Error('useFarming must be used within a FarmingProvider');
  return context;
};
