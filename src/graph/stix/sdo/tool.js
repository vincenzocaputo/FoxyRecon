function createToolForm(evt, title, stix={}) {
    const action = Object.keys(stix).length == 0 ? "add" : "edit";

    const type = "tool";
    const objectId = stix["id"] === undefined ? type+"--"+crypto.randomUUID() : stix["id"];

    const formHandler = new FormHandler(title, "img/tool-nb.png");
    submitEvent = evt => {
        var stix = {}
        const fields = formHandler.getFields();

        for (const [id, field] of Object.entries(fields)) {
            if (field.value === undefined || field.value === "" || field.value.length === 0) {
                continue;
            } else {
                stix[id] = field.value;
            }
        }
        
        if (action === "add") {
            Graph.getInstance().then( (graph) => {
                graph.addSTIXNode(
                    fields["id"].value,
                    fields["name"].value,
                    type,
                    stix);
            });
        } else {
            Graph.getInstance().then( (graph) => {
                graph.editSTIXNode(
                    fields["id"].value,
                    fields["name"].value,
                    type,
                    stix);
            });
        }

    }
    formHandler.setSubmitEventListener(submitEvent);
    formHandler.addFormField("hidden", "Id", "id", objectId, true);
    formHandler.addFormField("hidden", "Type", "type", type, true);
    formHandler.addFormField("text", "Name", "name", stix["name"], true);
    formHandler.addFormField("textarea", "Description", "description", stix["description"]);
    formHandler.addMultipleInputField("Tool Types", "tool_types", vocabularies["tool-type-ov"], false, stix["tool_types"]);
    formHandler.addMultipleInputField("Aliases", "aliases", stix["aliases"]);
    formHandler.addSubForm("kill_chain_phases", createKillChainForm);
    if (Object.keys(stix).includes("kill_chain_phases")) {
        for (let killChainEntry of stix["kill_chain_phases"]) {
            FormHandler.addSubFormEntry("kill_chain_phases", killChainEntry["phase_name"], JSON.stringify(killChainEntry));
        }
    }

    formHandler.addFormField("text", "Tool Version", "tool_version", stix["tool_version"]);
}

