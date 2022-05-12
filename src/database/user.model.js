
module.exports = {
    name: "User",
    func: (col) => {
        return {
            _init: async () => {
                await col.collection.createIndex({ username: 1 }, { unique: true })
            },
            add: async (username) => {
                let result = await col.collection.insertOne({
                    username: username
                })
                return result.insertedId.toString(0)
            },
            remove: async (username) => {
                let result = await col.collection.deleteOne({ username: username })
                return result.deletedCount
            }
        }
    }
}