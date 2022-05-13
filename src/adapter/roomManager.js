console.log("Create room management for the first time")
const { getUsername } = require('../functionality/username')
const { getIo } = require('../singleton/io')
const { Room, User } = require("../database")

// from socket id to room id 

async function getRoomId(socketid) {
    return await User.getRoomId(socketid)
}

async function setRoomId(socketid, roomId) {
    await User.setRoomId(socketid, roomId)
    await Room.setRoomId(socketid, roomId)
}
// from room id to socket id of room owner
// Each roomOwner instance is an array

async function getRoomOwner(roomId) {
    return await Room.getRoomOwner(roomId)
}

async function isRoomOwner(id, roomId) {
    return await Room.isRoomOwner(id, roomId)
}

async function addRoomOwner(id, roomId) {
    await Room.addRoomOwner(id, roomId)
}

async function removeRoomOwner(id, roomId) {
    let ownerChanged = await Room.removeRoomOwner(id, roomId)
    if (ownerChanged != null) {
        let users = await Room.getAllClientInRoom(roomId)
        if (users.length == 0) {
            console.log("No user in room")
        } else {
            await Room.setRoomOwner(users[0], roomId)
        }
    }
}


async function isSocketIdExist(socketid) {
    return !(await getUsername(socketid) == null)
}

async function isInRoom(socketid) {
    var currentRoom = await getRoomId(socketid)
    return currentRoom!= null && currentRoom != undefined
}

async function numClientInRoom(roomId) {
    if (!await isRoomExist(getIo(), roomId)) {
        return undefined
    }
    return Array.from(getIo().sockets.adapter.rooms.get(roomId)).length
}

async function getAllClientInRoom(roomId) {
    if (!await isRoomExist(roomId)) {
        return []
    }
    return Array.from(getIo().sockets.adapter.rooms.get(roomId))
}

// TODO: there io and nothing to do about it.
async function isRoomExist(roomId) {
    return getIo().sockets.adapter.rooms.get(roomId) != undefined
}

async function broadcastAllRoom(roomId, func) {
    if (!await isRoomExist(getIo(), roomId)) {
        return undefined
    }
    
    Array.from(getIo().sockets.adapter.rooms.get(roomId)).forEach(
        func
    )
}

async function outRoom(socketid) {
    let roomid = await User.outRoom(socketid)
    if (roomid != null) {
        await Room.outRoom(roomid, socketid)
    }
    // Check room owner change
}

module.exports = {
    getRoomId,
    setRoomId,
    getRoomOwner,
    isSocketIdExist,
    isInRoom,
    numClientInRoom,
    getAllClientInRoom,
    isRoomExist,
    isRoomOwner,
    addRoomOwner,
    removeRoomOwner,
    broadcastAllRoom,
    outRoom
}