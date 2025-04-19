function executeMigration() {
    const oldVersion = localStorage.getItem("version");
    if (oldVersion) {
        const fav = JSON.parse(localStorage.getItem("fav")) || Array();
        const graph = JSON.parse(localStorage.getItem("graph")) || {
            nodes: [],
            links: []
        };
        const settings = {
            autocatch: localStorage.getItem("settings.autocatch") === "true",
            autograph: localStorage.getItem("settings.autograph") === "true",
            autosubmit: localStorage.getItem("settings.autosubmit") === "true",
            newtab: localStorage.getItem("settings.newtab") === "true",
            typeanim: localStorage.getItem("settings.typanim") === "true",
        };
        const toolsExt = JSON.parse(localStorage.getItem("tools-ext")) || Array();
        const history = JSON.parse(localStorage.getItem("history")) || Array();

        localStorage.clear();
        return Promise.all([
            chrome.storage.local.set({"history": history}),
            chrome.storage.local.set({"toolsExt": toolsExt}),
            chrome.storage.local.set({"fav": fav}),
            chrome.storage.local.set({"autofill": {
                inputSelector: "",
                submitQuery: ""
            }
            }),
            chrome.storage.local.set({"settings": settings}),
            chrome.storage.local.set({"graph": graph}),
            chrome.storage.local.set({"graphSettings": {
                icontheme: "square-lite",
                repulsion: 50,
                edgelength: 50,
                nodesize: 15,
                edgesize: 1,
                labelsize: 14,
                edgecolor: "#444444",
                nodelabelcolor: "#444444"
            }})
        ]);
    }
}
