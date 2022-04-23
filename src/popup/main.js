// Get addon version from manifest file
const manifest = browser.runtime.getManifest();
document.getElementById("version-tag").textContent = "Version "+manifest.version;


var inputField = document.getElementById("input-box");

indicatorParser = new IndicatorParser();

// Remove badge number
browser.browserAction.setBadgeText({text: ""});

// Check if the input string is in local storage
const indicator = localStorage.getItem("indicator");
if(!indicator || indicator === "undefined") {
    inputField.focus();
} else {
    // Put the indicator in the text field
    inputField.value = indicator;
    // Restore the type of the string
    const type = localStorage.getItem("type");
    // Restore tag option
    const optionValue = localStorage.getItem("tag");
    // If indicator is an URL or an email show domain extraction icon
    if(type === "url" || type === "email") {
        document.getElementById("domextr-icon").style.display = "block";
    } else {
        document.getElementById("domextr-icon").style.display = "none";
    }
    // Hide Hunt! icon
    document.getElementById("hunt-icon").style.display = "none";
    // Show the bin icon
    document.getElementById("bin-icon").style.display = "block";
    // Show the buttons related to the tools that support this indicator
    showButtonsByType(indicator, type, optionValue);
}


/**--------------------------------------INPUT TEXT FIELD--------------------------------------**/

/**
 *
 * Handle the clicking on bin icon inside the text field
 *
 */
const textfieldBin = document.getElementById("bin-icon");
textfieldBin.addEventListener("click", function() {
    // Clear the text input field
    inputField.value = "";
    textfieldHunt.style.display = "block";        
    textfieldTool.style.display = "none";
    // Clean the local storage
    localStorage.setItem("indicator", "");
    localStorage.setItem("type", "");
    localStorage.setItem("tag", "all");
    showAddonLogo();
});


/**
 * Handle the clicking on Hunt! icon inside the text field
 *
 */
var textfieldHunt = document.querySelector("#hunt-icon");
textfieldHunt.title = "Hunt!";
textfieldHunt.addEventListener("click", function() {
    // Get the id of the current active tab
    browser.tabs.query({active:true}).then(tabs => {
        let activeTab = tabs[0].id;
        // Send a message to the content script
        browser.tabs.sendMessage(activeTab, "hunt");
        let token = 1;
        browser.runtime.onMessage.addListener(function(message) {
            if(token) {
                // No indicators found. Show a message
                if(message['indicators'] == "[]") {
                    showMessagePopup("No indicators found in this page", MessageType.INFO);
                } else {
                    // Show a different placeholder text in the text input field
                    inputField.placeholder = "Select your indicator";
                    const indicatorsList = JSON.parse(message['indicators']);
                    createIndicatorsList(indicatorsList, 'all');
                    browser.browserAction.setBadgeText({text: indicatorsList.length.toString()});
                }
            }
            // Consume token
            token = 0;
        })
    }, 
    error => {
        console.error("Error: "+error)
    });
});


/**
 * 
 * Handle the clicking on tool icon inside the text field
 *
 */
var textfieldTool = document.getElementById("domextr-icon");
textfieldTool.title = "Extract domain";
textfieldTool.addEventListener("click", function() {
    const inputString = inputField.value;
    const domain = indicatorParser.getDomain(indicatorParser.refangIndicator(inputString));
    
    inputField.value = domain;

    // Show the appropriate tools for the input provided
    showButtonsByType(domain, "domain", "all");
    // Save the current indicator along with its type
    localStorage.setItem("indicator", domain);
    localStorage.setItem("type", "domain");
    localStorage.setItem("tag", "all");

    // Hide the icon
    textfieldTool.style.display = "none";
});

/**
 * Submit an indicator as input 
 * @param{indicator}: string representing the indicator to submit
 * @param{type}: indicator type
 * @param{tag}: possible tag to filter resources
 * @param{tool}: possible tool name
 */
function submitIndicator(indicator, type, tag, toolName) {
    // Show the appropriate tools for the input provided
    showButtonsByType(indicator, type, tag, false, toolName);
    // Save the current indicator along with its type
    localStorage.setItem("indicator", indicator);
    localStorage.setItem("type", type);
    if(!tag) {
        tag = "all";
    }
    localStorage.setItem("tag", tag);

    // If the indicator is an URL or email, show tool icon inside text field
    if(type === "url" || type === "email") {
        textfieldTool.style.display = "block";
    } else {
        textfieldTool.style.display = "none";
    }
    textfieldBin.style.display = "block";

}


/**
 * 
 * For each charachter typed, check if the string is a valid input
 *
 */
inputField.addEventListener("keyup", (e) => {
    let inputString = inputField.value;
    // If no input was provided, show the add-on logo
    if(inputString === "") {
        showAddonLogo();
        localStorage.setItem("indicator", "");
        localStorage.setItem("type", "");
        localStorage.setItem("tag", "");

        textfieldHunt.style.display = "block";        
        textfieldTool.style.display = "none";
    } else {
        // Show the bin icon
        document.getElementById("bin-icon").style.display = "block";
        textfieldHunt.style.display = "none";
        
        let type = "";
        let inputIndicator = "";
        let fToolName = "";
        // Get indicator + possible search filters
        let inputs = inputString.split(" ");
        if(inputs.length > 1) {
            // There is a search filter
            inputIndicator = inputs[0];
            let filterP = inputs[1].split(":");

            if(filterP[0] === "tool") {
                // Get tool name
                fToolName = filterP[1];
            } else {
                type === "invalid";
            }
        } else {
            inputIndicator = inputString;
        }

        if(type!="invalid") {
            // Get indicator type
            type = indicatorParser.getIndicatorType(inputIndicator);
        }

        if(type === "defanged") {
            // If the input string is defanged, refang it
            inputString = indicatorParser.refangIndicator(inputIndicator);
            // Get the real type of the indicator
            type = indicatorParser.getIndicatorType(inputIndicator);
        } 

        if(type === "invalid") {
            showAddonLogo();
            textfieldTool.style.display = "none";
            showMessagePopup("Please enter a valid indicator", MessageType.ERROR);
        } else if(type === "internal") {
            showAddonLogo();
            textfieldTool.style.display = "none";
            showMessagePopup("The IP address is internal", MessageType.WARNING);
        } else {
            // Get selected tag option
            const selectNode = document.querySelector("#filter-container-tags>select");
            const optionValue = selectNode.options[selectNode.selectedIndex].value;

            submitIndicator(inputIndicator, type, optionValue, fToolName);
        }
        if(fToolName) {
            console.log("Indicator: "+inputIndicator+" Tool: "+fToolName); 
        } else {
            console.log("Indicator: "+inputIndicator); 
        }

    }
});


/**
 *
 * Handle tag selecting event
 *
 */
document.querySelector("#filter-container-tags>select").addEventListener("change", (e) => {
    let inputString = inputField.value;
    let type = indicatorParser.getIndicatorType(inputString);
    if(type === "defanged") {
        // If the input string is defanged, refang it
        inputString = indicatorParser.refangIndicator(inputString);
        // Get the real type of the indicator
        type = indicatorParser.getIndicatorType(inputString);
    }
    const optionValue = e.target.options[e.target.selectedIndex].value;
    const showOnlyFavBtn = document.querySelector("#show-only-fav>button").value;
    if (showOnlyFavBtn == "off") {
        showButtonsByType(inputString, type, optionValue, false);
    } else {
        // If show only fav option is enabled, show only favourites tools
        showButtonsByType(inputString, type, optionValue, true);
    }
});

/**
 *
 * Handle type selecting event
 *
 */
document.querySelector("#filter-container-types>select").addEventListener("change", (e) => {
    const optionValue = e.target.options[e.target.selectedIndex].value;
    showIndicatorsByType(optionValue);
});

/**
 *
 * Handle star clicking event
 *
 */
document.querySelector("#show-only-fav>button").addEventListener("click", (e) => {
    const inputString = inputField.value;
    const type = indicatorParser.getIndicatorType(inputString);
    const selectedTag = document.querySelector("#filter-container-tags>select").value
    const optionValue = document.querySelector("#show-only-fav button").value;
    if (optionValue == "off" || optionValue == undefined) {
        showButtonsByType(inputString, type, selectedTag, true);
        document.querySelector("#show-only-fav button").value = "on";
        document.querySelector("#show-only-fav img").src = "../../assets/icons/favourite_opt_on.png";
    } else {
        showButtonsByType(inputString, type, selectedTag, false);
        document.querySelector("#show-only-fav button").value = "off";
        document.querySelector("#show-only-fav img").src = "../../assets/icons/favourite_opt.png";
    }
});
/**----------------------------------OPTION SETTINGS POP-UP----------------------------------------------**/

function setCheckboxStatus(checkboxNode, optionName) {
    let optionValue = localStorage.getItem(optionName);
    if(!optionValue) {
        // Default option: open always a new tab
        if(optionName === "settings.newtab") {
            optionValue = "true";
        } else if(optionName === "settings.autosubmit") {
            // auto-submit disabled
            optionValue = "false";
        }
    }
    console.log((optionValue === "true"));
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
    // Update the open icon option inside the tools buttons
    openOptionIcons = document.querySelectorAll(".tool-open-icon>img");
    for(icon of openOptionIcons) {
        if(!newtabOption) {
            // By default the addon opens resources in the current tab
            // let the user open in a new tab by clicking on this icon
            icon.src = "../../assets/icons/outside.png";
            icon.title = "Open in a new tab";
            icon.id = "open-icon-out";
        } else {
            icon.src = "../../assets/icons/inside.png";
            icon.title = "Open in current tab";
            icon.id = "open-icon-in";
        }
    }
});

/**
 * Handle auto-submit option checkbox change event
 */
document.querySelector("#auto-submit-opt input").addEventListener("change", function(evt) {
    //let linksNodes = document.getElementById("tools-list").children;
    autosubmitOption = evt.target.checked;
    localStorage.setItem("settings.autosubmit", autosubmitOption);
});
