// Check if current version is installed
let currentVersion = browser.runtime.getManifest().version;
console.log("Current version: " + currentVersion);

if (installedVersion = localStorage.getItem("version")) {
    console.log("Installed version: " + installedVersion);
} else {
    // Assume that the installed version is obsolete
    installedVersion = 0;
}

if (installedVersion != currentVersion) {
    // If a new version was released, clean the local storage
    localStorage.clear();
    // Add current version to local storage
    localStorage.setItem("version", currentVersion);
}

// Setup default settings
if (!localStorage.getItem("settings.newtab")) {
    localStorage.setItem("settings.newtab", "true");
}
if (!localStorage.getItem("settings.autosubmit")) {
    localStorage.setItem("settings.autosubmit", "false");
}
if (!localStorage.getItem("settings.autocatch")) {
    localStorage.setItem("settings.autocatch", "false");
}
if (!localStorage.getItem("settings.autograph")) {
    localStorage.setItem("settings.autograph", "false");
}

var tools;
loadToolsList(function(ts) {
    tools=ts;
    createToolsMenu(tools);
})

var graphMapping;
loadGraphMapping(function(mp) {
    graphMapping=mp;
})


/**
 * Create context menu containing the tools list
 * @param {toolsList} list of available tools
 */
function createToolsMenu(toolsList) {
    if(toolsList) {
        for (i=0; i<toolsList.length; i++){
            let tool = toolsList[i];
            // Create menu entry
            browser.contextMenus.create({
                id: i.toString(), // Incremental ID
                title: tool["name"], // Tool name
                contexts: ["selection"], // Show menu on selected text
                /*icons: {
                    16: browser.runtime.getURL(tool["icon"]),
                },*/
                visible: true,
            });
        }
    }
}

/**
 * Harvest and collect the indicators present in the current webpage. Save the list in the local storage.
 */
function catchIndicators(e) {
    let autocatch_option = localStorage.getItem("settings.autocatch");
    if (autocatch_option && autocatch_option === "true") {
        browser.tabs.query({active:true, lastFocusedWindow: true}).then(tabs => {    
            let activeTab = tabs[0].id;
            // Send a message to the content script
            browser.tabs.sendMessage(activeTab, "catch")
                        .then((response) => {
                        })
                        .catch((error) => {
                            browser.browserAction.setBadgeText({text: ""});
                            localStorage.setItem("catched_indicators", "[]");
                        });
            let token = 1;
            browser.runtime.onMessage.addListener(function(message) {
                if(token) {
                    const indicatorsListJson = message['indicators'];
                    // Save the indicators list in the local storage
                    localStorage.setItem("catched_indicators", indicatorsListJson);
                    // No indicators found. Show a message
                    if(indicatorsListJson == "[]") {
                        browser.browserAction.setBadgeText({text: ""});
                    } else {
                        const indicatorsList = JSON.parse(indicatorsListJson);
                        browser.browserAction.setBadgeText({text: indicatorsList.length.toString()});
                    }
                } 
                // Consume token
                token = 0;
            })
        },
        error => {
            browser.browserAction.setBadgeText({text: ""});
            localStorage.setItem("catched_indicators", "[]");
            console.error("Error: "+error);
        });
    }
}
/**
 * When tab changes, remove the badge text
 */
browser.tabs.onActivated.addListener(catchIndicators);
browser.tabs.onUpdated.addListener(catchIndicators);
browser.tabs.onCreated.addListener(catchIndicators);

/**
 * Updates context menu making visible only the tools which are compatible with the selected string
 * @param {toolsList} available tools list
 * @param {indicator} indicator selected by the user
 * @param {type} indicator type (domain, URL, ip, etc.)
 */
function updateToolsMenu(toolsList, indicator, type) {
    for (i=0; i<toolsList.length; i++){
        let tool = toolsList[i];
        // If the tool is not compatible, hide the menu entry
        if(!tool["types"].includes(type)){
            browser.contextMenus.update(i.toString(), {
                visible: false
            });
        } else {
            // Otherwise make it visible and add the click event
            browser.contextMenus.update(i.toString(),{
                visible: true,
                onclick: function(){
                    
                    // Replace the placeholder with the selected text
                    let url = cookURL(tool["url"][type], indicator); 
                    // Save the indicator in the local storage
                    localStorage.setItem("type", type);
                    localStorage.setItem("indicator", indicator);
                    //localStorage.setItem("graph.autocreate", "true"); 
                    // Add the query for autofill to localstorage
                    if(tool["submitQuery"]) {
                        localStorage.setItem("submit-btn-query", tool["submitQuery"]);
                    } else {
                        localStorage.setItem("submit-btn-query", "");
                    }
                    // Create the new tab
                    browser.tabs.create({
                        url: url,
                    });
                }
            });
        }
    }
}

/**
 * Waiting for  messages from content_script
 */
browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.id == 1) {
        // Autofill feature
        query = localStorage.getItem("submit-btn-query");
        // Send the query only if auto-submit option is enabled
        if(localStorage.getItem("settings.autosubmit") === "true") {
            // Send the query to find submit button
            submit = "true";
        } else {
            submit = "false";
        }
        sendResponse({msg: localStorage.getItem("indicator"), query: query, submit: submit});
        // Consume the request (to avoid clicking the button more times for the same request)
        localStorage.setItem("submit-btn-query","");
    } else if (request.id == 2) {
        // Auto graph generation
        if (localStorage.getItem("settings.autograph") === "true" && request.msg) {
            const resource = request.msg;
            let mappings = Array();
            for (i=0; i<graphMapping.length; i++) {
                if (resource.startsWith(graphMapping[i]['source'])) {
                    mappings.push(graphMapping[i]);
                }
            }
            sendResponse({msg: localStorage.getItem("indicator"), map: JSON.stringify(mappings) }) 
        }
    } else if (request.id == 3) {
        const graph = new Graph();
        const rel = JSON.parse(request.msg);
        graph.addNode(rel['source']['id'], rel['source']['type']);
        graph.addNode(rel['target']['id'], rel['target']['type']);
        graph.addLink(rel['source']['id'], rel['target']['id'], rel['label']);
        sendResponse({msg: 1});
    } else {
        updateToolsMenu(tools, request.indicator, request.type);
    }
})
