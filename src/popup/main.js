// Get addon version from manifest file
const manifest = browser.runtime.getManifest();
document.getElementById("addon-version").textContent = "VERSION "+manifest.version+" (BETA)";


var inputField = document.getElementById("input-box");

indicatorParser = new IndicatorParser();


// Check if there are some indicators found in the current webpage
var collectedIndicatorsListJson = localStorage.getItem("catched_indicators");
if(collectedIndicatorsListJson && collectedIndicatorsListJson !== undefined && collectedIndicatorsListJson !== "undefined") {
    const collectedIndicatorsList = JSON.parse(collectedIndicatorsListJson);
    var count = {"ip": 0, "domain": 0, "url": 0, "email": 0, "hash": 0, "cve": 0, "phone": 0, "asn": 0};
    collectedIndicatorsList.forEach(function(indicator) {
        count[indicator["type"]]++;
    });
    for(let key in count) {
        if(indCountContainer=document.getElementById(key+"_occ")) {
            indCountContainer.textContent = count[key];
        }
    }
}

// Check if the input string is in local storage
const indicator = localStorage.getItem("indicator");
if(!indicator || indicator === "undefined") {
    inputField.focus();
} else {
    // Put the indicator in the text field
    inputField.value = indicator;
    // Restore the type of the string
    const type = localStorage.getItem("type");
    // Restore the domain tld if present
    const tld = localStorage.getItem("tld");
    showCountryFlag(tld);
    // Restore tag option
    const optionValue = localStorage.getItem("tag") ?? "all";
    // If indicator is an URL or an email show domain extraction icon
    if(type === "url" || type === "email") {
        document.getElementById("domextr-icon").style.display = "block";
    } else {
        document.getElementById("domextr-icon").style.display = "none";
    }
    // Hide Catch! icon
    document.getElementById("catch-icon").style.display = "none";
    // Show the bin icon
    document.getElementById("bin-icon").style.display = "block";
    // Show the buttons related to the tools that support this indicator
    showButtonsByType(indicator, type, optionValue);
}


