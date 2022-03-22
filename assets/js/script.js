let cityInputEl = document.querySelector("#cityName");
let searchButtonEl = document.querySelector("#searchButton");
let searchHistory = document.querySelector(".history");
let historySectionEl = document.querySelector(".history");
let clearButtonEl = document.querySelector("#clearButton");
let searches = [];
let currentDate = moment().format('l');
let forecast = [
    { futureWeather: moment().add(1, 'days').format('l') },
    { futureWeather: moment().add(2, 'days').format('l') },
    { futureWeather: moment().add(3, 'days').format('l') },
    { futureWeather: moment().add(4, 'days').format('l') },
    { futureWeather: moment().add(5, 'days').format('l') },
]
let currentNameEl = document.querySelector(".currentName");
let currentTempEl = document.querySelector(".currentTemp");
let currentWindEl = document.querySelector(".currentWind");
let currentHumidityEl = document.querySelector(".currentHumidity");
let currentUVEl = document.querySelector(".currentUV");
let currentIconEl = document.querySelector("#currentIcon");
let weatherSectionEl = document.querySelector(".weather");


// The One Call API takes longitudinal and latitudinal coorindates, so needs to use another API to fetch the city name, then pass the coordiantes into getCityCoordiantes to access the data from oneShotAPI
let getCity = function (searchesName) {
    let apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + searchesName.name + "&limit=1&appid=f9dcdf6690d0d22c5198371e258e8bb2";
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    getCityCoordinates(data[0].lat, data[0].lon, data[0].name)
                    makeSearchHistory(searchesName);
                });
            } else {
                alert("Please enter a valid city!");
                return
            };
        })
        .catch(function (error) {
            alert("Please enter a valid city!");
            console.log(error);
            return
        });
    // console.log(`Search history API ${apiUrl}`);
};

// Function to pass button text into API to allow button functionality
let getCityFromHistory = function (searchesName) {
    let apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + searchesName.name + "&limit=1&appid=f9dcdf6690d0d22c5198371e258e8bb2";
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    getCityCoordinates(data[0].lat, data[0].lon, data[0].name)
                });
            } else {
                alert("Please enter a valid city!");
                return
            };
        })
    // console.log(`Button API ${apiUrl}`);
};

// have all other functions that need API data run in this function
// Once the city coordinates are found, can pass into this function and get the API data that is needed
let getCityCoordinates = function (lat, lon, name) {
    let apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude={part}&appid=f9dcdf6690d0d22c5198371e258e8bb2";
    fetch(apiUrl)
        .then(function (response) {
            response.json().then(function (data) {
                getWeatherInfo(data.current.wind_speed, data.current.temp, data.current.humidity, data.current.uvi, data.current.weather[0].icon, name);
                fiveDayForcast(data);
            });
        })
        .catch(function (error) {
            alert("Please enter a valid city name!!");
            console.log(error);
            return
        })
};


// This functions is called when the city name is entered by the user and it passes the inputted text into getCity
let formSubmitHandler = function (event) {
    event.preventDefault();

    var searchCity = cityInputEl.value.trim();
    if (searchCity) {
        cityInputEl.value = "";
        let searchesName = {
            name: searchCity
        }
        getCity(searchesName);
    };
};

// create a button for searches to append to the webpage under the form
let makeSearchHistory = function (data) {
    let historyButton = document.createElement("button");
    historyButton.innerText = data.name;
    historyButton.classList.add("col-12", "btn", "btn-secondary", "historyButtonInput", "my-2");
    historySectionEl.appendChild(historyButton);
    if (data) {
        searches.push(data);
        saveFunction();
    };
    // this gives the functionality to make the created buttons display the weather data when clicked, much like the form submit button click function
    historyButton.addEventListener("click", function () {
        var searchCity = historyButton.innerHTML
        let searchesName = {
            name: searchCity
        }
        if (searchCity) {
            getCityFromHistory(searchesName);
            cityInputEl.value = "";
        };
    });
};

// This function takes the current weather information
let getWeatherInfo = function (windSpeed, temp, humidity, UV, icon, name) {
    weatherSectionEl.classList.remove("weather");
    currentNameEl.innerHTML = `${name} ${currentDate} `
    currentIconEl.src = 'http://openweathermap.org/img/wn/' + icon + '@2x.png';
    currentWindEl.innerHTML = `Wind Speed: ${Math.floor(windSpeed * 3.6)} KPH`;
    currentTempEl.innerHTML = `Temp: ${(Math.floor(temp - 271.15))}°C`
    currentHumidityEl.innerHTML = `Humidity: ${humidity}%`;
    currentUVEl.innerHTML = `UV index: <span>${UV}</span>`;
    if (UV <= 2) {
        currentUVEl.classList.add("favorable");
        currentUVEl.classList.remove("moderate");
        currentUVEl.classList.remove("severe");
    } else if (UV > 2 && UV <= 7) {
        currentUVEl.classList.add("moderate");
        currentUVEl.classList.remove("favorable");
        currentUVEl.classList.remove("severe");
    } else if (7 < UV) {
        currentUVEl.classList.add("severe");
        currentUVEl.classList.remove("moderate");
        currentUVEl.classList.remove("favorable");
    };
};

// This function gets the data needed to make the 5-day forcast, utilizing a loop to forcast 5 days
let fiveDayForcast = function (data) {

    document.querySelector(".dayOneDate").innerHTML = forecast[0].futureWeather;
    document.querySelector(".dayOneIcon").src = 'http://openweathermap.org/img/wn/' + data.daily[0].weather[0].icon + '@2x.png';
    document.querySelector(".dayOneTemp").innerHTML = `Temp: ${Math.floor((data.daily[0].temp.day - 271.15))}°C`;
    document.querySelector(".dayOneWind").innerHTML = `Wind: ${Math.floor((data.daily[0].wind_speed * 3.6))} KPH`;
    document.querySelector(".dayOneHumidity").innerHTML = `Humidity: ${data.daily[0].humidity}%`;

    document.querySelector(".dayTwoDate").innerHTML = forecast[1].futureWeather;
    document.querySelector(".dayTwoIcon").src = 'http://openweathermap.org/img/wn/' + data.daily[1].weather[0].icon + '@2x.png';
    document.querySelector(".dayTwoTemp").innerHTML = `Temp: ${Math.floor((data.daily[1].temp.day - 271.15))}°C`;
    document.querySelector(".dayTwoWind").innerHTML = `Wind: ${Math.floor((data.daily[1].wind_speed * 3.6))} KPH`;
    document.querySelector(".dayTwoHumidity").innerHTML = `Humidity: ${data.daily[1].humidity}%`;

    document.querySelector(".dayThreeDate").innerHTML = forecast[2].futureWeather;
    document.querySelector(".dayThreeIcon").src = 'http://openweathermap.org/img/wn/' + data.daily[2].weather[0].icon + '@2x.png';
    document.querySelector(".dayThreeTemp").innerHTML = `Temp: ${Math.floor((data.daily[2].temp.day - 271.15))}°C`;
    document.querySelector(".dayThreeWind").innerHTML = `Wind: ${Math.floor((data.daily[2].wind_speed * 3.6))} KPH`;
    document.querySelector(".dayThreeHumidity").innerHTML = `Humidity: ${data.daily[2].humidity}%`;

    document.querySelector(".dayFourDate").innerHTML = forecast[3].futureWeather;
    document.querySelector(".dayFourIcon").src = 'http://openweathermap.org/img/wn/' + data.daily[3].weather[0].icon + '@2x.png';
    document.querySelector(".dayFourTemp").innerHTML = `Temp: ${Math.floor((data.daily[3].temp.day - 271.15))}°C`;
    document.querySelector(".dayFourWind").innerHTML = `Wind: ${Math.floor((data.daily[3].wind_speed * 3.6))} KPH`;
    document.querySelector(".dayFourHumidity").innerHTML = `Humidity: ${data.daily[3].humidity}%`;

    document.querySelector(".dayFiveDate").innerHTML = forecast[4].futureWeather;
    document.querySelector(".dayFiveIcon").src = 'http://openweathermap.org/img/wn/' + data.daily[4].weather[0].icon + '@2x.png';
    document.querySelector(".dayFiveTemp").innerHTML = `Temp: ${Math.floor((data.daily[4].temp.day - 271.15))}°C`;
    document.querySelector(".dayFiveWind").innerHTML = `Wind: ${Math.floor((data.daily[4].wind_speed * 3.6))} KPH`;
    document.querySelector(".dayfiveHumidity").innerHTML = `Humidity: ${data.daily[4].humidity}%`;
};

// Function to save button name value into localStorage 
let saveFunction = function () {
    localStorage.setItem("saved", JSON.stringify(searches));
};

// Function to retrieve data saved in localStorage and recreate the buttons that are appended to the webpage
// The loadFunction was designed so that the buttons and their functionality persist, but the actual content is once again hidden upon refresh
let loadFunction = function () {
    let retrievedData = localStorage.getItem("saved");
    if (!retrievedData) {
        return false
    };
    let loadData = JSON.parse(retrievedData);
    for (let i = 0; i < loadData.length; i++) {
        makeSearchHistory(loadData[i]);
    };
};

// Function to allow user to clear localStorage and clear the Past Searches
let clearData = function () {
    localStorage.clear();
    window.location.reload();
};


// runs the function when the search button is clicked
searchButtonEl.addEventListener("click", formSubmitHandler);
clearButtonEl.addEventListener("click", clearData);
loadFunction();