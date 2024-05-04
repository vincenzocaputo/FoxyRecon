function createInfrastructureForm(evt, title, stix={}) {
    const action = Object.keys(stix).length == 0 ? "add" : "edit";

    const type = "Infrastructure";
    const objectId = stix["id"] === undefined ? type+"--"+crypto.randomUUID() : stix["id"];

    const formHandler = new FormHandler(title, "img/infrastructure-nb.png");
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
    formHandler.addMultipleInputField("Infrastructure Types", "infrastructure_types", vocabularies["infrastructure-type-ov"], false, stix["infrastructure_types"]);
    formHandler.addMultipleInputField("Aliases", "aliases", [], false, stix["aliases"]);
    formHandler.addSubForm("kill_chain_phases", createKillChainForm, stix["kill_chain_phases"]);
    formHandler.addFormField("datetime-local", "First Seen", "first_seen", stix["first_seen"]);
    formHandler.addFormField("datetime-local", "Last Seen", "last_seen", stix["last_seen"]);

    document.querySelector("form #first_seen").addEventListener("change", evt => {
        document.querySelector("form #last_seen").min = evt.target.value;
    });
    document.querySelector("form #last_seen").addEventListener("change", evt => {
        document.querySelector("form #first_seen").max = evt.target.value;
    });

}

