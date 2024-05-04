function createCourseOfActionForm(evt, title, stix={}) {
    const action = Object.keys(stix).length == 0 ? "add" : "edit";

    const type = "course-of-action";
    const objectId = stix["id"] === undefined ? type+"--"+crypto.randomUUID() : stix["id"];

    const formHandler = new FormHandler(title, "img/course-of-action-nb.png");
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
                "course-of-action",
                stix);
        } else {
            graph.editSTIXNode(
                fields["id"].value,
                fields["name"].value,
                "course-of-action",
                stix);
        }
    }
    formHandler.setSubmitEventListener(submitEvent);
    formHandler.addFormField("hidden", "Id", "id", objectId, true);
    formHandler.addFormField("hidden", "Type", "type", type, true);
    formHandler.addFormField("text", "Name", "name", stix["name"], true);
    formHandler.addFormField("textarea", "Description", "description", stix["description"]);
}

