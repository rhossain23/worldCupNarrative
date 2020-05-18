export function chart4() {

const width = window.innerWidth * 0.85,
  height = window.innerHeight * 0.85,
  margin = { top: 20, bottom: 60, left: 60, right: 40 },
  radius = 4;

d3.csv("ownEuropeData.csv").then(function(data) {
data.forEach(d => {
    d.year = +d.year;
    d.own = +d.own;
    d.europe = +d.europe;
    d.europeOwn = +d.europeOwn;
    d.europeOther = +d.europeOther;
});

let svg;
let tooltip4;

const xScale = d3
    .scaleBand()
    .domain(data.map(d => d.year))
    .range([margin.left, width - margin.right]);

const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => Math.max(d.own, d.europe, d.europeOwn, d.europeOther))])
    .range([height - margin.bottom, margin.top]);

const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale);

  svg = d3
    .select("#d3-container4")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  svg
    .append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis)
    .append("text")
    .attr("class", "axis-label")
    .attr("x", "50%")
    .attr("dy", "3em")
    .text("Year");

  svg
    .append("g")
    .attr("class", "axis y-axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis)
    .append("text")
    .attr("class", "axis-label")
    .attr("y", "50%")
    .attr("dx", "-3em")
    .attr("writing-mode", "vertical-rl")
    .text("Number of Players");

    tooltip4 = d3.select("body")
    .append("div")
    .attr("class", "tooltip4")
    .attr("width", 100)
    .attr("height", 100)
    .style("position", "absolute")
    .style("opacity", 0);

const lineFunc1 = d3
  .line()
  .x(d => xScale(d.year) + (xScale.bandwidth() / 2))
  .y(d => yScale(d.own));

const lineFunc2 = d3
  .line()
  .x(d => xScale(d.year) + (xScale.bandwidth() / 2))
  .y(d => yScale(d.europe));

const lineFunc3 = d3
  .line()
  .x(d => xScale(d.year) + (xScale.bandwidth() / 2))
  .y(d => yScale(d.europeOwn));
  
const lineFunc4 = d3
  .line()
  .x(d => xScale(d.year) + (xScale.bandwidth() / 2))
  .y(d => yScale(d.europeOther));

svg
.append("path")
.data([data])
.attr("class", "line1")
.attr("d", d => lineFunc1(d));

svg
.append("path")
.data([data])
.attr("class", "line2")
.attr("d", d => lineFunc2(d));

svg
.append("path")
.data([data])
.attr("class", "line3")
.attr("d", d => lineFunc3(d));

svg
.append("path")
.data([data])
.attr("class", "line4")
.attr("d", d => lineFunc4(d));

const dotOwn = svg
.selectAll(".dotOwn")
.data(data)
.enter()
.append("circle")
.attr("class", "dotOwn")
.attr("cx", d => xScale(d.year) + (xScale.bandwidth() / 2))
.attr("cy", d => yScale(d.own))
.attr("r", radius)
.on("mouseover", d => {
  tooltip4
  .html("Year: " + "<strong>" + d.year + "</strong>"
  + "<br/>" + "Number of Players: " 
  + "<strong>" + d.own + "</strong>")
  .transition()
  .duration(200)
  .style("opacity", 1);
})
.on("mouseout", d => {
  tooltip4
  .transition()
  .duration(100)
  .style("opacity", 0)
})
.on("mousemove", d => {
  d3.select(".tooltip4")
  .style("left", (d3.event.pageX+10) + "px")
  .style("top", (d3.event.pageY+10) + "px")
});

const dotEurope = svg
.selectAll(".dotEurope")
.data(data)
.enter()
.append("circle")
.attr("class", "dotEurope")
.attr("cx", d => xScale(d.year) + (xScale.bandwidth() / 2))
.attr("cy", d => yScale(d.europe))
.attr("r", radius)
.on("mouseover", d => {
  tooltip4
  .html("Year: " + "<strong>" + d.year + "</strong>"
  + "<br/>" + "Number of Players: " 
  + "<strong>" + d.europe + "</strong>")
  .transition()
  .duration(200)
  .style("opacity", 1);
})
.on("mouseout", d => {
  tooltip4
  .transition()
  .duration(100)
  .style("opacity", 0)
})
.on("mousemove", d => {
  d3.select(".tooltip4")
  .style("left", (d3.event.pageX+10) + "px")
  .style("top", (d3.event.pageY+10) + "px")
});

const dotEuropeOwn = svg
.selectAll(".dotEuropeOwn")
.data(data)
.enter()
.append("circle")
.attr("class", "dotEuropeOwn")
.attr("cx", d => xScale(d.year) + (xScale.bandwidth() / 2))
.attr("cy", d => yScale(d.europeOwn))
.attr("r", radius)
.on("mouseover", d => {
  tooltip4
  .html("Year: " + "<strong>" + d.year + "</strong>"
  + "<br/>" + "Number of Players: " 
  + "<strong>" + d.europeOwn + "</strong>")
  .transition()
  .duration(200)
  .style("opacity", 1);
})
.on("mouseout", d => {
  tooltip4
  .transition()
  .duration(100)
  .style("opacity", 0)
})
.on("mousemove", d => {
  d3.select(".tooltip4")
  .style("left", (d3.event.pageX+10) + "px")
  .style("top", (d3.event.pageY+10) + "px")
});

const dotEuropeOther = svg
.selectAll(".dotEuropeOther")
.data(data)
.enter()
.append("circle")
.attr("class", "dotEuropeOther")
.attr("cx", d => xScale(d.year) + (xScale.bandwidth() / 2))
.attr("cy", d => yScale(d.europeOther))
.attr("r", radius)
.on("mouseover", d => {
  tooltip4
  .html("Year: " + "<strong>" + d.year + "</strong>"
  + "<br/>" + "Number of Players: " 
  + "<strong>" + d.europeOther + "</strong>")
  .transition()
  .duration(200)
  .style("opacity", 1);
})
.on("mouseout", d => {
  tooltip4
  .transition()
  .duration(100)
  .style("opacity", 0)
})
.on("mousemove", d => {
  d3.select(".tooltip4")
  .style("left", (d3.event.pageX+10) + "px")
  .style("top", (d3.event.pageY+10) + "px")
});

});
}