let {init_listener_room} = require('./functionality/room')
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
    
        socket.on("disconnect", () => {
            // TODO: khi username out khỏi room/disconnect thì nên có xóa tên người dùng hiện tại đi.
            console.log(`Client ${socket.id} disconnect`)

            if (isInRoom(socket.id))
            {
                removeRoomOwner(socket.id, getRoomId(socket.id))
                io.to(getRoomId(socket.id)).emit("user-disconnected", {
                    socketid: socket.id,
                    roomOwnerId: getRoomOwner(getRoomId(socket.id)),
                    username: getUsername(socket.id)
                })

                console.log(`New owner id of room ${getRoomId(socket.id)} is ${getRoomOwner(getRoomId(socket.id))}`)
                outRoom(io, socket.id)
            }

            if (getUsername(socket.id) != null || getUsername(socket.id) != undefined) {
                deleteUsername(socket.id)
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

        init_listener_room(io, socket)
        init_listener_chat(socket)
        init_listener_username(io, socket)
    })
}
