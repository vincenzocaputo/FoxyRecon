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
const investigateButton = document.getElementById("investigate-button");
const importButton = document.getElementById("import-graph-button");

const resetButton = document.getElementById("reset-button");

function createUploadPopup(changeEvent, uploadEvent) {
    var buttonsContainer;
    var form;
    const outsideBackground = document.createElement("div");
    outsideBackground.setAttribute("id", "background");
    document.querySelector("#page-container").appendChild(outsideBackground);
    const popupContainer = document.createElement("div");
    const formContainer = document.createElement("div");

    const formHeader = document.createElement("div");
    formHeader.classList.add("form-header");

    const formIconEl = document.createElement("img");
    formIconEl.setAttribute("src", "../../assets/icons/import-2.png");

    const formTitleEl = document.createElement("div");
    formTitleEl.textContent = "Import graph";

    formHeader.appendChild(formIconEl);
    formHeader.appendChild(formTitleEl);
    popupContainer.appendChild(formHeader);

    buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("buttons-container");
    
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.classList.add("btn");
    cancelButton.classList.add("cancel-btn");
    cancelButton.addEventListener("click", evt => {
        resetPage();
        evt.target.closest(".popup-container").remove();
    });

    const okButton = document.createElement("input");
    okButton.setAttribute("type", "submit");
    okButton.setAttribute("value", "Import");
    okButton.classList.add("btn");
    okButton.classList.add("add-node-btn");


    form = document.createElement("form");
    form.classList.add("upload-form");
    buttonsContainer.appendChild(cancelButton);
    buttonsContainer.appendChild(okButton);
    form.setAttribute("method", "post");

    popupContainer.classList.add("popup-container");
    formContainer.classList.add("upload-form-container");

    form.appendChild(formContainer);
    form.appendChild(buttonsContainer);
    form.addEventListener("submit", uploadEvent);
    popupContainer.appendChild(form);

    document.getElementById("page-container").appendChild(popupContainer);

    const uploadLabelElement = document.createElement("label");
    uploadLabelElement.setAttribute("for", "upload");
    uploadLabelElement.textContent = "Upload a STIX file";

    var uploadInput = document.createElement("input");
    uploadInput.setAttribute("type", "file");
    uploadInput.setAttribute("id", "upload-input");
    uploadInput.setAttribute("name", "upload");
    uploadInput.setAttribute("accept", "application/json");
    uploadInput.setAttribute("required", "");
    uploadInput.addEventListener("change", changeEvent);

    form.insertBefore(uploadInput, buttonsContainer);
    form.insertBefore(uploadLabelElement, uploadInput);
}

themeSelect.addEventListener("change", (evt) => {
    renderGraph();
    chrome.storage.local.get("graphSettings").then( (result) => {
        var settings = result.graphSettings;
        settings.icontheme = themeSelect.value;
        chrome.storage.local.set({"graphSettings": settings});
    });
});

repulsionSlider.addEventListener("change", (evt) => {
    options.physics.barnesHut.gravitationalConstant = -parseInt(repulsionSlider.value)*1000;
    network.setOptions(options);
    chrome.storage.local.get("graphSettings").then( (result) => {
        var settings = result.graphSettings;
        settings.repulsion = repulsionSlider.value;
        chrome.storage.local.set({"graphSettings": settings});
    });
});
springLengthSlider.addEventListener("change", (evt) => {
    options.physics.barnesHut.springLength = parseInt(springLengthSlider.value);
    network.setOptions(options);
    chrome.storage.local.get("graphSettings").then( (result) => {
        var settings = result.graphSettings;
        settings.edgelength = springLengthSlider.value;
        chrome.storage.local.set({"graphSettings": settings});
    });
});
nodeSizeSlider.addEventListener("change", (evt) => {
    options.nodes.size = parseInt(nodeSizeSlider.value);
    network.setOptions(options);
    chrome.storage.local.get("graphSettings").then( (result) => {
        var settings = result.graphSettings;
        settings.nodesize = nodeSizeSlider.value;
        chrome.storage.local.set({"graphSettings": settings});
    });
});
labelSizeSlider.addEventListener("change", (evt) => {
    options.nodes.font.size = parseInt(labelSizeSlider.value);
    options.edges.font.size = parseInt(labelSizeSlider.value);
    network.setOptions(options);
    chrome.storage.local.get("graphSettings").then( (result) => {
        var settings = result.graphSettings;
        settings.labelsize = labelSizeSlider.value;
        chrome.storage.local.set({"graphSettings": settings});
    });
});
edgeSizeSlider.addEventListener("change", (evt) => {
    options.edges.width = parseInt(edgeSizeSlider.value);
    network.setOptions(options);
    chrome.storage.local.get("graphSettings").then( (result) => {
        var settings = result.graphSettings;
        settings.edgesize = edgeSizeSlider.value;
        chrome.storage.local.set({"graphSettings": settings});
    });
});
edgeColorSelect.addEventListener("change", (evt) => {
    options.edges.color.color = edgeColorSelect.value;
    network.setOptions(options);
    chrome.storage.local.get("graphSettings").then( (result) => {
        var settings = result.graphSettings;
        settings.edgecolor = edgeColorSelect.value;
        chrome.storage.local.set({"graphSettings": settings});
    });
});

labelColorSelect.addEventListener("change", (evt) => {
    options.nodes.font.color = labelColorSelect.value;
    network.setOptions(options);
    chrome.storage.local.get("graphSettings").then( (result) => {
        var settings = result.graphSettings;
        settings.nodelabelcolor = labelColorSelect.value;
        chrome.storage.local.set({"graphSettings": settings});
    });
});

resetButton.addEventListener("click", (evt) => {
    const defaultGraphSettings = {
        icontheme: "square-lite",
        repulsion: 50,
        edgelength: 50,
        nodesize: 15,
        edgesize: 1,
        labelsize: 14,
        edgecolor: "#444444",
        nodelabelcolor: "#444444"
    }
    chrome.storage.local.set({"graphSettings": defaultGraphSettings}).then( () => {
        window.location.reload();
    });
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
    investigateButton.style.display = "none";
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
    investigateButton.style.display = "none";
    network.disableEditMode();
});


deleteGraphButton.addEventListener("click", evt => {
    if (confirm("Are you sure to delete this graph?") == true) {
        Graph.getInstance().then( (graph) => {
            graph.deleteGraph();
            location.reload();
        });
    }
});

deleteNodeButton.addEventListener("click", evt => {
    if (confirm("Are you sure to delete this node?") == true) {
        Graph.getInstance().then( (graph) => {
            graph.deleteNode(lastSelectedNode.id);
            location.reload();
        });
    }
});

deleteEdgeButton.addEventListener("click", evt => {
    if (confirm("Are you sure to delete this edge?") == true) {
        Graph.getInstance().then( (graph) => {
            const selectedEdgeId = network.getSelectedEdges()[0];
            const edge = edges.get(selectedEdgeId);
            graph.deleteLink(edge.from, edge.to, edge.label);

            if ((edge.from.startsWith("note--") || edge.from.startsWith("report--")) 
                && edge.label === "refers-to") {
                const node = Graph.getNode(edge.from);
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
                const node = Graph.getNode(edge.to);
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
                const node = Graph.getNode(edge.to);
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
        });
    }
});

exportButton.addEventListener("click", evt => {
    Graph.getInstance().then( (graph) => {
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
});

function getObjLabelByType(obj, type) {
    switch (type) {
        case "autonomous-system":
            return "AS"+obj["number"];
        case "domain-name":
            return obj["value"];
        case "email-address":
            return obj["value"];
        case "file":
            return obj["name"] === "" ? obj["id"] : obj["name"];
        case "ipv4-addr":
            return obj["value"];
        case "ipv6-addr":
            return obj["value"];
        case "mac-addr":
            return obj["value"];
        case "network-traffic":
            return type;
        case "software":
            return obj["name"];
        case "url":
            return obj["value"];
        case "user-account":
            return type;
        case "attack-pattern":
            return obj["name"];
        case "campaign":
            return obj["name"];
        case "course-of-action":
            return obj["name"];
        case "identity":
            return obj["name"];
        case "indicator":
            return obj["name"];
        case "infrastructure":
            return obj["name"];
        case "intrusion-set":
            return obj["name"];
        case "location":
            return obj["name"];
        case "malware-analysis":
            return type;
        case "malware":
            return obj["name"];
        case "note":
            return type;
        case "report":
            return obj["name"];
        case "threat-actor":
            return obj["name"];
        case "tool":
            return obj["name"];
        case "vulnerability":
            return obj["name"];
    }
    return false;
}

importButton.addEventListener("click", evt => {
    var promise;
    createUploadPopup((e) => {
        const file = e.target.files.item(0);
        promise = file.text().then( ( content) => {
            try {
                return JSON.parse(content);
            } catch(exception) {
                return Promise.resolve(exception);
            }
        }); 
    }, (evt) => {
        evt.preventDefault();
        promise.then((stixBundle) => {
            if (stixBundle instanceof Error) {
                alert("Invalid JSON file submitted: "+stixBundle.message);
            } else {
                if (stixBundle.hasOwnProperty("objects")) {
                    Graph.getInstance().then( (graph) => {
                        graph.deleteGraph();
                        const objects = stixBundle["objects"];

                        alert(objects);
                        for (const obj of objects) {
                            if (!obj.hasOwnProperty("id")) {
                                alert("Invalid STIX: Object ID is missing.");
                            }
                            if (!obj.hasOwnProperty("type")) {
                                alert("Invalid STIX: Object type is missing.");
                            }
                            const id = obj["id"];
                            const type = obj["type"];
                            if (type === "relationship") {
                                graph.addLink(
                                    obj["source_ref"],
                                    obj["target_ref"],
                                    obj["relationship_type"]
                                );
                            }
                            else {
                                const label = getObjLabelByType(obj, type);
                                if (label === false) {
                                    console.log(`Unsupported object {type}`);
                                } else {
                                    graph.addSTIXNode(
                                        id,
                                        label,
                                        type,
                                        obj
                                    )
                                }
                            }
                        }
                        window.location.reload();
                    });
                }
            }
        })
    });
});

investigateButton.addEventListener("click", (evt) => {
    const indicator = investigateButton.getAttribute("indicator"); 
    indicatorParser = new IndicatorParser();
    [type, tld] = indicatorParser.getIndicatorType(indicator);
    chrome.action.openPopup()
    .then( () => {
        chrome.storage.local.set({
            "indicator": {
                "type": type,
                "value": indicator,
                "tld": tld
            }
        })
    });

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
            createMalwareAnalysisForm(evt, "Edit Malware Analysis", selectedNodeSTIX);
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
        } case "file": {
            createFileForm(evt, "Edit File", selectedNodeSTIX);
            break;
        } case "ipv4-addr": {
            createIPV4AddrForm(evt, "Edit IPv4 Address", selectedNodeSTIX);
            break;
        } case "ipv6-addr": {
            createIPV6AddrForm(evt, "Edit IPv6 Address", selectedNodeSTIX);
            break;
        } case "mac-addr": {
            createMacAddrForm(evt, "Edit MAC Address", selectedNodeSTIX);
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
                createMalwareAnalysisForm(evt, "Add Malware Analysis");
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
            } case "file": {
                createFileForm(evt, "Add File");
                break;
            } case "ipv4-addr": {
                createIPV4AddrForm(evt, "Add IPv4 Address");
                break;
            } case "ipv6-addr": {
                createIPV6AddrForm(evt, "Add IPv6 Address");
                break;
            } case "mac-addr": {
                createMacAddrForm(evt, "Add MAC Address");
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


