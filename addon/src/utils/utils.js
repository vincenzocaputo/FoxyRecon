/**
 * Load the tools list from JSON file or from local storage.
 * @param {function} callbackFunc Callback function to call when the loading process completes
 */
function loadToolsList(callbackFunc) {
    var tools;
    // Check if the list is already in the local storage
    if(!localStorage.getItem('tools')) {
        // Load the list from the JSON file
        var t = $.getJSON(browser.runtime.getURL('src/json/tools.json'),function(json){
            tools = json['tools'];
            // Save the tools list in the local storage
            localStorage.setItem('tools', JSON.stringify(tools));
        });
        t.then(
            value=>{
                console.log("Tools have been loaded");
                // Call the callback function
                callbackFunc(tools);
            },

            error=>{console.error(error)}
        );
    } else {
        // Load the tools list from the local storage
        tools = JSON.parse(localStorage.getItem('tools'));
        console.log("Tools loaded from local storage");
        callbackFunc(tools);
    }
}

/**
 * Load the regexes list from the JSON file or from the local storage
 * @return {regexList} regexes list loaded
 */
function loadRegex(){
    var regexList;
    // Check if the list is already in the local storage
    if(!localStorage.getItem('regex')){
        // Otherwise load it from the JSON file
        var r=$.getJSON(browser.runtime.getURL('src/json/regex.json'), function(json) {
            regexList = json['regex'];
            // Save the list in the local storage
            localStorage.setItem('regex', JSON.stringify(regexList));
        })
        r.then(
            value=>{console.log("Regex have been loaded")},
            error=>{console.log(error.message)}
        )
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
