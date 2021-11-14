
var inputNodes = document.getElementsByTagName("input");
let indicator = "";
// Send a message to background script in order to retrieve the indicator saved in the local storage
browser.runtime.sendMessage({
    id: 1,
    msg: ""
}).then((resp)=>{
    indicator = resp.msg;
    // Get the query to find submit button
    query = resp.query;

    let current_url = window.location.href;
    if(current_url.includes("urlscan")) {
        // Get input field
        inputNode = document.getElementById("url");
        inputNode.value = indicator;
        if(query) {
            //Select scan type
            document.getElementById(query.split('$')[0]).click()

            //Click submit button
            console.log(query.split('$')[1]);
            document.querySelector(query.split('$')[1]).click()
        }
    } else if(current_url.includes("virustotal")) {
        window.addEventListener('load', function () {
            // Get input field
            inputNode = document.querySelector('home-view').shadowRoot.querySelector('vt-ui-text-input').shadowRoot.querySelector("#input");
            // Fill
            inputNode.value = indicator;
            if(query && query === "VT") {
                // "touch" the input field
                inputNode.dispatchEvent(new Event('input', {
                    bubbles: true,
                    cancelable: true,
                }));
                // after 100ms press "enter"
                setTimeout(() => {
                    document.querySelector('home-view').shadowRoot.querySelector("vt-ui-text-input").dispatchEvent(new Event("enter-pressed"));
                }, 100);
            }
        })
    } else {
        // Get only text or email input nodes
        for(i=0; i<inputNodes.length; i++){
            if(inputNodes[i].type === "text" || inputNodes[i].type === "email" || inputNodes[i].type === "url"){
                // Fill the input field
                inputNodes[i].value = indicator;
            }
        }
        if(query) {
            document.querySelector(query).click();
        }
    }

},(error)=>{
    console.error(error);
});   
