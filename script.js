let currentCityName;
let searchCityList =[];

// Target an element with an id of searchCityList and removes all of its child elements and text content so can populate the id with new content (a new city)
function displayCityList(){
    $("#searchCityList").empty();
    $("#cityInput").val("");

    // Create an <a> element for each city in searchCityList (an array of data)
    for (i=0; i<searchCityList.length; i++) {
        let a = $("<a>");
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

function retrieveSearchedCityList() {
    let storedSearchedCityList = JSON.parse(localStorage.getItem("cities"));
    if (storedSearchedCityList !== null) {
        searchCityList = storedSearchedCityList;
    }

    displayCity();
}

// currentSearchedCity = cityname (example)
// This function displays the weather forecast 
    // 1. load most recent searched city (get from local storage)
    // 2. account for first time when nothing in local storage (then the current searched city becomes)
function retrieveWeatherForecast() {
    // JSON.parse to convert string to object
    let storedWeatherForecast = JSON.parse(localStorage.getItem("currentSearchedCity"))
    // null = empty space
    if (storedWeatherForecast !== null) {
        currentCityName = storedWeatherForecast;
        // anonymous functions for HTTP request
        displayWeatherForecast();
        displayFiveDayForecast();
    }
}

// Saves current searched city to local storage in browser under "currentSearchedCity" key
function storeCurrentCity() {
    localStorage.setItem("currentSearchedCity", JSON.stringify(currentCityName))
}

// Saves city list (array) to local storage under "cities" key
function storeSearchedCityList() {
    localStorage.setItem("cities", JSON.stringify(searchCityList))
}

// This function handles event for clickable search button
    // 1. Add event listener to button
    // 2. Retrieve city name from input (validation)
    // 3. Add city to list (have a max)
    // 4. Save updated list to local storage
    // 5. Display (current) searched weather forecast and 5-day forecast
// document.getElementById("#searchBtn").addEventListener("click", function(event)){}
$("#searchBtn").on("click", function() {
    //event.preventDefault();
    // city name = value from input but remove any extra spaces
    let currentCityName = $("#searchInput").val().trim();

    if(currentCityName === ""){
        alert("Please enter a city")
    // Want only 6 items in list 
    } else if (searchCityList.length >= 6) {
        // removes first list item
        searchCityList.shift();
        // add new city to end of the list
        searchCityList.push(currentCityName);
    } else {
        // add new city to end of the list if havent reached max of 6 in list
        searchCityList.push(currentCityName);
    }

    // Call all functions to be triggered after click
    storeCurrentCity();       
    storeSearchedCityList();  
    displayCityList();        
    displayWeatherForecast(); 
    displayFiveDayForecast(); 
});

//Triggers Open Weather API AJAX call 
//Outputs: current city, current weather, 5 day forecast
async function displayWeatherForecast() {
    // API Key: a76d5ca55046a6730024f9d3c573ab2b
    // Example of API call: api.openweathermap.org/data/2.5/forecast?id=524901&appid={API key}
    // API RECOMMENDATIONS:
        // Recommend making API calls no more than once in 10 minutes for each location, whether you call it by city name, geographical coordinates or by zip code. 
        // The update frequency of the OpenWeather model is not higher than once in 10 minutes.
        // The only endpoint for making free API calls is api.openweathermap.org.
        // To get a precise geocoding searching result would rather call API by geographical coordinates. You can always call the OpenWeather APIs using the city name or zip/post code.
            // This means to obtain the precise geographical coordinates for a location, you can use OpenWeatherMap's Geocoding API. This API allows you to search for a location by its name or address and returns the corresponding latitude and longitude coordinates. You can then use these coordinates to call the OpenWeatherMap API and get a more accurate weather forecast for that location.
        //don't recommend using large locations or countries as it will not be weather data for a large location (aggregated data or averages), but weather data for a central point of the territory.
        //specify imperial units: &units=imperial
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&units=imperial&appid=a76d5ca55046a6730024f9d3c573ab2b";

    //response = response from server 
    // send an HTTP GET request to the URL specified by the queryURL variable.
    const response = await $.ajax({
        url: queryURL,
        method: "GET"
      });
        console.log(response);
        // Create new div element
        let currentWeatherDiv = $("<div class='card-body' id='currentWeather'>");
        //name = field in API response = API documentation specifies that the city name will be returned as a string in the (name) property of the JSON response object. 
        // fields in the API response are the data that you receive from the API, while API parameters are the inputs that you provide to the API in order to customize your request and control what data is returned in the response.
        let fetchCurrentCity = response.name;
        // Date () = built-in object in javascript that represents a specififc date and time as a parameter, and provides methods for working with dates and times. 
        // Create a new instance of the Date object using the "new" keyword and the Date() constructor
        let date = new Date();

        // Built in js functions: 
            //.getDate() = returns the day of the month as a number between 1 and 31 for the specified date.
            // .getMonth() = getMonth() is a method of the Date object that returns the month (0-11) for the specified date. (Ex: if have a Date object myDate representing March 19, 2023, can call myDate.getMonth() to get the value 2 (+1 included in tempalte literal)
                    // date.getMonth() = month of the current date as a number from 0 to 11, where 0 represents January and 11 represents December
                    // NOTE: since most are used to seeing the month number starting from 1, add 1 to the month number using +1 operator.
            //.getFullYear() = returns the year as a 4-digit number for the specified date. For ex: if have a Date object myDate representing March 19, 2023, can call myDate.getFullYear() to get the value 2023.
        let retrieveFullDateVal=`${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`;
        // retrieve the current weather icon from an API response object, so it can be used to display the current weather conditions.
        // response.weather.id is an array that contains weather condition icon id-related information for a particular location. (Fields in API response in documentation)
            // response.weather[0] = accessing the first element in the weather array (which contains weather-related data, such as temperature, humidity, and an icon that represents the current weather conditions.)
        let fetchCurrentWeatherIcon = response.weather[0].icon;
        console.log(response.weather);
        //fetchcurrentWeatherIcon = variable that holds the icon code that was obtained from the API response object.
        // https://openweathermap.org/current ---> list of condition codes --> to see documentation on current weather data api info
            // For the icon sets that are available on the OpenWeatherMap website, the URL format is:
                // http://openweathermap.org/img/w/{iconCode}.png
            // For the weather icons that are returned as part of the API response, the URL format is:
                // http://openweathermap.org/img/wn/{iconCode}@2x.png
        let displayCurrentWeatherIcon = $(`<img src = http://openweathermap.org/img/wn/"${fetchCurrentWeatherIcon}@2x.png />`);
        // set <h3> element = the value of fetchCurrentCity, followed by a space and an opening parenthesis, followed by the value of retrieveFullDateVal, followed by a closing parenthesis. 
            // Ex: <h3> = New York (March 20, 2023)
        // Create h3 element
        // text() = method used to set the text content of the element to a string 
        // remember: let retrieveFullDateVal=`${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`;
        let currentCityandDateEl = $('<h3>').addClass('card-body').text(`${fetchCurrentCity} ${retrieveFullDateVal}`);
        // Attach icon to City 
        // .append() = jquery method to add new content or elements to the end of an existing element (to the end of the selected elements)
        // When the append() method is called on currentCityandDateEl with displayCurrentWeatherIcon as an argument, it will insert displayCurrentWeatherIcon into currentCityandDateEl as a child element.       
        // ie: displayCurrentWeatherIcon (the weather icon image) will be displayed within the currentCityandDateEl element on the page, following the city and date information.     
        currentCityandDateEl.append(displayCurrentWeatherIcon);
        // When the append() method is called on currentWeatherDiv with currentCityandDateEl as an argument, it will insert currentCityEl into currentWeatherDiv as a child element.
        // ie: currentCityEl is being put into the currentWeatherDiv element.
        currentWeatherDiv.append(currentCityandDateEl);
        // From API doc: https://openweathermap.org/current#list   (Fields in API Resonse seciton)
            // main.temp = Temperature. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit.
            // .toFixed() method = used to format a number with a fixed number of digits after the decimal point.
            // .toFixed(1) --> returns a string with the number formatted to 1 decimal places: (ie: 3.1)
        let fetchTemp = response.main.temp.toFixed(1);
        let tempEl = $('<p class="card-text">').text(`Temperature: ${fetchTemp}° F`);
        // Attach temperature to currentWeatherDiv container:
        // ie: Add tempEl as a child element to the currentWeatherDiv
        currentWeatherDiv.append(tempEl);
        //Retrieve humidity response
        // From API doc: https://openweathermap.org/current#list   (Fields in API Response section)
            // main.humidity = humidity, %
        let fetchHumidity = Math.round(response.main.humidity);
        //Create new paragraph element that contains humidity information
        let humidityEl = $('<p class="card-text">').text(`Humidity: ${fetchHumidity}%`);
        // Attach humidity to currentWeatherDiv container
        currentWeatherDiv.append(humidityEl);
        //Fields in API Response section -->
            // wind.speed = Wind speed. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour. (Use imperial)
            // Math.round() --> round a number to an integer (no decimal places)
        let fetchWindSpeed = Math.round(response.wind.speed);
        //Create new paragraph element that contains wind speed information
        let windSpeedEl = $('<p class="card-text">').text(`Wind Speed: ${fetchWindSpeed} mph`);
        // Attach humidity to currentWeatherDiv container
        currentWeatherDiv.append(windSpeedEl);

        // UVindex endpoint needs two query parameters: lat and long
        //Fields in API Response section --> coord.lon = City geo location, longitude
        //let fetchLong = response.coord.lon;
        //Fields in API Response section --> coord.lat = City geo location, latitude
        //let fetchLat = response.coord.lat;
        // API Key: a76d5ca55046a6730024f9d3c573ab2b
        // Example of API call: api.openweathermap.org/data/2.5/forecast?id=524901&appid={API key}
        //let uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=a76d5ca55046a6730024f9d3c573ab2b&lat="+fetchLat+"&lon="+fetchLong;
        //let uvResponse = await $.ajax({
          //  url: uvURL,
          //  method: "GET"
       // })
}

// displayFiveDayForecast() runs the AJAX call for the 5 day forecast and displays to the DOM

async function displayFiveDayForecast() {
    // API Key: a76d5ca55046a6730024f9d3c573ab2b
        // Example of API call: api.openweathermap.org/data/2.5/forecast?id=524901&appid={API key}
    let queryURL = "https://api.openweathermap.org/data/2.5/forecast?q="+cityname+"&units=imperial&appid=d3b85d453bf90d469c82e650a0a3da26";
    // send ajax request to API using queryURL (use of API key for access) and "GET" method
    // await = makes sure that the response is recieved before running code
    let response = await $.ajax({
        url: queryURL,
        method: "GET"
      })
      // Create new div element: id =fiveDayForecast
      let newForecastDiv = $("<div id='fiveDayForecast'>");
      // Create new h3 element that says: 5 Day Forecast
      let newForecastHeader = $('<h3>').addClass('card-title m-3').text('5 Day Forecast');
      // Insert displayCurrentWeatherIcon will be inserted into currentCityandDateEl as a child element.
      newForecastDiv.append(newForecastHeader);
      // Create new div element: class =card-deck
      // "card-deck" = Bootstrap class used to group multiple cards together and create a horizontal layout with equal-width and height columns.
      let newCardDeck = $("<div class='card-deck'>");
      // When the append() method is called on forecastDiv with newCardDeck as an argument, it will insert newCardDeck into forecastDiv as a child element.
      forecastDiv.append(newCardDeck);
      
      console.log(response);
      for (i=0; i<5;i++){
          // Bootstrap: mb = margin-bottom, mt = margin-top
          // Create a new div element for forecast card
          let newForecastCard = $("<div class='card mb-3 mt-3'>");
          // Create a new div element for forecast card body
          let newCardBody = $("<div class='card-body'>");
          // Date () = built-in object in javascript that represents a specififc date and time as a parameter, and provides methods for working with dates and times. 
          // Create a new instance of the Date object using the "new" keyword and the Date() constructor so that calculate the date for each of the five days in the forecast, by incrementing the date by one day with each iteration of the loop.
          let date = new Date();
          // MM(from 0(jan)-11(dec)) / DD / YYYY
          // (date.getMonth()+1) --> In order to display the month as a number between 1-12, add 1 to the month value (date.getMonth()) to adjust the value to be between 1 and 12 
          // (date.getDate()+i+1) --> used to calculate the day component of the date string in the format "MM/DD/YYYY".
          // date.getFullYear() --> a method that returns the year of the specified date as a four-digit number.
          let retrieveFullDateVal=`${(date.getMonth()+1)}/${(date.getDate()+i+1)}/${date.getFullYear()}`;
          let forecastDate = $('<h3>').addClass('card-title').text(retrieveFullDateVal);
        
        // Insert newCardDeck into forecastDiv as a child element.
        newCardBody.append(forecastDate);
        // Retrieve the icon code for the current [0] weather condition for the forecast for a specific day.
        // OpenWeatherMap API doc (fields in API for 5 day forecast): https://openweathermap.org/forecast5#list
            // list.weather.icon = Weather icon id
            // weather array for each of the 5-day forecast entries contains an object with the following properties; id (weather condition id), main (group of weather parameters), description (weather condition within group), icon (weather icon id)
            // weather[0] = current/primary weather condition
            // i = index to access the forecast for a specific day in the loop
        let fetchCurrentWeatherIcon = response.list[i].weather[0].icon;
        console.log(fetchCurrentWeatherIcon);
        // Create a new img element for icon to reside
        let displayWeatherIcon = $(`<img src="http://openweathermap.org/img/wn/${fetchCurrentWeatherIcon}.png" />`);
        // Insert displayWeatherIcon into newCardBody as a child element
        // Icon will dispay after forecastDate element and before tempEl and humidityEl
        newCardBody.append(displayWeatherIcon);
        
        // OpenWeatherMap API doc (fields in API for 5 day forecast): https://openweathermap.org/forecast5#list
        // list[i].main.temp = Temperature. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit.
        let fetchTemp = response.list[i].main.temp;
        // Create new <p> element for Temperature
        let tempEl = $("<p class='card-text'>").text(`Temperature: ${fetchTemp}° F`);
        // Insert tempEl into newCardBody as a child element (appears before humidtyEl and windSpeedEl)
        newCardBody.append(tempEl);


        let fetchHumidity = response.list[i].main.humidity;
        // Create new <p> element for Humidity
        let humidityEl = $("<p class='card-text'>").text(`Humidity: ${fetchHumidity}%`);
        // Insert humidityEl into newCardBody as a child element (appears after tempEl)
        newCardBody.append(humidityEl);

        // Latest
        // list[i].wind.speed = Wind speed. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour.
        let fetchWindSpeed = response.list[i].wind.speed;
        // Create new <p> element for Wind Speed
        let windSpeedEl = $("<p class='card-text'>").text(`Humidity: ${fetchWindSpeed}%`);
        // Insert windSpeedEl into newCardBody as a child element (appears after humidityEl)
        newCardBody.append(windSpeedEl);
        // newCardBody = represents forecast information. Holds all the relevant information about the weather forecast for a specific day aka one card (ie: date, icon, temp, humidity, wind speed. For forloop create 5 times.
        // newForecastCard = represents forecast card. Div element that represents a bootstrap card. For forloop create 5 times.
        // Insert forecast information into forecast card as a child element
        newForecastCard.append(newCardBody);
        newcardDeck.append(callForecastCard);
      }
      $("#forecastContainer").html(forecastDiv);
    }

// This function is used to pass the city in the history list to the displayWeather function
function historyDisplayWeather(){
    cityName = $(this).attr("data-name");
    displayWeather();
    displayFiveDayForecast();
    console.log(cityName);
    
}

$(document).on("click", ".city", historyDisplayWeather);
