importScripts('./lib/browser-polyfill.js');
importScripts('./utils/toolsFileLoader.js');
importScripts('./utils/storage.js');
importScripts('./utils/indicatorparser.js');
importScripts('./utils/graph.js');
var tools;

browser.runtime.onInstalled.addListener(function(details) {
    let currentVersion = browser.runtime.getManifest().version;
    if(details.reason === "install" || details.reasson === "update") {
        if (details.reason === "install") {
            createStorage().then( () => {;
                console.log("Current version: " + currentVersion);
                browser.storage.local.set({"version": currentVersion});
            });
        } else if(details.reason === "update") {
            browser.storage.local.get("version")
                .then( (installedVersion) => {
                    console.log("Installed version: " + installedVersion);
                    return installedVersion;
                }, () => {
                    // Assume that the installed version is obsolete
                    installedVersion = 0;
                    return installedVersion;
                })
                .then( (installedVersion) => {
                    setupStorageAfterUpdate().then( () => {
                        if (installedVersion !== currentVersion) {
                            detectStorageMigration(installedVersion, currentVersion).then( () => {
                                browser.tabs.create({
                                    discarded: true,
                                    title: "FoxyRecon New Version",
                                    url: 'https://github.com/vincenzocaputo/FoxyRecon/releases/tag/v'+currentVersion
                                });
                                // If a new version was released, clean the local storage
                                browser.storage.local.remove("tools");
                                browser.storage.local.remove("type");
                                browser.storage.local.remove("tag");
                                browser.storage.local.remove("autograph-mapping");
                                browser.storage.local.remove("submit-btn-query");
                                browser.storage.local.remove("autofill.submit-btn-query");
                                browser.storage.local.remove("autofill.input-selector");
                                browser.storage.local.remove("indicator");
                                // Add current version to local storage/
                                browser.storage.local.set({"version": currentVersion});
                            });
                        }
                    });
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
                    browser.storage.local.set(
                        {
                            "indicator": {
                                "type": type,
                                "value": selectionText,
                                "tld": tld
                            }
                        })
                        .then( () => {
                        browser.action.openPopup();
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


/**
 * Harvest and collect the indicators present in the current webpage. Save the list in the local storage.
 */
function catchIndicators(e) {
    browser.storage.local.get("settings").then( (settings) => {
        const autocatch_option = settings.autocatch;
        if (autocatch_option && autocatch_option === "true") {
            browser.tabs.query({active:true, lastFocusedWindow: true}).then(tabs => {    
                let activeTab = tabs[0].id;
                // Send a message to the content script
                browser.tabs.sendMessage(activeTab, "catch")
                            .then((response) => {
                            })
                            .catch((error) => {
                                browser.action.setBadgeText({text: ""});
                                browser.storage.local.set({"catched_indicators": "[]"});
                            });
                let token = 1;
                browser.runtime.onMessage.addListener(function(message) {
                    if(token) {
                        const indicatorsListJson = message['indicators'];
                        // No indicators found. Show a message
                        if(indicatorsListJson == "[]") {
                            browser.action.setBadgeText({text: ""});
                        } else {
                            const indicatorsList = JSON.parse(indicatorsListJson);
                            browser.action.setBadgeText({text: indicatorsList.length.toString()});
                        }
                        // Save the indicators list in the local storage
                        browser.storage.local.set({"catched_indicators": indicatorsListJson});
                    } 
                    // Consume token
                    token = 0;
                })
            },
            error => {
                browser.action.setBadgeText({text: ""});
                browser.storage.local.set({"catched_indicators": "[]"});
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
                    console.log(typAnimOption);
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
        // Auto graph generation
        browser.storage.local.get("settings").then( (result) => {
            if (result.hasOwnProperty("settings")) {
                const settings = result.settings;
                if (settings.autograph && request.msg) {
                    const resource = request.msg;
                    let mappings = Array();
                    for (i=0; i<graphMapping.length; i++) {
                        if (resource.startsWith(graphMapping[i]['source'])) {
                            mappings.push(graphMapping[i]);
                        }
                    }
                    return browser.storage.local.get("indicator");
                }
            }
            return Promise.resolve(null);
        })
        .then( (result) => {
            if(result && result.hasOwnProperty("indicator")) {
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
                console.log(nodeId);
            } else {
                const stix = request.stix;
                const label = request.label;
                graph.addSTIXNode(stix["id"], label, stix["type"], stix);
                nodeId = stix["id"];
            }
            if (request.relName) {
                browser.storage.local.get("indicator").then( (result) => {
                    if (result.hasOwnProperty("indicator")) {
                        const nodes = graph.getNodesByLabel(indicator.value);

                        let relNodeId;
                        if (nodes.length === 0) {
                            relNodeId = graph.addNode(indicator.value, indicator.type);
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
