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
    addRoomOwner,
    removeRoomOwner,
    outRoom,
    isRoomOwner
} = require('../adapter/roomManager')

function init_listener_room (io, socket) { 
    function getMemberInformation(roomId) {
        console.log("Get request for room infomation: ", roomId)
        let clientArrayInRoom = getAllClientInRoom(io, roomId)

        console.log(clientArrayInRoom)
    
        for (let i=0;i<clientArrayInRoom.length;i++) 
        {
            let username = getUsername(clientArrayInRoom[i])
            clientArrayInRoom[i] = {
                clientId: clientArrayInRoom[i],
                username: username,
                isRoomOwner: isRoomOwner(clientArrayInRoom[i], roomId)
                // other information about member in room goes here
            }
        }

        console.log(clientArrayInRoom)
    
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

        socket.join(roomId)
        socket.to(roomId).emit('join-room', {
            socketid: socket.id,
            username: getUsername(socket.id)
        });

        // Add this id to candidate roomOwner list
        addRoomOwner(socket.id, roomId)

        if (numClientInRoom(io, roomId) > 1)
        {
            // Send peer init request to every client in the same room (except sender).
            io.to(getRoomOwner(roomId)).emit('peer-init', {
                peerId: socket.id,
                initiator: true
            })
        }

        let memberInformation = getMemberInformation(roomId)

        socket.emit("room-joined", {
            roomId: roomId,
            roomOwnerId: getRoomOwner(roomId),
            member: memberInformation
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
        let roomid = getRoomId(socket.id)
        let username = getUsername(socket.id)

        if (numClientInRoom(io, roomid) > 1) {
            // there are more than one person in that room.
            // TODO: change host, broadcast for all client.
            console.log(`List of candidate client for host: ${getAllClientInRoom(io, roomid)}`)
        }

        socket.leave(getRoomId(socket.id))
        outRoom(io, socket.id)
        removeRoomOwner(socket.id, roomid)

        socket.emit("leave-room", `Client leave room ${roomid}`)
        socket.to(roomid).emit("leave-room-notify", {
            peerId: socket.id,
            roomOwnerId: getRoomOwner(roomid),
            username: username
        })
    })
}

module.exports = {
    init_listener_room
}
