import { init_listener_room } from "./room.js"
import { init_listener_username } from "./username.js"
import { init_listener_peer } from "./peer.js"
import { setSocket } from "./singleton/init_socket.js"
//import { videoRender } from "./videoRender.js"
import { homepage_init_listener_button } from "./jsFEtest/index.js";
import { hostRoomPage_init_listener_button } from "./jsFEtest/hostRoom.js";
import { joinRoomPage_init_listener_button } from "./jsFEtest/joinRoom.js";
import { renderMainMenu } from "./render/perspective.js"

const WS_ENDPOINT = "ws://127.0.0.1:3000"
const socket = io(WS_ENDPOINT)

console.log("Connect to server")

setSocket(socket)

// renderMainMenu()
// init_listener_peer()
// init_listener_room()
// init_listener_button() 
// init_listener_username()
// //videoRender()

if (sessionStorage.getItem("perspective") === null && sessionStorage.getItem("create-room-id") === null && sessionStorage.getItem("join-room-id") === null) {
  homepage_init_listener_button();
} else {
  init_listener_username();
  if (sessionStorage.getItem("join-room-id") === null) {
    // if (localStorage.getItem("create-room-id") === null) {
    //you're in join room perspective
    hostRoomPage_init_listener_button();
  }
  // if (localStorage.getItem("join-room-id") === null) {
  if (sessionStorage.getItem("create-room-id") === null) {
    //you're in create room perspective
    joinRoomPage_init_listener_button();
  }
  init_listener_peer();
  init_listener_room();
}
