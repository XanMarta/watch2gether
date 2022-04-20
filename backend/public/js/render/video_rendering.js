// everything about render stream to html element go here
const localStreamVideo = document.getElementById("local-stream")

export function setLocalStream(stream) {
    localStreamVideo.srcObject = stream 

}

export function removeLocalStream() {
    localStreamVideo.srcObject = null 
}