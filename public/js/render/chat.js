// thay đổi class và type. type là loại element 
// class là thay đổi giá trị tag class.
// quyết định style cho chatbox
const message_class = ""
const message_type = "p"
const notification_class = "notification"
const notification_type = "p"

//chat container
const chat_container = document.querySelector("#chat-container")
const messageInput = document.querySelector("#message-input");

export function addMessage(content) {
    // content = {
    //     type: 'broadcast',
    //     senderId: socket.id,
    //     senderUsername: getUsername(socket.id),
    //     roomId: getRoomId(socket.id),
    //     content: message
    // }
    //check the message is from remote user or current user?
    if (content.senderUsername === "Me") {
        console.log(`Add chat: ${content}`)
        // //current time
        // const current_time = new Date().toLocaleTimeString();
        // //render chat goes here
        // console.log("Button clicked")
        // const currentUser = document.createElement("div");
        // currentUser.setAttribute("class", "chat-text-current-user");
        // const user_info = document.createElement("h6");
        // user_info.setAttribute("class", "userinfo");
        // user_info.textContent = `${content.senderUsername}: - Time: ${current_time}`;

        // const messageContent = document.createElement(message_type);
        // messageContent.textContent = `${content.content}`;
        // currentUser.append(user_info, messageContent);
        // chat_container.appendChild(currentUser);
        // chat_container.scrollTop = chat_container.scrollHeight;
        // messageInput.value = "";

        const bubbleWrapper = document.createElement("div");
        bubbleWrapper.setAttribute("class", "bubbleWrapper");
        const username_own = document.createElement("span");
        username_own.setAttribute("class", "username-own");
        username_own.textContent = "Me - 08:41";
        bubbleWrapper.appendChild(username_own);
        const inlineContainer = document.createElement("div");
        inlineContainer.setAttribute("class", "inlineContainer own");
        const otherBubble = document.createElement("div");
        otherBubble.setAttribute("class", "ownBubble own");
        otherBubble.textContent = messageInput.value;
        inlineContainer.appendChild(otherBubble);
        bubbleWrapper.appendChild(inlineContainer);
        chat_container.appendChild(bubbleWrapper);
        chat_container.scrollTop = chat_container.scrollHeight;
        messageInput.value = "";
    } else {
        console.log(`Add chat: ${content}`)
        // //current time
        // const current_time = new Date().toLocaleTimeString();
        // //render chat goes here
        // console.log("Button clicked")
        // const currentUser = document.createElement("div");
        // currentUser.setAttribute("class", "chat-text-other-user");
        // const user_info = document.createElement("h6");
        // user_info.setAttribute("class", "userinfo");
        // user_info.textContent = `${content.senderUsername}: - Time: ${current_time}`;

        // const messageContent = document.createElement(message_type);
        // messageContent.textContent = `${content.content}`;
        // currentUser.append(user_info, messageContent);
        // chat_container.appendChild(currentUser);
        // chat_container.scrollTop = chat_container.scrollHeight;
        // const bubbleWrapper = document.createElement("div");
        bubbleWrapper.setAttribute("class", "bubbleWrapper");
        const username_other = document.createElement("span");
        username_other.setAttribute("class", "username-other");
        username_other.textContent = "Other - 08:41";
        bubbleWrapper.appendChild(username_other);
        const inlineContainer = document.createElement("div");
        inlineContainer.setAttribute("class", "inlineContainer");
        const otherBubble = document.createElement("div");
        otherBubble.setAttribute("class", "otherBubble other");
        otherBubble.textContent = messageInput.value;
        inlineContainer.appendChild(otherBubble);
        bubbleWrapper.appendChild(inlineContainer);
        chat_container.appendChild(bubbleWrapper);
    }
    //part of Ngo Hai Dang
    // let message_box = document.createElement(message_type)
    // message_box.className = message_class
    // message_box.innerHTML = `${content.senderUsername}: ${content.content}`
    // chat_container.appendChild(message_box)
}

function addNotification(content) {
    // content: str

    //Part of Ngo Hai Dang
    console.log(`Add notification: ${content}`)
    const message_box = document.createElement(notification_type);
    message_box.className = notification_class
    message_box.textContent = `${content}`
    chat_container.append(message_box)
}

export function addJoinNotification(username, type) {
    // content: str

    if (type == 'create') {
        addNotification(`${username} has create the room !!!`)
    } else if (type == 'join') {
        addNotification(`${username} joined the room !!!`)
    } else if (type == 'disconnect') {
        addNotification(`${username} disconnected !!!`)
    } else if (type == 'leave') {
        addNotification(`${username} leave the room !!!`)
    } else if (type == 'owner') {
        addNotification(`${username} is now the room owner !!!`)
    }
}