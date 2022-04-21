import { init_listener_room } from "./room.js"
import { init_listener_button } from "./button_event/ui_interaction.js"
import { init_listener_username } from "./username.js"
import { init_listener_peer } from "./peer.js"
import { setSocket } from "./singleton/init_socket.js"

const WS_ENDPOINT = "ws://127.0.0.1:3000"
const socket = io(WS_ENDPOINT)

console.log("Connect to server")

setSocket(socket)

init_listener_peer()
init_listener_room()
init_listener_button() 
init_listener_username()