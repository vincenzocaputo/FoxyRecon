function createReferenceEntry(form) {
    const source_name = form.querySelector("#source_name").value;
    const description = form.querySelector("#description").value;
    const url = form.querySelector("#url").value;
    const md5 = form.querySelector("#MD5").value;
    const sha1 = form.querySelector("#SHA-1").value;
    const sha256 = form.querySelector("#SHA-256").value;
    const sha512 = form.querySelector("#SHA-512").value;
    const externalId = form.querySelector("#external_id").value;

    if (url || description || externalId) {
        const entry = {};

        console.log(url);
        if (source_name !== "") {
            entry["source_name"] = source_name;
        }
        if (description !== "") {
            entry["description"] = description;
        }
        if (url !== "") {
            entry["url"] = url;
        }
        if (externalId !== "") {
            entry["external_id"] = external_id;
        }

        if (md5 || sha1 || sha256 || sha512) {
            entry["hashes"] = {};
        }
        if (md5) {
            entry["hashes"]["MD5"] = md5;
        }
        if (sha1) {
            entry["hashes"]["SHA-1"] = sha1;
        }
        if (sha256) {
            entry["hashes"]["SHA-256"] = sha256;
        }
        if (sha512) {
            entry["hashes"]["SHA-512"] = sha512;
        }
        return entry;
    } else {
        return null;
    }
    
}

editReferenceEntry = evt => {
    const entryElement = evt.target.closest(".entry");
    const entryJson = entryElement.querySelector(".entry-content");
    const entry = JSON.parse(entryJson.textContent);

    referenceSubmitEvent = s_evt => {
        s_evt.preventDefault();
        const form = s_evt.target.closest("form");

        const newEntry = createReferenceEntry(form);
        if (newEntry !== null) {
            FormHandler.editSubFormEntry(entryElement, entry["source_name"], JSON.stringify(newEntry));
            s_evt.target.closest(".popup-container").remove();
        } else {
            alert("You must provide at least one of the description, url, or external_id")
        }
        return false;
    }

    sFormHandler = new FormHandler("Edit External Reference");
    sFormHandler.setSubmitEventListener(referenceSubmitEvent);
    sFormHandler.addFormField("text", "Source Name", "source_name", entry["source_name"], true);
    sFormHandler.addFormField("textarea", "Description", "description", entry["description"], false);
    sFormHandler.addFormField("text", "URL", "url", entry["url"], false);
    if (!Object.keys(entry).includes("hashes")) {
        entry["hashes"] = {};
    }
    sFormHandler.addFormField("text", "MD5 Hash", "MD5", entry["hashes"]["MD5"], false);
    sFormHandler.addFormField("text", "SHA1 Hash", "SHA-1", entry["hashes"]["SHA-1"], false);
    sFormHandler.addFormField("text", "SHA256 Hash", "SHA-256", entry["hashes"]["SHA-256"], false);
    sFormHandler.addFormField("text", "SHA512 Hash", "SHA-512", entry["hashes"]["SHA-512"], false);
    sFormHandler.addFormField("text", "External ID", "external_id", entry["external_id"], false);
}

createReferenceForm = evt => {
    referenceSubmitEvent = s_evt => {
        s_evt.preventDefault();
        const form = s_evt.target.closest("form");

        const entry = createReferenceEntry(form);
        if (entry !== null) {
            FormHandler.addSubFormEntry("external_references", entry["source_name"], JSON.stringify(entry), editReferenceEntry);
            s_evt.target.closest(".popup-container").remove();
        } else {
            alert("You must provide at least one of the description, url, or external_id")
        }
        return false;
    }
    sFormHandler = new FormHandler("Add External Reference");
    sFormHandler.setSubmitEventListener(referenceSubmitEvent);
    sFormHandler.addFormField("text", "Source Name", "source_name", "", true);
    sFormHandler.addFormField("textarea", "Description", "description", "", false);
    sFormHandler.addFormField("text", "URL", "url", "", false);
    sFormHandler.addFormField("text", "MD5 Hash", "MD5", "", false);
    sFormHandler.addFormField("text", "SHA1 Hash", "SHA-1", "", false);
    sFormHandler.addFormField("text", "SHA256 Hash", "SHA-256", "", false);
    sFormHandler.addFormField("text", "SHA512 Hash", "SHA-512", "", false);
    sFormHandler.addFormField("text", "External ID", "external_id", "", false);
}
