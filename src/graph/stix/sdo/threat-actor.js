function createThreatActorForm(evt, title, stix={}) {
    const action = Object.keys(stix).length == 0 ? "add" : "edit";

    const type = "threat-actor";
    const objectId = stix["id"] === undefined ? type+"--"+crypto.randomUUID() : stix["id"];

    const formHandler = new FormHandler(title, "img/threat-actor-noback-flat.png");
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
    formHandler.addMultipleInputField("Threat Actor Types", "threat_actor_types", vocabularies["threat-actor-type-ov"], false, stix["threat_actor_types"]);
    formHandler.addMultipleInputField("Aliases", "aliases", [], false, stix["aliases"]);
    formHandler.addFormField("datetime-local", "First Seen", "first_seen", stix["first_seen"]);
    formHandler.addFormField("datetime-local", "Last Seen", "last_seen", stix["last_seen"]);
    formHandler.addMultipleInputField("Threat Actor Roles", "roles", vocabularies["threat-actor-role-ov"], false, stix["roles"]);
    formHandler.addMultipleInputField("Goals", "goals", false, stix["goals"]);
    formHandler.addFormField("select", "Sophistication", "sophistication", stix["sophistication"], false, vocabularies["threat-actor-sophistication-ov"]);
    formHandler.addFormField("select", "Resource Level", "resource_level", stix["resource_level"], false, vocabularies["attack-resource-level-ov"]);
    formHandler.addFormField("select", "Primary Motivation", "primary_motivation", stix["primary_motivation"], false, vocabularies["attack-motivation-ov"]);
    formHandler.addMultipleInputField("Secondary Motivations", "secondary_motivations", vocabularies["attack-motivation-ov"], false, stix["secondary_motivations"]);
    formHandler.addMultipleInputField("Personal Motivations", "personal_motivations", vocabularies["attack-motivation-ov"], false, stix["personal_motivations"]);

    document.querySelector("form #first_seen").addEventListener("change", evt => {
        document.querySelector("form #last_seen").min = evt.target.value;
    });
    document.querySelector("form #last_seen").addEventListener("change", evt => {
        document.querySelector("form #first_seen").max = evt.target.value;
    });

}

