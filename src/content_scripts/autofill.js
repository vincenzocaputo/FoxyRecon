
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
        console.log(inputNodes[i]);
        if(inputNodes[i].type === "text" || inputNodes[i].type === "email"){
            // Fill the input field
            inputNodes[i].value = indicator;
        }
    } 

    // Get the query to find submit button
    query = resp.query;
    console.log(query);
    // If token is valid, click the button to submit indicator
    if(query) {
        document.querySelector(query).click();
    }

},(error)=>{
    console.error(error);
});   
