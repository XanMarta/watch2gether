import * as Ownership from "./singleton/ownership.js"
import * as PeerManager from "./singleton/init_peer.js"
import { getLocalStream, setLocalStream } from "./singleton/init_localstream.js"
import { renderLocalStream } from "./render/mainStream.js"

const inputFileUpload = document.querySelector("#video-stream-get-file-from-local")
//const sendStreamButton = document.querySelector("#video-stream-send-stream")

const video = document.querySelector('#video-player-local').getElementsByTagName('video')[0]
const videoArea = document.querySelector('#video-area')
const hostView = document.querySelector('#host-view');
const streamStopButton = document.querySelector("#stream-stop-button")

const userAgent = navigator.userAgent;

export async function sendStream() {
    console.log("!! SEND STREAM !!")
    console.log(video)

    let stream = video.mozCaptureStream ? video.mozCaptureStream() : video.captureStream();

    setLocalStream(stream)
    renderLocalStream(stream)
    PeerManager.addStreamAll(getLocalStream())

    console.log("Stream đã được gửi: ")
    console.log(stream)
}

export function init_listener_file() {
    inputFileUpload.addEventListener('change', async () => {
        // TODO: Chua check TH không phải file video
        if (!Ownership.isHost()) {
            alert("Người dùng không phải chủ phòng. Không thể gửi file.")
            return;
        }
        console.log("File change: ")
        document.querySelector("#current-play-video-name").innerHTML = inputFileUpload.files.item(0).name

        var file = inputFileUpload.files[0]
        var url = URL.createObjectURL(file)
        console.log(url)

        hostView.hidden = true;
        //clientView.hidden = true;
        videoArea.hidden = false;
        streamStopButton.hidden = false;

        console.log("Thao tác trên DOM element video sau:")
        console.log(video)
        video.src = url
        await video.play()

        // Capture stream and send stream.
        let stream = video.mozCaptureStream ? video.mozCaptureStream() : video.captureStream();

        setLocalStream(stream)
        renderLocalStream(stream)
        PeerManager.addStreamAll(getLocalStream())

        console.log("Stream đã được gửi: ")
        console.log(stream)
    })

    //sendStreamButton.addEventListener('click', sendStream)
}
/* <source src="//vjs.zencdn.net/v/oceans.mp4" type="video/mp4"></source> */