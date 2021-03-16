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

    //Function used for updating xAxis upon click
    function renderAxisX(newXScale, xAxis) {
        var bottomAxis = d3.axisBottom(newXScale);

        xAxis.transition()
            .duration(1000)
            .call(bottomAxis);

        return xAxis;
    }

    //Function for the yAxis
    function renderAxisY(newYScale, yAxis) {
        var leftAxis = d3.axisLeft(newYScale);

        yAxis.transition()
            .duration(1000)
            .call(leftAxis);

        return yAxis;
    }

    //Function for updating circles group
    function renderCircles(circlesGroup, newXScale, xSelect, newYScale, ySelect) {

        circlesGroup.transition()
            .duration(1000)
            .attr("cx", data => newXScale(data[xSelect]))
            .attr("cy", data => newYScale(data[ySelect]));

        return circlesGroup;
    }

    //Function for updating state labels
    function renderText(textGroup, newXScale, xSelect, newYScale, ySelect) {

        textGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[xSelect]))
        .attr("y", d => newYScale(d[ySelect]));

    return textGroup;
    }

    //Function to stylize x-axis values for tooltips
    function styleX(value, xSelect) {

        //stylize based on chosen variable
        //Poverty
        if (xSelect === 'poverty') {
            return `${value}%`;
        }
        //Household income
        else if (xSelect === 'income') {
            return `$${value}`;
        }
        //Age
        else {
            return `${value}`;
        }
    }

    //Function used for updating circles with new tooltip
    function updateToolTip(xSelect, ySelect, circlesGroup) {

        //select x label
        //poverty
        if (xSelect === 'poverty') {
            var xLabel = "Poverty:";
        }
        //Household income
        else if (xSelect === 'income') {
            var xLabel = "Median Income:";
        }
        //Age
        else {
            var xLabel = "Age:";
        }

        //slect y label
        //percentage lacking healthcare
        if (ySelect === 'healthcare') {
            var yLabel = "No Healthcare:";
        }
        //percentage obese
        else if (ySelect === 'obesity') {
            var yLabel = "Obesity:";
        }
        //smoking percentage
        else {
            var yLabel = "Smokers:";
        }

        //create tooltip
        var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-8, 0])
            .html(function(d) {
                return (`${d.state}<br>${xLabel} ${styleX(d[xSelect], xSelect)}<br>${yLabel} ${d[ySelect]}%`);
            });

        circlesGroup.call(toolTip);

        //add events
        circlesGroup.on("mouseover", toolTip.show)
            .on("mouseout", toolTip.hide);

        return circlesGroup;
    }

    //Retrieve csv data
    d3.csv("./assets/data/data.csv").then(function(censusData) {
        console.log(censusData);

        //parse data
        censusData.forEach(function(data) {
            data.obesity = +data.obesity; 
        })
    })
}