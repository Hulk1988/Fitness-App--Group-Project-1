// weather api
// function getWeather() {
//connect to firebase
$('#weatherResults').hide();
var token = "pk.eyJ1IjoiYW5kcmV3anRob21zZW4iLCJhIjoiY2pyNXFjam03MjlnNzQ0c2VzNjIzcWdhdyJ9.OgdsY8LjrFyxmcmOYXuAoA";

// Initialize Firebase
var config = {
  apiKey: "AIzaSyDj3IyQilG9_31NE5FHhFzVK_TJRNWcHEE",
  authDomain: "fitness-app-ecde0.firebaseapp.com",
  databaseURL: "https://fitness-app-ecde0.firebaseio.com",
  projectId: "fitness-app-ecde0",
  storageBucket: "fitness-app-ecde0.appspot.com",
  messagingSenderId: "669412677794"
};
firebase.initializeApp(config);
let fireDB = firebase.database();

// click function for getting weather conditions
$("#getWeather").on("click", getWeather);
function getWeather() {
  // Build URL
  var locationInput = $('#location').val()
  var ajaxUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    locationInput +
    "&appid=f4012622bd78ad3173b7526c476fb82a"; // test by throwing url into chrome
  
  // Make AJAX call.
  $.ajax({
    //objects made up of methods, properties, and key value pairs
    url: ajaxUrl,
    method: "GET"

  })

  // Deal with response data.
  .done(function(weatherData, status) {
      console.log(weatherData);
      dynamicBkgrnd(weatherData.main.temp);
      // Display results to user.
      var tempKelvin = weatherData.main.temp;
      var tempCelcius = tempKelvin - 273.15;
      var tempFarenheit = roundTwoDecimals(tempCelcius * 9 / 5 + 32);
      $('#temperature').text(tempFarenheit);
      $('#humidity').text(weatherData.main.humidity + '%');
      $('#visibility').text(weatherData.visibility);
      if (weatherData.hasOwnProperty('rain')) {    
        $('#rain').text(weatherData.rain[""]);
      } else {
        $('#rain').text('No rain today. Great time for a run!');
      }
      $('#wind').text(weatherData.wind.speed + ' mph, ' + weatherData.wind.deg + ' deg');
      $('#weatherResults').fadeIn();
  });
}

function roundTwoDecimals(num) {
  return Math.floor((num * 100) / 100);
}

$("#saveWorkout").on("click", saveWorkout);
function saveWorkout() {  
  var origin = directions.getOrigin().geometry.coordinates;
  var destination = directions.getDestination().geometry.coordinates;
  var originString = origin[0] + ',' + origin[1];
  var destinationString = destination[0] + ',' + destination[1];
  reverseGeocode(originString, function(originName) {
    reverseGeocode(destinationString, function(destinationName) {
      var el = $('<div>'
        + originName + '<br>'
        + destinationName + '<br>'
        + durationString
        + '</div>');
      
      $("#workout-response").append(el);
    });
  });
};

  
// Given a set of coordinates
function reverseGeocode(coordinateString, callback) {
  var url = "https://api.mapbox.com/geocoding/v5/mapbox.places/"
    + coordinateString 
    + ".json?access_token="
    + token;

  $.ajax({
    url: url
  })
  .done(function(response) {
    console.log(response);
    var placeName = response.features[0].place_name;

    callback(placeName);
  })
}
  
	// 		$.ajax({
	// // The URL for the Time Map endpoint.
	// url: "http://api.traveltimeapp.com/v4/time-map",
	// // We will need to send a POST request.
	// type: "post",
	// // The authentification headers.
	// "headers": headers,
	// // The request body in a JSON format.
	// data: JSON.stringify(request),
	// contentType: "application/json; charset=UTF-8",
	// success: function (data) {
// 	// 	// Here we handle the response from Time Map
// }
// 		}); 
 
 // var request = {
  //   query: location
  // };		
  // var headers = {appid:"93383482",
  // Key:"254e20591b5de8ec660860b800176167"};
  // $.ajax({
  //   // The URL for the geocoding endpoint.
  //   url : "http://api.traveltimeapp.com/v4/geocoding/search/",
  //   // We need to send a GET request to it.
  //   type: "get",
  //   // The authentification headers.
  //   "headers": headers,
  //   data: request,
  //   contentType: "application/json; charset=UTF-8",
  //   // We handle the response here
  //   success: function (data) {
  //     // Here we handle the response with the coordinates for the location.	
  // }});
  // // The request for Time Map. Reference: http://docs.traveltimeplatform.com/reference/time-map/
			
  // var request = {
  //   // This will be a search where we depart a specified time.
  //   departure_searches: [ {
  //     // The id is useful when you send multiple searches in one request. Since we create only one search it doesn't matter much since we expect only one result.
  //     id: "first_location",
  //     // The coordinates for the departure location in a hash. { lat: <lat>, lng: <lng> }
  //     "coords": coords,
  //     // The transportation type for this search. We will be using public transport. 
  //     transportation: {
  //       type: "public_transport"
  //     },
  //     // The departure time in an ISO format.
  //     departure_time: departureTime,
  //     // Travel time in seconds.
  //     travel_time: travelTime
  //   } ],
  //   // We will not be creating any shapes with a specified arrival time in this example so the array is empty.
  //   arrival_searches: [] 

  // add to display results to user




// add below closing tag in js


  dynamicBkgrnd = function (kelvin) {
    var farenheight = Math.floor(1.8 * (kelvin - 273) + 32);
    console.log(farenheight);
    if (farenheight >= -99 && farenheight <= 0) {
        $('body').attr("id", "sub-zero");
    }
    if (farenheight >= 1 && farenheight <= 34) {
        $('body').attr("id", "sub-zero");
    }
    if (farenheight >= 35 && farenheight <= 45) {
        $('body').attr("id", "sub-fofi");
    } 
    else if (farenheight >= 46 && farenheight <= 55) {
        $('body').attr("id", "sub-fifi");
    } 
    else if (farenheight >= 56 && farenheight <= 65) {
        $('body').attr("id", "sub-sifi");
    } 
    else if (farenheight >= 66 && farenheight <= 75) {
        $('body').attr("id", "sub-sefi");
    } 
    else if (farenheight >= 76 && farenheight <= 85) {
        $('body').attr("id", "sub-eifi");
    } 
    else if (farenheight >= 86 && farenheight <= 95) {
        $('body').attr("id", "sub-nifi");
    } 
    else if (farenheight >= 96 && farenheight <= 105) {
        $('body').attr("id", "sub-onhufi");
    } 
    else if (farenheight >= 106 && farenheight <= 200) {
        $('body').attr("id", "too-hot");
    }
};