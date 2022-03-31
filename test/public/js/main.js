const hostButton = document.getElementById("host");
const clientButton = document.getElementById("client");

const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");


import { createHost, createClient } from "./stream.js";


hostButton.onclick = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    localVideo.srcObject = stream
    await createHost(stream)
}

clientButton.onclick = async () => {
    await createClient((stream) => {
        remoteVideo.srcObject = stream
    })
}
