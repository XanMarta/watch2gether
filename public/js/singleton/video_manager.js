import { sendStream } from "../file.js"
import * as Ownership from "./ownership.js"

var isPlayed = false;

export function init_video_manager() {
    const playerTracker = videojs('video-player-local')


    playerTracker.on('play', function (e) {
        console.log("Video playback started: " + playerTracker.currentTime());

        if (Ownership.isHost()) {
            if (!isPlayed)
            {
                sendStream();
                isPlayed = true;
            }
        }
    })

    playerTracker.on("pause", function (e) {
        console.log("Video playback paused: " + playerTracker.currentTime());
        isPlayed = false;
    });

    playerTracker.on("seeking", function (e) {
        console.log("Video seeking: " + playerTracker.currentTime());
    });


    playerTracker.on("seeked", function (e) {
        console.log("Video seek ended: " + playerTracker.currentTime());
    });

    playerTracker.on("ended", function (e) {
        console.log("Video playback ended.");
        isPlayed = false;
    });
}