document.addEventListener("DOMContentLoaded", function() {
    const apiKey = '090f9db2615998134b1b11d40218fd42'; // OpenWeatherMap API key
    const forecastApiUrl = 'https://api.openweathermap.org/data/2.5/forecast';
    const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather';
    
    const searchBtn = document.getElementById('search');
    const backBtn = document.getElementById('back-btn');
    const locationInput = document.getElementById('location');
    const currentWeatherDiv = document.getElementById('current-weather');
    const errorDiv = document.getElementById('error-message');
    const loadingDiv = document.getElementById('loading');
    const forecastSection = document.getElementById('forecast-section');
    const appInfoSection = document.querySelector('.app-info-section');

    // Search button click event
    searchBtn.addEventListener('click', handleSearch);
    
    // Back button click event
    backBtn.addEventListener('click', goHome);
    
    // Enter key in input field
    locationInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSearch();
        }
    });

    // Clear input field event
    locationInput.addEventListener('input', function() {
        if (this.value.trim() === '') {
            goHome();
        }
    });

    function handleSearch() {
        const city = locationInput.value.trim();
        if (city === '') {
            showError('Please enter a city name');
            return;
        }
        
        fetchWeather(city);
        fetchForecast(city);
    }

    function goHome() {
        // Clear the input field
        locationInput.value = '';
        
        // Hide all weather sections
        currentWeatherDiv.style.display = 'none';
        errorDiv.style.display = 'none';
        loadingDiv.style.display = 'none';
        forecastSection.style.display = 'none';
        
        // Show the info section
        if (appInfoSection) {
            appInfoSection.style.display = 'block';
        }
        
        // Hide back button
        backBtn.style.display = 'none';
    }

    function fetchWeather(city) {
        showLoading(true);
        errorDiv.style.display = 'none';

        fetch(`${weatherApiUrl}?q=${city}&appid=${apiKey}&units=metric`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('City not found');
                }
                return response.json();
            })
            .then(data => {
                displayWeather(data);
                showLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
                showError('Unable to fetch weather data. Please check the city name and try again.');
                showLoading(false);
            });
    }

    function fetchForecast(city) {
        fetch(`${forecastApiUrl}?q=${city}&appid=${apiKey}&units=metric`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Forecast not available');
                }
                return response.json();
            })
            .then(data => {
                displayForecast(data);
            })
            .catch(error => {
                console.error('Error fetching forecast:', error);
            });
    }

    function displayWeather(data) {
        // Extract weather data
        const temp = Math.round(data.main.temp);
        const description = data.weather[0].main;
        const icon = data.weather[0].icon;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;
        const visibility = (data.visibility / 1000).toFixed(1); // Convert meters to km
        const pressure = data.main.pressure;
        const city = data.name;
        const country = data.sys.country;
        const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        // Get current date and time
        const now = new Date();
        const dateString = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        // Update DOM elements
        document.getElementById('temperature').textContent = `${temp}°C`;
        document.getElementById('description').textContent = description;
        document.getElementById('location-name').textContent = `${city}, ${country}`;
        document.getElementById('date-time').textContent = `${dateString} - ${timeString}`;
        document.getElementById('humidity').textContent = `${humidity}%`;
        document.getElementById('wind').textContent = `${windSpeed.toFixed(1)} m/s`;
        document.getElementById('visibility').textContent = `${visibility} km`;
        document.getElementById('pressure').textContent = `${pressure} hPa`;

        // Update weather icon
        const iconUrl = `https://openweathermap.org/img/wn/${icon}@4x.png`;
        document.getElementById('weather-icon').src = iconUrl;
        document.getElementById('weather-icon').alt = description;

        // Show the weather section and hide info section
        currentWeatherDiv.style.display = 'block';
        errorDiv.style.display = 'none';
        if (appInfoSection) {
            appInfoSection.style.display = 'none';
        }
        
        // Show back button
        backBtn.style.display = 'block';
    }

    function displayForecast(data) {
        const forecastList = data.list;
        const dailyForecasts = {};

        // Group forecasts by day (take every 8th item for daily forecast)
        forecastList.forEach((item, index) => {
            if (index % 8 === 0) { // Every 8th item is approximately 24 hours apart
                const date = new Date(item.dt * 1000);
                const dateKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                
                dailyForecasts[dateKey] = {
                    date: dateKey,
                    day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                    temp: Math.round(item.main.temp),
                    tempMax: Math.round(item.main.temp_max),
                    tempMin: Math.round(item.main.temp_min),
                    description: item.weather[0].main,
                    icon: item.weather[0].icon,
                    humidity: item.main.humidity,
                    windSpeed: item.wind.speed
                };
            }
        });

        // Build HTML for forecast cards
        const forecastContainer = document.getElementById('forecast');
        forecastContainer.innerHTML = '';
        
        Object.values(dailyForecasts).slice(0, 5).forEach(day => {
            const card = document.createElement('div');
            card.className = 'forecast-card';
            const iconUrl = `https://openweathermap.org/img/wn/${day.icon}@2x.png`;
            
            card.innerHTML = `
                <div class="forecast-day">${day.day}</div>
                <div class="forecast-date">${day.date}</div>
                <img src="${iconUrl}" alt="${day.description}" class="forecast-icon">
                <div class="forecast-description">${day.description}</div>
                <div class="forecast-temp">
                    <span class="temp-max">${day.tempMax}°</span>
                    <span class="temp-min">${day.tempMin}°</span>
                </div>
                <div class="forecast-details">
                    <p>Humidity: ${day.humidity}%</p>
                    <p>Wind: ${day.windSpeed.toFixed(1)} m/s</p>
                </div>
            `;
            
            forecastContainer.appendChild(card);
        });

        forecastSection.style.display = 'block';
    }

    function showLoading(show) {
        loadingDiv.style.display = show ? 'block' : 'none';
    }

    function showError(message) {
        errorDiv.style.display = 'block';
        errorDiv.querySelector('.error-text').textContent = message;
        currentWeatherDiv.style.display = 'none';
        forecastSection.style.display = 'none';
        if (appInfoSection) {
            appInfoSection.style.display = 'none';
        }
        
        // Show back button if input has text
        if (locationInput.value.trim() !== '') {
            backBtn.style.display = 'block';
        }
    }
});
