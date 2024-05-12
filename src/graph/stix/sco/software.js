function createSoftwareForm(evt, title, stix={}) {
    const action = Object.keys(stix).length == 0 ? "add" : "edit";

    const type = "software";
    const objectId = stix["id"] === undefined ? type+"--"+crypto.randomUUID() : stix["id"];

    const formHandler = new FormHandler(title, "img/software-nb.png");
    submitEvent = evt => {
        var stix = {}
        const fields = formHandler.getFields();

        for (const [id, field] of Object.entries(fields)) {
            stix[id] = field.value;
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
    formHandler.addFormField("text", "CPE", "cpe", stix["cpe"]);
    formHandler.addFormField("text", "SWID", "swid", stix["swid"]);
    formHandler.addMultipleInputField("Languages", "language", [], false, stix["language"]);
    formHandler.addFormField("text", "Vendor", "vendor", stix["vendor"]);
    formHandler.addFormField("text", "Version", "version", stix["version"]);
}

