let apiKey = "c1839181c76825494afbe0248f476ab5";

//date and time
function formatDate() {
  let now = new Date();

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "Octover",
    "November",
    "December",
  ];
  let day = days[now.getDay()];
  let date = now.getDate();
  let month = months[now.getMonth()];
  if (date === 1 || date === 21 || date === 31) {
    return `${day} ${date}st ${month}`;
  }
  if (date === 2 || date === 22) {
    return `${day} ${date}nd ${month}`;
  }
  if (date === 3 || date === 23) {
    return `${day} ${date}rd ${month}`;
  } else {
    return `${day} ${date}th ${month}`;
  }
}
let currentDate = document.querySelector("#current-date");
currentDate.innerHTML = formatDate();

function formatTime() {
  var now = new Date();
  let hours = now.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  var timeNow = hours + ":" + minutes;
  document.getElementById("local-time").innerHTML = timeNow;
  setTimeout(formatTime, 1000);
}
formatTime();

//Temperature and city display from search
let temperature = 0;
function displayWeather(response) {
  console.log(response);

  let currentCity = document.querySelector("#current-city");
  let currentTemp = document.querySelector("#current-temp");
  let weatherDescription = document.querySelector("#description");
  let iconElement = document.querySelector("#current-weather-icon");
  let iconSource = response.data.weather[0].icon;

  celciusTemperature = response.data.main.temp;

  currentCity.innerHTML = response.data.name;
  currentTemp.innerHTML = Math.round(celciusTemperature);
  weatherDescription.innerHTML = response.data.weather[0].main;

  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${iconSource}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].main);
}
//forecast time
function formatHours(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();

  if (hours < 10) {
    hours = `0${hours}`;
  }

  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${hours}:${minutes}`;
}
function displayForecast(response) {
  console.log(response.data);

  let forecastElement = document.querySelector("#forecast");
  let forecast = null;
  forecastElement.innerHTML = null;

  for (let index = 0; index < 6; index++) {
    forecast = response.data.list[index];
    let minForecast = forecast.main.temp_min;
    let maxForecast = forecast.main.temp_max;
    forecastElement.innerHTML += `
  <div class="col-2" >
    <div class="card forecast" style="width: 100%">
      <div class="card-body">
        <h5 class="card-title">${formatHours(forecast.dt * 1000)}</h5>
        <img src="http://openweathermap.org/img/wn/${
          forecast.weather[0].icon
        }@2x.png" id="forecast-icon" alt="${forecast.weather[0].description}">

        <div class="forecast-temperature">

        <b> <span class="min-hourly-degrees"> 
        ${Math.round(maxForecast)}</span>º</b>
         | 
         <span class="max-hourly-degrees"> ${Math.round(minForecast)}</span>º
         </div>
      </div>
    </div>
  </div>
  `;
  }
}

function searchCity(cityInput) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}&units=metric`;
  console.log(apiUrl);
  axios.get(apiUrl).then(displayWeather);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}
searchCity("London");
function handleSubmit(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#search-input").value;
  searchCity(cityInput);
}

let citySearchElement = document.querySelector("#city-search");
citySearchElement.addEventListener("submit", handleSubmit);

//location weather
function showTemperature(response) {
  let temperature = Math.round(response.data.main.temp);
  let currentTempElement = document.querySelector("#current-temp");
  let currentLocationElement = document.querySelector("#current-city");
  let weatherDescriptionElement = document.querySelector("#description");

  celciusTemperature = temperature;

  currentTempElement.innerHTML = `${celciusTemperature}`;
  currentLocationElement.innerHTML = response.data.name;
  weatherDescriptionElement.innerHTML = response.data.weather[0].main;
}
function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showTemperature);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayForecast);
}
function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(showPosition);
}

//temperaure conversions
//celcius > farenheit

function displayFahrenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#current-temp");

  celciusLink.classList.remove("active");
  farLink.classList.add("active");

  let farTemp = Math.round((celciusTemperature * 9) / 5 + 32);
  temperatureElement.innerHTML = `${farTemp}`;

  let minForecastItems = document.querySelectorAll(".min-hourly-degrees");
  minForecastItems.forEach(function (item) {
    let currentTemp = item.innerHTML;
    console.log(currentTemp);
    item.innerHTML = `${Math.round((currentTemp * 9) / 5 + 32)}`;
  });
  let maxForecastItems = document.querySelectorAll(".max-hourly-degrees");
  maxForecastItems.forEach(function (item) {
    let currentTemp = item.innerHTML;
    item.innerHTML = `${Math.round((currentTemp * 9) / 5 + 32)}`;
  });

  farLink.removeEventListener("click", displayFahrenheit);
  celciusLink.addEventListener("click", displayCelcius);
}

let farLink = document.querySelector("#fahrenheit-link");
farLink.addEventListener("click", displayFahrenheit);

//fahrenheit >> celcius

function displayCelcius(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#current-temp");
  temperatureElement.innerHTML = Math.round(celciusTemperature);

  celciusLink.classList.add("active");
  farLink.classList.remove("active");

  let minForecastItems = document.querySelectorAll(".min-hourly-degrees");
  minForecastItems.forEach(function (item) {
    let currentTemp = item.innerHTML;
    item.innerHTML = `${Math.round(((currentTemp - 32) * 5) / 9)}`;
  });
  let maxForecastItems = document.querySelectorAll(".max-hourly-degrees");
  maxForecastItems.forEach(function (item) {
    let currentTemp = item.innerHTML;
    item.innerHTML = `${Math.round(((currentTemp - 32) * 5) / 9)}`;
  });
  farLink.addEventListener("click", displayFahrenheit);
  celciusLink.removeEventListener("click", displayCelcius);
}

let celciusLink = document.querySelector("#celcius-link");
