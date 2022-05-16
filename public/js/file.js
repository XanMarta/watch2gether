import * as Ownership from "./singleton/ownership.js"
import * as PeerManager from "./singleton/init_peer.js"
import { getLocalStream, setLocalStream } from "./singleton/init_localstream.js"
import { renderLocalStream } from "./render/mainStream.js"


const dropArea = document.querySelector("#drag-area"),
    dragText = dropArea.querySelector("header"),
    button = dropArea.querySelector("button"),
    input = dropArea.querySelector("input");
let file; //this is a global variable and we'll use it inside multiple functions
const rightArea = document.querySelector("#right")
//const boxright = document.querySelector("#box-right")
const memberDisplay = document.querySelector("#member-information")
const displayMember = document.querySelector("#display-members")
const chatDisplay = document.querySelector("#chat");
const displayChat = document.querySelector("#display-chat")

const left = document.querySelector("#left");
const buttonArea = document.querySelector("#button-area")
const right = document.querySelector("#right");
const stopStreaming = document.querySelector("#stop-streaming")
const dragAreaHost = document.querySelector("#drag-area-host")
let videoElement = document.querySelector('video')

const inputFileUpload = document.querySelector("#video-stream-get-file-from-local")
const sendStreamButton = document.querySelector("#video-stream-send-stream")

//const video = document.querySelector('#video-player-local').getElementsByTagName('video')[0]

const video = document.querySelector('video');

export function init_listener_file() {
    displayMember.addEventListener("click", (e) => {
        console.log("clicked")
        chatDisplay.hidden = true;
        memberDisplay.hidden = false;
    })

    displayChat.addEventListener("click", (e) => {
        console.log("clicked 1")
        memberDisplay.hidden = true;
        chatDisplay.hidden = false;
    })

    button.onclick = () => {
        input.click(); //if user click on the button then the input also clicked
    }

    // input.addEventListener("change", async () => {
    //     // TODO: Chua check TH không phải file video
    //     if (!Ownership.isHost()) {
    //         alert("Người dùng không phải chủ phòng. Không thể gửi file.")
    //         return;
    //     }
    //     console.log("File change: ")
    //     //document.querySelector("#current-play-video-name").innerHTML = inputFileUpload.files.item(0).name

    //     //Video starts displaying
    //     var file = inputFileUpload.files[0]
    //     var url = URL.createObjectURL(file)
    //     console.log(url)

    //     console.log("Thao tác trên DOM element video sau:")
    //     dragAreaHost.hidden = true;
    //     video.hidden = false;
    //     console.log(video)
    //     video.src = url
    //     await video.play()

    //     // Capture stream and send stream.
    //     var stream = await video.captureStream();

    //     setLocalStream(stream)
    //     renderLocalStream(stream)
    //     PeerManager.addStreamAll(getLocalStream())

    //     console.log("Stream đã được gửi: ")
    //     console.log(stream)
    // });

    // //If user Drag File Over DropArea
    // dropArea.addEventListener("dragover", (event) => {
    //     event.preventDefault(); //preventing from default behaviour
    //     dropArea.classList.add("active");
    //     dragText.textContent = "Release to Upload File";
    // });

    // //If user leave dragged File from DropArea
    // dropArea.addEventListener("dragleave", () => {
    //     dropArea.classList.remove("active");
    //     dragText.textContent = "Drag & Drop to Upload File";
    // });

    // //If user drop File on DropArea
    // dropArea.addEventListener("drop", (event) => {
    //     event.preventDefault(); //preventing from default behaviour
    //     //getting user select file and [0] this means if user select multiple files then we'll select only the first one
    //     file = event.dataTransfer.files[0];
    //     showVideo(event); //calling function
    // });

    inputFileUpload.addEventListener('change', async () => {
        // TODO: Chua check TH không phải file video
        if (!Ownership.isHost()) {
            alert("Người dùng không phải chủ phòng. Không thể gửi file.")
            return;
        }
        console.log("File change: ")
        //document.querySelector("#current-play-video-name").innerHTML = inputFileUpload.files.item(0).name

        //Video starts displaying
        var file = inputFileUpload.files[0]
        var url = URL.createObjectURL(file)
        console.log(url)

        console.log("Thao tác trên DOM element video sau:")
        dragAreaHost.hidden = true;
        video.hidden = false;
        console.log(video)
        video.src = url
        await video.play()

        // Capture stream and send stream.
        var stream = await video.captureStream();

        setLocalStream(stream)
        renderLocalStream(stream)
        PeerManager.addStreamAll(getLocalStream())

        console.log("Stream đã được gửi: ")
        console.log(stream)
    })

    sendStreamButton.addEventListener('click', () => {
        console.log("Bấm nút SEND STREAM!!")
        var stream = video.captureStream();

        setLocalStream(stream)
        renderLocalStream(stream)
        PeerManager.addStreamAll(getLocalStream())

        console.log("Stream đã được gửi: ")
        console.log(stream)
    })
}
/* <source src="//vjs.zencdn.net/v/oceans.mp4" type="video/mp4"></source> */