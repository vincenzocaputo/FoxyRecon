var inputNodes = document.getElementsByTagName("input");
let indicator = "";
// Send a message to background script in order to retrieve the indicator saved in the local storage
browser.runtime.sendMessage({
    id: 1,
    msg: ""
}).then((resp)=>{
    indicator = resp.msg;
    // Get only text or email input nodes
    for(i=0; i<inputNodes.length; i++){
        if(inputNodes[i].type === "text" || inputNodes[i].type === "email"){
            // Fill the input field
            inputNodes[i].value = indicator;
        }
    } 
},(error)=>{
    console.error(error);
});   
