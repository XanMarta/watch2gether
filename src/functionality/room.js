let { isUsernameExist } = require('./username')
let {
    getRoomInfomation,
    removeUserFromRoom,
    getUserInformation,
    addUser,
    updateUser,
    addRoomOwner
} = require('../adapter/roomManager')
const { v4: uuidv4 } = require("uuid");
const { getIo } = require('../singleton/io');
const { getUsernameFromSocketId } = require('../adapter/usernameManager');

async function initConnectionInRoom(roomId) {
    /**
     * Khởi tạo mạng peer mới trong roomId.
     * Tạo kết nối từ chủ phòng tới tất cả những người nhận.
     */

    // console.log(`Init connection in room ${roomId}`)
    // if (await isRoomExist(roomId))
    // {
    //     console.log(`Yes, room exist`)
    //     if (await numClientInRoom(roomId) > 1)
    //     {
    //         console.log('Yes, there are more than one person in this room')
    //         let roomOwnerId = await getRoomOwner(roomId);
    //         let allClient = await getAllClientInRoom(roomId)
    //         allClient.forEach(socketid => {
    //             if (socketid == roomOwnerId) {
    //                 return
    //             }
    //             getIo().to(socketid).emit("peer-init", {
    //                 peerId: roomOwnerId,
    //                 initiator: false
    //             })
    //             getIo().to(roomOwnerId).emit('peer-init', {
    //                 peerId: socketid,
    //                 initiator: true
    //             })
    //             console.log(`Send an peer negotiation between ${socketid} and ${roomOwnerId}`)
    //         })
    //     }
    // }

    console.log(`Init connection in room ${roomId}`)
    let room = await getRoomInfomation(roomId);
    /**
     * Biến room này lên là 1 Object, trả về tất cả các thông tin liên quan đến room.
     * Gồm có
     * - roomid
     * - host
     * - users (lưu dưới dạng 1 mảng các socketid)
     */
    let roomOwnerId = room.host
    let allClient = room.users 

    allClient.forEach(socketid => {
        if (socketid == roomOwnerId) {
            return
        }
        getIo().to(socketid).emit("peer-init", {
            peerId: roomOwnerId,
            initiator: false
        })
        getIo().to(roomOwnerId).emit('peer-init', {
            peerId: socketid,
            initiator: true
        })
        console.log(`Send an peer negotiation between ${socketid} and ${roomOwnerId}`)
    })
}


function init_listener_room (socket) {

    async function getMemberInformation(roomId, room = null) {
        console.log("Get request for room infomation: ", roomId)
        if (room == null) 
        {
            room = await getRoomInfomation(roomId)
        }
        /**
         * Trường hợp không cung cấp đối tượng room, sẽ tự động truy vấn trong DB
         */
        let clientArrayInRoom = room.users

        console.log(clientArrayInRoom)
    
        for (let i=0;i<clientArrayInRoom.length;i++) 
        {
            clientArrayInRoom[i] = {
                clientId: clientArrayInRoom[i].socketid,
                username: clientArrayInRoom[i].username ,
                isRoomOwner: clientArrayInRoom[i].socketid == room.host
                // other information about member in room goes here
            }
        }

        console.log(clientArrayInRoom)
    
        return clientArrayInRoom
    }

    /// TODO: Chỉnh lại logic phần này.
    /// TODO: Tạo thêm event join-room
    socket.on("create-room", async (data, callback) => {
        console.log(`Get create room request from ${socket.id} under the name ${data.username}`);

        let userInfo = await getUserInformation(socket.id)
        /**
         * userInfo chứa tất cả các thông tin liên quan người dùng có socket.id
         * Gồm có:
         * - Socketid 
         * - Roomid 
         * - Username
         */

        if (await isUsernameExist(data.username)) 
        {
            let response = {
                isSuccess: false,
                message: "Tên người dùng đã tồn tại."
            }
            callback(response)
            return
        }

        if (userInfo != null && userInfo != undefined) 
        {
            /**
             * Thông tin về người dùng socket.id đã được lưu trên cơ sở dữ liệu.
             */
            if (userInfo.roomid != null && userInfo.roomid != undefined) 
            {
                let response = {
                    isSuccess: false,
                    message: "Người dùng đang ở trong một phòng khác."
                }
                callback(response)
                return
            }
        }

        let roomId = uuidv4()

        socket.join(roomId)

        await addRoomOwner(socket.id, roomId);

        // await addRoomOwner(socket.id, roomId)
        // await setUsername(socket.id, data.username)
        // await setRoomId(socket.id, roomId)
        if (userInfo != null && userInfo != undefined)
        {
            await addUser({
                socketid: socket.id,
                roomid: roomId,
                username: data.username
            })
            /**
             * Add người dùng mới vào cơ sở dữ liệu.
             * Các thao tác khác như thêm người dùng vào room, chỉnh host, các thứ cũng được thực hiện trong hàm này.
             */
        }
        else 
        {
            await updateUser(socket.id, {
                roomid: roomId,
                username: data.username
            })
            /**
             * Sửa thông tin trong cơ sở dữ liệu ứng với socket id là socket.id
             */
        }

        let response = {
            isSuccess: true,
            roomid: roomId,
            hostUsername: data.username,
            hostSocketId: socket.id,
            member: [{
                socketid: socket.id,
                username: data.username
            }]
        }
        /**
         * Member chỉ là mảng 1 phần tử: do đây là tạo phòng mới.
         */
        callback(response)
    })

    socket.on("join-room", async (data, callback) => {
        console.log(`Get join room request from ${socket.id} under the name ${data.username}, to join room ${data.roomid}`);

        let userInfo = await getUserInformation(socket.id)
        /**
         * userInfo chứa tất cả các thông tin liên quan người dùng có socket.id
         * Gồm có:
         * - Socketid 
         * - Roomid 
         * - Username
         */

         if (await isUsernameExist(data.username)) 
         {
             let response = {
                 isSuccess: false,
                 message: "Tên người dùng đã tồn tại."
             }
             callback(response)
             return
         }

        if (userInfo != null && userInfo != undefined) {
            /**
             * Record tương ứng với socket id có tồn tại.
             * Thực hiện kiểm tra xem có trong phòng nào khác hay không.
             */
            if (userInfo.roomId != null || userInfo.roomId != undefined)
            {
                let response = {
                    isSuccess: false,
                    message: "Người dùng đang ở trong một phòng khác."
                }
                callback(response)
                return
            }
        }

        let roomId = data.roomid
        // TODO: Enable code above. Add no join when room is full.
        console.log(`Client ${socket.id} want to join ${roomId}`);

        let room = await getRoomInfomation(roomId)
        /**
         * Lấy thông tin về phòng có tên là roomId
         */

        console.log("Debug - giá trị của room: ", room)

        if (room == null || room == undefined)  {
            /**
             * Phòng không tồn tại.
             */
             let response = {
                isSuccess: false,
                message: "Phòng không tồn tại."
            }
            callback(response)
            return
        }

        // Add this id to candidate roomOwner list
        await addUser({
            socketid: socket.id,
            username: data.username,
            roomid: roomId
        })
        /**
         * Hàm này phải thực hiện cập nhật record trong user, đồng thời cập nhật record trong room.
         */
        await addRoomOwner(socket.id, roomId);
        /**
         * Thêm client mới socket.id vào roomId
         */

        let members = []

        for await (const socketid of room.users) {
            let currentUsername = await getUsernameFromSocketId(socketid)
            members.push({
                socketid: socketid,
                username: currentUsername
            })
        }
        members.push({
            socketid: socket.id,
            username: data.username
        })

        console.log("Giá trị của member: ")
        console.log(members)

        let response = {
            isSuccess: true,
            roomid: roomId,
            hostUsername: await getUsernameFromSocketId(room.host),
            hostSocketId: room.host,
            member: members
        }
        // tạo phòng bên client trước, để set host các thứ
        callback(response)

        // init peer connection sau
        socket.emit("peer-init", {
            peerId: room.host,
            initiator: false
        })

        socket.join(roomId)

        // Ta giả thiết rằng khi phòng tồn tại và người dùng muốn vào phòng. Trong phòng chắc chắn có ít nhất 1 người.
        console.log("Send to Room Owner peer-init request:")
        console.log("From: ", socket.id)
        
        getIo().to(room.host).emit('peer-init', {
            peerId: socket.id,
            initiator: true
        })

        socket.to(roomId).emit('join-room', {
            socketid: socket.id, 
            username: data.username
        });

        /**
         * DEBUG Only:
         */
        console.log(getIo().sockets.adapter.rooms)
    })

    socket.on("leave-room", async (callback) => {
        let userInfo = await getUserInformation(socket.id)  

        if (userInfo == null || userInfo == undefined) 
        {
            /**
             * Không tìm thấy đối tượng trong cơ sở dữ liệu.
             */
            let response = {
                isSuccess: false,
                message: "Người dùng chưa được khởi tạo."
            }
            callback(response)
            return
        }
        else 
        {
            if (userInfo.roomid == null || userInfo.roomid == undefined) 
            {
                /**
                 * Người dùng không ở trong phòng.
                 */
                let response = {
                    isSuccess: false,
                    message: "Người dùng không trong một phòng cụ thể."
                }
                callback(response)
                return
            }
        }

        let removeUserResult = await removeUserFromRoom(userInfo.roomid, socket.id);
        /**
         * Hàm này thực hiện:
         * - Nếu socket.id là host, đẩy thằng user khác gần nhất lên. Nếu không còn ai, xóa luôn phòng.
         * - Ngược lại, giữ nguyên host 
         * - Xóa socket.id khỏi mảng users.
         * - Trả về một object có 2 trường:
         *      + host: là host hiện tại sau khi xóa người dùng. null nếu phòng bị xóa.
         *      + isChange: xem là có sự thay đổi host khi xóa người dùng hay không. true là có, false là không.
         */
        let roomId = userInfo.roomid;
        let username = userInfo.username;
        let host = removeUserResult.host 
        let isChange = removeUserResult.isChange

        socket.leave(roomId)

        if (host != null && host != undefined)
        {
            /**
             * Phòng không bị xóa.
             */
            socket.to(roomId).emit("leave-room-notify", {
                peerId: socket.id,
                roomOwnerId: host,
                username: username
            })

            if (isChange) {
                /**
                 * Tạo mới các connection trong room.
                 */
                await initConnectionInRoom(roomId);
            }
        }

        let response = {
            isSuccess: true
        }
        callback(response)
    })
}

module.exports = {
    init_listener_room,
    initConnectionInRoom
}
