let { getUsername, getSocketId } = require('./username')


room = {}

function isSocketIdExist(socketid) {
    return !(getUsername(socketid) == null)
}

function isInRoom(socketid) {
    return room[socketid] != null && room[socketid] != undefined
}

function numClientInRoom(io, roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId)).length
}

function getAllClientInRoom(io, roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId))
}

// TODO: there io and nothing to do about it.
function isRoomExist(io, roomId) {
    return io.sockets.adapter.rooms.get(roomId) != undefined
}

function broadcastAllRoom(io, roomId, func) {
    Array.from(io.sockets.adapter.rooms.get(roomId)).forEach(
        func
    )
}

function outRoom(socketid) {
    delete room[socketid]
}

function init_listener_room (io, socket) {
    socket.on("join-room", (roomId) => {
        console.log(`Get join room request from ${socket.id} to join ${roomId}`)

        if (!isSocketIdExist(socket.id)) {
            socket.emit("username-require")
            return
        }

        if (isInRoom(socket.id)) 
        {
            socket.emit("already-in-room")
            return
        }
        
        // TODO: Enable code above. Add no join when room is full.
        console.log(`Client ${getUsername(socket.id)} want to join ${roomId}`);
        
        if (isRoomExist(io, roomId))
        {
            if (numClientInRoom(io, roomId) > 0)
            {
                // Client socket init a peer for every other client.
                let peerInit = (socketid) => {
                    socket.emit("peer-init", {
                        peerId: socketid,
                        initiator: false
                    })
                }
                broadcastAllRoom(io, roomId, peerInit)
            }
        }

        socket.join(roomId)
        socket.to(roomId).emit('join-room', socket.id);

        if (numClientInRoom(io, roomId) > 1)
        {
            // Send peer init request to every client in the same room (except sender).
            socket.to(roomId).emit('peer-init', {
                peerId: socket.id,
                initiator: true
            })
        }

        socket.emit("room-joined", roomId)

        room[socket.id] = roomId
        console.log(io.sockets.adapter.rooms)
    })

    socket.on("leave-room", () => {
        if (!isInRoom(socket.id)) {
            socket.emit("leave-room-reject", "Client not in a room.")
            return 
        }
        roomid = room[socket.id]
        username = getUsername(socket.id)

        socket.leave(room[socket.id])
        delete room[socket.id]

        socket.emit("leave-room", `Client leave room ${roomid}`)
        socket.to(roomid).emit("leave-room-notify", {
            peerId: socket.id,
            username: username
        })
    })

    socket.on("broadcast_message_room", (message) => {
        if (getUsername(socket.id) == null || getUsername(socket.id) == undefined) {
            socket.emit("username-require")
            return
        }
        if (!isInRoom(socket.id)) {
            socket.emit("leave-room", "Client not in a room.")
            return 
        }

        console.log(`Client ${getUsername(socket.id)} send message to ${room[socket.id]}`)

        socket.to(room[socket.id]).emit("room-message", message)
    })

    socket.on("get-room-info", () => {
        if (isInRoom(socket.id)) {
            console.log("Get request for room infomation: ", room[socket.id])
            let clientArrayInRoom = getAllClientInRoom(io, room[socket.id])

            for (let i=0;i<len(clientArrayInRoom);i++) 
            {
                clientArrayInRoom[i] = getUsername(clientArrayInRoom[i])
            }

            let roomClientArr = {
                roomId: room[socket.id],
                client: clientArrayInRoom
            }
            
            socket.emit("room-info", roomClientArr)
            console.log("Return room information to client: ", socket.id)
        } else {
            socket.emit("not-in-room")
        }

    })
}

module.exports = {
    isInRoom,
    outRoom,
    init_listener_room
}
