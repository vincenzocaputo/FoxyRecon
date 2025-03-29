function createIdentityForm(evt, title, stix={}) {
    const action = Object.keys(stix).length == 0 ? "add" : "edit";

    const type = "identity";
    const objectId = stix["id"] === undefined ? type+"--"+crypto.randomUUID() : stix["id"];

    const formHandler = new FormHandler(title, "img/identity-noback-flat.png");
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
                graph.exitSTIXNode(
                    fields["id"].value,
                    fields["name"].value,
                    type,
                    stix);
            });
        }

    }
    formHandler.setSubmitEventListener(submitEvent);
    formHandler.addFormField("hidden", "Id", "id", objectId, true);
    formHandler.addFormField("hidden", "Type", "type", "identity", true);
    formHandler.addFormField("text", "Name", "name", stix["name"], true);
    formHandler.addFormField("textarea", "Description", "description", stix["description"]);
    formHandler.addMultipleInputField("Roles", "roles", [], false, stix["roles"]);
    formHandler.addMultipleInputField("Identity Class", "identity_class", vocabularies["identity-class-ov"], false, stix["identity_class"]);
    formHandler.addMultipleInputField("Sectors", "sectors", vocabularies["industry-sector-ov"], false, stix["sectors"]);
    formHandler.addFormField("text", "Contact Information", "contact_information", stix["contact_information"]);

}

