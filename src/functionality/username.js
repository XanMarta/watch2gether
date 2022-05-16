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
        let usernameInfo = await getUsernameInfo(username);
        
        if (usernameInfo != null && usernameInfo != undefined) 
        {
            socket.emit("register-username-reject", "Name already exist!")
        } 
        else 
        {
            await setUsername(socket.id, username)
            /**
             * Thay đổi username trong record tương ứng với socket.id trong user
             */

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
