function createFileForm(evt, title, stix={}) {
    const action = Object.keys(stix).length == 0 ? "add" : "edit";

    const type = "file";
    const objectId = stix["id"] === undefined ? type+"--"+crypto.randomUUID() : stix["id"];

    const formHandler = new FormHandler(title, "img/file-noback-flat.png");
    submitEvent = evt => {
        var stix = {}
        const fields = formHandler.getFields();

        if (fields["name"].value === "" && fields["hashes"].value === "") {
            alert("You must provide at least a name or a hash");
            evt.preventDefault();
            return false;
        }
        const md5Regex = new RegExp("^[a-f0-9]{32}$");
        const sha1Regex = new RegExp("^[a-f0-9]{40}$");
        const sha256Regex = new RegExp("^[a-f0-9]{64}$");
        const sha512Regex = new RegExp("^[a-f0-9]{128}$");
        for (const [id, field] of Object.entries(fields)) {
            if (id === "hashes" && field.value !== "") {
                const hash = field.value;
                if (md5Regex.test(hash)) {
                    stix[id] = {
                        "MD5": hash
                    }
                } else if (sha1Regex.test(hash)) {
                    stix[id] = {
                        "SHA-1": hash
                    }
                } else if (sha256Regex.test(hash)) {
                    stix[id] = {
                        "SHA-256": hash
                    }   
                } else if (sha512Regex.test(hash)) {
                    stix[id] = {
                        "SHA-512": hash
                    }
                } else {
                    alert("Provide a valid hash");
                    evt.preventDefault();
                    return false;
                }
            } else {
                if (field.value === undefined || field.value === "" || field.value.length === 0) {
                    continue;
                } else {
                    stix[id] = field.value;
                }
            }
        }
        const label = fields["name"].value === "" ? fields["id"].value : fields["name"].value;
        if (action === "add") {
            Graph.getInstance().then( (graph) => {
                graph.addSTIXNode(
                    fields["id"].value,
                    label,
                    type,
                    stix);
            });
        } else {
            Graph.getInstance().then( (graph) => {
                graph.editSTIXNode(
                    fields["id"].value,
                    label,
                    type,
                    stix);
            });
        }

    }
    formHandler.setSubmitEventListener(submitEvent);
    formHandler.addFormField("hidden", "Id", "id", objectId, true);
    formHandler.addFormField("hidden", "Type", "type", "file", true);
    formHandler.addFormField("text", "Name", "name", stix["name"]);
    formHandler.addFormField("text", "Hash", "hashes", stix["hashes"]);
    document.querySelector("form #hashes").setAttribute("placeholder", "MD5, SHA-1, SHA-256, SHA-512");
    formHandler.addFormField("number", "Size", "size", stix["size"]);
    document.querySelector("form #size").setAttribute("placeholder", "Size in bytes");
    document.querySelector("form #size").setAttribute("min", "0");
    formHandler.addFormField("text", "MIME Type", "mime_type", stix["mime_type"]);
    formHandler.addFormField("datetime-local", "Created on", "ctime", stix["ctime"]);
    formHandler.addFormField("datetime-local", "Last Modified on", "mtime", stix["mtime"]);
}

