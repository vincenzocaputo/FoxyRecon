// Get addon version from manifest
var manifest = browser.runtime.getManifest();
document.getElementById("version-tag").innerHTML = "Version "+manifest.version;

var tools;
loadToolsList(function(ts){
    tools = ts;
    createToolsList(tools);
});
var regex=loadRegex();


var inputField = document.getElementById("input-box")

// Check if the input string is in local storage
if(!localStorage.getItem("inputString")) {
    inputField.focus();
} else {
    // If there is a saved state, restore it
    inputString = localStorage.getItem("inputString");
    inputField.value = inputString;
    // Restore the type of the string
    tag = localStorage.getItem("tag");
    showButtonsByTag(tag, inputString);
}

// For each charachter type, check if the string is a valid input
inputField.addEventListener("keyup", (e) => {
	var inputString = document.getElementById("input-box").value;
    if(inputString.match(regex["ip"])){
        tag = "ip";
        if(inputString.match(regex["internalip"])){
            tag = "internal";
        }
    } else if(inputString.match(regex["domain"])){
        tag = "domain";
    } else if(inputString.match(regex["url"])){
        tag = "url";
    } else if(inputString.match(regex["hash"])){
        tag = "hash";
    } else if(inputString.match(regex["email"])){
        tag = "email";
    } else {
        tag = "invalid";
    }
    // Show the appropriate tools for the input
    showButtonsByTag(tag, inputString);
    // Save the popup state (input + tag)
    localStorage.setItem("inputString",inputString);
    localStorage.setItem("tag",tag);
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
        //let node = $("<div></div>");
        node.classList.add("tool-entry");
        node.style.display = "none";        
        
        let nodeHyperlink = document.createElement('a');
        nodeHyperlink.setAttribute("target","_blank");
        
        let nodeImageContainer = document.createElement("div");
        nodeImageContainer.classList.add("tool-icon");
    
        let nodeImage = document.createElement("img");

        nodeImage.setAttribute("src",tool["icon"]);

        let nodeText = document.createElement("div");

        nodeText.innerHTML = toolsList[i]["name"];

        if(toolsList[i]["name"].length > 15 && toolsList[i]["name"].length < 20) {
            nodeText.style.fontSize = "6vw";
        } else if(toolsList[i]["name"].length > 19) {
            nodeText.style.fontSize = "5vw";
        }
        nodeText.classList.add("tool-name");

        
        let color = toolsList[i]["color"];
        let borderColor = toolsList[i]["borderColor"];
        let fontColor = toolsList[i]["fontColor"];
        if (color != null) {
            node.style.backgroundColor = color;
            nodeText.style.backgroundColor = color;
        }
        
        if (fontColor != null) {
            nodeText.style.color = "color";
        }
        if (borderColor != null) {
            node.style.borderColor = borderColor;
            nodeImageContainer.styke.borderColor = borderColor;
        }
        
        nodeImageContainer.appendChild(nodeImage);
        nodeHyperlink.appendChild(nodeImageContainer);
        nodeHyperlink.appendChild(nodeText);
        node.appendChild(nodeHyperlink);

        document.getElementById("tools-list").appendChild(node);
    }
}

/**
 * Show only the tools that are appropriate for the input type
 * @param {tag} indicator type (domain, ip, url, etc.)
 * @param {inputString} indicator entered by the user
 */
function showButtonsByTag(tag, inputString) {
    let visibility;
    
    let toolsListNode = document.getElementById("tools-list");
    let errorPopupNode = document.getElementById("error-popup-text");
    let warnPopupNode = document.getElementById("warn-popup-text");
    let inputFieldNode = document.querySelector("#search-box>input"); 
    let addonLogoNode = document.getElementById("addon-logo");

    addonLogoNode.style.display = "block";
    // If the input is empty, hide buttons and show addon logo
    if(inputString === ""){
        toolsListNode.style.display = "none";
        errorPopupNode.style.display = "none";
        warnPopupNode.style.display = "none";
        inputFieldNode.style.borderColor = "#6E6C69";
        return;
    }

    resNodes = toolsListNode.children;
    // If the input is not valid, show a error message
    if (tag === "invalid") {
        errorPopupNode.style.display = "block";        
        warnPopupNode.style.display = "none";
        toolsListNode.style.display = "none";
        inputFieldNode.style.borderColor = "#FF0000";
        for (var i = 0; i < resNodes.length; i++) {
            resNodes[i].style.display = "none";
        }
    } else if (tag === "internal") { // If the IP address is internal, show a warning message
        warnPopupNode.style.display = "block";
        errorPopupNode.style.display = "none";       
        toolsListNode.style.display = "none";
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
            if (tools[i]["tags"].includes(tag)) {            
                resNodes[i].style.display = "block";
                // Set tool description as div title
                resNodes[i].title = tools[i]["desc"];
    
                // Replace the placholder with the input string
                let url = tools[i]["url"][tag];
                url = cookURL(url, inputString);
                // Remove revious click event listener
                resNodes[i].removeEventListener("click", resNodes[i].fn);
                // Add click event listener
                resNodes[i].addEventListener("click", resNodes[i].fn = function() {
                    browser.tabs.create({
                        url:url
                    });
                    console.log(url);
                    window.close();
                });
            } else {
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
