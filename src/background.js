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
            })

            var graphMapping;
            loadGraphMapping(function(mp) {
                graphMapping=mp;
            })
        }
    }
    browser.contextMenus.create({
        id: 'create-node',
        title: "Add new graph node",
        contexts: ["selection"],
        visible: true
    });
    browser.contextMenus.create({
        id: 'investigate',
        title: "Investigate",
        contexts: ["selection"],
        visible: true
    });

    browser.contextMenus.onClicked.addListener((clickData) => {
        indicatorParser = new IndicatorParser();
        selectionText = clickData.selectionText.trim();
        clickedItem = clickData.menuItemId;
        if (selectionText) {
            if (clickedItem === "investigate") {
                [type, tld] = indicatorParser.getIndicatorType(selectionText);
                selectionTextType = type;
                if(type != "invalid"){
                    if(type === "defanged") {
                        // If the input string is defanged, refang it
                        selectionText = indicatorParser.refangIndicator(selectionText);
                        [type, tld] = indicatorParser.getIndicatorType(selectionText);

                    }
                    localStorage.setItem("type", type);
                    localStorage.setItem("indicator", selectionText);
                    localStorage.setItem("tld", tld);
                    browser.action.openPopup();
                } else {
                    browser.tabs.query({active:true, lastFocusedWindow: true}).then(tabs => {    
                        let activeTab = tabs[0].id;
                        browser.tabs.sendMessage(activeTab, "show-err:The selected text is not a valid indicator.")
                            .then((response) => {
                            })
                            .catch((error) => {
                            });
                    });
                }
            }
            if (clickedItem === "create-node") {
                const graph = new Graph();
                if (graph.getNodesByLabel(selectionText).length == 0) {
                    browser.tabs.query({active:true, lastFocusedWindow: true}).then(tabs => {    
                        let activeTab = tabs[0].id;
                        browser.tabs.sendMessage(activeTab, "open-add-note-popup")
                            .then((response) => {
                             })
                            .catch((error) => {
                            });
                    });
                } else {
                    browser.tabs.query({active:true, lastFocusedWindow: true}).then(tabs => {    
                        let activeTab = tabs[0].id;
                        browser.tabs.sendMessage(activeTab, "show-err:The node is already in the graph")
                            .then((response) => {
                            })
                            .catch((error) => {
                            });
                    });
                }
            }
        }
    });
});


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
                            browser.action.setBadgeText({text: ""});
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
                        browser.action.setBadgeText({text: ""});
                    } else {
                        const indicatorsList = JSON.parse(indicatorsListJson);
                        browser.action.setBadgeText({text: indicatorsList.length.toString()});
                    }
                } 
                // Consume token
                token = 0;
            })
        },
        error => {
            browser.action.setBadgeText({text: ""});
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
 * Waiting for  messages from content_script
 */
browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.id === 1) {
        // Autofill feature
        query = localStorage.getItem("autofill.submit-btn-query");
        inputSelector = localStorage.getItem("autofill.input-selector");
        submit = localStorage.getItem("settings.autosubmit");
        typAnimOption = localStorage.getItem("settings.typanim");

        sendResponse({msg: localStorage.getItem("indicator"), query: query, inputSelector: inputSelector, submit: submit, typAnimOption: typAnimOption});
        // Consume the request (to avoid clicking the button more times for the same request)
        localStorage.setItem("autofill.submit-btn-query","");
        localStorage.setItem("autofill.input-selector","");
    } else if (request.id === 2) {
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
    } else if (request.id === 3) {
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
        let nodeId;
        if (request.hasOwnProperty("type")) {
            // We are dealing with a valid indicator
            nodeId = graph.addNode(request.indicator, request.type);
            console.log(nodeId);
        } else {
            const stix = request.stix;
            const label = request.label;
            graph.addSTIXNode(stix["id"], label, stix["type"], stix);
            nodeId = stix["id"];
        }
        if (request.relName) {
            const indicator = localStorage.getItem("indicator");
            const nodes = graph.getNodesByLabel(indicator);

            let relNodeId;
            if (nodes.length === 0) {
                relNodeId = graph.addNode(indicator, localStorage.getItem("type"));
            } else {
                relNodeId = nodes[0];
            }
            if (request.inbound) {
                graph.addLink(relNodeId, nodeId, request.relName);
            }
            if (request.outbound) {
                graph.addLink(nodeId, relNodeId, request.relName);
            }
                
        }
        browser.tabs.query({active:true, lastFocusedWindow: true}).then(tabs => {    
            let activeTab = tabs[0].id;
            browser.tabs.sendMessage(activeTab, "show-msg:Node added to the graph")
                .then((response) => {
                })
                .catch((error) => {
                });
        });
    }
})
