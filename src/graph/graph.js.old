
const graph = new Graph();

document.getElementById("delete-button").addEventListener("click", (e) => {
    const res = confirm("Are you sure you want to delete this graph? This operation cannot be undone")
    if (res == true) {
        graph.deleteGraph();
        d3.select("#graph").remove();
    }
});


const nodes = graph.getNodes();
const links = graph.getRelationships();

const width = document.getElementById("graph-pane").getBoundingClientRect().width;
const height = document.getElementById("graph-pane").getBoundingClientRect().height;

// Set up SVG container
const svg = d3.select("#graph-pane")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(d3.zoom()
      .scaleExtent([0.1, 5])
      .on("zoom", zoomed))
    .append("g");

// Default graph options
document.getElementById("charge-slider").value = 50;
document.getElementById("distance-slider").value = 50;
document.getElementById("show-node-labels-checkbox").checked = true;
document.getElementById("show-link-labels-checkbox").checked = true;

// Create a force simulation
const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(link=>(200)))
    .force("charge", d3.forceManyBody().strength(-550))
    .force("center", d3.forceCenter(width/2, height/2));

svg.append("defs").append("marker")
    .attr("id", "arrowhead")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 26) // Adjust the position for better alignment
    .attr("markerWidth", 7)
    .attr("markerHeight", 7)
    .attr("orient", "auto")
    .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("class", "arrowhead")
        .style("fill", "#555555");

// Create links
const link = svg.selectAll("line")
    .data(links)
    .enter().append("line")
        .attr("class", "link")
        .attr("marker-end", "url(#arrowhead)")
        .style("stroke-width", 3)
        .style("stroke", "#555555")
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y)
        .lower();

const nodeSelection = svg.selectAll(".nodes")
    .data(nodes)
    .enter()
    .append('g')
    .attr('class', 'node')


const node = nodeSelection.append("circle")
    .attr("class", d => "node "  + d.type)
    .attr("id", d => d.id)
    .attr("r", 35)
    .style("stroke-width", 2)
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended))
    .on("click", selectNodeEvent);

node.append("title")
    .text(d => d.id);


const label = nodeSelection.append("text")
    .text(d => d.id)
    .attr("dx", 0) // offset label to the right
    .attr("dy", 25) // offset label upward
    .style("visibility", "visible")
    .style("font-weight", "bold")
    .style("font-family", "monospace")
    .style("cursor", "default")
    .attr("class", "node-label")
    .attr("text-anchor", "middle")      // Center horizontally
    .each(function(d) {
        const nodeRadius = 35; // Adjust this based on your node size
        const availableWidth = 2 * nodeRadius;
        const availableHeight = 2 * nodeRadius;

        // Dynamically set font size based on available space
        let fontSize = 15; // Default font size
        const text = d3.select(this);
        
        do {
          text.style("font-size", `${fontSize}px`);
          fontSize--;
        } while (text.node().getBBox().width > availableWidth || text.node().getBBox().height > availableHeight);
        
      })
    .on("click", selectNodeEvent);
    

const linkLabel = svg.selectAll(".link-label")
    .data(links)
    .enter().append("text")
    .attr("class", "link-label")
    .text(d => d.label)
        .style("font-weight", "bold")
    .style("font-family", "monospace")
    .style("text-anchor", "middle")
    .style("visibility", "visible");

    

// Update positions during simulation
simulation.on("tick", () => {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

    label
        .attr("x", d => d.x)
        .attr("y", d => d.y - 20); // adjust the label position

    linkLabel
        .attr('transform', (d) => {
            const dx = d.target.x - d.source.x;
            const dy = d.target.y - d.source.y;
            let angle = Math.atan2(dy, dx) * (180 / Math.PI);
            if (angle > 90 || angle < -90) {
                angle = angle - 180;
            }
            return `translate(${(d.source.x + d.target.x) / 2},${(d.source.y + d.target.y) / 2}) rotate(${angle})`;;

        });
});

function selectNodeEvent(evt) {
    d3.selectAll("circle").style("stroke", "");
    d3.selectAll("circle").style("stroke-width", 2);

    document.getElementById("node-detail").style.visibility = "visible";

    const nodes = d3.select(this.parentNode).select("circle");
    // Change stroke 
    nodes.style("stroke", "#EE00FF");
    nodes.style("stroke-width", 3);

    const node = nodes.data()[0];
    document.getElementById("node-id").value = node.id;
    document.getElementById("node-type").value = node.type;

    evt.stopPropagation();
}


document.getElementById("graph-pane").addEventListener("click", function(evt) {
    // Set black stroke to all nodes
    d3.selectAll("circle").style("stroke", "");
    d3.selectAll("circle").style("stroke-width", 2);
    document.getElementById("node-detail").style.visibility = "hidden";
});

document.getElementById("analyze-button").addEventListener("click", function(evt) {
    // Save indicator in local storage
    localStorage.setItem("indicator", document.getElementById("node-id").value);
    localStorage.setItem("type", document.getElementById("node-type").value);
    
});


document.getElementById("charge-slider").addEventListener("input", function(evt) {
    const tunedValue = -50 - (parseInt(evt.target.value)*10);
    simulation.force("charge", d3.forceManyBody().strength(tunedValue));
    simulation.alpha(1).restart();

});

document.getElementById("distance-slider").addEventListener("input", function(evt) {
    const tunedValue = parseInt(evt.target.value)*2 +100;
    simulation.force("link", d3.forceLink(links).id(d => d.id).distance(link=>(tunedValue)));
    simulation.alpha(1).restart();
});

document.getElementById("show-node-labels-checkbox").addEventListener("change", function(evt) {
    if (evt.currentTarget.checked) {
        svg.selectAll(".node-label").style("visibility", "visible");
    } else {
        svg.selectAll(".node-label").style("visibility", "hidden");
    }
});

document.getElementById("show-link-labels-checkbox").addEventListener("change", function(evt) {
    if (evt.currentTarget.checked) {
        svg.selectAll(".link-label").style("visibility", "visible");
    } else {
        svg.selectAll(".link-label").style("visibility", "hidden");
    }
});


function zoomed(event) {
    svg.attr("transform", event.transform);
}

// Drag functions for nodes
function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}

function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

// Show settings pane
document.getElementById("settings-button").addEventListener("click", ()=>{
    const settingsPane = document.getElementById("settings-pane");
    settingsPane.style.display = settingsPane.style.display != "table-cell" ? "table-cell" : "none";
});

