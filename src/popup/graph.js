/**
 *
 * Handle plus icon clicking event
 *
 */
document.querySelector("#add-node-button").addEventListener("click", (e) => {
    let nodeId = "";
    let nodeType = "";
    browser.storage.local.get("indicator").then( (result) => {
        const indicator = result.indicator;
        nodeId = indicator.value;
        nodeType = indicator.type;
        return Graph.getInstance();
        
    }).then( (graph) => {
        if (graph.addNode(nodeId, nodeType)) {
            document.querySelector("#add-node").style.display = "none";
            document.querySelector("#del-node").style.display = "block";
            document.querySelector("#add-rel").style.display = "block";
            showMessagePopup("Node added to graph", MessageType.INFO);
        }
    });
    
});

/**
 *
 * Handle node delete icon clicking event
 *
 */
document.querySelector("#del-node-button").addEventListener("click", (e) => {
    let indicator;
    browser.storage.local.get("indicator").then( (result) => {
        indicator = result.indicator;
        return Graph.getInstance();
    }).then( (graph) => {
        graph.getNodesByLabel(indicator.value).forEach( (nodeId) => graph.deleteNode(nodeId) );
        document.querySelector("#add-node").style.display = "block";
        document.querySelector("#add-rel").style.display = "none";
        document.querySelector("#del-node").style.display = "none";
    });
});
    

/**
 * Handle add relationship button event to display popup
 *
 */
document.querySelector("#add-rel-button").addEventListener("click", (e) => {
    let nodes = [];
    Graph.getInstance().then( (graph) => {
        let graphNodes = graph.getNodes();
        for (let node in graphNodes) {
            if (graphNodes[node].id != inputField.value) { 
                nodes.push(graphNodes[node]);
            }
        }

        if (nodes.length == 0) {
            showMessagePopup("You need at least one other node to create a relationship", MessageType.WARNING);
        } else {
            // Create options list of nodes you can connect to
            const selectInput = document.getElementById("to-node-name");
            selectInput.textContent = "";
            for (let node in nodes) {
                const newOptionElement = document.createElement("option");
                newOptionElement.value = nodes[node].id;
                newOptionElement.textContent = nodes[node].label;
                selectInput.appendChild(newOptionElement);
            }

            const addRelPopup = document.getElementById("add-relationship-popup");

            // Don't show pointer cursor on buttons
            document.querySelectorAll(".tool-entry").forEach(function(entry) {
                entry.style.cursor = "default";
            });

            document.querySelector("#background").style.display = "block";
            addRelPopup.style.display = "block";
            addRelPopup.classList.add("open-popup");
            const selectRelName = document.getElementById("rel-node-name");
            selectRelName.textContent = "";
            Graph.relationshipTypes.forEach( rtype => {
                const optionValue = document.createElement("option");
                optionValue.value = rtype;
                optionValue.textContent = rtype;
                selectRelName.appendChild(optionValue);
            });
        }
    });
});

/**
 * Handle link direction checkboxes
 *
 **/
document.querySelector("#outbound-link input").addEventListener("change", (e) => {
    let inboundCheckbox = document.querySelector("#inbound-link input");

    if (!e.target.checked) {
        inboundCheckbox.checked = true;
    }
});

document.querySelector("#inbound-link input").addEventListener("change", (e) => {
    let outboundCheckbox = document.querySelector("#outbound-link input");

    if (!e.target.checked) {
        outboundCheckbox.checked = true;
    }
});

/**
 * Check the relationship node validity
 *
 */
//document.querySelector("#relationship-name-field>input").addEventListener("keyup", (e) => {
//    let relNameField = e.target;
//    let popupError = document.querySelector("#relationship-name-field>.form-error-popup");
//    let submitBtn = document.querySelector("#add-node-rel-button");
//
//    const relName = e.target.value;
//    const validRelName = new RegExp('^[A-Za-z-_]*$');
//    if (!validRelName.test(relName)) {
//        popupError.style.display = "block";
//        relNameField.style.borderColor = "#FF0000";
//        submitBtn.disabled = true;
//    } else {
//        popupError.style.display = "none";
//        relNameField.style.borderColor = "#6E6C69";
//        submitBtn.disabled = false;
//        
//    }
//});


/**
 * Handle add node relationship button event
 *
 */
document.querySelector("#add-node-rel-button").addEventListener("click", (e) => {
    const relLabel = document.querySelector("#rel-node-name").value;
    const toNodeId = document.querySelector("#to-node-name").value;
    const isOutbound = document.querySelector("#outbound-link input[type='checkbox']").checked
    const isInbound = document.querySelector("#inbound-link input[type='checkbox']").checked

    let fromNodeLabel;
    let fromNodeType;

    browser.storage.local.get("indicator").then( (result) => {
        const indicator = result.indicator;
        fromNodeLabel = indicator.value;
        fromNodeType = indicator.type;
        return Graph.getInstance();
    }).then( (graph) => {
        //const [toNodeType, tld] = indicatorParser.getIndicatorType(toNodeId);
        //graph.addNode(toNodeId, toNodeType);
        const fromNodeIds = graph.getNodesByLabel(fromNodeLabel);
        for (const fromNodeId of fromNodeIds) {
            if (isOutbound) {
                graph.addLink(fromNodeId, toNodeId, relLabel);
            }
            if (isInbound) {
                graph.addLink(toNodeId, fromNodeId, relLabel);
            }
        }


        document.getElementById("add-relationship-popup").style.display = "none";
        document.querySelector("#background").style.display = "none";
        showMessagePopup("Relationship added to graph", MessageType.INFO);
    });
});

/**
 * Handle cancel button
 *
 */
document.querySelector("#add-node-rel-close-button").addEventListener("click", function(evt) {
    const relPopup = document.getElementById("add-relationship-popup");
    document.querySelector("#background").style.display = "none";
    relPopup.style.display = "none";
    relPopup.classList.remove("open-popup");
});

/**
 * Handle open graph page button click event
 */
document.querySelector("#open-graph").addEventListener("click", function(evt) {
    browser.tabs.create({
        url: '/src/graph/graph.html'
    });
});

