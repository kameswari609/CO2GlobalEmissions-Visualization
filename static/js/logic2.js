var results = []

d3.json("/static/js/co2.json" ,function(data) {
  // Loop through mongodb data; combine 'lat'/'lng' columns into coordinates; retrieve other data.
  data.forEach(element =>  {
        var result = {}
        result["coordinates"] = [element.Lat, element.Lng]
        result["total"] = element.Total
        result["year"] = element.Year
        results.push(result);
  });
    // create function to return data from 2014 only.
    function year(recent) {
      return recent.year == 2014;
  }

  var recentData = results.filter(recent);
    console.log(recentData);
  
  // Pass through results array and store 2014 data in variable
  var data_2014 = recentData.filter(year);

  var myMap = L.map("map", {
      center: [37.76, -122.431297],
      zoom: 13
  });

 

  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox/dark-v10",
      accessToken: API_KEY
    }).addTo(myMap);

    

  for (var i = 0; i < data_2014.length; i++) {
    var location1 = data_2014[i];
        L.circle((location1.coordinates),{
          color: "green",
          fillColor: "green",
          fillOpacity: 0.50,
          radius: 50})
        .addTo(myMap).bindPopup("<h3>Age: "+ location1.age +"</h3><h3>Sex: " + location1.sex +
        "</h3><hr><h3>Arrest: " + location1.arrest + "</h3><hr><h3>Race:" + location1.race + "</h3>");
  }

  // Add Legend
  var legend = L.control({
    position: "bottomright"
  });

  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var grades = [10000, 20000, 30000, 40000, 50000, 60000];
    var colors = ["lightgreen", "yellow", "orange", "red", "blue", "purple"];

    for (var i=0;i<grades.length;i++){
      //console.log(colors[i]);
      div.innerHTML  += 
        "<i style= 'background: " + colors[i] + "'></i>" + grades[i] + (grades[i+1] ? "&ndash;" + grades[i+1]+ "<br>" : "+" );
    }
    return div;
  };

  legend.addTo(myMap);
  });