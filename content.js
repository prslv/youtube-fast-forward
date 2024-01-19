// Function to save the selected skip time option in local storage
function saveSelectedSkipTime(skipTime) {
  localStorage.setItem("selectedSkipTime", skipTime);
}

// Function to load the selected skip time option from local storage
function loadSelectedSkipTime() {
  const storedSkipTime = localStorage.getItem("selectedSkipTime");
  return storedSkipTime ? parseInt(storedSkipTime) : 10; // Default to 10 seconds if not found
}

// Initialize skipTime with the loaded option
let skipTime = loadSelectedSkipTime();

// Function to update skipTime based on the selected option
function updateSkipTime() {
  const radioButtons = document.querySelectorAll('input[name="skip-time"]');
  radioButtons.forEach((radioButton) => {
    radioButton.addEventListener("change", function () {
      skipTime = parseInt(this.value);
      saveSelectedSkipTime(skipTime); // Save the selected skip time to local storage
    });
  });
}

// Call updateSkipTime function to set up the event listeners
updateSkipTime();

setTimeout(function () {
  const videoPlayer = document.querySelector("video.html5-main-video");
  if (videoPlayer) {
  if (window.location.hostname.includes("youtube.com")) {
      const fastForwardButton = document.createElement("div");
      fastForwardButton.classList.add("ytp-button");
      fastForwardButton.style.display = "flex";
      fastForwardButton.style.width = "24px";
      fastForwardButton.style.minWidth = "24px";
      fastForwardButton.style.margin = "auto 10px auto 4px";

      const svgIconForward = `>`;

      fastForwardButton.innerHTML = svgIconForward;

      let skipTime = 10; // Default skip time to 10 seconds

      const radioButtons = document.querySelectorAll('input[name="skip-time"]');
      radioButtons.forEach((radioButton) => {
        radioButton.addEventListener("change", function () {
          skipTime = parseInt(this.value);
        });
      });

      fastForwardButton.addEventListener("click", function () {
        const videoPlayer = document.querySelector("video.html5-main-video");
        if (videoPlayer) {
          if (!isNaN(videoPlayer.duration)) {
            videoPlayer.currentTime += skipTime; // Fast forward by skipTime seconds
          }
          const event = new KeyboardEvent("keydown", { key: "ArrowRight" });
          document.dispatchEvent(event);
        }
      });

      const fastBackwardButtonContainer = document.createElement("div");
      fastBackwardButtonContainer.classList.add("ytp-button");
      fastBackwardButtonContainer.style.display = "flex";
      fastBackwardButtonContainer.style.width = "24px";
      fastBackwardButtonContainer.style.minWidth = "24px";
      fastBackwardButtonContainer.style.margin = "auto 5px auto 10px";

      const svgIconBackward = `<`;

      fastBackwardButtonContainer.innerHTML = svgIconBackward;

      fastBackwardButtonContainer.addEventListener("click", function () {
        const videoPlayer = document.querySelector("video.html5-main-video");
        if (videoPlayer) {
          if (!isNaN(videoPlayer.duration)) {
            videoPlayer.currentTime -= skipTime; // Fast backward by skipTime seconds
          }
          const event = new KeyboardEvent("keydown", { key: "ArrowLeft" });
          document.dispatchEvent(event);
        }
      });

      const leftControls = document.querySelector(".ytp-left-controls");
      if (leftControls) {
        const timeDisplay = leftControls.querySelector(".ytp-time-display.notranslate");

        if (timeDisplay) {
          leftControls.insertBefore(fastForwardButton, timeDisplay.nextSibling);
          leftControls.insertBefore(fastBackwardButtonContainer, timeDisplay.nextSibling);
        }
      }
    }
  }
}, 1000);
