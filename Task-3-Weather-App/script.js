/**
 * SkyPulse - Live Weather Telemetry Application
 * Asynchronous Fetch API, Try-Catch Error Handling, Dynamic Meteorological Gradients,
 * 5-Day Array.map() Forecast Engine & Offline Demo Fallback.
 * Built for Datheon Full Stack Web Development Internship (Task 3).
 * Author: Shahed Hossain Prem
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. State & Constants
     ========================================================================== */
  const API_KEY_STORAGE = 'skypulse_api_key';
  const UNITS_STORAGE = 'skypulse_units';
  const THEME_STORAGE = 'skypulse_theme';

  let currentUnits = localStorage.getItem(UNITS_STORAGE) || 'metric'; // 'metric' (°C) | 'imperial' (°F)
  let currentCity = 'London';
  let cachedWeatherData = null;
  let cachedForecastData = null;

  /* High-Fidelity Simulation Dataset for 6 Global Cities */
  const DEMO_WEATHER_DATA = {
    london: {
      city: 'London',
      country: 'GB',
      tempC: 16.5,
      feelsLikeC: 15.8,
      tempMinC: 12.0,
      tempMaxC: 19.0,
      condition: 'Partly Cloudy',
      description: 'Scattered clouds over London',
      icon: '03d',
      weatherType: 'clouds-day',
      humidity: 68,
      windSpeedMs: 4.6,
      windDeg: 215,
      pressure: 1015,
      visibilityKm: 10.0,
      sunrise: '06:42 AM',
      sunset: '05:38 PM',
      clouds: 40,
      timezoneOffset: 0,
      forecast: [
        { day: 'Tue', date: 'Nov 24', tempC: 17, minC: 12, condition: 'Partly Cloudy', icon: '03d', type: 'clouds-day' },
        { day: 'Wed', date: 'Nov 25', tempC: 15, minC: 11, condition: 'Light Rain', icon: '10d', type: 'rain' },
        { day: 'Thu', date: 'Nov 26', tempC: 13, minC: 9, condition: 'Overcast', icon: '04d', type: 'clouds-day' },
        { day: 'Fri', date: 'Nov 27', tempC: 14, minC: 10, condition: 'Clear Sky', icon: '01d', type: 'clear-day' },
        { day: 'Sat', date: 'Nov 28', tempC: 16, minC: 11, condition: 'Partly Cloudy', icon: '02d', type: 'clouds-day' }
      ]
    },
    'new york': {
      city: 'New York',
      country: 'US',
      tempC: 12.2,
      feelsLikeC: 10.8,
      tempMinC: 8.5,
      tempMaxC: 15.0,
      condition: 'Clear Sky',
      description: 'Sunny skies over Manhattan',
      icon: '01d',
      weatherType: 'clear-day',
      humidity: 48,
      windSpeedMs: 6.2,
      windDeg: 310,
      pressure: 1021,
      visibilityKm: 10.0,
      sunrise: '06:55 AM',
      sunset: '04:35 PM',
      clouds: 10,
      timezoneOffset: -18000,
      forecast: [
        { day: 'Tue', date: 'Nov 24', tempC: 14, minC: 9, condition: 'Sunny', icon: '01d', type: 'clear-day' },
        { day: 'Wed', date: 'Nov 25', tempC: 11, minC: 7, condition: 'Breezy Clouds', icon: '02d', type: 'clouds-day' },
        { day: 'Thu', date: 'Nov 26', tempC: 10, minC: 5, condition: 'Rain Shower', icon: '09d', type: 'rain' },
        { day: 'Fri', date: 'Nov 27', tempC: 8, minC: 3, condition: 'Chilly & Clear', icon: '01d', type: 'clear-day' },
        { day: 'Sat', date: 'Nov 28', tempC: 11, minC: 6, condition: 'Sunny Intervals', icon: '02d', type: 'clear-day' }
      ]
    },
    tokyo: {
      city: 'Tokyo',
      country: 'JP',
      tempC: 18.0,
      feelsLikeC: 17.5,
      tempMinC: 14.0,
      tempMaxC: 21.0,
      condition: 'Light Rain',
      description: 'Gentle coastal rain shower',
      icon: '10d',
      weatherType: 'rain',
      humidity: 82,
      windSpeedMs: 3.8,
      windDeg: 160,
      pressure: 1008,
      visibilityKm: 8.5,
      sunrise: '06:22 AM',
      sunset: '04:30 PM',
      clouds: 75,
      timezoneOffset: 32400,
      forecast: [
        { day: 'Tue', date: 'Nov 24', tempC: 19, minC: 14, condition: 'Showers', icon: '10d', type: 'rain' },
        { day: 'Wed', date: 'Nov 25', tempC: 21, minC: 15, condition: 'Sunny & Clear', icon: '01d', type: 'clear-day' },
        { day: 'Thu', date: 'Nov 26', tempC: 20, minC: 13, condition: 'Mild Clouds', icon: '03d', type: 'clouds-day' },
        { day: 'Fri', date: 'Nov 27', tempC: 18, minC: 12, condition: 'Light Drizzle', icon: '09d', type: 'rain' },
        { day: 'Sat', date: 'Nov 28', tempC: 17, minC: 11, condition: 'Clear Sky', icon: '01d', type: 'clear-day' }
      ]
    },
    dubai: {
      city: 'Dubai',
      country: 'AE',
      tempC: 31.5,
      feelsLikeC: 33.0,
      tempMinC: 24.0,
      tempMaxC: 34.0,
      condition: 'Sunny & Warm',
      description: 'Clear blue skies with desert warmth',
      icon: '01d',
      weatherType: 'clear-day',
      humidity: 42,
      windSpeedMs: 4.1,
      windDeg: 290,
      pressure: 1013,
      visibilityKm: 10.0,
      sunrise: '06:40 AM',
      sunset: '05:32 PM',
      clouds: 5,
      timezoneOffset: 14400,
      forecast: [
        { day: 'Tue', date: 'Nov 24', tempC: 32, minC: 24, condition: 'Sunny', icon: '01d', type: 'clear-day' },
        { day: 'Wed', date: 'Nov 25', tempC: 31, minC: 23, condition: 'Clear Sky', icon: '01d', type: 'clear-day' },
        { day: 'Thu', date: 'Nov 26', tempC: 30, minC: 22, condition: 'Warm Breeze', icon: '01d', type: 'clear-day' },
        { day: 'Fri', date: 'Nov 27', tempC: 31, minC: 23, condition: 'Sunny', icon: '01d', type: 'clear-day' },
        { day: 'Sat', date: 'Nov 28', tempC: 32, minC: 24, condition: 'Clear Sky', icon: '01d', type: 'clear-day' }
      ]
    },
    paris: {
      city: 'Paris',
      country: 'FR',
      tempC: 14.8,
      feelsLikeC: 14.0,
      tempMinC: 9.5,
      tempMaxC: 17.5,
      condition: 'Overcast Clouds',
      description: 'Autumn overcast canopy',
      icon: '04d',
      weatherType: 'clouds-day',
      humidity: 74,
      windSpeedMs: 5.0,
      windDeg: 240,
      pressure: 1018,
      visibilityKm: 9.0,
      sunrise: '08:10 AM',
      sunset: '05:08 PM',
      clouds: 80,
      timezoneOffset: 3600,
      forecast: [
        { day: 'Tue', date: 'Nov 24', tempC: 15, minC: 10, condition: 'Cloudy', icon: '04d', type: 'clouds-day' },
        { day: 'Wed', date: 'Nov 25', tempC: 13, minC: 8, condition: 'Patchy Rain', icon: '10d', type: 'rain' },
        { day: 'Thu', date: 'Nov 26', tempC: 12, minC: 7, condition: 'Breezy Clouds', icon: '03d', type: 'clouds-day' },
        { day: 'Fri', date: 'Nov 27', tempC: 14, minC: 9, condition: 'Sunny Intervals', icon: '02d', type: 'clear-day' },
        { day: 'Sat', date: 'Nov 28', tempC: 13, minC: 8, condition: 'Overcast', icon: '04d', type: 'clouds-day' }
      ]
    },
    dhaka: {
      city: 'Dhaka',
      country: 'BD',
      tempC: 27.0,
      feelsLikeC: 28.5,
      tempMinC: 20.0,
      tempMaxC: 30.0,
      condition: 'Hazy Sunshine',
      description: 'Pleasant winter morning warmth',
      icon: '01d',
      weatherType: 'clear-day',
      humidity: 55,
      windSpeedMs: 2.5,
      windDeg: 110,
      pressure: 1012,
      visibilityKm: 7.0,
      sunrise: '06:18 AM',
      sunset: '05:11 PM',
      clouds: 15,
      timezoneOffset: 21600,
      forecast: [
        { day: 'Tue', date: 'Nov 24', tempC: 28, minC: 20, condition: 'Sunny', icon: '01d', type: 'clear-day' },
        { day: 'Wed', date: 'Nov 25', tempC: 28, minC: 19, condition: 'Clear Sky', icon: '01d', type: 'clear-day' },
        { day: 'Thu', date: 'Nov 26', tempC: 27, minC: 19, condition: 'Hazy Sun', icon: '01d', type: 'clear-day' },
        { day: 'Fri', date: 'Nov 27', tempC: 28, minC: 20, condition: 'Warm & Clear', icon: '01d', type: 'clear-day' },
        { day: 'Sat', date: 'Nov 28', tempC: 29, minC: 20, condition: 'Sunny', icon: '01d', type: 'clear-day' }
      ]
    }
  };

  /* ==========================================================================
     2. DOM Element Selectors
     ========================================================================== */
  const rootElement = document.documentElement;

  // Header & Controls
  const unitCBtn = document.getElementById('unit-c-btn');
  const unitFBtn = document.getElementById('unit-f-btn');
  const themeToggleBtn = document.getElementById('theme-toggle');
  const apiSettingsBtn = document.getElementById('api-settings-btn');

  // Search
  const searchForm = document.getElementById('weather-search-form');
  const cityInput = document.getElementById('city-input');
  const geoBtn = document.getElementById('geo-btn');
  const cityPills = document.querySelectorAll('.city-pill');

  // Status & Feedback
  const errorBanner = document.getElementById('error-banner');
  const errorTitle = document.getElementById('error-title');
  const errorMessage = document.getElementById('error-message');
  const closeErrorBtn = document.getElementById('close-error-btn');
  const loadingState = document.getElementById('loading-state');
  const weatherDashboard = document.getElementById('weather-dashboard');

  // Hero Card Fields
  const cityNameEl = document.getElementById('city-name');
  const countryCodeEl = document.getElementById('country-code');
  const currentLocalTimeEl = document.getElementById('current-local-time');
  const currentTempEl = document.getElementById('current-temp');
  const feelsLikeEl = document.getElementById('feels-like');
  const tempMaxEl = document.getElementById('temp-max');
  const tempMinEl = document.getElementById('temp-min');
  const weatherIconImg = document.getElementById('weather-icon-img');
  const weatherConditionEl = document.getElementById('weather-condition');
  const weatherDescEl = document.getElementById('weather-desc');

  // Telemetry Metrics Fields
  const valHumidity = document.getElementById('val-humidity');
  const barHumidity = document.getElementById('bar-humidity');
  const valWind = document.getElementById('val-wind');
  const unitWind = document.getElementById('unit-wind');
  const valWindDir = document.getElementById('val-wind-dir');
  const windDirArrow = document.getElementById('wind-direction-arrow');
  const valPressure = document.getElementById('val-pressure');
  const valVisibility = document.getElementById('val-visibility');
  const valSunrise = document.getElementById('val-sunrise');
  const valSunset = document.getElementById('val-sunset');
  const valClouds = document.getElementById('val-clouds');
  const barClouds = document.getElementById('bar-clouds');

  // 5-Day Forecast Grid
  const forecastGrid = document.getElementById('forecast-grid');

  // API Modal
  const apiModal = document.getElementById('api-modal');
  const closeApiModalBtn = document.getElementById('close-api-modal-btn');
  const apiKeyInput = document.getElementById('api-key-input');
  const saveApiKeyBtn = document.getElementById('save-api-key-btn');
  const useDemoDataBtn = document.getElementById('use-demo-data-btn');
  const apiModeText = document.getElementById('api-mode-text');

  /* ==========================================================================
     3. Helper Utilities (Temperature, Time, Wind, Gradients)
     ========================================================================== */
  const cToF = (c) => Math.round((c * 9) / 5 + 32);

  const formatTemp = (celsius) => {
    if (celsius === null || celsius === undefined || isNaN(celsius)) return '--';
    if (currentUnits === 'imperial') {
      return `${cToF(celsius)}°`;
    }
    return `${Math.round(celsius)}°`;
  };

  const getWindDirectionCardinal = (deg) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const idx = Math.round(deg / 22.5) % 16;
    return directions[idx];
  };

  const mapWeatherCodeToClass = (weatherId, iconCode) => {
    const isNight = iconCode && iconCode.endsWith('n');

    if (weatherId >= 200 && weatherId < 300) return 'thunderstorm';
    if (weatherId >= 300 && weatherId < 600) return 'rain';
    if (weatherId >= 600 && weatherId < 700) return 'snow';
    if (weatherId >= 700 && weatherId < 800) return 'mist';
    if (weatherId === 800) return isNight ? 'clear-night' : 'clear-day';
    if (weatherId > 800) return isNight ? 'clouds-night' : 'clouds-day';

    return isNight ? 'clear-night' : 'clear-day';
  };

  const updateBackgroundGradient = (weatherType) => {
    rootElement.setAttribute('data-weather', weatherType || 'clear-day');
  };

  /* ==========================================================================
     4. Dynamic 5-Day Forecast Generation (Array.map())
     ========================================================================== */
  const renderForecastCards = (forecastItems) => {
    if (!forecastItems || !forecastItems.length) {
      forecastGrid.innerHTML = '<p class="error-text">No forecast telemetry available.</p>';
      return;
    }

    // Requirements: "Display 5-day forecast cards using Array.map()"
    const cardsHTML = forecastItems
      .slice(0, 5)
      .map((item) => {
        const iconUrl = item.icon
          ? `https://openweathermap.org/img/wn/${item.icon}@2x.png`
          : 'https://openweathermap.org/img/wn/02d@2x.png';

        return `
          <article class="forecast-card" data-weather="${item.type || 'clear-day'}">
            <span class="forecast-day">${item.day}</span>
            <span class="forecast-date">${item.date}</span>
            <img src="${iconUrl}" alt="${item.condition}" class="forecast-icon" loading="lazy">
            <span class="forecast-condition">${item.condition}</span>
            <div class="forecast-temps">
              <span class="forecast-max">${formatTemp(item.tempC)}</span>
              <span class="forecast-min">${formatTemp(item.minC)}</span>
            </div>
          </article>
        `;
      })
      .join('');

    forecastGrid.innerHTML = cardsHTML;
  };

  /* ==========================================================================
     5. Render Dashboard with Telemetry Data
     ========================================================================== */
  const renderDashboard = (data) => {
    cachedWeatherData = data;

    // Header & Meta
    cityNameEl.textContent = data.city;
    countryCodeEl.textContent = data.country;
    currentLocalTimeEl.textContent = `Local Time: ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    // Main Temperatures
    currentTempEl.textContent = formatTemp(data.tempC);
    feelsLikeEl.textContent = `Feels like ${formatTemp(data.feelsLikeC)}`;
    tempMaxEl.textContent = formatTemp(data.tempMaxC);
    tempMinEl.textContent = formatTemp(data.tempMinC);

    // Weather Condition & Icon
    weatherConditionEl.textContent = data.condition;
    weatherDescEl.textContent = data.description;
    const iconCode = data.icon || '01d';
    weatherIconImg.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    weatherIconImg.alt = data.condition;

    // Telemetry Cards
    valHumidity.textContent = data.humidity;
    barHumidity.style.width = `${Math.min(data.humidity, 100)}%`;

    if (currentUnits === 'imperial') {
      const windMph = Math.round(data.windSpeedMs * 2.23694 * 10) / 10;
      valWind.textContent = windMph;
      unitWind.textContent = 'mph';
    } else {
      valWind.textContent = data.windSpeedMs;
      unitWind.textContent = 'm/s';
    }

    const cardinal = getWindDirectionCardinal(data.windDeg);
    valWindDir.textContent = `${cardinal} (${data.windDeg}°)`;
    windDirArrow.style.transform = `rotate(${data.windDeg}deg)`;

    valPressure.textContent = data.pressure;
    valVisibility.textContent = data.visibilityKm.toFixed(1);

    valSunrise.textContent = data.sunrise;
    valSunset.textContent = data.sunset;

    valClouds.textContent = data.clouds;
    barClouds.style.width = `${Math.min(data.clouds, 100)}%`;

    // Dynamic Atmosphere Background
    updateBackgroundGradient(data.weatherType);

    // Render 5-Day Forecast with Array.map()
    if (data.forecast) {
      cachedForecastData = data.forecast;
      renderForecastCards(data.forecast);
    }
  };

  /* ==========================================================================
     6. Asynchronous Fetch API Engine (With Try-Catch)
     ========================================================================== */
  const fetchLiveWeather = async (query) => {
    hideError();
    showLoading();

    const normalizedQuery = query.trim().toLowerCase();
    const storedApiKey = localStorage.getItem(API_KEY_STORAGE);
    const windowApiKey = (typeof window.CONFIG !== 'undefined' && window.CONFIG.OPENWEATHER_API_KEY !== 'YOUR_OPENWEATHERMAP_API_KEY_HERE')
      ? window.CONFIG.OPENWEATHER_API_KEY
      : null;

    const apiKey = storedApiKey || windowApiKey;

    // If no custom API key provided, fall back to high-fidelity live demo simulator
    if (!apiKey) {
      await simulateDemoFetch(normalizedQuery);
      return;
    }

    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query)}&units=metric&appid=${apiKey}`;
      const response = await fetch(weatherUrl);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`City "${query}" was not found. Please verify spelling.`);
        } else if (response.status === 401) {
          throw new Error('Invalid OpenWeatherMap API key. Switched to demo mode.');
        } else {
          throw new Error(`Weather service returned HTTP status ${response.status}.`);
        }
      }

      const weatherJSON = await response.json();

      // Fetch 5-Day Forecast
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(query)}&units=metric&appid=${apiKey}`;
      const forecastResp = await fetch(forecastUrl);
      let forecastItems = [];

      if (forecastResp.ok) {
        const forecastJSON = await forecastResp.json();
        // Filter forecast to 1 daily interval at midday
        const dailyPoints = forecastJSON.list.filter((item) => item.dt_txt.includes('12:00:00'));
        forecastItems = (dailyPoints.length ? dailyPoints : forecastJSON.list.slice(0, 5)).map((item) => {
          const d = new Date(item.dt * 1000);
          return {
            day: d.toLocaleDateString(undefined, { weekday: 'short' }),
            date: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            tempC: item.main.temp,
            minC: item.main.temp_min,
            condition: item.weather[0].main,
            icon: item.weather[0].icon,
            type: mapWeatherCodeToClass(item.weather[0].id, item.weather[0].icon)
          };
        });
      }

      // Convert OpenWeather response into telemetry object
      const sunriseDate = new Date(weatherJSON.sys.sunrise * 1000);
      const sunsetDate = new Date(weatherJSON.sys.sunset * 1000);

      const parsedData = {
        city: weatherJSON.name,
        country: weatherJSON.sys.country || '',
        tempC: weatherJSON.main.temp,
        feelsLikeC: weatherJSON.main.feels_like,
        tempMinC: weatherJSON.main.temp_min,
        tempMaxC: weatherJSON.main.temp_max,
        condition: weatherJSON.weather[0].main,
        description: weatherJSON.weather[0].description,
        icon: weatherJSON.weather[0].icon,
        weatherType: mapWeatherCodeToClass(weatherJSON.weather[0].id, weatherJSON.weather[0].icon),
        humidity: weatherJSON.main.humidity,
        windSpeedMs: weatherJSON.wind.speed,
        windDeg: weatherJSON.wind.deg || 0,
        pressure: weatherJSON.main.pressure,
        visibilityKm: (weatherJSON.visibility || 10000) / 1000,
        sunrise: sunriseDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sunset: sunsetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        clouds: weatherJSON.clouds ? weatherJSON.clouds.all : 0,
        forecast: forecastItems
      };

      currentCity = weatherJSON.name;
      renderDashboard(parsedData);
      hideLoading();
    } catch (err) {
      console.warn('Live API request failed or invalid key:', err.message);
      // Graceful fallback: check if requested city exists in demo set
      if (DEMO_WEATHER_DATA[normalizedQuery]) {
        showError('API Notice', `${err.message} Demonstrating with verified telemetry for ${query}.`);
        await simulateDemoFetch(normalizedQuery, false);
      } else {
        hideLoading();
        showError('Location Error', err.message);
      }
    }
  };

  /* High-Fidelity Simulation Runner */
  const simulateDemoFetch = async (cityName, withDelay = true) => {
    if (withDelay) {
      await new Promise((resolve) => setTimeout(resolve, 380));
    }

    const data = DEMO_WEATHER_DATA[cityName] || DEMO_WEATHER_DATA['london'];

    if (!DEMO_WEATHER_DATA[cityName]) {
      showError('Demo Mode Active', `Showing closest simulation for London. Add an API Key to query all 200,000+ cities globally.`);
    }

    currentCity = data.city;
    renderDashboard(data);
    hideLoading();
  };

  /* Geolocation Fetch */
  const fetchWeatherByCoords = async (lat, lon) => {
    hideError();
    showLoading();
    const storedApiKey = localStorage.getItem(API_KEY_STORAGE);

    if (!storedApiKey) {
      // Simulate near current location in demo mode
      await simulateDemoFetch('dhaka');
      showError('Demo Mode', 'Using local regional telemetry (Dhaka). Add an OpenWeatherMap API Key in Settings for live GPS coordinates.');
      return;
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${storedApiKey}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Could not fetch weather for coordinates.');
      const data = await response.json();
      await fetchLiveWeather(data.name);
    } catch (err) {
      hideLoading();
      showError('GPS Error', err.message);
    }
  };

  /* ==========================================================================
     7. UI Feedback Helpers (Loading & Error States)
     ========================================================================== */
  const showLoading = () => {
    loadingState.style.display = 'block';
    weatherDashboard.style.opacity = '0.35';
    weatherDashboard.style.pointerEvents = 'none';
  };

  const hideLoading = () => {
    loadingState.style.display = 'none';
    weatherDashboard.style.opacity = '1';
    weatherDashboard.style.pointerEvents = 'auto';
  };

  const showError = (title, message) => {
    errorTitle.textContent = title;
    errorMessage.textContent = message;
    errorBanner.style.display = 'flex';
  };

  const hideError = () => {
    errorBanner.style.display = 'none';
  };

  if (closeErrorBtn) {
    closeErrorBtn.addEventListener('click', hideError);
  }

  /* ==========================================================================
     8. Event Listeners (Search, Geolocation, Pills, Units)
     ========================================================================== */
  // City Search Form
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = cityInput.value.trim();
    if (val) {
      fetchLiveWeather(val);
      cityInput.blur();
    }
  });

  // Trending City Pills
  cityPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const city = pill.getAttribute('data-city');
      cityInput.value = city;
      fetchLiveWeather(city);
    });
  });

  // GPS Geolocation Button
  geoBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
      showError('Not Supported', 'Geolocation is not supported by your browser.');
      return;
    }

    showLoading();
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude);
      },
      (error) => {
        hideLoading();
        showError('Location Permission', 'GPS location access was denied. Search manually above.');
      },
      { timeout: 8000 }
    );
  });

  // Unit Toggles (°C / °F)
  const applyUnits = (unit) => {
    currentUnits = unit;
    localStorage.setItem(UNITS_STORAGE, unit);

    unitCBtn.classList.toggle('active', unit === 'metric');
    unitFBtn.classList.toggle('active', unit === 'imperial');

    if (cachedWeatherData) {
      renderDashboard(cachedWeatherData);
    }
  };

  unitCBtn.addEventListener('click', () => applyUnits('metric'));
  unitFBtn.addEventListener('click', () => applyUnits('imperial'));

  // Theme Toggle (Dark / Light)
  const initTheme = () => {
    const savedTheme = localStorage.getItem(THEME_STORAGE) || 'dark';
    rootElement.setAttribute('data-theme', savedTheme);
  };

  themeToggleBtn.addEventListener('click', () => {
    const cur = rootElement.getAttribute('data-theme') || 'dark';
    const next = cur === 'dark' ? 'light' : 'dark';
    rootElement.setAttribute('data-theme', next);
    localStorage.setItem(THEME_STORAGE, next);
  });

  /* ==========================================================================
     9. API Key Settings Modal (<dialog>)
     ========================================================================== */
  const openApiModal = () => {
    const key = localStorage.getItem(API_KEY_STORAGE) || '';
    apiKeyInput.value = key;
    apiModeText.textContent = key
      ? 'Connected (Personal OpenWeatherMap API)'
      : 'Simulation Demo Mode (Instant Evaluation)';

    if (typeof apiModal.showModal === 'function') {
      apiModal.showModal();
    } else {
      apiModal.setAttribute('open', '');
    }
    apiKeyInput.focus();
  };

  const closeApiModal = () => {
    if (typeof apiModal.close === 'function') {
      apiModal.close();
    } else {
      apiModal.removeAttribute('open');
    }
  };

  apiSettingsBtn.addEventListener('click', openApiModal);
  closeApiModalBtn.addEventListener('click', closeApiModal);

  apiModal.addEventListener('click', (e) => {
    const rect = apiModal.getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      closeApiModal();
    }
  });

  saveApiKeyBtn.addEventListener('click', () => {
    const val = apiKeyInput.value.trim();
    if (val) {
      localStorage.setItem(API_KEY_STORAGE, val);
      closeApiModal();
      fetchLiveWeather(currentCity);
    }
  });

  useDemoDataBtn.addEventListener('click', () => {
    localStorage.removeItem(API_KEY_STORAGE);
    apiKeyInput.value = '';
    closeApiModal();
    fetchLiveWeather(currentCity);
  });

  /* ==========================================================================
     10. App Initialization
     ========================================================================== */
  initTheme();
  applyUnits(currentUnits);
  fetchLiveWeather(currentCity);
});
