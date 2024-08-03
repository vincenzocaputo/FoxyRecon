// Get addon version from manifest file
const manifest = browser.runtime.getManifest();
document.getElementById("addon-version").textContent = "VERSION "+manifest.version+" (BETA)";


var inputField = document.getElementById("input-box");

indicatorParser = new IndicatorParser();


// Check if there are some indicators found in the current webpage
var collectedIndicatorsListJson = localStorage.getItem("catched_indicators");
if(collectedIndicatorsListJson && collectedIndicatorsListJson !== undefined && collectedIndicatorsListJson !== "undefined") {
    const collectedIndicatorsList = JSON.parse(collectedIndicatorsListJson);
    var count = {"ip": 0, "domain": 0, "url": 0, "email": 0, "hash": 0, "cve": 0, "phone": 0, "asn": 0};
    collectedIndicatorsList.forEach(function(indicator) {
        count[indicator["type"]]++;
    });
    for(let key in count) {
        if(indCountContainer=document.getElementById(key+"_occ")) {
            indCountContainer.textContent = count[key];
        }
    }
}

// Check if the input string is in local storage
const indicator = localStorage.getItem("indicator");
if(!indicator || indicator === "undefined") {
    inputField.focus();
} else {
    // Put the indicator in the text field
    inputField.value = indicator;
    // Restore the type of the string
    const type = localStorage.getItem("type");
    // Restore the domain tld if present
    const tld = localStorage.getItem("tld");
    showCountryFlag(tld);
    // Restore tag option
    const optionValue = localStorage.getItem("tag");
    // If indicator is an URL or an email show domain extraction icon
    if(type === "url" || type === "email") {
        document.getElementById("domextr-icon").style.display = "block";
    } else {
        document.getElementById("domextr-icon").style.display = "none";
    }
    // Hide Catch! icon
    document.getElementById("catch-icon").style.display = "none";
    // Show the bin icon
    document.getElementById("bin-icon").style.display = "block";
    // Show the buttons related to the tools that support this indicator
    showButtonsByType(indicator, type, optionValue);
}


/**--------------------------------------INPUT TEXT FIELD--------------------------------------**/

/**
 *
 * Handle the clicking on bin icon inside the text field
 *
 */
const textfieldBin = document.getElementById("bin-icon");
textfieldBin.addEventListener("click", function() {
    // Clear the text input field
    inputField.value = "";
    textfieldCatch.style.display = "block";        
    textfieldTool.style.display = "none";
    // Hide flag
    document.querySelector("#flag").style.display = "none";
    // Clean the local storage
    localStorage.setItem("indicator", "");
    localStorage.setItem("type", "");
    localStorage.setItem("tag", "all");
    localStorage.setItem("tld", "");
    showAddonMain();
});


/**
 * Handle the clicking on IoC Catch icon inside the text field
 *
 */
var textfieldCatch = document.querySelector("#catch-icon");
textfieldCatch.title = "Collect indicators on this page";
textfieldCatch.addEventListener("click", function() {
    // Get the id of the current active tab in the current window
    browser.tabs.query({active:true, currentWindow:true}).then(tabs => {
        let activeTab = tabs[0].id;
        // Send a message to the content script
        browser.tabs.sendMessage(activeTab, "catch");
        let token = 1;
        browser.runtime.onMessage.addListener(function(message) {
            if(token) {
                // No indicators found. Show a message
                if(message['indicators'] == "[]") {
                    showMessagePopup("No indicators found in this page", MessageType.INFO);
                } else {
                    //countFoundIndicators();
                    const indicatorsList = JSON.parse(message['indicators']);
                    var count = {"ip": 0, "domain": 0, "url": 0, "email": 0, "hash": 0, "cve": 0, "phone": 0, "asn": 0};
                    indicatorsList.forEach(function(indicator) {
                        count[indicator["type"]]++;
                    });
                    for(let key in count) {
                        document.getElementById(key+"_occ").textContent = count[key];
                    }
                    collectedIndicatorsListJson = message['indicators'];
                }
            }
            // Consume token
            token = 0;
        })
    }, 
    error => {
        console.error("Error: "+error)
    });
});


/**
 * Handle the clicking on History icon inside the text field
 *
 */
var historyIcon = document.getElementById("hist-icon");
historyIcon.title = "History";
historyIcon.addEventListener("click", function() {
    let divDisplay = document.getElementById("history").style.display;
    if(divDisplay == "block") {
        document.getElementById("history").style.display = "none";
    } else {
        document.getElementById("history").style.display = "block";
    }
});

document.querySelectorAll("#history>.hist-entry").forEach((entry)=>{
    entry.addEventListener("click", function(e) {
        history_indicator = e.target.textContent;
        inputField.value = history_indicator;
        const [type, tld] = indicatorParser.getIndicatorType(history_indicator);
        document.querySelector("#catch-icon").style.display = "none";
        document.querySelector("#flag").style.display = "none";
        document.getElementById("history").style.display = "none";
        submitIndicator(history_indicator, type, tld, "", "");
    });
});

/**
 * 
 * Handle the clicking on tool icon inside the text field
 *
 */
var textfieldTool = document.getElementById("domextr-icon");
textfieldTool.title = "Extract domain";
textfieldTool.addEventListener("click", function() {
    const inputString = inputField.value;
    const domain = indicatorParser.getDomain(indicatorParser.refangIndicator(inputString));
    
    inputField.value = domain;

    // Show the appropriate tools for the input provided
    showButtonsByType(domain, "domain", "all");
    // Save the current indicator along with its type
    localStorage.setItem("indicator", domain);
    localStorage.setItem("type", "domain");
    localStorage.setItem("tag", "all");

    // Hide the icon
    textfieldTool.style.display = "none";
});


/**
 * Submit an indicator as input 
 * @param{indicator}: string representing the indicator to submit
 * @param{type}: indicator type
 * @param{tld}: domain tld, if present
 * @param{tag}: possible tag to filter resources
 * @param{tool}: possible tool name
 */
function submitIndicator(indicator, type, tld, tag, toolName) {
    // Show the appropriate tools for the input provided

    showCountryFlag(tld);
    showButtonsByType(indicator, type, tag, false, toolName);
    // Save the current indicator along with its type
    localStorage.setItem("indicator", indicator);
    localStorage.setItem("type", type);
    localStorage.setItem("tld", tld);
    //localStorage.setItem("graph.autocreate", "true");
    if(!tag) {
        tag = "all";
    }
    localStorage.setItem("tag", tag);
    
    // If the indicator is an URL or email, show tool icon inside text field
    if(type === "url" || type === "email") {
        textfieldTool.style.display = "block";
    } else {
        textfieldTool.style.display = "none";
    }
    textfieldBin.style.display = "block";

}


inputField.addEventListener("focus", (e) => {
    document.getElementById("history").style.display = "none";
});

/**
 * 
 * For each charachter typed, check if the string is a valid input
 *
 */
inputField.addEventListener("keyup", (e) => {
    let inputString = inputField.value;
    // Remove badge text
    browser.browserAction.setBadgeText({text: ''});
    // If no input was provided, show the add-on logo and the history icon
    if(inputString === "") {
        showAddonMain();
        localStorage.setItem("indicator", "");
        localStorage.setItem("type", "");
        localStorage.setItem("tag", "");

        textfieldCatch.style.display = "block";        
        textfieldTool.style.display = "none";

    } else {
        // Show the bin icon
        document.getElementById("bin-icon").style.display = "block";
        // Hide the catch icon
        textfieldCatch.style.display = "none";
        
        let type = "";
        let inputIndicator = "";
        let fToolName = "";
        // Get indicator + possible search filters
        let inputs = inputString.split(" ");
        if(inputs.length > 1) {
            // There is a search filter
            inputIndicator = inputs[0];
            
            if(inputs[1][0] === "!") {
                fToolName = inputs[1].split("!")[1];
            } else {
                type = "invalid";
            }
        } else {
            inputIndicator = inputString;
        }

        if(type!="invalid") {
            // Get indicator type
            [type, tld] = indicatorParser.getIndicatorType(inputIndicator);
        }

        if(type === "defanged") {
            // If the input string is defanged, refang it
            inputIndicator = indicatorParser.refangIndicator(inputIndicator);
            // Get the real type of the indicator
            [type, tld] = indicatorParser.getIndicatorType(inputIndicator);
        } 

        if(type === "invalid") {
            showAddonMain();
            showCountryFlag("");
            textfieldTool.style.display = "none";
            showMessagePopup("Please enter a valid indicator", MessageType.ERROR);
        } else if(type === "internal") {
            showAddonMain();
            textfieldTool.style.display = "none";
            showMessagePopup("The IP address is internal", MessageType.WARNING);
        } else {
            // Get selected tag option
            const selectNode = document.querySelector("#filter-container-tags>select");
            const optionValue = selectNode.options[selectNode.selectedIndex].value;
            
            submitIndicator(inputIndicator, type, tld, optionValue, fToolName);
        }

    }
});


/**
 *
 * Handle tag selecting event
 *
 */
document.querySelector("#filter-container-tags>select").addEventListener("change", (e) => {
    let inputString = inputField.value;
    let [type, tld] = indicatorParser.getIndicatorType(inputString);
    if(type === "defanged") {
        // If the input string is defanged, refang it
        inputString = indicatorParser.refangIndicator(inputString);
        // Get the real type of the indicator
        [type, tld] = indicatorParser.getIndicatorType(inputString);
    }
    const optionValue = e.target.options[e.target.selectedIndex].value;
    const showOnlyFavBtn = document.querySelector("#show-only-fav>button").value;
    if (showOnlyFavBtn == "off") {
        showButtonsByType(inputString, type, optionValue, false);
    } else {
        // If show only fav option is enabled, show only favourites tools
        showButtonsByType(inputString, type, optionValue, true);
    }
});

/**
 *
 * Handle type selecting event
 *
 */
document.querySelector("#filter-container-types>select").addEventListener("change", (e) => {
    const optionValue = e.target.options[e.target.selectedIndex].value;
    showIndicatorsByType(optionValue);
});

/**
 *
 * Handle star clicking event
 *
 */
document.querySelector("#show-only-fav>button").addEventListener("click", (e) => {
    const inputString = inputField.value;
    const [type, tld] = indicatorParser.getIndicatorType(inputString);
    const selectedTag = document.querySelector("#filter-container-tags>select").value
    const optionValue = document.querySelector("#show-only-fav button").value;
    if (optionValue == "off" || optionValue == undefined) {
        showButtonsByType(inputString, type, selectedTag, true);
        document.querySelector("#show-only-fav button").value = "on";
        document.querySelector("#show-only-fav img").src = "../../assets/icons/favourite_opt_on.png";
    } else {
        showButtonsByType(inputString, type, selectedTag, false);
        document.querySelector("#show-only-fav button").value = "off";
        document.querySelector("#show-only-fav img").src = "../../assets/icons/favourite_opt.png";
    }
});

/*-------------------------------GRAPH------------------------------------*/

/**
 *
 * Handle plus icon clicking event
 *
 */
document.querySelector("#add-node-button").addEventListener("click", (e) => {
    const nodeId = localStorage.getItem("indicator");
    const nodeType = localStorage.getItem("type");

    let graph = new Graph();
    
    if (graph.addNode(nodeId, nodeType)) {
        document.querySelector("#add-node").style.display = "none";
        document.querySelector("#del-node").style.display = "block";
        document.querySelector("#add-rel").style.display = "block";
        showMessagePopup("Node added to graph", MessageType.INFO);
    }
    
});

/**
 *
 * Handle node delete icon clicking event
 *
 */
document.querySelector("#del-node-button").addEventListener("click", (e) => {
    const indicator = localStorage.getItem("indicator");

    let graph = new Graph();
    graph.getNodesByLabel(indicator).forEach( (nodeId) => graph.deleteNode(nodeId) );
    document.querySelector("#add-node").style.display = "block";
    document.querySelector("#add-rel").style.display = "none";
    document.querySelector("#del-node").style.display = "none";
});
    

/**
 * Handle add relationship button event to display popup
 *
 */
document.querySelector("#add-rel-button").addEventListener("click", (e) => {
    let nodes = [];
    let graphNodes = new Graph().getNodes();
    for (let node in graphNodes) {
        if (graphNodes[node].id != inputField.value) { 
            nodes.push(graphNodes[node]);
        }
    }

    if (nodes.length == 0) {
        showMessagePopup("You need at least one other node to create a relationship", MessageType.WARNING);
    } else {
        // Create options list of nodes you can connect to
        const selectInput = document.getElementById("to-node-name");
        selectInput.textContent = "";
        for (let node in nodes) {
            const newOptionElement = document.createElement("option");
            newOptionElement.value = nodes[node].id;
            newOptionElement.textContent = nodes[node].label;
            selectInput.appendChild(newOptionElement);
        }

        const addRelPopup = document.getElementById("add-relationship-popup");

        if(!addRelPopup.style.display || addRelPopup.style.display == "none" ) {
            // Don't show pointer cursor on buttons
            document.querySelectorAll(".tool-entry").forEach(function(entry) {
                entry.style.cursor = "default";
            });

            addRelPopup.style.display = "block";
            addRelPopup.classList.add("open-popup");
            const selectRelName = document.getElementById("rel-node-name");
            selectRelName.textContent = "";
            Graph.relationshipTypes.forEach( rtype => {
                const optionValue = document.createElement("option");
                optionValue.value = rtype;
                optionValue.textContent = rtype;
                selectRelName.appendChild(optionValue);
            });

            
        } else {
            // Show pointer cursor on buttons
            document.querySelectorAll(".tool-entry").forEach(function(entry) {
                entry.style.cursor = "pointer";
            });

            addRelPopup.style.display = "none";
            addRelPopup.classList.remove("open-popup");
        }
    }
});

/**
 * Handle link direction checkboxes
 *
 **/
document.querySelector("#outbound-link input").addEventListener("change", (e) => {
    let inboundCheckbox = document.querySelector("#inbound-link input");

    if (!e.target.checked) {
        inboundCheckbox.checked = true;
    }
});

document.querySelector("#inbound-link input").addEventListener("change", (e) => {
    let outboundCheckbox = document.querySelector("#outbound-link input");

    if (!e.target.checked) {
        outboundCheckbox.checked = true;
    }
});

/**
 * Check the relationship node validity
 *
 */
//document.querySelector("#relationship-name-field>input").addEventListener("keyup", (e) => {
//    let relNameField = e.target;
//    let popupError = document.querySelector("#relationship-name-field>.form-error-popup");
//    let submitBtn = document.querySelector("#add-node-rel-button");
//
//    const relName = e.target.value;
//    const validRelName = new RegExp('^[A-Za-z-_]*$');
//    if (!validRelName.test(relName)) {
//        popupError.style.display = "block";
//        relNameField.style.borderColor = "#FF0000";
//        submitBtn.disabled = true;
//    } else {
//        popupError.style.display = "none";
//        relNameField.style.borderColor = "#6E6C69";
//        submitBtn.disabled = false;
//        
//    }
//});


/**
 * Handle add node relationship button event
 *
 */
document.querySelector("#add-node-rel-button").addEventListener("click", (e) => {
    const relLabel = document.querySelector("#rel-node-name").value;
    const toNodeId = document.querySelector("#to-node-name").value;
    const isOutbound = document.querySelector("#outbound-link input[type='checkbox']").checked
    const isInbound = document.querySelector("#inbound-link input[type='checkbox']").checked
    const fromNodeLabel = localStorage.getItem("indicator");
    const fromNodeType = localStorage.getItem("type");


    let graph = new Graph();
    
    //const [toNodeType, tld] = indicatorParser.getIndicatorType(toNodeId);
    //graph.addNode(toNodeId, toNodeType);

    const fromNodeIds = graph.getNodesByLabel(fromNodeLabel);
    for (const fromNodeId of fromNodeIds) {
        if (isOutbound) {
            graph.addLink(fromNodeId, toNodeId, relLabel);
        }
        if (isInbound) {
            graph.addLink(toNodeId, fromNodeId, relLabel);
        }
    }


    document.getElementById("add-relationship-popup").style.display = "none";
    showMessagePopup("Relationship added to graph", MessageType.INFO);

});

/**
 * Handle cancel button
 *
 */
document.querySelector("#add-node-rel-close-button").addEventListener("click", function(evt) {
    const relPopup = document.getElementById("add-relationship-popup");
    relPopup.style.display = "none";
    relPopup.classList.remove("open-popup");
});

/**
 * Handle open graph page button click event
 */
document.querySelector("#open-graph").addEventListener("click", function(evt) {
    browser.tabs.create({
        url: '/src/graph/graph.html'
    });
});


/**-------------------------------------CATCH-----------------------------------------------------**/

/**
 * Handle catch container clicking event
 *
 */
document.querySelectorAll(".catch-container").forEach((v) => { 
    v.addEventListener("click", (e) => {
        createIndicatorsList(JSON.parse(collectedIndicatorsListJson), 'all'); 
        switch (v.id) {
            case "catch-ip":
                document.querySelector("#filter-container-types > select").value = "ip";
                showIndicatorsByType("ip");
                break;
            case "catch-domain":
                document.querySelector("#filter-container-types > select").value = "domain";
                showIndicatorsByType("domain");
                break;
            case "catch-url":
                document.querySelector("#filter-container-types > select").value = "url";
                showIndicatorsByType("url");
                break;
            case "catch-hash":
                document.querySelector("#filter-container-types > select").value = "hash";
                showIndicatorsByType("hash");
                break;
            case "catch-email":
                document.querySelector("#filter-container-types > select").value = "email";
                showIndicatorsByType("email");
                break;
            case "catch-cve":
                document.querySelector("#filter-container-types > select").value = "cve";
                showIndicatorsByType("cve");
                break;
            case "catch-phone":
                document.querySelector("#filter-container-types > select").value = "phone";
                showIndicatorsByType("phone");
                break;
            case "catch-asn":
                document.querySelector("#filter-container-types > select").value = "asn";
                showIndicatorsByType("asn");
                break;
        }
    });
});


/**----------------------------------OPTION SETTINGS POPUP----------------------------------------------**/

function setCheckboxStatus(checkboxNode, optionName) {
    let optionValue = localStorage.getItem(optionName);
    if(!optionValue) {
        // Default option: open always a new tab
        if(optionName === "settings.newtab") {
            optionValue = "true";
        } else if(optionName === "settings.autosubmit") {
            // auto-submit disabled
            optionValue = "false";
        } else if(optionName === "settings.autocatch") {
            // auto-catch enabled
            optionValue = "true";
        } else if(optionName === "settings.autograph") {
            optionValue = "true";
        }
    }
    checkboxNode.checked = (optionValue === "true");
    localStorage.setItem(optionName, optionValue);
}


/**
 * Show or hide settings popup menu
 */
document.getElementById("settings-button").addEventListener("click", function() {
    const settingsPopup = document.getElementById("options-popup");
    if(!settingsPopup.style.display || settingsPopup.style.display == "none" ) {
        // Don't show pointer cursor on buttons
        document.querySelectorAll(".tool-entry").forEach(function(entry) {
            entry.style.cursor = "default";
        });

        settingsPopup.style.display = "block";
        settingsPopup.classList.add("open-popup");
        
        setCheckboxStatus(document.querySelector("#open-tab-opt input"), "settings.newtab");
        setCheckboxStatus(document.querySelector("#auto-submit-opt input"), "settings.autosubmit");
        setCheckboxStatus(document.querySelector("#auto-catch-opt input"), "settings.autocatch");
        setCheckboxStatus(document.querySelector("#auto-graph-opt input"), "settings.autograph");
    } else {
        // Show pointer cursor on buttons
        document.querySelectorAll(".tool-entry").forEach(function(entry) {
            entry.style.cursor = "pointer";
        });
        settingsPopup.style.display = "none";
        settingsPopup.classList.remove("open-popup");
    }
});


/**
 * Handle the clicking outside the popup area
 */
document.addEventListener("click", function(evt) {
    const settingsPopup = document.getElementById("options-popup");
    const settingsButton = document.getElementById("settings-button");

    if(settingsPopup.style.display == "block") {
        const buttonPos = settingsButton.getBoundingClientRect();
        const popupPos = settingsPopup.getBoundingClientRect();
        // Check if the user has clicked outside the popup
        if(((evt.pageX < popupPos.left || evt.pageX > popupPos.right) || 
            (evt.pageY < popupPos.top || evt.pageY > popupPos.bottom)) &&
            ((evt.pageX < buttonPos.left || evt.pageX > buttonPos.right) || 
            (evt.pageY < buttonPos.top || evt.pageY > buttonPos.bottom))) {
            // Fire settings button click event to close the settings popup
            document.getElementById("settings-button").click();
        }
    }

    const addRelPopup = document.getElementById("add-relationship-popup");
    const addRelButton = document.getElementById("add-rel-button");
    const addRelCancelButton = document.getElementById("add-node-rel-close-button");

    if(addRelPopup.style.display === "block") {
        const buttonPos = addRelButton.getBoundingClientRect();
        const popupPos = addRelPopup.getBoundingClientRect();
        // Check if the user has clicked outside the popup
        if(((evt.pageX < popupPos.left || evt.pageX > popupPos.right) || 
            (evt.pageY < popupPos.top || evt.pageY > popupPos.bottom)) &&
            ((evt.pageX < buttonPos.left || evt.pageX > buttonPos.right) || 
            (evt.pageY < buttonPos.top || evt.pageY > buttonPos.bottom)) &&
            evt.target.id !== "to-node-name" && evt.target.id !== "rel-node-name" 
            && evt.target.tagName !== "OPTION") {
            // Fire settings button click event to close the settings popup
            addRelCancelButton.click();
        }
    }
    event.stopPropagation();

});


/**
 * Handle open tab option checkbox change event
 */
document.querySelector("#open-tab-opt input").addEventListener("change", function(evt) {
    //let linksNodes = document.getElementById("tools-list").children;
    newtabOption = evt.target.checked;
    localStorage.setItem("settings.newtab", newtabOption);
    // Update the open icon option inside the tools buttons
    openOptionIcons = document.querySelectorAll(".tool-open-icon>img");
    for(icon of openOptionIcons) {
        if(!newtabOption) {
            // By default the addon opens resources in the current tab
            // let the user open in a new tab by clicking on this icon
            icon.src = "../../assets/icons/outside.png";
            icon.title = "Open in a new tab";
            icon.id = "open-icon-out";
        } else {
            icon.src = "../../assets/icons/inside.png";
            icon.title = "Open in current tab";
            icon.id = "open-icon-in";
        }
    }
});

/**
 * Handle auto-submit option checkbox change event
 */
document.querySelector("#auto-submit-opt input").addEventListener("change", function(evt) {
    //let linksNodes = document.getElementById("tools-list").children;
    autosubmitOption = evt.target.checked;
    localStorage.setItem("settings.autosubmit", autosubmitOption);
});

/**
 * Handle auto-submit option checkbox change event
 */
document.querySelector("#auto-catch-opt input").addEventListener("change", function(evt) {
    autocatchOption = evt.target.checked;
    localStorage.setItem("settings.autocatch", autocatchOption);
    if (!autocatchOption) {
        // Wipe indicators list
        localStorage.setItem("catched_indicators", "[]");
        // Set 0 counter as badge
        browser.browserAction.setBadgeText({text: ""});
    }
});

/**
 * Handle auto-graph option checkbox change event
 */
document.querySelector("#auto-graph-opt input").addEventListener("change", function(evt) {
    autographOption = evt.target.checked;
    localStorage.setItem("settings.autograph", autographOption);
});

/**
 * Handle open settings page button click event
 */
document.querySelector("#open-settings").addEventListener("click", function(evt) {
    browser.tabs.create({
        url: '/src/custom_resources/custom-resources.html'
    });
});

/**----------------------------------DOWNLOAD BUTTON----------------------------------------------**/

document.getElementById("download-button").addEventListener("click", (e)=> {
    let csvData = [];
    document.querySelectorAll(".catch-res-entry").forEach((node) => {
        if(node.style.display === "" || node.style.display === "block") {
            csvData.push([node.title, node.type]);
        }
    });
    let csv = "indicator,type\n";
    csvData.forEach(function(row) {  
        csv += row.join(',');  
        csv += "\n";  
    });  
    window.location.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);

});
