// Mục đích: Lưu lại log chat tương ứng với một room. 
// Khi có người mới vào thì có thể gửi lock chat cho người đó
// => không bị bỏ lỡ thông tin của cuộc trò chuyện 

const { Chat } = require("../database")

const chatLog = {}

async function saveChatLog(object) {
    let roomId = object['roomId']
    if (chatLog[roomId] == undefined || chatLog[roomId] == null) {
        chatLog[roomId] = []
    }

    console.log(`New chat log: ${object}`)
}

module.exports = {
    saveChatLog
}