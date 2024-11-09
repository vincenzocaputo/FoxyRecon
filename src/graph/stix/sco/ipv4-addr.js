function createIPV4AddrForm(evt, title, stix={}) {
    const action = Object.keys(stix).length == 0 ? "add" : "edit";

    const type = "ipv4-addr";
    const objectId = stix["id"] === undefined ? type+"--"+crypto.randomUUID() : stix["id"];

    const formHandler = new FormHandler(title, "img/ipv4-addr-nb.png");
    submitEvent = evt => {
        var stix = {}
        const fields = formHandler.getFields();
        const ipRegex = new RegExp(/^(?!0)(?!.*\.$)((2[0-4][0-9]|25[0-5]|1[0-9][0-9]|[1-9][0-9]|\d)\.){3}(2[0-4][0-9]|25[0-5]|1[0-9][0-9]|[1-9][0-9]|\d)(?:\/\d+)?$/);

        const ipAddr = fields["value"].value;
        if (ipRegex.test(ipAddr)) {
            if (ipAddr.includes("/") && ipAddr.split("/")[1] > 32) {
                alert("Invalid CIDR notation");
                evt.preventDefault();
                return false;
            }
        } else {
            alert("Provide a valid IPv4 address");
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

