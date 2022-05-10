//button
var sendMessage = document.getElementById("send-message");
var chatMessages = document.getElementsByClassName('chat-messages')[0];
var messageInput = document.getElementById("message-input");
var chat_container = document.getElementById("chat-container");

sendMessage.addEventListener("click", (e) => {
  console.log("Button clicked")
  e.preventDefault();
  if (messageInput.value != "") {
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

    //append other chat
    // const bubbleWrapper = document.createElement("div");
    // bubbleWrapper.setAttribute("class", "bubbleWrapper");
    // const username_other = document.createElement("span");
    // username_other.setAttribute("class", "username-other");
    // username_other.textContent = "Other - 08:41";
    // bubbleWrapper.appendChild(username_other);
    // const inlineContainer = document.createElement("div");
    // inlineContainer.setAttribute("class", "inlineContainer");
    // const otherBubble = document.createElement("div");
    // otherBubble.setAttribute("class", "otherBubble other");
    // otherBubble.textContent = messageInput.value;
    // inlineContainer.appendChild(otherBubble);
    // bubbleWrapper.appendChild(inlineContainer);
    // chat_container.appendChild(bubbleWrapper);
  }
})

messageInput.addEventListener("keyup", (e) => {
  console.log("Enter clicked")
  //click enter with keycode = 13
  if (e.keyCode == 13) {
    e.preventDefault();
    console.log("Button clicked")
    const currentUser = document.createElement("div");
    currentUser.setAttribute("id", "chat-text-current-user");
    const user_info = document.createElement("h6");
    user_info.setAttribute("class", "userinfo");
    user_info.textContent = "Current user - Time: ....";

    const messageContent = document.createElement("p");
    messageContent.textContent = messageInput.value;

    currentUser.append(user_info, messageContent);
    chatMessages.appendChild(currentUser);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    messageInput.value = "";
  }
})