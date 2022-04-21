console.log("Create room management for the first time")
let { getUsername } = require('../functionality/username')

// from socket id to room id 
room = {}

function getRoomId(socketid) {
    return room[socketid]
}

function setRoomId(socketid, roomId) {
    room[socketid] = roomId
}
// from room id to socket id of room owner
roomOwner = {}

function getRoomOwner(roomId) {
    return roomOwner[roomId]
}

function isSocketIdExist(socketid) {
    return !(getUsername(socketid) == null)
}

function isInRoom(socketid) {
    var currentRoom = getRoomId(socketid)
    return currentRoom!= null && currentRoom != undefined
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

function isRoomOwner(id, roomId) {
    return id == getRoomOwner(roomId)
}

function setRoomOwner(id, roomId) {
    if (getRoomOwner(roomId) != null && getRoomOwner(roomId) != undefined) {
        console.log("This room already has an owner")
        return 
    }

    roomOwner[roomId] = id
}

function broadcastAllRoom(io, roomId, func) {
    Array.from(io.sockets.adapter.rooms.get(roomId)).forEach(
        func
    )
}

function outRoom(socketid) {
    console.log(`Delete room name ${socketid}`)
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
    setRoomOwner,
    broadcastAllRoom,
    outRoom
}