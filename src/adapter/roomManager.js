console.log("Create room management for the first time")
const { getUsername } = require('../functionality/username')
const { getIo } = require('../singleton/io')

// from socket id to room id 
const room = {}

function getRoomId(socketid) {
    return room[socketid]
}

function setRoomId(socketid, roomId) {
    room[socketid] = roomId
}
// from room id to socket id of room owner
// Each roomOwner instance is an array
const roomOwner = {}

function getRoomOwner(roomId) {
    if (roomOwner[roomId] == null || roomOwner[roomId] == undefined) {
        return undefined
    }
    return roomOwner[roomId][0]
}

function isRoomOwner(id, roomId) {

    console.log(`Check if ${id} is the owner of the room ${roomId} - ${getRoomOwner(roomId)}`)
    return id == getRoomOwner(roomId)
}

function addRoomOwner(id, roomId) {
    if (roomOwner[roomId] == null || roomOwner[roomId] == undefined) {
        roomOwner[roomId] = []
    }
    roomOwner[roomId].push(id)

    console.log(`Add id ${id} to room ${roomId}. Room owner is ${roomOwner[roomId]}`)
}

function removeRoomOwner(id, roomId) {
    let removeOwner = false
    if (roomOwner[roomId] == null || roomOwner[roomId] == undefined) {
        return
    }
    if (id == getRoomOwner(roomId)) {
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


function isSocketIdExist(socketid) {
    return !(getUsername(socketid) == null)
}

function isInRoom(socketid) {
    var currentRoom = getRoomId(socketid)
    return currentRoom != null && currentRoom != undefined
}

function numClientInRoom(roomId) {
    if (!isRoomExist(getIo(), roomId)) {
        return undefined
    }
    return Array.from(getIo().sockets.adapter.rooms.get(roomId)).length
}

function getAllClientInRoom(roomId) {
    if (!isRoomExist(roomId)) {
        return []
    }
    return Array.from(getIo().sockets.adapter.rooms.get(roomId))
}

// TODO: there io and nothing to do about it.
function isRoomExist(roomId) {
    return getIo().sockets.adapter.rooms.get(roomId) != undefined
}

function broadcastAllRoom(roomId, func) {
    if (!isRoomExist(getIo(), roomId)) {
        return undefined
    }
    
    Array.from(getIo().sockets.adapter.rooms.get(roomId)).forEach(
        func
    )
}

function outRoom(socketid) {
    console.log(`Delete room name ${socketid}`)

    if (getRoomOwner(room[socketid]) == socketid) {
        console.log(`Check type to set room owner in the future: ${getAllClientInRoom(room[socketid])}`)
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