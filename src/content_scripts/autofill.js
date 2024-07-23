
var indicator = "";
// Send a message to background script in order to retrieve the indicator saved in the local storage
function sendMessageAndFill() {
    browser.runtime.sendMessage({
        id: 1,
        msg: ""
    }).then((resp)=>{
        indicator = resp.msg;
        // Get the query to find submit button
        console.log(indicator);
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
                        inputNode = document.querySelector('home-view').shadowRoot.querySelector('#urlSearchInput');
                        inputNode.value = indicator;
                    setTimeout(() => {
                        // "touch" the input field
                        inputNode.dispatchEvent(new Event('input'));
                    }, 100);
                    setTimeout(() => {
                        // Fill
                        if(submit === "true" && query === "VT") {
                            // after 100ms press "enter"
                            document.querySelector('home-view').shadowRoot.querySelector('#searchUrlForm').dispatchEvent(new Event("submit"));
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

            } else if(current_url.includes("eurodns")) {
                let inputNode = document.getElementsByTagName("textarea")[0];

                inputNode.value = indicator;
                if(submit === "true") {
                    document.querySelector(query).click();
                }

            } else if(current_url.includes("any.run")) {
                document.querySelector("#history-filterBtn").click();
                document.querySelector("#hashSearch").value = indicator;
                document.querySelector(query).click();
            } else if(current_url.includes("cymru")) {
                document.querySelector("#hashes").value = indicator;
                if (submit === "true") {
                    document.querySelector(query).click();
                }
            }else {

                var inputNodes = document.getElementsByTagName("input");
                console.log(inputNodes);
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
}


setTimeout(sendMessageAndFill(), 500);
