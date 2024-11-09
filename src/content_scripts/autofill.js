
var indicator = "";

function submitIndicator(query, submit, current_url) {
                   
    if(query && submit) {
        if(current_url.includes("urlscan.io")) {
            setTimeout(() => {
                document.getElementById("submitbtn_text").click();
            }, 1000);

        } else if(current_url.includes("centralops")) {
            document.getElementById("dom_whois").checked = true;
            document.getElementById("net_whois").checked = true;
            document.getElementById("dom_dns").checked = true;
            document.querySelector(query).click();
        } else if(current_url.includes("hackertarget.com/whatweb-scan")) {
            const tool = query.split(":")[0];
            const q = query.split(":")[1];
            if(tool === "whatweb") {
                document.querySelector("select").value = "whatweb";
            } else {
                document.querySelector("select").value = "wapp";
            }
            document.querySelector(query).click();
            
        } else {
            document.querySelector(query).click();
        }
    }
}

// Send a message to background script in order to retrieve the indicator saved in the local storage
function sendMessageAndFill() {
    browser.runtime.sendMessage({
        id: 1,
        msg: ""
    }).then((resp)=>{
        setTimeout(()=>{
        let indicator = resp.msg;
        // Get the query to find submit button
        const query = resp.query;

        // Get the selector to find the input field
        const inputSelector = resp.inputSelector;

        // Get typing animation option
        const typAnimOption = resp.typAnimOption;

        const submit = resp.submit;

        if(inputSelector) {
            const current_url = window.location.href;

            let inputField;
            if(current_url.includes("virustotal.com")) {
                // Get input field
                inputField = document.querySelector('home-view').shadowRoot.querySelector(inputSelector);
                window.addEventListener('load', function () {
                        inputField.value = indicator;
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
                });
                return;
            } else {
                inputField = document.querySelector(inputSelector);
            }

            if(current_url.includes("urlscan.io")) {
                // Select the scan visibility
                document.getElementById(query).click();
            }

            if(inputField) {
                inputField.value = "";
                if(typAnimOption) {
                    intv = setInterval(()=>{ 
                        const letter = indicator[0]; 
                        if(letter) { 
                            indicator = indicator.slice(1); 
                            inputField.value = inputField.value + letter 
                        } else { 
                            inputField.dispatchEvent(new Event("input"));
                            clearInterval(intv);
                            submitIndicator(query, submit, current_url);
                        } 
                    }, 50);
                } else {
                    setTimeout(() => {
                        inputField.value = indicator;
                        submitIndicator(query, submit, current_url);
                    }, 50);
                }
            }
        }
        }, 500);


    },(error)=>{
        console.log(error);
    });   
}


setTimeout(sendMessageAndFill(), 500);
