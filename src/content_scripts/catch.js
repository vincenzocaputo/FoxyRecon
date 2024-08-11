const regexes = {
    'domain': new RegExp(/(?<![0-9A-z\.-])((?!-)[_A-Za-z0-9-]{1,63}(?<!-)(?:(\[\.\]|\.)))+[A-Za-z]{2,6}(?![0-9A-z\.-])/,'g'),
    'ip': new RegExp(/(?<![0-9A-z\.-_])((2[0-4][0-9]|25[0-5]|1[0-9][0-9]|[1-9][0-9]|\d)(?:(\[\.\]|\.))){3}(2[0-4][0-9]|25[0-5]|1[0-9][0-9]|[1-9][0-9]|\d)(?![0-9A-z\.-_])/,'g'),
    'url': new RegExp(/(?:h(xx|XX|tt)p[s]?):\/\/((?:www(?:(\[\.\]|\.)))?[-a-zA-Z0-9@:%._\+~#=]{2,256}(?:(\[\.\]|\.))[a-z]{2,6})\b(?:[-a-zA-Z0-9@:%_\+.~#?&//=]*)/,'g'),
    'hash': new RegExp(/([a-z0-9]{64})|([a-z0-9]{40})|([a-z0-9]{32})/,'g'), 
    'email': new RegExp(/[a-zA-Z0-9]+((?:\[\.\]|\.)[_a-zA-Z0-9_%+-]+)*(\[at\]|@)([a-zA-Z0-9-]+((?:(\[\.\]|\.))[a-zA-Z0-9-]+)*((?:(\[\.\]|\.))[a-zA-Z]{2,15}))/,'g'),
    'cve': new RegExp(/CVE-\d{4}-\d{4,7}/,'g'),
    'phone': new RegExp(/(?<![0-9A-z\.-])(?:\+?(\d{1,3}))?[-. (]*(?:\d{3})[-. )]*(?:\d{3})[-. ]*(?:\d{4})(?: *x(\d+))?(?![0-9A-z-\.])/,'g'),
    'asn': new RegExp(/AS[0-9]{1,6}/,'g')
}

function catchIndicators() {
    let indParser = new IndicatorParser();
    const bodyContent = document.body.innerText;
    
    let indicators = [];
    for(indicatorType of ['domain', 'ip', 'url', 'hash', 'email', 'cve', 'phone', 'asn']) {
        let matches = bodyContent.matchAll(regexes[indicatorType]);
        let match = matches.next();
        while(!match.done) {
            let value = match.value[0];
            if(indicatorType == "phone") {
                let type = "phone";
                //value = value.replaceAll(/[^+0-9]/g, '');
                //if(value[0] !== '+') {
                //    value = '+' + value;
                //}
                indicators.push({'type': type, 'value': value});
            } else if(value) {
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
