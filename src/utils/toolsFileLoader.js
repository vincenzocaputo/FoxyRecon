/**
 * Open and read a JSON file
 * @param {file} JSON file to open
 * @param {callback} callback function
 */
function readJSONFile(file) {
    return new Promise(function (resolve, reject) {
        const fileURI = browser.runtime.getURL(file);
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
        browser.storage.local.get("tools").then( (result) => {
            if (result.hasOwnProperty("tools")) {
                resolve(result.tools);
            } else {
                readJSONFile("src/json/tools.json").then( (data) => {
                    const parsedData = data;
                    return browser.storage.local.set({ "tools": parsedData["tools"]}).then( () => parsedData);
                }).then( (parsedData) => {
                    resolve(parsedData);
                });
            }
        });
    });
}

function loadTools() {
    return loadBuiltInTools().then( (tools) => {
        return browser.storage.local.get("toolsExt").then( (result) => {
            if (result.hasOwnProperty("toolsExt")) {
                tools.push(...result.toolsExt);
                return tools;
            } else {
                return tools;
            }
        });
    });
}


