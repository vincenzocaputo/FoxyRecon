function createUserAccountForm(evt, title, stix={}) {
    const action = Object.keys(stix).length == 0 ? "add" : "edit";

    const type = "user-account";
    const objectId = stix["id"] === undefined ? type+"--"+crypto.randomUUID() : stix["id"];

    const formHandler = new FormHandler(title, "img/user-account-nb.png");
    submitEvent = evt => {
        var stix = {}
        const fields = formHandler.getFields();

        for (const [id, field] of Object.entries(fields)) {
            if (field.value === undefined || field.value === "" || field.value.length === 0) {
                continue;
            } else {
                // Handle checkbox
                if (["is_service_account",
                    "is_privileged",
                    "can_escalate_privs",
                    "is_disabled"].includes(field.id)) {

                    if (field.value === "Yes") {
                        stix[id] = true;
                    } else if (field.value === "No") {
                        stix[id] = false;
                    }
                } else {
                    stix[id] = field.value;
                }
            }
        }
        if (action === "add") {
            graph.addSTIXNode(
                fields["id"].value,
                type,
                type,
                stix);
        } else {
            graph.editSTIXNode(
                fields["id"].value,
                type,
                type,
                stix);
        }

    }
    formHandler.setSubmitEventListener(submitEvent);
    formHandler.addFormField("hidden", "Id", "id", objectId, true);
    formHandler.addFormField("hidden", "Type", "type", type, true);
    formHandler.addFormField("text", "User ID", "user_id", stix["user_id"]);
    formHandler.addFormField("text", "Credential", "credential", stix["credential"]);
    formHandler.addFormField("text", "Account Login", "account_login", stix["account_login"]);
    formHandler.addMultipleInputField("Account type", "account_type", vocabularies["account-type-ov"], false, stix["account_type"]);
    formHandler.addFormField("text", "Display Name", "display_name", stix["display_name"]);
    formHandler.addFormField("select", "Service Account", "is_service_account", stix["is_service_account"] ? "Yes" : "No", false, ["Yes", "No"]);
    formHandler.addFormField("select", "Privileged", "is_privileged", stix["is_privileged"] ? "Yes" : "No", false, ["Yes", "No"]);
    formHandler.addFormField("select", "Can Escalate Privileges?", "can_escalate_privs", stix["can_escalate_privs"] ? "Yes" : "No", false, ["Yes", "No"]);
    formHandler.addFormField("select", "Disabled", "is_disabled", stix["is_disabled"] ? "Yes" : "No", false, ["Yes", "No"]);
    formHandler.addFormField("datetime-local", "Creation Date", "account_created", stix["account_created"]);
    formHandler.addFormField("datetime-local", "Expiration Date", "account_expires", stix["account_expires"]);
    formHandler.addFormField("datetime-local", "Last Credential Change Date", "credential_last_changed", stix["credential_last_changed"]);
    formHandler.addFormField("datetime-local", "First Login", "account_first_login", stix["account_first_login"]);
    formHandler.addFormField("datetime-local", "Last Login", "account_last_login", stix["account_last_login"]);
}

