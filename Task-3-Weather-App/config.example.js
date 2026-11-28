/**
 * WeatherTelemetry Pro - Configuration Example
 * Copy this file to `config.js` and insert your OpenWeatherMap API Key.
 * Notice: `config.js` is included in .gitignore to protect your secret key.
 */

const CONFIG = {
  // Obtain your free API key at https://openweathermap.org/api
  OPENWEATHER_API_KEY: 'YOUR_OPENWEATHERMAP_API_KEY_HERE',
  DEFAULT_CITY: 'London',
  UNITS: 'metric' // 'metric' for Celsius (°C) or 'imperial' for Fahrenheit (°F)
};

// Make available globally if run in browser
if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
}
