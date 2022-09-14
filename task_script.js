function init() {
    var w = 500;
    var h = 130;
    var barPadding = 2;

    d3.csv("Task_2.4_data.csv").then(function (data) {
        console.log(data);
        wombatSightings = data;

        barChart(wombatSightings);
    });

    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    function barChart(data) {
        svg.selectAll("rect")
            .data(wombatSightings)
            .enter()
            .append("rect")
            .attr("x", function (d, i) {
                return i * (w / wombatSightings.length);
            })
            .attr("y", function (d) {
                return h - (d.data * 4);
            })
            .attr("width", w / wombatSightings.length - barPadding)
            .attr("height", function (d) {
                return d.data * 4;
            })
            .attr("fill", function (d) {
                return "rgb(0,0, " + (d.data * 10) + ")";
            });
        svg.selectAll("text")
            .data(wombatSightings)
            .enter()
            .append("text")
            .text(function (d) {
                return d.data;
            })
            .attr("x", function (d, i) {
                return i * (w / wombatSightings.length) + 15;
            })
            .attr("y", function (d) {
                return h - (d.data * 4) + 15;
            })
            .attr("text-anchor", "middle")
            .attr("fill", "white");
    }

}
window.onload = init;