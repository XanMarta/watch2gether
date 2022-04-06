// const hostButton = document.getElementById("host");
// const clientButton = document.getElementById("client");
// const leaveButton = document.getElementById("leave");

// const localVideo = document.getElementById("localVideo");
// const remoteVideo = document.getElementById("remoteVideo");
 

// import { createHost, createClient, disconnect } from "./stream.js";

const WS_ENDPOINT = "ws://127.0.0.1:3000"
const socket = io(WS_ENDPOINT)

var peers = {}
var onConnection = false

const joinButton = document.getElementById("join-room");
const outButton = document.getElementById("out-room")
const sendMessageButton = document.getElementById("send-message")
const getRoomInfoButton = document.getElementById("get-room-info")
const usernameButton = document.getElementById("register-username")
const streamStartButton = document.getElementById("stream-start-button")
const streamStopButton = document.getElementById("stream-stop-button")
const streamConnect = document.getElementById("stream-connect")

const roomIdInput = document.getElementById("room-id");
const messageInput = document.getElementById("message-input")
const usernameInput = document.getElementById("username")

const localStreamVideo = document.getElementById("local-stream")
const remoteStreamContainer = document.getElementById("remote-video-container")

const streamConstraints = {
    audio: false,
    video: { width: 1280, height: 720 },
}

var previousSignalListener = null
var CurrentRoomId = null 
var localStream = null

// --- Register username

socket.on("register-username-done", () => {
    console.log("register username complete!")
})

socket.on("register-username-reject", (message) => {
    console.log("register username rejected!")
})

socket.on("username-require", () => {
    console.log("Need to register username first.")
})

// ---  Join room, send message, get disconnect notifications

socket.on("join_room", (socketId) => {
    console.log(`Socket ${socketId} join room!`)
})

socket.on("room_joined", (roomId) => {
    console.log(`Room ${roomId} Joined!`)
})

socket.on("room_message", (message) => {
    console.log(`Get broadcast message: ${message}`)
})

socket.on("user-disconnected", peerId => {
    peers[peerId].removeStream(localStream)

    delete peers[peerId]
    remoteStreamClose(peerId)
})

socket.on("stream-disconnected", (data) => {
    remoteStreamClose(data.peerId)
})

// --- Leave room 

socket.on("leave-room-notify", (data) => {
    delete peers[data.peerId]
    remoteStreamClose(data.peerId)

    console.log(`User ${data.username} has left the room.`)
})

socket.on("leave-room-reject", message => {
    console.log(message)
})

socket.on("leave-room", message => {
    console.log(message)
})

// --- Get room information

socket.on("room-info", (room) => {
    console.log('All client id from same room: ')
    console.log(typeof(room))
    console.log(room)
})

socket.on("not-in-room", () => {
    console.log("Client havent joined a room yet.")
})

socket.on("already-in-room", () => {
    console.log("Client already in a room.")
})


// --- Peer connection 
socket.on("peer-init", data => {
    let peer = new SimplePeer({initiator: data.initiator, stream: localStream})
    let remotePeerId = data.peerId;

    if (previousSignalListener != null && previousSignalListener != undefined){
        socket.off("signal", previousSignalListener)
    }

    previousSignalListener = data => {
        if (data.peerId == remotePeerId) {
            peer.signal(data.signal)
        }
    }
    socket.on("signal", previousSignalListener)

    peer.on("signal", data => {
        socket.emit('signal', {
            signal: data,
            peerId: remotePeerId
        })
    })

    peer.on("stream", data => {
        console.log("Get stream: ", data)
        remoteStreamRender(remotePeerId, data)
    })

    peer.on("connect", () => {
        peer.send("Hey Peer")
    })

    peer.on("data", (data) => {
        console.log("Peer get data: " + data)
    })

    peer.on("close", () => {
        remoteStreamClose(remotePeerId)
    })

    peer.on("error", (err) => {
        console.log("Get error: ", error)
        remoteStreamClose(remotePeerId)
    })

    // TODO: peer disconnect
    // If remove by server user-disconnected event work, then this can be ignored.

    peers[remotePeerId] = peer
})

// -- END Define OnEvent here

usernameButton.addEventListener("click", () => {
    let username = usernameInput.value; 

    socket.emit("register-username", username)
})

joinButton.addEventListener("click", () => {
    let roomId = roomIdInput.value;

    console.log("Join room: ", roomId)
    socket.emit("join_room", roomId)
})


sendMessageButton.addEventListener("click", () => {
    let message = messageInput.value;
    console.log("Client want to send message: ", message)
    socket.emit("broadcast_message_room", (message))
})

outButton.addEventListener("click", () => {
    socket.emit("leave-room")
    
    // TODO: What should it be when out room?
    // Delete all stream.
    let pseudoPeer = Object.entries(peers)
    for (const [peerId, _] of pseudoPeer)
    {
        // delete peer
        delete peers[peerId]
        // delete DOM stream element
        remoteStreamClose(peerId)
    }

    // Set local stream to null.
    localStreamVideo.srcObject = null
    localStream = null

    peers = {}
    // Let automatic garbage collection do it job1
})

getRoomInfoButton.addEventListener("click", () => {
    socket.emit("get-room-info")
})

// --- Stream Manipulation Button

// Get stream permission from user
streamStartButton.addEventListener("click", async () => {
    try {
        localStream = await navigator.mediaDevices.getUserMedia(streamConstraints);
        localStreamVideo.srcObject = localStream;
        console.log("Local stream rendered!")

        for (const [_, peer] of Object.entries(peers))
        {
            peer.addStream(localStream)
        }
    }
    catch (err) {
        console.log("Local stream cannot be rendered: ", err)
    }
})

// TODO: test stream stop function
streamStopButton.addEventListener("click", () => {
    if (localStream != null && localStream != undefined) 
    {
        for (const [peerId, peer] of Object.entries(peers))
        {
            peer.removeStream(localStream)
            socket.emit("stream-disconnected", {
                peerId: peerId
            })
        }
        localStream = null 
        localStreamVideo.srcObject = null
    }
})

// --- Create new DOM element and render multiple stream 

function remoteStreamRender(peerId, stream) {
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

// --- Delete DOM element corresponding to a peerId

function remoteStreamClose(peerId) {
    console.log("Delete DOM element coresponding to: ", peerId)
    let id = "remote-peer-" + peerId 

    let videoElement = document.getElementById(id)

    if (videoElement != undefined && videoElement != null)
        videoElement.remove();
}

// hostButton.onclick = async () => {
//     console.log("Create Host")
//     const stream = await navigator.mediaDevices.getUserMedia({ video: true })
//     localVideo.srcObject = stream
//     await createHost(stream, () => {
//         localVideo.srcObject = null
//     })
// }

// clientButton.onclick = async () => {
//     console.log("Create Client")
//     await createClient((stream) => {
//         remoteVideo.srcObject = stream
//     })
// }

// leaveButton.onclick = async() => {
//     console.log("Disconnect")
//     localVideo.srcObject = null
//     remoteVideo.srcObject = null
//     await disconnect()
// }
