const themeSelect = document.getElementById("theme-select");
const repulsionSlider = document.getElementById("charge-slider");
const springLengthSlider = document.getElementById("spring-length-slider");
const nodeSizeSlider = document.getElementById("node-size-slider");
const labelSizeSlider = document.getElementById("label-size-slider");
const edgeSizeSlider = document.getElementById("edge-size-slider");
const edgeColorSelect = document.getElementById("edge-color-select");
const labelColorSelect = document.getElementById("label-color-select");

var network;
var nodesView;
var edgesView;
// Save the last selected node for relationship creation
var lastSelectedNode;
var nodeFilterValue = "";
var options;
browser.storage.local.get("graphSettings").then( (result) => {
    const graphSettings = result.graphSettings;

    themeSelect.value = graphSettings.icontheme;
    repulsionSlider.value = graphSettings.repulsion;
    springLengthSlider.value = graphSettings.edgelength;
    nodeSizeSlider.value = graphSettings.nodesize;
    edgeSizeSlider.value = graphSettings.edgesize;
    labelSizeSlider.value = graphSettings.labelsize;
    edgeColorSelect.value = graphSettings.edgecolor;
    labelColorSelect.value = graphSettings.nodelabelcolor;

    options = {
        edges:{
            arrows: {
                to: {
                    enabled: true,
                    type: "arrow"
                }
            },
            endPointOffset: {
                from: 0,
                to: 0
            },
            color: {
                color: edgeColorSelect.value
            },
            arrowStrikethrough: false,
            width: parseInt(edgeSizeSlider.value),
            font: {
                size: parseInt(labelSizeSlider.value)
            }
        },
        nodes: {
            size: parseInt(nodeSizeSlider.value),
            font: {
                face: 'arial',
                strokeWidth: 0.5,
                strokeColor: "#FFFFFF",
                color: labelColorSelect.value,
                bold: 'true',
                size: parseInt(labelSizeSlider.value)
            }
        },
        physics:{
            enabled: true,
            barnesHut: {
                theta: 1.0,
                gravitationalConstant: -parseInt(repulsionSlider.value)*1000,
                centralGravity: 1,
                springLength: parseInt(springLengthSlider.value),
                springConstant: 0.04,
                damping: 1,
                avoidOverlap: 0
            },
            solver: 'barnesHut',
            stabilization: {
                enabled: true,
                iterations: 100
            }
        },
        manipulation: {
            addEdge: function (data, callback) {
                if (data.from == data.to) {
                    var r = confirm("Do you want to connect the node to itself?");
                    if (r === true) {
                        createRelationshipForm(data, callback);
                    }
                }
                else {
                    createRelationshipForm(data, callback);
                }
            },
        }
    }
    renderGraph();
});

function renderGraph() {
    Graph.getInstance().then( (graph) => {

        var graphNodes = [];

        const theme = themeSelect.value;
        for (node of graph.getNodes()) {
            if (Object.hasOwn(node, "content")) {
                graphNodes.push({
                    id: node.id,
                    label: node.label,
                    shape: 'image',
                    image: "img/"+node.type+"-"+theme+".png",
                    content: node.stix.content,
                    stix: JSON.stringify(node.stix)
                });
            } else {
                graphNodes.push({
                    id: node.id,
                    label: node.label,
                    shape: 'image',
                    image: "img/"+node.type+"-"+theme+".png",
                    stix: JSON.stringify(node.stix)
                });
            }
        }
        var nodes = new vis.DataSet(graphNodes);
        var edges = new vis.DataSet(graph.getLinks());


        const nodesFilter = (node) => {
            if (nodeFilterValue === "") {
                return true;
            }
            const filterNodeIds = graph.getNodesByLabel(nodeFilterValue);
            for (let nodeId of filterNodeIds) {
                if (graph.getOutgoingNodes(nodeId).includes(node.id)) {
                    return true;
                }

                if (document.getElementById("include-incoming-filter-checkbox").checked) {
                    if (graph.getIncomingNodes(nodeId).includes(node.id)) {
                        return true;
                    }
                }
            }
            if (node.label == nodeFilterValue) {
                return true;
            }
            return false;
        };

        const edgesFilter = (edge) => {
            if (nodeFilterValue === "") {
                return true;
            }
            if (nodes.get(edge.from).label === nodeFilterValue) {
                return true;
            }
            if (document.getElementById("include-incoming-filter-checkbox").checked == true) {
                if (nodes.get(edge.to).label === nodeFilterValue) {
                    return true;
                }
            }

            return false;
        };
        nodesView = new vis.DataView(nodes, { filter: nodesFilter });
        edgesView = new vis.DataView(edges, { filter: edgesFilter });

        var container = document.getElementById("graph-pane");
        var data = {
            nodes: nodesView,
            edges: edgesView,
        };
        network = new vis.Network(container, data, options);


        selectNodeEvent = evt => { 
            const nodeContentDiv = document.querySelector("#node-content-pane div pre");
            nodeContentDiv.textContent = "";
                
            document.getElementById("delete-node-button").style.display = "none";
            document.getElementById("edit-node-button").style.display = "none";
            document.getElementById("delete-link-button").style.display = "none";
            if (!addingLinkSwitch) {
                document.getElementById("add-sco-button").style.display = "block";
                document.getElementById("add-sdo-button").style.display = "block";
                document.getElementById("add-link-button").style.display = "block";
            }

            document.querySelectorAll(".hover-msg").forEach( (el) => el.remove() );

            if (network.getSelectedNodes().length > 0) {
                document.getElementById("edit-node-button").style.display = "block";
                document.getElementById("delete-node-button").style.display = "block";
                document.getElementById("add-sco-button").style.display = "none";
                document.getElementById("add-sdo-button").style.display = "none";

                const selectedNode = network.getSelectedNodes()[0];
                for (node of graphNodes) {
                    if (node.id == selectedNode) {
                        nodeContentDiv.textContent = JSON.stringify(JSON.parse(node.stix), null, 2);

                        lastSelectedNode = node;
                    }
                }
                const nodeSTIX = graph.getNode(selectedNode).stix;
                if (Object.hasOwn(nodeSTIX, "content")) {
                    const msg = document.createElement("div");
                    msg.className = "hover-msg";
                    
                    msg.textContent = nodeSTIX.content;
                    document.querySelector(".vis-network").appendChild(msg);
                }

            } else if (network.getSelectedEdges().length > 0) {
                document.getElementById("delete-link-button").style.display = "block";
                document.getElementById("add-sco-button").style.display = "none";
                document.getElementById("add-sdo-button").style.display = "none";
                document.getElementById("add-link-button").style.display = "none";

            }
        }
        network.on('click', selectNodeEvent);
        network.on('dragging', selectNodeEvent);
    });
}
