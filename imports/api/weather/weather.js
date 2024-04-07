import {Meteor} from 'meteor/meteor';

import { HTTP } from "meteor/http";
import { WeatherData } from "../../configdb/mongodb";


Meteor.publish('weatherData', function () {
  async function getWeatherData(lat, lon) {
    try {
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=f75f4ae060ca11026fc92ee617d4e131`;
  
      const response = HTTP.get(apiUrl);
  
      const weatherData = response.data;
  
      // Filtra los datos meteorológicos
      const filteredWeatherData = {
        latitud: lat,
        longitud: lon,
        temp: weatherData.main.temp,
        feels_like: weatherData.main.feels_like,
        sunrise: weatherData.sys.sunrise,
        sunset: weatherData.sys.sunset,
        weather: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon,
        pressure: weatherData.main.pressure,
        humidity: weatherData.main.humidity,
        wind_speed: weatherData.wind,
        timestamp: new Date(),
        cityName: weatherData.name,
        cityId: weatherData.id,
        country: weatherData.sys.country
      };
  
    
      // Busca si existe un documento con la misma latitud y longitud
      const { latitud, longitud, ...otrosDatos } = filteredWeatherData;
      const existingData = WeatherData.findOne({ latitud, longitud });
  
      //Existe ? actualiza : insertar
      existingData ? WeatherData.update({ _id: existingData._id }, { $set: otrosDatos }) : WeatherData.insert(filteredWeatherData);
  
      //Mapa de lluvia
      //http://maps.openweathermap.org/maps/2.0/weather/PA0/{z}/{x}/{y}?date=1552861800&appid={API key}
  
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error(
          "Error de autenticación: la clave API de OpenWeatherMap es incorrecta o no tiene permisos suficientes"
        );
      } else {
        console.error(error);
      }
    }
  }
  
  getWeatherData(40.7128, -74.006);

  return WeatherData.find();
});
