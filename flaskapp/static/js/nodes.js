//create all the node data!
function create_node_data(sizes, actual_input_size) {
    var data = []
    for (let i = 0; i < sizes.length; i++) {
        if (i == 0) {
            for (let j = 0; j < sizes[i]; j++) {
                var node = { "id": "node_x_" + j, "col": i, "row": j }
                data.push(node)
            }
            /* for (let j = 0; j < sizes[i] + 3; j++) {
                if (j >= sizes[i] / 2 && j < sizes[i] / 2 + 3) {
                    var node = { "id": "node_dummy_" + (j - sizes[i] / 2), "col": i, "row": j, "dummy": true }
                } else if (j < sizes[i] / 2) {
                    var node = { "id": "node_x_" + j, "col": i, "row": j, "dummy": false }
                } else {
                    var node = { "id": "node_x_" + (actual_input_size - ((sizes[i]) + 3 - j)), "col": i, "row": j, "dummy": false }
                }
                data.push(node)
            } */

        } else if (i == sizes.length - 1) {
            for (let j = 0; j < sizes[i]; j++) {
                var node = { "id": "node_y_" + j, "col": i, "row": j }
                data.push(node)
            }
        } else {
            for (let j = 0; j < sizes[i]; j++) {
                var node = { "id": "node_h" + (i - 1) + "_" + j, "col": i, "row": j }
                data.push(node)
            }
        }
    }

    return data;
}

var node_data = create_node_data(layer_size, 4)
var circles = nodes.selectAll("circle").data(node_data);

circles.enter()
    .append("g")
    .attr("id", function (d) { return d.id })
    .append("circle")
    .attr("r", function (d) {
        r = 15
        return r;
    })
    .style("fill", function (d) {
        color = "#69b3a2";
        return color;
    })
    .attr("id", function (d) { return "" + d.id })
    .attr("cx", function (d) { return (d.col) * width / (layer_size.length - 1) })
    .attr("cy", function (d) {
        var true_layer_size = layer_size[d.col]
        if (d.col == 0) {
            true_layer_size += 0
        }

        if (true_layer_size == 1) {
            return height / 2
        } else if (true_layer_size == 2) {
            return (d.row) * height / 2 + 100
        }
        return (d.row) * height / (true_layer_size - 1)
    })



