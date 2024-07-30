var indicator = "";

function sendMessageAndAddNodes() {
    const current_url = window.location.href;
    browser.runtime.sendMessage({
        id: 2,
        msg: current_url
    }).then((resp) => {
        if(!resp) {
            return;
        }
        indicator = resp.msg;

        const map = resp.map;

        if (map) {
            const parser = new IndicatorParser(); 
            const [type, tld] = parser.getIndicatorType(indicator);
            const mappings = JSON.parse(map);
            for (const mapping of mappings) {
                if (type === mapping['type']) {
                    const intervalId = setInterval(function() {
                        document.querySelectorAll(mapping['query']).forEach((tag) => {
                            const target = tag.textContent.trim();
                            const [targetType, tld] = parser.getIndicatorType(target);
                            if (targetType === mapping['nodeType']) {
                                if (mapping['relationType'] === 'outbound') {
                                    var relationship = {
                                        'source': {
                                            'id': indicator,
                                            'type': type
                                        },
                                        'target': {
                                            'id': target,
                                            'type': targetType
                                        },
                                        'label': mapping['relationName']
                                    }
                                    browser.runtime.sendMessage({
                                        id: 3,
                                        msg: JSON.stringify(relationship)
                                    }).then((r) => {r.msg});

                                } 
                                if(mapping['relationType'] === 'inbound') {
                                    var relationship = {
                                        'source': {
                                            'id': indicator,
                                            'type': type
                                        },
                                        'target': {
                                            'id': target,
                                            'type': targetType
                                        },
                                        'label': mapping['relationName']
                                    }
                                    browser.runtime.sendMessage({
                                        id: 3,
                                        msg: JSON.stringify(relationship)
                                    }).then(() => {});
                                }
                            }
                            clearInterval(intervalId);
                        });
                    }, 500);
                }
            }
            
        }
    });
}

setTimeout(sendMessageAndAddNodes(), 5000);


