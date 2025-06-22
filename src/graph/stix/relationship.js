function createRelationshipForm(data, callback) {
    const formHandler = new FormHandler("Add Relationship", "img/relationship.png");
    submitEvent = evt => {
        Graph.getInstance().then( (graph) => {
            var stix = {}
            const fields = formHandler.getFields();

            for (const [id, field] of Object.entries(fields)) {
                stix[id] = field.value;
            }

            const label = fields["relationship_type"].value;
            const nodeFrom = fields["source_ref"].value;
            const nodeTo = fields["target_ref"].value;
            graph.addLink(nodeFrom, nodeTo, label);

            const isNoteRef = nodeFrom.startsWith("note--") && label === "refers-to";
            const isReportRef = nodeFrom.startsWith("report--") && label === "refers-to";
            const isNetworkTrafficRef = nodeTo.startsWith("network-traffic--") && 
                                        (nodeFrom.startsWith("ipv4-addr--") ||
                                        nodeFrom.startsWith("ipv6-addr--") ||
                                        nodeFrom.startsWith("mac-addr--") ||
                                        nodeFrom.startsWith("domain-name--")) &&
                                        (label === "source-of" || label === "destination-of");
            if (isNoteRef || isNetworkTrafficRef || isReportRef) {
                if (isNoteRef || isReportRef) {
                    const node = graph.getNode(nodeFrom);
                    if (!Object.keys(node['stix']).includes('object_refs')) {
                        node['stix']['object_refs'] = Array();
                    }
                    node['stix']['object_refs'].push(nodeTo);
                } else if (isNetworkTrafficRef && label === "source-of") {
                    const node = graph.getNode(nodeTo);
                    if (!Object.keys(node['stix']).includes('src_ref')) {
                        node['stix']['src_ref'] = Array();
                    }
                    node['stix']['src_ref'].push(nodeFrom);
                } else if (isNetworkTrafficRef && label === "destination-of") {
                    const node = graph.getNode(nodeTo);
                    if (!Object.keys(node['stix']).includes('dst_ref')) {
                        node['stix']['dst_ref'] = Array();
                    }
                    node['stix']['dst_ref'].push(nodeFrom);
                }
                graph.editSTIXNode(
                    node['id'],
                    node['label'],
                    node['type'],
                    node['stix']);
            }

            callback(data);
        });
    }
    formHandler.setSubmitEventListener(submitEvent);
    formHandler.addFormField("hidden", "source_ref", "source_ref", data.from, true);
    formHandler.addFormField("hidden", "target_ref", "target_ref", data.to, true);
    formHandler.addFormField("select", "Relationship Type", "relationship_type", "", true, Graph.relationshipTypes);
    document.querySelector("input.add-node-btn").value = "Add Relationship";
}

