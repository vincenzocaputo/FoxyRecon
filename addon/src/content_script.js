var regex=loadRegex();


/**
 * Selection change event
 */
document.addEventListener('selectionchange', () => {
    selectedText = document.getSelection().toString();
    
    if(selectedText) {
        // Determine the type of the indicator selected
        if(selectedText.match(regex['ip'])){
            type = "ip";
            if(selectedText.match(regex['internalip'])){
                type = "internal";
            }
        } else if(selectedText.match(regex['domain'])){
            type = "domain";
        } else if(selectedText.match(regex['url'])){
            type = "url";
        } else if(selectedText.match(regex['hash'])){
            type = "hash";
        } else {
            type = "none";
        }
        // Send the selected text to background script along with its type
        browser.runtime.sendMessage({
            selectedText: selectedText,
            tag: type
        })
    }
})
