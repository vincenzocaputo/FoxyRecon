// Type of the last selected string
var lastType = "";
var selectedText = "";
var selectedTextType = "";


browser.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    indicatorParser = new IndicatorParser();
    selectedText = document.getSelection().toString().trim();
    [selectedTextType, tld] = indicatorParser.getIndicatorType(selectedText);
    if (message === "open-add-note-popup") {
        createPopup(selectedText, selectedTextType);
    } else {
        //
    }
});

function createInput(name, type, labelName) {
    const formRow = document.createElement('div');
    formRow.className = 'foxyrecon-form-row';

    label = document.createElement('div');
    label.className = 'foxyrecon-label';
    label.setAttribute('for', name);
    label.textContent = labelName;
    formRow.appendChild(label);

    const input = document.createElement('input');

    if (type === "checkbox") {
        const inputSwitch = document.createElement('div');
        inputSwitch.className = 'switch';

        const slider = document.createElement('slider');
        slider.className = 'slider';

        // Create input element
        input.type = type;
        input.id = 'foxyrecon-input-'+name;
        input.name = name;

        inputSwitch.appendChild(input);
        inputSwitch.appendChild(slider);
        formRow.appendChild(inputSwitch);
    } else if (type === "select") {
        const select = document.createElement('select');
        select.textContent = "";
        select.id = 'foxyrecon-input-'+name;

        Graph.relationshipTypes.forEach( rtype => {
            const optionValue = document.createElement("option");
            optionValue.value = rtype;
            optionValue.textContent = rtype;
            select.appendChild(optionValue);
        });

        formRow.append(select);
    } else {
        input.className = 'foxyrecon-input';
        input.type = type;
        input.id = 'foxyrecon-input-'+name;
        input.name = name;
        formRow.appendChild(input);
    }
    return formRow;
}

function createPopup(selectedText, detectedType) {
    // Create background div
    const backgroundContainer = document.createElement('div');
    backgroundContainer.className = 'foxyrecon-background';

    // Create container div
    const popupContainer = document.createElement('div');
    popupContainer.className = 'foxyrecon-popup-container';

    // Create form header div
    const formHeader = document.createElement('div');
    formHeader.className = 'foxyrecon-form-header';

    const imgElement = document.createElement('img');
    imgElement.src = browser.runtime.getURL("assets/icons/foxyrecon-icon-32.png");

    // Create form title div
    const formTitle = document.createElement('div');
    formTitle.className = 'foxyrecon-form-title';
    formTitle.textContent = 'Add Node';
    
    formHeader.appendChild(imgElement);
    formHeader.appendChild(formTitle);

    // Append form header to container
    popupContainer.appendChild(formHeader);

    // Create form element
    const form = document.createElement('div');
    form.className = 'foxyrecon-form';

    form.appendChild(createInput("label", "text", "Label"));
    form.appendChild(createInput("add-rel", "checkbox", "Add Relationship *"));
    form.appendChild(createInput("rel-in", "checkbox", "Inbound"));
    form.appendChild(createInput("rel-out", "checkbox", "Outbound"));
    form.appendChild(createInput("rel-type", "select", "Relationship name"));


    const noteSection = document.createElement('div');
    noteSection.className = 'foxyrecon-note';
    noteSection.textContent = "* The relationship will be added between this node and the indicator you last submitted via FoxyRecon"

    form.appendChild(noteSection);

    // Create buttons container div
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'foxyrecon-buttons-container';

    // Create cancel button
    const cancelButton = document.createElement('button');
    cancelButton.className = 'foxyrecon-btn foxyrecon-cancel-btn';
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener("click", function(evt) {
        document.querySelector(".foxyrecon-background").remove();
        document.querySelector(".foxyrecon-popup-container").remove();
    });
    buttonsContainer.appendChild(cancelButton);

    // Create add node button
    const addNodeButton = document.createElement('button');
    addNodeButton.textContent = 'Add Node';
    addNodeButton.className = 'foxyrecon-btn foxyrecon-add-node-btn';
    buttonsContainer.appendChild(addNodeButton);


    // Append buttons container to form
    form.appendChild(buttonsContainer);

    // Append form to container
    popupContainer.appendChild(form);

    // Append the whole popup to the body or a specific element
    document.body.appendChild(backgroundContainer);
    document.body.appendChild(popupContainer);

    if (detectedType !== "invalid") {
        console.log(detectedType);
        // Selected text is a valid indicator. We don't need to ask user a label for the node
        // Hide the input field for label
        document.querySelector(".foxyrecon-form-row:nth-child(1)").style.display = "none";
    }

    document.querySelector("#foxyrecon-input-rel-in").checked = true;

    // Force the user to select at least one inbound or one outbound link
    document.querySelector("#foxyrecon-input-rel-in").addEventListener("change", (evt) => {
        const checked = evt.target.checked;
        const relOutCheckbox = document.querySelector("#foxyrecon-input-rel-out");
        if (!checked && !relOutCheckbox.checked) {
            relOutCheckbox.checked = true;
        }
    });
    document.querySelector("#foxyrecon-input-rel-out").addEventListener("change", (evt) => {
        const checked = evt.target.checked;
        const relInCheckbox = document.querySelector("#foxyrecon-input-rel-in");
        if (!checked && !relInCheckbox.checked) {
            relInCheckbox.checked = true;
        }
    });
    // Hide link options by default
    document.querySelectorAll(".foxyrecon-form-row:nth-child(n+3)").forEach( 
            (el) => el.style.opacity = "0"
    );
    document.querySelector("#foxyrecon-input-add-rel").addEventListener("change", function(evt) {
        const option = evt.target.checked;
        if (option) {
            document.querySelectorAll(".foxyrecon-form-row:nth-child(n+3)").forEach( 
                    (el) => {
                        el.style.opacity = "100%";
                        el.style.visibility = "visible";
                    }
            );
        } else {
            document.querySelectorAll(".foxyrecon-form-row:nth-child(n+3)").forEach( 
                    (el) => {
                        el.style.opacity = "0";
                        el.style.visibility = "hidden";
                    }
            );
        }

    });
    addNodeButton.addEventListener("click", evt => {
        let relName = "";
        let inbound = false;
        let outbound = false;

        if (document.querySelector("#foxyrecon-input-add-rel").checked) {
            relName = document.querySelector("#foxyrecon-input-rel-type").value;
            if (document.querySelector("#foxyrecon-input-rel-in").checked) {
                inbound = true;
            }
            if (document.querySelector("#foxyrecon-input-rel-out").checked) {
                outbound = true;
            }
        }

        if (detectedType === "invalid") {
            // We need to defined a note node with STIX data
            const nodeId = "note--" + crypto.randomUUID();
            let label = document.querySelector("#foxyrecon-input-label").value;
            if (!label) {
                label = "Note";
            }
            const type = "note";
            const stix = {};
            stix["id"] = nodeId;
            stix["type"] = type;
            stix["content"] = selectedText;

            browser.runtime.sendMessage({
                id: 4,
                label: label,
                stix: stix,
                relName: relName,
                inbound: inbound,
                outbound: outbound
            });
        } else {
            // Selected text is a valid indicator
            browser.runtime.sendMessage({
                id: 4,
                type: detectedType,
                indicator: selectedText,
                relName: relName,
                inbound: inbound,
                outbound: outbound
            });
        }
        document.querySelector(".foxyrecon-background").remove();
        document.querySelector(".foxyrecon-popup-container").remove();
    });
}

