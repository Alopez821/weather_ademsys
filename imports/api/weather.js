import { Meteor } from "meteor/meteor";
import { HTTP } from "meteor/http";
import { Mongo } from 'meteor/mongo';

// Crea una nueva colección en MongoDB
export const WeatherData = new Mongo.Collection("weatherData");

Meteor.publish("weatherData", function (cityId) {
  return WeatherData.find({ cityId });
});

Meteor.methods({
  "api/weather"(location) {
    const apiKey = "f75f4ae060ca11026fc92ee617d4e131";

    if (!location) {
      throw new Meteor.Error(
        "Invalid location",
        "La ubicación no puede estar vacía."
      );
    }

    const verify = (location, apiKey) => {

      let apiUrl = '';
      if (typeof location === "object") {
        const { latitude, longitude } = location;
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
      } else if (typeof location === "string") {
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;
      } else {
        throw new Error("Ubicación no válida");
      }
    
      return apiUrl;
    }

    try {
      const apiUrl = verify(location, apiKey);
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
        pressure: weatherData.main.pressure,
        humidity: weatherData.main.humidity,
        wind_speed: weatherData.wind.speed,
        timestamp: weatherData.dt,
      };

      //Existe ? Actualiza : insertar
      const existingData = WeatherData.findOne({cityId: filteredWeatherData.cityId});

      existingData ? WeatherData.update({ _id: existingData._id },{ $set: filteredWeatherData }) : WeatherData.insert(filteredWeatherData);

      //proximos 4 días
      // const urlForecast = `https://pro.openweathermap.org/data/2.5/forecast/hourly?q=${filteredWeatherData.cityName}&appid=${apiKey}`;
      // const weatherDataDay = HTTP.get(urlForecast);
      

      //radar fuvial ........

      
      return {
        weatherData,
        // weatherDataDay
      };
    } catch (error) {
      throw new Meteor.Error(
        "Server error",
        `Ocurrió un error al obtener el clima para ${location}.`
      );
    }
  },
});
