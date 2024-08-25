function getInputFilter(inputString) {
    let fToolName = "";
    let inputIndicator = "";
    // Get indicator + possible search filters
    let inputs = inputString.split(" ");
    if(inputs.length > 1) {
        // There is a search filter
        inputIndicator = inputs[0];
        
        if(inputs[1][0] === "!") {
            fToolName = inputs[1].split("!")[1];
        } else if(inputs[1].startsWith("tool:")) {
            fToolName = inputs[1].split("tool:")[1];
        } else {
            type = "invalid";
        }
    } else {
        inputIndicator = inputString;
    }
    return [inputIndicator, fToolName];
}

/**
 *
 * Handle tag selecting event
 *
 */
document.querySelector("#filter-container-tags>select").addEventListener("change", (e) => {
    let inputString = inputField.value;

    [inputString, fToolName] = getInputFilter(inputString);
    let [type, tld] = indicatorParser.getIndicatorType(inputString);
    if(type === "defanged") {
        // If the input string is defanged, refang it
        inputString = indicatorParser.refangIndicator(inputString);
        // Get the real type of the indicator
        [type, tld] = indicatorParser.getIndicatorType(inputString);
    }
    const optionValue = e.target.options[e.target.selectedIndex].value;
    showButtonsByType(inputString, type, optionValue, isOnlyFav(), isOnlyAutoGraph(), isOnlyNoKey(), fToolName);
    if(optionValue === "all") {
        document.querySelector("#filter-container-tags>select").value = "default";
    }
    localStorage.setItem("tag", optionValue);
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
document.querySelector("#show-only-fav>div").addEventListener("click", (e) => {
    const switchButton = document.querySelector("#show-only-fav>div");
    let inputString = inputField.value;
    [inputString, fToolName] = getInputFilter(inputString);
    const [type, tld] = indicatorParser.getIndicatorType(inputString);
    const selectedTag = document.querySelector("#filter-container-tags>select").value
    const showOnlyAutograph = document.querySelector("#show-only-autograph>div").getAttribute("data-value") == "on";
    const optionValue = switchButton.getAttribute("data-value");
    if (optionValue == "off" || optionValue == undefined) {
        showButtonsByType(inputString, type, selectedTag, true, isOnlyAutoGraph(), isOnlyNoKey(), fToolName);
        switchButton.setAttribute("data-value", "on");
        switchButton.classList.add("clicked-btn");
        switchButton.querySelector("img").src = "../../assets/icons/favourite_opt_w.png";
    } else {
        showButtonsByType(inputString, type, selectedTag, false, isOnlyAutoGraph(), isOnlyNoKey(), fToolName);
        switchButton.setAttribute("data-value", "off");
        switchButton.classList.remove("clicked-btn");
        switchButton.querySelector("img").src = "../../assets/icons/favourite_opt.png";
    }
});

/**
 *
 * Handle autograph filtering clicking event
 *
 */
document.querySelector("#show-only-autograph>div").addEventListener("click", (e) => {
    const switchButton = document.querySelector("#show-only-autograph>div");
    let inputString = inputField.value;
    [inputString, fToolName] = getInputFilter(inputString);
    const [type, tld] = indicatorParser.getIndicatorType(inputString);
    const selectedTag = document.querySelector("#filter-container-tags>select").value
    const optionValue = switchButton.getAttribute("data-value");
    if (optionValue == "off" || optionValue == undefined) {
        showButtonsByType(inputString, type, selectedTag, isOnlyFav(), true, isOnlyNoKey(), fToolName);
        switchButton.setAttribute("data-value", "on");
        switchButton.classList.add("clicked-btn");
        switchButton.querySelector("img").src = "../../assets/icons/graph_opt_w.png";
    } else {
        showButtonsByType(inputString, type, selectedTag, isOnlyFav(), false, isOnlyNoKey(), fToolName);
        switchButton.setAttribute("data-value", "off");
        switchButton.classList.remove("clicked-btn");
        switchButton.querySelector("img").src = "../../assets/icons/graph_opt.png";
    }
});

/**
 *
 * Handle autograph filtering clicking event
 *
 */
document.querySelector("#show-only-nokey>div").addEventListener("click", (e) => {
    const switchButton = document.querySelector("#show-only-nokey>div");
    let inputString = inputField.value;
    [inputString, fToolName] = getInputFilter(inputString);
    const [type, tld] = indicatorParser.getIndicatorType(inputString);
    const selectedTag = document.querySelector("#filter-container-tags>select").value
    const optionValue = switchButton.getAttribute("data-value");
    if (optionValue == "off" || optionValue == undefined) {
        showButtonsByType(inputString, type, selectedTag, isOnlyFav(), isOnlyAutoGraph(), true, fToolName);
        switchButton.setAttribute("data-value", "on");
        switchButton.classList.add("clicked-btn");
        switchButton.querySelector("img").src = "../../assets/icons/key_opt.png";
    } else {
        showButtonsByType(inputString, type, selectedTag, isOnlyFav(), isOnlyAutoGraph(), false, fToolName);
        switchButton.setAttribute("data-value", "off");
        switchButton.classList.remove("clicked-btn");
        switchButton.querySelector("img").src = "../../assets/icons/no_key_opt.png";
    }
});


function isOnlyFav() {
    return document.querySelector("#show-only-fav>div").getAttribute("data-value") == "on";
}

function isOnlyAutoGraph() {
    return document.querySelector("#show-only-autograph>div").getAttribute("data-value") == "on";
}

function isOnlyNoKey() {
    return document.querySelector("#show-only-nokey>div").getAttribute("data-value") == "on";
}

