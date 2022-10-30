function init() {

    var w = 500;
    var h = 300;

    var projection = d3.geoMercator()
        .center([145, -36.5])
        .translate([w / 2, h / 2])
        .scale(2450);

    var path = d3.geoPath() //define path generator
        .projection(projection);

    var color = d3.scaleQuantize() //map color 
        .range(["#f2f0f7", "#cbc9e2", "#9e9ac8", "#756bb1", "#54278f"])

    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", w)
        .attr("height", h);


    //load in file
    d3.csv("VIC_LGA_unemployment.csv", function (data) {

        color.domain([
            d3.min(data, function (d) { return d.LGA; }),
            d3.max(data, function (d) { return d.unemployed; })
        ]);


        //read in JSON file and bind it to a path

        d3.json("LGA_VIC.json", function (json) {


            //merging the data of CSV and JSON
            //loop through once for each data value
            for (var i = 0; i < data.length; i++) {

                //Grab LGA name
                var dataLGA = data[i].LGA;

                //Grab unemployed value, and convert from string to float
                var dataUnemployed = parseFloat(data[i].unemployed);

                //Find the corresponding state inside GeoJSON
                for (var j = 0; j < json.features.length; j++) {
                    var jsonLGA = json.features[j].properties.LGA_name;

                    if (dataLGA == jsonLGA) {

                        //copy the data value into JSON
                        json.features[j].properties.unemployed = dataUnemployed;

                        //stop looking through the JSON
                        break;
                    }
                }
            };

            svg.selectAll("path") //map path
                .data(json.features)
                .enter()
                .append("path")
                .attr("d", path)
                .style("fill", function (d) {
                    //get data value
                    var value = d.properties.unemployed;
                    if (value) {
                        //if value exists
                        return color(value);
                    } else {
                        //if value is undefined
                        return "#ccc"; //light grey area
                    }

                });


            //adding in cities
            d3.csv("VIC_city.csv", function (data) {

                svg.selectAll("circle")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("cx", function (d) {
                        return projection([d.lon, d.lat])[0];
                    })
                    .attr("cy", function (d) {
                        return projection([d.lon, d.lat])[1];
                    })
                    .attr("r", 2) // circle size
                    .style("fill", "red") //change dot color
                    

                svg.selectAll("text") // lable cities name
                    .data(data)
                    .enter()
                    .append("text")
                    .text(function (d) {
                        return d.place;
                    })
                    .attr("x", function (d) {
                        return projection([d.lon, d.lat])[0];
                    })
                    .attr("y", function (d) {
                        return projection([d.lon, d.lat])[1];
                    })
                    
            });


        });


    });


}

window.onload = init;