chatLog = {}

export function saveChatLog(object) {
    let roomId = object['roomId']
    if (chatLog[roomId] == undefined || chatLog[roomId] == null) {
        chatLog[roomId] = []
    }

    chatLog[roomId].push(object)

    console.log(`New chat log: ${object}`)
}