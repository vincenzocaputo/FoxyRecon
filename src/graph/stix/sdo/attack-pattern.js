function createAttackPatternForm(evt, title, stix={}) {
    const action = Object.keys(stix).length == 0 ? "add" : "edit";

    const type = "attack-pattern";
    const objectId = stix["id"] === undefined ? type+"--"+crypto.randomUUID() : stix["id"];

    const formHandler = new FormHandler(title, "img/attack-pattern-noback-flat.png");
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
    formHandler.addMultipleInputField("Aliases", "aliases", [], false, stix["aliases"]);

    formHandler.addSubForm("kill_chain_phases", createKillChainForm);

    if (Object.keys(stix).includes("kill_chain_phases")) {
        for (let killChainEntry of stix["kill_chain_phases"]) {
            FormHandler.addSubFormEntry("kill_chain_phases", killChainEntry["phase_name"], JSON.stringify(killChainEntry));
        }
    }
    
    formHandler.addSubForm("external_references", createReferenceForm);

    if (Object.keys(stix).includes("external_references")) {
        for (let referenceEntry of stix["external_references"]) {
            FormHandler.addSubFormEntry("external_references", referenceEntry["source_name"], JSON.stringify(referenceEntry), editReferenceEntry);
        }
    }
}

