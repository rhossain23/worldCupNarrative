export function chart5() {
  
const margin = { top: 20, bottom: 50, left: 60, right: 40 },
width = window.innerWidth * 0.85,
height = window.innerHeight * 0.85,
radius = 3,
colorScale = d3.scaleOrdinal(d3.schemeCategory10);

let svg;
let projection;
let path;
let tooltip5;

let state = {
    geojson: null,
    deloitte: null,
    selectedYear: "2020",
};

Promise.all([
    d3.json("countries.json"),
    d3.csv("deloitte.csv", d => ({
      year: d.year,
      rank: +d.rank,
      club: d.club,
      revenue: +d.revenue,
      dollars: +d.dollars,
      country: d.country,
      lat: +d.latitude,
      long: +d.longitude,
    })),
]).then(([geojson, deloitte]) => {
    state.geojson = geojson;
    state.deloitte = deloitte;
    init();
});

function init() {

const selectElement = d3.select(".slider4").on("change", function() {
  state.selectedYear = this.value;
  draw();
});

const years = Array.from(new Set(state.deloitte.map(d => d.year)))
d3.select(".slider4")
  .attr("min", d3.min(years))
  .attr("max", d3.max(years))
  .on("change", function() {
    state.selectedYear= this.value;
    draw(); 
  });

selectElement.property("value", "2020");

projection = d3.geoNaturalEarth1().fitSize([width, height], state.geojson);
path = d3.geoPath().projection(projection);

svg = d3
  .select("#d3-container5")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

svg
  .selectAll(".world")
  .data(state.geojson.features)
  .join("path")
  .attr("d", path)
  .attr("class", "world");

tooltip5 = d3.select("body")
  .append("div")
  .attr("class", "tooltip5")
  .attr("width", 100)
  .attr("height", 100)
  .style("position", "absolute")
  .style("opacity", 0);

  const slider4 = document.getElementById("year4");
  const output4 = document.getElementById("value4");
  output4.innerHTML = slider4.value;

  slider4.oninput = function() {
    output4.innerHTML = this.value;
  };  

draw();
}

function draw() {

let filteredData;
if (state.selectedYear !== null) {
  filteredData = state.deloitte.filter(d => d.year === state.selectedYear);
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
          tooltip5
          .html("Club Name: " + "<strong>" + d.club + "</strong>"
          + "<br/>" + "Rank: " + "<strong>" + d.rank + "</strong>" 
          + "<br/>" + "Revenue (in Euros): " + "<strong>" + " €" + d.revenue + " million" + "</strong>" 
          + "<br/>" + "Revenue (in Dollars): " + "<strong>" + " $" + d.dollars + " million" + "</strong>" 
          + "<br/>" + "Country: " + "<strong>" + d.country + "</strong>"
          )
          .transition()
          .duration(200)
          .style("opacity", 1);
        })
        .on("mouseout", d => {
          tooltip5
          .transition()
          .duration(100)
          .style("opacity", 0)
        })
        .on("mousemove", d => {
          d3.select(".tooltip5")
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
}