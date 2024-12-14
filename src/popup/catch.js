
/**
 * Handle catch container clicking event
 *
 */
document.querySelectorAll(".catch-container").forEach((v) => { 
    v.addEventListener("click", (e) => {
        browser.storage.local.get("catchedIndicators").then( (result) => {
            const collectedIndicatorsList = result.catchedIndicators;
            createIndicatorsList(collectedIndicatorsList, 'all'); 

            switch (v.id) {
                case "catch-ip":
                    document.querySelector("#filter-container-types > select").value = "ip";
                    showIndicatorsByType("ip");
                    break;
                case "catch-domain":
                    document.querySelector("#filter-container-types > select").value = "domain";
                    showIndicatorsByType("domain");
                    break;
                case "catch-url":
                    document.querySelector("#filter-container-types > select").value = "url";
                    showIndicatorsByType("url");
                    break;
                case "catch-hash":
                    document.querySelector("#filter-container-types > select").value = "hash";
                    showIndicatorsByType("hash");
                    break;
                case "catch-email":
                    document.querySelector("#filter-container-types > select").value = "email";
                    showIndicatorsByType("email");
                    break;
                case "catch-cve":
                    document.querySelector("#filter-container-types > select").value = "cve";
                    showIndicatorsByType("cve");
                    break;
                case "catch-phone":
                    document.querySelector("#filter-container-types > select").value = "phone";
                    showIndicatorsByType("phone");
                    break;
                case "catch-asn":
                    document.querySelector("#filter-container-types > select").value = "asn";
                    showIndicatorsByType("asn");
                    break;
            }
        });
    });
});


document.getElementById("download-button").addEventListener("click", (e)=> {
    let csvData = [];
    document.querySelectorAll(".catch-res-entry").forEach((node) => {
        if(node.style.display === "" || node.style.display === "grid") {
            csvData.push([node.title, node.type]);
        }
    });
    let csv = "indicator,type\n";
    csvData.forEach(function(row) {  
        csv += row.join(',');  
        csv += "\n";  
    });  
    window.location.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);

});

