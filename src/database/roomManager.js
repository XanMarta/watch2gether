console.log("Create room management for the first time")
const { getUsername } = require('../database/usernameManager')

// from socket id to room id 
// cần 1 collection để ánh xạ từ socket id tới roomId. Gọi tạm là RoomCollection.
// RoomCollection sẽ có khóa là socket id, là unique. 1 thuộc tính là roomid.

function getRoomId(socketid) {
    // ánh xạ từ socketid tới room id 
}

function setRoomId(socketid, roomId) {
    // sử dụng RoomCollection 
    // Thêm record ánh xạ từ sockerid tới roomId
}
// from room id to socket id of room owner
// Each roomOwner instance is an array

function getRoomOwner(roomId) {
    // tìm và trả về record đầu tiên có roomid = roomId của đầu vào
    // nếu không có trả vê undefined/null, what ever :v
}

function isRoomOwner(id, roomId) {
    console.log(`Check if ${id} is the owner of the room ${roomId} - ${getRoomOwner(roomId)}`)
    return id == getRoomOwner(roomId)
}

function addRoomOwner(id, roomId) {
    // thêm một record chứa id và roomId.
}

function removeRoomOwner(id, roomId) {
    // xóa record tương ứng với id và roomId (cái roomId là không cần thiết, nhưng nếu thay đổi thì khả ănng phải thay đổi nhiều nên thôi) 
}


function isSocketIdExist(socketid) {
    // kiểm tra xem có record nào xài socketid hay chưa, nếu có thì trả vê true.
}

function isInRoom(socketid) {
    // về lý thuyết 2 hàm này không khác nhau mấy, do nếu được record thì chắc chắn là trong room rồi :v
    isSocketIdExist(socketid) 
}

function numClientInRoom(roomId) {
    // đếm tất cả các record có roomId tương ứng 
}

function getAllClientInRoom(roomId) {
    // lấy socket id của tất cả những record có roomid = roomId
    // trả về 1 mảng chứa các socket id
}

// TODO: there io and nothing to do about it.
function isRoomExist(roomId) {
    // kiểm tra xem, nếu chỉ cần có 1 record có roomid = roomId thì là true, không là false.
}

function outRoom(socketid) {
    // xóa record ứng với socket id tương ứng.
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
    addRoomOwner,
    removeRoomOwner,
    broadcastAllRoom,
    outRoom
}