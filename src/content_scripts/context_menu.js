// Type of the last selected string
var lastType = "";

/**
 * Selection change event
 */
document.addEventListener("contextmenu", (evt) => {
    indicatorParser = new IndicatorParser();
    let selectedText = document.getSelection().toString().trim();

    if(selectedText) {
        // Determine the type of the indicator selected
        [type, tld] = indicatorParser.getIndicatorType(selectedText);
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

