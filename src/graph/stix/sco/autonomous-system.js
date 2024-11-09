function createAutonomousSystemForm(evt, title, stix={}) {
    const action = Object.keys(stix).length == 0 ? "add" : "edit";

    const type = "autonomous-system";
    const objectId = stix["id"] === undefined ? type+"--"+crypto.randomUUID() : stix["id"];

    const formHandler = new FormHandler(title, "img/autonomous-system-nb.png");
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
                    "AS"+fields["number"].value,
                    type,
                    stix);
            });
        } else {
            Graph.getInstance().then( (graph) => {
                graph.addSTIXNode(
                    fields["id"].value,
                    "AS"+fields["number"].value,
                    type,
                    stix);
            });
        }
    }
    formHandler.setSubmitEventListener(submitEvent);
    formHandler.addFormField("hidden", "Id", "id", objectId, true);
    formHandler.addFormField("hidden", "Type", "type", type, true);
    formHandler.addFormField("number", "Number", "number", stix["number"], true);
    document.querySelector("form #number").setAttribute("min", "1");
    formHandler.addFormField("text", "Name", "name", stix["name"]);
    formHandler.addFormField("text", "RIR", "rir", stix["rir"]);

}

