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
    //api key: f4012622bd78ad3173b7526c476fb82a
    //firebase setup
  })

  // Deal with response data.
  .done(function(weatherData, status) {
      console.log(weatherData);
      // Display results to user.
      $('#humidity').text(weatherData.main.temp);
      $('#humidity').text(weatherData.main.humidity);
      $('#visibility').text(weatherData.main.);
      $('#rain').text(weatherData.main.);
      $('#wind').text(weatherData.main.);
      $('#weatherResults').fadeIn();
  });
}

// })

//click function for mapping out run and calculating distance
$("#mapRun").on("click", mapWorkout);
function mapWorkout() {
  var ajaxUrl = "?q=" + topic + "&appid=";
  $.ajax({
    //objects made up of methods, properties, and key value pairs
    url: ajaxUrl,
    method: "GET"
  });
}

//frebase push function