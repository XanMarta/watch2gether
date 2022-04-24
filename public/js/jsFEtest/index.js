//make sure delete sessionStorage b4
if (sessionStorage.getItem("username") !== null && (sessionStorage.getItem("create-room-id") !== null || sessionStorage.getItem("join-room-id") !== null)) {
  sessionStorage.clear();
}


import { setSocket } from "../singleton/init_socket.js"

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

    let roomId = roomIdInputJoin.value;

    sessionStorage.setItem("join-room-id", roomId);
    sessionStorage.setItem("username", username);
    alert("Join room: " + roomId + "with user is: " + username);
    window.location.replace('../../views/joinRoom.html');
  });

  createButton.addEventListener("click", function () {
    //modal.hide();
    console.log("Create")
    let username = usernameInputCreate.value;
    let roomId = roomIdInputCreate.value;

    sessionStorage.setItem("create-room-id", roomId);
    sessionStorage.setItem("username", username);
    alert("Join room: " + roomId + "with user is: " + username);
    window.location.replace('../../views/hostRoom.html');
    //window.location.href = "../../views/hostRoom.html"
  });
}

//start running
homepage_init_listener_button()