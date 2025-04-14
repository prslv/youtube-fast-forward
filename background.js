chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === "update") {
        // Open the "What's New" page in a new tab
        chrome.tabs.create({ url: "https://repuddle.com/extensions/updates/latest/youtube-fast-forward" });
    }
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.mapArrowKeys || message.BskipTime || message.FskipTime || message.triggerFFDelay || message.throttleFFDelay) {
        chrome.storage.local.set(message, function () {
            if (chrome.runtime.lastError) {
                console.error("Error storing values:", chrome.runtime.lastError);
            } else {
                // console.log(message);
                // console.log("Values stored in local storage successfully!");
            }
        });
        sendResponse({ status: "success" });
    }
    return true;
});