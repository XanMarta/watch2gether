let {init_listener_room, initConnectionInRoom} = require('./functionality/room')
let {deleteUsername, getUsername, init_listener_username} = require('./functionality/username')
let { init_listener_chat } = require('./functionality/chat')
const { getRoomId, isInRoom, outRoom, getRoomOwner, removeRoomOwner, getUserInformation, getRoomInfomation, removeUserFromRoom } = require('./adapter/roomManager')
const { deleteUser } = require('./adapter/usernameManager')

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("New connection from socket id: ", socket.id);
    
        socket.on("client", (message) => {
            console.log(`Get message from client ${socket.id} with message: ${message}`)
            io.to(socket.id).emit("server", "Hello from server")
        })

        socket.on("signal", data => {
            io.to(data.peerId).emit('signal', { 
                signal: data.signal,
                peerId: socket.id
              });
        })

        socket.on("disconnect", async () => {
            // TODO: khi username out khỏi room/disconnect thì nên có xóa tên người dùng hiện tại đi.
            console.log(`Client ${socket.id} disconnect`)

            let userInfor = await getUserInformation(socket.id);

            if (userInfor != null && userInfor != undefined)
            {
                /**
                 * Đối tượng socket id đã được thêm vào cơ sở dữ liệu
                 */
                if (userInfor.roomid != null && userInfor.roomid != undefined)
                {
                    /**
                     * Đối tượng socket id đã thuộc một phòng.
                     */

                    let roomId = userInfor.roomid
                    let removeUserResult = await removeUserFromRoom(roomId, socket.id);

                    console.log("Giá trị của host mới sau khi xóa host: ", removeUserResult.host)

                    io.in(roomId).emit("user-disconnected", {
                        socketid: socket.id,
                        roomOwnerId: removeUserResult.host,
                        username: userInfor.username
                    })

                    console.log(`New owner id of room ${roomId} is ${removeUserResult.host}, isChange: ${removeUserResult.isChange}`)

                    if (removeUserResult.isChange) {
                        /**
                         * Socket bị disconnect là chủ phòng, thực hiện khởi tạo kết nối từ chủ mới tới tất cả các peer khác trong phòng.
                         */
                        await initConnectionInRoom(roomId)
                    }
                }

                await deleteUser(socket.id);
                /**
                 * Xóa đối tượng socket id trong cơ sở dữ liệu.
                 */
            }
        })
    
        socket.on("stream-disconnected", (data) => {
            io.to(data.peerId).emit("stream-disconnected", {
                peerId: socket.id
            })
        })

        init_listener_room(socket)
        init_listener_chat(socket)
        init_listener_username(socket)
    })
}
