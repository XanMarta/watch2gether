console.log("Create room management for the first time")
const { getUsername } = require('../functionality/username')
const { getIo } = require('../singleton/io')
const { Room, User } = require("../database")

// from socket id to room id 
const room = {}

async function getRoomId(socketid) {
    return room[socketid]
}

async function setRoomId(socketid, roomId) {
    room[socketid] = roomId
}
// from room id to socket id of room owner
// Each roomOwner instance is an array
const roomOwner = {}

async function getRoomOwner(roomId) {
    if (roomOwner[roomId] == null || roomOwner[roomId] == undefined) {
        return undefined
    }
    return roomOwner[roomId][0]
}

async function isRoomOwner(id, roomId) {
    console.log(`Check if ${id} is the owner of the room ${roomId} - ${await getRoomOwner(roomId)}`)
    return id == await getRoomOwner(roomId)
}

async function addRoomOwner(id, roomId) {
    if (roomOwner[roomId] == null || roomOwner[roomId] == undefined) {
        roomOwner[roomId] = []
    }
    roomOwner[roomId].push(id)

    console.log(`Add id ${id} to room ${roomId}. Room owner is ${roomOwner[roomId]}`)
}

async function removeRoomOwner(id, roomId) {
    let removeOwner = false 
    if (roomOwner[roomId] == null || roomOwner[roomId] == undefined) {
        return 
    }
    if (id == await getRoomOwner(roomId)) {
        roomOwner[roomId].shift()
        removeOwner = true
    } else {
        let index = roomOwner[roomId].indexOf(id)

        if (index > -1) {
            roomOwner[roomId].splice(index, 1)
        }
    }

    if (roomOwner[roomId].length == 0) {
        delete roomOwner[roomId]
    }

    return removeOwner
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
    console.log(`Delete room name ${socketid}`)

    if (await getRoomOwner(room[socketid]) == socketid) {
        console.log(`Check type to set room owner in the future: ${await getAllClientInRoom(room[socketid])}`)
    }
    delete room[socketid]
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