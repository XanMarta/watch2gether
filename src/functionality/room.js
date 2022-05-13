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

async function initConnectionInRoom(roomId) {
    console.log(`Init connection in room ${roomId}`)
    if (await isRoomExist(roomId))
    {
        console.log(`Yes, room exist`)
        if (await numClientInRoom(roomId) > 1)
        {
            console.log('Yes, there are more than one person in this room')
            let roomOwnerId = await getRoomOwner(roomId);

            let allClient = await getAllClientInRoom(roomId)
            allClient.forEach(socketid => {
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

    async function getMemberInformation(roomId) {
        console.log("Get request for room infomation: ", roomId)
        let clientArrayInRoom = await getAllClientInRoom(roomId)

        console.log(clientArrayInRoom)
    
        for (let i=0;i<clientArrayInRoom.length;i++) 
        {
            let username = await getUsername(clientArrayInRoom[i])
            clientArrayInRoom[i] = {
                clientId: clientArrayInRoom[i],
                username: username,
                isRoomOwner: await isRoomOwner(clientArrayInRoom[i], roomId)
                // other information about member in room goes here
            }
        }

        console.log(clientArrayInRoom)
    
        return clientArrayInRoom
    }

    /// TODO: Chỉnh lại logic phần này.
    /// TODO: Tạo thêm event join-room
    socket.on("create-room", async (data, callback) => {
        console.log(`Get create room request from ${socket.id} under the name ${data.username}`);

        if (await isUsernameExist(data.username)) {
            let response = {
                isSuccess: false,
                message: "Tên người dùng đã tồn tại."
            }
            callback(response)
            return 
        }

        if (await isInRoom(socket.id)) 
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

        await addRoomOwner(socket.id, roomId)
        await setUsername(socket.id, data.username)
        await setRoomId(socket.id, roomId)

        let response = {
            isSuccess: true,
            roomid: roomId,
            hostUsername: await getUsername(await getRoomOwner(roomId)),
            hostSocketId: await getRoomOwner(roomId),
            member: await getMemberInformation(roomId)
        }
        callback(response)
    })

    socket.on("join-room", async (data, callback) => {
        console.log(`Get join room request from ${socket.id} under the name ${data.username}, to join room ${data.roomid}`);

        if (await isUsernameExist(data.username)) {
            let response = {
                isSuccess: false,
                message: "Tên người dùng đã tồn tại."
            }
            callback(response)
            return 
        }

        if (!(await isRoomExist(data.roomid))) {
            let response = {
                isSuccess: false,
                message: "Phòng không tồn tại."
            }
            callback(response)
            return 
        }

        if (await isInRoom(socket.id)) 
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
        console.log(`Client ${await getUsername(socket.id)} want to join ${roomId}`);

        // Add this id to candidate roomOwner list
        await addRoomOwner(socket.id, roomId)
        await setUsername(socket.id, data.username)
        await setRoomId(socket.id, roomId)

        let response = {
            isSuccess: true,
            roomid: roomId,
            hostUsername: await getUsername(await getRoomOwner(roomId)),
            hostSocketId: await getRoomOwner(roomId),
            member: await getMemberInformation(roomId)
        }
        // tạo phòng bên client trước, để set host các thứ
        callback(response)

        // init peer connection sau
        socket.emit("peer-init", {
            peerId: await getRoomOwner(roomId),
            initiator: false
        })

        socket.join(roomId)

        // Ta giả thiết rằng khi phòng tồn tại và người dùng muốn vào phòng. Trong phòng chắc chắn có ít nhất 1 người.
        console.log("Send to Room Owner peer-init request:")
        console.log("From: ", socket.id)
        
        getIo().to(await getRoomOwner(roomId)).emit('peer-init', {
            peerId: socket.id,
            initiator: true
        })

        socket.to(roomId).emit('join-room', {
            socketid: socket.id + 'testing', 
            username: await getUsername(socket.id) 
        });

        console.log(getIo().sockets.adapter.rooms)
    })

    socket.on("leave-room", async (callback) => {
        if (!(await isInRoom(socket.id))) {
            let response = {
                isSuccess: false,
                message: "Người dùng không trong phòng."
            }
            callback(response)
            return 
        }
        let roomid = await getRoomId(socket.id)
        let username = await getUsername(socket.id)

        if (await numClientInRoom(roomid) > 1) {
            // there are more than one person in that room.
            // TODO: change host, broadcast for all client.
            console.log(`List of candidate client for host: ${await getAllClientInRoom(roomid)}`)
        }

        socket.leave(await getRoomId(socket.id))
        await outRoom(socket.id)
        let isOwner = await removeRoomOwner(socket.id, roomid)

        socket.to(roomid).emit("leave-room-notify", {
            peerId: socket.id,
            roomOwnerId: await getRoomOwner(roomid),
            username: username
        })

        if (isOwner) {
            await initConnectionInRoom(roomid);
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
