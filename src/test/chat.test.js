const init = require('./init_test')


describe("chat test", () => {
    let clients, io

    beforeAll(() => {
        io = init.init_server()
    })

    afterAll(() => {
        init.delete_server(io)
    })

    beforeEach(async () => {
        clients = await init.init_client(2, true)
    })

    afterEach(() => {
        init.delete_client(clients)
    })

    // - Test case -

    test("send broadcast message", async () => {
        await new Promise((res) => {
            clients[0].emit("broadcast_message_room", "secret")
            clients[1].on("room-message", (msg) => {
                if (msg.content == "secret") {
                    res()
                }
            })
        })
    })

})
