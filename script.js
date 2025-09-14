const API_KEY = "b35ea1a72d2133216d820de769c23911"; // 🔑 Replace with your OpenWeather API key

// 🔹 Search Button
document.getElementById("searchBtn").addEventListener("click", () => {
  let city = document.getElementById("cityInput").value;
  if(city) {
    getWeather(city);
    getForecast(city);
  } else {
    alert("Please enter a city name!");
  }
});

// 🔹 Current Location Button
document.getElementById("locationBtn").addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      let lat = pos.coords.latitude;
      let lon = pos.coords.longitude;
      getWeatherByLocation(lat, lon);
      getForecastByLocation(lat, lon);
    });
  } else {
    alert("Geolocation not supported in your browser");
  }
});

// 🔹 Current Weather by City
function getWeather(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
    .then(res => res.json())
    .then(data => displayWeather(data))
    .catch(() => alert("City not found!"));
}

// 🔹 Current Weather by Location
function getWeatherByLocation(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
    .then(res => res.json())
    .then(data => displayWeather(data))
    .catch(() => alert("Unable to fetch weather for your location"));
}

// 🔹 Display Current Weather
function displayWeather(data) {
  if (data.cod === "404") {
    document.getElementById("weatherResult").innerHTML = `<p>❌ City not found</p>`;
    return;
  }

  document.getElementById("weatherResult").innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <p>🌡 Temp: ${data.main.temp} °C</p>
    <p>💧 Humidity: ${data.main.humidity}%</p>
    <p>🌬 Wind: ${data.wind.speed} m/s</p>
    <p>☁ Condition: ${data.weather[0].description}</p>
    <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
  `;
}

// 🔹 5-Day Forecast by City
function getForecast(city) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`)
    .then(res => res.json())
    .then(data => displayForecast(data));
}

// 🔹 5-Day Forecast by Location
function getForecastByLocation(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
    .then(res => res.json())
    .then(data => displayForecast(data));
}

// 🔹 Display 5-Day Forecast
function displayForecast(data) {
  let forecastDiv = document.getElementById("forecast");
  forecastDiv.innerHTML = "";

  // API gives 3-hour interval data → pick one every 24 hours (8th index)
  for (let i = 0; i < data.list.length; i += 8) {
    let day = data.list[i];
    forecastDiv.innerHTML += `
      <div class="forecast-card">
        <p>${new Date(day.dt_txt).toLocaleDateString()}</p>
        <p>🌡 ${day.main.temp} °C</p>
        <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}.png">
        <p>${day.weather[0].description}</p>
      </div>
    `;
  }
}
