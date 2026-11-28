# Task 3: SkyPulse — Live Weather Telemetry Application

[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-brightgreen?style=flat&logo=github)](https://premjibon.github.io/Datheon_Full_Stack_Web_Development_Internship/Task-3-Weather-App/)
[![Internship](https://img.shields.io/badge/Datheon-Cohort_2026-blue)](https://datheon.in)
[![HTML5](https://img.shields.io/badge/HTML5-Semantic_Markup-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-Atmospheric_Gradients-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla_ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Fetch API](https://img.shields.io/badge/API-Fetch_&_Async/Await-0284c7)](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

A live meteorological telemetry application engineered with pure vanilla JavaScript, featuring real-time global city search, dynamic atmospheric gradients corresponding to local weather conditions, comprehensive atmospheric telemetry metrics, and a 5-day forecast projection engine built using `Array.map()`.

Built as **Task 3** of the **Datheon Full Stack Web Development Internship** (Cohort 2026, Application ID: `DT-2026-3JZXE`).

---

## 🌐 Live URL
- **GitHub Pages:** [https://premjibon.github.io/Datheon_Full_Stack_Web_Development_Internship/Task-3-Weather-App/](https://premjibon.github.io/Datheon_Full_Stack_Web_Development_Internship/Task-3-Weather-App/)

---

## ✨ Features & Technical Implementation

### 1. Asynchronous Fetch API with Defensive Error Handling
- Built with standard asynchronous `fetch()` pipelines utilizing `async / await` and robust `try ... catch` blocks.
- Gracefully intercepts HTTP error codes (e.g. 404 City Not Found, 401 Invalid Key, Network Offline) and displays user-friendly error banners with actionable suggestions.
- Interactive loading spinner with telemetry pulsation rings while network requests are in flight.

### 2. Dynamic Meteorological Background Gradients
- Dynamically analyzes incoming weather condition codes (weather IDs and day/night icon metadata):
  - ☀️ **Clear Sky (Day):** Radiant golden amber and cyan sky gradient.
  - 🌙 **Clear Sky (Night):** Midnight indigo and deep starry violet gradient.
  - ☁️ **Cloudy / Overcast:** Cool steel slate and atmospheric blue gradient.
  - 🌧️ **Rain / Drizzle:** Oceanic teal and dark rainy charcoal gradient.
  - ⚡ **Thunderstorm:** Electric purple and stormy shadow gradient.
  - ❄️ **Snow:** Frosty crystalline ice and silver gradient.
  - 🌫️ **Mist / Fog:** Hazy twilight grey gradient.

### 3. Detailed Atmospheric Telemetry Metrics
- **Current Temperature:** Large typography with feels-like, daily high, and daily low temperatures.
- **Humidity:** Percentage display with fill progress bar and comfort caption.
- **Wind Vector:** Wind speed (m/s or mph) accompanied by a dynamic rotating compass needle indicating exact meteorological degrees (0°–360°) and cardinal orientation.
- **Barometric Pressure:** Atmospheric pressure reading in hectopascals (hPa).
- **Visibility:** Line of sight measured in kilometers.
- **Solar Cycle:** Exact local sunrise, sunset times, and calculated daylight duration.
- **Cloudiness:** Cloud cover percentage with gauge bar.

### 4. 5-Day Meteorological Forecast Engine (`Array.map()`)
- Formats incoming multi-day forecast collections dynamically via JavaScript `Array.map()`.
- Generates responsive projection cards rendering day of the week, calendar date, weather condition icons, and daily maximum/minimum temperature spreads.

### 5. Multi-Unit Toggle & Geolocation
- **Unit Conversion:** One-click instant switching between Metric (°C, m/s) and Imperial (°F, mph).
- **GPS Coordinates:** Integrated browser Geolocation API (`navigator.geolocation`) with one-click location detection.

### 6. Zero-Secret Architecture & Seamless Evaluation Fallback
- Adheres to strict Git security protocols: no private API keys are ever committed to the repository.
- Includes a committed [`config.example.js`](./config.example.js) template, while `config.js` is automatically excluded in `.gitignore`.
- Features an **Instant High-Fidelity Demo Fallback Mode** (covering London, New York, Tokyo, Dubai, Paris, and Dhaka) allowing evaluators to immediately experience all features and dynamic gradients without needing to generate an external API key.

---

## 🛠️ Tech Stack & Tools

- **Markup:** Semantic HTML5 (OpenGraph, ARIA accessibility attributes)
- **Styling:** CSS3 (Custom Variables, Atmospheric Gradients, CSS Grid, Flexbox)
- **Scripting:** Vanilla JavaScript (ES6+, Fetch API, Async/Await, Array.map, DOM APIs)
- **APIs:** OpenWeatherMap API & Browser Geolocation API
- **Dependencies:** Zero external libraries or frameworks

---

## 📂 File Structure

```text
Task-3-Weather-App/
├── index.html                           # Semantic HTML markup & atmospheric layout
├── style.css                            # Dynamic meteorological gradients & responsive cards
├── script.js                            # Async Fetch API, try-catch, Array.map forecast engine
├── config.example.js                    # API key template configuration (safe for git)
├── README.md                            # Comprehensive Task 3 documentation
└── assets/                              # Weather assets & icons
```

---

## 🚀 How to Run Locally

1. Clone or navigate to the repository:
   ```bash
   git clone https://github.com/PremJibon/Datheon_Full_Stack_Web_Development_Internship.git
   cd Datheon_Full_Stack_Web_Development_Internship/Task-3-Weather-App
   ```
2. (Optional) Configure your personal OpenWeatherMap key:
   - Copy `config.example.js` to `config.js`.
   - Add your API key into `config.js`.
   - *(Or simply open the app directly to use the built-in instant demo simulation!)*
3. Open `index.html` in your browser.

---

## 👨‍💻 Developer & Evaluation Details

- **Author:** Shahed Hossain Prem
- **Internship ID:** DT-2026-3JZXE
- **Program:** Datheon Full Stack Web Development Internship (Cohort 2026)
- **Repository:** [PremJibon/Datheon_Full_Stack_Web_Development_Internship](https://github.com/PremJibon/Datheon_Full_Stack_Web_Development_Internship)
