// Get addon version from manifest
var manifest = browser.runtime.getManifest();
document.getElementById("version-tag").innerHTML = "Version "+manifest.version;

var tools;
loadToolsList(function(ts){
    tools = ts;
    createToolsList(tools);
});

var inputField = document.getElementById("input-box")


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


// For each charachter typed, check if the string is a valid input
inputField.addEventListener("keyup", (e) => {
	let inputString = document.getElementById("input-box").value;
    let type = IndicatorTypeDetector.getIndicatorType(inputString);
    // Show the appropriate tools for the input
    showButtonsByType(type, inputString);
    // Save the popup state (indicator + type)
    localStorage.setItem("indicator", inputString);
    localStorage.setItem("type", type);
});

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

        nodeImage.setAttribute("src",tool["icon"]);

        // This node will contain the web resource's name
        let nodeText = document.createElement("div");

        nodeText.innerHTML = toolsList[i]["name"];
        
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

        document.getElementById("tools-list").appendChild(node);
    }
}

/**
 * Show only the tools that are appropriate for the indicator
 * @param {type} indicator type (domain, ip, url, etc.)
 * @param {indicator} indicator entered by the user
 */
function showButtonsByType(type, indicator) {
    let visibility;
    
    // This node contains the list of tools
    let toolsListNode = document.getElementById("tools-list");
    // This node contains the error message for invalid input
    let errorPopupNode = document.getElementById("error-popup-text");
    // This node contains the warning message for internal IPs
    let warnPopupNode = document.getElementById("warn-popup-text");
    // This node contains the input text field
    let inputFieldNode = document.querySelector("#search-box>input"); 
    // This node contains the addon's logo
    let addonLogoNode = document.getElementById("addon-logo");

    addonLogoNode.style.display = "block";
    // If the input is empty, hide buttons and show addon logo
    if(indicator === ""){
        toolsListNode.style.display = "none";
        errorPopupNode.style.display = "none";
        warnPopupNode.style.display = "none";
        // Restore text field border color
        inputFieldNode.style.borderColor = "#6E6C69";
        return;
    }

    resNodes = toolsListNode.children;
    // If the input is not valid, show an error message
    if (type === "invalid") {
        errorPopupNode.style.display = "block";        
        warnPopupNode.style.display = "none";
        toolsListNode.style.display = "none";
        // Set the text field border color to red
        inputFieldNode.style.borderColor = "#FF0000";
        for (var i = 0; i < resNodes.length; i++) {
            resNodes[i].style.display = "none";
        }
    } else if (type === "internal") { 
        // If the IP address is internal, show a warning message
        warnPopupNode.style.display = "block";
        errorPopupNode.style.display = "none";       
        toolsListNode.style.display = "none";
        // Set the text field border color to orange
        inputFieldNode.style.borderColor = "#FFDD00";
        for (var i = 0; i < resNodes.length; i++) {
            resNodes[i].style.display = "none";
        }
    } else {
        inputFieldNode.style.borderColor = "#6E6C69";
        // Hide the error message
        errorPopupNode.style.display = "none";       
        warnPopupNode.style.display = "none";       
        // Hide logo
        addonLogoNode.style.display = "none";
        toolsListNode.style.display = "block";
        let handler = [];
        for (var i = 0; i < resNodes.length; i++) {
            if (tools[i]["types"].includes(type)) {            
                resNodes[i].style.display = "block";
                // Set tool description to div title
                resNodes[i].title = tools[i]["desc"];
                // Replace the placholder with the input string
                let url = tools[i]["url"][type];
                url = cookURL(url, indicator);
                // Remove revious click event listener
                resNodes[i].removeEventListener("click", resNodes[i].fn);
                // Add click event listener
                resNodes[i].addEventListener("click", resNodes[i].fn = function() {
                    browser.tabs.create({
                        url:url
                    });
                    // Close popup
                    window.close();
                });
            } else {
                // If this tools does not support this indicator type, hide its button
                resNodes[i].style.display ="none";
            }
        }
    }
}

//document.getElementById("settings-button").addEventListener("click", function() {
//    if(document.getElementById("settings-popup").style.display === "none"){
//        document.getElementById("settings-popup").style.display ="block";
//    } else {
//        document.getElementById("settings-popup").style.display ="none";
//    }
//});
