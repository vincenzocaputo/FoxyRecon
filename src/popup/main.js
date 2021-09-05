// Get addon version from manifest file
const manifest = browser.runtime.getManifest();
document.getElementById("version-tag").textContent = "Version "+manifest.version;


var inputField = document.getElementById("input-box");

indicatorParser = new IndicatorParser();

// Check if the input string is in local storage
if(!localStorage.getItem("indicator")) {
    inputField.focus();
} else {
    // If there is a saved state, restore it
    indicator = localStorage.getItem("indicator");
    // Put the indicator in the text field
    inputField.value = indicator;
    // Restore the type of the string
    type = localStorage.getItem("type");
    // Show the buttons related to the tools that support this indicator
    showButtonsByType(type, indicator);
}


/**--------------------------------------INPUT TEXT FIELD--------------------------------------**/

/**
 * 
 * Handle the clicking on tool icon inside the text field
 *
 */
var textfieldTool = document.querySelector("#text-field>img");
textfieldTool.title = "Extract domain";
textfieldTool.addEventListener("click", function() {
    let inputString = document.getElementById("input-box").value;
    let domain = indicatorParser.getDomain(inputString);
    
    document.getElementById("input-box").value = domain;

    // Show the appropriate tools for the input provided
    showButtonsByType("domain", domain);
    // Save the current indicator along with its type
    localStorage.setItem("indicator", domain);
    localStorage.setItem("type", "domain");
});


/**
 * 
 * For each charachter typed, check if the string is a valid input
 *
 */
inputField.addEventListener("keyup", (e) => {
    let inputString = document.getElementById("input-box").value;
    console.log("HELLO");
    // If no input was provided, show the add-on logo
    if(inputString === "") {
        showAddonLogo();
    } else {
        // Get indicator type
        let type = indicatorParser.getIndicatorType(inputString);
        if(type === "invalid") {
            showAddonLogo();
            showMessagePopup("Please enter a valid indicator", MessageType.ERROR);
        } else if(type === "internal") {
            showAddonLogo();
            showMessagePopup("The IP address is internal", MessageType.WARNING);
        } else {
            // Show the appropriate tools for the input provided
            showButtonsByType(type, inputString);
            // Save the current indicator along with its type
            localStorage.setItem("indicator", inputString);
            localStorage.setItem("type", type);
        }
    }
});


/**----------------------------------OPTION SETTINGS POP-UP----------------------------------------------**/

/**
 * Show or hide settings popup menu
 */
document.getElementById("settings-button").addEventListener("click", function() {
    settingsPopup = document.getElementById("settings-popup");
    if(!settingsPopup.style.display || settingsPopup.style.display == "none" ) {
        // Don't show pointer cursor on buttons
        document.querySelectorAll(".tool-entry").forEach(function(entry) {
            entry.style.cursor = "default";
        });

        settingsPopup.style.display = "block";

        newtabOption = localStorage.getItem("settings.newtab");
        if(!newtabOption) {
            // Default option: open always a new tab
            newtabOption = "true";
        }
        // Set checkbox saved value
        checkbox = document.querySelector("#settings-container input");
        checkbox.checked = (newtabOption === "true");
        localStorage.setItem("settings.newtab", newtabOption);
    } else {
        // Show pointer cursor on buttons
        document.querySelectorAll(".tool-entry").forEach(function(entry) {
            entry.style.cursor = "pointer";
        });
        settingsPopup.style.display = "none";
    }
});


/**
 * Handle the clicking outside the settings popup area
 */
document.addEventListener("click", function(evt) {
    settingsPopup = document.getElementById("settings-popup");
    settingsButton = document.getElementById("settings-button");

    if(settingsPopup.style.display == "block") {
        buttonPos = settingsButton.getBoundingClientRect();
        popupPos = settingsPopup.getBoundingClientRect();
        // Check if the user has clicked outside the popup
        if(((evt.pageX < popupPos.left || evt.pageX > popupPos.right) || 
            (evt.pageY < popupPos.top || evt.pageY > popupPos.bottom)) &&
            ((evt.pageX < buttonPos.left || evt.pageX > buttonPos.right) || 
            (evt.pageY < buttonPos.top || evt.pageY > buttonPos.bottom))) {
            // Fire settings button click event to close the settings popup
            document.getElementById("settings-button").click();
        }
    }
});


/**
 * Handle settings checkbox change event
 */
document.querySelector("#settings-popup input").addEventListener("change", function(evt) {
    let linksNodes = document.getElementById("tools-list").children;
    newtabOption = evt.target.checked;
    localStorage.setItem("settings.newtab", newtabOption);
});
