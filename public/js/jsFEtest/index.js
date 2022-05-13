//make sure delete sessionStorage b4
if (sessionStorage.getItem("username") !== null && (sessionStorage.getItem("create-room-id") !== null || sessionStorage.getItem("join-room-id") !== null)) {
  sessionStorage.clear();
}


import { setSocket } from "../singleton/init_socket.js"

// import * as peerManager from "../singleton/init_peer.js";
// import * as localStreamManager from "../singleton/init_localstream.js";
// //import { removeLocalStream, renderLocalStream } from "../render/mainStream.js"
// import { roomCreated, roomJoined, roomLeave } from "../room.js"
// import { streamConstraints } from "../singleton/constraint.js"

const WS_ENDPOINT = "ws://127.0.0.1:3000"
const socket = io(WS_ENDPOINT)
console.log("Home page view");
setSocket(socket)

const joinButton = document.getElementById("join-room-btn");
const createButton = document.getElementById("create-room-btn");


const roomIdInputJoin = document.getElementById("room-id-join");
const usernameInputJoin = document.getElementById("username-join");
const roomIdInputCreate = document.getElementById("room-id-create");
const usernameInputCreate = document.getElementById("username-create");

function homepage_init_listener_button() {
  if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
    console.info("This page is reloaded");
  } else {
    console.info("This page is not reloaded");
  }
  joinButton.addEventListener("click", function () {
    console.log("Join")
    let username = usernameInputJoin.value;

    //socket.emit("register-username", username);

    let roomid = roomIdInputJoin.value;
    console.log("Người dùng chọn username là: ", username)
    console.log("Người dùng chọn room id là: ", roomid)

    //check room exists?
    // socket.emit("join-room", {
    //   username: username,
    //   roomid: roomid
    // }, roomJoined)

    sessionStorage.setItem("username", username);
    sessionStorage.setItem("perspective", "client")

    //session store room id
    sessionStorage.setItem("join-room-id", roomid);
    alert("Username is " + username + " and roomid is: " + roomid);
    window.location.href = "../../views/room.html"
    //console.log("LMAO1423421");

    //const roomId = sessionStorage.getItem("join-room-id");

    // if (sessionStorage.getItem("roomValid") == true) {
    //   sessionStorage.setItem("username", username);
    //   sessionStorage.setItem("perspective", "client")

    //   //session store room id
    //   sessionStorage.setItem("join-room-id", roomid);
    //   console.log("LMAO1423421");

    //   //const roomId = sessionStorage.getItem("join-room-id");
    //   //window.location.href = "../../views/room.html"
    // }
    // //console.log("Room id is: " + roomId + " and username is " + username);

  });

  createButton.addEventListener("click", function () {
    //modal.hide();
    console.log("Create")
    let username = usernameInputCreate.value;
    // let roomId = roomIdInputCreate.value;

    // sessionStorage.setItem("create-room-id", roomId);
    // sessionStorage.setItem("username", username);
    // alert("Join room: " + roomId + "with user is: " + username);
    // window.location.replace('../../views/room.html');
    // //window.location.href = "../../views/hostRoom.html"
    alert("Người dùng chọn username là: " + username);
    console.log("Người dùng chọn username là: ", username)
    sessionStorage.setItem("username", username);
    sessionStorage.setItem("perspective", "host")
    window.location.href = "../../views/room.html"
    // socket.emit("create-room", {
    //   username: username
    // }, roomCreated)
  });
}

//start running
homepage_init_listener_button()