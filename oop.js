const player = document.querySelector(".player");
const video = document.querySelector(".video");
const progressRange = document.querySelector(".progress-range");
const progressBar = document.querySelector(".progress-bar");
const playBtn = document.getElementById("play-btn");
const volumeIcon = document.getElementById("volume-icon");
const volumeRange = document.querySelector(".volume-range");
const volumeBar = document.querySelector(".volume-bar");
const speed = document.querySelector(".player-speed");
const currentTime = document.querySelector(".time-elapsed");
const duration = document.querySelector(".time-duration");
const fullscreenBtn = document.querySelector(".fullscreen");
const playAgainBtn = document.querySelector(".play-again");
const utilIcons = document.getElementById("util-icons");
const forward = document.querySelector(".forward");
const backward = document.querySelector(".backward");
const PipBtn = document.querySelector(".pip");
class Player {
  constructor() {
    this.lastVolume = 1;
    this.fullscreen = false;
  }
  goBack() {
    utilIcons.classList.add("Utility-Icons");
    backward.classList.add("backward-icon");
    video.currentTime -= 10;
    playAgainBtn.style.display = "none";

    setTimeout(() => {
      utilIcons.classList.remove("Utility-Icons");

      backward.classList.remove("backward-icon");
    }, 1200);
  }
  goForward() {
    utilIcons.classList.add("Utility-Icons");

    forward.classList.add("forward-icon");
    video.currentTime += 10;
    setTimeout(() => {
      utilIcons.classList.remove("Utility-Icons");

      forward.classList.remove("forward-icon");
    }, 1200);
  }
  forwardOnDblTap(e) {
    // if (
    //   e.target.parentElement.className === "control-group" ||
    //   e.target.className === "controls-left"
    // ) {
    //   return;
    // }
    console.log(e.offsetX);
    console.log(player.offsetWidth);
    if (e.offsetX < player.offsetWidth / 2) {
      if (playAgainBtn.style.display === "unset") {
        return;
      }
      this.goBack();
    }
    if (e.offsetX > player.offsetWidth / 2) {
      if (playAgainBtn.style.display === "unset") {
        return;
      }

      this.goForward();
    }
  }

  togglePlay() {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }
  showPlayIcon() {
    playBtn.textContent = ">";
    playAgainBtn.style.display = "unset";
    playAgainBtn.addEventListener("click", this.gotoStart);
    if (video.currentTime !== video.duration) {
      playAgainBtn.style.display = "none";
    }
  }
  gotoStart() {
    playAgainBtn.style.display = "none";

    progressBar.style.width = 0;
    video.play();
  }
  updateProgress() {
    progressBar.style.width = `${(video.currentTime / video.duration) * 100}% `;
    currentTime.textContent = `${this.displayTime(video.currentTime)}`;
    duration.textContent = `${this.displayTime(video.duration)}`;
  }
  displayTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    seconds = seconds > 9 ? seconds : `0${seconds}`;
    return `${minutes}:${seconds}`;
  }

  setProgress(e) {
    const newTime = e.offsetX / progressRange.offsetWidth;
    progressBar.style.width = `${newTime * 100}%`;
    video.currentTime = newTime * video.duration;
  }
  changeVolume(e) {
    console.log(e);
    let volume = e.offsetX / volumeRange.offsetWidth;

    if (volume < 0.1) {
      volume = 0;
      volumeIcon.textContent = "-";
    } else {
      volumeIcon.textContent = "+";
    }
    if (volume > 0.9) {
      volume = 1;
    }
    volumeBar.style.width = `${volume * 100}%`;
    video.volume = volume;
    this.lastVolume = volume;
  }
  toggleMute() {
    volumeIcon.textContent = "";
    if (video.volume) {
      this.lastVolume = video.volume;
      video.volume = 0;

      volumeIcon.textContent = "-";
      volumeBar.style.width = 0;
    } else {
      video.volume = this.lastVolume;
      volumeIcon.textContent = "+";
      volumeBar.style.width = `${this.lastVolume * 100}%`;
    }
  }
  keyControls(e) {
    console.log(e);
    if (e.code === "Space" || "Keyk") {
      video.paused ? video.play() : video.pause();
    }
    if (e.key === "a") {
      this.goBack();
    }
    if (e.key === "d") {
      this.goForward();
    }
    if (e.key === "q") {
      video.currentTime = 0;
    }
    if (e.key === "m") [this.toggleMute()];
  }
  openFullscreen(element) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      /* Firefox */
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      /* IE/Edge */
      element.msRequestFullscreen();
    }
    video.classList.add("video-fullscreen");
  }

  /* Close fullscreen */
  closeFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      /* Firefox */
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      /* IE/Edge */
      document.msExitFullscreen();
    }
    video.classList.remove("video-fullscreen");
  }
  toggleFullscreen() {
    if (!this.fullscreen) {
      this.openFullscreen(player);
    } else {
      this.closeFullscreen();
    }
    this.fullscreen = !this.fullscreen;
  }
  changeSpeed(e) {
    video.playbackRate = e.target.value;
  }
  PicinPic() {
    console.log(navigator.mediaDevices.getUserMedia());
  }
  // async selectMediaStream() {
  //   try {
  //     const mediaStream = await navigator.mediaDevices.getDisplayMedia();
  //     video.srcObject = mediaStream;
  //     console.log(mediaStream);
  //     video.onloadedmetadata = () => {
  //       video.play();
  //     };
  //   } catch (errr) {}
  // }

  render() {
    // this.selectMediaStream();
    playBtn.addEventListener("click", this.togglePlay.bind(this));
    video.addEventListener("timeupdate", this.updateProgress.bind(this));
    video.addEventListener("ended", this.showPlayIcon.bind(this));
    progressRange.addEventListener("click", this.setProgress.bind(this));
    volumeRange.addEventListener("click", this.changeVolume);
    volumeIcon.addEventListener("click", this.toggleMute.bind(this));
    video.addEventListener("dblclick", this.forwardOnDblTap.bind(this));
    window.addEventListener("keypress", this.keyControls.bind(this));
    fullscreenBtn.addEventListener("click", this.toggleFullscreen.bind(this));
    speed.addEventListener("change", this.changeSpeed.bind(this));
    PipBtn.addEventListener("click", async () => {
      PipBtn.disabled = true;
      await video.requestPictureInPicture();
      PipBtn.disabled = false;
    });
  }
}
class App {
  static init() {
    const player = new Player();
    player.render();
  }
}
App.init();
