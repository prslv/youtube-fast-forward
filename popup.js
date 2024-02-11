function toggleWarningOverlay(show) {
    const overlay = document.getElementById("warningOverlay");
    overlay.style.display = show ? "flex" : "none";
}
const supBtn = document.getElementById("support-btn");
const supDiv = document.querySelector(".support-div");

supBtn.addEventListener("click", () => {
    supDiv.classList.toggle("expand");
});

function addInputEventListener() {
    const BskipTimeInput = document.getElementById("BskipTime");
    const FskipTimeInput = document.getElementById("FskipTime");

    BskipTimeInput.addEventListener("input", function () {
        updateLabelClass(this, "BskipTime");
    });

    FskipTimeInput.addEventListener("input", function () {
        updateLabelClass(this, "FskipTime");
    });
}

function updateLabelClass(inputElement, key) {
    const inputValue = parseFloat(inputElement.value);
    chrome.storage.local.get([key], function (result) {
        const storedValue = parseFloat(result[key]);
        const label = inputElement.parentElement.querySelector("label");
        if (inputValue !== storedValue) {
            label.classList.add("updating");
        } else {
            label.classList.remove("updating");
        }
    });
}

addInputEventListener();

function saveSkipTimes(event) {
    event.preventDefault();

    const backwardLabel = document.querySelector(".set-backward label");
    const forwardLabel = document.querySelector(".set-forward label");
    backwardLabel.classList.remove("updating");
    forwardLabel.classList.remove("updating");

    const BskipTime = parseFloat(document.getElementById("BskipTime").value);
    const FskipTime = parseFloat(document.getElementById("FskipTime").value);

    chrome.storage.local.set({ "BskipTime": BskipTime, "FskipTime": FskipTime }, function () {
        const status = document.getElementById("status");

        status.textContent = 'Chanes Saved';
        setTimeout(function () {
            status.textContent = 'Save Changes';
        }, 1550);
    });

    chrome.tabs.query({}, function (tabs) {
        tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, { BskipTime: BskipTime, FskipTime: FskipTime }).catch(error => { });
        });
    });
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.BskipTimeFromYouTube || message.FskipTimeFromYouTube) {
        chrome.storage.local.set({ "BskipTime": message.BskipTimeFromYouTube, "FskipTime": message.FskipTimeFromYouTube });
        document.getElementById("BskipTime").value = message.BskipTimeFromYouTube || 10;
        document.getElementById("FskipTime").value = message.FskipTimeFromYouTube || 10;
    }
});

document.getElementById("skipTimeForm").addEventListener("submit", saveSkipTimes);

function setDefaultSkipTimes() {
    chrome.storage.local.get(["BskipTime", "FskipTime"], function (result) {
        document.getElementById("BskipTime").value = result.BskipTime || 10;
        document.getElementById("FskipTime").value = result.FskipTime || 10;
    });
}

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tab = tabs[0];
    const isYoutubePage = tab && tab.url.includes("youtube.com");
    if (!isYoutubePage) {
        toggleWarningOverlay(true);
        document.getElementById("skipTimeForm").classList.add("not-on-youtube");
    }
});

setDefaultSkipTimes();