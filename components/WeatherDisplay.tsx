import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sun, Cloud, CloudRain, Snowflake, Cloudy, CloudFog, CloudLightning, Thermometer } from 'lucide-react';

const WeatherDisplay: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState({ code: 0, temperature: 0 });
  const [location, setLocation] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      // Fetch weather data
      axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`)
        .then(response => {
          setWeather({
            code: response.data.current_weather.weathercode,
            temperature: response.data.current_weather.temperature
          });
        })
        .catch(error => console.error('Error fetching weather data:', error));

      // Fetch location name (reverse geocoding)
      axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
        .then(response => {
          setLocation(response.data.address.city || response.data.address.town || response.data.address.village);
        })
        .catch(error => console.error('Error fetching location data:', error));
    });

    return () => clearInterval(timer);
  }, []);

  const getWeatherInfo = () => {
    // WMO Weather interpretation codes (WW)
    // https://open-meteo.com/en/docs
    switch(true) {
      case weather.code <= 1:
        return { icon: <Sun className="text-yellow-400" size={24} />, description: 'Clear sky' };
      case weather.code <= 3:
        return { icon: <Cloudy className="text-gray-400" size={24} />, description: 'Partly cloudy' };
      case weather.code <= 48:
        return { icon: <CloudFog className="text-gray-500" size={24} />, description: 'Foggy' };
      case weather.code <= 57:
        return { icon: <CloudRain className="text-blue-400" size={24} />, description: 'Drizzle' };
      case weather.code <= 67:
        return { icon: <CloudRain className="text-blue-500" size={24} />, description: 'Rain' };
      case weather.code <= 77:
        return { icon: <Snowflake className="text-blue-200" size={24} />, description: 'Snow' };
      case weather.code <= 82:
        return { icon: <CloudRain className="text-blue-600" size={24} />, description: 'Rain showers' };
      case weather.code <= 86:
        return { icon: <Snowflake className="text-blue-300" size={24} />, description: 'Snow showers' };
      case weather.code <= 99:
        return { icon: <CloudLightning className="text-yellow-500" size={24} />, description: 'Thunderstorm' };
      default:
        return { icon: <Cloud className="text-gray-400" size={24} />, description: 'Cloudy' };
    }
  };

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  };

  const weatherInfo = getWeatherInfo();

  return (
    <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          {weatherInfo.icon}
          <span className="ml-2 text-lg font-semibold">{weatherInfo.description}</span>
        </div>
        <div className="text-lg font-semibold">
          {formatTime(currentTime)}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Thermometer className="text-red-400" size={20} />
          <span className="ml-1 text-lg font-semibold">{weather.temperature.toFixed(1)}°C</span>
        </div>
        {location && <div className="text-sm">{location}</div>}
      </div>
    </div>
  );
};

export default WeatherDisplay;