function detectStorageMigration(oldVersion, newVersion) {
    const oldVersionComponents = oldVersion.split(".");
    const oldMajor = oldVersionComponents[0];
    const oldMinor = oldVersionComponents[1];
    const oldPatch = oldVersionComponents[2];
    const newVersionComponents = newVersion.split(".");
    const newMajor = newVersionComponents[0];
    const newMinor = newVersionComponents[1];
    const newPatch = newVersionComponents[2];

    if (oldVersion === "0" || (Number(oldMajor) == 0 && Number(oldMinor) <= 22 && 
        (Number(newMajor) > 0 || Number(newMinor) >= 23))) {
        return executeMigration().then( (result) => {
            return true;
        });
    } else {
        return Promise.resolve(false);
    }
}

function resetIndicator() {
    browser.storage.local.set({
        "indicator": {
            value: "",
            type: "",
            tag: "",
            tld: ""
        }
    });
}

function resetSettings() {
    const defaultSettings = {
        newtab: true,
        autosubmit: false,
        autocatch: false,
        autograph: false,
        typeanim: true
    }
    return browser.storage.local.set({"settings": defaultSettings});
}

function createStorage() {
    return Promise.all([
        resetIndicator(),
        browser.storage.local.set({"history": Array()}),
        browser.storage.local.set({"toolsExt": Array()}),
        browser.storage.local.set({"fav": Array()}),
        browser.storage.local.set({
            "autofill": {
                inputSelector: "",
                submitQuery: ""
            }
        }),
        resetSettings(),
        browser.storage.local.set({
            "graph": {
                nodes: [],
                links: []
            }
        }),
        loadTools(),
        loadGraphMapping()
    ]);
}

function loadStorage() {
    // Setup default settings
    browser.storage.local.get("settings").then( (s) => {
        console.log("Settings loaded");
    }, (err) => {
        console.log("Setting default settings");
        defaultSettings();
    } );
}
