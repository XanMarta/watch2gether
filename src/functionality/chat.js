let { getUsername } = require('./username')
let { getRoomId, isInRoom } = require('../adapter/roomManager')
let { saveChatLog } = require('../adapter/chatManager')

function init_listener_chat(socket) {
    socket.on("broadcast_message_room", async (message) => {
        let username = await getUsername(socket.id);
        let roomId = await getRoomId(socket.id);

        if (username == null || username == undefined) {
            socket.emit("username-require")
            return
        }
        if (!await isInRoom(socket.id)) {
            socket.emit("leave-room", "Client not in a room.")
            return 
        }

        console.log(`Client ${username} send message to ${roomId}`)

        messageLog = {
            type: 'broadcast',
            senderId: socket.id,
            senderUsername: username,
            roomId: roomId,
            content: message
        }

        await saveChatLog(messageLog)

        socket.to(roomId).emit("room-message", messageLog)

        messageLog = {
            type: 'broadcast',
            senderId: socket.id,
            senderUsername: 'Me',
            roomId: roomId,
            content: message
        }

        socket.emit("room-message", messageLog)
    })
}

module.exports = {
    init_listener_chat
}