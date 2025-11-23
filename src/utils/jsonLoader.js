/**
 * Open and read a JSON file
 * @param {file} JSON file to open
 * @param {callback} callback function
 */
function readJSONFile(file) {
    return new Promise(function (resolve, reject) {
        const fileURI = chrome.runtime.getURL(file);
        fetch(fileURI).then( (response) => {
            if (!response.ok) {
                reject({
                    status: "error",
                    statusText: response.status
                });
            }
            return response.json(); // Parse JSON if the file is JSON
        }).then( (fileContent) => {
            resolve(fileContent);
        });
    });
}

/**
 * Load the tools list from JSON file or from local storage.
 */
function loadBuiltInTools() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get("tools").then( (result) => {
            if (result.hasOwnProperty("tools")) {
                resolve(result);
            } else {
                readJSONFile("src/json/tools.json").then( (data) => {
                    const parsedData = data;
                    return chrome.storage.local.set({ "tools": parsedData["tools"]}).then( () => parsedData);
                }).then( (parsedData) => {
                    resolve(parsedData);
                });
            }
        });
    });
}

function loadTools() {
    return loadBuiltInTools().then( (result) => {
        const tools = result.tools;
        return chrome.storage.local.get("toolsExt").then( (result) => {
            if (result.hasOwnProperty("toolsExt")) {
                console.log("Loaded %s tools", tools.length);
                tools.push(...result.toolsExt);
                return tools;
            } else {
                return tools;
            }
        });
    });
}


/**
 * Load the graph mapping from JSON file or from local storage.
 */
function loadGraphMapping() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get("graphMapping").then( (result) => {
            if (result.hasOwnProperty("graphMapping")) {
                resolve(result.graphMapping);
            } else {
                readJSONFile("src/json/graph-nodes.json").then( (data) => {
                    const parsedData = data;
                    return chrome.storage.local.set({ "graphMapping": parsedData["graph-nodes"]}).then( () => parsedData);
                }).then( (parsedData) => {
                    resolve(parsedData);
                });
            }
        });
    });
}
