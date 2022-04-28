const Client = require("socket.io-client")
const { createServer } = require('http')
const { Server } = require('socket.io')

import { setSocket } from "../../public/js/singleton/init_socket.js"


// Fake SimplePeer
const signals_rev = {}
const signals_send = {}

global.SimplePeer = class {
    constructor(initiator, stream) {
        this.initiator = initiator
        this.stream = stream
    }
    on(signal_name, callback) {
        signals_rev[signal_name] = callback
    }
    signal(signal_name) {
        if (signals_send[signal_name]) {
            signals_send[signal_name]()
        }
    }
    destroy() {}
    addStream() {}
}

function send_peer_signal(signal_name, data) {
    if (signals_rev[signal_name]) {
        signals_rev[signal_name](data)
    }
}

function rev_peer_signal(signal_name, callback) {
    signals_send[signal_name] = callback
}
// End fake SimplePeer


// Fake html DOM
const htm = class {
    constructor() {}
    appendChild() {}
}
Object.defineProperty(global.document, "querySelector", { value: (s) => new htm() })
// End fake html DOM


async function init_server(port) {
    // Init server
    let server = createServer();
    let io = new Server(server);
    let c_socket, s_socket
    await new Promise((res) => {
        server.listen(port, () => {
            // Init client
            c_socket = new Client(`http://localhost:${port}`);
            io.on("connection", (socket) => {
                s_socket = socket;
            });
            setSocket(c_socket)
            c_socket.on("connect", res)
        })
    })
    return [c_socket, s_socket, io]
}

function delete_server(c_socket, io) {
    io.close()
    c_socket.close()
}


// Utilities
async function wait() {
    await new Promise(r => setTimeout(r, 100))
}


module.exports = {
    init_server,
    delete_server,
    send_peer_signal,
    rev_peer_signal,
    wait
}
