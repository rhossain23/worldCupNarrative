export function chart1() {

const margin = { top: 20, bottom: 50, left: 60, right: 40 },
width = window.innerWidth * 0.85,
height = window.innerHeight * 0.85,
radius = 4.5,
colorScale = d3.scaleOrdinal(d3.schemeCategory10);

let svg;
let projection;
let path;
let tooltip1;

let state = {
    geojson: null,
    worldCupCountries: null,
    selectedYear: "2018",
};

Promise.all([
    d3.json("countries.json"),
    d3.csv("worldCupCountries.csv", d => ({
      year: d.year,
      country: d.country,
      total: +d.total,
      lat: +d.latitude,
      long: +d.longitude,
    })),
]).then(([geojson, worldCupCountries]) => {
    state.geojson = geojson;
    state.worldCupCountries = worldCupCountries;
    init();
});

function init() {

const selectElement = d3.select(".slider1").on("change", function() {
  state.selectedYear = this.value;
  draw();
});

const years = Array.from(new Set(state.worldCupCountries.map(d => d.year)))
d3.select(".slider1")
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
  .select("#d3-container1")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

svg
  .selectAll(".world")
  .data(state.geojson.features)
  .join("path")
  .attr("d", path)
  .attr("class", "world");

tooltip1 = d3.select("body")
  .append("div")
  .attr("class", "tooltip1")
  .attr("width", 100)
  .attr("height", 100)
  .style("position", "absolute")
  .style("opacity", 0);

  const slider1 = document.getElementById("year1");
  const output1 = document.getElementById("value1");
  output1.innerHTML = slider1.value;

  slider1.oninput = function() {
    output1.innerHTML = this.value;
  };  

draw();
}

function draw() {

let filteredData;
if (state.selectedYear !== null) {
  filteredData = state.worldCupCountries.filter(d => d.year === state.selectedYear);
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
          tooltip1
          .html("Country: " + "<strong>" + d.country + "</strong>")
          .transition()
          .duration(200)
          .style("opacity", 1);
        })
        .on("mouseout", d => {
          tooltip1
          .transition()
          .duration(100)
          .style("opacity", 0)
        })
        .on("mousemove", d => {
          d3.select(".tooltip1")
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
};
};