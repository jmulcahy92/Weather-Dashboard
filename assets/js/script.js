var APIKey = "d1af2c537e48864e4f4d6a0451359a75";
var city;

var searchBtn = document.querySelector("#search-button");
var cityList = document.querySelector("#city-list");
var weatherEl = document.querySelector("#current-weather");
var forecastEl = document.querySelector("#five-day-forecast");

var storedCities = JSON.parse(localStorage.getItem("cities"));

if (storedCities != null) {
    for (i = 0; i < storedCities.length; i++) {
        var newCityEl = document.createElement("button");
        var newLiEl = document.createElement("li");
        newCityEl.textContent = storedCities[i];
        newLiEl.appendChild(newCityEl);
        cityList.appendChild(newLiEl);
    }
    
    fetchData(storedCities[0]);
}

function getWeather(event) {
    event.preventDefault();
    city = document.querySelector("#city-input").value;
    document.querySelector("#city-input").value = "";
    fetchData(city);
}

function fetchData(city) {
    var currentURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey;
    var forecastURL  = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + APIKey;

    fetch(currentURL)
        .then(function (response) {
            if (response.ok) {
                if (localStorage.getItem("cities") == null) {
                    var newCityEl = document.createElement("button");
                    var newLiEl = document.createElement("li");
                    newCityEl.textContent = city;
                    newLiEl.appendChild(newCityEl);
                    cityList.appendChild(newLiEl);
                    var storedCities = [city]; // just save the one city
                    localStorage.setItem("cities", JSON.stringify(storedCities)); // stringifies array of cities and saves them to local storage
                } else if (!localStorage.getItem("cities").includes(city)) {
                    var newCityEl = document.createElement("button");
                    var newLiEl = document.createElement("li");
                    newCityEl.textContent = city;
                    newLiEl.appendChild(newCityEl);
                    cityList.appendChild(newLiEl);
                    var storedCities = JSON.parse(localStorage.getItem("cities")); // create array of existing saved cities
                    storedCities.push(city); // push new city onto end
                    localStorage.setItem("cities", JSON.stringify(storedCities));
                }

                response.json().then(function (data) {
                    console.log(data);
        
                    var date = dayjs.unix(data.dt).format('M/D/YYYY');
                    var iconId = data.weather[0].icon;
                    var iconUrl = "https://openweathermap.org/img/wn/" + iconId + "@2x.png";
                    var iconEl = document.createElement("img");
                    iconEl.setAttribute("src", iconUrl);
                    weatherEl.children[0].textContent = city + " " + "(" + date + ")"
                    weatherEl.children[0].appendChild(iconEl);
        
                    var temp = data.main.temp + " °F";
                    weatherEl.children[1].textContent = "Temp: " + temp;
        
                    var wind = data.wind.speed + " MPH";
                    weatherEl.children[2].textContent = "Wind: " + wind;
        
                    var humidity = data.main.humidity + " %";
                    weatherEl.children[3].textContent = "Humidity: " + humidity;
                });
            } else {
                alert('Current Weather Error: ' + response.statusText);
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

                    for(i = 7; i < data.list.length; i += 8) {
                        var date = dayjs.unix(data.list[i].dt).format("M/D/YYYY (h:mm a)");
                        forecastEl.children[1].children[(i-7)/8].children[0].textContent = date;

                        var iconId = data.list[i].weather[0].icon;
                        forecastEl.children[1].children[(i-7)/8].children[1].setAttribute("src", "https://openweathermap.org/img/wn/" + iconId + "@2x.png")

                        var temp = data.list[i].main.temp + " °F";
                        forecastEl.children[1].children[(i-7)/8].children[2].textContent = "Temp: " + temp;

                        var wind = data.list[i].wind.speed + " MPH";
                        forecastEl.children[1].children[(i-7)/8].children[3].textContent = "Wind: " + wind;

                        var humidity = data.list[i].main.humidity + " %";
                        forecastEl.children[1].children[(i-7)/8].children[4].textContent = "Humidity: " + humidity;
                    }
                });
            } else {
                alert('Forecast Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert("Unable to connect");
        });
}

searchBtn.addEventListener("click", getWeather);
cityList.addEventListener("click", function (event) {
    if(event.target.matches("button")) {
        city = event.target.textContent;
        fetchData(city);
    }
});