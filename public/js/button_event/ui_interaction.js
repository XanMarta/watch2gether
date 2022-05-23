const outButton = document.getElementById("leave-room")
const sendMessageButton = document.getElementById("send-message")
const streamStopButton = document.getElementById("stream-stop-button")

const messageInput = document.getElementById("message-input")

const navbarContent = document.getElementById("navbar-content")
const homePagePerspective = document.getElementById("home-page-perspective");
const roomPagePerspective = document.getElementById("room-page-perspective")

var displayChat = document.querySelector("#display-chat")
var displayMembers = document.querySelector("#display-members")
var memberInformations = document.querySelector("#members-information")
var chat = document.querySelector("#chat");
const roomIdInput = document.querySelector("#roomIdInput")
const roomIdCopy = document.querySelector("#copy-room-id")

//Modal section
const createRoomButton = document.getElementById("create-room")
const joinRoomButton = document.getElementById("join-room")

const createRoomModal = document.getElementById("createRoomModal");
const modalCreateRoom = new bootstrap.Modal(createRoomModal);

const joinRoomModal = document.getElementById("joinRoomModal")
const modalJoinRoom = new bootstrap.Modal(joinRoomModal);

// const closeModalCreateRoom = document.querySelector("#createRoom-closeButton");
// const closeModalJoinRoom = document.querySelector("#joinRoom-closeButton");

const videoArea = document.querySelector('#video-area')
const hostView = document.querySelector('#host-view');

const MAX_USERNAME_LENGTH = 20;
const MIN_USERNAME_LENGTH = 6;

import { getSocket } from "../singleton/init_socket.js"
import * as peerManager from "../singleton/init_peer.js";
import * as localStreamManager from "../singleton/init_localstream.js";
import { removeLocalStream } from "../render/mainStream.js"
import { roomCreated, roomJoined, roomLeave } from "../room.js"

//check if text is empty?
function trimfield(str) {
    return str.replace(/^\s+|\s+$/g, '');
}

// >= 6 and <= 20
function isValidUserName(username) {
    return (username.length >= MIN_USERNAME_LENGTH && username.length <= MAX_USERNAME_LENGTH) && trimfield(username) != '';
}

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

    document.getElementById("createRoom-closeButton").addEventListener("click", function () {
        modalCreateRoom.hide();
    })
    document.getElementById("joinRoom-closeButton").addEventListener("click", function () {
        modalJoinRoom.hide();
    })

    createRoomButton.addEventListener('click', async () => {
        let username = document.querySelector('#create-name-username').value;
        console.log("Người dùng chọn username là: ", username)
        //createRoomModal.hide();
        if (!isValidUserName(username)) {
            alert("Invalid username")
            return;
        } else {
            if (window.location.hash) {
                window.location.hash = "#";
            }
            socket.emit("create-room", {
                username: username
            }, roomCreated)
        }
        modalCreateRoom.hide();
        // if (sessionStorage.getItem("failed") !== null) {

        // } else {
        //     //TODO: IF USER JOINS A ROOM SUCCESSFULLY, RENDER THIS 
        //     modalCreateRoom.hide();
        // }
    })

    joinRoomButton.addEventListener('click', () => {
        let username = document.querySelector('#join-name-username').value
        let roomid = document.querySelector('#join-name-roomid').value
        if (!isValidUserName(username)) {
            alert("Invalid username")
            return;
        } else {
            console.log("Người dùng chọn username là: ", username)
            console.log("Người dùng chọn room id là: ", roomid)
            if (window.location.hash) {
                window.location.hash = "#";
            }
            socket.emit("join-room", {
                username: username,
                roomid: roomid
            }, roomJoined);
        }
        modalJoinRoom.hide();
        // if (sessionStorage.getItem("failed") !== null) {
        //     //alert("Room does not exist");
        // } else {
        //     //TODO: IF USER JOINS A ROOM SUCCESSFULLY, RENDER THIS 
        //     modalJoinRoom.hide();
        // }

        document.querySelector('#join-name-roomid').value = ''
    })

    outButton.addEventListener("click", () => {
        console.log(`Client leave room - Button clicked`)
        let text = "Do you want to leave?";
        if (confirm(text) === true) {
            socket.emit("leave-room", roomLeave)
            navbarContent.hidden = false;
            homePagePerspective.hidden = false;
            roomPagePerspective.hidden = true;
        }
    })


    sendMessageButton.addEventListener("click", () => {
        let message = messageInput.value;
        if (trimfield(message) != '') {
            console.log("Client want to send message: ", message)
            socket.emit("broadcast_message_room", (message))
        }
    })

    window.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            // code for enter
            let message = messageInput.value;
            if (trimfield(message) != '') {
                console.log("Client want to send message: ", message)
                socket.emit("broadcast_message_room", (message))
            }
        }
    });

    // getRoomInfoButton.addEventListener("click", () => {
    //     socket.emit("get-room-info")
    // })

    displayMembers.addEventListener("click", function () {
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
        const textAlert = "Do you want to stop streaming?";
        if (confirm(textAlert) === true) {
            if (localStreamManager.getLocalStream() != null && localStreamManager.getLocalStream() != undefined) {
                peerManager.removeStreamAll(localStreamManager.getLocalStream(), (peerId) => {
                    socket.emit("stream-disconnected", {
                        peerId: peerId
                    })
                })

                localStreamManager.setLocalStream(null)
                removeLocalStream()
                videoArea.hidden = true;
                hostView.hidden = false;

                document.querySelector("#video-stream-get-file-from-local").value = ''
            }
        }
    })
}