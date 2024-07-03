const API_KEY = '236c37569ef71befe2763914a676d496';
const submitBtn = document.getElementById('submit-btn');
const countryInput = document.getElementById('country-input');
const weatherInfo = document.getElementById('weather-info');
const airQualityInfo = document.getElementById('air-quality-info');
let map;
let marker;

submitBtn.addEventListener('click', () => {
    const country = countryInput.value.trim();
    if (country) {
        getWeatherData(country);
    } else {
        alert('Please enter a country name');
    }
});

function getWeatherData(country) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${country}&units=metric&appid=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            displayWeatherData(data);
            getAirQualityData(data.coord.lat, data.coord.lon);
            updateMap(data.coord.lat, data.coord.lon);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert('Could not fetch weather data. Please try again.');
        });
}

function displayWeatherData(data) {
    const { name, sys: { country, sunrise, sunset }, main: { temp, humidity, pressure }, wind: { speed }, coord: { lat, lon } } = data;
    weatherInfo.innerHTML = `
        <div class="weather-item"><strong>Location:</strong> ${name}, ${country}</div>
        <div class="weather-item"><strong>Temperature:</strong> ${temp} °C</div>
        <div class="weather-item"><strong>Humidity:</strong> ${humidity} %</div>
        <div class="weather-item"><strong>Pressure:</strong> ${pressure} hPa</div>
        <div class="weather-item"><strong>Wind Speed:</strong> ${speed} m/s</div>
        <div class="weather-item"><strong>Latitude:</strong> ${lat}</div>
        <div class="weather-item"><strong>Longitude:</strong> ${lon}</div>
        <div class="weather-item"><strong>Sunrise:</strong> ${formatTime(sunrise)}</div>
        <div class="weather-item"><strong>Sunset:</strong> ${formatTime(sunset)}</div>
    `;
}

function getAirQualityData(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
        .then(response => response.json())
        .then(data => displayAirQualityData(data))
        .catch(error => {
            console.error('Error fetching data:', error);
            alert('Could not fetch air quality data. Please try again.');
        });
}

function displayAirQualityData(data) {
    const { list: [{ main: { aqi } }] } = data;
    const airQuality = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
    airQualityInfo.innerHTML = `
        <div class="air-quality-item"><strong>Air Quality:</strong> ${airQuality[aqi - 1]}</div>
    `;
}

function initMap() {
    map = L.map('map').setView([20.5937, 78.9629], 5); // Center the map to India by default

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}

function updateMap(lat, lon) {
    const position = [lat, lon];
    map.setView(position, 10);

    if (marker) {
        marker.setLatLng(position);
    } else {
        marker = L.marker(position).addTo(map);
    }
}

function formatTime(timestamp) {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

// Initialize the map when the page loads
document.addEventListener('DOMContentLoaded', initMap);
