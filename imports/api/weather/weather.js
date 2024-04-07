import { Meteor } from 'meteor/meteor';

import { HTTP } from 'meteor/http';
import { WeatherData } from '../../configdb/mongodb';

Meteor.methods({
  updateWeatherData(location) {
    const apiKey = 'f75f4ae060ca11026fc92ee617d4e131';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${location}&lon=${location}&appid=${apiKey}`;

    try {
      const response = HTTP.get(apiUrl);
      const weatherData = response.data;

      // Actualizar los datos meteorológicos en la base de datos
      const filteredWeatherData = {
        latitud: weatherData.coord.lat,
        longitud: weatherData.coord.lon,
        cityId: weatherData.id,
        cityName: weatherData.name,
        country: weatherData.sys.country,
        weather: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon,
        temp: weatherData.main.temp,
        feels_like: weatherData.main.feels_like,
        sunrise: weatherData.sys.sunrise,
        sunset: weatherData.sys.sunset,
        pressure: weatherData.main.pressure,
        humidity: weatherData.main.humidity,
        wind_speed: weatherData.wind.speed,
        timestamp: weatherData.dt,
      };

      const existingData = WeatherData.findOne({ latitud: filteredWeatherData.latitud, longitud: filteredWeatherData.longitud });
      existingData ? WeatherData.update({ _id: existingData._id },{ $set: filteredWeatherData }) : WeatherData.insert(filteredWeatherData);
    } catch (error) {
        return `Error en los datos de  clima  para ${location}: ${error}`;
      }
    }
});