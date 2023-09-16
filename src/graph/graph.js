
const graph = JSON.parse(localStorage.getItem("graph"));

document.getElementById("delete-button").addEventListener("click", (e) => {
    const res = confirm("Are you sure you want to delete this graph? This operation cannot be undone")
    if (res == true) {
        const newEmptyGraph = {
            'nodes': [],
            'links': []
        }
        localStorage.setItem("graph", JSON.stringify(newEmptyGraph));
        d3.select("#graph").remove();
    }
});


const nodes = graph["nodes"];
const links = graph["links"];


const dragstarted = (event, d) => {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
};

const dragged = (event, d) => {
  d.fx = event.x;
  d.fy = event.y;
};

const dragended = (event, d) => {
  if (!event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
};


const svg = d3.select("#graph");

const width = document.getElementById("graph").getBoundingClientRect().width;
const height = document.getElementById("graph").getBoundingClientRect().height;

const simulation = d3.forceSimulation()
  .force("link", d3.forceLink().id(d => d.id).distance(200))
  .force("charge", d3.forceManyBody().strength(-100))
  .force("center", d3.forceCenter(width / 2, height / 2));


const nodeSelection = svg.selectAll(".node")
  .data(nodes)
  .enter().append("g")

nodeSelection.append("circle")
    .attr("r", 10)
    .attr("class", d => "node "  + d.type)
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

nodeSelection.append("title")
    .text(d=>d.id);

const labels = nodeSelection.append("text")
    .attr("x", 15)
    .attr("dy", -5)
    .text(d=>d.id)


svg.append("defs").append("marker")
  .attr("id", "arrowhead")
  .attr("viewBox", "0 -5 10 10")
  .attr("refX", 20) // Adjust the position for better alignment
  .attr("refY", 0)
  .attr("markerWidth", 10)
  .attr("markerHeight", 10)
  .attr("orient", "auto")
  .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("class", "arrowhead");

const linkSelection = svg.selectAll(".link")
  .data(links)
  .enter().append("line")
    .attr("class", "link")
    .attr("marker-end", "url(#arrowhead)")
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y)
    .lower();

const linkLabelSelection = svg.selectAll(".link-label-group")
  .data(links)
  .enter().append("g")
    .attr("class", "link-label-group");

// Append text to the link label group
linkLabelSelection.append("text")
  .attr("class", "link-label")
  .attr("dy", -5)
  .attr("text-anchor", "middle")
  .text(d => d.label);


simulation.nodes(nodes)
  .on("tick", ticked);

simulation.force("link")
  .links(links);

function ticked() {
    linkSelection
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    nodeSelection.attr("transform", d => `translate(${d.x},${d.y})`);

    // Position the link label group in the middle of the link
    linkLabelSelection.attr("transform", d => {
        const x = (d.source.x + d.target.x) / 2;
        const y = (d.source.y + d.target.y) / 2;
        return `translate(${x},${y})`;
    });
}

