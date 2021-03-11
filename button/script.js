var width = 960,
    height = 500;

var projection = d3.geoMercator();
  
var path = d3.geoPath()
  .projection(projection)

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

// This is the world
var url = "http://enjalot.github.io/wwsd/data/world/world-110m.geojson";

// This is the old demo places
var url2 = "http://enjalot.github.io/wwsd/data/world/ne_50m_populated_places_simple.geojson"

// This is my data
var myurl = "data.geojson";

function dealWithDate(dateTime) {
  // split
  let bits = dateTime.split(' ');
  // sort month
  let month = 100;
  switch (bits[0]) {
    case 'January':
      month = 100;
      break;
    case 'February':
      month = 200;
      break;
    case 'March':
      month = 300;
      break;
    case 'April':
      month = 400;
      break;
    case 'May':
      month = 500;
      break;
    case 'June':
      month = 600;
      break;
    case 'July':
      month = 700;
      break;
    case 'August':
      month = 800;
      break;
    case 'September':
      month = 900;
      break;
    case 'October':
      month = 1000;
      break;
    case 'November':
      month = 1100;
      break;
    case 'December':
      month = 1200;
      break;
    default:
      month = 100;
  }
  // sort comma
  let date = Number(bits[1].slice(0, -1))*10;
  // add up
  let total = month + date + Number(bits[2]);
  total = (total-2000)*10;
  // return usable number
  return total;
}
let test = dealWithDate("September 25, 2019 at 01:16PM");
console.log(test);

d3.json(url, function(error, countries) {

  d3.json(myurl, function(error, places) {
    if (error) console.log(error);
    
    console.log("geojson", countries, places);
   
    svg.selectAll("path")
      .data(countries.features)
    .enter().append("path")
      .attr("d", path)
    
    svg.selectAll("circle")
      .data(places.features)
    .enter().append("circle")
      .attr("opacity", 0)
      .style("fill", "red")
      .attr('r',20)
      .attr('cx',function(d) {
        // console.log(d.properties.dateTime);
        return projection(d.geometry.coordinates)[0]
      })
      .attr('cy',function(d) { return projection(d.geometry.coordinates)[1]})
      .transition()
      .duration(1000)
      .delay(function(d) {
        return dealWithDate(d.properties.dateTime)
      })
      .attr("opacity", 0.5)
    
  })
});


// function drawMap(err, world) {
//   if (err) throw err
//   svg.append("path")
//     .datum(graticule)
//     .attr("class", "graticule")
//     .attr("d", path);
//   svg.append("path")
//     .datum(graticule.outline)
//     .attr("class", "foreground")
//     .attr("d", path);
//   svg.append("g")
//     .selectAll("path")
//     .data(topojson.feature(world, world.objects.countries).features)
//     .enter().append("path")
//     .attr("d", path);
// }
// d3.json("https://unpkg.com/world-atlas@1.1.4/world/110m.json", drawMap)