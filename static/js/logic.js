var API_KEY = ('./config.json');
var greymap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
});

var map = L.map("map",
 {center: [50.0, -96.8],
  zoom:5
})

greymap.addTo(map)

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data){
  function styleinfo(feature){
    return {
        radius: get_radius(feature.properties.mag) ,
        fillColor: get_color(feature.properties.mag),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
  }
  function get_color(magnatude){
    switch(true){
      case magnatude > 5:
        return "red"; 
      case magnatude > 4:
        return "pink";
      case magnatude > 3:
        return "orange"; 
      case magnatude > 2:
        return "yellow"; 
      case magnatude > 1:
        return "green"; 
      default:
        return "blue";
    }
  }


  function get_radius(magnatude){
    return magnatude * 4;
  }
  console.log(data); 
  L.geoJson(data, {
     pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: styleinfo,
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    } 
  }).addTo(map)

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
    magnatude = [0, 1, 2, 3, 4, 5]
      colors = ["white", "blue", "green", "yellow", "orange", "red"];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < magnatude.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colors[i] + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
            magnatude[i] + (magnatude[i + 1] ? '&ndash;' + magnatude[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);
  
})