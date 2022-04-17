usernameToSocketId = {}
socketIdToUsername = {}


function getUsername(socketid) {
    return socketIdToUsername[socketid]
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

function init_listener_username (io, socket) {
    socket.on("register-username", (username) => {
        if (isUsernameExist(username)) {
            socket.emit("register-username-reject", "Name already exist!")
        } else {
            usernameToSocketId[username] = socket.id
            socketIdToUsername[socket.id] = username

            console.log(`New user name has registed: ${socket.id} map to ${username}`)
            socket.emit("register-username-done")
        }
    })
}
 
module.exports = {
    getUsername,
    getSocketId,
    isUsernameExist,
    deleteUsername,
    init_listener_username
}
