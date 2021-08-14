var tools;
loadToolsList(function(ts) {
    tools=ts;
    createToolsMenu(tools);
})

var regex=loadRegex();

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
 * @param {selectedText} indicator selected by the user
 * @param {tag} indicator type (domain, URL, ip, etc.)
 */
function updateToolsMenu(toolsList, selectedText, tag) {
    for (i=0; i<toolsList.length; i++){
        let tool = toolsList[i];
        // If the tool is not compatible, hide the menu entry
        if(!tool["tags"].includes(tag)){
            browser.contextMenus.update(i.toString(), {
                visible: false
            });
        } else {
            // Otherwise make it visible and add the click event
            browser.contextMenus.update(i.toString(),{
                visible: true,
                onclick: function(){
                    // Replace the placeholder with the selected text
                    let url = cookURL(tool["url"],selectedText); 
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
        console.log(request);
        sendResponse({msg: localStorage.getItem("inputString")});
    } else {
        if(request.tag != "none"){
            // update the local storage only if a valid indicator was selected
            localStorage.setItem("tag", request.tag);
            localStorage.setItem("inputString",request.selectedText);
        }
        updateToolsMenu(tools, request.selectedText, request.tag);
    }
})
