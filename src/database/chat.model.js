
module.exports = {
    name: "Chat",
    func: (col) => {
        return {
            _init: async () => {
                await col.collection.createIndex({ roomid: 1}, { unique: true })
            },

            saveChatLog: async (message) => {
                await col.collection.updateOne({
                    roomid: message.roomId
                }, {
                    $setOnInsert: {
                        roomid: message.roomId
                    },
                    $push: {
                        messages: message
                    }
                }, {
                    upsert: true
                })
            },

            deleteChatLog: async (roomid) => {
                await col.collection.deleteOne({
                    roomid: roomid
                })
            }
        }
    }
}
