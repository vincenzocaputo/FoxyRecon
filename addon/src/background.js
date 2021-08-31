var tools;
loadToolsList(function(ts) {
    tools=ts;
    createToolsMenu(tools);
})


/**
 * Create context menu containing the tools list
 * @param {toolsList} list of available tools
 */
function createToolsMenu(toolsList) {
    for (i=0; i<toolsList.length; i++){
        let tool = toolsList[i];
        // Create menu entry
        browser.contextMenus.create({
            id: i.toString(), // Incremental ID
            title: tool["name"], // Tool name
            contexts: ["selection"], // Show menu on selected text
            icons: {
                16: browser.runtime.getURL(tool["icon"]),
            },
            visible: true,
       });
    }
}

/**
 * Updates context menu making visible only the tools which are compatible with the selected string
 * @param {toolsList} available tools list
 * @param {indicator} indicator selected by the user
 * @param {type} indicator type (domain, URL, ip, etc.)
 */
function updateToolsMenu(toolsList, indicator, type) {
    for (i=0; i<toolsList.length; i++){
        let tool = toolsList[i];
        // If the tool is not compatible, hide the menu entry
        if(!tool["types"].includes(type)){
            browser.contextMenus.update(i.toString(), {
                visible: false
            });
        } else {
            // Otherwise make it visible and add the click event
            browser.contextMenus.update(i.toString(),{
                visible: true,
                onclick: function(){
                    // Replace the placeholder with the selected text
                    let url = cookURL(tool["url"][type], indicator); 
                    browser.tabs.create({
                        url: url,
                    });
                }
            });
        }
    }
}

/**
 * Waiting for  messages from content_script
 */
browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.id == 1) {
        // Send the query to find submit button
        query = localStorage.getItem("submit-btn-query");
        console.log(query);
        sendResponse({msg: localStorage.getItem("indicator"), query: query});
        // Consume the request (to avoid clicking the button more times for the same request)
        localStorage.setItem("submit-btn-query","");
    } else {
        console.log(request);
        if(request.type != "invalid"){
            // update the local storage only if a valid indicator was selected
            localStorage.setItem("type", request.type);
            localStorage.setItem("indicator",request.indicator);
        }
        updateToolsMenu(tools, request.indicator, request.type);
    }
})
