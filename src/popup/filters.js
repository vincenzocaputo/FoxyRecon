function getInputFilter(inputString) {
    let fToolName = "";
    let inputIndicator = "";
    // Get indicator + possible search filters
    let inputs = inputString.split(" ");
    if(inputs.length > 1) {
        // There is a search filter
        inputIndicator = inputs[0];
        const switchButton = document.querySelector("#filter-by-tool>div");
        switchButton.setAttribute("data-value", "on");
        switchButton.classList.add("clicked-btn");
        switchButton.querySelector("img").src = "../../assets/icons/tools_on.png";
        
        if(inputs[1][0] === "!") {
            fToolName = inputs[1].split("!")[1];
        } else if(inputs[1].startsWith("tool:")) {
            fToolName = inputs[1].split("tool:")[1];
        } else {
            inputIndicator = "";

            switchButton.setAttribute("data-value", "off");
            switchButton.classList.remove("clicked-btn");
            switchButton.querySelector("img").src = "../../assets/icons/tools.png";
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
    showButtonsByType(inputString, type, optionValue, isOnlyFav(), isOnlyAutoGraph(), isOnlyNoKey(), isOnlyNoInt(), fToolName);
    if(optionValue === "all") {
        document.querySelector("#filter-container-tags>select").value = "default";
    }
    browser.storage.local.get("indicator").then( (result) => {
        let indicator = result.indicator;
        indicator.tag = optionValue;
    });
});

/**
 *
 * Handle type selecting event
 *
 */
document.querySelector("#filter-container-types>select").addEventListener("change", (e) => {
    const optionValue = e.target.options[e.target.selectedIndex].value;
    const inputString = document.getElementById("input-box").value;
    showIndicatorsByType(optionValue, inputString);
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
        showButtonsByType(inputString, type, selectedTag, true, isOnlyAutoGraph(), isOnlyNoKey(), isOnlyNoInt(), fToolName);
        switchButton.setAttribute("data-value", "on");
        switchButton.classList.add("clicked-btn");
        switchButton.querySelector("img").src = "../../assets/icons/favourite_opt_w.png";
    } else {
        showButtonsByType(inputString, type, selectedTag, false, isOnlyAutoGraph(), isOnlyNoKey(), isOnlyNoInt(), fToolName);
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
        showButtonsByType(inputString, type, selectedTag, isOnlyFav(), true, isOnlyNoKey(), isOnlyNoInt(), fToolName);
        switchButton.setAttribute("data-value", "on");
        switchButton.classList.add("clicked-btn");
        switchButton.querySelector("img").src = "../../assets/icons/graph_opt_w.png";
    } else {
        showButtonsByType(inputString, type, selectedTag, isOnlyFav(), false, isOnlyNoKey(), isOnlyNoInt(), fToolName);
        switchButton.setAttribute("data-value", "off");
        switchButton.classList.remove("clicked-btn");
        switchButton.querySelector("img").src = "../../assets/icons/graph_opt.png";
    }
});

/**
 *
 * Handle filtering button clicking event. Show only tools that do not require accounts
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
        showButtonsByType(inputString, type, selectedTag, isOnlyFav(), isOnlyAutoGraph(), true, isOnlyNoInt(), fToolName);
        switchButton.setAttribute("data-value", "on");
        switchButton.classList.add("clicked-btn");
        switchButton.querySelector("img").src = "../../assets/icons/key_opt.png";
    } else {
        showButtonsByType(inputString, type, selectedTag, isOnlyFav(), isOnlyAutoGraph(), false, isOnlyNoInt(), fToolName);
        switchButton.setAttribute("data-value", "off");
        switchButton.classList.remove("clicked-btn");
        switchButton.querySelector("img").src = "../../assets/icons/no_key_opt.png";
    }
});

/**
 *
 * Handle filtering button clicking event. Show only tools that do not require user interactions
 *
 */
document.querySelector("#show-only-noint>div").addEventListener("click", (e) => {
    const switchButton = document.querySelector("#show-only-noint>div");
    let inputString = inputField.value;
    [inputString, fToolName] = getInputFilter(inputString);
    const [type, tld] = indicatorParser.getIndicatorType(inputString);
    const selectedTag = document.querySelector("#filter-container-tags>select").value
    const optionValue = switchButton.getAttribute("data-value");
    if (optionValue == "off" || optionValue == undefined) {
        showButtonsByType(inputString, type, selectedTag, isOnlyFav(), isOnlyAutoGraph(), isOnlyNoKey(), true, fToolName);
        switchButton.setAttribute("data-value", "on");
        switchButton.classList.add("clicked-btn");
        switchButton.querySelector("img").src = "../../assets/icons/int_opt.png";
    } else {
        showButtonsByType(inputString, type, selectedTag, isOnlyFav(), isOnlyAutoGraph(), isOnlyNoKey(), false, fToolName);
        switchButton.setAttribute("data-value", "off");
        switchButton.classList.remove("clicked-btn");
        switchButton.querySelector("img").src = "../../assets/icons/no_int_opt.png";
    }
});

document.querySelector("#filter-by-tool>div").addEventListener("click", (e) => {
    const switchButton = document.querySelector("#filter-by-tool>div");
    const inputField = document.querySelector("#input-box");
    let inputString = inputField.value;
    [inputString, fToolName] = getInputFilter(inputString);
    const [type, tld] = indicatorParser.getIndicatorType(inputString);
    const selectedTag = document.querySelector("#filter-container-tags>select").value
    const optionValue = switchButton.getAttribute("data-value");
    if (optionValue == "off" || optionValue == undefined) {
        inputField.value = inputField.value + " tool:"; 
        inputField.focus();
        switchButton.setAttribute("data-value", "on");
        switchButton.classList.add("clicked-btn");
        switchButton.querySelector("img").src = "../../assets/icons/tools_on.png";
    } else {
        inputField.value = inputField.value.split(' ')[0]; 
        switchButton.setAttribute("data-value", "off");
        switchButton.classList.remove("clicked-btn");
        switchButton.querySelector("img").src = "../../assets/icons/tools.png";
        showButtonsByType(inputString, type, selectedTag, isOnlyFav(), isOnlyAutoGraph(), isOnlyNoKey(), isOnlyNoInt(), "");

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

function isOnlyNoInt() {
    return document.querySelector("#show-only-noint>div").getAttribute("data-value") == "on";
}

