//import React from 'react'

const remoteStreamContainer = document.getElementById("remote-video-container")

export function remoteStreamRender(peerId, stream) {
    console.log(`Render video element for ${peerId}`)
    let id = "remote-peer-" + peerId
    let videoElement = document.getElementById(id)
    if (videoElement != null && videoElement != undefined) {
        console.log("Duplicated stream detected!");
        return;
    }
    //let remoteStreamVideo = document.createElement("video")
    //let remoteStreamVideo = React.createElement("video");

    //remoteStreamVideo.setAttribute("id", id)
    //remoteStreamVideo.ref()
    let remoteStreamVideo = document.getElementById("remote-stream");
    remoteStreamVideo.autoplay = true
    remoteStreamVideo.srcObject = stream

    //remoteStreamContainer.appendChild(remoteStreamVideo)
}

export function remoteStreamClose(peerId) {
    console.log("Delete DOM element coresponding to: ", peerId)
    //let id = "remote-peer-" + peerId

    let videoElement = document.getElementById("remote-stream")

    if (videoElement != undefined && videoElement != null)
        videoElement.remove();
}
