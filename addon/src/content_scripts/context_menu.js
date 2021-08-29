// Type of the last selected string
var lastType = "";

/**
 * Selection change event
 */
document.addEventListener("selectionchange", () => {
    indicatorTypeDetector = new IndicatorTypeDetector();
    selectedText = document.getSelection().toString().trim();
    if(selectedText) {
        // Determine the type of the indicator selected

        type = indicatorTypeDetector.getIndicatorType(selectedText);
        console.log("Type: "+type);
        if(type != "invalid"){
            // Send the selected text to background script along with its type
            browser.runtime.sendMessage({
                id: 0,
                indicator: selectedText,
                type: type
            });
        } else {
            if(lastType != type){
                browser.runtime.sendMessage({
                    id: 0,
                    indicator: "", // I don"t care about the content of the selected text
                    type: type
                });
            }
            // Otherwise I don"t have to send an update to background script
        }
        // Update the type of the last selected text
        lastType = type;
    }
})

