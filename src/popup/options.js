function setCheckboxStatus(checkboxNode, optionName) {
    let optionValue = localStorage.getItem(optionName);
    if(!optionValue) {
        // Default option: open always a new tab
        if(optionName === "settings.newtab") {
            optionValue = "true";
        } else if(optionName === "settings.autosubmit") {
            // auto-submit disabled
            optionValue = "false";
        } else if(optionName === "settings.autocatch") {
            // auto-catch enabled
            optionValue = "true";
        } else if(optionName === "settings.autograph") {
            optionValue = "true";
        }
    }
    checkboxNode.checked = (optionValue === "true");
    localStorage.setItem(optionName, optionValue);
}


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
    
    setCheckboxStatus(document.querySelector("#open-tab-opt input"), "settings.newtab");
    setCheckboxStatus(document.querySelector("#typ-anim-opt input"), "settings.typanim");
    setCheckboxStatus(document.querySelector("#auto-submit-opt input"), "settings.autosubmit");
    setCheckboxStatus(document.querySelector("#auto-catch-opt input"), "settings.autocatch");
    setCheckboxStatus(document.querySelector("#auto-graph-opt input"), "settings.autograph");
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
 * Handle typing animation option checkbox change event
 */
document.querySelector("#typ-anim-opt input").addEventListener("change", function(evt) {
    //let linksNodes = document.getElementById("tools-list").children;
    typAnimOption = evt.target.checked;
    localStorage.setItem("settings.typanim", typAnimOption);
});

/**
 * Handle auto-submit option checkbox change event
 */
document.querySelector("#auto-submit-opt input").addEventListener("change", function(evt) {
    //let linksNodes = document.getElementById("tools-list").children;
    autosubmitOption = evt.target.checked;
    localStorage.setItem("settings.autosubmit", autosubmitOption);
});

/**
 * Handle auto-submit option checkbox change event
 */
document.querySelector("#auto-catch-opt input").addEventListener("change", function(evt) {
    autocatchOption = evt.target.checked;
    localStorage.setItem("settings.autocatch", autocatchOption);
    if (!autocatchOption) {
        // Wipe indicators list
        localStorage.setItem("catched_indicators", "[]");
        // Set 0 counter as badge
        browser.browserAction.setBadgeText({text: ""});
    }
});

/**
 * Handle auto-graph option checkbox change event
 */
document.querySelector("#auto-graph-opt input").addEventListener("change", function(evt) {
    autographOption = evt.target.checked;
    localStorage.setItem("settings.autograph", autographOption);
});

/**
 * Handle open settings page button click event
 */
document.querySelector("#open-settings").addEventListener("click", function(evt) {
    browser.tabs.create({
        url: '/src/custom_tools/custom-tools.html'
    });
});

