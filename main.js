var width = 960;
var height = 900;

var svg = d3.select("#map")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Projection of choice
var projection = d3.geo.albers()
  .center([-87.08345, 46.7508])
  .rotate([21, 21])
  .scale(57000)
  .translate([width/2, height/2]);

d3.json("cook2.json", function(error, cook){
  var subunits = topojson.object(cook, cook.objects.cook);
  var densities = []
  for(geometry in subunits.geometries) {
    densities.push(subunits.geometries[geometry].properties.density);
  }
  var path = d3.geo.path().projection(projection);
  var interpolate = d3.scale.quantile().domain(densities).range(d3.range(0.1, 1, 0.9/densities.length));

  svg.selectAll('.subunit')
    .data(subunits.geometries)
    .enter().append("path")
    .attr("class", function(d) { return "subunit " + d.id })
    .attr("d", path)
    .style("opacity", function(d) { return interpolate(d.properties.density); });
});
