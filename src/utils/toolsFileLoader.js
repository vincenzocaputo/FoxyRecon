/**
 * Open and read a JSON file
 * @param {file} JSON file to open
 * @param {callback} callback function
 */
function readJSONFile(file) {
    return new Promise(function (resolve, reject) {
        let rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = function() {
            if(rawFile.readyState == 4 && rawFile.status == "200") {
                resolve(rawFile.responseText);
            }
        }
        rawFile.onerror = function() {
            reject({
                status: rawFile.status,
                statusText: "Network error"
            });
        };
        rawFile.send(null); 
    });
}

/**
 * Load the tools list from JSON file or from local storage.
 */
function loadBuiltInTools() {
    return new Promise((resolve, reject) => {
        browser.storage.local.get("tools").then( (result) => {
            if (result.hasOwnProperty("tools")) {
                resolve(result);
            } else {
                readJSONFile("src/json/tools.json").then( (data) => {
                    const parsedData = JSON.parse(data);
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
        return browser.storage.local.get("tools-ext").then( (toolsExt) => {
            if (toolsExt.hasOwnProperty("tools-ext")) {
                tools.push(...toolsExt);
                return tools;
            } else {
                return tools;
            }
        });
    });
}


