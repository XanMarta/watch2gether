let {
    getUsername,
    getSocketId,
    isUsernameExist,
    deleteUsername,
    setUsername,
    getUsernameFromSocketId
} = require("../adapter/usernameManager")

function init_listener_username (io, socket) {
    socket.on("register-username", (username) => {
        if (isUsernameExist(username)) {
            socket.emit("register-username-reject", "Name already exist!")
        } else {
            if (getUsernameFromSocketId(socket.id) != null && getUsernameFromSocketId(socket.id) != undefined) {
                deleteUsername(socket.id)
            }
            setUsername(socket.id, username)

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
    setUsername,
    init_listener_username
}
