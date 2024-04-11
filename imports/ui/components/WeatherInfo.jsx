import { createSignal, onCleanup, createEffect } from 'solid-js';
import { format } from 'date-fns';

const kelvinToCelsius = (kelvin) => {
  return kelvin - 273.15; 
};

const formatDateTime = (timestamp) => {
  return format(new Date(timestamp * 1000), "EEEE, MMMM d, yyyy 'at' h:mm a"); 
};

const WeatherInfo = (data) => {
  const [city, setCity] = createSignal(data.weatherData.name);
  const [datetime, setDatetime] = createSignal(formatDateTime(data.weatherData.dt));
  const [forecast, setForecast] = createSignal(data.weatherData.weather[0].main);
  const [icon, setIcon] = createSignal(`https://openweathermap.org/img/w/${data.weatherData.weather[0].icon}.png`); // Generar la URL del icono
  const [temperature, setTemperature] = createSignal(kelvinToCelsius(data.weatherData.main.temp).toFixed()); // Convertir temperatura de Kelvin a Celsius
  const [minTemperature, setMinTemperature] = createSignal(kelvinToCelsius(data.weatherData.main.temp_min).toFixed()); // Convertir temperatura mínima de Kelvin a Celsius
  const [maxTemperature, setMaxTemperature] = createSignal(kelvinToCelsius(data.weatherData.main.temp_max).toFixed()); // Convertir temperatura máxima de Kelvin a Celsius
  const [realFeel, setRealFeel] = createSignal(kelvinToCelsius(data.weatherData.main.feels_like).toFixed());
  const [humidity, setHumidity] = createSignal(data.weatherData.main.humidity);
  const [wind, setWind] = createSignal(data.weatherData.wind.speed);
  const [pressure, setPressure] = createSignal(data.weatherData.main.pressure);

  // Opcional: realizar acciones de limpieza cuando el componente se desmonte
  onCleanup(() => {
    // Realizar acciones de limpieza si es necesario
  });

  // Sobreescribir los cambios
  createEffect(() => {
    setCity(data.weatherData.name);
    setDatetime(formatDateTime(data.weatherData.dt));
    setForecast(data.weatherData.weather[0].main);
    setIcon(`https://openweathermap.org/img/w/${data.weatherData.weather[0].icon}.png`);
    setTemperature(kelvinToCelsius(data.weatherData.main.temp).toFixed());
    setMinTemperature(kelvinToCelsius(data.weatherData.main.temp_min).toFixed());
    setMaxTemperature(kelvinToCelsius(data.weatherData.main.temp_max).toFixed());
    setRealFeel(kelvinToCelsius(data.weatherData.main.feels_like).toFixed());
    setHumidity(data.weatherData.main.humidity);
    setWind(data.weatherData.wind.speed);
    setPressure(data.weatherData.main.pressure);
  });

  return (
    <>
      <div class="weather__body">
        <h1 class="weather__city">{city()}</h1>
        <div class="weather__datetime">{datetime()}</div>
        <div class="weather__forecast">{forecast()}</div>
        <div class = "iconTime">
          <img class="weather__icon" src={icon()} alt="Weather Icon" /> {/* Usar la etiqueta img para mostrar el icono */}
          <p class="weather__temperature">{temperature()}°</p>
        </div>
        <div class="weather__minmax">
          <p>Min: {minTemperature()}°</p>
          <p>Max: {maxTemperature()}°</p>
        </div>
      </div>
      <div class="weather__info">
        <div class="weather__card">
          <i class="fa-solid fa-temperature-full"></i>
          <div>
            <p>Real Feel</p>
            <p class="weather__realfeel">{realFeel()}°C</p>
          </div>
        </div>
        <div class="weather__card">
          <i class="fa-solid fa-droplet"></i>
          <div>
            <p>Humidity</p>
            <p class="weather__humidity">{humidity()}%</p>
          </div>
        </div>
        <div class="weather__card">
          <i class="fa-solid fa-wind"></i>
          <div>
            <p>Wind</p>
            <p class="weather__wind">{wind()} m/s</p> {/* Unidades de velocidad en m/s */}
          </div>
        </div>
        <div class="weather__card">
          <i class="fa-solid fa-gauge-high"></i>
          <div>
            <p>Pressure</p>
            <p class="weather__pressure">{pressure()} hPa</p> {/* Unidades de presión en hPa */}
          </div>
        </div>
      </div>
    </>
  );
};

export default WeatherInfo;


  