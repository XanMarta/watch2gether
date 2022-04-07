let {outRoom, isInRoom, init_listener_room} = require('./room')
let {deleteUsername, getUsername, init_listener_username} = require('./username')

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
            console.log(`Client ${socket.id} disconnect`)
    
            if (isInRoom(socket.id))
            {
                if (getUsername(socket.id) == null) {
                    return
                }
    
                io.to(room[socket.id]).emit("user-disconnected", socket.id)
                outRoom(socket.id)
                deleteUsername(socket.id)
            }
        })
    
        socket.on("stream-disconnected", (data) => {
            io.to(data.peerId).emit("stream-disconnected", {
                peerId: socket.id
            })
        })
    
        socket.on("disconnecting", () => {
            console.log(socket.rooms); // the Set contains at least the socket ID
        });

        init_listener_room(io, socket)
        init_listener_username(io, socket)
    })
}
