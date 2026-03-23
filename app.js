// Weather Dashboard App
// Uses wttr.in API - free, no API key required

const API_BASE = 'https://wttr.in';
const STORAGE_KEY = 'savedCities';

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const errorEl = document.getElementById('error');
const weatherContent = document.getElementById('weatherContent');
const cityNameEl = document.getElementById('cityName');
const dateEl = document.getElementById('date');
const tempEl = document.getElementById('temp');
const weatherIcon = document.getElementById('weatherIcon');
const weatherDescEl = document.getElementById('weatherDesc');
const humidityEl = document.getElementById('humidity');
const windEl = document.getElementById('wind');
const feelsLikeEl = document.getElementById('feelsLike');
const forecastContainer = document.getElementById('forecastContainer');
const savedCitiesContainer = document.getElementById('savedCities');

// Weather icons mapping for wttr.in
const weatherIcons = {
    'Sunny': '☀️',
    'Clear': '🌙',
    'Partly cloudy': '⛅',
    'Cloudy': '☁️',
    'Overcast': '☁️',
    'Mist': '🌫️',
    'Fog': '🌫️',
    'Rain': '🌧️',
    'Light rain': '🌦️',
    'Heavy rain': '🌧️',
    'Snow': '❄️',
    'Light snow': '🌨️',
    'Thunderstorm': '⛈️',
    'default': '🌡️'
};

// Get weather icon emoji
function getWeatherEmoji(description) {
    const desc = description.toLowerCase();
    for (const [key, emoji] of Object.entries(weatherIcons)) {
        if (desc.includes(key.toLowerCase())) {
            return emoji;
        }
    }
    return weatherIcons.default;
}

// Show error message
function showError(message) {
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
    weatherContent.classList.add('hidden');
}

// Clear error
function clearError() {
    errorEl.classList.add('hidden');
}

// Format date
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Get day name from date
function getDayName(dateStr) {
    const date = new Date(dateStr);
    const options = { weekday: 'short' };
    return date.toLocaleDateString('en-US', options);
}

// Parse wttr.in JSON response
function parseWeatherData(data) {
    const current = data.current_condition[0];
    const nearestArea = data.nearest_area ? data.nearest_area[0] : {};
    
    return {
        city: nearestArea.areaName ? nearestArea.areaName[0].value : 'Unknown',
        country: nearestArea.country ? nearestArea.country[0].value : '',
        temp: current.temp_C + '°C',
        feelsLike: current.FeelsLikeC + '°C',
        humidity: current.humidity + '%',
        wind: current.windspeedKmph + ' km/h',
        description: current.weatherDesc ? current.weatherDesc[0].value : 'Unknown',
        weatherIcon: getWeatherEmoji(current.weatherDesc ? current.weatherDesc[0].value : ''),
        observationTime: current.observation_time
    };
}

// Parse forecast data
function parseForecast(data) {
    const weather = data.weather;
    return weather.map((day, index) => ({
        date: day.date,
        dayName: index === 0 ? 'Today' : getDayName(day.date),
        maxTemp: day.maxtempC + '°',
        minTemp: day.mintempC + '°',
        description: day.hourly && day.hourly[4] ? day.hourly[4].weatherDesc[0].value : day.weatherDesc ? day.weatherDesc[0].value : '',
        icon: day.hourly && day.hourly[4] ? getWeatherEmoji(day.hourly[4].weatherDesc[0].value) : '🌡️'
    }));
}

// Fetch current weather
async function fetchWeather(city) {
    try {
        clearError();
        const response = await fetch(`${API_BASE}/${encodeURIComponent(city)}?format=j1`);
        
        if (!response.ok) {
            throw new Error('City not found');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        showError('City not found. Please check the name and try again.');
        return null;
    }
}

// Display current weather
function displayWeather(data) {
    const weather = parseWeatherData(data);
    
    cityNameEl.textContent = `${weather.city}, ${weather.country}`;
    dateEl.textContent = formatDate(new Date().toISOString().split('T')[0]);
    tempEl.textContent = weather.temp;
    weatherIcon.src = `${API_BASE}/png/${weather.city.toLowerCase().replace(/ /g, '+')}?lang=en`;
    weatherIcon.alt = weather.description;
    weatherDescEl.textContent = weather.description + ' ' + weather.weatherIcon;
    humidityEl.textContent = weather.humidity;
    windEl.textContent = weather.wind;
    feelsLikeEl.textContent = weather.feelsLike;
    
    weatherContent.classList.remove('hidden');
    
    // Update weather icon to emoji
    weatherIcon.style.display = 'none';
    const emojiSpan = document.createElement('span');
    emojiSpan.textContent = weather.weatherIcon;
    emojiSpan.style.cssText = 'font-size: 4rem;';
    weatherIcon.parentNode.insertBefore(emojiSpan, weatherIcon.nextSibling);
}

// Display forecast
function displayForecast(data) {
    const forecast = parseForecast(data);
    
    forecastContainer.innerHTML = forecast.map(day => `
        <div class="forecast-card">
            <div class="day">${day.dayName}</div>
            <div class="forecast-icon">${day.icon}</div>
            <div class="forecast-temp">${day.maxTemp} / ${day.minTemp}</div>
            <div class="forecast-desc">${day.description}</div>
        </div>
    `).join('');
}

// Search city
async function searchCity() {
    const city = cityInput.value.trim();
    
    if (!city) {
        showError('Please enter a city name');
        return;
    }
    
    const data = await fetchWeather(city);
    
    if (data) {
        displayWeather(data);
        displayForecast(data);
    }
}

// Get saved cities from localStorage
function getSavedCities() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
}

// Save city to localStorage
function saveCity(cityData) {
    const cities = getSavedCities();
    
    // Check if already saved
    const exists = cities.find(c => c.city.toLowerCase() === cityData.city.toLowerCase());
    if (exists) return;
    
    cities.push(cityData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
    renderSavedCities();
}

// Remove city from localStorage
function removeCity(cityName) {
    let cities = getSavedCities();
    cities = cities.filter(c => c.city.toLowerCase() !== cityName.toLowerCase());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
    renderSavedCities();
}

// Render saved cities
async function renderSavedCities() {
    const cities = getSavedCities();
    
    if (cities.length === 0) {
        savedCitiesContainer.innerHTML = '<p class="no-cities">No saved cities yet. Search and save one!</p>';
        return;
    }
    
    savedCitiesContainer.innerHTML = cities.map(cityData => `
        <div class="saved-card" onclick="loadCity('${cityData.city}')">
            <button class="delete-btn" onclick="event.stopPropagation(); removeCity('${cityData.city}')">×</button>
            <div class="city-name">${cityData.city}</div>
            <div class="city-temp">${cityData.temp}</div>
            <div>${cityData.icon}</div>
        </div>
    `).join('');
}

// Load a saved city
async function loadCity(cityName) {
    cityInput.value = cityName;
    await searchCity();
}

// Event listeners
searchBtn.addEventListener('click', searchCity);

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchCity();
    }
});

// Save button - add to current weather display
document.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' && !weatherContent.classList.contains('hidden')) {
        const city = cityNameEl.textContent.split(',')[0].trim();
        const temp = tempEl.textContent;
        const weather = parseWeatherData({ current_condition: [{ temp_C: temp.split('°')[0] }] });
        // Save with current weather data
        const cities = getSavedCities();
        if (!cities.find(c => c.city.toLowerCase() === city.toLowerCase())) {
            saveCity({ city, temp, icon: weather.weatherIcon });
        }
    }
});

// Add save button functionality
weatherContent.addEventListener('dblclick', () => {
    const city = cityNameEl.textContent.split(',')[0].trim();
    const temp = tempEl.textContent;
    const icon = weatherDescEl.textContent.split(' ').pop();
    saveCity({ city, temp, icon });
});

// Initialize
renderSavedCities();
