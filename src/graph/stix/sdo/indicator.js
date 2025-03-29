function createIndicatorForm(evt, title, stix={}) {
    const action = Object.keys(stix).length == 0 ? "add" : "edit";

    const type = "indicator";
    const objectId = stix["id"] === undefined ? type+"--"+crypto.randomUUID() : stix["id"];

    const formHandler = new FormHandler(title, "img/indicator-noback-flat.png");
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
    formHandler.addMultipleInputField("Indicator Types", "indicator_types", vocabularies["indicator-type-ov"], false, stix["indicator_types"]);
    formHandler.addFormField("textarea", "Pattern", "pattern", stix["pattern"], true);
    formHandler.addFormField("select", "Pattern Type", "pattern_type", stix["pattern_type"], true, vocabularies["pattern-type-ov"]);
    formHandler.addFormField("text", "pattern_version", "pattern_version", stix["pattern_version"]);
    formHandler.addFormField("datetime-local", "Valid From", "valid_from", stix["valid_from"]);
    formHandler.addFormField("datetime-local", "Valid Until", "valid_until", stix["valid_until"]);
    formHandler.addSubForm("kill_chain_phases", createKillChainForm);
    if (Object.keys(stix).includes("kill_chain_phases")) {
        for (let killChainEntry of stix["kill_chain_phases"]) {
            FormHandler.addSubFormEntry("kill_chain_phases", killChainEntry["phase_name"], JSON.stringify(killChainEntry));
        }
    }

    document.querySelector("form #valid_from").addEventListener("change", evt => {
        document.querySelector("form #valid_until").min = evt.target.value;
    });
    document.querySelector("form #valid_until").addEventListener("change", evt => {
        document.querySelector("form #valid_from").max = evt.target.value;
    });

}

