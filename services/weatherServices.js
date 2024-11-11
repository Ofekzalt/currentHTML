function getWeather() {
  const city = document.getElementById('city').value;
  if (!city) {
      alert('Please enter a city name');
      return;
  }
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API}&units=metric`;

  fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
          if (data.cod === "404") {
              alert('City not found!');
              return;
          }
          const temp = data.main.temp;
          const humidity = data.main.humidity;
          const description = data.weather[0].description;
          const icon = data.weather[0].icon;
          const country = data.sys.country;

          const weatherDetails = document.getElementById('weatherDetails');
          weatherDetails.innerHTML = `
              <h2>${data.name}, ${country}</h2>
              <h3>${description.charAt(0).toUpperCase() + description.slice(1)}</h3>
              <img src="https://openweathermap.org/img/wn/${icon}.png" alt="weather icon" />
              <p>Temperature: ${temp}°C</p>
              <p>Humidity: ${humidity}%</p>
          `;
      })
      .catch(error => {
          console.error('Error fetching weather data:', error);
          alert('Could not fetch the weather data. Please try again later.');
      });
}
