console.log("Create room management for the first time")
const { getUsername } = require('../functionality/username')
const { getIo } = require('../singleton/io')
const { Room, User } = require("../database")

// from socket id to room id 


async function getRoomId(socketid) { 
    /**
     * Đầu vào là một socket id
     * Đầu ra là roomId mà cái socket id đấy đang ở trong 
     * Nếu không ở trong room thì trả về null/undefined
     */
    return await User.getRoomId(socketid)
}

async function setRoomId(socketid, roomId) {
    /**
     * tạo ánh xạ từ socketid tới roomId.
     */
    await User.setRoomId(socketid, roomId)
    await Room.setRoomId(socketid, roomId)
}
// from room id to socket id of room owner
// Each roomOwner instance is an array

async function getRoomOwner(roomId) {
    /**
     * Tìm và trả về chủ của phòng. 
     * Nếu phòng không có chủ, hoặc phòng không tồn tại, trả về null/undefined
     */
    return await Room.getRoomOwner(roomId)
}

async function isRoomOwner(id, roomId) {
    /**
     * Kiểm tra xem người có id có phải là chủ phòng hay không.
     * Trả về true nếu người có id là chủ của phòng, ngược lại trả về false.
     */
    return await Room.isRoomOwner(id, roomId)
}

async function addRoomOwnerCandidate(id, roomId) {
    /**
     * Nếu phòng chưa được tạo, tạo phòng.
     * Đẩy người dùng có id vào mảng các user của phòng.
     * Do trong DB, host được lưu riêng sẽ, nên ở bước này có thể if, nếu phòng được tạo mới thì set id là host của phòng.
     */
    await Room.addRoomOwner(id, roomId)
}

async function removeRoomOwnerCandidate(id, roomId) {
    /**
     * Xóa người dùng id ra khỏi phòng.
     * Nếu phòng không tồn tại, bỏ qua.
     * Nếu người dùng là host, thay host mới
     * Xóa người dùng khỏi mảng User của room.
     */
    let ownerChanged = await Room.removeRoomOwner(id, roomId)
    if (ownerChanged != null) {
        let users = await Room.getAllClientInRoom(roomId)
        if (users.length == 0) {
            console.log("No user in room")
        } else {
            await Room.setRoomOwner(users[0], roomId)
        }
    }
}


async function isSocketIdExist(socketid) {
    /**
     * Kiểm tra xem Socketid tương ứng đã nằm trong cơ sở dữ liệu hay chưa.
     * Trả về true, nếu socketid đã nằm trong cơ sở dữ liệu, false trong trường hợp ngược lại.
     */
    return !(await getUsername(socketid) == null)
}

async function isInRoom(socketid) {
    /**
     * Kiểm tra xem người dùng socket id có trong một phòng nào hay không.
     * Nếu người dùng có trong phòng, trả về true, còn lại trả về false.
     */
    var currentRoom = await getRoomId(socketid)
    return currentRoom!= null && currentRoom != undefined
}

async function numClientInRoom(roomId) {
    /**
     * Đếm số lượng người dùng trong phòng.
     * Trả về số lượng người dùng trong phòng.
     * Nếu phòng không tồn tại, trả về false.
     */
    if (!await isRoomExist(getIo(), roomId)) {
        return undefined
    }
    return Array.from(getIo().sockets.adapter.rooms.get(roomId)).length
}

async function getAllClientInRoom(roomId) {
    /**
     * Trả về một mảng chứa socketid của toàn bộ người trong một phòng.
     * Nếu phòng không tồn tại trả về mảng rỗng 
     */
    if (!await isRoomExist(roomId)) {
        return []
    }
    return Array.from(getIo().sockets.adapter.rooms.get(roomId))
}

// TODO: there io and nothing to do about it.
async function isRoomExist(roomId) {
    /**
     * Kiểm tra xem một phòng có tồn tại hay không.
     * Trả về true nếu có, và false nếu không.
     */
    return getIo().sockets.adapter.rooms.get(roomId) != undefined
}

async function broadcastAllRoom(roomId, func) {
    /**
     * Hàm này sẽ duyệt qua tất cả các socketid trong roomId, và với mỗi socketid, hàm func(socketid) sẽ được chạy
     */
    if (!await isRoomExist(getIo(), roomId)) {
        return undefined
    }
    
    Array.from(getIo().sockets.adapter.rooms.get(roomId)).forEach(
        func
    )
}

async function outRoom(socketid) {
    /**
     * Xóa người dùng ra khỏi phòng.
     * Chức năng tương tự như removeRoomOwner somehow
     */
    let roomid = await User.outRoom(socketid)
    if (roomid != null) {
        await Room.outRoom(roomid, socketid)
    }
    // Check room owner change
}

async function getUserInformation(socketid) {
    /**
     * userInfo chứa tất cả các thông tin liên quan người dùng có socket.id
     * Gồm có:
     * - Socketid 
     * - Roomid 
     * - Username
     * Trả về null hoặc undefined nếu không tìm thấy.
     */
    return await User.getUserInformation(socketid)
}


async function getRoomInfomation(roomid) {
    /**
     * Biến room này nên là 1 Object, trả về tất cả các thông tin liên quan đến room.
     * Gồm có
     * - roomid
     * - host
     * - hostUsername
     * - users (lưu dưới dạng 1 mảng các object, mỗi object chứa socketid và username)
     */
    return await Room.getRoomInfo(roomid)
}

async function removeUserFromRoom(roomid, socketid) {
    /**
     * Hàm này thực hiện:
     * - Nếu socket.id là host, đẩy thằng user khác gần nhất lên. Nếu không còn ai, xóa luôn phòng.
     * - Ngược lại, giữ nguyên host 
     * - Xóa socket.id khỏi mảng users.
     * - Trả về một object có 2 trường:
     *      + host: là host hiện tại sau khi xóa người dùng. null nếu phòng bị xóa.
     *      + isChange: xem là có sự thay đổi host khi xóa người dùng hay không. true là có, false là không.
     */
    let roominfo = await Room.getRoomInfo(roomid)
    let host = roominfo.host
    let isChange = false

    console.log(`Xóa người dùng ${socketid} khỏi phòng ${roomid}`)
    console.log(`About room ${roomid}, the owner is ${roominfo.host}`)
    if (roominfo.host == socketid) {
        console.log("Người bị xóa là host!!")
        var userlist = roominfo.users.filter(e => e !== socketid)
        console.log(userlist)

        if (userlist.length > 0) {
            console.log("Số người còn lại lớn hơn 0, đặt host mới: ", userlist[0])
            host = userlist[0]
            isChange = true
            await Room.setRoomOwner(host, roomid)
        } else {
            host = undefined
            await Room.removeRoom(roomid)
        }
    }
    await Room.outRoom(roomid, socketid)
    await User.setRoomId(socketid, null)

    console.log("Giá trị trả về: ", host)
    return { host: host, isChange: isChange }
}

async function updateUser(socketid, updateField) {
    /**
     * Sửa thông tin trong cơ sở dữ liệu ứng với socket id là socket.id
     * Trong updateField có roomid và username.
     */
    await User.updateUser(socketid, updateField.roomid, updateField.username)
}

async function addUser(userInfo) {
     /**
     * Add người dùng mới vào cơ sở dữ liệu.
     * Các thao tác khác như thêm người dùng vào room, chỉnh host, các thứ cũng được thực hiện trong hàm này.
     * userInfo chưa socketid, roomid, và username.
     */
    await User.updateUser(userInfo.socketid, userInfo.roomid, userInfo.username)
    let roominfo = await Room.getRoomInfo(userInfo.roomid)
    if (roominfo == null) {
        await Room.addRoomOwner(userInfo.socketid, userInfo.roomid)
    } else {
        await Room.setRoomId(userInfo.socketid, userInfo.roomid)
    }
}

async function deleteUser(socketid) {
    await Room.deleteUser(socketid)
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
    addRoomOwner: addRoomOwnerCandidate,
    removeRoomOwner: removeRoomOwnerCandidate,
    broadcastAllRoom,
    outRoom,
    getUserInformation,
    getRoomInfomation,
    removeUserFromRoom,
    updateUser,
    addUser,
    deleteUser
}