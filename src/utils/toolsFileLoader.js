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
    var tools;
    // Check if the list is already in the local storage
    if (!localStorage.getItem('tools')) {
        // Load the list from the JSON file
        readJSONFile("src/json/tools.json", function(text) {
            var data = JSON.parse(text);
            tools = data['tools'];
            localStorage.setItem('tools', JSON.stringify(tools));
            console.log("tools loaded from json file");
            if(localStorage.getItem('tools-ext')) {
                // Load custom tools, if exist
                toolsExt = JSON.parse(localStorage.getItem('tools-ext'));
                console.log("custom tools loaded from local storage");
                tools.push(...toolsExt);
            }
        });
    } else {
        // Load the tools list from the local storage
        tools = JSON.parse(localStorage.getItem('tools'));
        console.log("tools loaded from local storage");
        if(localStorage.getItem('tools-ext')) {
            // Load custom tools, if exist
            toolsExt = JSON.parse(localStorage.getItem('tools-ext'));
            console.log("custom tools loaded from local storage");
            tools.push(...toolsExt);
        }
    }


    callbackFunc(tools);
}

