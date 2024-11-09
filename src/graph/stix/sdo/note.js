function createNoteForm(evt, title, stix={}) {
    const action = Object.keys(stix).length == 0 ? "add" : "edit";

    const type = "note";
    const objectId = stix["id"] === undefined ? type+"--"+crypto.randomUUID() : stix["id"];

    Graph.getInstance().then( (graph) => {
        const nodes = graph.getNodes();
        var targetNodes = {};
        for (node of nodes) {
            targetNodes[node.label] = node.stix["id"];
        }

        const oldstix = stix;

        const formHandler = new FormHandler(title, "img/note-nb.png");
        submitEvent = evt => {
            var stix = {}
            const fields = formHandler.getFields();

            for (const [id, field] of Object.entries(fields)) {
                if (field.value === undefined || field.value === "" || field.value.length === 0) {
                    continue;
                } else if (id === "object_refs") {
                    stix[id] = Array();
                    for (const ref of field.value) {
                        stix[id].push(targetNodes[ref]);
                    }
                } else {
                    stix[id] = field.value;
                }
            }
            // Add relationship
            for (entry of oldstix["object_refs"] || []) {
                if (!(stix["object_refs"] || []).includes(entry)) {
                    graph.deleteLink(fields["id"].value, entry, "refers-to");
                }
            }
            for (entry of fields["object_refs"].value) {
                graph.addLink(fields["id"].value, targetNodes[entry], "refers-to");
            }
            
            if (action === "add") {
                Graph.getInstance().then( (graph) => {
                    graph.addSTIXNode(
                        fields["id"].value,
                        fields["type"].value,
                        type,
                        stix);
                });
            } else {
                Graph.getInstance().then( (graph) => {
                    graph.editSTIXNode(
                        fields["id"].value,
                        fields["type"].value,
                        type,
                        stix);
                });
            }
        }
        formHandler.setSubmitEventListener(submitEvent);
        formHandler.addFormField("hidden", "Id", "id", objectId, true);
        formHandler.addFormField("hidden", "Type", "type", type, true);
        formHandler.addFormField("text", "Abstract", "abstract", stix["abstract"]);
        formHandler.addFormField("textarea", "Content", "content", stix["content"], true);
        formHandler.addMultipleInputField("Authors", "authors", [], false, stix["authors"]);
        formHandler.addFormField("datetime-local", "Publish Date", "published", stix["published"]);
        
        let objectRefLabels = Array();
        for (const ref of stix["object_refs"] || []) {
            objectRefLabels.push(graph.getNode(ref).label);
        }
        formHandler.addMultipleInputField("Objects", "object_refs", Object.keys(targetNodes), false, objectRefLabels);
        if (Object.keys(targetNodes).length === 0) {
            document.querySelector("form #objects input").setAttribute("disabled", true);
            document.querySelector("form #objects input").setAttribute("title", "There are no objects in the graph.");
        }
    });

}

