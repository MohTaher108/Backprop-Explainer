function create_path_data(sizes, actual_input_size) {
    var data = []
    for (let i = 0; i < sizes.length - 1; i++) {
        for (let j = 0; j < sizes[i + 1]; j++) {
            if (i == 0) {
                dummy = 0
            } else {
                dummy = 0
            }
            for (let k = 0; k < sizes[i] + dummy; k++) {
                if (i == 0) {
                    var path = { "id": "path_x_" + k + "_h" + i + "_" + j, "source": "x_" + k, "sink": "h" + i + "_" + j }
                   /*  if (k < sizes[i] / 2) {
                        var path = { "id": "path_x_" + k + "_h" + i + "_" + j, "source": "x_" + k, "sink": "h" + i + "_" + j }
                    } else if (k >= sizes[i] / 2 + dummy) {
                        var path = { "id": "path_x_" + (actual_input_size - ((sizes[i]) + dummy - k)) + "_h" + i + "_" + j, "source": "x_" + (actual_input_size - ((sizes[i]) + dummy - k)), "sink": "h" + i + "_" + j }
                    } else {
                        continue;
                    } */
                } else if ((i + 1) == (sizes.length - 1)) {
                    var path = { "id": "path_h" + (i - 1) + "_" + k + "_y_" + j, "source": "h" + (i - 1) + "_" + k, "sink": "y_" + j }
                } else {
                    var path = { "id": "path_h" + (i - 1) + "_" + k + "_h" + i + "_" + j, "source": "h" + (i - 1) + "_" + k, "sink": "h" + i + "_" + j }
                }
                data.push(path)
            }
        }
    }
    return data
}

function bold_path(source, sink) {
    var pathid = "path_" + source + "_" + sink;
    console.log("bolding", pathid);
    var path = svg.select(`#${pathid}`);
    path.style('stroke-width', 10);
}

function unbold_path(source, sink) {
    var pathid = "path_" + source + "_" + sink;
    console.log("unbolding", pathid);
    var path = svg.select(`#${pathid}`);
    path.style('stroke-width', 2.5);
}

function highlightPath(pathId) {

    pathIds = [];

    pathIds.push(pathId);

    var parts = pathId.split("_"); //["path", "h0", "0", "h1", "0"]

    var firstHalf = "path_" + parts[3] + "_" + parts[4] + "_";

    var dest = parts[3];

    console.log(dest);

    if (dest == "h1") {
        ends = ["y_0", "y_1", "y_2"]
        ends.forEach(function (endStr) {
            console.log(firstHalf + endStr);
            pathIds.push(firstHalf + endStr);
        });
    }
    if (dest == "h0") {
        path_data.forEach(function (path) {
            // Check if the path starts with the constructed prefix
            if (path.id.startsWith("path_h1")) {
                // If yes, add the path ID to the list of paths to highlight
                pathIds.push(path.id);
            }
        });

        ends = ["h1_0", "h1_1", "h1_2"]
        ends.forEach(function (endStr) {
            pathIds.push(firstHalf + endStr);
        });
    }


    pathIds.forEach(function (pathId, index, array) {
        // Select the path element by its ID
        var path = svg.select(`#${pathId}`);
        // Check if the path exists
        if (!path.empty()) {
            // Determine color based on index
            var color;
            if (index === 0) {
                color = '#097969';
            } else if (index >= array.length - 12 && index < array.length) {
                color = '#B2456E';
            } else {
                color = '#552619'
            }
            // Apply styling to highlight the path with the determined color
            path.style('stroke', color);
            path.style('stroke-width', 2.5);
        } else {
            console.warn(`Path with ID '${pathId}' not found.`);
        }
    });
}

function getSourceSink(path) {
    pathlist = path.split('_');
    node1 = pathlist[1] + '_' + pathlist[2];
    node2 = pathlist[3] + '_' + pathlist[4];
    edge = [node1, node2];
    return edge;
}

// Usage example:
// var pathIdToHighlight = 'path_h0_1_h1_2'; // Example path ID to highlight
// highlightPath(pathIdToHighlight);
function clearHighlight(pathId) {
    // Clear all highlighted paths
    var path = svg.select(`#${pathId}`);
    if (!path.empty()) {
        // Apply styling or animation to highlight the path
        path.style('stroke', '#888888'); // Example: Change stroke color to red
        path.style('stroke-width', 1); // Example: Increase stroke width
    } else {
        console.warn(`Path with ID '${pathId}' not found.`);
    }
}

var path_data = create_path_data(layer_size, 784)

var lines = paths.selectAll("line").data(path_data);

var appended_lines = lines.enter().append("line");

//relies on node location
appended_lines.style("stroke", "#888888")
    .style("stroke-width", 1)
    .attr("id", function (d) { return d.id })
    .attr("x1", function (d) {
        var circle = d3.select("#nodes").select("#node_" + d.source).select("#node_" + d.source);
        return circle.attr('cx');
    })
    .attr("y1", function (d) {
        var circle = d3.select("#nodes").select("#node_" + d.source).select("#node_" + d.source);
        return circle.attr('cy');
    })
    .attr("x2", function (d) {
        var circle = d3.select("#nodes").select("#node_" + d.sink).select("#node_" + d.sink);
        return circle.attr('cx');
    })
    .attr("y2", function (d) {
        var circle = d3.select("#nodes").select("#node_" + d.sink).select("#node_" + d.sink);
        return circle.attr('cy');
    });

d3.select("#nodes").raise()
var is_path_clicked = false;
var allContainers = [];
var mathcontain = [];

appended_lines.on("mouseover", function () {
    if (!is_path_clicked) {
        d3.select(this)
            .style("stroke", "black")
            .style("stroke-width", 5);
    }
})
// Add mouseout event handler
.on("mouseout", function () {
    if (!is_path_clicked) {
        d3.select(this)
            .style("stroke", "#888888")
            .style("stroke-width", 1);
    }
})
.on('click', function (d) { // Add click event listener directly after appending the paths
    var clickedPathId = d.id; // Get the ID of the clicked path
    var ogClicked = true;
    if (is_path_clicked == false) {
        // If the clicked path is different from the highlighted one, highlight it
        highlightPath(clickedPathId);
        showPages();
        currID = clickedPathId;
        ogClicked = false;
        is_path_clicked = true;
        var initial = svg.select(`#${clickedPathId}`);
        initial.style('stroke-width', 10);
    }
    let newString = clickedPathId.replace("h1", "h2");
    let finS = newString.replace("h0", "h1");
    fetch(`/latex_expression?edge=${finS}`)
        .then(response => response.json())

        .then(data => {
            console.log(getSourceSink(clickedPathId));
            edge = getSourceSink(clickedPathId);
            /**if (edge[0].includes("h0")) {
                dropdown_sr_si[0].sr = "void";
                dropdown_sr_si[0].si = "void";
                dropdown_sr_si[1].sr = edge[0];
                dropdown_sr_si[1].si = edge[1];
                total_drop = 1;
            } else if (edge[0].includes("h1")) {
                dropdown_sr_si[0].sr = "void";
                dropdown_sr_si[0].si = "void";
                dropdown_sr_si[1].sr = "void";
                dropdown_sr_si[1].si = "void";
            } else {
                dropdown_sr_si[0].sr = edge[0];
                dropdown_sr_si[0].si = edge[1];
            }**/
            currentFormulaList = data.expression;
            if (ogClicked == false) {
                var p1 = "\\(" + data.expression[0] + "\\)";
                formulaContainer.html(p1);
                MathJax.typeset([formulaContainer.node()]);
                formulaContainer.datum({ latex: p1, clicked: false })

                var p2 = "\\(" + data.expression[1] + "\\)";
                formulaContainerUpstream.html(p2);
                MathJax.typeset([formulaContainerUpstream.node()]);
                formulaContainerUpstream.datum({ latex: p2, clicked: false })

                var p3 = "\\(" + data.expression[2] + "\\)";
                formulaContainerLocal.html(p3);
                MathJax.typeset([formulaContainerLocal.node()]);
                formulaContainerLocal.datum({ latex: p3, clicked: false })
            }

        });

    
    /*fetch(`/latex_expression_math?edge=${finS}`)
        .then(response => response.json())
        .then(data => {
            console.log("expand math", data.expression);
            var Mathcontainer1 = svg.append("foreignObject")
                .attr("x", width / 6 - 10 + 650) // Adjust the position as needed
                .attr("y", height + margin.top + 32) // Adjust the position as needed
                .attr("width", 500) // Adjust the width as needed
                .attr("height", 500) // Adjust the height as needed
                .attr("data-index", ctr + 2)
                .append("xhtml:div")
                .style("display", "inline-block")
                .style("font-size", "30px");

            Mathcontainer1.html("\\(" + data.expression + "\\)")
            MathJax.typeset([Mathcontainer1.node()]);
            mathcontain.push(Mathcontainer1)

        });*/
})
.on('dblclick', function (d) {
    if (d.id == currID) {
        is_path_clicked = false;
        hidePages();
    }
    pathIds.forEach(function (pathId) {
        // Select the path element by its ID
        var path = svg.select(`#${pathId}`);
        // Check if the path exists
        if (!path.empty()) {
            formulaContainer.html("");
            formulaContainerUpstream.html("");
            formulaContainerLocal.html("");
            // Apply styling to highlight the path
            path.style('stroke', '#888888');
            path.style('stroke-width', 1);
            allContainers.forEach(function (cont) {
                // Clear the HTML content of the container
                cont.html("");
            });
            mathcontain.forEach(function (cont) {
                // Clear the HTML content of the container
                cont.html("");
            });
            currHeigh = 1264;
            heightAdj = 0;
            final_container_click = false;
            total_drop = 0;
            dropdown_sr_si = [{ sr: null, si: null }, { sr: null, si: null }, { sr: null, si: null }]
        } else {
            console.warn(`Path with ID '${pathId}' not found.`);
        }
    });
}); // Clear the highlighted paths
