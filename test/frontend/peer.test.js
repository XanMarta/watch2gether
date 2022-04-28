/**
 * @jest-environment jsdom
 */

const init = require("./init_test")

// Frontend script
const peer = require("../../public/js/peer")


describe("before peer init", () => {
    let s_socket, io;
    let c_socket;
    
    beforeAll(async () => {
        [c_socket, s_socket, io] = await init.init_server(3003)
    });

    afterAll(() => {
        init.delete_server(c_socket, io)
    });

    // Test case

    test("init peer", async () => {
        const logspy = jest.spyOn(console, "log")
        peer.init_listener_peer()
        let data = {
            peerId: 123,
            initiator: false
        }
        s_socket.emit("peer-init", data)
        await init.wait()
        await expect(logspy).toHaveBeenCalledWith('** got peer-init')
    })

    test("leave-room-notify", async () => {
        // init room
        const logspy = jest.spyOn(console, "log")
        peer.init_listener_peer()
        let data = {
            peerId: 123,
            initiator: false
        }
        s_socket.emit("peer-init", data)
        await init.wait()
        // leave room
        let data_r = {
            username: "xavy",
            peerId: 123,
            roomOwnerId: 124
        }
        s_socket.emit("leave-room-notify", data_r)
        await init.wait()
        await expect(logspy).toHaveBeenCalledWith("Erase peer ID: ", 123)
    })
})


describe("after peer init", () => {
    let s_socket, io
    let c_socket

    beforeAll(async () => {
        [c_socket, s_socket, io] = await init.init_server(3004)
        peer.init_listener_peer()
        let data = {
            peerId: 123,
            initiator: false
        }
        s_socket.emit("peer-init", data)
        await init.wait()
    })

    afterAll(() => {
        init.delete_server(c_socket, io)
    })

    // Test case

    test("socket - signal", (done) => {
        let data = {
            peerId: 123,
            signal: "sample"
        }
        init.rev_peer_signal("sample", done)
        s_socket.emit("signal", data)
    })

    test("socket - user-disconnected", async () => {
        const logspy = jest.spyOn(console, "log")
        let data = {
            socketid: 124
        }
        s_socket.emit("user-disconnected", data)
        await init.wait()
        await expect(logspy).toHaveBeenCalledWith("Erase peer ID: ", 124)
    })

    test("peer - signal", (done) => {
        s_socket.on("signal", (data) => {
            if (data.signal == "sample") {
                done()
            }
        })
        init.send_peer_signal("signal", "sample")
    })

    test("peer - stream", async () => {
        const logspy = jest.spyOn(console, "log")
        init.send_peer_signal("stream", "sample")
        await init.wait()
        await expect(logspy).toHaveBeenCalledWith("Get stream: ", "sample")
    })

    test("peer - data", async () => {
        const logspy = jest.spyOn(console, "log")
        init.send_peer_signal("data", "sample")
        await init.wait()
        await expect(logspy).toHaveBeenCalledWith("Peer get data: sample")
    })

    test("peer - close", async () => {
        const logspy = jest.spyOn(console, "log")
        init.send_peer_signal("close")
        await init.wait()
        await expect(logspy).toHaveBeenCalledWith("Erase peer ID: ", 123)
    })
})
