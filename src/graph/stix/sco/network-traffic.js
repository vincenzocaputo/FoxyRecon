function createNetworkTrafficForm(evt, title, stix={}) {
    const action = Object.keys(stix).length == 0 ? "add" : "edit";

    const type = "network-traffic";
    const objectId = stix["id"] === undefined ? type+"--"+crypto.randomUUID() : stix["id"];

    // Necessary nodes for 'ref' properties
    const nodes = graph.graph.nodes;
    var targetNodes = {};
    for (node of nodes) {
        if (node.stix["type"] === "ipv4-addr" ||
            node.stix["type"] === "ipv6-addr" ||
            node.stix["type"] === "mac-addr" ||
            node.stix["domain"] === "domain-name") {
            targetNodes[node.label] = node.stix["id"];
        }
    }
    const formHandler = new FormHandler(title, "img/network-traffic-nb.png");
    submitEvent = evt => {
        var stix = {}
        const fields = formHandler.getFields();

        for (const [id, field] of Object.entries(fields)) {
            if (field.value === undefined || field.value === "" || field.value.length === 0) {
                continue;
            } else {
                // Handle checkbox
                if (id === "is_active") {
                    if (field.value === "Yes") {
                        stix[id] = true;
                    } else if (field.value === "No") {
                        stix[id] = false;
                    }
                } else {
                    stix[id] = field.value;
                }
            }

            // Add relationship
            if (id === "src_ref") {
                for (entry of field.value) {
                    graph.addRelationship(targetNodes[entry], fields["id"].value, "source-of");
                }
            }
            if (id === "dst_ref") {
                for (entry of field.value) {
                    graph.addRelationship(fields["id"].value, targetNodes[entry], "destination-of");
                }
            }
        }
        if (action === "add") {
            graph.addSTIXNode(
                fields["id"].value,
                type,
                type,
                stix);
        } else {
            graph.editSTIXNode(
                fields["id"].value,
                type,
                type,
                stix);
        }


    }
    formHandler.setSubmitEventListener(submitEvent);
    formHandler.addFormField("hidden", "Id", "id", objectId, true);
    formHandler.addFormField("hidden", "Type", "type", type, true);
    formHandler.addFormField("datetime-local", "Start", "start", stix["start"]);
    formHandler.addFormField("datetime-local", "End", "end", stix["end"]);
    formHandler.addFormField("select", "Is Active", "is_active", stix["is_active"] ? "Yes": "No", false, ["Yes", "No"]);
    formHandler.addMultipleInputField("Source", "src_ref", Object.keys(targetNodes), false, stix["src_ref"]);

    formHandler.addMultipleInputField("Destination", "dst_ref", Object.keys(targetNodes), false, stix["dst_ref"]);
    
    if (Object.keys(targetNodes).length === 0) {
        document.querySelectorAll("form #src_ref input, #dst_ref input").forEach( inpt => {
            inpt.setAttribute("disabled", true);
            inpt.setAttribute("title", "There are no IP addresses, MAC addresses or domains in the graph.");
        });
    }

    formHandler.addFormField("integer", "Source Port", "src_port", stix["src_port"]);
    document.querySelector("form #src_port,#dst_port").setAttribute("min", "1");
    document.querySelector("form #src_port,#dst_port").setAttribute("max", "65535");
    formHandler.addMultipleInputField("Protocols", "protocols", [], false, stix["protocols"]);
    formHandler.addFormField("integer", "Source bytes count", "src_byte_count", stix["src_byte_count"]);
    formHandler.addFormField("integer", "Destination bytes count", "dst_byte_count", stix["dst_byte_count"]);
    document.querySelector("form #src_byte_count,#dst_byte_count").setAttribute("min", "1");
    formHandler.addFormField("integer", "Source Packets count", "src_packets", stix["src_packets"]);
    formHandler.addFormField("integer", "Destination Packets count", "dst_packets", stix["dst_packets"]);
    document.querySelector("form #src_packets,#dst_packets").setAttribute("min", "1");

}

