function createURLForm(evt, title, stix={}) {
    const action = Object.keys(stix).length == 0 ? "add" : "edit";

    const type = "url";
    const objectId = stix["id"] === undefined ? type+"--"+crypto.randomUUID() : stix["id"];

    const formHandler = new FormHandler(title, "img/url-nb.png");
    submitEvent = evt => {
        var stix = {}
        const fields = formHandler.getFields();

        for (const [id, field] of Object.entries(fields)) {
                stix[id] = field.value;
        }
        if (action === "add") {
            graph.addSTIXNode(
                fields["id"].value,
                fields["value"].value,
                type,
                stix);
        } else {
            graph.editSTIXNode(
                fields["id"].value,
                fields["value"].value,
                type,
                stix);
        }

    }
    formHandler.setSubmitEventListener(submitEvent);
    formHandler.addFormField("hidden", "Id", "id", objectId, true);
    formHandler.addFormField("hidden", "Type", "type", type, true);
    formHandler.addFormField("text", "Value", "value", stix["value"], true);
}

