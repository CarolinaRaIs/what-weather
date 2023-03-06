var searchCityList =[];
var currentCityName;

// Saves current searched city to local storage in browser
function storeCurrentCity() {
    localStorage.setItem("currentSearchedCity", JSON.stringify(currentCityName))
}

// Saves city list (array) to local storage under "cities" key
function storeSearchedCityList() {
    localStorage.setItem("cities", JSON.stringify(searchCityList))
}

// Target an element with an id of searchCityList and removes all of its child elements and text content so can populate the id with new content (a new city)
function displayCity(){
    $("#searchCityList").empty();
    $("#cityInput").val("");

    // Create an <a> element for each city in searchCityList (an array of data)
    for (i=0; i<searchCityList.length; i++) {
        var a = $("<a>");
        // list-group-item = Bootstap class to create a list item in a list group
        // list-group-item-action = Bootstrap Class used to create clickable list item
        a.addClass("city list-group-item list-group-item-action")
        console.log(data);
        // "data-cityName" --> a custom attribute added to the <a> element that will be used to store data about Searched cities. 
        a.text("data-cityName", searchCityList[i]);
        // .append = add element to the end of the container
        // .prepend = add new element to top of list (so can see most recent mroe quickly) 
        // "Add new <a> item"
        $("#searchCityList").prepend(a);
    }
}

// This function displays searched city list array from local storage
// "get item" from local storage = stringified object (a string)
// JSON.parse(stringified object) = Object (a array)

function getSearchedCityList() {
    var storedSearchedCityList = JSON.parse(localStorage.getItem("cities"));
    if (storedCityList !== null) {
        searchCityList = storedSearchedCityList;
    }

    displayCity();
}

// currentSearchedCity = cityname (example)
// This function displays the weather forecast 
    // 1. load most recent searched city (get from local storage)
    // 2. account for first time when nothing in local storage (then the current searched city becomes)
function getWeatherForecast() {
    // JSON.parse to convert string to object
    var storedWeatherForecast = JSON.parse(localStorage.getItem("currentSearchedCity"))
    // null = empty space
    if (storedWeatherForecast !== null) {
        currentSearchedCity = storedWeatherForecast;
        // anonymous functions for HTTP request
        displayWeatherForecast();
        displayFiveDayForecast();
    }
}

// This function handles event for clickable search button
// 1. Add event listener to button
    // 2. Retrieve city name from input (validation)
    // 3. Add city to list (have a max)
    // 4. Save updated list to local storage
    // 5. Display (current) searched weather forecast and 5-day forecast
$("#searchBtn").on("click", function(event)) {
    event.preventDefault();
}
