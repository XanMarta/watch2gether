const outButton = document.getElementById("out-room")
const sendMessageButton = document.getElementById("send-message")
const getRoomInfoButton = document.getElementById("get-room-info")
const streamStopButton = document.getElementById("stream-stop-button")

const messageInput = document.getElementById("message-input")

const roomManagementContainer = document.getElementById("room-management-container")

const joinRoomContainer = document.getElementById("join-room-container")
const joinRoomBackButton = document.getElementById("join-room-back")
const joinRoomEnableButton = document.getElementById("join-room-form-button")

const createRoomContainer = document.getElementById("create-room-container")
const createRoomBackButton = document.getElementById("create-room-back")
const createRoomEnableButton = document.getElementById("create-room-form-button")

const streamFaceButton = document.getElementById("stream-face-button")

const createRoomButton = document.getElementById("create-room")
const joinRoomButton = document.getElementById("join-room")

// const localStreamVideo = document.getElementById("local-stream")

import { getSocket } from "../singleton/init_socket.js"
import * as peerManager from "../singleton/init_peer.js";
import * as localStreamManager from "../singleton/init_localstream.js";
import { removeLocalStream, renderLocalStream } from "../render/mainStream.js"
import { roomCreated, roomJoined, roomLeave } from "../room.js"
import { streamConstraints } from "../singleton/constraint.js"

export function init_listener_button() { 
    const socket = getSocket();

    streamFaceButton.addEventListener("click", async () => {
        function addMedia (stream) {
            renderLocalStream(stream)
            localStreamManager.setLocalStream(stream)
            peerManager.addStreamAll(stream)
        }

        // then, anytime later...
        navigator.mediaDevices.getUserMedia(
            streamConstraints
        ).then(addMedia).catch((err) => {
            console.log(err)
        })
    })

    createRoomEnableButton.addEventListener("click", () => {
        createRoomContainer.hidden = false
        roomManagementContainer.hidden = true 
    })

    createRoomBackButton.addEventListener("click", () => {
        createRoomContainer.hidden = true
        roomManagementContainer.hidden = false  
    })

    joinRoomEnableButton.addEventListener("click", () => {
        joinRoomContainer.hidden = false
        roomManagementContainer.hidden = true 
    })

    joinRoomBackButton.addEventListener("click", () => {
        joinRoomContainer.hidden = true
        roomManagementContainer.hidden = false  
    })

    createRoomButton.addEventListener('click', () => {
        let username = document.querySelector('#create-name-username').value;
        console.log("Người dùng chọn username là: ", username)
        socket.emit("create-room", {
            username: username
        }, roomCreated) 
    })

    joinRoomButton.addEventListener('click', () => {
        let username = document.querySelector('#join-name-username').value
        let roomid = document.querySelector('#join-name-roomid').value
        console.log("Người dùng chọn username là: ", username)
        console.log("Người dùng chọn room id là: ", roomid)
        
        socket.emit("join-room", {
            username: username,
            roomid: roomid
        }, roomJoined)
    })


    outButton.addEventListener("click", () => {
        console.log(`Client leave room - Button clicked`)
        socket.emit("leave-room", roomLeave)
    })


    sendMessageButton.addEventListener("click", () => {
        let message = messageInput.value;
        console.log("Client want to send message: ", message)
        socket.emit("broadcast_message_room", (message))
    })

    getRoomInfoButton.addEventListener("click", () => {
        socket.emit("get-room-info")
    })

    streamStopButton.addEventListener("click", () => {
        // Sử dụng để xóa file đang stream hiện tại, phục vụ chọn file mới.
        // TODO: Hiện tại procedure đang sai, cần phải chỉnh cả view.
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