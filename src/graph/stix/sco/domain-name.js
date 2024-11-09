function createDomainNameForm(evt, title, stix={}) {
    const action = Object.keys(stix).length == 0 ? "add" : "edit";

    const type = "domain-name";
    const objectId = stix["id"] === undefined ? type+"--"+crypto.randomUUID() : stix["id"];

    const formHandler = new FormHandler(title, "img/domain-name-nb.png");
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
                    fields["value"].value,
                    type,
                    stix);
            });
        } else {
            Graph.getInstance().then( (graph) => {
                graph.editSTIXNode(
                    fields["id"].value,
                    fields["value"].value,
                    type,
                    stix);
            });
        }
    }
    formHandler.setSubmitEventListener(submitEvent);
    formHandler.addFormField("hidden", "Id", "id", objectId, true);
    formHandler.addFormField("hidden", "Type", "type", type, true);
    formHandler.addFormField("text", "Value", "value", stix["value"], true);
}

