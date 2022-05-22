const init = require("./init_test")


const db = require("../../src/database")


describe("database connection test", () => {

    test("check connection", async () => {
        await db.connect_db()
        await db.close_db()
    })
    
})
