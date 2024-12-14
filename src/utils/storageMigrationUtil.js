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
            browser.storage.local.set({"history": history}),
            browser.storage.local.set({"toolsExt": toolsExt}),
            browser.storage.local.set({"fav": fav}),
            browser.storage.local.set({"autofill": {
                inputSelector: "",
                submitQuery: ""
            }
            }),
            browser.storage.local.set({"settings": settings}),
            browser.storage.local.set({"graph": graph})
        ]);
    }
}
