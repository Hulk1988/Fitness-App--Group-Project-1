
// // // Begins the creation of the Time Map shape. 
// sendGeocodingRequest(startingLocation);
var directions;
var durationString = null;
function initGmaps(){
    mapboxgl.accessToken =
    "pk.eyJ1IjoiYW5kcmV3anRob21zZW4iLCJhIjoiY2pyNXFjam03MjlnNzQ0c2VzNjIzcWdhdyJ9.OgdsY8LjrFyxmcmOYXuAoA";
  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/basic-v9",
    zoom: 13,
    center: [4.899, 52.372]
  });
  directions = new MapboxDirections({
    accessToken: mapboxgl.accessToken
  });
  directions.on('route', function(route) {
    var durationSeconds = route.route[0].duration;
    var durationHours = Math.floor(durationSeconds / 60 / 60);
    var durationMinutes = roundTwoDecimals(((durationSeconds / 60 / 60) - durationHours) * 60);
    durationString = durationHours + ' hours, ' + durationMinutes + ' minutes.';
  });
  map.addControl(
    directions,
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