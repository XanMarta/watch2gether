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

const navbarContent = document.getElementById("navbar-content")
const homePagePerspective = document.getElementById("home-page-perspective");
const roomPagePerspective = document.getElementById("room-page-perspective")
const createRoomButton = document.getElementById("create-room")
const joinRoomButton = document.getElementById("join-room")

var displayChat = document.querySelector("#display-chat")
var displayMembers = document.querySelector("#display-members")
var memberInformations = document.querySelector("#members-information")
var chat = document.querySelector("#chat");
const roomIdInput = document.querySelector("#roomIdInput")
const roomIdCopy = document.querySelector("#copy-room-id")

//Modal section
const createRoomModal = document.getElementById("createRoomModal");
const modalCreateRoom = new bootstrap.Modal(createRoomModal);

const joinRoomModal = document.getElementById("joinRoomModal")
const modalJoinRoom = new bootstrap.Modal(joinRoomModal);

// const localStreamVideo = document.getElementById("local-stream")

import { getSocket } from "../singleton/init_socket.js"
import * as peerManager from "../singleton/init_peer.js";
import * as localStreamManager from "../singleton/init_localstream.js";
import { removeLocalStream, renderLocalStream } from "../render/mainStream.js"
import { roomCreated, roomJoined, roomLeave } from "../room.js"

export function init_listener_button() {
    const socket = getSocket();

    // createRoomEnableButton.addEventListener("click", () => {
    //     createRoomContainer.hidden = false
    //     roomManagementContainer.hidden = true 
    // })

    // createRoomBackButton.addEventListener("click", () => {
    //     createRoomContainer.hidden = true
    //     roomManagementContainer.hidden = false  
    // })

    // joinRoomEnableButton.addEventListener("click", () => {
    //     joinRoomContainer.hidden = false
    //     roomManagementContainer.hidden = true 
    // })

    // joinRoomBackButton.addEventListener("click", () => {
    //     joinRoomContainer.hidden = true
    //     roomManagementContainer.hidden = false  
    // })

    //joining room modal
    document.getElementById("joinRoomButton").addEventListener("click", function () {
        modalJoinRoom.show();
    });
    document.getElementById("joinRoomCloseButton").addEventListener("click", function () {
        modalJoinRoom.hide();
    });

    //create a room Modal
    document.getElementById("createRoomButton").addEventListener("click", function () {
        modalCreateRoom.show();
    });
    document.getElementById("createRoomCloseButton").addEventListener("click", function () {
        modalCreateRoom.hide();
    });

    createRoomButton.addEventListener('click', async () => {
        let username = document.querySelector('#create-name-username').value;
        console.log("Người dùng chọn username là: ", username)
        //createRoomModal.hide();
        navbarContent.hidden = true;
        modalCreateRoom.hide();
        homePagePerspective.hidden = true;
        roomPagePerspective.hidden = false;
        socket.emit("create-room", {
            username: username
        }, roomCreated)
    })

    joinRoomButton.addEventListener('click', () => {
        let username = document.querySelector('#join-name-username').value
        let roomid = document.querySelector('#join-name-roomid').value
        console.log("Người dùng chọn username là: ", username)
        console.log("Người dùng chọn room id là: ", roomid)
        //joinRoomModal.hide();
        //TODO: IF USER JOINS A ROOM SUCCESSFULLY, RENDER THIS 
        navbarContent.hidden = true;
        modalJoinRoom.hide();
        homePagePerspective.hidden = true;
        roomPagePerspective.hidden = false;
        //ELSE RENDER ERROR MSG
        socket.emit("join-room", {
            username: username,
            roomid: roomid
        }, roomJoined)
    })


    // outButton.addEventListener("click", () => {
    //     console.log(`Client leave room - Button clicked`)
    //     socket.emit("leave-room", roomLeave)
    // })


    sendMessageButton.addEventListener("click", () => {
        let message = messageInput.value;
        console.log("Client want to send message: ", message)
        socket.emit("broadcast_message_room", (message))
    })

    // getRoomInfoButton.addEventListener("click", () => {
    //     socket.emit("get-room-info")
    // })

    displayMembers.addEventListener("click", function () {
        // displayMembers.hidden = false;
        // displayChat.hidden = true;
        // var memberInformations = document.querySelector("#members-information")
        // var chat = document.querySelector("#chat");
        memberInformations.hidden = false;
        chat.hidden = true;
    })

    displayChat.addEventListener("click", function () {
        memberInformations.hidden = true;
        chat.hidden = false;
    })

    roomIdCopy.addEventListener("click", function () {
        roomIdInput.select();
        console.log("Copied: " + roomIdInput.value)
        /* Copy the text inside the text field */
        navigator.clipboard.writeText(roomIdInput.value);

        /* Alert the copied text */
        alert("room id copied: " + roomIdInput.value);
    })

    streamStopButton.addEventListener("click", () => {
        // Sử dụng để xóa file đang stream hiện tại, phục vụ chọn file mới.
        // TODO: Hiện tại procedure đang sai, cần phải chỉnh cả view.
        // is Streaming, is host -> stop streaming
        if (localStreamManager.getLocalStream() != null && localStreamManager.getLocalStream() != undefined) {
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