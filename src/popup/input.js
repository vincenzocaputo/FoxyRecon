/**
 *
 * Handle the clicking on bin icon inside the text field
 *
 */
const textfieldBin = document.getElementById("bin-icon");
textfieldBin.addEventListener("click", function() {
    // Clear the text input field
    inputField.value = "";
    textfieldCatch.style.display = "block";        
    textfieldTool.style.display = "none";
    // Hide flag
    document.querySelector("#flag").style.display = "none";
    // Clean the local storage
    localStorage.setItem("indicator", "");
    localStorage.setItem("type", "");
    localStorage.setItem("tag", "all");
    localStorage.setItem("tld", "");
    showAddonMain();
});


/**
 * Handle the clicking on IoC Catch icon inside the text field
 *
 */
var textfieldCatch = document.querySelector("#catch-icon");
textfieldCatch.title = "Collect indicators on this page";
textfieldCatch.addEventListener("click", function() {
    // Get the id of the current active tab in the current window
    browser.tabs.query({active:true, currentWindow:true}).then(tabs => {
        let activeTab = tabs[0].id;
        // Send a message to the content script
        browser.tabs.sendMessage(activeTab, "catch");
        let token = 1;
        browser.runtime.onMessage.addListener(function(message) {
            if(token) {
                // No indicators found. Show a message
                if(message['indicators'] == "[]") {
                    showMessagePopup("No indicators found in this page", MessageType.INFO);
                } else {
                    //countFoundIndicators();
                    const indicatorsList = JSON.parse(message['indicators']);
                    var count = {"ip": 0, "domain": 0, "url": 0, "email": 0, "hash": 0, "cve": 0, "phone": 0, "asn": 0};
                    indicatorsList.forEach(function(indicator) {
                        if(indicator["type"] !== "internal") {
                            count[indicator["type"]]++;
                        }
                    });
                    for(let key in count) {
                        console.log(key);
                        document.getElementById(key+"_occ").textContent = count[key];
                    }
                    collectedIndicatorsListJson = message['indicators'];
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
 * Handle the clicking on History icon inside the text field
 *
 */
var historyIcon = document.getElementById("hist-icon");
historyIcon.title = "History";
historyIcon.addEventListener("click", function() {
    let divDisplay = document.getElementById("history").style.display;
    if(divDisplay == "block") {
        document.getElementById("history").style.display = "none";
    } else {
        document.getElementById("history").style.display = "block";
    }
});

document.querySelectorAll("#history>.hist-entry").forEach((entry)=>{
    entry.addEventListener("click", function(e) {
        history_indicator = e.target.textContent;
        inputField.value = history_indicator;
        const [type, tld] = indicatorParser.getIndicatorType(history_indicator);
        document.querySelector("#catch-icon").style.display = "none";
        document.querySelector("#flag").style.display = "none";
        document.getElementById("history").style.display = "none";
        submitIndicator(history_indicator, type, tld, "", "");
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
 * @param{tld}: domain tld, if present
 * @param{tag}: possible tag to filter resources
 * @param{tool}: possible tool name
 */
function submitIndicator(indicator, type, tld, tag, toolName) {
    // Show the appropriate tools for the input provided

    showCountryFlag(tld);
    showButtonsByType(indicator, type, tag, isOnlyFav(), isOnlyAutoGraph(), isOnlyNoKey(), toolName);
    // Save the current indicator along with its type
    localStorage.setItem("indicator", indicator);
    localStorage.setItem("type", type);
    localStorage.setItem("tld", tld);
    //localStorage.setItem("graph.autocreate", "true");
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


inputField.addEventListener("focus", (e) => {
    document.getElementById("history").style.display = "none";
});

/**
 * 
 * For each charachter typed, check if the string is a valid input
 *
 */
inputField.addEventListener("keyup", (e) => {
    let inputString = inputField.value;
    // Remove badge text
    browser.browserAction.setBadgeText({text: ''});
    // If no input was provided, show the add-on logo and the history icon
    if(inputString === "") {
        showAddonMain();
        localStorage.setItem("indicator", "");
        localStorage.setItem("type", "");
        localStorage.setItem("tag", "");
        localStorage.setItem("", "");

        textfieldCatch.style.display = "block";        
        textfieldTool.style.display = "none";

    } else {
        // Show the bin icon
        document.getElementById("bin-icon").style.display = "block";
        // Hide the catch icon
        textfieldCatch.style.display = "none";
        
        let type = "";
        let inputIndicator = "";
        let fToolName = "";

        [inputIndicator, fToolName] = getInputFilter(inputString);

        if(type!="invalid") {
            // Get indicator type
            [type, tld] = indicatorParser.getIndicatorType(inputIndicator);
        }

        if(type === "defanged") {
            // If the input string is defanged, refang it
            inputIndicator = indicatorParser.refangIndicator(inputIndicator);
            // Get the real type of the indicator
            [type, tld] = indicatorParser.getIndicatorType(inputIndicator);
        } 

        if(type === "invalid") {
            showAddonMain();
            showCountryFlag("");
            textfieldTool.style.display = "none";
            showMessagePopup("Please enter a valid indicator", MessageType.ERROR);
        } else if(type === "internal") {
            showAddonMain();
            textfieldTool.style.display = "none";
            showMessagePopup("The IP address is internal", MessageType.WARNING);
        } else {
            // Get selected tag option
            const selectNode = document.querySelector("#filter-container-tags>select");
            const optionValue = selectNode.options[selectNode.selectedIndex].value;
            
            submitIndicator(inputIndicator, type, tld, optionValue, fToolName);
        }

    }
});

