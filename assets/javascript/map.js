// // The name of the starting location. We will have to geocode this to coordinates.
// var startingLocation = "The White House, DC";
// // The departure time in an ISO format.
// var departureTime = "2018-07-04T09:00:00-0500";
// // Travel time in seconds. We want 1 hour travel time so it is 60 minutes x 60 seconds.
// var travelTime = 60*60; 


// // These headers are needed to authenticate the request
// var headers = {
//  "X-Application-Id": "93383482",
//  "X-Api-Key": "254e20591b5de8ec660860b800176167",
//  "x-requested-with": "xhr",
// };
        
// // Sends the geocoding request.
// function sendGeocodingRequest(location) {
//     // The request for the geocoder. Reference: http://docs.traveltimeplatform.com/reference/geocoding-search/
//     var request = {
//     query: location
//     };		
//     var originalURL = "http://api.traveltimeapp.com/v4/geocoding/search";
//     var queryURL = "https://cors-anywhere.herokuapp.com/" + originalURL
//     // var queryURL2 = "https://cors-anywhere.herokuapp.com/" + originalURL2
//     $.ajax({
//         url : queryURL,
//         type: "get",
//         headers: headers,
//         data: request,
//         contentType: "application/json; charset=UTF-8",
//         success: sendTimeMapRequest
//     });
// };
// //cross-origin request problem as CORS request because it's intended to be used with node.
// // Trying to get the CORS anywhere heroku app to work. Ok with map API with integrated on HTML
    

// // Sends the request of the Time Map multipolygon.
// function sendTimeMapRequest(geocodingResponse) {
//     // The request for Time Map. Reference: http://docs.traveltimeplatform.com/reference/time-map/		
//     var coords = data.features[0].geometry.coordinates;
//         var latLng = { lat: coords[1], lng: coords[0] };
    
//     var request = {
//         departure_searches: [ {
//             id: "first_location",
//             "coords": coords, 
//             transportation: {
//                 type: "public_transport"
//             },
//             departure_time: departureTime,
//             travel_time: travelTime
//         } ],
//         arrival_searches: [] 
//     };
//     var queryURL2 = "http://api.traveltimeapp.com/v4/time-map";
//     $.ajax({
//         url: queryURL2,
//         type: "post",
//         headers: headers,
//         data: JSON.stringify(request),
//         contentType: "application/json; charset=UTF-8",
//         success: drawTimeMap(setupMap([coords.lat, coords.lng]))
//     });
// }; 

// // A helper function that converts [{lat: <lat>, lng: <lng>}, ...] to a [[<lat>, <lng>], ...] format.
// // function ringCoordsHashToArray(ring) {
// //     return ring.map((latLng) => { return [latLng.lat, latLng.lng]; } );
// // };

// // //Map set up
// // function setupMap(markerCoords) {
// //   var osmUrl="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";	
// //   var osmTileLayer = L.tileLayer(osmUrl, {minZoom: 8, maxZoom: 15}); 
// //   var map = L.map("map").addLayer(osmTileLayer);
// //   L.marker(markerCoords).addTo(map);
// //   return map;
// // };

// // // Draws the resulting multipolygon from the response on the map.
// // function drawTimeMap(map) {
// //     // We are returning a function so that it can be easily used in the success parameter of the ajax method.
// //     return (response) => { 
// //         // Reference for the response: http://docs.traveltimeplatform.com/reference/time-map/#response-body-json-attributes
// //         var shapesCoords = response.results[0].shapes.map((polygon) => {
// //             var shell = ringCoordsHashToArray(polygon.shell);
// //             var holes = polygon.holes.map(ringCoordsHashToArray);
// //             return [shell].concat(holes);	
// //         })
// //         var polygon = L.polygon(shapesCoords, {color: 'red'});
// //         polygon.addTo(map);
// //         map.fitBounds(polygon.getBounds());
// //     };
// // };

// // // Begins the creation of the Time Map shape. 
// sendGeocodingRequest(startingLocation);
function initGmaps(){
    mapboxgl.accessToken =
    "pk.eyJ1IjoiYW5kcmV3anRob21zZW4iLCJhIjoiY2pyNXFjam03MjlnNzQ0c2VzNjIzcWdhdyJ9.OgdsY8LjrFyxmcmOYXuAoA";
  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/basic-v9",
    zoom: 13,
    center: [4.899, 52.372]
  });
  map.addControl(
    new MapboxDirections({
      accessToken: mapboxgl.accessToken
    }),
    "top-left"
  );
  var layerList = document.getElementById("menu");
  var inputs = layerList.getElementsByTagName("input");
  function switchLayer(layer) {
    var layerId = layer.target.id;
    map.setStyle("mapbox://styles/mapbox/" + layerId + "-v9");
  }
  for (var i = 0; i < inputs.length; i++) {
    inputs[i].onclick = switchLayer;
  }
  var distanceContainer = document.getElementById("distance");
  // GeoJSON object to hold our measurement features
  var geojson = {
    type: "FeatureCollection",
    features: []
  };
  // Used to draw a line between points
  var linestring = {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: []
    }
  };
  map.on("load", function() {
    map.addSource("geojson", {
      type: "geojson",
      data: geojson
    });
    var mesaurePoints = "measure-points";
    // Add styles to the map
    map.addLayer({
      id: "measure-points",
      type: "circle",
      source: "geojson",
      paint: {
        "circle-radius": 5,
        "circle-color": "#000"
      },
      filter: ["in", "$type", "Point"]
    });
    map.addLayer({
      id: "measure-lines",
      type: "line",
      source: "geojson",
      layout: {
        "line-cap": "round",
        "line-join": "round"
      },
      paint: {
        "line-color": "#000",
        "line-width": 2.5
      },
      filter: ["in", "$type", "LineString"]
    });
    map.on("click", function(e) {
      var features = map.queryRenderedFeatures(e.point, {
        layers: ["measure-points"]
      });
      // Remove the linestring from the group
      // So we can redraw it based on the points collection
      if (geojson.features.length > 1) geojson.features.pop();
      // Clear the Distance container to populate it with a new value
      distanceContainer.innerHTML = "";
      // If a feature was clicked, remove it from the map
      if (features.length) {
        var id = features[0].properties.id;
        geojson.features = geojson.features.filter(function(point) {
          return point.properties.id !== id;
        });
      } else {
        var point = {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [e.lngLat.lng, e.lngLat.lat]
          },
          properties: {
            id: String(new Date().getTime())
          }
        };
        geojson.features.push(point);
      }
      if (geojson.features.length > 1) {
        linestring.geometry.coordinates = geojson.features.map(function(
          point
        ) {
          return point.geometry.coordinates;
        });
        geojson.features.push(linestring);
        // Populate the distanceContainer with total distance
        var value = document.createElement("pre");
        value.textContent =
          "Total distance: " +
          turf.lineDistance(linestring).toLocaleString() +
          "km";
        distanceContainer.appendChild(value);
      }
      map.getSource("geojson").setData(geojson);
    });
  });
  map.on("mousemove", function(e) {
    var features = map.queryRenderedFeatures(e.point, {
      layers: ["measure-points"]
    });
    // UI indicator for clicking/hovering a point on the map
    map.getCanvas().style.cursor = features.length
      ? "pointer"
      : "crosshair";
  });
 


}
initGmaps();