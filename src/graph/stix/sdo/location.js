function createLocationForm(evt, title, stix={}) {
    const action = Object.keys(stix).length == 0 ? "add" : "edit";

    const type = "location";
    const objectId = stix["id"] === undefined ? type+"--"+crypto.randomUUID() : stix["id"];

    const formHandler = new FormHandler(title, "img/location-nb.png");
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
    formHandler.addFormField("number", "Latitude", "latitude", stix["latitude"]);
    formHandler.addFormField("number", "Longitude", "longitude", stix["longitude"]);
    document.querySelector("form #latitude").setAttribute("min", "-90.0");
    document.querySelector("form #latitude").setAttribute("max", "90.0");
    document.querySelector("form #latitude").setAttribute("step", "0.1");
    document.querySelector("form #longitude").setAttribute("min", "-180.0");
    document.querySelector("form #longitude").setAttribute("max", "180.0");
    document.querySelector("form #longitude").setAttribute("step", "0.1");
    formHandler.addFormField("number", "Precision", "precision", stix["precision"]);
    formHandler.addFormField("select", "Region", "region", stix["region"], false, vocabularies["region-ov"]);
    formHandler.addFormField("select", "Country", "country", stix["country"], false, Object.keys(countries));
    document.querySelectorAll("form #country option").forEach( opt => {
        opt.value = countries[opt.value];
    });
    formHandler.addFormField("text", "Administrative Area", "administrative_area", stix["administrative_area"]);
    formHandler.addFormField("text", "City", "city", stix["city"]);
    formHandler.addFormField("text", "Street Address", "street_address", stix["street_address"]);
    formHandler.addFormField("text", "Postal Code", "postal_code", stix["postal_code"]);

    document.querySelector("form").addEventListener("submit", evt => {
        const region = document.querySelector("form #region").value;
        const country = document.querySelector("form #country").value;
        const latitude = document.querySelector("form #latitude").value;
        const longitude = document.querySelector("form #longitude").value;
        const precision = document.querySelector("form #precision").value;

        if (region === "" && country === "undefined" && (latitude === "" || longitude === "")) {
            alert("You must provide at least a country, region or latitude and longitude");
            evt.preventDefault();
        }

        if (precision !== "" && (latitude === ""  || longitude === "")) {
            alert("The precision property requires the latitude and longitude to be set");
            evt.preventDefault();
        }
    });
}

