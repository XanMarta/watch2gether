import { sendStream } from "../file.js"
import * as Ownership from "./ownership.js"

export function init_video_manager() {
    const playerTracker = videojs('video-player-local')


    playerTracker.on('play', function (e) {
        console.log("Video playback started: " + playerTracker.currentTime());

        if (Ownership.isHost()) {
            sendStream();
        }
    })

    playerTracker.on("pause", function (e) {
        console.log("Video playback paused: " + playerTracker.currentTime());
    });

    playerTracker.on("seeking", function (e) {
        console.log("Video seeking: " + playerTracker.currentTime());
    });


    playerTracker.on("seeked", function (e) {
        console.log("Video seek ended: " + playerTracker.currentTime());
    });

    playerTracker.on("ended", function (e) {
        console.log("Video playback ended.");
    });
}