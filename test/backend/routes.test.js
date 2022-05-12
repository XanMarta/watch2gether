const init = require("./init_test")


describe('user-join-room test', () => {
    let clients = []
    let io
    const port = 3000
    const roomid = 13

    beforeAll(() => {
        io = init.init_server(port)
    })

    afterAll(() => {
        init.delete_server(io)
    })

    beforeEach(async () => {
        clients = await init.init_client(port, 2, false)
    })

    afterEach(() => {
        init.delete_client(clients)
    })

    // - Test case -

    test("init socket connection", async () => {
        await new Promise((res) => {
            clients[0].emit("client")
            clients[0].on("server", (arg) => {
                res()
            })
        })
    })

    test("register username", async () => {
        await new Promise((res) => {
            clients[0].emit("register-username", "client0")
            clients[0].on("register-username-done", () => {
                res()
            })
        })
    })

    test("register with existing username", async () => {
        await new Promise((res) => {
            clients[0].emit("register-username", "client0")
            clients[1].emit("register-username", "client0")
            clients[1].on("register-username-reject", (msg) => {
                res()
            })
        })
    })

    test("join room without username", async () => {
        await new Promise((res) => {
            clients[0].emit("join-room", roomid)
            clients[0].on("username-require", () => {
                res()
            })
        })
    })

    test("join room with username", async () => {
        await new Promise((res) => {
            clients[1].emit("register-username", "client1")
            clients[1].emit("join-room", roomid)
            clients[1].on("room-joined", (msg) => {
                res()
            })
        })
    })

    test("join same room 2 times", async () => {
        await new Promise((res) => {
            clients[1].emit("register-username", "client1")
            clients[1].emit("join-room", roomid)
            clients[1].emit("join-room", roomid)
            clients[1].on("already-in-room", () => {
                res()
            })
        })
    })

    test("user join room notification", async () => {
        await new Promise((res) => {
            clients[0].emit("register-username", "client0")
            clients[1].emit("register-username", "client1")
            clients[0].emit("join-room", roomid)
            clients[0].on("join-room", (arg) => {
                res()
            })
            clients[1].emit("join-room", roomid)
        })
    })
})


describe("user-in-room test", () => {
    let clients = []
    let io
    const port = 3001

    beforeAll(() => {
        io = init.init_server(port)
    })

    afterAll(() => {
        init.delete_server(io)
    })

    beforeEach(async () => {
        clients = await init.init_client(port, 2, true)
    })

    afterEach(() => {
        init.delete_client(clients)
    })

    test("user leave room notification", async () => {
        await new Promise((res) => {
            clients[0].emit("leave-room")
            clients[1].on("leave-room-notify", (data) => {
                res()
            })
        })
    })
})
