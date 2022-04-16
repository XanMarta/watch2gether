

export function remoteStreamRender(peerId, stream) {
    const remoteStreamContainer = document.getElementById("remote-video-container")
    console.log(`Render video element for ${peerId}`)
    console.log("Remote stream container" + remoteStreamContainer);
    let id = "remote-peer-" + peerId
    let videoElement = document.getElementById(id)
    if (videoElement != null && videoElement != undefined) {
        console.log("Duplicated stream detected!");
        return;
    }
    let remoteStreamVideo = document.createElement("video")
    //let remoteStreamVideo = React.createElement("video", { id: id });
    //let remoteStreamVideo = React.createElement("h1", { id: id }, "Video appeared");
    //let remoteStreamVideo = document.createElement("iframe")

    remoteStreamVideo.setAttribute("id", id)
    //remoteStreamVideo.ref()
    //let remoteStreamVideo = document.getElementById("remote-stream");
    remoteStreamVideo.autoplay = true
    remoteStreamVideo.srcObject = stream
    console.log("Remote stream video" + remoteStreamVideo);
    //ReactDOM.render(remoteStreamVideo, remoteStreamContainer);
    remoteStreamContainer.appendChild(remoteStreamVideo)
}

export function remoteStreamClose(peerId) {
    console.log("Delete DOM element coresponding to: ", peerId)
    let id = "remote-peer-" + peerId

    let videoElement = document.getElementById(id)

    if (videoElement != undefined && videoElement != null)
        videoElement.remove();
}
