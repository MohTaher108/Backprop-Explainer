var svg = d3.select("#neural-network").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom - 350);

var nn = svg.append("g")
    .attr("id", "neural-net")
    .attr("transform", "translate(" + margin.right + ", " + margin.top + ")")

var paths = nn.append("g").attr("id", "paths");
var nodes = nn.append("g").attr("id", "nodes");

var citation = svg.append("g")
    .attr("id", "citation")
    .attr("transform", "translate(" + 10 + ", " + 20 + ")")
    .append("text")
    .text("Artwork by @allison_horst");

//displays image of the corresponding char next to each output
var imageContainer = svg.append("g")
    .attr("id", "imageContainer")
    .attr("transform", "translate(" + (width + margin.right) + ", " + margin.top + ")");

// Append an image for each filename in the array
imageContainer.selectAll("image")
    .data(imagePaths)
    .enter().append("image")
    .attr("xlink:href", function (d) { return "static/output_Images/" + d; }) // Set the image URL
    .attr("width", 120) // Set the width of each image
    .attr("height", 120) // Set the height of each image
    .attr("x",  40) // Position images horizontally
    .attr("y", function (d, i) { return i * height / 2 - 60; }); // Position images vertically with a gap 