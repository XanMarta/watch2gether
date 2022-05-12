
module.exports = {
    name: "Product",
    func: (col) => {
        return {
            _init: async () => {
                // await col.collection.createIndex({ index: 1 }, { unique: true })
            },
            add_product: async (name, date, description) => {
                await col.collection.insertOne({
                    name, date, description
                })
            },
            get_product: async () => {
                return await col.collection.find().toArray()
            }
        }
    }
}