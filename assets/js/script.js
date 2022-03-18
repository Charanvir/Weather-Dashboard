// api key = f9dcdf6690d0d22c5198371e258e8bb2
let cityInputEl = document.querySelector("#cityName");
let searchButtonEl = document.querySelector("#searchButton");

let getCity = function (userCity) {
    let apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + userCity + "&limit=1&appid=f9dcdf6690d0d22c5198371e258e8bb2"

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    getCityCoordinates(data[0].lat, data[0].lon)
                })
            } else {
                console.log("no city entered")
            }
        })
        .catch(function (error) {
            console.log("no city entered")
        })
}

let getCityCoordinates = function (lat, lon) {
    let apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude={part}&appid=f9dcdf6690d0d22c5198371e258e8bb2";
    fetch(apiUrl)
        .then(function (response) {
            response.json().then(function (data) {
                console.log(data)
                console.log(apiUrl)
            });
        });
};

let formSubmitHandler = function (event) {
    event.preventDefault();

    var searchCity = cityInputEl.value.trim();
    if (searchCity) {
        getCity(searchCity);
        cityInputEl.value = "";
    };
};

searchButtonEl.addEventListener("click", formSubmitHandler);
