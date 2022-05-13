let {init_listener_room, initConnectionInRoom} = require('./functionality/room')
let {deleteUsername, getUsername, init_listener_username} = require('./functionality/username')
let { init_listener_chat } = require('./functionality/chat')
const { getRoomId, isInRoom, outRoom, getRoomOwner, removeRoomOwner } = require('./adapter/roomManager')

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("New connection from socket id: ", socket.id);
    
        socket.on("client", (message) => {
            console.log(`Get message from client ${socket.id} with message: ${message}`)
            io.to(socket.id).emit("server", "Hello from server")
        })

        socket.on("signal", data => {
            io.to(data.peerId).emit('signal', {
                signal: data.signal,
                peerId: socket.id
              });
        })

        socket.on("disconnect", async () => {
            // TODO: khi username out khỏi room/disconnect thì nên có xóa tên người dùng hiện tại đi.
            console.log(`Client ${socket.id} disconnect`)

            if (isInRoom(socket.id))
            {
                let roomId = await getRoomId(socket.id)
                let isOwner = await removeRoomOwner(socket.id, roomId)
                let roomOnwer = await getRoomOwner(getRoomId(socket.id))

                io.in(roomId).emit("user-disconnected", {
                    socketid: socket.id,
                    roomOwnerId: await getRoomOwner(roomId),
                    username: await getUsername(socket.id)
                })

                console.log(`New owner id of room ${roomId} is ${roomOnwer}`)
                await outRoom(socket.id)

                if (isOwner) {
                    // socket bị xóa là của owner, tái xây dựng mạng kết nối trong roomId
                    initConnectionInRoom(roomId)
                }
            }
            
            let username = await getUsername(socket.id);

            if (username != null || username != undefined) {
                await deleteUsername(socket.id)
            }
        })
    
        socket.on("stream-disconnected", (data) => {
            io.to(data.peerId).emit("stream-disconnected", {
                peerId: socket.id
            })
        })
    
        socket.on("disconnect", () => {
            console.log(`User ${socket.id} disconnected!!`)

            console.log(socket.rooms); // the Set contains at least the socket ID
        });

        init_listener_room(socket)
        init_listener_chat(socket)
        init_listener_username(socket)
    })
}
