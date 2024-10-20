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
 * Load the mapping from JSON file or from local storage.
 * @param {function} callbackFunc Callback function to call when the loading process completes
 */
function loadGraphMapping(callbackFunc) {
    // Check if the list is already in the local storage
    browser.storage.local.get("autograph-mapping").then( (mapping) => {
        if (!mapping) {
            readJSONFile("src/json/graph-nodes.json", function(text) {
                var data = JSON.parse(text);
                mapping = data['graph-nodes'];
                browser.storage.local.set({"autograph-mapping": mapping});
                callbackFunc(mapping);
            });
        } else {
            // Load the tools list from the local storage
            callbackFunc(mapping);
        }
    });

}

