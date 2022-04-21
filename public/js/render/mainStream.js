// everything about render stream to html element go here
import * as Ownership from '../singleton/ownership.js'

const mainStreamVideo = document.getElementById("main-stream")

export function setLocalStream(stream) { 
    if (Ownership.isHost())
    {
        mainStreamVideo.srcObject = stream 
    }
    else 
    {
        console.log(`User is not host. Cannot render own stream`)
    }
}

export function removeLocalStream() {
    if (Ownership.isHost())
    {
        mainStreamVideo.srcObject = null 
    }
    else 
    {
        console.log(`User is not host. Cannot remove own stream`)
    }
}

export function setRemoteStream(socketid, stream) { 
    // socketid, peer id from remote
    if (Ownership.isRemoteHost(socketid))
    {
        mainStreamVideo.srcObject = stream 
    }
    else 
    {
        console.log(`User ${socketid} is not host. Cannot render remote stream`)
    }
}

export function removeRemoteStream(socketid) {
    // socketid, peer id from remote
    if (Ownership.isRemoteHost(socketid))
    {
        mainStreamVideo.srcObject = null 
    }
    else 
    {
        console.log(`User ${socketid} is not host. Cannot remove remote stream`)
    }
}