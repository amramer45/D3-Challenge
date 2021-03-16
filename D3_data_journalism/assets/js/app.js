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
            data.income = +data.income;
            data.smokes = +data.smokes;
            data.age = +data.age;
            data.healthcare = +data.healthcare;
            data.poverty = +data.poverty;
        });

        //create first linear scales
        var xLinearScale = xScale(censusData, xSelect);
        var yLinearScale = yScale(censusData, ySelect);

        //create initial axis functions
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        //append x axis
        var xAxis = chartGroup.append("g")
            .classed("x-axis", true)
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(bottomAxis);
        
        //append y axis
        var yAxis = chartGroup.append("g")
            .classed("y-axis", true)
            .call(leftAxis);

        //append circles
        var circlesGroup = chartGroup.selectAll("circle")
            .data(censusData)
            .enter()
            .append("circle")
            .classed("stateCircle", true)
            .attr("cx", d => xLinearScale(d[xSelect]))
            .attr("cy", d => yLinearScale(d[ySelect]))
            .attr("r", 12)
            .attr("opacity", ".5");
        
        //append initial text
        var textGroup = chartGroup.selectAll(".stateText")
            .data(censusData)
            .enter()
            .append("text")
            .classed("stateText", true)
            .attr("x", d => xLinearScale(d[xSelect]))
            .attr("y", d => yLinearScale(d[ySelect]))
            .attr("dy", 3)
            .attr("font-size", "10px")
            .text(function(d) { return d.abbr });

        //create group for 3 x-axis labels
        var xLabelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20 + chartMargin.top})`);
        
        var povertyLabel = xLabelsGRoup.append("text")
            .classed("aText", true)
            .classed("active", true)
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "poverty")
            .text("In Poverty (%)");
        
        var incomeLabel = xLabelsGroup.append("text")
            .classed("aText", true)
            .classed("inactive", true)
            .attr("x", 0)
            .attr("y", 60)
            .attr("value", "income")
            .text("Household Income (Median)")
        
        //create group for 3 y-axis labels
        var yLabelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${0 - chartMargin.left/4}, ${(chartHeight/2)})`);
        
        var healthcareLabel = yLabelsGroup.append("text")
            .classed("aText", true)
            .classed("active", true)
            .attr("x", 0)
            .attr("y", 0 - 20)
            .attr("dy", "1em")
            .attr("transform", "rotate(-90)")
            .attr("value", "healthcare")
            .text("Lacks Healthcare (%)");
        
        var smokesLabel = yLabelsGroup.append("text")
            .classed("aText", true)
            .classed("inactive", true)
            .attr("x", 0)
            .attr("y", 0 - 40)
            .attr("dy", "1em")
            .attr("transform", "rotate(-90)")
            .attr("value", "smokes")
            .text("Smokes (%)");
        
        var obesityLabel = yLabelsGroup.append("text")
            .classed("aText", true)
            .classed("inactive", true)
            .attr("x", 0)
            .attr("y", 0 -60)
            .attr("dy", "1em")
            .attr("transform", "rotate(-90)")
            .attr("value", "obesity")
            .text("Obese (%)");
        
        //update toolTip function with data
        var circlesGroup = updateToolTip(xSelect, ySelect, circlesGroup);

        //x axis labels event listener
        xLabelsGroup.selectAll("text")
            .on("click", function () {
                //get value of selection
                var value = d3.select(this).attr("value");

                //check if value is same as current axis
                if (value != xSelect) {

                    //replace xSelect with value
                    xSelect = value;

                    //update x scale for new data
                    xLinearScale = xScale(censusData, xSelect);

                    //update x axis with transition
                    xAxis = renderAxisX(xLinearScale, xAxis);

                    //update circles with new x values
                    circlesGroup = renderCircles(circlesGroup, xLinearScale, xSelect, yLinearScale, ySelect);

                    //update text with new x values
                    textGroup = renderText(textGroup, xLinearScale, xSelect, yLinearScale, ySelect);

                    //update tooltips with new info
                    circlesGroup = updateToolTip(xSelect, ySelect, circlesGroup);

                    //change classes to change bold text
                    if (xSelect === "poverty") {
                        povertyLabel.classed("active", true).classed("inactive", false);
                        ageLabel.classed("active", false).classed("inactive", true);
                        incomeLabel.classed("active", false).classed("inactive", true);
                    } else if (xSelect === "age") {
                        povertyLabel.classed("active", false).classed("inactive", true);
                        ageLabel.classed("active", true).classed("inactive", false);
                        incomeLabel.classed("active", true).classed("inactive", false);
                    } else {
                        povertyLabel.classed("active", false).classed("inactive", true);
                        ageLabel.classed("active", false).classed("inactive", true);
                        incomeLabel.classed("active", true).classed("inactive", false);
                    }
                }
            });
    //y axis labels event listener
    yLabelsGroup.selectAll("text")
        .on("click", function () {
            var value = d3.select(this).attr("value");

            if (value != ySelect) {
                ySelect = value;

                yLinearScale = yScale(censusData, ySelect);

                xAxis = renderAxisY(yLinearScale, yAxis);

                circlesGroup = renderCircles(circlesGroup, xLinearScale, xSelect, yLinearScale, ySelect);

                textGroup = renderText(textGroup, xLinearScale, xSelect, yLinearScale, ySelect);

                circlesGroup = updateToolTip(xSelect, ySelect, circlesGroup);

                if (ySelect === "obesity") {
                    obesityLabel.classed("active", true).classed("inactive", false);
                    smokesLabel.classed("active", false).classed("inactive", true);
                    healthcareLabel.classed("active", false).classed("inactive", true);
                } else if (xSelect === "age") {
                    obesityLabel.classed("active", false).classed("inactive", true);
                    smokesLabel.classed("active", true).classed("inactive", false);
                    healthcareLabel.classed("active", true).classed("inactive", false);
                } else {
                    obesityLabel.classed("active", false).classed("inactive", true);
                    smokesLabel.classed("active", false).classed("inactive", true);
                    healthcareLabel.classed("active", true).classed("inactive", false);
                }
            }
        });
    })
}

//call main function
makeResponsive();

//Event listener for window resize
d3.select(window).on("resize", makeResponsive);