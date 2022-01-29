
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

    if(query) {
        // Check if auto-submit is enabled
        submit = resp.submit;

        let current_url = window.location.href;
        if(current_url.includes("urlscan")) {
            // Get input field
            inputNode = document.getElementById("url");
            document.getElementById(query).click();
            inputNode.value = indicator;
                setTimeout(() => {
                    document.getElementById("submitbtn_text").click();
                }, 1000);
        } else if(current_url.includes("virustotal")) {
            window.addEventListener('load', function () {
                    // Get input field
                    inputNode = document.querySelector('home-view').shadowRoot.querySelector('vt-ui-text-input').shadowRoot.querySelector("#input");
                    inputNode.value = indicator;
                setTimeout(() => {
                    // "touch" the input field
                    inputNode.dispatchEvent(new Event('input'));
                }, 100);
                setTimeout(() => {
                    // Fill
                    if(submit === "true" && query === "VT") {
                        // after 100ms press "enter"
                        document.querySelector('home-view').shadowRoot.querySelector("vt-ui-text-input").dispatchEvent(new Event("enter-pressed"));
                    }
                }, 100);
            })
        } else if(current_url.includes("centralops")) {
            // Fill the input field
            document.getElementById("addr").value = indicator;

            // Select checkboxes
            document.getElementById("dom_whois").checked = true;
            document.getElementById("net_whois").checked = true;
            document.getElementById("dom_dns").checked = true;

            if(submit === "true") {
                document.querySelector(query).click();
            }

        } else {
            // Get only text or email input nodes
            for(i=0; i<inputNodes.length; i++){
                if(inputNodes[i].type === "text" || inputNodes[i].type === "email" || inputNodes[i].type === "url"){
                    // Fill the input field
                    inputNodes[i].value = indicator;
                }
            }
            if(submit === "true") {
                document.querySelector(query).click();
            }
        }
    }

},(error)=>{
    console.error(error);
});   
