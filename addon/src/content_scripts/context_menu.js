var regex = loadRegex();

// Type of the last selected string
var lastType = "";

/**
 * Selection change event
 */
document.addEventListener("selectionchange", () => {
    selectedText = document.getSelection().toString().trim();
    if(selectedText) {
        // Determine the type of the indicator selected
        if(selectedText.match(regex["ip"])){
            type = "ip";
            if(selectedText.match(regex["internalip"])){
                type = "internal";
            }
        } else if(selectedText.match(regex["domain"])){
            type = "domain";
        } else if(selectedText.match(regex["url"])){
            type = "url";
        } else if(selectedText.match(regex["hash"])){
            type = "hash";
        } else if(selectedText.match(regex["email"])){
            type = "email";
        } else {
            type = "none";
        }

        if(type != "none"){
            // Send the selected text to background script along with its type
            browser.runtime.sendMessage({
                id: 0,
                selectedText: selectedText,
                tag: type
            });
        } else {
            if(lastType != type){
                browser.runtime.sendMessage({
                    id: 0,
                    selectedText: "", // I don"t care about the content of the selected text
                    tag: type
                });
            }
            // Otherwise I don"t have to send an update to background script
        }
        // Update the type of the last selected text
        lastType = type;
    }
})

