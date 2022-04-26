// thay đổi class và type. type là loại element 
// class là thay đổi giá trị tag class.
// quyết định style cho chatbox
const message_class = ""
const message_type = "p"
const notification_class = ""
const notification_type = "p"
const chat_container = document.querySelector("#chat-container")

export function addMessage(content) {
    // content = {
    //     type: 'broadcast',
    //     senderId: socket.id,
    //     senderUsername: getUsername(socket.id),
    //     roomId: getRoomId(socket.id),
    //     content: message
    // }

    console.log(`Add chat: ${content}`)

    let message_box = document.createElement(message_type)
    message_box.className = message_class
    message_box.innerHTML = `${content.senderUsername}: ${content.content}`
    chat_container.appendChild(message_box)
}

function addNotification(content) {
    // content: str

    console.log(`Add notification: ${content}`)

    let message_box = document.createElement(notification_type)
    message_box.className = notification_class
    message_box.innerHTML = `${content}`
    chat_container.appendChild(message_box)
}

export function addJoinNotification(username, type) {
    // content: str

    if (type == 'join') {
        addNotification(`${username} joined the room !!!`)
    } else if (type == 'disconnect') {
        addNotification(`${username} disconnected !!!`)
    } else if (type == 'leave') {
        addNotification(`${username} leave the room !!!`)
    } else if (type == 'owner') {
        addNotification(`${username} is the room owner`)
    }
}