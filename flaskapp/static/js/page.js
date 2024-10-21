let items = document.querySelectorAll('.page .item');
let next = document.getElementById("next");
let prev = document.getElementById("prev");

let active = 0; 


function loadshow() {
    console.log(   items[active]);


    for(var i = 0; i < items.length; i++) {
        items[i].style.zIndex = 0;
    }


    items[active].style.transform = 'none';
    items[active].style.zIndex = 1; 
    items[active].style.filter = 'none';
    items[active].style.opacity = 1


}
loadshow();

next.onclick = function() {
    console.log("next");
    active = active + 1 < items.length ? active + 1 : active;
    loadshow();
}

prev.onclick = function() {
    console.log("prev");
    active = active - 1 >= 0 ? active - 1 : active;
    loadshow();
}


function togglePages() {
    var element = document.getElementById("page");
    if (element.style.display === 'none') {
        element.style.display = 'block';
    } else {
        element.style.display = 'none';
    }
}

function showPages() {
    var element = document.getElementById("page");
    element.style.display = 'block';
    
}

function hidePages() {
    var element = document.getElementById("page");
    element.style.display = 'none';
    
}

hidePages();


var pagesvg = d3.select("#s1").append("svg")
    .attr("width", 1040)                                                                                
    .attr("height", 320);      

//controls 1st part (left hand side) of 1st/Initial formula.
var formulaContainer = pagesvg.append("foreignObject")
    .attr("x", 10) // Adjust the position as needed
    .attr("y", 10) // Adjust the position as needed
    .attr("width", 100) // Adjust the width as needed
    .attr("height", 100) // Adjust the height as needed
    .append("xhtml:div")
    .style("display", "inline-block")
    .style("font-size", "40px");

//controls upstream grad of 1st formula
var formulaContainerUpstream = pagesvg.append("foreignObject")
    .attr("x", 110) // Adjust the position as needed
    .attr("y", 10) // Adjust the position as needed
    .attr("width", 130) // Adjust the width as needed
    .attr("height", 100) // Adjust the height as needed
    .append("xhtml:div")
    .style("display", "inline-block")
    .style("font-size", "40px");



//controls local grad of 1st formula
var formulaContainerLocal = pagesvg.append("foreignObject")
    .attr("x", 240) // Adjust the position as needed
    .attr("y", 0) // Adjust the position as needed
    .attr("width", 100) // Adjust the width as needed
    .attr("height", 100) // Adjust the height as needed
    .append("xhtml:div")
    .style("display", "inline-block")
    .style("font-size", "40px");


formulaContainerUpstream.on("click", function () {
        let param = currentFormulaList[1].slice(1);
        var clicked = formulaContainerUpstream.datum().clicked
    
        if (!clicked) {
            fetch(`/expand?gradient=${param}`)
                .then(response => response.json())
                .then(data => {
                    createFormulaContainer(data.expression[0], data.expression[1], data.expression[2]);
                    formulaContainerUpstream.disabled = true;
                });
            formulaContainerUpstream.datum().clicked = true;
    
    
            fetch(`/expand_math?gradient=${param}`)
                .then(response => response.json())
                .then(data => {
                    console.log("expand math", data.expression);
                    var Mathcontainer1 = svg.append("foreignObject")
                        .attr("x", width / 6 - 10 + 640) // Adjust the position as needed
                        .attr("y", height + margin.top + 25 + 150) // Adjust the position as needed
                        .attr("width", 500) // Adjust the width as needed
                        .attr("height", 500) // Adjust the height as needed
                        .attr("data-index", ctr + 2)
                        .append("xhtml:div")
                        .style("display", "inline-block")
                        .style("font-size", "20px");
    
                    Mathcontainer1.html("\\(" + data.expression + "\\)")
                    MathJax.typeset([Mathcontainer1.node()]);
                    mathcontain.push(Mathcontainer1)
    
                });
    
    
        }
    
    });
    
    // Add click event listener to formulaContainerLocal
     formulaContainerLocal.on("click", function () {
         //ignore cdot part (slicing for that reason)
         let param = currentFormulaList[2].slice(5);
         fetch(`/expand?gradient=${param}`)
             .then(response => response.json())
             .then(data => {
                 createFormulaContainer(data.expression[0], data.expression[1], data.expression[2]);
             });
     });
    
    
    formulaContainerLocal.on("mouseover", function (event) {
        let param = currentFormulaList[2].slice(5);
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
        console.log(d3.event.pageX, d3.event.pageY)
        var x = d3.event.pageX
        var y = d3.event.pageY
        //var rect = this.parentNode
        //var [x, y] = d3.mouse([rect.top, rect.left]); // Relative to parent elemen
       // console.log((x + this.parentNode.x) , (y + this.parentNode.y))
        tooltip.style("left", (x + 10) + "px") // Adjust positioning as needed
            .style("top", (y + 10) + "px")
            .style("z-index", 1000); // Adjust positioning as needed
    
        // Show the tooltip
        tooltip.style("display", "block");
    
    
    
    }).on("mouseout", function () {
        // Hide the tooltip
        d3.select("#tooltip").style("display", "none");
    });