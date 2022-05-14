let { saveChatLog } = require('../adapter/chatManager')
let { getUserInformation } = require("../adapter/roomManager")

function init_listener_chat(socket) {
    socket.on("broadcast_message_room", async (message) => {
        let userInfo = await getUserInformation(socket.id)

        let username = userInfo.username;
        let roomId = userInfo.roomid;

        if (username == null || username == undefined) {
            socket.emit("username-require")
            return
        }
        if (roomId == null || roomId == undefined) {
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