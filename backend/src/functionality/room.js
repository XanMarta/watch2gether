let { getUsername } = require('./username')
let {
    getRoomId,
    setRoomId,
    getRoomOwner,
    isSocketIdExist,
    isInRoom,
    numClientInRoom,
    getAllClientInRoom,
    isRoomExist,
    isRoomOwner,
    setRoomOwner,
    broadcastAllRoom,
    outRoom
} = require('../adapter/roomManager')

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
                // Assume the onwer is the first one get in the room. So current client is not onwer.
                socket.emit("peer-init", {
                    peerId: getRoomOwner(roomId),
                    initiator: false
                })
            }
        }
        else 
        {
            // Set current room owner to this socket id, since there no one before this client.
            setRoomOwner(socket.id, roomId)
        }

        socket.join(roomId)
        socket.to(roomId).emit('join-room', socket.id);

        if (numClientInRoom(io, roomId) > 1)
        {
            // Send peer init request to every client in the same room (except sender).
            io.to(getRoomOwner(roomId)).emit('peer-init', {
                peerId: socket.id,
                initiator: true
            })
        }

        socket.emit("room-joined", roomId)

        setRoomId(socket.id, roomId)
        console.log(io.sockets.adapter.rooms)
    })

    socket.on("leave-room", () => {
        if (!isInRoom(socket.id)) {
            socket.emit("leave-room-reject", "Client not in a room.")
            return 
        }
        roomid = getRoomId(socket.id)
        username = getUsername(socket.id)

        socket.leave(getRoomId(socket.id))
        outRoom(socket.id)

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

        console.log(`Client ${getUsername(socket.id)} send message to ${getRoomId(socket.id)}`)

        socket.to(getRoomId(socket.id)).emit("room-message", message)
    })

    socket.on("get-room-info", () => {
        if (isInRoom(socket.id)) {
            console.log("Get request for room infomation: ", getRoomId(socket.id))
            let clientArrayInRoom = getAllClientInRoom(io, getRoomId(socket.id))

            for (let i=0;i<len(clientArrayInRoom);i++) 
            {
                clientArrayInRoom[i] = getUsername(clientArrayInRoom[i])
            }

            let roomClientArr = {
                roomId: getRoomId(socket.id),
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
