const regexes = {
    'domain': new RegExp(/((?!-)[_A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}/,'g'),
    'ip': new RegExp(/((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))*/,'g'),
    'url': new RegExp(/(?:http[s]?):\/\/((?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6})\b(?:[-a-zA-Z0-9@:%_\+.~#?&//=]*)/,'g'),
    'hash': new RegExp(/([a-z0-9]{64})|([a-z0-9]{40})|([a-z0-9]{32})/,'g'), 
    'email': new RegExp(/[a-z0-9]+(\.[_a-z0-9]+)*@([a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15}))/,'g'),
    'cve': new RegExp(/CVE-\d{4}-\d{4,7}/,'g')
}

browser.runtime.onMessage.addListener(function(message) {
    if (message === "hunt") {
        let indParser = new IndicatorParser();
        const bodyContent = document.body.innerText;
        
        let indicators = [];
        for(indicatorType of ['domain', 'ip', 'url', 'hash', 'email', 'cve']) {
            let matches = bodyContent.matchAll(regexes[indicatorType]);
            let match = matches.next();
            while(!match.done) {
                let value = match.value[0];
                if(value) {
                    indicators.push({'type': indicatorType, 'value': match.value[0]});
                }
                match = matches.next();
            }
        }
        if(indicators) {
            browser.runtime.sendMessage({
             "indicators": JSON.stringify(indicators)
            }).then(message=>{console.log(message)},error=>{console.error(error)});
        }

    } else if (message['cmd'] === 'find') {
        if(!window.find(message['indicator'])) {
            window.find(message['indicator'], false, true, false, false, false, false);
        }
    }
});

