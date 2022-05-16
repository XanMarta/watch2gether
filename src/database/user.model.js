
module.exports = {
    name: "User",
    func: (col) => {
        return {
            _init: async () => {
                await col.collection.createIndex({ socketid: 1 }, { unique: true })
                await col.collection.createIndex({ username: 1 }, { unique: true })
            },

            setUsername: async (socketid, username) => {
                await col.collection.updateOne({
                    socketid
                }, {
                    $set: { username },
                    $setOnInsert: { roomid: null }
                }, {
                    upsert: true
                })
            },

            getUsername: async (socketid) => {
                let result = await col.collection.find({ socketid }).toArray()
                let username = null
                if (result.length != 0) {
                    username = result[0].username
                }
                return username
            },

            getSocketId: async (username) => {
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
            },

            isInRoom: async (socketid) => {
                let result = await col.collection.find({ socketid }).toArray()
                let inRoom = false
                if (result.length != 0) {
                    if (result[0].roomid != null) {
                        inRoom = true
                    }
                }
                return inRoom
            },

            outRoom: async (socketid) => {
                let result = await col.collection.findOneAndUpdate({
                    socketid
                }, {
                    $set: { roomid: null }
                })
                if (result.value != null) {
                    return result.value.roomid
                } else {
                    return null
                }
                // Call outRoom in Room model next
            },

            getUserInformation: async (socketid) => {
                let result = await col.collection.find({ socketid }).toArray()
                console.log(socketid)
                console.log("INFO")
                console.log(result)
                let user = null
                if (result.length > 0) {
                    user = result[0]
                }
                return user
            },

            updateUser: async (socketid, roomid, username) => {
                console.log("UPDATE")
                console.log(socketid + " " + roomid + " " + username)
                await col.collection.updateOne({ socketid }, {
                    $set: { roomid, username }
                }, {
                    upsert: true
                })
            },

            deleteUser: async (socketid) => {
                await col.collection.deleteOne({ socketid })
            }
        }
    }
}
