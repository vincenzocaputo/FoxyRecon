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
    var mapping;
    // Check if the list is already in the local storage
    if (!localStorage.getItem('autograph-mapping')) {
        // Load the list from the JSON file
        readJSONFile("src/json/graph-nodes.json", function(text) {
            var data = JSON.parse(text);
            mapping = data['graph-nodes'];
            localStorage.setItem('autograph-mapping', JSON.stringify(mapping));
            callbackFunc(mapping);
        });
    } else {
        // Load the tools list from the local storage
        mapping = JSON.parse(localStorage.getItem('autograph-mapping'));
        callbackFunc(mapping);
    }

}

