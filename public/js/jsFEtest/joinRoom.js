// //button
// var sendMessage = document.getElementById("send-message");
// var chatMessages = document.getElementsByClassName('chat-messages')[0];
// var messageInput = document.getElementById("message-input");

// sendMessage.addEventListener("click", (e) => {
//   console.log("Button clicked")
//   e.preventDefault();
//   const currentUser = document.createElement("div");
//   currentUser.setAttribute("id", "chat-text-current-user");
//   const user_info = document.createElement("h6");
//   user_info.setAttribute("class", "userinfo");
//   user_info.textContent = "Current user - Time: ....";

//   const messageContent = document.createElement("p");
//   messageContent.textContent = messageInput.value;

//   currentUser.append(user_info, messageContent);
//   chatMessages.appendChild(currentUser);
//   chatMessages.scrollTop = chatMessages.scrollHeight;
//   messageInput.value = "";
// })

// messageInput.addEventListener("keyup", (e) => {
//   console.log("Enter clicked")
//   //click enter with keycode = 13
//   if (e.keyCode == 13) {
//     e.preventDefault();
//     console.log("Button clicked")
//     const currentUser = document.createElement("div");
//     currentUser.setAttribute("id", "chat-text-current-user");
//     const user_info = document.createElement("h6");
//     user_info.setAttribute("class", "userinfo");
//     user_info.textContent = "Current user - Time: ....";

//     const messageContent = document.createElement("p");
//     messageContent.textContent = messageInput.value;

//     currentUser.append(user_info, messageContent);
//     chatMessages.appendChild(currentUser);
//     chatMessages.scrollTop = chatMessages.scrollHeight;
//     messageInput.value = "";
//   }
// })

import { init_listener_room } from "../room.js"
import { init_listener_username } from "../username.js"
import { init_listener_peer } from "../peer.js"
import { setSocket } from "../singleton/init_socket.js"


const WS_ENDPOINT = "ws://127.0.0.1:3000"
const socket = io(WS_ENDPOINT)
console.log("Join room view");
setSocket(socket)

const outButton = document.getElementById("out-room")

//chat
var sendMessage = document.getElementById("send-message");
var chatMessages = document.getElementsByClassName('chat-messages')[0];
var messageInput = document.getElementById("message-input");
import { getSocket } from "../singleton/init_socket.js"


//make sure room and username in sessionStorage are cleared
function joinRoomPage_init_listener_button() {
  const socket = getSocket();
  const roomId = sessionStorage.getItem("join-room-id");
  const username = sessionStorage.getItem("username");
  console.log("Room id is: " + roomId + " and username is " + username);
  socket.emit("register-username", username);
  socket.emit("join-room", roomId);
  outButton.addEventListener("click", () => {
    console.log(`Client leave room - Button clicked`)
    if (confirm("Do you want to leave the room?") === true) {
      //txt = "You pressed OK!";
      socket.emit("leave-room")
      // localStorage.removeItem("username");
      // localstorage.removeItem("join-room-id");
      //sessionStorage.clear();

      // sessionStorage.removeItem("username");
      // sessionStorage.removeItem("join-room-id");
      sessionStorage.clear();
      //go back to home page
      window.location.replace("/");
    }

    // TODO: What should it be when out room?
    // Delete all stream.
    //peerManager.deletePeerAll(remoteStreamClose)

    // Set local stream to null.
    // localStreamVideo.srcObject = null
    // localStreamManager.setLocalStream(null)
  })

  //chat
  sendMessage.addEventListener("click", () => {
    let message = messageInput.value;
    console.log("Client want to send message: ", message)
    socket.emit("broadcast_message_room", (message))
  })

  sendMessage.addEventListener("keyup", (e) => {
    e.preventDefault();
    let message = messageInput.value;
    console.log("Enter clicked")
    //click enter with keycode = 13
    if (e.keyCode == 13) {
      console.log("Client want to send message: ", message)
      socket.emit("broadcast_message_room", (message))
    }
  })

  //notification

  window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
    console.log("lmao")
    //e.returnValue = '';
  });
}

//start running
init_listener_username();
joinRoomPage_init_listener_button()
init_listener_peer();
init_listener_room();