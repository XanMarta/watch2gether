// const hostButton = document.getElementById("host");
// const clientButton = document.getElementById("client");
// const leaveButton = document.getElementById("leave");

// const localVideo = document.getElementById("localVideo");
// const remoteVideo = document.getElementById("remoteVideo");
 

// import { createHost, createClient, disconnect } from "./stream.js";


const WS_ENDPOINT = "ws://127.0.0.1:3000"
const socket = io(WS_ENDPOINT)

const pcs = {}
var onConnection = false

const joinButton = document.getElementById("join-room");
const outButton = document.getElementById("out-room")
const sendMessageButton = document.getElementById("send-message")
const getRoomInfoButton = document.getElementById("get-room-info")
const usernameButton = document.getElementById("register-username")

const roomIdInput = document.getElementById("room-id");
const messageInput = document.getElementById("message-input")
const usernameInput = document.getElementById("username")

var CurrentRoomId = null 

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

socket.on("room_joined", (roomId) => {
    console.log(`Room ${roomId} Joined!`)
})

socket.on("room_message", (message) => {
    console.log(`Get broadcast message: ${message}`)
})

socket.on("client_disconnect", (socketid) => {
    console.log(`Client with socket id ${socketid} disconnected.`)
})

// --- Leave room 

socket.on("leave-room", (message) => {
    console.log(`Socket leave room!: ${message}`)
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
})

getRoomInfoButton.addEventListener("click", () => {
    socket.emit("get-room-info")
})


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
