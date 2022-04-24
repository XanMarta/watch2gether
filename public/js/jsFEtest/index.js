const joinButton = document.getElementById("join-room-btn");
const createButton = document.getElementById("create-room-btn");


const roomIdInputJoin = document.getElementById("room-id-join");
const usernameInputJoin = document.getElementById("username-join");
const roomIdInputCreate = document.getElementById("room-id-create");
const usernameInputCreate = document.getElementById("username-create");

export function homepage_init_listener_button() {
  //const socket = getSocket();
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
    //window.location.href = "../../views/joinRoom.html"

    // if (localStorage.getItem("join-room-id") === null && localStorage.getItem("username") === null) {
    //   localStorage.setItem("join-room-id", roomId);
    //   localStorage.setItem("username", username);
    //   alert("Join room: " + roomId + "with user is: " + username);
    //   window.location.replace('../../views/joinRoom.html');
    //   //window.location.href = "../../views/joinRoom.html"
    // } else {
    //   alert("You already streaming/joining a room.");
    // }
  });

  createButton.addEventListener("click", function () {
    //modal.hide();
    console.log("Create")
    let username = usernameInputCreate.value;

    //socket.emit("register-username", username);

    let roomId = roomIdInputCreate.value;

    sessionStorage.setItem("create-room-id", roomId);
    sessionStorage.setItem("username", username);
    alert("Join room: " + roomId + "with user is: " + username);
    window.location.replace('../../views/hostRoom.html');
    //window.location.href = "../../views/hostRoom.html"

    // if (localStorage.getItem("join-room-id") === null && localStorage.getItem("username") === null) {
    //   localStorage.setItem("join-room-id", roomId);
    //   localStorage.setItem("username", username);
    //   alert("Join room: " + roomId + "with user is: " + username);
    //   window.location.replace('../../views/hostRoom.html');
    //   //window.location.href = "../../views/hostRoom.html"
    // } else {
    //   alert("You already streaming/joining a room.");
    // }
  });
}

//init_listener_button();