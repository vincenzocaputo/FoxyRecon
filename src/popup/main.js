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
    const indicator = localStorage.getItem("indicator");
    // Put the indicator in the text field
    inputField.value = indicator;
    // Restore the type of the string
    const type = localStorage.getItem("type");
    // Restore tag option
    const optionValue = localStorage.getItem("tag");
    // Show the buttons related to the tools that support this indicator
    showButtonsByType(indicator, type, optionValue);
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
    const inputString = document.getElementById("input-box").value;
    const domain = indicatorParser.getDomain(inputString);
    
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
    const inputString = document.getElementById("input-box").value;
    // If no input was provided, show the add-on logo
    if(inputString === "") {
        showAddonLogo();
    } else {
        // Get indicator type
        const type = indicatorParser.getIndicatorType(inputString);
        if(type === "invalid") {
            showAddonLogo();
            showMessagePopup("Please enter a valid indicator", MessageType.ERROR);
        } else if(type === "internal") {
            showAddonLogo();
            showMessagePopup("The IP address is internal", MessageType.WARNING);
        } else {
            // Get selected tag option
            const selectNode = document.querySelector("#filter-container>select");
            const optionValue = selectNode.options[selectNode.selectedIndex].value;

            // Show the appropriate tools for the input provided
            showButtonsByType(inputString, type, optionValue);
            // Save the current indicator along with its type
            localStorage.setItem("indicator", inputString);
            localStorage.setItem("type", type);
            localStorage.setItem("tag", optionValue);
        }
    }
});


/**
 *
 * Handle tag selecting event
 *
 */
document.querySelector("#filter-container>select").addEventListener("change", (e) => {
    const inputString = document.getElementById("input-box").value;
    const type = indicatorParser.getIndicatorType(inputString);
    const optionValue = e.target.options[e.target.selectedIndex].value;
    showButtonsByType(inputString, type, optionValue);
});

/**----------------------------------OPTION SETTINGS POP-UP----------------------------------------------**/

function setCheckboxStatus(checkboxNode, optionName) {
    const optionValue = localStorage.getItem(optionName);
    if(!optionValue) {
        // Default option: open always a new tab
        optionValue = "true";
    }
    checkboxNode.checked = (optionValue === "true");
    localStorage.setItem(optionName, optionValue);
}

/**
 * Show or hide settings popup menu
 */
document.getElementById("settings-button").addEventListener("click", function() {
    const settingsPopup = document.getElementById("settings-popup");
    if(!settingsPopup.style.display || settingsPopup.style.display == "none" ) {
        // Don't show pointer cursor on buttons
        document.querySelectorAll(".tool-entry").forEach(function(entry) {
            entry.style.cursor = "default";
        });

        settingsPopup.style.display = "block";
        
        setCheckboxStatus(document.querySelector("#open-tab-opt input"), "settings.newtab");
        setCheckboxStatus(document.querySelector("#auto-submit-opt input"), "settings.autosubmit");
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
    const settingsPopup = document.getElementById("settings-popup");
    const settingsButton = document.getElementById("settings-button");

    if(settingsPopup.style.display == "block") {
        const buttonPos = settingsButton.getBoundingClientRect();
        const popupPos = settingsPopup.getBoundingClientRect();
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
 * Handle open tab option checkbox change event
 */
document.querySelector("#open-tab-opt input").addEventListener("change", function(evt) {
    //let linksNodes = document.getElementById("tools-list").children;
    newtabOption = evt.target.checked;
    localStorage.setItem("settings.newtab", newtabOption);
});

/**
 * Handle auto-submit option checkbox change event
 */
document.querySelector("#auto-submit-opt input").addEventListener("change", function(evt) {
    //let linksNodes = document.getElementById("tools-list").children;
    autosubmitOption = evt.target.checked;
    localStorage.setItem("settings.autosubmit", autosubmitOption);
});
