const repulsionSlider = document.getElementById("charge-slider");
const springLengthSlider = document.getElementById("spring-length-slider");
const nodeSizeSlider = document.getElementById("node-size-slider");
const edgeSizeSlider = document.getElementById("edge-size-slider");
const edgeColorSelect = document.getElementById("edge-color-select");

const graph = new Graph();

var options = {
    edges:{
        arrows: {
            to: {
                enabled: true,
                type: "arrow"
            }
        },
        endPointOffset: {
            from: 0,
            to: -10
        },
        color: {
            color: edgeColorSelect.value
        },
        width: parseInt(edgeSizeSlider.value)
    },
    nodes: {
        size: parseInt(nodeSizeSlider.value)
    },
    physics:{
        enabled: true,
        barnesHut: {
            theta: 1.0,
            gravitationalConstant: -parseInt(repulsionSlider.value)*1000,
            centralGravity: 1,
            springLength: parseInt(springLengthSlider.value),
            springConstant: 0.04,
            damping: 0.09,
            avoidOverlap: 0
        },
        solver: 'barnesHut'
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

var graphNodes = [];

for (node of graph.getNodes()) {
    graphNodes.push({
        id: node.id,
        label: node.label,
        shape: 'image',
        image: 'img/'+node.type+'.png',
        stix: JSON.stringify(node.stix)
    });
}
var nodes = new vis.DataSet(graphNodes);
var edges = new vis.DataSet(graph.getRelationships());


var nodeFilterValue = "";
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
const nodesView = new vis.DataView(nodes, { filter: nodesFilter });
const edgesView = new vis.DataView(edges, { filter: edgesFilter });

var container = document.getElementById("graph-pane");
var data = {
    nodes: nodesView,
    edges: edgesView,
};
var network = new vis.Network(container, data, options);

// Save the last selected node for relationship creation
var lastSelectedNode;

selectNodeEvent = evt => { 
    const nodeContentDiv = document.querySelector("#node-content-pane div pre");
    nodeContentDiv.textContent = "";
        
    document.getElementById("delete-node-button").style.display = "none";
    document.getElementById("edit-node-button").style.display = "none";

    const mouseMessage = document.getElementById("mouse-message");
    if (mouseMessage) {
        mouseMessage.remove();
        document.body.style.cursor = "auto";
        addingLinkSwitch = false;

    }

    if (network.getSelectedNodes().length > 0) {
        const selectedNode = network.getSelectedNodes()[0];
        for (node of graphNodes) {
            if (node.id == selectedNode) {
                nodeContentDiv.textContent = JSON.stringify(JSON.parse(node.stix), null, 2);

                if (addingLinkSwitch) {
                    //network.addEdgeMode();
                    console.log("Select another node");

                }
                //if (mouseMessage) {
                //    createRelationshipForm(lastSelectedNode.id, node.id);
                //    
                //} else {
                //    document.getElementById("add-link-button").style.display = "block";
                //    document.getElementById("delete-node-button").style.display = "block";
                //    document.getElementById("edit-node-button").style.display = "block";
                //}
                //lastSelectedNode = node;
            }
        }
    } 
}
network.on('click', selectNodeEvent);
network.on('dragging', selectNodeEvent);





