import { useState, useEffect } from 'react';
import axios from 'axios';
import { WiThermometer, WiHumidity, WiStrongWind } from 'react-icons/wi';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_BASE = process.env.REACT_APP_BACKEND_URL;
  const getWeatherByCity = async (cityName) => {
    if (!cityName) return;
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/weather?city=${cityName}`);
      setWeather(res.data);
      setCity(res.data.name);
      setError('');
    } catch (err) {
      setError('City not found');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherByCoords = async (lat, lon) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/weather?lat=${lat}&lon=${lon}`);
      setWeather(res.data);
      setCity(res.data.name);
      setError('');
    } catch (err) {
      setError('Could not detect location weather');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getWeatherByCoords(latitude, longitude);
        },
        () => {
          setError('Location access denied. Please enter a city manually.');
        }
      );
    } else {
      setError('Geolocation not supported by your browser');
    }
  }, []);

  const getWeatherIconUrl = (iconCode) =>
    `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  return (
    <div className="app-container">
      <h1>Weather App</h1>

      <div>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={() => getWeatherByCity(city)} disabled={!city}>
          Get Weather
        </button>
      </div>

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="weather-box">
          <h2>{weather.name}</h2>
          <img
            src={getWeatherIconUrl(weather.weather[0].icon)}
            alt={weather.weather[0].description}
          />
          <p className="description">{weather.weather[0].description}</p>

          <p className="weather-detail">
            <WiThermometer size={28} /> Temperature: {weather.main.temp} °C
          </p>
          <p className="weather-detail">
            <WiHumidity size={28} /> Humidity: {weather.main.humidity} %
          </p>
          <p className="weather-detail">
            <WiStrongWind size={28} /> Wind Speed: {weather.wind.speed} m/s
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
