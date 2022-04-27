/**
 * @jest-environment jsdom
 */

const Client = require("socket.io-client")
const { createServer } = require('http')
const { Server } = require('socket.io')
const init = require("./init_test")

// Frontend script
const peer = require("../../public/js/peer")
import { setSocket } from "../../public/js/singleton/init_socket.js"

// Fake SimplePeer
global.SimplePeer = class {
    constructor(initiator, stream) {
        this.initiator = initiator
        this.stream = stream
    }
    on(signal_name, callback) {}
    signal(signal_name) {}
}


describe("peer test", () => {
    let s_socket, io;
    let c_socket;
    
    beforeAll((done) => {
        // Init server
        const server = createServer();
        io = new Server(server);
        server.listen(3003, () => {
            // Init client
            c_socket = new Client("http://localhost:3003");
            io.on("connection", (socket) => {
                s_socket = socket;
            });
            setSocket(c_socket)
            c_socket.on("connect", done);
        })
    });

    afterAll(() => {
        io.close();
        c_socket.close();
    });

    test("init peer", async () => {
        const logspy = jest.spyOn(console, "log")
        peer.init_listener_peer()
        let data = {
            peerId: 123,
            initiator: false
        }
        s_socket.emit("peer-init", data)
        await new Promise(r => setTimeout(r, 100))
        await expect(logspy).toHaveBeenCalledWith('** got peer-init')
    })

})
