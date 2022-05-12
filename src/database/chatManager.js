// Mục đích: Lưu lại log chat tương ứng với một room. 
// Khi có người mới vào thì có thể gửi lock chat cho người đó
// => không bị bỏ lỡ thông tin của cuộc trò chuyện 

const chatLog = {}

function saveChatLog(object) {
    // Object: một đối tượng chưa thông tin về một tin nhắn 


    // Ví dụ về một object đầu vào: 
    // messageLog = {
    //     type: 'broadcast', // loại tin nhắn (gửi chung, nhập phòng, rời phòng, mất kết nối)
    //     senderId: socket.id, // socket của người gửi, cần để định danh 
    //     senderUsername: getUsername(socket.id), // username của người gửi, cần để định danh 
    //     roomId: getRoomId(socket.id), // id của room, chủ yếu là tạo khóa bằng cái này 
    //     content: message // nội dung tin nhắn 
    // }

    // kiểm tra xem phòng có tồn tại không, nếu phòng chưa được tạo thì tạo một đối tượng trong csdl cho phòng tương ứng 
    // thêm tin nhắn vào cơ sở dữ liệu 
    // trả về một giá trị nào đó, có thể là số record thay đổi 

    // đề xuất: có thể lưu các tin nhắn rời rạc trong csdl, thì khi cần truy vấn thì Get hết cái nào cùng roomId là được. ncl, tùy, mỗi cái có cái tốt riêng :v.
}

function deleteChatlog(roomId) {
    // Khi mà phòng tương ứng bị hủy, thì log chat trong cơ sở dữ liệu cũng nên bị xóa

    // tìm và xóa tất cả các log chat cho roomId tương ứng.
}

module.exports = {
    saveChatLog
}