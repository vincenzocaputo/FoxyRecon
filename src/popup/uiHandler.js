// Set tools icons folder base patgraph.h
const toolsIcoBasePath = "/assets/tools-icons/"

// Set types for popup messages
const MessageType = {
    INFO: 0,
    WARNING: 1,
    ERROR: 2
}

var tools;
loadTools().then( (result) => {
    tools = result;
    let favTools;
    browser.storage.local.get("fav").then( (result) => {
        favTools = result.fav;
        return browser.storage.local.get("settings");
    }).then( (result) => {
        const settings = result.settings;
        createToolsList(tools, settings, favTools);
        return browser.storage.local.get("indicator");
    }).then( (result) => {
        const indicator = result.indicator || null;
        if(!indicator || !indicator.value || indicator.value === "undefined") {
            inputField.focus();
        } else {
            // Put the indicator in the text field
            inputField.value = indicator.value;
            // Restore the type of the string
            const type = indicator.type;
            // Restore the domain tld if present
            const tld = indicator.tld;
            showCountryFlag(tld);
            // Restore tag option
            const optionValue = indicator.tag ?? "all";
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
            showButtonsByType(indicator.value, type, optionValue);
        }
    });

});

browser.storage.local.get("history").then( (result) => {
    const historySet = result.history || Array();
    historyPanel = document.getElementById("history");
    historySet.forEach(function(h) {
        historyEntry = document.createElement("div");
        historyEntry.textContent = h;
        historyEntry.classList.add("hist-entry");
        historyPanel.appendChild(historyEntry);
    });
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
      flag.title = indicatorParser.getCountryName(tld);
    } else {
        flag.src = "";
        flag.style.display = "none";
        flag.title = "";
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
    document.getElementById("disclaimer").style.display = "block";
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
    document.getElementById("show-only-autograph").style.display = "none";
    document.getElementById("show-only-nokey").style.display = "none";
    document.getElementById("show-only-noint").style.display = "none";
    document.getElementById("filter-by-tool").style.display = "none";
    document.querySelector(".separator").style.display = "none";
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
    // Hide flag
    document.getElementById("flag").style.display = "none";
}


/**
 * Show only the tools that are appropriate for the indicator
 * @param {indicator} indicator entered by the user
 * @param {type} indicator type (domain, ip, url, etc.)
 * @param {tag} web resource tag (for filtering results)
 * @param {showOnlyFav} if true, show only favourites resources
 * @param {showOnlyAutograph} if true, show only tools that support auto graph creation
 * @param {showOnlyNoKey} if true, show only tools that do not require accounts
 * @param {toolName} possible tool name to show
 */
function showButtonsByType(indicator, type, tag, showOnlyFav, showOnlyAutograph, showOnlyNoKey, showOnlyNoInt, toolName) {
    document.getElementById("filter-container-tags").style.display = "block";
    document.getElementById("filter-container-types").style.display = "none";
    document.getElementById("download").style.display = "none";
    document.getElementById("popup-text").style.display = "none";
    document.getElementById("text-field").style.borderColor = "#6E6C69";
    document.getElementById("main").style.display = "none";
    document.getElementById("catch-res-list").style.display = "none";
    document.querySelectorAll(".catch-res-entry").forEach(e => e.remove());
    document.getElementById("show-only-fav").style.display = "block";
    document.getElementById("show-only-autograph").style.display = "block";
    document.getElementById("show-only-nokey").style.display = "block";
    document.getElementById("show-only-noint").style.display = "block";
    document.querySelector(".separator").style.display = "block";
    document.getElementById("filter-by-tool").style.display = "block";
    document.getElementById("no-tools").style.display = "none";
    document.getElementById("no-indicators").style.display = "none";
    document.getElementById("hist-icon").style.display = "none";
    document.getElementById("disclaimer").style.display = "none";

    Graph.getInstance().then( (graph) => {
        const nodeIds = graph.getNodesByLabel(indicator);
        if (nodeIds.length > 0) { 
            document.getElementById("add-node").style.display = "none";
            document.getElementById("add-rel").style.display = "block";
            document.getElementById("del-node").style.display = "block";
        } else {
            if(type != "phone") {
                document.getElementById("add-node").style.display = "block";
                document.getElementById("add-rel").style.display = "none";
                document.getElementById("del-node").style.display = "none";
            }
        }
    });


    const toolsListNodes = document.querySelector("#tools-list");
    toolsListNodes.style.display = "block";
    const resNodes = toolsListNodes.children;
    // Retrieve favourites tools from local storage
    browser.storage.local.get("fav").then( (result) => {
        // This node contains the list of tools
        const favTools = result.fav || Array();
        if(!tag || tag === "default") {
            // If no tag has been provided, by default set it to "all"
            tag = "all";
        }
        let tagsOptions = [];
        let noTools = true;

        for (i = 0; i < tools.length; i++) {
            const autoGraph = tools[i]["autoGraph"] ?? false;
            const accountRequired = tools[i]["accountRequired"] ?? false;
            const interactionsRequired = "submitQuery" in tools[i];
            if (!showOnlyFav || favTools && favTools.includes(tools[i]["name"])) {
                if (!showOnlyAutograph || autoGraph) {
                    if (!showOnlyNoKey || !accountRequired) {
                        if (!showOnlyNoInt || !interactionsRequired) {
                            if (!toolName || tools[i]["name"].toLowerCase().includes(toolName)) {
                                if (tools[i]["types"].includes(type)) { 
                                    tagsOptions = tagsOptions.concat(tools[i]["tags"]);
                                    if (tag === "all" || (tools[i]["tags"] && tools[i]["tags"].includes(tag))) {
                                        noTools = false;
                                        resNodes[i].style.display = "grid";
                                        // Set tool description to div title
                                        resNodes[i].title = tools[i]["desc"];
                                        // Replace the placholder with the input string
                                        let url = tools[i]["url"][type];
                                        url = cookURL(url, indicator);
                                        resNodes[i].url = url;
                                        resNodes[i].name = tools[i]["name"];
                                        resNodes[i].submitQuery = tools[i]["submitQuery"];
                                        resNodes[i].inputSelector = tools[i]["inputSelector"];
                                        continue;
                                    }
                                }
                            }
                        }
                    }
                }
            } 
            resNodes[i].style.display = "none";
        }
        if (noTools) {
            document.getElementById("no-tools").style.display = "block";
        }
        createTagsOptionsList([...new Set(tagsOptions)], tag);
    });
}


/**
 * Create filter by tags dropdown menu options
 * @param {tagsOptions} list of tags
 */
function createTagsOptionsList(tagsOptions, selectedTag) {
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

    if (selectedTag && selectedTag !== "all") {
        document.querySelector("#filter-container-tags>select").value = selectedTag;
    } else {
        document.querySelector("#filter-container-tags>select").value = "default";
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
 * @param {settings} settings
 * @param {favTools} list of favourite tools
 */
function createToolsList(toolsList, settings, favTools){
    // Retrieve favorites list
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
            nodeImage.setAttribute("src", imageSrc);
        } else {
            nodeImage.setAttribute("src", toolsIcoBasePath + imageSrc);
        }

        // This node will contain the web resource's name
        let nodeText = document.createElement("div");
        
        text = document.createElement("div");
        text.textContent = toolsList[i]["name"];
        text.classList.add("text");
        
        nodeText.appendChild(text);
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


        graphIconContainer = document.createElement("div");
        graphIconContainer.classList.add("tool-graph-icon");
        graphIconNode = document.createElement("img");

        graphIconNode.setAttribute("src", "../../assets/icons/graph.png");
        graphIconNode.setAttribute("title", "Automatically adds nodes to the graph");
        graphIconContainer.appendChild(graphIconNode);

        uiIconContainer = document.createElement("div");
        uiIconContainer.classList.add("tool-ui-icon");
        uiIconNode = document.createElement("img");

        uiIconNode.setAttribute("src", "../../assets/icons/user-interaction.png");
        uiIconNode.setAttribute("title", "Some user interactions may be required. Enable the auto-submit feature to automatically submit indicators");
        uiIconContainer.appendChild(uiIconNode);

        keyIconContainer = document.createElement("div");
        keyIconContainer.classList.add("tool-key-icon");
        keyIconNode = document.createElement("img");

        keyIconNode.setAttribute("src", "../../assets/icons/key.png");
        keyIconNode.setAttribute("title", "This web resource requires an account to submit indicators.");
        keyIconContainer.appendChild(keyIconNode);

        // Add an icon that allow to open the resource in a new or in the current tab
        // (it depends on settings chosen by the user)
        openIconContainer = document.createElement("div");
        openIconContainer.classList.add("tool-open-icon");
        openIconNode = document.createElement("img");
        // Get the current option
        const newTabOption = settings.newtab;
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

        if(tools[i]["autoGraph"] ?? false) {
            optionsContainer.appendChild(graphIconContainer);
        }

        if(tools[i]["submitQuery"] ?? false) {
            optionsContainer.appendChild(uiIconContainer);
        }

        if(tools[i]["accountRequired"] ?? false) {
            optionsContainer.appendChild(keyIconContainer);
        }
        optionsContainer.appendChild(openIconContainer);
        optionsContainer.appendChild(favIconContainer);
        node.appendChild(optionsContainer);

        // Add animation to show the entire text
        nodeText.addEventListener("mouseenter", (e) => {
            const container = e.target;
            const text = container.querySelector('.text');
            const containerWidth = container.offsetWidth;
            const textWidth = text.scrollWidth;

            if (!text.classList.contains('animate')) {
                if (textWidth > containerWidth) {
                    text.classList.add('animate');
                } else {
                    text.classList.remove('animate');
                }
            }

            // Add animation to tags container to see all tags, if necessary
            const tagsContainer = container.querySelector(".tool-tags-container");
            if (tagsContainer) {
                const tagsContainerWidth = tagsContainer.offsetWidth;
                const tagsWidth = tagsContainer.scrollWidth;

                if (!tagsContainer.classList.contains('animate')) {
                    if (tagsWidth > tagsContainerWidth) {
                        tagsContainer.classList.add('animate');
                    } else {
                        tagsContainer.classList.remove('animate');
                    }
                }
            }
        });
        // Remove the animation when the mouse leaves
        nodeText.addEventListener("mouseleave", (e) => {
            const container = e.target;
            const text = container.querySelector('.text');

            if (text.classList.contains('animate')) {
                text.classList.remove('animate');
            }

            const tagsContainer = container.querySelector(".tool-tags-container");
            if (tagsContainer) {
                if (tagsContainer.classList.contains('animate')) {
                    tagsContainer.classList.remove('animate');
                }
            }
        });

        
        // Set click event function
        node.addEventListener("click", function(e) {
            const openPopups = document.querySelectorAll(".open-popup");
            // If settings popup is opened, don't allow clicking 
            if(node.url && openPopups.length == 0) {
                browser.storage.local.get("settings").then( (result) => {
                    const settings = result.settings;

                    browser.storage.local.set({"autofill": {
                        inputSelector: node.inputSelector || "",
                        submitQuery: node.submitQuery || ""
                    }});

                    const targetId = e.target.id;
                    if(targetId === "add-fav") { 
                        browser.storage.local.get("fav").then( (result) => {
                            const favTools = result.fav || Array();
                            if(favTools) {
                                favTools.push(node.name);
                            } else {
                                favTools = [node.name];
                            }
                            browser.storage.local.set({"fav": favTools});
                            e.target.title = "Remove from favorites";
                            e.target.id = "rem-fav";
                            e.target.src = "../../assets/icons/favourite.png";
                        });
                    } else if(targetId === "rem-fav") {
                        browser.storage.local.get("fav").then( (result) => {
                            const favTools = result.fav || Array();
                            if(favTools) {
                                favTools = favTools.filter(item => item != node.name);
                            }                
                            browser.storage.local.set({"fav": favTools});
                            e.target.title = "Add to favorites";
                            e.target.id = "add-fav";
                            e.target.src = "../../assets/icons/no_favourite.png";
                        });
                    } else {
                        browser.storage.local.get("indicator").then( (result) => {
                            const indicator = result.indicator.value || "";
                            browser.storage.local.get("history").then( (result) => {
                                let historySet = result.history;
                                // If the indicator is the same as the last saved, ignore it
                                if(indicator && indicator != historySet[0]) {
                                    if(historySet.length >= 50) {
                                        historySet.pop();
                                    }
                                    historySet.unshift(indicator);
                                    browser.storage.local.set({"history": historySet});
                                }
                            });
                        });
                        browser.storage.local.get("settings").then( (result) => {
                            const settings = result.settings;
                            const newtab = settings.newtab;
                            if(targetId === "open-icon-out" || (targetId != "open-icon-in" && newtab)) {
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
                        });
                    } 
                });
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
    document.getElementById("disclaimer").style.display = "none";
    // Set input field placeholder
    document.getElementById("input-box").placeholder = "Filter indicators";

    let indicatorsListNode = document.getElementById("catch-res-list");

    let typesList = [];
    if(!indicatorsList || indicatorsList.length == 0) {
        document.getElementById("no-indicators").style.display="block";
        return;
    }
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

        text = document.createElement("div");
        text.textContent = indicatorsList[i]['value'];
        text.classList.add("text");
        
        nodeText.appendChild(text);
        nodeText.classList.add("tool-name");

        // Add container for tags
        let nodeTagsContainer = document.createElement("div");
        nodeTagsContainer.classList.add("tool-tags-container");
        // Add a node for each tag
        let nodeTag = document.createElement("div");
        // Tag to upper case
        nodeTag.textContent = type.toUpperCase();
        nodeTag.classList.add("tool-tag");
        nodeTagsContainer.appendChild(nodeTag);
        nodeText.insertAdjacentElement("beforeend", nodeTagsContainer);

        node.indicator = indicatorsList[i]['value'];
        node.type = indicatorsList[i]['type'];
        node.title = node.indicator;

        nodeImageContainer.appendChild(nodeImage);
        node.appendChild(nodeImageContainer);
        node.appendChild(nodeText);

        // Add animation to show the entire text
        nodeText.addEventListener("mouseenter", (e) => {
            const container = e.target;
            const text = container.querySelector('.text');
            const containerWidth = container.offsetWidth;
            const textWidth = text.scrollWidth;

            if (!text.classList.contains('animate')) {
                if (textWidth > containerWidth) {
                    text.classList.add('animate');
                } else {
                    text.classList.remove('animate');
                }
            }
        });
        // Remove the animation when the mouse leaves
        nodeText.addEventListener("mouseleave", (e) => {
            const container = e.target;
            const text = container.querySelector('.text');

            if (text.classList.contains('animate')) {
                text.classList.remove('animate');
            }
        });

        indicatorsListNode.appendChild(node);
        indicatorsListNode.style.display = "block";
        node.addEventListener("mouseover", function() {
            browser.tabs.query({active:true}).then(tabs => {
                let activeTab = tabs[0].id;
                browser.tabs.sendMessage(activeTab, {'cmd':'find',indicator:node.indicator});
            })
        });
        // Set click event function
        node.addEventListener("click", function(evt) {
            let type = evt.target.closest(".catch-res-entry").type;
            let tld  = ""
            let value = node.indicator;
            if(type=="phone") {
                value = value.replaceAll(/[^+0-9]/g, '');
                if(value[0] !== '+') {
                    value = '+' + value;
                }
            } else {
                [type, tld] = indicatorParser.getIndicatorType(node.indicator);
                if(type=="defanged") {
                    value = indicatorParser.refangIndicator(node.indicator); 
                    [type, tld] = indicatorParser.getIndicatorType(value);
                }
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
 * @param {searchText} text inserted by the user to filter indicators
 */
function showIndicatorsByType(indicatorType, searchText = "") {
    // Keep track of whether there are any indicators to display
    var noIndicators = true;
    // retrieve the list of indicators
    document.querySelectorAll(".catch-res-entry").forEach((node)=>{
        if(indicatorType != "all" && node.type != indicatorType) {
            // hide the entry
            node.style.display = "none";
        } else if (searchText !== "" && !node.indicator.toLowerCase().includes(searchText.toLowerCase())) {
            node.style.display = "none";
        } else {
            noIndicators = false;
            node.style.display = "grid";
        }
    });

    if(noIndicators) {
        document.getElementById("no-indicators").style.display = "grid";
    }
}
