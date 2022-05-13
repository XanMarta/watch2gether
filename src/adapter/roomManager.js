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
    outRoom
}