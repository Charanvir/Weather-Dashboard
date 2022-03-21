// api key = f9dcdf6690d0d22c5198371e258e8bb2
let cityInputEl = document.querySelector("#cityName");
let searchButtonEl = document.querySelector("#searchButton");
let searchHistory = document.querySelector(".history");
let historySectionEl = document.querySelector(".history");
let clearButtonEl = document.querySelector("#clearButton");
let searches = [];
let currentDate = moment().format('l');
let forecastOne = moment().add(1, 'days').format('l');
let forecastTwo = moment().add(2, 'days').format('l');
let forecastThree = moment().add(3, 'days').format('l');
let forecastFour = moment().add(4, 'days').format('l');
let forecastFive = moment().add(5, 'days').format('l');
let currentNameEl = document.querySelector(".currentName");
let currentTempEl = document.querySelector(".currentTemp");
let currentWindEl = document.querySelector(".currentWind");
let currentHumidityEl = document.querySelector(".currentHumidity");
let currentUVEl = document.querySelector(".currentUV");
let currentIconEl = document.querySelector("#currentIcon");
let weatherSectionEl = document.querySelector(".weather");


// the One Call API takes longitudinal and latitudinal coorindates, so needs to use another API to fetch the city name, then pass the coordiantes into getCityCoordiantes to access the data from oneShotAPI
let getCity = function (userCity) {
    let apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + userCity + "&limit=1&appid=f9dcdf6690d0d22c5198371e258e8bb2";

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    getCityCoordinates(data[0].lat, data[0].lon, data[0].name)
                });
            } else {
                alert("Please enter a valid city!")
                return
            };
        })
        .catch(function (error) {
            alert("Please enter a valid city!")
            return
        });
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
        });
};


// This functions is called when the city name is entered by the user and it passes the inputted text into getCity
let formSubmitHandler = function (event) {
    event.preventDefault();

    var searchCity = cityInputEl.value.trim();
    if (searchCity) {
        getCity(searchCity);
        cityInputEl.value = "";
        let searchesName = {
            name: searchCity
        }
        makeSearchHistory(searchesName);
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
        if (searchCity) {
            getCity(searchCity);
            cityInputEl.value = "";
        };
    });
};

// This function takes the current weather information
let getWeatherInfo = function (windSpeed, temp, humidity, UV, icon, name) {
    weatherSectionEl.classList.remove("weather");
    currentNameEl.innerHTML = `${name} ${currentDate} `
    currentIconEl.src = 'http://openweathermap.org/img/wn/' + icon + '@2x.png';
    currentWindEl.innerHTML = `Wind Speed: ${windSpeed * 3.6} KPH`;
    currentTempEl.innerHTML = `Temp: ${(Math.floor(temp - 271.15))}°C`
    currentHumidityEl.innerHTML = `Humidity: ${humidity}%`;
    currentUVEl.innerHTML = `UV index: <span>${UV}</span>`;
    if (0 <= UV | UV <= 2) {
        currentUVEl.classList.add("favorable");
    } else if (2 < UV | UV <= 7) {
        currentUVEl.classList.add("moderate");
    } else if (7 < UV) {
        currentUVEl.classList.add("severe");
    };
};

// This function gets the data needed to make the 5-day forcast, utilizing a loop to forcast 5 days
let fiveDayForcast = function (data) {
    for (let i = 0; i < 5; i++) {
        console.log(data.daily);
        console.log(`Day ${i + 1}: icon: ${data.daily[i].weather[0].icon}, temp: ${Math.floor((data.daily[i].temp.day - 271.15))}°C, wind speed: ${(data.daily[i].wind_speed * 3.6)} kph, humidity: ${data.daily[i].humidity}%`);
    };
};

// Function to save button name value into localStorage 
let saveFunction = function () {
    localStorage.setItem("saved", JSON.stringify(searches));
};

// Function to retrieve data saved in localStorage and recreate the buttons that are appended to the webpage
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
    if (historySectionEl.contains(document.querySelector(".historyButtonInput"))) {
        let button = document.querySelector(".historyButtonInput")
        button.remove();
    };
};


// runs the function when the search button is clicked
searchButtonEl.addEventListener("click", formSubmitHandler);
clearButtonEl.addEventListener("click", clearData);
loadFunction();
