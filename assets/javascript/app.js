// weather api
// function getWeather() {
//connect to firebase
$('#weatherResults').hide();

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
      // Display results to user.
      $('#humidity').text(weatherData.main.temp);
      $('#humidity').text(weatherData.main.humidity);
      $('#visibility').text(weatherData.visibility);
      $('#rain').text(weatherData.rain["1h"]);
      $('#wind').text(weatherData.wind.speed + ' mph, ' + weatherData.wind.deg + ' deg');
      $('#weatherResults').fadeIn();
  });
}

$("#saveWorkout").on("click", saveWorkout);
function saveWorkout() {  
 var request = {
  query: location
 };		
 var headers = {appid:"93383482",
  Key:"254e20591b5de8ec660860b800176167"};
 $.ajax({
   // The URL for the geocoding endpoint.
   url : "http://api.traveltimeapp.com/v4/geocoding/search/",
   // We need to send a GET request to it.
   type: "get",
   // The authentification headers.
   "headers": headers,
   data: request,
   contentType: "application/json; charset=UTF-8",
   // We handle the response here
   success: function (data) {
     // Here we handle the response with the coordinates for the location.	
 }});
 // The request for Time Map. Reference: http://docs.traveltimeplatform.com/reference/time-map/
			
var request = {
	// This will be a search where we depart a specified time.
	departure_searches: [ {
		// The id is useful when you send multiple searches in one request. Since we create only one search it doesn't matter much since we expect only one result.
		id: "first_location",
		// The coordinates for the departure location in a hash. { lat: <lat>, lng: <lng> }
		"coords": coords,
		// The transportation type for this search. We will be using public transport. 
		transportation: {
			type: "public_transport"
		},
		// The departure time in an ISO format.
		departure_time: departureTime,
		// Travel time in seconds.
		travel_time: travelTime
	} ],
	// We will not be creating any shapes with a specified arrival time in this example so the array is empty.
	arrival_searches: [] 
};
		
			$.ajax({
	// The URL for the Time Map endpoint.
	url: "http://api.traveltimeapp.com/v4/time-map",
	// We will need to send a POST request.
	type: "post",
	// The authentification headers.
	"headers": headers,
	// The request body in a JSON format.
	data: JSON.stringify(request),
	contentType: "application/json; charset=UTF-8",
	success: function (data) {
		// Here we handle the response from Time Map
}
		}); 
 
  };
   
  

