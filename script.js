
document.addEventListener("DOMContentLoaded", function() {
  const apiKey = '090f9db2615998134b1b11d40218fd42'; // Replace with your actual API key

  // Function to handle search button click and fetch weather data
  function handleSearch() {
      const cityInput = document.getElementById('location').value;
      if (cityInput.trim() !== '') {
          fetchWeather(cityInput);
      } else {
          alert('Please enter a location.');
      }
  }

  // Event listener for search button click
  document.getElementById('search').addEventListener('click', function(event) {
      event.preventDefault(); // Prevent the default form submission behavior
      handleSearch();
  });

  // Event listener for pressing 'Enter' key in the input field
  document.getElementById('location').addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
          event.preventDefault(); // Prevent the default form submission behavior
          handleSearch();
      }
  });

  // Function to fetch weather data
  function fetchWeather(city) {
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
          .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              return response.json();
          })
          .then(data => {
              // Extract relevant weather information from the API response
              const visibility = data.visibility;
              const humidity = data.main.humidity;
              const windSpeed = data.wind.speed;

              // Update the user interface to display weather data
              document.getElementById('visibility').textContent = `Visibility: ${visibility} meters`;
              document.getElementById('humidity').textContent = `Humidity: ${humidity}%`;
              document.getElementById('wind').textContent = `Wind Speed: ${windSpeed} m/s`;

              // Update the text content in the cloudytext section
              document.getElementById('visibilityText').textContent = `Visibility: ${visibility} meters`;
              document.getElementById('humidityText').textContent = `Humidity: ${humidity}%`;
              document.getElementById('windText').textContent = `Wind Speed: ${windSpeed} m/s`;

              // Scroll to the weather information section
              document.getElementById('weather-info').scrollIntoView({ behavior: 'smooth' });
          })
          .catch(error => {
              console.error('Error fetching weather data:', error);
          });
  }
});
