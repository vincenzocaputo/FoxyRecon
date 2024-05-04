const relationshipTypes = [
    "attributed-to",
    "authored-by",
    "av-analysis-of",
    "based-on",
    "beacons-to",
    "characterizes",
    "communicates-with",
    "compromises",
    "consists-of",
    "controls",
    "delivers",
    "derived-from",
    "downloads",
    "drops",
    "duplicate-of",
    "dynamic-analysis-of",
    "exfiltrates-to",
    "exploits",
    "has",
    "hosts",
    "impersonates",
    "indicates",
    "investigates",
    "located-at",
    "mitigates",
    "originates-from",
    "owns",
    "related-to",
    "remediates",
    "static-analysis-of",
    "targets",
    "used-by",
    "uses",
    "variant-of"
]

function createRelationshipForm(fromNode, toNode) {
    const formHandler = new FormHandler("Add Relationship", "img/relationship-nb.png");
    submitEvent = evt => {
        var stix = {}
        const fields = formHandler.getFields();

        for (const [id, field] of Object.entries(fields)) {
            stix[id] = field.value;
        }
        graph.addRelationship(
            fields["source_ref"].value,
            fields["target_ref"].value,
            fields["relationship_type"].value);
    }
    formHandler.setSubmitEventListener(submitEvent);
    formHandler.addFormField("hidden", "source_ref", "source_ref", fromNode, true);
    formHandler.addFormField("hidden", "target_ref", "target_ref", toNode, true);
    formHandler.addFormField("select", "Relationship Type", "relationship_type", "", true, relationshipTypes);
}

