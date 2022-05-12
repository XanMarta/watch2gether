// Yêu cầu: 1 collection
// gồm 1 khóa unique là socket id, và 1 khóa unique username là đụ.


function getUsername(socketid) {
    // socket id: kiểu string 
    // Truy vấn tên username của client có socketid tương ứng 

    // nếu tìm thấy, trả về 1 xâu, là username, kiểu string
    // nếu không tìm thấy, trả về undefined/null (cái nào cũng được)
}

function setUsername(socketid, username) {
    // thêm record mới vào csdl
}

function getSocketId(username) {
    // username kiểu string
    // truy vấn socketid tương ứngcủa username, rồi gửi socketid về
    // socket id kiểu string 
}

function isUsernameExist(username) {
    // kiểm tra xem liệu username đã tồn tại hay chưa 
    // kiểm tra xem có record nào có tên là username hay không.
    // có trả về true, không thì trả về false 
}

function deleteUsername(socketid) {
    // xóa record tương ứng với socketid 
}

function getUsernameFromSocketId(socketid) {
    // return socketIdToUsername[socketid]

    // đưa vào socketid, tìm ra username tương ứng
}

module.exports = {
    getUsername,
    getSocketId,
    isUsernameExist,
    deleteUsername,
    setUsername,
    getUsernameFromSocketId
}