// Get addon version from manifest
var manifest = browser.runtime.getManifest();
document.getElementById("version-tag").textContent = "Version "+manifest.version;

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

var inputField = document.getElementById("input-box");

indicatorParser = new IndicatorParser();

// Check if the input string is in local storage
if(!localStorage.getItem("indicator")) {
    inputField.focus();
} else {
    // If there is a saved state, restore it
    indicator = localStorage.getItem("indicator");
    // Put the indicator in the text field
    inputField.value = indicator;
    // Restore the type of the string
    type = localStorage.getItem("type");
    // Show the buttons related to the tools that support this indicator
    showButtonsByType(type, indicator);
}


var textfieldTool = document.querySelector("#text-field>img");
textfieldTool.title = "Extract domain";
textfieldTool.addEventListener("click", function() {
    let inputString = document.getElementById("input-box").value;
    let domain = indicatorParser.getDomain(inputString);
    
    document.getElementById("input-box").value = domain;

    // Show the appropriate tools for the input provided
    showButtonsByType("domain", domain);
    // Save the current indicator along with its type
    localStorage.setItem("indicator", domain);
    localStorage.setItem("type", "domain");
});

// For each charachter typed, check if the string is a valid input
inputField.addEventListener("keyup", (e) => {
    let inputString = document.getElementById("input-box").value;
    console.log(inputString);
    // If no input was provided, show the add-on logo
    if(inputString == "") {
        showAddonLogo();
    }
    // Get indicator type
    let type = indicatorParser.getIndicatorType(inputString);
    if(type === "invalid") {
        showAddonLogo();
        showMessagePopup("Please enter a valid indicator", MessageType.ERROR);
    } else if(type === "internal") {
        showAddonLogo();
        showMessagePopup("The IP address is internal", MessageType.WARNING);
    } else {
        // Show the appropriate tools for the input provided
        showButtonsByType(type, inputString);
        // Save the current indicator along with its type
        localStorage.setItem("indicator", inputString);
        localStorage.setItem("type", type);
    }
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
}



/**
 * Show only the tools that are appropriate for the indicator
 * @param {type} indicator type (domain, ip, url, etc.)
 * @param {indicator} indicator entered by the user
 */
function showButtonsByType(type, indicator) {
    let visibility;
    
    document.getElementById("popup-text").style.display = "none";
    document.getElementById("text-field").style.borderColor = "#6E6C69";
    document.getElementById("addon-logo").style.display = "none";
    // This node contains the list of tools
    let toolsListNodes = document.getElementById("tools-list");
    toolsListNodes.style.display = "block";
    let resNodes = toolsListNodes.children;

    for (var i = 0; i < resNodes.length; i++) {
        if (tools[i]["types"].includes(type)) {            
            resNodes[i].style.display = "block";
            // Set tool description to div title
            resNodes[i].title = tools[i]["desc"];
            // Replace the placholder with the input string
            let url = tools[i]["url"][type];
            url = cookURL(url, indicator);
            resNodes[i].url = url;

            resNodes[i].submitQuery = tools[i]["submitQuery"];
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

        nodeImage.setAttribute("src", toolsList[i]["icon"]);

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


/**
 * Show or hide settings popup menu
 */
document.getElementById("settings-button").addEventListener("click", function() {
    settingsPopup = document.getElementById("settings-popup");
    if(!settingsPopup.style.display || settingsPopup.style.display == "none" ) {
        // Don't show pointer cursor on buttons
        document.querySelectorAll(".tool-entry").forEach(function(entry) {
            entry.style.cursor = "default";
        });

        settingsPopup.style.display = "block";

        newtabOption = localStorage.getItem("settings.newtab");
        if(!newtabOption) {
            // Default option: open always a new tab
            newtabOption = "true";
        }
        // Set checkbox saved value
        checkbox = document.querySelector("#settings-container input");
        checkbox.checked = (newtabOption === "true");
        localStorage.setItem("settings.newtab", newtabOption);
    } else {
        // Show pointer cursor on buttons
        document.querySelectorAll(".tool-entry").forEach(function(entry) {
            entry.style.cursor = "pointer";
        });
        settingsPopup.style.display = "none";
    }
});

document.addEventListener("click", function(evt) {
    settingsPopup = document.getElementById("settings-popup");
    settingsButton = document.getElementById("settings-button");

    if(settingsPopup.style.display == "block") {
        buttonPos = settingsButton.getBoundingClientRect();
        popupPos = settingsPopup.getBoundingClientRect();
        // Check if the user has clicked outside the popup
        if(((evt.pageX < popupPos.left || evt.pageX > popupPos.right) || 
            (evt.pageY < popupPos.top || evt.pageY > popupPos.bottom)) &&
            ((evt.pageX < buttonPos.left || evt.pageX > buttonPos.right) || 
            (evt.pageY < buttonPos.top || evt.pageY > buttonPos.bottom))) {
            // Fire settings button click event
            document.getElementById("settings-button").click();
        }
    }
});

/**
 * Handle settings checkbox change event
 */
document.querySelector("#settings-popup input").addEventListener("change", function(evt) {
    let linksNodes = document.getElementById("tools-list").children;
    newtabOption = evt.target.checked;
    localStorage.setItem("settings.newtab", newtabOption);
});
