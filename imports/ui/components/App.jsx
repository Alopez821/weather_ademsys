import { createSignal, createEffect } from 'solid-js';
import { Meteor } from 'meteor/meteor';
import WeatherInfo from './WeatherInfo';

const App = () => {
  const [location, setLocation] = createSignal('');
  const [weatherData, setWeatherData] = createSignal(null);
  const [loading, setLoading] = createSignal(true);
  
  
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({latitude,longitude});
          getWeatherData({latitude,longitude});
        },
        (error) => {
          console.error(error)
          alert('Error en la geolocalización.');
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      // Manejar la falta de soporte de geolocalización
    }
  };

  const getWeatherData = (location) => {
    Meteor.call('api/weather', location, (error, result) => {
      if (error) {
        alert('Error al obtener los datos del clima. Por favor, intente nuevamente más tarde.');
      } else {
        setWeatherData(result.weatherData);
      }
      
      setLoading(false);
    });
  };

  createEffect(() => {
    const handle = Meteor.subscribe('weatherData', getWeatherData().name);
    setLoading(false);
    return () => handle.stop();
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    getWeatherData(location());
  };

  return (
    <div class="container">
      <div class="weather__header">
        <form class="weather__search" onSubmit={handleFormSubmit}>
          <input
            type="text"
            placeholder="Search for a city..."
            class="weather__searchform"
            
            onInput={(e) => setLocation(e.target.value)}
          />
          <button type="submit">
            <i class="fas fa-search"></i>
          </button>
        
        </form>
        <div class="weather__units">
          <button type="submit" onClick={getCurrentLocation}>
            <i class="fas fa-map-marker-alt"></i>
          </button>
          <span class="weather_unit_celsius">&#176;C</span>
        </div>
      </div>
      {loading() ? (
        <p>Loading...</p>
      ) : (
        <WeatherInfo weatherData ={weatherData()} />
      )}
    </div>
  );
};

export default App;