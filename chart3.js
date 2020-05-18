export function chart3() {

const margin = { top: 20, bottom: 60, left: 150, right: 40 },
width = window.innerWidth * 0.85,
height = window.innerHeight * 0.85,
paddingInner = 0.2,
colorScale = d3.scaleOrdinal(d3.schemeCategory10);

let svg;
let xScale;
let yScale;
let xAxis;
let yAxis;
let tooltip3;

let state = {
    worldCupData: null,
    selectedYear: "2018",
};

d3.csv("worldCupData.csv", d => ({
        year: d.year,
        country: d.country,
        total: +d.total,
        players: +d.players,
        percentage: +d.percentage,
        lat: +d.latitude,
        long: +d.longitude,
    })).then(worldCupData => {
    state.worldCupData = worldCupData
    init();
    });

function init() {

const selectElement = d3.select(".slider3").on("change", function() {
    state.selectedYear = this.value;
    draw();
    });
    
    const years = Array.from(new Set(state.worldCupData.map(d => d.year)))
    d3.select(".slider3")
    .attr("min", d3.min(years))
    .attr("max", d3.max(years))
    .on("change", function() {
        state.selectedYear= this.value;
        draw(); 
    });

selectElement.property("value", "2018");

svg = d3
    .select("#d3-container3")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("position", "relative");

xScale = d3
    .scaleLinear()
    .domain([0, d3.max(state.worldCupData, d => d.players)])
    .range([margin.left, width - margin.right]);

yScale = d3
    .scaleBand()
    .domain(state.worldCupData.map(d => d.country))
    .range([margin.top, height - margin.bottom])
    .paddingInner(paddingInner);

xAxis = d3.axisBottom(xScale);  
yAxis = d3.axisLeft(yScale);

svg
    .append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis)
    .append("text")
    .attr("class", "axis-label")
    .attr("x", "50%")
    .attr("dy", "3em")
    .text("Number of Players");

svg
    .append("g")
    .attr("class", "axis y-axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis)
    .append("text")
    .attr("class", "axis-label")
    .attr("y", "50%")
    .attr("dx", "-6em")
    .attr("writing-mode", "vertical-rl")
    .text("Country");

tooltip3 = d3.select("body")
    .append("div")
    .attr("class", "tooltip3")
    .attr("width", 100)
    .attr("height", 100)
    .style("position", "absolute")
    .style("opacity", 0);

const slider3 = document.getElementById("year3");
const output3 = document.getElementById("value3");
output3.innerHTML = slider3.value;

slider3.oninput = function() {
  output3.innerHTML = this.value;
};
    
draw();
}

function draw() {

let filteredData;
if (state.selectedYear !== null) {
    filteredData = state.worldCupData.filter(d => d.year === state.selectedYear);
}
    
yScale.domain(filteredData.map(d => d.country))
    
d3.select("g.y-axis")
    .transition()
    .duration(1000)
    .call(yAxis.scale(yScale));

const rect = svg
    .selectAll(".rect")
    .data(filteredData, d => d.year)
    .join(
    enter => enter
        .append("rect")
        .attr("class", "rect")
        .attr("x", margin.left)
        .attr("y", d => yScale(d.country))
        .attr("width", d => xScale(d.players) - margin.left)
        .attr("height", d => yScale.bandwidth())
        .attr("fill", d => {return colorScale(d.country)})
        .on("mouseover", d => {
        tooltip3
        .html("Country: " + "<strong>" + d.country + "</strong>"
        + "<br/>" + "Total Number of Players: " 
        + "<strong>" + d.players + "</strong>" 
        + "<br/>" + "Percent of All Players: " 
        + "<strong>" + d.percentage + "%" + "</strong>")
        .transition()
        .duration(200)
        .style("opacity", 1)
        })
        .on("mouseout", d => {
        tooltip3
        .transition()
        .duration(100)
        .style("opacity", 0)
        })
        .on("mousemove", d => {
        d3.select(".tooltip3")
        .style("left", (d3.event.pageX+10) + "px")
        .style("top", (d3.event.pageY+10) + "px")
        }),
        update => update,
        exit =>
        exit.call(exit =>
            exit
            .transition()
            .delay(d => d.players)
            .duration(500)
            .attr("x", width)
            .remove()
        )
    )
    .call(
        selection =>
        selection
            .transition()
            .duration(500)
            .attr("x", margin.left)
            .attr("y", d => yScale(d.country))
            .attr("width", d => xScale(d.players) - margin.left)
            .attr("height", d => yScale.bandwidth()));
}
}