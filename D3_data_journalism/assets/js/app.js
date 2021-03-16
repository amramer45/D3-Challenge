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

    //Define chart margins
    var chartMargin = {
        top: 20,
        right: 40,
        bottom: 60,
        left: 100,
    };

    //Definte chart area dimensions
    var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
    var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

    //Create an SVG wrapper
    var svg = d3.select("#scatter")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    
    //Append a group to the SVG area and shift
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

    //Select variables
    var xSelect = "poverty";
    var ySelect = "healthcare"

    //Function used for updating x-scale var upon clicking on axis label
    function xScale(censusData, xSelect) {
        //Create scales
        var xLinearScale = d3.scaleLinear()
            .domain([d3.min(censusData, d => d[xSelect]) * 0.8,
                d3.max(censusData, d => d[xSelect]) * 1.2
            ])
            .range([0, chartWidth]);
        
        return xLinearScale;
    }

    //Function for the y-scale
    function yScale(censusData, ySelect) {
        //Create scales
        var yLinearScale = d3.scaleLinear()
            .domain([d3.min(censusData, d => d[ySelect]) * 0.8,
                d3.max(censusData, d => d[ySelect]) * 1.2
            ])
            .range([chartHeight, 0]);
        
        return yLinearScale;
    }
}