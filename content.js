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
let buttonsInjected = false;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  let BskipTime = parseFloat(localStorage.getItem("BskipTime")) || 10;
  let FskipTime = parseFloat(localStorage.getItem("FskipTime")) || 10;
  if (message.action === "checkLocalStorage") {
    sendResponse({ BskipTimeFromYouTube: BskipTime, FskipTimeFromYouTube: FskipTime });
  }
});

function injectButtons() {
  const videoPlayer = document.querySelector("video.html5-main-video");
  let BskipTime = parseFloat(localStorage.getItem("BskipTime")) || 10;
  let FskipTime = parseFloat(localStorage.getItem("FskipTime")) || 10;

  if (!localStorage.getItem("BskipTime") || !localStorage.getItem("FskipTime")) {
    localStorage.setItem("BskipTime", BskipTime);
    localStorage.setItem("FskipTime", FskipTime);
    chrome.runtime.sendMessage({ BskipTimeFromYouTube: BskipTime, FskipTimeFromYouTube: FskipTime }).catch(error => { });
  }

  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.BskipTime) {
      localStorage.setItem("BskipTime", message.BskipTime);
      BskipTime = message.BskipTime;

      var BvisualFill = '78%';
      if (BskipTime < 10) {
        BvisualFill = '69%';
      }

      const bSkipIcon = document.querySelector(".b-icon-text");
      bSkipIcon.setAttribute("x", BvisualFill);
      bSkipIcon.textContent = message.BskipTime;
    }
    if (message.FskipTime) {
      localStorage.setItem("FskipTime", message.FskipTime);
      FskipTime = message.FskipTime;

      var FvisualFill = '22%';
      if (FskipTime < 10) {
        FvisualFill = '31%';
      }
      const fSkipIcon = document.querySelector(".f-icon-text");
      fSkipIcon.setAttribute("x", FvisualFill);
      fSkipIcon.textContent = message.FskipTime;
    }
  });

  chrome.runtime.sendMessage({ BskipTimeFromYouTube: BskipTime, FskipTimeFromYouTube: FskipTime }).catch(error => { });

  if (videoPlayer && !buttonsInjected) {
    const fastForwardButton = document.createElement("div");
    fastForwardButton.classList.add("ytp-button");
    fastForwardButton.style.display = "flex";
    fastForwardButton.style.width = "24px";
    fastForwardButton.style.minWidth = "24px";
    fastForwardButton.style.margin = "auto 10px auto 4px";

    var FvisualFill = '22%';
    var BvisualFill = '78%';
    if (FskipTime < 10) {
      FvisualFill = '31%';
    }
    if (BskipTime < 10) {
      BvisualFill = '69%';
    }

    const svgIcon = `
    <svg style="margin:auto;padding-bottom:3px;" height="25" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80.87 58.01"><defs><style>.cls-1{fill:#fff;}</style></defs><title>right</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_2-2" data-name="Layer 2">
      <text class="f-icon-text" x="`+ FvisualFill + `" y="80%" dominant-baseline="middle" text-anchor="start" fill="black" style="
        font-size: 30pt;
        font-weight: bold;
        font-family: sans-serif;
        fill: white;
        user-select:none;
        ">`+ FskipTime + `</text>
      <path class="cls-1" d="M60.88.72,59.44,0V7.61H0V58H14.32V51.56H6.68V13.83H59.44v7.6L80.87,10.72Z"/></g></g>
    </svg>
    `;

    fastForwardButton.innerHTML = svgIcon;

    const fastBackwardButtonContainer = document.createElement("div");
    fastBackwardButtonContainer.classList.add("ytp-button");
    fastBackwardButtonContainer.style.display = "flex";
    fastBackwardButtonContainer.style.width = "24px";
    fastBackwardButtonContainer.style.minWidth = "24px";
    fastBackwardButtonContainer.style.margin = "auto 5px auto 10px";

    const svgIconBackward = `
    <svg style="margin:auto;padding-bottom:3px;" height="25" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80.87 58.01"><defs><style>.cls-1{fill:#fff;}</style></defs><title>left</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_2-2" data-name="Layer 2"> 
      <text class="b-icon-text" x="`+ BvisualFill + `" y="80%"  text-anchor="end" dominant-baseline="middle" fill="black" style="
        font-size: 30pt;
        font-weight: bold;
        font-family: sans-serif;
        fill: white;
        user-select:none;
        ">`+ BskipTime + `</text>
      <path class="cls-1" d="M21.43,7.61V0L0,10.72,21.43,21.43v-7.6H74.19V51.56H66.55V58H80.87V7.61Z"></path></g></g>
    </svg>`;

    fastBackwardButtonContainer.innerHTML = svgIconBackward;

    const leftControls = document.querySelector(".ytp-left-controls");
    if (leftControls) {
      const timeDisplay = leftControls.querySelector(".ytp-time-display.notranslate");

      if (timeDisplay) {
        leftControls.insertBefore(fastForwardButton, timeDisplay.nextSibling);
        leftControls.insertBefore(fastBackwardButtonContainer, timeDisplay.nextSibling);
      }
    }

    fastForwardButton.addEventListener("click", function () {
      const videoPlayer = document.querySelector("video.html5-main-video");
      if (videoPlayer) {
        if (!isNaN(videoPlayer.duration)) {
          videoPlayer.currentTime += FskipTime;
        }
        const event = new KeyboardEvent("keydown", {
          key: "ArrowRight"
        });
        document.dispatchEvent(event);
      }
    });

    fastBackwardButtonContainer.addEventListener("click", function () {
      const videoPlayer = document.querySelector("video.html5-main-video");
      if (videoPlayer) {
        if (!isNaN(videoPlayer.duration)) {
          videoPlayer.currentTime -= BskipTime;
        }
        const event = new KeyboardEvent("keydown", {
          key: "ArrowLeft"
        });
        document.dispatchEvent(event);
      }
    });

    buttonsInjected = true;
    console.log("%c[YouTube Fast Forward/Rewind] by REPUDDLE:", "color: limegreen; font-weight: bold;", "Loaded successfully!");
    console.log("%c[YouTube Fast Forward/Rewind] by REPUDDLE:", "color: limegreen; font-weight: bold;", "Thank you for using our extension!");
  }
}

// injectButtons();

const observerConfig = {
  childList: true,
  subtree: true
};

const observer = new MutationObserver((mutationsList, observer) => {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
      const videoPlayer = document.querySelector("video.html5-main-video");
      if (videoPlayer) {
        injectButtons();
        observer.disconnect();
        break;
      }
    }
  }
});

observer.observe(document, observerConfig);