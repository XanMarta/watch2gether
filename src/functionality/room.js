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
    setRoomOwner,
    outRoom,
    isRoomOwner
} = require('../adapter/roomManager')

function init_listener_room (io, socket) { 
    function getMemberInformation(roomId) {
        console.log("Get request for room infomation: ", roomId)
        let clientArrayInRoom = getAllClientInRoom(io, roomId)
    
        for (let i=0;i<clientArrayInRoom.length;i++) 
        {
            let clientId = getUsername(clientArrayInRoom[i])
            clientArrayInRoom[i] = {
                clientId: clientId,
                username: getUsername(clientId),
                isRoomOwner: isRoomOwner(clientId)
                // other information about member in room goes here
            }
        }
    
        return clientArrayInRoom
    }

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
        
        let isRoomOwner = false

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
            isRoomOwner = true
        }

        socket.join(roomId)
        socket.to(roomId).emit('join-room', {
            socketid: socket.id,
            username: getUsername(socket.id)
        });

        if (numClientInRoom(io, roomId) > 1)
        {
            // Send peer init request to every client in the same room (except sender).
            io.to(getRoomOwner(roomId)).emit('peer-init', {
                peerId: socket.id,
                initiator: true
            })
        }

        socket.emit("room-joined", {
            roomId: roomId,
            roomOwnerId: getRoomOwner(roomId),
            member: getMemberInformation(roomId)
            // TODO: send more in the future, like colour, and avt
        })

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

        if (numClientInRoom(io, roomid) > 1) {
            // there are more than one person in that room.
            // TODO: change host, broadcast for all client.
            console.log(`List of candidate client for host: ${getAllClientInRoom(io, roomid)}`)
        }

        socket.leave(getRoomId(socket.id))
        outRoom(socket.id)

        socket.emit("leave-room", `Client leave room ${roomid}`)
        socket.to(roomid).emit("leave-room-notify", {
            peerId: socket.id,
            username: username
        })
    })
}

module.exports = {
    init_listener_room
}
