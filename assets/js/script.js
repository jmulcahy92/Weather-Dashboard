// LINK TO WEATHER API

// usable form
    // user inputs a city and clicks search
        // pull data on user's chosen city and populate current and future forecast elements in <article>
            // default placeholder forecast? one from local storage or one of my own choice?
        // create button in aside to recall/populate data for that same city again in the future
            // buttons for every city in local storage present on page load
        // store user's chosen city in local storage

var APIKey = "d1af2c537e48864e4f4d6a0451359a75";
var city;

var searchBtn = document.querySelector("#search-button");
var cityList = document.querySelector("#city-list");
var weatherEl = document.querySelector("#current-weather");
var forecastEl = document.querySelector("#five-day-forecast");

function getWeather(event) {
    event.preventDefault();
    city = document.querySelector("#city-input").value;
    var currentURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey;
    var forecastURL  = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + APIKey;

    fetch(currentURL)
        .then(function (response) {
            if (response.ok) {
                var newCityEl = document.createElement("button");
                var newLiEl = document.createElement("li");
                newCityEl.textContent = city;
                newLiEl.appendChild(newCityEl);
                cityList.appendChild(newLiEl);

                // save city to local storage

                response.json().then(function (data) {
                    console.log(data);
        
                    var date = dayjs.unix(data.dt).format('M/D/YYYY');
                    var iconId = data.weather[0].icon;
                    var iconUrl = "http://openweathermap.org/img/wn/" + iconId + "@2x.png";
                    var iconEl = document.createElement("img");
                    iconEl.setAttribute("src", iconUrl);
                    weatherEl.children[0].textContent = city + " " + "(" + date + ") "
                    weatherEl.children[0].appendChild(iconEl);
        
                    var temp = data.main.temp + " °F";
                    weatherEl.children[1].textContent = "Temp: " + temp;
        
                    var wind = data.wind.speed + " MPH";
                    weatherEl.children[2].textContent = "Wind: " + wind;
        
                    var humidity = data.main.humidity + " %";
                    weatherEl.children[3].textContent = "Humidity: " + humidity;
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert("Unable to connect");
        });

    fetch(forecastURL)
        .then(function (response) {
            if (response.ok) {
                    response.json().then(function (data) {
                    console.log(data);

                    for(i = 0; i < data.list.length; i += 8) {
                        var date = dayjs.unix(data.list[i].dt).format("M/D/YYYY");
                        forecastEl.children[1].children[i/8].children[0].textContent = date;

                        var iconId = data.list[i].weather[0].icon;
                        forecastEl.children[1].children[i/8].children[1].setAttribute("src", "http://openweathermap.org/img/wn/" + iconId + "@2x.png")

                        var temp = data.list[i].main.temp + " °F";
                        forecastEl.children[1].children[i/8].children[2].textContent = "Temp: " + temp;

                        var wind = data.list[i].wind.speed + " MPH";
                        forecastEl.children[1].children[i/8].children[3].textContent = "Wind: " + wind;

                        var humidity = data.list[i].main.humidity + " %";
                        forecastEl.children[1].children[i/8].children[4].textContent = "Humidity: " + humidity;
                    }
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert("Unable to connect");
        });
}

searchBtn.addEventListener("click", getWeather);

// populate city buttons from local storage on page open
// event listener for THESE buttons

// prevent repeat entries in local storage/aside buttons?