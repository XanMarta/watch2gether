usernameToSocketId = {}
socketIdToUsername = {}

function getUsername(socketid) {
    return socketIdToUsername[socketid]
}

function setUsername(socketid, username) {
    usernameToSocketId[username] = socketid
    socketIdToUsername[socketid] = username
}

function getSocketId(username) {
    return usernameToSocketId[username]
}

function isUsernameExist(username) {
    return username in usernameToSocketId
}

function deleteUsername(socketid) {
    delete usernameToSocketId[socketIdToUsername[socketid]]
    delete socketIdToUsername[socketid]
}

function getUsernameFromSocketId(socketid) {
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