function showMessageBox(message, error) {
    const msgBox = document.createElement("div");
    msgBox.classList.add("foxyrecon-message-box");
    if (error) {
        msgBox.classList.add("err");
    }

    const img = document.createElement("img");
    img.src = browser.runtime.getURL("assets/icons/foxyrecon-icon-32.png");

    const messageContainer = document.createElement("p");
    messageContainer.textContent = message;

    msgBox.appendChild(img);
    msgBox.appendChild(messageContainer);


    document.body.appendChild(msgBox);

    setTimeout( () => {
        msgBox.classList.add("foxyrecon-fade-out");

        setTimeout( () => {
            msgBox.remove();
        }, 1000);
    }, 2000);
}

browser.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.split(":")[0] === "show-msg") {
        showMessageBox(message.split(":")[1], false);
    }
    if (message.split(":")[0] === "show-err") {
        showMessageBox(message.split(":")[1], true);
    }
});

