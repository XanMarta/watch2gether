const { createServer } = require('http')
const { Server } = require('socket.io')
const Client = require('socket.io-client')

const routes = require('../routes')


describe('user-join-room test', () => {
    let client1, client2, server, io
    const roomid = 13

    beforeAll(() => {
        server = createServer()
        io = new Server(server)
        server.listen(3000)
        routes(io)  // Test agent
    })

    afterAll(() => {
        io.close()
    })

    beforeEach(() => {
        client1 = new Client('http://localhost:3000')
        client2 = new Client('http://localhost:3000')
    })

    afterEach(() => {
        client1.close()
        client2.close()
    })

    // - Test case -

    test("init socket connection", async () => {
        await new Promise((res) => {
            client1.emit("client")
            client1.on("server", (arg) => {
                res()
            })
        })
    })

    test("register username", async () => {
        await new Promise((res) => {
            client1.emit("register-username", "client1")
            client1.on("register-username-done", () => {
                res()
            })
        })
    })

    test("register with existing username", async () => {
        await new Promise((res) => {
            client1.emit("register-username", "client1")
            client2.emit("register-username", "client1")
            client2.on("register-username-reject", (msg) => {
                res()
            })
        })
    })

    test("join room without username", async () => {
        await new Promise((res) => {
            client1.emit("join-room", roomid)
            client1.on("username-require", () => {
                res()
            })
        })
    })

    test("join room with username", async () => {
        await new Promise((res) => {
            client2.emit("register-username", "client2")
            client2.emit("join-room", roomid)
            client2.on("room-joined", (msg) => {
                res()
            })
        })
    })

    test("join same room 2 times", async () => {
        await new Promise((res) => {
            client2.emit("register-username", "client2")
            client2.emit("join-room", roomid)
            client2.emit("join-room", roomid)
            client2.on("already-in-room", () => {
                res()
            })
        })
    })

    test("user join room notification", async () => {
        await new Promise((res) => {
            client1.emit("register-username", "client1")
            client2.emit("register-username", "client2")
            client1.emit("join-room", roomid)
            client1.on("join-room", (arg) => {
                res()
            })
            client2.emit("join-room", roomid)
        })
    })
})


describe("user-in-room test", () => {
    let client1, client2, server, io
    const roomid = 13

    beforeAll(() => {
        server = createServer()
        io = new Server(server)
        server.listen(3000)
        routes(io)  // Test agent
    })

    afterAll(() => {
        io.close()
    })

    beforeEach(async () => {
        client1 = new Client('http://localhost:3000')
        client2 = new Client('http://localhost:3000')
        client1.emit("register-username", "client1")
        client2.emit("register-username", "client2")
        client1.emit("join-room", roomid)
        client2.emit("join-room", roomid)
        await Promise.all([
            new Promise(res => client1.on("room-joined", () => res())),
            new Promise(res => client2.on("room-joined", () => res()))
        ])
    })

    afterEach(() => {
        client1.close()
        client2.close()
    })

    test("send broadcast message", async () => {
        await new Promise((res) => {
            client1.emit("broadcast_message_room", "secret")
            client2.on("room-message", (msg) => {
                if (msg == "secret") {
                    res()
                }
            })
        })
    })

    test("user leave room notification", async () => {
        await new Promise((res) => {
            client1.emit("leave-room")
            client2.on("leave-room-notify", (data) => {
                res()
            })
        })
    })
})
