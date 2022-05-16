// everything about render stream to html element go here
import * as Ownership from '../singleton/ownership.js'

// const mainStreamVideo = document.querySelector("#main-stream")
const mainStreamVideo = document.querySelector('#video-player-local').getElementsByTagName('video')[0]


export function renderLocalStream(stream) { 
    // TODO testing 
    return
    if (Ownership.isHost())
    {
        console.log("Render local stream: ")
        console.log(stream)
        mainStreamVideo.srcObject = stream 
    }
    else 
    {
        console.log(`User is not host. Cannot render own stream`)
    }
}

export function removeLocalStream() {
    // TODO testing 
    return
    if (Ownership.isHost())
    {
        mainStreamVideo.srcObject = null 
    }
    else 
    {
        console.log(`User is not host. Cannot remove own stream`)
    }
}

export function renderRemoteStream(socketid, stream) { 
    // socketid, peer id from remote
    if (Ownership.isRemoteHost(socketid))
    {
        mainStreamVideo.srcObject = stream 
        mainStreamVideo.play()

        mainStreamVideo.onseeking = function() {
            alert("Seeking operation began!");
        };

        mainStreamVideo.onseeked = function() {
            alert("Seeked operation completed!");
        };
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