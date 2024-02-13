chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason === "update") {
        // Open the "What's New" page in a new tab
        chrome.tabs.create({ url: "https://repuddle.com/extensions/updates/latest/youtube-fast-forward" });
    }
});
