




var currID = false;
var a = 1;
var final_container_click = false;
                                                                             







var currentFormulaList = [];
var mathcontain = [];
var tempList = [];
var heightAdj = 0; //useful for scrolling ability!
var total_drop = 0;
var dropdown_sr_si = [{ sr: null, si: null }, { sr: null, si: null }, { sr: null, si: null }]
//experimented with looking at previous formulas!
var trackForms = [];
var ctr = 0;
var tierlvl = 1;


function createFormulaContainerFinal(output) {
    heightAdj += 200;
    var newFormulaContainer = pagesvg.append("foreignObject")
        .attr("x", width / 6 - 110) // Adjust the position as needed
        .attr("y", height + margin.top + 30 + heightAdj) // Adjust the position as needed
        .attr("width", 500) // Adjust the width as needed
        .attr("height", 200) // Adjust the height as needed
        .attr("data-index", ctr)
        .append("xhtml:div")
        .style("display", "inline-block")
        .style("font-size", "40px");
    newFormulaContainer.datum(output);

    output = "\\(" + output + "\\)";
    newFormulaContainer.html(output);

    MathJax.typeset([newFormulaContainer.node()]);
    allContainers.push(newFormulaContainer)
}


//recursive function that displays formulas below
function createFormulaContainer(left, mid, right) {
    a = 0;
    tempList = [];
    tempList.push(left, mid.slice(1), right.slice(5));
    updateSVGHeight();
    heightAdj += 200;

    var newFormulaContainerLeft = pagesvg.append("foreignObject")
        .attr("x", width / 6 - 10) // Adjust the position as needed
        .attr("y", height + margin.top + 30 + heightAdj) // Adjust the position as needed
        .attr("width", 500) // Adjust the width as needed
        .attr("height", 200) // Adjust the height as needed
        .attr("data-index", ctr)
        .append("xhtml:div")
        .style("display", "inline-block")
        .style("font-size", "40px");


     
    var match = left.match(/\d+/);
    var sr = ""
    console.log(total_drop)
    if (dropdown_sr_si[1].sr == null) {
        dropdown_sr_si[1].sr = "h0_" + match[0];
    } else if (dropdown_sr_si[2].sr == null) {
        dropdown_sr_si[2].sr = "h1_" + match[0];
        //console.log(sr)
    }
    console.log(dropdown_sr_si)


    newFormulaContainerLeft.datum({ tier: tierlvl, latex: left, clicked: false });

    var newFormulaContainerMid = pavgsvg.append("foreignObject")
        .attr("x", width / 6 - 10 + 100) // Adjust the position as needed
        .attr("y", height + margin.top + 30 + heightAdj) // Adjust the position as needed
        .attr("width", 500) // Adjust the width as needed
        .attr("height", 200) // Adjust the height as needed
        .attr("data-index", ctr + 1)
        .append("xhtml:div")
        .style("display", "inline-block")
        .style("font-size", "40px");

    var match = mid.match(/\d+/);
    var si = ""
    var dropdown_data;
    console.log(dropdown_sr_si)
    if (dropdown_sr_si[1].si == null) {
        dropdown_sr_si[1].si = "h1_" + match[0];
        dropdown_data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    } else if (dropdown_sr_si[2].si == null) {
        dropdown_sr_si[2].si = "y_" + match[0];
        dropdown_data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    }


    //console.log(sr, si)

    newFormulaContainerMid.datum({ tier: tierlvl, latex: mid.slice(1), clicked: false });
    var widthAj = mid.length < 20 ? 250 : 350;

    var newFormulaContainerRight = pagesvg.append("foreignObject")
        .attr("x", width / 6 - 10 + widthAj) // Adjust the position as needed
        .attr("y", height + margin.top + 30 + heightAdj) // Adjust the position as needed
        .attr("width", 500) // Adjust the width as needed
        .attr("height", 200) // Adjust the height as needed
        .attr("data-index", ctr + 2)
        .append("xhtml:div")
        .style("display", "inline-block")
        .style("font-size", "40px");

    ctr += 2;
    trackForms.push(left, mid, right);
    newFormulaContainerRight.datum({ tier: tierlvl, latex: right.slice(5), clicked: false });


    left = "\\(" + left + "\\)";
    mid = "\\(" + mid + "\\)";
    right = "\\(" + right + "\\)";
    newFormulaContainerLeft.html(left);

    MathJax.typeset([newFormulaContainerLeft.node()]); //UNCOMMENT THIS LINE!
    newFormulaContainerMid.html(mid);
    MathJax.typeset([newFormulaContainerMid.node()]); //UNCOMMENT THIS LINE!
    newFormulaContainerRight.html(right);
    MathJax.typeset([newFormulaContainerRight.node()]); //UNCOMMENT THIS LINE!

    /*for(int i = 0; i < 3 i++) {
        
    }*/
    bold_path(dropdown_sr_si[total_drop + 1].sr, dropdown_sr_si[total_drop + 1].si);

    if (mid.includes("sum")) {

        var width_pad = right.length < 30 ? 150 : 100;
        var newFormulaContainerInput = svg.append("foreignObject")
            .attr("x", width / 6 - 10 + widthAj + width_pad) // Adjust the position as needed
            .attr("y", height + margin.top + 30 + heightAdj) // Adjust the position as needed
            .attr("width", 500) // Adjust the width as needed
            .attr("height", 200) // Adjust the height as needed
            .attr("data-index", ctr + 3)
            .append("xhtml:div")
            .style("display", "inline-block")
            .style("font-size", "40px");

        // Create a dropdown menu and add options
        var dropdown = newFormulaContainerInput.append("select").style("font-size", "20px").attr("id", "drop_id_" + total_drop);
        newFormulaContainerInput.datum({ tier: tierlvl })
        //dropdown_sr_si[total_drop].sr = sr;
        //dropdown_sr_si[total_drop].si = si;
        console.log(dropdown_sr_si)


        dropdown.selectAll("option")
            .data(dropdown_data)
            .enter().append("option")
            .attr("value", function (d) { return d; })
            .text(function (d) { return d; });


        // Listen for change event on the dropdown menu
        dropdown.on('change', function () {

            // Get the selected value of the dropdown menu
            var id = parseInt(dropdown.attr('id').charAt(dropdown.attr('id').length - 1));
            unbold_path(dropdown_sr_si[id + 1].sr, dropdown_sr_si[id + 1].si)
            if (dropdown_sr_si[id + 1].si.includes("h1")) {
                console.log("yes")
                var drop_id_1 = document.getElementById("drop_id_1");
                if (drop_id_1 != null) {
                    console.log(si, drop_id_1.value, dropdown_sr_si[id + 2])
                    unbold_path(dropdown_sr_si[id + 2].sr, "y_" + drop_id_1.value)

                }

            }
            var selectedValue = dropdown.property('value');


            a = selectedValue;


            dropdown_sr_si[id + 1].si = dropdown_sr_si[id + 1].si.substring(0, dropdown_sr_si[id + 1].si.indexOf("_") + 1);

            dropdown_sr_si[id + 1].si += a
            bold_path(dropdown_sr_si[id + 1].sr, dropdown_sr_si[id + 1].si);
            if (dropdown_sr_si[id + 1].si.includes("h1")) {
                var drop_id_1 = document.getElementById("drop_id_1");
                if (drop_id_1 != null) {
                    dropdown_sr_si[id + 2].sr = dropdown_sr_si[id + 1].si;
                    console.log(dropdown_sr_si)
                    bold_path(dropdown_sr_si[id + 2].sr, "y_" + drop_id_1.value)

                }

            }

            var curr_tier = newFormulaContainerInput.datum().tier;

            var param = newFormulaContainerMid.datum().latex
            console.log(param)
            fetch(`/expand?gradient=${param}&a=${a}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data.expression)


                });

            for(var i = 0; i < allContainers.size(); i++ ) {
                if (allContainers[i].datum().tier == curr_tier) {
                    var container = allContainers[i];
                    container.html()
                }
            }




        });

        newFormulaContainerInput.insert("text", "select")
            .text("a= ")
            .style("font-size", "40px"); // Adjust font size for the "a=" text

        allContainers.push(newFormulaContainerLeft,
            newFormulaContainerMid,
            newFormulaContainerRight, newFormulaContainerInput);

    } else {
        allContainers.push(newFormulaContainerLeft,
            newFormulaContainerMid,
            newFormulaContainerRight,);
    }

    tierlvl++;



    // Attach click event listener to the new container
    newFormulaContainerRight.on("mouseover", function () {
        let param = newFormulaContainerRight.datum().latex;
        if (!param.includes("n_{a}^{(3)}")) {
            var tooltip = d3.select("#tooltip");
            fetch(`/expand?gradient=${param}&a=${a}`)
                .then(response => response.json())
                .then(data => {
                    left = "\\(" + data.expression[0] + "\\)";
                    mid = "\\(" + data.expression[1] + "\\)";
                    right = "\\(" + data.expression[2] + "\\)";
                    tooltip.html(left + mid + right);
                    MathJax.typeset([tooltip.node()]);
                });

            var [x, y] = d3.mouse(this.parentNode);
            tooltip.style("left", (x + 10) + "px")
                .style("top", (y + 10) + "px");
            tooltip.style("display", "block");
        }




    }).on("mouseout", function () {
        // Hide the tooltip
        d3.select("#tooltip").style("display", "none");
    }).on("click", function () {
        var clicked = final_container_click;
        let param = newFormulaContainerRight.datum().latex;
        if (param == tempList[2]) {
            console.log("yes")
        }
        if (tempList[1].includes("L^{(3)}") && !clicked) {
            let param1 = tempList[1].slice(2) + tempList[2];
            let param2 = String(a);
            console.log(a)
            fetch(`/expand?gradient=${param1}&a=${param2}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data.expression)
                    createFormulaContainerFinal(data.expression);

                });
            final_container_click = true;
        }
    });

    newFormulaContainerMid.on("click", function () {
        var fclicked = final_container_click;
        var cclicked = newFormulaContainerMid.datum().clicked;
        let param = newFormulaContainerMid.datum().latex;
        if (param.includes("L^{(3)}") && !fclicked && !cclicked) {
            let param1 = tempList[1].slice(2) + tempList[2];
            let param2 = String(a);
            console.log(a)
            fetch(`/expand?gradient=${param1}&a=${param2}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data.expression)
                    createFormulaContainerFinal(data.expression);

                });
            final_container_click = true




        } else if (!fclicked && !cclicked) {
            let param = newFormulaContainerMid.datum().latex;
            fetch(`/expand?gradient=${param}&a=${String(a)}`)
                .then(response => response.json())
                .then(data => {
                    createFormulaContainer(data.expression[0], data.expression[1], data.expression[2]);
                });
            newFormulaContainerMid.datum().clicked = true

            console.log("curren param", param)
            fetch(`/expand_math?gradient=${param}`)
                .then(response => response.json())
                .then(data => {
                    console.log("expand math", data.expression);
                    var Mathcontainer1 = svg.append("foreignObject")
                        .attr("x", width / 6 - 10 + widthAj + width_pad + 150) // Adjust the position as needed
                        .attr("y", height + margin.top + heightAdj - 65) // Adjust the position as needed
                        .attr("width", 500) // Adjust the width as needed
                        .attr("height", 500) // Adjust the height as needed
                        .attr("data-index", ctr + 2)
                        .append("xhtml:div")
                        .style("display", "inline-block")
                        .style("font-size", "15px");

                    Mathcontainer1.html("\\(" + data.expression + "\\)")
                    MathJax.typeset([Mathcontainer1.node()]);
                    mathcontain.push(Mathcontainer1)

                });
        }



    });

    total_drop += 1;
}







var pathIds = [];



