/*
MIT License with Additional Restrictions and Disclaimer

Copyright (c) 2024 Preslav Kunov, repuddle.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

1. The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

2. The Software, or any derivative works thereof, may not be used for commercial purposes, including but not limited to the sale of the Software, integration into commercial products, or for any use that generates monetary gain.

3. The Software, or any derivative works thereof, may not be patented or used in any way that infringes on the intellectual property rights of the original author.

4. Any modifications made to the Software must be clearly indicated, and the original copyright notice and permission notice shall be retained in the derivative works.

5. Redistributions of the Software, modified or unmodified, must reproduce the above copyright notice, this list of conditions, and the following disclaimer in the documentation and/or other materials provided with the distribution.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
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

    chrome.storage.local.set({
        "BskipTime": BskipTime,
        "FskipTime": FskipTime
    }, function () {
        // Check for errors
        if (chrome.runtime.lastError) {
            console.error("Error storing values in local storage:", chrome.runtime.lastError);
        } else {
            const status = document.getElementById("status");
            status.textContent = 'Chanes Saved';
            setTimeout(function () {
                status.textContent = 'Save Changes';
            }, 1550);
        }
    });
    chrome.tabs.query({}, function (tabs) {
        tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, { BskipTime: BskipTime, FskipTime: FskipTime }).catch(error => { });
        });
    });
}
//

//
document.addEventListener('DOMContentLoaded', function () {
    const throttleFFDelaySlider = document.getElementById("throttleFFDelaySlider");
    const throttleFFDelayValue = document.getElementById("throttleFFDelayValue");
    const triggerFFDelayInput = document.getElementById("triggerFFDelayInput");
    const increaseTriggerFFDelay = document.getElementById("increaseTriggerFFDelay");
    const decreaseTriggerFFDelay = document.getElementById("decreaseTriggerFFDelay");

    // Load initial values from storage
    chrome.storage.local.get(['throttleFFDelay', 'triggerFFDelay'], function (result) {
        // console.log(result);
        if (chrome.runtime.lastError) {
            console.error("Error retrieving values:", chrome.runtime.lastError);
        } else {
            throttleFFDelaySlider.value = result.throttleFFDelay || 100;
            throttleFFDelayValue.textContent = throttleFFDelaySlider.value;
            triggerFFDelayInput.value = result.triggerFFDelay || 10;
        }
    });

    // Update throttle delay value and save to storage
    throttleFFDelaySlider.addEventListener('input', function () {
        throttleFFDelayValue.textContent = throttleFFDelaySlider.value;
    });

    throttleFFDelaySlider.addEventListener('mouseup', function () {
        let newValue = parseFloat(throttleFFDelaySlider.value);
        if (newValue < 10) newValue = 10;
        if (newValue > 1000) newValue = 1000;
        chrome.storage.local.set({
            "throttleFFDelay": newValue
        }, function () {
            // Check for errors
            if (chrome.runtime.lastError) {
                console.error("Error storing throttle delay:", chrome.runtime.lastError);
            } else {
                // console.log("Throttle delay stored successfully!");
            }
        });
        chrome.tabs.query({}, function (tabs) {
            tabs.forEach(tab => {
                chrome.tabs.sendMessage(tab.id, { throttleFFDelay: newValue }).catch(error => { });
            });
        });
    });

    // Update trigger delay value and save to storage
    triggerFFDelayInput.addEventListener('change', function () {
        let newValue = parseFloat(triggerFFDelayInput.value);
        if (newValue < 10) newValue = 10;
        if (newValue > 3000) newValue = 3000;
        chrome.storage.local.set({
            "triggerFFDelay": newValue
        }, function () {
            // Check for errors
            if (chrome.runtime.lastError) {
                console.error("Error storing trigger delay:", chrome.runtime.lastError);
            } else {
                // console.log("Trigger delay stored successfully!");
            }
        });
    });

    // Increment trigger delay
    increaseTriggerFFDelay.addEventListener('mouseup', function () {
        modifyTriggerFFDelay(10);
    });

    // // Decrement trigger delay
    decreaseTriggerFFDelay.addEventListener('mouseup', function () {
        modifyTriggerFFDelay(-10);
    });

    triggerFFDelayInput.addEventListener('change', function () {
        saveTriggerFFDelay();
    });

    // increaseTriggerFFDelay.addEventListener('mouseup', saveTriggerFFDelay);
    // decreaseTriggerFFDelay.addEventListener('mouseup', saveTriggerFFDelay);

    // Increment trigger delay
    function modifyTriggerFFDelay(change) {
        let newValue = parseFloat(triggerFFDelayInput.value) + change;
        if (newValue < 10) newValue = 10;
        if (newValue > 3000) newValue = 3000;
        triggerFFDelayInput.value = newValue;
    }

    // Save trigger delay to storage
    function saveTriggerFFDelay() {
        let newValue = parseFloat(triggerFFDelayInput.value);
        if (newValue < 10) {
            newValue = 10;
            triggerFFDelayInput.value = newValue;
        }
        if (newValue > 3000) {
            newValue = 3000;
            triggerFFDelayInput.value = newValue;
        }
        chrome.storage.local.set({
            "triggerFFDelay": newValue
        }, function () {
            // Check for errors
            if (chrome.runtime.lastError) {
                console.error("Error storing trigger delay:", chrome.runtime.lastError);
            } else {
                // console.log("Trigger delay stored successfully!");
            }
        });
        chrome.tabs.query({}, function (tabs) {
            tabs.forEach(tab => {
                chrome.tabs.sendMessage(tab.id, { triggerFFDelay: newValue }).catch(error => { });
            });
        });
    }

    // Handle continuous increment/decrement on hold
    let intervalId;
    increaseTriggerFFDelay.addEventListener('mousedown', function () {
        intervalId = setInterval(() => modifyTriggerFFDelay(10), 100);
    });
    increaseTriggerFFDelay.addEventListener('mouseup', function () {
        clearInterval(intervalId);
        saveTriggerFFDelay();
    });

    decreaseTriggerFFDelay.addEventListener('mousedown', function () {
        intervalId = setInterval(() => modifyTriggerFFDelay(-10), 100);
    });
    decreaseTriggerFFDelay.addEventListener('mouseup', function () {
        clearInterval(intervalId);
        saveTriggerFFDelay();
    });

});

//

//
document.addEventListener("DOMContentLoaded", () => {
    const refreshButton = document.getElementById("refreshButton");
    if (refreshButton) {
        refreshButton.addEventListener("click", () => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { action: "injectButtons" });
            });
        });
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
document.addEventListener("DOMContentLoaded", () => {
    const settingsButton = document.querySelectorAll('.settingsButton')
    const openSettingsButton = document.getElementById("openSettingsMenu");
    const closeSettingsMenu = document.getElementById("closeSettingsMenu");
    const settingsMenu = document.getElementById("settingsMenu");

    settingsButton.forEach(btn => {
        btn.onclick = () => {
            const isOpen = settingsMenu.style.display !== "none";
            if (isOpen) {
                // Close settings menu
                settingsMenu.style.display = "none";
                openSettingsButton.style.display = "block";
                closeSettingsMenu.style.display = "none";
            } else {
                // Open settings menu
                settingsMenu.style.display = "flex";
                openSettingsButton.style.display = "none";
                closeSettingsMenu.style.display = "block";
            }
        }
    })
});
//

//
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tab = tabs[0];
    const isYoutubePage = tab && tab.url.includes("youtube.com");
    if (isYoutubePage) {
        chrome.tabs.sendMessage(tab.id, { action: "checkLocalStorage" }, function (response) {
            if (response && response.BskipTime && response.FskipTime) {
                document.getElementById("BskipTime").value = response.BskipTime;
                document.getElementById("FskipTime").value = response.FskipTime;
            }
        });
    } else {
        toggleWarningOverlay(true);
        document.getElementById("skipTimeForm").classList.add("not-on-youtube");
    }
});
//

setDefaultSkipTimes();