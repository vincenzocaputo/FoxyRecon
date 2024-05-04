function createReportForm(evt, title, stix={}) {
    const action = Object.keys(stix).length == 0 ? "add" : "edit";

    const type = "report";
    const objectId = stix["id"] === undefined ? type+"--"+crypto.randomUUID() : stix["id"];

    const nodes = graph.graph.nodes;
    var targetNodes = {};
    for (node of nodes) {
        targetNodes[node.label] = node.stix["id"];
    }

    const formHandler = new FormHandler(title, "img/report-nb.png");
    submitEvent = evt => {
        var stix = {}
        const fields = formHandler.getFields();

        for (const [id, field] of Object.entries(fields)) {
            if (field.value === undefined || field.value === "" || field.value.length === 0) {
                continue;
            } else {
                stix[id] = field.value;
            }

            // Add relationship
            if (id === "object_refs") {
                for (entry of field.value) {
                    graph.addRelationship(targetNodes[entry], fields["id"].value, "refers-to");
                }
            }

        }
        
        if (action === "add") {
            graph.addSTIXNode(
                fields["id"].value,
                fields["name"].value,
                type,
                stix);
        } else {
            graph.editSTIXNode(
                fields["id"].value,
                fields["name"].value,
                type,
                stix);
        }
    }
    formHandler.setSubmitEventListener(submitEvent);
    formHandler.addFormField("hidden", "Id", "id", objectId, true);
    formHandler.addFormField("hidden", "Type", "type", type, true);
    formHandler.addFormField("text", "Name", "name", stix["name"], true);
    formHandler.addFormField("textarea", "Description", "description", stix["description"]);
    formHandler.addMultipleInputField("Report Types", "report_types", vocabularies["report-type-ov"], false, stix["report_types"]);
    formHandler.addFormField("datetime-local", "Publish Date", "published", stix["published"]);
    formHandler.addMultipleInputField("Objects", "object_refs", Object.keys(targetNodes), false, stix["object_refs"]);
    if (Object.keys(targetNodes).length === 0) {
        document.querySelector("form #objects input").setAttribute("disabled", true);
        document.querySelector("form #objects input").setAttribute("title", "There are no objects in the graph.");
    }

}

