const remoteStreamContainer = document.getElementById("remote-video-container")

//other people can watch stream, put this in reactjs?
export function remoteStreamRender(peerId, stream) {
    console.log(`Render video element for ${peerId}`)
    let id = "remote-peer-" + peerId
    let videoElement = document.getElementById(id)
    if (videoElement != null && videoElement != undefined) 
    {
        console.log("Duplicated stream detected!");
        return;
    }
    let remoteStreamVideo = document.createElement("video") 

    remoteStreamVideo.setAttribute("id", id)
    remoteStreamVideo.autoplay = true
    remoteStreamVideo.srcObject = stream 

    remoteStreamContainer.appendChild(remoteStreamVideo)
}

export function remoteStreamClose(peerId) {
    console.log("Delete DOM element coresponding to: ", peerId)
    let id = "remote-peer-" + peerId 

    let videoElement = document.getElementById(id)

    if (videoElement != undefined && videoElement != null)
        videoElement.remove();
}
