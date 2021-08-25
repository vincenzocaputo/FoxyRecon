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
        currentVersion = localStorage.getItem('version');
        console.log("Current version: "+currentVersion);
    }
    // Check if the list is already in the local storage
    if(!localStorage.getItem('tools') || currentVersion != newVersion) {
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

/**
 * Load the regexes list from the JSON file or from the local storage
 * @return {regexList} regexes list loaded
 */
function loadRegex(){
    var manifest = browser.runtime.getManifest();
    newVersion = manifest.version;
    console.log("New version: "+newVersion);

    var regexList;
    // Check if the addon cache is updated
    if(localStorage.getItem('version')) {
        currentVersion = localStorage.getItem('version');
        console.log("Current version: "+currentVersion);
    }
    // Check if the list is already in the local storage
    if(!localStorage.getItem('regex')){
        // Otherwise load it from the JSON file
        readJSONFile("src/json/regex.json", function(text) {
            var data = JSON.parse(text);
            regexList = data['regex'];
            localStorage.setItem('regex', JSON.stringify(regexList));
            console.log("Regex loaded from json file");
        });
        localStorage.setItem('version', newVersion);
    } else {
        // Load the list from the local storage
        regexList = JSON.parse(localStorage.getItem('regex'));
        console.log("Regex loaded from local storage");
    }
    return regexList;
}

/**
 * Replace the placeholders in the URL with the appropriate string
 * @param {originalURL} URL to modify
 * @param {paramString} string to use to replace the placeholder
 * @return {finalURL} resulting URL
 */
function cookURL(originalURL, paramString) {
    var finalURL = originalURL;
    // plaintext parameter
    if(originalURL.includes('\%s')){
        finalURL = originalURL.replace('\%s',encodeURIComponent(paramString));
    } else if(originalURL.includes('\%r')){
        // Do not encode the input string
        finalURL = originalURL.replace('\%r',paramString);
    }     
    return finalURL;
}
