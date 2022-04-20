let { getUsername } = require('./username')
let { isInRoom, getRoomId } = require('./room')
let { saveChatLog } = require('../adapter/chatManager')

export function init_listener_chat(socket) {
    socket.on("broadcast_message_room", (message) => {
        if (getUsername(socket.id) == null || getUsername(socket.id) == undefined) {
            socket.emit("username-require")
            return
        }
        if (!isInRoom(socket.id)) {
            socket.emit("leave-room", "Client not in a room.")
            return 
        }

        console.log(`Client ${getUsername(socket.id)} send message to ${getRoomId(socket.id)}`)

        messageLog = {
            type: 'broadcast',
            senderId: socket.id,
            senderUsername: getUsername(socket.id),
            roomId: getRoomId(socket.id),
            content: message
        }

        saveChatLog(messageLog)

        socket.to(getRoomId(socket.id)).emit("room-message", message)
    })
}