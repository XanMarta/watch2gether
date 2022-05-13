const { User } = require("../database")

async function getUsername(socketid) {
    return socketIdToUsername[socketid]
}

async function setUsername(socketid, username) {
    usernameToSocketId[username] = socketid
    socketIdToUsername[socketid] = username
}

async function getSocketId(username) {
    return usernameToSocketId[username]
}

async function isUsernameExist(username) {
    return username in usernameToSocketId
}

async function deleteUsername(socketid) {
    delete usernameToSocketId[socketIdToUsername[socketid]]
    delete socketIdToUsername[socketid]
}

async function getUsernameFromSocketId(socketid) {
    return socketIdToUsername[socketid]
}

module.exports = {
    getUsername,
    getSocketId,
    isUsernameExist,
    deleteUsername,
    setUsername,
    getUsernameFromSocketId
}