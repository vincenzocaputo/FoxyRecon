const addSDOButton = document.getElementById("add-sdo-button");
const addSDOOptions = document.getElementById("add-sdo-options");
const addLinkButton = document.getElementById("add-link-button");
const deleteGraphButton = document.getElementById("delete-graph-button");
const deleteNodeButton = document.getElementById("delete-node-button");
const deleteEdgeButton = document.getElementById("delete-link-button");
const addLinkCancelButton = document.getElementById("addlink-cancel-button");
const filterInputField = document.getElementById("filter-input-field");
const filterButton = document.getElementById("filter-button");
const editButton = document.getElementById("edit-node-button");
const exportButton = document.getElementById("export-graph-button");


repulsionSlider.addEventListener("change", (evt) => {
    options.physics.barnesHut.gravitationalConstant = -parseInt(repulsionSlider.value)*1000;
    network.setOptions(options);
});
springLengthSlider.addEventListener("change", (evt) => {
    options.physics.barnesHut.springLength = parseInt(springLengthSlider.value);
    network.setOptions(options);
});
nodeSizeSlider.addEventListener("change", (evt) => {
    options.nodes.size = parseInt(nodeSizeSlider.value);
    network.setOptions(options);
});
edgeSizeSlider.addEventListener("change", (evt) => {
    options.edges.width = parseInt(edgeSizeSlider.value);
    network.setOptions(options);
});
edgeColorSelect.addEventListener("change", (evt) => {
    options.edges.color.color = edgeColorSelect.value;
    network.setOptions(options);
});

addSDOButton.addEventListener("mouseenter", (evt) => {
    addSDOOptions.style.display = "block";
});

addSDOButton.addEventListener("mouseleave", (evt) => {
    if (!addSDOOptions.contains(evt.relatedTarget)) {
        addSDOOptions.style.display = "none";
    }
});

addSDOOptions.addEventListener("mouseleave", (evt) => {
    if (!addSDOButton.contains(evt.relatedTarget)) {
        addSDOOptions.style.display = "none";
    }
});

const addSCOButton = document.getElementById("add-sco-button");
const addSCOOptions = document.getElementById("add-sco-options");

addSCOButton.addEventListener("mouseenter", (evt) => {
    addSCOOptions.style.display = "block";
});

addSCOButton.addEventListener("mouseleave", (evt) => {
    if (!addSCOOptions.contains(evt.relatedTarget)) {
        addSCOOptions.style.display = "none";
    }
});

addSCOOptions.addEventListener("mouseleave", (evt) => {
    if (!addSCOButton.contains(evt.relatedTarget)) {
        addSCOOptions.style.display = "none";
    }
});


var addingLinkSwitch = false;

addLinkButton.addEventListener("click", evt => {
    addingLinkSwitch = true;
    document.getElementById("add-link-message").style.visibility = "visible";
    addLinkCancelButton.style.display = "block";
    addSDOButton.style.display = "none";
    addSCOButton.style.display = "none";
    addLinkButton.style.display = "none";
    deleteGraphButton.style.display = "none";
    network.addEdgeMode();
});

addLinkCancelButton.addEventListener("click", evt => {
    addingLinkSwitch = false;
    document.getElementById("add-link-message").style.visibility = "hidden";
    addLinkCancelButton.style.display = "none";
    addSDOButton.style.display = "block";
    addSCOButton.style.display = "block";
    addLinkButton.style.display = "block";
    deleteGraphButton.style.display = "block";
    network.disableEditMode();
});


deleteGraphButton.addEventListener("click", evt => {
    if (confirm("Are you sure to delete this graph?") == true) {
        graph.deleteGraph();
        location.reload();
    }
});

deleteNodeButton.addEventListener("click", evt => {
    if (confirm("Are you sure to delete this node?") == true) {
        graph.deleteNode(lastSelectedNode.id);
        location.reload();
    }
});

deleteEdgeButton.addEventListener("click", evt => {
    if (confirm("Are you sure to delete this edge?") == true) {
        const selectedEdgeId = network.getSelectedEdges()[0];
        const edge = edges.get(selectedEdgeId);
        graph.deleteLink(edge.from, edge.to, edge.label);

        if ((edge.from.startsWith("note--") || edge.from.startsWith("report--")) 
            && edge.label === "refers-to") {
            const node = graph.getNode(edge.from);
            const index = node['stix']['object_refs'].indexOf(edge.to);
            if (index > -1) {
                node['stix']['object_refs'].splice(index, 1);
            }
            graph.editSTIXNode(
                node['id'],
                node['label'],
                node['type'],
                node['stix']);

        } else if (edge.to.startsWith("network-traffic--") && 
                    (edge.from.startsWith("ipv4-addr--") ||
                    edge.from.startsWith("ipv6-addr--") ||
                    edge.from.startsWith("mac-addr--") ||
                    edge.from.startsWith("domain-name--")) &&
                    edge.label === "source-of") {
            const node = graph.getNode(edge.to);
            const index = node['stix']['src_ref'].indexOf(edge.from);
            if (index > -1) {
                node['stix']['src_ref'].splice(index, 1);
            }
            graph.editSTIXNode(
                node['id'],
                node['label'],
                node['type'],
                node['stix']);
        } else if (edge.to.startsWith("network-traffic--") && 
                    (edge.from.startsWith("ipv4-addr--") ||
                    edge.from.startsWith("ipv6-addr--") ||
                    edge.from.startsWith("mac-addr--") ||
                    edge.from.startsWith("domain-name--")) &&
                    edge.label === "destination-of") {
            const node = graph.getNode(edge.to);
            const index = node['stix']['dst_ref'].indexOf(edge.from);
            if (index > -1) {
                node['stix']['dst_ref'].splice(index, 1);
            }
            graph.editSTIXNode(
                node['id'],
                node['label'],
                node['type'],
                node['stix']);
        }
                           
                    
        location.reload();
    }
});

exportButton.addEventListener("click", evt => {
    const bundleJson = graph.getBundle();
    const link = document.createElement('a');

    const blob = new Blob([bundleJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = "graph.json";

    // Append the link to the body
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    link.remove();
});

filterButton.addEventListener("click", evt => {
    nodeFilterValue = filterInputField.value;
    nodesView.refresh();
});

editButton.addEventListener("click", evt => {
    const selectedNode = lastSelectedNode;
    const selectedNodeId = selectedNode.id;
    const selectedNodeSTIX = JSON.parse(selectedNode.stix);
    const selectedNodeType = selectedNodeSTIX['type'];
    

    switch(selectedNodeType) {
        case "attack-pattern": {
            createAttackPatternForm(evt, "Edit Attack Pattern", selectedNodeSTIX);
            break;
        } case "campaign": {
            createCampaignForm(evt, "Edit Campaign", selectedNodeSTIX);
            break;
        } case "course-of-action": {
            createCourseOfActionForm(evt, "Edit Course of Action", selectedNodeSTIX);
            break;
        } case "identity": {
            createIdentityForm(evt, "Edit Identity", selectedNodeSTIX);
            break;
        } case "indicator": {
            createIndicatorForm(evt, "Edit Indicator", selectedNodeSTIX);
            break;
        } case "infrastructure": {
            createInfrastructureForm(evt, "Edit Infrastructure", selectedNodeSTIX);
            break;
        } case "intrusion-set": {
            createIntrusionSetForm(evt, "Edit Intrusion Set", selectedNodeSTIX);
            break;
        } case "location": {
            createLocationForm(evt, "Edit Location", selectedNodeSTIX);
            break;
        } case "malware-analysis": {
            createIntrusionSetForm(evt, "Edit Malware Analysis", selectedNodeSTIX);
            break;
        } case "malware": {
            createMalwareForm(evt, "Edit Malware", selectedNodeSTIX);
            break;
        } case "note": {
            createNoteForm(evt, "Edit Note", selectedNodeSTIX);
            break;
        } case "threat-actor": {
            createThreatActorForm(evt, "Edit Threat Actor", selectedNodeSTIX);
            break;
        } case "tool": {
            createToolForm(evt, "Edit Tool", selectedNodeSTIX);
            break;
        } case "report": {
            createReportForm(evt, "Edit Report", selectedNodeSTIX);
            break;
        } case "vulnerability": {
            createVulnerabilityForm(evt, "Edit Vulnerability", selectedNodeSTIX);
            break;
        } case "autonomous-system": {
            createAutonomousSystemForm(evt, "Edit Autonomous System", selectedNodeSTIX);
            break;
        } case "domain-name": {
            createDomainNameForm(evt, "Edit Domain Name", selectedNodeSTIX);
            break;
        } case "email-address": {
            createEmailAddressForm(evt, "Edit Email Address", selectedNodeSTIX);
            break;
        } case "email-address": {
            createEmailAddressForm(evt, "Edit Email Address", selectedNodeSTIX);
            break;
        } case "ipv4-addr": {
            createIPV4AddrForm(evt, "Edit IPv4 Address", selectedNodeSTIX);
            break;
        } case "ipv6-addr": {
            createIPV6AddrForm(evt, "Edit IPv6 Address", selectedNodeSTIX);
            break;
        } case "mac-addr": {
            createMacAddressForm(evt, "Edit MAC Address", selectedNodeSTIX);
            break;
        } case "network-traffic": {
            createNetworkTrafficForm(evt, "Edit Network Traffic", selectedNodeSTIX);
            break;
        } case "software": {
            createSoftwareForm(evt, "Edit Software", selectedNodeSTIX);
            break;
        } case "url": {
            createURLForm(evt, "Edit URL", selectedNodeSTIX);
            break;
        } case "user-account": {
            createUserAccountForm(evt, "Edit User Account", selectedNodeSTIX);
            break;
        }
    }
    document.querySelector("form input[type=submit]").value = "Edit Node";

});

document.querySelectorAll(".options div").forEach( (element) => {
    element.addEventListener("click", evt => {
        const newNodeType = element.classList[0];

        switch(newNodeType) {
            case "attack-pattern": {
                createAttackPatternForm(evt, "Add Attack Pattern");
                break;
            } case "campaign": {
                createCampaignForm(evt, "Add Campaign");
                break;
            } case "course-of-action": {
                createCourseOfActionForm(evt, "Add Course of Action");
                break;
            } case "identity": {
                createIdentityForm(evt, "Add Identity");
                break;
            } case "indicator": {
                createIndicatorForm(evt, "Add Indicator");
                break;
            } case "infrastructure": {
                createInfrastructureForm(evt, "Add Infrastructure");
                break;
            } case "intrusion-set": {
                createIntrusionSetForm(evt, "Add Intrusion Set");
                break;
            } case "location": {
                createLocationForm(evt, "Add Location");
                break;
            } case "malware-analysis": {
                createIntrusionSetForm(evt, "Add Malware Analysis");
                break;
            } case "malware": {
                createMalwareForm(evt, "Add Malware");
                break;
            } case "note": {
                createNoteForm(evt, "Add Note");
                break;
            } case "report": {
                createReportForm(evt, "Add Report");
                break;
            } case "threat-actor": {
                createThreatActorForm(evt, "Add Threat Actor");
                break;
            } case "tool": {
                createToolForm(evt, "Add Tool");
                break;
            } case "vulnerability": {
                createVulnerabilityForm(evt, "Add Vulnerability");
                break;
            } case "autonomous-system": {
                createAutonomousSystemForm(evt, "Add Autonomous System");
                break;
            } case "domain-name": {
                createDomainNameForm(evt, "Add Domain Name");
                break;
            } case "email-address": {
                createEmailAddressForm(evt, "Add Email Address");
                break;
            } case "email-address": {
                createEmailAddressForm(evt, "Add Email Address");
                break;
            } case "ipv4-addr": {
                createIPV4AddrForm(evt, "Add IPv4 Address");
                break;
            } case "ipv6-addr": {
                createIPV6AddrForm(evt, "Add IPv6 Address");
                break;
            } case "mac-addr": {
                createMacAddressForm(evt, "Add MAC Address");
                break;
            } case "network-traffic": {
                createNetworkTrafficForm(evt, "Add Network Traffic");
                break;
            } case "software": {
                createSoftwareForm(evt, "Add Software");
                break;
            } case "url": {
                createURLForm(evt, "Add URL");
                break;
            } case "user-account": {
                createUserAccountForm(evt, "Add User Account");
                break;
            }
        }
    });

});


