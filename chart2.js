export function chart2() {

const margin = { top: 20, bottom: 50, left: 60, right: 40 },
width = window.innerWidth * 0.85,
height = window.innerHeight * 0.85,
radius = 4.5,
colorScale = d3.scaleOrdinal(d3.schemeCategory10);

let svg;
let projection;
let path;
let tooltip2;

let state = {
    geojson: null,
    worldCupData: null,
    selectedYear: "2018",
};

Promise.all([
    d3.json("countries.json"),
    d3.csv("worldCupData.csv", d => ({
      year: d.year,
      country: d.country,
      total: +d.total,
      players: +d.players,
      percentage: +d.percentage,
      lat: +d.latitude,
      long: +d.longitude,
    })),
]).then(([geojson, worldCupData]) => {
    state.geojson = geojson;
    state.worldCupData = worldCupData;
    init();
});

function init() {

const selectElement = d3.select(".slider2").on("change", function() {
  state.selectedYear = this.value;
  draw();
});

const years = Array.from(new Set(state.worldCupData.map(d => d.year)))
d3.select(".slider2")
  .attr("min", d3.min(years))
  .attr("max", d3.max(years))
  .on("change", function() {
    state.selectedYear= this.value;
    draw(); 
  });

selectElement.property("value", "2018");

projection = d3.geoNaturalEarth1().fitSize([width, height], state.geojson);
path = d3.geoPath().projection(projection);

svg = d3
  .select("#d3-container2")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

svg
  .selectAll(".world")
  .data(state.geojson.features)
  .join("path")
  .attr("d", path)
  .attr("class", "world");

tooltip2 = d3.select("body")
  .append("div")
  .attr("class", "tooltip2")
  .attr("width", 100)
  .attr("height", 100)
  .style("position", "absolute")
  .style("opacity", 0);

  const slider2 = document.getElementById("year2");
  const output2 = document.getElementById("value2");
  output2.innerHTML = slider2.value;

  slider2.oninput = function() {
    output2.innerHTML = this.value;
  }; 

draw();
}

function draw() {

let filteredData;
if (state.selectedYear !== null) {
  filteredData = state.worldCupData.filter(d => d.year === state.selectedYear);
}

svg
  .selectAll(".circle")
  .data(filteredData, d => d.year)
  .join(
    enter =>
      enter
        .append("circle")
        .attr("class", "circle")
        .attr("r", radius)
        .attr("cx", function(d) {
          return projection([d.long, d.lat])[0];
        })
        .attr("cy", function(d) {
          return projection([d.long, d.lat])[1];
        })
        .attr("fill", d => {return colorScale(d.country)})
        .on("mouseover", d => {
          tooltip2
          .html("Country: " + "<strong>" + d.country + "</strong>"
          + "<br/>" + "Total Number of Players: " 
          + "<strong>" + d.players + "</strong>" 
          + "<br/>" + "Percent of All Players: " 
          + "<strong>" + d.percentage + "%" + "</strong>")
          .transition()
          .duration(200)
          .style("opacity", 1);
        })
        .on("mouseout", d => {
          tooltip2
          .transition()
          .duration(100)
          .style("opacity", 0)
        })
        .on("mousemove", d => {
          d3.select(".tooltip2")
          .style("left", (d3.event.pageX+10) + "px")
          .style("top", (d3.event.pageY+10) + "px")
        }),
    update => update,
    exit =>
        exit.call(exit =>
          exit 
            .transition()
            .duration(500)
            .attr("cx", width)
            .remove()
        )
  )
  .call(
    selection =>
      selection
        .transition()
        .duration(500)
        .attr("cy", function(d) {
          return projection([d.long, d.lat])[1];
        }),
  );
  }
}