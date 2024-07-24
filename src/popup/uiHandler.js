// Set tools icons folder base patgraph.h
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

historySet = JSON.parse(localStorage.getItem("history")) || Array();
historyPanel = document.getElementById("history");
historySet.forEach(function(h) {
    historyEntry = document.createElement("div");
    historyEntry.textContent = h;
    historyEntry.classList.add("hist-entry");
    historyPanel.appendChild(historyEntry);
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
    } else if(messageType == MessageType.INFO) {
        popupText.classList.add(classes[MessageType.INFO]);
    }
    popupText.style.display = "block";
    popupText.style.opacity = "1";
    setTimeout(() => {
        popupText.style.display = "none";
        document.getElementById("text-field").style.borderColor = "#6E6C69";
    }, 2000);

}

/**                                               
 * Show country flag according to tld. If no tld is provided, remove flag    
 * @param{tld} domain tld                       
 */
function showCountryFlag(tld) {
    let flag = document.getElementById("flag");
    if(tld != "") {
      flag.src = "/assets/country-flags/"+tld+".png";
      flag.style.display = "block";
      flag.alt = tld;
    } else {
        flag.src = "";
        flag.style.display = "none";
        flag.alt = "";
    }
}

/**
 * Show add-on main screen
 */
function showAddonMain() {
    document.getElementById("tools-list").style.display = "none";
    document.getElementById("popup-text").style.display = "none";
    // Restore text field border color
    document.getElementById("text-field").style.borderColor = "#6E6C69";
    // Restore placeholder text of the input field
    document.getElementById("input-box").placeholder = "Enter your indicator";
    document.getElementById("main").style.display = "block";
    // Hide filter dropdown menus
    document.getElementById("filter-container-types").style.display = "none";
    document.getElementById("filter-container-tags").style.display = "none";
    // Clear the list of indicators gathered through IoC Catch 
    document.getElementById("catch-res-list").style.display = "none";
    document.querySelectorAll(".catch-res-entry").forEach(e => e.remove());
    // Hide the bin icon
    document.getElementById("bin-icon").style.display = "none";
    // Hide show fav button
    document.getElementById("show-only-fav").style.display = "none";
    document.getElementById("no-tools").style.display = "none";
    document.getElementById("no-indicators").style.display = "none";
    // Hide download icon
    document.getElementById("download").style.display = "none";
    // Hide graph editor buttons
    document.getElementById("add-node").style.display = "none";
    document.getElementById("add-rel").style.display = "none";
    document.getElementById("del-node").style.display = "none";
    // Show history icon
    document.getElementById("hist-icon").style.display = "block";
}


/**
 * Show only the tools that are appropriate for the indicator
 * @param {indicator} indicator entered by the user
 * @param {type} indicator type (domain, ip, url, etc.)
 * @param {tag} web resource tag (for filtering results)
 * @param {showOnlyFav} if true, show only favourites resources
 * @param {toolName} possible tool name to show
 */
function showButtonsByType(indicator, type, tag, showOnlyFav, toolName) {
    document.getElementById("filter-container-tags").style.display = "block";
    document.getElementById("filter-container-types").style.display = "none";
    document.getElementById("download").style.display = "none";
    document.getElementById("popup-text").style.display = "none";
    document.getElementById("text-field").style.borderColor = "#6E6C69";
    document.getElementById("main").style.display = "none";
    document.getElementById("catch-res-list").style.display = "none";
    document.querySelectorAll(".catch-res-entry").forEach(e => e.remove());
    document.getElementById("show-only-fav").style.display = "block";
    document.getElementById("no-tools").style.display = "none";
    document.getElementById("no-indicators").style.display = "none";
    document.getElementById("hist-icon").style.display = "none";

    let graph = new Graph();
    const nodeIds = graph.getNodesByLabel(indicator);
    if (nodeIds.length > 0) { 
        document.getElementById("add-node").style.display = "none";
        document.getElementById("add-rel").style.display = "block";
        document.getElementById("del-node").style.display = "block";
    } else {
        document.getElementById("add-node").style.display = "block";
        document.getElementById("add-rel").style.display = "none";
        document.getElementById("del-node").style.display = "none";
    }
    // This node contains the list of tools
    const toolsListNodes = document.getElementById("tools-list");
    toolsListNodes.style.display = "block";
    const resNodes = toolsListNodes.children;

    // Retrieve favourites tools from local storage
    const favTools = JSON.parse(localStorage.getItem("fav"));

    if(!tag) {
        // If no tag has been provided, by default set it to "all"
        tag = "all";
    }
    let tagsOptions = [];
    let noTools = true;
    for (i = 0; i < tools.length; i++) {
        if (!showOnlyFav || favTools && favTools.includes(tools[i]["name"])) {
            if (!toolName || tools[i]["name"].toLowerCase().includes(toolName)) {
                if (tools[i]["types"].includes(type)) { 
                    tagsOptions = tagsOptions.concat(tools[i]["tags"]);
                    if (tag === "all" || (tools[i]["tags"] && tools[i]["tags"].includes(tag))) {
                        noTools = false;
                        resNodes[i].style.display = "block";
                        // Set tool description to div title
                        resNodes[i].title = tools[i]["desc"];
                        // Replace the placholder with the input string
                        let url = tools[i]["url"][type];
                        url = cookURL(url, indicator);
                        resNodes[i].url = url;
                        resNodes[i].name = tools[i]["name"];
                        resNodes[i].submitQuery = tools[i]["submitQuery"];


                    } else  {
                        resNodes[i].style.display = "none";
                    }
                } else {
                    // If this tools does not support this indicator type, hide its button
                    resNodes[i].style.display = "none";
                }
            } else {
                resNodes[i].style.display = "none";
            }
        } else {
            // If this tools does not support this indicator type, hide its button
            resNodes[i].style.display = "none";
        }
    }

    if (noTools) {
        document.getElementById("no-tools").style.display = "block";
    }
    createTagsOptionsList([...new Set(tagsOptions)]);

}


/**
 * Create filter by tags dropdown menu options
 * @param {tagsOptions} list of tags
 */
function createTagsOptionsList(tagsOptions) {
    const tagsOptionsList = document.querySelectorAll("#filter-container-tags>select option");
    let options = [];
    
    for (i = 0; i < tagsOptionsList.length; i++) {
        // Hide option if it is not in current options list
        if (tagsOptionsList[i].value != "all" && !tagsOptions.includes(tagsOptionsList[i].value)) {
            tagsOptionsList[i].style.display = "none";
        }
    }

    for (i = 0; i < tagsOptions.length; i++) {
        // Check if option is already present
        const opt = document.querySelector("#filter-container-tags>select option[value="+tagsOptions[i]+"]");
        if (opt) {
            if (opt.style.display === "none") {
                opt.style.display = "block";
            }
        } else if (tagsOptions[i]) {
            // Create option
            let option = document.createElement("option");
            option.text = tagsOptions[i];
            option.value = tagsOptions[i];
            document.querySelector("#filter-container-tags>select").appendChild(option);
        }
    }
}

/**
 * Create filter by types dropdown menu options
 * @param {typesOptions} list of types
 */
function createTypesOptionsList(typesOptions) {
    const typesOptionsList = document.querySelectorAll("#filter-container-types>select option");
    let options = [];
    for (i = 0; i < typesOptionsList.length; i++) {
        // Hide option if it is not in current options list
        if (typesOptionsList[i].value != "all" && !typesOptions.includes(typesOptionsList[i].value)) {
            typesOptionsList[i].style.display = "none";
        }
    }

    for (i = 0; i < typesOptions.length; i++) {
        // Check if option is already present
        const opt = document.querySelector("#filter-container-types>select option[value="+typesOptions[i]+"]");
        if (opt) {
            if (opt.style.display === "none") {
                opt.style.display = "block";
            }
        } else if (typesOptions[i]) {
            // Create option
            let option = document.createElement("option");
            option.text = typesOptions[i];
            option.value = typesOptions[i];
            document.querySelector("#filter-container-types>select").appendChild(option);
        }
    }
}

/**
 * Create the tools list inside the popup
 * @param {toolsList} tools list
 */
function createToolsList(toolsList){
    // Retrieve favorites list
    const favTools = JSON.parse(localStorage.getItem("fav"));
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

        let imageSrc = toolsList[i]["icon"];
        if(imageSrc.indexOf("data:image") == 0) {
            console.log(imageSrc);
            nodeImage.setAttribute("src", imageSrc);
        } else {
            nodeImage.setAttribute("src", toolsIcoBasePath + imageSrc);
        }

        // This node will contain the web resource's name
        let nodeText = document.createElement("div");

        nodeText.textContent = toolsList[i]["name"];
        
        // If the name is too long, reduce the font size
        if(toolsList[i]["name"].length > 15 && toolsList[i]["name"].length < 20) {
            nodeText.style.fontSize = "90%";
        } else if(toolsList[i]["name"].length > 19) {
            nodeText.style.fontSize = "80%";
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
                nodeTagsContainer.appendChild(nodeTag);
                nodeText.insertAdjacentElement("beforeend", nodeTagsContainer);
            }
        }
        optionsContainer = document.createElement("div");
        optionsContainer.classList.add("tool-options-container");

        // Add an icon that allow to open the resource in a new or in the current tab
        // (it depends on settings chosen by the user)
        openIconContainer = document.createElement("div");
        openIconContainer.classList.add("tool-open-icon");
        openIconNode = document.createElement("img");
        // Get the current option
        const newTabOption = localStorage.getItem("settings.newtab");
        if(newTabOption && newTabOption === "false") {
            // By default the addon opens resources in the current tab
            // let the user open in a new tab by clicking on this icon
            openIconNode.src = "../../assets/icons/outside.png";
            openIconNode.title = "Open in a new tab";
            openIconNode.id = "open-icon-out";
        } else {
            openIconNode.src = "../../assets/icons/inside.png";
            openIconNode.title = "Open in current tab";
            openIconNode.id = "open-icon-in";
        }
        openIconContainer.appendChild(openIconNode); 

        // Add an icon that allow to add the tool to favourite list
        favIconContainer = document.createElement("div");
        favIconContainer.classList.add("tool-fav-icon");
        favIconNode = document.createElement("img");
        // Get wheter the tool is in favourite list or not
        if(favTools && favTools.includes(toolsList[i]["name"])) {
            favIconNode.src = "../../assets/icons/favourite.png";
            favIconNode.title = "Remove from favorites";
            favIconNode.id = "rem-fav";
        } else {
            favIconNode.src = "../../assets/icons/no_favourite.png";
            favIconNode.title = "Add to favorites";
            favIconNode.id = "add-fav";
        }
        favIconContainer.appendChild(favIconNode);

        nodeImageContainer.appendChild(nodeImage);
        nodeHyperlink.appendChild(nodeImageContainer);
        nodeHyperlink.appendChild(nodeText);
        node.appendChild(nodeHyperlink);

        optionsContainer.appendChild(openIconContainer);
        optionsContainer.appendChild(favIconContainer);
        node.appendChild(optionsContainer);
        
        // Set click event function
        node.addEventListener("click", function(e) {
            const openPopups = document.querySelectorAll(".open-popup");
            // If settings popup is opened, don't allow clicking 
            if(node.url && openPopups.length == 0) {
                newtab = localStorage.getItem("settings.newtab");
                
                if(node.submitQuery) {
                    localStorage.setItem("submit-btn-query", node.submitQuery);
                } else {
                    localStorage.setItem("submit-btn-query", "");
                }

                const targetId = e.target.id;
                if(targetId === "add-fav") { 
                    let favTools = JSON.parse(localStorage.getItem("fav"));
                    if(favTools) {
                        favTools.push(node.name);
                    } else {
                        favTools = [node.name];
                    }
                    localStorage.setItem("fav", JSON.stringify(favTools));
                    e.target.title = "Remove from favorites";
                    e.target.id = "rem-fav";
                    e.target.src = "../../assets/icons/favourite.png";
                } else if(targetId === "rem-fav") {
                    let favTools = JSON.parse(localStorage.getItem("fav"));
                    if(favTools) {
                        favTools = favTools.filter(item => item != node.name);
                    }                
                    localStorage.setItem("fav", JSON.stringify(favTools));
                    e.target.title = "Add to favorites";
                    e.target.id = "add-fav";
                    e.target.src = "../../assets/icons/no_favourite.png";
                }else if(targetId === "open-icon-out" || (targetId != "open-icon-in" && (!newtab || newtab === "true"))) {

                    // Add indicator to history
                    const indicator = localStorage.getItem("indicator");
                    // If the indicator is the same as the last saved, ignore it
                    if(indicator != historySet[0]) {
                        if(historySet.length >= 50) {
                            historySet.pop();
                        }
                        historySet.unshift(indicator);
                        localStorage.setItem("history", JSON.stringify(historySet));
                    }

                    // Open web resource in a new tab
                    browser.tabs.create({
                        url: node.url
                    });
                    // close popup
                    window.close();
                }  else {
                    // Add indicator to history
                    const indicator = localStorage.getItem("indicator");
                    // If the indicator is the same as the last saved, ignore it
                    if(indicator != historySet[0]) {
                        if(historySet.length >= 50) {
                            historySet.pop();
                        }
                        historySet.unshift(indicator);
                        localStorage.setItem("history", JSON.stringify(historySet));
                    }

                    // Otherwise open in current tab
                    browser.tabs.update({
                        url: node.url
                    });
                    // close popup
                    window.close();
                }
            }
        });
        document.getElementById("tools-list").appendChild(node);
    }
}

/**
 * Create the indicator list inside the popup
 * @param {indicatorsList} indicator list
 */
function createIndicatorsList(indicatorsList){
    document.getElementById("filter-container-tags").style.display = "none";
    document.getElementById("filter-container-types").style.display = "block";
    document.getElementById("download").style.display = "block";
    document.getElementById("popup-text").style.display = "none";
    document.getElementById("text-field").style.borderColor = "#6E6C69";
    document.getElementById("main").style.display = "none";
    document.getElementById("bin-icon").style.display = "block";
    document.getElementById("hist-icon").style.display = "none";
    document.getElementById("catch-icon").style.display = "none";
    document.getElementById("flag").style.display = "none";

    let indicatorsListNode = document.getElementById("catch-res-list");

    let typesList = [];
    for (i=0; i<indicatorsList.length; i++) {
        const type = indicatorsList[i]['type'];
        let node = document.createElement('div');
        
        node.classList.add("catch-res-entry");
        
        // This node will contain the resource's icon
        let nodeImageContainer = document.createElement("div");
        nodeImageContainer.classList.add("tool-icon");
   
        let nodeImage = document.createElement("img");


        // This node will contain the web resource's name
        let nodeText = document.createElement("div");

        nodeText.textContent = indicatorsList[i]['value'];
        // If the name is too long, reduce the font size
        if(indicatorsList[i]['value'].length > 15 && indicatorsList[i]['value'].length < 20) {
            nodeText.style.fontSize = "90%";
        } else if (indicatorsList[i]['value'].length > 19) {
            text = indicatorsList[i]['value'].substring(0, 19);
            nodeText.textContent = text + "...";
        } else if(indicatorsList[i]['value'].length > 19) {
            nodeText.style.fontSize = "80%";
        }
        nodeText.classList.add("tool-name");

        // Set button colors
        let color;
        // Add type to array
        typesList = typesList.concat(type);
        if(type === 'domain') {
            nodeImage.setAttribute("src", toolsIcoBasePath + "domain_icon.png");
            color = "#BB0000";
        } else if(type === 'ip') {
            nodeImage.setAttribute("src", toolsIcoBasePath + "ip_icon.png");
            color = "#00BB00";
        } else if (type === 'url') {
            nodeImage.setAttribute("src", toolsIcoBasePath + "url_icon.png");
            color = "#FF4D00";
        } else if (type === 'hash') {
            nodeImage.setAttribute("src", toolsIcoBasePath + "hash_icon.png");
            color = "#00FFCC";
        } else if (type === 'email') {
            nodeImage.setAttribute("src", toolsIcoBasePath + "email_icon.png");
            color = "#001EFF";
        } else if (type === 'cve') {
            nodeImage.setAttribute("src", toolsIcoBasePath + "cve_icon.png");
            color = "#FFE136";
        } else if (type === 'phone') {
            nodeImage.setAttribute("src", toolsIcoBasePath + "phone_icon.png");
            color = "#AE1AB8";
        } else if (type === 'asn') {
            nodeImage.setAttribute("src", toolsIcoBasePath + "asn_icon.png");
            color = "#FF44B2";
        }
        node.style.backgroundColor = nodeText.style.backgroundColor = color;
        // If the web resource has tags, add more space for them
        nodeText.classList.add("tool-name-with-tags");
        // Add container for tags
        let nodeTagsContainer = document.createElement("div");
        nodeTagsContainer.classList.add("tool-tags-container");
        // Add a node for each tag
        let nodeTag = document.createElement("div");
        // Tag to upper case
        nodeTag.textContent = type.toUpperCase();
        nodeTag.classList.add("tool-tag");
        // Add transparency
        nodeTag.style.backgroundColor = "rgba(256, 256, 256, 0.3)";
        nodeTagsContainer.appendChild(nodeTag);
        nodeText.insertAdjacentElement("beforeend", nodeTagsContainer);

        node.indicator = indicatorsList[i]['value'];
        node.type = indicatorsList[i]['type'];
        node.title = node.indicator;

        nodeImageContainer.appendChild(nodeImage);
        node.appendChild(nodeImageContainer);
        node.appendChild(nodeText);

        indicatorsListNode.appendChild(node);
        indicatorsListNode.style.display = "block";
        node.addEventListener("mouseover", function() {
            browser.tabs.query({active:true}).then(tabs => {
                let activeTab = tabs[0].id;
                browser.tabs.sendMessage(activeTab, {'cmd':'find',indicator:node.indicator});
            })
        });
        // Set click event function
        node.addEventListener("click", function() {
            let [type, tld] = indicatorParser.getIndicatorType(node.indicator);
            let value = node.indicator;
            if(type="defanged") {
                value = indicatorParser.refangIndicator(node.indicator); 
                [type, tld] = indicatorParser.getIndicatorType(value);
            }
            document.getElementById("input-box").value = value;
            submitIndicator(value, type, tld);
        });
    }
    createTypesOptionsList([...new Set(typesList)]);

}

/*
 * Show Indicators by type
 * @param {indicatorType} type of indicators to show
 */
function showIndicatorsByType(indicatorType) {
    // Keep track of whether there are any indicators to display
    var noIndicators = true;
    // retrieve the list of indicators
    document.querySelectorAll(".catch-res-entry").forEach((node)=>{
        if(indicatorType != "all" && node.type != indicatorType) {
            // hide the entry
            node.style.display = "none";
        } else {
            noIndicators = false;
            node.style.display = "block";
        }
    });

    if(noIndicators) {
        document.getElementById("no-indicators").style.display="block";
    }
}
