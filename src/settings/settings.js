
function showMessageError(err_msg) {
    document.getElementById("error-box-message").textContent = err_msg;
    document.getElementById("error-box").style.display = "block";

}


window.onload = function() {
    document.getElementById("submit-btn").addEventListener("click", function() {
        let jsonCode = {
            "name": "",
            "url": {},
            "desc": "",
            "icon": "",
            "color": "",
            "types": [],
            "tags": []
        };

        jsonCode["name"] = document.getElementById("tool_name").value;
        
        if(jsonCode["name"] === "") {
            showMessageError("You must provide a name");
            return;
        }

        jsonCode["desc"] = document.getElementById("tool_desc").value;
        
        const domURL = document.getElementById("tool_dom_url").value;
        const ipURL = document.getElementById("tool_ip_url").value;
        const urlURL = document.getElementById("tool_url_url").value;
        const emailURL = document.getElementById("tool_email_url").value;
        const cveURL = document.getElementById("tool_cve_url").value;
       
        let isUrl = false; // Check if the user provided at least one URL
        if(domURL != "") {
            jsonCode["url"]["domain"] = domURL; 
            jsonCode["types"].push("domain");
            isUrl = true;
        }
        if(ipURL != "") {
            jsonCode["url"]["ip"] = ipURL;
            jsonCode["types"].push("ip");
            isUrl = true;
        }
        if(urlURL != "") {
            jsonCode["url"]["url"] = urlURL;
            jsonCode["types"].push("url");
            isUrl = true;
        }
        if(emailURL != "") {
            jsonCode["url"]["email"] = emailURL;
            jsonCode["types"].push("email");
            isUrl = true;
        }
        if(cveURL != "") {
            jsonCode["url"]["cve"] = cveURL;
            jsonCode["types"].push("cve");
            isUrl = true;
        }

        if(!isUrl) {
            showMessageError("You must provide at least one URL");
            return;
        }

        let selectedTags = [];

        document.querySelectorAll("input[type=checkbox]").forEach((e)=>{
            if(e.checked) {
                jsonCode["tags"].push(e.value);
            }
        });

        jsonCode["icon"] = "data:image/png;base64," + document.getElementById("tool_icon").value;
        jsonCode["color"] = document.getElementById("tool_color").value;


        document.getElementById("error-box").style.display = "none";
        if(localStorage.getItem("tools-ext")){
            tools = JSON.parse(localStorage.getItem("tools-ext"));
        } else {
            tools = [];
        }
        tools.push(jsonCode);
        console.log(tools);
        console.log(tools);
        localStorage.setItem("tools-ext", JSON.stringify(tools));
    });
}
