function init() {

    var w = 600;
    var h = 250;

    var maxValue = 25;

    var dataset = [14, 5, 26, 23, 9, 20, 12, 17, 10, 4, 9, 20,
        12, 4, 8, 15, 24, 25, 3, 11, 13, 5];

    var xScale = d3.scaleBand()
        .domain(d3.range(dataset.length))
        .rangeRound([0, w])



    var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset)])
        .range([0, h]);

    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    var registerMouseovers = function () {
        svg.selectAll("rect")
            .on("mouseover", function (event, d) {

                var xPosition = parseFloat(d3.select(this).attr("x"));
                var yPosition = parseFloat(d3.select(this).attr("y"));

                d3.select(this)
                    .transition()
                    .delay(50)
                    .attr("fill", "orange");

                svg.append("text")
                    .attr("id", "tooltip")
                    .attr("x", xPosition + (xScale.bandwidth() / 2) - 7)
                    .attr("y", yPosition + 14)
                    .text(d);
            })
            .on("mouseout", function (event, d) {
                d3.select(this)
                    .transition()
                    .delay(250)
                    .attr("fill", "rgb(0, 0, " + (d * 10) + ")");

                d3.select("#tooltip")
                    .remove()
            })
    }
    var sortOrder = false;
    var sortBars = function () {
        sortOrder = !sortOrder;

        svg.selectAll("rect")
            .sort(function (a, b) {
                if (sortOrder) {
                    return d3.ascending(a, b);
                } else {
                    return d3.descending(a, b);
                }
            })
            .transition()
            .delay(500)
            .attr("x", function (d, i) {
                return xScale(i);
            });
    };

    d3.select("#abtn") // Add button
        .on("click", function () {

            var newNumber = Math.floor(Math.random() * maxValue);
            dataset.push(newNumber);

            var bars = svg.selectAll("rect").data(dataset);
            var labels = svg.selectAll("text").data(dataset);
            xScale.domain(d3.range(dataset.length));

            bars.enter()
                .append("rect")
                .attr("x", w)
                .attr("y", function (d) {
                    return h - yScale(d);
                })
                .merge(bars)
                .transition()
                .duration(500)
                .attr("x", function (d, i) {
                    return xScale(i);
                })
                .attr("y", function (d) {
                    return h - yScale(d);
                })
                .attr("width", xScale.bandwidth())
                .attr("height", function (d) {
                    return yScale(d);
                })
                .attr("fill", function (d) {
                    return "rgb(0, 0, " + (d * 10) + ")";
                });
            registerMouseovers();
        });


    d3.select("#rbtn") // Remove button
        .on("click", function () {
            dataset.shift();
            var bars = svg.selectAll("rect").data(dataset);
            var labels = svg.selectAll("text").data(dataset);
            xScale.domain(d3.range(dataset.length));

            bars.exit()
                .transition()
                .duration(500)
                .attr("x", w)
                .remove("x", w)

            bars.transition()
                .delay(500)
                .attr("x", function (d, i) {
                    return xScale(i);
                })
                .attr("y", function (d) {
                    return h - yScale(d);
                })
                .attr("width", xScale.bandwidth())
                .attr("height", function (d) {
                    return yScale(d);
                })
                .attr("fill", function (d) {
                    return "rgb(0, 0, " + (d * 10) + ")";
                });

            registerMouseovers();
        });

    d3.select("#sbtn") //sort button
        .on("click", function () {
            sortBars();

            registerMouseovers();
        });

    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", function (d, i) {
            return xScale(i);
        })
        .attr("y", function (d) {
            return h - yScale(d);
        })
        .attr("width", xScale.bandwidth())
        .attr("height", function (d) {
            return yScale(d);
        })
        .attr("fill", function (d) {
            return "rgb(0, 0, " + (d * 10) + ")";
        });
    registerMouseovers();

}


window.onload = init;