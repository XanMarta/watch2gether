let { getUsername, isUsernameExist, setUsername } = require('./username')
let {
    getRoomId,
    setRoomId,
    getRoomOwner,
    isInRoom,
    numClientInRoom,
    getAllClientInRoom,
    isRoomExist,
    addRoomOwner,
    removeRoomOwner,
    outRoom,
    isRoomOwner
} = require('../adapter/roomManager')
const { v4: uuidv4 } = require("uuid");
const { getIo } = require('../singleton/io');

function initConnectionInRoom(roomId) {
    console.log(`Init connection in room ${roomId}`)
    if (isRoomExist(roomId))
    {
        console.log(`Yes, room exist`)
        if (numClientInRoom(roomId) > 1)
        {
            console.log('Yes, there are more than one person in this room')
            let roomOwnerId = getRoomOwner(roomId);

            getAllClientInRoom(roomId).forEach(socketid => {
                if (socketid == roomOwnerId) {
                    return
                }
                getIo().to(socketid).emit("peer-init", {
                    peerId: roomOwnerId,
                    initiator: false
                })
                getIo().to(roomOwnerId).emit('peer-init', {
                    peerId: socketid,
                    initiator: true
                })
                console.log(`Send an peer negotiation between ${socketid} and ${roomOwnerId}`)
            })
        }
    }
}


function init_listener_room (socket) {

    function getMemberInformation(roomId) {
        console.log("Get request for room infomation: ", roomId)
        let clientArrayInRoom = getAllClientInRoom(roomId)

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

    /// TODO: Chỉnh lại logic phần này.
    /// TODO: Tạo thêm event join-room
    socket.on("create-room", (data, callback) => {
        console.log(`Get create room request from ${socket.id} under the name ${data.username}`);

        if (isUsernameExist(data.username)) {
            let response = {
                isSuccess: false,
                message: "Tên người dùng đã tồn tại."
            }
            callback(response)
            return 
        }

        if (isInRoom(socket.id)) 
        {
            let response = {
                isSuccess: false,
                message: "Người dùng đang ở trong một phòng khác."
            }
            callback(response)
            return
        }

        let roomId = uuidv4()

        socket.join(roomId)

        addRoomOwner(socket.id, roomId)
        setUsername(socket.id, data.username)
        setRoomId(socket.id, roomId)

        let response = {
            isSuccess: true,
            roomid: roomId,
            hostUsername: getUsername(getRoomOwner(roomId)),
            hostSocketId: getRoomOwner(roomId),
            member: getMemberInformation(roomId)
        }
        callback(response)
        console.log('Get all room information: ', getIo().sockets.adapter.rooms)
    })

    socket.on("join-room", (data, callback) => {
        console.log(`Get join room request from ${socket.id} under the name ${data.username}, to join room ${data.roomid}`);

        if (isUsernameExist(socket.id)) {
            let response = {
                isSuccess: false,
                message: "Tên người dùng đã tồn tại."
            }
            callback(response)
            return 
        }

        if (!isRoomExist(data.roomid)) {
            let response = {
                isSuccess: false,
                message: "Phòng không tồn tại."
            }
            callback(response)
            return 
        }

        if (isInRoom(socket.id)) 
        {
            let response = {
                isSuccess: false,
                message: "Người dùng đang ở trong một phòng khác."
            }
            callback(response)
            return
        }

        let roomId = data.roomid
        // TODO: Enable code above. Add no join when room is full.
        console.log(`Client ${getUsername(socket.id)} want to join ${roomId}`);

        if (isRoomExist(roomId))
        {
            if (numClientInRoom(roomId) > 0)
            {
                // Assume the onwer is the first one get in the room. So current client is not onwer.
                socket.emit("peer-init", {
                    peerId: getRoomOwner(roomId),
                    initiator: false
                })
            }
        }

        socket.join(roomId)

        // Add this id to candidate roomOwner list
        addRoomOwner(socket.id, roomId)
        setUsername(socket.id, data.username)
        setRoomId(socket.id, roomId)

        // Ta giả thiết rằng khi phòng tồn tại và người dùng muốn vào phòng. Trong phòng chắc chắn có ít nhất 1 người.
        getIo().to(getRoomOwner(roomId)).emit('peer-init', {
            peerId: socket.id,
            initiator: true
        })

        socket.to(roomId).emit('join-room', {
            socketid: socket.id + 'testing',
            username: getUsername(socket.id) 
        });

        let response = {
            isSuccess: true,
            roomid: roomId,
            hostUsername: getUsername(getRoomOwner(roomId)),
            hostSocketId: getRoomOwner(roomId),
            member: getMemberInformation(roomId)
        }

        callback(response)
        console.log(getIo().sockets.adapter.rooms)
    })

    socket.on("leave-room", callback => {
        if (!isInRoom(socket.id)) {
            let response = {
                isSuccess: false,
                message: "Người dùng không trong phòng."
            }
            callback(response)
            return 
        }
        let roomid = getRoomId(socket.id)
        let username = getUsername(socket.id)

        if (numClientInRoom(roomid) > 1) {
            // there are more than one person in that room.
            // TODO: change host, broadcast for all client.
            console.log(`List of candidate client for host: ${getAllClientInRoom(roomid)}`)
        }

        socket.leave(getRoomId(socket.id))
        outRoom(socket.id)
        let isOwner = removeRoomOwner(socket.id, roomid)

        socket.to(roomid).emit("leave-room-notify", {
            peerId: socket.id,
            roomOwnerId: getRoomOwner(roomid),
            username: username
        })

        if (isOwner) {
            initConnectionInRoom(roomid);
        }
        let response = {
            isSuccess: true
        }
        callback(response)
    })
}

module.exports = {
    init_listener_room,
    initConnectionInRoom
}
