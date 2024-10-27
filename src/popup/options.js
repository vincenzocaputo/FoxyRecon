document.getElementById("settings-popup-close").addEventListener("click", function() {
    const settingsPopup = document.getElementById("options-popup");
    document.querySelector("#background").style.display = "none";
    // Show pointer cursor on buttons
    document.querySelectorAll(".tool-entry").forEach(function(entry) {
        entry.style.cursor = "pointer";
    });
    settingsPopup.style.display = "none";
    settingsPopup.classList.remove("open-popup");

});

/**
 * Show or hide settings popup menu
 */
document.getElementById("settings-button").addEventListener("click", function() {
    const settingsPopup = document.getElementById("options-popup");
    // Don't show pointer cursor on buttons
    document.querySelectorAll(".tool-entry").forEach(function(entry) {
        entry.style.cursor = "default";
    });

    document.querySelector("#background").style.display = "block";
    settingsPopup.style.display = "block";
    settingsPopup.classList.add("open-popup");
    
    browser.storage.local.get("settings").then( (result) => {
        const settings = result.settings;
        document.querySelector("#open-tab-opt input").checked = settings.newtab;
        document.querySelector("#typ-anim-opt input").checked = settings.autosubmit;
        document.querySelector("#auto-submit-opt input").checked = settings.autocatch;
        document.querySelector("#auto-catch-opt input").checked = settings.autograph;
    });
});


/**
 * Handle the clicking outside the popup area
 */
//document.addEventListener("click", function(evt) {
//    const settingsPopup = document.getElementById("options-popup");
//    const settingsButton = document.getElementById("settings-button");
//
//    if(settingsPopup.style.display == "block") {
//        const buttonPos = settingsButton.getBoundingClientRect();
//        const popupPos = settingsPopup.getBoundingClientRect();
//        // Check if the user has clicked outside the popup
//        if(((evt.pageX < popupPos.left || evt.pageX > popupPos.right) || 
//            (evt.pageY < popupPos.top || evt.pageY > popupPos.bottom)) &&
//            ((evt.pageX < buttonPos.left || evt.pageX > buttonPos.right) || 
//            (evt.pageY < buttonPos.top || evt.pageY > buttonPos.bottom))) {
//            // Fire settings button click event to close the settings popup
//            document.getElementById("settings-button").click();
//        }
//    }
//
//    const addRelPopup = document.getElementById("add-relationship-popup");
//    const addRelButton = document.getElementById("add-rel-button");
//    const addRelCancelButton = document.getElementById("add-node-rel-close-button");
//
//    if(addRelPopup.style.display === "block") {
//        const buttonPos = addRelButton.getBoundingClientRect();
//        const popupPos = addRelPopup.getBoundingClientRect();
//        // Check if the user has clicked outside the popup
//        if(((evt.pageX < popupPos.left || evt.pageX > popupPos.right) || 
//            (evt.pageY < popupPos.top || evt.pageY > popupPos.bottom)) &&
//            ((evt.pageX < buttonPos.left || evt.pageX > buttonPos.right) || 
//            (evt.pageY < buttonPos.top || evt.pageY > buttonPos.bottom)) &&
//            evt.target.id !== "to-node-name" && evt.target.id !== "rel-node-name" 
//            && evt.target.tagName !== "OPTION") {
//            // Fire settings button click event to close the settings popup
//            addRelCancelButton.click();
//        }
//    }
//    event.stopPropagation();
//
//});


/**
 * Handle open tab option checkbox change event
 */
document.querySelector("#open-tab-opt input").addEventListener("change", function(evt) {
    //let linksNodes = document.getElementById("tools-list").children;
    newtabOption = evt.target.checked;
    browser.storage.local.get("settings").then( (result) => {
        let settings = result.settings;
        settings.newtab = newtabOption;
        return browser.storage.local.set({"settings": settings});
    }).then( (settings) => {
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
});

/**
 * Handle typing animation option checkbox change event
 */
document.querySelector("#typ-anim-opt input").addEventListener("change", function(evt) {
    //let linksNodes = document.getElementById("tools-list").children;
    typAnimOption = evt.target.checked;
    browser.storage.local.get("settings").then( (result) => {
        let settings = result.settings;
        settings.typanim = typAnimOption;
        browser.storage.local.set({"settings": settings});
    });
});

/**
 * Handle auto-submit option checkbox change event
 */
document.querySelector("#auto-submit-opt input").addEventListener("change", function(evt) {
    //let linksNodes = document.getElementById("tools-list").children;
    autosubmitOption = evt.target.checked;
    browser.storage.local.get("settings").then( (result) => {
        let settings = result.settings;
        settings.autosubmit = autosubmitOption;
        browser.storage.local.set({"settings": settings});
    });
});

/**
 * Handle auto-submit option checkbox change event
 */
document.querySelector("#auto-catch-opt input").addEventListener("change", function(evt) {
    autocatchOption = evt.target.checked;
    browser.storage.local.get("settings").then( (result) => {
        let settings = result.settings;
        settings.autocatch = autocatchOption;
        browser.storage.local.set({"settings": settings});
        if (!autocatchOption) {
            browser.storage.local.set({"catched_indicators": []}).then( () => {
                browserr.action.setBadgeText({text: ""});
            });
        }
    });
});

/**
 * Handle auto-graph option checkbox change event
 */
document.querySelector("#auto-graph-opt input").addEventListener("change", function(evt) {
    autographOption = evt.target.checked;
    browser.storage.local.get("settings").then( (result) => {
        let settings = result.settings;
        settings.autgraph = autographOption;
        browser.storage.local.set({"settings": settings});
    });
});

/**
 * Handle open settings page button click event
 */
document.querySelector("#open-settings").addEventListener("click", function(evt) {
    browser.tabs.create({
        url: chrome.runtime.getURL('/src/custom_tools/custom-tools.html')
    });
});

