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
if (!localStorage.getItem("settings.typanim")) {
    localStorage.setItem("settings.typanim", "true");

}
var tools;
loadToolsList(function(ts) {
    tools=ts;
    createToolsMenu(tools);
});

var graphMapping;
loadGraphMapping(function(mp) {
    graphMapping=mp;
});

browser.runtime.onInstalled.addListener(function(details) {
    let currentVersion = browser.runtime.getManifest().version;
    if(details.reason === "install") {
        console.log("Current version: " + currentVersion);
        localStorage.setItem("version", currentVersion);
    } else if(details.reason === "update") {
        if (installedVersion = localStorage.getItem("version")) {
            console.log("Installed version: " + installedVersion);
        } else {
            // Assume that the installed version is obsolete
            installedVersion = 0;
        }
        
        if (installedVersion !== currentVersion) {
            browser.tabs.create({
                discarded: true,
                title: "FoxyRecon New Version",
                url: 'https://github.com/vincenzocaputo/FoxyRecon/releases/tag/v'+currentVersion
            });
            // If a new version was released, clean the local storage
            localStorage.removeItem("tools");
            localStorage.removeItem("type");
            localStorage.removeItem("tag");
            localStorage.removeItem("autograph-mapping");
            localStorage.removeItem("submit-btn-query");
            localStorage.removeItem("autofill.submit-btn-query");
            localStorage.removeItem("autofill.input-selector");
            localStorage.removeItem("indicator");
            // Add current version to local storage
            localStorage.setItem("version", currentVersion);

            var tools;
            loadToolsList(function(ts) {
                tools=ts;
                createToolsMenu(tools);
            })

            var graphMapping;
            loadGraphMapping(function(mp) {
                graphMapping=mp;
            })
        }
        
    }
});



/**
 * Create context menu containing the tools list
 * @param {toolsList} list of available tools
 */

function createToolsMenu(toolsList) {
    browser.contextMenus.create({
        id: 'create-node',
        title: "Add new graph node",
        contexts: ["selection"],
        visible: true,
        onclick: function() {

        }
    });
    browser.contextMenus.create({
        id: 'investigate',
        title: "Investigate",
        contexts: ["selection"],
        visible: true,
    });
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
 * Open Context Menu. If the selected text is a valid indicator, show the option to send the indicator to the popup
 * @param {selectedText} selected text
 * @param {type} indicator type
 * @param {tld} if the selected text is a domain, report the top level domain
 */
function showContextMenu(selectedText, type = "invalid", tld = "") {
    const graph = new Graph();

    if(type !== "invalid") {
        browser.contextMenus.update('investigate', {
            enabled: true,
            visible: true,
            onclick: function() {
                localStorage.setItem("type", type);
                localStorage.setItem("indicator", selectedText);
                localStorage.setItem("tld", tld);
                browser.browserAction.openPopup();
            }
        }).then( () => browser.contextMenus.refresh() );
        if (graph.getNodesByLabel(selectedText).length == 0) {
            browser.contextMenus.update('create-node', {
                enabled: true,
                visible: true,
                onclick: function() {
                    graph.addNode(selectedText, type);
                }
            }).then(()=>browser.contextMenus.refresh());
        } else {
            // The node is already in the graph
            browser.contextMenus.update('create-node', {
                enabled: false
            }).then( () => browser.contextMenus.refresh() );
        }

    } else {
        browser.contextMenus.update('investigate', {
            enabled: false
        }).then( () => browser.contextMenus.refresh() );
        browser.contextMenus.update('create-node', {
            enabled: true,
            visible: true,
            onclick: function() {
                browser.tabs.query({active:true, lastFocusedWindow: true}).then(tabs => {    
                    let activeTab = tabs[0].id;
                    browser.tabs.sendMessage(activeTab, "open-add-note-popup")
                        .then((response) => {
                        })
                        .catch((error) => {
                        });
                });
            }
        }).then(()=>browser.contextMenus.refresh());

    }


}

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
                        localStorage.setItem("autofill.submit-btn-query", tool["submitQuery"]);
                    } else {
                        localStorage.setItem("autofill.submit-btn-query", "");
                    }
                    if(tool["inputSelector"]) {
                        localStorage.setItem("autofill.input-selector", tool["inputSelector"]);
                    } else {
                        localStorage.setItem("autofill.input-selector", "");
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
        query = localStorage.getItem("autofill.submit-btn-query");
        inputSelector = localStorage.getItem("autofill.input-selector");
        submit = localStorage.getItem("settings.autosubmit");
        typAnimOption = localStorage.getItem("settings.typanim");

        sendResponse({msg: localStorage.getItem("indicator"), query: query, inputSelector: inputSelector, submit: submit, typAnimOption: typAnimOption});
        // Consume the request (to avoid clicking the button more times for the same request)
        localStorage.setItem("autofill.submit-btn-query","");
        localStorage.setItem("autofill.input-selector","");
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

        let nodeIds = graph.getNodesByLabel(rel['source']['id']);
        let fromId;
        if (nodeIds.length === 0) {
            fromId = graph.addNode(rel['source']['id'], rel['source']['type']);
        } else {
            fromId = nodeIds[0];
        }
        nodeIds = graph.getNodesByLabel(rel['target']['id']);
        let toId;
        if (nodeIds.length === 0) {
            toId = graph.addNode(rel['target']['id'], rel['target']['type']);
        } else {
            toId = nodeIds[0];
        }
        if (!graph.linkInGraph(fromId, toId, rel['label'])) {
            graph.addLink(fromId, toId, rel['label']);
        }
        sendResponse({msg: 1});
    } else if (request.id === 4) {
        const graph = new Graph();
        const stix = request.stix;
        const label = request.label;
        graph.addSTIXNode(stix["id"], label, stix["type"], stix);
        console.log(request.relName);
        if (request.relName) {
            const indicator = localStorage.getItem("indicator");
            const nodes = graph.getNodesByLabel(indicator);

            let nodeId;
            if (nodes.length === 0) {
                nodeId = graph.addNode(indicator, localStorage.getItem("type"));
            } else {
                nodeId = nodes[0];
            }
            if (request.inbound) {
                graph.addLink(nodeId, stix["id"], request.relName);
            }
            if (request.outbound) {
                graph.addLink(stix["id"], nodeId, request.relName);
            }
                
        }
    } else {
        // Context Menu
        showContextMenu(request.indicator, request.type, request.tld);
    }
})
