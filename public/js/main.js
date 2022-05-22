import { init_listener_room } from "./room.js"
import { init_listener_button } from "./button_event/ui_interaction.js"
import { init_listener_username } from "./username.js"
import { init_listener_peer } from "./peer.js"
import { setSocket } from "./singleton/init_socket.js"
import { renderMainMenu } from "./render/perspective.js"
import { init_listener_file } from "./file.js"
import { init_video_manager } from "./singleton/video_manager.js"

const socket = io()

console.log("Connect to server")

setSocket(socket)

renderMainMenu()
init_video_manager()
init_listener_file()
init_listener_peer()
init_listener_room()
init_listener_button()
init_listener_username()