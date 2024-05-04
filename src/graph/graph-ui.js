const addSDOButton = document.getElementById("add-sdo-button");
const addSDOOptions = document.getElementById("add-sdo-options");
const addLinkButton = document.getElementById("add-link-button");
const deleteGraphButton = document.getElementById("delete-graph-button");
const deleteNodeButton = document.getElementById("delete-node-button");
const filterInputField = document.getElementById("filter-input-field");
const filterButton = document.getElementById("filter-button");
const editButton = document.getElementById("edit-node-button");


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
    const mouseMessage = document.createElement("div");
    mouseMessage.textContent = "Select a node";
    mouseMessage.id = "mouse-message";
    document.body.appendChild(mouseMessage);
    document.getElementById("delete-node-button").style.display = "none";
    document.getElementById("edit-node-button").style.display = "none";
    document.getElementById("add-link-button").style.display = "none";
});

document.addEventListener("mousemove", e => {
    if (addingLinkSwitch) {
        document.body.style.cursor = "pointer";
        const mouseMessage = document.getElementById("mouse-message");
        mouseMessage.style.top = e.pageY +10+"px";
        mouseMessage.style.left = e.pageX + 10+"px";
    }
});


deleteGraphButton.addEventListener("click", evt => {
    if (confirm("Are you sure to delete this graph?") == true) {
        graph.deleteGraph();
        location.reload();
    }
});

deleteNodeButton.addEventListener("click", evt => {
    if (confirm("Are you sure to delete this node?") == true) {
        console.log(lastSelectedNode);
        graph.deleteNode(lastSelectedNode.id);
        location.reload();
    }
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


