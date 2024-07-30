var update = false;
var selectedResource = -1;

function readJSONFile(file, callback) {
    let rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if(rawFile.readyState == 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }

    }
    rawFile.send(null); 
}

function showMessageError(field_id, err_msg) {
    document.getElementById(field_id).focus();
    document.getElementById(field_id).style.outline = "2px solid red";
    let msgBox = document.querySelector("#"+field_id+"+.error-msg");
    msgBox.style.display = "inline";
    msgBox.querySelector(".error-msg-text").textContent = err_msg;

}

/**
 * Show the list of the web resources created by the user
 */
function showCustomToolsList() {
    document.querySelector("#no-tools").style.display = "none";
    const toolsListNodes = document.getElementById("tools-list");
    toolsListNodes.textContent = ''; // Remove nodes already potentially present
    const toolsList = JSON.parse(localStorage.getItem("tools-ext"));
    if(toolsList == null) {
        document.querySelector("#no-tools").style.display = "block";
        return;
    }
    for (i=0; i<toolsList.length; i++) {
        let tool = toolsList[i];
        let node = document.createElement("div");

        node.classList.add("tool-entry");
        
        let nodeImageContainer = document.createElement("div");
        nodeImageContainer.classList.add("tool-icon");

        let nodeImage = document.createElement("img");

        let imageSrc = toolsList[i]["icon"];
        nodeImage.setAttribute("src", imageSrc);

        let nodeText = document.createElement("div");
        nodeText.textContent = toolsList[i]["name"];
        nodeText.classList.add("tool-name");

        let color = toolsList[i]["color"];
        if(color != null) {
            node.style.background = color;
            nodeText.style.backgroundColor = color;
        }

        tags = toolsList[i]["tags"];
        if(tags) {
            nodeText.classList.add("tool-name-with-tags");
            let nodeTagsContainer = document.createElement("div");
            nodeTagsContainer.classList.add("tool-tags-container");

            for(tagIdx=0; tagIdx<tags.length; tagIdx++) {
                let nodeTag = document.createElement("div");

                nodeTag.textContent = tags[tagIdx].toUpperCase();
                nodeTag.classList.add("tool-tag");

                nodeTag.style.backgroundColor = "rgba(256,256,256, 0.3)";
                nodeTagsContainer.appendChild(nodeTag);
                nodeText.insertAdjacentElement("beforeend", nodeTagsContainer);

            }
        }

        optionsContainer = document.createElement("div");
        optionsContainer.classList.add("tool-options-container");

    
        node.id = i;
        
        // If the user clicks on a tool in the list, fill the form with the information related to the selected tool
        node.addEventListener("click", function(e) {
            if(document.querySelector("#form-pane").style.display == "block") {
                if(confirm("Are you sure to cancel? All the changes will be lost") == false) {
                    return;
                } else {
                    resetForm();
                    resetPage();
                }
            }
            document.querySelectorAll(".tool-entry").forEach( v => v.style.outline = "none" );
            const toolEntry = e.target.closest(".tool-entry");
            toolEntry.style.outline = "5px outset #000000";
            selectedResource = toolEntry.id;
            document.querySelector("#add-res-button").style.display = "none";
            document.querySelector("#cancel-button").style.display = "block";
            document.querySelector("#edit-res-button").style.display = "block";
            document.querySelector("#del-res-button").style.display = "block";
            document.querySelector("#export-button").style.display = "block";
            document.querySelector("#export-all-button").style.display = "none";
            resetForm();
            update = true;
            document.querySelector("#submit-btn").textContent = "Update tool";
            const tool = toolsList[e.currentTarget.id];
            document.getElementById("tool-name").value = tool["name"];
            document.getElementById("tool-name").readOnly = true;
            document.getElementById("tool-desc").value = tool["desc"] || "";
            if(tool["url"]["domain"]) {
                document.getElementById("tool-dom-url").value = tool["url"]["domain"];
                if(tool["inputSelector"]) {
                    document.getElementById("tool-dom-input-csssel").value = tool["inputSelector"];
                    document.getElementById("tool-dom-post").checked = true;
                    document.getElementById("tool-dom-post").dispatchEvent(new Event("change"));
                    document.getElementById("tool-dom-submit-csssel").value = tool["submitQuery"] || "";
                }
            }
            if(tool["url"]["ip"]) {
                document.getElementById("tool-ip-url").value = tool["url"]["ip"];
                if(tool["inputSelector"]) {
                    document.getElementById("tool-ip-input-csssel").value = tool["inputSelector"];
                    document.getElementById("tool-ip-post").checked = true;
                    document.getElementById("tool-ip-post").dispatchEvent(new Event("change"));
                    document.getElementById("tool-ip-submit-csssel").value = tool["submitQuery"] || "";
                }
            }
            if(tool["url"]["url"]) {
                document.getElementById("tool-url-url").value = tool["url"]["url"];
                if(tool["inputSelector"]) {
                    document.getElementById("tool-url-input-csssel").value = tool["inputSelector"];
                    document.getElementById("tool-url-post").checked = true;
                    document.getElementById("tool-url-post").dispatchEvent(new Event("change"));
                    document.getElementById("tool-url-submit-csssel").value = tool["submitQuery"] || "";
                }
            }
            if(tool["url"]["email"]) {
                document.getElementById("tool-email-url").value = tool["url"]["email"];
                if(tool["inputSelector"]) {
                    document.getElementById("tool-email-input-csssel").value = tool["inputSelector"];
                    document.getElementById("tool-email-post").checked = true;
                    document.getElementById("tool-email-post").dispatchEvent(new Event("change"));
                    document.getElementById("tool-email-submit-csssel").value = tool["submitQuery"] || "";
                }
            }
            if(tool["url"]["hash"]) {
                document.getElementById("tool-hash-url").value = tool["url"]["hash"];
                if(tool["inputSelector"]) {
                    document.getElementById("tool-hash-input-csssel").value = tool["inputSelector"];
                    document.getElementById("tool-hash-post").checked = true;
                    document.getElementById("tool-hash-post").dispatchEvent(new Event("change"));
                    document.getElementById("tool-hash-submit-csssel").value = tool["submitQuery"] || "";
                }
            }
            if(tool["url"]["cve"]) {
                document.getElementById("tool-cve-url").value = tool["url"]["cve"];
                if(tool["inputSelector"]) {
                    document.getElementById("tool-cve-input-csssel").value = tool["inputSelector"];
                    document.getElementById("tool-cve-post").checked = true;
                    document.getElementById("tool-cve-post").dispatchEvent(new Event("change"));
                    document.getElementById("tool-cve-submit-csssel").value = tool["submitQuery"] || "";
                }
            }
            if(tool["url"]["phone"]) {
                document.getElementById("tool-phone-url").value = tool["url"]["phone"];
                if(tool["inputSelector"]) {
                    document.getElementById("tool-phone-input-csssel").value = tool["inputSelector"];
                    document.getElementById("tool-phone-post").checked = true;
                    document.getElementById("tool-phone-post").dispatchEvent(new Event("change"));
                    document.getElementById("tool-phone-submit-csssel").value = tool["submitQuery"] || "";
                }
            }
            if(tool["url"]["asn"]) {
                document.getElementById("tool-asn-url").value = tool["url"]["asn"];
                if(tool["inputSelector"]) {
                    document.getElementById("tool-asn-input-csssel").value = tool["inputSelector"];
                    document.getElementById("tool-asn-post").checked = true;
                    document.getElementById("tool-asn-post").dispatchEvent(new Event("change"));
                    document.getElementById("tool-asn-submit-csssel").value = tool["submitQuery"] || "";
                }
            }
            document.getElementById("tool-icon-b64").value = tool["icon"];
            document.querySelector("#file-upload .warn-msg").style.visibility = "visible";
            document.getElementById("tool-color").value = tool["color"];

            if('tags' in tool) {
                tool["tags"].forEach((e)=>{
                    document.querySelector(`input[value=${e}]`).checked = true;
                });
            }
        });

        document.getElementById("edit-res-button").addEventListener("click", function(e) {
            document.querySelector("#main-pane").style.display = "none";
            document.querySelector("#form-pane").style.display = "block";
            document.querySelector("#cancel-button").style.display = "block";
            document.querySelector("#del-res-button").style.display = "none";
            document.querySelector("#add-res-button").style.display = "none";
            document.querySelector("#edit-res-button").style.display = "none";
            document.querySelector("#export-button").style.display = "none";
            document.querySelector("#export-all-button").style.display = "block";
            document.querySelector("#submit-btn").value = "Edit Resource";

        });

        nodeImageContainer.appendChild(nodeImage);
        node.appendChild(nodeImageContainer);
        node.appendChild(nodeText);
        node.appendChild(optionsContainer);
        toolsListNodes.appendChild(node);



    }
}

function resetPage() {
    document.querySelector("#main-pane").style.display = "block";
    document.querySelector("#form-pane").style.display = "none";
    document.querySelector("#cancel-button").style.display = "none";
    document.querySelector("#del-res-button").style.display = "none";
    document.querySelector("#edit-res-button").style.display = "none";
    document.querySelector("#add-res-button").style.display = "block";
}
/**
 * Reset the input form
 */
function resetForm() {
    document.querySelector("#submit-btn").value = "Add Resource";
    document.querySelectorAll("input[type=text],textarea,input[type=color]").forEach((e)=>e.value = "");
    document.querySelectorAll("input[type=checkbox]").forEach((e)=>{e.checked=false; e.dispatchEvent(new Event("change"))});
    document.querySelector("#submit-btn").textContent = "Add tool";
    update = false;
    document.getElementById("tool-name").readOnly = false;
    document.querySelector("#file-upload .warn-msg").style.visibility = "hidden";
    resetErrors();
}

function resetErrors() {
    document.querySelectorAll(".error-msg").forEach( v => { v.style.display = "none" });
    document.querySelectorAll("input").forEach( v => { v.style.outline = "none" });
}

function createFormPopup(formIcon, formTitle, defaultName, addEvent) {
    var buttonsContainer;
    var form;
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

    buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("buttons-container");
    
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.classList.add("btn");
    cancelButton.classList.add("cancel-btn");
    cancelButton.addEventListener("click", evt => {
        evt.target.closest(".popup-container").remove();
    });

    const okButton = document.createElement("input");
    okButton.setAttribute("type", "submit");
    okButton.setAttribute("value", "Add Resource");
    okButton.classList.add("btn");
    okButton.classList.add("add-btn");


    form = document.createElement("form");
    buttonsContainer.appendChild(cancelButton);
    buttonsContainer.appendChild(okButton);
    form.setAttribute("method", "post");

    popupContainer.classList.add("popup-container");
    formContainer.classList.add("form-container");

    form.appendChild(formContainer);
    form.appendChild(buttonsContainer);
    form.addEventListener("submit", addEvent);
    popupContainer.appendChild(form);

    document.getElementById("page-container").appendChild(popupContainer);

    const nameLabelElement = document.createElement("label");
    nameLabelElement.setAttribute("for", "name");
    nameLabelElement.textContent = "Resource Name";

    var nameInput = document.createElement("input");
    nameInput.setAttribute("type", "text");
    nameInput.setAttribute("id", "template-form-name");
    nameInput.setAttribute("name", "name");
    nameInput.setAttribute("value", defaultName);
    nameInput.setAttribute("required", "");

    const hostnameLabelElement = document.createElement("label");
    hostnameLabelElement.setAttribute("for", "hostname");
    hostnameLabelElement.textContent = "Hostname";

    var hostnameInput = document.createElement("input");
    hostnameInput.setAttribute("type", "text");
    hostnameInput.setAttribute("id", "template-form-hostname");
    hostnameInput.setAttribute("name", "hostname");
    hostnameInput.setAttribute("required", "");

    var radioGroupLabel = document.createElement("label");
    radioGroupLabel.textContent = "Protocol";

    var radioGroup = document.createElement("div");
    radioGroup.style.textAlign = "left";
    
    var httpRadio = document.createElement("input");
    httpRadio.setAttribute("type", "radio");
    httpRadio.setAttribute("id", "template-http");
    httpRadio.setAttribute("name", "protocol");
    httpRadio.setAttribute("required", "");
    var httpsRadio = document.createElement("input");
    httpsRadio.setAttribute("type", "radio");
    httpsRadio.setAttribute("id", "template-https");
    httpsRadio.setAttribute("name", "protocol");
    httpsRadio.setAttribute("checked", true);
    httpsRadio.setAttribute("required", "");

    httpRadioLabel = document.createElement("label");
    httpRadioLabel.setAttribute("for", "template-http");
    httpRadioLabel.setAttribute("name", "protocol");
    httpRadioLabel.textContent = "HTTP";
    httpsRadioLabel = document.createElement("label");
    httpsRadioLabel.setAttribute("for", "template-https");
    httpsRadioLabel.textContent = "HTTPS";

    radioGroup.appendChild(httpRadio);
    radioGroup.appendChild(httpRadioLabel);
    radioGroup.appendChild(document.createElement("br"));
    radioGroup.appendChild(httpsRadio);
    radioGroup.appendChild(httpsRadioLabel);


    form.insertBefore(nameInput, buttonsContainer);
    form.insertBefore(nameLabelElement, nameInput);

    form.insertBefore(hostnameInput, buttonsContainer);
    form.insertBefore(hostnameLabelElement, hostnameInput);

    form.insertBefore(radioGroup, buttonsContainer);
    form.insertBefore(radioGroupLabel, radioGroup);
    
}

window.onload = function() {
    var mispTemplate;
    var openctiTemplate;
    var yetiTemplate;

    readJSONFile("templates/misp.json", jsonCode => {
        mispTemplate = JSON.parse(jsonCode);
    });
    readJSONFile("templates/opencti.json", jsonCode => {
        openctiTemplate = JSON.parse(jsonCode);
    });
    readJSONFile("templates/yeti.json", jsonCode => {
        yetiTemplate = JSON.parse(jsonCode);
    });
    resetForm();
    showCustomToolsList();

    let domPost = document.querySelectorAll(".dom-csssel-input, .dom-csssel-label");
    let ipPost = document.querySelectorAll(".ip-csssel-input, .ip-csssel-label");
    let urlPost = document.querySelectorAll(".url-csssel-input, .url-csssel-label");
    let emailPost = document.querySelectorAll(".email-csssel-input, .email-csssel-label");
    let hashPost = document.querySelectorAll(".hash-csssel-input, .hash-csssel-label");
    let cvePost = document.querySelectorAll(".cve-csssel-input, .cve-csssel-label");
    let phonePost = document.querySelectorAll(".phone-csssel-input, .phone-csssel-label");
    let asnPost = document.querySelectorAll(".asn-csssel-input, .asn-csssel-label");

    // Hide css selector input field, as the post checkbox are disabled by default
    domPost.forEach(v=>{v.style.display="none"});
    ipPost.forEach(v=>{v.style.display="none"});
    urlPost.forEach(v=>{v.style.display="none"});
    emailPost.forEach(v=>{v.style.display="none"});
    hashPost.forEach(v=>{v.style.display="none"});
    cvePost.forEach(v=>{v.style.display="none"});
    phonePost.forEach(v=>{v.style.display="none"});
    asnPost.forEach(v=>{v.style.display="none"});

    // Post checkbox change events. If checked, show the related input field
    document.querySelector("#tool-dom-post").addEventListener("change", function(evt) {
        if(evt.target.checked == true) {
            domPost.forEach(v=>{v.style.display="inline"});
        } else {
            domPost.forEach(v=>{v.style.display="none"});
        }
    });
    document.querySelector("#tool-ip-post").addEventListener("change", function(evt) {
        if(evt.target.checked == true) {
            ipPost.forEach(v=>{v.style.display="inline"});
        } else {
            ipPost.forEach(v=>{v.style.display="none"});
        }
    });
    document.querySelector("#tool-url-post").addEventListener("change", function(evt) {
        if(evt.target.checked == true) {
            urlPost.forEach(v=>{v.style.display="inline"});
        } else {
            urlPost.forEach(v=>{v.style.display="none"});
        }
    });
    document.querySelector("#tool-email-post").addEventListener("change", function(evt) {
        if(evt.target.checked == true) {
            emailPost.forEach(v=>{v.style.display="inline"});
        } else {
            emailPost.forEach(v=>{v.style.display="none"});
        }
    });
    document.querySelector("#tool-hash-post").addEventListener("change", function(evt) {
        if(evt.target.checked == true) {
            hashPost.forEach(v=>{v.style.display="inline"});
        } else {
            hashPost.forEach(v=>{v.style.display="none"});
        }
    });
    document.querySelector("#tool-cve-post").addEventListener("change", function(evt) {
        if(evt.target.checked == true) {
            cvePost.forEach(v=>{v.style.display="inline"});
        } else {
            cvePost.forEach(v=>{v.style.display="none"});
        }
    });
    document.querySelector("#tool-phone-post").addEventListener("change", function(evt) {
        if(evt.target.checked == true) {
            phonePost.forEach(v=>{v.style.display="inline"});
        } else {
            phonePost.forEach(v=>{v.style.display="none"});
        }
    });
    document.querySelector("#tool-asn-post").addEventListener("change", function(evt) {
        if(evt.target.checked == true) {
            asnPost.forEach(v=>{v.style.display="inline"});
        } else {
            asnPost.forEach(v=>{v.style.display="none"});
        }
    });

    document.getElementById("tool-icon").addEventListener("change", () => {
        let file = document.querySelector('input[type=file]')['files'][0];

        let reader = new FileReader();

        reader.onload = function () {
            base64String = reader.result.replace("data:", "")
                .replace(/^.+,/, "");

            let toolIconB64 = document.getElementById("tool-icon-b64");
            toolIconB64.value = "data:image/png;base64," + base64String;
        }

        reader.readAsDataURL(file);
    });

    // Populate a json object with the information entered in the form by the user
    document.getElementById("submit-btn").addEventListener("click", function() {
        resetErrors();
        let jsonCode = {
            "name": "",
            "url": {},
            "desc": "",
            "icon": "",
            "color": "",
            "types": [],
            "tags": []
        };

        jsonCode["name"] = document.getElementById("tool-name").value;
        
        if(!jsonCode["name"].match(/[A-z0-9-. ]{2,100}/g)) {
            showMessageError("tool-name", "Invalid name");
            return false;
        }

        jsonCode["desc"] = document.getElementById("tool-desc").value;

        if(!jsonCode["desc"].match(/[A-z0-9-. ]{0,256}/g)) {
            showMessageError("tool-desc", "Invalid description");
            return false;
        }
        
        const domURL = document.getElementById("tool-dom-url").value;
        const ipURL = document.getElementById("tool-ip-url").value;
        const urlURL = document.getElementById("tool-url-url").value;
        const emailURL = document.getElementById("tool-email-url").value;
        const hashURL = document.getElementById("tool-hash-url").value;
        const cveURL = document.getElementById("tool-cve-url").value;
        const phoneURL = document.getElementById("tool-phone-url").value;
        const asnURL = document.getElementById("tool-asn-url").value;
    
        let isUrl = false; // Check if the user provided at least one URL

        const urlRegex = new RegExp(/^(?:http[s]?):\/\/(((?!0)(?!.*\.$)((2[0-4][0-9]|25[0-5]|1[0-9][0-9]|[1-9][0-9]|\d)\.){3}(2[0-4][0-9]|25[0-5]|1[0-9][0-9]|[1-9][0-9]|\d))|((?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}))\b(?:[-a-zA-Z0-9@:%_\+.~#?&//=]*)$/);

        if(domURL != "") {
            if(!domURL.match(urlRegex)) {
                showMessageError("tool-dom-url", "Invalid URL");
                return false;
            }
            jsonCode["url"]["domain"] = domURL; 
            jsonCode["types"].push("domain");
            isUrl = true;
            if(document.getElementById("tool-dom-post").checked == true) {
                jsonCode["inputSelector"] = document.getElementById("tool-dom-input-csssel").value;
                if(jsonCode["inputSelector"] === "") {
                    showMessageError("tool-dom-input-csssel", "Invalid CSS selector");
                    return false;
                }

                jsonCode["submitQuery"] = document.getElementById("tool-dom-submit-csssel").value;
            }
        }
        if(ipURL != "") {
            if(!ipURL.match(urlRegex)) {
                showMessageError("tool-ip-url", "Invalid URL");
                return false;
            }
            jsonCode["url"]["ip"] = ipURL;
            jsonCode["types"].push("ip");
            isUrl = true;
            if(document.getElementById("tool-ip-post").checked == true) {
                jsonCode["inputSelector"] = document.getElementById("tool-ip-input-csssel").value;
                if(jsonCode["inputSelector"] === "") {
                    showMessageError("tool-ip-input-csssel", "Invalid CSS selector");
                    return false;
                }

                jsonCode["submitQuery"] = document.getElementById("tool-ip-submit-csssel").value;
            }
        }
        if(urlURL != "") {
            if(!urlURL.match(urlRegex)) {
                showMessageError("tool-url-url", "Invalid URL");
                return false;
            }
            jsonCode["url"]["url"] = urlURL;
            jsonCode["types"].push("url");
            isUrl = true;
            if(document.getElementById("tool-url-post").checked == true) {
                jsonCode["inputSelector"] = document.getElementById("tool-url-input-csssel").value;
                if(jsonCode["inputSelector"] === "") {
                    showMessageError("tool-url-input-csssel", "Invalid CSS selector");
                    return false;
                }

                jsonCode["submitQuery"] = document.getElementById("tool-url-submit-csssel").value;
            }
        }
        if(emailURL != "") {
            if(!emailURL.match(urlRegex)) {
                showMessageError("tool-email-url", "Invalid URL");
                return false;
            }
            jsonCode["url"]["email"] = emailURL;
            jsonCode["types"].push("email");
            isUrl = true;
            if(document.getElementById("tool-email-post").checked == true) {
                jsonCode["inputSelector"] = document.getElementById("tool-email-input-csssel").value;
                if(jsonCode["inputSelector"] === "") {
                    showMessageError("tool-email-input-csssel", "Invalid CSS selector");
                    return false;
                }

                jsonCode["submitQuery"] = document.getElementById("tool-email-submit-csssel").value;
            }
        }
        if(hashURL != "") {
            if(!hashURL.match(urlRegex)) {
                showMessageError("tool-hash-url", "Invalid URL");
                return
            }
            jsonCode["url"]["hash"] = hashURL;
            jsonCode["types"].push("hash");
            isUrl = true;
            if(document.getElementById("tool-hash-post").checked == true) {
                jsonCode["inputSelector"] = document.getElementById("tool-hash-input-csssel").value;
                if(jsonCode["inputSelector"] === "") {
                    showMessageError("tool-hash-input-csssel", "Invalid CSS selector");
                    return false;
                }

                jsonCode["submitQuery"] = document.getElementById("tool-hash-submit-csssel").value;
            }
        }
        if(cveURL != "") {
            if(!cveURL.match(urlRegex)) {
                showMessageError("tool-cve-url", "Invalid URL");
                return
            }
            jsonCode["url"]["cve"] = cveURL;
            jsonCode["types"].push("cve");
            isUrl = true;
            if(document.getElementById("tool-cve-post").checked == true) {
                jsonCode["inputSelector"] = document.getElementById("tool-cve-input-csssel").value;
                if(jsonCode["inputSelector"] === "") {
                    showMessageError("tool-cve-input-csssel", "Invalid CSS selector");
                    return false;
                }

                jsonCode["submitQuery"] = document.getElementById("tool-cve-submit-csssel").value;
            }
        }
        if(phoneURL != "") {
            if(!phoneURL.match(urlRegex)) {
                showMessageError("tool-phone-url", "Invalid URL");
                return
            }
            jsonCode["url"]["phone"] = phoneURL;
            jsonCode["types"].push("phone");
            isUrl = true;
            if(document.getElementById("tool-phone-post").checked == true) {
                jsonCode["inputSelector"] = document.getElementById("tool-phone-input-csssel").value;
                if(jsonCode["inputSelector"] === "") {
                    showMessageError("tool-phone-input-csssel", "Invalid CSS selector");
                    return false;
                }

                jsonCode["submitQuery"] = document.getElementById("tool-phone-submit-csssel").value;
            }
        }
        if(asnURL != "") {
            if(!asnURL.match(urlRegex)) {
                showMessageError("tool-asn-url", "Invalid URL");
                return
            }
            jsonCode["url"]["asn"] = asnURL;
            jsonCode["types"].push("asn");
            isUrl = true;
            if(document.getElementById("tool-asn-post").checked == true) {
                jsonCode["inputSelector"] = document.getElementById("tool-asn-input-csssel").value;
                if(jsonCode["inputSelector"] === "") {
                    showMessageError("tool-asn-input-csssel", "Invalid CSS selector");
                    return false;
                }

                jsonCode["submitQuery"] = document.getElementById("tool-asn-submit-csssel").value;
            }
        }

        if(!isUrl) {
            showMessageError("url-title", "You must provide at least one URL");
            document.getElementById("url-title").style.outline = "none";
            return;
        }

        let selectedTags = [];

        document.querySelectorAll("input[type=checkbox].type_select").forEach((e)=>{
            if(e.checked) {
                jsonCode["tags"].push(e.value);
            }
        });

        let imageBase64 = document.getElementById("tool-icon-b64");
        if(imageBase64.value) {
            jsonCode["icon"] =  imageBase64.value;

        } else {
            showMessageError("tool-icon", "You must provide an icon");
            return false;
        }
        jsonCode["color"] = document.getElementById("tool-color").value;


        if(localStorage.getItem("tools-ext")){
            tools = JSON.parse(localStorage.getItem("tools-ext"));
        } else {
            tools = [];
        }

        // Check for duplicates
        for(var i=0; i<tools.length; i++) {
            if(tools[i]["name"] == jsonCode["name"]) {
                if(!update) {
                    showMessageError("tool-name", "The name is already in use");
                    return false;
                } else {
                    tools[i] = jsonCode;
                    localStorage.setItem("tools-ext", JSON.stringify(tools));
                    showCustomToolsList();
                    resetForm();
                    resetPage();
                    return true;
                }
            }
        }
        tools.push(jsonCode);
        localStorage.setItem("tools-ext", JSON.stringify(tools));
        showCustomToolsList();
        resetForm();
        resetPage();
    });

    document.getElementById("reset-btn").addEventListener("click", function(evt) {
        resetForm();
    });

    document.querySelector("#add-res-button").addEventListener("click", (evt) => {
        document.querySelector("#main-pane").style.display = "none";
        document.querySelector("#form-pane").style.display = "block";
        document.querySelector("#cancel-button").style.display = "block";
        document.querySelector("#del-res-button").style.display = "none";
        document.querySelector("#add-res-button").style.display = "none";
        document.querySelector("#edit-res-button").style.display = "none";
        document.querySelector("#export-button").style.display = "none";
        document.querySelector("#export-all-button").style.display = "block";
    });

    document.querySelector("#del-res-button").addEventListener("click", (evt) => {
        if(confirm("Are you sure to delete this resource? The action cannot be undone") == true) {
            const toolsList = JSON.parse(localStorage.getItem("tools-ext"));
            toolsList.splice(selectedResource,1);
            localStorage.setItem("tools-ext", JSON.stringify(toolsList));
            showCustomToolsList();
            selectedResource = -1;
            resetForm();
            resetPage();
        }
    });

    document.querySelector("#export-all-button").addEventListener("click", (evt) => {
        const toolsList = JSON.parse(localStorage.getItem("tools-ext", '{}'));
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(toolsList, null, 2));
        let exportLink = document.createElement("a");
        exportLink.setAttribute("href", dataStr);
        exportLink.setAttribute("download", "custom-tools.json");
        exportLink.click();
    });

    document.querySelector("#export-button").addEventListener("click", (evt) => {
        const toolsList = JSON.parse(localStorage.getItem("tools-ext", '[]'));
        const tool = toolsList[selectedResource];
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tool, null, 2));
        let exportLink = document.createElement("a");
        exportLink.setAttribute("href", dataStr);
        exportLink.setAttribute("download", "custom-tools.json");
        exportLink.click();
    });

    document.querySelector("#cancel-button").addEventListener("click", (evt) => {
        let resp = false;
        const formPaneDisplay = document.querySelector("#form-pane").style.display;
        if(formPaneDisplay === "none" || formPaneDisplay == "") {
            resp = true;
        } else {
            resp = confirm("Are you sure to cancel? All changes will be lost");
        }

        if(resp) {
            document.querySelector("#main-pane").style.display = "block";
            document.querySelector("#form-pane").style.display = "none";
            document.querySelector("#cancel-button").style.display = "none";
            document.querySelector("#del-res-button").style.display = "none";
            document.querySelector("#add-res-button").style.display = "block";
            document.querySelector("#edit-res-button").style.display = "none";
            document.querySelector("#export-button").style.display = "none";
            document.querySelector("#export-all-button").style.display = "block";
            document.querySelectorAll(".tool-entry").forEach( v => v.style.outline = "none" );
            resetForm();
            resetPage();
        }
    });

    document.querySelector("#import-template-button").addEventListener("mouseenter", (evt) => {
        document.querySelector("#template-options").style.display = "block";
    });

    document.querySelector("#import-template-button").addEventListener("mouseleave", (evt) => {
        const templateOptions = document.querySelector("#template-options");
        templateOptions.style.display = "block";
        if (!templateOptions.contains(evt.relatedTarget)) {
            templateOptions.style.display = "none";
        }
    });

    document.querySelector("#template-options").addEventListener("mouseleave", (evt) => {
        const templateOptions = document.querySelector("#template-options");
        if (!templateOptions.contains(evt.relatedTarget)) {
            templateOptions.style.display = "none";
        }
    });


    document.querySelector("#misp-template").addEventListener("click", (evt) => {
        createFormPopup('./icons/misp.png', "Add MISP", "MISP", ()=>{
            tools = JSON.parse(localStorage.getItem("tools-ext")) || [];


            for(const [key, value] of Object.entries(mispTemplate["url"])) {
                mispTemplate["url"][key] = value.replace("%h", document.querySelector("#template-form-hostname").value);
                if(document.querySelector("#template-http").checked) {
                    mispTemplate["url"][key] = mispTemplate["url"][key].replace('https://', 'http://');
                } else {
                    mispTemplate["url"][key] = mispTemplate["url"][key].replace('http://', 'https://');
                }
            }
            mispTemplate["name"] = document.querySelector("#template-form-name").value;
            // Check for duplicates
            for(var i=0; i<tools.length; i++) {
                if(tools[i]["name"] == mispTemplate["name"]) {
                    alert("The name is already in use");
                    return false;
                }
            }
            tools.push(mispTemplate);
            localStorage.setItem("tools-ext", JSON.stringify(tools));
            showCustomToolsList();
        });
    });

    document.querySelector("#opencti-template").addEventListener("click", (evt) => {
        createFormPopup('./icons/opencti.png', "Add OpenCTI", "OpenCTI", ()=>{
            tools = JSON.parse(localStorage.getItem("tools-ext")) || [];

            for(const [key, value] of Object.entries(openctiTemplate["url"])) {
                openctiTemplate["url"][key] = value.replace("%h", document.querySelector("#template-form-hostname").value);
                if(document.querySelector("#template-http").checked) {
                    openctiTemplate["url"][key] = openctiTemplate["url"][key].replace('https://', 'http://');
                } else {
                    openctiTemplate["url"][key] = openctiTemplate["url"][key].replace('http://', 'https://');
                }
            }
            openctiTemplate["name"] = document.querySelector("#template-form-name").value;
            // Check for duplicates
            for(var i=0; i<tools.length; i++) {
                if(tools[i]["name"] == openctiTemplate["name"]) {
                    alert("The name is already in use");
                    return false;
                }
            }
            tools.push(openctiTemplate);
            localStorage.setItem("tools-ext", JSON.stringify(tools));
            showCustomToolsList();
        });
    });

    document.querySelector("#yeti-template").addEventListener("click", (evt) => {
        createFormPopup('./icons/yeti.png', "Add YETI", "YETI", ()=>{
            tools = JSON.parse(localStorage.getItem("tools-ext")) || [];

            for(const [key, value] of Object.entries(yetiTemplate["url"])) {
                yetiTemplate["url"][key] = value.replace("%h", document.querySelector("#template-form-hostname").value);
                if(document.querySelector("#template-http").checked) {
                    yetiTemplate["url"][key] = yetiTemplate["url"][key].replace('https://', 'http://');
                } else {
                    yetiTemplate["url"][key] = yetiTemplate["url"][key].replace('http://', 'https://');
                }
            }
            yetiTemplate["name"] = document.querySelector("#template-form-name").value;
            // Check for duplicates
            for(var i=0; i<tools.length; i++) {
                if(tools[i]["name"] == yetiTemplate["name"]) {
                    alert("The name is already in use");
                    return false;
                }
            }
            tools.push(yetiTemplate);
            localStorage.setItem("tools-ext", JSON.stringify(tools));
            showCustomToolsList();
        });
    });

}

