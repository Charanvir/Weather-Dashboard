// api key = f9dcdf6690d0d22c5198371e258e8bb2
let cityInputEl = document.querySelector("#cityName");
let searchButtonEl = document.querySelector("#searchButton");
let searchHistory = document.querySelector(".history");
let historySectionEl = document.querySelector(".history")
let searches = [];

// the One Call API takes longitudinal and latitudinal coorindates, so needs to use another API to fetch the city name, then pass the coordiantes into getCityCoordiantes to access the data from oneShotAPI
let getCity = function (userCity) {
    let apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + userCity + "&limit=1&appid=f9dcdf6690d0d22c5198371e258e8bb2"

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    getCityCoordinates(data[0].lat, data[0].lon, data[0].name)
                })
            } else {
                console.log("no city entered")
            }
        })
        .catch(function (error) {
            console.log("no city entered")
        })
}
// have all other functions that need API data run in this function
// Once the city coordinates are found, can pass into this function and get the API data that is needed
let getCityCoordinates = function (lat, lon, name) {
    let apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude={part}&appid=f9dcdf6690d0d22c5198371e258e8bb2";
    fetch(apiUrl)
        .then(function (response) {
            response.json().then(function (data) {
                // console.log(data.daily);
                // console.log(apiUrl)
                getWeatherInfo(data.current.wind_speed, data.current.temp, data.current.humidity, data.current.uvi, data.current.weather[0].icon, name)
                fiveDayForcast(data)
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
        searches.push(data)
        saveFunction();
    };
    // this gives the functionality to make the created buttons display the weather data when clicked, much like the form submit button click function
    historyButton.addEventListener("click", function () {
        var searchCity = historyButton.innerHTML
        if (searchCity) {
            getCity(searchCity);
            cityInputEl.value = "";
        }
    })
};

// This function takes the current weather information
let getWeatherInfo = function (windSpeed, temp, humidity, UV, icon, name) {
    console.log(name);
    console.log(`Current wind speeds are ${windSpeed}`);
    console.log(`Current temperature is ${(Math.floor(temp - 271.15))}°C`);
    console.log(`Current humidity is ${humidity}`);
    console.log(`Current UV index is ${UV}`);
    console.log(icon);
};

// This function gets the data needed to make the 5-day forcast, utilizing a loop to forcast 5 days
let fiveDayForcast = function (data) {
    for (let i = 0; i < 5; i++) {
        console.log(data.daily);
        console.log(`Day ${i + 1}: icon: ${data.daily[i].weather[0].icon}, temp: ${Math.floor((data.daily[i].temp.day - 271.15))}°C, wind speed: ${data.daily[i].wind_speed}, humidity: ${data.daily[i].humidity}`);
    }
};

// Function to save button name value into localStorage 
let saveFunction = function () {
    localStorage.setItem("saved", JSON.stringify(searches));
}

// Function to retrieve data saved in localStorage and recreate the buttons that are appended to the webpage
let loadFunction = function () {
    let retrievedData = localStorage.getItem("saved");
    if (!retrievedData) {
        return false
    };
    let loadData = JSON.parse(retrievedData);
    for (let i = 0; i < loadData.length; i++) {
        makeSearchHistory(loadData[i])
    }

}


// runs the function when the search button is clicked
searchButtonEl.addEventListener("click", formSubmitHandler);
loadFunction();
