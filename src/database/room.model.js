
module.exports = {
    name: "Room",
    func: (col) => {
        return {
            _init: async () => {
                await await col.collection.createIndex({ roomid: 1 }, { unique: true })
            },

            // add: async (roomid) => {
            //     let data = {
            //         roomid: roomid,
            //         host: null,
            //         users: []
            //     }
            //     let result = await col.collection.insertOne(data)
            //     return result.insertedId.toString()
            // },

            // remove: async (roomid) => {
            //     let result = await col.collection.deleteOne({ roomid: roomid })
            //     return result.deletedCount
            // },

            // add_user: async (roomid, userid) => {
            //     let result = await col.collection.updateMany(
            //         { roomid: roomid },
            //         { $push: { users: userid } }
            //     )
            //     return result.modifiedCount
            // },

            // remove_user: async (roomid, userid) => {
            //     let result = await col.collection.updateMany(
            //         { roomid: roomid },
            //         { $pull: { users: userid } }
            //     )
            //     return result.modifiedCount
            // },

            // set_host: async (roomid, hostid) => {
            //     let result = await col.collection.updateMany(
            //         { roomid: roomid },
            //         { host: hostid }
            //     )
            //     return result.modifiedCount
            // },

            // unset_host: async (roomid) => {
            //     let result = await col.collection.updateMany(
            //         { roomid: roomid },
            //         { host: null }
            //     )
            //     return result.modifiedCount
            // },

            getRoomOwner: async (roomid) => {
                let result = await col.collection.find({ roomid }).toArray()
                let host = null
                if (result.length != 0) {
                    host = result[0].host
                }
                return host
            },

            isRoomOwner: async (userid, roomid) => {
                let result = await col.collection.find({ roomid }).toArray()
                let host = null
                if (result.length != 0) {
                    host = result[0].host
                }
                return (userid == host)
            },

            addRoomOwner: async (userid, roomid) => {
                await col.collection.updateOne({
                    roomid
                }, {
                    $set: {
                        host: userid,
                        users: []
                    }
                }, {
                    upsert: true
                })
            },

            removeRoomOwner: async (userid, roomid) => {
                await col.collection.updateOne({
                    host: userid
                }, {
                    $set: {
                        host: null
                    }
                })
            },

            getRoomInfo: async (roomid) => {
                let result = await col.collection.find({ roomid }).toArray()
                if (result.length != 0) {
                    return result[0]
                } else {
                    return null
                }
            },

            numClientInRoom: async (roomid) => {
                let result = await col.collection.find({ roomid }).toArray()
                if (result.length != 0) {
                    return result[0].users.length
                } else {
                    return 0
                }
            },

            getAllClientInRoom: async (roomid) => {
                let result = await col.collection.find({ roomid }).toArray()
                if (result.length != 0) {
                    return result[0].users
                } else {
                    return []
                }
            },

            isRoomExist: async (roomid) => {
                let result = await col.collection.find({ roomid }).toArray()
                return (result.length != 0)
            },

            outRoom: async (roomid, socketid) => {
                await col.collection.updateOne({
                    roomid
                }, {
                    $pull: {
                        users: socketid
                    }
                })
            },

            setRoomId: async (socketid, roomid) => {
                await col.collection.updateOne({
                    roomid
                }, {
                    $push: {
                        users: socketid
                    }
                })
            }
        }
    }
}