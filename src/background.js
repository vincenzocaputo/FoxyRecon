browser.runtime.onInstalled.addListener(function(details) {
    let currentVersion = browser.runtime.getManifest().version;
    if(details.reason === "install" || details.reason === "update") {
        if (details.reason === "install") {
            createStorage().then( () => {;
                console.log("Current version: " + currentVersion);
                browser.storage.local.set({"version": currentVersion});
            });
        } else if(details.reason === "update") {
            browser.storage.local.get("version")
                .then( (result) => {
                    let installedVersion;
                    if (result.hasOwnProperty("version") > 0){
                        installedVersion = result.version;
                        console.log("Installed version: " + installedVersion);
                    } else {
                        // Probably the version in saved in the old storage
                        console.log("error, probably migration is needed");
                        // Assume that the installed version is obsolete
                        installedVersion = "0";
                    }
                    return installedVersion;
                })
                .then( (installedVersion) => {
                    return detectStorageMigration(installedVersion, currentVersion);
                })
                .then( (result) => {
                    return browser.storage.local.remove("tools").then( () => {
                        return loadTools();
                    });
                })
                .then( (result) => {
                    return browser.storage.local.remove("graphMapping").then( () => {
                        return loadGraphMapping();
                    });
                })
                .then( (result) => {
                    browser.tabs.create({
                        url: 'https://github.com/vincenzocaputo/FoxyRecon/releases/tag/v'+currentVersion
                    });
                    browser.storage.local.set({"version": currentVersion});
                });
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
                    browser.browserAction.openPopup()
                    .then( () => {
                        browser.storage.local.set({
                            "indicator": {
                                "type": type,
                                "value": selectionText,
                                "tld": tld
                            }
                        })
                    });
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
                Graph.getInstance().then( (graph) => {
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
                    };
                });
            }
        }
    });
});

browser.commands.onCommand.addListener((command) => {
    if (command === "open-popup") {
        browser.browserAction.openPopup()
    }
});
/**
 * Harvest and collect the indicators present in the current webpage. Save the list in the local storage.
 */
function catchIndicators(e) {
    browser.storage.local.get("settings").then( (result) => {
        const settings = result.settings;
        const autocatch_option = settings.autocatch;
        if (autocatch_option && autocatch_option) {
            browser.tabs.query({active:true, lastFocusedWindow: true}).then(tabs => {    
                let activeTab = tabs[0].id;
                // Send a message to the content script
                browser.tabs.sendMessage(activeTab, "catch")
                    .then((response) => {
                        let token = 1;
                        browser.runtime.onMessage.addListener(function(message) {
                            if(token) {
                                const indicatorsListJson = message['indicators'];
                                console.log(indicatorsListJson);
                                const indicatorsList = JSON.parse(indicatorsListJson);
                                // No indicators found. Show a message
                                if(indicatorsListJson.length === 0) {
                                    browser.browserAction.setBadgeText({text: ""});
                                } else {
                                    browser.browserAction.setBadgeText({text: indicatorsList.length.toString()});
                                }
                                // Save the indicators list in the local storage
                                browser.storage.local.set({"catchedIndicators": indicatorsList});
                            } 
                            // Consume token
                            token = 0;
                        })
                    })
                    .catch((error) => {
                        browser.browserAction.setBadgeText({text: ""});
                        browser.storage.local.set({"catchedIndicators": []});
                    });
            },
            error => {
                browser.browserAction.setBadgeText({text: ""});
                browser.storage.local.set({"catchedIndicators": []});
                console.error("Error: "+error);
            });
        }
    });
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
        let query; // The CSS selector of the submit button
        let inputSelector; // The CSS selector of the input field
        let submit; // Defines if the input must be automatically submitted
        let typAnimOption; // True for typing animation

        browser.storage.local.get("autofill")
            .then( (result) => {
                if (result.hasOwnProperty("autofill")) {
                    const autofill = result.autofill;
                    query = autofill.submitQuery;
                    inputSelector = autofill.inputSelector;
                    return browser.storage.local.get("settings");
                } else {
                    return Promise.resolve(null);
                }
            })
            .then( (result) => {
                if (result && result.hasOwnProperty("settings")) {
                    const settings = result.settings;
                    submit = settings.autosubmit;
                    typAnimOption = settings.typeanim;
                    return browser.storage.local.get("indicator");
                } else {
                    return Promise.resolve(null);
                } 
            })
            .then( (result) => {
                if (result && result.hasOwnProperty("indicator")) {
                    const indicator = result.indicator;
                    sendResponse({
                        msg: indicator.value,
                        query: query,
                        inputSelector: inputSelector,
                        submit: submit,
                        typAnimOption: typAnimOption
                    });
                    // Consume the request (to avoid clicking the button more times for the same request)
                    browser.storage.local.set(
                        { 
                            "autofill": {
                                submitQuery: "",
                                inputSelector: ""
                            }
                        }
                    );
                }
            });
        return true;
    } else if (request.id === 2) {
        let mappings = Array();
        // Auto graph generation
        browser.storage.local.get("settings").then( (result) => {
            if (result.hasOwnProperty("settings")) {
                const settings = result.settings;
                if (settings.autograph && request.msg) {
                    return loadGraphMapping();
                }
            }
            return Promise.resolve(null);
        })
        .then( (result) => {
            if (result) {
                const resource = request.msg;
                const graphMapping = result;
                for (i=0; i<graphMapping.length; i++) {
                    if (resource.startsWith(graphMapping[i]['source'])) {
                        mappings.push(graphMapping[i]);
                    }
                }
                return browser.storage.local.get("indicator");
            }
            return Promise.resolve(null);
        })
        .then( (result) => {
            if(result && result.hasOwnProperty("indicator")) {
                const indicator = result.indicator;
                if (indicator) {
                    sendResponse({msg: indicator.value, map: JSON.stringify(mappings) });
                }
            }
        });
        return true;
    } else if (request.id === 3) {
        Graph.getInstance().then( (graph) => {
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
        });
    } else if (request.id === 4) {
        Graph.getInstance().then( (graph) => {
            let nodeId;
            if (request.hasOwnProperty("type")) {
                // We are dealing with a valid indicator
                nodeId = graph.addNode(request.indicator, request.type);
            } else {
                const stix = request.stix;
                const label = request.label;
                graph.addSTIXNode(stix["id"], label, stix["type"], stix);
                nodeId = stix["id"];
            }
            if (request.relName) {
                browser.storage.local.get("history").then( (result) => {
                    if (result.hasOwnProperty("history")) {
                        const history = result.history;
                        if (history.length > 0 ) {
                            const indicator = history[0];
                            const nodes = graph.getNodesByLabel(indicator);

                            let relNodeId;
                            if (nodes.length === 0) {
                                relNodeId = graph.addNode(indicator, indicator.type);
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
                    }
                });
            }
            browser.tabs.query({active:true, lastFocusedWindow: true}).then(tabs => {    
                let activeTab = tabs[0].id;
                browser.tabs.sendMessage(activeTab, "show-msg:Node added to the graph")
                    .then((response) => {
                    })
                    .catch((error) => {
                    });
            });
        });
    }
})
