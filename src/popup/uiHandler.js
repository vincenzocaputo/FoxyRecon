// Set tools icons folder base path
const toolsIcoBasePath = "/assets/tools-icons/"

// Set types for popup messages
const MessageType = {
    INFO: 0,
    WARNING: 1,
    ERROR: 2
}

var tools;
loadToolsList(function(ts){
    tools = ts;
    createToolsList(tools);
});


/**
 * Show message in a popup
 * @param{message} message to show
 * @param{messageType} type of the message (error, warning, info)
 */
function showMessagePopup(message, messageType) {
    popupText = document.getElementById("popup-text");

    classes = ["info-popup-text", "warn-popup-text", "error-popup-text"];

    popupText.classList.remove(...classes);
    // Set message
    popupText.textContent = message;
    // Set color, according to the message type
    if(messageType == MessageType.ERROR) {
        popupText.classList.add(classes[MessageType.ERROR]);
        document.getElementById("text-field").style.borderColor = "#FF0000";
    } else if(messageType == MessageType.WARNING) {
        popupText.classList.add(classes[MessageType.WARNING]);
        document.getElementById("text-field").style.borderColor = "#FFDD00";
    }
    popupText.style.display = "block";
}


/**
 * Show add-on logo
 */
function showAddonLogo() {
    document.getElementById("tools-list").style.display = "none";
    document.getElementById("popup-text").style.display = "none";
    // Restore text field border color
    document.getElementById("text-field").style.borderColor = "#6E6C69";
    document.getElementById("addon-logo").style.display = "block";
    // Hide filter dropdown menu
    document.getElementById("filter-container").style.display = "none";
}


/**
 * Show only the tools that are appropriate for the indicator
 * @param {indicator} indicator entered by the user
 * @param {type} indicator type (domain, ip, url, etc.)
 * @param {tag} web resource tag (for filtering results)
 */
function showButtonsByType(indicator, type, tag) {
    document.getElementById("filter-container").style.display = "block";
    document.getElementById("popup-text").style.display = "none";
    document.getElementById("text-field").style.borderColor = "#6E6C69";
    document.getElementById("addon-logo").style.display = "none";
    // This node contains the list of tools
    const toolsListNodes = document.getElementById("tools-list");
    toolsListNodes.style.display = "block";
    const resNodes = toolsListNodes.children;

    let tagsOptions = [];

    for (i = 0; i < resNodes.length; i++) {
        if (tools[i]["types"].includes(type)) { 
            tagsOptions = tagsOptions.concat(tools[i]["tags"]);
            
            if (tag === "all" || (tools[i]["tags"] && tools[i]["tags"].includes(tag))) {
                resNodes[i].style.display = "block";
                // Set tool description to div title
                resNodes[i].title = tools[i]["desc"];
                // Replace the placholder with the input string
                let url = tools[i]["url"][type];
                url = cookURL(url, indicator);
                resNodes[i].url = url;

                resNodes[i].submitQuery = tools[i]["submitQuery"];
            } else  {
                resNodes[i].style.display = "none";
            }
        } else {
            // If this tools does not support this indicator type, hide its button
            resNodes[i].style.display = "none";
        }
    }

    // If the indicator is an URL or email, show tool icon inside text field
    textFieldIcon = document.querySelector("#text-field>img");
    if(type === "url" || type === "email") {
        textFieldIcon.style.display = "block";
    } else {
        textFieldIcon.style.display = "none";
    }

    createTagsOptionsList([...new Set(tagsOptions)]);

}


/**
 * Create filter by tags dropdown menu options
 * @param {tagsOptions} list of tags
 */
function createTagsOptionsList(tagsOptions) {
    const tagsOptionsList = document.querySelectorAll("#filter-container>select option");
    let options = [];
    
    for (i = 0; i < tagsOptionsList.length; i++) {
        // Hide option if it is not in current options list
        if (tagsOptionsList[i].value != "all" && !tagsOptions.includes(tagsOptionsList[i].value)) {
            tagsOptionsList[i].style.display = "none";
        }
    }

    for (i = 0; i < tagsOptions.length; i++) {
        // Check if option is already present
        const opt = document.querySelector("#filter-container>select option[value="+tagsOptions[i]+"]");
        if (opt) {
            if (opt.style.display === "none") {
                opt.style.display = "block";
            }
        } else if (tagsOptions[i]) {
            // Create option
            let option = document.createElement("option");
            option.text = tagsOptions[i];
            option.value = tagsOptions[i];
            document.querySelector("#filter-container>select").appendChild(option);
        }
    }
}


/**
 * Create the tools list inside the popup
 * @param {toolsList} tools list
 */
function createToolsList(toolsList){
    var resultBox = document.getElementById("tools-list");
	for (i=0;i<toolsList.length;i++) {
        let tool = toolsList[i];
        let node = document.createElement('div');
        
        node.classList.add("tool-entry");
        node.style.display = "none";        
        
        // Create node that will contain the link to the web resource
        let nodeHyperlink = document.createElement('a');
        nodeHyperlink.setAttribute("target","_blank");
        
        // This node will contain the resource's icon
        let nodeImageContainer = document.createElement("div");
        nodeImageContainer.classList.add("tool-icon");
   
        let nodeImage = document.createElement("img");

        nodeImage.setAttribute("src", toolsIcoBasePath + toolsList[i]["icon"]);

        // This node will contain the web resource's name
        let nodeText = document.createElement("div");

        nodeText.textContent = toolsList[i]["name"];
        
        // If the name is too long, reduce the font size
        if(toolsList[i]["name"].length > 15 && toolsList[i]["name"].length < 20) {
            nodeText.style.fontSize = "6vw";
        } else if(toolsList[i]["name"].length > 19) {
            nodeText.style.fontSize = "5vw";
        }
        nodeText.classList.add("tool-name");

        // Set button colors
        let color = toolsList[i]["color"];
        if (color != null) {
            node.style.backgroundColor = color;
            nodeText.style.backgroundColor = color;
        }
        
        // If the web resource has tags, add more space for them
        tags = toolsList[i]["tags"];
        if(tags) {
            nodeText.classList.add("tool-name-with-tags");
            // Add container for tags
            let nodeTagsContainer = document.createElement("div");
            nodeTagsContainer.classList.add("tool-tags-container");
            // Add a node for each tag
            for(tagIdx=0; tagIdx<tags.length; tagIdx++) {
                let nodeTag = document.createElement("div");
                // Tag to upper case
                nodeTag.textContent = tags[tagIdx].toUpperCase();
                nodeTag.classList.add("tool-tag");
                // Add transparency
                nodeTag.style.backgroundColor = "rgba(256, 256, 256, 0.3)";
                nodeTagsContainer.appendChild(nodeTag);
                nodeText.insertAdjacentElement("beforeend", nodeTagsContainer);
            }
        }

        nodeImageContainer.appendChild(nodeImage);
        nodeHyperlink.appendChild(nodeImageContainer);
        nodeHyperlink.appendChild(nodeText);
        node.appendChild(nodeHyperlink);

        // Set click event function
        node.addEventListener("click", function() {
            settingsPopup = document.getElementById("settings-popup");
            // If settings popup is opened, don't allow clicking 
            if(node.url && settingsPopup.style.display != "block") {
                newtab = localStorage.getItem("settings.newtab");
                
                if(node.submitQuery) {
                    localStorage.setItem("submit-btn-query", node.submitQuery);
                } else {
                    localStorage.setItem("submit-btn-query", "");
                }

                if(!newtab || newtab === "true") {
                    // Open web resource in a new tab
                    browser.tabs.create({
                        url: node.url
                    });
                } else {
                    // Otherwise open in current tab
                    browser.tabs.update({
                        url: node.url
                    });
                }
                // close popup
                window.close();
            }
        });
        document.getElementById("tools-list").appendChild(node);
    }
}
