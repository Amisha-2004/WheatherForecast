const cityName = 'Delhi'
const apiKey = 'a557980ec40c49108112a177dc091c13';

// Fetch weather data based on city name
function fetchWeatherDataByCityName(cityName) {
    const apiUrl = `https://api.weatherbit.io/v2.0/current?city=${cityName}&key=${apiKey}`;
    fetch(apiUrl)
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
          console.log('API Response:', data);
          displayCurrentWeather(data);
          fetchForecastByCityName(cityName);
      })
      .catch(error => {
          console.error('Error fetching weather data:', error);
      });
}

// Fetch weather data based on latitude and longitude
function fetchWeatherData(latitude, longitude) {
    const apiUrl = `https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&key=${apiKey}`;
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('API Response for coordinates:', data);
        displayCurrentWeather(data);
        fetchForecastByCoordinates(latitude, longitude);
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
      });
}

function displayCurrentWeather(data) {
    const weatherContainer = document.getElementById('currentWeather');
    
    if (data && data.data && data.data.length > 0) {
        const weatherData = data.data[0]; 
        const condition = weatherData.weather.description; 
        const temp_c = weatherData.temp; 
        const humidity = weatherData.rh; 
        const windSpeed = weatherData.wind_spd;
        const windSpeedKph = (windSpeed * 3.6).toFixed(2);
        const localtime = new Date(weatherData.ts * 1000); 
        const formattedDateTime = localtime.toLocaleString();

        const htmlContent = `
            <h2>Current Weather in ${weatherData.city_name}</h2>
            <p><strong>Condition:</strong> ${condition}</p>
            <p><strong>Temperature:</strong> ${temp_c}°C</p>
            <p><strong>Humidity:</strong> ${humidity}%</p>
            <p><strong>Wind Speed:</strong> ${windSpeedKph} km/h</p>
            <p><strong>Date/Time:</strong> ${formattedDateTime}</p>
        `;

        weatherContainer.innerHTML = htmlContent;
    } else {
        console.error('No weather data available');
    }
}

document.getElementById('searchBtn').addEventListener('click', function(event) {
    event.preventDefault();
    const cityName = document.getElementById('cityInput').value.trim();
    
    if (cityName) {
      fetchWeatherDataByCityName(cityName);
    } else {
      fetchWeatherDataByCityName('Delhi');
    }
});

document.getElementById('allowBtn').addEventListener('click', function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        fetchWeatherData(latitude, longitude);
      }, function(error) {
        console.error('Error getting user location:', error);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
});

// Deny button
document.getElementById('denyBtn').addEventListener('click', function() {
    // Hide location permission dialog
    document.querySelector('.location-permission').style.display = 'none';
});

// Fetch forecast weather data by city name
function fetchForecastByCityName(cityName) {
  const apiUrl = `https://api.weatherbit.io/v2.0/forecast/daily?city=${cityName}&days=8&key=${apiKey}`;
  fetch(apiUrl)
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
          console.log('Forecast API Response:', data);
          displayForecastWeather(data);
      })
      .catch(error => {
          console.error('Error fetching forecast data:', error);
      });
}

function fetchForecastByCoordinates(latitude, longitude) {
  const apiUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${latitude}&lon=${longitude}&days=8&key=${apiKey}`;
  fetch(apiUrl)
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
          console.log('Forecast API Response:', data);
          displayForecastWeather(data);
      })
      .catch(error => {
          console.error('Error fetching forecast data:', error);
      });
}

function displayForecastWeather(data) {
  const labels = [];
  const temperatures = [];
  const humidities = [];
  const windSpeeds = [];

  data.data.forEach(day => {
    labels.push(day.valid_date);
    temperatures.push(day.temp);
    humidities.push(day.rh);
    windSpeeds.push((day.wind_spd * 3.6).toFixed(2));
  });

  // Chart for temperature
  new Chart(document.getElementById('temperatureChart'), {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Temperature (°C)',
        data: temperatures,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true
    }
  });

  // Chart for humidity
  new Chart(document.getElementById('humidityChart'), {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Humidity (%)',
        data: humidities,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true
    }
  });

  // Chart for wind speed
  new Chart(document.getElementById('windSpeedChart'), {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Wind Speed (km/h)',
        data: windSpeeds,
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
      }]
    },
    options: {
      responsive: true
    }
  });
}