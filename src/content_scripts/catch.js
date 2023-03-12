const regexes = {
    'domain': new RegExp(/((?!-)[_A-Za-z0-9-]{1,63}(?<!-)(?:(\[\.\]|\.)))+[A-Za-z]{2,6}/,'g'),
    'ip': new RegExp(/(?!0)((2[0-4][0-9]|25[0-5]|1[0-9][0-9]|[1-9][0-9]|\d)(?:(\[\.\]|\.))){3}(2[0-4][0-9]|25[0-5]|1[0-9][0-9]|[1-9][0-9]|\d)/,'g'),
    'url': new RegExp(/(?:h(xx|XX|tt)p[s]?):\/\/((?:www(?:(\[\.\]|\.)))?[-a-zA-Z0-9@:%._\+~#=]{2,256}(?:(\[\.\]|\.))[a-z]{2,6})\b(?:[-a-zA-Z0-9@:%_\+.~#?&//=]*)/,'g'),
    'hash': new RegExp(/([a-z0-9]{64})|([a-z0-9]{40})|([a-z0-9]{32})/,'g'), 
    'email': new RegExp(/[a-z0-9]+(\.[_a-z0-9]+)*(\[at\]|@)([a-z0-9-]+((?:(\[\.\]|\.))[a-z0-9-]+)*((?:(\[\.\]|\.))[a-z]{2,15}))/,'g'),
    'cve': new RegExp(/CVE-\d{4}-\d{4,7}/,'g')
}

function catchIndicators() {
    let indParser = new IndicatorParser();
    const bodyContent = document.body.innerText;
    
    let indicators = [];
    for(indicatorType of ['domain', 'ip', 'url', 'hash', 'email', 'cve']) {
        let matches = bodyContent.matchAll(regexes[indicatorType]);
        let match = matches.next();
        while(!match.done) {
            let value = match.value[0];
            if(value) {
                let [type, tld] = indParser.getIndicatorType(value);
                if(type == "defanged") {
                    refangedValue = indParser.refangIndicator(value);
                    [type, tld] = indParser.getIndicatorType(refangedValue);
                }
                indicators.push({'type': type, 'value': value});
            }
            match = matches.next();
        }
    }
    if(indicators) {
        browser.runtime.sendMessage({
         "indicators": JSON.stringify(indicators)
        }).then(message=>{console.log(message)},error=>{console.error(error)});
    }
}

browser.runtime.onMessage.addListener(function(message) {
    if (message === "catch") {
        catchIndicators();
    } else if (message['cmd'] === 'find') {
        if(!window.find(message['indicator'])) {
            window.find(message['indicator'], false, true, false, false, false, false);
        }
    }
});

window.addEventListener("load", catchIndicators);
