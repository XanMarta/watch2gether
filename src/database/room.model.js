
module.exports = {
    name: "Room",
    func: (col) => {
        return {
            _init: async () => {
                await await col.collection.createIndex({ roomid: 1 }, { unique: true })
            },

            add: async (roomid) => {
                let data = {
                    roomid: roomid,
                    host: null,
                    users: []
                }
                let result = await col.collection.insertOne(data)
                return result.insertedId.toString()
            },

            remove: async (roomid) => {
                let result = await col.collection.deleteOne({ roomid: roomid })
                return result.deletedCount
            },

            add_user: async (roomid, userid) => {
                let result = await col.collection.updateMany(
                    { roomid: roomid },
                    { $push: { users: userid } }
                )
                return result.modifiedCount
            },

            remove_user: async (roomid, userid) => {
                let result = await col.collection.updateMany(
                    { roomid: roomid },
                    { $pull: { users: userid } }
                )
                return result.modifiedCount
            },

            set_host: async (roomid, hostid) => {
                let result = await col.collection.updateMany(
                    { roomid: roomid },
                    { host: hostid }
                )
                return result.modifiedCount
            },

            unset_host: async (roomid) => {
                let result = await col.collection.updateMany(
                    { roomid: roomid },
                    { host: null }
                )
                return result.modifiedCount
            }
        }
    }
}