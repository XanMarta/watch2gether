const joinButton = document.getElementById("join-room");
const outButton = document.getElementById("out-room")
const sendMessageButton = document.getElementById("send-message")
const getRoomInfoButton = document.getElementById("get-room-info")
const usernameButton = document.getElementById("register-username")
const streamStartButton = document.getElementById("stream-start-button")
const streamStopButton = document.getElementById("stream-stop-button")

const roomIdInput = document.getElementById("room-id");
const messageInput = document.getElementById("message-input")
const usernameInput = document.getElementById("username")

// const localStreamVideo = document.getElementById("local-stream")

import * as Ownership from "../singleton/ownership.js"
import { getSocket } from "../singleton/init_socket.js"
import * as peerManager from "../singleton/init_peer.js";
import { streamConstraints } from "../singleton/constraint.js"
import * as localStreamManager from "../singleton/init_localstream.js";
import { setLocalStream, removeLocalStream, removeRemoteStream } from "../render/mainStream.js"

export function init_listener_button() { 
    const socket = getSocket();
    
    usernameButton.addEventListener("click", () => {
        let username = usernameInput.value; 

        socket.emit("register-username", username)
    })

    joinButton.addEventListener("click", () => {
        let roomId = roomIdInput.value;

        console.log("Join room: ", roomId)
        socket.emit("join-room", roomId)
    })


    sendMessageButton.addEventListener("click", () => {
        let message = messageInput.value;
        console.log("Client want to send message: ", message)
        socket.emit("broadcast_message_room", (message))
    })

    outButton.addEventListener("click", () => {
        console.log(`Client leave room - Button clicked`)
        socket.emit("leave-room")
        
        // TODO: What should it be when out room?
        // Delete all stream.
        peerManager.deletePeerAll((id) => {})

        // delete both remote and localStream
        removeRemoteStream()
        removeLocalStream()
        localStreamManager.setLocalStream(null)
    })

    getRoomInfoButton.addEventListener("click", () => {
        socket.emit("get-room-info")
    })

    streamStartButton.addEventListener("click", async () => {
        try {
            if (!Ownership.isHost()) {
                alert("Only host of room can stream !")
                return 
            }

            let localStream = await navigator.mediaDevices.getUserMedia(streamConstraints);
            setLocalStream(localStream)
            console.log("Local stream rendered!")

            peerManager.addStreamAll(localStream)

            localStreamManager.setLocalStream(localStream)
        }
        catch (err) {
            console.log("Local stream cannot be rendered: ", err)
        }
    })

    streamStopButton.addEventListener("click", () => {
        // is Streaming, is host -> stop streaming
        if (localStreamManager.getLocalStream() != null && localStreamManager.getLocalStream() != undefined) 
        {
            peerManager.removeStreamAll(localStreamManager.getLocalStream(), (peerId) => {
                socket.emit("stream-disconnected", {
                    peerId: peerId
                })
            })

            localStreamManager.setLocalStream(null)
            removeLocalStream()
        }
    })
}