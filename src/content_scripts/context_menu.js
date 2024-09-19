// Type of the last selected string
var lastType = "";
var selectedText = "";
var selectedTextType = "";

/**
 * Selection change event
 */
document.addEventListener("contextmenu", (evt) => {
    indicatorParser = new IndicatorParser();
    selectedText = document.getSelection().toString().trim();

    if(selectedText) {
        // Determine the type of the indicator selected
        [type, tld] = indicatorParser.getIndicatorType(selectedText);
        selectedTextType = type;
        if(type != "invalid"){
            if(type === "defanged") {
                // If the input string is defanged, refang it
                selectedText = indicatorParser.refangIndicator(selectedText);
                [type, tld] = indicatorParser.getIndicatorType(selectedText);
            }
            // Send the selected text to background script along with its type
            browser.runtime.sendMessage({
                id: 0,
                indicator: selectedText,
                type: type,
                tld: tld
            });
        } else {
            browser.runtime.sendMessage({
                id: 0,
                indicator: selectedText,
                type: type,
                tld: ""
            });
        }
    }
})





browser.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message === "open-add-note-popup") {
        createPopup(selectedText, selectedTextType);
    } else {
        //
    }
});

