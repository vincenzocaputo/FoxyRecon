/**
 * Open and read a JSON file
 * @param {file} JSON file to open
 * @param {callback} callback function
 */
function readJSONFile(file, callback) {
    let rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if(rawFile.readyState == 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null); 
}


/**
 * Load the tools list from JSON file or from local storage.
 * @param {function} callbackFunc Callback function to call when the loading process completes
 */
function loadToolsList(callbackFunc) {
    var manifest = browser.runtime.getManifest();
    newVersion = manifest.version;
    console.log("New version: "+newVersion);

    var tools;
    // Check if the addon cache is updated
    if(localStorage.getItem('version')) {
        installedVersion = localStorage.getItem('version');
        console.log("Installed version: " + installedVersion);
    } else {
        // Assume that the version of the installed addon is older
        installedVersion = 0;
    }
    // Check if the list is already in the local storage
    if(!localStorage.getItem('tools') || installedVersion != newVersion) {
        // Load the list from the JSON file
        readJSONFile("src/json/tools.json", function(text) {
            var data = JSON.parse(text);
            tools = data['tools'];
            localStorage.setItem('tools', JSON.stringify(tools));
            console.log("tools loaded from json file");
            callbackFunc(tools);
        });
        localStorage.setItem('version', newVersion);

    } else {
        // Load the tools list from the local storage
        tools = JSON.parse(localStorage.getItem('tools'));
        console.log("tools loaded from local storage");
        callbackFunc(tools);
    }
}

