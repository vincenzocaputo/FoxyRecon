class FormHandler {

    constructor(formTitle, formIcon) {
        const outsideContainer = document.createElement("div");
        outsideContainer.setAttribute("id", "background");
        document.querySelector("#page-container").appendChild(outsideContainer);

        const popupContainer = document.createElement("div");
        const formContainer = document.createElement("div");

        const formHeader = document.createElement("div");
        formHeader.classList.add("form-header");

        const formIconEl = document.createElement("img");
        formIconEl.setAttribute("src", formIcon);

        const formTitleEl = document.createElement("div");
        formTitleEl.textContent = formTitle;

        formHeader.appendChild(formIconEl);
        formHeader.appendChild(formTitleEl);
        popupContainer.appendChild(formHeader);

        this.buttonsContainer = document.createElement("div");
        this.buttonsContainer.classList.add("buttons-container");
        
        const cancelButton = document.createElement("button");
        cancelButton.textContent = "Cancel";
        cancelButton.classList.add("btn");
        cancelButton.classList.add("cancel-btn");
        cancelButton.addEventListener("click", evt => {
            document.querySelector("#background").remove();
            evt.target.closest(".popup-container").remove();
        });

        const okButton = document.createElement("input");
        okButton.setAttribute("type", "submit");
        okButton.setAttribute("value", "Add Node");
        okButton.classList.add("btn");
        okButton.classList.add("add-node-btn");

        okButton.addEventListener("click", this.addNodeButtokClickEvent);

        const requireNote = document.createElement("div");
        requireNote.classList.add("required-note");
        requireNote.textContent = "Required fields are marked with an asterisk (*)";

        popupContainer.appendChild(requireNote);
        this.buttonsContainer.appendChild(cancelButton);
        this.buttonsContainer.appendChild(okButton);
        this.form = document.createElement("form");
        this.form.setAttribute("method", "post");

        popupContainer.classList.add("popup-container");
        formContainer.classList.add("form-container");

        this.form.appendChild(formContainer);
        this.form.appendChild(this.buttonsContainer);
        popupContainer.appendChild(this.form);
        document.getElementById("page-container").appendChild(popupContainer);

        this.fields = {};
    }
    
    setSubmitEventListener(callbackFunc) {
        this.form.addEventListener("keydown", evt => {
            if (evt.keyCode === 13) {
                evt.stopPropagation();
                evt.preventDefault();
            }
        });
        this.form.addEventListener("submit", callbackFunc);
        
    }

    getFields() {
        document.querySelectorAll("form .subform-container").forEach( s => {
            const fieldId = s.id;
            const entries = s.querySelectorAll(".entry-content");
            let subObjects = Array();
            for  (let entry of entries) {
                subObjects.push(JSON.parse(entry.textContent));
            }
            this.fields[fieldId] = {"value": subObjects };
        });
        return this.fields;
    }
    /**
     * Add a multiple input field
     * @param {String} label Input's label
     * @param {String} id Input's id
     * @param {Boolean} isRequired True if the field is required
     * @param {Array} options List of options to show to the user
     * @param {Array} defaultValue default value of the input field
     */
    addMultipleInputField(label, id, options, isRequired, defaultValue) {
        var labelElement = document.createElement("label");
        labelElement.setAttribute("for", id);
        isRequired = isRequired || false;
        if (isRequired) {
            labelElement.textContent = `* ${label}`;
        } else {
            labelElement.textContent = label;
        }

        const fieldContainer = document.createElement("div");
        fieldContainer.setAttribute("id", id);
        fieldContainer.classList.add("multiple-input");

        const inputContainer = document.createElement("div");
        inputContainer.classList.add("tag-input-wrapper");
        
        const input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("id", id);
        input.setAttribute("name", id);
        if (isRequired) {
            input.setAttribute("required", "");
        }

        var multipleInput;

        inputContainer.appendChild(input);
        fieldContainer.appendChild(inputContainer);
        this.form.insertBefore(fieldContainer, this.buttonsContainer);
        this.form.insertBefore(labelElement, fieldContainer);

        if (options !== undefined) {
            const optionsContainer = document.createElement("div");
            optionsContainer.classList.add("multiple-options");
            fieldContainer.appendChild(optionsContainer);
            multipleInput = new MultipleInput(fieldContainer, options);
        } else {
            multipleInput = new MultipleInput(fieldContainer);
        }

        if (defaultValue != undefined) {
            for (let value of defaultValue) {
                multipleInput.addTag(value);
            }
        }


        this.fields[id] = multipleInput;
    }

    /**
     * Add a basic form field
     * @param {String} type Form field type
     * @param {String} label Input field's label
     * @param {String} id Input field's id
     * @param {String} defaultValue Input field's default value
     * @param {Boolean} isRequired True if the field is required
     * @param {Array} options List of options in a select field
     */
    addFormField(type, label, id, defaultValue, isRequired, options) {
        const labelElement = document.createElement("label");
        labelElement.setAttribute("for", id);
        defaultValue = defaultValue || "";
        isRequired = isRequired || false;
        if (isRequired) {
            labelElement.textContent = `* ${label}`;
        } else {
            labelElement.textContent = label;
        }

        var input;
        if (type === "select") {
            input = document.createElement("select");
            const optionElement = document.createElement("option");
            optionElement.setAttribute("value", "");
            optionElement.textContent = "";
            input.appendChild(optionElement);
            for (let opt of options) {
                const optionElement = document.createElement("option");
                optionElement.setAttribute("value", opt);
                optionElement.textContent = opt;
                input.appendChild(optionElement);
            }
            input.value = defaultValue;
        } else if (type === "textarea") {
            input = document.createElement("textarea");
            input.textContent = defaultValue;
        } else {
            input = document.createElement("input");
            input.setAttribute("type", type);
            input.setAttribute("value", defaultValue);
        }
        input.setAttribute("id", id);
        input.setAttribute("name", id);
        if (isRequired) {
            input.setAttribute("required", "");
        }

        this.form.insertBefore(input, this.buttonsContainer);
        if (type !== "hidden") {
            this.form.insertBefore(labelElement, input);
        }
        this.fields[id] = input;
    }
    
    addSubForm(name, addCallbackFunc) {
        const subformContainer = document.createElement("div");
        subformContainer.id = name;
        subformContainer.classList.add("subform-container");

        const subformTitle = document.createElement("div");
        subformTitle.classList.add("subform-title");
        subformTitle.textContent = name;

        const addButton = document.createElement("button");
        addButton.setAttribute("type", "button");
        addButton.classList.add("btn");
        addButton.classList.add("add-btn");
        addButton.textContent = "+";
        addButton.addEventListener("click", addCallbackFunc);

        subformContainer.appendChild(subformTitle);
        subformContainer.appendChild(addButton);

        this.form.insertBefore(subformContainer, this.buttonsContainer);
    }

    static addSubFormEntry(formName, entryLabel, entry, editCallbackFunc) {
        const subform = document.getElementById(formName);

        const entryElement = document.createElement("div");
        entryElement.classList.add("entry");

        const entryName = document.createElement("div");
        entryName.textContent = entryLabel;
        entryName.classList.add("entry-title");

        const entryContent = document.createElement("div");
        entryContent.classList.add("entry-content");
        entryContent.textContent = entry;
        entryContent.style.display = "none";
        
        const entryButtonsContainer = document.createElement("div");
        entryButtonsContainer.classList.add("entry-buttons-container");


        const delButton = document.createElement("button");
        delButton.setAttribute("type", "button");
        delButton.classList.add("delete-btn");
        delButton.addEventListener("click", evt => {
            evt.target.closest(".entry").remove();
        });

        if (editCallbackFunc !== undefined) {
            const editButton = document.createElement("button");
            editButton.setAttribute("type", "button");
            editButton.classList.add("edit-btn");
            editButton.addEventListener("click", editCallbackFunc);
            entryButtonsContainer.appendChild(editButton);
        }
        entryButtonsContainer.appendChild(delButton);

        entryElement.appendChild(entryName);
        entryElement.appendChild(entryContent);
        entryElement.appendChild(entryButtonsContainer);
        subform.appendChild(entryElement);
    }

    static editSubFormEntry(entryElement, entryLabel, entry) {
        entryElement.querySelector(".entry-title").textContent = entryLabel;
        entryElement.querySelector(".entry-content").textContent = entry;
    }
}
