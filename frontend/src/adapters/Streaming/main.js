//put this in reactjs useeffect?
import { init_listener_room } from "./room.js"
//import { init_listener_button } from "./ui_interaction.js"
import { init_listener_username } from "./username.js"
import { init_listener_peer } from "./peer.js"
import { setSocket } from "./StreamSingleton/init_socket.js"
import io from 'socket.io-client';

const WS_ENDPOINT = "http://127.0.0.1:3000"
let socket = io(WS_ENDPOINT);
setSocket(socket)

export default function init() {
  init_listener_peer()
  init_listener_room()
  //init_listener_button()
  init_listener_username()
}