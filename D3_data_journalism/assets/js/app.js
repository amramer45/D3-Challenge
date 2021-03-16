// Assign plot to responsive function
function makeResponsive() {
    
    // If SVG area isn't empty, remove it and replace it with a resized version of the chart
    var svgArea = d3.select("#scatterPlot").select("svg");

    if(!svgArea.empty()) {
        svgArea.remove();
    }

    //Define SVG area
    var svgWidth = 960;
    var svgHeight = 620;

    var chartMargin = {
        top: 20,
        right: 40,
        bottom: 60,
        left: 100,
    };

    var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
    var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

    //Create an SVG wrapper
    var svg = d3.select("#scatter")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

}