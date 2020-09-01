let apiKey = "c1839181c76825494afbe0248f476ab5";

//time and date
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
  } else {
    if (date === 2 || date === 22) {
      return `${day} ${date}nd ${month}`;
    } else {
      if (date === 3 || date === 23) {
        return `${day} ${date}rd ${month}`;
      } else {
        return `${day} ${date}th ${month}`;
      }
    }
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

//Temperature
let temperature = 0;
function displayWeather(response) {
  console.log(response);
  let currentCity = document.querySelector("#current-city");
  currentCity.innerHTML = response.data.name;
  let currentTemp = document.querySelector("#current-temp");
  currentTemp.innerHTML = Math.round(response.data.main.temp);
  let weatherDescription = document.querySelector("#description");
  weatherDescription.innerHTML = response.data.weather[0].main;
}
function searchCity(cityInput) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}&units=metric`;
  console.log(apiUrl);
  axios.get(apiUrl).then(displayWeather);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#search-input").value;
  searchCity(cityInput);
}
//location
let citySearch = document.querySelector("#city-search");
citySearch.addEventListener("submit", handleSubmit);

//temperaure conversion
function convertToFahrenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#current-temp");
  let farTemp = Math.round((temperature * 9) / 5 + 32);
  temperatureElement.innerHTML = `${farTemp}`;
}

function convertToCelsius(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = temperature;
}
function getWeatherCoord() {}

function showTemperature(response) {
  console.log(response.data);
  let temperature = Math.round(response.data.main.temp);
  console.log(temperature);
  let currentTemp = document.querySelector("#current-temp");
  currentTemp.innerHTML = `${temperature}`;

  let currentLocation = document.querySelector("#current-city");

  currentLocation.innerHTML = response.data.name;
}
function showPosition(position) {
  let apiKey = "c1839181c76825494afbe0248f476ab5";
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let units = "metric";
  let apiUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showTemperature);
}
function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(showPosition);
}

let locationButton = document.querySelector("#current-location-button");
locationButton.addEventListener("click", getCurrentPosition);
