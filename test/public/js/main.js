const hostButton = document.getElementById("host");
const clientButton = document.getElementById("client");
const leaveButton = document.getElementById("leave");

const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");


import { createHost, createClient, disconnect } from "./stream.js";


hostButton.onclick = async () => {
    console.log("Create Host")
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    localVideo.srcObject = stream
    await createHost(stream, () => {
        localVideo.srcObject = null
    })
}

clientButton.onclick = async () => {
    console.log("Create Client")
    await createClient((stream) => {
        remoteVideo.srcObject = stream
    })
}

leaveButton.onclick = async() => {
    console.log("Disconnect")
    localVideo.srcObject = null
    remoteVideo.srcObject = null
    await disconnect()
}
