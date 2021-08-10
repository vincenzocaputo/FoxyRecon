var tools;
loadToolsList(function(ts){
    tools = ts;
    createToolsList(tools);
});
var regex=loadRegex();


var inputField = $('#input-box')

// Check if the input string is in local storage
if(!localStorage.getItem('inputString')) {
    inputField.focus();
} else {
    // If there is a saved state, restore it
    inputString = localStorage.getItem('inputString');
    inputField.val(inputString);
    // Restore the type of the string
    tag = localStorage.getItem('tag');
    showButtonsByTag(tag, inputString);
}

// For each charachter type, check if the string is a valid input
inputField.on("keyup", (e) => {
	var inputString = $('#input-box').val();
    if(inputString.match(regex['ip'])){
        tag = 'ip';
        if(inputString.match(regex['internalip'])){
            tag = 'internal';
        }
    } else if(inputString.match(regex['domain'])){
        tag = 'domain';
    } else if(inputString.match(regex['url'])){
        tag = 'url';
    } else if(inputString.match(regex['hash'])){
        tag = 'hash';
    } else {
        tag = 'invalid';
    }
    // Show the appropriate tools for the input
    showButtonsByTag(tag, inputString);
    // Save the popup state (input + tag)
    localStorage.setItem('inputString',inputString);
    localStorage.setItem('tag',tag);
});

/**
 * Create the tools list inside the popup
 * @param {toolsList} tools list
 */
function createToolsList(toolsList){
	var resultBox = document.getElementById('tools-list');
	for (i=0;i<toolsList.length;i++) {
        let tool = toolsList[i];
        let node = $("<div></div>");
        node.addClass("tool-entry");
        node.css('display','none');        
        
        let nodeHyperlink = $("<a></a>")
        nodeHyperlink.attr('target','_blank');
        
        let nodeImageContainer = $("<div></div>");
        nodeImageContainer.addClass("tool-icon");
    
        let nodeImage = $("<img>");

        nodeImage.attr('src',tool['icon']);

        let nodeText = $("<div></div>");

        nodeText.text(toolsList[i]['name']);
        if(toolsList[i]['name'].length > 15 && toolsList[i]['name'].length < 20) {
            nodeText.css('font-size','6vw');
        } else if(toolsList[i]['name'].length > 19) {
            nodeText.css('font-size','5vw');
        }
        nodeText.addClass("tool-name");

        
        let color = toolsList[i]['color'];
        let borderColor = toolsList[i]['borderColor'];
        let fontColor = toolsList[i]['fontColor'];
        if (color != null) {
            node.css('background-color',color);
            nodeText.css('background-color',color);
        }
        
        if (fontColor != null) {
            nodeText.css('color',fontColor);
        }
        if (borderColor != null) {
            node.css('border-color',borderColor);
            nodeImageContainer.css('border-color', borderColor);
        }
        
        nodeImageContainer.append(nodeImage);
        nodeHyperlink.append(nodeImageContainer);
        nodeHyperlink.append(nodeText);
        node.append(nodeHyperlink);

        $('#tools-list').append(node);
    }
}

/**
 * Show only the tools that are appropriate for the input type
 * @param {tag} indicator type (domain, ip, url, etc.)
 * @param {inputString} indicator entered by the user
 */
function showButtonsByTag(tag, inputString) {
    var visibility;

    if($('#tools-list').css('display') == 'none'){
        $('#plugin-icon').css('display','none');
        $('#tools-list').css('display','block');
    }
    // If the input is empty, hide the buttons
    if(inputString === ""){
        $('#plugin-icon').css('display','block');
        $('#tools-list').css('display','none');
    }

    nodes = $('#tools-list').children();
    let nodes_len = nodes.length;
    // If the input is not valid, show a error message
    if (tag === 'invalid') {
        $('#error-msg').css('display','block');        
        $('#warning-msg').css('display','none');
        for (var i=0; i<nodes_len; i++) {
            $(nodes[i]).css('display','none');
        }
    } else if (tag === 'internal') { // If the IP address is internal, show a warning message
        $('#warning-msg').css('display','block');
        $('#error-msg').css('display','none');       
        for (var i=0; i<nodes_len; i++) {
            $(nodes[i]).css('display','none');
        }
    } else {
        // Hide the error message
        $('#error-msg').css('display','none');       
        $('#warning-msg').css('display','none');       
        for (var i=0; i<nodes_len; i++) {
            if (tools[i]['tags'].includes(tag)) {            
                $(nodes[i]).css('display','block');
                // Set tool description as div title
                $(nodes[i]).prop('title',tools[i]['desc']);
                // Replace the placholder with the input string
                let url = tools[i]['url'];
                url = cookURL(url, inputString);
                // Remove revious click event listener
                $(nodes[i]).off('click');
                // Add click event listener
                $(nodes[i]).on('click', function() {
                    browser.tabs.create({
                        url:url
                    });
                    console.log(url);
                    window.close();
                });
            } else {
                $(nodes[i]).css('display','none');
            }
        }
    }
}
