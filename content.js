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
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  let FskipTime = parseFloat(localStorage.getItem("FskipTime")) || 10;
  let BskipTime = parseFloat(localStorage.getItem("BskipTime")) || 10;
  let buttonsPosition = parseFloat(localStorage.getItem("buttonsPosition")) || 0;
  let mapArrowKeys = parseFloat(localStorage.getItem("mapArrowKeys")) || 0;
  if (message.action === "checkLocalStorage") {
    sendResponse({ BskipTime: BskipTime, FskipTime: FskipTime, mapArrowKeys: mapArrowKeys, buttonsPosition: buttonsPosition });
  }
});

function injectButtons() {
  const videoPlayer = document.querySelector("video.html5-main-video");
  if (!videoPlayer) {
    console.log("Video player not found.");
    return;
  }
  let BskipTime = parseFloat(localStorage.getItem("BskipTime")) || 10;
  let FskipTime = parseFloat(localStorage.getItem("FskipTime")) || 10;
  let buttonsPosition = parseFloat(localStorage.getItem("buttonsPosition")) || 0;
  let mapArrowKeys = parseFloat(localStorage.getItem("mapArrowKeys")) || 0;
  let triggerFFDelay = parseFloat(localStorage.getItem("triggerFFDelay")) || 200;
  let throttleFFDelay = parseFloat(localStorage.getItem("throttleFFDelay")) || 100;

  if (!localStorage.getItem("mapArrowKeys") || !localStorage.getItem("throttleFFDelay") || !localStorage.getItem("triggerFFDelay") || !localStorage.getItem("buttonsPosition")) {
    localStorage.setItem("triggerFFDelay", triggerFFDelay);
    localStorage.setItem("throttleFFDelay", throttleFFDelay);
    localStorage.setItem("mapArrowKeys", mapArrowKeys);
    localStorage.setItem("buttonsPosition", buttonsPosition);
    chrome.runtime.sendMessage({ mapArrowKeys: mapArrowKeys, triggerFFDelay: triggerFFDelay, throttleFFDelay: throttleFFDelay, buttonsPosition: buttonsPosition }, function (response) {
      if (chrome.runtime.lastError) {
        console.error("Error sending message:", chrome.runtime.lastError);
      } else {
        // console.log("Message sent: ", response);
      }
    });
  }

  if (!localStorage.getItem("BskipTime") || !localStorage.getItem("FskipTime")) {
    localStorage.setItem("BskipTime", BskipTime);
    localStorage.setItem("FskipTime", FskipTime);
    chrome.runtime.sendMessage({ BskipTime: BskipTime, FskipTime: FskipTime }, function (response) {
      if (chrome.runtime.lastError) {
        console.error("Error sending message:", chrome.runtime.lastError);
      } else {
        // console.log("Message sent: ", response);
      }
    });
  }

  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

    if (message.buttonsPosition !== undefined) {
      buttonsPosition = message.buttonsPosition;
      localStorage.setItem("buttonsPosition", buttonsPosition);
      appendButtonsPosition(buttonsPosition);
    }
    if (message.triggerFFDelay) {
      localStorage.setItem("triggerFFDelay", message.triggerFFDelay);
      triggerFFDelay = message.triggerFFDelay;
    }
    if (message.mapArrowKeys !== undefined) {
      // Explicitly set and log the mapArrowKeys state
      localStorage.setItem("mapArrowKeys", message.mapArrowKeys);
      mapArrowKeys = message.mapArrowKeys;
    }

    if (message.throttleFFDelay) {
      localStorage.setItem("throttleFFDelay", message.throttleFFDelay);
      throttleFFDelay = message.throttleFFDelay;
    }

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
  chrome.runtime.sendMessage({ buttonsPosition: buttonsPosition, mapArrowKeys: mapArrowKeys, triggerFFDelay: triggerFFDelay, throttleFFDelay: throttleFFDelay }).catch(error => { });

  chrome.runtime.sendMessage({ BskipTime: BskipTime, FskipTime: FskipTime }).catch(error => { });
  // console.log(videoPlayer);
  if (videoPlayer) {
    // console.log('player found');

    // SKIP FORWARD
    const fastForwardButton = document.createElement("div");
    fastForwardButton.classList.add("ytp-button", "ffBtnRpdl", "ytp-next-button", "ytp-playlist-ui");
    fastForwardButton.style.display = "flex";
    fastForwardButton.style.width = "auto";
    fastForwardButton.style.margin = "0";
    fastForwardButton.style.padding = "0 7px";
    fastForwardButton.style.borderTopLeftRadius = "0";
    fastForwardButton.style.borderBottomLeftRadius = "0";
    var FvisualFill = '22%';
    var BvisualFill = '78%';
    if (FskipTime < 10) {
      FvisualFill = '31%';
    }
    if (BskipTime < 10) {
      BvisualFill = '69%';
    }

    const svgIcon = `
      <svg style="margin:auto;padding:0" height="25" width="25" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80.87 58.01"><defs></defs><title>right</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_2-2" data-name="Layer 2">
        <text class="f-icon-text yt-spec-button-shape-next__icon" x="`+ FvisualFill + `" y="80%" dominant-baseline="middle" text-anchor="start" fill="black" style="
          font-size: 30pt;
          font-weight: bold;
          font-family: sans-serif;
          user-select:none;
          ">`+ FskipTime + `</text>
        <g class="f-seek hidden">
          <path xmlns="http://www.w3.org/2000/svg" class="yt-spec-button-shape-next__icon" d="M21.7,24.3a3.19,3.19,0,0,1,1.64.45l16,9.57a3.2,3.2,0,0,1,0,5.49l-16,9.57a3.18,3.18,0,0,1-1.64.44,3.11,3.11,0,0,1-3.19-3.18V27.49A3.11,3.11,0,0,1,21.7,24.3Z"/>
          <path xmlns="http://www.w3.org/2000/svg" class="yt-spec-button-shape-next__icon" d="M47.53,24.3a3.19,3.19,0,0,1,1.64.45l16,9.57a3.2,3.2,0,0,1,0,5.49l-16,9.57a3.18,3.18,0,0,1-1.64.44,3.12,3.12,0,0,1-3.2-3.18V27.49A3.12,3.12,0,0,1,47.53,24.3Z"/>
        </g>
        <path class="yt-spec-button-shape-next__icon" d="M60.88.72,59.44,0V7.61H0V58H14.32V51.56H6.68V13.83H59.44v7.6L80.87,10.72Z"/></g></g>
      </svg>
    `;

    fastForwardButton.innerHTML = svgIcon;

    // SKIP BACKWARD
    const fastBackwardButtonContainer = document.createElement("div");
    fastBackwardButtonContainer.classList.add("ytp-button", "fbBtnRpdl", "ytp-prev-button");
    fastBackwardButtonContainer.style.display = "flex";
    fastBackwardButtonContainer.style.width = "auto";
    fastBackwardButtonContainer.style.margin = "0";
    fastBackwardButtonContainer.style.padding = "0 7px";
    fastBackwardButtonContainer.style.borderTopRightRadius = "0";
    fastBackwardButtonContainer.style.borderBottomRightRadius = "0";

    const svgIconBackward = `
    <svg style="margin:auto;padding:0" height="25" width="25" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80.87 58.01"><defs></defs><title>left</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_2-2" data-name="Layer 2"> 
      <text class="b-icon-text yt-spec-button-shape-next__icon" x="`+ BvisualFill + `" y="80%"  text-anchor="end" dominant-baseline="middle" style="
        font-size: 30pt;
        font-weight: bold;
        font-family: sans-serif;
        user-select:none;
        ">`+ BskipTime + `</text>
      <g class="b-seek hidden">
        <path xmlns="http://www.w3.org/2000/svg" class="yt-spec-button-shape-next__icon" d="M62.37,27.49V46.64a3.12,3.12,0,0,1-3.2,3.18,3.18,3.18,0,0,1-1.64-.44l-16-9.57a3.2,3.2,0,0,1,0-5.49l16-9.57a3.19,3.19,0,0,1,1.64-.45A3.12,3.12,0,0,1,62.37,27.49Z"/>
        <path xmlns="http://www.w3.org/2000/svg" class="yt-spec-button-shape-next__icon" d="M36.54,27.49V46.64a3.12,3.12,0,0,1-3.2,3.18,3.18,3.18,0,0,1-1.64-.44l-16-9.57a3.2,3.2,0,0,1,0-5.49l16-9.57a3.19,3.19,0,0,1,1.64-.45A3.12,3.12,0,0,1,36.54,27.49Z"/>
      </g>
      <path class="yt-spec-button-shape-next__icon" d="M21.43,7.61V0L0,10.72,21.43,21.43v-7.6H74.19V51.56H66.55V58H80.87V7.61Z"></path></g></g>
    </svg>`;

    fastBackwardButtonContainer.innerHTML = svgIconBackward;
    // INSIDE BUTTONS WRAPPER/CONTAINER
    const insideButtonsContainer = document.createElement("div");
    insideButtonsContainer.classList.add("buttonsContainer");
    insideButtonsContainer.style.display = "flex";
    insideButtonsContainer.style.margin = "auto 0";


    // inject inside the player
    const leftControls = document.querySelector(".ytp-left-controls");
    if (leftControls) {
      const timeDisplay = leftControls.querySelector(".ytp-time-display");
      // const timeDisplay = leftControls.querySelector(".ytp-play-button");
      // const timeDisplay = leftControls.querySelector(".ytp-volume-area");

      if (timeDisplay) {
        const ffBtn = document.querySelector(".ffBtnRpdl");
        const fbBtn = document.querySelector(".fbBtnRpdl");
        if (ffBtn && fbBtn) {
          ffBtn.remove();
          fbBtn.remove();
        }
        leftControls.insertBefore(insideButtonsContainer, timeDisplay.nextSibling);
        // leftControls.insertBefore(fastBackwardButtonContainer, timeDisplay.nextSibling);
      }

    }

    // OUTSIDE BUTTONS WRAPPER/CONTAINER
    const outsideButtonsContainer = document.createElement("div");
    outsideButtonsContainer.classList.add("buttonsContainer");
    outsideButtonsContainer.style.display = "flex";
    outsideButtonsContainer.style.padding = "0px";
    outsideButtonsContainer.style.margin = "0 8px";


    // inject outside the player
    const owner = document.getElementById("owner");
    if (owner) {

      const subscribeButton = document.getElementById("subscribe-button");
      // const timeDisplay = leftControls.querySelector(".ytp-play-button");
      // const timeDisplay = leftControls.querySelector(".ytp-volume-area");
      // console.log('owner');

      if (subscribeButton) {
        // console.log('subbutton');
        const ffBtn = document.querySelector(".ffBtnRpdl");
        const fbBtn = document.querySelector(".fbBtnRpdl");
        if (ffBtn && fbBtn) {
          ffBtn.remove();
          fbBtn.remove();
        }
        owner.insertBefore(outsideButtonsContainer, subscribeButton.nextSibling);
        // leftControls.insertBefore(fastBackwardButtonContainer, timeDisplay.nextSibling);
      }

    }

    // reveal outside or inside buttons
    function appendButtonsPosition(buttonsPosition) {
      if (buttonsPosition === 0) {
        fastForwardButton.classList.remove(
          "yt-spec-button-shape-next--mono",
          "yt-spec-button-shape-next--tonal",
          "yt-spec-button-shape-next--size-m",
          "yt-spec-button-shape-next--segmented-end",
        );
        fastBackwardButtonContainer.classList.remove(
          "yt-spec-button-shape-next--mono",
          "yt-spec-button-shape-next--tonal",
          "yt-spec-button-shape-next--size-m",
          "yt-spec-button-shape-next--segmented-start",
        );

        fastForwardButton.querySelector(".f-icon-text").style.fill = "#fff";
        fastBackwardButtonContainer.querySelector(".b-icon-text").style.fill = "#fff";
        insideButtonsContainer.style.paddingRight = "8px";

        insideButtonsContainer.appendChild(fastBackwardButtonContainer);
        insideButtonsContainer.appendChild(fastForwardButton);
      } else {
        fastForwardButton.classList.add(
          "yt-spec-button-shape-next--mono",
          "yt-spec-button-shape-next--tonal",
          "yt-spec-button-shape-next--size-m",
          "yt-spec-button-shape-next--segmented-end",
        );
        fastForwardButton.querySelector(".f-icon-text").style.fill = "";
        fastBackwardButtonContainer.querySelector(".b-icon-text").style.fill = "";
        // fastBackwardButtonContainer.querySelector(".cls-1").classList.replace("cls-1", "yt-spec-button-shape-next__icon");
        fastBackwardButtonContainer.classList.add(
          "yt-spec-button-shape-next--mono",
          "yt-spec-button-shape-next--tonal",
          "yt-spec-button-shape-next--size-m",
          "yt-spec-button-shape-next--segmented-start",
        );
        insideButtonsContainer.style.paddingRight = "0px";

        outsideButtonsContainer.appendChild(fastBackwardButtonContainer);
        outsideButtonsContainer.appendChild(fastForwardButton);
      }
    }
    appendButtonsPosition(buttonsPosition);

    fastForwardButton.addEventListener("click", function () {
      const videoPlayer = document.querySelector("video.html5-main-video");
      if (videoPlayer) {
        if (!isNaN(videoPlayer.duration)) {
          videoPlayer.currentTime += FskipTime;
        }
      }
    });

    document.addEventListener("keydown", function (event) {
      const activeElement = document.activeElement;
      // Prevent skip logic if user is typing
      const isTyping =
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          activeElement.isContentEditable);

      if (!mapArrowKeys || isTyping) return;

      const videoPlayer = document.querySelector("video.html5-main-video");

      if (!videoPlayer || mapArrowKeys == 0) return;
      switch (event.code) {
        case "ArrowRight":
        case "KeyL":
          event.preventDefault();
          videoPlayer.currentTime += FskipTime;
          break;
        case "ArrowLeft":
        case "KeyJ":
          event.preventDefault();
          videoPlayer.currentTime -= BskipTime;
          break;
      }
    }, true); // Use the "true" parameter to ensure the event listener is in the capture phase

    fastBackwardButtonContainer.addEventListener("click", function () {
      const videoPlayer = document.querySelector("video.html5-main-video");
      if (videoPlayer) {
        if (!isNaN(videoPlayer.duration)) {
          videoPlayer.currentTime -= BskipTime;
        }
      }
    });

    let mouseDownTimeoutTimer = null;
    let mouseDownIntervalTimer = null;

    let fSeekVisual, fTextVisual, bSeekVisual, bTextVisual;

    fastForwardButton.addEventListener("mousedown", function () {
      mouseDownTimeoutTimer = setTimeout(function () {
        mouseDownIntervalTimer = setInterval(function () {
          const videoPlayer = document.querySelector("video.html5-main-video");
          if (videoPlayer) {
            fSeekVisual = document.querySelector(".f-seek");
            fTextVisual = document.querySelector(".f-icon-text");
            if (!isNaN(videoPlayer.duration)) {
              fSeekVisual.classList.remove("hidden");
              fTextVisual.classList.add("hidden");
              videoPlayer.currentTime += FskipTime;
            }
          }
        }, throttleFFDelay);
      }, triggerFFDelay);
    });

    fastBackwardButtonContainer.addEventListener("mousedown", function () {
      mouseDownTimeoutTimer = setTimeout(function () {
        mouseDownIntervalTimer = setInterval(function () {
          const videoPlayer = document.querySelector("video.html5-main-video");
          if (videoPlayer) {
            bSeekVisual = document.querySelector(".b-seek");
            bTextVisual = document.querySelector(".b-icon-text");
            if (!isNaN(videoPlayer.duration)) {
              bSeekVisual.classList.remove("hidden");
              bTextVisual.classList.add("hidden");
              videoPlayer.currentTime -= BskipTime;
            }
          }
        }, throttleFFDelay);
      }, triggerFFDelay);
    });

    document.addEventListener("mouseup", stopSeek);
    document.addEventListener("contextmenu", stopSeek);

    function stopSeek() {
      if (fSeekVisual) {
        fSeekVisual.classList.add("hidden");
        fTextVisual.classList.remove("hidden");
      }
      if (bSeekVisual) {
        bSeekVisual.classList.add("hidden");
        bTextVisual.classList.remove("hidden");
      }

      clearTimeout(mouseDownTimeoutTimer);
      clearInterval(mouseDownIntervalTimer);
    }


  }
}
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // manually inject buttons w/ btn
  if (message.action === "injectButtons") {
    injectButtons();
  }

});
const observerConfig = {
  childList: true,
  subtree: true
};

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

const observer = new MutationObserver(debounce((mutationsList, observer) => {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
      const videoPlayer = document.querySelector("video.html5-main-video");
      if (videoPlayer) {
        injectButtons();
        console.log("%c[YouTube Fast Forward/Rewind] by REPUDDLE:", "color: limegreen; font-weight: bold;", "Loaded successfully!");
        console.log("%c[YouTube Fast Forward/Rewind] by REPUDDLE:", "color: limegreen; font-weight: bold;", "Thank you for using our extension!");
        observer.disconnect();
        break;
      }
    }
  }
}, 150));

observer.observe(document, observerConfig);