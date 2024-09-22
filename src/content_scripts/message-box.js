function showMessageBox(message) {
    const msgBox = document.createElement("div");
    msgBox.classList.add("foxyrecon-message-box");

    const img = document.createElement("img");
    img.src = browser.runtime.getURL("assets/icons/foxyrecon-icon-32.png");

    const messageContainer = document.createElement("p");
    messageContainer.textContent = message;

    msgBox.appendChild(img);
    msgBox.appendChild(messageContainer);
    document.body.appendChild(msgBox);

    setTimeout( () => {
        msgBox.classList.add("foxyrecon-fade-out");

        msgBox.addEventListener("transitioned", () => {
            msgBox.remove();
        });
    }, 2000);
}

browser.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.split(":")[0] === "show-msg") {
        showMessageBox(message.split(":")[1]);
    }
});

