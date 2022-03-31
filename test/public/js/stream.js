
const WS_ENDPOINT = "ws://127.0.0.1:3000"
const socket = io(WS_ENDPOINT)

const pcs = {}


export async function createHost(stream) {
    socket.emit("stream_start")
    socket.on("stream_accepted", (id) => {
        let pc = new SimplePeer({ initiator: true, stream: stream })
        pc.on("signal", data => {
            socket.emit("data_send", id, data)
        })
        pcs[id] = pc
    })
    socket.on("data_receive", (id, data) => {
        let pc = pcs[id]
        pc.signal(data)
    })
}


export async function createClient(callback) {
    socket.emit("client_ready")
    socket.on("stream_receive", (id) => {
        let pc = new SimplePeer()
        pc.on("signal", data => {
            socket.emit("data_send", id, data)
        })
        pc.on("stream", stream => {
            callback(stream)
        })
        socket.emit("stream_accept", id)
        pcs[id] = pc
    })
    socket.on("data_receive", (id, data) => {
        let pc = pcs[id]
        pc.signal(data)
    })
}