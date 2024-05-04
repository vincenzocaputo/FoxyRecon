function createIPV6AddrForm(evt, title, stix={}) {
    const action = Object.keys(stix).length == 0 ? "add" : "edit";

    const type = "ipv6-addr";
    const objectId = stix["id"] === undefined ? type+"--"+crypto.randomUUID() : stix["id"];

    const formHandler = new FormHandler(title, "img/ipv6-addr-nb.png");
    submitEvent = evt => {
        var stix = {}
        const fields = formHandler.getFields();

        const ipRegex = new RegExp(/^(?:[\da-fA-F]{0,4}:){1,7}[\da-fA-F]{0,4}(?:\/\d+)?$/);

        const ipAddr = fields["value"].value;
        if (ipRegex.test(ipAddr)) {
            if (ipAddr.includes("/") && ipAddr.split("/")[1] > 128) {
                alert("Invalid CIDR notation");
                evt.preventDefault();
                return false;
            }
        } else {
            alert("Provide a valid IPv6 address");
            evt.preventDefault();
            return false;
        }
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

