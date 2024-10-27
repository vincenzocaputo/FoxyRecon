// Get addon version from manifest file
const manifest = browser.runtime.getManifest();
document.getElementById("addon-version").textContent = "VERSION "+manifest.version+" (BETA)";

var inputField = document.getElementById("input-box");

indicatorParser = new IndicatorParser();


// Check if there are some indicators found in the current webpage
browser.storage.local.get("catched_indicators").then( (result) => {
    const collectedIndicatorsList = result.catched_indicators;

    if(collectedIndicatorsList && collectedIndicatorsList !== undefined && collectedIndicatorsList !== "undefined") {
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
});



