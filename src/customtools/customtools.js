var update = false;

function showMessageError(err_msg) {
    document.getElementById("error-box-message").textContent = err_msg;
    document.getElementById("error-box").style.display = "block";

}


/**
 * Show the list of the web resources created by the user
 */
function showCustomToolsList() {
    const toolsListNodes = document.getElementById("tools-list");
    toolsListNodes.textContent = ''; // Remove nodes already potentially present
    const toolsList = JSON.parse(localStorage.getItem("tools-ext"));
    if(toolsList == null) {
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

        deleteIconContainer = document.createElement("div");
        deleteIconContainer.classList.add("tool-del-icon");
        deleteIconNode = document.createElement("img");

        deleteIconNode.src = "../../assets/icons/delete.png";
        deleteIconNode.title = "Delete tool";
        deleteIconNode.index = i;
        deleteIconNode.addEventListener("click", function(e) {
            const res = confirm("Are you sure you want to delete this web resource?");
            if(res) {
                toolsList.splice(e.target.index,1);
                localStorage.setItem("tools-ext", JSON.stringify(toolsList));
                showCustomToolsList();
            }

        });
    
        node.id = i;
        // If the user clicks on a tool in the list, fill the form with the information related to the selected tool
        node.addEventListener("click", function(e) {
            resetForm();
            update = true;
            document.querySelector("#submit-btn").textContent = "Update tool";
            const tool = toolsList[e.currentTarget.id];
            document.getElementById("tool_name").value = tool["name"];
            document.getElementById("tool_name").readOnly = true;
            document.getElementById("tool_desc").value = tool["desc"];
            if(tool["url"]["domain"]) {
                document.getElementById("tool_dom_url").value = tool["url"]["domain"];
                if(tool["submitQuery"]) {
                    document.getElementById("tool_dom_csssel").value = tool["submitQuery"] || "";
                    document.getElementById("tool_dom_post").checked = true;
                    document.getElementById("tool_dom_post").dispatchEvent(new Event("change"));
                }
            }
            if(tool["url"]["ip"]) {
                document.getElementById("tool_ip_url").value = tool["url"]["ip"];
                if(tool["submitQuery"]) {
                    document.getElementById("tool_ip_csssel").value = tool["submitQuery"] || "";
                    document.getElementById("tool_ip_post").checked = true;
                    document.getElementById("tool_ip_post").dispatchEvent(new Event("change"));
                }
            }
            if(tool["url"]["url"]) {
                document.getElementById("tool_url_url").value = tool["url"]["url"];
                if(tool["submitQuery"]) {
                    document.getElementById("tool_url_csssel").value = tool["submitQuery"] || "";
                    document.getElementById("tool_url_post").checked = true;
                    document.getElementById("tool_url_post").dispatchEvent(new Event("change"));
                }
            }
            if(tool["url"]["email"]) {
                document.getElementById("tool_email_url").value = tool["url"]["email"];
                if(tool["submitQuery"]) {
                    document.getElementById("tool_email_csssel").value = tool["submitQuery"] || "";
                    document.getElementById("tool_email_post").checked = true;
                    document.getElementById("tool_email_post").dispatchEvent(new Event("change"));
                }
            }
            if(tool["url"]["hash"]) {
                document.getElementById("tool_hash_url").value = tool["url"]["hash"];
                if(tool["submitQuery"]) {
                    document.getElementById("tool_hash_csssel").value = tool["submitQuery"] || "";
                    document.getElementById("tool_hash_post").checked = true;
                    document.getElementById("tool_hash_post").dispatchEvent(new Event("change"));
                }
            }
            if(tool["url"]["cve"]) {
                document.getElementById("tool_cve_url").value = tool["url"]["cve"];
                if(tool["submitQuery"]) {
                    document.getElementById("tool_cve_csssel").value = tool["submitQuery"] || "";
                    document.getElementById("tool_cve_post").checked = true;
                    document.getElementById("tool_cve_post").dispatchEvent(new Event("change"));
                }
            }
            document.getElementById("tool_icon").value = tool["icon"].replace("data:image/png;base64,","") || "";
            document.getElementById("tool_color").value = tool["color"];

            tool["tags"].forEach((e)=>{
                document.querySelector(`input[value=${e}]`).checked = true;
            });
        });



        deleteIconContainer.appendChild(deleteIconNode);

        nodeImageContainer.appendChild(nodeImage);
        node.appendChild(nodeImageContainer);
        node.appendChild(nodeText);
        optionsContainer.appendChild(deleteIconContainer);
        node.appendChild(optionsContainer);
        toolsListNodes.appendChild(node);

    }
}

/**
 * Reset the input form
 */
function resetForm() {
    document.querySelectorAll("input[type=text],textarea,input[type=color]").forEach((e)=>e.value = "");
    document.querySelectorAll("input[type=checkbox]").forEach((e)=>{e.checked=false; e.dispatchEvent(new Event("change"))});
    document.querySelector("#submit-btn").textContent = "Add tool";
    update = false;
    document.getElementById("tool_name").readOnly = false;
}


window.onload = function() {
    resetForm();
    showCustomToolsList();

    let dom_post_row = document.querySelector("#dom_post_row");
    let ip_post_row = document.querySelector("#ip_post_row");
    let url_post_row = document.querySelector("#url_post_row");
    let email_post_row = document.querySelector("#email_post_row");
    let hash_post_row = document.querySelector("#hash_post_row");
    let cve_post_row = document.querySelector("#cve_post_row");

    // Hide css selector input field, as the post checkbox are disabled by default
    dom_post_row.style.display="none";
    ip_post_row.style.display="none";
    url_post_row.style.display="none";
    email_post_row.style.display="none";
    hash_post_row.style.display="none";
    cve_post_row.style.display="none";

    // Post checkbox change events. If checked, show the related input field
    document.querySelector("#tool_dom_post").addEventListener("change", function(evt) {
        if(evt.target.checked == true) {
            dom_post_row.style.display = "block";
        } else {
            dom_post_row.style.display="none";
        }
    });
    document.querySelector("#tool_ip_post").addEventListener("change", function(evt) {
        if(evt.target.checked == true) {
            ip_post_row.style.display = "block";
        } else {
            ip_post_row.style.display="none";
        }
    });
    document.querySelector("#tool_url_post").addEventListener("change", function(evt) {
        if(evt.target.checked == true) {
            url_post_row.style.display = "block";
        } else {
            url_post_row.style.display="none";
        }
    });
    document.querySelector("#tool_email_post").addEventListener("change", function(evt) {
        if(evt.target.checked == true) {
            email_post_row.style.display = "block";
        } else {
            email_post_row.style.display="none";
        }
    });
    document.querySelector("#tool_hash_post").addEventListener("change", function(evt) {
        if(evt.target.checked == true) {
            hash_post_row.style.display = "block";
        } else {
            hash_post_row.style.display="none";
        }
    });
    document.querySelector("#tool_cve_post").addEventListener("change", function(evt) {
        if(evt.target.checked == true) {
            cve_post_row.style.display = "block";
        } else {
            cve_post_row.style.display="none";
        }
    });

    // Populate a json object with the information entered in the form by the user
    document.getElementById("submit-btn").addEventListener("click", function() {
        let jsonCode = {
            "name": "",
            "url": {},
            "desc": "",
            "icon": "",
            "color": "",
            "types": [],
            "tags": []
        };

        jsonCode["name"] = document.getElementById("tool_name").value;
        
        if(!jsonCode["name"].match(/[A-z0-9-. ]{2,100}/g)) {
            showMessageError("Invalid name");
            return;
        }

        jsonCode["desc"] = document.getElementById("tool_desc").value;

        if(!jsonCode["desc"].match(/[A-z0-9-. ]{0,256}/g)) {
            showMessageError("Invalid description");
            return;
        }
        
        const domURL = document.getElementById("tool_dom_url").value;
        const ipURL = document.getElementById("tool_ip_url").value;
        const urlURL = document.getElementById("tool_url_url").value;
        const emailURL = document.getElementById("tool_email_url").value;
        const hashURL = document.getElementById("tool_hash_url").value;
        const cveURL = document.getElementById("tool_cve_url").value;
       
        let isUrl = false; // Check if the user provided at least one URL
        const urlRegex = /http(?:s)?:\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/g
        if(domURL != "") {
            if(!domURL.match(urlRegex)) {
                showMessageError("Invalid URL");
                return
            }
            jsonCode["url"]["domain"] = domURL; 
            jsonCode["types"].push("domain");
            isUrl = true;
            // If the post checkbox is checked, put the input field value in "submitQuery" attribute
            if(document.getElementById("tool_dom_post").checked == true) {
                jsonCode["submitQuery"] = document.getElementById("tool_dom_csssel").value;
                if(jsonCode["submitQuery"] === "") {
                    showMessageError("Invalid CSS selector");
                    return;
                }
            }
        }
        if(ipURL != "") {
            if(!ipURL.match(urlRegex)) {
                showMessageError("Invalid URL");
                return
            }
            jsonCode["url"]["ip"] = ipURL;
            jsonCode["types"].push("ip");
            isUrl = true;
            if(document.getElementById("tool_ip_post").checked == true) {
                jsonCode["submitQuery"] = document.getElementById("tool_ip_csssel").value;
                if(jsonCode["submitQuery"] === "") {
                    showMessageError("Invalid CSS selector");
                    return;
                }
            }
        }
        if(urlURL != "") {
            if(!urlURL.match(urlRegex)) {
                showMessageError("Invalid URL");
                return
            }
            jsonCode["url"]["url"] = urlURL;
            jsonCode["types"].push("url");
            isUrl = true;
            if(document.getElementById("tool_url_post").checked == true) {
                jsonCode["submitQuery"] = document.getElementById("tool_url_csssel").value;
                if(jsonCode["submitQuery"] === "") {
                    showMessageError("Invalid CSS selector");
                    return;
                }
            }
        }
        if(emailURL != "") {
            if(!emailURL.match(urlRegex)) {
                showMessageError("Invalid URL");
                return
            }
            jsonCode["url"]["email"] = emailURL;
            jsonCode["types"].push("email");
            isUrl = true;
            if(document.getElementById("tool_email_post").checked == true) {
                jsonCode["submitQuery"] = document.getElementById("tool_email_csssel").value;
                if(jsonCode["submitQuery"] === "") {
                    showMessageError("Invalid CSS selector");
                    return;
                }
            }
        }
        if(hashURL != "") {
            if(!hashURL.match(urlRegex)) {
                showMessageError("Invalid URL");
                return
            }
            jsonCode["url"]["hash"] = hashURL;
            jsonCode["types"].push("hash");
            isUrl = true;
            if(document.getElementById("tool_hash_post").checked == true) {
                jsonCode["submitQuery"] = document.getElementById("tool_hash_csssel").value;
                if(jsonCode["submitQuery"] === "") {
                    showMessageError("Invalid CSS selector");
                    return;
                }
            }
        }
        if(cveURL != "") {
            if(!cveURL.match(urlRegex)) {
                showMessageError("Invalid URL");
                return
            }
            jsonCode["url"]["cve"] = cveURL;
            jsonCode["types"].push("cve");
            isUrl = true;
            if(document.getElementById("tool_cve_post").checked == true) {
                jsonCode["submitQuery"] = document.getElementById("tool_cve_csssel").value;
                if(jsonCode["submitQuery"] === "") {
                    showMessageError("Invalid CSS selector");
                    return;
                }
            }
        }

        if(!isUrl) {
            showMessageError("You must provide at least one URL");
            return;
        }

        let selectedTags = [];

        document.querySelectorAll("input[type=checkbox].type_select").forEach((e)=>{
            if(e.checked) {
                jsonCode["tags"].push(e.value);
            }
        });

        let tool_icon = document.getElementById("tool_icon").value;
        if(tool_icon) {
            jsonCode["icon"] = "data:image/png;base64," + tool_icon;
        } else {
            showMessageError("You must provide an icon");
            return;
        }
        
        if(!jsonCode["icon"].match(/(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?/g)) {
            showMessageError("Invalid Base 64");
            return;
        }

//        let i = new Image();
//        i.src = jsonCode["icon"];
//        if(i.width > 64 || i.height > 64) {
//            showMessageError("The image must have a maximum size of 64x64 pixels");
//            return;
//        }

        jsonCode["color"] = document.getElementById("tool_color").value;


        document.getElementById("error-box").style.display = "none";
        if(localStorage.getItem("tools-ext")){
            tools = JSON.parse(localStorage.getItem("tools-ext"));
        } else {
            tools = [];
        }

        console.log(JSON.stringify(jsonCode));
        // Check for duplicates
        for(var i=0; i<tools.length; i++) {
            if(tools[i]["name"] == jsonCode["name"]) {
                if(!update) {
                    showMessageError("The name is already in use");
                    return;
                } else {
                    tools[i] = jsonCode;
                    localStorage.setItem("tools-ext", JSON.stringify(tools));
                    showCustomToolsList();
                    return;
                }
            }
        }
        tools.push(jsonCode);
        localStorage.setItem("tools-ext", JSON.stringify(tools));
        showCustomToolsList();
    });

    document.getElementById("reset-btn").addEventListener("click", function(evt) {
        resetForm();
    });
}
