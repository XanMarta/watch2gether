
module.exports = {
    name: "User",
    func: (col) => {
        return {
            _init: async () => {
                await col.collection.createIndex({ socketid: 1}, { unique: true })
                await col.collection.createIndex({ username: 1 }, { unique: true })
            },

            setUsername: async (socketid, username) => {
                try {
                    let result = await col.collection.insertOne({ socketid, username, roomid: null })
                    return result.insertedId.toString(0)
                } catch (error) {
                    return null
                }
            },

            getUsername: async (socketid) => {
                let result = await col.collection.find({ socketid }).toArray()
                let username = null
                if (result.length != 0) {
                    username = result[0].username
                }
                return username
            },

            getSocketid: async (username) => {
                let result = await col.collection.find({ username }).toArray()
                let socketid = null
                if (result.length != 0) {
                    socketid = result[0].socketid
                }
                return socketid
            },

            isUsernameExist: async (username) => {
                let result = await col.collection.find({ username }).toArray()
                return (result.length != 0)
            },

            deleteUsername: async (username) => {
                let result = await col.collection.deleteOne({ username })
                return result.deletedCount
            },

            getRoomId: async (socketid) => {
                let result = await col.collection.find({ socketid }).toArray()
                let roomid = null
                if (result.length != 0) {
                    roomid = result[0].roomid
                }
                return roomid
            },

            setRoomId: async (socketid, roomid) => {
                await col.collection.updateOne({
                    socketid
                }, {
                    $set: { roomid }
                })
            }
        }
    }
}