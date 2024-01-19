// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "setSkipTime") {
    // Update the skip time based on the message from the popup
    // You can then pass this value to content scripts or other components as needed
    const skipTime = message.skipTime;
    // Handle skip time as needed
    // For example, you can save it in local storage or a variable
  }
});

// Handle other tasks or events as needed

// For example, if you want to send a message to content scripts
function sendMessageToContentScripts(message) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, message);
  }
}

// You can call this function when needed to send a message to content scripts
// sendMessageToContentScripts({ action: "someAction", data: "someData" });
