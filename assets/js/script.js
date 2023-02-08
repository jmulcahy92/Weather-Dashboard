var APIKey = "d1af2c537e48864e4f4d6a0451359a75"; // weather API key
var city; // city variable

var searchBtn = document.querySelector("#search-button"); // search button element for event listener
var cityList = document.querySelector("#city-list"); // container element for previous search buttons for event listener
var weatherEl = document.querySelector("#current-weather"); // parent element for current weather elements
var forecastEl = document.querySelector("#five-day-forecast"); // parent element for forecast elements

var storedCities = JSON.parse(localStorage.getItem("cities")); // pull local storage and parse into array

// if local storage has cities...
if (storedCities != null) {
    // loop over parsed local storage array...
    for (i = 0; i < storedCities.length; i++) {
        // and populate "previous searches" area with buttons for each city in local storage
        var newCityEl = document.createElement("button");
        var newLiEl = document.createElement("li");
        newCityEl.textContent = storedCities[i];
        newLiEl.appendChild(newCityEl);
        cityList.appendChild(newLiEl);
    }
    
    fetchData(storedCities[0]); // fetch data for first city user looked for and populate weather data
}

// function called by search button event listener; stores user's search input, resets form to empty, and calls fetchData
function getWeather(event) {
    event.preventDefault();
    city = document.querySelector("#city-input").value;
    document.querySelector("#city-input").value = "";
    fetchData(city);
}

// fetches data for both current and future weather, populates page with it, and stores city to local storage and new "previous search" buttons if not already there
function fetchData(city) {
    // create fetch urls with user's chosen city and API key
    var currentURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey;
    var forecastURL  = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + APIKey;

    // fetch data for current weather
    fetch(currentURL)
        .then(function (response) {
            // if fetch gets a successful response...
            if (response.ok) {
                // if nothing in local storage...
                if (localStorage.getItem("cities") == null) {
                    // make a shortcut button for this city
                    var newCityEl = document.createElement("button");
                    var newLiEl = document.createElement("li");
                    newCityEl.textContent = city;
                    newLiEl.appendChild(newCityEl);
                    cityList.appendChild(newLiEl);

                    // save this city to storage
                    var storedCities = [city];
                    localStorage.setItem("cities", JSON.stringify(storedCities));
                }
                // OR if there are cities in storage but they don't include this one yet...
                else if (!localStorage.getItem("cities").includes(city)) {
                    // make a shortcut button for this city
                    var newCityEl = document.createElement("button");
                    var newLiEl = document.createElement("li");
                    newCityEl.textContent = city;
                    newLiEl.appendChild(newCityEl);
                    cityList.appendChild(newLiEl);

                    // pull local storage, parse it, push this city onto the end, restringify it, and save it back to local storage
                    var storedCities = JSON.parse(localStorage.getItem("cities"));
                    storedCities.push(city);
                    localStorage.setItem("cities", JSON.stringify(storedCities));
                }

                // json to get relevant data out of response
                response.json().then(function (data) {
                    var date = dayjs.unix(data.dt).format('M/D/YYYY'); // pull date/time for "current" weather and save date to variable
                    weatherEl.children[0].textContent = city + " " + "(" + date + ")" // change current weather's heading to city + date

                    var iconId = data.weather[0].icon; // pull current weather's icon id
                    var iconUrl = "https://openweathermap.org/img/wn/" + iconId + "@2x.png"; // create url for actually accessing current weather icon
                    var iconEl = document.createElement("img"); // create icon element
                    iconEl.setAttribute("src", iconUrl); // put url for icon into icon element's src attribute
                    weatherEl.children[0].appendChild(iconEl); // append icon to end of heading
        
                    // populate temperature
                    var temp = data.main.temp + " °F";
                    weatherEl.children[1].textContent = "Temp: " + temp;
        
                    // populate windspeed
                    var wind = data.wind.speed + " MPH";
                    weatherEl.children[2].textContent = "Wind: " + wind;
        
                    // populate humidity
                    var humidity = data.main.humidity + " %";
                    weatherEl.children[3].textContent = "Humidity: " + humidity;
                });
            } else {
                alert('Error: ' + response.statusText); // alerts if user's input was not a city
            }
        })
        .catch(function (error) {
            alert("Unable to connect"); // alerts if server connection fails
        });

    // fetch data for forecast
    fetch(forecastURL)
        .then(function (response) {
            // if fetch gets a successful response...
            if (response.ok) {
                // json to get relevant data out of response
                response.json().then(function (data) {
                // loop over the array of forecast data, starting with 8th element (closest to 24 hours from current time) and every 8 elements (24 hours) after that
                    for(i = 7; i < data.list.length; i += 8) {
                        // populate dates
                        var date = dayjs.unix(data.list[i].dt).format("M/D/YYYY (h:mm a)");
                        forecastEl.children[1].children[(i-7)/8].children[0].textContent = date;

                        // populate icons
                        var iconId = data.list[i].weather[0].icon;
                        forecastEl.children[1].children[(i-7)/8].children[1].setAttribute("src", "https://openweathermap.org/img/wn/" + iconId + "@2x.png")

                        // populate temperatures
                        var temp = data.list[i].main.temp + " °F";
                        forecastEl.children[1].children[(i-7)/8].children[2].textContent = "Temp: " + temp;

                        // populate windspeeds
                        var wind = data.list[i].wind.speed + " MPH";
                        forecastEl.children[1].children[(i-7)/8].children[3].textContent = "Wind: " + wind;

                        // populate humidities
                        var humidity = data.list[i].main.humidity + " %";
                        forecastEl.children[1].children[(i-7)/8].children[4].textContent = "Humidity: " + humidity;
                    }
                });
            }
        })
        .catch(function (error) {
            alert("Unable to connect"); // alerts if server connection fails (distinguish from current weather connection failure alert?)
        });
}

// event listener for input's search button
searchBtn.addEventListener("click", getWeather);

// event listener for "previous searches" buttons
cityList.addEventListener("click", function (event) {
    if(event.target.matches("button")) {
        city = event.target.textContent;
        fetchData(city);
    }
});