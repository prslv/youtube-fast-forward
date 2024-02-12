function toggleWarningOverlay(show) {
    const overlay = document.getElementById("warningOverlay");
    overlay.style.display = show ? "flex" : "none";
}
//

//
document.addEventListener("contextmenu", function (event) {
    // Prevent the default context menu behavior
    // event.preventDefault();
});
//

//
const supBtn = document.getElementById("expand-btn");
const supDiv = document.querySelector(".expand-div");
supBtn.addEventListener("click", () => {
    const expandSvg = document.querySelector(".expand-svg");
    const showText = document.querySelector(".show-text");
    supDiv.classList.toggle("expand");

    if (supDiv.classList.contains("expand")) {
        supDiv.style.height = "100px";
        showText.textContent = 'Hide';
        supBtn.classList.add("expanded");
        expandSvg.setAttribute("transform", "rotate(90)");
    } else {
        expandSvg.setAttribute("transform", "rotate(-90)");
        showText.textContent = 'Show';
        supBtn.classList.remove("expanded");
        supDiv.style.height = "0px";
    }
});
//

//
const stars = document.querySelectorAll('.star');
function setRating(value) {
    localStorage.setItem('userRating', value);
}
//

//
function getRating() {
    return localStorage.getItem('userRating');
}
//

//
function updateStars() {
    const rating = getRating();
    if (rating) {
        const value = parseInt(rating);
        stars.forEach((star, index) => {
            if (index < value) {
                star.classList.add('selected');
            } else {
                star.classList.remove('selected');
            }
        });
    }
}
//

//
updateStars();
//

//
stars.forEach((star) => {
    star.addEventListener('mouseenter', function () {
        const value = parseInt(this.getAttribute('data-value'));
        stars.forEach((s, index) => {
            if (index < value) {
                s.classList.add('hovered');
            } else {
                s.classList.remove('hovered');
            }
        });
    });

    star.addEventListener('mouseleave', function () {
        stars.forEach((s) => {
            s.classList.remove('hovered');
        });
        updateStars();
    });

    star.addEventListener('click', function () {
        const value = parseInt(this.getAttribute('data-value'));
        setRating(value);
        updateStars();
    });
});
//

//
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
//

//
function updateLabelClass(inputElement, key) {
    if (parseInt(inputElement.value) > 99) {
        inputElement.value = 99;
    }
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
//

//
addInputEventListener();
//

//
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
//

//
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.BskipTimeFromYouTube || message.FskipTimeFromYouTube) {
        chrome.storage.local.set({ "BskipTime": message.BskipTimeFromYouTube, "FskipTime": message.FskipTimeFromYouTube });
        document.getElementById("BskipTime").value = message.BskipTimeFromYouTube || 10;
        document.getElementById("FskipTime").value = message.FskipTimeFromYouTube || 10;
    }
});
//

//
document.getElementById("skipTimeForm").addEventListener("submit", saveSkipTimes);
//

//
function setDefaultSkipTimes() {
    chrome.storage.local.get(["BskipTime", "FskipTime"], function (result) {
        document.getElementById("BskipTime").value = result.BskipTime || 10;
        document.getElementById("FskipTime").value = result.FskipTime || 10;
    });
}
//

//
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tab = tabs[0];
    const isYoutubePage = tab && tab.url.includes("youtube.com");
    if (!isYoutubePage) {
        toggleWarningOverlay(true);
        document.getElementById("skipTimeForm").classList.add("not-on-youtube");
    }
});
//

setDefaultSkipTimes();