let {
    getUsername,
    getSocketId,
    isUsernameExist,
    deleteUsername,
    setUsername,
    getUsernameFromSocketId
} = require("../adapter/usernameManager")

function init_listener_username (socket) {
    socket.on("register-username", async (username) => {
        if (await isUsernameExist(username)) {
            socket.emit("register-username-reject", "Name already exist!")
        } else {
            let username = await getUsernameFromSocketId(socket.id)
            if (username != null && username != undefined) {
                await deleteUsername(socket.id)
            }
            await setUsername(socket.id, username)

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
