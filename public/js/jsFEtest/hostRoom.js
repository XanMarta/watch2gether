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

const outButton = document.getElementById("out-room")
import { getSocket } from "../singleton/init_socket.js"
export function hostRoomPage_init_listener_button() {
  const socket = getSocket();
  const roomId = localStorage.getItem("create-room-id");
  const username = localStorage.getItem("username");
  console.log("Room id is: " + roomId + " and username is " + username);
  socket.emit("register-username", username);
  socket.emit("join-room", roomId)
  outButton.addEventListener("click", () => {
    console.log(`Client leave room - Button clicked`)
    if (confirm("Do you want to leave the room?") === true) {
      //txt = "You pressed OK!";
      // localStorage.removeItem("username");
      // localstorage.removeItem("create-room-id");
      localStorage.clear();
      socket.emit("leave-room")
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

  window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
    console.log("lmao")
    //e.returnValue = '';
  });
}