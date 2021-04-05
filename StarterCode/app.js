// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("data.csv").then(function(healthData) {

    // Parse Data as numbers
    healthData.forEach((data) => {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });

    // Create scale functions
    var xPovertyScale = d3.scaleLinear()
      .domain([8, d3.max(healthData, d => d.poverty)])
      .range([0, width]);

    var yHealthCareScale = d3.scaleLinear()
      .domain([0, d3.max(healthData, d => d.healthcare + 5)])
      .range([height, 0]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xPovertyScale);
    var leftAxis = d3.axisLeft(yHealthCareScale);

    // append axis to chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis)
    
    chartGroup.append("g")
        .call(leftAxis)

    // Create circles
    var stateCircle = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xPovertyScale(d.poverty))
    .attr("cy", d => yHealthCareScale(d.healthcare))
    .attr("r", "10")
    .attr("fill", "blue")

    // initialize tool tip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80,-60])
        .html(function(d) {
            return (`${d.state}<br>Poverty: ${d.poverty} <br>Health Care: ${d.healthcare}`)
        });
    
    // Create tool tip in chart
    chartGroup.call(toolTip)

    // create event listeners to display and hide tool tip
    stateCircle.on("mouseover", function(data) {
        toolTip.show(data, this)
    })
        .on("mouseout", function(data) {
            toolTip.hide(data)
        });

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healther (%)");
  
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Poverty Rate (%)ßß");
    
}).catch(function(error) {
    console.log(error)
})