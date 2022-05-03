import * as Ownership from "./singleton/ownership.js"
import * as PeerManager from "./singleton/init_peer.js"
import { setLocalStream } from "./singleton/init_localstream.js"

const inputFileUpload = document.querySelector("#video-stream-get-file-from-local")

export function init_listener_file() {
    inputFileUpload.addEventListener('change', () => {
        if (!Ownership.isHost()) {
            alert("Người dùng không phải chủ phòng. Không thể gửi file.")
            return;
        }
        console.log("File change: ")
        document.querySelector("#current-play-video-name").innerHTML = inputFileUpload.files.item(0).name

        var file = inputFileUpload.files[0] 
        var url = URL.createObjectURL(file)
        console.log(url)

        document.querySelector('#video-player-local').getElementsByTagName('video')[0].src = url

        // Capture stream and send stream.
        var stream = document.querySelector('#video-player-local').getElementsByTagName('video')[0].captureStream();
        stream.isFilestream = true
        console.log("In Init Listener file: ", stream.isFilestream)

        setLocalStream(stream)

        PeerManager.addStreamAll(stream)

        console.log("Stream đã được gửi: ")
        console.log(stream)
    })
}
/* <source src="//vjs.zencdn.net/v/oceans.mp4" type="video/mp4"></source> */     