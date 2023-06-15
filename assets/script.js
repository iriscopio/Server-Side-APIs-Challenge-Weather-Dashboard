const apiKey = "35a45b148f0a9b42f0b02c6bc5eff5d8";
const currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=";
const forecastWeatherUrl = "https://api.openweathermap.org/data/2.5/forecast?units=imperial&q=";

var cityInput = document.querySelector("#city-input");
var searchBox = document.querySelector(".search-box input");
var searchBtn = document.querySelector(".search-box button");
var weatherIcon = document.querySelector(".weather-icon");


// Function to display city names & remove on click
function displayCity() {
  var cityName = cityInput.value;
  if (cityName !== '') {
    var cityItem = document.createElement("span");
    cityItem.textContent = cityName;
    cityItem.classList.add("city-item"); 

    var cityItemContainer = document.querySelector(".city-item-container");
    cityItemContainer.appendChild(cityItem);

    cityInput.value = "";

    cityItem.addEventListener("click", function () {
      cityItemContainer.removeChild(cityItem);
    });
  }
}

// Function to fetch current weather 
async function checkWeather(city) {
  var currentWeatherResponse = await fetch(currentWeatherUrl + city + `&appid=${apiKey}`);
  var currentWeatherData = await currentWeatherResponse.json();
  searchBtn.addEventListener("click", checkWeather);


// Fetch to fetch five-day weather forecast
  var forecastResponse = await fetch(forecastWeatherUrl + city + `&appid=${apiKey}`);
  var forecastData = await forecastResponse.json();  

// Error Message
  if (currentWeatherData.cod == "404") {
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather-card").style.display = "none";
    document.querySelector(".second-container").style.display = "none";  

  } else {
    document.querySelector(".error").style.display = "none";
    document.querySelector(".weather-card").style.display = "block";
    document.querySelector(".second-container").style.display = "flex"; 
   

// Update current weather information
    document.querySelector(".city").textContent = currentWeatherData.name;
    document.querySelector(".temp").textContent = Math.round(currentWeatherData.main.temp) + "°F";
    document.querySelector(".humidity").textContent = currentWeatherData.main.humidity + "%";
    document.querySelector(".wind").textContent = currentWeatherData.wind.speed + " km/h";

  var weatherIcon = document.querySelector(".weather-icon");
  var weatherIconUrl = getWeatherIconUrl(currentWeatherData.weather[0].icon);
    weatherIcon.src = weatherIconUrl;

// Update forecast cards
  var forecastCards = document.querySelectorAll(".forecast-card");
  forecastCards.forEach((card, index) => {
  var forecast = forecastData.list[index + 1]; 

  var forecastDateElement = card.querySelector(".forecast-date"); 
  forecastDateElement.textContent = getForecastDate(forecast.dt, index);  

  var forecastIconElement = card.querySelector(".forecast-icon");
  var forecastIconUrl = getWeatherIconUrl(forecast.weather[0].icon);
  forecastIconElement.src = forecastIconUrl;

  var forecastTempElement = card.querySelector(".forecast-temp");
  forecastTempElement.textContent = "Temp: " + Math.round(forecast.main.temp) + "°";

  var forecastHumidityElement = card.querySelector(".forecast-humidity");
  forecastHumidityElement.textContent = "Humidity: " + forecast.main.humidity + "%";

  var forecastWindElement = card.querySelector(".forecast-wind");
  forecastWindElement.textContent = "Wind: " + forecast.wind.speed + " km/h";  

});

var forecastContainers = document.querySelectorAll(".second-container");
forecastContainers.forEach((container) => {
  container.classList.remove("hidden");
});


}

};


// Function to get the day of the week:

function getForecastDate(unixTimestamp, index) {
  var date = new Date((unixTimestamp * 1000) + ((index) * 24 * 48 * 60 * 1000));
  date.setDate(date.getDate() + 1);
  var options = { weekday: "long", month: "numeric", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}


// Function to get the URL of the weather icon:
function getWeatherIconUrl(iconCode) {
  return "https://openweathermap.org/img/w/" + iconCode + ".png";
}


searchBtn.addEventListener("click", function(){
  checkWeather(searchBox.value);
  displayCity(); 
  });

  searchBox.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
      checkWeather(searchBox.value);
      displayCity();
    }
  });
