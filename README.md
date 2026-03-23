# 🌤️ Weather Dashboard

A beautiful, dark-themed weather application that lets you search for any city and get current weather information plus a 5-day forecast.

**No API keys needed!** Uses wttr.in API - a free weather service.

---

## ✨ Features

- 🔍 Search any city worldwide
- 🌡️ Current temperature, humidity, wind speed
- 📅 5-day weather forecast
- 💾 Save favorite cities (stored locally)
- 🌙 Beautiful dark theme with glassmorphism
- 📱 Fully responsive design

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| HTML5 | Page structure |
| CSS3 | Styling & animations |
| Vanilla JavaScript | Logic & API calls |
| wttr.in API | Weather data (free, no key) |
| localStorage | Save favorite cities |

---

## 📁 Project Structure

```
weather-dashboard/
├── index.html    → Main structure
├── style.css     → Dark theme styling
├── app.js        → JavaScript logic
└── README.md     → Documentation
```

---

## 🔍 How It Works

### 1. User Searches a City
```javascript
const city = cityInput.value.trim(); // e.g., "London"
```

### 2. API Call
```javascript
// wttr.in is a free weather API - no authentication needed!
const response = await fetch(`https://wttr.in/${city}?format=j1`);
const data = await response.json();
```

### 3. Parse Weather Data
```javascript
const weather = {
    city: data.nearest_area[0].areaName[0].value,
    temp: data.current_condition[0].temp_C,       // e.g., "22"
    humidity: data.current_condition[0].humidity, // e.g., "65"
    wind: data.current_condition[0].windspeedKmph,
    description: data.current_condition[0].weatherDesc[0].value
};
```

### 4. Update Display (DOM Manipulation)
```javascript
cityNameEl.textContent = `${weather.city}`;
tempEl.textContent = weather.temp + '°C';
```

---

## 🎨 CSS Concepts Used

### Dark Gradient Background
```css
body {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}
```

### Glassmorphism Cards
```css
.card {
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
}
```

### Responsive Grid
```css
.forecast-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
}
```

---

## 🔑 JavaScript Concepts

- **Async/Await** - Clean API calls without callback hell
- **Template Literals** - Easy string interpolation
- **Destructuring** - Clean variable extraction
- **localStorage** - Persist data in browser
- **DOM Manipulation** - Dynamic UI updates

---

## 🚀 Deployment

Deployed on **GitHub Pages** - every push to `main` automatically deploys.

**Live Demo:** https://utkarshwalia.github.io/weather-dashboard/

---

## 🎓 Learning Outcomes

After this project, you'll understand:
- ✅ Making API calls with `fetch()`
- ✅ JSON parsing and data extraction
- ✅ DOM manipulation
- ✅ localStorage for persistence
- ✅ CSS Grid + Flexbox layouts
- ✅ CSS gradients and glassmorphism
- ✅ Responsive design

---

## 🔮 Future Improvements

Ideas to extend this project:
1. **Geolocation** - Auto-detect user's city
2. **Unit Toggle** - Switch between °C and °F
3. **More APIs** - OpenWeatherMap for extended data
4. **Weather animations** - Rain, snow particles
5. **Hourly forecast** - 24-hour breakdown
6. **PWA support** - Make it installable

---

## 🙏 Credits

- **Weather API:** [wttr.in](https://wttr.in/) - Free weather API
- **Deployed on:** [GitHub Pages](https://pages.github.com/)

---

*Built as part of 30 days coding challenge 🚀*
